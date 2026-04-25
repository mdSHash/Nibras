import React, { useState, useMemo } from 'react';
import { EventItem, citiesData } from '../data';
import { X, Search, MapPin, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FilterOptions } from '../types';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { EmptyState } from './EmptyState';

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
  const debouncedSearch = useDebouncedValue(searchQuery, 300);

  const filteredEvents = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    if (!query) return events;
    return events.filter(e => 
      e.title.toLowerCase().includes(query) || 
      (e.details.summary && e.details.summary.toLowerCase().includes(query)) ||
      (e.details.full_description && e.details.full_description.toLowerCase().includes(query)) ||
      (e.location.name && e.location.name.toLowerCase().includes(query)) ||
      e.date.gregorian.toString().includes(query) ||
      (e.date.hijri_relative && e.date.hijri_relative.toString().includes(query))
    );
  }, [debouncedSearch, events]);

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
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[400px] bg-parchment z-[1000] border-l-2 border-border-dark flex flex-col pointer-events-auto"
            style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
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
                <span className="font-bold text-ink">
                  {filters.type === 'cities' ? 'إجمالي المدن المعروضة:' : 'إجمالي الأحداث المعروضة:'}
                </span>
              </div>
              <div className="font-bold text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
                {filters.type === 'cities' ? `${citiesData.length} مدينة` : `${filteredEvents.length} حدث`}
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
                  className="w-full bg-card-bg border border-border-dark/50 py-3 pr-12 pl-4 text-ink focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  style={{ borderRadius: '8px', padding: '12px 16px 12px 48px' }}
                />
                <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/70" />
              </div>

              {/* Filters UI */}
              <div data-tour-id="filters-section" className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm text-ink/80 font-bold mb-1">
                  <Filter size={16} /> تصفية الخريطة
                </div>
                
                {/* Era Filter */}
                <div className="flex bg-ink/10 p-1" style={{ borderRadius: '6px' }}>
                  {(['all', 'prophet', 'rashidun'] as const).map(era => (
                    <button
                      key={era}
                      onClick={() => setFilters({ ...filters, era })}
                      className={`flex-1 py-2 sm:py-1.5 text-xs font-bold transition-colors min-h-[44px] ${filters.era === era ? 'bg-accent text-parchment shadow' : 'text-ink active:bg-ink/10'}`}
                      style={{ borderRadius: '6px' }}
                    >
                      {era === 'all' ? 'الكل' : era === 'prophet' ? 'عصر النبي ﷺ' : 'الخلفاء الراشدين'}
                    </button>
                  ))}
                </div>

                {/* Type Filter */}
                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    onClick={() => setFilters({ ...filters, type: 'all' })}
                    className={`px-3 py-2 sm:py-1.5 font-bold transition-colors min-h-[44px] ${filters.type === 'all' ? 'bg-ink text-parchment' : 'bg-card-bg border border-border-dark text-ink active:bg-parchment'}`}
                    style={{ borderRadius: '6px' }}
                  >الكل</button>
                  <button
                    onClick={() => setFilters({ ...filters, type: 'battles' })}
                    className={`px-3 py-2 sm:py-1.5 font-bold transition-colors min-h-[44px] ${filters.type === 'battles' ? 'bg-battle-red text-parchment' : 'bg-card-bg border border-border-dark text-ink active:bg-parchment'}`}
                    style={{ borderRadius: '6px' }}
                  >المعارك فقط</button>
                  <button
                    onClick={() => setFilters({ ...filters, type: 'events' })}
                    className={`px-3 py-2 sm:py-1.5 font-bold transition-colors min-h-[44px] ${filters.type === 'events' ? 'bg-accent text-parchment' : 'bg-card-bg border border-border-dark text-ink active:bg-parchment'}`}
                    style={{ borderRadius: '6px' }}
                  >الأحداث فقط</button>
                  <button
                    onClick={() => setFilters({ ...filters, type: 'cities' })}
                    className={`px-3 py-2 sm:py-1.5 font-bold transition-colors min-h-[44px] ${filters.type === 'cities' ? 'bg-islamic-green text-parchment' : 'bg-card-bg border border-border-dark text-ink active:bg-parchment'}`}
                    style={{ borderRadius: '6px' }}
                  >المدن فقط</button>
                </div>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2 no-scrollbar">
              {filters.type === 'cities' ? (
                <div className="flex flex-col" style={{ gap: '8px' }}>
                  {citiesData.map(city => (
                    <div
                      key={city.id}
                      className="flex flex-col text-right p-3 rounded-lg bg-islamic-green/10 border border-islamic-green/30 gap-1"
                    >
                      <div className="flex justify-between items-start w-full">
                        <span className="font-bold" style={{ color: 'var(--color-ink)' }}>{city.name}</span>
                        <MapPin size={16} className="text-islamic-green shrink-0" />
                      </div>
                      
                      <div className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--color-ink)', opacity: 0.8 }}>
                        {city.description}
                      </div>
                      <div className="text-xs mt-2 leading-relaxed p-2 bg-ink/5 rounded" style={{ color: 'var(--color-ink)', opacity: 0.7 }}>
                        <span className="font-bold text-islamic-green">الأهمية: </span>
                        {city.significance}
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredEvents.length === 0 ? (
                <EmptyState
                  icon={<Search size={48} />}
                  title="لا توجد نتائج"
                  description={searchQuery ? 'لم نجد أحداثاً مطابقة لبحثك. جرب كلمات مختلفة.' : 'لا توجد أحداث تطابق الفلاتر المحددة.'}
                />
              ) : (
                <div className="flex flex-col" style={{ gap: '8px' }}>
                  {filteredEvents.map(evt => (
                    <button
                      key={evt.id}
                      onClick={() => {
                        onSelectEvent(evt);
                        onClose();
                        setSearchQuery('');
                      }}
                      className="flex flex-col text-right p-3 rounded-lg active:bg-accent/10 transition-colors border border-transparent active:border-accent/30 gap-1 group min-h-[44px]"
                    >
                      <div className="flex justify-between items-start w-full">
                        <span className="font-bold group-hover:text-battle-red transition-colors" style={{ color: 'var(--color-ink)' }}>{evt.title}</span>
                        <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded shrink-0">
                          {evt.date.gregorian} م
                        </span>
                      </div>
                      
                      <div className="flex items-center text-xs mt-1 gap-1" style={{ color: 'var(--color-ink)', opacity: 0.8 }}>
                        <MapPin size={12} className="shrink-0" />
                        <span className="truncate">{evt.location.name}</span>
                      </div>
                      <div className="text-xs mt-1 leading-relaxed line-clamp-1" style={{ color: 'var(--color-ink)', opacity: 0.7 }}>
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
