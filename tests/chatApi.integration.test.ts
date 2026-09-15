/**
 * Integration tests: the real handler, knowledge base, search, prompt,
 * validator and composer — with the network (LLM + embedding providers)
 * replaced by a scripted fake.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import handler, { answerQuestion, type ChatSuccessBody } from '../api/chat';
import feedbackHandler from '../api/feedback';
import { clearAnswerCache } from '../api/_lib/answerCache';

type Scripted = (body: { model: string; messages: { role: string; content: string }[] }) => { status: number; json?: unknown; hang?: boolean };
let lastUserContent = '';

let llmScript: Scripted[] = [];
let llmCalls: string[] = [];

function refFor(system: string, fragment: string): string {
  const line = system.split('\n').find(l => /^s\d+/.test(l) && l.includes(fragment));
  if (!line) throw new Error(`no passage containing «${fragment}» in prompt`);
  return line.split(/[:\s[]/)[0];
}

const answerJson = (points: { text: string; refs: string[] }[], intro = '') => ({
  choices: [{ message: { content: JSON.stringify({ answerable: true, intro, points }) } }],
  usage: { prompt_tokens: 1000, completion_tokens: 100 },
});

beforeEach(() => {
  clearAnswerCache();
  llmScript = [];
  llmCalls = [];
  process.env.GROQ_API_KEY = 'test-groq';
  process.env.OPENROUTER_API_KEY = 'test-openrouter';
  process.env.GEMINI_API_KEY = 'test-gemini';
  process.env.LLM_PROVIDER_CHAIN = 'groq:model-a,groq:model-b,openrouter:model-c';
  vi.stubGlobal('fetch', vi.fn(async (url: string, init?: RequestInit) => {
    if (!String(url).includes('/chat/completions')) return new Response('embeddings disabled in tests', { status: 500 });
    const body = JSON.parse(String(init?.body));
    llmCalls.push(body.model);
    lastUserContent = body.messages[1]?.content ?? '';
    const step = llmScript.shift();
    if (!step) return new Response('no scripted response', { status: 500 });
    const result = step(body);
    if (result.hang) {
      return new Promise<Response>((_, reject) => init?.signal?.addEventListener('abort', () => reject(Object.assign(new Error('aborted'), { name: 'AbortError' }))));
    }
    return new Response(JSON.stringify(result.json ?? {}), { status: result.status });
  }));
});

afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env.LLM_PROVIDER_CHAIN;
});

const ALI_AT_BADR = 'ماذا فعل علي بن أبي طالب في غزوة بدر؟';

describe('answerQuestion', () => {
  it('returns a composed, validated answer with citations', async () => {
    llmScript.push(body => {
      const ref = refFor(body.messages[0].content, 'برز للمبارزة');
      return { status: 200, json: answerJson([{ text: '**علي بن أبي طالب**: برز للمبارزة وقتل الوليد بن عتبة', refs: [ref] }]) };
    });
    const { status, body } = await answerQuestion(ALI_AT_BADR);
    const ok = body as ChatSuccessBody;
    expect(status).toBe(200);
    expect(ok.mode).toBe('composed');
    expect(ok.blocks[0]).toMatchObject({ type: 'text' });
    expect(ok.blocks[0].type === 'text' && ok.blocks[0].text).toContain('وَقَتَلَ الْوَلِيدَ بْنَ عُتْبَةَ');
    expect(ok.citations.map(c => c.chunkId)).toEqual(expect.arrayContaining(['event:battle-badr', 'companion:ali']));
    expect(llmCalls).toEqual(['model-a']);
  });

  it('never shows an invented detail — the cited source text is shown instead', async () => {
    llmScript.push(body => {
      const ref = refFor(body.messages[0].content, 'برز للمبارزة');
      return { status: 200, json: answerJson([{ text: 'برز علي وقتل عمرو بن عبد ود في بدر', refs: [ref] }]) };
    });
    const { body } = await answerQuestion(ALI_AT_BADR);
    const ok = body as ChatSuccessBody;
    expect(JSON.stringify(ok.blocks)).not.toContain('عمرو بن عبد ود');
    expect(ok.blocks.some(b => b.type === 'quote' && b.text.includes('الْوَلِيدَ'))).toBe(true);
  });

  it('falls through a rate-limited model and a non-JSON reply to the next provider', async () => {
    llmScript.push(() => ({ status: 429, json: { error: 'rate limited' } }));
    llmScript.push(() => ({ status: 200, json: { choices: [{ message: { content: 'علي بن أبي طالب بطل بدر' } }] } }));
    llmScript.push(body => {
      const ref = refFor(body.messages[0].content, 'برز للمبارزة');
      return { status: 200, json: answerJson([{ text: '**علي بن أبي طالب**: برز للمبارزة وقتل الوليد بن عتبة', refs: [ref] }]) };
    });
    const { body, log } = await answerQuestion(ALI_AT_BADR);
    expect((body as ChatSuccessBody).mode).toBe('composed');
    expect(llmCalls).toEqual(['model-a', 'model-b', 'model-c']);
    expect(String((log.attempts as string[])[0])).toContain('rate limited');
  });

  it('shows verified source passages when every provider fails on a confident question', async () => {
    llmScript.push(() => ({ status: 500 }), () => ({ status: 500 }), () => ({ status: 500 }));
    const { status, body } = await answerQuestion('متى كانت غزوة أحد؟');
    const ok = body as ChatSuccessBody;
    expect(status).toBe(200);
    expect(ok.mode).toBe('extractive');
    expect(ok.blocks.some(b => b.type === 'quote' && b.text.startsWith('تاريخ غزوة أحد'))).toBe(true);
  });

  it('respects the answer deadline instead of waiting on a hung provider', async () => {
    llmScript.push(() => ({ status: 200, hang: true }));
    const started = Date.now();
    // Pretend the request began 19s ago: only ~3s of budget remain.
    const { body } = await answerQuestion('متى كانت غزوة أحد؟', { now: () => Date.now() - 19000 });
    expect(Date.now() - started).toBeLessThan(6000);
    expect((body as ChatSuccessBody).mode).toBe('extractive');
  }, 15000);

  it('returns 429 with the Arabic busy message when providers are rate-limited and retrieval is unsure', async () => {
    llmScript.push(() => ({ status: 429 }), () => ({ status: 429 }), () => ({ status: 429 }));
    const { status, body } = await answerQuestion('ما هي أسباب الانتصار؟');
    expect(status).toBe(429);
    expect(body).toMatchObject({ error: 'rate_limited' });
  });

  it('passes through a model refusal as "not covered"', async () => {
    llmScript.push(() => ({ status: 200, json: { choices: [{ message: { content: '{"answerable": false}' } }] } }));
    const { body } = await answerQuestion('ما رأي علي بن أبي طالب في كرة القدم؟');
    expect((body as ChatSuccessBody).mode).toBe('not_covered');
  });

  it('does not call any model when nothing in Nibras matches', async () => {
    const { body } = await answerQuestion('؟؟؟');
    expect((body as ChatSuccessBody).mode).toBe('not_covered');
    expect(llmCalls).toEqual([]);
  });
});

describe('answer cache, context and follow-ups', () => {
  const aliAnswer: Scripted = body => {
    const ref = refFor(body.messages[0].content, 'برز للمبارزة');
    return { status: 200, json: answerJson([{ text: '**علي بن أبي طالب**: برز للمبارزة وقتل الوليد بن عتبة', refs: [ref] }]) };
  };

  it('serves a repeated question from the cache without calling a model', async () => {
    llmScript.push(aliAnswer);
    await answerQuestion(ALI_AT_BADR);
    const second = await answerQuestion(ALI_AT_BADR);
    expect(llmCalls).toEqual(['model-a']);
    expect(second.log.cache).toBe('hit');
    expect((second.body as ChatSuccessBody).mode).toBe('composed');
  });

  it('returns follow-up suggestions and the records the answer was about', async () => {
    llmScript.push(aliAnswer);
    const { body } = await answerQuestion(ALI_AT_BADR);
    const ok = body as ChatSuccessBody;
    expect(ok.context.recordIds).toEqual(expect.arrayContaining(['companion:ali', 'event:battle-badr']));
    expect(ok.followUps.length).toBeGreaterThan(0);
  });

  it('carries the previous subject into a follow-up and tells the model the earlier question', async () => {
    llmScript.push(body => {
      const ref = refFor(body.messages[0].content, 'جهز');
      return { status: 200, json: answerJson([{ text: 'تبوك', refs: [ref] }]) };
    });
    const { body, log } = await answerQuestion('طب عمل إيه في غزوة تبوك؟', {
      context: { recordIds: ['companion:uthman'], previousQuestion: 'مين عثمان بن عفان؟' },
    });
    expect(log.carried).toEqual(['companion:uthman']);
    expect(lastUserContent).toContain('مين عثمان بن عفان؟');
    const ok = body as ChatSuccessBody;
    expect(ok.context.carried.map(c => c.recordId)).toEqual(['companion:uthman']);
  });
});

describe('feedback handler', () => {
  function mockRes() {
    const res = { statusCode: 0, body: undefined as unknown, headers: {} as Record<string, string> };
    const api = {
      setHeader: (k: string, v: string) => ((res.headers[k] = v), api),
      status: (code: number) => ((res.statusCode = code), api),
      json: (b: unknown) => ((res.body = b), api),
      end: () => api,
    };
    return { res, api: api as unknown as VercelResponse };
  }

  it('accepts a rating and logs it when no shared store is configured', async () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => {});
    const { res, api } = mockRes();
    await feedbackHandler({ method: 'POST', headers: { origin: 'https://mdshash.github.io' }, body: { rating: 'down', question: 'سؤال', note: 'الإجابة ناقصة' } } as unknown as VercelRequest, api);
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({ ok: true, stored: 'log' });
    expect(info.mock.calls.some(c => String(c[0]).includes('[chat-feedback]') && String(c[0]).includes('الإجابة ناقصة'))).toBe(true);
    info.mockRestore();
  });

  it('rejects an incomplete rating in Arabic', async () => {
    const { res, api } = mockRes();
    await feedbackHandler({ method: 'POST', headers: {}, body: { rating: 'meh' } } as unknown as VercelRequest, api);
    expect(res.statusCode).toBe(400);
    expect((res.body as { messageAr: string }).messageAr).toMatch(/[؀-ۿ]/);
  });
});

describe('HTTP handler', () => {
  function mockRes() {
    const res = { statusCode: 0, headers: {} as Record<string, string>, body: undefined as unknown };
    const api = {
      setHeader: (k: string, v: string) => ((res.headers[k] = v), api),
      status: (code: number) => ((res.statusCode = code), api),
      json: (b: unknown) => ((res.body = b), api),
      end: () => api,
    };
    return { res, api: api as unknown as VercelResponse };
  }
  const req = (method: string, body?: unknown, origin = 'https://mdshash.github.io') =>
    ({ method, body, headers: { origin } }) as unknown as VercelRequest;

  it('answers CORS preflight for the production origin', async () => {
    const { res, api } = mockRes();
    await handler(req('OPTIONS'), api);
    expect(res.statusCode).toBe(204);
    expect(res.headers['Access-Control-Allow-Origin']).toBe('https://mdshash.github.io');
  });

  it('rejects other methods, empty and over-long questions in Arabic', async () => {
    for (const [request, code] of [
      [req('GET'), 405],
      [req('POST', { message: '   ' }), 400],
      [req('POST', { message: 'س'.repeat(401) }), 400],
    ] as const) {
      const { res, api } = mockRes();
      await handler(request, api);
      expect(res.statusCode).toBe(code);
      expect((res.body as { messageAr: string }).messageAr).toMatch(/[؀-ۿ]/);
    }
  });

  it('serves a full answer over POST', async () => {
    llmScript.push(body => {
      const ref = refFor(body.messages[0].content, 'برز للمبارزة');
      return { status: 200, json: answerJson([{ text: '**علي بن أبي طالب**: برز للمبارزة وقتل الوليد بن عتبة', refs: [ref] }]) };
    });
    const { res, api } = mockRes();
    await handler(req('POST', { message: ALI_AT_BADR }), api);
    expect(res.statusCode).toBe(200);
    expect((res.body as ChatSuccessBody).blocks.length).toBeGreaterThan(0);
  });
});
