# THE NEAR FUTURE: 2400 — Playable Slice

A single-file, self-contained browser playtest of the core loop. No build step, no dependencies to run — open `index.html` in a browser (or view the published Artifact).

It is a faithful port of the [`engine/`](../engine/) systems into inline JavaScript: deterministic seeded RNG, case generation with forgery archetypes and generation-time truth, the full desk verb set (query / compare / flag / stamp / escalate / defer) with stamp-drift and hold-to-steady, stress/fatigue debuffs, audit-lag error tokens and the employment ladder, six faction meters, commute + checkpoint, the mortgage stage ladder, daily summary, and all eight endings evaluated against real state (see `FINAL_WORLD_INTEGRATION_AND_LORE.md` §6).

## The lived-in layer

The world is delivered diegetically, not through menus:

- **The commute is a ride.** Each route (walkway / air bus / sky-lane) plays an animated parallax cityscape on canvas — grimy ground level, mid-level bus lanes, or above the smog line with a Mars billboard — while the transit log resolves.
- **A TV in the pod.** Watch *DISTRICT 7 TONIGHT*, the state broadcast: it drips world/political lore (the Dismantlement, Hercules, the DSMA calendar, Mars galas, the Venus union) **and** spins your own day back at you — a spill becomes "a minor atmospheric event," high error tokens become a "productivity partnership." This is the Distorted Broadcast mechanic.
- **The EtherNet.** A 2400 browser with real in-world sites: the slum board (StackNet), the Helios financial wire, Mars lifestyle, Directorate propaganda, the robot-rights Assembly — and a hidden Off-Ledger relay that unlocks once you've earned enough resistance trust.
- **Family.** Call or visit relatives scattered across the system — a brother indentured on Venus, an aunt in a Saturn co-op — for stress relief, personal-scale lore, and quiet nudges to the faction/resistance tracks. Visits cost a berth you can rarely afford.

These are optional pod amenities (browse freely, then pick your one evening action to sleep); the propaganda register is public-facing and clearly so, matching the two-register rule from the lore layer.

## Play

- Open `index.html` directly, or play the published Artifact.
- Same **seed** → same 45 days, every time.
- Core verb: **ADJUDICATE**. Pull a case → **QUERY** the record → click fields to compare against ground truth → **FLAG** mismatches → **STAMP** (Approve / Deny / Conditional / Escalate / Defer).
- Errors don't show at stamp time — audits return them as tokens 1–3 days later.
- There is no game-over screen. Failure is a worse tomorrow: token ladders, mortgage stages, relocation, gig-work mode.

## Scope vs. the full engine

This is a playable *slice*, not the whole design. It covers the daily loop end to end; it simplifies the morning/afternoon block split into a single shift with one lunch beat, and models the Off-Ledger / political / fragment ending-tracks as lightweight counters so all eight endings are reachable in a single sitting.

## Test harness (dev only)

`smoketest.js` wraps the body file in a full HTML document, loads it in the pre-installed Chromium via `playwright-core`, and autoplays a full campaign, failing on any console/page error. `shot.js` captures screenshots. Both need `npm install` (pulls `playwright-core`; the browser binary is provided by the environment) and are excluded from what the game itself needs to run.

```bash
cd playtest && npm install
node smoketest.js         # autoplay a full campaign, assert no runtime errors
node check_amenities.js   # exercise the TV / EtherNet / family overlays, assert no errors
```
