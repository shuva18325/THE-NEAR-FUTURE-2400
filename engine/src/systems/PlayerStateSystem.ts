// PlayerStateSystem — single source of truth for the Player struct.
// All writes clamped; wallet operations validated; publishes PLAYER_CHANGED.

import {
  FACTION_MAX,
  FACTION_MIN,
  FIRST_MORTGAGE_DUE_DAY,
  METER_MAX,
  METER_MIN,
  MORTGAGE_PAYMENT,
  QUOTA,
  STARTING_WALLET,
  clamp,
} from '../constants';
import { EventBus, GameEventType } from '../events/EventBus';
import {
  ALL_FACTIONS,
  DeskUpgrade,
  EmploymentState,
  FactionId,
  Permit,
  PermitType,
  Player,
  emptyDailyPerformance,
} from '../types';

export class PlayerStateSystem {
  readonly player: Player;

  constructor(private bus: EventBus) {
    this.player = {
      stress: 20,
      fatigue: 20,
      supervisorStanding: 50,
      factionRep: Object.fromEntries(ALL_FACTIONS.map((f) => [f, 0])) as Record<FactionId, number>,
      wallet: STARTING_WALLET,
      mortgage: {
        amount: 240_000,
        dueDate: FIRST_MORTGAGE_DUE_DAY,
        missedStreak: 0,
        stage: 0,
        restructured: false,
      },
      permits: [
        { type: PermitType.RESIDENCY_ID, daysRemaining: 9999, tier: 1 },
        { type: PermitType.SKYLANE_PERMIT, daysRemaining: 11, tier: 1 },
      ],
      clearanceTier: 1,
      upgrades: [],
      employment: EmploymentState.EMPLOYED,
      employmentCounter: 0,
      carryingContraband: false,
      filterPct: 78,
      filterCap: 100,
      relocated: false,
      utilitiesRationed: false,
      cgnComplianceFlags: 0,
      fatigueRecoveryBonusDays: 0,
      dailyPerformance: emptyDailyPerformance(QUOTA[0]),
    };
  }

  // ---- wallet ----

  /** Credit the wallet (amount >= 0). */
  credit(amount: number, source: string): void {
    if (amount < 0) throw new Error(`credit: negative amount from ${source}`);
    this.player.wallet += Math.round(amount);
    this.bus.publish(GameEventType.PAY_RECEIVED, { amount, source });
    this.changed();
  }

  /** Attempt to spend. Returns false (no mutation) if insufficient funds. */
  spend(amount: number, sink: string): boolean {
    if (amount < 0) throw new Error(`spend: negative amount for ${sink}`);
    if (this.player.wallet < amount) return false;
    this.player.wallet -= Math.round(amount);
    this.changed();
    return true;
  }

  /** Forced debit (fines): wallet may go negative — debt is real. */
  fine(amount: number, sink: string): void {
    if (amount < 0) throw new Error(`fine: negative amount for ${sink}`);
    this.player.wallet -= Math.round(amount);
    this.changed();
  }

  // ---- meters ----

  addStanding(delta: number): void {
    this.player.supervisorStanding = clamp(
      this.player.supervisorStanding + delta,
      METER_MIN,
      METER_MAX,
    );
    this.changed();
  }

  supervisorStandingLow(): boolean {
    return this.player.supervisorStanding <= 39;
  }

  setFactionRep(f: FactionId, value: number): void {
    this.player.factionRep[f] = clamp(value, FACTION_MIN, FACTION_MAX);
    this.changed();
  }

  // ---- permits ----

  getPermit(type: PermitType): Permit | undefined {
    return this.player.permits.find((p) => p.type === type);
  }

  // ---- upgrades / employment ----

  hasUpgrade(u: DeskUpgrade): boolean {
    return this.player.upgrades.includes(u);
  }

  grantUpgrade(u: DeskUpgrade): void {
    if (!this.player.upgrades.includes(u)) {
      this.player.upgrades.push(u);
      this.changed();
    }
  }

  setEmployment(state: EmploymentState, counter = 0): void {
    if (this.player.employment !== state) {
      this.player.employment = state;
      this.player.employmentCounter = counter;
      this.bus.publish(GameEventType.EMPLOYMENT_CHANGED, { state });
      this.changed();
    }
  }

  // ---- daily reset ----

  resetDaily(act: 1 | 2 | 3): void {
    let quota = QUOTA[act - 1];
    if (this.player.employment === EmploymentState.PROBATION) quota += 2;
    if (this.player.employment === EmploymentState.PERFORMANCE_PLAN) quota += 2;
    this.player.dailyPerformance = emptyDailyPerformance(quota);
  }

  private changed(): void {
    this.bus.publish(GameEventType.PLAYER_CHANGED, {});
  }
}
