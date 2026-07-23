// Headless simulation harness: runs a full 45-day campaign with the AutoAgent
// and prints each day's summary. Usage:
//   npm run build && node dist/main.js [--seed N] [--days N] [--quiet]

import { CAMPAIGN_DAYS } from './constants';
import { AutoAgent, DEFAULT_POLICY } from './game/AutoAgent';
import { GameLoop } from './game/GameLoop';
import { Rng } from './rng/RNGManager';
import { GameState } from './types';

function argValue(flag: string): string | null {
  const i = process.argv.indexOf(flag);
  return i >= 0 && i + 1 < process.argv.length ? process.argv[i + 1] : null;
}

function main(): void {
  const seed = Number(argValue('--seed') ?? 2400);
  const days = Number(argValue('--days') ?? CAMPAIGN_DAYS);
  const quiet = process.argv.includes('--quiet');

  // The agent's own decision noise gets its own RNG so agent randomness
  // never perturbs the world streams.
  const agentRng = new Rng(seed ^ 0x5eed);

  // late-bound getters so the agent reads live player state
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

  console.log(`THE NEAR FUTURE: 2400 — headless simulation (seed ${seed}, ${days} days)\n`);

  let quotaMisses = 0;
  let breakdowns = 0;
  for (let d = 0; d < days; d++) {
    const model = loop.runDay();
    if (!model) break;
    if (!model.quotaMet) quotaMisses++;
    if (loop.ctx.shiftLog?.breakdownFired) breakdowns++;
    if (!quiet) {
      console.log(loop.summary.render(model));
      console.log('');
    }
    if (loop.state === GameState.CAMPAIGN_OVER) break;
  }

  const p = loop.players.player;
  console.log('════════ CAMPAIGN RESULT ════════');
  console.log(`days simulated:   ${Math.min(days, CAMPAIGN_DAYS)}`);
  console.log(`final wallet:     ₡H ${p.wallet}`);
  console.log(`final standing:   ${p.supervisorStanding}`);
  console.log(`employment:       ${p.employment}`);
  console.log(`mortgage stage:   ${p.mortgage.stage} (relocated: ${p.relocated})`);
  console.log(`error tokens:     ${loop.errors.tokenCount()}`);
  console.log(`quota misses:     ${quotaMisses}`);
  console.log(
    `faction rep:      ${Object.entries(p.factionRep)
      .map(([k, v]) => `${k}:${v}`)
      .join(' ')}`,
  );
}

main();
