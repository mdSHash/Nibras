/**
 * Thin provider abstraction over Groq and OpenRouter (both OpenAI-compatible
 * chat-completions APIs), with a configurable fallback chain so the model
 * lineup can change (free-tier availability shifts) without a redeploy.
 *
 * LLM_PROVIDER_CHAIN env format: "platform:model,platform:model,..."
 *   e.g. "groq:allam-2-7b,groq:openai/gpt-oss-120b,openrouter:google/gemma-4-31b-it:free"
 *
 * Default chain picks: allam-2-7b (SDAIA's Arabic-native model, no hidden
 * reasoning-token overhead — verified to answer directly) first, gpt-oss-120b
 * (more capable, but a reasoning model — see reasoningParamsFor below) second,
 * a non-reasoning OpenRouter free model third.
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

const DEFAULT_CHAIN = 'groq:allam-2-7b,groq:openai/gpt-oss-120b,openrouter:google/gemma-4-31b-it:free';

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

async function callProvider(spec: ProviderSpec, messages: ChatMessage[]): Promise<ProviderResult> {
  const apiKey = apiKeyFor(spec.platform);
  if (!apiKey) return { ok: false };

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
        temperature: 0.25,
        max_tokens: 900,
        ...reasoningParamsFor(spec),
      }),
    });

    if (res.status === 429) return { ok: false, rateLimited: true };
    if (!res.ok) return { ok: false };

    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const text = data.choices?.[0]?.message?.content;
    if (!text) return { ok: false };
    return { ok: true, text };
  } catch {
    return { ok: false };
  }
}

/** Tries each provider in the chain in order, falling through on rate-limit/error. */
export async function callWithFallback(
  messages: ChatMessage[],
  envChain?: string
): Promise<FallbackResult> {
  const chain = parseChain(envChain);
  for (const spec of chain) {
    const result = await callProvider(spec, messages);
    if (result.ok) return { ...result, providerUsed: `${spec.platform}:${spec.model}` };
  }
  return { ok: false };
}
