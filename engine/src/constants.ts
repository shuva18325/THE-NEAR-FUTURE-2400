// Global constants — all values trace to SYSTEM_SKELETON.md §1.

// ---- time (in-game minutes since midnight) ----
export const MINUTES_PER_DAY = 960; // playable window 06:00 -> 22:00
export const DAY_START = 360; // 06:00
export const DAY_END = 1320; // 22:00
export const TIME_SCALE = 0.75; // in-game minutes per real second
export const SHIFT_START = 480; // 08:00
export const SHIFT_END = 960; // 16:00
export const LUNCH_START = 720; // 12:00
export const LUNCH_LEN = 30;
export const OVERTIME_LEN = 90;

// ---- campaign ----
export const CAMPAIGN_DAYS = 45;
export const ACT2_START_DAY = 16;
export const ACT3_START_DAY = 31;

// ---- meters ----
export const METER_MIN = 0;
export const METER_MAX = 100;
export const FACTION_MIN = -100;
export const FACTION_MAX = 100;

// ---- work (indexed by act-1) ----
export const ESCALATION_SLOTS_BASE = 3;
export const AUDIT_LAG_DAYS = [3, 2, 1] as const;
export const QUOTA = [8, 11, 14] as const;
export const FORGERY_RATE = [0.15, 0.22, 0.3] as const;
export const CONFLICT_RATE = [0.05, 0.1, 0.15] as const;
export const TAGGED_MAX = [1, 2, 3] as const;

// ---- error ledger ----
export const TOKEN_EXPIRY_DAYS = 15;
export const THRESH_WARNING = 5;
export const THRESH_PROBATION = 8;
export const THRESH_DEMOTION = 12;
export const THRESH_TERMINATION = 16;
export const PERFORMANCE_PLAN_DAYS = 5;
export const GIG_REHIRE_DAYS = 20;

// ---- economy (₡H) ----
export const WAGE_PER_CASE = 6;
export const QUOTA_BONUS = 45;
export const LATE_DOCK = 10;
export const MORTGAGE_PAYMENT = 610;
export const MORTGAGE_PERIOD_DAYS = 30;
export const FIRST_MORTGAGE_DUE_DAY = 20;
export const FILTER_COST = 120;
export const FILTER_DECAY_PER_DAY = 2.5;
export const CHECKPOINT_FINE = 25;
export const GIG_WAGE = 40; // ~0.6 of an average shift
export const STARTING_WALLET = 180;

// ---- stress / fatigue ----
export const STRESS_STAMP_DRIFT_AT = 50;
export const STRESS_FALSE_HIGHLIGHT_AT = 75;
export const FATIGUE_SLOW_AT = 50;
export const FATIGUE_MISS_ALERT_AT = 75;
export const BREAKDOWN_RESET = 60;
export const COLLAPSE_RESET = 50;
export const BURNOUT_WINDOW_DAYS = 10;
export const BURNOUT_EVENTS = 3;
export const BURNOUT_LEAVE_DAYS = 2;
export const FATIGUE_PER_BLOCK = 15;
export const FATIGUE_OVERTIME = 15;

// ---- faction pressure ----
export const COMPLY_DELTA = 8;
export const REFUSE_DELTA = -6;
export const ESCALATE_DELTA = -3;
export const TEST_MULT = 2;
export const TEST_FAIL = -40;
export const REWARD_THRESHOLD = 40;
export const PENALTY_THRESHOLD = -40;
export const EXTREME_THRESHOLD = 80;
export const FACTION_TEST_COOLDOWN_DAYS = 7;
export const MEC_MONTHLY_BONUS = 150;
export const JGC_BATCH_BONUS = 80;

// ---- commute / checkpoint ----
export const CHECKPOINT_BASE_TIME = 10;
export const DETAIN_BASE_P = 0.1;
export const DETAIN_CEC_HOSTILE_P = 0.25; // added when CEC rep <= -60
export const DETAIN_FLAGGED_WORKER_P = 0.1; // added when tokens >= probation
export const MAX_COMMUTE_EVENTS = 2;

// ---- action time costs (in-game minutes) ----
export const T_PULL = 2;
export const T_READ_DOC = 5;
export const T_SPLIT = 1;
export const T_COMPARE = 3;
export const T_QUERY = 15;
export const T_QUERY_FAST = 8; // FAST_QUERY upgrade
export const T_QUERY_RC_PENALTY = 36; // Robot Council penalty active
export const T_FLAG = 5;
export const T_STAMP = 2;

// ---- desk / audits ----
export const SPOT_AUDIT_BASE_P = 0.1;
export const ROBOT_AUDIT_UNIT_ACCURACY = 0.85;

export function actOfDay(day: number): 1 | 2 | 3 {
  if (day >= ACT3_START_DAY) return 3;
  if (day >= ACT2_START_DAY) return 2;
  return 1;
}

export function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

export function clamp01(v: number): number {
  return clamp(v, 0, 1);
}
