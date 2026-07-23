// CommuteSystem — route selection, weighted event rolls, time/stress costs.
// SYSTEM_SKELETON.md §6.1-6.3.

import { MAX_COMMUTE_EVENTS, clamp01 } from '../constants';
import { EventBus } from '../events/EventBus';
import { Rng } from '../rng/RNGManager';
import {
  CheckpointEvent,
  CommuteEvent,
  CommuteEventType,
  CommuteLog,
  DayContext,
  PermitType,
  RouteId,
  TripPhase,
} from '../types';
import { FactionPressureSystem } from './FactionPressureSystem';
import { PermitSystem } from './PermitSystem';
import { PlayerStateSystem } from './PlayerStateSystem';
import { StressSystem } from './StressSystem';

export interface RouteSpec {
  cost: number;
  baseTime: number;
  fatigue: number;
  permit: PermitType | null;
}

export const ROUTES: Record<RouteId, RouteSpec> = {
  [RouteId.WALKWAY]: { cost: 0, baseTime: 40, fatigue: 10, permit: null },
  [RouteId.AIR_BUS]: { cost: 4, baseTime: 25, fatigue: 5, permit: null },
  [RouteId.SKY_LANE]: { cost: 9, baseTime: 12, fatigue: 2, permit: PermitType.SKYLANE_PERMIT },
};

export interface CommuteResult {
  log: CommuteLog;
  pendingCheckpoint: CheckpointEvent | null;
}

interface EventSpec {
  type: CommuteEventType;
  baseP: number;
  appliesTo: (route: RouteId) => boolean;
  routeScale?: (route: RouteId) => number;
}

const EVENT_TABLE: EventSpec[] = [
  { type: CommuteEventType.DELAY, baseP: 0.2, appliesTo: () => true },
  { type: CommuteEventType.SPILL_REROUTE, baseP: 0.08, appliesTo: () => true },
  {
    type: CommuteEventType.CHECKPOINT,
    baseP: 0.15,
    appliesTo: () => true,
    routeScale: (r) => (r === RouteId.WALKWAY ? 0.5 : 1),
  },
  { type: CommuteEventType.ROBOT_INSPECTION, baseP: 0.1, appliesTo: () => true },
  {
    type: CommuteEventType.SLUM_EVENT,
    baseP: 0.25,
    appliesTo: (r) => r === RouteId.WALKWAY,
  },
];

export class CommuteSystem {
  /** world flag set by news/events layer: spill within the last day */
  recentSpill = false;

  constructor(
    private bus: EventBus,
    private players: PlayerStateSystem,
    private stress: StressSystem,
    private permits: PermitSystem,
    private factions: FactionPressureSystem,
  ) {}

  /** Best route the player can actually pay for / is licensed for right now. */
  affordableRoute(preferred: RouteId): RouteId {
    const spec = ROUTES[preferred];
    const fare = this.fareFor(preferred);
    if (spec.permit && !this.permits.validate(spec.permit)) return this.downgrade(preferred);
    if (this.players.player.wallet < fare) return this.downgrade(preferred);
    return preferred;
  }

  fareFor(route: RouteId): number {
    let fare = ROUTES[route].cost;
    if (route === RouteId.SKY_LANE) fare = Math.round(fare * this.factions.skyLaneFareMultiplier());
    return fare;
  }

