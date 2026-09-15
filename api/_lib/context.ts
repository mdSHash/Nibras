/**
 * Conversation context: lets a follow-up question refer back to what the
 * previous answer was about ("مين عثمان بن عفان؟" → "طب عمل إيه في تبوك؟").
 *
 * The client sends back the record ids the previous turn focused on. Nothing
 * is stored on the server. Carrying is deliberately conservative: a question
 * that names its own subject is treated as a new topic.
 */
import { normalizeForMatch, searchStems } from '../../shared/arabicText.js';
import type { LinkedEntity } from './entityLinker.js';
import type { LoadedKb } from './kb.js';

export interface ChatContext {
  /** Records the previous answer was about, most relevant first. */
  recordIds: string[];
  /** The previous question, shown to the model to resolve pronouns. */
  previousQuestion?: string;
}

const MAX_CONTEXT_RECORDS = 3;

// Pronouns, demonstratives and connectives that point back to the last topic
// (MSA and Egyptian colloquial, after normalizeForMatch folding).
const FOLLOW_UP_CUES =
  /(^| )(هو|هي|هم|ده|دي|دا|دول|فيها|فيه|منها|منه|عنها|عنه|له|لها|لهم|عمل|عملت|عملوا|فعل|كان|كانت|كانوا|كمان|برضه|برضو|ايضا|بعدها|قبلها|بعده|قبله|بعدين|ساعتها|وقتها|يومها|هناك|طب|طيب|وماذا|وكيف|وازاي|وليه|وامتي|وفين|وكام|وايه|ومين|تاني|التانيه|التانيين|الباقي|الباقيه|الاخري|الاخرين|غيرها|غيره)( |$)/;

// Questions about what a person did — the person can come from context.
// ("كان/كانت" are left out: "غزوة أحد كانت إمتى؟" is about the event itself.)
const PERSON_ACTION =
  /(^| )(عمل|عملت|عملوا|فعل|دور|دوره|دورها|شارك|شاركت|قال|قالت|موقف|موقفه|استشهد|اتقتل|قتل|هاجر|اسلم|ولد|اتولد|توفي|اتوفي|مات|ساهم|قاد|ابلي)( |$)/;

// References to "that event" — the event can come from context.
const EVENT_REFERENCE = /(^| )(فيها|فيه|هناك|وقتها|يومها|ساعتها|المعركه دي|الغزوه دي|الحدث ده|نفس المعركه|نفس الغزوه)( |$)/;

const PERSON_TYPES = new Set(['companion']);
const EVENT_TYPES = new Set(['event', 'battle']);

export function sanitizeContext(raw: unknown, kb: LoadedKb): ChatContext | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const value = raw as Record<string, unknown>;
  const recordIds = Array.isArray(value.recordIds)
    ? value.recordIds.filter((id): id is string => typeof id === 'string' && kb.recordById.has(id)).slice(0, MAX_CONTEXT_RECORDS)
    : [];
  if (recordIds.length === 0) return undefined;
  const previousQuestion = typeof value.previousQuestion === 'string' ? value.previousQuestion.trim().slice(0, 400) : undefined;
  return { recordIds, previousQuestion: previousQuestion || undefined };
}

/** Entities to borrow from the previous turn for this question, if any. */
export function carryContext(question: string, current: LinkedEntity[], context: ChatContext | undefined, kb: LoadedKb): LinkedEntity[] {
  if (!context) return [];
  const previous = context.recordIds.map(id => kb.recordById.get(id)).filter(r => r !== undefined);
  if (previous.length === 0) return [];

  const normalized = ` ${normalizeForMatch(question)} `;
  const strongTypes = new Set(current.filter(e => e.strong).map(e => kb.recordById.get(e.recordId)?.type));
  const carry = (ids: string[]): LinkedEntity[] => ids.map(recordId => ({ recordId, strong: true, phrase: '', carried: true }));

  if (strongTypes.size === 0) {
    const shortQuestion = searchStems(question).length <= 2;
    return FOLLOW_UP_CUES.test(normalized) || shortQuestion ? carry(previous.slice(0, 2).map(r => r.id)) : [];
  }

  const hasPerson = [...strongTypes].some(t => t && PERSON_TYPES.has(t));
  const hasEvent = [...strongTypes].some(t => t && EVENT_TYPES.has(t));
  const previousPerson = previous.find(r => PERSON_TYPES.has(r.type));
  const previousEvent = previous.find(r => EVENT_TYPES.has(r.type));

  if (!hasPerson && hasEvent && previousPerson && PERSON_ACTION.test(normalized)) return carry([previousPerson.id]);
  if (hasPerson && !hasEvent && previousEvent && EVENT_REFERENCE.test(normalized)) return carry([previousEvent.id]);
  return [];
}
