/**
 * Lexical (BM25-lite) retrieval over the pre-built chat corpus.
 *
 * Chosen over embeddings: the corpus is small (~1,200 chunks) and its
 * vocabulary is narrow and highly distinctive (battle/companion/place proper
 * nouns), which is exactly where term-overlap scoring matches or beats
 * embedding similarity without needing a second offline pipeline or a
 * binary asset to load on every cold start.
 */
import corpus from '../../public/data/chat-corpus.json' with { type: 'json' };
import { tokenizeQuery } from '../../shared/searchNormalize.js';

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
}

const CHUNKS = corpus as unknown as CorpusChunk[];
const CHUNK_TOKENS: string[][] = CHUNKS.map(c => c.normalizedText.split(' ').filter(Boolean));

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

/**
 * Score every chunk against the query and return the top matches above
 * `minScore`. An empty result means the corpus has nothing relevant to the
 * question — the caller must treat that as "not covered" and skip the LLM
 * call entirely (see api/chat.ts).
 */
export function retrieve(query: string, topK = 10, minScore = 0.5): RetrievedChunk[] {
  const queryTokens = tokenizeQuery(query);
  if (queryTokens.length === 0) return [];

  const scored: RetrievedChunk[] = [];
  for (let i = 0; i < CHUNKS.length; i++) {
    const tokens = CHUNK_TOKENS[i];
    const len = tokens.length || 1;
    let score = 0;
    for (const term of queryTokens) {
      const tf = tokens.reduce((count, t) => (t === term ? count + 1 : count), 0);
      if (tf === 0) continue;
      score += idf(term) * ((tf * (K1 + 1)) / (tf + K1 * (1 - B + (B * len) / AVG_LEN)));
    }
    if (score >= minScore) {
      scored.push({ ...CHUNKS[i], score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}
