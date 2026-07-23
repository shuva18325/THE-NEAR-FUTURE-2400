// RNGManager — SYSTEM_SKELETON.md §1 (RNG conventions).
// Deterministic per-day seeded streams: seed = hash(campaignSeed, dayIndex, streamId, sub).
// Same campaign seed => identical campaign, replayable bug reports.

export enum RngStream {
  QUEUE_GEN = 1,
  COMMUTE_OUT = 2,
  COMMUTE_BACK = 3,
  AUDIT = 4,
  EVENTS = 5,
  SLEEP = 6,
  GIG = 7,
  CHECKPOINT = 8,
}

/** FNV-1a 32-bit over a sequence of integers. */
function hashInts(...ints: number[]): number {
  let h = 0x811c9dc5;
  for (const n of ints) {
    // fold each int as 4 bytes
    for (let shift = 0; shift < 32; shift += 8) {
      h ^= (n >>> shift) & 0xff;
      h = Math.imul(h, 0x01000193);
    }
  }
  return h >>> 0;
}

/** mulberry32 PRNG — small, fast, deterministic. */
export class Rng {
  private state: number;

  constructor(seed: number) {
    this.state = seed >>> 0;
    if (this.state === 0) this.state = 0x9e3779b9; // zero seed degenerates; remap
  }

  /** Uniform float in [0, 1). */
  next(): number {
    this.state = (this.state + 0x6d2b79f5) >>> 0;
    let t = this.state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /** Integer in [min, max] inclusive. */
  range(min: number, max: number): number {
    if (max < min) throw new Error(`Rng.range: max(${max}) < min(${min})`);
    return min + Math.floor(this.next() * (max - min + 1));
  }

  chance(p: number): boolean {
    return this.next() < p;
  }

  pick<T>(arr: readonly T[]): T {
    if (arr.length === 0) throw new Error('Rng.pick: empty array');
    return arr[Math.floor(this.next() * arr.length)];
  }

  /** n distinct indices from [0, len). */
  pickDistinctIndices(len: number, n: number): number[] {
    if (n > len) throw new Error(`Rng.pickDistinctIndices: n(${n}) > len(${len})`);
    const idx = Array.from({ length: len }, (_, i) => i);
    // partial Fisher-Yates
    for (let i = 0; i < n; i++) {
      const j = i + Math.floor(this.next() * (len - i));
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    return idx.slice(0, n);
  }

  /** Weighted pick: weights need not sum to 1. */
  weighted<T>(entries: readonly [T, number][]): T {
    const total = entries.reduce((s, [, w]) => s + w, 0);
    if (total <= 0) throw new Error('Rng.weighted: non-positive total weight');
    let roll = this.next() * total;
    for (const [item, w] of entries) {
      roll -= w;
      if (roll < 0) return item;
    }
    return entries[entries.length - 1][0];
  }
}

export class RNGManager {
  constructor(public readonly campaignSeed: number) {
    if (!Number.isInteger(campaignSeed)) {
      throw new Error('RNGManager: campaignSeed must be an integer');
    }
  }

  /** Fresh deterministic stream for (day, stream, sub). */
  stream(dayIndex: number, streamId: RngStream, sub = 0): Rng {
    return new Rng(hashInts(this.campaignSeed, dayIndex, streamId, sub));
  }
}
