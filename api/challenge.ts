import type { VercelRequest, VercelResponse } from '@vercel/node';
import gameJson from '../src/generated/game.json' with { type: 'json' };
import type { GameData } from '../shared/gameData.js';
import { ChallengeAccounts } from './_lib/challengeAccount.js';
import { SupabaseChallengeDb, supabaseEnv } from './_lib/challengeDb.js';
import { corsHeaders } from './_lib/cors.js';
import { METHOD_NOT_ALLOWED_MESSAGE } from './_lib/messages.js';
import { storePipeline } from './_lib/store.js';

/**
 * «تحدي اليوم» accounts (Phase 6): POST { action: 'join' | 'result' | 'name' | 'delete', … } with
 * the player's Supabase access token in Authorization. Every round is re-played against the day's
 * puzzle before it counts for the leaderboard (api/_lib/challengeAccount.ts). The board itself is
 * read straight from Supabase (challenge_board()), and guests never call this function.
 */

const WINDOW_SECONDS = 10 * 60;
const WINDOW_LIMIT = 80;

/** 80 calls per player per 10 minutes when the shared store is set up; no limit without it. */
async function overLimit(userKey: string): Promise<boolean> {
  const bucket = Math.floor(Date.now() / 1000 / WINDOW_SECONDS);
  const key = `nibras:challenge:rl:${userKey}:${bucket}`;
  const results = await storePipeline([['INCR', key], ['EXPIRE', key, WINDOW_SECONDS]]);
  return Number(results?.[0]) > WINDOW_LIMIT;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = (req.headers.origin as string | undefined) || null;
  for (const [key, value] of Object.entries(corsHeaders(origin, 'Content-Type, Authorization'))) res.setHeader(key, value);
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed', messageAr: METHOD_NOT_ALLOWED_MESSAGE });
    return;
  }
  const env = supabaseEnv();
  if (!env) {
    res.status(503).json({ error: 'not_configured', messageAr: 'الحسابات مش شغالة دلوقتي. تقدر تكمّل تلعب عادي.' });
    return;
  }

  const auth = typeof req.headers.authorization === 'string' ? req.headers.authorization : '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : null;
  // The limit is keyed on the token's subject before the token is checked; a forged one only limits itself.
  const subject = token?.split('.')[1] ?? 'none';
  if (await overLimit(subject.slice(0, 64))) {
    res.status(429).json({ error: 'rate_limited', messageAr: 'طلبات كتير ورا بعض. استنى شوية وجرب تاني.' });
    return;
  }

  try {
    const accounts = new ChallengeAccounts(new SupabaseChallengeDb(env), gameJson as unknown as GameData);
    const body = (req.body && typeof req.body === 'object' ? req.body : {}) as Record<string, unknown>;
    const reply = await accounts.handle(token, body);
    res.status(reply.status).json(reply.json);
  } catch (err) {
    console.error('[challenge]', (err as Error).message);
    res.status(502).json({ error: 'upstream', messageAr: 'حصلت مشكلة في حفظ النتيجة. هنحاول تاني بعدين.' });
  }
}
