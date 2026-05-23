/**
 * Playback Store — Controls playback state (play/pause/speed/time).
 * 
 * Updated by the engine at ~10fps throttled rate.
 * React UI reads from this store to display playback controls and progress.
 */

import { create } from 'zustand';

export type PlaybackStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'completed';

export interface PlaybackState {
  // State
  status: PlaybackStatus;
  currentTime: number;
  totalDuration: number;
  speed: number;
  currentPhaseId: string | null;
  currentPhaseName: string | null;
  progress: number;

  // Actions
  setStatus: (status: PlaybackStatus) => void;
  setCurrentTime: (time: number) => void;
  setTotalDuration: (duration: number) => void;
  setSpeed: (speed: number) => void;
  setCurrentPhase: (id: string | null, name: string | null) => void;
  reset: () => void;
}

const initialState = {
  status: 'idle' as PlaybackStatus,
  currentTime: 0,
  totalDuration: 0,
  speed: 1,
  currentPhaseId: null as string | null,
  currentPhaseName: null as string | null,
  progress: 0,
};

export const usePlaybackStore = create<PlaybackState>()((set) => ({
  ...initialState,

  setStatus: (status) => set({ status }),

  setCurrentTime: (time) =>
    set((state) => {
      const progress =
        state.totalDuration > 0
          ? Math.min(1, Math.max(0, time / state.totalDuration))
          : 0;
      return { currentTime: time, progress };
    }),

  setTotalDuration: (duration) =>
    set((state) => {
      const progress =
        duration > 0
          ? Math.min(1, Math.max(0, state.currentTime / duration))
          : 0;
      return { totalDuration: duration, progress };
    }),

  setSpeed: (speed) => set({ speed: Math.min(4.0, Math.max(0.25, speed)) }),

  setCurrentPhase: (id, name) =>
    set({ currentPhaseId: id, currentPhaseName: name }),

  reset: () => set(initialState),
}));
