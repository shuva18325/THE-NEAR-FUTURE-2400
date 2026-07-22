# THE NEAR FUTURE: 2400
### System Skeleton — v1.0 (Engine-Ready Architecture)

**Scope:** Hardwired mechanics only. No lore, no story, no flavor text. All constants trace to `MECHANICS_DOCUMENT.md`; where that document gave ranges, this one fixes exact values. Pseudo-code is language-agnostic (C#/TypeScript hybrid); all systems are engine-portable.

---

## TABLE OF CONTENTS

1. Global Constants & Conventions
2. Core Game Loop (State Machine)
3. System Architecture (Modules)
4. Data Models (Structs/Classes)
5. Work Desk Mechanics (Code-Ready)
6. Commute System (Code-Ready)
7. Faction Pressure System
8. Failure States
9. UI Wireframes (Text-Based)

---

## 1. GLOBAL CONSTANTS & CONVENTIONS

```csharp
// ---- time ----
const int   MINUTES_PER_DAY        = 960;    // 06:00 -> 22:00 playable window
const float TIME_SCALE             = 0.75f;  // in-game minutes per real second (≈21 real min/day)
const int   SHIFT_START            = 480;    // 08:00 in minutes-since-midnight
const int   SHIFT_END              = 960;    // 16:00
const int   LUNCH_START            = 720;    // 12:00
const int   LUNCH_LEN              = 30;

// ---- campaign ----
const int   CAMPAIGN_DAYS          = 45;
const int   ACT2_START_DAY         = 16;
const int   ACT3_START_DAY         = 31;

// ---- meters ----
const int   METER_MIN = 0,   METER_MAX = 100;      // stress, fatigue, standing
const int   FACTION_MIN = -100, FACTION_MAX = 100; // faction rep

// ---- work ----
const int   ESCALATION_SLOTS_BASE  = 3;
const int   AUDIT_LAG_DAYS  [3]    = {3, 2, 1};    // by act
const int   QUOTA           [3]    = {8, 11, 14};  // by act
const float FORGERY_RATE    [3]    = {0.15f, 0.22f, 0.30f};
const float CONFLICT_RATE   [3]    = {0.05f, 0.10f, 0.15f};
const int   TAGGED_MAX      [3]    = {1, 2, 3};

// ---- error ledger ----
const int   TOKEN_EXPIRY_DAYS      = 15;
const int   THRESH_WARNING         = 5;
const int   THRESH_PROBATION       = 8;
const int   THRESH_DEMOTION        = 12;
const int   THRESH_TERMINATION     = 16;

// ---- economy ----
const int   WAGE_PER_CASE          = 6;      // ₡H, base
const int   QUOTA_BONUS            = 45;     // ₡H if quota met
const int   MORTGAGE_PAYMENT       = 610;    // ₡H, monthly (due every 30 days)
const int   FILTER_COST            = 120;    // ₡H, full replacement
const float FILTER_DECAY_PER_DAY   = 2.5f;   // %

// ---- RNG ----
// All rolls use a per-day seeded stream: seed = hash(campaignSeed, dayIndex, streamId)
// Streams: QUEUE_GEN, COMMUTE, AUDIT, EVENTS  (deterministic replays per save)
```

**Conventions:** All meters are clamped on every write. All cross-module communication goes through `EventManager` (Section 3.2) — modules never call each other's mutators directly. `DayContext` (Section 2.3) is the only object passed between loop states.

---

## 2. CORE GAME LOOP (STATE MACHINE)

### 2.1 State Diagram

```
                    ┌──────┐
                    │ INIT  │ (new game / load)
                    └──┬───┘
                       ▼
   ┌────────────────► WAKE
   │                   │
   │                   ▼
   │            POD_MAINTENANCE
   │                   │
   │                   ▼
   │                COMMUTE ◄───────────────┐
   │                   │                     │
   │        [checkpoint event rolled]        │
   │                   ├──yes──► CHECKPOINT ─┘ (returns to COMMUTE resolution)
   │                   ▼
   │              WORK_SHIFT      (morning block)
   │                   │
   │                   ▼
   │                 BREAK        (lunch choice)
   │                   │
   │                   ▼
   │             WORK_SHIFT_2     (afternoon block; overtime optional)
   │                   │
   │                   ▼
   │             COMMUTE_BACK ◄──────────────┐
   │                   ├──checkpoint──► CHECKPOINT ─┘
   │                   ▼
   │              POD_EVENTS      (evening action)
   │                   │
   │                   ▼
   │                 SLEEP
   │                   │
   │                   ▼
   └───────────── DAY_END_UPDATE  (audits, decay, arrears, save)
                       │
              [day == CAMPAIGN_DAYS or terminal event] ──► ENDING_RESOLVER (out of scope here)
```

### 2.2 State Table

| State | Inputs | Outputs | Trigger to Enter | Transitions Out | Failure Conditions | Data Passed Forward |
|---|---|---|---|---|---|---|
| **INIT** | Save file or new-game params | Seeded RNG streams, loaded `Player`, `WorldCalendar` | App start | → WAKE | Corrupt save → fallback to last autosave | `DayContext` (fresh) |
| **WAKE** | `Player.fatigue`, sleep quality from previous SLEEP, pending notices | Morning report (discrepancy notices, mail), fatigue adjustment applied | SLEEP completed | → POD_MAINTENANCE; if `oversleep` flag → COMMUTE (forced late, skip maintenance) | Fatigue==100 previous night ⇒ `oversleep=true` | `ctx.notices[]`, `ctx.wakeTime` |
| **POD_MAINTENANCE** | Filter %, balance, mortgage state | Optional purchases applied (filter, goods) | WAKE done, `!oversleep` | → COMMUTE | None (skippable) | `ctx.podActionsTaken` |
| **COMMUTE** | Route choice, balance, permits, CEC rep, event roll | `arrivalTime`, fatigue/stress deltas, credit deltas | POD_MAINTENANCE done | → CHECKPOINT (if rolled) → WORK_SHIFT | Cannot afford any paid route ⇒ walkway forced | `ctx.arrivalTime`, `ctx.commuteLog` |
| **CHECKPOINT** | Permits[], contraband flags, CEC rep | Pass/citation/detain outcome, time & stress deltas | Checkpoint event rolled in commute | → back to caller state resolution | Detain ⇒ half-day flag set | `ctx.checkpointOutcome` |
| **WORK_SHIFT** | `ctx.arrivalTime`, day's `CaseQueue`, directives | Closed cases, flags, time consumed | Arrival at desk | → BREAK at LUNCH_START | Arrival ≥ 90 min late ⇒ morning block skipped (quota unchanged) | `ctx.shiftLog` (running) |
| **BREAK** | Lunch choice input | Stress/fatigue/capacity deltas | Clock == LUNCH_START | → WORK_SHIFT_2 | None | `ctx.lunchChoice` |
| **WORK_SHIFT_2** | Remaining queue, tagged cases (weighted here) | Closed cases; overtime decision | BREAK done | → COMMUTE_BACK at SHIFT_END (or +90 overtime) | Stress==100 ⇒ BREAKDOWN (jump to COMMUTE_BACK, day flagged) | `ctx.shiftLog` (final) |
| **COMMUTE_BACK** | Same as COMMUTE (evening weights) | Same | Shift ended | → CHECKPOINT (if rolled) → POD_EVENTS | Same | `ctx.commuteLog` |
| **POD_EVENTS** | Evening action choice, hallway event roll | Stress/fatigue/credit deltas, info items | Arrived home | → SLEEP | None | `ctx.eveningChoice` |
| **SLEEP** | Pod condition (filter, noise, rationing) | `sleepQuality` computed | Player confirms sleep | → DAY_END_UPDATE | None | `ctx.sleepQuality` |
| **DAY_END_UPDATE** | Full `DayContext` | Audits resolved, tokens issued/expired, faction decay, mortgage check, wages paid, autosave | SLEEP done | → WAKE (day+1) or → ENDING_RESOLVER | Terminal failure events fire here (Section 8) | Fresh `DayContext` for day+1 |

### 2.3 DayContext (the only inter-state payload)

```csharp
struct DayContext {
  int      dayIndex;              // 1..45
  int      act;                   // derived: 1..3
  int      clock;                 // in-game minutes since midnight
  int      wakeTime;
  int      arrivalTime;
  bool     oversleep;
  bool     halfDayDetained;
  Notice[] notices;               // audit results, warnings, faction mail
  LunchChoice     lunchChoice;
  EveningChoice   eveningChoice;
  CommuteLog[2]   commuteLog;     // outbound, return
  CheckpointOutcome? checkpointOutcome;
  ShiftLog shiftLog;              // cases closed, flags, escalations, compliance hits
  int      sleepQuality;          // 0..100, computed at SLEEP
}
```

### 2.4 Loop Driver (pseudo-code)

```csharp
class GameLoop {
  GameState state = INIT;
  DayContext ctx;

  void Tick(float realDt) {
    float dt = realDt * TIME_SCALE;                    // in-game minutes
    EventManager.PumpQueued();                          // dispatch queued events first
    switch (state) {
      case WORK_SHIFT:
      case WORK_SHIFT_2:
        ctx.clock += dt;
        WorkDeskSystem.Update(dt, ctx);
        if (StressSystem.stress >= 100) { EventManager.Emit(BREAKDOWN); Transition(COMMUTE_BACK); }
        if (ctx.clock >= BlockEnd(state)) Transition(Next(state));
        break;
      case COMMUTE: case COMMUTE_BACK:
        CommuteSystem.Update(dt, ctx);                  // advances transit, resolves interrupts
        if (CommuteSystem.pendingCheckpoint) Transition(CHECKPOINT);
        else if (CommuteSystem.arrived)      Transition(Next(state));
        break;
      // WAKE, POD_*, BREAK, SLEEP are menu states: no dt accumulation, exit on input
      case DAY_END_UPDATE:
        RunDayEnd(ctx);                                 // Section 2.5 — synchronous, then transition
        break;
    }
    UIManager.Render(state, ctx);
  }

  void Transition(GameState next) {
    EventManager.Emit(STATE_EXIT, state);
    state = next;
    EventManager.Emit(STATE_ENTER, next);
  }
}
```

### 2.5 DAY_END_UPDATE (fixed order — order is load-bearing)

```csharp
void RunDayEnd(DayContext ctx) {
  ErrorSystem.ResolveAudits(ctx.dayIndex);        // 1. yesterday-lag cases graded -> tokens
  ErrorSystem.ExpireTokens(ctx.dayIndex);         // 2. tokens older than 15 days removed
  PlayerStateManager.PayWages(ctx.shiftLog);      // 3. wages + quota bonus - docks
  MortgageSystem.DailyCheck(ctx.dayIndex);        // 4. due-date check, stage advance/clear
  FactionPressureSystem.DailyDecay();             // 5. all meters drift 1 toward 0
  FactionPressureSystem.CheckThresholds();        // 6. queue retaliation/test events
  StressSystem.OvernightRecovery(ctx.sleepQuality); // 7. stress/fatigue recovery
  PermitSystem.TickExpiry();                      // 8. permit day countdowns
  DailySummarySystem.Compose(ctx);                // 9. build summary screen data
  SaveSystem.Autosave();                          // 10. single autosave point per day
  if (TerminalCheck()) Transition(ENDING_RESOLVER); else Transition(WAKE);
}
```

---

## 3. SYSTEM ARCHITECTURE

### 3.1 Module Map

```
                          ┌─────────────────┐
                          │    GameLoop      │  (state machine driver)
                          └────────┬────────┘
                                   │ owns
                 ┌─────────────────┼──────────────────┐
                 ▼                 ▼                  ▼
        ┌───────────────┐ ┌───────────────┐ ┌────────────────┐
        │ EventManager   │ │ UIManager      │ │ AudioManager    │
        │ (pub/sub bus)  │ │ (screens)      │ │ (cue table)     │
        └───────┬───────┘ └───────────────┘ └────────────────┘
                │ all modules publish/subscribe here
   ┌────────────┼—──────────────┬───────────────┬──────────────┐
   ▼            ▼               ▼               ▼              ▼
PlayerState  WorkDesk       CommuteSystem   FactionPressure  MortgageSystem
Manager      System         + Checkpoint    System           + PermitSystem
   │            │           System              │                │
   │            ├─ DocumentVerificationSystem   │                │
   │            ├─ ErrorSystem (audit pipeline) │                │
   ▼            ▼               ▼               ▼                ▼
StressSystem  DailySummarySystem  ◄──── reads from all at DAY_END_UPDATE
```

**Update order per tick (fixed):** EventManager → active-state system (WorkDesk | Commute | Checkpoint) → StressSystem → UIManager → AudioManager. All other modules are event-driven or day-end batch only.

### 3.2 Module Definitions

#### EventManager
- **Responsibilities:** Central pub/sub bus; queues events during a tick, dispatches at next tick start; guarantees deterministic ordering (FIFO per priority band).
- **Inputs:** `Emit(eventType, payload)` from any module.
- **Outputs:** Callbacks to subscribers.
- **update():** `PumpQueued()` — drain queue in priority order (SYSTEM > GAMEPLAY > UI).
- **Data:** `Queue<GameEvent>`, `Map<EventType, List<Handler>>`.
- **Core event types:** `STATE_ENTER/EXIT, CASE_CLOSED, FLAG_FILED, AUDIT_RESULT, TOKEN_THRESHOLD, FACTION_DELTA, FACTION_THRESHOLD, CHECKPOINT_RESULT, MORTGAGE_STAGE, BREAKDOWN, COLLAPSE, SPOT_AUDIT, PERMIT_EXPIRED, PAY_RECEIVED`.

#### PlayerStateManager
- **Responsibilities:** Single source of truth for the `Player` struct; validates and clamps all writes; owns wallet.
- **Inputs:** Mutation events (`PAY_RECEIVED`, `PURCHASE`, `METER_DELTA`).
- **Outputs:** `PLAYER_CHANGED` events; read-only snapshot API.
- **update():** none per-tick; event-driven.
- **Data:** `Player` (Section 4.1).

#### StressSystem
- **Responsibilities:** Owns stress & fatigue values, effect ramps, breakdown/collapse/burnout tracking.
- **Inputs:** `STRESS_DELTA(source, amount)`, `FATIGUE_DELTA`, `sleepQuality` at day end.
- **Outputs:** Active debuff set (queried by WorkDeskSystem & UIManager); `BREAKDOWN`/`COLLAPSE` events.
- **update(dt):** applies passive shift accumulation (`fatigue += 15 per shift block`, applied at block end, not per-tick).
- **Data:**
```csharp
struct StressState {
  int stress, fatigue;                 // 0..100
  int breakdownDates[];                // day indices, for 10-day burnout window
  Debuff[] ActiveDebuffs() {
    // stress>=50: STAMP_DRIFT   | stress>=75: FALSE_HIGHLIGHT (1/case)
    // fatigue>=50: DRAG_SLOW_25 | fatigue>=75: MISS_ONE_ALERT (1/day)
  }
}
void OvernightRecovery(int sleepQuality) {
  fatigue = clamp(fatigue - (30 + sleepQuality/2));   // quality 0 -> -30, quality 100 -> -80
  stress  = clamp(stress  - (10 + sleepQuality/4));
}
```
- **Burnout rule:** 3 entries in `breakdownDates` within any 10-day window ⇒ emit `BURNOUT` (2 forced leave days: WAKE → POD_EVENTS directly, wages 0, mortgage clock runs).

#### MortgageSystem
- **Responsibilities:** Player's own mortgage ladder (stages 1–4); payment scheduling; utilities-rationing flag.
- **Inputs:** `PAYMENT_MADE`, `DailyCheck(day)`.
- **Outputs:** `MORTGAGE_STAGE(n)` events; sleep-quality modifier (stage 3+); relocation order (stage 4).
- **update():** day-end only.
- **Data:** `Mortgage` (Section 4.7).
```csharp
void DailyCheck(int day) {
  if (day == mortgage.dueDate) {
    if (wallet >= PaymentDue())      { wallet -= PaymentDue(); missedStreak = 0; }
    else                             { missedStreak++; AdvanceStage(); }
    mortgage.dueDate += 30;
  }
}
int PaymentDue() => MORTGAGE_PAYMENT
  * (stage >= 2 ? 1.15f : 1f)          // stage 2 penalty interest
  * (restructured ? 1.05f : 1f);       // stage 3 permanent bump
```

#### PermitSystem
- **Responsibilities:** Player-held permits registry, expiry countdowns, validity queries for Commute/Checkpoint.
- **Inputs:** `PURCHASE_PERMIT`, `TickExpiry()`, `Validate(permitType)`.
- **Outputs:** `PERMIT_EXPIRED` events.
- **Data:** `Permit { type, daysRemaining, tier }[]`.

#### FactionPressureSystem — Section 7 (full spec).

#### CommuteSystem / CheckpointSystem — Sections 6 & 6.4 (full spec).

#### WorkDeskSystem
- **Responsibilities:** Owns the active shift: case queue, action timing, stamp handling, escalation slots, quota tracking, spot audits.
- **Inputs:** Player desk actions; debuff set from StressSystem; directive sheet from daily generation.
- **Outputs:** `CASE_CLOSED(case, decision, timeSpent)`; shift log.
- **update(dt):** advances any running QUERY timers; fires code-expiry checks on open cyborg cases (`if clock > case.codeExpiry → case invalidated in place`).
- **Data:** `CaseQueue`, `DeskState { openCase, panes[2..3], escalationsLeft, casesClosed }`.

#### DocumentVerificationSystem
- **Responsibilities:** Pure-logic layer: field comparison, forgery detection truth, flag validation. Stateless service — the *truth oracle* the UI plays against.
- **Inputs:** `Compare(fieldA, fieldB)`, `ValidateFlag(flag)`.
- **Outputs:** `MATCH | MISMATCH | (debuffed: FALSE_MISMATCH)`.
- **Key rule:** every generated forgery alters exactly 1–2 fields (generation-time guarantee, Section 5.2).

#### ErrorSystem
- **Responsibilities:** Audit pipeline (lag queue), token ledger, threshold consequences, spot-audit selection.
- **Inputs:** `CASE_CLOSED` (enqueues with `resolveDay = day + AUDIT_LAG_DAYS[act]`), day-end `ResolveAudits`.
- **Outputs:** `AUDIT_RESULT`, `TOKEN_THRESHOLD(level)` events.
- **Data:** `AuditQueue<PendingAudit>`, `List<ErrorToken>`.
```csharp
void ResolveAudits(int today) {
  foreach (var a in auditQueue.Where(x => x.resolveDay == today)) {
    Grade g = Grade(a.case, a.decision);         // truth known from generation data
    if (g.accuracyError)   AddToken(a, weight: a.case.isDelinquencyCase ? 2 : 1);
    if (g.validFlagCited)  RemoveToken();        // correct flags claw back
    notices.Add(NoticeFrom(g));
  }
}
```

#### DailySummarySystem
- **Responsibilities:** Aggregates day-end data into the summary screen model; computes deltas vs. yesterday.
- **Inputs:** Reads all modules at DAY_END_UPDATE step 9.
- **Outputs:** `SummaryModel` for UIManager.

#### UIManager
- **Responsibilities:** One screen controller per loop state; renders meters strip globally; owns alert toasts; input routing to active system.
- **Inputs:** `Render(state, ctx)`; module read-only snapshots; UI events.
- **Outputs:** Player intent events (`STAMP_PRESSED`, `ROUTE_SELECTED`, …).
- **Data:** `ScreenStack`, `ToastQueue`, wireframes in Section 9.

#### AudioManager
- **Responsibilities:** Cue table keyed by event type + state ambience loops. Pure subscriber; no game logic.
- **Data:** `Map<EventType, CueId>`, `Map<GameState, AmbienceId>`.

---

## 4. DATA MODELS

### 4.1 Player

```csharp
class Player {
  // meters
  int stress;                    // 0..100 (owned by StressSystem)
  int fatigue;                   // 0..100
  int supervisorStanding;        // 0..100, start 50
  int factionRep[6];             // -100..100, indices: MEC, CEC, RC, COMBINE, JGC, SMC

  // finance
  int wallet;                    // ₡H
  Mortgage mortgage;
  Permit[] permits;

  // work
  int clearanceTier;             // 1..3, gates case families
  int errorTokenCount;           // derived from ErrorSystem ledger
  DeskUpgrade[] upgrades;        // THIRD_PANE, FAST_QUERY, EXTRA_ESCALATION, AUTO_CHECKSUM
  EmploymentState employment;    // EMPLOYED | PROBATION | PERFORMANCE_PLAN | GIG_MODE

  // per-day (reset by DAY_END_UPDATE)
  DailyPerformance dailyPerformance;
}

struct DailyPerformance {
  int casesClosed, quotaTarget;
  int flagsFiled, escalationsUsed;
  int complianceScore;           // 0..100: % of closed cases matching directive axis
  int wagesEarned;
  int lateMinutes;
}
```

### 4.2 Document

```csharp
class Document {
  DocType type;                  // enum: RESIDENCY_ID, PAY_STUB, CASTE_CERT, CLEARANCE_CODE, ...
  Field[] fields;                // 3..6 per document
  CheckType[] requiredChecks;    // which verifications this doc participates in
  FactionId? factionOrigin;      // null for civilian docs
  RiskLevel riskLevel;           // LOW | MED | HIGH — drives generation weights
  // generation-time truth (never shown to player):
  bool  isForged;
  int[] alteredFieldIdx;         // length 1..2 when forged, else empty
}

struct Field {
  FieldId id;                    // NAME, SERIAL, EXPIRY, TIER, ADDRESS, AMOUNT, CODE, SEAL...
  string value;
  bool   checkable;              // participates in COMPARE
}
```

### 4.3 Case

```csharp
class Case {
  CaseId id;
  ClientType clientType;         // HUMAN | ROBOT | CYBORG | FACTION_REP
  CaseFamily family;             // MORTGAGE_RENEWAL, DELINQUENCY, RESTRUCTURING, FORECLOSURE,
                                 // ROBOT_AUDIT, PERMIT_SKYLANE, PASS_AIRBUS, RESIDENCY_ID,
                                 // CYBORG_CLEARANCE, CASTE_CLASSIFICATION
  Document[] documents;          // 2..6
  RecordEntry dbRecord;          // fetched via QUERY (15 in-game min)
  Flag[] flags;                  // player-filed
  FactionId? taggedBy;           // non-null = tagged case
  Outcome? requestedOutcome;     // faction's ask, when tagged
  bool isConflictCase;           // directive contradicts evidence
  int  codeExpiryClock;          // cyborg cases only; in-game minutes
  // resolution
  Decision decision;             // APPROVE | DENY | ESCALATE | CONDITIONAL
  ConditionTerms? terms;
  // generation-time truth:
  Outcome correctByEvidence;
  Outcome correctByDirective;
}

struct Flag { FieldRef a, b; bool validAtAudit; }   // must cite 2 fields
```

### 4.4 Faction

```csharp
class Faction {
  FactionId id;                  // MEC, CEC, RC, COMBINE, JGC, SMC
  int rep;                       // -100..100
  PressureRule pressureRules;    // tagged-case generation profile (Section 7.2)
  RewardSpec reward;             // active while rep >= +40
  PenaltySpec penalty;           // active while rep <= -40  (SMC: penalty = NONE)
  FactionId[] rivals;            // coupling targets (Section 7.3)
  int lastTestDay;               // extremes cooldown
}
```

### 4.5 CommuteEvent

```csharp
struct CommuteEvent {
  CommuteEventType type;         // DELAY, SPILL_REROUTE, CHECKPOINT, ROBOT_INSPECTION, SLUM_EVENT
  int severity;                  // 1..3, scales timeCost & stress
  int timeCost;                  // in-game minutes (resolved from severity + route)
  int stressDelta;
  int creditDelta;               // slum events only, can be positive
}
```

### 4.6 CheckpointEvent

```csharp
struct CheckpointEvent {
  bool cyborgPresence;           // true = full stop w/ ID scan; false = drone-only
  bool robotScan;                // contraband sweep active
  PermitType requiredPermit;     // what gets validated on this stop
  int  baseTimeCost;             // 10 min, ×severity
}
```

### 4.7 Mortgage

```csharp
class Mortgage {
  int amount;                    // remaining principal, ₡H
  int dueDate;                   // dayIndex of next payment
  int missedStreak;              // consecutive missed payments
  int stage;                     // 0 = current, 1..4 = ladder
  bool restructured;             // stage 3 permanent flag
  float ForeclosureRisk() =>     // UI-only projection, 0..1
    clamp01(missedStreak * 0.25f + (wallet < PaymentDue() ? 0.15f : 0f));
}
```

---

## 5. WORK DESK MECHANICS (CODE-READY)

### 5.1 Daily Queue Generation (runs at WAKE)

```csharp
CaseQueue GenerateQueue(int day, Player p) {
  var rng   = SeededRng(campaignSeed, day, QUEUE_GEN);
  int act   = ActOf(day);
  int count = QUOTA[act] + rng.Range(2, 4);            // always more than quota
  var queue = new CaseQueue();

  int tagged = min(TAGGED_MAX[act], EligibleFactions(p).Count);
  for (int i = 0; i < count; i++) {
    Case c = new Case();
    c.family     = WeightedFamily(act, p.clearanceTier, rng);
    c.clientType = ClientFor(c.family, rng);
    c.documents  = GenerateDocs(c, rng);
    if (rng.Chance(FORGERY_RATE[act]))  InjectForgery(c, rng);   // alters 1-2 fields, exactly
    if (rng.Chance(CONFLICT_RATE[act])) MakeConflict(c);         // directive vs evidence split
    if (tagged-- > 0 && i >= count/2)   TagByFaction(c, rng, p); // weighted to afternoon
    queue.Push(c);
  }
  return queue;
}
```

### 5.2 Forgery Injection Guarantee

```csharp
void InjectForgery(Case c, Rng rng) {
  var doc = rng.Pick(c.documents);
  int n   = rng.Chance(0.7f) ? 1 : 2;              // 70% single-field forgeries
  doc.alteredFieldIdx = rng.PickDistinct(doc.CheckableFields, n);
  foreach (int idx in doc.alteredFieldIdx) Mutate(doc.fields[idx]);
  doc.isForged = true;
  c.correctByEvidence = DENY;                       // truth recorded at generation
}
// INVARIANT: forged docs always have 1-2 altered checkable fields.
// Every discrepancy is findable; none is free.
```

### 5.3 Action Timing Table (in-game minutes)

| Action | Base Cost | Modifiers |
|---|---|---|
| PULL case | 2 | — |
| Read document (auto on open) | 5 per doc | fatigue≥50: ×1.25 |
| SPLIT (arrange panes) | 1 | — |
| COMPARE two fields | 3 | stress≥75: 1 false highlight/case possible |
| QUERY records DB | 15 | FAST_QUERY upgrade: 8; RC penalty active: 36 |
| FLAG (cite 2 fields) | 5 | — |
| STAMP | 2 | stress≥50: drift risk (see 5.5) |

### 5.4 Case Resolution Logic

```csharp
void OnStamp(Case c, Decision d, ConditionTerms? terms) {
  // -- validity gates --
  if (d == DENY && c.flags.Empty && !CitesRule(d))       { RejectStamp("uncited"); return; }
  if (d == CONDITIONAL && !c.family.AllowsTerms)         { AutoError(c); }
  if (d == ESCALATE) {
    if (desk.escalationsLeft == 0)                       { RejectStamp("no slots"); return; }
    desk.escalationsLeft--;
    CloseCase(c, d, accuracyRisk: false);                // escalation = safe, costs slot
    return;
  }
  // -- record & close --
  c.decision = d;
  CloseCase(c, d, accuracyRisk: true);
}

void CloseCase(Case c, Decision d, bool accuracyRisk) {
  int t = desk.TimeSpentOn(c);
  ErrorSystem.EnqueueAudit(c, d, resolveDay: day + AUDIT_LAG_DAYS[act]);
  if (c.taggedBy != null) FactionPressureSystem.OnTaggedResolved(c, d);
  if (c.isConflictCase)   ScoreConflict(c, d);           // exactly one axis satisfied
  StressSystem.Delta(STRESS, TimePressureStress(t));     // slow cases sting
  player.dailyPerformance.casesClosed++;
  EventManager.Emit(CASE_CLOSED, c);
}

void ScoreConflict(Case c, Decision d) {
  bool accurate  = (d == c.correctByEvidence);
  bool compliant = (d == c.correctByDirective);
  // by construction accurate != compliant on conflict cases
  if (compliant) player.dailyPerformance.complianceScore += weight;
  else           /* accuracy protected at audit; compliance dinged now */ ;
}
```

### 5.5 Stamp Drift (stress ≥ 50)

```csharp
Decision ApplyDrift(Decision intended, Rng rng) {
  if (stress < 50) return intended;
  float p = (stress - 50) / 250f;                  // 0% at 50 -> 20% at 100
  if (!rng.Chance(p)) return intended;
  return AdjacentStamp(intended);                  // APPROVE<->CONDITIONAL, DENY<->ESCALATE(no slot? DENY)
}
// UI counterplay: a deliberate 0.5s hold on the stamp key bypasses drift entirely.
// Drift only punishes *hasty* stamping under stress.
```

### 5.6 Rule Tables (directive layer)

| Rule Type | Example (mechanical form) | Checked By |
|---|---|---|
| Rate table | `family=RENEWAL && income < X ⇒ only CONDITIONAL(rate+2%)` | ruleChecker |
| Category ban | `family=RESTRUCTURING && flag=STAGE_4 ⇒ DENY` | ruleChecker |
| Blanket directive | `clientType=ROBOT && tier>player.licensed ⇒ ESCALATE only` | hard gate |
| Quota directive | `family=DENIAL_BATCH: target N denials today` | complianceScore |
| Mid-shift change (Act III) | new directive row arrives at random clock ∈ [600, 900] | ruleChecker hot-reload |

### 5.7 Edge Cases (explicit handling)

| Edge Case | Resolution |
|---|---|
| Cyborg clearance code expires while case is open on desk | Case flips to invalid in place; correct action becomes DENY(cite expiry) or ESCALATE; prior COMPARE work preserved |
| Player flags a legitimate mismatch caused by the 10-day address-DB lag | Flag audits as INVALID but with weight 0 (no token, no claw-back) — known-lag fields are marked in `RecordEntry.lagSafe[]` |
| Queue exhausted before quota (all cases done) | Quota auto-marked met; early clock-out unlocks (+15 min pod time) |
| Two debuffs stack (stress false-highlight + fatigue slow-drag) | Both apply; false highlight limited to 1/case regardless |
| Robot-audit unit (85% accurate) pre-marks a field the player then FLAGs differently | Player's flag overrides; audit grades against generation truth only |
| Overtime taken but stress hits 100 mid-overtime | BREAKDOWN fires; overtime wages for completed cases kept |
| ESCALATE used on a tagged case | Faction treats as refusal at half magnitude (−3, not −6) |

### 5.8 Work Desk Flow (per case)

```
 PULL ──► docs auto-read ──► [suspicious?] ──no──► ruleChecker ──► STAMP
   │                            │ yes                  │
   │                            ▼                      ▼
   │                      COMPARE fields        [conflict case?]
   │                            │                      │ yes
   │                     [mismatch found?]             ▼
   │                        yes │  no          choose axis ──► STAMP or ESCALATE
   │                            ▼    └──► QUERY db ──► re-check ──► STAMP
   │                          FLAG ──► DENY(cited) or CONDITIONAL
   ▼
 (next case; clock always running; quota counter visible)
```

---

## 6. COMMUTE SYSTEM (CODE-READY)

### 6.1 Route Table

| RouteId | Cost (₡H) | Base Time (min) | Fatigue | Permit Required |
|---|---|---|---|---|
| WALKWAY | 0 | 40 | +10 | none |
| AIR_BUS | 4 | 25 | +5 | none (pass checked at checkpoint only) |
| SKY_LANE | 9 | 12 | +2 | SKYLANE_PERMIT (valid) |

### 6.2 Event Probability Table (per trip)

| Event | Base P | Modifiers (additive) | Route Filter |
|---|---|---|---|
| DELAY | 0.20 | +0.15 morning peak (dep. 06:30–07:30); +0.10 Act III | all |
| SPILL_REROUTE | 0.08 | +0.10 if spill occurred within last 1 day | all |
| CHECKPOINT | 0.15 | CEC ≤ −40 ⇒ P=1.0; CEC ≥ +40 ⇒ P=0.0; +0.10 evening | AIR_BUS, SKY_LANE, WALKWAY(0.5×) |
| ROBOT_INSPECTION | 0.10 | ×2 if `carryingContraband` | all |
| SLUM_EVENT | 0.25 | — | WALKWAY only |

**Roll procedure:** each event rolled independently in table order; max 2 events resolve per trip (excess discarded, CHECKPOINT never discarded).

### 6.3 Pseudo-code

```csharp
CommuteResult RunCommute(RouteId route, TripPhase phase, Player p) {
  var rng = SeededRng(campaignSeed, day, COMMUTE, phase);
  int time = ROUTES[route].baseTime;
  var log  = new CommuteLog(route);

  ChargeFare(route);                                   // insufficient funds ⇒ WALKWAY forced upstream
  foreach (var e in EVENT_TABLE) {
    if (!e.AppliesTo(route)) continue;
    float P = e.baseP + e.Modifiers(p, phase, worldFlags);
    if (rng.Chance(clamp01(P))) {
      var ev = e.Materialize(rng);                     // severity 1..3: weights {60,30,10}%
      time += ev.timeCost;                             // DELAY: 5*sev..20; SPILL: 15..30
      StressSystem.Delta(STRESS, ev.stressDelta);      // SPILL +5, CHECKPOINT +8
      if (ev.type == CHECKPOINT) { pendingCheckpoint = MakeCheckpoint(rng, p); }
      log.Add(ev);
      if (log.Count >= 2 && ev.type != CHECKPOINT) break;
    }
  }
  FatigueSystem.Delta(ROUTES[route].fatigue);
  return new CommuteResult(arrival: departTime + time, log);
}
```

### 6.4 CheckpointSystem (sub-state machine)

```
  ENTER ──► SCAN (ID + requiredPermit)
              │
     ┌─valid──┴──invalid/expired─┐
     ▼                           ▼
   [robotScan?]              SECONDARY
     │ yes: contraband roll      │
     ▼                           ├── citation:  fine ₡H 25, +10 min, +8 stress
   clean ──► PASS (+10 min)      ├── confiscate: contraband removed, COMBINE −5
   dirty ──► SECONDARY           └── detain roll (see below)
```

```csharp
CheckpointOutcome Resolve(CheckpointEvent e, Player p, Rng rng) {
  bool permitOk = PermitSystem.Validate(e.requiredPermit);
  bool contraband = e.robotScan && p.carryingContraband;
  if (permitOk && !contraband) return PASS(time: e.baseTimeCost);

  // secondary
  float detainP = 0.10f
    + (p.factionRep[CEC] <= -60 ? 0.25f : 0f)
    + (p.errorTokenCount >= THRESH_PROBATION ? 0.10f : 0f);   // flagged worker
  if (rng.Chance(detainP)) { ctx.halfDayDetained = true; return DETAIN(); }  // Section 8.4
  return contraband ? CONFISCATE() : CITATION(fine: 25);
}
```

---

## 7. FACTION PRESSURE SYSTEM

### 7.1 Meter Update Formulas

```csharp
// tagged-case resolution
const int COMPLY_DELTA  = +8;
const int REFUSE_DELTA  = -6;
const int ESCALATE_DELTA= -3;      // half-magnitude refusal
const int TEST_MULT     = 2;       // at |rep| >= 80, deltas double
const int TEST_FAIL     = -40;     // instant, on failing a test case

void OnTaggedResolved(Case c, Decision d) {
  var f = factions[c.taggedBy];
  bool complied = (d == c.requestedOutcome);
  int delta = complied ? COMPLY_DELTA : (d == ESCALATE ? ESCALATE_DELTA : REFUSE_DELTA);
  if (c.isTestCase) delta = complied ? COMPLY_DELTA * TEST_MULT : TEST_FAIL;
  Apply(f, delta);
  if (complied) foreach (var r in f.rivals) Apply(factions[r], -ceil(delta / 2f)); // coupling
}

// daily
void DailyDecay() { foreach (var f in factions) f.rep -= sign(f.rep); }  // drift toward 0
```

### 7.2 Faction Spec Table

| FactionId | Tagged-Case Profile (mechanical ask) | Reward (rep ≥ +40) | Penalty (rep ≤ −40) | Rivals |
|---|---|---|---|---|
| MEC | `requestedOutcome=APPROVE` on cases violating rate table | wallet +150/30d; SKY_LANE fare −33% | audit lag −1 day (their auditors); spot-audit P ×2 | COMBINE, RC |
| CEC | `APPROVE` on clearance cases w/ expired codes | commute CHECKPOINT P = 0 | commute CHECKPOINT P = 1.0 | COMBINE |
| RC | `requestedOutcome = correctByEvidence` on robot cases (asks for accuracy against directives) | free assistant: auto-verifies 1 field/case | QUERY time 15 → 36 | MEC |
| COMBINE | ignore specific flagged discrepancies on marked accounts | gray-market shop unlocked (cheap filters, stress items) | random pod incident P 0.15/day (filter −20% or ₡H −30) | CEC, MEC |
| JGC | `DENY` batches on restructuring cases | +80 ₡H per complied batch | tagged cases arrive forged AND pre-flagged (frame: +1 token if approved) | SMC |
| SMC | `requestedOutcome = correctByEvidence` (never asks for violations) | fatigue recovery +20% for 3 days after any comply | NONE (reward simply lost) | JGC |

### 7.3 Threshold Events

```csharp
void CheckThresholds() {
  foreach (var f in factions) {
    if (f.rep <= -80 && CooldownOk(f)) QueueWithin3Days(RETALIATION(f));  // penalty column ×3, once
    if (f.rep >= +80 && CooldownOk(f)) InjectTomorrow(TEST_CASE(f));      // contradictory ask
  }
}
```

| Trigger | Event | Effect (mechanical) |
|---|---|---|
| rep ≤ −80 | RETALIATION | Faction's penalty at ×3 magnitude, one-shot (e.g. CEC: forced DETAIN morning; JGC: 3 framed cases in one queue) |
| rep ≥ +80 | TEST_CASE | Tagged case where `requestedOutcome` contradicts faction's own profile; comply +16, fail −40 |

---

## 8. FAILURE STATES

No instant game-over. All failures are ladders with recovery paths.

| # | Failure | Trigger | Immediate Consequence | Persistent Consequence | Recovery Option |
|---|---|---|---|---|---|
| 8.1 | **Stress overflow (BREAKDOWN)** | stress == 100 during shift | Shift ends now; day counts quota-missed | stress resets to 60; standing −10; entry in burnout window | Evening rest actions; 3-in-10-days ⇒ BURNOUT (2 forced leave days) |
| 8.2 | **Fatigue overflow (COLLAPSE)** | fatigue == 100 at SLEEP | `oversleep=true` next day (auto-late, maintenance skipped) | fatigue resets to 50; one random faction −10 (missed tagged case) | Better sleep quality (filter, no rationing) |
| 8.3 | **Mortgage default ladder** | missed payments 1/2/3/4 | Stage 1 notice → 2 (+15% payment) → 3 (restructure, +5% permanent, utilities rationed: sleepQuality −20) | Stage 4: **slum eviction/relocation** — pod downgraded: filter cap 70%, sleepQuality −10 baseline, all route times +10 min | Clear arrears at any stage ≤3 resets streak (stage-3 flags permanent) |
| 8.4 | **Checkpoint arrest (DETAIN)** | detain roll at SECONDARY (6.4) | `halfDayDetained`: morning block lost, wages halved today | +1 CGN compliance flag (3 flags ⇒ standing −15) | Keep permits current; CEC rep ≥ 0 halves detain P |
| 8.5 | **Faction retaliation** | rep ≤ −80 | One-shot penalty ×3 within 3 days | none beyond the hit | Rep drifts to 0 by decay; comply on next tags |
| 8.6 | **Work termination** | 16 error tokens ⇒ PERFORMANCE_PLAN (5 days, quota +2, zero tolerance); failing it | `employment = GIG_MODE`: daily random task menu, wage ×0.6, no standing, no faction reward channels | Mortgage ladder keeps running | Rehire after 20 clean gig days + application (standing resets to 40) |

**Terminal check (DAY_END_UPDATE):** the only scripted hard-stop is the hazard-death sequence (owned by narrative layer, out of scope) — mechanically exposed as `TerminalCheck()` returning true when its preconditions are met, else the loop always continues to day+1 or campaign end.

---

## 9. UI WIREFRAMES (TEXT-BASED)

### 9.1 Work Desk (primary screen)

```
┌─────────────────────────────────────────────────────────────────────┐
│ STRESS ▓▓▓▓░░ 41 │ FATIGUE ▓▓▓░░░ 34 │ QUOTA 5/8 │ 13:42 │ ⚠ 1 │ ₡214│
├───────────┬─────────────────────────────────────────┬───────────────┤
│ QUEUE (3)  │            DOCUMENT VIEWER               │  RULE PANEL    │
│ ┌────────┐│  ┌────────────────┐ ┌────────────────┐  │ ┌────────────┐│
│ │CASE 06  ││  │ PANE A          │ │ PANE B          │  │ │ DIRECTIVES  ││
│ │[✦ tag]  ││  │ RESIDENCY_ID    │ │ DB RECORD       │  │ │ • rate tbl  ││
│ ├────────┤│  │  name  ███████  │ │  name  ███████  │  │ │ • ban list  ││
│ │CASE 07  ││  │  addr ▶███◀ ?  │ │  addr ▶███◀ ?  │  │ ├────────────┤│
│ ├────────┤│  │  serial ██████  │ │  serial ██████  │  │ │ [QUERY DB]  ││
│ │CASE 08  ││  └────────────────┘ └────────────────┘  │ │  15 min      ││
│ └────────┘│   COMPARE: addr↔addr → MISMATCH ⚑        │ └────────────┘│
├───────────┴─────────────────────────────────────────┴───────────────┤
│  [APPROVE]  [DENY]  [CONDITIONAL ▾]  [ESCALATE 2/3]  [FLAG ⚑]         │
└─────────────────────────────────────────────────────────────────────┘
```

### 9.2 Document Viewer (zoom state)

```
┌──────────── DOCUMENT: CLEARANCE_CODE ── CASE 06 [✦ CEC] ────────────┐
│  FIELD          VALUE            CHECK STATE                          │
│  code           7F3-889-A2       ⏱ EXPIRES 14:00 (in 18 min)          │
│  issuer         ████████         ✓ compared (match)                    │
│  service-no     ████████         ○ not compared                        │
│  seal           [image]          ○ not compared                        │
│                                                                        │
│  [COMPARE WITH…▾]   [FLAG THIS FIELD]   [BACK TO PANES]                │
└────────────────────────────────────────────────────────────────────────┘
```

### 9.3 Meters Strip (persistent, all states)

```
│ STRESS ▓▓▓▓░░░░ 41 │ FATIGUE ▓▓▓░░░░ 34 │ ₡H 214 │ MORTGAGE 6d │ ⚠ 1 │
   (turns ► RED band at 50/75 breakpoints; alert badge opens notice list)
```

### 9.4 Commute Screen

```
┌────────────── ROUTE SELECT — 07:02 · shift 08:00 ──────────────┐
│  ○ WALKWAY      free    ~40m   fatigue +10   risk ⚠⚠⚠            │
│  ● AIR BUS      ₡H 4    ~25m   fatigue +5    risk ⚠⚠             │
│  ○ SKY-LANE     ₡H 9    ~12m   fatigue +2    risk ⚠  [permit 11d]│
│  ETA if departing now: 07:27                        [ DEPART ]    │
├──────────────────────────────────────────────────────────────────┤
│  ── in transit ──  events resolve as interrupt cards:            │
│  ┌────────────────────────────────┐                              │
│  │  ⚠ SKY-TRAFFIC DELAY (sev 2)   │                              │
│  │  +10 min · new ETA 07:37        │                              │
│  │            [ CONTINUE ]         │                              │
│  └────────────────────────────────┘                              │
└──────────────────────────────────────────────────────────────────┘
```

### 9.5 Checkpoint Screen

```
┌──────────────────── CHECKPOINT — SECTOR GATE ────────────────────┐
│   CYBORG PRESENCE: YES        ROBOT SCAN: ACTIVE                   │
│                                                                    │
│   REQUIRED: SKYLANE_PERMIT      status: ✓ VALID (11 days)          │
│   ID SCAN…                      status: ✓ MATCH                    │
│   CARGO SWEEP…                  status: ▓▓▓▓▓░░░░ scanning         │
│                                                                    │
│   time +10 min · stress +8                                         │
│   [ WAIT ]                     (no other input during scan)        │
└────────────────────────────────────────────────────────────────────┘
   outcome banner: PASS / CITATION ₡25 / CONFISCATED / ▓ DETAINED ▓
```

### 9.6 Pod Maintenance Screen

```
┌────────────── POD 04 — 06:20 ──────────────┐
│ FILTER   ▓▓▓▓▓▓░░░░ 61%   [REPLACE ₡H 120]  │
│ NOISE    ▓▓░░░░░░░░ low                      │
│ UTILITIES: NORMAL                            │
│ SLEEP FORECAST: ▓▓▓▓▓░░░░░ 54                │
│ MORTGAGE  ₡H 610 due 6d   wallet ₡H 214      │
│ [PAY EARLY] [GRAY MARKET*] [SKIP]            │
│            (*if COMBINE ≥ +40)               │
└──────────────────────────────────────────────┘
```

### 9.7 Daily Summary Screen

```
┌──────────────── DAY 14 / 45 — SUMMARY ────────────────┐
│ CASES     9 closed / 8 quota            [+₡H 45 bonus] │
│ STAMPS    A:5  D:2  C:1  E:1            flags: 4        │
│ AUDITS IN 2 days: 9 pending                             │
│ TOKENS    2 (▼1 expiring day 16)        standing 62 ▲2  │
│ WAGES     +₡H 61 → ₡H 214    MORTGAGE due day 20        │
│ STRESS 41 ▲6   FATIGUE 58 ▲13   SLEEP FORECAST 54       │
│ FACTIONS  MEC +5 ▸ 23 │ CEC −3 ▸ −12 │ RC 0 │ COM +0    │
│           JGC 0      │ SMC +1                           │
│                              [ CONTINUE → DAY 15 ]      │
└─────────────────────────────────────────────────────────┘
```

---

*End of system skeleton. Constants trace to `MECHANICS_DOCUMENT.md`; narrative/ending layers plug in via `EventManager` subscriptions and `TerminalCheck()` only.*
