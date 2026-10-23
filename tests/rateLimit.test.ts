import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { VercelRequest } from '@vercel/node';
import { checkRateLimit, clientIp, DAY_LIMIT, ipKey, SHORT_WINDOW_LIMIT } from '../api/_lib/rateLimit';

// A fake Upstash: keeps INCR counters in memory and records every pipeline it receives.
describe('per-IP rate limit', () => {
  let counters: Map<string, number>;
  let bodies: unknown[];
  let failWith: number | 'timeout' | null;

  beforeEach(() => {
    counters = new Map();
    bodies = [];
    failWith = null;
    vi.stubEnv('KV_REST_API_URL', 'https://example.upstash.io');
    vi.stubEnv('KV_REST_API_TOKEN', 'token-123');
    vi.stubGlobal('fetch', vi.fn(async (_url: string, init?: RequestInit) => {
      const commands = JSON.parse(String(init?.body)) as (string | number)[][];
      bodies.push(commands);
      if (failWith === 'timeout') throw new DOMException('aborted', 'AbortError');
      if (failWith !== null) return new Response('error', { status: failWith });
      const replies = commands.map(([cmd, key]) => {
        if (cmd === 'INCR') {
          const n = (counters.get(String(key)) ?? 0) + 1;
          counters.set(String(key), n);
          return { result: n };
        }
        return { result: 1 };
      });
      return new Response(JSON.stringify(replies), { status: 200 });
    }));
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  // 2026-10-23 12:00:00 UTC, the start of a 10-minute window.
  const NOON = Date.UTC(2026, 9, 23, 12, 0, 0);

  it('allows 20 questions in 10 minutes and blocks the 21st until the window ends', async () => {
    for (let i = 0; i < SHORT_WINDOW_LIMIT; i++) expect(await checkRateLimit('1.2.3.4', NOON + i * 1000)).toEqual({ status: 'allowed' });
    expect(await checkRateLimit('1.2.3.4', NOON + 4 * 60_000)).toEqual({ status: 'blocked', window: 'short', retryAfterSeconds: 6 * 60 });
    // Another visitor is counted separately.
    expect(await checkRateLimit('5.6.7.8', NOON + 4 * 60_000)).toEqual({ status: 'allowed' });
    // The next window starts a new count.
    expect(await checkRateLimit('1.2.3.4', NOON + 10 * 60_000)).toEqual({ status: 'allowed' });
  });

  it('blocks the 101st question of a UTC day until midnight', async () => {
    for (let i = 0; i < DAY_LIMIT; i++) {
      // Spread over six 10-minute windows (up to 20 each, as allowed).
      expect((await checkRateLimit('1.2.3.4', NOON + Math.floor(i / 20) * 600_000 + (i % 20) * 1000)).status).toBe('allowed');
    }
    const later = NOON + 6 * 600_000;
    expect(await checkRateLimit('1.2.3.4', later)).toEqual({ status: 'blocked', window: 'day', retryAfterSeconds: 11 * 3600 });
    expect((await checkRateLimit('1.2.3.4', Date.UTC(2026, 9, 24, 0, 0, 1))).status).toBe('allowed');
  });

  it('sends one pipeline of INCR and EXPIRE for both windows, keyed by a hash of the IP', async () => {
    await checkRateLimit('1.2.3.4', NOON);
    const id = ipKey('1.2.3.4');
    expect(id).toMatch(/^[0-9a-f]{16}$/);
    const shortKey = `rl:${id}:m:${Math.floor(NOON / 1000 / 600)}`;
    const dayKey = `rl:${id}:d:${Math.floor(NOON / 1000 / 86400)}`;
    expect(bodies).toEqual([
      [
        ['INCR', shortKey],
        ['EXPIRE', shortKey, 600],
        ['INCR', dayKey],
        ['EXPIRE', dayKey, 86400],
      ],
    ]);
    expect(JSON.stringify(bodies)).not.toContain('1.2.3.4');
  });

  it('lets questions through when the store is not configured, errors or times out', async () => {
    failWith = 500;
    expect(await checkRateLimit('1.2.3.4', NOON)).toEqual({ status: 'unavailable' });
    failWith = 'timeout';
    expect(await checkRateLimit('1.2.3.4', NOON)).toEqual({ status: 'unavailable' });
    vi.unstubAllEnvs();
    vi.stubEnv('KV_REST_API_URL', '');
    vi.stubEnv('KV_REST_API_TOKEN', '');
    bodies.length = 0;
    expect(await checkRateLimit('1.2.3.4', NOON)).toEqual({ status: 'unavailable' });
    expect(bodies).toEqual([]);
  });

  it('reads the IP from x-real-ip, then x-forwarded-for, then the socket', () => {
    const req = (headers: Record<string, string>, remoteAddress?: string) =>
      ({ headers, socket: { remoteAddress } }) as unknown as Pick<VercelRequest, 'headers' | 'socket'>;
    expect(clientIp(req({ 'x-real-ip': '9.9.9.9', 'x-forwarded-for': '1.1.1.1, 2.2.2.2' }))).toBe('9.9.9.9');
    expect(clientIp(req({ 'x-forwarded-for': '1.1.1.1, 2.2.2.2' }))).toBe('1.1.1.1');
    expect(clientIp(req({}, '3.3.3.3'))).toBe('3.3.3.3');
    expect(clientIp(req({}))).toBe('unknown');
  });
});
