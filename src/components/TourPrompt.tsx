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
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-[90%] max-w-md"
          >
            <div className="bg-card-bg border-2 border-accent/30 rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-br from-accent/20 to-accent/5 p-6 border-b border-accent/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                      <Compass className="w-6 h-6 text-accent" />
                    </div>
                    <h2 className="text-2xl font-bold text-ink">
                      مرحباً بك في نبراس
                    </h2>
                  </div>
                  <button
                    onClick={onDecline}
                    className="w-8 h-8 rounded-full hover:bg-ink/10 flex items-center justify-center transition-colors"
                    aria-label="إغلاق"
                  >
                    <X className="w-5 h-5 text-ink/60" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <p className="text-ink/80 text-lg leading-relaxed mb-6">
                  هل تريد عرض جولة تعريفية سريعة لاستكشاف مميزات التطبيق؟
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    onClick={onAccept}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 bg-accent text-parchment rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Compass className="w-5 h-5" />
                    نعم، ابدأ الجولة
                  </motion.button>

                  <motion.button
                    onClick={onDecline}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 bg-ink/10 text-ink rounded-xl font-bold text-lg hover:bg-ink/20 transition-all"
                  >
                    لا، شكراً
                  </motion.button>
                </div>

                <p className="text-ink/50 text-sm text-center mt-4">
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

// Made with Bob
