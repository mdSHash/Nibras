# 09 — Zustand Stores

## Overview

Zustand stores serve as the **bridge between the engine (non-React) and React UI**. The engine writes to stores; React subscribes to stores. This ensures simulation updates NEVER trigger React rerenders directly.

---

## 9.1 — Store Architecture

```
┌─────────────────────────────────────────────────────┐
│                  DATA FLOW                            │
│                                                     │
│  Engine (rAF loop)                                  │
│       │                                             │
│       │ writes (throttled, ~10fps for UI)           │
│       ▼                                             │
│  ┌─────────────────────────────────────────┐        │
│  │         ZUSTAND STORES                   │        │
│  │                                         │        │
│  │  ┌──────────────┐  ┌────────────────┐  │        │
│  │  │ uiStore      │  │ simulationStore│  │        │
│  │  └──────────────┘  └────────────────┘  │        │
│  │  ┌──────────────┐  ┌────────────────┐  │        │
│  │  │ playbackStore│  │ cameraStore    │  │        │
│  │  └──────────────┘  └────────────────┘  │        │
│  └─────────────────────────────────────────┘        │
│       │                                             │
│       │ subscribes (React selectors)                │
│       ▼                                             │
│  React Components (UI shell)                        │
└─────────────────────────────────────────────────────┘
```

---

## 9.2 — UI Store

```typescript
// src/battlefield/state/uiStore.ts

import { create } from 'zustand';

export interface UIState {
  // Panel visibility
  isInfoPanelOpen: boolean;
  isMinimapVisible: boolean;
  isNarrationVisible: boolean;
  isControlsVisible: boolean;
  isPhaseIndicatorVisible: boolean;
  
  // Selection
  selectedEntityId: EntityId | null;
  hoveredEntityId: EntityId | null;
  
  // Overlays
  showDeploymentZones: boolean;
  showFormationOutlines: boolean;
  showRangeIndicators: boolean;
  showHealthBars: boolean;
  showUnitLabels: boolean;
  
  // Language
  language: 'en' | 'ar';
  
  // Actions
  toggleInfoPanel: () => void;
  toggleMinimap: () => void;
  toggleNarration: () => void;
  selectEntity: (id: EntityId | null) => void;
  hoverEntity: (id: EntityId | null) => void;
  setLanguage: (lang: 'en' | 'ar') => void;
  toggleOverlay: (overlay: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isInfoPanelOpen: false,
  isMinimapVisible: true,
  isNarrationVisible: true,
  isControlsVisible: true,
  isPhaseIndicatorVisible: true,
  selectedEntityId: null,
  hoveredEntityId: null,
  showDeploymentZones: false,
  showFormationOutlines: true,
  showRangeIndicators: false,
  showHealthBars: true,
  showUnitLabels: true,
  language: 'ar',

  toggleInfoPanel: () => set((s) => ({ isInfoPanelOpen: !s.isInfoPanelOpen })),
  toggleMinimap: () => set((s) => ({ isMinimapVisible: !s.isMinimapVisible })),
  toggleNarration: () => set((s) => ({ isNarrationVisible: !s.isNarrationVisible })),
  selectEntity: (id) => set({ selectedEntityId: id }),
  hoverEntity: (id) => set({ hoveredEntityId: id }),
  setLanguage: (lang) => set({ language: lang }),
  toggleOverlay: (overlay) => set((s) => ({ [overlay]: !s[overlay] })),
}));
```

---

## 9.3 — Simulation Store

```typescript
// src/battlefield/state/simulationStore.ts

import { create } from 'zustand';

export interface SimulationState {
  // Battle info (read-only from React perspective)
  scenarioId: string;
  currentPhase: BattlePhaseType;
  currentPhaseIndex: number;
  phaseName: string;
  phaseNameAr: string;
  
  // Unit counts
  muslimUnitsAlive: number;
  muslimUnitsTotal: number;
  opponentUnitsAlive: number;
  opponentUnitsTotal: number;
  
  // Aggregate stats
  muslimMorale: number;       // average morale 0-100
  opponentMorale: number;
  totalEntities: number;
  activeProjectiles: number;
  
  // Battle outcome
  outcome: BattleOutcome | null;
  isComplete: boolean;
  
  // Engine writes these (not called from React)
  _updateFromEngine: (partial: Partial<SimulationState>) => void;
}

export const useSimulationStore = create<SimulationState>((set) => ({
  scenarioId: '',
  currentPhase: 'deployment',
  currentPhaseIndex: 0,
  phaseName: '',
  phaseNameAr: '',
  muslimUnitsAlive: 0,
  muslimUnitsTotal: 0,
  opponentUnitsAlive: 0,
  opponentUnitsTotal: 0,
  muslimMorale: 100,
  opponentMorale: 100,
  totalEntities: 0,
  activeProjectiles: 0,
  outcome: null,
  isComplete: false,

  _updateFromEngine: (partial) => set(partial),
}));
```

