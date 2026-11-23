/**
 * The game's database over Supabase's REST and Auth APIs (no client library). SUPABASE_URL,
 * SUPABASE_PUBLISHABLE_KEY (to check a player's access token) and SUPABASE_SECRET_KEY (writes,
 * which bypass row-level security; Vercel only, never in the browser). See .env.example.
 */
import type { AccountResult } from '../../src/challenge/engine/account.js';
import type { Level, Mode } from '../../src/challenge/engine/levels.js';
import type { ChallengeDb, ResultRow } from './challengeAccount.js';

const TIMEOUT_MS = 5000;
const COLUMNS = 'puzzle_date,level,mode,question_id,won,attempts,seconds';

export interface SupabaseEnv { url: string; publishable: string; secret: string }

export function supabaseEnv(): SupabaseEnv | null {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '');
  const publishable = process.env.SUPABASE_PUBLISHABLE_KEY;
  const secret = process.env.SUPABASE_SECRET_KEY;
  return url && publishable && secret ? { url, publishable, secret } : null;
}

export class SupabaseChallengeDb implements ChallengeDb {
  constructor(private env: SupabaseEnv) {}

  private async call(path: string, init: { method?: string; body?: unknown; prefer?: string; key?: 'secret' | 'publishable'; token?: string } = {}): Promise<Response> {
    const key = init.key === 'publishable' ? this.env.publishable : this.env.secret;
    const headers: Record<string, string> = { apikey: key, 'Content-Type': 'application/json' };
    // A secret key may also go in Authorization only when it equals the apikey header.
    headers.Authorization = `Bearer ${init.token ?? key}`;
    if (init.prefer) headers.Prefer = init.prefer;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      return await fetch(`${this.env.url}${path}`, { method: init.method ?? 'GET', headers, body: init.body === undefined ? undefined : JSON.stringify(init.body), signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
  }

  private async json<T>(res: Response): Promise<T> {
    if (!res.ok) throw new Error(`supabase ${res.status}`);
    return (await res.json()) as T;
  }

  async userFor(token: string): Promise<{ id: string } | null> {
    const res = await this.call('/auth/v1/user', { key: 'publishable', token });
    if (res.status === 401 || res.status === 403) return null;
    const user = await this.json<{ id?: string }>(res);
    return typeof user.id === 'string' ? { id: user.id } : null;
  }

  async player(id: string): Promise<{ display_name: string } | null> {
    const rows = await this.json<{ display_name: string }[]>(await this.call(`/rest/v1/players?id=eq.${id}&select=display_name`));
    return rows[0] ?? null;
  }

  async addPlayer(id: string, name: string, key: string): Promise<'ok' | 'taken'> {
    const res = await this.call('/rest/v1/players', { method: 'POST', prefer: 'return=minimal', body: { id, display_name: name, name_key: key } });
    if (res.status === 409) return 'taken';
    if (!res.ok) throw new Error(`supabase ${res.status}`);
    return 'ok';
  }

  async rename(id: string, name: string, key: string): Promise<'ok' | 'taken'> {
    const res = await this.call(`/rest/v1/players?id=eq.${id}`, { method: 'PATCH', prefer: 'return=minimal', body: { display_name: name, name_key: key } });
    if (res.status === 409) return 'taken';
    if (!res.ok) throw new Error(`supabase ${res.status}`);
    return 'ok';
  }

  async guestRows(deviceId: string): Promise<Omit<AccountResult, 'checked'>[]> {
    return this.json(await this.call(`/rest/v1/challenge_results?device_id=eq.${deviceId}&select=${COLUMNS}`));
  }

  async result(id: string, date: string, level: Level, mode: Mode): Promise<{ checked: boolean } | null> {
    const rows = await this.json<{ checked: boolean }[]>(await this.call(`/rest/v1/player_results?user_id=eq.${id}&puzzle_date=eq.${date}&level=eq.${level}&mode=eq.${mode}&select=checked`));
    return rows[0] ?? null;
  }

  async saveResults(rows: ResultRow[], replace: boolean): Promise<void> {
    const res = await this.call('/rest/v1/player_results', { method: 'POST', prefer: `return=minimal,resolution=${replace ? 'merge' : 'ignore'}-duplicates`, body: rows });
    if (!res.ok) throw new Error(`supabase ${res.status}`);
  }

  async results(id: string, since: string): Promise<AccountResult[]> {
    return this.json(await this.call(`/rest/v1/player_results?user_id=eq.${id}&puzzle_date=gte.${since}&select=${COLUMNS},checked&order=puzzle_date.desc`));
  }

  async deleteUser(id: string): Promise<void> {
    const res = await this.call(`/auth/v1/admin/users/${id}`, { method: 'DELETE' });
    if (!res.ok && res.status !== 404) throw new Error(`supabase ${res.status}`);
  }

  async deleteGuestRows(deviceId: string): Promise<void> {
    const res = await this.call(`/rest/v1/challenge_results?device_id=eq.${deviceId}`, { method: 'DELETE', prefer: 'return=minimal' });
    if (!res.ok) throw new Error(`supabase ${res.status}`);
  }
}
