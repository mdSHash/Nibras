/**
 * Embeds every chunk in the pre-built chat corpus (public/data/chat-corpus.json)
 * using both embedding providers, and writes each provider's vectors to its
 * own index file for semantic retrieval:
 *   - public/data/chat-embeddings-gemini.json     (primary, 768-dim)
 *   - public/data/chat-embeddings-openrouter.json (fallback, 1024-dim)
 *
 * Run after scripts/build-chat-corpus.ts (or whenever the corpus changes):
 *   npm run build:embeddings
 *
 * Requires GEMINI_API_KEY and/or OPENROUTER_API_KEY in .env.local. Either
 * key alone is enough to build that provider's index; missing a key just
 * skips that index (retrieval.ts degrades gracefully at runtime if an index
 * file is absent). This is a one-time/occasional offline step, not part of
 * the Vercel build — re-run manually and commit the output whenever the
 * underlying app data changes.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import {
  embedBatchForIndexing,
  GEMINI_EMBEDDING_MODEL,
  GEMINI_EMBEDDING_DIMS,
  OPENROUTER_EMBEDDING_MODEL,
  OPENROUTER_EMBEDDING_DIMS,
  type EmbeddingProvider,
} from '../api/_lib/embeddings';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: path.join(__dirname, '../.env.local') });

const BATCH_SIZE = 20;
// api/_lib/embeddings.ts now paces Gemini calls internally (individual
// embedContent calls, not the unreliable batchEmbedContents endpoint), so
// this only needs to be a small gap between chunks of work, not a rate-limit
// workaround.
const DELAY_MS = 3000;
const MAX_RETRIES = 3;

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function embedWithBackoff(
  provider: EmbeddingProvider,
  texts: string[],
  apiKey: string
): Promise<number[][] | null> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const result = await embedBatchForIndexing(provider, texts, apiKey);
    if (result) return result;
    if (attempt < MAX_RETRIES) {
      const backoff = 2000 * 2 ** attempt; // 2s, 4s, 8s, 16s, 32s
      console.warn(`[${provider}] batch failed (attempt ${attempt + 1}/${MAX_RETRIES + 1}) — waiting ${backoff / 1000}s...`);
      await sleep(backoff);
    }
  }
  return null;
}

function floatsToBase64(values: number[]): string {
  return Buffer.from(new Float32Array(values).buffer).toString('base64');
}

async function buildIndex(provider: EmbeddingProvider, apiKey: string | undefined, chunks: { id: string; text: string }[]) {
  if (!apiKey) {
    console.log(`\nSkipping ${provider} index — no API key in .env.local.`);
    return;
  }

  const outPath = path.join(__dirname, `../public/data/chat-embeddings-${provider}.json`);

  // Resume support: skip chunks already embedded in a prior partial run
  // rather than re-spending quota on them.
  const existing: { model: string; dims: number; ids: string[]; vectors: string[] } =
    fs.existsSync(outPath)
      ? JSON.parse(fs.readFileSync(outPath, 'utf-8'))
      : { model: '', dims: 0, ids: [], vectors: [] };
  const alreadyDone = new Set(existing.ids);
  const remaining = chunks.filter(c => !alreadyDone.has(c.id));

  console.log(
    `\nBuilding ${provider} index... (${existing.ids.length} already done, ${remaining.length} remaining)`
  );
  if (remaining.length === 0) {
    console.log(`[${provider}] nothing to do — index already complete.`);
    return;
  }

  const ids: string[] = [...existing.ids];
  const vectors: string[] = [...existing.vectors];
  let failedCount = 0;

  const model = provider === 'gemini' ? GEMINI_EMBEDDING_MODEL : OPENROUTER_EMBEDDING_MODEL;
  const dims = provider === 'gemini' ? GEMINI_EMBEDDING_DIMS : OPENROUTER_EMBEDDING_DIMS;

  for (let i = 0; i < remaining.length; i += BATCH_SIZE) {
    const batch = remaining.slice(i, i + BATCH_SIZE);
    const texts = batch.map(c => c.text);
    const embeddings = await embedWithBackoff(provider, texts, apiKey);

    if (!embeddings) {
      console.error(`[${provider}] batch ${i}-${i + batch.length} failed after all retries — skipping ${batch.length} chunks.`);
      failedCount += batch.length;
    } else {
      batch.forEach((c, j) => {
        ids.push(c.id);
        vectors.push(floatsToBase64(embeddings![j]));
      });
      // Save after every successful batch so an interruption never loses
      // progress — the next run resumes from here via the `alreadyDone` set.
      fs.writeFileSync(outPath, JSON.stringify({ model, dims, ids, vectors }));
    }

    console.log(`[${provider}] embedded ${Math.min(existing.ids.length + i + BATCH_SIZE, chunks.length)}/${chunks.length}`);
    await sleep(DELAY_MS);
  }

  console.log(`[${provider}] wrote ${ids.length} embeddings to ${path.relative(process.cwd(), outPath)}`);
  if (failedCount > 0) {
    console.warn(`[${provider}] ${failedCount} chunks could not be embedded for this index.`);
  }
}

async function main() {
  const corpusPath = path.join(__dirname, '../public/data/chat-corpus.json');
  const chunks = JSON.parse(fs.readFileSync(corpusPath, 'utf-8')) as { id: string; text: string }[];

  // Optional CLI arg to rebuild just one index, e.g. `tsx scripts/build-chat-embeddings.ts gemini`
  const only = process.argv[2] as EmbeddingProvider | undefined;
  if (!only || only === 'gemini') await buildIndex('gemini', process.env.GEMINI_API_KEY, chunks);
  if (!only || only === 'openrouter') await buildIndex('openrouter', process.env.OPENROUTER_API_KEY, chunks);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
