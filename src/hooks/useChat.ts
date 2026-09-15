import { useCallback, useRef, useState } from 'react';
import type { AnswerBlock, AnswerMode, ChatCitation, ChatErrorBody, ChatRequestContext, ChatSuccessBody, FeedbackRequest } from '../../shared/chatApi';

export type { AnswerBlock, ChatCitation };

export type FeedbackState = 'idle' | 'sending' | 'sent' | 'error';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  /** Structured answer (verified text, source quotes, lists, verses). */
  blocks?: AnswerBlock[];
  citations?: ChatCitation[];
  /** The question this answer responds to (assistant messages). */
  question?: string;
  mode?: AnswerMode;
  /** Titles the answer assumed from the previous question. */
  carried?: string[];
  followUps?: string[];
  feedback?: { rating: 'up' | 'down'; state: FeedbackState };
  isError?: boolean;
}

const CHAT_API_URL = import.meta.env.VITE_CHAT_API_URL;
const FEEDBACK_API_URL = CHAT_API_URL ? CHAT_API_URL.replace(/\/chat\/?$/, '/feedback') : undefined;

// Client-side throttle so a single visitor can't hammer the shared free-tier
// LLM pool — gives instant feedback before the request even goes out.
const MIN_INTERVAL_MS = 3500;

const GENERIC_ERROR = 'حدث خطأ غير متوقع، حاول مرة أخرى.';
const NOT_CONFIGURED_ERROR = 'المساعد غير متاح حالياً.';
const NETWORK_ERROR = 'تعذر الاتصال بالمساعد، تحقق من اتصالك بالإنترنت وحاول مرة أخرى.';

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [throttledUntil, setThrottledUntil] = useState<number | null>(null);
  const lastSentAtRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  // What the last answer was about, so a follow-up question can refer to it.
  const contextRef = useRef<ChatRequestContext | null>(null);

  const sendMessage = useCallback(
    async (rawText: string) => {
      const text = rawText.trim();
      if (!text || isLoading) return;

      const now = Date.now();
      if (now - lastSentAtRef.current < MIN_INTERVAL_MS) {
        setThrottledUntil(lastSentAtRef.current + MIN_INTERVAL_MS);
        return;
      }
      lastSentAtRef.current = now;
      setThrottledUntil(null);

      setMessages(prev => [...prev, { id: `u-${now}`, role: 'user', text }]);
      setIsLoading(true);

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        if (!CHAT_API_URL) {
          setMessages(prev => [...prev, { id: `a-${Date.now()}`, role: 'assistant', text: NOT_CONFIGURED_ERROR, isError: true }]);
          return;
        }

        const res = await fetch(CHAT_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text, ...(contextRef.current ? { context: contextRef.current } : {}) }),
          signal: controller.signal,
        });
        const data = (await res.json().catch(() => null)) as (Partial<ChatSuccessBody> & Partial<ChatErrorBody>) | null;

        if (!res.ok || !data) {
          setMessages(prev => [...prev, { id: `a-${Date.now()}`, role: 'assistant', text: data?.messageAr || GENERIC_ERROR, isError: true }]);
          return;
        }

        const recordIds = data.context?.recordIds ?? [];
        // A refusal keeps the earlier topic, so a follow-up still works after it.
        if (recordIds.length > 0) contextRef.current = { recordIds, previousQuestion: text };

        setMessages(prev => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: 'assistant',
            text: data.answer ?? '',
            blocks: data.blocks,
            citations: data.citations || [],
            question: text,
            mode: data.mode,
            carried: (data.context?.carried ?? []).map(c => c.title),
            followUps: data.followUps ?? [],
          },
        ]);
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setMessages(prev => [...prev, { id: `a-${Date.now()}`, role: 'assistant', text: NETWORK_ERROR, isError: true }]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading]
  );

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    setIsLoading(false);
  }, []);

  /** Starts a fresh conversation: clears messages and the follow-up context. */
  const reset = useCallback(() => {
    abortRef.current?.abort();
    contextRef.current = null;
    setMessages([]);
    setIsLoading(false);
    setThrottledUntil(null);
  }, []);

  const sendFeedback = useCallback(
    async (messageId: string, rating: 'up' | 'down', note?: string) => {
      const message = messages.find(m => m.id === messageId);
      if (!message || !FEEDBACK_API_URL) return;
      const setState = (state: FeedbackState) =>
        setMessages(prev => prev.map(m => (m.id === messageId ? { ...m, feedback: { rating, state } } : m)));
      setState('sending');
      const payload: FeedbackRequest = {
        rating,
        question: message.question ?? '',
        answer: message.text.slice(0, 3000),
        mode: message.mode,
        citations: (message.citations ?? []).map(c => c.chunkId),
        ...(note?.trim() ? { note: note.trim().slice(0, 500) } : {}),
      };
      try {
        const res = await fetch(FEEDBACK_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        setState(res.ok ? 'sent' : 'error');
      } catch {
        setState('error');
      }
    },
    [messages]
  );

  return { messages, isLoading, throttledUntil, sendMessage, cancel, reset, sendFeedback };
}
