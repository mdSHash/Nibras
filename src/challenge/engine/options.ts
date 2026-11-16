/**
 * Building blocks for the options of a round: picking distractors by
 * preference, shifting Hijri years, rounding numbers. Every function is
 * deterministic for a given generator state.
 */
import { yearDiff } from '../../../shared/gameText';
import { LEVEL_CONFIG, OPTION_COUNT, type Level } from './levels';
import { shuffle, type Rng } from './seed';

/**
 * `n` items from `candidates` (the answer left out), preferring those that
 * score higher on `prefer`; ties are broken by the generator.
 */
export function preferred<T extends { id: string }>(candidates: readonly T[], answerId: string, n: number, rng: Rng, prefer: (item: T) => number): T[] {
  const others = shuffle(candidates.filter((c) => c.id !== answerId), rng);
  return others
    .map((item, order) => ({ item, order, score: prefer(item) }))
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .slice(0, n)
    .map((x) => x.item);
}

/** Shifts a Hijri year by `offset` years, skipping the missing year 0. */
export function shiftYear(year: number, offset: number): number {
  const index = (year < 0 ? year + 1 : year) + offset;
  return index <= 0 ? index - 1 : index;
}

/** Five years, sorted chronologically. A disputed answer never gets a distractor within ±1 of it. */
export function yearOptions(answer: { year: number; disputed: boolean }, level: Level, rng: Rng): number[] {
  const offsets = LEVEL_CONFIG[level].yearOffsets.flatMap((o) => [o, -o]);
  const years = [...new Set(offsets.map((o) => shiftYear(answer.year, o)))].filter(
    (y) => y !== answer.year && !(answer.disputed && Math.abs(yearDiff(y, answer.year)) <= 1),
  );
  return [answer.year, ...shuffle(years, rng).slice(0, OPTION_COUNT - 1)].sort((a, b) => a - b);
}

/** Rounds to a "nice" number: whole under 30, else 2 significant digits. */
export function niceNumber(n: number): number {
  if (n < 30) return Math.max(1, Math.round(n));
  const magnitude = 10 ** (Math.floor(Math.log10(n)) - 1);
  return Math.round(n / magnitude) * magnitude;
}

/** Five sizes, sorted ascending; every option more than 7% away from every other. */
export function numberOptions(answer: number, level: Level, rng: Rng): number[] {
  const far = (a: number, b: number): boolean => Math.abs(a - b) / Math.max(a, b) > 0.07;
  const factors = shuffle(LEVEL_CONFIG[level].numberFactors, rng);
  // Wider fallbacks in case rounding collapses some of the level's factors.
  const extra = [0.3, 3, 0.2, 5, 8, 0.1, 10, 12];
  const out: number[] = [];
  for (const f of [...factors, ...extra]) {
    const n = niceNumber(answer * f);
    if (n !== answer && far(n, answer) && out.every((o) => far(n, o))) out.push(n);
    if (out.length === OPTION_COUNT - 1) break;
  }
  return [answer, ...out].sort((a, b) => a - b);
}
