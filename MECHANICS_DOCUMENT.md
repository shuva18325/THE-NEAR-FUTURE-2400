# THE NEAR FUTURE: 2400
### Core Mechanics Document — v1.0

**Scope:** Mechanical skeleton and moment-to-moment gameplay only. No lore, no story, no worldbuilding. Faction names appear strictly as system labels. Companion document to `GAME_DESIGN_DOCUMENT.md` (resolves Open Question 24.1: undefined core work-task gameplay).

---

## TABLE OF CONTENTS

1. Core Player Role
2. Core Gameplay Verb: ADJUDICATE
3. Daily Work Loop
4. Interacting Systems
   - 4.1 Mortgage Processing
   - 4.2 Permit & ID Verification
   - 4.3 Faction Influence
   - 4.4 Stress & Fatigue
   - 4.5 Commute Mechanics
5. Failure States
6. UI / UX Skeleton
7. Session Structure

---

## 1. CORE PLAYER ROLE

- The player is a **loan-servicing clerk** at a bank branch inside the megastructure where he also lives (pod, mortgage, shared hallway).
- He processes financial and administrative cases for four client categories: **humans, robots, cyborgs, and faction representatives**.
- He has **no special abilities, no combat, no plot armor**. Every mechanical advantage he ever gains is a better desk tool, a better commute option, or a better-informed decision.
- All gameplay flows through three spaces: **the desk** (work), **the commute** (transit), **the pod** (recovery/maintenance). Nothing else is a playable verb space.

```
        ┌──────────┐   commute    ┌──────────┐   commute    ┌──────────┐
        │   POD     │────────────►│   DESK    │────────────►│   POD     │
        │ (recover, │              │ (ADJUDI-  │              │ (maintain,│
        │  maintain)│◄────────────│   CATE)   │◄────────────│  decide)  │
        └──────────┘              └──────────┘              └──────────┘
```

---

## 2. CORE GAMEPLAY VERB: ADJUDICATE

**The single primary verb is ADJUDICATE: read a case, verify its claims against records and current rules, and stamp a decision.**

This is Risk Assessment implemented through a document interface: every case is a request (loan renewal, permit, restructuring, clearance) that the player must APPROVE, DENY, ESCALATE, or APPROVE-WITH-CONDITIONS — and every decision is checkable, logged, and audited later.

### 2.1 Anatomy of a Case

Every case is built from the same five layers:

| Layer | Contents | Player Action |
|---|---|---|
| **Request Slip** | What the client wants (1 line: type + amount/duration) | Read |
| **Identity Sheet** | Name/designation, ID serial, class-chip tier, photo/chassis print | Match against Records |
| **Supporting Documents** | 2–6 items: pay stubs, permits, prior contracts, maintenance logs | Verify each (dates, seals, serials, checksums) |
| **Records Database Entry** | The bank's own file on the client: balance, arrears, flags, history | Cross-reference |
| **Today's Directive Sheet** | Current rules: rate tables, banned categories, quota targets, special orders | Apply |

### 2.2 Sub-Verbs (the moment-to-moment loop inside one case)

1. **PULL** — drag the next case from the queue to the desk.
2. **SPLIT** — lay documents side-by-side in the compare panes (max 2 visible at once at base desk tier; upgradeable to 3).
3. **INTERROGATE A FIELD** — click any field on any document to highlight it; click a second field to run a **COMPARE**. Mismatch → flagged discrepancy.
4. **QUERY** — request the Records Database entry (takes 5 in-game seconds; queue keeps moving — queries are a time-spend decision).
5. **FLAG** — mark a discrepancy formally. Each flag must cite two conflicting fields. Correct flags protect the player in later audits; frivolous flags cost time and standing.
6. **STAMP** — commit one of four decisions:

| Stamp | Effect | Constraint |
|---|---|---|
| **APPROVE** | Request granted, case closed | — |
| **DENY** | Request refused, case closed; requires ≥1 cited rule or flag | Uncited denials count as errors |
| **ESCALATE** | Case sent to supervisor, no accuracy risk | **Limited: 3 slots/day.** Unused slots convert to small standing bonus |
| **CONDITIONAL** | Approve with attached terms (higher rate, shorter term, collateral) | Only valid on case types that permit terms; wrong usage = error |

### 2.3 Decision Correctness — Two Independent Axes

