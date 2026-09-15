/**
 * Builds the semantic-search indexes for the chat knowledge base
 * (public/data/chat-kb.json → public/data/chat-embeddings-{provider}.json).
 *
 * Vectors are keyed by unit id AND a hash of the exact embedded text, so a
 * re-run only embeds units that are new or whose text changed, and stale
 * vectors are dropped. Stops cleanly (keeping progress) when the provider
 * reports a quota/rate limit instead of hammering it with retries.
 *
 * Usage: npm run build:embeddings [gemini|openrouter]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import type { ChatKb } from '../shared/chatKb';
import { embedDocuments, embeddingText, EMBEDDING_MODELS, isEmbeddable, textHash, type EmbeddingProvider } from '../api/_lib/embeddings';
import type { EmbeddingIndexFile } from '../api/_lib/semanticIndex';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, '../.env.local'), quiet: true });

// Gemini counts every text inside a batch request against its free-tier
// limits (100/minute, 1,000/day), so batches are paced to ~80 texts/minute
// and a full index takes several daily runs — progress is kept between runs.
const BATCH_SIZE: Record<EmbeddingProvider, number> = { gemini: 40, openrouter: 64 };
const PAUSE_MS: Record<EmbeddingProvider, number> = { gemini: 32000, openrouter: 2000 };
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const MAX_MINUTE_RETRIES = 3;

function indexPath(provider: EmbeddingProvider) {
  return path.join(__dirname, `../public/data/chat-embeddings-${provider}.json`);
}

function readIndex(provider: EmbeddingProvider): EmbeddingIndexFile {
  const empty: EmbeddingIndexFile = { provider, model: EMBEDDING_MODELS[provider].model, dims: EMBEDDING_MODELS[provider].dims, ids: [], hashes: [], vectors: [] };
  try {
    const file = JSON.parse(fs.readFileSync(indexPath(provider), 'utf8')) as Partial<EmbeddingIndexFile>;
    if (file.provider !== provider || !Array.isArray(file.hashes)) return empty; // old format → rebuild
    return { ...empty, ...file } as EmbeddingIndexFile;
  } catch {
    return empty;
  }
}

function floatsToBase64(values: number[]): string {
  return Buffer.from(new Float32Array(values).buffer).toString('base64');
}

export async function buildIndex(provider: EmbeddingProvider, kb: ChatKb, apiKey: string | undefined): Promise<void> {
  const recordById = new Map(kb.records.map(r => [r.id, r]));
  const wanted = kb.units
    .filter(isEmbeddable)
    .map(unit => {
      const text = embeddingText(unit, recordById.get(unit.recordId), provider);
      return { id: unit.id, text, hash: textHash(text) };
    });

  const existing = readIndex(provider);
  const have = new Map(existing.ids.map((id, i) => [id, { hash: existing.hashes[i], vector: existing.vectors[i] }]));
  const kept = wanted.filter(w => have.get(w.id)?.hash === w.hash);
  const todo = wanted.filter(w => have.get(w.id)?.hash !== w.hash);

  const out: EmbeddingIndexFile = { ...existing, ids: [], hashes: [], vectors: [] };
  for (const w of kept) {
    out.ids.push(w.id);
    out.hashes.push(w.hash);
    out.vectors.push(have.get(w.id)!.vector);
  }
  const save = () => fs.writeFileSync(indexPath(provider), JSON.stringify(out));
  save(); // drops stale vectors even if nothing new can be embedded

  console.log(`[${provider}] ${kept.length}/${wanted.length} up to date, ${todo.length} to embed`);
  if (todo.length === 0) return;
  if (!apiKey) {
    console.warn(`[${provider}] no API key in .env.local — index left incomplete (runtime will not use it)`);
    return;
  }

  for (let i = 0; i < todo.length; i += BATCH_SIZE[provider]) {
    const batch = todo.slice(i, i + BATCH_SIZE[provider]);
    let outcome = await embedDocuments(provider, batch.map(b => b.text), apiKey);
    // A per-minute limit clears quickly: wait and retry. A daily limit (or an
    // unidentified rate limit that keeps recurring) ends today's run; the
    // saved progress is picked up by the next run.
    for (let attempt = 1; !outcome.vectors && attempt <= MAX_MINUTE_RETRIES && outcome.quota !== 'day'; attempt++) {
      const waitMs = outcome.rateLimited ? 65000 : 5000;
      console.warn(`[${provider}] ${outcome.rateLimited ? 'rate limited' : 'request failed'} — retrying in ${waitMs / 1000}s (${attempt}/${MAX_MINUTE_RETRIES})`);
      await sleep(waitMs);
      outcome = await embedDocuments(provider, batch.map(b => b.text), apiKey);
    }
    if (!outcome.vectors) {
      console.warn(`[${provider}] stopping at ${out.ids.length}/${wanted.length} (${outcome.quota === 'day' ? 'daily quota reached' : 'giving up for now'}): ${outcome.error}`);
      process.exitCode = outcome.quota === 'day' ? 0 : 2;
      return;
    }
    batch.forEach((b, j) => {
      out.ids.push(b.id);
      out.hashes.push(b.hash);
      out.vectors.push(floatsToBase64(outcome.vectors![j]));
    });
    save();
    console.log(`[${provider}] ${out.ids.length}/${wanted.length}`);
    await sleep(PAUSE_MS[provider]);
  }
  console.log(`[${provider}] index complete`);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (isMain) {
  const kb = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/data/chat-kb.json'), 'utf8')) as ChatKb;
  const only = process.argv[2] as EmbeddingProvider | undefined;
  (async () => {
    if (!only || only === 'gemini') await buildIndex('gemini', kb, process.env.GEMINI_API_KEY);
    if (!only || only === 'openrouter') await buildIndex('openrouter', kb, process.env.OPENROUTER_API_KEY);
  })().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
