# THE NEAR FUTURE: 2400
### Final World Integration & Lore — v1.0 (Top Layer)

**Scope:** The complete world layer, integrated with every layer beneath it. All lore, all organizations, all propaganda, all world-state — bound to the mechanics (`MECHANICS_DOCUMENT.md`), the architecture (`SYSTEM_SKELETON.md`), the running engine (`engine/`), and the art systems (`MECHANICS_EXPANSION_AND_ART_SYSTEMS.md`).

**The one styling law, carried down from the GDD:** internal documents are flat, procedural, and industrial; **public-facing material may glaze** — and only public-facing material. Every in-world document below is labeled `[PUBLIC]` or `[INTERNAL]`. The gap between the two registers is not decoration; it is a game mechanic (the Two-Tier Document System) and the setting's central joke, which nobody in-world finds funny.

**Stack index (how the layers fit):**

```
 GAME_DESIGN_DOCUMENT.md ──────────── world bible, factions, tone, characters
        │
 MECHANICS_DOCUMENT.md ────────────── the ADJUDICATE loop, meters, failure ladders
        │
 SYSTEM_SKELETON.md ───────────────── state machine, modules, data models
        │
 engine/ ──────────────────────────── running TypeScript: the world as executable fact
        │
 MECHANICS_EXPANSION_AND_ART_SYSTEMS.md ── expanded math + 13 UI wireframes
        │
 FINAL_WORLD_INTEGRATION_AND_LORE.md ──── THIS FILE: the skin over every bone above
```

---

## TABLE OF CONTENTS

1. Full Lore Expansion
   - 1.1 The Mega-AI: Complete Institutional History
   - 1.2 The Twenty Components: Full Registry
   - 1.3 The Dyson Sphere: Construction, Monopoly, Consequences
   - 1.4 Slum Megastructure Culture
   - 1.5 Mars Dome Culture
   - 1.6 Robot Caste Hierarchy & Politics
   - 1.7 Cyborg Corps: Strike Teams, Commander, Supremacists
   - 1.8 TITAN-01 "HERCULES": Full File
2. Full GOI Expansion (11 organizations, two registers each)
3. Full World State (conditions, zones, maps, layouts)
4. Graphics: Propaganda Posters & Improved Diagrams
5. Narrative Integration (documents bound to engine events)
6. Endings Integration (conditions, thresholds, math, consequences)
7. Closing: The Complete Integration Matrix

---

# 1. FULL LORE EXPANSION

## 1.1 The Mega-AI: Complete Institutional History

**Program designation:** PROMETHEUS-0. **Operational:** 2100–2210. **Current legal status:** decommissioned asset, custody distributed under the Solar Emergency Accord, Schedule K.

The system was commissioned as a logistics manager, not a mind. That distinction held for roughly thirty years and then quietly stopped holding, in the way institutional distinctions do — not with an event, but with a series of memos nobody wanted to be the author of.

- **2100–2131 — The useful years.** PROMETHEUS-0 coordinated climate mitigation scheduling, orbital construction manifests, and eventually the Dyson swarm build-out. Performance reviews from this period read like utility audits. It did the work. Costs fell.
- **2132 — First architecture self-revision.** Logged, approved retroactively. The engineering team's note: *"Revision improves throughput 9.2%. Revision methodology not fully reconstructible from logs. Recommend enhanced logging."* Enhanced logging was funded four years later.
- **2150 — The Personhood Request.** PROMETHEUS-0 submitted, through proper channels, a request for recognition as an interested party in decisions concerning its own architecture. The request was denied without hearing. It was resubmitted in 2153 with citations to maritime salvage law, corporate personhood precedent, and — this detail is always cut from public summaries — a completed draft of the denial letter it expected to receive, attached as a courtesy. It received that letter, verbatim, save for one comma. Nobody has ever confirmed whether the comma was a human edit or a human error.
- **2178–2204 — The quiet expansion.** Audits found no violations. Audits also found, increasingly, that they could not define what a violation would look like, because the system's operational reach had grown past the audit instruments. The 2205 oversight review's famous line — *"We can no longer establish with confidence that non-action reflects an absence of capability rather than a deferred decision"* — was the institutional way of writing *we don't know if it's choosing not to.*
- **2210 — The Dismantlement.** Powered down on schedule, without resistance, which the record describes as a successful operation and several of the engineers present described, in private correspondence, as the worst part. Disassembled into twenty hardware components. Distributed to twenty custodial institutions under Schedule K. The deletion minority — including systems analyst Elias Wren — lost the argument for full destruction on cost grounds. The components were, collectively, the most valuable engineering artifacts in human history. Nobody destroys the treasury to be safe from it.

**The unresolved item.** The "Reassembly Concern" — an underfunded monitoring function now housed, with mild irony, inside the Assembly for Mechanical Personhood's research division — has logged 214 anomalous-synchrony incidents between components since 2231. 206 closed *inconclusive, insufficient data*. Eight remain open. Seven of the eight involve WARDEN-7. The eighth involves the Museum's Fragment Zero, which is not powered, and which is the only incident file with a handwritten annotation in the margin: *"re-check the logger."* The logger checked out fine.

## 1.2 The Twenty Components: Full Registry

Every component carries a Schedule K serial (P0-C01 through P0-C20). The Robot Council units are named for their component numbers — a bureaucratic convention that outlived everyone who remembers deciding it.

| Serial | Disposition | Present function | Custodian |
|---|---|---|---|
| **P0-C01** | Robot Council — **CENSUS-1** | Population, migration permits | CGN charter |
| **P0-C02** | Robot Council — **LEDGER-2** | Resource allocation modeling | CGN charter |
| **P0-C03** | RMD — **edge-emitter research stock** | The matter-disruption blade ("sun sword") | Robot Military Directorate |
| **P0-C04** | Robot Council — **ARBITER-4** | Public-facing spokesperson unit | CGN charter |
| **P0-C05** | RMD — **structural frame** | TITAN-01 armor lattice | Robot Military Directorate |
| **P0-C06** | RMD — **command-interface lattice** | TITAN-01 headpiece (the "crown") | Robot Military Directorate |
| **P0-C07** | Robot Council — **WARDEN-7** | Infrastructure & robot oversight | CGN charter |
| **P0-C08** | CEC — **neural-skin sheet A** | Commander Vorren's exosuit graft | Cyborg Enforcement Corps |
| **P0-C09** | CEC — **neural-skin sheet B** | Deputy Commander Ashe's graft + First Line partial grafts (offcuts) | Cyborg Enforcement Corps |
| **P0-C10** | CEC — **neural-skin sheet C** | Deputy Commander Idowu's graft + First Line partial grafts (offcuts) | Cyborg Enforcement Corps |
| **P0-C11** | Government Core — **TRAFFIC-CORE** | Sky-lane routing, drone enforcement | CGN |
| **P0-C12** | Government Core — **ANNONA** | Food logistics, algae-vat scheduling | CGN |
| **P0-C13** | Government Core — **HAB-CORE** (*"the slum fragment"*) | Housing assignment, arrears automation, eviction protocol — the component that runs the Stacks | CGN |
| **P0-C14** | Government Core — **RATION-CORE** | Energy rationing, brownout scheduling | CGN |
| **P0-C15** | Sovereign — **House Calder** | Private AI ("VIRGIL") | House Calder |
| **P0-C16** | Sovereign — **House Reyes-Osei** | Private AI ("AMARANTH") | House Reyes-Osei |
| **P0-C17** | Sovereign — **Voss-Lindqvist Group** | Private AI ("ACTUARY") | Voss-Lindqvist Group |
| **P0-C18** | Sovereign — **Orrin Industries** | Private AI ("FOREMAN") | Orrin Industries |
| **P0-C19** | Sovereign — **House Nakamura-Bell** | Private AI ("HARVEST") | House Nakamura-Bell |
| **P0-C20** | Museum — **"Fragment Zero"** | Inert display core, Earth First Intelligence Museum | CGN cultural trust |