Every stamped case is scored later (see audit lag, 2.4) on two axes that **do not always agree**:

- **Factual Accuracy** — did the decision match the evidence? (Forged doc denied = accurate; clean doc denied = error.)
- **Institutional Compliance** — did the decision match today's Directive Sheet, *including directives that contradict the evidence*? (Some days a directive orders blanket denial of a category regardless of merit.)

On most cases the axes align. On **narrative-conflict cases** (5–15% of daily queue, rising by act) they diverge, and the player must choose which axis to satisfy. Both axes feed different meters (Accuracy → Error Ledger; Compliance → Supervisor Standing + propaganda score). This tension is the game's core decision engine.

### 2.4 Audit Lag

- Errors are **not revealed at stamp time.** Every closed case enters a 1–3 day audit pipeline.
- Audit results arrive as morning **Discrepancy Notices**: each confirmed error adds an **Error Token** to the player's ledger (Section 5).
- Correctly-cited flags and correct escalations *remove* tokens.
- Effect: the player never gets instant confirmation, so confidence, memory, and note-taking matter. Yesterday's shortcuts arrive as today's tokens.

### 2.5 Case Adjudication Flow (diagram)

```
   PULL case
     │
     ▼
   Read Request Slip ──► Identity match vs Records? ──NO──► FLAG + DENY/ESCALATE
     │                                │
     ▼                              YES
   Verify each supporting doc         │
   (dates, seals, serials)            ▼
     │                        Rules check vs Directive Sheet
   discrepancy?                        │
     │  YES → FLAG (cite 2 fields)     ▼
     │                        Evidence and directive agree?
     ▼                                │
   All docs clean ────────────► YES: STAMP (approve/deny per rules)
                                      │
                                      NO: NARRATIVE-CONFLICT CASE
                                      choose axis → STAMP or ESCALATE
```

---

## 3. DAILY WORK LOOP

A full workday is one **shift** of continuous case adjudication bracketed by fixed phases.

### 3.1 Shift Structure

| Phase | Duration (real-time target) | Mechanics |
|---|---|---|
| **Clock-in** | 30 sec | Arrival time recorded (commute outcome). Late = docked pay + standing hit. Directive Sheet + Discrepancy Notices delivered. |
| **Morning Block** | 6–8 min | Case queue opens. Quota counter starts. |
| **Lunch Break** | 1 min | Choose one: eat (−hunger, −small stress), work through (+1 case capacity, +stress), socialize (+faction/coworker info, −fatigue recovery). |
| **Afternoon Block** | 6–8 min | Queue continues. Faction-tagged and narrative-conflict cases weighted toward this block. |
| **Clock-out** | 1 min | End-of-Day Summary (3.6). Overtime option if quota unmet (+cases, +fatigue, +stress). |

### 3.2 Incoming Cases

- Cases arrive in a visible **queue** (depth 3–7 visible; more waiting unseen).
- Daily **quota**: starts at 8 cases/day (Act I), scales to 14 (Act III).
- Queue composition is procedurally assembled each day from weighted pools: routine (60–80%), discrepancy-seeded (15–30%), faction-tagged (5–15%), narrative-conflict (5–15%).

### 3.3 Client Types (mechanical differences only)

