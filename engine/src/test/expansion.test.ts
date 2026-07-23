// Expansion-layer mechanics test: exercises defer, escrow grace, appeals,
// clean streak, refusal escalation, and the chronic stress floor directly
// through system APIs. Exits non-zero on failure.

import { EventBus } from '../events/EventBus';
import { Rng } from '../rng/RNGManager';
import { ErrorSystem } from '../systems/ErrorSystem';
import { FactionPressureSystem } from '../systems/FactionPressureSystem';
import { MortgageSystem } from '../systems/MortgageSystem';
import { PlayerStateSystem } from '../systems/PlayerStateSystem';
import { StressSystem } from '../systems/StressSystem';
import { Case, CaseFamily, ClientType, Decision, FactionId } from '../types';

let failures = 0;
function check(cond: boolean, msg: string): void {
  if (cond) console.log(`ok: ${msg}`);
  else {
    console.error(`FAIL: ${msg}`);
    failures++;
  }
}

function makeTaggedCase(faction: FactionId, requested: Decision.APPROVE | Decision.DENY): Case {
  return {
    id: `T-${Math.random()}`,
    clientType: ClientType.FACTION_REP,
    family: CaseFamily.MORTGAGE_RENEWAL,
    documents: [],
    dbRecord: { fields: {}, income: 1000, missedPayments: 0, lagSafe: [] },
    dbQueried: true,
    flags: [],
    taggedBy: faction,
    requestedOutcome: requested,
    isTestCase: false,
    isConflictCase: false,
    isFramed: false,
    codeExpiryClock: null,
    allowsTerms: true,
    aboveTier: false,
    deferred: false,
    decision: null,
    correctByEvidence: Decision.APPROVE,
    correctByDirective: Decision.APPROVE,
  };
}

// ---- refusal escalation ladder ----
{
  const bus = new EventBus();
  const players = new PlayerStateSystem(bus);
  const factions = new FactionPressureSystem(bus, players);
  const reps: number[] = [];
  for (let i = 0; i < 5; i++) {
    factions.onTaggedResolved(makeTaggedCase(FactionId.JGC, Decision.DENY), Decision.APPROVE); // refuse
    reps.push(factions.rep(FactionId.JGC));
  }
  // deltas: -6, -8, -10, -12, -12 => cumulative -6, -14, -24, -36, -48
  check(reps.join(',') === '-6,-14,-24,-36,-48', `refusal escalation ladder -6/-8/-10/-12 cap (got ${reps.join(',')})`);
  factions.onTaggedResolved(makeTaggedCase(FactionId.JGC, Decision.DENY), Decision.DENY); // comply resets
  factions.onTaggedResolved(makeTaggedCase(FactionId.JGC, Decision.DENY), Decision.APPROVE); // refuse again
  check(factions.rep(FactionId.JGC) === -48 + 8 - 6, 'comply resets the refusal streak');
}

// ---- mortgage escrow grace ----
{
  const bus = new EventBus();
  const players = new PlayerStateSystem(bus);
  const mortgage = new MortgageSystem(bus, players);
  players.player.wallet = 400; // cannot cover 610
  check(mortgage.payPartial(350), 'partial payment moves wallet to escrow');
  check(mortgage.escrowBalance() === 350, 'escrow balance tracks');
  players.player.wallet = 0; // broke on due day
  mortgage.dailyCheck(players.player.mortgage.dueDate);
  check(players.player.mortgage.stage === 0, 'escrow >= 50% prevents stage advance (grace)');
  check(mortgage.paymentDue() > 610, 'unpaid remainder carries over to next payment');
}

// ---- mortgage miss without escrow ----
{
  const bus = new EventBus();
  const players = new PlayerStateSystem(bus);
  const mortgage = new MortgageSystem(bus, players);
  players.player.wallet = 0;
  mortgage.dailyCheck(players.player.mortgage.dueDate);
  check(players.player.mortgage.stage === 1, 'no escrow + no wallet advances the ladder');
}

// ---- clean streak + appeal ----
{
  const bus = new EventBus();
  const players = new PlayerStateSystem(bus);
  const factions = new FactionPressureSystem(bus, players);
  const errors = new ErrorSystem(bus, players, factions);
  const c = makeTaggedCase(FactionId.SMC, Decision.APPROVE);
  c.taggedBy = null;
  // wrong decision -> token after lag
  errors.enqueueAudit(c, Decision.DENY, 1, 1); // correct is APPROVE
  errors.resolveAudits(4);
  check(errors.tokenCount() === 1, 'wrong decision yields a token at audit lag');
  // five clean audit days remove it
  for (let day = 5; day <= 9; day++) {
    const clean = makeTaggedCase(FactionId.SMC, Decision.APPROVE);
    clean.taggedBy = null;
    errors.enqueueAudit(clean, Decision.APPROVE, day - 3, 1);
    errors.resolveAudits(day);
  }
  check(errors.tokenCount() === 0, '5-day clean streak removes the oldest token');
  // appeal with no tokens
  check(errors.appealOldest(new Rng(1), 10) === 'NO_TOKENS', 'appeal with empty ledger reports NO_TOKENS');
}

// ---- chronic stress floor ----
{
  const bus = new EventBus();
  const players = new PlayerStateSystem(bus);
  const stress = new StressSystem(bus, players.player);
  for (let d = 1; d <= 3; d++) {
    players.player.stress = 85; // day ends high
    stress.overnightRecovery(100); // best possible sleep
  }
  check(stress.currentStressFloor() === 10, 'three high days set the chronic floor');
  stress.relieveStress(100);
  check(players.player.stress === 10, 'relief cannot dig below the floor');
  for (let d = 1; d <= 2; d++) {
    players.player.stress = 30; // calm days
    stress.overnightRecovery(100);
  }
  check(stress.currentStressFloor() === 0, 'two calm days clear the floor');
}

if (failures > 0) {
  console.error(`${failures} expansion test(s) failed`);
  process.exit(1);
}
console.log('expansion mechanics test passed');
