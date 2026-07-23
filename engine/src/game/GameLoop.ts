// GameLoop — the 12-state daily loop driver, SYSTEM_SKELETON.md §2.
// States INIT..DAY_END_UPDATE; DayContext is the only inter-state payload;
// DAY_END pipeline runs in the fixed §2.5 order.

import {
  CAMPAIGN_DAYS,
  FILTER_COST,
  FILTER_DECAY_PER_DAY,
  GIG_WAGE,
  LATE_DOCK,
  LUNCH_LEN,
  LUNCH_START,
  OVERTIME_LEN,
  FATIGUE_OVERTIME,
  FATIGUE_PER_BLOCK,
  QUOTA_BONUS,
  SHIFT_END,
  SHIFT_START,
  actOfDay,
  clamp,
} from '../constants';
import { EventBus, GameEventType } from '../events/EventBus';
import { RNGManager, RngStream } from '../rng/RNGManager';
import { Agent } from './Agent';
import { CaseGenerator } from '../systems/CaseGenerator';
import { CheckpointSystem } from '../systems/CheckpointSystem';
import { CommuteSystem } from '../systems/CommuteSystem';
import { DailySummarySystem, SummaryModel } from '../systems/DailySummarySystem';
import { DocumentCheckSystem } from '../systems/DocumentCheckSystem';
import { ErrorSystem } from '../systems/ErrorSystem';
import { FactionPressureSystem } from '../systems/FactionPressureSystem';
import { MortgageSystem } from '../systems/MortgageSystem';
import { PermitSystem } from '../systems/PermitSystem';
import { PlayerStateSystem } from '../systems/PlayerStateSystem';
import { StressSystem } from '../systems/StressSystem';
import { StampRejected, WorkDeskSystem } from '../systems/WorkDeskSystem';
import {
  Case,
  DayContext,
  Decision,
  DeskUpgrade,
  EmploymentState,
  EveningChoice,
  FactionId,
  GameState,
  LunchChoice,
  TripPhase,
  freshDayContext,
} from '../types';

export class GameLoop {
  state: GameState = GameState.INIT;
  ctx: DayContext;
  readonly bus = new EventBus();
  readonly rngMgr: RNGManager;

  // modules
  readonly players: PlayerStateSystem;
  readonly stress: StressSystem;
  readonly mortgage: MortgageSystem;
  readonly permits: PermitSystem;
  readonly factions: FactionPressureSystem;
  readonly docCheck: DocumentCheckSystem;
  readonly errors: ErrorSystem;
  readonly caseGen: CaseGenerator;
  readonly desk: WorkDeskSystem;
  readonly commute: CommuteSystem;
  readonly checkpoint: CheckpointSystem;
  readonly summary: DailySummarySystem;

  private forcedLeaveDays = 0;
  private breakdownToday = false;
  private week = { quotaMetDays: 0, quotaMissedDays: 0, complianceSum: 0, days: 0, tokensAtStart: 0 };

  constructor(
    campaignSeed: number,
    private agent: Agent,
  ) {
    this.rngMgr = new RNGManager(campaignSeed);
    this.players = new PlayerStateSystem(this.bus);
    this.stress = new StressSystem(this.bus, this.players.player);
    this.mortgage = new MortgageSystem(this.bus, this.players);
    this.permits = new PermitSystem(this.bus, this.players);
    this.factions = new FactionPressureSystem(this.bus, this.players);
    this.docCheck = new DocumentCheckSystem();
    this.errors = new ErrorSystem(this.bus, this.players, this.factions);
    this.caseGen = new CaseGenerator(this.rngMgr, this.players, this.factions);
    this.desk = new WorkDeskSystem(
      this.bus,
      this.players,
      this.stress,
      this.docCheck,
      this.errors,
      this.factions,
    );
    this.commute = new CommuteSystem(this.bus, this.players, this.stress, this.permits, this.factions);
    this.checkpoint = new CheckpointSystem(
      this.bus,
      this.players,
      this.stress,
      this.permits,
      this.factions,
      this.errors,
    );
    this.summary = new DailySummarySystem(
      this.bus,
      () => this.players.player,
      this.errors,
      this.mortgage,
    );

    this.bus.subscribe(GameEventType.BREAKDOWN, () => {
      this.breakdownToday = true;
    });
    this.bus.subscribe(GameEventType.BURNOUT, () => {
      this.forcedLeaveDays = 2;
    });

    this.ctx = freshDayContext(1, 1);
    this.transition(GameState.WAKE);
  }

  // ------------------------------------------------------------------
  // Public driver: run one full day. Returns the summary, or null when
  // the campaign is over.
  // ------------------------------------------------------------------

