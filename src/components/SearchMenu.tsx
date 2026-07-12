import React, { useState, useMemo } from 'react';
import { EventItem } from '../data';
import { X, Search, MapPin, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FilterOptions } from '../types';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { EmptyState } from './EmptyState';
import { cn } from '../utils/cn';
import { slideInRight, staggerContainer, staggerItem } from '../utils/motionVariants';
import { Z_INDEX } from '../constants';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useSwipeGesture } from '../hooks/useSwipeGesture';
import { normalizeArabic, tokenizeQuery } from '../utils/searchNormalize';

interface SearchMenuProps {
  isOpen: boolean;
  onClose: () => void;
  events: EventItem[];
  onSelectEvent: (event: EventItem) => void;
  filters: FilterOptions;
  setFilters: (f: FilterOptions) => void;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export default function SearchMenu({ isOpen, onClose, events, onSelectEvent, filters, setFilters }: SearchMenuProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebouncedValue(searchQuery, 300);
  const focusTrapRef = useFocusTrap(isOpen);
  const swipeHandlers = useSwipeGesture({
    onSwipeDown: onClose,
    threshold: 60
  });

  // Pre-normalize each event once per `events` prop change. A single lowercased,
  // diacritic-stripped haystack per event lets filtering shrink to a token loop
  // without re-allocating for every keystroke.
  const eventHaystacks = useMemo(() => {
    const map = new Map<string, string>();
    events.forEach(e => {
      const parts = [
        e.title,
        e.details?.summary ?? '',
        e.details?.full_description ?? '',
        e.location?.name ?? '',
        String(e.date.gregorian),
        e.date.hijri_relative ?? '',
      ].join(' ');
      map.set(e.id, normalizeArabic(parts));
    });
    return map;
  }, [events]);

  const filteredEvents = useMemo(() => {
    const tokens = tokenizeQuery(debouncedSearch);
    if (!tokens.length) return events;
    return events.filter(e => {
      const haystack = eventHaystacks.get(e.id) ?? '';
      return tokens.every(t => haystack.includes(t));
    });
  }, [debouncedSearch, events, eventHaystacks]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className={cn(
              'fixed inset-0',
              'bg-black/50 md:bg-black/30',
              'pointer-events-auto'
            )}
            style={{ zIndex: Z_INDEX.searchBackdrop }}
            aria-hidden="true"
          />

          {/* Drawer Panel — its `bottom` is driven by `--timeline-height` (set
              live by Timeline via ResizeObserver) so the drawer stops above the
              rail instead of overlaying it. Falls back to 0 when the var isn't
              set yet (e.g. first paint before Timeline mounts). */}
          <motion.div
            ref={focusTrapRef}
            variants={slideInRight}
            initial="hidden"
            animate="visible"
            exit="exit"
            dir="rtl"
            role="dialog"
            aria-modal="true"
            aria-label="قائمة البحث"
            className={cn(
              // Base positioning
              'fixed top-0 right-0',
              'flex flex-col pointer-events-auto',
              'text-right',
              // Mobile: full-screen overlay (bottom offset via inline style)
              'w-full bg-[var(--glass-bg)]',
              'pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]',
              // Desktop: side panel with glassmorphism
              'md:top-[64px] md:w-[360px]',
              'md:backdrop-blur-[16px] md:bg-[var(--glass-bg)]',
              'md:border-e md:border-[var(--glass-border)]',
              'md:shadow-[var(--glass-shadow)]',
              'md:rounded-e-[var(--radius-lg)]'
            )}
            style={{
              zIndex: Z_INDEX.searchMenu,
              bottom: 'var(--timeline-height, 0px)',
              // Match Timeline rail's layout animation so the drawer bottom moves in
              // lockstep with the rail's expand/collapse (without this the CSS-var
              // change is instant while the rail visually animates over 0.3s).
              transition: 'bottom 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
            {...swipeHandlers}
          >
            {/* Mobile swipe indicator */}
            <div className="md:hidden flex justify-center pt-2 pb-1">
              <div className="w-10 h-1 rounded-full bg-[var(--color-ink)]/20" />
            </div>

            {/* Header */}
            <div className={cn(
              'flex items-center justify-between',
              'p-3 md:p-4',
              'border-b border-[var(--glass-border)]',
              'shrink-0'
            )}>
              <h2 className="text-lg md:text-xl font-bold text-[var(--color-ink)]">
                استكشاف الأحداث
              </h2>
              <button
                onClick={onClose}
                aria-label="إغلاق القائمة"
                className={cn(
                  'min-w-[48px] min-h-[48px] w-12 h-12',
                  'flex justify-center items-center',
                  'rounded-full',
                  'bg-black/5 dark:bg-white/10',
                  'hover:bg-black/10 active:bg-black/20',
                  'dark:hover:bg-white/20 dark:active:bg-white/30',
                  'text-[var(--color-ink)] transition-colors shrink-0'
                )}
              >
                <X size={24} />
              </button>
            </div>

            {/* Event Count and Info */}
            <div className={cn(
              'px-3 md:px-4 py-2.5',
              'bg-black/5 dark:bg-white/5',
              'border-b border-[var(--glass-border)]',
              'flex justify-between items-center text-sm',
              'shrink-0'
            )}>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[var(--color-ink)] text-xs md:text-sm">
                  إجمالي الأحداث:
                </span>
              </div>
              <div className={cn(
                'font-bold text-[var(--color-accent)]',
                'bg-[var(--color-accent)]/10 px-2.5 py-1',
                'rounded-full border border-[var(--color-accent)]/20',
                'text-xs md:text-sm'
              )}>
                {filteredEvents.length} حدث
              </div>
            </div>

            {/* Search Input */}
            <div className={cn(
              'p-3 md:p-4',
              'border-b border-[var(--glass-border)]',
              'flex flex-col gap-3 md:gap-4 shrink-0'
            )}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن غزوة، حدث، سنة..."
                  aria-label="بحث"
                  className={cn(
                    'w-full h-12',
                    'bg-white/80 dark:bg-black/30',
                    'border border-[var(--glass-border)]',
                    'rounded-[var(--radius-md)]',
                    'py-3 pr-12 pl-4',
                    'text-[var(--color-ink)] text-base',
                    'focus:outline-none focus:border-[var(--color-accent)]',
                    'focus:ring-2 focus:ring-[var(--color-accent)]/30',
                    'transition-all'
                  )}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                />
                <Search size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-ink)]/70" />
              </div>

              {/* Filters UI */}
              <div data-tour-id="filters-section" className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm text-[var(--color-ink)]/80 font-bold mb-1">
                  <Filter size={18} /> تصفية الخريطة
                </div>
                
                {/* Era Filter */}
                <div className={cn(
                  'flex bg-black/10 dark:bg-white/10 p-1',
                  'rounded-[var(--radius-sm)]'
                )}>
                  {(['all', 'prophet', 'rashidun'] as const).map(era => (
                    <button
                      key={era}
                      onClick={() => setFilters({ ...filters, era })}
                      className={cn(
                        'flex-1 py-2 text-xs font-bold transition-colors min-h-[44px]',
                        'rounded-[var(--radius-sm)]',
                        filters.era === era
                          ? 'bg-[var(--color-accent)] text-white shadow'
                          : 'text-[var(--color-ink)] active:bg-black/10'
                      )}
                    >
                      {era === 'all' ? 'الكل' : era === 'prophet' ? 'عصر النبي ﷺ' : 'الخلفاء الراشدين'}
                    </button>
                  ))}
                </div>

                {/* Type Filter */}
                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    onClick={() => setFilters({ ...filters, type: 'all' })}
                    className={cn(
                      'px-3 py-2 font-bold transition-colors min-h-[44px]',
                      'rounded-[var(--radius-sm)]',
                      filters.type === 'all'
                        ? 'bg-[var(--color-ink)] text-white'
                        : 'bg-white/80 dark:bg-black/30 border border-[var(--glass-border)] text-[var(--color-ink)] active:bg-white'
                    )}
                  >الكل</button>
                  <button
                    onClick={() => setFilters({ ...filters, type: 'battles' })}
                    className={cn(
                      'px-3 py-2 font-bold transition-colors min-h-[44px]',
                      'rounded-[var(--radius-sm)]',
                      filters.type === 'battles'
                        ? 'bg-[var(--color-battle-red)] text-white'
                        : 'bg-white/80 dark:bg-black/30 border border-[var(--glass-border)] text-[var(--color-ink)] active:bg-white'
                    )}
                  >المعارك فقط</button>
                  <button
                    onClick={() => setFilters({ ...filters, type: 'events' })}
                    className={cn(
                      'px-3 py-2 font-bold transition-colors min-h-[44px]',
                      'rounded-[var(--radius-sm)]',
                      filters.type === 'events'
                        ? 'bg-[var(--color-accent)] text-white'
                        : 'bg-white/80 dark:bg-black/30 border border-[var(--glass-border)] text-[var(--color-ink)] active:bg-white'
                    )}
                  >الأحداث فقط</button>
                </div>
              </div>
            </div>

            {/* Results List */}
            <div
              className={cn(
                'flex-1 overflow-y-auto',
                'p-2 md:p-3'
              )}
              role="listbox"
              aria-label="نتائج البحث"
            >
              {filteredEvents.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <EmptyState
                    icon={<Search size={48} />}
                    title="لا توجد نتائج"
                    description={searchQuery ? 'لم نجد أحداثاً مطابقة لبحثك. جرب كلمات مختلفة.' : 'لا توجد أحداث تطابق الفلاتر المحددة.'}
                  />
                </div>
              ) : (
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  key={`events-${debouncedSearch}-${filters.era}-${filters.type}`}
                  className="flex flex-col gap-2"
                >
                  {filteredEvents.map(evt => (
                    <motion.button
                      key={evt.id}
                      variants={staggerItem}
                      role="option"
                      aria-selected={false}
                      onClick={() => {
                        // Parent decides whether to close the drawer (mobile
                        // closes so the detail panel is visible; desktop keeps
                        // it open so filter/search context survives).
                        onSelectEvent(evt);
                      }}
                      className={cn(
                        'flex flex-col text-right',
                        'p-3 rounded-[var(--radius-sm)]',
                        'transition-colors border border-transparent',
                        'hover:bg-[var(--color-accent)]/10 hover:border-[var(--color-accent)]/20',
                        'active:bg-[var(--color-accent)]/20',
                        'group min-h-[44px]'
                      )}
                    >
                      <div className="flex justify-between items-start w-full">
                        <span className="font-bold text-[var(--color-ink)] group-hover:text-[var(--color-accent)] transition-colors">
                          {evt.title}
                        </span>
                        <span className={cn(
                          'rounded-full px-2 py-0.5 text-xs shrink-0',
                          'bg-[var(--color-accent)]/10 text-[var(--color-accent)]',
                          'font-bold'
                        )}>
                          {evt.date.gregorian} م
                        </span>
                      </div>
                      
                      <div className="flex items-center text-xs mt-1 gap-1 text-[var(--color-ink)]/80">
                        <MapPin size={12} className="shrink-0" />
                        <span className="truncate">{evt.location.name}</span>
                      </div>
                      <div className="text-xs mt-1 leading-relaxed line-clamp-1 text-[var(--color-ink)]/70">
                        {evt.details.summary}
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
