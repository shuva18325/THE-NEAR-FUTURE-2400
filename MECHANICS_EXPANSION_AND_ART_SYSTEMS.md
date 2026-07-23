# THE NEAR FUTURE: 2400
### Mechanics Expansion & Art Systems — v1.0

**Scope:** The mechanical + artistic expansion layer. Expands every system in `SYSTEM_SKELETON.md`, adds missing rules/edge cases/counterplay, provides full-size ASCII UI layouts, multi-layer interaction diagrams, complete module blueprints, and real TypeScript code. **No lore. No factions-as-fiction (faction IDs appear only as system labels). No worldbuilding. No narrative.**

**Code status:** Everything marked **[LIVE]** is implemented, compiled, and simulation-tested in [`engine/`](./engine/) as of this document's commit. Everything marked **[SPEC]** is fully specified here and scheduled for the next integration pass.

---

## TABLE OF CONTENTS

1. Mechanics Expansion
2. Art + UI Expansion (13 wireframes)
3. System Interaction Expansion (diagrams)
4. Module Blueprint Expansion (14 modules)
5. Code Expansion (real TypeScript)
6. Integration Matrix

---

# 1. MECHANICS EXPANSION

## 1.1 Work Desk — Expanded Verb Set

The base verb set (PULL / SPLIT / COMPARE / QUERY / FLAG / STAMP) gains:

| New Verb | Cost | Limit | Effect | Status |
|---|---|---|---|---|
| **DEFER** | 4 min + 1 slot | 2 slots/day, once per case | Push the open case to the back of the queue. Counterplay for expiring clearance codes, tagged cases you want to decide after lunch, or a bad stress moment. | **[LIVE]** |
| **CHECKSUM SCAN** (passive) | free | requires AUTO_CHECKSUM upgrade | On pull, the desk device validates SERIAL/CODE internal checksums. Detects checksum-breaking forgeries only; never false-positives; other archetypes pass silently. | **[LIVE]** |
| **BATCH PROCESS** | 60% of summed time | PASS_AIRBUS family only, 3–5 cases | Air-bus passes arrive as a batch; one stamp resolves all. One forged pass poisons the whole batch (all graded individually at audit). Speed vs. contamination risk. | **[SPEC]** |
| **MEMO** | 2 min | 3/day | Pin a private note to a closed case. If that case is later spot-audited, a memo citing the right field auto-passes the audit. Externalizes memory. | **[SPEC]** |

### 1.1.1 Time Cost Table (consolidated, expanded)

| Action | Base (min) | FAST_QUERY | RC penalty | Fatigue ≥ 50 | Notes |
|---|---|---|---|---|---|
| PULL | 2 | — | — | — | + read cost per doc |
| READ (per doc) | 5 | — | — | ×1.25 | auto on pull |
| SPLIT | 1 | — | — | — | pane arrange |
| COMPARE | 3 | — | — | — | stress ≥75: 1 false highlight/case possible |
| QUERY | 15 | **8** | **36** | — | one per case, cached |
| FLAG | 5 | — | — | — | must cite a field |
| STAMP | 2 | — | — | — | drift risk if hasty |
| DEFER | 4 | — | — | — | +1 slot consumed |
| ESCALATE | (via stamp) | — | — | — | consumes 1 of 3–4 slots |

## 1.2 Document Verification — Forgery Archetypes **[LIVE]**

Forgeries are no longer a generic mark. Each field class is falsified the way that class *would* be falsified, giving players learnable patterns:

| Archetype | Field classes | Mutation | Detectable by |
|---|---|---|---|
| **CHECKSUM_BREAK** | SERIAL, CODE | one digit shifted | COMPARE vs record; AUTO_CHECKSUM (free) |
| **DATE_SHIFT** | DATE, EXPIRY | +1–3 days | COMPARE vs record; cross-doc date logic |
| **SEAL_SWAP** | SEAL | wrong seal index | COMPARE vs record only |
| **TIER_BUMP** | TIER | +1 tier | COMPARE vs record; tier tables in rule panel |
| **TRANSPOSE** | NAME, ADDRESS, others | two adjacent chars swapped | COMPARE vs record; hardest to eyeball |

**Invariants (all enforced at generation):**
- Every forged document alters exactly 1–2 checkable fields.
- A mutation always produces a value different from the original (guard character appended if a transform is idempotent).
- 70% of forgeries are single-field; 30% two-field.

**Edge cases:**
| Case | Ruling |
|---|---|
| Legit DB-lag ADDRESS mismatch flagged | Flag audits at weight 0 — no token, no claw-back (fields listed in `RecordEntry.lagSafe`) |
| TRANSPOSE on a 1-char value | Falls to guard character — mismatch still guaranteed |
| Two-field forgery where player finds only one | DENY still grades correct; the flag still claws back |
| AUTO_CHECKSUM on a SEAL_SWAP forgery | No hint — device only covers SERIAL/CODE; player must still work |

## 1.3 Stamp Drift — Expanded

| Parameter | Value |
|---|---|
| Activation | stress ≥ 50 |
| Probability | `(stress − 50) / 250` → 0% at 50, 20% at 100 |
| Drift map | APPROVE ↔ CONDITIONAL; DENY → ESCALATE (slot available) else DENY holds |
| **Counterplay** | `deliberate` stamp (UI: hold 0.5s) bypasses drift entirely — drift punishes haste, not hands |
| **Telegraph [SPEC]** | At stress ≥ 50 the stamp cursor visibly sways; sway amplitude = drift probability. The player can *see* their own hands getting unreliable. |
| Edge case | Drifted DENY→ESCALATE consumes a slot like any escalation and still carries zero accuracy risk — drift is never a hidden error source, only a decision changer |

## 1.4 Stress Scaling — Chronic Floor **[LIVE]**

New long-arc pressure on top of the daily meter:

```
 stress ends day ≥ 70  ──× 3 consecutive days──►  CHRONIC FLOOR = 10
 stress ends day ≤ 40  ──× 2 consecutive days──►  floor clears to 0
```

- While the floor is active, **no relief source** (rest, food, gray-market goods, overnight recovery) can take stress below 10.
- Mixed days (41–69) reset both counters — the mechanic tracks *sustained* extremes only.
- Effect: sustained overwork permanently taxes the recovery economy until the player buys two genuinely calm days — which cost quota, money, or faction goodwill to arrange.

### 1.4.1 Stress Source Table (consolidated)

| Source | Δ Stress | Source | Δ Stress |
|---|---|---|---|
| Case closed | +2 | Checkpoint (pass) | +3 |
| Spot audit | +6 | Checkpoint (secondary) | +8 |
| No lunch | +5 | Bribe attempt | +5 |
| Overtime | +5 | Spill reroute | +5 |
| Bad air (filter ≤ 20%) | +4/day | Commute delay | +1/severity |
| **Relief** | | | |
| Lunch (eat) | −6 | Evening rest | −15 |
| Lunch (socialize) | −3 | Evening hallway | −8 |
| Overnight | −(10 + quality/4) | | floor-clamped |

## 1.5 Faction Pressure Math — Expanded **[LIVE]**

