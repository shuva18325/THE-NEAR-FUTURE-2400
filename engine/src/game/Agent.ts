// Agent — the decision interface between the GameLoop and whoever is playing:
// a UI layer (Svelte binds here) or the AutoAgent (headless simulation).

import { Case, Decision, EveningChoice, LunchChoice, RouteId } from '../types';
import { WorkDeskSystem } from '../systems/WorkDeskSystem';

export interface PodDecisions {
  replaceFilter: boolean;
  payMortgageEarly: boolean;
}

export interface Agent {
  /** POD_MAINTENANCE: morning purchases. */
  podMaintenance(): PodDecisions;
  /** COMMUTE / COMMUTE_BACK: route preference (system downgrades if unaffordable). */
  chooseRoute(outbound: boolean): RouteId;
  /** BREAK. */
  chooseLunch(): LunchChoice;
  /**
   * WORK_SHIFT blocks: play one full case at the desk (pull already done).
   * The agent calls desk.queryDb / compareWithRecord / fileFlag as it likes,
   * then must stamp. Return value = the stamp it *attempted*.
   */
  workCase(desk: WorkDeskSystem, c: Case): Decision;
  /** WORK_SHIFT_2 end: take overtime if behind quota? */
  takeOvertime(behindBy: number): boolean;
  /** POD_EVENTS. */
  chooseEvening(): EveningChoice;
  /**
   * CHECKPOINT secondary: offer a bribe? Called only when the scan has
   * already failed (lapsed permit or contraband found). Cost and odds are
   * the CheckpointSystem's business; the agent only decides yes/no.
   */
  offerBribe(): boolean;
}
