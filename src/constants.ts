/**
 * Z-Index Management System
 * Centralized z-index values to prevent stacking conflicts
 */

export const Z_INDEX = {
  // Base layers
  map: 0,
  mapControls: 400,
  
  // Navigation and UI
  timeline: 1000,
  eventPanel: 1100,
  searchMenu: 1200,
  
  // Overlays
  tourSpotlight: 1900,
  tourTooltip: 2000,
  
  // Modals (highest priority)
  modal: 2100,
  modalBackdrop: 2050,
  
  // Toast notifications (above everything)
  toast: 3000,
} as const;

export type ZIndexKey = keyof typeof Z_INDEX;

