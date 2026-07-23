// CheckpointSystem — scan sub-state machine: pass / citation / confiscate / detain.
// SYSTEM_SKELETON.md §6.4 + §8.4.

import {
  CHECKPOINT_FINE,
  DETAIN_BASE_P,
  DETAIN_CEC_HOSTILE_P,
  DETAIN_FLAGGED_WORKER_P,
  THRESH_PROBATION,
} from '../constants';
import { EventBus, GameEventType } from '../events/EventBus';
import { Rng } from '../rng/RNGManager';
import {
  CheckpointEvent,
  CheckpointOutcome,
  CheckpointResult,
  DayContext,
  FactionId,
} from '../types';
import { ErrorSystem } from './ErrorSystem';
import { FactionPressureSystem } from './FactionPressureSystem';
import { PermitSystem } from './PermitSystem';
import { PlayerStateSystem } from './PlayerStateSystem';
import { StressSystem } from './StressSystem';

export class CheckpointSystem {
  constructor(
    private bus: EventBus,
    private players: PlayerStateSystem,
    private stress: StressSystem,
    private permits: PermitSystem,
    private factions: FactionPressureSystem,
    private errors: ErrorSystem,
  ) {}

  resolve(e: CheckpointEvent, ctx: DayContext, rng: Rng): CheckpointOutcome {
    const p = this.players.player;
    const permitOk = this.permits.validate(e.requiredPermit);
    const contraband = e.robotScan && p.carryingContraband;

    let outcome: CheckpointOutcome;

    if (permitOk && !contraband) {
      outcome = { result: CheckpointResult.PASS, timeCost: e.baseTimeCost, fine: 0 };
    } else {
      // SECONDARY
      let detainP = DETAIN_BASE_P;
      if (this.factions.rep(FactionId.CEC) <= -60) detainP += DETAIN_CEC_HOSTILE_P;
      if (this.errors.tokenCount() >= THRESH_PROBATION) detainP += DETAIN_FLAGGED_WORKER_P;
      if (this.factions.rep(FactionId.CEC) >= 0) detainP /= 2;

      if (rng.chance(detainP)) {
        ctx.halfDayDetained = true;
        p.cgnComplianceFlags++;
        if (p.cgnComplianceFlags % 3 === 0) this.players.addStanding(-15);
        outcome = { result: CheckpointResult.DETAIN, timeCost: 0, fine: 0 };
      } else if (contraband) {
        p.carryingContraband = false;
        this.factions.onContrabandConfiscated();
        outcome = { result: CheckpointResult.CONFISCATE, timeCost: e.baseTimeCost + 10, fine: 0 };
      } else {
        this.players.fine(CHECKPOINT_FINE, 'checkpoint-citation');
        outcome = {
          result: CheckpointResult.CITATION,
          timeCost: e.baseTimeCost + 10,
          fine: CHECKPOINT_FINE,
        };
      }
    }

    ctx.clock += outcome.timeCost;
    this.stress.addStress(outcome.result === CheckpointResult.PASS ? 3 : 8, 'checkpoint', ctx.dayIndex);
    ctx.checkpointOutcomes.push(outcome);
    this.bus.publish(GameEventType.CHECKPOINT_RESULT, { result: outcome.result });
    return outcome;
  }
}
