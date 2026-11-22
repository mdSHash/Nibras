// «تحدي اليوم» accounts (Phase 6): a stand-in Supabase (Auth, the board) and /api/challenge for
// Playwright. Routed over the default stubs (stubs.ts); records what the game sent.
import type { Page, Route } from '@playwright/test';
import { expect } from '@playwright/test';
import { CHALLENGE_API_URL, SUPABASE_URL } from './stubs';

const CORS = { 'access-control-allow-origin': '*', 'access-control-allow-headers': 'apikey, authorization, content-type, prefer', 'access-control-allow-methods': 'GET, POST, PATCH, DELETE, OPTIONS' };
export const cairoToday = (): string => new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Cairo' }).format(new Date());
export const daysAgo = (n: number): string => new Date(Date.parse(`${cairoToday()}T00:00:00Z`) - n * 86_400_000).toISOString().slice(0, 10);
export const won = (date: string, mode = 'who') => ({ puzzle_date: date, level: 'easy', mode, question_id: 'q', won: true, attempts: 1, seconds: 20, checked: true });

export interface Mock { api: Record<string, unknown>[]; tokenBodies: unknown[]; board: Record<string, unknown>[]; name: string | null; history: Record<string, unknown>[] }

/** A Supabase and challenge API that sign a player in and keep their name; `history` is the account's earlier days. */
export async function mockAccounts(page: Page, history: Record<string, unknown>[] = []): Promise<Mock> {
  const m: Mock = { api: [], tokenBodies: [], board: [], name: null, history };
  await page.route(`${SUPABASE_URL}/**`, async (route: Route) => {
    const req = route.request();
    const url = new URL(req.url());
    if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS });
    if (url.pathname === '/__supabase/auth/v1/authorize') {
      expect(url.searchParams.get('provider')).toBe('google');
      expect(url.searchParams.get('code_challenge_method')).toBe('s256');
      // "Google" sends the player straight back (a page, not a 302: WebKit can't fulfill redirects).
      const back = `${url.searchParams.get('redirect_to')}?code=test-code`;
      return route.fulfill({ status: 200, contentType: 'text/html', body: `<!doctype html><script>location.replace(${JSON.stringify(back)})</script>` });
    }
    if (url.pathname === '/__supabase/auth/v1/token') {
      m.tokenBodies.push(req.postDataJSON());
      return route.fulfill({ status: 200, headers: CORS, json: { access_token: 'tok-1', refresh_token: 'ref-1', expires_in: 3600, user: { id: 'u1', email: 'player@example.com' } } });
    }
    if (url.pathname === '/__supabase/auth/v1/logout') return route.fulfill({ status: 204, headers: CORS });
    if (url.pathname === '/__supabase/rest/v1/rpc/challenge_board') {
      m.board.push({ ...(req.postDataJSON() as object), auth: req.headers().authorization ?? null });
      const rows = Array.from({ length: 10 }, (_, i) => ({ rank: i + 1, name: `لاعب ${i + 1}`, points: 30 - i, seconds: 100 + i, rounds: 8, me: false }));
      return route.fulfill({ status: 200, headers: CORS, json: { total: 25, rows, me: m.name ? { rank: 14, name: m.name, points: 12, seconds: 300, rounds: 5, me: true } : null } });
    }
    if (url.pathname === '/__supabase/rest/v1/challenge_results') return route.fulfill({ status: 201, headers: CORS, body: '' });
    return route.fulfill({ status: 200, headers: CORS, contentType: 'application/json', body: 'null' });
  });
  await page.route(CHALLENGE_API_URL, async (route: Route) => {
    const req = route.request();
    if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS });
    const body = req.postDataJSON() as Record<string, unknown>;
    m.api.push({ ...body, auth: req.headers().authorization });
    const summary = () => ({ player: { name: m.name }, results: m.history });
    if (body.action === 'join') {
      // No player yet and no name: the server's 400 opens the name sheet.
      if (!m.name && typeof body.name !== 'string') return route.fulfill({ status: 400, headers: CORS, json: { error: 'name', messageAr: 'الاسم لازم يكون حرفين على الأقل.' } });
      if (!m.name) m.name = String(body.name);
      return route.fulfill({ status: 200, headers: CORS, json: summary() });
    }
    if (body.action === 'name') {
      m.name = String(body.name);
      return route.fulfill({ status: 200, headers: CORS, json: { player: { name: m.name } } });
    }
    if (body.action === 'delete') {
      m.name = null;
      return route.fulfill({ status: 200, headers: CORS, json: { ok: true } });
    }
    return route.fulfill({ status: 200, headers: CORS, json: { saved: true, points: 3 } });
  });
  return m;
}

/** A saved session, as after a sign-in: call before loading the page. */
export async function signedIn(page: Page): Promise<void> {
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('__signed_in')) {
      sessionStorage.setItem('__signed_in', '1');
      localStorage.setItem('nibras.challenge.session', JSON.stringify({ access_token: 'tok-1', refresh_token: 'r', expires_at: Math.floor(Date.now() / 1000) + 3600, user: { id: 'u1' } }));
    }
  });
}
