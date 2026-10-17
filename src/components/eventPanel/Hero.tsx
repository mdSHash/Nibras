import { MapPin, Calendar, Crown, Play, Pause, LoaderCircle, Users, Swords } from 'lucide-react';
import type { EventItem } from '../../data';
import { cn } from '../../utils/cn';
import { toArabicIndic } from '../../../shared/arabic';
import type { EraTheme, FontScale } from './theme';
import type { Narration } from './useNarration';

/** The panel's header: era pill, title, date · place · ruler, army sizes, and the narration button. */
export function Hero({
  event,
  ruler,
  eraTheme,
  heroGradient,
  fs,
  isMobile,
  narration,
}: {
  event: EventItem;
  ruler: string;
  eraTheme: EraTheme;
  heroGradient: string;
  fs: FontScale;
  isMobile: boolean;
  narration: Narration;
}) {
  const {
    audioState,
    isAudioLoading,
    progressFraction,
    currentTime,
    duration,
    formatAudioTime,
    startAudio,
    pauseAudio,
    audioError,
  } = narration;
  const handlePlayPause = () => {
    if (audioState === 'playing') pauseAudio();
    else void startAudio(false);
  };

  // Ring geometry for the play button: 56 px diameter, 3 px stroke, full
  // circumference so the "filled" arc tracks `progressFraction`.
  const ringSize = isMobile ? 64 : 72;
  const ringStroke = 3;
  const ringRadius = (ringSize - ringStroke) / 2;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringDashOffset = ringCircumference * (1 - progressFraction);

  return (
    <header
      className="relative w-full overflow-hidden"
      style={{
        background: heroGradient,
        minHeight: isMobile ? '38vh' : '320px',
      }}
    >
      {/* Arabesque pattern overlay — subtle, kicked into the corners. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.13,
          backgroundImage:
            'repeating-radial-gradient(circle at 20% 30%, rgba(255,255,255,0.6) 0 1px, transparent 1px 22px), ' +
            'repeating-radial-gradient(circle at 80% 70%, rgba(255,255,255,0.4) 0 1px, transparent 1px 28px)',
        }}
      />
      {/* Vignette for title legibility — darkens the TOP region where the
          display title sits, since light eras (prophetic gold, abuBakr
          emerald) at full chroma drop white-text-on-color contrast below
          AA Large. Stops chosen so a band ~15% deep at the top is dimmed
          enough that white at full opacity passes ≥3:1 on every era. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to bottom, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0.10) 30%, rgba(0,0,0,0.10) 60%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      <div
        className={cn(
          'relative z-10 flex flex-col h-full',
          isMobile ? 'px-5 pt-16 pb-6' : 'px-6 pt-14 pb-6',
        )}
        style={{ minHeight: isMobile ? '38vh' : '320px' }}
      >
        {/* Era pill — bg-black/30 for cross-era contrast guarantee. The
            previous bg-white/15 over light era gradients (prophetic gold,
            abuBakr emerald) failed AA. Black scrim + white text passes on
            every era. */}
        <div className="mb-3">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold border bg-black/35 backdrop-blur-md text-white border-white/15"
            style={fs(12)}
          >
            <Crown size={13} className="shrink-0" />
            {eraTheme.title}
          </span>
        </div>

        {/* Display title — large, RTL */}
        <h1
          className="font-bold text-white leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)] mb-3"
          style={fs(isMobile ? 26 : 34)}
        >
          {event.title}
        </h1>

        {/* Meta line: date · location · ruler. Solid white (no /90) and
            stronger separator opacity so each item carries weight on the
            era-tinted gradient. */}
        <div
          className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-white mb-2 drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]"
          style={fs(13)}
        >
          <span className="inline-flex items-center gap-1.5">
            <Calendar size={13} className="shrink-0" />
            <span className="font-bold">{toArabicIndic(event.date.labelAr)}</span>
          </span>
          <span className="text-white/70" aria-hidden="true">·</span>
          {/* gregorian carries a fractional part purely for chronological
              ordering (e.g. 661.07) — only the year itself is displayed. */}
          <span className="font-medium">{toArabicIndic(event.date.gregorian.year)} م</span>
          <span className="text-white/70" aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={13} className="shrink-0" />
            <span className="font-bold truncate max-w-[180px]">{event.location.nameAr}</span>
          </span>
          {ruler && (
            <>
              <span className="text-white/70" aria-hidden="true">·</span>
              <span className="font-bold">{ruler}</span>
            </>
          )}
        </div>

        {/* Army sizes — opaquer pill backgrounds so they carry their own
            weight regardless of era gradient underneath. */}
        {(event.forces?.army || event.forces?.enemyArmy) && (
          <div className="flex items-center gap-3 text-white mb-4" style={fs(13)}>
            {event.forces?.army && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-900/75 backdrop-blur-md border border-emerald-300/25 font-bold ring-1 ring-white/10">
                <Users size={12} className="shrink-0" />
                {event.forces.army.textAr}
              </span>
            )}
            {event.forces?.enemyArmy && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-950/75 backdrop-blur-md border border-red-300/25 font-bold ring-1 ring-white/10">
                <Swords size={12} className="shrink-0" />
                {event.forces.enemyArmy.textAr}
              </span>
            )}
          </div>
        )}

        {/* Spotify-style play button at the bottom-end of the hero */}
        <div className="mt-auto flex items-end justify-between gap-3">
          <div className="text-white/85 text-xs font-bold leading-tight max-w-[55%] flex flex-col gap-0.5">
            {audioState !== 'idle' && (
              <>
                <span className="opacity-90 inline-flex items-center gap-1">
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor: '#fff',
                      animation: audioState === 'playing' ? 'pulse 1.4s ease-in-out infinite' : 'none',
                    }}
                  />
                  {audioState === 'playing' ? 'يقرأ الآن' : 'متوقف مؤقتًا'}
                </span>
                <span className="tabular-nums opacity-75">
                  {formatAudioTime(currentTime)} / {formatAudioTime(duration)}
                </span>
              </>
            )}
            {audioError && (
              <span className="text-red-200 font-medium" style={fs(11)}>
                {audioError}
              </span>
            )}
          </div>

          <div className="relative shrink-0" style={{ width: ringSize, height: ringSize }}>
            {/* Progress ring */}
            <svg
              width={ringSize}
              height={ringSize}
              className="absolute inset-0 -rotate-90"
              aria-hidden="true"
            >
              <circle
                cx={ringSize / 2}
                cy={ringSize / 2}
                r={ringRadius}
                fill="none"
                stroke="rgba(255,255,255,0.28)"
                strokeWidth={ringStroke}
              />
              <circle
                cx={ringSize / 2}
                cy={ringSize / 2}
                r={ringRadius}
                fill="none"
                stroke="#ffffff"
                strokeWidth={ringStroke}
                strokeLinecap="round"
                strokeDasharray={ringCircumference}
                strokeDashoffset={ringDashOffset}
                style={{ transition: 'stroke-dashoffset 0.3s linear' }}
              />
            </svg>
            <button
              onClick={handlePlayPause}
              disabled={isAudioLoading}
              className="absolute inset-1 rounded-full flex items-center justify-center bg-white text-black shadow-lg hover:scale-105 active:scale-95 transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
              aria-label={audioState === 'playing' ? 'إيقاف السرد' : 'تشغيل السرد'}
              title={audioState === 'playing' ? 'إيقاف السرد' : 'تشغيل السرد'}
            >
              {isAudioLoading ? (
                <LoaderCircle size={isMobile ? 22 : 26} className="animate-spin" />
              ) : audioState === 'playing' ? (
                <Pause size={isMobile ? 22 : 26} />
              ) : (
                <Play size={isMobile ? 22 : 26} className="translate-x-[1px]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* CSS keyframes for the playing pulse */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </header>
  );
}
