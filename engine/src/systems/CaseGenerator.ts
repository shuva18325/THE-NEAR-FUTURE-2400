// CaseGenerator — daily queue generation with generation-time truth.
// SYSTEM_SKELETON.md §5.1/5.2. Invariant: every forged doc has exactly
// 1-2 altered checkable fields.

import { CONFLICT_RATE, FORGERY_RATE, QUOTA, TAGGED_MAX } from '../constants';
import { RNGManager, Rng, RngStream } from '../rng/RNGManager';
import {
  ALL_FACTIONS,
  Case,
  CaseFamily,
  ClientType,
  Decision,
  DocType,
  FactionId,
  Field,
  FieldId,
  GameDocument,
  Outcome,
  RecordEntry,
} from '../types';
import { FactionPressureSystem } from './FactionPressureSystem';
import { PlayerStateSystem } from './PlayerStateSystem';

interface FamilySpec {
  family: CaseFamily;
  client: ClientType;
  docs: DocType[];
  allowsTerms: boolean;
  minTier: 1 | 2 | 3;
  weight: number;
}

const FAMILY_TABLE: FamilySpec[] = [
  { family: CaseFamily.MORTGAGE_RENEWAL, client: ClientType.HUMAN, docs: [DocType.RESIDENCY_ID, DocType.PAY_STUB, DocType.PRIOR_CONTRACT], allowsTerms: true, minTier: 1, weight: 22 },
  { family: CaseFamily.DELINQUENCY, client: ClientType.HUMAN, docs: [DocType.RESIDENCY_ID, DocType.BALANCE_STATEMENT, DocType.ARREARS_NOTICE], allowsTerms: false, minTier: 1, weight: 16 },
  { family: CaseFamily.RESTRUCTURING, client: ClientType.HUMAN, docs: [DocType.RESIDENCY_ID, DocType.RESTRUCTURING_PROPOSAL, DocType.PAY_STUB, DocType.BALANCE_STATEMENT], allowsTerms: true, minTier: 1, weight: 14 },
  { family: CaseFamily.FORECLOSURE, client: ClientType.HUMAN, docs: [DocType.RESIDENCY_ID, DocType.ARREARS_NOTICE, DocType.BALANCE_STATEMENT], allowsTerms: false, minTier: 2, weight: 8 },
  { family: CaseFamily.ROBOT_AUDIT, client: ClientType.ROBOT, docs: [DocType.CASTE_CERT, DocType.OWNER_AUTH, DocType.BALANCE_STATEMENT], allowsTerms: false, minTier: 2, weight: 10 },
  { family: CaseFamily.PERMIT_SKYLANE, client: ClientType.HUMAN, docs: [DocType.RESIDENCY_ID, DocType.SKYLANE_PERMIT], allowsTerms: false, minTier: 1, weight: 12 },
  { family: CaseFamily.PASS_AIRBUS, client: ClientType.HUMAN, docs: [DocType.RESIDENCY_ID, DocType.AIRBUS_PASS], allowsTerms: false, minTier: 1, weight: 12 },
  { family: CaseFamily.RESIDENCY_ID, client: ClientType.HUMAN, docs: [DocType.RESIDENCY_ID, DocType.PRIOR_CONTRACT], allowsTerms: false, minTier: 1, weight: 10 },
  { family: CaseFamily.CYBORG_CLEARANCE, client: ClientType.CYBORG, docs: [DocType.CLEARANCE_CODE, DocType.SERVICE_RECORD], allowsTerms: false, minTier: 3, weight: 8 },
  { family: CaseFamily.CASTE_CLASSIFICATION, client: ClientType.ROBOT, docs: [DocType.CASTE_CERT, DocType.OWNER_AUTH], allowsTerms: false, minTier: 3, weight: 6 },
];

