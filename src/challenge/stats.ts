/**
 * Real numbers after a round (Phase 5F): the game adds its result to the Supabase table
 * challenge_results and reads today's totals from challenge_stats(). Deploy build only
 * (VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY, .env.example); without them, or when
 * Supabase is down, the game plays on and the result card shows no numbers.
 */
import type { Level, Mode } from './engine/levels';

const URL_ = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
export const statsEnabled = Boolean(URL_ && KEY);

export interface Stats {
  players: number;
  solvers: number;
  rank: number;
  slower: number;
  avgAttempts: number | null;
}

/** A random id for this browser, made on first play. Not tied to anyone. */
export function deviceId(): string {
  const key = 'nibras.challenge.device';
  try {
    const known = localStorage.getItem(key);
    if (known) return known;
    const id = crypto.randomUUID();
    localStorage.setItem(key, id);
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

const headers = (): Record<string, string> => ({ apikey: KEY!, 'Content-Type': 'application/json' });

/** Adds a finished daily round, then reads today's totals for it. Null when unavailable. */
export async function reportAndFetch(r: { date: string; level: Level; mode: Mode; questionId: string; won: boolean; attempts: number; seconds: number }): Promise<Stats | null> {
  if (!statsEnabled) return null;
  const device = deviceId();
  try {
    // 409 (already added from this browser today) is fine: the row is there.
    await fetch(`${URL_}/rest/v1/challenge_results`, {
      method: 'POST',
      headers: { ...headers(), Prefer: 'return=minimal' },
      body: JSON.stringify({ puzzle_date: r.date, level: r.level, mode: r.mode, question_id: r.questionId.slice(0, 80), device_id: device, won: r.won, attempts: Math.min(5, Math.max(1, r.attempts)), seconds: Math.min(3600, Math.max(2, r.seconds)) }),
    });
    const res = await fetch(`${URL_}/rest/v1/rpc/challenge_stats`, { method: 'POST', headers: headers(), body: JSON.stringify({ p_date: r.date, p_level: r.level, p_mode: r.mode, p_device: device }) });
    if (!res.ok) return null;
    return (await res.json()) as Stats;
  } catch {
    return null;
  }
}

/** The share of today's other solvers this player beat, or null below 20 solvers (too few to mean much). */
export function fasterThan(s: Stats): number | null {
  const others = s.solvers - 1;
  if (s.solvers < 20 || others <= 0) return null;
  return Math.round((s.slower / others) * 100);
}