### 1.5.1 Refusal Escalation Ladder

Refusing the same faction repeatedly is no longer flat:

```
refusal #1: −6      refusal #2: −8      refusal #3: −10     refusal #4+: −12 (cap)
comply or pass a test: streak resets to 0
ESCALATE: −3, streak unchanged (the faction notices the dodge but doesn't escalate)
```

### 1.5.2 Full Delta Table

| Event | Δ own meter | Δ each rival | Notes |
|---|---|---|---|
| Comply (normal tag) | +8 | −4 | rival hit = −ceil(delta/2) |
| Comply (test case) | +16 | −8 | tests at rep ≥ +80 |
| Refuse (streak n) | −(6 + 2·(n−1)), cap −12 | 0 | escalation ladder |
| Fail test | −40 | 0 | instant |
| Escalate a tag | −3 | 0 | half-refusal |
| Daily decay | −sign(rep) | — | drift toward 0 |
| Failed bribe (CEC) | −5 | — | checkpoint path |
| Confiscated contraband (COMBINE) | −5 | — | checkpoint path |

### 1.5.3 Rival Coupling Matrix

```
            affects ▶   MEC   CEC   RC   COMBINE  JGC   SMC
 comply with ▼
 MEC                     ·     ·    −½      −½      ·     ·
 CEC                     ·     ·     ·      −½      ·     ·
 RC                     −½     ·     ·       ·      ·     ·
 COMBINE                −½    −½     ·       ·      ·     ·
 JGC                     ·     ·     ·       ·      ·    −½
 SMC                     ·     ·     ·       ·     −½     ·
                        (−½ = minus half the comply delta, rounded up)
```

## 1.6 Commute — Expanded Event Logic

| Expansion | Rule | Status |
|---|---|---|
| Morning peak window | Departures 06:30–07:30: DELAY +15% | [LIVE] |
| Act III congestion | DELAY +10% | [LIVE] |
| Evening checkpoints | Return trips: CHECKPOINT +10% | [LIVE] |
| Spill memory | SPILL_REROUTE +10% the day after any spill | [LIVE] |
| Contraband heat | ROBOT_INSPECTION ×2 while carrying | [LIVE] |
| Event cap | Max 2 non-checkpoint events/trip; a rolled CHECKPOINT is never discarded | [LIVE] |
| **Departure window [SPEC]** | Player picks departure 06:15–07:45 in 15-min steps. Earlier = pre-peak (DELAY −10%) but −sleep (fatigue +3/step before 06:45). Later = post-peak but late-arrival risk. Converts the commute from route-only into route × timing. | [SPEC] |
| **Severity curve** | severity 1/2/3 at 60/30/10% — DELAY costs 7/14/21 min, SPILL 17/24/31 min | [LIVE] |

## 1.7 Checkpoint — Bribe Sub-Branch **[LIVE]**

```
 SECONDARY entered (lapsed permit or contraband found)
    │
    ├── agent declines bribe ──────────────► detain roll (base path)
    │
    └── agent offers bribe (₡H 40, paid up front)
           │
           ├── success  p = 0.70 (+0.15 if CEC rep ≥ 0)
           │      └─► PASS · +10 min · +5 stress · money gone
           │
           └── failure
                  ├─► CEC −5 (it goes in the report)
                  └─► detain roll at +0.15 — worse than never offering
```

Design intent: the bribe is a *regressive* tool — it works best for exactly the players who need it least (money + CEC standing), mirroring every other system in the game.

**Edge cases:**
- Bribe offer with wallet < 40: the spend fails silently, no attempt is made, base path proceeds (no CEC hit).
- Bribe on a clean scan: impossible by construction — `shouldBribe()` is only consulted after the scan fails.
- Detain after failed bribe still increments CGN compliance flags normally.

## 1.8 Mortgage — Escrow & Grace **[LIVE]**

```
 payPartial(x): wallet ──► escrow   (any amount, any day before due)

 ON DUE DATE:
   escrow + wallet ≥ due  ──► paid in full, ladder resets below stage 3
   escrow ≥ 50% of due    ──► GRACE: no stage advance;
   (wallet can't cover)        remainder becomes carryover on next payment
   escrow < 50%           ──► MISSED: ladder advances; escrow still hits principal
```

| Rule | Value |
|---|---|
| Grace threshold | escrow ≥ 50% of payment due |
| Carryover | unpaid remainder added to next `paymentDue()` |
| Early payment | `payNow()` drains escrow first, wallet second |
| Edge case: carryover stacking | carryover replaces (not stacks with) prior carryover — the ladder, not compounding math, is the punishment beyond one cycle |

## 1.9 Audit / Error System — Expanded Counterplay **[LIVE]**

| Mechanic | Rule |
|---|---|
| **Clean streak** | 5 consecutive audit-days with zero new errors → oldest token removed, streak resets. Careful work digs you out — slowly. |
| **Appeal** | Contest the oldest token: success p = 0.55 removes it; failure **adds one**. A gamble, not a refund desk. One UI action; not exercised by the sim bot. |
| **Double-weight rules** | DELINQUENCY family errors ×2; failed spot-audit citation ×2 (stacking → ×4 worst case) |
| **Framed cases** | Approving a framed (JGC retaliation) case = token regardless of evidence checks — the paperwork itself is the trap; the counter is DENY or ESCALATE on anything tagged during a JGC retaliation window |
| Threshold ladder | 5 warning / 8 probation (+2 quota) / 12 demotion (standing −15, wage −20% at standing ≤15) / 16 termination track → 5-day plan → gig mode → 20 clean days to rehire |

## 1.10 Time / Quota — Expanded

| Expansion | Rule | Status |
|---|---|---|
| **Quota grace band** | quota−1 cases closed pays half bonus (₡H 22 vs 45). Softens the cliff without removing it. | [LIVE] |
| Early clock-out | Queue exhausted before block end → quota auto-met, +15 min pod time | [LIVE] |
| Overtime | +90 min, +15 fatigue, +5 stress; per-case wages continue; no second overtime | [LIVE] |
| **Overtime diminishing returns [SPEC]** | Cases closed during overtime pay ₡H 4 instead of 6 — tired work is worth less to the branch too | [SPEC] |

---

# 2. ART + UI EXPANSION

All screens render in a 100×32 terminal grid, box-drawing charset, no color dependencies (severity encoded by fill density: `░ ▒ ▓ █`). Every element maps to a live engine value (annotated `◄─`).

## 2.1 Work Desk (primary screen, full layout)

