/**
 * The pipeline trace: filled when asked for, from the real knowledge base and
 * search; never returned by the handler unless CHAT_TRACE=1 off Vercel.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import handler, { answerQuestion } from '../api/chat';
import { clearAnswerCache } from '../api/_lib/answerCache';
import { getKb } from '../api/_lib/kb';
import { getProviderIndex } from '../api/_lib/semanticIndex';
import { formatTrace, newTrace } from '../api/_lib/trace';
import type { QueryEmbedder } from '../api/_lib/search';

const kb = getKb();

beforeEach(() => {
  clearAnswerCache();
  process.env.LLM_PROVIDER_CHAIN = 'groq:model-a';
  delete process.env.GROQ_API_KEY;
  delete process.env.OPENROUTER_API_KEY;
  delete process.env.GEMINI_API_KEY;
  vi.stubGlobal('fetch', vi.fn(async () => new Response('no network in tests', { status: 500 })));
});

afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env.CHAT_TRACE;
  delete process.env.VERCEL;
});

/** Uses a stored unit vector as the "query", so semantic search runs offline. */
const vectorOf = (unitId: string): QueryEmbedder => {
  const index = getProviderIndex(kb, 'gemini');
  const position = index.unitIndexes.findIndex(i => kb.units[i].id === unitId);
  return async () => ({ provider: 'gemini', vector: [...index.vectors[position]] });
};

describe('chat trace', () => {
  it('records intents, entities, hits, evidence kept and cut, and the final mode', async () => {
    const trace = newTrace('ماذا تعرف عن صلح الحديبية');
    await answerQuestion(trace.question, { noCache: true, trace, embed: vectorOf('event:treaty-hudaybiyyah#summary') });

    expect(trace.entities).toContainEqual(expect.objectContaining({ id: 'event:treaty-hudaybiyyah', strong: true, carried: false }));
    expect(trace.keyword.length).toBeGreaterThan(0);
    expect(trace.semantic).toMatchObject({ ran: true, provider: 'gemini', min: 0.62 });
    expect(trace.semantic.top[0]).toEqual({ unit: 'event:treaty-hudaybiyyah#summary', score: 1 });
    expect(trace.fusion.length).toBeGreaterThan(0);
    const kept = trace.evidence.kept.find(k => k.record === 'event:treaty-hudaybiyyah');
    expect(kept?.of).toBe(kb.units.filter(u => u.recordId === 'event:treaty-hudaybiyyah').length);
    expect(trace.evidence.chars).toBeGreaterThan(0);
    expect(trace.prompt?.passages).toBeGreaterThan(0);
    expect(trace.llm?.attempts).toEqual(['groq:model-a: no API key']);
    expect(trace.mode).toBe('extractive');
    expect(trace.cache).toBe('off');
    expect(trace.ms.total).toBeGreaterThanOrEqual(0);
    expect(formatTrace(trace)).toContain('event:treaty-hudaybiyyah');
  });

  it('says why semantic search did not run', async () => {
    const trace = newTrace('ماذا تعرف عن صلح الحديبية');
    await answerQuestion(trace.question, { noCache: true, trace, embed: async (_q, notes) => (notes?.push('gemini: no API key'), null) });
    expect(trace.semantic).toMatchObject({ ran: false, notes: ['gemini: no API key'] });
  });

  it('records the context sent and what was carried', async () => {
    const trace = newTrace('وبعدين حصل إيه؟');
    await answerQuestion(trace.question, { noCache: true, trace, embed: async () => null, context: { recordIds: ['event:treaty-hudaybiyyah'], previousQuestion: 'إيه هو صلح الحديبية؟' } });
    expect(trace.context.sent).toEqual(['event:treaty-hudaybiyyah']);
    expect(trace.context.carried).toEqual(['event:treaty-hudaybiyyah']);
    expect(trace.context.previousQuestionShown).toBe(true);
  });
});

describe('the handler and traces', () => {
  const call = async () => {
    let body: Record<string, unknown> = {};
    const res = {
      setHeader: () => res,
      status: () => res,
      json: (b: Record<string, unknown>) => ((body = b), res),
      end: () => res,
    } as unknown as VercelResponse;
    const log = vi.spyOn(console, 'info').mockImplementation(() => {});
    await handler({ method: 'POST', headers: {}, body: { message: 'متى كانت غزوة بدر؟' } } as unknown as VercelRequest, res);
    const lines = log.mock.calls.map(c => String(c[0]));
    log.mockRestore();
    return { body, lines };
  };

  it('production: no trace in the body, and the one-line log carries no question text', async () => {
    const { body, lines } = await call();
    expect(body.trace).toBeUndefined();
    expect(lines).toHaveLength(1);
    expect(lines[0]).not.toContain('بدر');
  });

  it('CHAT_TRACE=1 on Vercel still returns no trace', async () => {
    process.env.CHAT_TRACE = '1';
    process.env.VERCEL = '1';
    expect((await call()).body.trace).toBeUndefined();
  });

  it('CHAT_TRACE=1 off Vercel returns and prints the trace', async () => {
    process.env.CHAT_TRACE = '1';
    const { body, lines } = await call();
    expect(body.trace).toMatchObject({ question: 'متى كانت غزوة بدر؟', rateLimit: 'unavailable' });
    expect(lines.some(l => l.startsWith('── متى كانت غزوة بدر؟'))).toBe(true);
  });
});
