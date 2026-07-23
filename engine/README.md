# THE NEAR FUTURE: 2400 — Engine

Executable TypeScript implementation of [`../SYSTEM_SKELETON.md`](../SYSTEM_SKELETON.md). Pure game logic — no rendering, no framework dependencies. A UI layer (Svelte planned) binds to the `EventBus` and the `Agent` interface; the included `AutoAgent` plays the same API headlessly so full campaigns can be simulated and regression-tested.

## Run it

```bash
cd engine
npm install
npm run build
npm run sim                 # full 45-day campaign, seed 2400, daily summaries
node dist/main.js --seed 7 --days 10   # custom seed / length
node dist/main.js --quiet   # campaign result only
npm test                    # determinism test (same seed => identical campaign)
```

## Layout

| Path | Contents |
|---|---|
| `src/constants.ts` | Every tunable number, traced to SYSTEM_SKELETON.md §1 |
| `src/types.ts` | All enums + data models (Player, Case, Document, Mortgage, …) |
| `src/events/EventBus.ts` | Queued pub/sub with priority bands |
| `src/rng/RNGManager.ts` | Seeded per-day streams (mulberry32 + FNV-1a) — deterministic replays |
| `src/systems/` | The 12 gameplay modules (desk, commute, checkpoint, factions, errors, mortgage, stress, permits, case generation, document checks, player state, daily summary) |
| `src/game/GameLoop.ts` | The 12-state daily loop state machine + fixed-order day-end pipeline |
| `src/game/Agent.ts` | Decision interface — a UI implements this; so does the bot |
| `src/game/AutoAgent.ts` | Headless "competent clerk" with tunable policy |
| `src/main.ts` | CLI simulation harness |
| `src/test/determinism.test.ts` | Same-seed reproducibility check |

## What the simulation currently shows

- **Acts I–II are survivable with careful play**: the AutoAgent holds 0–2 error tokens, climbs standing to ~88, and earns desk upgrades through weekly reviews.
- **Act III's speed/accuracy squeeze works as designed**: at quota 14 the agent drops to spot-checking, the 1-day audit lag converts missed forgeries into tokens within a day, and a bad week can hit the termination ladder into gig mode.
- **Balance knob worth watching**: the Act III cliff (quota 14 + 30% forgery rate + 1-day lag) is steep — tokens can jump ~4/day for a spot-checking player. All four dials live in `constants.ts` (`QUOTA`, `FORGERY_RATE`, `AUDIT_LAG_DAYS`, action time costs).
- **Fatigue rarely accumulates** under the skeleton's overnight-recovery formula unless sleep quality collapses (stage-3 rationing, dead filter, relocation). Working as specified, but the formula makes fatigue a late-failure amplifier rather than an everyday pressure.

## Design invariants enforced in code

- Forged documents always have exactly 1–2 altered checkable fields (`CaseGenerator.injectForgery`).
- Case truth (`correctByEvidence` / `correctByDirective`) is fixed at generation time; audits are lookups, never re-simulations.
- ESCALATE never carries accuracy risk and always consumes a limited slot.
- Stamp drift only punishes hasty stamps — the `deliberate` flag (UI: 0.5s hold) bypasses it entirely.
- All world randomness flows through seeded per-day streams; agent/UI randomness is a separate stream, so player behavior never perturbs world generation.
- No instant game-over: every failure path (tokens, mortgage, checkpoints, burnout) is a ladder with a recovery route.
