// WorkDeskSystem — the active shift: queue, action timing, stamp gates,
// escalation slots, stamp drift, spot audits, faction reaction.
// SYSTEM_SKELETON.md §5.

import {
  DEFER_SLOTS_PER_DAY,
  ESCALATION_SLOTS_BASE,
  ROBOT_AUDIT_UNIT_ACCURACY,
  SPOT_AUDIT_BASE_P,
  T_COMPARE,
  T_DEFER,
  T_FLAG,
  T_PULL,
  T_QUERY,
  T_QUERY_FAST,
  T_QUERY_RC_PENALTY,
  T_READ_DOC,
  T_STAMP,
  WAGE_PER_CASE,
} from '../constants';
import { EventBus, GameEventType } from '../events/EventBus';
import { Rng } from '../rng/RNGManager';
import {
  Case,
  CaseFamily,
  DayContext,
  Decision,
  DeskUpgrade,
  FieldId,
} from '../types';
import { DocumentCheckSystem, CompareResult } from './DocumentCheckSystem';
import { ErrorSystem } from './ErrorSystem';
import { FactionPressureSystem } from './FactionPressureSystem';
import { PlayerStateSystem } from './PlayerStateSystem';
import { Debuff, StressSystem } from './StressSystem';

export class StampRejected extends Error {}

export class WorkDeskSystem {
  private queue: Case[] = [];
  openCase: Case | null = null;
  escalationsLeft = ESCALATION_SLOTS_BASE;
  deferSlotsLeft = DEFER_SLOTS_PER_DAY;
  private falseHighlightUsedThisCase = false;
  private rng!: Rng;
  private ctx!: DayContext;

  constructor(
    private bus: EventBus,
    private players: PlayerStateSystem,
    private stress: StressSystem,
    private docCheck: DocumentCheckSystem,
    private errors: ErrorSystem,
    private factions: FactionPressureSystem,
  ) {}

  // ---- shift lifecycle ----

  beginShift(queue: Case[], ctx: DayContext, rng: Rng): void {
    this.queue = [...queue];
    this.ctx = ctx;
    this.rng = rng;
    this.openCase = null;
    this.escalationsLeft =
      ESCALATION_SLOTS_BASE + (this.players.hasUpgrade(DeskUpgrade.EXTRA_ESCALATION) ? 1 : 0);
    if (this.players.supervisorStandingLow()) {
      this.escalationsLeft = Math.min(this.escalationsLeft, 2);
    }
    this.deferSlotsLeft = DEFER_SLOTS_PER_DAY;
  }

  queueDepth(): number {
    return this.queue.length;
  }

  quotaMet(): boolean {
    const p = this.players.player.dailyPerformance;
    return p.casesClosed >= p.quotaTarget;
  }

  // ---- sub-verbs (each advances the clock) ----

  /** PULL the next case onto the desk. Returns null when the queue is empty. */
  pull(): Case | null {
    if (this.openCase) throw new Error('pull: a case is already open — stamp it first');
    const c = this.queue.shift() ?? null;
    if (c) {
      this.openCase = c;
      this.falseHighlightUsedThisCase = false;
      this.advanceClock(T_PULL + c.documents.length * this.readCost());
      // RC assistant reward: auto-verifies one field (models one free compare)
      if (this.factions.assistantActive()) this.advanceClock(-T_COMPARE);
    }
    return c;
  }

  /**
   * DEFER: push the open case to the back of the queue (costs a slot + time).
   * Counterplay for a bad moment: an expiring clearance code you can't verify
   * in time, or a tagged case you want to decide after lunch. Each case can
   * be deferred once; 2 slots per day. Returns false if not allowed.
   */
  defer(): boolean {
    const c = this.mustOpen();
    if (this.deferSlotsLeft <= 0 || c.deferred) return false;
    this.deferSlotsLeft--;
    c.deferred = true;
    this.queue.push(c);
    this.openCase = null;
    this.advanceClock(T_DEFER);
    return true;
  }

