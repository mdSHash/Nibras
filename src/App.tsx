import React, { useState, useEffect, useMemo } from 'react';
import HistoricalMap from './components/Map';
import Timeline from './components/Timeline';
import EventPanel from './components/EventPanel';
import SearchMenu from './components/SearchMenu';
import CompanionModal from './components/CompanionModal';
import QuranModal from './components/QuranModal';
import { eventsData, EventItem } from './data';
import { Moon, Sun, Play, Pause, Square, PlayCircle, Menu, Search } from 'lucide-react';
import { FilterOptions } from './types';
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [tourIndex, setTourIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCompanion, setSelectedCompanion] = useState<string | null>(null);
  const [selectedQuranRef, setSelectedQuranRef] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<FilterOptions>({
    era: 'all',
    type: 'all'
  });

  // Filter events based on filters state
  const filteredSortedEvents = useMemo(() => {
    return [...eventsData]
      .filter(evt => {
        // Era matching
        if (filters.era === 'prophet' && evt.era === 'rashidun') return false;
        if (filters.era === 'rashidun' && evt.era !== 'rashidun') return false;
        
        // Type matching
        if (filters.type === 'cities') return false; // Show no events if only cities
        if (filters.type === 'battles' && evt.category !== 'battle') return false;
        if (filters.type === 'events' && evt.category === 'battle') return false; // Hide battles if 'events' only selected
        
        return true;
      })
      .sort((a, b) => a.date.gregorian - b.date.gregorian);
  }, [filters]);

  // Toggle body class for completely safe mapping outside of React root component boundry as well as React components
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle auto-advance
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      const delay = 5000 / playbackSpeed;
      interval = setInterval(() => {
        setTourIndex(curr => {
          if (curr >= filteredSortedEvents.length - 1) {
            setIsPlaying(false);
            return curr;
          }
          const nextIndex = curr + 1;
          setSelectedEvent(filteredSortedEvents[nextIndex]);
          return nextIndex;
        });
      }, delay);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, filteredSortedEvents]);

  const startTour = () => {
    setTourIndex(0);
    setSelectedEvent(filteredSortedEvents[0]);
    setIsPlaying(true);
    setPlaybackSpeed(1);
  };

  const stopTour = () => {
    setTourIndex(-1);
    setIsPlaying(false);
    setSelectedEvent(null);
  };

  const cycleSpeed = () => {
    setPlaybackSpeed(current => current === 1 ? 2 : current === 2 ? 4 : 1);
  };

  const displayedEvents = tourIndex === -1 ? filteredSortedEvents : filteredSortedEvents.slice(0, tourIndex + 1);

  // Get the most recent event up to current selection, or just sort chronologically
  return (
    <div className={`w-full h-screen overflow-hidden flex flex-col bg-parchment relative font-serif text-ink transition-colors duration-500`} dir="rtl">
      
      {/* App Header */}
      <header className="absolute top-0 left-0 right-0 h-[60px] sm:h-[80px] px-4 md:px-10 flex items-center justify-between border-b border-border-dark/30 bg-gradient-to-b from-ink/80 via-ink/40 to-transparent z-[500] pointer-events-none backdrop-blur-[2px]">
        
        {/* Title */}
        <div className="flex items-center gap-4 pointer-events-auto shrink-0 drop-shadow-md">
          <div className="text-[24px] sm:text-[28px] md:text-[32px] font-bold tracking-[2px] text-parchment">
            نِبْرَاس
          </div>
          <div className="italic text-[13px] md:text-[14px] text-parchment/80 hidden lg:block">
            التاريخ الإسلامي كما لم تره من قبل
          </div>
        </div>

        {/* Global Search Bar replacing the Burger UX */}
        <div className="flex-1 max-w-[450px] mx-4 pointer-events-auto hidden md:block">
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="w-full flex items-center gap-3 px-6 py-2.5 bg-card-bg/95 backdrop-blur shadow-[0_4px_15px_rgba(0,0,0,0.2)] rounded-full border border-border-dark/40 text-ink/70 hover:bg-parchment hover:text-ink transition-all group"
          >
            <Search size={18} className="text-accent group-hover:scale-110 transition-transform" />
            <span className="font-bold text-[14px] truncate">
              ابحث واستكشف {filteredSortedEvents.length} حدث تاريخي...
            </span>
          </button>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3 pointer-events-auto shrink-0">
          {/* Mobile search button */}
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="w-10 h-10 md:hidden rounded-full border border-parchment/30 bg-ink/50 backdrop-blur flex justify-center items-center text-parchment hover:bg-card-bg hover:text-ink transition-all shadow-sm"
          >
            <Search size={18} />
          </button>

          {/* Theme Toggle */}
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-10 h-10 rounded-full border border-parchment/30 bg-ink/50 backdrop-blur flex justify-center items-center text-parchment hover:bg-card-bg hover:text-ink transition-all shadow-sm"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Main Map Layer */}
      <main className="flex-1 relative z-0">
        <HistoricalMap 
          events={displayedEvents} 
          selectedEvent={selectedEvent} 
          onSelectEvent={setSelectedEvent} 
          showCities={filters.type === 'all' || filters.type === 'cities'}
          onOpenFilter={() => setIsMenuOpen(true)}
        />
      </main>

      {/* Side Information Panel */}
      <EventPanel 
        event={selectedEvent} 
        onClose={() => setSelectedEvent(null)} 
        onCompanionClick={(name) => setSelectedCompanion(name)}
        onQuranClick={(ref) => setSelectedQuranRef(ref)}
      />

      {/* Companion Details Modal */}
      <CompanionModal
        companionName={selectedCompanion}
        onClose={() => setSelectedCompanion(null)}
      />

      {/* Quran Display Modal */}
      {selectedQuranRef && (
        <QuranModal
          reference={selectedQuranRef}
          onClose={() => setSelectedQuranRef(null)}
        />
      )}

      {/* Global Search and Navigation Menu */}
      <SearchMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        events={filteredSortedEvents} 
        onSelectEvent={(evt) => {
          // If we are playing the tour, optionally stop it or jump
          if (isPlaying) stopTour();
          setSelectedEvent(evt);
        }} 
        filters={filters}
        setFilters={setFilters}
      />

      <Timeline 
        events={displayedEvents}
        selectedEvent={selectedEvent}
        onSelectEvent={setSelectedEvent}
        tourState={{
          isTourMode: tourIndex !== -1,
          isPlaying,
          playbackSpeed,
          startTour,
          stopTour,
          togglePlay: () => setIsPlaying(!isPlaying),
          cycleSpeed
        }}
      />
      <Analytics />
    </div>
  );
}

