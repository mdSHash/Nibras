/**
 * Application-wide constants
 */

export const BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
} as const;

export const ANIMATION_DURATION = {
  instant: 100,
  fast: 200,
  normal: 300,
  slow: 500,
  slower: 800,
  slowest: 1200,
} as const;

/**
 * Z-Index System
 * Centralized z-index management to prevent stacking conflicts
 *
 * Single source of truth for all z-index values in the application.
 * CSS custom properties mirror these values in src/index.css.
 */
export const Z_INDEX = {
  map: 1,
  mapControls: 400,
  timeline: 500,
  timelineDock: 550,
  dockToggle: 560,
  header: 600,
  sidebar: 700,
  searchMenu: 800,
  searchBackdrop: 750,
  eventPanel: 900,
  modalBackdrop: 950,
  modal: 1000,
  tooltip: 1100,
  toast: 1200,
  intro: 1300,
  tourBackdrop: 1400,
  tourSpotlight: 1450,
  tourTooltip: 1500,
  tourControls: 1550,
  skipLink: 1600,
} as const;

export const ERA_COLORS = {
  meccan: '#10b981',
  medinan: '#10b981',
  abuBakr: '#fbbf24',
  umar: '#ef4444',
  uthman: '#06b6d4',
  ali: '#818cf8',
  default: '#8b7355',
} as const;

export const KEYBOARD_SHORTCUTS = {
  CLOSE: 'Escape',
  SEARCH: 'ctrl+k',
  NEXT: 'ArrowRight',
  PREVIOUS: 'ArrowLeft',
  HELP: '?',
  HOME: 'Home',
  END: 'End',
} as const;

export const TOAST_DURATION = {
  short: 2000,
  normal: 3000,
  long: 5000,
} as const;

export const DEBOUNCE_DELAY = {
  search: 300,
  resize: 150,
  scroll: 100,
} as const;

