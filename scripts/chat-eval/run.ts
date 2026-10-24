/**
 * `npm run eval:chat -- --visitors [--offline] [--sample] [--only id,id] [--gap ms]`
 *
 * Runs the visitor question set and flows through answerQuestion and writes
 * one trace per turn (test-results/chat-visitors-<time>.json and .md).
 *  --offline  the copy model instead of the providers: no network, no quota.
 *  --sample   only the cases in the fixture's `liveSample` (the before/after run).
 *  --keyword-only  no semantic search (as when the Gemini call fails).
 * Query vectors always come from tests/fixtures/chat-visitor-vectors.json, so
 * a live run spends model calls only, never a Gemini embedding.
 */
import fs from 'fs';
import path from 'path';
import { answerQuestion } from '../../api/chat';
import { formatTrace, newTrace } from '../../api/_lib/trace';
import { stripVowelMarks } from '../../shared/arabic';
import type { AnswerBlock } from '../../shared/chatApi';
import { installCopyModel } from './copyModel';
import { checkTurn, fixtureEmbedder, loadVisitors, runFlow, type AnswerFn, type TurnResult } from './visitors';

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

function blockLines(blocks: AnswerBlock[]): string[] {
  return blocks.map(b => {
    if (b.type === 'quran') return `> [quran] ${b.key}`;
    if (b.type === 'list') return `> [list] ${stripVowelMarks(b.heading)}: ${b.items.map(stripVowelMarks).join('، ')}`;
    return `> [${b.type}] ${stripVowelMarks(b.text)}`;
  });
}

export async function runVisitorsEval(args: string[]) {
  const offline = args.includes('--offline');
  const sample = args.includes('--sample');
  const onlyAt = args.indexOf('--only');
  const only = onlyAt !== -1 ? new Set(args[onlyAt + 1].split(',')) : null;
  const gapAt = args.indexOf('--gap');
  const gapMs = gapAt !== -1 ? Number(args[gapAt + 1]) : offline ? 0 : 9000;
  const fixture = loadVisitors();
  const wanted = (id: string) => (!only || only.has(id)) && (!sample || (fixture.liveSample ?? []).includes(id));
  const questions = fixture.questions.filter(q => wanted(q.id));
  const flows = fixture.flows.filter(f => wanted(f.id));
  const uninstall = offline ? installCopyModel() : () => {};
  const embed = args.includes('--keyword-only') ? async () => null : fixtureEmbedder();

  let calls = 0;
  const answer: AnswerFn = async (q, context) => {
    if (calls++ > 0 && gapMs) await sleep(gapMs);
    const trace = newTrace(q);
    const { status, body } = await answerQuestion(q, { noCache: true, trace, embed, context });
    return { status, body, trace };
  };

  const sections: { id: string; results: TurnResult[]; gaps: (string | undefined)[] }[] = [];
  for (const question of questions) {
    const { status, body, trace } = await answer(question.q, undefined);
    sections.push({ id: question.id, results: [{ q: question.q, status, body, trace, problems: checkTurn(question, status, body, trace, !offline) }], gaps: [question.knownGap] });
    report(sections.at(-1)!);
  }
  for (const flow of flows) {
    sections.push({ id: flow.id, results: await runFlow(flow, answer, !offline), gaps: flow.turns.map(t => t.knownGap) });
    report(sections.at(-1)!);
  }
  uninstall();

  const turns = sections.flatMap(s => s.results);
  const failed = turns.filter(t => t.problems.length > 0).length;
  const llmCalls = turns.reduce((n, t) => n + (t.trace.llm?.attempts.length ?? 0), 0);
  const summary = `${turns.length - failed}/${turns.length} turns passed (${questions.length} questions, ${flows.length} flows); model attempts: ${llmCalls}${offline ? ' (copy model, offline)' : ''}`;
  console.log(`\n${summary}`);

  const out = path.join(process.env.EVAL_OUT_DIR ?? 'test-results', `chat-visitors-${Date.now()}`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(`${out}.json`, JSON.stringify(sections, null, 1));
  const fence = '```';
  const md = sections.flatMap(s => [
    `## ${s.id}`,
    ...s.results.flatMap((r, i) => [
      `### ${r.q}${s.gaps[i] ? ` (known gap: ${s.gaps[i]})` : ''}`,
      [fence, formatTrace(r.trace), fence].join('\n'),
      'blocks' in r.body ? blockLines(r.body.blocks).join('\n') : `> error ${r.status}`,
      ...r.problems.map(p => `- problem: ${p}`),
    ]),
  ]);
  fs.writeFileSync(`${out}.md`, [`# Chat visitors ${new Date().toISOString()}`, summary, ...md, ''].join('\n\n'));
  console.log(`report: ${out}.json (+ .md)`);
}

function report(section: { id: string; results: TurnResult[]; gaps: (string | undefined)[] }) {
  for (const [i, r] of section.results.entries()) {
    const mark = r.problems.length === 0 ? '✓' : section.gaps[i] ? '·' : '✗';
    console.log(`${mark} ${section.id}${section.results.length > 1 ? ` #${i + 1}` : ''} «${r.q}» ${r.trace.mode ?? r.status}${r.problems.length ? ` — ${r.problems.join('; ')}` : ''}`);
  }
}
