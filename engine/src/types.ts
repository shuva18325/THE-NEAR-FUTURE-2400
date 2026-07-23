// Core enums and data models — SYSTEM_SKELETON.md §4.

// ---------------------------------------------------------------- enums

export enum GameState {
  INIT = 'INIT',
  WAKE = 'WAKE',
  POD_MAINTENANCE = 'POD_MAINTENANCE',
  COMMUTE = 'COMMUTE',
  CHECKPOINT = 'CHECKPOINT',
  WORK_SHIFT = 'WORK_SHIFT',
  BREAK = 'BREAK',
  WORK_SHIFT_2 = 'WORK_SHIFT_2',
  COMMUTE_BACK = 'COMMUTE_BACK',
  POD_EVENTS = 'POD_EVENTS',
  SLEEP = 'SLEEP',
  DAY_END_UPDATE = 'DAY_END_UPDATE',
  CAMPAIGN_OVER = 'CAMPAIGN_OVER',
}

export enum ClientType {
  HUMAN = 'HUMAN',
  ROBOT = 'ROBOT',
  CYBORG = 'CYBORG',
  FACTION_REP = 'FACTION_REP',
}

export enum CaseFamily {
  MORTGAGE_RENEWAL = 'MORTGAGE_RENEWAL',
  DELINQUENCY = 'DELINQUENCY',
  RESTRUCTURING = 'RESTRUCTURING',
  FORECLOSURE = 'FORECLOSURE',
  ROBOT_AUDIT = 'ROBOT_AUDIT',
  PERMIT_SKYLANE = 'PERMIT_SKYLANE',
  PASS_AIRBUS = 'PASS_AIRBUS',
  RESIDENCY_ID = 'RESIDENCY_ID',
  CYBORG_CLEARANCE = 'CYBORG_CLEARANCE',
  CASTE_CLASSIFICATION = 'CASTE_CLASSIFICATION',
}

export enum Decision {
  APPROVE = 'APPROVE',
  DENY = 'DENY',
  ESCALATE = 'ESCALATE',
  CONDITIONAL = 'CONDITIONAL',
}

/** Outcome = a decision excluding ESCALATE (what "correct" can be). */
export type Outcome = Decision.APPROVE | Decision.DENY | Decision.CONDITIONAL;

export enum DocType {
  RESIDENCY_ID = 'RESIDENCY_ID',
  PAY_STUB = 'PAY_STUB',
  BALANCE_STATEMENT = 'BALANCE_STATEMENT',
  PRIOR_CONTRACT = 'PRIOR_CONTRACT',
  ARREARS_NOTICE = 'ARREARS_NOTICE',
  RESTRUCTURING_PROPOSAL = 'RESTRUCTURING_PROPOSAL',
  SKYLANE_PERMIT = 'SKYLANE_PERMIT',
  AIRBUS_PASS = 'AIRBUS_PASS',
  CASTE_CERT = 'CASTE_CERT',
  OWNER_AUTH = 'OWNER_AUTH',
  CLEARANCE_CODE = 'CLEARANCE_CODE',
  SERVICE_RECORD = 'SERVICE_RECORD',
  LETTER_OF_INSTRUCTION = 'LETTER_OF_INSTRUCTION',
}

export enum FieldId {
  NAME = 'NAME',
  SERIAL = 'SERIAL',
  EXPIRY = 'EXPIRY',
  TIER = 'TIER',
  ADDRESS = 'ADDRESS',
  AMOUNT = 'AMOUNT',
  INCOME = 'INCOME',
  CODE = 'CODE',
  SEAL = 'SEAL',
  DATE = 'DATE',
  ROUTE = 'ROUTE',
}

export enum FactionId {
  MEC = 'MEC',
  CEC = 'CEC',
  RC = 'RC',
  COMBINE = 'COMBINE',
  JGC = 'JGC',
  SMC = 'SMC',
}

export const ALL_FACTIONS: FactionId[] = [
  FactionId.MEC,
  FactionId.CEC,
  FactionId.RC,
  FactionId.COMBINE,
  FactionId.JGC,
  FactionId.SMC,
];

