/**
 * Scoring, the result headline, streaks and the saved state
 * (docs/phase5/challenge-spec.md, sections 5.3, 7 and 8). Saved in
 * localStorage, versioned, every access guarded: the game works without it.
 * Typed so Phase 6 can merge it into an account.
 */
import { MAX_WRONG, type Level, type Mode } from './levels';
import { previousDay } from './seed';

/** The result headline by attempt (spec, section 7). */
export function headline(won: boolean, attempts: number, allowed: number): string {
  if (!won) return 'المرة دي فلتت منك';
  if (attempts === 1) return 'عبقري!';
  if (attempts === 2) return 'ممتاز!';
  if (attempts === allowed) return 'في آخر لحظة!';
  return 'أحسنت!';
}

/** One finished round. */
export interface GameResult {
  date: string;
  puzzle: number;
  mode: Mode;
  level: Level;
  won: boolean;
  /** Picks used, the right one included. */
  attempts: number;
  seconds: number;
}

export interface Streak {
  current: number;
  best: number;
  /** The date of the last day counted. */
  lastWin: string | null;
}

export interface DailyState {
  version: 1;
  level: Level | null;
  /** Today's results, by `${level}:${mode}`, for `date` only. */
  date: string;
  results: Record<string, GameResult>;
  streaks: Record<Level, Streak>;
}

export const STORAGE_KEY = 'nibras.challenge.v1';
const emptyStreak = (): Streak => ({ current: 0, best: 0, lastWin: null });

export function emptyState(date: string): DailyState {
  return { version: 1, level: null, date, results: {}, streaks: { easy: emptyStreak(), mid: emptyStreak(), hard: emptyStreak() } };
}

/** Reads the saved state; a missing, broken or older one gives a fresh state. Today's results reset on a new day. */
export function loadState(storage: Pick<Storage, 'getItem'> | undefined, today: string): DailyState {
  let saved: DailyState | null = null;
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    if (parsed && typeof parsed === 'object' && (parsed as DailyState).version === 1) saved = parsed as DailyState;
  } catch {
    saved = null;
  }
  if (!saved) return emptyState(today);
  return saved.date === today ? saved : { ...saved, date: today, results: {} };
}

export function saveState(storage: Pick<Storage, 'setItem'> | undefined, state: DailyState): void {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Private windows and blocked storage: the round still plays, it just isn't remembered.
  }
}

/**
 * Records a finished round. The first win of the day counts for the level's
 * streak: +1 when the last counted day was yesterday, else it restarts at 1.
 * A practice round must not be recorded.
 */
export function recordResult(state: DailyState, result: GameResult): DailyState {
  const key = `${result.level}:${result.mode}`;
  if (state.results[key]) return state;
  const results = { ...state.results, [key]: result };
  const streak = state.streaks[result.level];
  let next = streak;
  if (result.won && streak.lastWin !== result.date) {
    const current = streak.lastWin === previousDay(result.date) ? streak.current + 1 : 1;
    next = { current, best: Math.max(streak.best, current), lastWin: result.date };
  }
  return { ...state, results, streaks: { ...state.streaks, [result.level]: next } };
}

/** The streak as shown today: 0 once a whole day has passed without a win. */
export function visibleStreak(streak: Streak, today: string): number {
  return streak.lastWin === today || streak.lastWin === previousDay(today) ? streak.current : 0;
}

/** Picks allowed in a round: four wrong ones, then the round is lost. */
export const PICKS_ALLOWED = MAX_WRONG + 1;
