import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageCircle, Send } from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useScrollLock } from '../utils/scrollLock';
import { Z_INDEX } from '../constants';
import { cn } from '../utils/cn';
import { useChat, type ChatCitation } from '../hooks/useChat';
import { getEraColor } from '../utils/eraColors';
import { getMatchingSuggestions } from '../utils/chatSuggestions';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { Button } from './Button';

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onCitationClick: (citation: ChatCitation) => void;
}

const EXAMPLE_QUESTIONS = [
  'من هم أهل بدر؟',
  'ماذا حدث في غزوة الخندق؟',
  'من هو خالد بن الوليد؟',
];

function CitationChip({ citation, onClick }: { citation: ChatCitation; onClick: () => void }) {
  const color = citation.era ? getEraColor(citation.era) : undefined;
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full',
        'text-[11px] font-bold border transition-colors',
        'bg-[var(--color-ink)]/5 hover:bg-[var(--color-accent)] hover:text-parchment',
        'border-[var(--color-accent)]/30 text-[var(--color-ink)]/85',
      )}
      style={color ? { borderColor: `${color}55` } : undefined}
    >
      {citation.sourceLabel}
    </button>
  );
}

/**
 * Renders the model's lightweight markdown (**bold** + blank-line-separated
 * paragraphs) as real elements instead of showing literal asterisks — the
 * system prompt asks for "**name**: description" list items, which needs
 * actual bold rendering to read as the clean list it's meant to be.
 */
