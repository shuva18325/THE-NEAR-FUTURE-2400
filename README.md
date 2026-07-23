# THE NEAR FUTURE: 2400

A dystopian sci-fi game set in the year 2400 — humanity has colonized the entire Solar System, and nothing improved.

See [`GAME_DESIGN_DOCUMENT.md`](./GAME_DESIGN_DOCUMENT.md) for the full game design document: worldbuilding, factions, characters, systems, missions, events, and endings.

See [`MECHANICS_DOCUMENT.md`](./MECHANICS_DOCUMENT.md) for the core mechanics: the ADJUDICATE gameplay verb, daily work loop, faction pressure systems, stress/fatigue, commute, failure states, UI skeleton, and session structure.

See [`SYSTEM_SKELETON.md`](./SYSTEM_SKELETON.md) for the engine-ready architecture: the daily-loop state machine, module map, data models, code-ready pseudo-code for the work desk / commute / checkpoint / faction systems, failure-state tables, and UI wireframes.

See [`engine/`](./engine/) for the **runnable TypeScript implementation** of the skeleton: 12-state game loop, all gameplay modules, deterministic seeded RNG, event bus, and a headless simulation harness that plays full 45-day campaigns (`cd engine && npm install && npm run build && npm run sim`).

See [`MECHANICS_EXPANSION_AND_ART_SYSTEMS.md`](./MECHANICS_EXPANSION_AND_ART_SYSTEMS.md) for the expansion layer: expanded mechanics math (forgery archetypes, refusal escalation, chronic stress floor, bribes, escrow, appeals, clean streaks — all implemented in the engine), 13 full-size ASCII UI wireframes, multi-layer system interaction diagrams, and complete blueprints for all 14 modules.
