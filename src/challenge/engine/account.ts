/**
 * Accounts (Phase 6): the rules the game and the server share. Re-playing a round's picks
 * against the day's puzzle, display names, streaks from won days, board points, and folding the
 * account's results into the local state after sign-in. UI-free and network-free; the Vercel
 * function api/challenge.ts imports it, so relative imports carry `.js`.
 */
import { stripDiacritics } from '../../../shared/arabic.js';
import type { Round } from './daily.js';
import { LEVELS, MODES, TRIES, type Level, type Mode } from './levels.js';
import { emptyState, type DailyState, type GameResult, type Streak } from './progress.js';
import { previousDay } from './seed.js';

/** A round as the game saves it while it is played (localStorage `nibras.challenge.play.v1`). */
export interface Play { picks: string[]; startedAt: number; endedAt?: number }
export interface Plays { date: string; plays: Record<string, Play> }

/** Whether the picks so far end the round, and whether it was won. */
export function isDone(round: Pick<Round, 'answerId'>, picks: readonly string[]): { done: boolean; won: boolean } {
  const won = picks.includes(round.answerId);
  return { won, done: won || picks.filter((p) => p !== round.answerId).length >= TRIES };
}

/**
 * Re-plays `picks` against the round, as the game would have taken them. Null when they could
 * not have come from playing it: an unknown option, a repeated pick, a pick after the round ended,
 * or a round that never ended. «رتّب» picks are orders: the round's four ids, comma-joined.
 */
export function checkPlay(round: Pick<Round, 'mode' | 'answerId' | 'options'>, picks: unknown): { won: boolean; attempts: number } | null {
  if (!Array.isArray(picks) || picks.length === 0 || picks.length > TRIES) return null;
  const ids = round.options.map((o) => o.id);
  const valid = (p: unknown): p is string => {
    if (typeof p !== 'string') return false;
    if (round.mode !== 'order') return ids.includes(p);
    const order = p.split(',');
    return order.length === ids.length && new Set(order).size === ids.length && order.every((id) => ids.includes(id));
  };
  if (!picks.every(valid) || new Set(picks).size !== picks.length) return null;
  for (let i = 1; i < picks.length; i++) if (isDone(round, picks.slice(0, i)).done) return null;
  const end = isDone(round, picks);
  return end.done ? { won: end.won, attempts: picks.length } : null;
}

/** Board points for a round: a win on the first try 3, the second 2, the third 1; a loss 0. */
export const pointsFor = (won: boolean, attempts: number): number => (won ? Math.max(0, 4 - attempts) : 0);

/** A round's seconds as the database takes them (2 to 3600). */
export const boundSeconds = (s: number): number => Math.min(3600, Math.max(2, Math.round(Number.isFinite(s) ? s : 2)));

// Words a public name may not contain (folded like names). Kept short on purpose: the list blocks
// the obvious, the 20-letter limit and one name per player do the rest; report abuse by email.
const BLOCKED = ['نبراس', 'ادمن', 'مشرف', 'admin', 'nibras', 'http', 'www', 'كس', 'زب', 'شرموط', 'خول', 'متناك', 'عرص', 'fuck', 'shit', 'sex', 'porn'];