  runDay(): SummaryModel | null {
    if (this.state === GameState.CAMPAIGN_OVER) return null;
    if (this.state !== GameState.WAKE) {
      throw new Error(`runDay must start at WAKE (state=${this.state})`);
    }
    const day = this.ctx.dayIndex;
    this.breakdownToday = false;

    this.doWake();
    if (this.ctx.forcedLeave) {
      // burnout leave / gig day: skip commute & shift entirely
      this.doPodEvents();
      this.doSleep();
      return this.doDayEnd();
    }

    if (!this.ctx.oversleep) this.doPodMaintenance();
    this.doCommute(TripPhase.OUTBOUND);
    this.doShift();
    this.doCommute(TripPhase.RETURN);
    this.doPodEvents();
    this.doSleep();
    return this.doDayEnd();
  }

  // ------------------------------------------------------------------
  // States
  // ------------------------------------------------------------------

  private doWake(): void {
    this.transition(GameState.WAKE);
    const p = this.players.player;
    this.players.resetDaily(this.ctx.act);

    // retaliations scheduled earlier can fire this morning
    this.factions.fireDueRetaliations(this.ctx.dayIndex);
    if (this.factions.forcedDetainPending) {
      this.factions.forcedDetainPending = false;
      this.ctx.halfDayDetained = true; // CEC retaliation: morning gone
    }

    // forced leave (burnout) / gig mode day
    if (this.forcedLeaveDays > 0) {
      this.forcedLeaveDays--;
      this.ctx.forcedLeave = true;
    }
    if (p.employment === EmploymentState.GIG_MODE) {
      this.ctx.forcedLeave = true; // no bank shift; gig payout happens at day end
    }

    this.ctx.wakeTime = this.ctx.oversleep ? 465 : 360; // overslept: 07:45
    this.ctx.clock = this.ctx.wakeTime;

    // filter decay + passive filter stress
    p.filterPct = clamp(p.filterPct - FILTER_DECAY_PER_DAY, 0, p.filterCap);
    if (p.filterPct <= 20) this.stress.addStress(4, 'bad-air', this.ctx.dayIndex);

    this.bus.pump();
  }

  private doPodMaintenance(): void {
    this.transition(GameState.POD_MAINTENANCE);
    const p = this.players.player;
    const d = this.agent.podMaintenance();
    if (d.replaceFilter) {
      const cost = this.factions.grayMarketUnlocked() ? Math.round(FILTER_COST / 2) : FILTER_COST;
      if (this.players.spend(cost, 'filter')) p.filterPct = p.filterCap;
    }
    if (d.payMortgageEarly && this.ctx.dayIndex <= p.mortgage.dueDate) {
      this.mortgage.payNow();
    }
    this.ctx.clock = Math.max(this.ctx.clock, 400); // maintenance takes until ~06:40
    this.bus.pump();
  }

  private doCommute(phase: TripPhase): void {
    this.transition(phase === TripPhase.OUTBOUND ? GameState.COMMUTE : GameState.COMMUTE_BACK);
    if (phase === TripPhase.OUTBOUND && this.ctx.halfDayDetained) {
      // detained at the door: morning block is gone; arrive at lunch
      this.ctx.clock = Math.max(this.ctx.clock, LUNCH_START);
      this.ctx.arrivalTime = this.ctx.clock;
      return;
    }
    const rng = this.rngMgr.stream(
      this.ctx.dayIndex,
      phase === TripPhase.OUTBOUND ? RngStream.COMMUTE_OUT : RngStream.COMMUTE_BACK,
    );
    const route = this.agent.chooseRoute(phase === TripPhase.OUTBOUND);
    const result = this.commute.run(route, phase, this.ctx, rng, this.ctx.act);

    if (result.pendingCheckpoint) {
      this.transition(GameState.CHECKPOINT);
      const cpRng = this.rngMgr.stream(this.ctx.dayIndex, RngStream.CHECKPOINT, phase === TripPhase.OUTBOUND ? 0 : 1);
      this.checkpoint.resolve(result.pendingCheckpoint, this.ctx, cpRng);
      this.transition(phase === TripPhase.OUTBOUND ? GameState.COMMUTE : GameState.COMMUTE_BACK);
    }
    if (phase === TripPhase.OUTBOUND) {
      this.ctx.arrivalTime = this.ctx.clock;
      const late = Math.max(0, this.ctx.arrivalTime - SHIFT_START);
      this.players.player.dailyPerformance.lateMinutes = late;
    }
    this.bus.pump();
  }

