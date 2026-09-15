import type { VercelRequest, VercelResponse } from '@vercel/node';
import { corsHeaders } from './_lib/cors.js';
import { getKb } from './_lib/kb.js';
import { METHOD_NOT_ALLOWED_MESSAGE } from './_lib/messages.js';
import { storePushCapped } from './_lib/store.js';

/**
 * Receives 👍/👎 ratings (and an optional note) for chat answers. Always
 * written to the function log as one JSON line; also saved to the shared
 * store under "nibras:chat:feedback" (latest 5,000) when it is configured.
 */

const FEEDBACK_KEY = 'nibras:chat:feedback';
const MAX_ENTRIES = 5000;

const text = (value: unknown, max: number): string | undefined =>
  typeof value === 'string' && value.trim() ? value.trim().slice(0, max) : undefined;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = (req.headers.origin as string | undefined) || null;
  for (const [key, value] of Object.entries(corsHeaders(origin))) res.setHeader(key, value);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed', messageAr: METHOD_NOT_ALLOWED_MESSAGE });
    return;
  }

  const body = (req.body ?? {}) as Record<string, unknown>;
  const rating = body.rating === 'up' || body.rating === 'down' ? body.rating : null;
  const question = text(body.question, 400);
  if (!rating || !question) {
    res.status(400).json({ error: 'bad_request', messageAr: 'بيانات التقييم غير مكتملة.' });
    return;
  }

  const entry = {
    at: new Date().toISOString(),
    rating,
    question,
    answer: text(body.answer, 3000),
    mode: text(body.mode, 20),
    citations: Array.isArray(body.citations) ? body.citations.filter((c): c is string => typeof c === 'string').slice(0, 12) : [],
    note: text(body.note, 500),
    kb: getKb().kb.contentHash.slice(0, 12),
  };

  console.info(`[chat-feedback] ${JSON.stringify(entry)}`);
  const stored = await storePushCapped(FEEDBACK_KEY, JSON.stringify(entry), MAX_ENTRIES);
  res.status(200).json({ ok: true, stored: stored ? 'shared' : 'log' });
}
