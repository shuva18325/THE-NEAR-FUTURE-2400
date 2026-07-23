# THE NEAR FUTURE: 2400 — Playable Slice

A single-file, self-contained browser playtest of the core loop. No build step, no dependencies to run — open `index.html` in a browser (or view the published Artifact).

It is a faithful port of the [`engine/`](../engine/) systems into inline JavaScript: deterministic seeded RNG, case generation with forgery archetypes and generation-time truth, the full desk verb set (query / compare / flag / stamp / escalate / defer) with stamp-drift and hold-to-steady, stress/fatigue debuffs, audit-lag error tokens and the employment ladder, six faction meters, commute + checkpoint, the mortgage stage ladder, daily summary, and all eight endings evaluated against real state (see `FINAL_WORLD_INTEGRATION_AND_LORE.md` §6).

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
node smoketest.js   # autoplay a campaign, assert no runtime errors
```
