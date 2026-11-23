/** The game's account calls: /api/challenge (writes, checked there) and challenge_board() (reads). */
import type { AccountResult } from '../engine/account';
import type { Level, Mode } from '../engine/levels';
import { CHALLENGE_API_URL, SUPABASE_KEY, SUPABASE_URL } from './config';

export type Period = 'day' | 'week' | 'streak';
export interface BoardRow { rank: number; name: string; me: boolean; points?: number; seconds?: number; rounds?: number; best?: number; current?: number }
export interface Board { total: number; rows: BoardRow[]; me: BoardRow | null }
export interface Summary { player: { name: string }; results: AccountResult[] }

/** A refused call: `code` from the server (e.g. 'name_taken'), `messageAr` to show. */
export class AccountError extends Error {
  constructor(public code: string, public messageAr: string, public status: number) {
    super(code);
  }
}
const OFFLINE = 'مش قادرين نوصل للسيرفر. اتأكد من النت وجرب تاني.';

async function post<T>(token: string, body: Record<string, unknown>): Promise<T> {
  let res: Response;
  try {
    res = await fetch(CHALLENGE_API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body) });
  } catch {
    throw new AccountError('offline', OFFLINE, 0);
  }
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) throw new AccountError(String(json.error ?? 'error'), String(json.messageAr ?? OFFLINE), res.status);
  return json as T;
}

export const join = (token: string, body: { deviceId?: string; plays?: unknown[]; name?: string }): Promise<Summary> => post(token, { action: 'join', ...body });
export const sendResult = (token: string, r: { date: string; level: Level; mode: Mode; picks: string[]; seconds: number }): Promise<{ saved: boolean }> => post(token, { action: 'result', ...r });
export const rename = (token: string, name: string): Promise<{ player: { name: string } }> => post(token, { action: 'name', name });
export const deleteAccount = (token: string, deviceId: string): Promise<{ ok: true }> => post(token, { action: 'delete', deviceId });

/** A level's board; with a token the player's own row comes too. */
export async function fetchBoard(level: Level, period: Period, token?: string): Promise<Board> {
  let res: Response;
  try {
    res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/challenge_board`, {
      method: 'POST',
      headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ p_level: level, p_period: period }),
    });
  } catch {
    throw new AccountError('offline', OFFLINE, 0);
  }
  if (!res.ok) throw new AccountError('board', 'مش قادرين نجيب اللوحة دلوقتي.', res.status);
  return (await res.json()) as Board;
}