  run(
    preferred: RouteId,
    phase: TripPhase,
    ctx: DayContext,
    rng: Rng,
    act: 1 | 2 | 3,
  ): CommuteResult {
    const route = this.affordableRoute(preferred);
    const spec = ROUTES[route];
    const fare = this.fareFor(route);
    if (fare > 0 && !this.players.spend(fare, `fare:${route}`)) {
      throw new Error('CommuteSystem.run: fare charge failed after affordability check');
    }

    const departTime = ctx.clock;
    let time = spec.baseTime;
    const events: CommuteEvent[] = [];
    let pendingCheckpoint: CheckpointEvent | null = null;
    const morningPeak = phase === TripPhase.OUTBOUND && departTime >= 390 && departTime <= 450;

    for (const e of EVENT_TABLE) {
      if (!e.appliesTo(route)) continue;
      let P = e.baseP * (e.routeScale ? e.routeScale(route) : 1);
      switch (e.type) {
        case CommuteEventType.DELAY:
          if (morningPeak) P += 0.15;
          if (act === 3) P += 0.1;
          break;
        case CommuteEventType.SPILL_REROUTE:
          if (this.recentSpill) P += 0.1;
          break;
        case CommuteEventType.CHECKPOINT: {
          const override = this.factions.checkpointProbabilityOverride();
          if (override !== null) P = override;
          else if (phase === TripPhase.RETURN) P += 0.1;
          break;
        }
        case CommuteEventType.ROBOT_INSPECTION:
          if (this.players.player.carryingContraband) P *= 2;
          break;
      }

      if (!rng.chance(clamp01(P))) continue;
      const ev = this.materialize(e.type, rng);
      events.push(ev);
      time += ev.timeCost;
      if (ev.stressDelta) this.stress.addStress(ev.stressDelta, `commute:${ev.type}`, ctx.dayIndex);
      if (ev.creditDelta > 0) this.players.credit(ev.creditDelta, 'slum-event');
      if (ev.creditDelta < 0) this.players.fine(-ev.creditDelta, 'slum-event');

      if (ev.type === CommuteEventType.CHECKPOINT) {
        pendingCheckpoint = {
          cyborgPresence: rng.chance(0.6),
          robotScan: rng.chance(0.5) || this.players.player.carryingContraband,
          requiredPermit:
            route === RouteId.SKY_LANE ? PermitType.SKYLANE_PERMIT : PermitType.RESIDENCY_ID,
          baseTimeCost: 10,
        };
      }
      // cap at 2 events; a rolled CHECKPOINT is never discarded
      const nonCheckpoint = events.filter((x) => x.type !== CommuteEventType.CHECKPOINT).length;
      if (nonCheckpoint >= MAX_COMMUTE_EVENTS) break;
    }

    this.stress.addFatigue(spec.fatigue);
    ctx.clock = departTime + time;
    const log: CommuteLog = { route, phase, events, totalTime: time, arrived: ctx.clock };
    ctx.commuteLogs.push(log);
    return { log, pendingCheckpoint };
  }

  // ---- internals ----

  private downgrade(r: RouteId): RouteId {
    if (r === RouteId.SKY_LANE) return this.affordableRoute(RouteId.AIR_BUS);
    if (r === RouteId.AIR_BUS) return RouteId.WALKWAY;
    return RouteId.WALKWAY;
  }

  private materialize(type: CommuteEventType, rng: Rng): CommuteEvent {
    const severity = rng.weighted([
      [1, 60],
      [2, 30],
      [3, 10],
    ] as [1 | 2 | 3, number][]);
    switch (type) {
      case CommuteEventType.DELAY:
        return { type, severity, timeCost: severity * 7, stressDelta: severity, creditDelta: 0 };
      case CommuteEventType.SPILL_REROUTE:
        return { type, severity, timeCost: 10 + severity * 7, stressDelta: 5, creditDelta: 0 };
      case CommuteEventType.CHECKPOINT:
        return { type, severity, timeCost: 0, stressDelta: 8, creditDelta: 0 }; // time added at resolution
      case CommuteEventType.ROBOT_INSPECTION:
        return { type, severity, timeCost: 5, stressDelta: 2, creditDelta: 0 };
      case CommuteEventType.SLUM_EVENT: {
        const positive = rng.chance(0.5);
        return {
          type,
          severity,
          timeCost: positive ? 0 : 5,
          stressDelta: positive ? 0 : 3,
          creditDelta: positive ? 10 : -15,
        };
      }
    }
  }
}
