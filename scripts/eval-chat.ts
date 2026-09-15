/**
 * Live evaluation of the chat assistant against real model providers.
 *
 *   npm run eval:chat -- "سؤال" "سؤال آخر"      ad-hoc questions, verbose
 *   npm run eval:chat -- --golden [--set egyptian|conversation] [--limit N]
 *                                               a golden set in tests/fixtures
 *
 * In the conversation set, a case with "followUp": true is asked with the
 * context returned by the previous case, like the chat panel does.
 *
 * Golden-set checks per question: expected records retrieved, expected
 * facts present in the answer, out-of-scope questions refused. Groq's free
 * tier allows ~8K tokens/minute per model, so questions are spaced out.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import { normalizeForMatch } from '../shared/arabicText';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, '../.env.local'), quiet: true });

interface GoldenCase {
  q: string;
  followUp?: boolean;
  /** At least one of these record ids must be cited or retrieved. */
  records?: string[];
  /** Each fragment must appear in the answer (normalized comparison). */
  facts?: string[];
  outOfScope?: boolean;
}

const strip = (s: string) => s.replace(/[ً-ٰٟ]/g, '');
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function main() {
  const { answerQuestion } = await import('../api/chat');
  const args = process.argv.slice(2);
  const golden = args.includes('--golden');
  const limitAt = args.indexOf('--limit');
  const limit = limitAt !== -1 ? Number(args[limitAt + 1]) : Infinity;
  const gapAt = args.indexOf('--gap');
  const gapMs = gapAt !== -1 ? Number(args[gapAt + 1]) : golden ? 9000 : 0;
  const setAt = args.indexOf('--set');
  const fixture = setAt !== -1 ? `chat-golden-${args[setAt + 1]}.json` : 'chat-golden.json';

  const cases: GoldenCase[] = golden
    ? (JSON.parse(fs.readFileSync(path.join(__dirname, '../tests/fixtures', fixture), 'utf8')) as GoldenCase[]).slice(0, limit)
    : args.filter(a => !a.startsWith('--') && Number.isNaN(Number(a))).map(q => ({ q }));

  const results: Record<string, unknown>[] = [];
  let pass = 0;
  let previous: { recordIds: string[]; previousQuestion: string } | undefined;
  for (const [i, c] of cases.entries()) {
    if (i > 0 && gapMs) await sleep(gapMs);
    const { status, body, log } = await answerQuestion(c.q, { noCache: true, context: c.followUp ? previous : undefined });
    const ctx = (body as { context?: { recordIds: string[] } }).context;
    if (ctx?.recordIds?.length) previous = { recordIds: ctx.recordIds, previousQuestion: c.q };
    const b = body as {
      mode?: string;
      blocks?: { type: string; text?: string; key?: string; heading?: string; items?: string[] }[];
      citations?: { chunkId: string; sourceLabel: string }[];
    };
    const blockText = (x: { text?: string; heading?: string; items?: string[] }) => x.text ?? `${x.heading}: ${(x.items ?? []).join('، ')}`;
    const answerText = (b.blocks ?? []).map(blockText).join(' ');
    const normalizedAnswer = normalizeForMatch(answerText);
    const cited = new Set((b.citations ?? []).map(x => x.chunkId));
    const retrieved = new Set(log.entities as string[]);

    const problems: string[] = [];
    if (c.outOfScope) {
      if (b.mode !== 'not_covered') problems.push(`expected refusal, got ${b.mode ?? status}`);
    } else {
      if (status !== 200) problems.push(`status ${status}`);
      if (b.mode === 'not_covered') problems.push('refused an in-scope question');
      if (c.records && !c.records.some(r => cited.has(r) || retrieved.has(r))) problems.push(`missing record ${c.records.join('|')}`);
      for (const fact of c.facts ?? []) if (!normalizedAnswer.includes(normalizeForMatch(fact))) problems.push(`missing fact «${fact}»`);
    }
    if (problems.length === 0) pass++;

    const rejected = (log.rejected as { reason: string }[] | undefined) ?? [];
    console.log(`\n${problems.length ? '✗' : '✓'} [${i + 1}/${cases.length}] ${c.q}`);
    console.log(`  mode=${b.mode ?? status} provider=${log.provider ?? '-'} ms=${log.ms} confidence=${log.confidence} rejected=${rejected.length}${(log.carried as string[] | undefined)?.length ? ` carried=${(log.carried as string[]).join(',')}` : ''}`);
    if (!golden || problems.length) {
      console.log(`  entities: ${(log.entities as string[]).join(', ')} | intents: ${(log.intents as string[]).join(', ')}`);
      if (log.attempts) console.log(`  attempts: ${(log.attempts as string[]).join(' ; ')}`);
      for (const r of rejected) console.log(`  rejected: ${r.reason}`);
      for (const block of b.blocks ?? []) console.log(`  [${block.type}] ${block.key ? `${block.key}: ` : ''}${strip(blockText(block)).slice(0, 260)}`);
      console.log(`  citations: ${(b.citations ?? []).map(x => strip(x.sourceLabel)).join(' | ')}`);
    }
    for (const p of problems) console.log(`  problem: ${p}`);
    results.push({ q: c.q, status, mode: b.mode, problems, log, blocks: b.blocks });
  }

  console.log(`\n${pass}/${cases.length} passed`);
  const modes = results.reduce<Record<string, number>>((acc, r) => ((acc[String(r.mode)] = (acc[String(r.mode)] ?? 0) + 1), acc), {});
  const rejectedTotal = results.reduce((n, r) => n + (((r.log as Record<string, unknown>).rejected as unknown[] | undefined)?.length ?? 0), 0);
  console.log('modes:', modes, 'rejected sentences:', rejectedTotal);
  const out = path.join(process.env.EVAL_OUT_DIR ?? path.join(__dirname, '../test-results'), `chat-eval-${Date.now()}.json`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(results, null, 1));
  console.log(`report: ${path.relative(process.cwd(), out)}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