```
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│ ⏱ 13:42  DAY 14/45  ACT II │ STRESS ▓▓▓▓▓░░░░░ 51 ⚠DRIFT │ FATIGUE ▓▓▓▓░░░░░░ 38 │ ₡H 214 │ ⚠2 │
├──────────────┬──────────────────────────────────────────────────────┬──────────────────────────┤
│ CASE QUEUE 5 │                DOCUMENT VIEWER                        │ RULE PANEL               │
│┌────────────┐│ ┌───────────────────────┐ ┌───────────────────────┐  │┌────────────────────────┐│
││▶C14-06     ││ │ PANE A · RESIDENCY_ID  │ │ PANE B · DB RECORD     │  ││ TODAY'S DIRECTIVES     ││
││ CYBORG     ││ │ ─────────────────────  │ │ ─────────────────────  │  ││ • renewal rate table   ││
││ ⏱code 14:00││ │ name    CIT-48113   ✓  │ │ name    CIT-48113      │  ││ • restr. stage-4 ban   ││
│├────────────┤│ │ addr  ▶STACK-7-F214◀ ✗ │ │ addr  ▶STACK-7-F212◀   │  ││ • robot tier gate      ││
││ C14-07     ││ │ serial  SN-882041   ✓  │ │ serial  SN-882041      │  ││ ⟳ changed 11:20 (act 3)││
││ [✦ MEC]    ││ │ date    D14         ○  │ │ ...                    │  │├────────────────────────┤│
│├────────────┤│ └───────────────────────┘ └───────────────────────┘  ││ RATE TABLE             ││
││ C14-08     ││  COMPARE: addr ↔ addr → ✗ MISMATCH                    ││ income <900 → COND +2% ││
││ BATCH ×4   ││  ⚑ FLAG FILED: addr (doc 0, field 2)                  │├────────────────────────┤│
│├────────────┤│  ⚙ CHECKSUM SCAN: no hits (device covers SERIAL/CODE) ││ [QUERY DB]  8 min ⚡    ││
││ C14-09     ││                                                        ││ status: ✓ CACHED       ││
││ C14-10 …   ││                                                        │└────────────────────────┘│
│└────────────┘│                                                        │ MEMO (3 left) [SPEC]     │
├──────────────┴──────────────────────────────────────────────────────┴──────────────────────────┤
│ QUOTA ▓▓▓▓▓▓░░░░░ 6/11 │ [APPROVE] [DENY⚑] [CONDITIONAL ▾] [ESCALATE 2/3] [DEFER 1/2] [FLAG ⚑] │
│  hold stamp 0.5s to steady your hand ⚠                                    audits pending: 9 ⏳  │
└────────────────────────────────────────────────────────────────────────────────────────────────┘
   ◄─ STRESS/FATIGUE: StressSystem · QUEUE: WorkDeskSystem.queueDepth · ⏱code: Case.codeExpiryClock
   ◄─ ESCALATE/DEFER counters: WorkDeskSystem slots · audits pending: ErrorSystem.auditQueue
```

## 2.2 Document Viewer (zoom state)

```
┌──────────────────── DOCUMENT ZOOM · CLEARANCE_CODE · CASE C14-06 [CYBORG] ─────────────────────┐
│                                                                                                  │
│   FIELD        VALUE            STATE                COMPARE TARGET                              │
│   ──────────   ─────────────    ──────────────────   ────────────────────────────               │
│   code         7F3-889-A2       ⏱ EXPIRES 14:00       [COMPARE vs RECORD]                        │
│                                  (18 min — DEFER?)                                               │
│   serial       SN-004417        ⚙ CHECKSUM FAIL ✗     auto-hint (AUTO_CHECKSUM)                  │
│   issuer       DIR-EAST-9       ✓ compared · match    —                                          │
│                                                                                                  │
│   ⚑ FLAG THIS FIELD    ⚙ device: checksum covers SERIAL/CODE only                                │
│   ⏱ live expiry: this case invalidates IN PLACE if the clock passes 14:00 while open             │
│                                                                                                  │
│   [◀ BACK TO PANES]   [FLAG serial]   [DEFER CASE 1/2]   [STAMP ▾]                               │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

## 2.3 Case Queue (expanded side panel)

```
┌── CASE QUEUE · 7 waiting ────────────┐
│ ▶ C14-06  CYBORG_CLEARANCE  ⏱14:00   │   ▶ = open on desk
│           risk ▓▓░ · docs 2          │   ✦ = faction-tagged (seal visible,
│ ─────────────────────────────────    │       meter hidden until summary)
│   C14-07  MORTGAGE_RENEWAL  [✦ MEC]  │   ⏱ = live code expiry
│           risk ▓░░ · docs 3          │   ↩ = deferred earlier (cannot defer
│   C14-08  PASS_AIRBUS  BATCH ×4      │       again)
│           risk ▓░░ · one stamp, all  │
│   C14-09  DELINQUENCY  ⚠×2 weight    │   ⚠×2 = double audit weight family
│   C14-10  RESTRUCTURING ↩            │
│   C14-11  CASTE_CLASS  ⛔ TIER 3     │   ⛔ = above licensed tier:
│   C14-12  RESIDENCY_ID               │        ESCALATE is the only lawful stamp
└──────────────────────────────────────┘
```

## 2.4 Faction Pressure Panel (pod terminal / summary only — never on the desk)

```
┌── FACTION PRESSURE · trend 7 days ──────────────────────────────────────────────┐
│                −100 ◄────────────── 0 ──────────────► +100                       │
│  MEC   ░░░░░░░░░░░░░░░░▓▓│                    −32  ▼ falling · streak: 2 refusals │
│  CEC   ░░░░░░░░░░░░░░░░░░│▓                     +8  ▲                              │
│  RC    ░░░░░░░░░░░░░░░░░░│▓▓▓▓▓▓▓▓             +48  ▲ REWARD ACTIVE: assistant    │
│  COMBINE ░░░░░░░░░░░░▓▓▓▓│                    −28    · sparkline ▁▂▂▃▅▆▇          │
│  JGC   ░░░░░░░░▓▓▓▓▓▓▓▓▓▓│                    −35  ⚠ approaching RETALIATION (−80)│
│  SMC   ░░░░░░░░░░░░░░░░░░│▓▓▓                  +15  ▲                              │
│                                                                                    │
│  reward at +40 ─┤├─ penalty at −40    ★ test case at ±80 · cooldown 7d            │
└────────────────────────────────────────────────────────────────────────────────────┘
   ◄─ values: FactionPressureSystem.rep · streaks: refusalStreak · thresholds: constants.ts
```

## 2.5 Stress / Fatigue Bars (persistent strip, all screens)

```
 STRESS  ▓▓▓▓▓▓▓▓░░ 76  ⚠⚠ FALSE-HIGHLIGHT ACTIVE · drift 10.4% · CHRONIC FLOOR 10 (day 2/3 high)
         └────┬────┘└┬┘
          50 DRIFT   75 FALSE-HIGHLIGHT          breakpoints marked on the bar itself
 FATIGUE ▓▓▓▓▓░░░░░ 54  ⚠ DRAG −25% · next: 75 MISS-ALERT
