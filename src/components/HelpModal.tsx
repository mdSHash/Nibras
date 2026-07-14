import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Play } from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useScrollLock } from '../utils/scrollLock';
import { Z_INDEX } from '../constants';
import { cn } from '../utils/cn';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Legend rows mirror the marker colors in Map.tsx's `iconConfig` so a token
// change in one place is easy to reflect here. Every category the current
// event data uses is represented; less-common categories (treaty, politics)
// stay in case scenarios that use them ship in the future.
const LEGEND: Array<{ color: string; ring?: string; labelAr: string }> = [
  { color: '#ef4444', labelAr: 'المعارك والغزوات' },
  { color: '#10b981', labelAr: 'الهجرات والانتقالات' },
  { color: '#f59e0b', labelAr: 'الوحي والبعثة' },
  { color: '#3b82f6', labelAr: 'المعالم والأماكن' },
  { color: '#8b5cf6', labelAr: 'المعاهدات والصلح' },
  { color: '#6366f1', labelAr: 'الأحداث السياسية' },
  { color: '#06b6d4', labelAr: 'الأحداث العامة' },
];

// Shortcuts are keyboard-only, so the section is hidden on mobile via CSS.
const SHORTCUTS: Array<{ keys: string[]; labelAr: string }> = [
  { keys: ['Ctrl', 'K'], labelAr: 'فتح البحث والتصفية' },
  { keys: ['Esc'], labelAr: 'إغلاق النوافذ المفتوحة' },
  { keys: ['←', '→'], labelAr: 'التنقل بين الأحداث' },
];

const TOUCH_HINTS: Array<{ icon: string; labelAr: string }> = [
  { icon: '👆', labelAr: 'انقر على العلامة لفتح تفاصيل الحدث' },
  { icon: '👇', labelAr: 'اسحب القائمة للأسفل لإغلاقها' },
  { icon: '🔍', labelAr: 'انقر على أيقونة البحث لفتح قائمة الأحداث' },
];

function Dot({ color, ring }: { color: string; ring?: string }) {
  return (
    <span
      className="inline-block shrink-0 rounded-full border-2 border-white shadow-[0_2px_6px_rgba(0,0,0,0.35)]"
      style={{
        width: 22,
        height: 22,
        backgroundColor: color,
        boxShadow: ring
          ? `0 0 0 3px ${ring}, 0 2px 6px rgba(0,0,0,0.35)`
          : undefined,
      }}
      aria-hidden="true"
    />
  );
}