/** A name folded for comparison: no diacritics or tatweel, alef and yeh forms unified, one space, lower case. */
export function foldName(name: string): string {
  return stripDiacritics(name.normalize('NFKC'))
    .replace(/ـ/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/** The name as it will be shown: trimmed, one space between words. */
export const tidyName = (name: string): string => name.normalize('NFKC').replace(/\s+/g, ' ').trim();

/** Null when `name` can be a display name, else what to fix, in Arabic. */
export function checkDisplayName(name: string): string | null {
  const shown = tidyName(name);
  const len = [...shown].length;
  if (len < 2) return 'الاسم لازم يكون حرفين على الأقل.';
  if (len > 20) return 'الاسم لازم يكون ٢٠ حرف أو أقل.';
  // Arabic and Latin letters, Arabic marks, digits (both kinds), spaces and _ . -
  if (!/^[\p{Script=Arabic}ً-ٰٟA-Za-z0-9٠-٩ _.-]+$/u.test(shown)) return 'استخدم حروف عربي أو إنجليزي وأرقام بس.';
  if (!/[\p{Script=Arabic}A-Za-z]/u.test(stripDiacritics(shown).replace(/[٠-٩]/g, ''))) return 'الاسم لازم يكون فيه حروف، مش أرقام بس.';
  const folded = foldName(shown).replace(/[ _.-]/g, '');
  if (BLOCKED.some((w) => folded.includes(foldName(w)))) return 'اختار اسم تاني من فضلك.';
  return null;
}

/** A level's streak from the days it was won (any order, repeats fine), as of `today`. */
export function streakFromDays(days: readonly string[], today: string): Streak {
  const sorted = [...new Set(days)].filter((d) => d <= today).sort();
  let best = 0;
  let run = 0;
  let prev: string | null = null;
  for (const d of sorted) {
    run = prev !== null && previousDay(d) === prev ? run + 1 : 1;
    best = Math.max(best, run);
    prev = d;
  }
  const lastWin = prev;
  const live = lastWin !== null && (lastWin === today || lastWin === previousDay(today));
  return { current: live ? run : 0, best, lastWin };
}

/** One of the account's rounds, as the account page and the merge read it. */
export interface AccountResult {
  puzzle_date: string;
  level: Level;
  mode: Mode;
  question_id: string;
  won: boolean;
  attempts: number;
  seconds: number;
  checked: boolean;
}

/**
 * The local state once signed in: the account's streaks (computed from its won days and
 * today's local wins, so a round just played counts before the server answers), and today's
 * results from both, the local one kept where both have it. The level choice stays local.
 */
export function mergeIntoLocal(local: DailyState, account: readonly AccountResult[], today: string): DailyState {
  const base = local.date === today ? local : { ...emptyState(today), level: local.level };
  const results: Record<string, GameResult> = {};
  for (const r of account) {
    if (r.puzzle_date !== today || !LEVELS.includes(r.level) || !MODES.includes(r.mode)) continue;
    results[`${r.level}:${r.mode}`] = { date: today, puzzle: 0, mode: r.mode, level: r.level, won: r.won, attempts: r.attempts, seconds: r.seconds };
  }
  Object.assign(results, base.results);
  const streaks = Object.fromEntries(
    LEVELS.map((level) => {
      const days = account.filter((r) => r.level === level && r.won).map((r) => r.puzzle_date);
      for (const r of Object.values(base.results)) if (r.level === level && r.won) days.push(r.date);
      return [level, streakFromDays(days, today)];
    }),
  ) as Record<Level, Streak>;
  return { ...base, results, streaks };
}

/** Today's (and yesterday's, for rounds that crossed midnight) finished daily rounds to send on sign-in. */
export function finishedPlays(plays: Plays | null, today: string): { date: string; level: Level; mode: Mode; picks: string[]; seconds: number }[] {
  if (!plays || (plays.date !== today && plays.date !== previousDay(today))) return [];
  const out: { date: string; level: Level; mode: Mode; picks: string[]; seconds: number }[] = [];
  for (const [key, play] of Object.entries(plays.plays)) {
    const [level, mode] = key.split(':') as [Level, Mode];
    if (!LEVELS.includes(level) || !MODES.includes(mode) || play.endedAt === undefined || !play.picks.length) continue;
    out.push({ date: plays.date, level, mode, picks: play.picks, seconds: boundSeconds((play.endedAt - play.startedAt) / 1000) });
  }
  return out;
}

/** Null when `email` looks like an address, else what to fix (Arabic). The real check is the confirmation email. */
export function checkEmail(email: string): string | null {
  const e = email.trim();
  if (!e) return 'اكتب إيميلك.';
  if (e.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)) return 'الإيميل ده شكله مش مظبوط.';
  return null;
}

/**
 * Null when `password` is strong enough, else what to fix (Arabic). The same rule is set in Supabase
 * (Authentication > Sign In / Providers > Email: 8 characters, letters and digits), which enforces it.
 */
export function checkPassword(password: string): string | null {
  if (password.length < 8) return 'الباسورد لازم يبقى ٨ حروف على الأقل.';
  if (new TextEncoder().encode(password).length > 72) return 'الباسورد طويل أوي، خليه أقصر.';
  // Supabase's "letters and digits" counts English letters and 0-9 only, so the same here.
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) return 'الباسورد لازم يبقى فيه حروف إنجليزي وأرقام.';
  return null;
}