```

## 2.6 Commute Screen (route select + transit)

```
┌────────────────────────── COMMUTE · OUTBOUND · departing 07:02 ──────────────────────────┐
│                                                        shift starts 08:00                 │
│   ○ WALKWAY    free      ~40m   fatigue +10   ⚠⚠⚠   slum events 25% · checkpoints ×0.5    │
│   ● AIR BUS    ₡H 4      ~25m   fatigue +5    ⚠⚠    ETA 07:27                             │
│   ○ SKY-LANE   ₡H 9→6*   ~12m   fatigue +2    ⚠     permit ✓ 11d   *MEC fare reward       │
│                                                                                            │
│   risk now: DELAY 35% (morning peak +15%) · SPILL 8% · CHECKPOINT 15% · INSPECT 10%        │
│   departure window [SPEC]: ◂ 06:45 │ 07:00 │ ●07:15 │ 07:30 ▸   (earlier = −peak, −sleep)  │
│                                                                     [ DEPART ▶ ]           │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│  ── transit ──   ▓▓▓▓▓▓▓▓░░░░░░░░░░ 40%                                                    │
│  ┌──────────────────────────────────────────┐                                              │
│  │ ⚠ SKY-TRAFFIC DELAY · severity ▓▓░        │                                              │
│  │ +14 min · new ETA 07:41 · stress +2       │                                              │
│  │                              [ CONTINUE ] │                                              │
│  └──────────────────────────────────────────┘                                              │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

## 2.7 Checkpoint Screen (with bribe branch)

```
┌──────────────────────────── CHECKPOINT · SECTOR GATE 7 ────────────────────────────┐
│  CYBORG PRESENCE: ██ YES        ROBOT SCAN: ACTIVE        queue ahead: 3            │
│                                                                                      │
│  ID SCAN        ✓ MATCH                                                             │
│  PERMIT CHECK   ✗ SKYLANE_PERMIT — EXPIRED 2 DAYS                                   │
│  CARGO SWEEP    ▓▓▓▓▓▓▓░░░ scanning…                                                │
│                                                                                      │
│  ── SECONDARY INSPECTION ──────────────────────────────────────────────────────────  │
│  │  officer is filling out the citation form…                                     │  │
│  │                                                                                 │  │
│  │  [ WAIT IT OUT ]        citation ₡H 25 · +20 min · detain risk 10%              │  │
│  │  [ OFFER ₡H 40 ]        success 70% (+15% if CEC ≥ 0) · failure: CEC −5,        │  │
│  │                          detain risk +15% — worse than never offering            │  │
│  └─────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                      │
│  outcome banner:  ▓ PASS ▓ / CITATION ₡25 / CONFISCATED / █ DETAINED — half day █    │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

## 2.8 Pod Apartment Screen (evening hub)

```
┌───────────────────────────── POD 04 · 18:40 ─────────────────────────────┐
│                                                                            │
│   FILTER    ▓▓▓▓▓▓░░░░ 61% (cap 100)      [REPLACE ₡H 120 / gray ₡H 60*]  │
│   NOISE     ▓▓░░░░░░░░ low                 *COMBINE reward required        │
│   UTILITIES NORMAL                                                         │
│   SLEEP FORECAST ▓▓▓▓▓░░░░░ 54 = 50 + filter/2 − noise − rationing         │
│                                                                            │
│   MORTGAGE  ₡H 610 due day 20 (6d)   escrow ₡H 200 ▓▓▓░░░░░░░ 33%          │
│             [PAY FULL] [ESCROW +50] [ESCROW +100]    grace at 50% ─┤       │
│                                                                            │
│   EVENING ACTION (pick one):                                               │
│     ○ REST          stress −15                                             │
│     ○ HALLWAY       stress −8 · info                                       │
│     ○ SIDE GIG      +₡H 25 · fatigue +10                                   │
│     ○ STUDY RULES   standing +1                                            │
│     ○ FILE APPEAL   contest oldest token · 55% remove / 45% +1 ⚠            │
│                                                                            │
│   FACTION TRENDS [view ▸]        TOKENS 4 (1 expires day 16)                │
│                                                          [ SLEEP ▶ ]        │
└────────────────────────────────────────────────────────────────────────────┘
```

## 2.9 Daily Summary Screen

```
┌═══════════════════════ DAY 14 / 45 · SHIFT SUMMARY ═══════════════════════┐
│                                                                             │
│  CASES     ▓▓▓▓▓▓▓▓▓░░ 9 closed / 11 quota      GRACE BAND: +₡H 22 (½)     │
│  STAMPS    APPROVE 5 · DENY 2 · COND 1 · ESC 1   flags 4 · defers 1         │
│  COMPLIANCE ▓▓▓▓▓▓▓▓▓░ 91%                                                  │
│                                                                             │
│  AUDITS    9 pending (resolve day 16) · today's results: 1 error ⚠ 1 claw  │
│  TOKENS    ▓▓▓▓░░░░░░░░░░░░ 4 / 16   next threshold: 5 WARNING              │
│  CLEAN STREAK ▓▓▓░░ 3/5 days                                                │
│  STANDING  62 ▲2 (spot audit passed)                                        │
│                                                                             │
│  MONEY     wages +₡H 76 → ₡H 290    mortgage d20 · escrow 200/610           │
│  METERS    stress 41 ▲6 · fatigue 58 ▲13 · sleep forecast 54                │
│                                                                             │
│  FACTIONS  MEC −8→−32 ▼▼ │ CEC +1→+8 │ RC +7→+48 ★reward │ COMBINE −28      │
│            JGC −10→−35 ⚠retaliation near │ SMC +2→+15                        │
│                                                                             │
│  [ CONTINUE → DAY 15 ]                                    autosaved ✓        │
└═════════════════════════════════════════════════════════════════════════════┘
```

## 2.10 Supervisor Alert (interrupt card, 30s warning)

```
   ┌─⚠ SUPERVISOR ─ SPOT AUDIT ──────────────────────────┐
   │                                                       │
   │   Case C14-03 (DELINQUENCY · stamped DENY) pulled     │
   │   for live review. Justify your citation.             │
   │                                                       │
   │   cited fields:  ▸ AMOUNT (doc 1) vs record   ✓       │
   │                                                       │
   │   PASS: standing +2      FAIL: token weight ×2        │
   │                                        ⏳ 0:30 → 0:12  │
   └───────────────────────────────────────────────────────┘
