/**
 * Two independent embedding providers, each with its own matching corpus
 * index (public/data/chat-embeddings-{gemini,openrouter}.json) — vectors
 * from different models live in different spaces and can never be compared
 * against each other, so a fallback provider needs its own precomputed
 * index, not just a fallback API call.
 *
 * Gemini is primary: far more generous free tier (1,500 requests/day vs
 * OpenRouter's 50/day) and no awkward truncation limits on long, heavily-
 * vocalized Arabic text. OpenRouter's liquid/lfm-2.5-embedding-350m:free is
 * the fallback if Gemini is ever unavailable.
 */

export const GEMINI_EMBEDDING_MODEL = 'gemini-embedding-001';
export const OPENROUTER_EMBEDDING_MODEL = 'liquid/lfm-2.5-embedding-350m:free';
// Unified output size for the Gemini index (it supports configurable
// dimensionality). OpenRouter's model has a fixed native size (1024) — the
// two indexes are never mixed, so they don't need to match each other.
export const GEMINI_EMBEDDING_DIMS = 768;
export const OPENROUTER_EMBEDDING_DIMS = 1024;

// This OpenRouter model's tokenizer is very inefficient on heavily-
// diacritized Arabic (tashkeel marks often tokenize almost 1:1 with
// characters) — a 700-char vocalized chunk measured at 684 tokens against
// this model's 512-token limit. 450 characters stayed safely under 512
// tokens even for the most heavily-vocalized Qur'an chunks in the corpus.
// Gemini has no such limit for our chunk sizes, so this only applies here.
const OPENROUTER_MAX_INPUT_CHARS = 450;

export type EmbeddingProvider = 'gemini' | 'openrouter';

export interface QueryEmbeddingResult {
  provider: EmbeddingProvider;
  vector: number[];
}

interface GeminiEmbedResponse {
  embedding?: { values: number[] };
}

/**
 * Gemini's batchEmbedContents endpoint turned out to enforce a much
 * stricter effective rate limit than single embedContent calls — likely
 * counting each item in the batch against a per-minute cap, so a 100-item
 * batch instantly exhausts it while individual calls sail through. Using
 * single calls throughout (looped, with light pacing for multi-text
 * indexing calls) is slower for bulk indexing but dramatically more
 * reliable, and query-time embedding is always a single text anyway.
 */
async function embedOneGemini(text: string, apiKey: string): Promise<number[] | null> {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_EMBEDDING_MODEL}:embedContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: { parts: [{ text }] },
          outputDimensionality: GEMINI_EMBEDDING_DIMS,
        }),
      }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as GeminiEmbedResponse;
    return data.embedding?.values ?? null;
  } catch {
    return null;
  }
}

async function embedBatchGemini(texts: string[], apiKey: string | undefined): Promise<number[][] | null> {
  if (!apiKey || texts.length === 0) return null;
  const results: number[][] = [];
  for (const text of texts) {
    const vec = await embedOneGemini(text, apiKey);
    if (!vec) return null;
    results.push(vec);
    // 1000ms/call was confirmed reliable empirically; 1500ms adds margin
    // for longer sequences during offline indexing. Query-time embedding is
    // always a single text, so this never affects live request latency.
    if (texts.length > 1) await new Promise(r => setTimeout(r, 1500));
  }
  return results;
}

interface OpenRouterEmbeddingResponse {
  data?: { embedding: number[] }[];
}

async function embedBatchOpenRouter(texts: string[], apiKey: string | undefined): Promise<number[][] | null> {
  if (!apiKey || texts.length === 0) return null;
  const truncated = texts.map(t => t.slice(0, OPENROUTER_MAX_INPUT_CHARS));
  try {
    const res = await fetch('https://openrouter.ai/api/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model: OPENROUTER_EMBEDDING_MODEL, input: truncated }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as OpenRouterEmbeddingResponse;
    if (!data.data || data.data.length !== texts.length) return null;
    return data.data.map(d => d.embedding);
  } catch {
    return null;
  }
}

/** Offline corpus indexing — used only by scripts/build-chat-embeddings.ts. */
export async function embedBatchForIndexing(
  provider: EmbeddingProvider,
  texts: string[],
  apiKey: string | undefined
): Promise<number[][] | null> {
  return provider === 'gemini' ? embedBatchGemini(texts, apiKey) : embedBatchOpenRouter(texts, apiKey);
}

/**
 * Embeds a single query, trying Gemini first and falling back to OpenRouter.
 * Returns which provider actually succeeded so the caller can match the
 * query vector against that provider's own index — never returns a vector
 * without saying which space it belongs to.
 */
export async function embedQuery(
  text: string,
  geminiApiKey: string | undefined,
  openRouterApiKey: string | undefined
): Promise<QueryEmbeddingResult | null> {
  const gemini = await embedBatchGemini([text], geminiApiKey);
  if (gemini) return { provider: 'gemini', vector: gemini[0] };

  const openrouter = await embedBatchOpenRouter([text], openRouterApiKey);
  if (openrouter) return { provider: 'openrouter', vector: openrouter[0] };

  return null;
}
