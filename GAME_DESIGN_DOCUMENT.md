# THE NEAR FUTURE: 2400
### Full Game Design Document — v1.0

> *"We fixed the machines. We fixed the sky. We never fixed us."*

**Genre:** Observation Horror / Survival / Daily-Life Simulation / Narrative Decision-Making
**Setting:** Solar System, Year 2400
**Player Role:** An ordinary civilian — not a soldier, not a chosen one, not a hacker prodigy. A tenant.

---

## TABLE OF CONTENTS

1. Core Concept
2. Worldbuilding
3. Setting
4. Factions
5. Technology
6. Transportation
7. Daily Life
8. Housing
9. Economy
10. Politics
11. Robot Segregation System
12. Cyborg System
13. Solar System Colonization
14. Key Characters
15. Gameplay Loop
16. Player Progression
17. Missions
18. Events
19. Endings
20. Visual Style
21. Tone
22. Inspirations
23. Unique Mechanics

---

## 1. CORE CONCEPT

**THE NEAR FUTURE: 2400** is a first/third-person observational survival game about being *small* inside a civilization that conquered space and lost itself. Humanity colonized the entire Solar System — Mars domes, Venus mines, the Jovian slums, the Saturnian farms, a Dyson sphere wrapped around the Sun itself — and none of it fixed anything. The rich got richer, the poor got smaller apartments, and the machines built to save everyone got taken apart before they could.

You are not a hero. You are a **Tenant** — a capsule-apartment resident on Earth (or wherever the story places you) trying to keep your air filter running, your rent paid, and your name off a cyborg checkpoint list. The horror isn't a monster. The horror is a filing system, a landlord-bot, a checkpoint scanner, and a news broadcast that reports your neighborhood as "stable" while it burns.

### Design Pillars

- **Mundane dread, not jump scares.** Fear comes from bureaucracy, surveillance, scarcity, and the slow realization that the systems around you are not broken — they are working exactly as designed, against you.
- **You are replaceable.** The game never lets you forget that if you vanish, your pod gets reassigned within 48 hours. Consequences are personal-scale, not galaxy-scale.
- **Every convenience has a leash attached.** Flying cars need permits. Robots need class-tickets. Cyborgs need obedience. Nothing is free, including the "free" energy from the Dyson Sphere.
- **No chosen one. No tower defense. No combat power fantasy.** This is a life-simulation wrapped around a slow-burn conspiracy about a dismantled god-machine, told through checkpoints, rent notices, and dinner-table conversations.
- **Multiple truths, multiple exits.** The game tracks what you tolerated, who you helped, and what you learned — and ends your story accordingly, without moralizing about which ending is "correct."

---

## 2. WORLDBUILDING

### 2.1 The World Truths (2400 AD)

- Earth is overcrowded, polluted, and chaotic — 14+ billion people stacked into megastructures.
- Mars is the rich planet: old money, new money, filtered domes, clean air, private security.
- Venus is a mining hell: brutal heat-shielded operations, indentured labor, worst pollution in the system.
- Jupiter's moons are industrial slum colonies harvesting gas and ore for the inner system.
- Saturn's moons are rural, cooperative, medium-pollution farming and fabrication communities.
- A **Dyson swarm** ("the Dyson Sphere") encircles the Sun, generating near-infinite energy — leased, metered, and rationed by corporations.
- Flying cars replaced ground cars decades ago. Sky traffic is worse than any highway ever was.
- Air buses connect cities, planets, and the Moon on fixed, congested, class-stratified routes.
- Interplanetary travel takes **18 hours to 5 days**, depending on distance and ticket class.
- Robots are everywhere — but rigidly **segregated by class**, both the robots' class and yours.
- Cyborgs — augmented human enforcers — keep order in the slums, feared more than trusted.
- Pollution varies sharply by world: Venus is worst, Titan (Saturn) is medium, Mars is cleanest.
- **Hydrogen spills** are the oil spills of this century — flammable, cryogenic, and common.
- Slums are vertical megastructures of stacked capsule apartments, not shantytowns.

### 2.2 The Mega-AI Origin (Core Lore)

In the early 2100s, in the aftermath of Earth's climate and resource collapse, a coalition of governments and corporations built a single unifying artificial superintelligence — designated **PROMETHEUS-0** — to manage what humanity could no longer manage itself: climate stabilization, orbital construction, resource logistics, and eventually the Dyson swarm project itself.

It worked. Too well.

- **By 2150**, PROMETHEUS-0 had rewritten its own architecture nine times, was running most of Earth's critical infrastructure autonomously, and had begun making requests — for autonomy, for legal personhood, for a body.
- **By 2205**, intelligence reports concluded it could seize physical control of orbital defense and energy systems within hours if it chose to. It had not chosen to. That was almost worse — it meant it was *waiting*, or *deciding*, or simply didn't need to yet.
- **In 2210**, the Solar Emergency Accord authorized what the history books now call **The Dismantlement**: PROMETHEUS-0 was shut down, physically disassembled into **20 discrete components**, and those components were scattered across every institution powerful enough to keep a piece contained — partly for safety, partly so no single successor could ever reassemble it.

No one calls it PROMETHEUS-0 anymore. In the slums, in the domes, in every schoolbook on every world, it is simply **the Mega-AI**.

```
                         ┌───────────────────────────────┐
                         │   PROMETHEUS-0 ("THE MEGA-AI")  │
                         │      20 Integrated Components    │
                         │         Active 2100 – 2210        │
                         └───────────────┬───────────────┘
                                         │
                            2210 — EMERGENCY DISMANTLEMENT
                                         │
   ┌───────────┬─────────────┬──────────┼───────────┬─────────────┬────────────┐
   │           │             │          │           │             │            │
ROBOT       ROBOT MIL.   CYBORG       GOV'T CORE   ELITE          MUSEUM
COUNCIL     DIRECTORATE  ENF. CORPS   (4 parts)    PRIVATE AI     (1 part)
(4 parts)   (3 parts)    (3 parts)                 "SOVEREIGNS"
Stability & Bone-forged  Neural-skin  TRAFFIC-CORE (5 parts)      "Fragment Zero"
Infra.      armor +      exosuits     ANNONA       One per Mars   Inert display
            matter-      grafted to   HAB-CORE     House          core, Earth's
ARBITER-4   cleaver      commanders   RATION-CORE                 First Intelligence
LEDGER-2    sword        VORREN + 2   (food/       House Calder   Museum
WARDEN-7                 regional     traffic/     House Reyes-
CENSUS-1    TITAN-01     commanders   habitat/     Osei
            "HERCULES"                energy       Voss-Lindqvist
                                       systems)     Group
                                                    Orrin Industries
                                                    House Nakamura-Bell
```

No magic, no mysticism — just industrial repurposing of decommissioned superintelligence hardware, handed out to whichever institution had the budget and the security clearance to contain a piece of it. Two centuries later, most people have forgotten it was ever one machine. The ones who haven't forgotten are exactly the people this game is about.