function FormattedAnswer({ text }: { text: string }) {
  const paragraphs = text.split(/\n\s*\n/).filter(Boolean);
  return (
    <>
      {paragraphs.map((para, pi) => (
        <p key={pi} className={pi > 0 ? 'mt-2.5' : undefined}>
          {para.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
            part.startsWith('**') && part.endsWith('**') ? (
              <strong key={i}>{part.slice(2, -2)}</strong>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </p>
      ))}
    </>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3" aria-live="polite" aria-label="المساعد يكتب">
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-[var(--color-ink)]/40"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

export default function ChatPanel({ isOpen, onClose, onCitationClick }: ChatPanelProps) {
  const focusTrapRef = useFocusTrap(isOpen);
  useScrollLock(isOpen);
  const { messages, isLoading, throttledUntil, sendMessage } = useChat();
  const [draft, setDraft] = useState('');
  const listRef = useRef<HTMLDivElement>(null);
  const isThrottled = throttledUntil !== null && throttledUntil > Date.now();

  const debouncedDraft = useDebouncedValue(draft, 150);
  const suggestions = useMemo(() => getMatchingSuggestions(debouncedDraft), [debouncedDraft]);
  const showSuggestions = suggestions.length > 0 && draft.trim().length >= 2 && !isLoading;

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  const submit = () => {
    if (!draft.trim() || isLoading) return;
    sendMessage(draft);
    setDraft('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 pointer-events-auto"
            style={{ zIndex: Z_INDEX.modalBackdrop }}
            aria-hidden="true"
          />

          <div
            className="fixed inset-0 pointer-events-none flex items-end md:items-center justify-center md:justify-end md:pe-6"
            style={{ zIndex: Z_INDEX.modal }}
            dir="rtl"
          >
            <motion.div
              ref={focusTrapRef}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={cn(
                'pointer-events-auto relative w-full flex flex-col',
                'max-h-[88dvh] rounded-t-[var(--radius-xl)]',
                'md:max-w-[420px] md:h-[70vh] md:max-h-[720px] md:rounded-[var(--radius-lg)]',
                'bg-[var(--glass-bg)] backdrop-blur-[16px]',
                'border-2 border-[var(--color-accent)]/25',
                'overflow-hidden shadow-[var(--shadow-modal)]',
              )}
              role="dialog"
              aria-modal="true"
              aria-labelledby="chat-panel-title"
            >
              {/* Header */}
              <div className={cn(
                'shrink-0 p-4 relative',
                'bg-[var(--color-ink)]/[0.06]',
                'border-b border-[var(--color-accent)]/20',
              )}>
                <button
                  onClick={onClose}
                  className={cn(
                    'absolute left-3 top-3 w-11 h-11',
                    'flex justify-center items-center rounded-full',
                    'bg-[var(--color-ink)]/5 hover:bg-[var(--color-ink)]/10',
                    'text-[var(--color-ink)]',
                    'transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]',
                  )}
                  aria-label="إغلاق"
                >
                  <X size={20} />
                </button>
                <h2
                  id="chat-panel-title"
                  className="text-lg md:text-xl font-bold text-[var(--color-ink)] text-center flex items-center justify-center gap-2"
                >
                  <MessageCircle size={18} className="text-[var(--color-accent)]" />
                  اسأل نبراس
                </h2>
                <p className="text-xs text-[var(--color-ink)]/70 text-center mt-1">
                  إجابات مستندة إلى محتوى التطبيق فقط
                </p>
              </div>

              {/* Message list */}
              <div ref={listRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                {messages.length === 0 && (
                  <div className="flex flex-col gap-3 text-center py-4">
                    <p className="text-sm text-[var(--color-ink)]/70">
                      اسأل عن أي حدث أو صحابي أو معركة موجودة في التطبيق
                    </p>
                    <div className="flex flex-col gap-2">
                      {EXAMPLE_QUESTIONS.map(q => (
                        <button
                          key={q}
                          onClick={() => sendMessage(q)}
                          className={cn(
                            'text-sm text-start px-3 py-2 rounded-lg',
                            'bg-[var(--color-ink)]/5 hover:bg-[var(--color-ink)]/10',
                            'text-[var(--color-ink)]/85 border border-[var(--color-accent)]/15',
                            'transition-colors',
                          )}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map(m => (
                  <div
                    key={m.id}
                    className={cn('flex flex-col gap-1.5 max-w-[85%]', m.role === 'user' ? 'self-end items-end' : 'self-start items-start')}
                  >
                    <div
                      className={cn(
                        'px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap',
                        m.role === 'user'
                          ? 'bg-[var(--color-accent)] text-parchment rounded-ee-sm'
                          : m.isError
                            ? 'bg-[var(--color-battle-red)]/10 text-[var(--color-ink)] border border-[var(--color-battle-red)]/30 rounded-es-sm'
                            : 'bg-[var(--color-ink)]/5 text-[var(--color-ink)] rounded-es-sm',
                      )}
                    >
                      {m.role === 'assistant' ? <FormattedAnswer text={m.text} /> : m.text}
                    </div>
                    {m.citations && m.citations.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {m.citations.map(c => (
                          <CitationChip key={c.chunkId} citation={c} onClick={() => onCitationClick(c)} />
                        ))}
                      </div>
                    )}
                    {m.isError && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => sendMessage(m.role === 'user' ? m.text : messages[messages.indexOf(m) - 1]?.text || '')}
                        className="!px-2 !py-1 text-xs"
                      >
                        حاول مرة أخرى
                      </Button>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="self-start">
                    <TypingIndicator />
                  </div>
                )}
              </div>

              {/* Composer */}
              <div className="shrink-0 p-3 border-t border-[var(--color-accent)]/20">
                {isThrottled && (
                  <p className="text-[11px] text-[var(--color-ink)]/60 mb-1.5 text-center">
                    الرجاء الانتظار قليلاً قبل إرسال سؤال آخر
                  </p>
                )}
                {showSuggestions && (
                  <div className="flex flex-wrap gap-1.5 mb-2" role="listbox" aria-label="اقتراحات الأسئلة">
                    {suggestions.map(s => (
                      <button
                        key={s}
                        type="button"
                        role="option"
                        aria-selected="false"
                        onClick={() => {
                          setDraft('');
                          sendMessage(s);
                        }}
                        className={cn(
                          'text-[12px] px-2.5 py-1.5 rounded-full text-start',
                          'bg-[var(--color-accent)]/10 hover:bg-[var(--color-accent)] hover:text-parchment',
                          'text-[var(--color-ink)]/80 border border-[var(--color-accent)]/25',
                          'transition-colors',
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    submit();
                  }}
                  className="flex items-center gap-2"
                >
                  <label htmlFor="chat-input" className="sr-only">اكتب سؤالك</label>
                  <input
                    id="chat-input"
                    type="text"
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                    placeholder="اكتب سؤالك هنا..."
                    disabled={isLoading}
                    maxLength={400}
                    className={cn(
                      'flex-1 min-w-0 px-3.5 py-2.5 rounded-full text-sm',
                      'bg-[var(--color-ink)]/5 text-[var(--color-ink)]',
                      'border border-[var(--color-accent)]/20 focus:border-[var(--color-accent)]/60',
                      'focus:outline-none placeholder:text-[var(--color-ink)]/40',
                    )}
                  />
                  <motion.button
                    type="submit"
                    disabled={!draft.trim() || isLoading}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.9 }}
                    className={cn(
                      'w-11 h-11 shrink-0 rounded-full flex items-center justify-center',
                      'bg-[var(--color-accent)] text-parchment',
                      'disabled:opacity-40 disabled:cursor-not-allowed transition-opacity',
                    )}
                    aria-label="إرسال"
                  >
                    <Send size={17} />
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