export enum RouteId {
  WALKWAY = 'WALKWAY',
  AIR_BUS = 'AIR_BUS',
  SKY_LANE = 'SKY_LANE',
}

export enum CommuteEventType {
  DELAY = 'DELAY',
  SPILL_REROUTE = 'SPILL_REROUTE',
  CHECKPOINT = 'CHECKPOINT',
  ROBOT_INSPECTION = 'ROBOT_INSPECTION',
  SLUM_EVENT = 'SLUM_EVENT',
}

export enum CheckpointResult {
  PASS = 'PASS',
  CITATION = 'CITATION',
  CONFISCATE = 'CONFISCATE',
  DETAIN = 'DETAIN',
}

export enum EmploymentState {
  EMPLOYED = 'EMPLOYED',
  PROBATION = 'PROBATION',
  PERFORMANCE_PLAN = 'PERFORMANCE_PLAN',
  GIG_MODE = 'GIG_MODE',
}

export enum PermitType {
  SKYLANE_PERMIT = 'SKYLANE_PERMIT',
  AIRBUS_PASS = 'AIRBUS_PASS',
  RESIDENCY_ID = 'RESIDENCY_ID',
}

export enum DeskUpgrade {
  THIRD_PANE = 'THIRD_PANE',
  FAST_QUERY = 'FAST_QUERY',
  EXTRA_ESCALATION = 'EXTRA_ESCALATION',
  AUTO_CHECKSUM = 'AUTO_CHECKSUM',
}

export enum LunchChoice {
  EAT = 'EAT',
  WORK_THROUGH = 'WORK_THROUGH',
  SOCIALIZE = 'SOCIALIZE',
}

export enum EveningChoice {
  REST = 'REST',
  HALLWAY = 'HALLWAY',
  SIDE_GIG = 'SIDE_GIG',
  STUDY_RULES = 'STUDY_RULES',
}

export enum TripPhase {
  OUTBOUND = 'OUTBOUND',
  RETURN = 'RETURN',
}

// ---------------------------------------------------------------- documents & cases

export interface Field {
  id: FieldId;
  value: string;
  checkable: boolean;
}

export interface GameDocument {
  type: DocType;
  fields: Field[];
  requiredChecks: FieldId[];
  factionOrigin: FactionId | null;
  riskLevel: 1 | 2 | 3;
  /** generation-time truth — never exposed to UI/agent */
  isForged: boolean;
  alteredFieldIdx: number[]; // length 1..2 when forged, else []
}

export interface RecordEntry {
  fields: Partial<Record<FieldId, string>>;
  income: number;
  missedPayments: number;
  /** fields where a legitimate DB-lag mismatch is possible (flag weight 0) */
  lagSafe: FieldId[];
}

export interface Flag {
  docIndex: number;
  fieldIndex: number;
  againstFieldId: FieldId;
  validAtAudit: boolean; // generation truth, computed at file time
  lagSafe: boolean;
}

export interface Case {
  id: string;
  clientType: ClientType;
  family: CaseFamily;
  documents: GameDocument[];
  dbRecord: RecordEntry;
  dbQueried: boolean;
  flags: Flag[];
  taggedBy: FactionId | null;
  requestedOutcome: Outcome | null;
  isTestCase: boolean;
  isConflictCase: boolean;
  isFramed: boolean; // JGC penalty: forged AND pre-flagged
  codeExpiryClock: number | null; // cyborg cases only
  allowsTerms: boolean;
  aboveTier: boolean; // robot caste case above player's licensed tier
  deferred: boolean; // a case may be deferred to the back of the queue once
  // resolution
  decision: Decision | null;
  // generation-time truth
  correctByEvidence: Outcome;
  correctByDirective: Outcome;
}

// ---------------------------------------------------------------- player

export interface Permit {
  type: PermitType;
  daysRemaining: number;
  tier: number;
}

export interface Mortgage {
  amount: number; // remaining principal ₡H
  dueDate: number; // dayIndex of next payment
  missedStreak: number;
  stage: 0 | 1 | 2 | 3 | 4;
  restructured: boolean;
}

