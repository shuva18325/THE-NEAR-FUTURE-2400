// DailySummarySystem — aggregates day-end data into a render-ready model.
// SYSTEM_SKELETON.md §3.2 + wireframe §9.7.

import { CAMPAIGN_DAYS } from '../constants';
import { EventBus, GameEventType } from '../events/EventBus';
import { ALL_FACTIONS, DayContext, Decision, FactionId, Player } from '../types';
import { ErrorSystem } from './ErrorSystem';
import { MortgageSystem } from './MortgageSystem';

export interface SummaryModel {
  dayIndex: number;
  campaignDays: number;
  casesClosed: number;
  quotaTarget: number;
  quotaMet: boolean;
  stampCounts: Record<Decision, number>;
  flagsFiled: number;
  escalationsUsed: number;
  compliancePct: number;
  tokenCount: number;
  standing: number;
  wagesToday: number;
  wallet: number;
  mortgageDueDay: number;
  mortgageStage: number;
  foreclosureRisk: number;
  stress: number;
  fatigue: number;
  sleepQuality: number;
  factionRep: Record<FactionId, number>;
  factionDeltas: Record<FactionId, number>;
  notices: string[];
}

export class DailySummarySystem {
  private yesterdayRep: Record<FactionId, number>;
  lastSummary: SummaryModel | null = null;

  constructor(
    private bus: EventBus,
    private getPlayer: () => Player,
    private errors: ErrorSystem,
    private mortgage: MortgageSystem,
  ) {
    this.yesterdayRep = Object.fromEntries(ALL_FACTIONS.map((f) => [f, 0])) as Record<
      FactionId,
      number
    >;
  }

  compose(ctx: DayContext): SummaryModel {
    const p = this.getPlayer();
    const perf = p.dailyPerformance;
    const deltas = Object.fromEntries(
      ALL_FACTIONS.map((f) => [f, p.factionRep[f] - this.yesterdayRep[f]]),
    ) as Record<FactionId, number>;
    this.yesterdayRep = { ...p.factionRep };

    const model: SummaryModel = {
      dayIndex: ctx.dayIndex,
      campaignDays: CAMPAIGN_DAYS,
      casesClosed: perf.casesClosed,
      quotaTarget: perf.quotaTarget,
      quotaMet: perf.casesClosed >= perf.quotaTarget,
      stampCounts: perf.stampCounts,
      flagsFiled: perf.flagsFiled,
      escalationsUsed: perf.escalationsUsed,
      compliancePct:
        perf.complianceTotal === 0
          ? 100
          : Math.round((100 * perf.complianceMatches) / perf.complianceTotal),
      tokenCount: this.errors.tokenCount(),
      standing: p.supervisorStanding,
      wagesToday: perf.wagesEarned,
      wallet: p.wallet,
      mortgageDueDay: p.mortgage.dueDate,
      mortgageStage: p.mortgage.stage,
      foreclosureRisk: this.mortgage.foreclosureRisk(),
      stress: p.stress,
      fatigue: p.fatigue,
      sleepQuality: ctx.sleepQuality,
      factionRep: { ...p.factionRep },
      factionDeltas: deltas,
      notices: ctx.notices.map((n) => `[${n.kind}] ${n.text}`),
    };
    this.lastSummary = model;
    this.bus.publish(GameEventType.DAY_SUMMARY, { model: model as unknown as Record<string, unknown> });
    return model;
  }

  /** Render the §9.7 wireframe as a console string (CLI harness). */
  render(m: SummaryModel): string {
    const bar = (v: number) => '▓'.repeat(Math.round(v / 10)).padEnd(10, '░');
    const f = (id: FactionId) =>
      `${id} ${m.factionDeltas[id] >= 0 ? '+' : ''}${m.factionDeltas[id]} ▸ ${m.factionRep[id]}`;
    return [
      `┌──────────── DAY ${m.dayIndex} / ${m.campaignDays} — SUMMARY ────────────`,
      `│ CASES  ${m.casesClosed} closed / ${m.quotaTarget} quota ${m.quotaMet ? `[+bonus]` : '[quota missed]'}`,
      `│ STAMPS A:${m.stampCounts.APPROVE} D:${m.stampCounts.DENY} C:${m.stampCounts.CONDITIONAL} E:${m.stampCounts.ESCALATE}  flags:${m.flagsFiled}`,
      `│ COMPLIANCE ${m.compliancePct}%  TOKENS ${m.tokenCount}  STANDING ${m.standing}`,
      `│ WAGES +₡H${m.wagesToday} → ₡H${m.wallet}  MORTGAGE due d${m.mortgageDueDay} stage ${m.mortgageStage} risk ${(m.foreclosureRisk * 100).toFixed(0)}%`,
      `│ STRESS ${bar(m.stress)} ${m.stress}  FATIGUE ${bar(m.fatigue)} ${m.fatigue}  SLEEP ${m.sleepQuality}`,
      `│ FACTIONS ${ALL_FACTIONS.map(f).join(' │ ')}`,
      ...m.notices.slice(0, 4).map((n) => `│ ${n}`),
      `└${'─'.repeat(58)}`,
    ].join('\n');
  }
}
