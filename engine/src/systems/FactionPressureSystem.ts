// FactionPressureSystem — six meters, tagged-case resolution, coupling,
// decay, threshold retaliation/tests, reward/penalty queries.
// SYSTEM_SKELETON.md §7.

import {
  COMPLY_DELTA,
  ESCALATE_DELTA,
  EXTREME_THRESHOLD,
  FACTION_MAX,
  FACTION_MIN,
  FACTION_TEST_COOLDOWN_DAYS,
  JGC_BATCH_BONUS,
  MEC_MONTHLY_BONUS,
  PENALTY_THRESHOLD,
  REFUSE_DELTA,
  REFUSE_ESCALATION_CAP,
  REFUSE_ESCALATION_STEP,
  REWARD_THRESHOLD,
  TEST_FAIL,
  TEST_MULT,
  clamp,
} from '../constants';
import { EventBus, GameEventType } from '../events/EventBus';
import { Rng } from '../rng/RNGManager';
import { ALL_FACTIONS, Case, Decision, FactionId } from '../types';
import { PlayerStateSystem } from './PlayerStateSystem';

const RIVALS: Record<FactionId, FactionId[]> = {
  [FactionId.MEC]: [FactionId.COMBINE, FactionId.RC],
  [FactionId.CEC]: [FactionId.COMBINE],
  [FactionId.RC]: [FactionId.MEC],
  [FactionId.COMBINE]: [FactionId.CEC, FactionId.MEC],
  [FactionId.JGC]: [FactionId.SMC],
  [FactionId.SMC]: [FactionId.JGC],
};

interface ScheduledRetaliation {
  faction: FactionId;
  fireDay: number;
}

export class FactionPressureSystem {
  private lastTestDay: Record<FactionId, number>;
  private pendingRetaliations: ScheduledRetaliation[] = [];
  /** factions owed a test-case injection on the next queue generation */
  pendingTests: Set<FactionId> = new Set();
  /** one-shot retaliation effects consumed by other systems */
  forcedDetainPending = false;
  framedCasesPending = 0;
  private lastMecBonusDay = 0;
  /** consecutive refusals per faction — repeated refusal escalates the delta */
  private refusalStreak: Record<FactionId, number>;

  constructor(
    private bus: EventBus,
    private players: PlayerStateSystem,
  ) {
    this.lastTestDay = Object.fromEntries(
      ALL_FACTIONS.map((f) => [f, -999]),
    ) as Record<FactionId, number>;
    this.refusalStreak = Object.fromEntries(
      ALL_FACTIONS.map((f) => [f, 0]),
    ) as Record<FactionId, number>;
  }

  rep(f: FactionId): number {
    return this.players.player.factionRep[f];
  }

  private apply(f: FactionId, delta: number): void {
    const before = this.players.player.factionRep[f];
    const after = clamp(before + delta, FACTION_MIN, FACTION_MAX);
    this.players.player.factionRep[f] = after;
    this.bus.publish(GameEventType.FACTION_DELTA, { faction: f, delta, rep: after });
  }

  // ---- tagged case resolution (called from WorkDeskSystem via CASE_CLOSED path) ----

  onTaggedResolved(c: Case, d: Decision): void {
    if (!c.taggedBy) throw new Error('onTaggedResolved: case is not tagged');
    const f = c.taggedBy;
    const complied = c.requestedOutcome !== null && d === c.requestedOutcome;

    let delta: number;
    if (c.isTestCase) {
      delta = complied ? COMPLY_DELTA * TEST_MULT : TEST_FAIL;
      this.refusalStreak[f] = 0;
    } else if (complied) {
      delta = COMPLY_DELTA;
      this.refusalStreak[f] = 0;
    } else if (d === Decision.ESCALATE) {
      delta = ESCALATE_DELTA; // half-magnitude refusal; streak unchanged
    } else {
      // consecutive refusals escalate: -6, -8, -10, capped at -12
      delta = Math.max(
        REFUSE_ESCALATION_CAP,
        REFUSE_DELTA - REFUSE_ESCALATION_STEP * this.refusalStreak[f],
      );
      this.refusalStreak[f]++;
    }
    this.apply(f, delta);

    // coupling: compliance costs rivals
    if (complied && delta > 0) {
      const rivalHit = -Math.ceil(delta / 2);
      for (const r of RIVALS[f]) this.apply(r, rivalHit);
    }

    // per-faction immediate rewards on comply
    if (complied && f === FactionId.JGC) {
      this.players.credit(JGC_BATCH_BONUS, 'JGC-batch');
    }
    if (complied && f === FactionId.SMC) {
      this.players.player.fatigueRecoveryBonusDays = 3;
    }
  }

  // ---- day-end pipeline ----

  /** Step 5: all meters drift 1 point toward 0. */
  dailyDecay(): void {
    for (const f of ALL_FACTIONS) {
      const rep = this.players.player.factionRep[f];
      if (rep !== 0) this.players.player.factionRep[f] = rep - Math.sign(rep);
    }
  }

