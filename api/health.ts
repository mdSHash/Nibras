import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getKb } from './_lib/kb.js';

/**
 * GET /api/health — for the uptime monitor (docs/OWNER_DASHBOARD.md). Checks
 * that the knowledge base loads and that an LLM provider key is configured.
 * Calls no LLM and no embedding API, so it uses no quota.
 */
export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.status(405).json({ ok: false, error: 'method_not_allowed' });
    return;
  }

  let kbUnits = 0;
  try {
    kbUnits = getKb().units.length;
  } catch {
    kbUnits = 0;
  }
  const llmConfigured = Boolean(process.env.GROQ_API_KEY || process.env.OPENROUTER_API_KEY);
  const ok = kbUnits > 0 && llmConfigured;

  res.status(ok ? 200 : 503).json({
    ok,
    kbUnits,
    llmConfigured,
    release: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null,
  });
}
