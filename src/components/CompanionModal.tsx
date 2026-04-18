import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Star } from 'lucide-react';
import { companionsData, CompanionData, findCompanion } from '../companionsList';

interface CompanionModalProps {
  companionName: string | null;
  onClose: () => void;
}

export default function CompanionModal({ companionName, onClose }: CompanionModalProps) {
  const companion = useMemo(() => {
    if (!companionName) return null;
    
    // First try the robust cleanup function from companionsList
    const exactMatch = findCompanion(companionName);
    if (exactMatch) return exactMatch;
    
    // Fallback search with safer rules to prevent cross-matching
    const query = companionName.replace(/رضي الله عنهم|رضي الله عنها|رضي الله عنه|ﷺ|عليه السلام/g, '').trim().toLowerCase();
    
    return companionsData.find(c => {
      const name = c.name.toLowerCase();
      // Safe partial match: The companion's whole name must be part of the query, OR the query must be part of the companion's name,
      // BUT we avoid matching short names against patronymics (e.g. query "أسماء بنت أبي بكر" contains "أبي بكر" which is an alias for Abu Bakr.
      // Therefore, if the query is LONG (> 10 chars) and contains "بنت", it shouldn't match a male alias.
      if (query.includes('بنت') && !name.includes('بنت')) {
         return false; // Prevent a woman's patronymic matching her father's record
      }
      if (query.includes('بن ') && !name.includes('بن ') && !c.aliases.some(a => a.includes('بن '))) {
         // Not a perfect heuristic, but helps
      }
      
      return name === query || 
             name.includes(query) || 
             (c.title && c.title.toLowerCase().includes(query)) ||
             c.aliases.some(a => {
                const alias = a ? a.toLowerCase() : '';
                return alias === query || alias === query.replace(' بن ', ' ابن ');
             });
    });
  }, [companionName]);

  return (
    <AnimatePresence>
      {companionName && (
        <div style={{ zIndex: 9998 }} className="fixed inset-0 pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
          />
          <motion.div
             initial={{ scale: 0.9, opacity: 0, x: '-50%', y: '-50%' }}
             animate={{ scale: 1, opacity: 1, x: '-50%', y: '-50%' }}
             exit={{ scale: 0.9, opacity: 0, x: '-50%', y: '-50%' }}
             transition={{ type: "spring", stiffness: 300, damping: 25 }}
             className="absolute top-1/2 left-1/2 w-[90%] max-w-[450px] bg-parchment rounded-xl shadow-2xl border-2 border-border-dark p-6 pointer-events-auto"
             dir="rtl"
          >
             <button 
                onClick={onClose}
                className="absolute top-4 left-4 w-8 h-8 flex justify-center items-center rounded-full hover:bg-ink/10 text-ink transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>

            {companion ? (
              <div>
                <div className="flex items-center gap-3 border-b border-border-dark/30 pb-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-accent text-parchment flex justify-center items-center shrink-0 shadow-md">
                    <User size={24} />
                  </div>
                  <div>
                    <h2 className="text-[22px] font-bold text-ink">{companion.name}</h2>
                    <p className="text-[13px] text-accent font-bold mt-0.5">{companion.title} • {companion.role}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-ink/80 text-[15px] leading-[1.8] text-justify font-medium">
                      {companion.description}
                    </p>
                  </div>
                  <div className="bg-ink/5 p-3 rounded-lg border border-border-dark/10 flex items-center gap-2">
                    <Star size={16} className="text-battle-red shrink-0" />
                    <span className="text-[13px] font-bold text-ink">تاريخ الميلاد والوفاة:</span>
                    <span className="text-[13px] text-ink/80">{companion.birth_death}</span>
                  </div>
                </div>
              </div>
            ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 mx-auto rounded-full bg-border-dark/20 text-ink/50 flex justify-center items-center mb-4">
                    <User size={32} />
                  </div>
                  <h2 className="text-[20px] font-bold text-ink mb-2">{companionName}</h2>
                  <p className="text-[14px] text-ink/70">
                    لم يتم العثور على سيرة تفصيلية لهذا العَلَم في قاعدة البيانات الحالية.
                  </p>
                </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