```

## 2.11 Audit Results (morning notices)

```
┌── MORNING NOTICES · DAY 16 ──────────────────────────────────────────────┐
│ ⚠ DISCREPANCY  C14-07 · APPROVE graded incorrect (+1 token) — forged      │
│                SEAL_SWAP archetype, field: seal (doc 2)                    │
│ ✓ COMMENDATION C14-02 · valid flag cited altered field (−1 token)          │
│ ○ LAG-SAFE     C14-05 · address flag was DB lag — weight 0, no effect      │
│ ⚠ FRAMED       C13-19 · tagged approval graded as procured error (+1)      │
│ ▸ TOKENS NOW: 4/16 · clean streak reset                                    │
└────────────────────────────────────────────────────────────────────────────┘
```

## 2.12 Mortgage Warning (stage transitions)

```
┌─█ HAB-CORE AUTOMATED NOTICE · STAGE 2 █──────────────────────────────────┐
│                                                                            │
│   Payment 2 of 2 consecutive MISSED.                                       │
│   Penalty interest now applies: ₡H 610 → ₡H 702 (+15%)                     │
│                                                                            │
│   STAGE LADDER   [1 NOTICE]─[2 ▓PENALTY]─[3 RESTRUCTURE]─[4 RELOCATION]     │
│                                                                            │
│   counterplay: escrow ≥ ₡H 351 (50%) by day 50 prevents stage 3.           │
│   [OPEN POD SCREEN]                                    [ACKNOWLEDGE]        │
└────────────────────────────────────────────────────────────────────────────┘
```

## 2.13 Faction Retaliation Warning

```
┌─█ PRESSURE ALERT █─────────────────────────────────────────────────────┐
│                                                                          │
│   JGC meter has crossed −80.                                             │
│   A retaliation event is queued: fires within 3 days.                    │
│                                                                          │
│   pattern on file: 3 framed cases seeded into one queue — forged AND     │
│   pre-flagged; approving any of them is an automatic token.               │
│   counter: DENY or ESCALATE anything JGC-tagged this week.                │
│                                                                          │
│   meter decays +1/day toward 0 · retaliation cooldown 7 days              │
└──────────────────────────────────────────────────────────────────────────┘
```

---

# 3. SYSTEM INTERACTION EXPANSION

## 3.1 Master Module Interaction Map (multi-layer)

```
 LAYER 0 · DRIVER      ┌───────────────────────────────────────────────┐
                       │                  GameLoop                      │
                       │   12-state machine · runDay() · transitions    │
                       └──────┬──────────────┬───────────────┬─────────┘
                              │ owns          │ ticks          │ consults
 LAYER 1 · SPINE       ┌──────▼─────┐  ┌─────▼──────┐  ┌──────▼──────┐
                       │  EventBus   │  │ RNGManager  │  │   Agent     │
                       │ pub/sub     │  │ per-day     │  │ (UI or bot) │
                       │ 3 priority  │  │ streams     │  │             │
                       └──────┬─────┘  └─────┬──────┘  └──────┬──────┘
        every module ─────────┘               │ seeds           │ decisions
        publishes here                        │                 │
 LAYER 2 · WORLD       ┌─────────────┐ ┌─────▼───────┐ ┌───────▼───────┐
                       │CaseGenerator │ │CommuteSystem │ │ WorkDeskSystem │
                       │ truth at gen │ │ event rolls  │ │ verbs · gates  │
                       └──────┬──────┘ └─────┬───────┘ └───┬───────┬───┘
                              │ queue         │ checkpoint   │ audit  │ tags
                              ▼               ▼              ▼        ▼
 LAYER 3 · JUDGMENT    ┌────────────┐ ┌─────────────┐ ┌──────────┐ ┌─────────────────┐
                       │DocumentCheck│ │Checkpoint    │ │ErrorSystem│ │FactionPressure  │
                       │ truth oracle│ │ Sys · bribe  │ │ lag·tokens│ │ meters·streaks  │
                       └────────────┘ └──────┬──────┘ └────┬─────┘ └───────┬─────────┘
                                             │ fines        │ thresholds    │ rewards/penalties
 LAYER 4 · STATE       ┌─────────────────────▼──────────────▼───────────────▼──────────┐
                       │  PlayerStateSystem (wallet·meters·employment·permits·upgrades) │
                       └──────┬──────────────┬───────────────┬───────────────┬─────────┘
                              ▼              ▼               ▼               ▼
 LAYER 5 · SUPPORT     ┌───────────┐ ┌────────────┐ ┌─────────────┐ ┌──────────────────┐
                       │StressSystem│ │MortgageSystem│ │ PermitSystem │ │DailySummarySystem│
                       │ floor·debuf│ │ escrow·stages│ │ expiry       │ │ render model     │
                       └───────────┘ └────────────┘ └─────────────┘ └──────────────────┘
```

## 3.2 Event Flow — Life of One Stamped Case

```
 agent.workCase()                                    day N          day N+lag
      │                                                │                │
      ▼                                                │                │
 WorkDesk.stamp(d) ── gates ──► close(c,d) ────────────┤                │
      │                          │                     │                │
      │ drift roll               ├─► ErrorSystem.enqueueAudit ──────────┤
      │ (skipped if deliberate)  │        (resolveDay = N + lag)        ▼
      ▼                          │                            resolveAudits(N+lag)
 [CASE_CLOSED] ──► EventBus ──►  ├─► FactionPressure.onTaggedResolved      │
      │                          │        │ comply/refuse/test           grade vs
      │                          │        ├─► rival coupling             generation
      │                          │        └─► [FACTION_DELTA]            truth
      │                          ├─► StressSystem +2                       │
      │                          └─► ShiftLog / quota counter    ┌────────┼────────┐
      ▼                                                          ▼        ▼        ▼
 UIManager toast                                             +token   claw-back  lag-safe
                                                                 │    (valid flag) (weight 0)
                                                                 ▼
                                                        [TOKEN_THRESHOLD] ──► employment ladder
                                                                 │
                                                                 ▼
                                                        clean-streak counter reset/advance
```

## 3.3 Day Pipeline (swimlane, fixed order)

```
        │ Error       │ Player      │ Mortgage   │ Faction      │ Stress     │ Permit │ Summary
────────┼─────────────┼─────────────┼────────────┼──────────────┼────────────┼────────┼─────────
 step 1 │ resolveAudits│             │            │              │            │        │
 step 2 │ expireTokens │             │            │              │            │        │
        │ applyThresh. │◄─employment │            │              │            │        │
 step 3 │             │ PayWages    │            │              │            │        │
 step3b │             │ weeklyReview│            │              │            │        │
        │             │ +upgrades   │            │              │            │        │
 step 4 │             │             │ dailyCheck │              │            │        │
        │             │◄────────────│ escrow/    │              │            │        │
        │             │  stage fx   │ grace      │              │            │        │
 step 5 │             │             │            │ dailyDecay   │            │        │
 step 6 │             │             │            │ checkThresh. │            │        │
        │             │             │            │ →retal/tests │            │        │
 step 7 │             │             │            │              │ overnight  │        │
        │             │             │            │              │ +chronic   │        │
        │             │             │            │              │  floor     │        │
 step 8 │             │             │            │              │            │ tick   │
 step 9 │             │             │            │              │            │        │ compose
 step10 │                                    autosave point                            │
```

**Why the order is load-bearing:** audits must precede wages (a demotion discovered today changes today's pay); wages must precede the mortgage check (today's pay can cover today's payment); decay must precede threshold checks (a meter can decay out of the extreme band before retaliation queues); recovery must come after every stress source has fired.

## 3.4 Error Propagation Graph

```
 hasty stamp ─► drift ─► wrong decision ┐
 spot-check policy ─► missed forgery ───┤
 framed case approved ──────────────────┼──► audit (lag 1-3d) ──► ERROR TOKEN
 CONDITIONAL on wrong family ───────────┤         ▲                   │
 above-tier processing ─────────────────┘         │              ┌────┴─────┬───────────┐
                                            doubleWeight         ▼          ▼           ▼
 failed spot audit ───────────────────────────────┘         5 WARNING   8 PROBATION  12/16
                                                              standing    quota+2     demote/
 COUNTER-FLOWS (token removal):                                −10                    terminate
   valid flag on clean decision ──► claw-back −1                                        │
   5-day clean streak ──► oldest token −1                                               ▼
   appeal (0.55) ──► oldest −1 / FAIL +1                                            GIG_MODE
   15-day expiry ──► token ages out                                              (20d → rehire)
