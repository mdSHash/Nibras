/**
 * Barrel export for all Zustand state stores.
 * 
 * These stores are the React-facing state layer.
 * The engine writes to them at ~10fps, React reads from them.
 */

export { usePlaybackStore } from './playbackStore';
export type { PlaybackState, PlaybackStatus } from './playbackStore';

export { useSimulationStore } from './simulationStore';
export type { SimulationState, UnitSnapshot } from './simulationStore';

export { useCameraStore } from './cameraStore';
export type { CameraState } from './cameraStore';

export { useUIStore } from './uiStore';
export type { UIState, TooltipData, NarrationDisplay } from './uiStore';
