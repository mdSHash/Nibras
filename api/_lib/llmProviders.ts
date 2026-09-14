/**
 * Thin provider abstraction over Groq and OpenRouter (both OpenAI-compatible
 * chat-completions APIs), with a configurable fallback chain so the model
 * lineup can change (free-tier availability shifts) without a redeploy.
 *
 * LLM_PROVIDER_CHAIN env format: "platform:model,platform:model,..."
 *   e.g. "groq:allam-2-7b,groq:openai/gpt-oss-120b,groq:qwen/qwen3.6-27b,openrouter:google/gemma-4-31b-it:free"
 *
 * Default chain: allam-2-7b (SDAIA's Arabic-native model, no hidden
 * reasoning-token overhead) first, then two reasoning-capable models with a
 * larger token budget, then a non-reasoning OpenRouter free model last. Every
 * response is screened for degenerate output (see isDegenerate below) before
 * being accepted — a model that produces a repetition loop or a
 * whitespace-flood is treated the same as a hard failure and the chain moves
 * to the next provider.
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
}

const ENDPOINTS: Record<ProviderSpec['platform'], string> = {
  groq: 'https://api.groq.com/openai/v1/chat/completions',
  openrouter: 'https://openrouter.ai/api/v1/chat/completions',
};

const DEFAULT_CHAIN =
  'groq:allam-2-7b,groq:openai/gpt-oss-120b,groq:qwen/qwen3.6-27b,openrouter:google/gemma-4-31b-it:free';

function parseChain(raw: string | undefined): ProviderSpec[] {
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
 * Groq's "gpt-oss" family spends completion tokens on a hidden reasoning
 * pass before the final answer — with a capped max_tokens this can consume
 * the whole budget and leave `content` empty (finish_reason "length").
 * Capping reasoning effort avoids that. Other Groq models (e.g. allam) reject
 * this parameter with a 400, so it's only sent for the family known to need
 * and accept it.
 */
function reasoningParamsFor(spec: ProviderSpec): Record<string, unknown> {
  if (spec.platform === 'groq' && spec.model.startsWith('openai/gpt-oss')) {
    return { reasoning_effort: 'low' };
  }
  return {};
}

/**
 * Some models (e.g. Groq's qwen/qwen3.6-27b) emit their chain-of-thought
 * inline as a <think>...</think> block ahead of the real answer, rather than
 * in a separate API field the way gpt-oss does. Strip it so users never see
 * raw reasoning traces, and so the emptiness/degeneracy checks below judge
 * the actual answer, not the reasoning preamble.
 */
function stripThinkTags(text: string): string {
  let result = text.replace(/<think>[\s\S]*?<\/think>/gi, '');
  // Generation can also be cut off mid-reasoning, leaving an OPENING <think>
  // with no closing tag — live testing showed this leaks the entire raw
  // chain-of-thought (including a sentence trailing off mid-word) straight
  // into the user-visible answer. Treat "no real answer was ever reached"
  // as exactly that: drop everything from the unclosed tag onward.
  const unclosed = result.search(/<think>/i);
  if (unclosed !== -1) result = result.slice(0, unclosed);
  return result.trim();
}

function trigramUniqueness(words: string[]): number | null {
  if (words.length < 20) return null;
  const trigrams = new Set<string>();
  let total = 0;
  for (let i = 0; i + 3 <= words.length; i++) {
    trigrams.add(words.slice(i, i + 3).join(' '));
    total++;
  }
  return total > 0 ? trigrams.size / total : null;
}

/**
 * Detects failure modes observed live from small free-tier models: a
 * whitespace flood (a few real words then blank lines until cut off), a
 * suspiciously short/truncated fragment, or a repetition loop (checked both
 * over the whole response and just its tail, since a loop that only starts
 * near the end gets diluted below the threshold by good earlier content).
 * Any of these is treated as a hard failure so the chain moves on instead of
 * showing the user garbage.
 */
export function isDegenerate(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return true;

  // A live test produced a bare "رضي الله عنه؟" (13 chars) for a substantive
  // question — looks like a truncated/malformed generation rather than a
  // real answer. 25 chars stays well under any legitimate short factual
  // answer while catching clearly-broken fragments like this.
  if (trimmed.length < 25) return true;

  const nonWhitespaceRatio = trimmed.replace(/\s/g, '').length / trimmed.length;
  if (trimmed.length > 200 && nonWhitespaceRatio < 0.5) return true;

  const words = trimmed.split(/\s+/).filter(Boolean);
  const overallUniqueness = trigramUniqueness(words);
  if (overallUniqueness !== null && overallUniqueness < 0.35) return true;

  // A live test showed a genuinely good answer (a list of 11+ people)
  // devolve into repeats of "**X**: (مذكورة مرة أخرى)." at the end — a real
  // failure, but diluted by the good content earlier so the WHOLE-text ratio
  // above stayed high enough to pass. A short, tighter tail window with a
  // higher bar catches a repetition loop that only kicks in near the end,
  // even when it's just 3-4 short repeated lines.
  const tailUniqueness = trigramUniqueness(words.slice(-24));
  if (tailUniqueness !== null && tailUniqueness < 0.55) return true;

  return false;
}

async function callProvider(spec: ProviderSpec, messages: ChatMessage[]): Promise<ProviderResult> {
  const label = `${spec.platform}:${spec.model}`;
  const apiKey = apiKeyFor(spec.platform);
  if (!apiKey) {
    console.warn(`[chat] ${label}: no API key configured, skipping`);
    return { ok: false };
  }

  try {
    const res = await fetch(ENDPOINTS[spec.platform], {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: spec.model,
        messages,
        // Low, not zero: some providers reject temperature:0 outright, and a
        // tiny amount of randomness doesn't meaningfully hurt consistency
        // once the bigger sources of variance (retrieval, prompt wording)
        // are fixed — this mainly reduces run-to-run wording drift.
        temperature: 0.1,
        max_tokens: 1200,
        ...reasoningParamsFor(spec),
      }),
    });

    if (res.status === 429) {
      console.warn(`[chat] ${label}: rate limited (429)`);
      return { ok: false, rateLimited: true };
    }
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.warn(`[chat] ${label}: HTTP ${res.status} — ${body.slice(0, 300)}`);
      return { ok: false };
    }

    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const rawText = data.choices?.[0]?.message?.content;
    if (!rawText) {
      console.warn(`[chat] ${label}: empty content in response`);
      return { ok: false };
    }
    const text = stripThinkTags(rawText);
    if (!text) {
      console.warn(`[chat] ${label}: response was only a <think> block, no real answer`);
      return { ok: false };
    }
    if (isDegenerate(text)) {
      console.warn(`[chat] ${label}: rejected degenerate output (${text.length} chars)`);
      return { ok: false };
    }
    return { ok: true, text };
  } catch (err) {
    console.warn(`[chat] ${label}: request failed —`, err);
    return { ok: false };
  }
}

/** Tries each provider in the chain in order, falling through on rate-limit/error/degenerate output. */
export async function callWithFallback(
  messages: ChatMessage[],
  envChain?: string
): Promise<FallbackResult> {
  const chain = parseChain(envChain);
  for (const spec of chain) {
    const result = await callProvider(spec, messages);
    if (result.ok) return { ...result, providerUsed: `${spec.platform}:${spec.model}` };
  }
  console.error('[chat] all providers in the fallback chain failed');
  return { ok: false };
}