```

## 3.5 Stress Propagation Graph

```
 commute delays ─┐                                  ┌─► drift (≥50) ─► wrong stamps ─► tokens
 checkpoints ────┤                                  ├─► false highlight (≥75) ─► frivolous flags
 spot audits ────┼──► STRESS ───effect ramps────────┤
 no lunch ───────┤       │                          └─► BREAKDOWN (100) ─► shift lost ─► quota
 overtime ───────┤       │ 3 days ≥70                        │                           missed
 bad air ────────┘       ▼                                   ▼
                   CHRONIC FLOOR 10 ◄──────────── burnout window (3 in 10d)
                         │                                   │
                         │ relief clamped                    ▼
                         ▼                          2 forced leave days ─► wages 0 ─► mortgage
                   recovery economy taxed                                            pressure
                         │
                         └─► 2 days ≤40 clears floor  (buying calm costs quota/money/goodwill)
```

## 3.6 Faction Pressure Propagation

```
                    comply +8/+16 ┌────────────┐ refuse −6→−12 (streak)
        tagged case ─────────────►│   METER     │◄───────────── escalate −3
                                  │  −100..+100 │
     rival coupling −ceil(Δ/2) ◄──┤             ├──► decay ±1/day toward 0
                                  └──────┬─────┘
              ┌───────────────┬──────────┼───────────┬────────────────┐
              ▼ +40           ▼ −40      ▼ ±80       ▼ −80            ▼ side effects
        REWARD ACTIVE   PENALTY ACTIVE  TEST CASE   RETALIATION   commute (CEC P=0/1)
        fares·assistant  query 36min    comply +16  penalty ×3    audits (MEC lag −1)
        gray market      framed cases   fail −40    within 3d     pod incidents (COMBINE)
        fatigue bonus    checkpoint P=1 cooldown 7d cooldown 7d   wages (JGC batches)