function Key({ label }: { label: string }) {
  return (
    <kbd
      className={cn(
        'inline-flex items-center justify-center min-w-[28px] h-7 px-2',
        'rounded-[6px] border border-[var(--color-ink)]/25',
        // CSS-var background so it switches automatically with the .dark
        // theme toggle — Tailwind v4's `dark:` utility variants react to
        // `prefers-color-scheme`, not to the `.dark` class this app uses.
        'bg-[var(--color-card-bg)]',
        'text-[13px] font-bold text-[var(--color-ink)]',
      )}
    >
      {label}
    </kbd>
  );
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const focusTrapRef = useFocusTrap(isOpen);
  useScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 pointer-events-auto"
            style={{ zIndex: Z_INDEX.modalBackdrop }}
            aria-hidden="true"
          />

          {/* Modal container */}
          <div
            className="fixed inset-0 pointer-events-none flex items-end md:items-center justify-center"
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
                'md:max-w-[560px] md:max-h-[85vh] md:rounded-[var(--radius-lg)]',
                // Glass-bg switches to a dark tint via the `.dark` CSS var
                // override in index.css, so the modal reads correctly in both
                // themes (Tailwind's `dark:` utility variants aren't wired to
                // the class toggle in this project).
                'bg-[var(--glass-bg)] backdrop-blur-[16px]',
                'border-2 border-[var(--color-accent)]/25',
                'overflow-hidden shadow-[var(--shadow-modal)]',
              )}
              role="dialog"
              aria-modal="true"
              aria-labelledby="help-modal-title"
            >
              {/* Header — a soft ink-tint band that stays subtle in both
                  themes (ink/5 reads as light-brown on parchment, warm-white
                  on the dark glass surface below). */}
              <div className={cn(
                'shrink-0 p-4 md:p-5 relative',
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
                  id="help-modal-title"
                  className="text-xl md:text-2xl font-bold text-[var(--color-ink)] text-center"
                >
                  دليل الاستخدام
                </h2>
                <p className="text-xs md:text-sm text-[var(--color-ink)]/70 text-center mt-1">
                  دلالة العلامات على الخريطة والاختصارات المتاحة
                </p>
              </div>

              {/* Body */}
              <div className="overflow-y-auto p-4 md:p-6 flex flex-col gap-6">
                {/* Map legend */}
                <section aria-labelledby="help-legend-title">
                  <h3
                    id="help-legend-title"
                    className="text-base md:text-lg font-bold text-[var(--color-ink)] mb-3 flex items-center gap-2"
                  >
                    <MapPin size={18} className="text-[var(--color-accent)]" />
                    خريطة الإشارات
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {LEGEND.map(row => (
                      <li
                        key={row.labelAr}
                        className="flex items-center gap-3 text-[13px] md:text-sm text-[var(--color-ink)]/85"
                      >
                        <Dot color={row.color} ring={row.ring} />
                        <span>{row.labelAr}</span>
                      </li>
                    ))}
                    {/* Cities marker — different treatment (ringed green) so
                        it stands apart from the event-category dots. */}
                    <li className="flex items-center gap-3 text-[13px] md:text-sm text-[var(--color-ink)]/85">
                      <Dot color="var(--color-islamic-green)" ring="rgba(255,255,255,0.9)" />
                      <span>المدن التاريخية</span>
                    </li>
                    {/* Playable battle badge — mirrors the gold ▷ overlay we
                        render on Diamond, SearchMenu, and Map markers. */}
                    <li className="flex items-center gap-3 text-[13px] md:text-sm text-[var(--color-ink)]/85">
                      <span
                        className="inline-flex items-center justify-center shrink-0 rounded-full"
                        style={{
                          width: 22,
                          height: 22,
                          background: 'var(--color-accent)',
                          boxShadow: '0 0 0 1.5px rgba(20,15,10,0.85), 0 1px 3px rgba(0,0,0,0.4)',
                        }}
                        aria-hidden="true"
                      >
                        <Play
                          size={10}
                          strokeWidth={0}
                          className="text-[rgba(20,15,10,0.95)] fill-current translate-x-[1px]"
                        />
                      </span>
                      <span>معركة قابلة للمشاهدة</span>
                    </li>
                  </ul>
                </section>

                {/* Shortcuts (desktop) / Touch hints (mobile) — hide the
                    keyboard block on touch-only viewports so a phone user
                    isn't shown Ctrl+K they can't reach. */}
                <section
                  aria-labelledby="help-shortcuts-title"
                  className="hidden md:block"
                >
                  <h3
                    id="help-shortcuts-title"
                    className="text-base md:text-lg font-bold text-[var(--color-ink)] mb-3"
                  >
                    اختصارات لوحة المفاتيح
                  </h3>
                  <ul className="flex flex-col gap-2.5">
                    {SHORTCUTS.map(row => (
                      <li
                        key={row.labelAr}
                        className="flex items-center justify-between gap-3 text-[13px] md:text-sm text-[var(--color-ink)]/85 py-1.5"
                      >
                        <span>{row.labelAr}</span>
                        <span className="flex items-center gap-1.5">
                          {row.keys.map((k, i) => (
                            <span key={i} className="flex items-center gap-1.5">
                              {i > 0 && <span className="text-[var(--color-ink)]/40 text-xs">+</span>}
                              <Key label={k} />
                            </span>
                          ))}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Touch hints (mobile only) — a lightweight equivalent of
                    the shortcuts section for a keyboard-less viewport. */}
                <section
                  aria-labelledby="help-touch-title"
                  className="md:hidden"
                >
                  <h3
                    id="help-touch-title"
                    className="text-base font-bold text-[var(--color-ink)] mb-3"
                  >
                    إيماءات اللمس
                  </h3>
                  <ul className="flex flex-col gap-2.5">
                    {TOUCH_HINTS.map(row => (
                      <li
                        key={row.labelAr}
                        className="flex items-center gap-3 text-[13px] text-[var(--color-ink)]/85"
                      >
                        <span className="text-lg shrink-0 w-6 text-center" aria-hidden="true">
                          {row.icon}
                        </span>
                        <span>{row.labelAr}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
