import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { sharedStoreConfigured, storeGet, storePushCapped, storeSet } from '../api/_lib/store';

// Requests must follow the Upstash REST format: a JSON array command POSTed to
// the base URL, or an array of commands POSTed to /pipeline.
describe('shared store (Upstash REST)', () => {
  const calls: Array<{ url: string; auth: string; body: unknown }> = [];
  let reply: unknown;

  beforeEach(() => {
    calls.length = 0;
    vi.stubEnv('KV_REST_API_URL', 'https://example.upstash.io/');
    vi.stubEnv('KV_REST_API_TOKEN', 'token-123');
    vi.stubGlobal('fetch', vi.fn(async (url: string, init?: RequestInit) => {
      calls.push({ url, auth: String((init?.headers as Record<string, string>).Authorization), body: JSON.parse(String(init?.body)) });
      return new Response(JSON.stringify(reply), { status: 200 });
    }));
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('sends single commands as a JSON array with the bearer token', async () => {
    expect(sharedStoreConfigured()).toBe(true);
    reply = { result: 'OK' };
    expect(await storeSet('k', 'v', 60)).toBe(true);
    reply = { result: 'v' };
    expect(await storeGet('k')).toBe('v');
    expect(calls).toEqual([
      { url: 'https://example.upstash.io', auth: 'Bearer token-123', body: ['SET', 'k', 'v', 'EX', 60] },
      { url: 'https://example.upstash.io', auth: 'Bearer token-123', body: ['GET', 'k'] },
    ]);
  });

  it('pushes and trims a list in one pipeline and reports command errors', async () => {
    reply = [{ result: 1 }, { result: 'OK' }];
    expect(await storePushCapped('list', 'x', 5000)).toBe(true);
    expect(calls[0]).toMatchObject({ url: 'https://example.upstash.io/pipeline', body: [['LPUSH', 'list', 'x'], ['LTRIM', 'list', 0, 4999]] });

    reply = [{ error: 'WRONGTYPE' }, { result: 'OK' }];
    expect(await storePushCapped('list', 'x', 5000)).toBe(false);
  });

  it('does nothing without credentials', async () => {
    vi.stubEnv('KV_REST_API_URL', '');
    vi.stubEnv('KV_REST_API_TOKEN', '');
    expect(sharedStoreConfigured()).toBe(false);
    expect(await storeGet('k')).toBeNull();
    expect(calls).toHaveLength(0);
  });
});
