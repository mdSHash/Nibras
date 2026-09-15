/**
 * Loads the precomputed embedding indexes and decides, per provider, whether
 * the index is usable for the current knowledge base.
 */
import geminiIndexJson from '../../public/data/chat-embeddings-gemini.json' with { type: 'json' };
import openrouterIndexJson from '../../public/data/chat-embeddings-openrouter.json' with { type: 'json' };
import { embeddingText, isEmbeddable, textHash, type EmbeddingProvider } from './embeddings.js';
import type { LoadedKb } from './kb.js';

export interface EmbeddingIndexFile {
  provider: EmbeddingProvider;
  model: string;
  dims: number;
  ids: string[];
  hashes: string[];
  vectors: string[];
}

export interface ProviderIndex {
  provider: EmbeddingProvider;
  /** Fraction of embeddable units with an up-to-date vector. */
  coverage: number;
  usable: boolean;
  unitIndexes: number[];
  vectors: Float32Array[];
}

function decode(base64: string): Float32Array {
  const buf = Buffer.from(base64, 'base64');
  const copy = new Float32Array(buf.byteLength / 4);
  new Uint8Array(copy.buffer).set(buf);
  let norm = 0;
  for (const v of copy) norm += v * v;
  norm = Math.sqrt(norm) || 1;
  for (let i = 0; i < copy.length; i++) copy[i] /= norm;
  return copy;
}

export function buildProviderIndex(kb: LoadedKb, file: EmbeddingIndexFile | undefined, provider: EmbeddingProvider): ProviderIndex {
  const empty: ProviderIndex = { provider, coverage: 0, usable: false, unitIndexes: [], vectors: [] };
  if (!file || !Array.isArray(file.ids) || file.provider !== provider) return empty;
  const position = new Map(file.ids.map((id, i) => [id, i]));
  const unitIndexes: number[] = [];
  const vectors: Float32Array[] = [];
  let embeddable = 0;
  kb.units.forEach((unit, unitIndex) => {
    if (!isEmbeddable(unit)) return;
    embeddable++;
    const at = position.get(unit.id);
    if (at === undefined) return;
    const expected = textHash(embeddingText(unit, kb.recordById.get(unit.recordId), provider));
    if (file.hashes[at] !== expected) return;
    unitIndexes.push(unitIndex);
    vectors.push(decode(file.vectors[at]));
  });
  const coverage = embeddable === 0 ? 0 : unitIndexes.length / embeddable;
  return { provider, coverage, usable: coverage === 1, unitIndexes, vectors };
}

const cache = new Map<EmbeddingProvider, ProviderIndex>();

export function getProviderIndex(kb: LoadedKb, provider: EmbeddingProvider): ProviderIndex {
  let index = cache.get(provider);
  if (!index) {
    const file = (provider === 'gemini' ? geminiIndexJson : openrouterIndexJson) as unknown as EmbeddingIndexFile;
    index = buildProviderIndex(kb, file, provider);
    if (!index.usable) {
      console.warn(`[chat] ${provider} embedding index covers ${(index.coverage * 100).toFixed(1)}% of the knowledge base — not used`);
    }
    cache.set(provider, index);
  }
  return index;
}

/** Cosine similarity of the query against every indexed unit. */
export function semanticScores(index: ProviderIndex, query: number[]): { unitIndex: number; score: number }[] {
  let norm = 0;
  for (const v of query) norm += v * v;
  norm = Math.sqrt(norm) || 1;
  const results: { unitIndex: number; score: number }[] = [];
  for (let i = 0; i < index.vectors.length; i++) {
    const vec = index.vectors[i];
    let dot = 0;
    for (let j = 0; j < vec.length; j++) dot += vec[j] * query[j];
    results.push({ unitIndex: index.unitIndexes[i], score: dot / norm });
  }
  return results.sort((a, b) => b.score - a.score);
}
