// PermitSystem — player-held permits registry, expiry, validation.

import { EventBus, GameEventType } from '../events/EventBus';
import { PermitType } from '../types';
import { PlayerStateSystem } from './PlayerStateSystem';

const PERMIT_PRICES: Record<PermitType, { cost: number; days: number }> = {
  [PermitType.SKYLANE_PERMIT]: { cost: 60, days: 30 },
  [PermitType.AIRBUS_PASS]: { cost: 20, days: 30 },
  [PermitType.RESIDENCY_ID]: { cost: 0, days: 9999 },
};

export class PermitSystem {
  constructor(
    private bus: EventBus,
    private players: PlayerStateSystem,
  ) {}

  validate(type: PermitType): boolean {
    const p = this.players.getPermit(type);
    return !!p && p.daysRemaining > 0;
  }

  daysRemaining(type: PermitType): number {
    return this.players.getPermit(type)?.daysRemaining ?? 0;
  }

  /** Buy or renew a permit. Returns success. */
  purchase(type: PermitType): boolean {
    const price = PERMIT_PRICES[type];
    if (!price) throw new Error(`PermitSystem.purchase: unknown permit ${type}`);
    if (!this.players.spend(price.cost, `permit:${type}`)) return false;
    const existing = this.players.getPermit(type);
    if (existing) {
      existing.daysRemaining += price.days;
    } else {
      this.players.player.permits.push({ type, daysRemaining: price.days, tier: 1 });
    }
    return true;
  }

  /** Day-end countdown (DAY_END_UPDATE step 8). */
  tickExpiry(): void {
    for (const p of this.players.player.permits) {
      if (p.daysRemaining > 0 && p.daysRemaining < 9999) {
        p.daysRemaining--;
        if (p.daysRemaining === 0) {
          this.bus.publish(GameEventType.PERMIT_EXPIRED, { type: p.type });
        }
      }
    }
  }
}