---

## 9.4 — Playback Store

```typescript
// src/battlefield/state/playbackStore.ts

import { create } from 'zustand';

export interface PlaybackStoreState {
  isPlaying: boolean;
  speed: PlaybackSpeed;
  currentTime: number;
  totalDuration: number;
  progress: number;          // 0-1
  isComplete: boolean;
  loopEnabled: boolean;
  
  // Active narration
  activeNarration: NarrationCue | null;
  
  // Timeline markers
  markers: TimelineMarker[];
  
  // Commands (React → Engine)
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  setSpeed: (speed: PlaybackSpeed) => void;
  seek: (time: number) => void;
  restart: () => void;
  toggleLoop: () => void;
  
  // Engine updates (Engine → React)
  _updateFromEngine: (partial: Partial<PlaybackStoreState>) => void;
  _setNarration: (cue: NarrationCue | null) => void;
  _setMarkers: (markers: TimelineMarker[]) => void;
}

export const usePlaybackStore = create<PlaybackStoreState>((set, get) => ({
  isPlaying: false,
  speed: 1,
  currentTime: 0,
  totalDuration: 0,
  progress: 0,
  isComplete: false,
  loopEnabled: false,
  activeNarration: null,
  markers: [],

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
  setSpeed: (speed) => set({ speed }),
  seek: (time) => set({ currentTime: time, progress: time / get().totalDuration }),
  restart: () => set({ currentTime: 0, progress: 0, isPlaying: true, isComplete: false }),
  toggleLoop: () => set((s) => ({ loopEnabled: !s.loopEnabled })),

  _updateFromEngine: (partial) => set(partial),
  _setNarration: (cue) => set({ activeNarration: cue }),
  _setMarkers: (markers) => set({ markers }),
}));
```

---

## 9.5 — Camera Store

```typescript
// src/battlefield/state/cameraStore.ts

import { create } from 'zustand';

export interface CameraStoreState {
  x: number;
  y: number;
  zoom: number;
  rotation: number;
  isAnimating: boolean;
  followingEntity: EntityId | null;
  
  // Manual camera control (from React UI)
  panBy: (dx: number, dy: number) => void;
  zoomBy: (delta: number) => void;
  resetCamera: () => void;
  
  // Engine updates
  _updateFromEngine: (partial: Partial<CameraStoreState>) => void;
}

export const useCameraStore = create<CameraStoreState>((set) => ({
  x: 0,
  y: 0,
  zoom: 0.8,
  rotation: 0,
  isAnimating: false,
  followingEntity: null,

  panBy: (dx, dy) => set((s) => ({ x: s.x + dx, y: s.y + dy })),
  zoomBy: (delta) => set((s) => ({ zoom: Math.max(0.3, Math.min(3.0, s.zoom + delta)) })),
  resetCamera: () => set({ x: 0, y: 0, zoom: 0.8, rotation: 0 }),

  _updateFromEngine: (partial) => set(partial),
}));
```

---

## 9.6 — Engine → Store Update Strategy

The engine updates stores at a **throttled rate** (10fps) to avoid overwhelming React:

```typescript
// Inside Engine.ts

private storeUpdateInterval = 1000 / 10; // 100ms
private lastStoreUpdate = 0;

private updateStores(currentTime: number): void {
  if (currentTime - this.lastStoreUpdate < this.storeUpdateInterval) return;
  this.lastStoreUpdate = currentTime;

  // Batch all store updates
  useSimulationStore.getState()._updateFromEngine({
    currentPhase: this.getCurrentPhase(),
    muslimUnitsAlive: this.countAlive('muslim'),
    opponentUnitsAlive: this.countAlive('opponent'),
    totalEntities: this.world.entities.count(),
    // ...
  });

  usePlaybackStore.getState()._updateFromEngine({
    currentTime: this.timeline.getState().currentTime,
    progress: this.timeline.getProgress(),
  });

  useCameraStore.getState()._updateFromEngine({
    x: this.camera.getState().x,
    y: this.camera.getState().y,
    zoom: this.camera.getState().zoom,
  });
}
```

---

## 9.7 — React → Engine Command Flow

When React needs to command the engine (play, pause, seek), it writes to the store. The engine reads these on next frame:

```typescript
// Engine reads commands from playback store each frame
private processCommands(): void {
  const playback = usePlaybackStore.getState();
  
  if (playback.isPlaying && this.clock.isPaused()) {
    this.clock.resume();
  } else if (!playback.isPlaying && !this.clock.isPaused()) {
    this.clock.pause();
  }
  
  if (playback.speed !== this.clock.getSpeed()) {
    this.clock.setSpeed(playback.speed);
  }
}
```