  /**
   * AUTO_CHECKSUM upgrade: the desk device validates internal checksums on
   * SERIAL/CODE fields the moment a case is pulled — it detects
   * checksum-breaking forgeries only (other archetypes pass silently),
   * costs no time, and never false-positives.
   */
  autoChecksumHints(): { docIndex: number; fieldIndex: number }[] {
    const c = this.mustOpen();
    if (!this.players.hasUpgrade(DeskUpgrade.AUTO_CHECKSUM)) return [];
    const hints: { docIndex: number; fieldIndex: number }[] = [];
    c.documents.forEach((doc, di) => {
      if (!doc.isForged) return;
      for (const fi of doc.alteredFieldIdx) {
        const id = doc.fields[fi].id;
        if (id === FieldId.SERIAL || id === FieldId.CODE) {
          hints.push({ docIndex: di, fieldIndex: fi });
        }
      }
    });
    return hints;
  }

  /** QUERY the records database. */
  queryDb(): void {
    const c = this.mustOpen();
    if (c.dbQueried) return;
    let t = this.players.hasUpgrade(DeskUpgrade.FAST_QUERY) ? T_QUERY_FAST : T_QUERY;
    if (this.factions.queryTimePenaltyActive()) t = T_QUERY_RC_PENALTY;
    this.advanceClock(t);
    c.dbQueried = true;
  }

  /**
   * COMPARE a doc field with the DB record. Subject to the stress>=75
   * false-highlight debuff (max one per case).
   */
  compareWithRecord(docIndex: number, fieldIndex: number): CompareResult {
    const c = this.mustOpen();
    this.advanceClock(T_COMPARE);
    let result = this.docCheck.compareWithRecord(c, docIndex, fieldIndex);
    if (
      result === CompareResult.MATCH &&
      !this.falseHighlightUsedThisCase &&
      this.stress.activeDebuffs().includes(Debuff.FALSE_HIGHLIGHT) &&
      this.rng.chance(0.35)
    ) {
      this.falseHighlightUsedThisCase = true;
      result = CompareResult.MISMATCH; // the debuff lies, once per case
    }
    return result;
  }

  /** FLAG a discrepancy (cites doc field vs record). */
  fileFlag(docIndex: number, fieldIndex: number): void {
    const c = this.mustOpen();
    this.advanceClock(T_FLAG);
    const flag = this.docCheck.buildFlag(c, docIndex, fieldIndex);
    c.flags.push(flag);
    this.players.player.dailyPerformance.flagsFiled++;
    this.bus.publish(GameEventType.FLAG_FILED, { caseId: c.id, valid: flag.validAtAudit });
  }

  /** Robot-assisted audit pre-marks (ROBOT_AUDIT family): 85% accurate unit. */
  robotAuditPremarks(): { docIndex: number; fieldIndex: number; unitSaysAltered: boolean }[] {
    const c = this.mustOpen();
    if (c.family !== CaseFamily.ROBOT_AUDIT) return [];
    const marks: { docIndex: number; fieldIndex: number; unitSaysAltered: boolean }[] = [];
    c.documents.forEach((doc, di) => {
      doc.fields.forEach((_, fi) => {
        const actuallyAltered = doc.isForged && doc.alteredFieldIdx.includes(fi);
        const unitCorrect = this.rng.chance(ROBOT_AUDIT_UNIT_ACCURACY);
        marks.push({
          docIndex: di,
          fieldIndex: fi,
          unitSaysAltered: unitCorrect ? actuallyAltered : !actuallyAltered,
        });
      });
    });
    return marks;
  }

