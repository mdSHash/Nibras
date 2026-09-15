/**
 * Semantic-search embeddings. Two providers, each with its own precomputed
 * index (vectors from different models are never comparable):
 *   - Gemini gemini-embedding-001 (primary: 1,000 free requests/day)
 *   - OpenRouter liquid/lfm-2.5-embedding-350m:free (secondary)
 *
 * Index files store a short hash of the exact text each vector was made from.
 * A provider is only used at query time when its index covers EVERY
 * embeddable unit of the current knowledge base with matching hashes — a
 * partial or stale index is ignored instead of silently searching half the
 * data (see coverage in semanticIndex.ts).
 */
import crypto from 'crypto';
import type { KbRecord, KbUnit, UnitKind } from '../../shared/chatKb.js';
import { stripDiacritics } from '../../shared/arabicText.js';

export type EmbeddingProvider = 'gemini' | 'openrouter';

export const EMBEDDING_MODELS: Record<EmbeddingProvider, { model: string; dims: number; maxChars: number }> = {
  gemini: { model: 'gemini-embedding-001', dims: 768, maxChars: 2000 },
  // This model's tokenizer is inefficient on Arabic and caps inputs at 512
  // tokens; diacritic-free text at 700 chars stays under it.
  openrouter: { model: 'liquid/lfm-2.5-embedding-350m:free', dims: 1024, maxChars: 700 },
};

/** Lists and bare facts are reached by name matching and keyword search. */
const NOT_EMBEDDED: ReadonlySet<UnitKind> = new Set([
  'event_date',
  'event_location',
  'event_army',
  'event_duration',
  'event_figures',
  'event_sources',
  'event_quran',
  'companion_events',
  'battle_phases',
  'battle_landmarks',
  'list',
]);

export function isEmbeddable(unit: KbUnit): boolean {
  return !NOT_EMBEDDED.has(unit.kind);
}

export function embeddingText(unit: KbUnit, record: KbRecord | undefined, provider: EmbeddingProvider): string {
  const text = stripDiacritics(`${record?.title ?? ''}: ${unit.text}`).replace(/\s+/g, ' ').trim();
  return text.slice(0, EMBEDDING_MODELS[provider].maxChars);
}

export function textHash(text: string): string {
  return crypto.createHash('sha1').update(text).digest('hex').slice(0, 12);
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export interface EmbedOutcome {
  vectors: number[][] | null;
  /** True when the provider refused because of quota/rate limits. */
  rateLimited: boolean;
  /** Which limit was hit, when the provider says (Gemini names its quota). */
  quota?: 'minute' | 'day';
  error?: string;
}

function quotaWindow(body: string): EmbedOutcome['quota'] {
  if (/PerDay/i.test(body)) return 'day';
  if (/PerMinute/i.test(body)) return 'minute';
  return undefined;
}

async function embedGemini(texts: string[], apiKey: string, taskType: string, timeoutMs: number): Promise<EmbedOutcome> {
  const { model, dims } = EMBEDDING_MODELS.gemini;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:batchEmbedContents?key=${apiKey}`;
  try {
    const res = await fetchWithTimeout(
      url,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: texts.map(text => ({
            model: `models/${model}`,
            content: { parts: [{ text }] },
            taskType,
            outputDimensionality: dims,
          })),
        }),
      },
      timeoutMs
    );
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      return { vectors: null, rateLimited: res.status === 429, quota: quotaWindow(body), error: `HTTP ${res.status} ${body.slice(0, 200)}` };
    }
    const data = (await res.json()) as { embeddings?: { values: number[] }[] };
    if (!data.embeddings || data.embeddings.length !== texts.length) return { vectors: null, rateLimited: false, error: 'bad response shape' };
    return { vectors: data.embeddings.map(e => e.values), rateLimited: false };
  } catch (err) {
    return { vectors: null, rateLimited: false, error: String(err) };
  }
}

async function embedOpenRouter(texts: string[], apiKey: string, timeoutMs: number): Promise<EmbedOutcome> {
  try {
    const res = await fetchWithTimeout(
      'https://openrouter.ai/api/v1/embeddings',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ model: EMBEDDING_MODELS.openrouter.model, input: texts }),
      },
      timeoutMs
    );
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      return { vectors: null, rateLimited: res.status === 429, error: `HTTP ${res.status} ${body.slice(0, 200)}` };
    }
    const data = (await res.json()) as { data?: { embedding: number[] }[] };
    if (!data.data || data.data.length !== texts.length) return { vectors: null, rateLimited: false, error: 'bad response shape' };
    return { vectors: data.data.map(d => d.embedding), rateLimited: false };
  } catch (err) {
    return { vectors: null, rateLimited: false, error: String(err) };
  }
}

/** Offline indexing (scripts/build-chat-embeddings.ts). */
export function embedDocuments(provider: EmbeddingProvider, texts: string[], apiKey: string): Promise<EmbedOutcome> {
  return provider === 'gemini' ? embedGemini(texts, apiKey, 'RETRIEVAL_DOCUMENT', 60000) : embedOpenRouter(texts, apiKey, 60000);
}

/** Query-time embedding for one provider, with a tight timeout. */
export async function embedQueryWith(provider: EmbeddingProvider, text: string, apiKey: string | undefined, timeoutMs = 2500): Promise<number[] | null> {
  if (!apiKey) return null;
  const input = stripDiacritics(text).slice(0, EMBEDDING_MODELS[provider].maxChars);
  const outcome = provider === 'gemini' ? await embedGemini([input], apiKey, 'RETRIEVAL_QUERY', timeoutMs) : await embedOpenRouter([input], apiKey, timeoutMs);
  if (!outcome.vectors) {
    console.warn(`[chat] ${provider} query embedding failed: ${outcome.error ?? 'unknown'}`);
    return null;
  }
  return outcome.vectors[0];
}
