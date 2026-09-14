/**
 * Hybrid retrieval: BM25 keyword search + semantic (embedding) search,
 * combined via Reciprocal Rank Fusion (RRF).
 *
 * Keyword search alone missed paraphrased/indirect questions and sometimes
 * mismatched on generic words (e.g. "فتح" matching the wrong "conquest"
 * chunk). Semantic search alone would miss exact proper-noun matches that
 * BM25 is very good at. RRF combines both rankings without needing to tune
 * relative score scales between two very different scoring systems.
 */
import corpus from '../../public/data/chat-corpus.json' with { type: 'json' };
import geminiEmbeddingsFile from '../../public/data/chat-embeddings-gemini.json' with { type: 'json' };
import openrouterEmbeddingsFile from '../../public/data/chat-embeddings-openrouter.json' with { type: 'json' };
import { tokenizeQuery } from '../../shared/searchNormalize.js';
import { embedQuery, type EmbeddingProvider } from './embeddings.js';

export interface CorpusChunk {
  id: string;
  type: string;
  text: string;
  normalizedText: string;
  era?: string;
  entityRefs: {
    eventId?: string;
    companionId?: string;
    quranKey?: string;
    battleId?: string;
    cityId?: string;
  };
  sourceLabel: string;
}

export interface RetrievedChunk extends CorpusChunk {
  score: number;
  matchedBy: ('keyword' | 'semantic')[];
}

const CHUNKS = corpus as unknown as CorpusChunk[];
const CHUNK_TOKENS: string[][] = CHUNKS.map(c => c.normalizedText.split(' ').filter(Boolean));

// ─── BM25 (keyword) index ───────────────────────────────────────────────────
const DOC_FREQ = new Map<string, number>();
for (const tokens of CHUNK_TOKENS) {
  for (const term of new Set(tokens)) {
    DOC_FREQ.set(term, (DOC_FREQ.get(term) || 0) + 1);
  }
}
const N = CHUNKS.length;
const AVG_LEN = CHUNK_TOKENS.reduce((sum, t) => sum + t.length, 0) / Math.max(1, N);
const K1 = 1.5;
const B = 0.75;

function idf(term: string): number {
  const df = DOC_FREQ.get(term) || 0;
  return Math.log((N - df + 0.5) / (df + 0.5) + 1);
}

function bm25ScoresAll(queryTokens: string[]): number[] {
  const scores = new Array(CHUNKS.length).fill(0);
  for (let i = 0; i < CHUNKS.length; i++) {
    const tokens = CHUNK_TOKENS[i];
    const len = tokens.length || 1;
    let score = 0;
    for (const term of queryTokens) {
      const tf = tokens.reduce((count, t) => (t === term ? count + 1 : count), 0);
      if (tf === 0) continue;
      score += idf(term) * ((tf * (K1 + 1)) / (tf + K1 * (1 - B + (B * len) / AVG_LEN)));
    }
    scores[i] = score;
  }
  return scores;
}

// ─── Semantic (embedding) indexes ───────────────────────────────────────────
// Two independent indexes, one per embedding provider — vectors from
// different models live in different spaces, so a query embedded by
// provider X can only ever be compared against provider X's own index.
interface EmbeddingsFile { model: string; dims: number; ids: string[]; vectors: string[] }
const CHUNK_INDEX_BY_ID = new Map(CHUNKS.map((c, i) => [c.id, i]));

function buildEmbeddingIndex(file: unknown): Map<number, Float32Array> {
  const data = file as EmbeddingsFile;
  const index = new Map<number, Float32Array>();
  data.ids.forEach((id, i) => {
    const chunkIndex = CHUNK_INDEX_BY_ID.get(id);
    if (chunkIndex === undefined) return;
    const buf = Buffer.from(data.vectors[i], 'base64');
    index.set(chunkIndex, new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4));
  });
  return index;
}

const EMBEDDING_INDEX: Record<EmbeddingProvider, Map<number, Float32Array>> = {
  gemini: buildEmbeddingIndex(geminiEmbeddingsFile),
  openrouter: buildEmbeddingIndex(openrouterEmbeddingsFile),
};

