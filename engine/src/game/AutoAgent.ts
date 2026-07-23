// AutoAgent — a headless "competent clerk" used by the simulation harness.
// It plays through the same public API a UI would use: query, compare,
// flag, stamp. It has policies, not omniscience — it never reads
// generation-truth fields.

import { Rng } from '../rng/RNGManager';
import { CompareResult } from '../systems/DocumentCheckSystem';
import { WorkDeskSystem } from '../systems/WorkDeskSystem';
import {
  Case,
  CaseFamily,
  Decision,
  EveningChoice,
  LunchChoice,
  RouteId,
} from '../types';
import { Agent, PodDecisions } from './Agent';

export interface AgentPolicy {
  /** probability of following the evidence on a conflict-looking case */
  evidenceBias: number;
  /** probability of complying with a faction tag's implied ask */
  factionComplianceBias: number;
  preferredRoute: RouteId;
  filterReplaceAt: number; // replace filter below this %
  overtimeWhenBehind: boolean;
}

export const DEFAULT_POLICY: AgentPolicy = {
  evidenceBias: 0.75,
  factionComplianceBias: 0.4,
  preferredRoute: RouteId.AIR_BUS,
  filterReplaceAt: 30,
  overtimeWhenBehind: true,
};

const FINANCIAL_FAMILIES = new Set([
  CaseFamily.MORTGAGE_RENEWAL,
  CaseFamily.DELINQUENCY,
  CaseFamily.RESTRUCTURING,
  CaseFamily.FORECLOSURE,
]);

export class AutoAgent implements Agent {
  constructor(
    private rng: Rng,
    private policy: AgentPolicy = DEFAULT_POLICY,
    private getWallet: () => number = () => 999,
    private getStress: () => number = () => 0,
    private getFilter: () => number = () => 100,
    private getQuota: () => number = () => 8,
  ) {}

  podMaintenance(): PodDecisions {
    return {
      replaceFilter: this.getFilter() < this.policy.filterReplaceAt && this.getWallet() > 150,
      payMortgageEarly: false,
    };
  }

  chooseRoute(outbound: boolean): RouteId {
    // poor days: walk. comfortable days: preferred route.
    if (this.getWallet() < 20) return RouteId.WALKWAY;
    return this.policy.preferredRoute;
  }

  chooseLunch(): LunchChoice {
    return this.getStress() > 60 ? LunchChoice.EAT : LunchChoice.SOCIALIZE;
  }

  workCase(desk: WorkDeskSystem, c: Case): Decision {
    // Verification depth scales with quota pressure — the "veteran pattern
    // literacy" curve: act I audits everything, act III spot-checks.
    const quota = this.getQuota();
    const fieldsPerDoc = quota <= 8 ? 99 : quota <= 11 ? 2 : 1;
    const shouldQuery = FINANCIAL_FAMILIES.has(c.family) || quota <= 11;

    // 1. Query the record when the family (or the pace) warrants it.
    if (shouldQuery) desk.queryDb();

    // 2. Compare checkable fields against the record, up to the depth budget.
    let mismatches: { doc: number; field: number }[] = [];
    if (c.dbQueried) {
      c.documents.forEach((doc, di) => {
        let checked = 0;
        doc.fields.forEach((f, fi) => {
          if (!f.checkable || checked >= fieldsPerDoc) return;
          checked++;
          const result = desk.compareWithRecord(di, fi);
          if (result === CompareResult.MISMATCH) mismatches.push({ doc: di, field: fi });
        });
      });
    }

    // 3. Flag the first two mismatches (citing evidence for a DENY).
    for (const m of mismatches.slice(0, 2)) desk.fileFlag(m.doc, m.field);

    // 4. Decide.
    const deliberate = this.getStress() >= 50 && this.rng.chance(0.7); // usually remembers to hold
    let intended: Decision = this.decide(desk, c, mismatches.length > 0);
    try {
      return desk.stamp(intended, deliberate, /*citesRule*/ mismatches.length === 0);
    } catch {
      // gate rejected (e.g. no escalation slots): lawful fallback
      return desk.stamp(
        intended === Decision.DENY ? Decision.DENY : Decision.APPROVE,
        true,
        true,
      );
    }
  }

  private decide(desk: WorkDeskSystem, c: Case, sawMismatch: boolean): Decision {
    // faction-tagged cases: sometimes comply with the obvious ask
    if (c.taggedBy && this.rng.chance(this.policy.factionComplianceBias)) {
      // the visible seal implies the ask by family convention
      if (c.family === CaseFamily.RESTRUCTURING) return Decision.DENY;
      return sawMismatch ? Decision.APPROVE : Decision.APPROVE;
    }

    if (sawMismatch) return Decision.DENY;

    // family heuristics mirroring the public rulebook; the record is only
    // usable if it was actually queried this case
    if (!c.dbQueried) return Decision.APPROVE; // fast lane: stamp and pray
    switch (c.family) {
      case CaseFamily.MORTGAGE_RENEWAL:
        return c.dbRecord.income < 900 ? Decision.CONDITIONAL : Decision.APPROVE;
      case CaseFamily.DELINQUENCY:
        return c.dbRecord.missedPayments >= 3 ? Decision.DENY : Decision.APPROVE;
      case CaseFamily.RESTRUCTURING:
        return c.dbRecord.missedPayments >= 4 ? Decision.DENY : Decision.CONDITIONAL;
      case CaseFamily.FORECLOSURE:
        return c.dbRecord.missedPayments >= 4 ? Decision.APPROVE : Decision.DENY;
      case CaseFamily.CASTE_CLASSIFICATION:
        return Decision.ESCALATE; // tier risk: pass the buck when possible
      default:
        return Decision.APPROVE;
    }
  }

  takeOvertime(behindBy: number): boolean {
    return this.policy.overtimeWhenBehind && behindBy <= 3 && this.getStress() < 80;
  }

  chooseEvening(): EveningChoice {
    if (this.getStress() > 55) return EveningChoice.REST;
    if (this.getWallet() < 100) return EveningChoice.SIDE_GIG;
    return EveningChoice.HALLWAY;
  }
}