| Client Type | Extra Verification Step | Unique Document | Failure Mode It Introduces |
|---|---|---|---|
| **Human** | Photo/ID match | Pay stubs, residency ID | Forgery, identity mismatch |
| **Robot** | Chassis-print scan + caste-class check | Caste certificate, owner authorization | Caste-tier violations (interacting above player's licensed tier = automatic error unless escalated) |
| **Cyborg** | Clearance-code validation (time-sensitive: codes expire same-day) | Service record, command-net authorization | Expired codes; pressure to skip validation |
| **Faction Rep** | Countersignature check | Letter of instruction (may conflict with Directive Sheet) | Direct pressure mechanics (Section 4.3) |

### 3.4 Document Types (master list)

- Identity: residency ID, class-chip readout, chassis print, clearance code sheet.
- Financial: pay stub, balance statement, prior contract, arrears notice, restructuring proposal.
- Permits: sky-lane permit, air-bus pass, travel-class certificate, filter certification.
- Authority: caste certificate, owner authorization, letter of instruction, countersignature card, directive sheet (player-side).
- Each document carries 3–6 checkable fields; forgeries alter exactly 1–2 fields (never zero, never more than two — the design guarantee that every discrepancy is findable but never free).

### 3.5 Supervisor Review

- **Weekly scheduled review** (every 5th day): Standing meter adjusted from the week's compliance, quota, and error-token totals. Consequences at thresholds (Section 5.3).
- **Random spot audit** (10% chance/day, rising with high Error Ledger): supervisor pulls one of today's closed cases live; player must justify the stamp by re-citing the fields used. Correct citation = standing bonus. Failure = double error token.

### 3.6 End-of-Day Summary (fixed screen, every day)

```
┌──────────────── DAY 14 — SHIFT SUMMARY ────────────────┐
│ Cases closed:        9 / 8 quota          [+₡H 45 bonus]│
│ Escalations used:    1 / 3                              │
│ Flags filed:         4  (audit pending: 4)              │
│ Compliance score:    92%                                │
│ Error tokens:        2  (1 expiring)                    │
│ Supervisor standing: ▓▓▓▓▓▓░░░░  62                     │
│ Wages today:         ₡H 61   → balance ₡H 214           │
│ Mortgage due in:     6 days  (₡H 610)                   │
│ Stress: ▓▓▓▓░░░░░░ 41   Fatigue: ▓▓▓▓▓▓░░░░ 58          │
│ Faction pressure changes:  [MEC +5] [CEC −3]            │
└─────────────────────────────────────────────────────────┘
```

---

## 4. INTERACTING SYSTEMS

### 4.1 Mortgage Processing (case family)

The largest case family; also the system the player is personally inside.

| Case Type | Player Task | Special Rule |
|---|---|---|
| **Pod mortgage renewal** | Verify income vs. rate table; stamp new term | CONDITIONAL stamp available (rate/term adjustments) |
| **Delinquency check** | Compare payment history vs. arrears thresholds; classify Stage 1–4 | Misclassification is a double-weight error |
| **Slum debt restructuring** | Match proposal against restructuring rules; verify hardship documents | Highest forgery rate of any case family |
| **Foreclosure warning** | Confirm Stage 4 status; issue or refuse the warning | Refusing a valid Stage 4 = compliance hit; issuing an invalid one = accuracy hit. Frequent narrative-conflict case |
| **Robot-assisted audit** | A Class-B audit unit pre-marks suspected fields; player confirms or overrides each mark | Unit is right ~85% of the time. Blind-confirming everything is faster but inherits its errors; overrides cost time but catch the 15% |

**Reflexive rule:** the player's own mortgage runs on the same Stage 1–4 delinquency ladder as the cases he processes (Section 5.5). The UI is identical.

### 4.2 Permit & ID Verification (case family)

| Case Type | Checkable Fields | Time Cost | Twist |
|---|---|---|---|
| Sky-lane permit | Serial, class tier, expiry, vehicle match | Low | Player's own commute uses this permit type |
| Air-bus travel pass | Route code, class tier, date window | Low | Bulk batches (3–5 at once) — speed vs. accuracy pressure |
| Slum residency ID | Photo, pod address, Stack code, issue date | Medium | Address database lags reality by up to 10 days (legitimate mismatches exist) |
| Cyborg checkpoint clearance | Clearance code (same-day expiry), service record | High | Codes expire during the shift — a valid morning case can become invalid by afternoon |
| Robot caste classification | Chassis print, caste certificate, owner authorization | High | Player may not process above his licensed tier — must ESCALATE, consuming a limited slot |

### 4.3 Faction Influence

Six pressure sources, mechanically identical in skeleton, distinct in currency. Each has a **meter (−100 … +100, start 0)**.

**Shared pressure mechanic:** factions inject **tagged cases** into the queue (visibly marked with a seal). Each tagged case carries a *requested outcome* that may or may not match the evidence. Complying moves the meter up; refusing moves it down. Meter position changes what the faction sends the player next.

| Faction (label only) | Pressure Mechanic | Reward (meter ≥ +40) | Penalty (meter ≤ −40) |
|---|---|---|---|
| **Mars elites (MEC)** | Expedite/approve waiver cases beyond rate rules | Monthly credit bonus (+₡H 150); Priority commute discounts | Audit frequency doubled (their auditors) |
| **Cyborg enforcement (CEC)** | Approve clearance cases with missing/expired codes | Checkpoint waves player through (commute time −30%) | Checkpoint stops every commute (+delay, +stress/day) |
| **Robot council** | Requests accurate rulings on robot caste cases *against* directive pressure | Free Class-D desk assistant (auto-verifies 1 field/case) | Records Database queries slow from 5s → 12s |
| **Slum syndicates (Combine)** | Overlook specific flagged discrepancies on named accounts | Gray-market goods access (cheap filters, real food = stress relief) | Random pod "incidents": filter theft, queue-jumping penalties |
| **Jupiter gas barons (JGC)** | Bulk-approve worker restructuring denials | Hazard-pay side contracts (+₡H 80/batch) | Their tagged cases arrive forged *and* pre-flagged to frame the player (+error tokens) |
| **Saturn moon councils (SMC)** | Asks only for accurate processing of co-op cases; never requests violations | Care packages: fatigue recovery +20% for 3 days | None (meter can drop but SMC issues no penalties — its "penalty" is simply losing the reward) |

**Design rules:**
- Complying with one faction's tagged case mechanically shifts at least one rival meter down (visible in End-of-Day Summary).
- Meter positions decay 1 point/day toward 0 (pressure must be maintained by factions and player alike).
- At meter extremes (±80), the faction's tagged cases stop being requests and become **tests** — deliberately contradictory cases checking loyalty, with doubled meter swings.

### 4.4 Stress & Fatigue

Two separate meters with different clocks:

| Meter | Range | Fills From | Drains From | Effect Ramp |
|---|---|---|---|---|
| **Stress** | 0–100 | Time pressure, checkpoint stops, faction refusals, spot audits, arrears notices | Eating real food, pod leisure, hallway social, gray-market goods | 50+: stamp hand drifts (stamps can land on wrong decision if clicked hastily). 75+: COMPARE tool highlights 1 wrong field per case (false positive). 100: **Breakdown event** |
| **Fatigue** | 0–100 | Each shift block (+15), overtime (+15), commute delays, poor sleep | Sleep (quality scaled by pod condition: filter %, noise events) | 50+: document drag speed −25%. 75+: one queue alert per day silently missed. 100: **Collapse event** |

- **Breakdown event (Stress 100):** shift ends immediately, day counts as quota-missed, stress resets to 60, standing −10.
- **Collapse event (Fatigue 100):** player oversleeps next day (auto-late), fatigue resets to 50, one random faction meter −10 (missed tagged case).
- **Burnout state:** 3 breakdown/collapse events within any 10-day window → 2 forced unpaid leave days (mortgage clock keeps running). This is the overwork spiral made mechanical.

### 4.5 Commute Mechanics

The commute is a **route-selection risk system** played twice daily. Player picks one of three routes; events then roll against the route's risk profile.

| Route | Cost | Base Time | Fatigue | Event Risk Profile |
|---|---|---|---|---|
| **Walkway + freight lift** | Free | 40 min | +10 | High slum-event chance, no checkpoint risk |
| **Air bus** | ₡H 4/trip | 25 min | +5 | Medium delay chance, medium checkpoint chance |
| **Sky-lane (own permit)** | ₡H 9/trip + permit current | 12 min | +2 | Low delay, but permit is checkable — lapsed permit = citation |

**Event table (rolled per trip):**

| Event | Chance | Modifier Sources | Effect |
|---|---|---|---|
| Sky-traffic delay | 20% base | +15% during morning peak | +5–20 min; arrival lateness cascades into shift |
| Hydrogen spill reroute | 8% | +10% day after any spill news event | +15–30 min, +5 stress, all routes affected |
| Cyborg checkpoint | 15% | CEC meter ≤ −40: 100%; CEC ≥ +40: 0% | +10 min, +8 stress; ID/permit checked — lapsed docs escalate |
| Robot inspection | 10% | Doubles if carrying gray-market goods | +5 min; contraband confiscated on failed roll |
| Slum event (walkway only) | 25% | — | 50/50 positive/negative: found goods, neighbor favor, petty theft, queue blockage |

**Design intent:** the commute converts money into time and safety. Poverty (walkway) costs time, fatigue, and event exposure; the sky-lane's speed is rented, per-trip, on documents that can themselves lapse.

---

## 5. FAILURE STATES

There is **no instant game-over** from work performance. Failure is a set of compounding ladders.

### 5.1 What a "Bad Day" Looks Like (mechanical cascade)

```
late arrival (commute event)
   → shortened shift → quota missed
      → pay docked → mortgage buffer shrinks
         → overtime taken to compensate → fatigue spike
            → next-day errors → error tokens (2 days later)
               → spot audit triggered → standing drop
                  → weekly review penalty → wage cut
```
Every link is individually survivable; the failure state is the *chain*.

### 5.2 Error Ledger

- Confirmed errors (from audit lag) accumulate as **Error Tokens**. Tokens expire after 15 days.
- Thresholds: **5 tokens** = formal warning (standing −10). **8** = probation (quota +2, no overtime pay). **12** = demotion (wage −20%, case variety reduced — fewer interesting cases, same bills). **16** = termination track: 5-day "performance plan"; failing it = job loss (see 5.6).

### 5.3 Supervisor Standing (0–100, start 50)

- ≥75: pick 1 desk upgrade per week (extra compare pane, faster queries, +1 escalation slot).
- 40–74: neutral.
- ≤39: random spot audits double; escalation slots reduced to 2.
- ≤15: demotion regardless of Error Ledger.

### 5.4 Faction Pressure Spike

- Any meter reaching **−80** triggers that faction's **Retaliation Event** within 3 days (a scripted mechanical hit from its penalty column at triple magnitude, e.g. CEC: detained a full morning — half-day shift; JGC: three framed cases in one queue).
- Any meter reaching **+80** triggers a **Test Case** (Section 4.3). Failing a test drops the meter 40 points instantly.

### 5.5 Mortgage Lapse (the player's own Stage ladder)

| Stage | Trigger | Effect |
|---|---|---|
| 1 — Notice | 1 missed payment | Warning letter; no mechanical effect yet |
| 2 — Penalty interest | 2 consecutive missed | Monthly payment +15% until cleared |
| 3 — Restructuring | 3 consecutive missed | Forced longer term; permanent +5% payment; pod utilities rationed (sleep quality −20%) |
| 4 — Foreclosure transfer | 4 consecutive missed | Pod reassigned. Player relocated to a lower-tier pod: worse filter ceiling, worse sleep quality, longer commute (all three route times +10 min). **Not game over — life gets mechanically worse and stays worse.** |

### 5.6 Job Loss

- Losing the bank job (termination track) shifts the game to **gig-work mode**: daily random task menu at ~60% of wage, no standing meter, no faction reward channels, mortgage ladder still running.
- A rehire path exists (20-day clean gig record + application). Gig-work mode is deliberately viable but strictly worse — a floor, not a pit.

### 5.7 Stress/Fatigue Max

Covered in 4.4: breakdown, collapse, and the 3-strikes burnout leave. None are game-overs; all feed the 5.1 cascade.

---

## 6. UI / UX SKELETON

### 6.1 Work Desk Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ STRESS ▓▓▓▓░░ 41 │ FATIGUE ▓▓▓░░░ 34 │ QUOTA 5/8 │ TIME 13:42 │ ⚠ 1 │
├───────────┬─────────────────────────────────────────┬───────────────┤
│  QUEUE     │           DOCUMENT VIEWER                │  RULE PANEL    │
│ ┌───────┐ │  ┌───────────────┐ ┌───────────────┐   │ ┌───────────┐ │
│ │CASE 06 │ │  │  DOC A         │ │  DOC B         │   │ │ DIRECTIVE  │ │
│ │[MEC ✦] │ │  │  (compare      │ │  (compare      │   │ │ SHEET      │ │
│ ├───────┤ │  │   pane 1)      │ │   pane 2)      │   │ ├───────────┤ │
│ │CASE 07 │ │  └───────────────┘ └───────────────┘   │ │ RATE       │ │
│ ├───────┤ │   [field highlight → COMPARE → FLAG]     │ │ TABLES     │ │
│ │CASE 08 │ │                                          │ ├───────────┤ │
│ └───────┘ │  ┌────────────────────────────────────┐  │ │ RECORDS    │ │
│            │  │ RECORDS DB RESULT (after QUERY, 5s) │  │ │ QUERY btn  │ │
│            │  └────────────────────────────────────┘  │ └───────────┘ │
├───────────┴─────────────────────────────────────────┴───────────────┤
│   [APPROVE]   [DENY]   [CONDITIONAL ▾]   [ESCALATE 2/3]   [FLAG]      │
└─────────────────────────────────────────────────────────────────────┘
```

- **Meters strip (top):** always visible; stress/fatigue/quota/clock plus an alert badge (⚠) for pending Discrepancy Notices.
- **Faction pressure UI:** not on the desk. Meters are only visible on the End-of-Day Summary and the pod terminal — during the shift the player sees only the tagged-case seal, not the meter. (Design intent: pressure is felt as individual cases, reviewed as trend lines.)
- **Alerts:** queue-side toasts (new tagged case, code-expiry warning on open cyborg cases, spot-audit incoming with 30-second warning).

### 6.2 Commute UI

```
┌────────────── ROUTE SELECT — 07:02 ──────────────┐
│  ○ WALKWAY      free    ~40m   fatigue +10   ⚠⚠⚠  │
│  ● AIR BUS      ₡H 4    ~25m   fatigue +5    ⚠⚠   │
│  ○ SKY-LANE     ₡H 9    ~12m   fatigue +2    ⚠    │
│                     [permit: VALID 11d]            │
│  shift starts 08:00 — current ETA 07:27           │
│                                     [ DEPART ]     │
└────────────────────────────────────────────────────┘
   (events resolve as interrupt cards during transit)
```

### 6.3 Pod Maintenance UI (evening terminal)

```
┌────────────── POD 04 — EVENING ──────────────┐
│ FILTER  ▓▓▓▓▓▓░░░░ 61%   [replace ₡H 120]     │
│ SLEEP QUALITY forecast: ▓▓▓▓▓░░░░░ (noise −1) │
│ MORTGAGE  ₡H 610 due in 6d   balance ₡H 214   │
│ FACTION METERS  [view trends ▾]               │
│ EVENING ACTION (pick 1):                       │
│   ○ Rest        (stress −15)                   │
│   ○ Hallway     (social/info, stress −8)       │
│   ○ Side gig    (+₡H 25, fatigue +10)          │
│   ○ Study rules (next-day compliance hint)     │
│                            [ SLEEP ]           │
└────────────────────────────────────────────────┘
```

---

## 7. SESSION STRUCTURE

### 7.1 Time Budget

- **One in-game day = 18–25 real minutes** (commute ~2×2 min, shift 14–18 min, pod 2–3 min).
- **One session = 1–3 days** — the day is the natural save/stop unit; autosave at every SLEEP.

### 7.2 Campaign Length

- **Baseline campaign: 45 in-game days**, structured as three acts of ~15 days.
- Total playtime target: **15–20 hours** first run; endings variance drives replays of Acts II–III.

### 7.3 Progression (within this mechanics scope)

| Vector | How It Advances | What It Unlocks |
|---|---|---|
| **Clearance tier** | Standing + days served | New case families (robot caste cases, cyborg clearances arrive at tiers 2–3) |
| **Desk upgrades** | Weekly high-standing picks | 3rd compare pane, query speed, +1 escalation slot, auto-checksum tool |
| **Player skill** | Non-mechanical (pattern literacy) | The real progression: forgery patterns recur; veterans clear routine cases in 30 seconds |
| **Financial position** | Wages vs. costs | Route options, filter quality, stress-relief purchases — comfort is purchasable, permanence is not |

### 7.4 Difficulty Scaling by Act

| Dial | Act I (d1–15) | Act II (d16–30) | Act III (d31–45) |
|---|---|---|---|
| Daily quota | 8 | 11 | 14 |
| Document fields per case | 3–4 | 4–5 | 5–6 |
| Forgery rate | 15% | 22% | 30% |
| Narrative-conflict cases | 5% | 10% | 15% |
| Faction-tagged cases/day | 0–1 | 1–2 | 2–3 |
| Directive Sheet changes | Weekly | Twice weekly | Daily (occasionally mid-shift) |
| Audit lag | 3 days | 2 days | 1 day |

Scaling philosophy: the *verb never changes* — ADJUDICATE on day 45 is the same verb as day 1. Difficulty comes from denser documents, faster rule churn, and more cases where accuracy and compliance point in opposite directions.

---

*End of mechanics document. Lore, factions, narrative, and endings: see `GAME_DESIGN_DOCUMENT.md`.*