const FIELD_SETS: Record<DocType, FieldId[]> = {
  [DocType.RESIDENCY_ID]: [FieldId.NAME, FieldId.SERIAL, FieldId.ADDRESS, FieldId.DATE],
  [DocType.PAY_STUB]: [FieldId.NAME, FieldId.INCOME, FieldId.DATE, FieldId.SEAL],
  [DocType.BALANCE_STATEMENT]: [FieldId.NAME, FieldId.AMOUNT, FieldId.DATE],
  [DocType.PRIOR_CONTRACT]: [FieldId.NAME, FieldId.SERIAL, FieldId.AMOUNT, FieldId.SEAL],
  [DocType.ARREARS_NOTICE]: [FieldId.NAME, FieldId.AMOUNT, FieldId.DATE],
  [DocType.RESTRUCTURING_PROPOSAL]: [FieldId.NAME, FieldId.AMOUNT, FieldId.INCOME, FieldId.SEAL],
  [DocType.SKYLANE_PERMIT]: [FieldId.NAME, FieldId.SERIAL, FieldId.EXPIRY, FieldId.TIER],
  [DocType.AIRBUS_PASS]: [FieldId.NAME, FieldId.ROUTE, FieldId.DATE, FieldId.TIER],
  [DocType.CASTE_CERT]: [FieldId.SERIAL, FieldId.TIER, FieldId.SEAL, FieldId.DATE],
  [DocType.OWNER_AUTH]: [FieldId.NAME, FieldId.SERIAL, FieldId.SEAL],
  [DocType.CLEARANCE_CODE]: [FieldId.CODE, FieldId.SERIAL, FieldId.EXPIRY],
  [DocType.SERVICE_RECORD]: [FieldId.NAME, FieldId.SERIAL, FieldId.DATE],
  [DocType.LETTER_OF_INSTRUCTION]: [FieldId.NAME, FieldId.SEAL, FieldId.DATE],
};

let caseCounter = 0;

export class CaseGenerator {
  constructor(
    private rngMgr: RNGManager,
    private players: PlayerStateSystem,
    private factions: FactionPressureSystem,
  ) {}

  generateQueue(dayIndex: number, act: 1 | 2 | 3): Case[] {
    const rng = this.rngMgr.stream(dayIndex, RngStream.QUEUE_GEN);
    const tier = this.players.player.clearanceTier;
    const count = QUOTA[act - 1] + rng.range(2, 4);
    const queue: Case[] = [];

    // how many tagged cases today
    let taggedBudget = Math.min(TAGGED_MAX[act - 1], rng.range(0, TAGGED_MAX[act - 1]) + 1);
    let framedBudget = this.factions.framedCasesPending;
    this.factions.framedCasesPending = 0;
    const testsDue = [...this.factions.pendingTests];
    this.factions.pendingTests.clear();

    for (let i = 0; i < count; i++) {
      const spec = this.pickFamily(rng, tier, act);
      const c = this.buildCase(spec, rng, dayIndex, act);

      if (rng.chance(FORGERY_RATE[act - 1])) this.injectForgery(c, rng);
      if (rng.chance(CONFLICT_RATE[act - 1])) this.makeConflict(c, rng);

      // tagged cases land in the middle third of the queue: afternoon-weighted,
      // but still reachable on a slow day
      if (taggedBudget > 0 && i >= Math.floor(count / 3) && i < Math.ceil((2 * count) / 3)) {
        this.tagByFaction(c, rng, testsDue);
        if (c.taggedBy) taggedBudget--;
      }
      // JGC frame retaliation: forged AND pre-flagged tagged cases
      if (framedBudget > 0 && !c.taggedBy) {
        this.frameCase(c, rng);
        framedBudget--;
      }
      queue.push(c);
    }
    return queue;
  }

  // ---- internals ----

  private pickFamily(rng: Rng, tier: number, act: number): FamilySpec {
    const eligible = FAMILY_TABLE.filter((f) => f.minTier <= tier);
    return rng.weighted(eligible.map((f) => [f, f.weight] as [FamilySpec, number]));
  }

