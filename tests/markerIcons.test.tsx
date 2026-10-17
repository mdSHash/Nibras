// The map's marker HTML (src/components/map/markerIcons.ts) must equal what the
// React elements it replaced rendered. The reference below is the JSX that
// src/components/Map.tsx passed to renderToStaticMarkup before Phase 2B, as it was
// (its colors written as the theme tokens of Phase 3B, which hold the same values).
import type { ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Book, Crown, Flag, MapPin, ScrollText, Skull, Swords, Tent } from 'lucide-react';
import { describe, expect, it } from 'vitest';
import { EVENT_ICONS as ICON_NAMES, type EventIcon } from '../shared/contentSchema';
import { clusterHtml, markerHtml } from '../src/components/map/markerIcons';

// Marker icon per event (content/events/<id>.json, `icon`).
const EVENT_ICONS: Record<EventIcon, ReactElement> = {
  skull: <Skull size={14} color="#fff" />,
  crown: <Crown size={14} color="#fff" />,
  swords: <Swords size={14} color="#fff" />,
  flag: <Flag size={14} color="#fff" />,
  book: <Book size={14} color="#fff" />,
  scroll: <ScrollText size={14} color="#fff" />,
  tent: <Tent size={14} color="#fff" />,
  pin: <MapPin size={14} color="#fff" />,
};


const referenceMarker = (color: string, label: string, icon: EventIcon, isMobile: boolean, isSelected?: boolean, isDimmed?: boolean, hasBattle?: boolean) => {
  const iconSize = isMobile ? (isSelected ? '48px' : '40px') : (isSelected ? '44px' : '36px');
  const badgeSize = isMobile ? 16 : 14;
  
  const iconMarkup = renderToStaticMarkup(
    <div
      style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'all 700ms',
        width: iconSize,
        height: iconSize,
        opacity: isDimmed ? 0.4 : 1,
        filter: isDimmed ? 'grayscale(0.8)' : 'none'
      }}
    >
      {isSelected && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '9999px',
            opacity: 0.75,
            margin: '0 auto',
            width: '100%',
            height: '100%',
            backgroundColor: color,
            animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite'
          }}
        />
      )}
      <div
        style={{
          position: 'relative',
          width: isMobile ? (isSelected ? '44px' : '36px') : (isSelected ? '40px' : '32px'),
          height: isMobile ? (isSelected ? '44px' : '36px') : (isSelected ? '40px' : '32px'),
          borderRadius: '9999px',
          border: isMobile ? '3px solid white' : '3px solid white',
          boxShadow: isSelected ? '0 4px 16px rgba(0,0,0,0.5)' : '0 2px 8px rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 300ms',
          transform: isSelected ? 'scale(1.25)' : 'scale(1)',
          backgroundColor: color,
          zIndex: isSelected ? 1000 : 'auto'
        }}
      >
        {EVENT_ICONS[icon]}
      </div>
      {hasBattle && !isDimmed && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            width: `${badgeSize}px`,
            height: `${badgeSize}px`,
            borderRadius: '9999px',
            backgroundColor: 'var(--color-accent)',
            border: '1.5px solid rgb(var(--sys-chrome-rgb) / 0.9)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 11,
          }}
        >
          {/* Filled play triangle, optically nudged to visually center. */}
          <svg width={badgeSize - 6} height={badgeSize - 6} viewBox="0 0 8 8" style={{ fill: 'rgb(var(--sys-chrome-rgb) / 0.95)' }}>
            <path d="M2 1.2 L6.6 4 L2 6.8 Z" />
          </svg>
        </div>
      )}
      {!isDimmed && (
        <div
          style={{
            position: 'absolute',
            top: isMobile ? '48px' : '42px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgb(var(--sys-chrome-raised-rgb) / 0.95)',
            color: 'rgb(var(--sys-chrome-ink-rgb))',
            padding: isMobile ? '8px 14px' : '6px 12px',
            borderRadius: '8px',
            fontSize: isMobile ? '13px' : '12px',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 10,
            boxShadow: '0 2px 12px rgba(0,0,0,0.5)',
            border: '2px solid rgba(255,255,255,0.2)',
            backdropFilter: 'blur(4px)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            minWidth: 'max-content',
            maxWidth: isMobile ? '200px' : 'none',
            overflow: isMobile ? 'hidden' : 'visible',
            textOverflow: isMobile ? 'ellipsis' : 'clip'
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
  return iconMarkup;
};

const referenceCluster = (pointCount: number, hasSelectedEvent: boolean) => {
  const dimClass = hasSelectedEvent ? 'opacity-40 grayscale-[0.8]' : 'opacity-100';
  return renderToStaticMarkup(
    <div className={`relative flex justify-center items-center w-11 h-11 rounded-full border-[3px] border-white shadow-[0_2px_10px_rgba(0,0,0,0.5)] bg-accent transition-transform hover:scale-110 ${dimClass}`}>
      <span className="text-white font-extrabold text-base drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>{pointCount}</span>
    </div>
  );
};

const flags = [false, true];

describe('map marker HTML', () => {
  it('matches the React markup for every icon and state', () => {
    let compared = 0;
    for (const icon of ICON_NAMES) {
      for (const isMobile of flags) for (const isSelected of flags) for (const isDimmed of flags) for (const hasBattle of flags) {
        for (const label of ['بدر', 'مكة & "المدينة" <الكبرى>']) {
          const color = '#C9A227';
          expect(markerHtml({ color, label, icon, isMobile, isSelected, isDimmed, hasBattle })).toBe(
            referenceMarker(color, label, icon, isMobile, isSelected, isDimmed, hasBattle),
          );
          compared++;
        }
      }
    }
    expect(compared).toBe(ICON_NAMES.length * 32);
  });

  it('matches the React markup for cluster bubbles', () => {
    for (const count of [2, 17, 131]) {
      for (const dimmed of flags) expect(clusterHtml(count, dimmed)).toBe(referenceCluster(count, dimmed));
    }
  });
});