```

---

# 4. MODULE BLUEPRINT EXPANSION

Format per module: **R** responsibilities · **I** inputs · **O** outputs · **UI** elements · **L** internal logic · **U** update() · **E** events · **X** error conditions · **EC** edge cases · **IP** integration points · **P** pipeline placement.

### 4.1 WorkDesk
- **R:** shift lifecycle, verb execution, stamp gates, slots (escalate/defer), spot audits, wage tally.
- **I:** daily queue, DayContext clock, debuffs (Stress), upgrade set (PlayerState), reward states (FactionPressure).
- **O:** `CASE_CLOSED`, `FLAG_FILED`, `SPOT_AUDIT`; ShiftLog; wages.
- **UI:** §2.1 desk, §2.3 queue, stamp row, slot counters.
- **L:** validity gates → drift roll → close → fan-out (audit, faction, stress, log).
- **U:** clock-advance per verb; live code-expiry check on open case.
- **E:** emits 3, subscribes 0 (loop pumps it).
- **X:** stamp with no open case; DENY uncited; ESCALATE without slots (all throw `StampRejected`).
- **EC:** §5.7 skeleton table + defer-once rule + checksum-hint scope.
- **IP:** ErrorSystem (enqueue), FactionPressure (tags), StressSystem (debuffs in, stress out).
- **P:** active-state system during WORK_SHIFT / WORK_SHIFT_2.

### 4.2 DocumentCheck
- **R:** stateless truth oracle — compare, flag construction, forgery truth.
- **I:** Case + doc/field indices. **O:** MATCH/MISMATCH, Flag structs.
- **UI:** compare panes, field states (§2.2).
- **L:** record-vs-field equality; flag validity = cites altered field; lag-safe detection.
- **U:** none (pure functions). **E:** none.
- **X:** compare before QUERY (throws); bad indices (throws).
- **EC:** unlike-field compare = mismatch signal; record-silent fields = match.
- **IP:** WorkDesk (sole caller), ErrorSystem (flag truth read at audit).
- **P:** synchronous within desk verbs.

### 4.3 Commute
- **R:** route economics, weighted event rolls, transit time, checkpoint spawning.
- **I:** route choice (Agent), phase, CEC override (FactionPressure), permit validity, world flags.
- **O:** CommuteLog, pendingCheckpoint, stress/fatigue/credit deltas.
- **UI:** §2.6.
- **L:** affordability downgrade chain → fare charge → table scan with modifiers → materialize severity.
- **U:** per-tick transit advance (real-time mode); single-shot in harness.
- **E:** none directly (Checkpoint publishes).
- **X:** fare charge failing after affordability check (throws — invariant break).
- **EC:** event cap 2 (checkpoint exempt); walkway forced when broke; contraband doubles inspection.
- **IP:** PermitSystem, FactionPressureSystem, StressSystem, CheckpointSystem.
- **P:** COMMUTE / COMMUTE_BACK states.

### 4.4 Checkpoint
- **R:** scan sub-machine: pass/citation/confiscate/detain + bribe branch.
- **I:** CheckpointEvent, permits, contraband, CEC rep, token count, bribe callback.
- **O:** `CHECKPOINT_RESULT`, fines, halfDayDetained flag, compliance flags.
- **UI:** §2.7.
- **L:** primary scan → secondary → bribe gamble → detain roll.
- **U:** none (event-resolved). **E:** emits 1.
- **X:** none throwable; all paths produce an outcome.
- **EC:** broke bribe offer = silent no-op; failed bribe raises detain odds; CEC ≥ 0 halves detain.
- **IP:** PermitSystem, FactionPressure (rep in, deltas out), ErrorSystem (flagged-worker check), StressSystem.
- **P:** CHECKPOINT state, called from commute resolution.

### 4.5 Mortgage
- **R:** stage ladder 0–4, escrow, carryover, grace, relocation effects.
- **I:** payments (pod screen), dailyCheck(day). **O:** `MORTGAGE_STAGE`, sleep/pod modifiers.
- **UI:** §2.8 pod block, §2.12 warnings.
- **L:** due-date engine: escrow-first draw → full / grace / missed branches.
- **U:** day-end only. **E:** emits 1.
- **X:** negative partial payment (returns false).
- **EC:** carryover replaces, never stacks; stage-3 flags permanent; stage-4 resets ladder in worse pod.
- **IP:** PlayerState (wallet, pod fields), GameLoop sleep calc.
- **P:** DAY_END step 4.

### 4.6 FactionPressure
- **R:** six meters, tagged resolution, streak escalation, coupling, decay, thresholds, reward/penalty queries, retaliation execution.
- **I:** tagged case closures, day-end calls. **O:** `FACTION_DELTA/THRESHOLD/RETALIATION`, query API consumed by 5 systems.
- **UI:** §2.4 panel, §2.13 warnings.
- **L:** §1.5 math. **U:** day-end decay + threshold scan.
- **E:** emits 3, subscribes 0.
- **X:** onTaggedResolved on untagged case (throws).
- **EC:** SMC never penalizes; test cooldown 7d; escalate doesn't reset streak.
- **IP:** WorkDesk, Commute, Checkpoint, ErrorSystem (MEC lag), GameLoop (pod incidents), CaseGenerator (tests/frames).
- **P:** DAY_END steps 5–6 + synchronous on case close.

### 4.7 Stress
- **R:** two meters, debuff ramps, breakdown/collapse/burnout, chronic floor.
- **I:** delta calls from 6 systems, sleepQuality. **O:** `BREAKDOWN/COLLAPSE/BURNOUT`, debuff set, drift probability.
- **UI:** §2.5 bars.
- **L:** §1.4 tables. **U:** block-end fatigue; overnight recovery with floor clamp.
- **E:** emits 3.
- **X:** negative relief amount (throws).
- **EC:** breakdown once/day; floor blocks all relief below 10; mixed days reset both chronic counters.
- **IP:** everything that costs or relieves stress; WorkDesk reads debuffs.
- **P:** ticked during shifts; recovery at DAY_END step 7.

### 4.8 PlayerState
- **R:** single source of truth; clamped writes; wallet validation; employment transitions.
- **I:** mutation calls. **O:** `PLAYER_CHANGED`, `PAY_RECEIVED`, `EMPLOYMENT_CHANGED`.
- **UI:** money readout, employment banner.
- **L:** credit/spend/fine triple: spend validates, fine can go negative — debt is real.
- **U:** none. **E:** emits 3.
- **X:** negative credit/spend amounts (throw).
- **EC:** quota bump under probation/plan computed at daily reset.
- **IP:** universal. **P:** everywhere; resetDaily at WAKE.

### 4.9 ErrorSystem
- **R:** audit lag queue, token ledger, thresholds, clean streak, appeals.
- **I:** case closures, day-end resolve. **O:** `AUDIT_RESULT`, `TOKEN_THRESHOLD`, notices.
- **UI:** §2.11 notices, token bar (§2.9).
- **L:** §1.9. **U:** DAY_END steps 1–2.
- **E:** emits 2.
- **X:** none throwable; immediate errors bypass lag by design.
- **EC:** claw-back blocked on bad decisions; framed approvals always token; streak requires audits actually due.
- **IP:** WorkDesk, Checkpoint (flagged-worker), FactionPressure (MEC lag), GameLoop (thresholds→employment).
- **P:** DAY_END steps 1–2 + enqueue on every close.

### 4.10 DailySummary
- **R:** aggregate day-end model; per-faction deltas; render.
- **I:** all systems (read-only) at step 9. **O:** `DAY_SUMMARY`, SummaryModel, CLI render.
- **UI:** §2.9.
- **L:** snapshot + diff vs yesterday's rep.
- **U:** compose once/day. **E:** emits 1.
- **X:** none. **EC:** compliance 100% on zero-case days (forced leave).
- **IP:** read-only against everything. **P:** DAY_END step 9.

### 4.11 RNGManager
- **R:** deterministic per-(day, stream, sub) generators; campaign seed identity.
- **I:** stream requests. **O:** Rng instances (next/range/chance/pick/weighted/distinct).
- **UI:** none (seed shown on campaign screen).
- **L:** FNV-1a hash → mulberry32; zero-seed remap.
- **U:** none. **E:** none.
- **X:** non-integer seed (throws); range max<min (throws); empty pick (throws).
- **EC:** world streams and agent/UI streams never shared — player behavior cannot perturb world generation.
- **IP:** CaseGenerator, Commute, Checkpoint, GameLoop (sleep/events), harness.
- **P:** stream handed out at each state entry.

### 4.12 EventBus
- **R:** queued pub/sub; priority bands; deterministic FIFO; handler fault isolation.
- **I:** publish/subscribe. **O:** dispatched callbacks.
- **UI:** none.
- **L:** batch swap on pump — events published during dispatch land in the *next* pump (no same-tick cascades).
- **U:** pump() at tick start + after each loop phase.
- **E:** carries all 22 event types.
- **X:** non-function handler (throws at subscribe); handler exceptions caught and logged, never fatal.
- **EC:** re-entrant pump ignored; unsubscribe during dispatch safe (iteration over copy).
- **IP:** universal spine. **P:** first thing every tick.

### 4.13 CaseGenerator
- **R:** daily queue assembly; generation-time truth; forgery archetypes; conflict/tag/test/frame injection.
- **I:** day/act, clearance tier, pending tests & frames (FactionPressure).
- **O:** Case[] with truth fields sealed.
- **UI:** none directly (queue panel renders output).
- **L:** weighted family pick → doc build → forgery (archetype by field class) → conflict split → middle-third tagging.
- **U:** once per day at shift start.
- **E:** none.
- **X:** forging a doc with zero checkable fields (silent skip — cannot happen with current field sets).
- **EC:** test tags override normal tags; frames force forgery + JGC tag; above-tier flag only on CASTE_CLASSIFICATION.
- **IP:** FactionPressure (tests/frames in), WorkDesk (queue out), ErrorSystem (truth read at audit).
- **P:** WAKE→shift boundary.

### 4.14 PermitSystem
- **R:** permit registry, purchase/renewal, expiry countdown, validation.
- **I:** purchases, tickExpiry, validate queries. **O:** `PERMIT_EXPIRED`.
- **UI:** permit chips on commute screen (§2.6).
- **L:** price table; stacking renewals add days.
- **U:** DAY_END step 8. **E:** emits 1.
- **X:** unknown permit type (throws).
- **EC:** RESIDENCY_ID never expires (9999d sentinel); permit valid on purchase day.
- **IP:** Commute (route gate), Checkpoint (scan target).
- **P:** DAY_END step 8 + queries during transit.

---

# 5. CODE EXPANSION (real TypeScript — all compiled & simulation-tested)

Everything below is quoted from the live engine, not illustrative. Files referenced by path.

### 5.1 DEFER + AUTO_CHECKSUM — `engine/src/systems/WorkDeskSystem.ts`

```typescript
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
```

### 5.2 Forgery Archetypes — `engine/src/systems/CaseGenerator.ts`

```typescript
private mutateValue(field: Field, rng: Rng): string {
  const v = field.value;
  let out: string;
  switch (field.id) {
    case FieldId.SERIAL:
    case FieldId.CODE: {                       // CHECKSUM_BREAK
      const digits = v.split('');
      const di = digits.findIndex((ch) => ch >= '0' && ch <= '9');
      if (di >= 0) digits[di] = String((Number(digits[di]) + rng.range(1, 8)) % 10);
      out = digits.join('');
      break;
    }
    case FieldId.DATE:
    case FieldId.EXPIRY: {                     // DATE_SHIFT
      const n = Number(v.replace(/\D/g, '')) || 1;
      out = `D${n + rng.range(1, 3)}`;
      break;
    }
    case FieldId.SEAL:                          // SEAL_SWAP
      out = `SEAL-${rng.range(1, 9)}`;
      break;
    case FieldId.TIER:                          // TIER_BUMP
      out = String((Number(v) || 1) + 1);
      break;
    default: {                                  // TRANSPOSE
      const chars = v.split('');
      if (chars.length >= 2) {
        const i = rng.range(0, chars.length - 2);
        [chars[i], chars[i + 1]] = [chars[i + 1], chars[i]];
      }
      out = chars.join('');
      break;
    }
  }
  return out === v ? `${v}§` : out;             // never an unaltered "forgery"
}
```

### 5.3 Refusal Escalation — `engine/src/systems/FactionPressureSystem.ts`

```typescript
} else {
  // consecutive refusals escalate: -6, -8, -10, capped at -12
  delta = Math.max(
    REFUSE_ESCALATION_CAP,
    REFUSE_DELTA - REFUSE_ESCALATION_STEP * this.refusalStreak[f],
  );
  this.refusalStreak[f]++;
}
```

### 5.4 Checkpoint Bribe — `engine/src/systems/CheckpointSystem.ts`

```typescript
if (shouldBribe() && this.players.spend(BRIBE_COST, 'checkpoint-bribe')) {
  let bribeP = BRIBE_BASE_P;
  if (this.factions.rep(FactionId.CEC) >= 0) bribeP += BRIBE_CEC_BONUS_P;
  if (rng.chance(bribeP)) {
    const bribed: CheckpointOutcome = {
      result: CheckpointResult.PASS,
      timeCost: e.baseTimeCost,
      fine: BRIBE_COST,
    };
    ctx.clock += bribed.timeCost;
    this.stress.addStress(5, 'checkpoint-bribe', ctx.dayIndex);
    ctx.checkpointOutcomes.push(bribed);
    this.bus.publish(GameEventType.CHECKPOINT_RESULT, { result: bribed.result, bribed: true });
    return bribed;
  }
  this.factions.onFailedBribe();
  detainP += BRIBE_FAIL_DETAIN_BONUS;
}
```

### 5.5 Mortgage Escrow & Grace — `engine/src/systems/MortgageSystem.ts`

```typescript
dailyCheck(dayIndex: number): void {
  const m = this.players.player.mortgage;
  if (dayIndex !== m.dueDate) return;

  const due = this.paymentDue();
  const fromEscrow = Math.min(this.escrow, due);
  const remainder = due - fromEscrow;

  if (remainder === 0 || this.players.spend(remainder, 'mortgage')) {
    this.escrow -= fromEscrow;
    this.carryover = 0;
    m.amount = Math.max(0, m.amount - due);
    m.missedStreak = 0;
    if (m.stage > 0 && m.stage < 3) m.stage = 0;
  } else if (fromEscrow >= due * ESCROW_GRACE_FRACTION) {
    this.escrow = 0;
    this.carryover = remainder;
    m.amount = Math.max(0, m.amount - fromEscrow);
    this.bus.publish(GameEventType.MORTGAGE_STAGE, { stage: m.stage, grace: true });
  } else {
    this.escrow = 0;
    this.carryover = 0;
    m.amount = Math.max(0, m.amount - fromEscrow);
    m.missedStreak++;
    this.advanceStage();
  }
  m.dueDate += MORTGAGE_PERIOD_DAYS;
}
```

### 5.6 Clean Streak & Appeals — `engine/src/systems/ErrorSystem.ts`

```typescript
// clean-streak counterplay: 5 consecutive error-free audit days
if (due.length > 0) {
  const anyErrorToday = notices.some((n) => n.kind === 'DISCREPANCY');
  this.cleanStreak = anyErrorToday ? 0 : this.cleanStreak + 1;
  if (this.cleanStreak >= CLEAN_STREAK_DAYS && this.tokens.length > 0) {
    this.tokens.sort((x, y) => x.issuedDay - y.issuedDay).shift();
    this.cleanStreak = 0;
    notices.push({ kind: 'CLEAN_RECORD', text: '5 clean audit days: oldest token removed' });
  }
}

