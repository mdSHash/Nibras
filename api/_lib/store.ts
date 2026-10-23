/**
 * Optional shared key-value store (Upstash Redis REST, as provisioned by
 * Vercel's KV / Upstash integration). Used for the answer cache and saved
 * feedback. When no credentials are configured every call is a no-op, so
 * the chat keeps working with per-instance memory only.
 */

const TIMEOUT_MS = 1500;

function credentials(): { url: string; token: string } | null {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ''), token } : null;
}

export function sharedStoreConfigured(): boolean {
  return credentials() !== null;
}

async function send(path: string, body: unknown): Promise<unknown> {
  const creds = credentials();
  if (!creds) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${creds.url}${path}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${creds.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) {
      console.warn(`[store] HTTP ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.warn('[store] request failed', (err as Error).name);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function storeGet(key: string): Promise<string | null> {
  const data = (await send('', ['GET', key])) as { result?: string | null } | null;
  return data?.result ?? null;
}

export async function storeSet(key: string, value: string, ttlSeconds: number): Promise<boolean> {
  const data = (await send('', ['SET', key, value, 'EX', ttlSeconds])) as { result?: string } | null;
  return data?.result === 'OK';
}

/**
 * Sends several commands in one request; returns each command's result, or
 * null when the store is not configured, unreachable or any command failed.
 */
export async function storePipeline(commands: (string | number)[][]): Promise<unknown[] | null> {
  const data = (await send('/pipeline', commands)) as Array<{ result?: unknown; error?: string }> | null;
  // A pipeline answers 200 with one {result} or {error} per command.
  if (!Array.isArray(data) || data.length !== commands.length || !data.every(reply => reply && !reply.error)) return null;
  return data.map(reply => reply.result);
}

/** Prepends to a list and trims it to `max` entries. */
export async function storePushCapped(key: string, value: string, max: number): Promise<boolean> {
  const results = await storePipeline([
    ['LPUSH', key, value],
    ['LTRIM', key, 0, max - 1],
  ]);
  return results !== null;
}
