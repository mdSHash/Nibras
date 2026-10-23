/**
 * Fails when the chat knowledge base and the Gemini embedding index are out of
 * sync (npm run verify, CI): every embeddable unit must have a vector made from
 * its current text, and the index holds nothing else. Semantic search only
 * runs on a complete index (api/_lib/semanticIndex.ts), so a gap here would
 * switch it off in production.
 *
 * Fix: run the "Chat index" workflow on the branch (Actions → Chat index →
 * Run workflow), or `npm run build:embeddings -- gemini` with a key.
 *
 * Usage: npm run check:chat-index
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { ChatKb, UnitKind } from '../shared/chatKb';
import { embeddingText, EMBEDDING_MODELS, isEmbeddable, textHash, type EmbeddingProvider } from '../api/_lib/embeddings';
import type { EmbeddingIndexFile } from '../api/_lib/semanticIndex';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export interface IndexSyncReport {
  /** Embeddable units with no vector for their current text. */
  missing: { id: string; kind: UnitKind }[];
  /** Vectors for units that are gone or whose text changed. */
  extra: string[];
  /** Problems with the file itself (provider, model, dims, format, shape). */
  fileProblems: string[];
}

export function checkIndexSync(kb: ChatKb, file: EmbeddingIndexFile, provider: EmbeddingProvider = 'gemini'): IndexSyncReport {
  const { model, dims } = EMBEDDING_MODELS[provider];
  const fileProblems: string[] = [];
  if (file.provider !== provider) fileProblems.push(`provider is ${file.provider}, expected ${provider}`);
  if (file.model !== model) fileProblems.push(`model is ${file.model}, expected ${model}`);
  if (file.dims !== dims) fileProblems.push(`dims is ${file.dims}, expected ${dims}`);
  if (file.format !== 'int8') fileProblems.push(`format is ${file.format ?? 'float32'}, expected int8`);
  if (file.ids.length !== file.hashes.length || file.ids.length !== file.vectors.length) fileProblems.push('ids, hashes and vectors differ in length');
  if (new Set(file.ids).size !== file.ids.length) fileProblems.push('duplicate unit ids');
  const bytesPerVector = file.format === 'int8' ? dims : dims * 4;
  const badLength = file.vectors.filter(v => Buffer.from(v, 'base64').byteLength !== bytesPerVector).length;
  if (badLength > 0) fileProblems.push(`${badLength} vectors are not ${dims} values long`);

  const recordById = new Map(kb.records.map(r => [r.id, r]));
  const wanted = new Map<string, string>();
  const missing: IndexSyncReport['missing'] = [];
  const have = new Map(file.ids.map((id, i) => [id, file.hashes[i]]));
  for (const unit of kb.units) {
    if (!isEmbeddable(unit)) continue;
    const hash = textHash(embeddingText(unit, recordById.get(unit.recordId), provider));
    wanted.set(unit.id, hash);
    if (have.get(unit.id) !== hash) missing.push({ id: unit.id, kind: unit.kind });
  }
  const extra = file.ids.filter((id, i) => wanted.get(id) !== file.hashes[i]);
  return { missing, extra, fileProblems };
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (isMain) {
  const read = (name: string) => JSON.parse(fs.readFileSync(path.join(__dirname, '../api/_data', name), 'utf8'));
  const kb = read('chat-kb.json') as ChatKb;
  const report = checkIndexSync(kb, read('chat-embeddings-gemini.json') as EmbeddingIndexFile);
  const embeddable = kb.units.filter(isEmbeddable).length;
  console.log(`[chat index] gemini: ${embeddable - report.missing.length}/${embeddable} units have a current vector`);
  for (const problem of report.fileProblems) console.error(`  file: ${problem}`);
  if (report.missing.length > 0) {
    const kinds = new Map<string, number>();
    for (const m of report.missing) kinds.set(m.kind, (kinds.get(m.kind) ?? 0) + 1);
    console.error(`  missing ${report.missing.length}: ${[...kinds].map(([kind, n]) => `${kind} ${n}`).join(', ')}`);
    for (const m of report.missing.slice(0, 20)) console.error(`    ${m.id}`);
    if (report.missing.length > 20) console.error(`    … and ${report.missing.length - 20} more`);
  }
  if (report.extra.length > 0) console.error(`  ${report.extra.length} stale vectors (unit gone or text changed), e.g. ${report.extra.slice(0, 3).join(', ')}`);
  if (report.missing.length > 0 || report.extra.length > 0 || report.fileProblems.length > 0) {
    console.error('The chat KB and its embedding index are out of sync. Run the "Chat index" workflow on this branch');
    console.error('(GitHub → Actions → Chat index → Run workflow), or `npm run build:embeddings -- gemini` with a key.');
    process.exit(1);
  }
}
