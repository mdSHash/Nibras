/**
 * The chat API's response contract, shared by the serverless function
 * (api/chat.ts) and the client (src/hooks/useChat.ts).
 */
import type { EntityRefs } from './chatKb.js';

export type AnswerBlock =
  /** Validated answer text (may contain **bold** labels); body text is verbatim source. */
  | { type: 'text'; text: string; citations: string[] }
  /** A source passage shown verbatim. */
  | { type: 'quote'; text: string; source: string; citations: string[] }
  /** A stored list shown in full. */
  | { type: 'list'; heading: string; items: string[]; citations: string[] }
  /** A verse shown from the app's verified Qur'an text. */
  | { type: 'quran'; key: string; text: string; link?: string; citations: string[] };

export interface ChatCitation {
  chunkId: string;
  sourceLabel: string;
  type: string;
  era?: string;
  entityRefs: EntityRefs;
}

export type AnswerMode = 'composed' | 'extractive' | 'not_covered';

export interface ChatSuccessBody {
  /** Plain-text rendering of the blocks, for simple clients. */
  answer: string;
  blocks: AnswerBlock[];
  citations: ChatCitation[];
  grounded: boolean;
  mode: AnswerMode;
  /** What this turn was about; send `recordIds` back with the next question. */
  context: {
    recordIds: string[];
    /** Records assumed from the previous question (not named in this one). */
    carried: { recordId: string; title: string }[];
  };
  /** Suggested next questions, each answerable from Nibras's data. */
  followUps: string[];
}

/** Sent with a question so a follow-up can refer to the previous answer. */
export interface ChatRequestContext {
  recordIds: string[];
  previousQuestion?: string;
}

export interface FeedbackRequest {
  rating: 'up' | 'down';
  question: string;
  answer?: string;
  mode?: AnswerMode;
  citations?: string[];
  note?: string;
}

export interface ChatErrorBody {
  error: string;
  messageAr: string;
}