function cosineSimilarity(a: Float32Array, b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-8);
}

// ─── Fusion ──────────────────────────────────────────────────────────────────
const BM25_RELEVANCE_MIN = 0.5;
// Calibrated per-provider by measuring known related vs. unrelated Arabic
// pairs directly against each model — their similarity distributions are NOT
// comparable. Gemini's embedding space runs much "hotter" overall: unrelated
// pairs scored ~0.44-0.46 and related pairs ~0.80-0.89, so a threshold tuned
// for OpenRouter (unrelated ~0.17, related ~0.58) would treat almost
// everything as relevant if reused for Gemini.
const SEMANTIC_RELEVANCE_MIN: Record<EmbeddingProvider, number> = {
  gemini: 0.6,
  openrouter: 0.35,
};
const RRF_K = 60; // standard Reciprocal Rank Fusion constant
const TOP_K = 10;

/**
 * Retrieves the most relevant chunks for a query using both keyword and
 * semantic signals. If the embedding call fails or is rate-limited, this
 * degrades gracefully to keyword-only search rather than failing the request.
 *
 * An empty result means nothing in the corpus clears either method's
 * relevance bar — the caller must treat that as "not covered" and skip the
 * LLM call entirely (see api/chat.ts).
 */
export async function hybridRetrieve(
  query: string,
  geminiApiKey: string | undefined,
  openRouterApiKey: string | undefined
): Promise<RetrievedChunk[]> {
  const queryTokens = tokenizeQuery(query);
  if (queryTokens.length === 0) return [];

  const bm25Scores = bm25ScoresAll(queryTokens);
  const bm25Ranked = bm25Scores
    .map((score, i) => ({ i, score }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score);
  const bm25RankByIndex = new Map<number, number>();
  bm25Ranked.forEach((x, rank) => bm25RankByIndex.set(x.i, rank + 1));

  let semanticRanked: { i: number; score: number }[] = [];
  let semanticMin = SEMANTIC_RELEVANCE_MIN.gemini;
  const queryEmbedding = await embedQuery(query, geminiApiKey, openRouterApiKey);
  if (queryEmbedding) {
    semanticMin = SEMANTIC_RELEVANCE_MIN[queryEmbedding.provider];
    const index = EMBEDDING_INDEX[queryEmbedding.provider];
    const sims: { i: number; score: number }[] = [];
    for (const [chunkIndex, vec] of index) {
      sims.push({ i: chunkIndex, score: cosineSimilarity(vec, queryEmbedding.vector) });
    }
    semanticRanked = sims.sort((a, b) => b.score - a.score);
  }
  const semanticRankByIndex = new Map<number, number>();
  semanticRanked.forEach((x, rank) => semanticRankByIndex.set(x.i, rank + 1));

  // Candidacy: a chunk must clear at least one method's own relevance bar —
  // RRF only decides ORDER among candidates, not whether something counts as
  // relevant at all (RRF scores aren't comparable to either method's raw scale).
  const candidates = new Set<number>();
  bm25Ranked.filter(x => x.score >= BM25_RELEVANCE_MIN).forEach(x => candidates.add(x.i));
  semanticRanked.filter(x => x.score >= semanticMin).forEach(x => candidates.add(x.i));

  if (candidates.size === 0) return [];

  const fused: RetrievedChunk[] = [...candidates].map(i => {
    const matchedBy: RetrievedChunk['matchedBy'] = [];
    let score = 0;
    const kwRank = bm25RankByIndex.get(i);
    if (kwRank !== undefined) {
      score += 1 / (RRF_K + kwRank);
      matchedBy.push('keyword');
    }
    const semRank = semanticRankByIndex.get(i);
    if (semRank !== undefined) {
      score += 1 / (RRF_K + semRank);
      matchedBy.push('semantic');
    }
    return { ...CHUNKS[i], score, matchedBy };
  });

  fused.sort((a, b) => b.score - a.score);
  return fused.slice(0, TOP_K);
}
