import type { VercelRequest, VercelResponse } from '@vercel/node';
import { answerBlockText, type AnswerBlock, type AnswerMode, type ChatErrorBody, type ChatSuccessBody } from '../shared/chatApi.js';
import { composeAnswer, extractiveAnswer, type ComposedAnswer } from './_lib/answer.js';
import { answerCacheKey, cacheAnswer, getCachedAnswer } from './_lib/answerCache.js';
import { sanitizeContext, type ChatContext } from './_lib/context.js';
import { corsHeaders } from './_lib/cors.js';
import { buildFollowUps } from './_lib/followUps.js';
import { getKb } from './_lib/kb.js';
import { callWithFallback } from './_lib/llmProviders.js';
import {
  EMPTY_QUESTION_MESSAGE,
  EXTRACTIVE_INTRO,
  METHOD_NOT_ALLOWED_MESSAGE,
  NOT_COVERED_MESSAGE,
  RATE_LIMIT_MESSAGE,
  SERVICE_BUSY_MESSAGE,
  TOO_LONG_MESSAGE,
} from './_lib/messages.js';
import { reportServerError } from './_lib/monitoring.js';
import { checkRateLimit, clientIp } from './_lib/rateLimit.js';
import { buildPrompt, parseModelAnswer } from './_lib/prompt.js';
import { composeOverview, composeSections, overviewTarget } from './_lib/shapes.js';
import { pickExampleQuestions } from '../src/utils/chatExamples.js';
import { defaultEmbedder, search, type QueryEmbedder, type SearchOutcome } from './_lib/search.js';
import { formatTrace, newTrace, type ChatTrace } from './_lib/trace.js';

export type { ChatSuccessBody };

const MAX_MESSAGE_LENGTH = 400;
// Leaves headroom under the function's maxDuration (vercel.json) for the
// extractive fallback when every provider is slow.
const ANSWER_DEADLINE_MS = 22000;
const MAX_CONTEXT_RECORDS = 3;

export interface AnswerDeps {
  embed?: QueryEmbedder;
  now?: () => number;
  /** Previous turn, for follow-up questions. */
  context?: ChatContext;
  /** Disable the answer cache (tests). */
  noCache?: boolean;
  /** Filled with what each stage saw (eval, dev, tests); never built in production. */
  trace?: ChatTrace;
}

/** Traces are returned and printed only off Vercel, when asked for. */
const traceEnabled = () => process.env.CHAT_TRACE === '1' && !process.env.VERCEL;

function plainAnswer(blocks: AnswerBlock[]): string {
  return blocks.map(answerBlockText).join('\n\n');
}

/** Records the next question may refer back to: what this one named or carried, else what it cited. */
function focusRecords(found: SearchOutcome, composed: ComposedAnswer): string[] {
  const strong = found.entities.filter(e => e.strong).map(e => e.recordId);
  const ids = strong.length > 0 ? strong : composed.citations.map(c => c.chunkId);
  return [...new Set(ids)].slice(0, MAX_CONTEXT_RECORDS);
}

async function success(found: SearchOutcome, composed: ComposedAnswer, mode: AnswerMode, question: string, intro?: string): Promise<ChatSuccessBody> {
  const kb = getKb();
  const blocks: AnswerBlock[] = intro ? [{ type: 'text', text: intro, citations: [] }, ...composed.blocks] : composed.blocks;
  const recordIds = focusRecords(found, composed);
  return {
    answer: plainAnswer(blocks),
    blocks,
    citations: composed.citations,
    grounded: true,
    mode,
    context: {
      recordIds,
      carried: found.entities
        .filter(e => e.carried)
        .map(e => ({ recordId: e.recordId, title: kb.recordById.get(e.recordId)?.title ?? '' })),
      ...(found.askedAs ? { question: found.askedAs } : {}),
    },
    followUps: await buildFollowUps(kb, recordIds, found.intents, question),
  };
}

const notCovered = (): ChatSuccessBody => ({
  answer: NOT_COVERED_MESSAGE,
  blocks: [{ type: 'text', text: NOT_COVERED_MESSAGE, citations: [] }],
  citations: [],
  grounded: false,
  mode: 'not_covered',
  context: { recordIds: [], carried: [] },
  // Starter questions (approved for 3J), so a refused or vague question still leads somewhere.
  followUps: pickExampleQuestions(),
});