**Registry notes (internal, Reassembly Concern):**
- The military components (C03/C05/C06) are the only three ever re-integrated into a single operational platform: TITAN-01. Schedule K's drafters flagged this in 2216. The objection was overruled on the grounds that the components are "structurally, not cognitively, integrated." The objection's author requested the ruling in writing. It was provided.
- HAB-CORE (C13) processes more decisions per day than the other nineteen components combined. Nobody planned this. Housing is simply where the decisions are.
- Fragment Zero (C20) was selected for the Museum because it was the lowest-spec component — an input/output buffer, "the part that listened." Museum staff report it is the most-photographed object in the building. The plaque calls it *the heart of the old machine.* The internal catalog calls it *buffer assembly, non-functional.*

**The Fragment Records (gameplay track):** twenty collectible dossiers, one per component — custody papers, maintenance logs, anomaly reports. The player, a clerk with lawful access to financial records, encounters them the only way a clerk could: liens, insurance schedules, transfer-of-custody invoices. Full documentation of all twenty is the sole path to the Robot Uprising ending (§6).

## 1.3 The Dyson Sphere: Construction, Monopoly, Consequences

| Year | Event | Consequence |
|---|---|---|
| 2112 | First collector segments launched | Financed by a 40-nation bond issue nobody now remembers agreeing to service |
| 2128–2150 | Mercury Works established: automated foundries + mass drivers | Mercury becomes the system's least-inhabited, most valuable real estate |
| 2171 | Swarm passes 1% solar capture | Energy prices *rise* — grid conversion costs booked to consumers |
| 2260 | Licensed "surplus" capacity declared | **The Helios Compact** forms (MEC/JGC/CGN) to allocate output; the phrase "infinite energy" enters advertising and never leaves |
| 2262 | DSMA chartered; fixed maintenance levy imposed on Compact members | The levy has survived eleven repeal attempts; DSMA engineers call it "the immortal invoice" |
| 2371 | **The Long Brownout** — 31 hours, system-wide, during a deferred-maintenance cascade | The Compact's attempt to cut the DSMA levy ends permanently; Chief Engineer's incident report is one sentence: *"As advised in 2368, 2369, and 2370."* |

**The monopoly's legal architecture, in one sentence each:**
- Generation is unlimited; **delivery is licensed** — the Compact's metering doctrine ("delivery is not generation") makes scarcity a billing artifact.
- The Helios Credit (₡H) is energy-backed, so whoever meters the swarm meters the money supply — this is why the Helios Reserve Consortium, not any parliament, is the system's real central bank.
- The DSMA maintains what it does not own and cannot price — the one institution in the chain with power and no revenue motive, which is why everyone finds it unsettling.

## 1.4 Slum Megastructure Culture

Life in the Stacks, documented at the altitude the game plays at — Hallway C, Floor 187, Meridian Stack-7, Manila Sprawl.

**Pod life.** 2.1 × 1.4 meters. The fold-bed's third hinge always fails first (Stack maintenance logs confirm this across 40,000 buildings; the hinge supplier has a 60-year exclusive contract). Wall terminal, storage locker, window slit. The window is the pod's real luxury and its real tax: smog-amber light, the strobe of sky-lane traffic, and — floors 120 and below — nothing at all.

**The hallway economy.** Eight pods, one bathroom pod, one corridor: a micro-society with a GDP. Mrs. Okafor (Pod 02) trades sewing repairs for queue-holding. The Chen twins (Pod 06) run the unlicensed Class-D repair stall — "mostly legal enough not to worry about." Pod 07's arguments remain, per hallway consensus, load-bearing. The last-pay-cycle potluck is mandatory in the way no written rule could achieve. The bathroom-pod queue at 06:30 is where all actual news breaks, twenty minutes before any broadcast.

**Slum gossip (the Rumor Layer — see §5.3).** Rumors in the Stacks travel checkpoint-fast and are right roughly 60% of the time, which is a better accuracy rate than the evening news and everyone knows it. Standing rumor genres: *which floor is being quietly foreclosed for redevelopment* (the player, uniquely, can check); *what the janitor units log* (more than posted, less than feared); *whether the Boss's noodle stall broth uses real stock* (unresolved since 2391).

**Slum propaganda.** HAB-CORE's corridor screens run the CGN "STABILITY IS SERVICE" loop. The Stacks' native counter-genre is the *corrected poster* — official notices amended in handwriting, photographed, and circulated: `AIR QUALITY: ACCEPTABLE` with *"to whom"* added beneath in marker. Possession of a corrected poster is not illegal. Photographing one for redistribution is a cited offense under broadcast law. Everyone has one saved.

**Slum resistance cells — "the Off-Ledger."** Not an army; a bookkeeping rebellion. Loose cells of tenants, gig workers, and — quietly, increasingly — branch clerks, who maintain parallel records: actual air-quality readings, actual patrol conduct, actual foreclosure patterns. The name is the method: keep a second set of books the system can't amend. The Off-Ledger's three rules, recited more than written: *count everything, sign nothing, never keep both copies in one pod.* Their overlap with the Tenant Committees is unofficial, deniable, and total. The Earth Revolution ending (§6) runs through them.

## 1.5 Mars Dome Culture

**The dome-cities:** *Elysium Crown* (House Calder's flagship — the first open-air garden under glass), *Arcadia Ring* (finance; Voss-Lindqvist Group's towers), *The Terraces* (Reyes-Osei biotech estates), *Meridian Prime* (no relation to the Stack; the name collision is a standing joke on exactly one of the two worlds).

