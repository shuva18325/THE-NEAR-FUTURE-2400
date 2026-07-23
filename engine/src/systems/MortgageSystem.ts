// MortgageSystem — the player's own stage 0-4 delinquency ladder.
// SYSTEM_SKELETON.md §3.2 + §8.3.

import { ESCROW_GRACE_FRACTION, MORTGAGE_PAYMENT, MORTGAGE_PERIOD_DAYS } from '../constants';
import { EventBus, GameEventType } from '../events/EventBus';
import { PlayerStateSystem } from './PlayerStateSystem';

export class MortgageSystem {
  /** partial payments accumulate here between due dates */
  private escrow = 0;
  /** unpaid remainder carried into the next payment */
  private carryover = 0;

  constructor(
    private bus: EventBus,
    private players: PlayerStateSystem,
  ) {}

  paymentDue(): number {
    const m = this.players.player.mortgage;
    let due = MORTGAGE_PAYMENT;
    if (m.stage >= 2) due *= 1.15; // penalty interest
    if (m.restructured) due *= 1.05; // stage-3 permanent bump
    return Math.round(due) + this.carryover;
  }

  escrowBalance(): number {
    return this.escrow;
  }

  /**
   * Partial payment counterplay: move wallet money into escrow ahead of the
   * due date. If escrow covers >= 50% of the payment when it lands, the
   * stage ladder does NOT advance — the remainder carries over instead.
   */
  payPartial(amount: number): boolean {
    if (amount <= 0) return false;
    if (!this.players.spend(amount, 'mortgage-escrow')) return false;
    this.escrow += amount;
    return true;
  }

  /** Pay early from the pod screen. Returns success. */
  payNow(): boolean {
    const m = this.players.player.mortgage;
    const due = this.paymentDue();
    const fromEscrow = Math.min(this.escrow, due);
    if (!this.players.spend(due - fromEscrow, 'mortgage-early')) return false;
    this.escrow -= fromEscrow;
    this.carryover = 0;
    m.amount = Math.max(0, m.amount - due);
    m.missedStreak = 0;
    if (m.stage > 0 && m.stage < 3) m.stage = 0; // arrears cleared below stage 3
    m.dueDate += MORTGAGE_PERIOD_DAYS;
    return true;
  }

  /** Day-end check (DAY_END_UPDATE step 4). Escrow drains first, wallet second. */
  dailyCheck(dayIndex: number): void {
    const m = this.players.player.mortgage;
    if (dayIndex !== m.dueDate) return;

    const due = this.paymentDue();
    const fromEscrow = Math.min(this.escrow, due);
    const remainder = due - fromEscrow;

    if (remainder === 0 || this.players.spend(remainder, 'mortgage')) {
      // fully covered
      this.escrow -= fromEscrow;
      this.carryover = 0;
      m.amount = Math.max(0, m.amount - due);
      m.missedStreak = 0;
      if (m.stage > 0 && m.stage < 3) m.stage = 0;
    } else if (fromEscrow >= due * ESCROW_GRACE_FRACTION) {
      // escrow grace: >=50% pre-paid — no stage advance, remainder carries
      this.escrow = 0;
      this.carryover = remainder;
      m.amount = Math.max(0, m.amount - fromEscrow);
      this.bus.publish(GameEventType.MORTGAGE_STAGE, { stage: m.stage, grace: true });
    } else {
      // missed — escrow (if any) still applies to principal, ladder advances
      this.escrow = 0;
      this.carryover = 0;
      m.amount = Math.max(0, m.amount - fromEscrow);
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
