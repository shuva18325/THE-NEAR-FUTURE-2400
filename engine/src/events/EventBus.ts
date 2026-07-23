// EventBus — SYSTEM_SKELETON.md §3.2 (EventManager).
// Queued pub/sub with priority bands and deterministic FIFO order within a band.

export enum GameEventType {
  STATE_ENTER = 'STATE_ENTER',
  STATE_EXIT = 'STATE_EXIT',
  CASE_CLOSED = 'CASE_CLOSED',
  FLAG_FILED = 'FLAG_FILED',
  AUDIT_RESULT = 'AUDIT_RESULT',
  TOKEN_THRESHOLD = 'TOKEN_THRESHOLD',
  FACTION_DELTA = 'FACTION_DELTA',
  FACTION_THRESHOLD = 'FACTION_THRESHOLD',
  FACTION_RETALIATION = 'FACTION_RETALIATION',
  CHECKPOINT_RESULT = 'CHECKPOINT_RESULT',
  MORTGAGE_STAGE = 'MORTGAGE_STAGE',
  BREAKDOWN = 'BREAKDOWN',
  COLLAPSE = 'COLLAPSE',
  BURNOUT = 'BURNOUT',
  SPOT_AUDIT = 'SPOT_AUDIT',
  PERMIT_EXPIRED = 'PERMIT_EXPIRED',
  PAY_RECEIVED = 'PAY_RECEIVED',
  PLAYER_CHANGED = 'PLAYER_CHANGED',
  EMPLOYMENT_CHANGED = 'EMPLOYMENT_CHANGED',
  POD_INCIDENT = 'POD_INCIDENT',
  DAY_SUMMARY = 'DAY_SUMMARY',
}

export enum EventPriority {
  SYSTEM = 0,
  GAMEPLAY = 1,
  UI = 2,
}

export type EventPayload = Record<string, unknown>;
export type EventHandler = (payload: EventPayload) => void;

interface QueuedEvent {
  type: GameEventType;
  payload: EventPayload;
  priority: EventPriority;
  seq: number;
}

export class EventBus {
  private handlers = new Map<GameEventType, Set<EventHandler>>();
  private queue: QueuedEvent[] = [];
  private seqCounter = 0;
  private pumping = false;

  /** Register a handler. Returns an unsubscribe function. */
  subscribe(type: GameEventType, handler: EventHandler): () => void {
    if (typeof handler !== 'function') {
      throw new Error(`EventBus.subscribe: handler for ${type} is not a function`);
    }
    let set = this.handlers.get(type);
    if (!set) {
      set = new Set();
      this.handlers.set(type, set);
    }
    set.add(handler);
    return () => this.unsubscribe(type, handler);
  }

  unsubscribe(type: GameEventType, handler: EventHandler): void {
    this.handlers.get(type)?.delete(handler);
  }

  /** Queue an event; dispatched on the next pump() in priority order. */
  publish(
    type: GameEventType,
    payload: EventPayload = {},
    priority: EventPriority = EventPriority.GAMEPLAY,
  ): void {
    this.queue.push({ type, payload, priority, seq: this.seqCounter++ });
  }

  /** Dispatch immediately, bypassing the queue (use sparingly — day-end pipeline only). */
  publishImmediate(type: GameEventType, payload: EventPayload = {}): void {
    this.dispatch(type, payload);
  }

  /** Drain queued events: SYSTEM > GAMEPLAY > UI, FIFO within a band. */
  pump(): void {
    if (this.pumping) return; // re-entrancy guard: nested pumps are ignored
    this.pumping = true;
    try {
      // Events published during dispatch land in the queue for the NEXT pump.
      const batch = this.queue;
      this.queue = [];
      batch.sort((a, b) => a.priority - b.priority || a.seq - b.seq);
      for (const ev of batch) this.dispatch(ev.type, ev.payload);
    } finally {
      this.pumping = false;
    }
  }

  private dispatch(type: GameEventType, payload: EventPayload): void {
    const set = this.handlers.get(type);
    if (!set) return;
    for (const handler of [...set]) {
      try {
        handler(payload);
      } catch (err) {
        // A broken handler must not kill the loop; report and continue.
        // eslint-disable-next-line no-console
        console.error(`EventBus: handler error on ${type}:`, err);
      }
    }
  }

  clear(): void {
    this.queue = [];
    this.handlers.clear();
  }
}
