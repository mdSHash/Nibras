/**
 * Camera Store — Camera state for UI overlays that need to know camera position.
 * 
 * Updated by the CameraController at ~10fps throttled rate.
 * Used by React overlays to position tooltips, minimap viewport, etc.
 */

import { create } from 'zustand';

export interface CameraState {
  // State
  x: number;
  y: number;
  zoom: number;
  isTransitioning: boolean;
  followingEntityId: string | null;

  // Actions
  setPosition: (x: number, y: number) => void;
  setZoom: (zoom: number) => void;
  setTransitioning: (transitioning: boolean) => void;
  setFollowing: (entityId: string | null) => void;
  reset: () => void;
}

const initialState = {
  x: 0,
  y: 0,
  zoom: 1,
  isTransitioning: false,
  followingEntityId: null as string | null,
};

export const useCameraStore = create<CameraState>()((set) => ({
  ...initialState,

  setPosition: (x, y) => set({ x, y }),

  setZoom: (zoom) => set({ zoom }),

  setTransitioning: (transitioning) => set({ isTransitioning: transitioning }),

  setFollowing: (entityId) => set({ followingEntityId: entityId }),

  reset: () => set(initialState),
}));
