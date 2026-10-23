/**
 * Builds the semantic-search indexes for the chat knowledge base
 * (api/_data/chat-kb.json → api/_data/chat-embeddings-{provider}.json).
 *
 * Vectors are keyed by unit id AND a hash of the exact embedded text, so a
 * re-run only embeds units that are new or whose text changed, and stale
 * vectors are dropped. Stops cleanly (keeping progress) when the provider
 * reports a quota/rate limit instead of hammering it with retries.
 *
 * Vectors are stored as int8 (semanticIndex.ts); an older float32 file is
 * converted on read, without calling the provider.
 *
 * Usage: npm run build:embeddings -- [gemini|openrouter] [--max N]
 *   --max N  embed at most N texts this run (default 200; 0 only converts and
 *            drops stale vectors). Every text counts against the free tier.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import type { ChatKb } from '../shared/chatKb';
import { embedDocuments, embeddingText, EMBEDDING_MODELS, isEmbeddable, textHash, type EmbeddingProvider } from '../api/_lib/embeddings';
import { decodeVector, encodeVector, type EmbeddingIndexFile } from '../api/_lib/semanticIndex';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, '../.env.local'), quiet: true });

// Gemini counts every text inside a batch request against its free-tier
// limits (100/minute, 1,000/day), so batches are paced to ~80 texts/minute
// and a full index takes several daily runs — progress is kept between runs.
const BATCH_SIZE: Record<EmbeddingProvider, number> = { gemini: 40, openrouter: 64 };
const PAUSE_MS: Record<EmbeddingProvider, number> = { gemini: 32000, openrouter: 2000 };
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const MAX_MINUTE_RETRIES = 3;
const DEFAULT_MAX_TEXTS = 200;

function indexPath(provider: EmbeddingProvider) {
  return path.join(__dirname, `../api/_data/chat-embeddings-${provider}.json`);
}

function readIndex(provider: EmbeddingProvider): EmbeddingIndexFile {
  const empty: EmbeddingIndexFile = { provider, model: EMBEDDING_MODELS[provider].model, dims: EMBEDDING_MODELS[provider].dims, format: 'int8', ids: [], hashes: [], vectors: [] };
  try {
    const file = JSON.parse(fs.readFileSync(indexPath(provider), 'utf8')) as Partial<EmbeddingIndexFile>;
    if (file.provider !== provider || !Array.isArray(file.hashes) || !Array.isArray(file.vectors)) return empty; // old format → rebuild
    const vectors = file.format === 'int8' ? file.vectors : file.vectors.map(v => encodeVector(decodeVector(v, 'float32'), 'int8'));
    return { ...empty, ...file, format: 'int8', vectors } as EmbeddingIndexFile;
  } catch {
    return empty;
  }
}

export async function buildIndex(provider: EmbeddingProvider, kb: ChatKb, apiKey: string | undefined, maxTexts = DEFAULT_MAX_TEXTS): Promise<void> {
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
  // Written in KB order, so the same vectors always give the same file (new vectors would
  // otherwise sit at the end until a later run moved them, and that run would commit a change).
  const order = new Map(wanted.map((w, i) => [w.id, i]));
  const save = () => {
    const at = out.ids.map((_, i) => i).sort((a, b) => order.get(out.ids[a])! - order.get(out.ids[b])!);
    const sorted = { ...out, ids: at.map(i => out.ids[i]), hashes: at.map(i => out.hashes[i]), vectors: at.map(i => out.vectors[i]) };
    fs.writeFileSync(indexPath(provider), JSON.stringify(sorted));
  };
  save(); // drops stale vectors even if nothing new can be embedded

  console.log(`[${provider}] ${kept.length}/${wanted.length} up to date, ${todo.length} to embed (at most ${maxTexts} this run)`);
  if (todo.length === 0) return;
  if (maxTexts <= 0) return;
  if (!apiKey) {
    console.warn(`[${provider}] no API key in .env.local — index left incomplete (runtime will not use it)`);
    return;
  }

  const thisRun = todo.slice(0, maxTexts);
  for (let i = 0; i < thisRun.length; i += BATCH_SIZE[provider]) {
    const batch = thisRun.slice(i, i + BATCH_SIZE[provider]);
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
      out.vectors.push(encodeVector(outcome.vectors![j], 'int8'));
    });
    save();
    console.log(`[${provider}] ${out.ids.length}/${wanted.length}`);
    await sleep(PAUSE_MS[provider]);
  }
  console.log(thisRun.length === todo.length ? `[${provider}] index complete` : `[${provider}] stopped at --max ${maxTexts}; ${todo.length - thisRun.length} left for the next run`);
}

function maxTextsArg(argv: string[]): number {
  const at = argv.indexOf('--max');
  if (at === -1) return DEFAULT_MAX_TEXTS;
  const value = Number(argv[at + 1]);
  if (!Number.isInteger(value) || value < 0) throw new Error(`--max needs a whole number, got ${argv[at + 1]}`);
  return value;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (isMain) {
  const kb = JSON.parse(fs.readFileSync(path.join(__dirname, '../api/_data/chat-kb.json'), 'utf8')) as ChatKb;
  const args = process.argv.slice(2);
  const only = args.find(a => a === 'gemini' || a === 'openrouter') as EmbeddingProvider | undefined;
  const maxTexts = maxTextsArg(args);
  (async () => {
    if (!only || only === 'gemini') await buildIndex('gemini', kb, process.env.GEMINI_API_KEY, maxTexts);
    if (!only || only === 'openrouter') await buildIndex('openrouter', kb, process.env.OPENROUTER_API_KEY, maxTexts);
  })().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
