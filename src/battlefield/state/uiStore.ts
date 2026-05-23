/**
 * UI Store — UI-specific state (selections, tooltips, panels).
 * 
 * Manages transient UI state that doesn't belong in the simulation.
 * Includes entity selection, hover state, narration display, and panel toggles.
 */

import { create } from 'zustand';

export interface TooltipData {
  entityId: string;
  screenX: number;
  screenY: number;
  text: string;
}

export interface NarrationDisplay {
  id: string;
  text: string;
  textAr?: string;
  position: 'top' | 'bottom' | 'center';
  style: 'normal' | 'dramatic' | 'quote';
}

export interface UIState {
  // State
  selectedEntityId: string | null;
  hoveredEntityId: string | null;
  tooltip: TooltipData | null;
  narration: NarrationDisplay | null;
  showMinimap: boolean;
  showUnitList: boolean;
  showPhaseInfo: boolean;
  isPanelOpen: boolean;

  // Actions
  selectEntity: (entityId: string | null) => void;
  hoverEntity: (entityId: string | null) => void;
  showTooltip: (data: TooltipData | null) => void;
  setNarration: (narration: NarrationDisplay | null) => void;
  toggleMinimap: () => void;
  toggleUnitList: () => void;
  togglePhaseInfo: () => void;
  setPanelOpen: (open: boolean) => void;
  reset: () => void;
}

const initialState = {
  selectedEntityId: null as string | null,
  hoveredEntityId: null as string | null,
  tooltip: null as TooltipData | null,
  narration: null as NarrationDisplay | null,
  showMinimap: true,
  showUnitList: true,
  showPhaseInfo: true,
  isPanelOpen: false,
};

export const useUIStore = create<UIState>()((set) => ({
  ...initialState,

  selectEntity: (entityId) => set({ selectedEntityId: entityId }),

  hoverEntity: (entityId) => set({ hoveredEntityId: entityId }),

  showTooltip: (data) => set({ tooltip: data }),

  setNarration: (narration) => set({ narration }),

  toggleMinimap: () => set((state) => ({ showMinimap: !state.showMinimap })),

  toggleUnitList: () => set((state) => ({ showUnitList: !state.showUnitList })),

  togglePhaseInfo: () =>
    set((state) => ({ showPhaseInfo: !state.showPhaseInfo })),

  setPanelOpen: (open) => set({ isPanelOpen: open }),

  reset: () => set(initialState),
}));
