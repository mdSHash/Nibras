import { useState } from 'react';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import type { ChatMessage } from '../../hooks/useChat';
import { cn } from '../../utils/cn';

/** "متابعةً للحديث عن: …" — tells the reader which earlier topic the answer assumed. */
export function CarriedTopic({ titles }: { titles: string[] }) {
  if (titles.length === 0) return null;
  return (
    <p className="text-[length:var(--chat-tiny)] text-[var(--color-ink)]/70">
      متابعةً للحديث عن: {titles.map(t => t.replace(/[ً-ٰٟ]/g, '')).join('، ')}
    </p>
  );
}

/** Suggested next questions; each one is answerable from Nibras's data. */
export function FollowUpChips({ questions, disabled, onAsk }: { questions: string[]; disabled: boolean; onAsk: (q: string) => void }) {
  if (questions.length === 0) return null;
  return (
    <div className="flex flex-col items-start gap-1.5" role="group" aria-label="أسئلة مقترحة للمتابعة">
      {questions.map(q => (
        <button
          key={q}
          type="button"
          disabled={disabled}
          onClick={() => onAsk(q)}
          className={cn(
            'text-[length:var(--chat-small)] px-2.5 py-1.5 rounded-full text-start',
            'pointer-coarse:min-h-10',
            'bg-[var(--color-accent)]/10 hover:bg-[var(--color-accent)] hover:text-parchment',
            'text-[var(--color-ink)]/85 border border-[var(--color-accent)]/25',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]',
            'transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
          )}
        >
          {q}
        </button>
      ))}
    </div>
  );
}

interface FeedbackBarProps {
  message: ChatMessage;
  onRate: (rating: 'up' | 'down', note?: string) => void;
}

/** 👍 / 👎 with an optional note after 👎 ("ما الخطأ؟"). */
export function FeedbackBar({ message, onRate }: FeedbackBarProps) {
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState('');
  const state = message.feedback?.state;
  const rating = message.feedback?.rating;

  if (state === 'sent' && !noteOpen) {
    return <p className="text-[length:var(--chat-tiny)] text-[var(--color-ink)]/70" role="status">شكراً لتقييمك</p>;
  }

  const button = (value: 'up' | 'down', label: string, Icon: typeof ThumbsUp) => (
    <button
      type="button"
      aria-label={label}
      aria-pressed={rating === value}
      disabled={state === 'sending'}
      onClick={() => {
        if (value === 'down') setNoteOpen(true);
        else onRate('up');
      }}
      className={cn(
        'w-8 h-8 pointer-coarse:w-11 pointer-coarse:h-11 rounded-full flex items-center justify-center transition-colors',
        'text-[var(--color-ink)]/60 hover:text-[var(--color-ink)] hover:bg-[var(--color-ink)]/10',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]',
        rating === value && 'text-[var(--color-accent)]',
      )}
    >
      <Icon size={14} aria-hidden="true" />
    </button>
  );

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center gap-1">
        {button('up', 'إجابة مفيدة', ThumbsUp)}
        {button('down', 'إجابة غير صحيحة أو غير مفيدة', ThumbsDown)}
        {state === 'error' && <span className="text-[length:var(--chat-tiny)] text-[var(--color-battle-red)]" role="alert">تعذر إرسال التقييم</span>}
      </div>
      {noteOpen && (
        <form
          className="flex flex-col gap-1.5"
          onSubmit={e => {
            e.preventDefault();
            onRate('down', note);
            setNoteOpen(false);
          }}
        >
          <label htmlFor={`note-${message.id}`} className="text-[length:var(--chat-tiny)] text-[var(--color-ink)]/75">
            ما الخطأ في الإجابة؟ (اختياري)
          </label>
          <textarea
            id={`note-${message.id}`}
            value={note}
            maxLength={500}
            rows={2}
            onChange={e => setNote(e.target.value)}
            className={cn(
              // 16px on touch screens: iPhones zoom the page into smaller inputs.
              'w-full rounded-lg px-2.5 py-1.5 text-[12px] pointer-coarse:text-base resize-none',
              'bg-[var(--color-ink)]/5 text-[var(--color-ink)] border border-[var(--color-accent)]/20',
              'focus:outline-none focus:border-[var(--color-accent)]/60',
            )}
          />
          <div className="flex gap-2">
            <button type="submit" className="text-[length:var(--chat-small)] px-3 py-1 pointer-coarse:min-h-10 pointer-coarse:px-4 rounded-full bg-[var(--color-accent)] text-parchment">
              إرسال
            </button>
            <button type="button" onClick={() => setNoteOpen(false)} className="text-[length:var(--chat-small)] px-3 py-1 pointer-coarse:min-h-10 pointer-coarse:px-4 rounded-full text-[var(--color-ink)]/75 hover:bg-[var(--color-ink)]/10">
              إلغاء
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