/** The whole question → answer pipeline, independent of the HTTP layer. */
export async function answerQuestion(question: string, deps: AnswerDeps = {}): Promise<{ status: number; body: ChatSuccessBody | ChatErrorBody; log: Record<string, unknown> }> {
  const now = deps.now ?? Date.now;
  const started = now();
  const kb = getKb();
  const embed = deps.embed ?? defaultEmbedder(kb, { gemini: process.env.GEMINI_API_KEY, openrouter: process.env.OPENROUTER_API_KEY });
  const trace = deps.trace;

  const found = await search(question, embed, kb, deps.context, trace);
  if (trace) trace.ms.search = now() - started;
  const carried = found.entities.filter(e => e.carried).map(e => e.recordId);
  const finish = <T extends { log: Record<string, unknown> }>(result: T): T => {
    if (trace) {
      trace.mode = String(result.log.mode);
      trace.cache ??= deps.noCache ? 'off' : 'miss';
      trace.ms.total = now() - started;
    }
    return result;
  };
  const log: Record<string, unknown> = {
    confidence: found.confidence,
    entities: found.entities.map(e => e.recordId),
    carried,
    intents: found.intents,
    semantic: found.semanticProvider ?? null,
    evidenceUnits: found.evidence.reduce((n, e) => n + e.units.length, 0),
  };
  if (found.confidence === 'none' || found.evidence.length === 0) {
    return finish({ status: 200, body: notCovered(), log: { ...log, mode: 'not_covered', ms: now() - started } });
  }

  // An overview of one clear record: the whole record in order, without the model.
  const overview = overviewTarget(question, found, kb);
  if (overview) {
    const composed = composeOverview(kb, overview.recordId, overview.style);
    if (composed.blocks.length > 0) {
      if (trace) {
        trace.shape = overview.style;
        trace.answerUnits = composed.shown;
      }
      const body = await success(found, composed, 'composed', question);
      return finish({ status: 200, body, log: { ...log, mode: 'composed', shape: overview.style, ms: now() - started } });
    }
  }

  const cacheKey = answerCacheKey(kb.kb.contentHash, question, carried);
  if (!deps.noCache) {
    const cached = await getCachedAnswer(cacheKey);
    if (cached) {
      if (trace) trace.cache = 'hit';
      return finish({ status: 200, body: cached, log: { ...log, mode: cached.mode, cache: 'hit', ms: now() - started } });
    }
  }

  const { system, unitByRef } = buildPrompt(found.evidence);
  log.promptChars = system.length;
  if (trace) trace.prompt = { chars: system.length, passages: unitByRef.size };
  // The previous question is shown only when this one borrowed its subject or its question («وأحد؟»).
  const userContent =
    (carried.length > 0 || found.askedAs) && deps.context?.previousQuestion
      ? `السؤال السابق في المحادثة (للسياق فقط): «${deps.context.previousQuestion}»\nالسؤال الحالي: ${question}`
      : question;
  const llmStarted = now();
  const llm = await callWithFallback(
    [
      { role: 'system', content: system },
      { role: 'user', content: userContent },
    ],
    { deadline: started + ANSWER_DEADLINE_MS, accept: text => parseModelAnswer(text) !== null, jsonMode: true }
  );
  log.attempts = llm.attempts;
  log.provider = llm.providerUsed ?? null;
  if (trace) {
    trace.context.previousQuestionShown = userContent !== question;
    trace.ms.llm = now() - llmStarted;
    trace.llm = { attempts: llm.attempts, provider: llm.providerUsed ?? null, ms: trace.ms.llm };
  }

  const model = llm.ok && llm.text ? parseModelAnswer(llm.text) : null;
  if (trace && model) trace.model = { answerable: model.answerable, items: model.sections?.length || model.points.length };
  if (model && !model.answerable) {
    const body = notCovered();
    if (!deps.noCache) await cacheAnswer(cacheKey, body);
    return finish({ status: 200, body, log: { ...log, mode: 'not_covered', modelSaid: 'unanswerable', ms: now() - started } });
  }
  if (model) {
    const shape = model.sections?.length ? 'sections' : 'points';
    const composed = model.sections?.length
      ? composeSections(kb, model.sections, unitByRef)
      : composeAnswer(kb, model, unitByRef, found.entities.filter(e => e.strong).map(e => e.recordId));
    log.shape = shape;
    if (trace) trace.shape = shape;
    log.rejected = composed.rejected;
    if (trace) {
      trace.rejected = composed.rejected;
      trace.answerUnits = composed.shown;
    }
    if (composed.blocks.some(b => b.type !== 'text' || b.citations.length > 0)) {
      const body = await success(found, composed, 'composed', question);
      if (!deps.noCache) await cacheAnswer(cacheKey, body);
      return finish({ status: 200, body, log: { ...log, mode: 'composed', ms: now() - started } });
    }
  }

  // No usable model answer: show verified source text if retrieval is confident.
  if (found.confidence === 'high') {
    const extractive = extractiveAnswer(kb, found.evidence, found.intents);
    if (extractive.blocks.length > 0) {
      if (trace) trace.answerUnits = extractive.shown;
      const body = await success(found, extractive, 'extractive', question, EXTRACTIVE_INTRO);
      return finish({ status: 200, body, log: { ...log, mode: 'extractive', ms: now() - started } });
    }
  }
  const status = llm.rateLimited ? 429 : 503;
  return finish({
    status,
    body: { error: llm.rateLimited ? 'rate_limited' : 'provider_unavailable', messageAr: SERVICE_BUSY_MESSAGE },
    log: { ...log, mode: 'busy', ms: now() - started },
  });
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

  // Counted after the checks above, so an empty or too-long question costs nothing.
  const limit = await checkRateLimit(clientIp(req));
  if (limit.status === 'blocked') {
    console.info(`[chat] ${JSON.stringify({ status: 429, rateLimit: limit.window })}`);
    res.setHeader('Retry-After', String(limit.retryAfterSeconds));
    res.status(429).json({ error: 'too_many_requests', messageAr: RATE_LIMIT_MESSAGE });
    return;
  }

  try {
    const context = sanitizeContext(req.body?.context, getKb());
    const trace = traceEnabled() ? newTrace(message) : undefined;
    const { status, body, log } = await answerQuestion(message, { context, trace });
    console.info(`[chat] ${JSON.stringify({ status, questionLength: message.length, rateLimit: limit.status, ...log })}`);
    if (trace) {
      trace.rateLimit = limit.status;
      console.info(formatTrace(trace));
      res.status(status).json({ ...body, trace });
      return;
    }
    res.status(status).json(body);
  } catch (err) {
    console.error('[chat] unexpected failure', err);
    await reportServerError(err, 'chat');
    res.status(500).json({ error: 'internal_error', messageAr: SERVICE_BUSY_MESSAGE });
  }
}