appealOldest(rng: { chance(p: number): boolean }, today: number): 'UPHELD' | 'REJECTED' | 'NO_TOKENS' {
  if (this.tokens.length === 0) return 'NO_TOKENS';
  if (rng.chance(APPEAL_SUCCESS_P)) {
    this.tokens.sort((x, y) => x.issuedDay - y.issuedDay).shift();
    return 'UPHELD';
  }
  this.addToken('APPEAL', today, APPEAL_FAIL_WEIGHT);
  return 'REJECTED';
}
```

### 5.7 Chronic Stress Floor — `engine/src/systems/StressSystem.ts`

```typescript
// chronic stress tracking uses the level the day ENDED at
if (this.player.stress >= 70) {
  this.highStressDays++;
  this.lowStressDays = 0;
} else if (this.player.stress <= 40) {
  this.lowStressDays++;
  this.highStressDays = 0;
} else {
  this.highStressDays = 0;
  this.lowStressDays = 0;
}
if (this.highStressDays >= STRESS_FLOOR_TRIGGER_DAYS) this.stressFloor = STRESS_FLOOR_VALUE;
if (this.lowStressDays >= STRESS_FLOOR_CLEAR_DAYS) this.stressFloor = 0;
```

State machine, update loops, event bus, RNG, commute logic, daily summary: unchanged from the base layer — see `engine/src/game/GameLoop.ts`, `engine/src/events/EventBus.ts`, `engine/src/rng/RNGManager.ts`, `engine/src/systems/CommuteSystem.ts`, `engine/src/systems/DailySummarySystem.ts`.

---

# 6. INTEGRATION MATRIX

| Expansion | Doc section | Engine status | Files touched |
|---|---|---|---|
| DEFER verb | 1.1 | **LIVE** | WorkDeskSystem, types, constants |
| AUTO_CHECKSUM device | 1.1, 1.2 | **LIVE** | WorkDeskSystem, AutoAgent |
| Forgery archetypes | 1.2 | **LIVE** | CaseGenerator |
| Drift telegraph | 1.3 | SPEC (UI layer) | — |
| Chronic stress floor | 1.4 | **LIVE** | StressSystem, constants |
| Refusal escalation | 1.5.1 | **LIVE** | FactionPressureSystem |
| Checkpoint bribe | 1.7 | **LIVE** | CheckpointSystem, Agent, AutoAgent, GameLoop |
| Mortgage escrow/grace | 1.8 | **LIVE** | MortgageSystem |
| Clean streak | 1.9 | **LIVE** | ErrorSystem |
| Appeals | 1.9 | **LIVE** (API; UI hook pending) | ErrorSystem |
| Quota grace band | 1.10 | **LIVE** | GameLoop, constants |
| Batch processing | 1.1 | SPEC | — |
| Memo system | 1.1 | SPEC | — |
| Departure window | 1.6 | SPEC | — |
| Overtime diminishing wages | 1.10 | SPEC | — |

**Verification at commit time:** `npx tsc` clean · determinism test passing (same seed → identical 15-day trace) · full 45-day campaign runs · dedicated expansion test (`engine/src/test/expansion.test.ts`, 13 assertions) directly exercises the refusal-escalation ladder and comply-reset, escrow grace and carryover, the no-escrow miss path, audit-lag tokens, the 5-day clean streak, appeal edge cases, and the chronic stress floor's set/clamp/clear cycle.

---

*End of expansion layer. Next layers: Svelte UI binding (renders §2 wireframes), narrative/endings integration (subscribes to the EventBus, reads `TerminalCheck()`).*
