import type { VercelRequest, VercelResponse } from '@vercel/node';
import { retrieve } from './_lib/retrieval.js';
import { buildSystemPrompt, NOT_COVERED_MESSAGE, SERVICE_BUSY_MESSAGE } from './_lib/systemPrompt.js';
import { callWithFallback } from './_lib/llmProviders.js';
import { corsHeaders } from './_lib/cors.js';

// Plain Node.js serverless function (not Edge): the bundled ~1.7MB
// chat-corpus.json comfortably fits Node's function size limit, whereas
// Vercel Edge Functions have a much tighter bundle-size ceiling.
const MAX_MESSAGE_LENGTH = 400;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = (req.headers.origin as string | undefined) || null;
  const headers = corsHeaders(origin);
  for (const [key, value] of Object.entries(headers)) res.setHeader(key, value);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed', messageAr: 'الطريقة غير مسموحة.' });
    return;
  }

  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';

  if (!message) {
    res.status(400).json({ error: 'bad_request', messageAr: 'الرجاء كتابة سؤال.' });
    return;
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    res.status(400).json({ error: 'bad_request', messageAr: 'السؤال طويل جداً، الرجاء اختصاره.' });
    return;
  }

  // Primary guardrail: nothing relevant in the corpus → never call the LLM.
  const chunks = retrieve(message);
  if (chunks.length === 0) {
    res.status(200).json({ answer: NOT_COVERED_MESSAGE, citations: [], grounded: false });
    return;
  }

  const systemPrompt = buildSystemPrompt(chunks);
  const result = await callWithFallback([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: message },
  ]);

  if (!result.ok || !result.text) {
    const status = result.rateLimited ? 429 : 503;
    res.status(status).json({
      error: result.rateLimited ? 'rate_limited' : 'provider_unavailable',
      messageAr: SERVICE_BUSY_MESSAGE,
    });
    return;
  }

  // Citations are derived server-side from the [n] markers actually present
  // in the answer, mapped back to the real chunks that were sent — never
  // trusted from the model's own restatement of sources/IDs.
  const citedIndices = new Set<number>();
  for (const match of result.text.matchAll(/\[(\d+)\]/g)) {
    const n = Number(match[1]);
    if (n >= 1 && n <= chunks.length) citedIndices.add(n);
  }

  const citations = [...citedIndices].map(n => {
    const chunk = chunks[n - 1];
    return {
      chunkId: chunk.id,
      sourceLabel: chunk.sourceLabel,
      type: chunk.type,
      era: chunk.era,
      entityRefs: chunk.entityRefs,
    };
  });

  res.status(200).json({ answer: result.text, citations, grounded: true });
}
