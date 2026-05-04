import React, { useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Star } from 'lucide-react';
import { findCompanion } from '../companionsList';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useScrollLock } from '../utils/scrollLock';
import { Z_INDEX } from '../constants';

interface CompanionModalProps {
  companionName: string | null;
  onClose: () => void;
}

export default function CompanionModal({ companionName, onClose }: CompanionModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  
  const companion = useMemo(() => {
    if (!companionName) return null;
    return findCompanion(companionName) || null;
  }, [companionName]);

  // Enable focus trap when modal is open
  useFocusTrap(!!companionName);
  
  // Lock scroll when modal is open
  useScrollLock(!!companionName);

  // Auto-focus close button when modal opens
  useEffect(() => {
    if (companionName && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [companionName]);

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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
            style={{ zIndex: Z_INDEX.modalBackdrop }}
            aria-hidden="true"
          />
          <div className="fixed inset-0 pointer-events-none" style={{ zIndex: Z_INDEX.modal }}>
            <motion.div
               ref={modalRef}
               initial={{ scale: 0.9, opacity: 0, x: '-50%', y: '-50%' }}
               animate={{ scale: 1, opacity: 1, x: '-50%', y: '-50%' }}
               exit={{ scale: 0.9, opacity: 0, x: '-50%', y: '-50%' }}
               transition={{ type: "spring", stiffness: 300, damping: 25 }}
               className="absolute top-1/2 left-1/2 w-[90%] max-w-[450px] bg-parchment rounded-xl border-2 border-border-dark pointer-events-auto overflow-y-auto max-h-[90vh] scrollable"
               style={{
                 padding: '24px',
                 boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
               }}
               dir="rtl"
               role="dialog"
               aria-modal="true"
               aria-labelledby="companion-modal-title"
            >
             <button
                ref={closeButtonRef}
                onClick={onClose}
                className="absolute top-4 left-4 w-10 h-10 flex justify-center items-center rounded-full hover:bg-ink/20 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                style={{ backgroundColor: 'rgba(44, 36, 30, 0.1)', color: 'var(--color-ink)' }}
                aria-label="إغلاق نافذة معلومات الصحابي"
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
                  <h2 className="text-[22px] font-bold mb-2" style={{ color: 'var(--color-ink)' }}>{companionName}</h2>
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
