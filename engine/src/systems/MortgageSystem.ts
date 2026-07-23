// MortgageSystem — the player's own stage 0-4 delinquency ladder.
// SYSTEM_SKELETON.md §3.2 + §8.3.

import { MORTGAGE_PAYMENT, MORTGAGE_PERIOD_DAYS } from '../constants';
import { EventBus, GameEventType } from '../events/EventBus';
import { PlayerStateSystem } from './PlayerStateSystem';

export class MortgageSystem {
  constructor(
    private bus: EventBus,
    private players: PlayerStateSystem,
  ) {}

  paymentDue(): number {
    const m = this.players.player.mortgage;
    let due = MORTGAGE_PAYMENT;
    if (m.stage >= 2) due *= 1.15; // penalty interest
    if (m.restructured) due *= 1.05; // stage-3 permanent bump
    return Math.round(due);
  }

  /** Pay early from the pod screen. Returns success. */
  payNow(): boolean {
    const m = this.players.player.mortgage;
    const due = this.paymentDue();
    if (!this.players.spend(due, 'mortgage-early')) return false;
    m.amount = Math.max(0, m.amount - due);
    m.missedStreak = 0;
    if (m.stage > 0 && m.stage < 3) m.stage = 0; // arrears cleared below stage 3
    m.dueDate += MORTGAGE_PERIOD_DAYS;
    return true;
  }

  /** Day-end check (DAY_END_UPDATE step 4). */
  dailyCheck(dayIndex: number): void {
    const m = this.players.player.mortgage;
    if (dayIndex !== m.dueDate) return;

    const due = this.paymentDue();
    if (this.players.spend(due, 'mortgage')) {
      m.amount = Math.max(0, m.amount - due);
      m.missedStreak = 0;
      if (m.stage > 0 && m.stage < 3) m.stage = 0;
    } else {
      m.missedStreak++;
      this.advanceStage();
    }
    m.dueDate += MORTGAGE_PERIOD_DAYS;
  }

  foreclosureRisk(): number {
    const p = this.players.player;
    const risk =
      p.mortgage.missedStreak * 0.25 + (p.wallet < this.paymentDue() ? 0.15 : 0);
    return Math.min(1, Math.max(0, risk));
  }

  private advanceStage(): void {
    const p = this.players.player;
    const m = p.mortgage;
    if (m.stage >= 4) return;
    m.stage = Math.min(4, m.missedStreak) as 0 | 1 | 2 | 3 | 4;

    switch (m.stage) {
      case 1:
        break; // notice only
      case 2:
        break; // penalty interest handled in paymentDue()
      case 3:
        m.restructured = true;
        p.utilitiesRationed = true; // sleepQuality -20 (applied in sleep calc)
        break;
      case 4:
        // relocation: worse pod, permanently
        p.relocated = true;
        p.filterCap = 70;
        p.filterPct = Math.min(p.filterPct, p.filterCap);
        p.utilitiesRationed = false; // new unit, new (worse) baseline instead
        m.missedStreak = 0;
        m.stage = 0; // fresh ladder in the downgraded pod
        break;
    }
    this.bus.publish(GameEventType.MORTGAGE_STAGE, {
      stage: p.relocated && m.stage === 0 ? 4 : m.stage,
    });
  }
}
