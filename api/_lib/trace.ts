/**
 * One structured trace per question: what each stage of the pipeline saw,
 * kept and cut. Filled only when a caller passes one in (the eval script, the
 * dev server with CHAT_TRACE=1, tests); production never builds it, and its
 * one-line log carries no question text.
 */

export interface TraceHit {
  unit: string;
  score: number;
}

export interface ChatTrace {
  question: string;
  intents: string[];
  entities: { id: string; phrase: string; strong: boolean; carried: boolean }[];
  context: {
    /** Records the client sent back from the previous turn. */
    sent: string[];
    carried: string[];
    /** Whether the previous question was shown to the model. */
    previousQuestionShown: boolean;
    /** The question asked nothing of its own, so the previous question's intents were used. */
    intentsFromPrevious?: boolean;
  };
  keyword: (TraceHit & { matched: number })[];
  semantic: { ran: boolean; provider?: string; ms?: number; min?: number; notes: string[]; top: TraceHit[] };
  /** Final fused scores of the best units, with the record they belong to. */
  fusion: TraceHit[];
  confidence: string;
  evidence: {
    kept: { record: string; units: string[]; of: number }[];
    cut: { unit: string; by: 'maxRecords' | 'maxPerRecord' | 'charBudget' | 'listKind' | 'offTopic' }[];
    chars: number;
  };
  prompt?: { chars: number; passages: number };
  llm?: { attempts: string[]; provider: string | null; ms: number };
  /** `items`: the model's sections (or, in the older format, its points). */
  model?: { answerable: boolean; items: number };
  rejected: { text: string; reason: string }[];
  /** Units the answer shows (an overview shows more than the evidence held). */
  answerUnits: string[];
  mode?: string;
  /** How the answer was arranged: an overview style, the model's sections, or its older points. */
  shape?: string;
  cache?: 'hit' | 'miss' | 'off';
  rateLimit?: string;
  ms: { search?: number; llm?: number; total?: number };
}

export function newTrace(question: string): ChatTrace {
  return {
    question,
    intents: [],
    entities: [],
    context: { sent: [], carried: [], previousQuestionShown: false },
    keyword: [],
    semantic: { ran: false, notes: [], top: [] },
    fusion: [],
    confidence: 'none',
    evidence: { kept: [], cut: [], chars: 0 },
    rejected: [],
    answerUnits: [],
    ms: {},
  };
}

/** How many hits of each list a trace keeps. */
export const TRACE_TOP = 12;
export const TRACE_MAX_CUT = 40;

const round = (n: number) => Math.round(n * 1000) / 1000;
export const hit = (unit: string, score: number): TraceHit => ({ unit, score: round(score) });

/** A short, readable form for a terminal (dev server, eval script). */
export function formatTrace(t: ChatTrace): string {
  const lines = [`── ${t.question}`];
  lines.push(`intents: ${t.intents.join(', ') || '-'}${t.context.intentsFromPrevious ? ' (from the previous question)' : ''} | confidence: ${t.confidence} | mode: ${t.mode ?? '-'} | shape: ${t.shape ?? '-'} | cache: ${t.cache ?? '-'}`);
  lines.push(`entities: ${t.entities.map(e => `${e.id}${e.strong ? '' : '?'}${e.carried ? ' (carried)' : ` «${e.phrase}»`}`).join(', ') || '-'}`);
  if (t.context.sent.length) lines.push(`context sent: ${t.context.sent.join(', ')} → carried: ${t.context.carried.join(', ') || 'none'}`);
  lines.push(`keyword: ${t.keyword.slice(0, 6).map(h => `${h.unit} ${h.score}`).join(' | ') || '-'}`);
  lines.push(
    `semantic: ${t.semantic.ran ? `${t.semantic.provider} ${t.semantic.ms}ms ≥${t.semantic.min}: ${t.semantic.top.slice(0, 4).map(h => `${h.unit} ${h.score}`).join(' | ')}` : `off (${t.semantic.notes.join('; ') || 'no embedder'})`}`
  );
  for (const k of t.evidence.kept) lines.push(`  kept ${k.record} ${k.units.length}/${k.of}`);
  if (t.evidence.cut.length) {
    const by = t.evidence.cut.reduce<Record<string, number>>((acc, c) => ((acc[c.by] = (acc[c.by] ?? 0) + 1), acc), {});
    lines.push(`  cut: ${Object.entries(by).map(([k, n]) => `${k} ${n}`).join(', ')}`);
  }
  if (t.prompt) lines.push(`prompt: ${t.prompt.chars} chars, ${t.prompt.passages} passages`);
  if (t.llm) lines.push(`llm: ${t.llm.provider ?? 'none'} ${t.llm.ms}ms — ${t.llm.attempts.join(' ; ')}`);
  for (const r of t.rejected) lines.push(`  rejected (${r.reason}): ${r.text.slice(0, 120)}`);
  lines.push(`ms: ${Object.entries(t.ms).map(([k, v]) => `${k} ${v}`).join(', ')}`);
  return lines.join('\n');
}