  /** Step 6: queue retaliations / tests at the extremes. */
  checkThresholds(dayIndex: number, rng: Rng): void {
    for (const f of ALL_FACTIONS) {
      const rep = this.rep(f);
      const cooldownOk = dayIndex - this.lastTestDay[f] >= FACTION_TEST_COOLDOWN_DAYS;
      if (rep <= -EXTREME_THRESHOLD && cooldownOk) {
        this.lastTestDay[f] = dayIndex;
        this.pendingRetaliations.push({ faction: f, fireDay: dayIndex + rng.range(1, 3) });
        this.bus.publish(GameEventType.FACTION_THRESHOLD, { faction: f, kind: 'RETALIATION_QUEUED' });
      } else if (rep >= EXTREME_THRESHOLD && cooldownOk) {
        this.lastTestDay[f] = dayIndex;
        this.pendingTests.add(f);
        this.bus.publish(GameEventType.FACTION_THRESHOLD, { faction: f, kind: 'TEST_QUEUED' });
      }
    }
    // MEC monthly bonus while reward active
    if (this.rewardActive(FactionId.MEC) && dayIndex - this.lastMecBonusDay >= 30) {
      this.lastMecBonusDay = dayIndex;
      this.players.credit(MEC_MONTHLY_BONUS, 'MEC-monthly');
    }
  }

  /** Fire any retaliations due today (called at WAKE). */
  fireDueRetaliations(dayIndex: number): FactionId[] {
    const due = this.pendingRetaliations.filter((r) => r.fireDay <= dayIndex);
    this.pendingRetaliations = this.pendingRetaliations.filter((r) => r.fireDay > dayIndex);
    for (const r of due) {
      this.executeRetaliation(r.faction);
      this.bus.publish(GameEventType.FACTION_RETALIATION, { faction: r.faction });
    }
    return due.map((r) => r.faction);
  }

  private executeRetaliation(f: FactionId): void {
    const p = this.players.player;
    switch (f) {
      case FactionId.CEC:
        this.forcedDetainPending = true; // consumed by GameLoop: morning detained
        break;
      case FactionId.JGC:
        this.framedCasesPending = 3; // consumed by CaseGenerator
        break;
      case FactionId.MEC:
        this.players.fine(75, 'MEC-audit-costs'); // triple audit-cost hit
        break;
      case FactionId.RC:
        // query crawl for a day is expressed via penaltyActive(RC) already at <=-40;
        // retaliation adds a standing hit from council complaint
        this.players.addStanding(-5);
        break;
      case FactionId.COMBINE:
        p.filterPct = Math.max(0, p.filterPct - 40);
        this.bus.publish(GameEventType.POD_INCIDENT, { faction: f, kind: 'FILTER_SABOTAGE' });
        break;
      case FactionId.SMC:
        break; // SMC has no penalty column
    }
  }

  // ---- reward/penalty state queries (consumed by other systems) ----

  rewardActive(f: FactionId): boolean {
    return this.rep(f) >= REWARD_THRESHOLD;
  }

  penaltyActive(f: FactionId): boolean {
    if (f === FactionId.SMC) return false; // SMC never penalizes
    return this.rep(f) <= PENALTY_THRESHOLD;
  }

  /** CEC override of commute checkpoint probability; null = no override. */
  checkpointProbabilityOverride(): number | null {
    if (this.rewardActive(FactionId.CEC)) return 0;
    if (this.penaltyActive(FactionId.CEC)) return 1;
    return null;
  }

  /** RC penalty: DB query time multiplier source. */
  queryTimePenaltyActive(): boolean {
    return this.penaltyActive(FactionId.RC);
  }

  /** RC reward: assistant auto-verifies one field per case. */
  assistantActive(): boolean {
    return this.rewardActive(FactionId.RC);
  }

  /** MEC penalty: their auditors — spot-audit probability doubles, audit lag -1. */
  mecAuditPressure(): boolean {
    return this.penaltyActive(FactionId.MEC);
  }

  /** COMBINE reward: gray market unlocked. */
  grayMarketUnlocked(): boolean {
    return this.rewardActive(FactionId.COMBINE);
  }

  /** COMBINE penalty: random pod incident probability per day. */
  podIncidentProbability(): number {
    return this.penaltyActive(FactionId.COMBINE) ? 0.15 : 0;
  }

  /** MEC reward: sky-lane fare multiplier. */
  skyLaneFareMultiplier(): number {
    return this.rewardActive(FactionId.MEC) ? 0.67 : 1;
  }

  /** Checkpoint confiscation: the goods were COMBINE's — they notice. */
  onContrabandConfiscated(): void {
    this.apply(FactionId.COMBINE, -5);
  }

  /** A refused bribe goes in the officer's report. */
  onFailedBribe(): void {
    this.apply(FactionId.CEC, -5);
  }
}