  private doShift(): void {
    // detained half-day: skip morning block
    const morningLost =
      this.ctx.halfDayDetained || this.ctx.arrivalTime >= SHIFT_START + 90;

    const queue = this.caseGen.generateQueue(this.ctx.dayIndex, this.ctx.act);
    const deskRng = this.rngMgr.stream(this.ctx.dayIndex, RngStream.EVENTS);
    this.desk.beginShift(queue, this.ctx, deskRng);
    this.ctx.clock = Math.max(this.ctx.clock, SHIFT_START);

    // ---- morning block ----
    this.transition(GameState.WORK_SHIFT);
    if (!morningLost) {
      this.workBlock(LUNCH_START);
      this.stress.addFatigue(FATIGUE_PER_BLOCK);
    } else {
      this.ctx.clock = Math.max(this.ctx.clock, LUNCH_START);
    }

    // ---- lunch ----
    this.transition(GameState.BREAK);
    const lunch = this.agent.chooseLunch();
    this.ctx.lunchChoice = lunch;
    switch (lunch) {
      case LunchChoice.EAT:
        this.stress.relieveStress(6);
        this.ctx.clock += LUNCH_LEN;
        break;
      case LunchChoice.WORK_THROUGH:
        this.stress.addStress(5, 'no-lunch', this.ctx.dayIndex);
        break; // no time cost — the half hour is worked
      case LunchChoice.SOCIALIZE:
        this.stress.relieveStress(3);
        this.stress.addFatigue(-3);
        this.ctx.clock += LUNCH_LEN;
        break;
    }

    // ---- afternoon block ----
    this.transition(GameState.WORK_SHIFT_2);
    if (!this.breakdownToday) {
      this.workBlock(SHIFT_END);
      this.stress.addFatigue(FATIGUE_PER_BLOCK);
      this.desk.maybeSpotAudit();

      // overtime
      const perf = this.players.player.dailyPerformance;
      const behind = perf.quotaTarget - perf.casesClosed;
      if (behind > 0 && !this.breakdownToday && this.agent.takeOvertime(behind)) {
        this.ctx.shiftLog.overtimeTaken = true;
        this.stress.addFatigue(FATIGUE_OVERTIME);
        this.stress.addStress(5, 'overtime', this.ctx.dayIndex);
        this.workBlock(SHIFT_END + OVERTIME_LEN);
      }
    }
    if (this.breakdownToday) {
      this.ctx.shiftLog.breakdownFired = true;
      this.stress.applyBreakdownReset();
      this.players.addStanding(-10);
    }
    this.bus.pump();
  }

  /** Run desk cases until the clock hits blockEnd, quota+buffer done, or breakdown. */
  private workBlock(blockEnd: number): void {
    while (this.ctx.clock < blockEnd && !this.breakdownToday) {
      const c = this.desk.pull();
      if (!c) break; // queue exhausted — early clock-out rule
      let attempted: Decision;
      try {
        attempted = this.agent.workCase(this.desk, c);
      } catch (err) {
        if (err instanceof StampRejected) {
          // agent made an illegal stamp; force a lawful fallback
          try {
            this.desk.stamp(Decision.ESCALATE, true);
          } catch {
            this.desk.stamp(Decision.APPROVE, true); // slots gone: approve is always legal
          }
        } else {
          throw err;
        }
      }
      this.bus.pump(); // deliver CASE_CLOSED handlers (incl. breakdown check)
    }
  }

  private doPodEvents(): void {
    this.transition(GameState.POD_EVENTS);
    const p = this.players.player;
    const rng = this.rngMgr.stream(this.ctx.dayIndex, RngStream.EVENTS, 99);

    // COMBINE penalty: random pod incident
    if (rng.chance(this.factions.podIncidentProbability())) {
      if (rng.chance(0.5)) p.filterPct = Math.max(0, p.filterPct - 20);
      else this.players.fine(30, 'pod-incident');
      this.bus.publish(GameEventType.POD_INCIDENT, { kind: 'COMBINE_PRESSURE' });
    }

    const choice = this.agent.chooseEvening();
    this.ctx.eveningChoice = choice;
    switch (choice) {
      case EveningChoice.REST:
        this.stress.relieveStress(15);
        break;
      case EveningChoice.HALLWAY:
        this.stress.relieveStress(8);
        break;
      case EveningChoice.SIDE_GIG:
        this.players.credit(25, 'side-gig');
        this.stress.addFatigue(10);
        break;
      case EveningChoice.STUDY_RULES:
        this.players.addStanding(1);
        break;
    }
    this.bus.pump();
  }

  private doSleep(): void {
    this.transition(GameState.SLEEP);
    const p = this.players.player;
    const rng = this.rngMgr.stream(this.ctx.dayIndex, RngStream.SLEEP);
    const noise = rng.range(0, 20);
    let quality = 50 + p.filterPct / 2 - noise;
    if (p.utilitiesRationed) quality -= 20;
    if (p.relocated) quality -= 10;
    this.ctx.sleepQuality = Math.round(clamp(quality, 0, 100));

    // collapse check happens at sleep; sets tomorrow's oversleep
    const collapsed = this.stress.checkCollapseAtSleep(this.ctx.dayIndex);
    if (collapsed) {
      const f = rng.pick(Object.values(FactionId));
      this.players.setFactionRep(f, this.players.player.factionRep[f] - 10);
    }
    this.nextDayOversleep = collapsed;
    this.bus.pump();
  }

