/**
 * AtmosphereOverlay — pure-CSS atmospheric layer rendered above the Pixi
 * canvas in the BattlePlayer. Drives time-of-day tinting and weather effects
 * (sandstorm, storm, rain, dust) using mix-blend-mode + CSS animations,
 * which keeps the Pixi rendering pipeline focused on entities.
 *
 * All overlays use `pointer-events: none` so they never intercept input from
 * the canvas. The component renders nothing for `dayPhase: 'day'` + `weather:
 * 'clear'` so the no-effect path is zero DOM.
 */

import type { CSSProperties } from 'react';
import type { DayPhase, WeatherCondition } from '../types/scenario';

interface AtmosphereOverlayProps {
  dayPhase?: DayPhase;
  weather?: WeatherCondition;
}

const DAY_PHASE_STYLE: Record<DayPhase, CSSProperties | null> = {
  day: null, // no overlay
  dawn: {
    background: 'linear-gradient(to bottom, rgba(255,170,90,0.30) 0%, rgba(255,200,140,0.10) 70%, transparent 100%)',
    mixBlendMode: 'multiply',
  },
  dusk: {
    background: 'linear-gradient(to bottom, rgba(180,40,30,0.30) 0%, rgba(120,30,40,0.20) 70%, transparent 100%)',
    mixBlendMode: 'multiply',
  },
  night: {
    background: 'rgba(10,15,40,0.55)',
    mixBlendMode: 'multiply',
  },
};

export function AtmosphereOverlay({ dayPhase = 'day', weather = 'clear' }: AtmosphereOverlayProps) {
  const dayStyle = DAY_PHASE_STYLE[dayPhase];
  const showWeather = weather !== 'clear';

  if (!dayStyle && !showWeather) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-10" aria-hidden="true">
      {dayStyle && <div className="absolute inset-0" style={dayStyle} />}

      {weather === 'sandstorm' && (
        <div
          className="absolute inset-0 nibras-weather-sandstorm"
          style={{
            background:
              'repeating-linear-gradient(115deg, rgba(212,165,116,0.18) 0 2px, transparent 2px 6px), ' +
              'radial-gradient(circle at 30% 50%, rgba(212,165,116,0.15) 0%, transparent 50%)',
            mixBlendMode: 'screen',
          }}
        />
      )}

      {weather === 'storm' && (
        <>
          <div
            className="absolute inset-0 nibras-weather-storm"
            style={{
              background:
                'repeating-linear-gradient(105deg, rgba(255,255,255,0.14) 0 1px, transparent 1px 14px)',
            }}
          />
          <div
            className="absolute inset-0 nibras-weather-flash"
            style={{ background: 'rgba(180,200,255,0)' }}
          />
        </>
      )}

      {weather === 'rain' && (
        <div
          className="absolute inset-0 nibras-weather-rain"
          style={{
            background:
              'repeating-linear-gradient(98deg, rgba(170,200,230,0.30) 0 1px, transparent 1px 8px)',
          }}
        />
      )}

      {weather === 'dust' && (
        <div
          className="absolute inset-0"
          style={{
            background: 'rgba(212,165,116,0.10)',
            mixBlendMode: 'multiply',
          }}
        />
      )}
    </div>
  );
}
