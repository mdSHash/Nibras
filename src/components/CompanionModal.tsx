import React, { useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Star } from 'lucide-react';
import { findCompanion } from '../companionsList';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useScrollLock } from '../utils/scrollLock';
import { Z_INDEX } from '../constants';
import { cn } from '../utils/cn';
import { scaleIn, slideUp } from '../utils/motionVariants';

interface CompanionModalProps {
  companionName: string | null;
  onClose: () => void;
}

export default function CompanionModal({ companionName, onClose }: CompanionModalProps) {
  const focusTrapRef = useFocusTrap(!!companionName);
  
  const companion = useMemo(() => {
    if (!companionName) return null;
    return findCompanion(companionName) || null;
  }, [companionName]);

  // Lock scroll when modal is open
  useScrollLock(!!companionName);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && companionName) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [companionName, onClose]);

  return (
    <AnimatePresence>
      {companionName && (
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
          >
            <motion.div
              ref={focusTrapRef}
              // Mobile: slide up from bottom; Desktop: scale in center
              variants={undefined}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={cn(
                "pointer-events-auto relative w-full",
                // Mobile: bottom sheet
                "max-h-[85dvh] rounded-t-[var(--radius-xl)]",
                // Desktop: centered card
                "md:max-w-[480px] md:max-h-[80vh] md:rounded-[var(--radius-lg)]",
                // Glassmorphism background
                "bg-[var(--glass-bg)] backdrop-blur-[16px]",
                // Content
                "overflow-y-auto p-6"
              )}
              dir="rtl"
              role="dialog"
              aria-modal="true"
              aria-labelledby="companion-modal-title"
            >
              {/* Close button - 48x48 touch target */}
              <button
                onClick={onClose}
                className={cn(
                  "absolute top-4 left-4 w-12 h-12",
                  "flex justify-center items-center rounded-full",
                  "hover:bg-ink/20 transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-accent"
                )}
                style={{ backgroundColor: 'rgba(44, 36, 30, 0.1)', color: 'var(--color-ink)' }}
                aria-label="إغلاق"
              >
                <X size={22} strokeWidth={2.5} />
              </button>

              {companion ? (
                <div>
                  <div className="flex items-center gap-3 pb-5 mb-5" style={{ borderBottom: '2px solid rgba(61, 43, 31, 0.2)' }}>
                    <div className="w-14 h-14 rounded-full bg-accent text-parchment flex justify-center items-center shrink-0 shadow-md">
                      <User size={26} />
                    </div>
                    <div>
                      <h2 id="companion-modal-title" className="text-[24px] font-bold leading-tight" style={{ color: 'var(--color-ink)' }}>{companion.name}</h2>
                      <p className="text-[14px] text-accent font-bold mt-1">{companion.title} • {companion.role}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                      <p className="text-justify font-medium" style={{ color: 'var(--color-ink)', opacity: 0.9, fontSize: '22px', lineHeight: '1.6' }}>
                        {companion.description}
                      </p>
                    </div>
                    <div className="bg-ink/5 p-4 rounded-lg border border-border-dark/10 flex items-center gap-2">
                      <Star size={18} className="text-battle-red shrink-0" />
                      <span className="text-[14px] font-bold" style={{ color: 'var(--color-ink)' }}>تاريخ الميلاد والوفاة:</span>
                      <span className="text-[14px]" style={{ color: 'var(--color-ink)', opacity: 0.85 }}>{companion.birth_death}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 mx-auto rounded-full flex justify-center items-center mb-4" style={{ backgroundColor: 'rgba(61, 43, 31, 0.15)', color: 'rgba(44, 36, 30, 0.5)' }}>
                    <User size={32} />
                  </div>
                  <h2 id="companion-modal-title" className="text-[22px] font-bold mb-2" style={{ color: 'var(--color-ink)' }}>{companionName}</h2>
                  <p className="text-[15px]" style={{ color: 'var(--color-ink)', opacity: 0.75, lineHeight: '1.5' }}>
                    لم يتم العثور على سيرة تفصيلية لهذا العَلَم في قاعدة البيانات الحالية.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