  private nextDayOversleep = false;

  private doDayEnd(): SummaryModel {
    this.transition(GameState.DAY_END_UPDATE);
    const ctx = this.ctx;
    const p = this.players.player;
    const day = ctx.dayIndex;

    // 1-2. audits & token expiry
    const notices = this.errors.resolveAudits(day);
    ctx.notices.push(...notices);
    this.errors.expireTokens(day);
    this.errors.applyThresholds(day);

    // 3. wages
    let wages = 0;
    if (p.employment === EmploymentState.GIG_MODE) {
      wages = GIG_WAGE;
    } else if (!ctx.forcedLeave) {
      wages = this.desk.wagesForToday();
      const perf = p.dailyPerformance;
      if (perf.casesClosed >= perf.quotaTarget) wages += QUOTA_BONUS;
      if (perf.lateMinutes > 0) wages -= LATE_DOCK;
      if (ctx.shiftLog.overtimeTaken) {
        /* overtime cases already paid per-case */
      }
      if (p.supervisorStanding <= 15) wages = Math.round(wages * 0.8); // demotion wage cut
      wages = Math.max(0, wages);
    }
    p.dailyPerformance.wagesEarned = wages;
    if (wages > 0) this.players.credit(wages, 'wages');

    // 3b. weekly supervisor review (every 5th day) — standing + upgrade grants
    if (!ctx.forcedLeave) {
      const perf = p.dailyPerformance;
      this.week.days++;
      if (perf.casesClosed >= perf.quotaTarget) this.week.quotaMetDays++;
      else this.week.quotaMissedDays++;
      this.week.complianceSum +=
        perf.complianceTotal === 0 ? 100 : (100 * perf.complianceMatches) / perf.complianceTotal;
    }
    if (day % 5 === 0 && this.week.days > 0) {
      let delta = this.week.quotaMetDays >= 3 ? +5 : -5;
      if (this.week.complianceSum / this.week.days >= 90) delta += 2;
      const tokensGained = Math.max(0, this.errors.tokenCount() - this.week.tokensAtStart);
      delta -= Math.min(10, tokensGained * 2);
      this.players.addStanding(delta);
      ctx.notices.push({ kind: 'REVIEW', text: `Weekly review: standing ${delta >= 0 ? '+' : ''}${delta}` });

      if (p.supervisorStanding >= 75) {
        const order = [
          DeskUpgrade.FAST_QUERY,
          DeskUpgrade.THIRD_PANE,
          DeskUpgrade.EXTRA_ESCALATION,
          DeskUpgrade.AUTO_CHECKSUM,
        ];
        const next = order.find((u) => !this.players.hasUpgrade(u));
        if (next) {
          this.players.grantUpgrade(next);
          ctx.notices.push({ kind: 'UPGRADE', text: `Desk upgrade granted: ${next}` });
        }
      }
      this.week = {
        quotaMetDays: 0,
        quotaMissedDays: 0,
        complianceSum: 0,
        days: 0,
        tokensAtStart: this.errors.tokenCount(),
      };
    }

    // 4. mortgage
    this.mortgage.dailyCheck(day);

    // 5-6. faction decay & thresholds
    this.factions.dailyDecay();
    this.factions.checkThresholds(day, this.rngMgr.stream(day, RngStream.EVENTS, 7));

    // 7. overnight recovery
    this.stress.overnightRecovery(ctx.sleepQuality);

    // 8. permits
    this.permits.tickExpiry();

    // 9. summary
    const model = this.summary.compose(ctx);

    // 10. autosave point (serialization hook — content out of scope here)
    this.bus.pump();

    // advance or end
    if (day >= CAMPAIGN_DAYS) {
      this.transition(GameState.CAMPAIGN_OVER);
    } else {
      const nextDay = day + 1;
      this.ctx = freshDayContext(nextDay, actOfDay(nextDay));
      this.ctx.oversleep = this.nextDayOversleep;
      this.nextDayOversleep = false;
      this.transition(GameState.WAKE);
    }
    return model;
  }

  // ------------------------------------------------------------------

  private transition(next: GameState): void {
    if (next === this.state) return;
    this.bus.publish(GameEventType.STATE_EXIT, { state: this.state });
    this.state = next;
    this.bus.publish(GameEventType.STATE_ENTER, { state: next });
  }
}
