import React, { useState, useMemo } from 'react';
import { EventItem } from '../data';
import { X, Search, MapPin, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FilterOptions } from '../types';

interface SearchMenuProps {
  isOpen: boolean;
  onClose: () => void;
  events: EventItem[];
  onSelectEvent: (event: EventItem) => void;
  filters: FilterOptions;
  setFilters: (f: FilterOptions) => void;
}

export default function SearchMenu({ isOpen, onClose, events, onSelectEvent, filters, setFilters }: SearchMenuProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return events;
    return events.filter(e => 
      e.title.toLowerCase().includes(query) || 
      (e.details.summary && e.details.summary.toLowerCase().includes(query)) ||
      (e.details.full_description && e.details.full_description.toLowerCase().includes(query)) ||
      (e.location.name && e.location.name.toLowerCase().includes(query)) ||
      e.date.gregorian.toString().includes(query) ||
      (e.date.hijri_relative && e.date.hijri_relative.toString().includes(query))
    );
  }, [searchQuery, events]);

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
            className="fixed inset-0 z-[900] bg-black/40 backdrop-blur-sm pointer-events-auto"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[400px] bg-parchment z-[1000] border-l-2 border-border-dark flex flex-col shadow-2xl pointer-events-auto"
            dir="rtl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border-dark bg-panel-bg">
              <h2 className="text-xl font-bold text-ink">استكشاف الأحداث</h2>
              <button
                onClick={onClose}
                aria-label="إغلاق القائمة"
                className="w-8 h-8 flex justify-center items-center rounded-full hover:bg-ink/10 text-ink transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Event Count and Info */}
            <div className="px-4 py-2 bg-ink/5 border-b border-border-dark flex justify-between items-center text-sm shadow-inner">
              <div className="flex items-center gap-2">
                <span className="font-bold text-ink">إجمالي الأحداث المعروضة:</span>
              </div>
              <div className="font-bold text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
                {filteredEvents.length} حدث
              </div>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b border-border-dark flex flex-col gap-4">
              <div className="relative">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن غزوة، حدث، سنة..."
                  className="w-full bg-card-bg border border-border-dark/50 rounded-full py-2.5 pr-10 pl-4 text-ink focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                />
                <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/50" />
              </div>

              {/* Filters UI */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm text-ink/80 font-bold mb-1">
                  <Filter size={16} /> تصفية الخريطة
                </div>
                
                {/* Era Filter */}
                <div className="flex bg-ink/10 rounded-lg p-1">
                  {(['all', 'prophet', 'rashidun'] as const).map(era => (
                    <button
                      key={era}
                      onClick={() => setFilters({ ...filters, era })}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${filters.era === era ? 'bg-accent text-parchment shadow' : 'text-ink/70 hover:bg-ink/5'}`}
                    >
                      {era === 'all' ? 'الكل' : era === 'prophet' ? 'عصر النبي ﷺ' : 'الخلفاء الراشدين'}
                    </button>
                  ))}
                </div>

                {/* Type Filter */}
                <div className="flex flex-wrap gap-2 text-xs">
                  <button 
                    onClick={() => setFilters({ ...filters, type: 'all' })}
                    className={`px-3 py-1.5 rounded-full font-bold transition-colors ${filters.type === 'all' ? 'bg-ink text-parchment' : 'bg-card-bg border border-border-dark text-ink hover:bg-parchment'}`}
                  >الكل</button>
                  <button 
                    onClick={() => setFilters({ ...filters, type: 'battles' })}
                    className={`px-3 py-1.5 rounded-full font-bold transition-colors ${filters.type === 'battles' ? 'bg-battle-red text-parchment' : 'bg-card-bg border border-border-dark text-ink hover:bg-parchment'}`}
                  >المعارك فقط</button>
                  <button 
                    onClick={() => setFilters({ ...filters, type: 'events' })}
                    className={`px-3 py-1.5 rounded-full font-bold transition-colors ${filters.type === 'events' ? 'bg-accent text-parchment' : 'bg-card-bg border border-border-dark text-ink hover:bg-parchment'}`}
                  >الأحداث فقط</button>
                  <button 
                    onClick={() => setFilters({ ...filters, type: 'cities' })}
                    className={`px-3 py-1.5 rounded-full font-bold transition-colors ${filters.type === 'cities' ? 'bg-islamic-green text-parchment' : 'bg-card-bg border border-border-dark text-ink hover:bg-parchment'}`}
                  >المدن فقط</button>
                </div>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2 no-scrollbar">
              {filteredEvents.length === 0 ? (
                <div className="text-center text-ink/60 mt-10 p-4">
                  لا توجد نتائج مطابقة لبحثك. لم نجده في طيات التاريخ!
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {filteredEvents.map(evt => (
                    <button
                      key={evt.id}
                      onClick={() => {
                        onSelectEvent(evt);
                        onClose();
                        setSearchQuery('');
                      }}
                      className="flex flex-col text-right p-3 rounded-lg hover:bg-accent/10 transition-colors border border-transparent hover:border-accent/30 gap-1 group"
                    >
                      <div className="flex justify-between items-start w-full">
                        <span className="font-bold text-ink group-hover:text-battle-red transition-colors">{evt.title}</span>
                        <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded shrink-0">
                          {evt.date.gregorian} م
                        </span>
                      </div>
                      
                      <div className="flex items-center text-xs text-ink/70 mt-1 gap-1">
                        <MapPin size={12} className="shrink-0" />
                        <span className="truncate">{evt.location.name}</span>
                      </div>
                      <div className="text-xs text-ink/50 line-clamp-1 mt-1 leading-relaxed">
                        {evt.details.summary}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
