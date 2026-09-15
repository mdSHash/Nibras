import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { AnswerBlock, AnswerMode, ChatErrorBody, ChatSuccessBody } from '../shared/chatApi.js';
import { composeAnswer, extractiveAnswer, type ComposedAnswer } from './_lib/answer.js';
import { corsHeaders } from './_lib/cors.js';
import { getKb } from './_lib/kb.js';
import { callWithFallback } from './_lib/llmProviders.js';
import {
  EMPTY_QUESTION_MESSAGE,
  EXTRACTIVE_INTRO,
  METHOD_NOT_ALLOWED_MESSAGE,
  NOT_COVERED_MESSAGE,
  SERVICE_BUSY_MESSAGE,
  TOO_LONG_MESSAGE,
} from './_lib/messages.js';
import { buildPrompt, parseModelAnswer } from './_lib/prompt.js';
import { defaultEmbedder, search, type QueryEmbedder } from './_lib/search.js';

export type { ChatSuccessBody };

const MAX_MESSAGE_LENGTH = 400;
// Leaves headroom under the function's maxDuration (vercel.json) for the
// extractive fallback when every provider is slow.
const ANSWER_DEADLINE_MS = 22000;

export interface AnswerDeps {
  embed?: QueryEmbedder;
  now?: () => number;
}

function plainAnswer(blocks: AnswerBlock[]): string {
  return blocks
    .map(b => {
      if (b.type === 'quran') return `${b.key}: ${b.text}`;
      if (b.type === 'list') return `${b.heading}:\n${b.items.map(item => `• ${item}`).join('\n')}`;
      return b.text;
    })
    .join('\n\n');
}

function success(composed: ComposedAnswer, mode: AnswerMode, intro?: string): ChatSuccessBody {
  const blocks: AnswerBlock[] = intro ? [{ type: 'text', text: intro, citations: [] }, ...composed.blocks] : composed.blocks;
  return { answer: plainAnswer(blocks), blocks, citations: composed.citations, grounded: true, mode };
}

const notCovered = (): ChatSuccessBody => ({
  answer: NOT_COVERED_MESSAGE,
  blocks: [{ type: 'text', text: NOT_COVERED_MESSAGE, citations: [] }],
  citations: [],
  grounded: false,
  mode: 'not_covered',
});

/** The whole question → answer pipeline, independent of the HTTP layer. */
export async function answerQuestion(question: string, deps: AnswerDeps = {}): Promise<{ status: number; body: ChatSuccessBody | ChatErrorBody; log: Record<string, unknown> }> {
  const now = deps.now ?? Date.now;
  const started = now();
  const kb = getKb();
  const embed = deps.embed ?? defaultEmbedder(kb, { gemini: process.env.GEMINI_API_KEY, openrouter: process.env.OPENROUTER_API_KEY });

  const found = await search(question, embed, kb);
  const log: Record<string, unknown> = {
    confidence: found.confidence,
    entities: found.entities.map(e => e.recordId),
    intents: found.intents,
    semantic: found.semanticProvider ?? null,
    evidenceUnits: found.evidence.reduce((n, e) => n + e.units.length, 0),
  };
  if (found.confidence === 'none' || found.evidence.length === 0) {
    return { status: 200, body: notCovered(), log: { ...log, mode: 'not_covered', ms: now() - started } };
  }

  const { system, unitByRef } = buildPrompt(found.evidence);
  const llm = await callWithFallback(
    [
      { role: 'system', content: system },
      { role: 'user', content: question },
    ],
    { deadline: started + ANSWER_DEADLINE_MS, accept: text => parseModelAnswer(text) !== null, jsonMode: true }
  );
  log.attempts = llm.attempts;
  log.provider = llm.providerUsed ?? null;

  const model = llm.ok && llm.text ? parseModelAnswer(llm.text) : null;
  if (model && !model.answerable) {
    return { status: 200, body: notCovered(), log: { ...log, mode: 'not_covered', modelSaid: 'unanswerable', ms: now() - started } };
  }
  if (model) {
    const composed = composeAnswer(kb, model, unitByRef, found.entities.filter(e => e.strong).map(e => e.recordId));
    log.rejected = composed.rejected;
    if (composed.blocks.some(b => b.type !== 'text' || b.citations.length > 0)) {
      return { status: 200, body: success(composed, 'composed'), log: { ...log, mode: 'composed', ms: now() - started } };
    }
  }

  // No usable model answer: show verified source text if retrieval is confident.
  if (found.confidence === 'high') {
    const extractive = extractiveAnswer(kb, found.evidence, found.intents);
    if (extractive.blocks.length > 0) {
      return { status: 200, body: success(extractive, 'extractive', EXTRACTIVE_INTRO), log: { ...log, mode: 'extractive', ms: now() - started } };
    }
  }
  const status = llm.rateLimited ? 429 : 503;
  return {
    status,
    body: { error: llm.rateLimited ? 'rate_limited' : 'provider_unavailable', messageAr: SERVICE_BUSY_MESSAGE },
    log: { ...log, mode: 'busy', ms: now() - started },
  };
}

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

  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
  if (!message) {
    res.status(400).json({ error: 'bad_request', messageAr: EMPTY_QUESTION_MESSAGE });
    return;
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    res.status(400).json({ error: 'bad_request', messageAr: TOO_LONG_MESSAGE });
    return;
  }

  try {
    const { status, body, log } = await answerQuestion(message);
    console.info(`[chat] ${JSON.stringify({ status, questionLength: message.length, ...log })}`);
    res.status(status).json(body);
  } catch (err) {
    console.error('[chat] unexpected failure', err);
    res.status(500).json({ error: 'internal_error', messageAr: SERVICE_BUSY_MESSAGE });
  }
}
