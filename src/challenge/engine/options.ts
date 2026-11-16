/**
 * The day's answer and its 4 options per mode (docs/phase5/challenge-spec.md,
 * sections 3.3 and 5.2). Distractors are real Nibras items, unique, never the
 * answer. Every generator is deterministic for a given generator state.
 */
import type { GameCity, GameEvent, GamePerson, Tier } from '../../../shared/gameData';
import { yearDiff } from '../../../shared/gameText';
import { distanceKm } from './geo';
import { LEVEL_CONFIG, type Level } from './levels';
import { shuffle, type Rng } from './seed';

interface Tiered {
  id: string;
  tier: Tier;
}

/** The items a level draws its answer from: its tiers, topped up from the nearest tiers to at least 4. */
export function levelPool<T extends Tiered>(pool: readonly T[], level: Level): T[] {
  const cfg = LEVEL_CONFIG[level];
  const out = pool.filter((i) => cfg.tiers.includes(i.tier));
  for (const tier of cfg.borrow) {
    if (out.length >= 4) break;
    out.push(...pool.filter((i) => i.tier === tier));
  }
  return out;
}

export function pickAnswer<T extends Tiered>(pool: readonly T[], level: Level, rng: Rng): T {
  const candidates = levelPool(pool, level);
  if (candidates.length === 0) throw new Error('empty pool');
  return candidates[Math.floor(rng() * candidates.length)];
}

/**
 * `n` items from `candidates` (the answer removed), preferring those that score
 * higher on `prefer`; ties are broken by the generator.
 */
export function preferred<T extends { id: string }>(candidates: readonly T[], answer: T, n: number, rng: Rng, prefer: (item: T) => number): T[] {
  const others = shuffle(candidates.filter((c) => c.id !== answer.id), rng);
  return others
    .map((item, order) => ({ item, order, score: prefer(item) }))
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .slice(0, n)
    .map((x) => x.item);
}

/** Four options with the answer, in a seeded order. */
function withAnswer<T>(answer: T, distractors: T[], rng: Rng): T[] {
  return shuffle([answer, ...distractors], rng);
}

export function whoOptions(people: readonly GamePerson[], answer: GamePerson, rng: Rng): GamePerson[] {
  return withAnswer(answer, preferred(people, answer, 3, rng, (p) => (p.tier === answer.tier ? 1 : 0)), rng);
}

export function battleOptions(events: readonly GameEvent[], answer: GameEvent, rng: Rng): GameEvent[] {
  const battles = events.filter((e) => e.battle);
  return withAnswer(answer, preferred(battles, answer, 3, rng, (e) => (e.tier === answer.tier ? 1 : 0)), rng);
}

export function placeOptions(cities: readonly GameCity[], answer: GameCity, rng: Rng): GameCity[] {
  return withAnswer(answer, preferred(cities, answer, 3, rng, () => 0), rng);
}

/** Shifts a Hijri year by `offset` years, skipping the missing year 0. */
export function shiftYear(year: number, offset: number): number {
  const index = (year < 0 ? year + 1 : year) + offset;
  return index <= 0 ? index - 1 : index;
}

/** Four years, sorted chronologically. A disputed answer never gets a distractor within ±1 of it. */
export function timeOptions(answer: { year: number; disputed: boolean }, level: Level, rng: Rng): number[] {
  const offsets = LEVEL_CONFIG[level].yearOffsets.flatMap((o) => [o, -o]);
  const years = [...new Set(offsets.map((o) => shiftYear(answer.year, o)))].filter(
    (y) => y !== answer.year && !(answer.disputed && Math.abs(yearDiff(y, answer.year)) <= 1),
  );
  return [answer.year, ...shuffle(years, rng).slice(0, 3)].sort((a, b) => a - b);
}

/** Rounds to a "nice" number: whole under 30, else 2 significant digits. */
export function niceNumber(n: number): number {
  if (n < 30) return Math.max(1, Math.round(n));
  const magnitude = 10 ** (Math.floor(Math.log10(n)) - 1);
  return Math.round(n / magnitude) * magnitude;
}

/** Four sizes, sorted ascending; each distractor is more than 7% away from the answer and from the others. */
export function numberOptions(answer: number, level: Level, rng: Rng): number[] {
  const far = (a: number, b: number): boolean => Math.abs(a - b) / Math.max(a, b) > 0.07;
  const factors = shuffle(LEVEL_CONFIG[level].numberFactors, rng);
  // Wider fallbacks in case rounding collapses some of the level's factors.
  const extra = [0.3, 3, 0.2, 5, 8, 0.1];
  const out: number[] = [];
  for (const f of [...factors, ...extra]) {
    const n = niceNumber(answer * f);
    if (n !== answer && far(n, answer) && out.every((o) => far(n, o))) out.push(n);
    if (out.length === 3) break;
  }
  return [answer, ...out].sort((a, b) => a - b);
}

/** «الحدث الكامل», name stage: other events, preferring the same tier, then the same kind or era. */
export function fullNameOptions(events: readonly GameEvent[], answer: GameEvent, rng: Rng): GameEvent[] {
  const score = (e: GameEvent): number => (e.tier === answer.tier ? 2 : 0) + (e.kind === answer.kind || e.era === answer.era ? 1 : 0);
  return withAnswer(answer, preferred(events, answer, 3, rng, score), rng);
}

/**
 * «الحدث الكامل», place stage: locations of other events with distinct names,
 * preferring the answer's tier, all four at least the level's spacing apart.
 * Falls back to the farthest candidates when spacing cannot be met.
 */
export function fullPlaceOptions(events: readonly GameEvent[], answer: GameEvent, level: Level, rng: Rng): GameEvent[] {
  const spacing = LEVEL_CONFIG[level].placeSpacingKm;
  const seen = new Set([answer.place]);
  const unique = shuffle(events, rng).filter((e) => e.id !== answer.id && !seen.has(e.place) && seen.add(e.place));
  const ordered = [...unique.filter((e) => e.tier === answer.tier), ...unique.filter((e) => e.tier !== answer.tier)];
  const chosen: GameEvent[] = [answer];
  for (const e of ordered) {
    if (chosen.every((c) => distanceKm(c, e) >= spacing)) chosen.push(e);
    if (chosen.length === 4) break;
  }
  for (const e of ordered) {
    if (chosen.length === 4) break;
    if (!chosen.includes(e)) chosen.push(e);
  }
  return shuffle(chosen, rng);
}