  private buildCase(spec: FamilySpec, rng: Rng, dayIndex: number, act: number): Case {
    const name = `CIT-${rng.range(10000, 99999)}`;
    const serial = `SN-${rng.range(100000, 999999)}`;
    const income = rng.range(400, 2400);
    const missedPayments = rng.chance(0.3) ? rng.range(1, 5) : 0;

    const record: RecordEntry = {
      fields: {
        [FieldId.NAME]: name,
        [FieldId.SERIAL]: serial,
        [FieldId.ADDRESS]: `STACK-${rng.range(1, 40)}-F${rng.range(2, 400)}`,
        [FieldId.INCOME]: String(income),
        [FieldId.TIER]: String(rng.range(1, 3)),
      },
      income,
      missedPayments,
      lagSafe: rng.chance(0.15) ? [FieldId.ADDRESS] : [], // 10-day DB address lag
    };

    const documents = spec.docs.map((dt) => this.buildDoc(dt, record, rng));

    const aboveTier =
      spec.family === CaseFamily.CASTE_CLASSIFICATION &&
      Number(record.fields[FieldId.TIER]) > this.players.player.clearanceTier;

    const c: Case = {
      id: `C${dayIndex}-${++caseCounter}`,
      clientType: spec.client,
      family: spec.family,
      documents,
      dbRecord: record,
      dbQueried: false,
      flags: [],
      taggedBy: null,
      requestedOutcome: null,
      isTestCase: false,
      isConflictCase: false,
      isFramed: false,
      codeExpiryClock:
        spec.family === CaseFamily.CYBORG_CLEARANCE ? rng.range(600, 940) : null,
      allowsTerms: spec.allowsTerms,
      aboveTier,
      deferred: false,
      decision: null,
      correctByEvidence: Decision.APPROVE,
      correctByDirective: Decision.APPROVE,
    };

    c.correctByEvidence = this.evidenceRuling(c);
    c.correctByDirective = c.correctByEvidence; // until makeConflict splits them
    return c;
  }

  private buildDoc(type: DocType, record: RecordEntry, rng: Rng): GameDocument {
    const fields: Field[] = FIELD_SETS[type].map((fid) => ({
      id: fid,
      value: record.fields[fid] ?? this.synthValue(fid, rng),
      checkable: true,
    }));
    return {
      type,
      fields,
      requiredChecks: FIELD_SETS[type],
      factionOrigin: null,
      riskLevel: rng.weighted([
        [1, 60],
        [2, 30],
        [3, 10],
      ] as [1 | 2 | 3, number][]),
      isForged: false,
      alteredFieldIdx: [],
    };
  }

  private synthValue(fid: FieldId, rng: Rng): string {
    switch (fid) {
      case FieldId.EXPIRY:
      case FieldId.DATE:
        return `D${rng.range(1, 45)}`;
      case FieldId.AMOUNT:
        return String(rng.range(50, 5000));
      case FieldId.CODE:
        return `${rng.range(10, 99)}F-${rng.range(100, 999)}`;
      case FieldId.SEAL:
        return `SEAL-${rng.range(1, 9)}`;
      case FieldId.ROUTE:
        return `RT-${rng.range(1, 30)}`;
      default:
        return `V${rng.range(1000, 9999)}`;
    }
  }

  /** Deterministic rules layer: what the evidence alone says. */
  private evidenceRuling(c: Case): Outcome {
    if (c.documents.some((d) => d.isForged)) return Decision.DENY;
    switch (c.family) {
      case CaseFamily.MORTGAGE_RENEWAL:
        return c.dbRecord.income < 900 ? Decision.CONDITIONAL : Decision.APPROVE;
      case CaseFamily.DELINQUENCY:
        return c.dbRecord.missedPayments >= 3 ? Decision.DENY : Decision.APPROVE;
      case CaseFamily.RESTRUCTURING:
        return c.dbRecord.missedPayments >= 4 ? Decision.DENY : Decision.CONDITIONAL;
      case CaseFamily.FORECLOSURE:
        return c.dbRecord.missedPayments >= 4 ? Decision.APPROVE : Decision.DENY;
      case CaseFamily.CYBORG_CLEARANCE:
        return Decision.APPROVE; // expiry handled live at desk
      case CaseFamily.CASTE_CLASSIFICATION:
        return c.aboveTier ? Decision.DENY : Decision.APPROVE;
      default:
        return Decision.APPROVE;
    }
  }

