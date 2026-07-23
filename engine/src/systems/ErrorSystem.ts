// ErrorSystem — audit-lag pipeline, error token ledger, employment thresholds.
// SYSTEM_SKELETON.md §3.2 + §8.6.

import {
  AUDIT_LAG_DAYS,
  GIG_REHIRE_DAYS,
  PERFORMANCE_PLAN_DAYS,
  THRESH_DEMOTION,
  THRESH_PROBATION,
  THRESH_TERMINATION,
  THRESH_WARNING,
  TOKEN_EXPIRY_DAYS,
} from '../constants';
import { EventBus, GameEventType } from '../events/EventBus';
import {
  Case,
  CaseFamily,
  Decision,
  EmploymentState,
  ErrorToken,
  Notice,
  PendingAudit,
} from '../types';
import { FactionPressureSystem } from './FactionPressureSystem';
import { PlayerStateSystem } from './PlayerStateSystem';

export class ErrorSystem {
  private auditQueue: PendingAudit[] = [];
  private tokens: ErrorToken[] = [];
  private lastThresholdFired = 0;

  constructor(
    private bus: EventBus,
    private players: PlayerStateSystem,
    private factions: FactionPressureSystem,
  ) {}

  tokenCount(): number {
    return this.tokens.reduce((s, t) => s + t.weight, 0);
  }

  enqueueAudit(c: Case, d: Decision, filedDay: number, act: 1 | 2 | 3): void {
    let lag: number = AUDIT_LAG_DAYS[act - 1];
    if (this.factions.mecAuditPressure()) lag = Math.max(1, lag - 1);
    this.auditQueue.push({
      case_: c,
      decision: d,
      filedDay,
      resolveDay: filedDay + lag,
      doubleWeight: false,
    });
  }

  findPending(caseId: string): PendingAudit | undefined {
    return this.auditQueue.find((a) => a.case_.id === caseId);
  }

  /** Immediate errors bypass the lag (procedural violations at the desk). */
  recordImmediateError(c: Case, reason: string, dayIndex: number): void {
    this.addToken(c.id, dayIndex, 1);
    this.bus.publish(GameEventType.AUDIT_RESULT, {
      caseId: c.id,
      error: true,
      immediate: true,
      reason,
    });
  }

  /** DAY_END step 1: grade everything due today. Returns notices for WAKE. */
  resolveAudits(today: number): Notice[] {
    const due = this.auditQueue.filter((a) => a.resolveDay <= today);
    this.auditQueue = this.auditQueue.filter((a) => a.resolveDay > today);
    const notices: Notice[] = [];

    for (const a of due) {
      const c = a.case_;
      // ESCALATE carries no accuracy risk
      const accuracyError =
        a.decision !== Decision.ESCALATE && a.decision !== c.correctByEvidence;
      // JGC frame: approving a framed case always costs a token
      const framedHit = c.isFramed && a.decision === Decision.APPROVE;

      if (accuracyError || framedHit) {
        const weight =
          (c.family === CaseFamily.DELINQUENCY ? 2 : 1) * (a.doubleWeight ? 2 : 1);
        this.addToken(c.id, today, weight);
        notices.push({
          kind: 'DISCREPANCY',
          text: `Case ${c.id}: decision ${a.decision} graded incorrect (+${weight} token)`,
        });
      }

      // correct flags claw tokens back (one per valid flag, lag-safe flags weight 0)
      const validFlags = c.flags.filter((f) => f.validAtAudit && !f.lagSafe).length;
      for (let i = 0; i < validFlags && this.tokens.length > 0; i++) {
        if (accuracyError || framedHit) break; // no claw-back on a bad decision
        this.tokens.pop();
        notices.push({ kind: 'COMMENDATION', text: `Case ${c.id}: valid flag (-1 token)` });
      }

      this.bus.publish(GameEventType.AUDIT_RESULT, {
        caseId: c.id,
        error: accuracyError || framedHit,
        immediate: false,
      });
    }
    return notices;
  }

  /** DAY_END step 2: expire old tokens. */
  expireTokens(today: number): void {
    this.tokens = this.tokens.filter((t) => t.expiresDay > today);
  }

  /** Threshold ladder — checked after audits resolve. */
  applyThresholds(today: number): void {
    const count = this.tokenCount();
    const p = this.players.player;

    if (count >= THRESH_TERMINATION && p.employment !== EmploymentState.GIG_MODE) {
      if (p.employment !== EmploymentState.PERFORMANCE_PLAN) {
        this.players.setEmployment(EmploymentState.PERFORMANCE_PLAN, PERFORMANCE_PLAN_DAYS);
        this.emitThreshold('PERFORMANCE_PLAN', count);
      }
    } else if (count >= THRESH_DEMOTION && this.lastThresholdFired < THRESH_DEMOTION) {
      this.players.addStanding(-15);
      this.emitThreshold('DEMOTION', count); // wage cut applied in wage calc via standing
    } else if (count >= THRESH_PROBATION && this.lastThresholdFired < THRESH_PROBATION) {
      this.players.setEmployment(EmploymentState.PROBATION, 0);
      this.emitThreshold('PROBATION', count);
    } else if (count >= THRESH_WARNING && this.lastThresholdFired < THRESH_WARNING) {
      this.players.addStanding(-10);
      this.emitThreshold('WARNING', count);
    }
    this.lastThresholdFired = Math.max(
      this.lastThresholdFired,
      count >= THRESH_WARNING ? count : 0,
    );
    if (count < THRESH_WARNING) this.lastThresholdFired = 0; // ladder resets as tokens expire

    // performance plan countdown / failure
    if (p.employment === EmploymentState.PERFORMANCE_PLAN) {
      p.employmentCounter--;
      const newTokenToday = this.tokens.some((t) => t.issuedDay === today);
      if (newTokenToday) {
        this.players.setEmployment(EmploymentState.GIG_MODE, GIG_REHIRE_DAYS);
        this.emitThreshold('TERMINATED', count);
      } else if (p.employmentCounter <= 0) {
        this.players.setEmployment(EmploymentState.EMPLOYED, 0);
      }
    }
    // probation lifts when back under the line
    if (p.employment === EmploymentState.PROBATION && count < THRESH_PROBATION) {
      this.players.setEmployment(EmploymentState.EMPLOYED, 0);
    }
    // gig-mode rehire clock
    if (p.employment === EmploymentState.GIG_MODE) {
      p.employmentCounter--;
      if (p.employmentCounter <= 0) {
        this.tokens = [];
        this.players.setEmployment(EmploymentState.EMPLOYED, 0);
        p.supervisorStanding = 40;
      }
    }
  }

  private addToken(caseId: string, day: number, weight: number): void {
    this.tokens.push({
      issuedDay: day,
      expiresDay: day + TOKEN_EXPIRY_DAYS,
      weight,
      caseId,
    });
  }

  private emitThreshold(level: string, count: number): void {
    this.bus.publish(GameEventType.TOKEN_THRESHOLD, { level, count });
  }
}
