import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, X } from 'lucide-react';

interface TourPromptProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export const TourPrompt: React.FC<TourPromptProps> = ({ isOpen, onAccept, onDecline }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-[9998]"
            onClick={onDecline}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-[calc(100vw-2rem)] sm:w-[90%] max-w-md"
          >
            <div className="bg-card-bg border-2 border-accent/30 rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-br from-accent/20 to-accent/5 p-4 sm:p-6 border-b border-accent/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-accent/20 flex items-center justify-center">
                      <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-ink">
                      مرحباً بك في نبراس
                    </h2>
                  </div>
                  <button
                    onClick={onDecline}
                    className="w-10 h-10 sm:w-8 sm:h-8 rounded-full hover:bg-ink/10 flex items-center justify-center transition-colors min-w-[40px] min-h-[40px] sm:min-w-[32px] sm:min-h-[32px]"
                    aria-label="إغلاق"
                  >
                    <X className="w-5 h-5 text-ink/60" />
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <p className="text-ink/80 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                  هل تريد عرض جولة تعريفية سريعة لاستكشاف مميزات التطبيق؟
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    onClick={onAccept}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-4 sm:px-6 py-3 bg-accent text-parchment rounded-xl font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 min-h-[48px]"
                  >
                    <Compass className="w-5 h-5" />
                    نعم، ابدأ الجولة
                  </motion.button>

                  <motion.button
                    onClick={onDecline}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-4 sm:px-6 py-3 bg-ink/10 text-ink rounded-xl font-bold text-base sm:text-lg hover:bg-ink/20 transition-all min-h-[48px]"
                  >
                    لا، شكراً
                  </motion.button>
                </div>

                <p className="text-ink/50 text-xs sm:text-sm text-center mt-4">
                  يمكنك إعادة الجولة في أي وقت من الزر العائم
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

