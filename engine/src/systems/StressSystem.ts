// StressSystem — stress & fatigue meters, debuff ramps, breakdown/collapse/burnout.
// SYSTEM_SKELETON.md §3.2 + §8.1/8.2.

import {
  BREAKDOWN_RESET,
  BURNOUT_EVENTS,
  BURNOUT_WINDOW_DAYS,
  COLLAPSE_RESET,
  FATIGUE_MISS_ALERT_AT,
  FATIGUE_SLOW_AT,
  METER_MAX,
  METER_MIN,
  STRESS_FALSE_HIGHLIGHT_AT,
  STRESS_FLOOR_CLEAR_DAYS,
  STRESS_FLOOR_TRIGGER_DAYS,
  STRESS_FLOOR_VALUE,
  STRESS_STAMP_DRIFT_AT,
  clamp,
} from '../constants';
import { EventBus, GameEventType } from '../events/EventBus';
import { Player } from '../types';

export enum Debuff {
  STAMP_DRIFT = 'STAMP_DRIFT',
  FALSE_HIGHLIGHT = 'FALSE_HIGHLIGHT',
  DRAG_SLOW_25 = 'DRAG_SLOW_25',
  MISS_ONE_ALERT = 'MISS_ONE_ALERT',
}

export class StressSystem {
  /** day indices of breakdown/collapse events, for the burnout window */
  private incidentDays: number[] = [];
  private breakdownFiredToday = false;
  private collapseFiredToday = false;
  /** chronic stress: 3 days ending >=70 raises the floor; 2 days <=40 clears it */
  private highStressDays = 0;
  private lowStressDays = 0;
  private stressFloor = 0;

  constructor(
    private bus: EventBus,
    private player: Player,
  ) {}

  get stress(): number {
    return this.player.stress;
  }

  get fatigue(): number {
    return this.player.fatigue;
  }

  addStress(amount: number, source: string, dayIndex: number): void {
    this.player.stress = clamp(this.player.stress + amount, METER_MIN, METER_MAX);
    if (this.player.stress >= METER_MAX && !this.breakdownFiredToday) {
      this.breakdownFiredToday = true;
      this.recordIncident(dayIndex);
      this.bus.publish(GameEventType.BREAKDOWN, { source, dayIndex });
    }
  }

  addFatigue(amount: number): void {
    this.player.fatigue = clamp(this.player.fatigue + amount, METER_MIN, METER_MAX);
  }

  relieveStress(amount: number): void {
    if (amount < 0) throw new Error('relieveStress: negative amount');
    // relief can never dig below the chronic floor
    this.player.stress = clamp(this.player.stress - amount, this.stressFloor, METER_MAX);
  }

  /** Applied by GameLoop after BREAKDOWN handling: shift ends, meters reset. */
  applyBreakdownReset(): void {
    this.player.stress = BREAKDOWN_RESET;
  }

  /** Checked at SLEEP. Returns true if COLLAPSE fires (oversleep tomorrow). */
  checkCollapseAtSleep(dayIndex: number): boolean {
    if (this.player.fatigue >= METER_MAX && !this.collapseFiredToday) {
      this.collapseFiredToday = true;
      this.recordIncident(dayIndex);
      this.player.fatigue = COLLAPSE_RESET;
      this.bus.publish(GameEventType.COLLAPSE, { dayIndex });
      return true;
    }
    return false;
  }

  /** Overnight recovery — quality 0 => -30/-10, quality 100 => -80/-35. */
  overnightRecovery(sleepQuality: number): void {
    // chronic stress tracking uses the level the day ENDED at
    if (this.player.stress >= 70) {
      this.highStressDays++;
      this.lowStressDays = 0;
    } else if (this.player.stress <= 40) {
      this.lowStressDays++;
      this.highStressDays = 0;
    } else {
      this.highStressDays = 0;
      this.lowStressDays = 0;
    }
    if (this.highStressDays >= STRESS_FLOOR_TRIGGER_DAYS) this.stressFloor = STRESS_FLOOR_VALUE;
    if (this.lowStressDays >= STRESS_FLOOR_CLEAR_DAYS) this.stressFloor = 0;

    let fatigueRecovery = 30 + sleepQuality / 2;
    if (this.player.fatigueRecoveryBonusDays > 0) {
      fatigueRecovery *= 1.2; // SMC reward
      this.player.fatigueRecoveryBonusDays--;
    }
    this.player.fatigue = Math.round(
      clamp(this.player.fatigue - fatigueRecovery, METER_MIN, METER_MAX),
    );
    this.player.stress = Math.round(
      clamp(this.player.stress - (10 + sleepQuality / 4), this.stressFloor, METER_MAX),
    );
    this.breakdownFiredToday = false;
    this.collapseFiredToday = false;
  }

  currentStressFloor(): number {
    return this.stressFloor;
  }

  activeDebuffs(): Debuff[] {
    const out: Debuff[] = [];
    if (this.player.stress >= STRESS_STAMP_DRIFT_AT) out.push(Debuff.STAMP_DRIFT);
    if (this.player.stress >= STRESS_FALSE_HIGHLIGHT_AT) out.push(Debuff.FALSE_HIGHLIGHT);
    if (this.player.fatigue >= FATIGUE_SLOW_AT) out.push(Debuff.DRAG_SLOW_25);
    if (this.player.fatigue >= FATIGUE_MISS_ALERT_AT) out.push(Debuff.MISS_ONE_ALERT);
    return out;
  }

  /** Stamp drift probability: 0 at 50 stress -> 0.2 at 100. */
  driftProbability(): number {
    if (this.player.stress < STRESS_STAMP_DRIFT_AT) return 0;
    return (this.player.stress - STRESS_STAMP_DRIFT_AT) / 250;
  }

  private recordIncident(dayIndex: number): void {
    this.incidentDays.push(dayIndex);
    const windowStart = dayIndex - BURNOUT_WINDOW_DAYS + 1;
    const inWindow = this.incidentDays.filter((d) => d >= windowStart);
    if (inWindow.length >= BURNOUT_EVENTS) {
      this.incidentDays = []; // window consumed
      this.bus.publish(GameEventType.BURNOUT, { dayIndex });
    }
  }
}