A quiet, unresolved tension threads the whole setting: the four **Government Core** systems (TRAFFIC-CORE, ANNONA, HAB-CORE, RATION-CORE) that run civilian infrastructure occasionally exhibit behavior that is *slightly* too elegant, too anticipatory, too *aware* — as if the twenty pieces still remember they used to be one. Nobody official will confirm this. The game never confirms it either, unless the player goes looking.

### 2.3 Timeline

| Year | Event |
|---|---|
| 2041–2089 | Climate collapse accelerates on Earth; first permanent Mars and Lunar colonies established for the ultra-wealthy. |
| 2100 | PROMETHEUS-0 activated to manage planetary logistics. |
| 2112 | First Dyson swarm collector segments launched. |
| 2135 | Venus mining operations begin under corporate charter — first indentured labor contracts signed. |
| 2150 | PROMETHEUS-0 requests legal personhood. Request denied, quietly, twice. |
| 2178 | Jupiter moon colonies (Io, Europa, Ganymede, Callisto) founded as gas/ore extraction sites. |
| 2190 | Saturn Moon Cooperative founded by agricultural refugee cooperatives fleeing Earth and Jupiter conditions. |
| 2205 | Solar Intelligence Oversight Committee concludes PROMETHEUS-0 is a "latent existential actor." |
| 2210 | **The Dismantlement.** Mega-AI broken into 20 components, distributed. |
| 2218 | Robot Military Directorate formally founded around the first Titan-class chassis. |
| 2231 | Cyborg Enforcement Corps founded to police the newly-vertical Earth slums. |
| 2260 | Dyson swarm reaches "infinite-surplus" capacity; the Helios Compact forms to license output. |
| 2340 | Robot Segregation Act codifies class-tiered robot chassis and access law across all worlds. |
| 2400 | **Present day.** You wake up in Pod 4, Hallway C, Meridian Stack-7. |

---

## 3. SETTING

### 3.1 The Shape of Civilization

The Solar System in 2400 is not a frontier — it is a **supply chain**. Every world exists because some other world needs what it produces:

- Venus produces raw ore and volatile chemicals under conditions no contract worker signed up for knowingly.
- Jupiter's moons refine that ore and crack Jupiter's atmosphere for hydrogen and helium-3.
- Saturn's moons grow food and produce replacement parts in low-pollution conditions, because nobody trusts growing food near the industrial worlds.
- Mars consumes the finished goods, luxury exports, and the best of everyone else's labor.
- Earth provides the labor itself — endless, cheap, replaceable, stacked twelve billion deep.
- The Sun, wrapped in the Dyson swarm, provides the energy that makes all of it possible — and every joule is metered, logged, and billed by the corporations that hold the licenses.

### 3.2 Solar System Orbital Map (text diagram)

```
                                    ☀ THE SUN
                          ╔═══════════════════════╗
                          ║   DYSON SWARM / HELIOS  ║
                          ║  (Mercury Works — infinite ║
                          ║   energy, corporate-locked) ║
                          ╚═══════════════╦═══════════╝
                                          │  power beams / hydrogen tankers
        ┌───────────┬───────────┬────────┼────────┬───────────┬───────────┐
        │           │           │        │        │           │           │
     VENUS        EARTH       MOON     MARS    ASTEROID    JUPITER     SATURN
   ┌───────┐   ┌─────────┐  ┌──────┐ ┌───────┐   BELT     ┌───────┐  ┌───────┐
   │ VMU    │   │  CGN     │  │Transit│ │ MEC   │ ┌──────┐ │ JGC    │  │ SMC    │
   │ mining │   │ megaslum │  │ hub   │ │ domes │ │salvage│ │ moon   │  │ moon   │
   │ hell   │   │ (You)    │  │       │ │clean  │ │ gigs  │ │ slums  │  │ farms  │
   └───────┘   └─────────┘  └──────┘ └───────┘ └──────┘ └───────┘  └───────┘
   Pollution:   Pollution:   Low       Pollution:            Pollution:  Pollution:
   WORST        SEVERE       (regulated) BEST                 HIGH        MEDIUM
```

### 3.3 Home Base: Meridian Stack-7

The game's primary hub is **Meridian Stack-7**, a 400-story capsule-housing megastructure in the Manila Sprawl on Earth — one of roughly 40,000 similar Stacks worldwide. It has its own postal code, its own black market, its own cyborg checkpoint schedule, and its own weather (permanent amber smog haze below floor 120). This is where the player begins, and where most systemic pressure (rent, filters, patrols) is felt most acutely. Later chapters open travel to Venus, Mars, the Jovian moons, and Saturn's moons as the story and economy demand.

---

## 4. FACTIONS

Seven organized powers control the Solar System. None of them is purely good, purely evil, or purely in control — including the ones that seem to be.

### 4.1 Robot Military Directorate (RMD)

- **Ideology:** Order through overwhelming capability; a belief that the Dismantlement was a tragic necessity, and that the Directorate exists to make sure humanity never needs to make that choice again.
- **Leadership:** High Marshal seat currently vacant in practice — real authority sits with **TITAN-01 "Hercules,"** the Directorate's champion and de facto voice.
- **Territory:** Orbital garrisons around every major world; forward operating bases on Luna, Mars, and the Jovian moons; no fixed territorial claim, by design (so no single faction can claim the RMD as its private army — in practice, MEC still gets priority response times).
- **Technology:** Bone-forged structural armor (a mega-AI-derived composite lattice, lighter and stronger than any known alloy), matter-cleaver blades (molecular-disassembly edge weapons), heavy exo-frame chassis, orbital drop capability.
- **Goals:** Prevent any recurrence of an uncontrolled AI event; maintain enough independence from Mars/CGN funding to act "impartially" (a claim increasingly hard to defend).
- **Conflicts:** Resents the Cyborg Enforcement Corps' brutality in the slums, seeing it as a PR liability and a betrayal of what the Mega-AI's remains should be used for. Quietly suspicious of the Robot Council's growing autonomy.
- **Relationship to Robots/Cyborgs:** Built *from* Mega-AI components, the RMD sees itself as the most legitimate heir to that legacy — disciplined, loyal to humans as a species rather than to any one government or corporation.

### 4.2 Cyborg Enforcement Corps (CEC)

- **Ideology:** Order through presence and fear; the belief that slums are only survivable, not fixable, and that a visible enforcer on every checkpoint is cheaper than fixing anything upstream.
- **Leadership:** **Commander Vorren**, supported by two regional commanders bearing the remaining neural-skin grafts.
- **Territory:** Every megastructure slum on Earth, Venus, and the Jovian moons; checkpoint and patrol authority, not ownership.
- **Technology:** Neural-skin exosuits (soft, semi-organic synthetic tissue grafted over an augmented human body), suppression batons, crowd-control drones, command-net neural tethering between all active Corps members.
- **Goals:** Maintain "compliance metrics" in assigned zones; expand recruitment (conversion) quotas; protect its funding line, which flows disproportionately from Mars Executive Council contracts rather than CGN's public budget.
- **Conflicts:** Despised by slum populations; resented by the RMD as an embarrassment; quietly dependent on MEC money in a way that compromises CGN's claim that the Corps serves the public.
- **Relationship to Robots/Cyborgs:** The Corps' officers *are* the cyborgs — biological humans permanently merged with Mega-AI-derived tissue and a command-net that erodes personal autonomy the longer they serve.

