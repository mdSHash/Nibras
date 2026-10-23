/**
 * Per-IP limit on chat questions (Mostafa, 2026-10-17): 20 per 10 minutes and
 * 100 per day. Counted in the shared store (store.ts) in fixed windows: one
 * key per IP per 10-minute window and one per UTC day, each expiring with its
 * window. The IP is kept only as a short SHA-256 hash.
 *
 * Fails open: without a configured or reachable store every question goes
 * through, so an Upstash outage never takes the chat down.
 */
import crypto from 'crypto';
import type { VercelRequest } from '@vercel/node';
import { storePipeline } from './store.js';

export const SHORT_WINDOW_SECONDS = 10 * 60;
export const SHORT_WINDOW_LIMIT = 20;
export const DAY_SECONDS = 24 * 60 * 60;
export const DAY_LIMIT = 100;

export type RateLimitResult =
  | { status: 'allowed' }
  | { status: 'blocked'; retryAfterSeconds: number; window: 'short' | 'day' }
  /** The store is missing or failed; the question was let through. */
  | { status: 'unavailable' };

function firstHeader(value: string | string[] | undefined): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.split(',')[0]?.trim() || undefined;
}

/** The caller's IP: Vercel sets x-real-ip; x-forwarded-for's first entry otherwise. */
export function clientIp(req: Pick<VercelRequest, 'headers' | 'socket'>): string {
  return firstHeader(req.headers['x-real-ip']) ?? firstHeader(req.headers['x-forwarded-for']) ?? req.socket?.remoteAddress ?? 'unknown';
}

export function ipKey(ip: string): string {
  return crypto.createHash('sha256').update(ip).digest('hex').slice(0, 16);
}

/** Counts one question for this IP and says whether it may be answered. */
export async function checkRateLimit(ip: string, now = Date.now()): Promise<RateLimitResult> {
  const seconds = Math.floor(now / 1000);
  const shortWindow = Math.floor(seconds / SHORT_WINDOW_SECONDS);
  const day = Math.floor(seconds / DAY_SECONDS);
  const id = ipKey(ip);
  const shortKey = `rl:${id}:m:${shortWindow}`;
  const dayKey = `rl:${id}:d:${day}`;
  const results = await storePipeline([
    ['INCR', shortKey],
    ['EXPIRE', shortKey, SHORT_WINDOW_SECONDS],
    ['INCR', dayKey],
    ['EXPIRE', dayKey, DAY_SECONDS],
  ]);
  const shortCount = Number(results?.[0]);
  const dayCount = Number(results?.[2]);
  if (!results || !Number.isFinite(shortCount) || !Number.isFinite(dayCount)) return { status: 'unavailable' };

  if (dayCount > DAY_LIMIT) return { status: 'blocked', window: 'day', retryAfterSeconds: (day + 1) * DAY_SECONDS - seconds };
  if (shortCount > SHORT_WINDOW_LIMIT) {
    return { status: 'blocked', window: 'short', retryAfterSeconds: (shortWindow + 1) * SHORT_WINDOW_SECONDS - seconds };
  }
  return { status: 'allowed' };
}
