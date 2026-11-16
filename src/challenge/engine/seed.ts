/**
 * The daily seed (docs/phase5/challenge-spec.md, section 8): everyone gets the
 * same puzzle and the same options on the same Cairo day, per mode and level.
 */
import type { Level, Mode } from './levels';

/** Today's date in Cairo as `YYYY-MM-DD`. */
export function cairoDate(now: Date = new Date()): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Cairo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}

/** Whole days from `from` to `to` (both `YYYY-MM-DD`). */
export function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000);
}

/** The puzzle number: 1 on launch day. */
export function puzzleNumber(date: string, launch: string): number {
  return daysBetween(launch, date) + 1;
}

/** The previous day, `YYYY-MM-DD`. */
export function previousDay(date: string): string {
  return new Date(Date.parse(`${date}T00:00:00Z`) - 86_400_000).toISOString().slice(0, 10);
}

/** FNV-1a, 32 bits. */
export function hash(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** A small seeded generator (mulberry32) returning numbers in [0, 1). */
export type Rng = () => number;
export function rngFrom(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
}

const MODE_SALT: Record<Mode, string> = { who: 'who-7f3', battle: 'battle-2c1', place: 'place-9d4', time: 'time-5e8', number: 'number-1b6', full: 'full-8a2' };
const LEVEL_SALT: Record<Level, string> = { easy: 'e-41', mid: 'm-67', hard: 'h-93' };

/** The generator for one mode and level on one day. */
export function dailyRng(date: string, mode: Mode, level: Level): Rng {
  return rngFrom(hash(`${date}|${MODE_SALT[mode]}|${LEVEL_SALT[level]}`));
}

/** A generator for a practice round (random, never the daily puzzle). */
export function practiceRng(): Rng {
  return rngFrom((Math.random() * 4_294_967_296) >>> 0);
}

/** A seeded shuffle (Fisher–Yates) that leaves `items` untouched. */
export function shuffle<T>(items: readonly T[], rng: Rng): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** One item, chosen by the generator. */
export function pickOne<T>(items: readonly T[], rng: Rng): T {
  return items[Math.floor(rng() * items.length)];
}
