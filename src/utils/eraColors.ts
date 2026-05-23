/**
 * Shared era color utility
 * 
 * Canonical era colors used across Timeline, EventPanel, and other components.
 * These 5 era colors are the single source of truth for the entire app.
 */

export interface EraColorScheme {
  /** Primary era color (used for accents, borders, badges) */
  primary: string;
  /** Lighter variant for light-mode backgrounds */
  bgLight: string;
  /** Darker variant for dark-mode backgrounds */
  bgDark: string;
  /** Text color that contrasts well on light backgrounds */
  textLight: string;
  /** Text color that contrasts well on dark backgrounds */
  textDark: string;
}

/**
 * The 5 canonical era colors matching the timeline scrubber.
 */
const ERA_COLORS: Record<string, EraColorScheme> = {
  prophetic: {
    primary: '#D4A853',    // warm gold
    bgLight: 'rgba(212, 168, 83, 0.12)',
    bgDark: 'rgba(212, 168, 83, 0.15)',
    textLight: '#92700A',  // dark gold for light mode readability
    textDark: '#F5D78E',   // light gold for dark mode readability
  },
  abuBakr: {
    primary: '#10B981',    // emerald green
    bgLight: 'rgba(16, 185, 129, 0.10)',
    bgDark: 'rgba(16, 185, 129, 0.15)',
    textLight: '#065F46',  // dark green for light mode
    textDark: '#6EE7B7',   // light green for dark mode
  },
  umar: {
    primary: '#3B82F6',    // royal blue
    bgLight: 'rgba(59, 130, 246, 0.10)',
    bgDark: 'rgba(59, 130, 246, 0.15)',
    textLight: '#1E40AF',  // dark blue for light mode
    textDark: '#93C5FD',   // light blue for dark mode
  },
  uthman: {
    primary: '#8B5CF6',    // deep purple
    bgLight: 'rgba(139, 92, 246, 0.10)',
    bgDark: 'rgba(139, 92, 246, 0.15)',
    textLight: '#5B21B6',  // dark purple for light mode
    textDark: '#C4B5FD',   // light purple for dark mode
  },
  ali: {
    primary: '#EF4444',    // red
    bgLight: 'rgba(239, 68, 68, 0.12)',
    bgDark: 'rgba(239, 68, 68, 0.2)',
    textLight: '#B91C1C',  // dark red for light mode readability
    textDark: '#FCA5A5',   // light red/pink for dark mode readability
  },
};

/** Default fallback color scheme (prophetic era) */
const DEFAULT_ERA = ERA_COLORS.prophetic;

/**
 * Determine which era key an event belongs to based on its `era` string field.
 */
export function getEraKey(era?: string): keyof typeof ERA_COLORS {
  if (!era) return 'prophetic';
  if (
    era.includes('المكي') ||
    era.includes('قبل البعثة') ||
    era.includes('البعثة') ||
    era.includes('المدني') ||
    era.includes('الوحي')
  )
    return 'prophetic';
  if (era.includes('أبي بكر') || era.includes('أبو بكر'))
    return 'abuBakr';
  if (era.includes('عمر'))
    return 'umar';
  if (era.includes('عثمان'))
    return 'uthman';
  if (era.includes('علي'))
    return 'ali';
  if (era.includes('الراشدة'))
    return 'abuBakr'; // Rashidun default maps to Abu Bakr (emerald)
  return 'prophetic';
}

/**
 * Get the primary accent color for an era (matches timeline scrubber).
 * This is the main function used by Timeline and EventPanel for accent colors.
 */
export function getEraColor(era?: string): string {
  const key = getEraKey(era);
  return ERA_COLORS[key]?.primary ?? DEFAULT_ERA.primary;
}

/**
 * Get the full color scheme for an era (primary + background + text variants).
 * Use this when you need light/dark mode aware colors.
 */
export function getEraColorScheme(era?: string): EraColorScheme {
  const key = getEraKey(era);
  return ERA_COLORS[key] ?? DEFAULT_ERA;
}

/**
 * Get all era color definitions (for iteration, legends, etc.)
 */
export function getAllEraColors(): Record<string, EraColorScheme> {
  return ERA_COLORS;
}
