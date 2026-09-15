/**
 * Thin provider abstraction over Groq and OpenRouter (both OpenAI-compatible
 * chat-completions APIs), with a configurable fallback chain so the model
 * lineup can change (free-tier availability shifts) without a redeploy.
 *
 * LLM_PROVIDER_CHAIN env format: "platform:model,platform:model,..."
 *
 * Every response must pass the caller's `accept` check (for the chat answer:
 * parseable JSON) before it is returned; otherwise the chain moves on. The
 * whole chain respects a single deadline so the serverless function can
 * always fall back to an extractive answer before it times out.
 */

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ProviderSpec {
  platform: 'groq' | 'openrouter';
  model: string;
}

interface ProviderResult {
  ok: boolean;
  text?: string;
  rateLimited?: boolean;
}

export interface FallbackResult extends ProviderResult {
  providerUsed?: string;
  attempts: string[];
}

const ENDPOINTS: Record<ProviderSpec['platform'], string> = {
  groq: 'https://api.groq.com/openai/v1/chat/completions',
  openrouter: 'https://openrouter.ai/api/v1/chat/completions',
};

// allam-2-7b was dropped: its 4K context cannot hold the evidence pack.
export const DEFAULT_CHAIN =
  'groq:openai/gpt-oss-120b,groq:qwen/qwen3.6-27b,groq:openai/gpt-oss-20b,openrouter:google/gemma-4-31b-it:free';

export function parseChain(raw: string | undefined): ProviderSpec[] {
  return (raw || DEFAULT_CHAIN)
    .split(',')
    .map(entry => entry.trim())
    .filter(Boolean)
    .map(entry => {
      const [platform, ...rest] = entry.split(':');
      return { platform: platform as ProviderSpec['platform'], model: rest.join(':') };
    })
    .filter(spec => (spec.platform === 'groq' || spec.platform === 'openrouter') && spec.model);
}

function apiKeyFor(platform: ProviderSpec['platform']): string | undefined {
  if (platform === 'groq') return process.env.GROQ_API_KEY;
  if (platform === 'openrouter') return process.env.OPENROUTER_API_KEY;
  return undefined;
}

/**
 * Reasoning models: gpt-oss spends completion tokens on hidden reasoning
 * (capped with reasoning_effort), qwen3 would otherwise emit <think> blocks
 * inline (hidden via reasoning_format, which JSON mode requires anyway).
 */
function modelParams(spec: ProviderSpec, jsonMode: boolean): Record<string, unknown> {
  const params: Record<string, unknown> = {};
  if (spec.platform === 'groq' && spec.model.startsWith('openai/gpt-oss')) params.reasoning_effort = 'low';
  if (spec.platform === 'groq' && spec.model.startsWith('qwen/')) params.reasoning_format = 'hidden';
  if (jsonMode && spec.platform === 'groq') params.response_format = { type: 'json_object' };
  return params;
}

/** Drops <think>…</think> blocks, including one left unclosed by truncation. */
export function stripThinkTags(text: string): string {
  let result = text.replace(/<think>[\s\S]*?<\/think>/gi, '');
  const unclosed = result.search(/<think>/i);
  if (unclosed !== -1) result = result.slice(0, unclosed);
  return result.trim();
}

export interface CallOptions {
  /** Epoch ms by which the whole chain must finish. */
  deadline: number;
  /** Returns true when the text is usable; otherwise the chain continues. */
  accept: (text: string) => boolean;
  jsonMode?: boolean;
  maxTokens?: number;
  envChain?: string;
}

const MAX_CALL_MS = 14000;
const MIN_CALL_MS = 2500;
const MAX_RETRY_WAIT_MS = 4000;

async function callProvider(spec: ProviderSpec, messages: ChatMessage[], options: CallOptions): Promise<ProviderResult & { note: string; retryAfterMs?: number }> {
  const label = `${spec.platform}:${spec.model}`;
  const apiKey = apiKeyFor(spec.platform);
  if (!apiKey) return { ok: false, note: `${label}: no API key` };

  const timeoutMs = Math.min(MAX_CALL_MS, options.deadline - Date.now());
  if (timeoutMs < MIN_CALL_MS) return { ok: false, note: `${label}: skipped, deadline` };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(ENDPOINTS[spec.platform], {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      signal: controller.signal,
      body: JSON.stringify({
        model: spec.model,
        messages,
        temperature: 0,
        max_tokens: options.maxTokens ?? 1800,
        ...modelParams(spec, options.jsonMode ?? false),
      }),
    });
    if (res.status === 429) {
      const header = res.headers.get('retry-after');
      const retryAfter = header === null ? NaN : Number(header);
      return { ok: false, rateLimited: true, retryAfterMs: Number.isFinite(retryAfter) ? retryAfter * 1000 : undefined, note: `${label}: rate limited` };
    }
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      return { ok: false, note: `${label}: HTTP ${res.status} ${body.slice(0, 200)}` };
    }
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
      usage?: { prompt_tokens?: number; completion_tokens?: number };
    };
    const usage = data.usage ? ` (${data.usage.prompt_tokens ?? '?'}+${data.usage.completion_tokens ?? '?'} tokens)` : '';
    const text = stripThinkTags(data.choices?.[0]?.message?.content ?? '');
    if (!text) return { ok: false, note: `${label}: empty content${usage}` };
    if (!options.accept(text)) return { ok: false, note: `${label}: output rejected (${text.length} chars)${usage}` };
    return { ok: true, text, note: `${label}: ok${usage}` };
  } catch (err) {
    const aborted = (err as Error).name === 'AbortError';
    return { ok: false, note: `${label}: ${aborted ? `timed out after ${timeoutMs}ms` : String(err)}` };
  } finally {
    clearTimeout(timer);
  }
}

/** Tries each provider in order until one returns accepted output or the deadline passes. */
export async function callWithFallback(messages: ChatMessage[], options: CallOptions): Promise<FallbackResult> {
  const attempts: string[] = [];
  let anyRateLimited = false;
  for (const spec of parseChain(options.envChain ?? process.env.LLM_PROVIDER_CHAIN)) {
    let result = await callProvider(spec, messages, options);
    attempts.push(result.note);
    // A per-minute token limit usually clears within seconds; one short wait
    // on the stronger model beats dropping to a weaker one.
    if (result.rateLimited && result.retryAfterMs !== undefined && result.retryAfterMs <= MAX_RETRY_WAIT_MS &&
        options.deadline - Date.now() > result.retryAfterMs + MIN_CALL_MS + 1000) {
      await new Promise(resolve => setTimeout(resolve, result.retryAfterMs));
      result = await callProvider(spec, messages, options);
      attempts.push(`${result.note} (after waiting ${result.retryAfterMs ?? 0}ms)`);
    }
    if (result.ok) return { ok: true, text: result.text, providerUsed: `${spec.platform}:${spec.model}`, attempts };
    if (result.rateLimited) anyRateLimited = true;
    console.warn(`[chat] ${result.note}`);
  }
  return { ok: false, rateLimited: anyRateLimited, attempts };
}