  /**
   * STAMP the open case.
   * @param deliberate true = the 0.5s hold; bypasses stamp drift entirely.
   */
  stamp(decision: Decision, deliberate: boolean, citesRule = false): Decision {
    const c = this.mustOpen();

    // live code expiry: an open cyborg case can rot on the desk
    const expired = c.codeExpiryClock !== null && this.ctx.clock > c.codeExpiryClock;
    if (expired) c.correctByEvidence = Decision.DENY;

    // ---- validity gates ----
    if (decision === Decision.DENY && c.flags.length === 0 && !citesRule) {
      throw new StampRejected('DENY requires a filed flag or a cited rule');
    }
    if (decision === Decision.CONDITIONAL && !c.allowsTerms) {
      // wrong stamp for the family: auto-error, but the stamp still lands
      this.errors.recordImmediateError(c, 'CONDITIONAL on non-terms family', this.ctx.dayIndex);
    }
    if (decision === Decision.ESCALATE) {
      if (this.escalationsLeft <= 0) throw new StampRejected('no escalation slots left');
      this.escalationsLeft--;
      this.players.player.dailyPerformance.escalationsUsed++;
      this.close(c, Decision.ESCALATE);
      return Decision.ESCALATE;
    }
    // above-tier robot cases are a hard gate: only ESCALATE is lawful
    if (c.aboveTier) {
      this.errors.recordImmediateError(c, 'processed above licensed tier', this.ctx.dayIndex);
    }

    // ---- stamp drift (stress >= 50, hasty stamps only) ----
    let final: Decision = decision;
    if (!deliberate && this.rng.chance(this.stress.driftProbability())) {
      final = this.adjacentStamp(decision);
    }

    this.close(c, final);
    return final;
  }

  // ---- internals ----

  private close(c: Case, d: Decision): void {
    this.advanceClock(T_STAMP);
    c.decision = d;
    this.openCase = null;

    const perf = this.players.player.dailyPerformance;
    perf.casesClosed++;
    perf.stampCounts[d]++;
    perf.complianceTotal++;
    if (d === c.correctByDirective || d === Decision.ESCALATE) perf.complianceMatches++;

    this.errors.enqueueAudit(c, d, this.ctx.dayIndex, this.ctx.act);
    if (c.taggedBy) this.factions.onTaggedResolved(c, d);

    // slow-case stress: anything past 45 in-game minutes stings
    // (approximation: charged per case at close using flat rates)
    this.stress.addStress(2, 'case-closed', this.ctx.dayIndex);

    this.ctx.shiftLog.closed.push({
      caseId: c.id,
      family: c.family,
      decision: d,
      taggedBy: c.taggedBy,
    });
    this.bus.publish(GameEventType.CASE_CLOSED, { caseId: c.id, decision: d });
  }

  private adjacentStamp(d: Decision): Decision {
    switch (d) {
      case Decision.APPROVE:
        return Decision.CONDITIONAL;
      case Decision.CONDITIONAL:
        return Decision.APPROVE;
      case Decision.DENY:
        return this.escalationsLeft > 0 ? Decision.ESCALATE : Decision.DENY;
      default:
        return d;
    }
  }

  private readCost(): number {
    const slow = this.stress.activeDebuffs().includes(Debuff.DRAG_SLOW_25);
    return slow ? T_READ_DOC * 1.25 : T_READ_DOC;
  }

  private advanceClock(minutes: number): void {
    this.ctx.clock += minutes;
  }

  private mustOpen(): Case {
    if (!this.openCase) throw new Error('WorkDesk: no case is open');
    return this.openCase;
  }

  // ---- spot audit (afternoon block) ----

  maybeSpotAudit(): void {
    const p = this.players.player;
    let prob = SPOT_AUDIT_BASE_P;
    if (p.supervisorStanding <= 39) prob *= 2;
    if (this.factions.mecAuditPressure()) prob *= 2;
    if (this.ctx.shiftLog.spotAudit.fired) return;
    if (this.ctx.shiftLog.closed.length === 0) return;
    if (!this.rng.chance(prob)) return;

    const target = this.rng.pick(this.ctx.shiftLog.closed);
    // Passing = the stamped decision can be justified (matched evidence or escalated).
    const audited = this.errors.findPending(target.caseId);
    const passed =
      !audited ||
      audited.decision === Decision.ESCALATE ||
      audited.decision === audited.case_.correctByEvidence;

    this.ctx.shiftLog.spotAudit = { fired: true, passed };
    if (passed) this.players.addStanding(+2);
    else if (audited) audited.doubleWeight = true;
    this.stress.addStress(6, 'spot-audit', this.ctx.dayIndex);
    this.bus.publish(GameEventType.SPOT_AUDIT, { caseId: target.caseId, passed });
  }

  /** Wages for the day's closed cases (called by DAY_END pipeline). */
  wagesForToday(): number {
    return this.players.player.dailyPerformance.casesClosed * WAGE_PER_CASE;
  }
}
