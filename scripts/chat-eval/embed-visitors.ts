/**
 * Embeds the visitor set's questions once, as Gemini RETRIEVAL_QUERY vectors,
 * into tests/fixtures/chat-visitor-vectors.json, so semantic search runs in
 * tests and evals without spending quota. Only questions without a stored
 * vector are sent. Dry run unless --yes (spends Gemini quota: ask first).
 *
 *   npx tsx scripts/chat-eval/embed-visitors.ts [--yes]
 */
import fs from 'fs';
import { config } from 'dotenv';
import { EMBEDDING_MODELS, embedQueries } from '../../api/_lib/embeddings';
import { encodeVector } from '../../api/_lib/semanticIndex';
import { VISITOR_VECTORS, visitorQuestionTexts, type VisitorVectors } from './visitors';

config({ path: '.env.local', quiet: true });
const BATCH = 100;

async function main() {
  const { model, dims } = EMBEDDING_MODELS.gemini;
  const file: VisitorVectors = fs.existsSync(VISITOR_VECTORS)
    ? (JSON.parse(fs.readFileSync(VISITOR_VECTORS, 'utf8')) as VisitorVectors)
    : { model, dims, format: 'int8', vectors: {} };
  const texts = visitorQuestionTexts();
  const missing = texts.filter(t => !file.vectors[t]);
  const requests = Math.ceil(missing.length / BATCH);
  console.log(`${texts.length} questions, ${texts.length - missing.length} stored, ${missing.length} to embed (${requests} Gemini request${requests === 1 ? '' : 's'})`);
  if (missing.length === 0 || !process.argv.includes('--yes')) {
    if (missing.length) console.log('dry run: pass --yes to spend the quota');
    return;
  }
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY is not set (.env.local)');
  for (let i = 0; i < missing.length; i += BATCH) {
    const batch = missing.slice(i, i + BATCH);
    const outcome = await embedQueries('gemini', batch, key);
    if (!outcome.vectors) throw new Error(`Gemini: ${outcome.error ?? 'failed'}`);
    batch.forEach((text, j) => (file.vectors[text] = encodeVector(outcome.vectors![j], 'int8')));
  }
  // Fixture order, so a rerun gives the same file.
  const ordered = Object.fromEntries(texts.filter(t => file.vectors[t]).map(t => [t, file.vectors[t]]));
  fs.writeFileSync(VISITOR_VECTORS, `${JSON.stringify({ ...file, vectors: ordered }, null, 1)}\n`);
  console.log(`embedded ${missing.length}; ${Object.keys(ordered).length} stored`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
