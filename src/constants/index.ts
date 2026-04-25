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
 * Layers (from bottom to top):
 * - Base: 0-99 (default content)
 * - Elevated: 100-999 (dropdowns, tooltips)
 * - Overlay: 1000-1999 (panels, sidebars)
 * - Modal: 2000-2999 (modals, dialogs)
 * - Notification: 3000-3999 (toasts, alerts)
 * - Tour: 4000-4999 (onboarding, tutorials)
 */
export const Z_INDEX = {
  // Base Layer (0-99)
  base: 0,
  map: 1,
  
  // Elevated Layer (100-999)
  dropdown: 100,
  tooltip: 200,
  popover: 300,
  
  // Overlay Layer (1000-1999)
  timeline: 1000,
  eventPanel: 1100,
  searchMenu: 1200,
  sidebar: 1300,
  header: 1400,
  
  // Modal Layer (2000-2999)
  modalBackdrop: 2000,
  modal: 2100,
  modalContent: 2200,
  
  // Notification Layer (3000-3999)
  toast: 3000,
  alert: 3100,
  
  // Tour Layer (4000-4999)
  tourBackdrop: 4000,
  tourSpotlight: 4100,
  tourTooltip: 4200,
  tourControls: 4300,
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

// Made with Bob