export interface DailyPerformance {
  casesClosed: number;
  quotaTarget: number;
  flagsFiled: number;
  escalationsUsed: number;
  complianceMatches: number;
  complianceTotal: number;
  wagesEarned: number;
  lateMinutes: number;
  stampCounts: Record<Decision, number>;
}

export function emptyDailyPerformance(quota: number): DailyPerformance {
  return {
    casesClosed: 0,
    quotaTarget: quota,
    flagsFiled: 0,
    escalationsUsed: 0,
    complianceMatches: 0,
    complianceTotal: 0,
    wagesEarned: 0,
    lateMinutes: 0,
    stampCounts: {
      [Decision.APPROVE]: 0,
      [Decision.DENY]: 0,
      [Decision.ESCALATE]: 0,
      [Decision.CONDITIONAL]: 0,
    },
  };
}

export interface Player {
  stress: number;
  fatigue: number;
  supervisorStanding: number;
  factionRep: Record<FactionId, number>;
  wallet: number;
  mortgage: Mortgage;
  permits: Permit[];
  clearanceTier: 1 | 2 | 3;
  upgrades: DeskUpgrade[];
  employment: EmploymentState;
  employmentCounter: number; // days remaining in plan / clean gig days
  carryingContraband: boolean;
  filterPct: number;
  filterCap: number; // 100 normally; 70 after stage-4 relocation
  relocated: boolean;
  utilitiesRationed: boolean;
  cgnComplianceFlags: number;
  fatigueRecoveryBonusDays: number; // SMC reward
  dailyPerformance: DailyPerformance;
}

// ---------------------------------------------------------------- commute / checkpoint

export interface CommuteEvent {
  type: CommuteEventType;
  severity: 1 | 2 | 3;
  timeCost: number;
  stressDelta: number;
  creditDelta: number;
}

export interface CheckpointEvent {
  cyborgPresence: boolean;
  robotScan: boolean;
  requiredPermit: PermitType;
  baseTimeCost: number;
}

export interface CheckpointOutcome {
  result: CheckpointResult;
  timeCost: number;
  fine: number;
}

export interface CommuteLog {
  route: RouteId;
  phase: TripPhase;
  events: CommuteEvent[];
  totalTime: number;
  arrived: number; // clock at arrival
}

// ---------------------------------------------------------------- day context

export interface Notice {
  kind: string;
  text: string;
}

export interface ShiftLog {
  closed: { caseId: string; family: CaseFamily; decision: Decision; taggedBy: FactionId | null }[];
  breakdownFired: boolean;
  overtimeTaken: boolean;
  spotAudit: { fired: boolean; passed: boolean };
}

export interface DayContext {
  dayIndex: number;
  act: 1 | 2 | 3;
  clock: number;
  wakeTime: number;
  arrivalTime: number;
  oversleep: boolean;
  halfDayDetained: boolean;
  forcedLeave: boolean;
  notices: Notice[];
  lunchChoice: LunchChoice | null;
  eveningChoice: EveningChoice | null;
  commuteLogs: CommuteLog[];
  checkpointOutcomes: CheckpointOutcome[];
  shiftLog: ShiftLog;
  sleepQuality: number;
}

export function freshDayContext(dayIndex: number, act: 1 | 2 | 3): DayContext {
  return {
    dayIndex,
    act,
    clock: 360,
    wakeTime: 360,
    arrivalTime: 0,
    oversleep: false,
    halfDayDetained: false,
    forcedLeave: false,
    notices: [],
    lunchChoice: null,
    eveningChoice: null,
    commuteLogs: [],
    checkpointOutcomes: [],
    shiftLog: {
      closed: [],
      breakdownFired: false,
      overtimeTaken: false,
      spotAudit: { fired: false, passed: false },
    },
    sleepQuality: 50,
  };
}

// ---------------------------------------------------------------- audits

export interface PendingAudit {
  case_: Case;
  decision: Decision;
  filedDay: number;
  resolveDay: number;
  doubleWeight: boolean; // failed spot-audit citation
}

export interface ErrorToken {
  issuedDay: number;
  expiresDay: number;
  weight: number;
  caseId: string;
}
