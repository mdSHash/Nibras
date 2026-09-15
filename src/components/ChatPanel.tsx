import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useDragControls, type PanInfo } from 'motion/react';
import { X, MessageCircle, Send, RotateCcw } from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useIsMobile, useMatchMedia } from '../hooks/useMatchMedia';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useVisualViewport } from '../hooks/useVisualViewport';
import { useScrollLock } from '../utils/scrollLock';
import { Z_INDEX } from '../constants';
import { cn } from '../utils/cn';
import { useChat, type ChatCitation } from '../hooks/useChat';
import { getEraColor } from '../utils/eraColors';
import { getMatchingSuggestions } from '../utils/chatSuggestions';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { Button } from './Button';
import { AnswerBlocks, FormattedText } from './chat/AnswerBlocks';
import { CarriedTopic, FeedbackBar, FollowUpChips } from './chat/AnswerExtras';

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
  const { eventId, companionId, quranKey, battleId } = citation.entityRefs;
  // Cities and cross-record lists have no screen of their own to open.
  if (!eventId && !companionId && !quranKey && !battleId) {
    return (
      <span
        className="inline-flex items-center px-2.5 py-1 rounded-full text-[length:var(--chat-tiny)] font-bold border border-[var(--color-accent)]/20 text-[var(--color-ink)]/75"
        style={color ? { borderColor: `${color}55` } : undefined}
      >
        {citation.sourceLabel}
      </span>
    );
  }
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full',
        'pointer-coarse:min-h-10 pointer-coarse:px-3',
        'text-[length:var(--chat-tiny)] font-bold border transition-colors',
        'bg-[var(--color-ink)]/5 hover:bg-[var(--color-accent)] hover:text-parchment',
        'border-[var(--color-accent)]/30 text-[var(--color-ink)]/85',
      )}
      style={color ? { borderColor: `${color}55` } : undefined}
    >
      {citation.sourceLabel}
    </button>
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
  const { messages, isLoading, throttledUntil, sendMessage, reset, sendFeedback } = useChat();
  const [draft, setDraft] = useState('');
  const listRef = useRef<HTMLDivElement>(null);
  const isThrottled = throttledUntil !== null && throttledUntil > Date.now();

  // Phones get a tall bottom sheet that can be swiped down to close.
  const isSheet = useIsMobile();
  const isTouch = useMatchMedia('(pointer: coarse)');
  const reducedMotion = useReducedMotion();
  const dragControls = useDragControls();
  // Follow the visible area on touch screens so the composer stays above the keyboard.
  const viewportBox = useVisualViewport(isOpen && isTouch);

  // The panel unmounts while closed (e.g. while a source opened from it is on
  // screen), so remember where the reader was and put them back there.
  const savedScrollTop = useRef<number | null>(null);
  const nearBottom = useRef(true);

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

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!isOpen || !list) return;
    list.scrollTop = nearBottom.current || savedScrollTop.current === null ? list.scrollHeight : savedScrollTop.current;
    // When the keyboard opens the list gets shorter; keep the latest message in view.
    const observer = new ResizeObserver(() => {
      if (nearBottom.current) list.scrollTop = list.scrollHeight;
    });
    observer.observe(list);
    return () => observer.disconnect();
  }, [isOpen]);

  const onListScroll = () => {
    const list = listRef.current;
    if (!list) return;
    savedScrollTop.current = list.scrollTop;
    nearBottom.current = list.scrollHeight - list.scrollTop - list.clientHeight < 80;
  };

  const onSheetDragEnd = (_: PointerEvent, info: PanInfo) => {
    if (info.offset.y > 120 || info.velocity.y > 500) onClose();
  };

  const transition = reducedMotion ? { duration: 0 } : { type: 'spring' as const, stiffness: 300, damping: 30 };

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
            style={{
              zIndex: Z_INDEX.modal,
              ...(viewportBox && { top: viewportBox.top, height: viewportBox.height, bottom: 'auto' }),
            }}
            dir="rtl"
          >
            <motion.div
              ref={focusTrapRef}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={transition}
              drag={isSheet ? 'y' : false}
              dragControls={dragControls}
              dragListener={false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.8 }}
              dragMomentum={false}
              onDragEnd={onSheetDragEnd}
              className={cn(
                'pointer-events-auto relative w-full flex flex-col',
                // Text sizes, scaled up on touch screens and very wide screens.
                '[--chat-text:var(--text-sm)] [--chat-small:12px] [--chat-tiny:11px]',
                'pointer-coarse:[--chat-small:13px] pointer-coarse:[--chat-tiny:12px]',
                '3xl:[--chat-text:17px] 3xl:[--chat-small:13px] 3xl:[--chat-tiny:12px]',
                '4xl:[--chat-text:18px] 4xl:[--chat-small:14px] 4xl:[--chat-tiny:13px]',
                // Phones: a tall sheet of fixed height, so it doesn't jump as answers arrive.
                'h-[92%] rounded-t-[var(--radius-xl)] bg-[var(--glass-bg-solid)]',
                // Tablets: a wider floating panel.
                'md:max-w-[500px] md:h-[min(80%,760px)] md:rounded-[var(--radius-lg)]',
                'md:bg-[var(--glass-bg)] md:backdrop-blur-[16px]',
                // Laptops and desktops: unchanged.
                'lg:max-w-[420px] lg:h-[70vh] lg:max-h-[min(720px,calc(100%-32px))]',
                // Wide screens: grows with the screen.
                '2xl:max-w-[480px] 2xl:h-[75vh] 2xl:max-h-[820px]',
                '3xl:max-w-[540px] 3xl:h-[78vh] 3xl:max-h-[940px]',
                '4xl:max-w-[620px] 4xl:h-[80vh] 4xl:max-h-[1150px]',
                // Phones held sideways: use all of the height.
                'md:short:h-[calc(100%-16px)] md:short:max-h-none',
                'border-2 border-[var(--color-accent)]/25',
                'overflow-hidden',
              )}
              // Inline rather than a shadow-[var(--shadow-modal)] class: index.css caps the height of
              // anything whose class contains "modal" on screens up to 640px wide.
              style={{ boxShadow: 'var(--shadow-modal)' }}
              // Keyboard open: compact the header like a short screen (see the short variant in index.css).
              data-short={viewportBox && viewportBox.height <= 540 ? '' : undefined}
              role="dialog"
              aria-modal="true"
              aria-labelledby="chat-panel-title"
            >
              {/* Header — on phones also the handle for swiping the sheet down */}
              <div
                onPointerDown={e => {
                  if (isSheet && !(e.target as HTMLElement).closest('button')) dragControls.start(e);
                }}
                className={cn(
                  'shrink-0 p-4 relative',
                  'max-md:pt-6 max-md:touch-none',
                  'short:py-1.5 short:min-h-14 short:flex short:flex-col short:justify-center',
                  'bg-[var(--color-ink)]/[0.06]',
                  'border-b border-[var(--color-accent)]/20',
                )}
              >
                {isSheet && (
                  <div className="absolute top-2 inset-x-0 flex justify-center pointer-events-none" aria-hidden="true">
                    <div className="w-10 h-1.5 rounded-full bg-[var(--color-ink)]/25" />
                  </div>
                )}
                <button
                  onClick={onClose}
                  className={cn(
                    'absolute left-3 top-3 max-md:top-4 short:top-1/2 short:-translate-y-1/2 w-11 h-11',
                    'flex justify-center items-center rounded-full',
                    'bg-[var(--color-ink)]/5 hover:bg-[var(--color-ink)]/10',
                    'text-[var(--color-ink)]',
                    'transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]',
                  )}
                  aria-label="إغلاق"
                >
                  <X size={20} />
                </button>
                {messages.length > 0 && (
                  <button
                    onClick={reset}
                    className={cn(
                      'absolute right-3 top-3 max-md:top-4 short:top-1/2 short:-translate-y-1/2 h-11 px-3',
                      'flex items-center gap-1.5 rounded-full text-xs font-bold',
                      'bg-[var(--color-ink)]/5 hover:bg-[var(--color-ink)]/10',
                      'text-[var(--color-ink)]',
                      'transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]',
                    )}
                    aria-label="بدء محادثة جديدة"
                  >
                    <RotateCcw size={14} aria-hidden="true" />
                    <span className="hidden sm:inline">محادثة جديدة</span>
                  </button>
                )}
                <h2
                  id="chat-panel-title"
                  className="text-lg md:text-xl font-bold text-[var(--color-ink)] text-center flex items-center justify-center gap-2"
                >
                  <MessageCircle size={18} className="text-[var(--color-accent)]" />
                  اسأل نبراس
                </h2>
                <p className="text-xs text-[var(--color-ink)]/70 text-center mt-1 short:hidden">
                  إجابات مستندة إلى محتوى التطبيق فقط
                </p>
              </div>

              {/* Message list */}
              <div
                ref={listRef}
                onScroll={onListScroll}
                className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 short:py-3 flex flex-col gap-3"
              >
                {messages.length === 0 && (
                  <div className="flex flex-col gap-3 text-center py-4">
                    <p className="text-sm 4xl:text-base text-[var(--color-ink)]/70">
                      اسأل عن أي حدث أو صحابي أو معركة موجودة في التطبيق
                    </p>
                    <div className="flex flex-col gap-2">
                      {EXAMPLE_QUESTIONS.map(q => (
                        <button
                          key={q}
                          onClick={() => sendMessage(q)}
                          className={cn(
                            'text-sm 4xl:text-base text-start px-3 py-2 rounded-lg',
                            'pointer-coarse:min-h-11',
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
                    className={cn('flex flex-col gap-1.5 max-w-[92%] sm:max-w-[85%]', m.role === 'user' ? 'self-end items-end' : 'self-start items-start')}
                  >
                    <div
                      className={cn(
                        // rounded-[1rem] rather than rounded-2xl: index.css squeezes the padding of every
                        // .rounded-2xl on screens up to 380px wide.
                        'px-3.5 py-2.5 rounded-[1rem] text-[length:var(--chat-text)] leading-relaxed whitespace-pre-wrap',
                        m.role === 'user'
                          ? 'bg-[var(--color-accent)] text-parchment rounded-ee-sm'
                          : m.isError
                            ? 'bg-[var(--color-battle-red)]/10 text-[var(--color-ink)] border border-[var(--color-battle-red)]/30 rounded-es-sm'
                            : 'bg-[var(--color-ink)]/5 text-[var(--color-ink)] rounded-es-sm',
                      )}
                    >
                      {m.role === 'user'
                        ? m.text
                        : m.blocks && m.blocks.length > 0
                          ? <AnswerBlocks blocks={m.blocks} onVerseOpen={onCitationClick} />
                          : <FormattedText text={m.text} />}
                    </div>
                    {m.role === 'assistant' && m.carried && <CarriedTopic titles={m.carried} />}
                    {m.citations && m.citations.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {m.citations.map(c => (
                          <CitationChip key={c.chunkId} citation={c} onClick={() => onCitationClick(c)} />
                        ))}
                      </div>
                    )}
                    {m.role === 'assistant' && !m.isError && m.followUps && (
                      <FollowUpChips questions={m.followUps} disabled={isLoading} onAsk={sendMessage} />
                    )}
                    {m.role === 'assistant' && !m.isError && m.question && (
                      <FeedbackBar message={m} onRate={(rating, note) => sendFeedback(m.id, rating, note)} />
                    )}
                    {m.isError && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => sendMessage(m.role === 'user' ? m.text : messages[messages.indexOf(m) - 1]?.text || '')}
                        className="!px-2 !py-1 pointer-coarse:!min-h-10 text-xs"
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
              <div className="shrink-0 p-3 max-md:pb-[max(0.75rem,env(safe-area-inset-bottom))] border-t border-[var(--color-accent)]/20">
                {isThrottled && (
                  <p className="text-[length:var(--chat-tiny)] text-[var(--color-ink)]/60 mb-1.5 text-center">
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
                          'text-[length:var(--chat-small)] px-2.5 py-1.5 rounded-full text-start',
                          'pointer-coarse:min-h-10',
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
                    enterKeyHint="send"
                    autoComplete="off"
                    className={cn(
                      // 16px on touch screens: iPhones zoom the page into smaller inputs.
                      'flex-1 min-w-0 px-3.5 py-2.5 rounded-full text-sm pointer-coarse:text-base 4xl:text-base',
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
