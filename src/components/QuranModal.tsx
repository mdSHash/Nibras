import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink } from 'lucide-react';
import quranData from '../quranData.json';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useScrollLock } from '../utils/scrollLock';
import { Z_INDEX } from '../constants';

interface QuranModalProps {
  reference: string;
  onClose: () => void;
}

export default function QuranModal({ reference, onClose }: QuranModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const data = (quranData as any)[reference];

  // Enable focus trap when modal is open
  useFocusTrap(!!reference && !!data);
  
  // Lock scroll when modal is open
  useScrollLock(!!reference && !!data);

  // Auto-focus close button when modal opens
  useEffect(() => {
    if (reference && data && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [reference, data]);

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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink/70 backdrop-blur-sm pointer-events-auto"
            style={{ zIndex: Z_INDEX.modalBackdrop }}
            aria-hidden="true"
          />

          <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6 pointer-events-none" style={{ zIndex: Z_INDEX.modal }} dir="rtl">
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[85vh] bg-parchment rounded-xl shadow-2xl overflow-hidden flex flex-col border border-accent/30 scrollable pointer-events-auto"
              role="dialog"
              aria-modal="true"
              aria-labelledby="quran-modal-title"
            >
            {/* Decorative Header */}
          <div className="bg-[#f0ecd6] border-b border-accent/20 p-5 shrink-0 relative overflow-hidden">
             {/* Decorative corners */}
            <div className="absolute top-2 right-2 w-10 h-10 border-t-2 border-r-2 border-accent opacity-20"></div>
            <div className="absolute top-2 left-2 w-10 h-10 border-t-2 border-l-2 border-accent opacity-20"></div>
            
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="absolute left-4 top-4 p-2 bg-ink/5 hover:bg-battle-red/10 hover:text-battle-red text-ink rounded-full transition-colors z-10 focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label="إغلاق نافذة الآية القرآنية"
            >
              <X size={20} />
            </button>
            <div className="text-center">
              <h2 id="quran-modal-title" className="text-2xl font-bold text-accent mb-1">{reference}</h2>
              <p className="text-sm font-medium text-ink/60">
                 سورة رقم {data.surahNum} • الآيات ({data.start} {data.end ? `- ${data.end}` : ''})
              </p>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 md:p-10 overflow-y-auto" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(139, 107, 74, 0.03) 0%, transparent 100%)' }}>
            <p
              className="text-[36px] md:text-[34px] leading-[2.6] text-center text-islamic-green"
              style={{ fontFamily: "'Amiri Quran', serif" }}
            >
              {data.text}
            </p>
          </div>

          <div className="bg-ink/5 p-4 border-t border-accent/10 flex justify-center shrink-0">
             <a 
                href={data.link} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 px-6 py-2.5 bg-accent/10 border border-accent text-accent hover:bg-accent hover:text-parchment text-[14px] font-bold rounded-full transition-all"
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