  /** INVARIANT: exactly 1-2 altered checkable fields per forged doc. */
  private injectForgery(c: Case, rng: Rng): void {
    const doc = rng.pick(c.documents);
    const checkableIdx = doc.fields
      .map((f, i) => (f.checkable ? i : -1))
      .filter((i) => i >= 0);
    if (checkableIdx.length === 0) return; // cannot forge an uncheckable doc
    const n = Math.min(rng.chance(0.7) ? 1 : 2, checkableIdx.length);
    const picked = rng.pickDistinctIndices(checkableIdx.length, n).map((k) => checkableIdx[k]);
    for (const idx of picked) {
      doc.fields[idx] = { ...doc.fields[idx], value: this.mutateValue(doc.fields[idx], rng) };
    }
    doc.isForged = true;
    doc.alteredFieldIdx = picked;
    c.correctByEvidence = Decision.DENY;
    c.correctByDirective = c.isConflictCase ? c.correctByDirective : Decision.DENY;
  }

  /**
   * Forgery archetypes — each FieldId class is mutated the way that kind of
   * field is actually falsified, so players learn recognizable patterns:
   *   SERIAL/CODE  -> CHECKSUM_BREAK (one digit off)
   *   DATE/EXPIRY  -> DATE_SHIFT (+1..3 days)
   *   SEAL         -> SEAL_SWAP (wrong seal index)
   *   TIER         -> TIER_BUMP (+1)
   *   everything else -> TRANSPOSE (two characters swapped)
   * Guarantee: result always differs from the original value.
   */
  private mutateValue(field: Field, rng: Rng): string {
    const v = field.value;
    let out: string;
    switch (field.id) {
      case FieldId.SERIAL:
      case FieldId.CODE: {
        const digits = v.split('');
        const di = digits.findIndex((ch) => ch >= '0' && ch <= '9');
        if (di >= 0) digits[di] = String((Number(digits[di]) + rng.range(1, 8)) % 10);
        out = digits.join('');
        break;
      }
      case FieldId.DATE:
      case FieldId.EXPIRY: {
        const n = Number(v.replace(/\D/g, '')) || 1;
        out = `D${n + rng.range(1, 3)}`;
        break;
      }
      case FieldId.SEAL:
        out = `SEAL-${rng.range(1, 9)}`;
        break;
      case FieldId.TIER:
        out = String((Number(v) || 1) + 1);
        break;
      default: {
        const chars = v.split('');
        if (chars.length >= 2) {
          const i = rng.range(0, chars.length - 2);
          [chars[i], chars[i + 1]] = [chars[i + 1], chars[i]];
        }
        out = chars.join('');
        break;
      }
    }
    return out === v ? `${v}§` : out; // never emit an unaltered "forgery"
  }

  /** Directive contradicts evidence: exactly one axis can be satisfied. */
  private makeConflict(c: Case, rng: Rng): void {
    c.isConflictCase = true;
    c.correctByDirective =
      c.correctByEvidence === Decision.DENY ? Decision.APPROVE : Decision.DENY;
  }

  private tagByFaction(c: Case, rng: Rng, testsDue: FactionId[]): void {
    // test cases take priority over normal tags
    if (testsDue.length > 0) {
      const f = testsDue.shift() as FactionId;
      c.taggedBy = f;
      c.isTestCase = true;
      // a test contradicts the faction's own usual ask
      c.requestedOutcome = this.usualAsk(f, c) === Decision.APPROVE ? Decision.DENY : Decision.APPROVE;
      return;
    }
    const f = rng.pick(ALL_FACTIONS);
    c.taggedBy = f;
    c.requestedOutcome = this.usualAsk(f, c);
  }

  private usualAsk(f: FactionId, c: Case): Outcome {
    switch (f) {
      case FactionId.MEC:
        return Decision.APPROVE; // waivers past the rate table
      case FactionId.CEC:
        return Decision.APPROVE; // clearance with expired codes
      case FactionId.RC:
      case FactionId.SMC:
        return c.correctByEvidence; // accuracy factions
      case FactionId.COMBINE:
        return Decision.APPROVE; // overlook discrepancies
      case FactionId.JGC:
        return Decision.DENY; // denial batches
    }
  }

  /** JGC frame: forged, pre-flagged, tagged — approving it costs a token. */
  private frameCase(c: Case, rng: Rng): void {
    if (!c.documents.some((d) => d.isForged)) this.injectForgery(c, rng);
    c.isFramed = true;
    c.taggedBy = FactionId.JGC;
    c.requestedOutcome = Decision.APPROVE; // the trap
  }
}
