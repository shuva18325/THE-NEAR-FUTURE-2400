# THE NEAR FUTURE: 2400 — Playable Slice

A single-file, self-contained browser playtest of the core loop. No build step, no dependencies to run — open `index.html` in a browser (or view the published Artifact).

It is a faithful port of the [`engine/`](../engine/) systems into inline JavaScript: deterministic seeded RNG, case generation with forgery archetypes and generation-time truth, the full desk verb set (query / compare / flag / stamp / escalate / defer) with stamp-drift and hold-to-steady, stress/fatigue debuffs, audit-lag error tokens and the employment ladder, six faction meters, commute + checkpoint, the mortgage stage ladder, daily summary, and all eight endings evaluated against real state (see `FINAL_WORLD_INTEGRATION_AND_LORE.md` §6).

## The lived-in layer

The world is delivered diegetically, not through menus:

- **A scripted 45-day world timeline.** Major events unfold on fixed days and bleed into the mechanics: the Venus walkout escalates into the Dome B takeover, Hercules embarks, and a ceasefire is signed *(for now)*; Undersecretary Vale is assassinated at a Luna gala (curfew → checkpoint probability +10% for three days); a confidence vote survives by nine; every Class-C robot on Mars halts at the same second (robot inspections double); the four overworked Government Cores run at 141% load (scheduled brownouts → worse sleep); the custody review "does not exist"; strike season builds.
- **The commute is a ride.** Each route plays an animated parallax cityscape — and you can *see the Stacks*: megastructure slabs with window grids, rooftop beacons, lit sign strips, and silhouetted people on the walkway. Sky-lane rides rise above the smog line past a Mars billboard.
- **The hallway walk.** Every evening you walk Hallway C to Pod 04 — capsule doors with warm bedding (sleeper-bus style), flickering ceiling tubes, JAN-9 sweeping, Pod 07 arguing (muffled, load-bearing), and neighbors whose speech bubbles react to the day's events — including the "in 2020 'homeless' meant sleeping *outside*" conversation.
- **You see your pod.** A drawn interior: bunk, pillow, blanket, reading lamp, the HAB-CORE wall terminal ("47y 3m remain"), the corrected poster (*STABILITY IS SERVICE* / "to whom"), and a live window on the moving city.
- **Animated news with headline pictures.** *DISTRICT 7 TONIGHT* has ASCII headline art per story, typewriter headlines, a BREAKING mode, a scrolling arc-aware ticker, and vox-pops from actual people ("WHY IS MY ENTIRE FAMILY POOR?" — interview ended by producers). It still spins your own day back at you: a spill becomes "a minor atmospheric event," your error tokens become a "productivity partnership."
- **The EtherNet.** Eight in-world sites with mastheads: StackNet (with the pinned *old words: homeless* thread — "the word didn't die. it got a mortgage."), the GOV-CAST wire with headline art, Helios finance, Mars lifestyle, the Directorate (full Hercules poster; "HE EMBARKS" during the Venus arc), AMP, a VMU strike-bill mirror, and the hidden Off-Ledger relay at resistance trust ≥ 30.
- **Family.** Call or visit a brother indentured on Venus and an aunt in a Saturn co-op — their dialogue tracks the world arcs ("It's not a rebellion — it's a rent strike with heat shields").

These are optional pod amenities (browse freely, then pick your one evening action to sleep); the propaganda register is public-facing and clearly so, matching the two-register rule from the lore layer. The world timeline is day-scripted, so it's identical across seeds and never perturbs the deterministic world RNG.

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
