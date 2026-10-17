import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink } from 'lucide-react';
import { quranPassages } from '../data';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useScrollLock } from '../utils/scrollLock';
import { Z_INDEX } from '../constants';
import { cn } from '../utils/cn';
import { passageTexts, useLazyContent } from '../lazyContent';
import { ContentLoadState } from './ContentLoadState';

interface QuranModalProps {
  reference: string;
  onClose: () => void;
}

export default function QuranModal({ reference, onClose }: QuranModalProps) {
  const data = quranPassages[reference];
  const text = useLazyContent(passageTexts, data ? reference : null);
  const focusTrapRef = useFocusTrap(!!reference && !!data);

  // Lock scroll when modal is open
  useScrollLock(!!reference && !!data);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && reference) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [reference, onClose]);

  if (!data) return null;

  return (
    <AnimatePresence>
      {reference && data && (
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

          {/* Modal Container */}
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
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={cn(
                "pointer-events-auto relative w-full flex flex-col",
                // Mobile: bottom sheet
                "max-h-[85dvh] rounded-t-[var(--radius-xl)]",
                // Desktop: centered card
                "md:max-w-[560px] md:max-h-[80vh] md:rounded-[var(--radius-lg)]",
                // Solid background for readability
                "bg-paper backdrop-blur-[16px]",
                // Border
                "border-2 border-[var(--color-islamic-green)]/20",
                "overflow-hidden"
              )}
              role="dialog"
              aria-modal="true"
              aria-labelledby="quran-modal-title"
            >
              {/* Decorative Header */}
              <div className="bg-quran-head border-b border-accent/20 p-5 shrink-0 relative overflow-hidden">
                {/* Decorative corners */}
                <div className="absolute top-2 right-2 w-10 h-10 border-t-2 border-r-2 border-accent opacity-20"></div>
                <div className="absolute top-2 left-2 w-10 h-10 border-t-2 border-l-2 border-accent opacity-20"></div>
                
                {/* Close button - 48x48 touch target */}
                <button
                  onClick={onClose}
                  className={cn(
                    "absolute left-4 top-4 w-12 h-12",
                    "flex justify-center items-center rounded-full",
                    "bg-ink/5 hover:bg-battle-red/10 hover:text-battle-red",
                    "text-quran-close",
                    "transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                  )}
                  aria-label="إغلاق"
                >
                  <X size={20} />
                </button>

                <div className="text-center">
                  <h2 id="quran-modal-title" className="text-2xl font-bold text-quran-title mb-1">{reference}</h2>
                  <p className="text-sm font-medium text-quran-muted">
                    سورة رقم {data.surah} • الآيات ({data.from} {data.to ? `- ${data.to}` : ''})
                  </p>
                </div>
              </div>

              {/* Quran Text Content */}
              <div
                className="p-6 md:p-10 overflow-y-auto bg-quran-body"
              >
                {text.status === 'ready' ? (
                  <p
                    className="text-2xl md:text-3xl leading-[2] text-center text-paper-ink"
                    style={{ fontFamily: "'Amiri Quran', serif" }}
                  >
                    {text.data}
                  </p>
                ) : (
                  <ContentLoadState state={text} lines={3} />
                )}
              </div>

              {/* Footer with Quran.com link */}
              <div className="bg-quran-foot p-4 border-t border-accent/10 flex justify-center shrink-0">
                <a
                  href={data.link}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    "flex items-center gap-2 px-6 py-2.5 min-h-[48px]",
                    "bg-islamic-green/10 border border-islamic-green",
                    "text-quran-title hover:bg-islamic-green hover:text-white",
                    "text-[14px] font-bold rounded-full transition-all"
                  )}
                >
                  المزيد على Quran.com <ExternalLink size={16} />
                </a>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
