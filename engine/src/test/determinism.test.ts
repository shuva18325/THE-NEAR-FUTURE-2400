// Determinism test: two campaigns with the same seed must be identical;
// a different seed must diverge. Exits non-zero on failure.

import { AutoAgent, DEFAULT_POLICY } from '../game/AutoAgent';
import { GameLoop } from '../game/GameLoop';
import { Rng } from '../rng/RNGManager';

function runCampaign(seed: number, days: number): string {
  const agentRng = new Rng(seed ^ 0x5eed);
  let loopRef: GameLoop | null = null;
  const agent = new AutoAgent(
    agentRng,
    DEFAULT_POLICY,
    () => loopRef?.players.player.wallet ?? 0,
    () => loopRef?.players.player.stress ?? 0,
    () => loopRef?.players.player.filterPct ?? 100,
    () => loopRef?.players.player.dailyPerformance.quotaTarget ?? 8,
  );
  const loop = new GameLoop(seed, agent);
  loopRef = loop;

  const trace: string[] = [];
  for (let d = 0; d < days; d++) {
    const m = loop.runDay();
    if (!m) break;
    trace.push(
      [
        m.dayIndex,
        m.casesClosed,
        m.tokenCount,
        m.wallet,
        m.stress,
        m.fatigue,
        m.standing,
        Object.values(m.factionRep).join(','),
      ].join('|'),
    );
  }
  return trace.join('\n');
}

function assert(cond: boolean, msg: string): void {
  if (!cond) {
    console.error(`FAIL: ${msg}`);
    process.exit(1);
  }
  console.log(`ok: ${msg}`);
}

const a = runCampaign(1234, 15);
const b = runCampaign(1234, 15);
const c = runCampaign(9999, 15);

assert(a === b, 'same seed => identical 15-day campaign trace');
assert(a !== c, 'different seed => diverging campaign trace');
assert(a.split('\n').length === 15, 'campaign ran the full 15 requested days');

console.log('determinism test passed');