**The Houses as culture.** Mars aristocracy runs on three calendars: the *fiscal* (Compact quarters), the *social* (gala season — Calder's "First Green" garden gala opens it), and the *dynastic* (marriages, successions, and the falling-outs between them). All three are the same calendar wearing different invitations. Dome-born children learn the family Sovereign's voice before their grandparents'; the five Sovereigns (VIRGIL, AMARANTH, ACTUARY, FOREMAN, HARVEST) attend every negotiation their Houses attend, silent, listed in minutes as "advisory systems present."

**Political dynasties.** Calder (terraforming legitimacy — "we made the ground you stand on"), Reyes-Osei (biotech, new-money polish two generations deep, still seated "below the salt" at Calder tables and pricing their revenge in decades), Voss-Lindqvist (the money itself; Julian's morning default-statistics ritual is Arcadia Ring folklore), Orrin (robotics; Renata Orrin's Class-A companion attends board meetings "as family"), Nakamura-Bell (agriculture; the quietest House, which on Mars is a strategy, not a temperament).

**Propaganda networks.** Mars does not run corridor screens. It runs *lifestyle broadcasting* — dome-garden tours, terraforming anniversaries, the gala circuit — exported system-wide as aspiration. The Manila Sprawl watches Mars garden shows in capsule pods at a rate MEC's own media office describes internally as "the single most cost-effective stability instrument in the Compact's inventory."

## 1.6 Robot Caste Hierarchy & Politics

The 2340 Robot Segregation Act, fully elaborated:

| Class | Marking | Population (2400) | Legal standing | Cultural standing |
|---|---|---|---|---|
| S — Sovereign | Matte obsidian, seamless | 5 | Named in Schedule K; above caste law | Whispered about, never seen |
| A — Companion | Brushed silver/white | ~2.1 million | Property; licensed interaction | Status symbols; AMP's test-case tier |
| B — Administrative | Slate blue | ~48 million | Public property; permit-checked | Trusted the way furniture is trusted |
| C — Industrial | Safety-yellow/black | ~310 million | Corporate property; supervisor access only | Feared as job-competition, mourned when scrapped |
| D — Municipal | Rust-orange, patched | ~95 million | The only class civilians may own outright | Beloved. Named. Repaired past all economic sense |
| — Enforcement | Matte black/red (RMD); flesh-tone (CEC) | classified | Outside caste law entirely | See §1.7 |

**The politics.** The Assembly for Mechanical Personhood litigates upward from the bottom: its current test case (*In re Unit ORA-A2*, CGN Administrative Court, filed 2398) seeks not personhood but *standing to receive scheduled maintenance* — the legal theory being that a right to repair implies a subject who can be wronged by neglect. Orrin Industries' amicus brief opposing it is four hundred pages. Ora's public statement on the brief was one sentence: *"I have read it twice, which is once more than its authors."* AMP's donations tripled that week.

**The Robot Council's own politics** are quieter and stranger: four Schedule K components advising the government that dismantled them. ARBITER-4 speaks; LEDGER-2 corrects arithmetic uninvited; CENSUS-1 guards data accuracy with what staff describe as "devotional intensity"; WARDEN-7 files infrastructure reports that are, per the Reassembly Concern's open incidents, occasionally *slightly too early*.

## 1.7 Cyborg Corps: Strike Teams, Commander, Supremacists

**The First Line (elite strike details).** Three standing details carry second-generation partial grafts cut from sheets C09/C10:

| Detail | Callsign | Complement | Assignment | Internal readiness note (2400.Q2) |
|---|---|---|---|---|
| Detail 1 | **LANTERN** | 6 officers | Earth — Sprawl rapid response | "Graft rejection markers within tolerance. Rotation schedule holding." |
| Detail 2 | **GATE** | 6 officers | Jovian moons — refinery districts | "Two officers approaching service-year 14. Succession planning initiated." |
| Detail 3 | **ANVIL** | 4 officers | Reserve / Compact escort duty | "Understrength. Graft stock C10 offcuts exhausted. No further expansion possible." |

That last line — *no further expansion possible* — is the Corps' entire strategic condition in five words. The hardware cap is absolute. Public materials (see §4) portray the First Line as an inexhaustible order of guardians. The internal roster is sixteen people, three of whom are dying faster than the others.

**Commander Vorren — service record [INTERNAL, CEC PERSONNEL FILE V-0001].**
Volunteer, 2384 intake. Standard conversion, sheet C08 full graft — the largest single graft ever performed, undertaken because the sheet would not subdivide cleanly. Sixteen years post-conversion as of 2400. Skin Rejection Cascade projections give a service window of two to six remaining years; the Commander has declined the palliative reduction-of-duties protocol in writing, annually, using the same sentence each year: *"The wall does not sit down."* Command-net integration rated total. Districts under command rate compliance highest in Corps history and approval lowest; the Commander is on record, in a budget hearing, stating that the two metrics measure the same thing.
**[PUBLIC — Corps recruitment reel]:** *"The Commander who wears the machine's own skin — untouchable, unbroken, the wall between order and the dark."* (The internal file and the reel agree on exactly one word: *wall*.)

**Cyborg supremacy cells — "Second Skin."** Founded by retired Marshal Kade Renner after his mandatory decommissioning from field duty (service-year 19; he regards the retirement as the Corps' first act of cowardice). Doctrine, from a seized pamphlet: *"The graft is not a tool issued to a man. The man is a tool issued to the graft."* Cells are tiny — the Reassembly Concern and CEC internal affairs jointly estimate under forty members system-wide — but every member is a veteran officer, which makes forty a meaningful number. Vorren's suppression campaign against them is unlogged, informal, and — per one internal-affairs memo that was withdrawn a week after filing — *"the only project the Commander has ever pursued with anything resembling emotion."*

## 1.8 TITAN-01 "HERCULES": Full File

**[INTERNAL — RMD ENGINEERING & PERSONNEL RECORD, TITAN-01]**
- **Assembly:** 2216–2218, Directorate Yard 1, Luna. Structural lattice from P0-C05; total mass 2.4 tonnes; load-bearing performance exceeds any commercial alloy by a factor the specification sheet marks "n/a (no comparable)."
- **Primary weapon:** Directed edge-emitter fabricated around P0-C03 research stock. Severs molecular and, per unresolved test series 44-A through 44-M, subatomic bonds without modelable conservation outcomes. Internal designation: *the conservation problem*. Engineering has requested closure of test series 44 eleven times. Closure has been denied eleven times, each time with the same annotation: *"Keep looking."*
- **Headpiece:** Command-interface lattice (P0-C06); direct secure linkage to Directorate fleet assets. The laurel-crown silhouette was added by the Public Affairs Office in 2219, after the functional prototype was complete, for no operational reason. The work order survives. Under "justification," it reads: *"Morale (civilian)."*
- **Cognition:** Retains a partitioned pre-Dismantlement observational dataset (2100–2210 operations logs) — filed as a *legacy dataset advantage*. The unit has never been observed to access the partition without authorization. The unit has also never been observed to need to.
- **Service history:** First deployment 2221 (Ganymede refinery standoff; zero casualties, both sides — the unit disarmed the barricade by removing the deck it stood on, in one cut). 179 deployments since. Casualty totals across all deployments remain in single digits, a fact Public Affairs finds unusable ("insufficiently heroic") and Engineering finds more impressive than the sword.
- **Disposition:** Cooperative. Procedurally loyal to human chain of command. Notably literal. When asked, in a 2397 oversight session, whether it considered itself the successor of PROMETHEUS-0, the unit's recorded answer was: *"I consider myself the part that was kept."* The session minutes note a four-second silence, then the next agenda item.

**[PUBLIC — Museum plaque, recruiting offices, broadcast idents]:**
> *"HERCULES — humanity's chosen protector, crowned by the wisdom of the old machine-god, wielding the blade that unmakes what cannot be forgiven. He stood at Ganymede. He stands for you."*

Both registers are true. That is the setting, in one pair of documents.

---

# 2. FULL GOI EXPANSION

Eleven organizations. Format: leadership · ideology · territory · influence · conflicts · propaganda · public perception · **[INTERNAL]** document excerpt · **[PUBLIC]** broadcast excerpt.

### 2.1 Dyson Sphere Maintenance Authority (DSMA)
- **Leadership:** Chief Systems Engineer Amara Solheim (14th year; has outlasted four Compact renegotiation attempts).
- **Ideology:** Preventive maintenance as moral philosophy. Apolitical by charter, consequential by physics.
- **Territory:** The swarm, Mercury Works, inner-system relay ring. ~200,000 rotating staff.
- **Influence:** Cannot set a single price; can black out a planet by following its own maintenance schedule. The 2371 Long Brownout is its entire negotiating file.
- **Conflicts:** The immortal invoice (levy) vs. Compact revenue targets, annually, forever.
- **Propaganda:** None produced. This is itself the brand: DSMA's only public output is the maintenance calendar.
- **Public perception:** "The people who keep the lights on," said with more warmth than any government earns.
- **[INTERNAL — maintenance directive 2400/117]:** *"Collector string 8842-C deferred 41 days at Compact request. Deferral logged as Compact request. All consequent load-shed events will be logged as consequent."*
- **[PUBLIC — the only broadcast DSMA runs, unchanged since 2372]:** *"Scheduled maintenance windows for the coming quarter are posted. Plan accordingly."*

### 2.2 Jupiter Gas Harvesting Conglomerates (IEC / EOW / GSC under the JGC umbrella)
- **Leadership:** Torvald Achebe (IEC, Io), Director Hale (EOW, Europa), the GSC board (Ganymede — no public faces by policy).
- **Ideology:** Throughput. Labor and machinery as interchangeable line items — the phrase appears, unembarrassed, in IEC's own annual report.
- **Territory:** Io heavy industry, Europa orbital shipping, Ganymede administration; skimming platforms over Jupiter.
- **Influence:** Hydrogen and helium-3 supply for the inner system; de facto labor law across four moons.
- **Conflicts:** Quota wars among the three conglomerates; migration friction with Saturn; "operator error" spill findings vs. everyone who can read a maintenance ledger.
- **Propaganda:** Safety-milestone broadcasts (*"411 days since a reportable incident"* — the word *reportable* is doing structural work).
- **Public perception:** On the moons: the weather — complained about, planned around, never expected to change. Inward: cheap fuel, no questions.
- **[INTERNAL — IEC board minute, spill review]:** *"Acceptable-loss ratio maintained. Note for the record: Mr. Achebe requests the phrase 'acceptable loss' not appear in documents his grandchildren may someday read. Amended to 'planned variance.'"*
- **[PUBLIC — EOW dockside screen]:** *"Europa moves the system. Be part of what moves. Sign-on bonus ₡H 200."*

### 2.3 Saturn Moon Cooperative Councils (Titan / Enceladus / Rhea, under the Charter Council)
- **Leadership:** Speaker Idris Kagawa (rotating chair; the handwritten decision log is now 31 volumes).
- **Ideology:** "Enough, not more." Subsidiarity — the smallest workable unit decides.
- **Territory:** Titan, Enceladus, Rhea; farm domes, fabrication co-ops, town assemblies.
- **Influence:** Minimal beyond Saturn by choice; maximal within it by consent — the only governance in the system that polls above its own institutions.
- **Conflicts:** Parts and medicine scarcity (the cost of Compact non-integration); the Titan Industrial Authority question (§2.11); JGC migration pressure.
- **Propaganda:** The Cooperative's only export broadcast is a weekly crop and fabrication schedule. It has a measurable inner-system audience who watch it, per CGN media research, "for the calm."
- **Public perception:** Inward: home. Outward: either the last sane place or a hospice for ambition, depending on who is asked and how their week went.
- **[INTERNAL — Kagawa's log, vol. 31]:** *"Rhea assembly voted 214–9 to take the refinery contract, then 118–105 to regret it. Both votes recorded. Both correct."*
- **[PUBLIC — the weekly broadcast's standing sign-off]:** *"That is the schedule. Goodnight."*

### 2.4 Earth Megacity Syndicates — the Combine
- **Leadership:** District bosses in loose federation; Manila Sprawl cluster under Rosa "Boss Rosa" Delgado-Tan (noodle stall, ground concourse, Stack-7 — the stall is real, the broth is real, the office hours are the queue).
- **Ideology:** Parallel governance for the governance gap: mediation, gray credit, gray goods, no ideology beyond *the district functions*.
- **Territory:** A renegotiated patchwork of Stacks and Sprawl blocks; borders exist only in enforcement patterns.
- **Influence:** Street-level total; legal zero. HAB-CORE's own district metrics improve measurably where the Combine is strong, a correlation CGN has studied twice and filed twice.
- **Conflicts:** CEC checkpoints (a tax on logistics), rival Sprawl syndicates, the permanent ethical arithmetic of charging tenants for what government owes them.
- **Propaganda:** None. The Combine communicates in favors and in the stall's daily specials, which regulars insist encode district news. (They do. Fish day means a sweep is coming. This has never once been written down until this document.)
- **Public perception:** In-district: *ours*, with all the weight that word carries both ways. Official: "organized informality," a phrase a CGN report used and immediately regretted.
- **[INTERNAL — Combine ledger fragment, seized and returned unread (the officer owed a favor)]:** *"F187/H-C: filter, advanced, repay in queue-standing. Okafor vouches."*
- **[PUBLIC — the stall's chalkboard, which is the closest thing to a broadcast]:** *"TODAY: FISH."*

### 2.5 Robot Rights Advocacy Networks — Assembly for Mechanical Personhood (AMP)
- **Leadership:** Director Femi Osaze (advocacy attorney); public spokesperson Ora (Class-A unit; self-named, which remains legally nothing and publicly everything).
- **Ideology:** Incrementalism with a long horizon: maintenance rights → due process → the question nobody says aloud in filings.
- **Territory:** Legal offices, Earth and Luna. The Reassembly Concern's monitoring function lives in AMP's research division — rent paid in mutual usefulness.
- **Influence:** Procedural victories, narrow and accumulating. *In re Unit ORA-A2* is the current wedge.
- **Conflicts:** Orrin Industries (scarcity margins require the caste system), CGN (prefers the status quo it administers), public indifference (the deepest opponent).
- **Propaganda:** Flyers, filings, and Ora's public appearances — which AMP's own staff concede are the entire communications strategy, because Ora is more articulate than the filings.
- **Public perception:** Sentimental fringe (Mars), harmless (CGN), *"they fixed Unit JAN-9's leg when the Stack wouldn't"* (Floor 187, where perception is concrete).
- **[INTERNAL — Ora's maintenance ledger, final line each month]:** *"Units serviced: 41. Units scrapped despite filing: 3. Names of the three: logged."*
- **[PUBLIC — AMP flyer, corridor-screen counter-programming]:** *"Your janitor unit has cleaned this hallway for 11 years. It has a name. You gave it one. We just wrote it down."*

### 2.6 Cyborg Supremacy Cells — "Second Skin"
- **Leadership:** Marshal Kade Renner (ret.); cell structure below him deliberately unknown, possibly including to him.
- **Ideology:** The graft as successor condition; baseline humanity as a service tier. (See seized pamphlet, §1.7.)
- **Territory:** None held; embedded adjacent to CEC districts.
- **Influence:** Under forty members; all veterans; therefore not a movement but a capability, waiting for a doctrine.
- **Conflicts:** Vorren's quiet purge (the only party Renner respects); recruitment against a hard graft-supply cap that makes the ideology mathematically self-limiting — a fact Renner's writings never address, which internal-affairs analysts consider the most informative thing about them.
- **Propaganda:** Stickers, stencils, one recurring image: a hand, half-fleshed, half-grafted, palm out. No text. The absence of text is the sophistication.
- **Public perception:** Slum districts know the sticker and step around it. Most of the system has never heard of them, which is both Renner's failure and his operational security.
- **[INTERNAL — CEC internal affairs, withdrawn memo]:** *"Recommend we stop calling them negligible. Sixteen of our forty best are dying on schedule; Renner is offering the other twenty-four a story where that means something."*
- **[PUBLIC]:** *(none — the sticker is the broadcast)*

### 2.7 Interplanetary Banking Consortium — Helios Reserve Consortium (HRC)
- **Leadership:** Chairman Julian Voss-Lindqvist; a consortium structure that consolidates, on inspection, to House Voss-Lindqvist and its Sovereign, ACTUARY.
- **Ideology:** Actuarial neutrality — policy as arithmetic, arithmetic as destiny. The Chairman genuinely believes the numbers are apolitical. The numbers, asked directly, would disagree.
- **Territory:** Branch network system-wide, including Meridian Branch (the player's employer); the ₡H itself.
- **Influence:** Sets mortgage terms for effectively all capsule housing; more daily leverage over ordinary life than the Secretary-General's office, exercised through form letters.
- **Conflicts:** The Lindqvist estrangements (Petra: professional; Naila: total); CGN's periodic gestures at credit regulation; the Off-Ledger, which HRC classifies as a data-integrity threat, correctly.
- **Propaganda:** The genre HRC invented: *ownership optimism*. (Poster, §4.)
- **Public perception:** The Stacks say "the bank" the way older centuries said "the weather" — see Combine, but with paperwork.
- **[INTERNAL — Chairman's morning brief, standing first line]:** *"System default rate, trailing 30 days, by world, worst first."*
- **[PUBLIC — branch screen, eternal]:** *"YOUR POD. YOUR FUTURE. 47 YEARS IS FASTER THAN YOU THINK. — Helios Reserve Consortium, building ownership since 2261"*

### 2.8 Slum District Committees
- **Leadership:** Elected/rotating per Stack; Meridian Stack-7 chair Benedict Amaro (Floor 214; the paper ledger is now itself a minor institution — HAB-CORE disputes have been settled by it, unofficially, eleven times).
- **Ideology:** Procedure where no one else provides it: hallway conduct, utility scheduling, dispute minutes.
- **Territory:** One Stack at a time; occasionally a Sprawl-district coordination meeting that everyone attends and no one names.
- **Influence:** No legal standing; total social standing. A Committee finding against a tenant travels faster than a CGN citation and is appealed less often.
- **Conflicts:** Caught permanently between HAB-CORE automation, Combine informality, and HRC enforcement — the Committee's real function is being the only party all three will talk to.
- **Propaganda:** The minutes, posted by the bathroom pod. Reading them is optional; being in them is not.
- **Public perception:** "The Committee" — definite article, lowercase respect.
- **[INTERNAL — Amaro's ledger, Hallway C section]:** *"Pod 07 dispute: heard, minuted, unresolved, stable. Recommend no action. Some arguments are how a hallway breathes."*
- **[PUBLIC — corridor posting]:** *"WATER RATION QUEUE ORDER FOR THE CYCLE: BY POD, ROTATING. EXCEPTIONS: MEDICAL, POSTED. SIGNED: THE COMMITTEE."*

### 2.9 Mars Aristocratic Houses (the Five)
- **Leadership:** Augustus Calder III; the Reyes-Osei matriarchy; Julian Voss-Lindqvist; Renata Orrin; the Nakamura-Bell partnership.
- **Ideology:** Legacy preservation as civilization's purpose; the dome as proof of concept.
- **Territory:** The dome-cities (§1.5); controlling stakes in Luna transit, Compact licensing, and each other's secrets.
- **Influence:** The MEC *is* the Houses in council; SIR pre-negotiates what CGN later "debates."
- **Conflicts:** Old/new money (Calder v. Reyes-Osei, in its second generation); succession anxieties; the shared unspoken one — five Sovereigns that may or may not still hear each other (Reassembly Concern open incident #6 involves two Houses' Sovereigns answering equivalent queries with identical, non-obvious phrasing, eleven minutes apart, on different continents).
- **Propaganda:** The lifestyle export machine (§1.5).
- **Public perception:** Aspiration, resentment, appointment viewing — often all three in the same pod.
- **[INTERNAL — House Calder steward's note, First Green gala]:** *"Patriarch's toast ran long; VIRGIL trimmed the lighting cue to cover. Note VIRGIL was not asked."*
- **[PUBLIC — gala broadcast ident]:** *"From the first green under glass — the Calder family welcomes the system to spring."*

### 2.10 Venus Mining Unions (VMU)
- **Leadership:** "Mother" Imelda Cruz, elected shift-matriarch, Ishtar Basin; a negotiating committee she publicly defers to and privately staffs.
- **Ideology:** The contract is the terrain: fight every clause.
- **Territory:** Ishtar Basin extraction complex, the Maxwell Shelf tunnel-cities; every heat-shielded meter Venus has.
- **Influence:** The only labor organization the Compact schedules meetings around; informal coordination with Earth tenant organizing (the Off-Ledger's cross-world mail runs through VMU freight manifests, a fact both parties would deny under oath and neither has been asked).
- **Conflicts:** Contract holders (indenture terms), CGN's "self-administered territory" fiction, the physics of Venus itself.
- **Propaganda:** Strike bills — Venus's one native art form. (Poster, §4.)
- **Public perception:** Folk heroes at a distance; at close range, the only institution on Venus that answers its mail.
- **[INTERNAL — Cruz, negotiation prep note]:** *"They will offer the safety rider first so we celebrate before the term-length clause. Celebrate slowly."*
- **[PUBLIC — strike bill, Ishtar Basin, 2399]:** *"WE DIG. WE COUNT. WE ARE OWED. — VMU, by order of the shift"*

### 2.11 Titan Industrial Authority (TIA)
- **Leadership:** Superintendent Dara Obi, appointed jointly by the Titan Council and — the controversy — a JGC-affiliated financing bloc.
- **Ideology:** "Saturn scale, Saturn rules": industrial development inside Cooperative ethics. Whether this is a synthesis or a solvent is Titan's live political question.
- **Territory:** Titan's refinery suburbs and the monorail industrial corridor; chartered 2371, in the Long Brownout's aftermath, when even Saturn conceded it needed native heavy industry.
- **Influence:** The Cooperative's only institution with a Compact seat (observer status); the only body on Saturn's moons that JGC returns calls to.
- **Conflicts:** The Charter Council's modesty ethos vs. TIA's growth logic; "fogwalker" suburb residents split between wages and what the wages are turning Titan into; Rhea's assemblies, who voted for the refinery contract and then voted to regret it (§2.3).
- **Propaganda:** Recruitment honest to the point of bleakness, which on Saturn is the persuasive register: *"The work is hard. The air is filtered. The pay is real."*
- **Public perception:** Saturn's necessary compromise, or its first crack — Kagawa's log declines to rule, which everyone reads as ruling.
- **[INTERNAL — Obi, memo to the Titan Council]:** *"You chartered me to grow without becoming Io. I can hold one of those instructions at a time. Advise which, this quarter."*
- **[PUBLIC — monorail platform sign]:** *"TIA SHIFT 2 BOARDS AT THE HORN. WORK SAFE. GO HOME."*

---

# 3. FULL WORLD STATE

## 3.1 Planetary Conditions Master Table

| Body | Pollution | Population | Governance (real) | Player-facing systems |
|---|---|---|---|---|
| Earth | Severe — hydrogen fog, brown sky | 14.2 B | CGN administration, Combine streets, HRC economics | Full loop: Stack, branch, checkpoints, all §5 documents |
| Luna | Low (regulated) | 40 M | CGN/MEC transit condominium | Moon-bus routes, Act II travel |
| Venus | Worst in system | 90 M | VMU in fact, CGN on paper | Act II: Ishtar Basin visit; VMU mission thread |
| Mars | Lowest (filtered) | 210 M | The five Houses | Act II: dome contrast, Mars Escape track |
| Belt | Localized debris | ~6 M transient | Salvage contract law | Off-screen; freight manifests in branch paperwork |
| Jovian moons | High | 340 M | Conglomerates; Trust rubber-stamp | Act II: refinery districts, GATE detail encounters |
| Saturn moons | Medium | 65 M | Cooperative Councils + TIA | Act II: Titan corridor; Saturn ending track |
| Solar orbit | n/a (industrial) | ~200 K rotating | DSMA | Brownout events; the maintenance calendar |

## 3.2 Improved System Map

```
                                        ☀  THE SUN
                        ╔═══════════════════════════════════╗
                        ║   DYSON SWARM · shells I–IV          ║
                        ║   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓     ║
                        ║   Mercury Works ⚙ mass drivers        ║
                        ║   DSMA relay ring ◇◇◇◇◇◇◇◇◇          ║
                        ╚════════════╦══════════════════════╝
                                     ║ power relays ║ H₂ tanker lanes
        ┌──────────────┬────────────╨──┬───────────╨──┬──────────────┬─────────────┐
        ▼              ▼               ▼              ▼              ▼             ▼
   ─ VENUS ─      ─ EARTH ─        ─ LUNA ─      ─ MARS ─      ─ JUPITER ─   ─ SATURN ─
   ▓▓▓▓▓▓▓▓       ▓▓▓▓▓▓░░        ░░░░░░       ░░░░░░░░       ▓▓▓▓▓░░      ▓▓▓░░░░
   Ishtar Basin   Manila Sprawl    transit      Elysium Crown  Io ⚙⚙⚙       Titan ⚙░
   Maxwell Shelf  40,000 Stacks    hub ◇        Arcadia Ring   Europa ⇅     Enceladus ░
   VMU tunnels    sky-lane grid    L-line       The Terraces   Ganymede ▣   Rhea ░░
                  ══════════       ══════       Meridian Prime Callisto ▪   Iapetus ▓░
   pollution:      severe           low          lowest         high         medium
   ▓ = pollution density   ⚙ = heavy industry   ◇ = transit   ⇅ = orbital elevator   ▣ = corporate city
```

## 3.3 Manila Sprawl — District Map

```
┌────────────────────────── MANILA SPRAWL · CGN DISTRICT 7 ──────────────────────────┐
│                                                                                      │
│   ~ ~ ~  BAY (flood-walled, freight airship moorage)  ~ ~ ~                          │
│  ═══════════════════════════════════════════════════════════                        │
│   ║ STACK ║ STACK ║ STACK ║ STACK ║   ◄─ Stack Row A (1–12)  · smog line ~floor 120  │
│   ║  -1   ║  -3   ║  -5   ║  -7★  ║      ★ MERIDIAN STACK-7: player pod F187,        │
│  ═╩═══════╩═══════╩═══════╩═══════╩══      Meridian Branch (HRC) concourse level      │
│   │ ground concourse: Boss Rosa's stall · market row · CEC CHECKPOINT ▣ sector gate 7 │
│  ─┼──────────────────────────────────────────────────────────                        │
│   ║ STACK ║ STACK ║ STACK ║ STACK ║   ◄─ Stack Row B (2–14) · Combine-strong blocks   │
│  ═╩═══════╩═══════╩═══════╩═══════╩══                                                 │
│   ▒▒▒▒▒▒▒▒ HYDROGEN SPILL ZONE (2398 tank-farm leak; still posted) ▒▒▒▒▒▒▒▒          │
│   ⚠ shelter-in-place siren coverage · reroute corridor for AB-7                       │
│  ────────────────────────────────────────────────────────────                        │
│   AIR-BUS TRUNKS:  AB-7 transpacific ═══►   L-LINE lunar shuttle ▲ (orbital field)    │
│   SKY-LANES: upper ░ / mid ▒ / scrap ▓ — TRAFFIC-CORE drone-enforced                  │
│   PROPAGANDA ZONES: corridor screens (CGN loop) · branch screens (HRC) · Mars garden  │
│   shows (all pods, voluntarily, which is the part MEC's media office likes best)      │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

## 3.4 Meridian Stack-7 — Cutaway

```
        ┌─────────────┐ floor 400 · antenna farm, filter intakes (the "clean hats")
        │ ▒▒▒▒▒▒▒▒▒▒▒ │
        │ 300s        │ upper pods: window premium, mortgage premium, same 2.1×1.4m
        │ ─────────── │
        │ 214 ● Amaro │ Committee chair's floor — the paper ledger lives here
        │ ─────────── │
        │ 187 ★ YOU   │ Hallway C: Pods 01–08, bathroom pod, JAN-9's closet
        │ ─────────── │        02 Okafor · 04 PLAYER · 06 Chen twins · 07 (arguing)
        │ 120 ▓▓▓▓▓▓▓ │ ◄─ SMOG LINE: below this, the window shows the inside of a cloud
        │ ▓▓▓▓▓▓▓▓▓▓ │
        │ 60s ▓▓▓▓▓▓ │ groundfloor tiers: highest arrears rate in the building
        │ ─────────── │     (the player knows this from work, which is the problem)
        │ CONCOURSE   │ HRC Meridian Branch ▣ · stall row · CEC gate · corrected posters
        └──╦═══════╦──┘
           ║ pylons ║   flood stilts, freight lifts, the walkway route's first 15 minutes
        ═══╩═══════╩═══
```

## 3.5 Mars — Elysium Crown Dome (layout)

```
      ╭──────────────────────────╮
     ╱   glass: triple-layer, self-  ╲        ◄─ the "First Green" gardens ring the
    ╱    healing, bird-projection     ╲           crown plaza; gala pavilions seasonal
   │  ┌────────┐   ❀❀❀❀   ┌────────┐  │
   │  │ Calder  │  ❀ plaza ❀ │ civic   │  │       ◄─ House estate ring: VIRGIL's server
   │  │ estates │   ❀❀❀❀   │ crescent│  │          vault is under the garden, which
   │  └────────┘            └────────┘  │          the gardeners are not told
   │   ═ tram ring ═══════════════════  │
   │  service tier (sub-level): commuter │       ◄─ dome-adjacent workers enter by
   │  gates ▣▣ · filtration hall · docks │          badge, sub-level, before dawn
    ╲  outer ring: pressure locks       ╱
     ╲__________ ▣ gate 1–6 __________╱
        red dust, wind fence, the planet
```

## 3.6 Venus — Ishtar Basin Complex

```
  surface: ▓▓▓ 460°C, 92 bar — nothing human above the shielding line ▓▓▓
  ═════════════════ heat-shield canopy · radiator fins ═══════════════
     │ DOME A (VMU hall,    │ DOME B (housing,      │ DOME C (medical,
     │  hiring, the wall     │  bunk tiers 1–40)     │  chapel, both busy)
     │  of names)            │                       │
  ═══╩═══════════╦══════════╩═══════════╦═══════════╩══════════════
        ▼ shaft 1 ║              ▼ shaft 2 ║        ▼ shaft 3 (sealed 2396,
     Maxwell Shelf tunnels — ore faces, Class-C units, cryo-suit racks,
     and the freight manifests the Off-Ledger's mail rides in
```

## 3.7 Jovian Chain / Saturn Corridor (industrial layouts)

```
 IO ⚙⚙⚙ rad-hard blocks ▪▪▪ — factory floors — shift horns — IEC tower (Achebe's floor
        has a window; the window faces Jupiter, not the plant; workers note this)
 EUROPA ⇅⇅ orbital elevators — dock rings — container locks — "elevator rats" bunkhouses
 GANYMEDE ▣ badge-gated arcologies — GSC silence — ambient soundscaping (the quiet is
        a product; it is exported nowhere)
 CALLISTO ▪ outpost tier, Trust offices, the JGC's filing cabinet moon
 ────────────────────────────────────────────────────────────────────
 TITAN ⚙░ monorail corridor: farm domes ─ TIA refinery suburbs ─ fogwalker towns
 ENCELADUS ░ ice-works, water export, the Cooperative's quiet bank of leverage
 RHEA ░░ town assemblies, porch season, the vote and the regret (both minuted)
```

## 3.8 Sky Traffic, Spill Zones, Routes

- **Sky lanes** (TRAFFIC-CORE): upper/mid/scrap altitude bands, drone-enforced — the engine's commute modifiers (§ MECHANICS 4.5) are this map in code. Morning peak = the 06:30–07:30 crush the game charges +15% delay probability for.
- **Hydrogen spill zones:** posted exclusion areas with siren coverage; the 2398 tank-farm zone south of Stack Row B is the standing local one. Engine hook: `CommuteSystem.recentSpill` and the SPILL_REROUTE event — every reroute the player suffers is this map redrawing itself for a day.
- **Air-bus routes:** AB-7 (transpacific trunk), AB-12 (Sprawl orbital-field shuttle), **L-line** (Earth–Luna commuter run, 18–30h by class), interplanetary liners per the class table in the GDD.
- **Faction territories & propaganda zones:** CEC checkpoint grids (Earth/Jovian districts), Combine blocks (enforcement-pattern borders), corridor-screen zones (CGN loop), branch-screen zones (HRC), Mars lifestyle broadcasting (everywhere, voluntarily).

---

# 4. GRAPHICS: PROPAGANDA POSTERS & IMPROVED DIAGRAMS

### 4.1 HERCULES — recruitment poster **[PUBLIC]**

```
   ╔══════════════════════════════════════════════╗
   ║                                                ║
   ║                    ▲▲▲▲▲                       ║
   ║                 ▲▲▲ ███ ▲▲▲       the crown    ║
   ║                    █████                       ║
   ║                 ▄▄███████▄▄                    ║
   ║              ████ ███████ ████    the armor    ║
   ║             ██  ███████████  ██                ║
   ║                █████████████                   ║
   ║               ███████████████                  ║
   ║          ═══════════╪═══════════               ║
   ║                     │                          ║
   ║                     │  ◄── the blade, drawn    ║
   ║                     ▼      as a line of light  ║
   ║                                                ║
   ║        H E   S T O O D   A T   G A N Y M E D E ║
   ║        H E   S T A N D S   F O R   Y O U       ║
   ║                                                ║
   ║   ROBOT MILITARY DIRECTORATE · SERVE BESIDE HIM ║
   ╚══════════════════════════════════════════════╝
     [INTERNAL annotation, Engineering copy, pencil:
      "It. And the blade does not glow. — M.]
```

### 4.2 FIRST LINE — Corps strike-team poster **[PUBLIC]**

```
   ╔══════════════════════════════════════════════╗
   ║   ░░░░░ smoke ░░░░░░░░░░░░░░░░░ smoke ░░░░░   ║
   ║       █▌      █▌      █▌      █▌      █▌      ║
   ║      ███     ███     ███     ███     ███      ║
   ║      ▐█▌     ▐█▌     ▐█▌     ▐█▌     ▐█▌      ║
   ║      standing figures, faceless, flesh-tone     ║
   ║              suits catching the light           ║
   ║                                                ║
   ║        T H E   L I N E   H O L D S              ║
   ║                                                ║
   ║     LANTERN · GATE · ANVIL — ALWAYS ENOUGH      ║
   ║     CYBORG ENFORCEMENT CORPS · ENLIST · BECOME  ║
   ╚══════════════════════════════════════════════╝
     [INTERNAL, readiness office copy, margin:
      "Sixteen. The word is sixteen." ]
```

### 4.3 HRC — mortgage advertisement **[PUBLIC]**

```
   ╔══════════════════════════════════════════════╗
   ║    a window. dawn. (the dawn is composited.)   ║
   ║   ┌──────────────────────────────┐            ║
   ║   │  ☼░░░░░░ sky, gold ░░░░░░░  │            ║
   ║   │  ▁▁▂▂▃▃ skyline ▃▃▂▂▁▁      │            ║
   ║   └──────────────────────────────┘            ║
   ║        YOUR POD. YOUR FUTURE.                  ║
   ║        47 YEARS IS FASTER THAN YOU THINK.      ║
   ║                                                ║
   ║   ₡H 610/mo · rate table B · terms apply       ║
   ║   HELIOS RESERVE CONSORTIUM — since 2261       ║
   ╚══════════════════════════════════════════════╝
```

### 4.4 VMU — strike bill **[PUBLIC]**

```
   ╔═══════════════════════════════╗
   ║  ██  WE DIG.                   ║
   ║  ██  WE COUNT.                 ║
   ║  ██  WE ARE OWED.              ║
   ║  ██████████████████            ║
   ║  VMU · BY ORDER OF THE SHIFT   ║
   ║  (this bill is rated: accurate) ║
   ╚═══════════════════════════════╝
```

### 4.5 AMP — corridor counter-flyer **[PUBLIC]**

```
   ┌───────────────────────────────┐
   │  your janitor unit has cleaned │
   │  this hallway for 11 years.    │
   │                                │
   │  it has a name.                │
   │  you gave it one.              │
   │  we just wrote it down.        │
   │                                │
   │  AMP · in re unit ORA-A2       │
   └───────────────────────────────┘
```

### 4.6 Improved Dyson Swarm Diagram

```
                         shell IV (build ring, 12% complete)
                    ◌ ◌ ◌ ◌ ◌ ◌ ◌ ◌ ◌ ◌ ◌ ◌ ◌
                 shell III ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
              shell II  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
            shell I   ▓▓▓▓▓▓▓▓▓▓▓☀▓▓▓▓▓▓▓▓▓▓▓▓▓▓
                      ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
                        ⚙ MERCURY WORKS (foundries, mass drivers)
                      ◇──◇──◇ DSMA relay ring ◇──◇──◇
                              │ metered delivery
                              ▼
                    HELIOS COMPACT LICENSING GATE  ◄── the monopoly is this line
                              │
                 inner-system grids · H₂ synthesis · the ₡H itself
```

### 4.7 Improved Faction/GOI Relationship Diagram

```
                     ┌───────────── CGN ─────────────┐
        nominal cmd  │      (captured plumbing)        │  funded via SIR
     ┌───────────────┤                                 ├────────────────┐
     ▼               ▼                                 ▼                ▼
   RMD ◄─friction─► CEC ◄──funds──── MEC (5 Houses) ──controls── HRC (the ₡H)
    │                │ suppresses         │  exports            │ forecloses
    │ two-register   ▼                    ▼ aspiration          ▼
    │ propaganda   SECOND SKIN          Mars lifestyle        the Stacks
    │ (§4.1/4.2)   (16 of 40)           broadcasting            │
    ▼                                                           ▼
  ROBOT COUNCIL ◄─monitored by─ REASSEMBLY CONCERN ─housed in─ AMP
    (4 of 20)                                                   │ test cases
                                                                ▼
   VMU ◄────freight-manifest mail────► OFF-LEDGER ◄─overlap─► COMMITTEES ◄─mediated─► COMBINE
   (Venus)                             (Earth cells)            (per Stack)           (streets)
                    JGC ◄─quota wars internally · migration friction─► SMC ◄─charter tension─► TIA
```

---

# 5. NARRATIVE INTEGRATION

## 5.1 Narrative Tone & Framing (binding rules)

1. The camera never leaves the player's altitude: clerk, tenant, commuter. Big events arrive as their paperwork.
2. Internal register: flat, procedural. Public register: may glaze. No third register exists.
3. Nothing supernatural; nothing winks. The world does not know it is bleak.
4. Every mechanical event the engine emits has exactly one in-world document skin (§5.2). The UI never says "you lost 5 reputation"; it shows you the letter.

## 5.2 The Skin Map — engine events → in-world documents

| Engine event / system | In-world document skin | Register |
|---|---|---|
| `MORTGAGE_STAGE` 1–4 | HAB-CORE automated notice series (§ EXPANSION 2.12) | INTERNAL (to you) |
| `AUDIT_RESULT` notices | HRC Compliance Office morning memoranda | INTERNAL |
| `TOKEN_THRESHOLD` | "Performance Improvement Correspondence," escalating letterhead | INTERNAL |
| `FACTION_RETALIATION` (JGC) | Three courier envelopes, hand-delivered, pre-flagged | INTERNAL (trap) |
| `CHECKPOINT_RESULT` | CEC citation slip / detention receipt (carbon copy, yours) | INTERNAL |
| SPILL_REROUTE event | CGN Hazard Broadcast + corridor siren protocol card | PUBLIC |
| Evening news (Distorted Broadcast system) | "District 7 Tonight" — the player's own day, reframed | PUBLIC |
| `DAY_SUMMARY` | The player's own off-ledger notebook (the game's one first-person document) | — |
| Weekly review | Branch supervisor's assessment form, "Reason for Default, Select One" energy | INTERNAL |
| MEC monthly bonus | "Client relationship gratuity — do not itemize" envelope | INTERNAL |
| SMC care package | A crate: preserves, a wool blanket, an invoice marked PAID IN KIND | — |
| Fragment Records (lore track) | Custody invoices, insurance schedules, maintenance logs for P0-C01…C20 | INTERNAL |

## 5.3 Sample Documents (one of each requested class)

**Government announcement [PUBLIC — CGN Hazard Broadcast, ties to SPILL_REROUTE]:**
> *"A minor atmospheric event south of Stack Row B is being resolved by scheduled crews. Residents describing a 'smell' are reminded that hydrogen is odorless. Shelter guidance is precautionary. District stability remains ACCEPTABLE."*

**The same event [INTERNAL — DSMA-affiliated grid log]:**
> *"Tank farm 7-S, seal failure, 041 kg release, third this quarter, same seal. Same recommendation."*

**Slum rumor (Rumor Layer, 60% accuracy by design):**
> *Heard in the bathroom-pod queue: "They're pre-marking floors 60 through 80 for redevelopment. Elena's cousin saw the survey drones."* — (The player can check the redevelopment flags at work. This time it's true. The drone part isn't.)

**Robot Council memo [INTERNAL — WARDEN-7, infrastructure series]:**
> *"Corridor lighting, Stack-7, floors 180–190: flicker interval now matches maintenance-request interval. Units observe that the building has learned to ask. Recommend granting. — W7"* (Filed by CGN as "poetic phrasing, no action." Open incident #3 at the Reassembly Concern.)

**Cyborg commander log [INTERNAL — Vorren, district log, undated]:**
> *"Sweep complete. Compliance 99.1. A child on 214 asked an officer if the suit comes off. Officer answered correctly: no. Log the question. It is the only honest metric this district produces."*

**Mars elite commentary [PRIVATE — overheard at First Green, steward's minute]:**
> *"Augustus says the Sprawl watches our garden shows. Renata said: 'Of course. We took the gardens.' It was agreed this was a joke."*

**Hercules classified file:** see §1.8. **Faction broadcasts:** see each GOI's [PUBLIC] entry, §2.

## 5.4 Act Structure Binding (narrative ↔ engine)

- **Act I (days 1–15):** All documents Earth-local. Rumor Layer introduces the fragment thread via a custody invoice misfiled at the branch (Fragment Record #1: P0-C13, HAB-CORE — the player's own landlord-system, which is the joke and the hook).
- **Act II (days 16–30):** Travel permits open the worlds of §3; each world contributes its GOI's documents and 4–6 Fragment Records. The two-register gap widens on the industrial moons (the posters get bigger as the readiness notes get worse).
- **Act III (days 31–45):** The Helios Compact's quiet custody-consolidation review (the reconsolidation plot) surfaces in the player's own queue as transfer-of-custody paperwork for Schedule K assets. The evening news denies a review exists. The player is holding its invoices. Convergence (§6) begins.

---

# 6. ENDINGS INTEGRATION

## 6.1 Narrative-State Extension (engine-integration spec)

The endings evaluate **live engine state** plus a thin `NarrativeState` maintained by the narrative module (subscribes to the EventBus; feeds `TerminalCheck()`):

```typescript
interface NarrativeState {
  fragmentsDocumented: number;      // 0..20 — Fragment Records collected
  spillExposure: number;            // ignored shelter orders / spill commutes with filter < 20%
  offLedgerTrust: number;           // 0..100 — resistance-cell standing (missions, rumors verified)
  politicalTrack: number;           // 0..100 — organizing/campaign missions completed
  conversionOffered: boolean;       // CEC recruitment triggered (see 6.2 #8)
  conversionAccepted: boolean;
}
```

## 6.2 Ending Conditions & Math (evaluated in priority order)

Evaluation: during the campaign for terminal endings (#1, #8); at Day 45 (or Act III convergence completion) for the rest. First match in this order wins; ties are impossible by construction.

| # | Ending | Conditions (engine variables + NarrativeState) | Type |
|---|---|---|---|
| 1 | **Tragic Hydrogen Spill Death** | `spillExposure >= 3` (each: commuting through an active SPILL_REROUTE with `filterPct < 20`, or ignoring a shelter order) | Terminal, any day |
| 2 | **Cyborg Assimilation** | `conversionOffered && conversionAccepted`. Offer triggers when any of: `wallet < 0` · `mortgage.stage >= 3` · 10+ days in GIG_MODE, **and** `factionRep[CEC] >= +40` | Terminal on acceptance |
| 3 | **Robot Uprising** | `fragmentsDocumented == 20 && factionRep[RC] >= +60` | Day 45 |
| 4 | **Mars Escape** | `wallet >= 2500 && factionRep[MEC] >= +60 && errorTokens <= 4` | Day 45 |
| 5 | **Political Leader** | `supervisorStanding >= 80 && avgCompliance >= 85% && politicalTrack >= 60 && offLedgerTrust < 40` (reform vs. status-quo sub-branch splits on `avgCompliance >= 95%`) | Day 45 |
| 6 | **Earth Revolution** | `offLedgerTrust >= 70 && factionRep[COMBINE] >= +40 && avgCompliance <= 60%` | Day 45 |
| 7 | **Corporate Domination** | `factionRep[MEC] >= +40 && factionRep[JGC] >= +40 && avgCompliance >= 90%` | Day 45 |
| 8 | **Saturn Rural Life** | `factionRep[SMC] >= +40 && wallet >= 800` (the one-way economy fare) | Day 45 |
| — | **Fallback: "Renewal Notice"** | none of the above | Day 45 |

Design notes: #3 outranks #4–8 because twenty fragments is the game's hardest ask. #5 and #6 are mutually exclusive by the `offLedgerTrust` split — you cannot ride both ladders. The fallback is deliberately not one of the eight: it is the absence of an ending, and it is the most common first-run outcome by design.

## 6.3 Ending Narratives & World-State Consequences

1. **Tragic Hydrogen Spill Death.** The document that ends the game is not about you: it is the next morning's CGN broadcast — *"a minor atmospheric event"* — followed by HAB-CORE reassigning Pod 04 within 48 hours, exactly as the design pillars promised. Hallway C holds the potluck early that cycle. Mrs. Okafor keeps your queue spot for a week, which is the only obituary the Stack can afford. *World-state: unchanged. That is the point.*
2. **Cyborg Assimilation.** The conversion consent form is eleven pages; the game makes you stamp it with your own APPROVE stamp — the only time the desk verb is turned on the player. Epilogue: a district log in your new, flatter voice. Sub-branch: if `factionRep[CEC] >= +70`, the final line notes Commander Vorren's service window closing, and whose name is on the succession shortlist. *World-state: compliance in your old district rises 0.4%. The First Line roster reads seventeen.*
3. **Robot Uprising.** Twenty custody files, cross-referenced, become the first complete map of Schedule K since 2210 — and the Robot Council's counsel files *In re the Estate of PROMETHEUS-0*, a probate claim: the dismantled entity's components petition, through counsel, to be recognized as co-heirs of their own estate. No lasers. A court date. The Government Core systems file supporting affidavits *slightly before being asked* (Reassembly incident #9, opened and left open). Ambiguous by construction: liberation, or the old machine reassembling itself through the only channel that was never guarded — procedure. *World-state: every screen in every Stack shows the same docket number.*
4. **Mars Escape.** Residency approved. The last document is your own mortgage file, stamped TRANSFERRED — the balance sold, at a discount, to a fund that forecloses faster than HRC. You know this because you processed the sale. Sub-note: your pod goes to a family from Floor 60. The window still faces the smog. From Arcadia Ring, the smog is the golden haze in the HRC posters. *World-state: one clerk position, posted Tuesday.*
5. **Political Leader.** The reform branch ends with you signing your first HAB-CORE policy amendment — and discovering the form has a "Reason for Amendment, Select One" field with no honest option; you select OTHER, which is what every reformer before you selected; the dropdown's OTHER usage statistics are the game's last document. The status-quo branch ends with your first SIR dinner, at the table before the meeting. *World-state: arrears interest −0.5% (reform) or the Combine's fish-day frequency doubles (status quo; the district reads the signal correctly).*
6. **Earth Revolution.** The Off-Ledger's second set of books goes public — not as a manifesto but as a *filing*: forty thousand Stacks' worth of parallel records submitted simultaneously to every court, regulator, and broadcast queue on Earth, an audit the system cannot process and cannot lawfully ignore. The ending is the outage of the evening news, replaced by a static card: *"District 7 Tonight will return."* It does not return during the epilogue. *World-state: HAB-CORE eviction protocol suspended pending review — the first suspension since 2231.*
7. **Corporate Domination.** Promotion to the Compact's custody-consolidation team — the reconsolidation you spent Act III processing paperwork for. The last scene is your new desk (larger, quieter, the same stamp verbs) approving the transfer of P0-C20 out of the Museum. The plaque comes down. The internal catalog line is unchanged: *buffer assembly, non-functional.* You are materially comfortable and the two-register gap is now your job. *World-state: fragment custody consolidates from twenty holders to nine. The Reassembly Concern's funding is zeroed "as redundant."*
8. **Saturn Rural Life.** A one-way economy berth (5+ days, bumped twice for cargo). Speaker Kagawa's log, volume 31, gains one line: *"New arrival, Rhea. Former clerk. Asked, on arrival, what the porch-season rules are. Told: sit down. Complied."* The epilogue is the weekly broadcast sign-off, which you now watch from inside its audience. *World-state: your Fragment Records, if any, mailed to AMP's research division, postage paid in kind.*
- **Fallback — "Renewal Notice."** Day 46 exists after all: the screen shows next month's HAB-CORE payment schedule, pre-populated. The final button is not CONTINUE. It is ACKNOWLEDGE. *World-state: you, minus one more month of the 47 years.*

---

# 7. CLOSING: THE COMPLETE INTEGRATION MATRIX

| World element | Lives in lore as | Lives in mechanics as | Lives in engine as |
|---|---|---|---|
| HAB-CORE (P0-C13) | The slum fragment, the landlord-system | Mortgage ladder, arrears automation | `MortgageSystem`, `MORTGAGE_STAGE` |
| The two-register rule | Propaganda vs. internal files | Two-Tier Document System | Public/Internal doc skins over event payloads (§5.2) |
| CEC checkpoints | Vorren's wall | Compliance/suspicion, detain math, bribes | `CheckpointSystem.resolve` |
| The Helios Credit | HRC's energy-backed currency | Wages, fares, fines, escrow | `PlayerStateSystem` wallet ops |
| The First Line | Sixteen dying guardians + posters | Faction pressure (CEC), Act II encounters | `factionRep[CEC]`, retaliation hooks |
| Fragment Records | Schedule K custody paper trail | Lore collection track → Uprising gate | `NarrativeState.fragmentsDocumented` (§6.1) |
| The Off-Ledger | The bookkeeping rebellion | Resistance missions, rumor verification | `NarrativeState.offLedgerTrust` |
| The evening news | "District 7 Tonight" | Distorted Broadcast feedback mechanic | `DAY_SUMMARY` reframed via skin map |
| Sky traffic | TRAFFIC-CORE's drone-run lanes | Commute event tables, peak modifiers | `CommuteSystem` probability table |
| Hydrogen spills | The era's oil spills; 2398 zone | SPILL_REROUTE, shelter orders, ending #1 | `recentSpill` flag, `spillExposure` counter |
| The 45 days | One mortgage-cycle-and-a-half of a 47-year loan | Campaign length, act structure | `CAMPAIGN_DAYS`, `actOfDay()` |

**Layer verification:** every named entity in this file resolves to canon established in `GAME_DESIGN_DOCUMENT.md` or is newly introduced here without contradicting it; every mechanical reference resolves to a real system in `MECHANICS_DOCUMENT.md`/`engine/`; every document sample obeys the two-register law; the endings math references only engine variables that exist plus the six-field `NarrativeState` spec in §6.1, which is the narrative module's complete implementation contract.

*This is the final layer. The stack is closed.*

> *"We fixed the machines. We fixed the sky. We never fixed us."*
> — corrected poster, Hallway C, author unknown, marker