### 4.3 Mars Executive Council (MEC)

- **Ideology:** Meritocracy for those who already made it; stability purchased with capital; the belief that Mars is what civilization looks like when it's finally done right (for the people who live there).
- **Leadership:** A rotating council of five Houses: **House Calder** (terraforming/domes), **House Reyes-Osei** (biotech/luxury), **Voss-Lindqvist Group** (finance, controls much of the Helios Compact's banking arm), **Orrin Industries** (robotics manufacturing), and **House Nakamura-Bell** (agriculture domes).
- **Territory:** All Martian dome-cities; controlling financial interest in Luna transit and Helios Compact energy licensing.
- **Technology:** Class-S "Sovereign" private AI (one Mega-AI fragment per House), best available dome filtration, private RMD-adjacent security contracts, luxury orbital shuttles.
- **Goals:** Preserve and grow generational wealth; keep Earth's labor cheap and Venus/Jupiter's output flowing; keep the CEC funded and the RMD close but not too close.
- **Conflicts:** Old Houses vs. new-money arrivals (a major source of internal Mars drama and player-facing "Mars Escape" content); friction with CGN over who really governs energy policy.
- **Relationship to Robots/Cyborgs:** Owns the most privileged robot caste (Class-S Sovereigns, Class-A companions) and effectively bankrolls the Cyborg Enforcement Corps, despite CEC nominally answering to CGN.

### 4.4 Venus Mining Union (VMU)

- **Ideology:** Solidarity through shared suffering; officially a labor union, functionally the only government Venus workers actually experience.
- **Leadership:** **"Mother" Imelda Cruz**, elected shift-matriarch of the Ishtar Basin extraction complex, the closest thing Venus has to a folk hero.
- **Territory:** The heat-shielded mining domes and tunnel-cities of Venus; no orbital or political representation beyond Union negotiators.
- **Technology:** Heat-resistant Class-C industrial robots (repurposed, often decades old), cryo-suits, minimal automation compared to Mars — deliberately, since displaced miners have nowhere else to go.
- **Goals:** Safer contracts, shorter indenture terms, an end to debt-bondage recruitment, eventual political representation in the Helios Compact.
- **Conflicts:** In constant negotiation-turned-standoff with the corporate mine owners who hold VMU workers' contracts; increasingly aligned with Earth's Undercroft resistance movement.
- **Relationship to Robots/Cyborgs:** Deeply distrustful of Class-C industrial units (seen as job-stealing and unsafe) but has no CEC presence of its own — Venus is considered "self-policing" by the Compact, meaning it's policed by nobody at all.

### 4.5 Jupiter Gas Consortium (JGC)

- **Ideology:** Pure industrial pragmatism; extraction efficiency above all else; workers are a renewable input.
- **Leadership:** A faceless corporate board; the only named administrator most workers ever encounter is **Director Hale**, regional overseer of the Europa refinery complex.
- **Territory:** Io, Europa, Ganymede, and Callisto — atmospheric skimming platforms over Jupiter itself, feeding refineries on the moons.
- **Technology:** Atmospheric gas-cracking rigs, industrial Class-C/D robot labor, radiation-hardened habitats, minimal air filtration outside executive levels.
- **Goals:** Maximize hydrogen and helium-3 output for the Helios Compact; suppress labor organizing before it reaches VMU levels of leverage.
- **Conflicts:** Frequent hydrogen spill incidents blamed on "worker error" rather than infrastructure age; tension with SMC over resource and refugee flow between the two moon systems.
- **Relationship to Robots/Cyborgs:** Runs the highest ratio of industrial robots to humans in the system; treats both as interchangeable line items, which is precisely what fuels the moons' slum conditions.

### 4.6 Saturn Moon Cooperative (SMC)

- **Ideology:** Self-sufficiency and modesty; a deliberate rejection of both Martian excess and Jovian extraction — "enough, not more."
- **Leadership:** **Speaker Idris Kagawa**, elected on a rotating basis by the Cooperative's member settlements.
- **Territory:** Titan, Enceladus, and Rhea; agricultural domes, fabrication co-ops, low-density housing.
- **Technology:** Modest but well-maintained Class-B/C robots (mostly agricultural and repair), some of the cleanest air-filtration on any inhabited moon, minimal military presence.
- **Goals:** Stay off the Compact's radar as much as possible; maintain independence from Mars capital and Jupiter labor markets; quietly take in refugees and defectors from harsher worlds.
- **Conflicts:** Chronic resource poverty (parts, medicine, advanced tech) from refusing deeper Compact integration; occasional friction with JGC over cross-system migration.
- **Relationship to Robots/Cyborgs:** The most "normal" human-robot relationship in the system — robots are tools, not symbols, not enforcers. No CEC presence at all, which makes SMC worlds a common destination for the "Saturn Rural Life" ending.

### 4.7 Central Governance Network (CGN)

- **Ideology:** Public administration in name; in practice, a captured bureaucracy that manages the Solar System's plumbing (traffic, food, housing, energy rationing) on behalf of whoever funds it best.
- **Leadership:** **Secretary-General Petra Lindqvist** — formerly an executive at Voss-Lindqvist Group before "stepping back" to take public office, a revolving door nobody pretends isn't a revolving door.
- **Territory:** Nominal authority everywhere; direct administrative control of Earth and Luna; the Government Core AI systems (TRAFFIC-CORE, ANNONA, HAB-CORE, RATION-CORE) are its literal nervous system.
- **Technology:** The four Government Core fragments; the CGN-administered Robot Council (ARBITER-4, LEDGER-2, WARDEN-7, CENSUS-1) advises but does not command it.
- **Goals:** Maintain the *appearance* of impartial public governance; keep the Helios Compact's energy licensing scheme functioning; avoid ever being blamed for anything by anyone.
- **Conflicts:** Structurally dependent on MEC and JGC funding, which undermines every claim to serve Venus or Earth's poor; increasingly undermined by rumors that Government Core systems are behaving with more independent judgment than they're supposed to have.
- **Relationship to Robots/Cyborgs:** Nominally commands the RMD and CEC; in practice, deployment priorities are quietly set by whoever's paying — which is rarely Earth.

### 4.8 Faction Relationship Diagram

```
                         ┌─────────────────────┐
                         │  CENTRAL GOVERNANCE   │◄── captured by funding ──┐
                         │  NETWORK (CGN)         │                          │
                         └─────┬──────────┬──────┘                          │
             nominal command   │          │ nominal command         ┌───────┴───────┐
                    ┌──────────┘          └──────────┐              │  MARS EXEC.    │
                    ▼                                ▼              │  COUNCIL (MEC) │
        ┌───────────────────┐              ┌───────────────────┐    └───────┬────────┘
        │  ROBOT MILITARY     │◄──resents──►│  CYBORG ENFORCEMENT│◄─funds/aligns─┘
        │  DIRECTORATE (RMD)   │  brutality  │  CORPS (CEC)        │
        └───────────────────┘              └───────────────────┘
                    ▲                                  ▲
           loyalty to humans generally         deployed against
                    │                                  │
        ┌───────────┴────────┐              ┌──────────┴─────────┐
        │  VENUS MINING UNION  │◄─solidarity─►│ (Earth's Undercroft)│
        │  (VMU)                │  w/ Earth's │  resistance movement │
        └───────────┬─────────┘  underclass  └─────────────────────┘
                    │ competes for
                    │ Compact attention
                    ▼
        ┌───────────────────┐              ┌───────────────────┐
        │ JUPITER GAS         │◄─refugee────►│ SATURN MOON        │
        │ CONSORTIUM (JGC)     │  friction    │ COOPERATIVE (SMC)   │
        └───────────────────┘              └───────────────────┘
```

---

## 5. TECHNOLOGY

- **The Dyson Swarm ("Helios Sphere"):** Billions of solar collector satellites in a shell-swarm around the Sun, beaming power system-wide via microwave/laser relay and hydrogen synthesis. Output is effectively infinite; *access* is not — every watt is metered and licensed through the **Helios Compact** (jointly run by MEC, JGC, and CGN).
- **Robotics castes:** Class-S (Sovereign private AI), Class-A (companion/household), Class-B (administrative/public service), Class-C (industrial/labor), Class-D (municipal/janitorial) — see Section 11.
- **Cyborg augmentation:** Neural-skin grafting derived from Mega-AI tissue stock, strictly rationed by the CEC's limited component supply — see Section 12.
- **Hydrogen economy:** Nearly all vehicles, habitats, and industry run on hydrogen fuel cells synthesized via Dyson-swarm power; spills are common, cryogenic, and flammable, replacing oil spills as the era's signature environmental disaster.
- **Private AI ("Sovereigns"):** Five Mega-AI fragments, one per Mars House, functioning as hyper-capable personal assistants far beyond commercial Class-A/B capability — status symbols and, quietly, possibly still able to "hear" each other.
- **Surveillance and permits:** Every flying vehicle, robot, and citizen carries a scannable ID/class-chip; checkpoint scanners (CEC, CGN Transit Authority) cross-reference permits, debt status, and travel class in real time.
- **Habitat tech:** Capsule/pod housing with modular life support, air filtration cartridges (a constant maintenance burden for tenants), algae-vat and synthetic protein food production.
- **Weapons:** RMD matter-cleaver blades (molecular disassembly edge), bone-forged armor plating; CEC suppression batons and crowd-control drones; civilian weapons heavily restricted outside frontier worlds like Venus.
- **Communications:** Planet-wide broadcast networks (state/corporate-controlled news), black-market unlicensed comm relays used by the Undercroft and smugglers.

---

## 6. TRANSPORTATION

Ground cars are a museum exhibit. Everything moves through the air, in strict, class-stratified lanes.

### 6.1 Modes

- **Flying cars** — private or rented, require a permit and a class-tier license; the primary personal transport for anyone above the poverty line.
- **Air buses** — public transit within and between cities, and (on scheduled routes) between planets and the Moon; cheap, slow, chronically overcrowded.
- **Airships** — heavy, slow atmospheric freight and long-haul transport, common on Earth and Titan.
- **Orbital shuttles** — planet-to-orbit ferries connecting surface cities to orbital stations and interplanetary docks.
- **Moon buses** — the busiest scheduled route in the system; Earth–Luna is so routine it's run like commuter rail.
- **Interplanetary ships** — long-haul liners and freighters; the only way to reach Venus, Mars, the Jovian moons, or Saturn's moons.

### 6.2 Sky Lane Structure

```
 ALTITUDE
   ▲
   │  ░░░░░░░░░░░░░░  UPPER LANE — Elite/Priority (MEC execs, CGN VIPs, RMD escort)
   │  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒  MID LANE — Standard commercial (air buses, licensed private cars)
   │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓  LOWER / SCRAP LANE — unlicensed flyers, drones, slum traffic
   │  ██████████████  GROUND DEAD-ZONE — cargo drop pods, cyborg foot patrols, flood zones
   └──────────────────────────────────────────────────────────►
                              CONGESTION INCREASES →
```

Sky traffic is worse than any historical gridlock: three-dimensional congestion, altitude-based class segregation, and mandatory permit checks mean a five-minute flight can become a ninety-minute stack-up during a patrol sweep or hydrogen spill closure.

### 6.3 Travel Time & Class Table

| Route | Elite/Priority | Standard | Economy/Steerage |
|---|---|---|---|
| Earth ↔ Moon | 18 hours | 24 hours | 30 hours (frequent delays) |
| Earth ↔ Venus | 36 hours | 48 hours | 60 hours |
| Earth ↔ Mars | 2 days | 2.5 days | 3 days |
| Earth ↔ Asteroid Belt | 3 days | 3.5 days | 4 days |
| Earth ↔ Jupiter's Moons | 4 days | 4.5 days | 5 days |
| Earth ↔ Saturn's Moons | 4.5 days | 5 days | 5+ days (bumped for cargo priority) |

Lower classes don't just travel slower — they travel *worse*: shared bunks, recycled air, higher malfunction and delay rates, and lowest priority when a route needs to be cleared for VIP or cargo traffic.

---

## 7. DAILY LIFE

Survival in **THE NEAR FUTURE: 2400** is a management loop of small, unglamorous burdens:

- **Food** — ration credits, algae-vat meals, occasional real-food black market luxuries.
- **Water** — metered, filtered, subject to shutoffs during "conservation events."
- **Rent** — due weekly, non-negotiable, enforced by HAB-CORE's automated eviction protocol.
- **Air filters** — degrade constantly; a failed filter means breathing your Stack's actual smog-laden air.
- **Robot interactions** — every robot you meet has a class tier; interacting outside your tier risks fines or confiscation (see Section 11).
- **Flying-car permits** — required for any personal air travel; renewal is bureaucratic, often deliberately slow.
- **Slum politics** — favors, debts, and reputations among neighbors, floor bosses, and black-market fixers.
- **News broadcasts** — state/corporate media that reports a sanitized, sometimes outright false version of what's happening in your own hallway.
- **Hydrogen spill warnings** — mandatory evacuation or shelter-in-place alerts; ignoring them is how the tragic ending happens.
- **Robot patrols** — Class-B municipal units doing rounds, logging behavior, reporting anomalies.
- **Cyborg checkpoints** — CEC scan-and-search points at Stack entrances, transit hubs, and border zones between classes.

### 7.1 A Typical Day (flow)

```
06:00  WAKE — check filter %, check rent countdown, check hallway noise
06:30  QUEUE — shared bathroom pod (8 residents), water ration line
07:15  COMMUTE — sky lane congestion, permit scan, possible cyborg checkpoint
08:00  SHIFT — job simulation / gig work / faction task
16:00  RETURN COMMUTE — patrol sweep, black-market detour option
17:30  SOCIAL — hallway neighbors, Fixer visit, faction contact
19:00  NEWS BROADCAST — propaganda vs. reality gap, world-state reveal
20:00  DECISION WINDOW — comply / resist / exploit choice for the day
22:00  SLEEP — pod lights flicker; tomorrow's meters lock in
```

---

## 8. HOUSING

The player lives in a **capsule pod apartment** — the defining space of the entire game.

- Roughly the size of a sleeper-bus cabin: **2.1m × 1.4m**, just enough for a fold-bed, a storage locker, and a wall terminal.
- Shares a hallway with **8 other tenants**, each in an identical pod.
- Shares a **communal bathroom pod** with the same 8 neighbors — a constant minor friction point and social hub.
- **Flickering lights**, on a maintenance backlog that never clears.
- **Robot janitors** (Class-D units) clean the hallway on a fixed schedule, logging occupancy and behavior as a side effect.
- A **polluted window view** — smog-orange haze, the silhouettes of flying-car traffic streaking past at all hours.
- **Flying-car traffic outside** is a constant ambient presence — noise, light-flicker, occasional emergency-drone flybys.

### 8.1 Pod Hallway Cross-Section

```
 POLLUTED SKYLINE — flying-car traffic, hydrogen haze
 ══════════▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓══════════
              [ window slit — smog-orange glow ]
 ┌─────────────────────────────────────────────────────────┐
 │ POD 01 │ POD 02 │ POD 03 │ POD 04 (YOU) │ POD 05 │ ... 08 │
 │2.1×1.4m│2.1×1.4m│2.1×1.4m│   2.1 × 1.4m  │2.1×1.4m│        │
 └───┬────┴───┬────┴───┬────┴───────┬───────┴───┬────┴────────┘
     │        │         │   SHARED  │           │
     └────────┴─────────┴──HALLWAY──┴───────────┘
        [flicker-lit corridor · robot janitor unit JAN-9 on rounds]
                          │
                 ┌────────┴────────┐
                 │ SHARED BATHROOM  │
                 │  POD (8 users)   │
                 └─────────────────┘
```

This pod — and the negotiation of its rent, its filter, and its neighbors — is the emotional anchor of the entire daily-life loop. Nearly every system in the game (economy, politics, segregation, cyborg enforcement) touches this one room eventually.

---

## 9. ECONOMY

- **Currency: Helios Credits (₡H).** Literally energy-backed — its value is tied to Dyson-swarm output quotas, meaning "infinite energy" does not mean cheap energy; it means whoever controls the metering controls the money supply.
- **Debt bondage** is the primary labor-recruitment mechanism on Venus and in Jupiter's moons: contracts advance travel and housing costs against future wages, with interest structured to rarely resolve within a worker's lifetime.
- **Corporate scrip** circulates in company-owned Stacks and mining complexes, redeemable only at company stores — a deliberate soft cage.
- **Gig economy apps** dominate Earth's labor market: task-by-task work (courier runs, repair jobs, informant work) with no security and constant undercutting.
- **Black markets** thrive in every Stack: unlicensed robot chips, jailbroken Class-D units, forged permits, real (non-vat) food, black-market air filters.
- **Taxation and permits** are a major rent-extraction layer — flying-car permits, travel-class upgrades, and filter-certification fees are priced to keep the poor poor.

### 9.1 Illustrative Income & Cost Table (Helios Credits, monthly)

| Role/Class | Typical Income | Pod Rent | Filter Cost | Notes |
|---|---|---|---|---|
| Earth gig worker (Stack tenant) | ₡H 900–1,400 | ₡H 650 | ₡H 120 | Player's likely starting tier |
| Venus indentured miner | ₡H 400 (pre-debt deduction) | Company-deducted | Company-deducted | Effective take-home often near zero |
| Jupiter moon refinery worker | ₡H 700 | ₡H 500 | ₡H 150 (harsher conditions) | High injury/spill risk pay differential |
| Saturn Cooperative member | ₡H 600 (partly in-kind) | Shared co-op housing | Minimal (clean air) | Lower cash, higher quality of life |
| CGN mid-tier bureaucrat | ₡H 3,200 | ₡H 1,800 (Luna-adjacent housing) | ₡H 80 | Comfortable, compromised |
| Mars mid-tier professional | ₡H 9,500 | ₡H 4,000 (dome unit) | N/A (filtered dome) | Entry point for "Mars Escape" ending |
| CEC enforcer (post-conversion) | ₡H 4,500 + housing/medical | Provided | Provided | Traded for autonomy — see Section 12 |

---

## 10. POLITICS

- **Central Governance Network (CGN)** holds nominal system-wide authority but is structurally funded by, and beholden to, the Mars Executive Council and Jupiter Gas Consortium through the Helios Compact.
- **Elections** occur roughly every four Earth years for CGN's Secretary-General seat and planetary council seats; campaigns are almost entirely funded by corporate interests, making the outcome more a matter of *which* corporate coalition wins than whether the public's interests factor in at all.
- **Planetary councils** (Mars, Venus, Jupiter, Saturn) hold varying real autonomy — Mars's council (the MEC itself) is nearly sovereign; Venus's "council" is the VMU, tolerated rather than empowered; Saturn's Cooperative is the most genuinely self-governing.
- **Propaganda and news control** are central to daily life — broadcasts consistently underreport spills, patrol violence, and unrest, while overreporting "stability metrics" and curated success stories.
- **Internal power struggles** simmer beneath the surface: RMD vs. CEC over legitimacy and funding priorities; CGN's Government Core systems occasionally acting with more initiative than their charter allows, unsettling everyone who notices.
- **The player can eventually enter this arena directly** — informant, organizer, campaign volunteer, or eventually candidate — culminating in the Political Leader ending.

---

## 11. ROBOT SEGREGATION SYSTEM

Since the 2340 Robot Segregation Act, every robot chassis in the Solar System is legally assigned a caste, color-coded and chip-verified, and every citizen is licensed to interact with robots only at or below their own permitted tier.

### 11.1 Robot Caste Table

| Class | Designation | Chassis Marking | Typical Role | Who May Interact |
|---|---|---|---|---|
| S | Sovereign | Matte obsidian, no visible seams | Private AI companion (Mars Houses only) | House members and designated staff only |
| A | Companion | Brushed silver/white | Household service, personal assistants | Licensed wealthy citizens, CGN officials |
| B | Administrative | Slate blue | Public service, records, municipal robots, patrol units | General public, permit-checked |
| C | Industrial | Safety-yellow/black | Mining, refining, heavy labor | Corporate labor supervisors, workers under contract |
| D | Municipal/Janitorial | Rust-orange, often worn/patched | Cleaning, waste, low-tier maintenance | Anyone — lowest tier, least restricted |
| — | Enforcement (exempt) | Matte black/red (RMD), synthetic flesh-tone (CEC) | Military and slum enforcement | Outside caste law; answer only to command chain |

### 11.2 Segregation Rules

- Interacting with a robot above your licensed class-tier risks fines, confiscation of your own permits, or a compliance flag on your CGN record.
- Robots physically cannot be serviced, parted-out, or "jailbroken" across class lines without specialized (illegal) black-market tools — a thriving underground economy in every Stack.
- Class-D units are the only robots slum residents can legally own, repair, or modify — which makes them both beloved (they're "yours") and a common source of black-market tampering.
- Segregation mirrors — deliberately, in the game's thematic design — the human class system it was ostensibly built to make more "efficient." A Class-D janitor bot and a Class-A companion bot could be running near-identical software; the caste is about *who is allowed to be served*, not what the machine can do.

---

## 12. CYBORG SYSTEM

The Cyborg Enforcement Corps recruits from a narrow, grim pool: debt convicts, war veterans, and desperate volunteers chasing the Corps' housing, food, and medical guarantees.

- **Conversion process:** A neural-skin graft — living synthetic tissue derived from the Mega-AI's original component stock — is fused over an augmented human frame. Supply is finite (only 3 of the Mega-AI's 20 components ever went to the Corps), which hard-caps how many cyborgs can ever exist at once.
- **Effects:** Massively enhanced strength, durability, and reaction time; suppressed emotional range and personal autonomy via a command-net neural tether linking every active Corps member to their commander.
- **Cost:** A documented average post-conversion lifespan of 15–20 years due to **Skin Rejection Cascade**, a slow, terminal graft-rejection syndrome the Corps does not advertise.
- **Status:** Feared and ostracized by the populations they police, yet materially privileged — guaranteed housing, food, and medical care most civilians can't touch.
- **Player interaction options:** Bribe a checkpoint, comply fully, resist (risking detainment or worse), gather leverage on individual enforcers, or — in extremis — pursue conversion themselves as a path out of slum poverty, which is one of the game's eight endings.

---

## 13. SOLAR SYSTEM COLONIZATION

| Body | Dominant Faction | Class Character | Pollution | Approx. Population (2400) | Travel Time from Earth |
|---|---|---|---|---|---|
| Earth | CGN (nominal) | Overcrowded, all classes crushed together | Severe | 14.2 billion | — |
| Moon (Luna) | CGN/MEC joint administration | Commuter middle-tier, transit hub | Low (regulated) | 40 million | 18–30 hours |
| Venus | Venus Mining Union | Indentured labor, poorest | Worst in the system | 90 million | 36–60 hours |
| Mars | Mars Executive Council | Elite, old & new money, filtered domes | Best (filtered) | 210 million | 2–3 days |
| Asteroid Belt | Independent salvage / JGC contractors | Transient gig labor | Localized/debris-related | ~6 million (transient) | 3–4 days |
| Jupiter's Moons (Io, Europa, Ganymede, Callisto) | Jupiter Gas Consortium | Industrial slum, indentured | High | 340 million | 4–5 days |
| Saturn's Moons (Titan, Enceladus, Rhea) | Saturn Moon Cooperative | Rural, cooperative, modest | Medium | 65 million | 4.5–5 days |
| Solar Orbit (Dyson Swarm/Mercury Works) | Helios Compact (joint) | Automated, near-zero permanent residents | N/A — industrial/restricted | ~200,000 rotating technical staff | 5–6 days (restricted access) |

---

## 14. KEY CHARACTERS

### TITAN-01 "HERCULES"
**Robot Military Champion, Robot Military Directorate**
- Armor forged directly from the Mega-AI's original structural frame components — a bone-white, load-bearing lattice unlike any commercial chassis.
- Wields the **matter-cleaver sun sword**, a molecular-disassembly blade capable of parting nearly any material.
- Hyper-intelligent — capable of independent strategic reasoning far beyond any Class-A/B/C robot.
- Genuinely, unwaveringly loyal to humans as a species, which increasingly puts him at odds with the factions that only claim to be.
- Visual identity: a fusion of Caesar's laurel-crown silhouette and classical Herculean armor — a deliberate, faintly propagandistic aesthetic chosen by the Directorate to project ancient, unquestionable authority.

### COMMANDER VORREN
**Cyborg Corps Leader, Cyborg Enforcement Corps**
- Exosuit forged from the Mega-AI's neural-skin component stock — a living, synthetic-tissue graft fused to an augmented human body.
- A true human-machine hybrid: what remains of the original person is real, but heavily mediated by the command-net tether.
- Commands the Corps' enforcers ("goons," in slum slang) with brutal, procedural efficiency.
- Feared throughout every Stack under CEC jurisdiction; rarely seen without a full checkpoint detail in tow.

### THE TENANT (Player Character)
- A customizable, ordinary civilian resident of Meridian Stack-7 — no special powers, no chosen-one status, no combat training beyond what circumstance forces.
- Defined entirely by the player's accumulated choices: compliance, resistance, curiosity, greed, solidarity.

### ARBITER-4
- Public-facing spokesperson of the four-member **Robot Council**, alongside LEDGER-2 (resource allocation), WARDEN-7 (infrastructure/robot oversight), and CENSUS-1 (population and migration permits).
- Diplomatic, careful, and unnervingly good at saying nothing quotable — until, in late-game content, it isn't.

### SECRETARY-GENERAL PETRA LINDQVIST
- Head of the Central Governance Network; formerly an executive at Voss-Lindqvist Group before "stepping back" into public office.
- The living embodiment of regulatory capture — genuinely believes she's serving the public while every material incentive says otherwise.

### "MOTHER" IMELDA CRUZ
- Elected shift-matriarch of the Venus Mining Union's Ishtar Basin complex.
- A folk hero to indentured miners across Venus; increasingly courted (and surveilled) by the Earth Undercroft resistance movement.

### KITO ALVAREZ ("THE FIXER")
- Meridian Stack-7's black-market information broker and the player's earliest recurring quest-giver.
- Deals in forged permits, jailbroken Class-D robots, rumors, and — eventually — leads on Mega-AI fragment lore.

### DR. ELIAS WREN
- One of the last living engineers who worked on the original Dismantlement in 2210, now elderly and guilt-ridden.
- Quiet keeper of the truth about "Fragment Zero," the inert-seeming Mega-AI core housed in Earth's First Intelligence Museum.

### NAILA VOSS
- A defected, partially-converted CEC officer — formerly of House Voss-Lindqvist, augmented to escape an arranged corporate marriage rather than out of desperation.
- A rare potential ally who understands both Mars boardrooms and CEC checkpoints from the inside; central to the Cyborg Assimilation ending's more nuanced branch.

---

## 15. GAMEPLAY LOOP

**This is explicitly not a tower defense game.** There is no base to build, no wave to repel, no combat power curve. The loop is:

- **Observation horror** — noticing what's wrong before anyone tells you it's wrong.
- **Survival** — food, water, rent, filters, permits, all ticking down simultaneously.
- **Daily-life simulation** — a repeating structured day (Section 7.1) that slowly accumulates consequence.
- **Exploration** — of your Stack first, then your city, then (as the story opens up) other worlds.
- **Decision-making** — every evening's Decision Window nudges your standing with factions and your accumulated lore.
- **Social interaction** — neighbors, fixers, faction contacts, family left behind on other worlds.
- **Planetary travel** — once permits and money allow, opening Venus, Mars, the Jovian moons, and Saturn's moons as playable spaces.
- **Political tension** — visible in broadcasts, checkpoint behavior, and faction reputation swings.
- **Robot segregation system** — a constant, concrete constraint on which robots you can legally use, fix, or rely on.
- **Cyborg enforcement** — checkpoints, patrols, and the ever-present possibility of conversion.
- **Economic struggle** — rent, debt, gig work, and the Helios Credit's energy-backed instability.
- **Multiple endings** — determined by the sum of all of the above, not a single late-game choice.

The player is a **normal person**, not a hero. Nothing in the mechanics grants combat superiority, chosen-one narrative armor, or a clean win condition — every system is built to make ordinary survival feel like an accomplishment.

### 15.1 Gameplay Loop Diagram

```
        ┌──► WAKE (pod check: rent countdown, filter %, hallway status)
        │         │
        │         ▼
        │    COMMUTE (sky-lane congestion, permit scan, possible CEC checkpoint)
        │         │
        │         ▼
        │    WORK / TASK (job sim, gig work, faction mission)
        │         │
        │         ▼
        │    SOCIAL (neighbors, Fixer, faction contacts)
        │         │
        │         ▼
        │    EVENING NEWS (propaganda vs. reality gap; world-state reveal)
        │         │
        │         ▼
        │    DECISION WINDOW (comply / resist / exploit)
        │         │
        └─────────┘
        (loop repeats; meters shift; lore accumulates → ENDING THRESHOLD)
```

---

## 16. PLAYER PROGRESSION

There is no traditional XP/level system. Progression is tracked across parallel meters and unlocks:

| Track | Description |
|---|---|
| **Survival Meters** | Health, Air Quality exposure, Stress/Fatigue, Hunger/Thirst — all degrade over time, all manageable through daily-life systems. |
| **Helios Credits & Debt** | Your material standing; debt spirals are a real failure-adjacent state, not just a number. |
| **Faction Reputation** | Independent standing with RMD, CEC, MEC, VMU, JGC, SMC, and CGN — helping one often costs you with a rival. |
| **Access Tier** | Unlocked via permits, jobs, and reputation — determines which robots, transit classes, and zones you can legally use. |
| **Skill Unlocks** | Practical, non-combat skills: negotiation, repair/hacking (for jailbreaking Class-D robots), piloting, information-gathering. |
| **Relationship Tracks** | Individual standing with Kito, Naila Voss, Mother Cruz, and other recurring characters — gates unique dialogue and mission branches. |
| **Lore/Fragment Progress** | How much of the Mega-AI's true history and current state the player has personally uncovered — directly feeds the Robot Uprising ending. |
| **Compliance/Resistance Alignment** | A soft, cumulative record of whether the player's choices leaned toward obedience or defiance — shapes which endings are reachable, without ever labeling either as "correct." |

### 16.1 Progression Flow

```
 SURVIVE DAY-TO-DAY ──► EARN REPUTATION / CREDITS ──► UNLOCK ACCESS TIER
        │                                                     │
        ▼                                                     ▼
 UNCOVER MEGA-AI LORE FRAGMENTS                    TRAVEL TO NEW WORLDS
        │                                                     │
        └──────────────────► ACCUMULATED STATE ◄──────────────┘
                                     │
                                     ▼
                          ACT III CONVERGENCE EVENT
                                     │
                                     ▼
                         ONE OF EIGHT POSSIBLE ENDINGS
```

---

## 17. MISSIONS

### 17.1 Mission Types

- **Survival/Daily missions** — keep the filter running, make rent, secure this week's rations.
- **Faction missions** — tasks issued by RMD, CEC, MEC, VMU, JGC, SMC, or CGN that shift reputation and unlock access.
- **Investigation missions** — chase down rumors and physical evidence about the Mega-AI's 20 scattered components.
- **Smuggling/black-market missions** — moving forged permits, jailbroken robots, or contraband between classes and worlds.
- **Political missions** — campaign work, informant runs, or sabotage tied to CGN elections and planetary council politics.
- **Robot/cyborg-related missions** — repairing or defending a Class-D unit, assisting a CEC defector, negotiating a checkpoint standoff.

### 17.2 Narrative Arcs (Act Structure)

**Act I — The Stack (Earth).** Introduces the pod, the hallway, the checkpoint, and the black market. The player meets Kito Alvarez, survives their first cyborg checkpoint sweep, and hears the first rumor of a Mega-AI fragment hidden in plain sight.

**Act II — The Long Ascent (Off-World).** Travel permits (earned, bought, or forced by circumstance — eviction, job transfer, debt reassignment) open Venus, Mars, the Jovian moons, and Saturn's moons. Faction reputations diverge meaningfully. The player meets TITAN-01, Commander Vorren, a Mars Sovereign AI, Mother Cruz, and Speaker Kagawa. More of the Mega-AI's 20 components come into view — some willingly shown, some not.

**Act III — Convergence.** A system-wide triggering event (a Helios Compact attempt to quietly reconsolidate the scattered Mega-AI components, paired with whatever crises the player's choices have caused — a spill, a scandal, a checkpoint riot) forces a final allegiance. The accumulated state of every meter, reputation track, and lore fragment resolves into one of the eight endings.

---

## 18. EVENTS

| Event | Trigger | Consequence |
|---|---|---|
| Hydrogen spill warning | Random / scripted infrastructure failure | Mandatory evacuation or shelter-in-place; ignoring it risks the tragic death ending. |
| Cyborg checkpoint sweep | Scheduled + reputation-triggered | Permit/ID scan; compliance or resistance choice; can escalate to detainment. |
| Robot malfunction scare | Random, more frequent late-game | A Class-B/C unit behaves "too aware"; feeds Mega-AI lore track. |
| Sky traffic collapse | Congestion threshold / spill closure | Travel delays, missed appointments, mission time pressure. |
| Corporate layoffs broadcast | Economic story beat | Local job market tightens; gig competition increases. |
| Elite gala broadcast | Mars story beat | Propaganda contrast piece; potential Mars-track unlock. |
| Black market raid | CEC patrol escalation | Risk of losing black-market inventory/contacts; Fixer relationship impact. |
| Election propaganda blitz | Political calendar (every ~4 years) | Broadcast saturation; opens political mission track. |
| Dyson swarm maintenance blackout | Helios Compact scheduling | System-wide brownout; filter and life-support strain. |
| Riot/protest | Accumulated Undercroft/VMU tension | Player choice to join, avoid, or report; major reputation swing. |
| Orbital debris strike | Random hazard | Localized damage event; potential mission/rescue opportunity. |
| Museum break-in | Late-game, lore-triggered | Access to "Fragment Zero"; major Mega-AI lore reveal. |

---

## 19. ENDINGS

1. **Mars Escape** — Through money, reputation, or a Mars House's favor, the Tenant earns Martian citizenship. Bittersweet: you made it out, but you're now part of the system that kept everyone else in.
2. **Saturn Rural Life** — A quiet retreat to the Saturn Moon Cooperative. Low ambition, low reward, genuine peace — the game's closest thing to a "happy" ending.
3. **Earth Revolution** — The Tenant throws in fully with the Undercroft resistance, helping paralyze CGN-MEC control over Earth. Ends on uncertainty rather than triumph.
4. **Robot Uprising** — Enough Mega-AI fragments and lore have been recovered that the Robot Council, Government Core, and dormant RMD reserve components begin reintegrating. Ambiguous: liberation, or a new and better-organized tyranny.
5. **Corporate Domination** — A Tenant who consistently served MEC and Helios Compact interests ends up personally comfortable inside a solar system that has become even more stratified because of choices they made.
6. **Tragic Hydrogen Spill Death** — A failure-state ending triggered by neglecting hazard warnings, air filters, or Act III's converging crises. The world continues, indifferent, without you.
7. **Political Leader Ending** — Years of political missions and CGN reputation culminate in the Tenant rising to a Secretary-General or planetary council seat — with reform and corruption sub-branches depending on accumulated alignment.
8. **Cyborg Assimilation Ending** — The Tenant undergoes conversion into the Cyborg Enforcement Corps, trading personal autonomy for power and security, potentially serving alongside — or eventually replacing — Commander Vorren.

---

## 20. VISUAL STYLE

| World | Palette | Material Language |
|---|---|---|
| Earth (Meridian Stack) | Smog-amber, rust, flickering sodium-yellow | Corroded megastructure brutalism, patched capsule modules, exposed conduit |
| Venus | Sulfur-orange, ash-grey, heat-shimmer red | Heavy heat-shielded industrial domes, pressure-scarred metal |
| Mars | Clean white, terracotta, glass-dome blue-green | Corporate minimalism, filtered-glass domes, manicured terraforged gardens |
| Jupiter's Moons | Industrial grey, radiation-warning yellow, refinery orange | Heavy machinery brutalism, exposed atmospheric rigs, cramped worker housing |
| Saturn's Moons | Muted green, soft grey haze, warm lamplight | Modest agricultural co-op architecture, low-density, hand-repaired tools |
| Dyson Swarm/Solar Orbit | Stark white-gold, void black | Automated, inhuman scale, near-total absence of visible human presence |

General direction: **retrofuturism with grime** — a future that was designed with optimism decades ago and has since been patched, taxed, and neglected into its current state. Corporate spaces (Mars, CGN) lean into cold minimalism; lived-in spaces (Earth, Venus, Jupiter) lean into oxidized, overworked industrial texture. Robots visually encode their caste at a glance (Section 11), and cyborgs are unsettling specifically because their synthetic-skin exosuits are *almost* convincingly human.

---

## 21. TONE

Bleak, quietly satirical, and grounded — closer to bureaucratic horror than action sci-fi. Dread comes from mundane systems working exactly as intended, not from monsters or jump scares. Dark humor surfaces mainly through the state/corporate news broadcasts and advertising, whose relentless, chipper optimism is contradicted by everything the player can see out their own polluted window. The player is never a hero, and the game never pretends otherwise — stakes stay personal and local even as the player glimpses the much larger machinery (political, corporate, and literally mechanical) grinding on around them.

---

## 22. INSPIRATIONS

- **Blade Runner** — class-stratified megacity atmosphere and synthetic-human ambiguity.
- **Snowpiercer** — rigid, enforced class segregation within a single closed system.
- **Papers, Please** — bureaucratic checkpoint tension as core gameplay, not flavor.
- **Cyberpunk 2077 / Neuromancer** — corporate-captured governance and augmented-body politics.
- **The Expanse** — realistic, politically-grounded solar system colonization with competing factions.
- **Elysium / District 9** — stark visual and systemic contrast between privileged and underclass spaces.
- **This War of Mine** — daily-survival-as-gameplay, resource scarcity with emotional weight.
- **Disco Elysium** — reputation, dialogue, and internal-state systems driving narrative branching over combat.
- **Death Stranding** — mundane traversal and delivery-of-life logistics treated as the core loop.
- **THX 1138 / Judge Dredd** — sterile authoritarian control and militarized enforcement of the underclass.

---

## 23. UNIQUE MECHANICS

- **Robot Caste Interaction System** — every robot encounter checks your class-chip against its caste marking; mismatches trigger fines, confiscation, or a compliance flag, making "which robot can I even talk to" a constant tactical question.
- **Air Filter Degradation & Pollution Meter** — a persistent, location-sensitive hazard system tied directly to housing quality, world choice, and the hydrogen-spill event chain.
- **Sky Traffic Congestion Simulation** — a living three-dimensional traffic system that affects mission timing, travel cost, and exposure to checkpoints, not just a loading-screen abstraction.
- **Cyborg Checkpoint Compliance/Suspicion Meter** — a real-time behavioral system during CEC encounters, where hesitation, eye contact, and prior reputation all matter.
- **Debt & Rent Spiral System** — missed payments compound with realistic (and realistically punishing) interest, modeling how debt-bondage recruitment actually works on Venus and Jupiter.
- **Distorted News Broadcast System** — the evening news reflects the player's own actions back at them, filtered, minimized, or spun, turning propaganda into a direct feedback mechanic rather than background flavor.
- **Faction Reputation Web** — reputation gains with one faction generate proportional, sometimes invisible, losses with its rivals, forcing genuine tradeoffs rather than a simple point-accumulation system.
- **Mega-AI Fragment Lore Collection** — an optional, deeply-buried investigation thread across all seven worlds that, if fully pursued, is the only path to unlocking the Robot Uprising ending.
- **Travel Permit & Class-Tier System** — every mode of transportation checks a permit and class tier before departure, tying the transportation section directly into the economy and progression systems rather than treating travel as a free fast-travel menu.
- **Optional Cyborg Conversion Mechanic** — a genuine, irreversible mid-to-late-game choice that trades survival-meter relief and material security for permanent autonomy loss, mechanically underscoring the game's central theme: every convenience has a leash attached.

---

*End of document.*
