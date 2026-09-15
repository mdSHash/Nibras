import { useCallback, useRef, useState } from 'react';
import type { AnswerBlock, ChatCitation, ChatErrorBody, ChatSuccessBody } from '../../shared/chatApi';

export type { AnswerBlock, ChatCitation };

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  /** Structured answer (verified text, source quotes, lists, verses). */
  blocks?: AnswerBlock[];
  citations?: ChatCitation[];
  isError?: boolean;
}

const CHAT_API_URL = import.meta.env.VITE_CHAT_API_URL;

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
          setMessages(prev => [
            ...prev,
            { id: `a-${Date.now()}`, role: 'assistant', text: NOT_CONFIGURED_ERROR, isError: true },
          ]);
          return;
        }

        const res = await fetch(CHAT_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text }),
          signal: controller.signal,
        });
        const data = (await res.json().catch(() => null)) as (Partial<ChatSuccessBody> & Partial<ChatErrorBody>) | null;

        if (!res.ok || !data) {
          setMessages(prev => [
            ...prev,
            { id: `a-${Date.now()}`, role: 'assistant', text: data?.messageAr || GENERIC_ERROR, isError: true },
          ]);
          return;
        }

        setMessages(prev => [
          ...prev,
          { id: `a-${Date.now()}`, role: 'assistant', text: data.answer ?? '', blocks: data.blocks, citations: data.citations || [] },
        ]);
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setMessages(prev => [
          ...prev,
          { id: `a-${Date.now()}`, role: 'assistant', text: NETWORK_ERROR, isError: true },
        ]);
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

  return { messages, isLoading, throttledUntil, sendMessage, cancel };
}
