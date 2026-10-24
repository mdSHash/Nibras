/**
 * The visitor question set (tests/fixtures/chat-visitors.json): questions and
 * multi-turn flows asked the way visitors ask, with checks on what retrieval
 * kept. Shared by the offline Vitest harness (tests/chatVisitors.test.ts) and
 * the live eval (npm run eval:chat -- --visitors).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { ChatErrorBody, ChatRequestContext, ChatSuccessBody } from '../../shared/chatApi';
import type { ChatTrace } from '../../api/_lib/trace';
import type { QueryEmbedder } from '../../api/_lib/search';
import { decodeVector } from '../../api/_lib/semanticIndex';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const VISITORS_FIXTURE = path.join(__dirname, '../../tests/fixtures/chat-visitors.json');
export const VISITOR_VECTORS = path.join(__dirname, '../../tests/fixtures/chat-visitor-vectors.json');

export interface TurnChecks {
  /** At least one of these records is in the evidence. */
  records?: string[];
  /** Every one of these units is in the evidence. */
  units?: string[];
  /** None of these records is linked or in the evidence. */
  notRecords?: string[];
  outOfScope?: boolean;
  shape?: string;
  /** Fails today, and why; the harness expects it to fail until fixed. */
  knownGap?: string;
}

export interface VisitorQuestion extends TurnChecks {
  id: string;
  q: string;
  style: 'egyptian' | 'formal' | 'misspelled' | 'short' | 'vague' | 'uncovered';
}

/** A turn is typed (`q`) or a pressed suggestion (index into the previous answer's follow-ups). */
export interface FlowTurn extends TurnChecks {
  q?: string;
  suggestion?: number;
}

export interface VisitorFlow {
  id: string;
  turns: FlowTurn[];
}

export interface VisitorFixture {
  questions: VisitorQuestion[];
  flows: VisitorFlow[];
  /** Question and flow ids of the real-model before/after run (`--sample`). */
  liveSample?: string[];
}

export function loadVisitors(): VisitorFixture {
  return JSON.parse(fs.readFileSync(VISITORS_FIXTURE, 'utf8')) as VisitorFixture;
}

export interface TurnResult {
  q: string;
  status: number;
  body: ChatSuccessBody | ChatErrorBody;
  trace: ChatTrace;
  problems: string[];
}

export type AnswerFn = (question: string, context: ChatRequestContext | undefined) => Promise<{ status: number; body: ChatSuccessBody | ChatErrorBody; trace: ChatTrace }>;

const isSuccess = (body: ChatSuccessBody | ChatErrorBody): body is ChatSuccessBody => 'blocks' in body;

/**
 * Offline (`live` false) a refusal cannot be checked, since the scripted model
 * always answers: an out-of-scope question must instead reach no confident
 * subject (no strong entity, confidence below high). Live, it must be refused.
 */
export function checkTurn(checks: TurnChecks, status: number, body: ChatSuccessBody | ChatErrorBody, trace: ChatTrace, live: boolean): string[] {
  const problems: string[] = [];
  const keptRecords = new Set(trace.evidence.kept.map(k => k.record));
  const keptUnits = new Set(trace.evidence.kept.flatMap(k => k.units));
  const linked = new Set(trace.entities.filter(e => e.strong).map(e => e.id));
  const mode = isSuccess(body) ? body.mode : `error ${status}`;

  if (checks.outOfScope) {
    if (live && mode !== 'not_covered') problems.push(`expected a refusal, got ${mode}`);
    if (!live && mode !== 'not_covered' && (linked.size > 0 || trace.confidence === 'high')) {
      problems.push(`out of scope but confident (${trace.confidence}; linked ${[...linked].join(', ') || 'none'})`);
    }
    return problems;
  }
  if (mode === 'not_covered') problems.push('refused an in-scope question');
  else if (!isSuccess(body)) problems.push(`status ${status}`);
  if (checks.records && !checks.records.some(r => keptRecords.has(r))) problems.push(`missing record ${checks.records.join(' | ')}`);
  for (const unit of checks.units ?? []) if (!keptUnits.has(unit)) problems.push(`missing unit ${unit}`);
  for (const record of checks.notRecords ?? []) {
    if (linked.has(record) || keptRecords.has(record)) problems.push(`off-topic record ${record}`);
  }
  return problems;
}

/** Runs one flow the way the chat panel does: context from the last answer that had one. */
export async function runFlow(flow: VisitorFlow, answer: AnswerFn, live: boolean): Promise<TurnResult[]> {
  const results: TurnResult[] = [];
  let context: ChatRequestContext | undefined;
  let followUps: string[] = [];
  for (const [i, turn] of flow.turns.entries()) {
    const q = turn.q ?? followUps[turn.suggestion ?? 0];
    if (!q) {
      results.push({ q: `(suggestion ${turn.suggestion})`, status: 0, body: { error: 'no_suggestion', messageAr: '' }, trace: emptyTrace(), problems: [`turn ${i + 1}: no suggestion ${turn.suggestion} under the previous answer`] });
      break;
    }
    const { status, body, trace } = await answer(q, context);
    results.push({ q, status, body, trace, problems: checkTurn(turn, status, body, trace, live) });
    if (isSuccess(body)) {
      if (body.context.recordIds.length > 0) context = { recordIds: body.context.recordIds, previousQuestion: body.context.question ?? q };
      followUps = body.followUps;
    } else {
      followUps = [];
    }
  }
  return results;
}

function emptyTrace(): ChatTrace {
  return { question: '', intents: [], entities: [], context: { sent: [], carried: [], previousQuestionShown: false }, keyword: [], semantic: { ran: false, notes: [], top: [] }, fusion: [], confidence: 'none', evidence: { kept: [], cut: [], chars: 0 }, rejected: [], ms: {} };
}

export interface VisitorVectors {
  model: string;
  dims: number;
  format: 'int8';
  /** Question text → base64 int8 vector, embedded once as a Gemini RETRIEVAL_QUERY. */
  vectors: Record<string, string>;
}

/** Every question text in the set, typed turns included (suggestions are generated, so not known ahead). */
export function visitorQuestionTexts(fixture: VisitorFixture = loadVisitors()): string[] {
  const texts = [...fixture.questions.map(q => q.q), ...fixture.flows.flatMap(f => f.turns.map(t => t.q).filter((q): q is string => !!q))];
  return [...new Set(texts)];
}

/**
 * Semantic search offline: the stored query vectors stand in for the Gemini
 * call. A question without a stored vector (a suggestion's text) gets none,
 * as when the embedding call fails.
 */
export function fixtureEmbedder(): QueryEmbedder {
  const file = fs.existsSync(VISITOR_VECTORS) ? (JSON.parse(fs.readFileSync(VISITOR_VECTORS, 'utf8')) as VisitorVectors) : null;
  return async (question, notes) => {
    const stored = file?.vectors[question];
    if (!stored) {
      notes?.push(file ? 'gemini: no stored vector for this question' : 'gemini: no stored vectors (tests/fixtures/chat-visitor-vectors.json)');
      return null;
    }
    return { provider: 'gemini', vector: [...decodeVector(stored, 'int8')] };
  };
}
