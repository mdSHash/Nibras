# 10 — React Integration

## Overview

React serves as a **thin UI shell** around the engine. It does NOT drive the simulation. React components subscribe to Zustand stores for display and dispatch commands through store actions.

---

## 10.1 — Component Hierarchy

```
<BattlePlayer>                    ← Top-level orchestrator
├── <BattleCanvas />              ← PixiJS mount point (div ref)
├── <BattlePhaseIndicator />      ← Current phase name/description
├── <BattleNarration />           ← Narration text overlay
├── <BattleTimeline />            ← Scrubber/progress bar with markers
├── <BattleControls />            ← Play/pause/speed/restart buttons
├── <BattleMinimap />             ← Overview minimap (optional)
└── <BattleInfoPanel />           ← Selected entity details (optional)
```

---

## 10.2 — BattlePlayer (Orchestrator)

```typescript
// src/battlefield/react/BattlePlayer.tsx

import { useEffect, useRef } from 'react';
import { useEngine } from './hooks/useEngine';
import { BattleCanvas } from './BattleCanvas';
import { BattleTimeline } from './BattleTimeline';
import { BattleControls } from './BattleControls';
import { BattleNarration } from './BattleNarration';
import { BattlePhaseIndicator } from './BattlePhaseIndicator';

interface BattlePlayerProps {
  scenarioId: string;
  onClose: () => void;
}

export function BattlePlayer({ scenarioId, onClose }: BattlePlayerProps) {
  const { isReady, error } = useEngine(scenarioId);

  if (error) return <BattleError error={error} onClose={onClose} />;
  if (!isReady) return <BattleLoading />;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Canvas fills entire viewport */}
      <BattleCanvas />
      
      {/* UI overlays (positioned absolutely) */}
      <BattlePhaseIndicator />
      <BattleNarration />
      
      {/* Bottom controls */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <BattleTimeline />
        <BattleControls onClose={onClose} />
      </div>
    </div>
  );
}
```

---

## 10.3 — BattleCanvas (PixiJS Mount)

```typescript
// src/battlefield/react/BattleCanvas.tsx

import { useEffect, useRef } from 'react';

export function BattleCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // The engine creates and manages the PixiJS canvas
    // This component just provides the mount point
    const container = containerRef.current;
    if (!container) return;

    // Engine attaches its canvas to this container
    // (handled by useEngine hook which stores the container ref)
    const engine = getEngineInstance();
    if (engine) {
      container.appendChild(engine.getCanvas());
    }

    return () => {
      // Canvas is removed when engine is destroyed
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full"
      style={{ touchAction: 'none' }}
    />
  );
}
```

---

## 10.4 — BattleTimeline

```typescript
// src/battlefield/react/BattleTimeline.tsx

import { usePlaybackStore } from '../state/playbackStore';

export function BattleTimeline() {
  const { currentTime, totalDuration, progress, markers, seek } = usePlaybackStore();

  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    seek(ratio * totalDuration);
  };

  return (
    <div className="relative w-full h-8 bg-stone-800/80 rounded-lg backdrop-blur">
      {/* Progress fill */}
      <div
        className="absolute top-0 left-0 h-full bg-amber-700/60 rounded-lg"
        style={{ width: `${progress * 100}%` }}
      />
      
      {/* Markers */}
      {markers.map((marker) => (
        <div
          key={marker.id}
          className="absolute top-0 w-0.5 h-full"
          style={{
            left: `${(marker.time / totalDuration) * 100}%`,
            backgroundColor: marker.color,
          }}
          title={marker.label}
        />
      ))}
      
      {/* Scrub area */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={handleScrub}
      />
      
      {/* Time display */}
      <span className="absolute right-2 top-1 text-xs text-stone-300">
        {formatTime(currentTime)} / {formatTime(totalDuration)}
      </span>
    </div>
  );
}
```

---

## 10.5 — BattleControls

```typescript
// src/battlefield/react/BattleControls.tsx

import { usePlaybackStore } from '../state/playbackStore';

export function BattleControls({ onClose }: { onClose: () => void }) {
  const { isPlaying, speed, togglePlay, setSpeed, restart } = usePlaybackStore();

  const speeds: PlaybackSpeed[] = [0.5, 1, 1.5, 2, 4];

  return (
    <div className="flex items-center gap-3 mt-2">
      {/* Play/Pause */}
      <button onClick={togglePlay} className="btn-control">
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>
      
      {/* Speed selector */}
      <div className="flex gap-1">
        {speeds.map((s) => (
          <button
            key={s}
            onClick={() => setSpeed(s)}
            className={`btn-speed ${speed === s ? 'active' : ''}`}
          >
            {s}x
          </button>
        ))}
      </div>
      
      {/* Restart */}
      <button onClick={restart} className="btn-control">
        <RestartIcon />
      </button>
      
      {/* Close */}
      <button onClick={onClose} className="btn-control ml-auto">
        <CloseIcon />
      </button>
    </div>
  );
}
```

---

## 10.6 — BattleNarration

```typescript
// src/battlefield/react/BattleNarration.tsx

import { usePlaybackStore } from '../state/playbackStore';
import { useUIStore } from '../state/uiStore';

export function BattleNarration() {
  const narration = usePlaybackStore((s) => s.activeNarration);
  const isVisible = useUIStore((s) => s.isNarrationVisible);
  const language = useUIStore((s) => s.language);

  if (!narration || !isVisible) return null;

  const text = language === 'ar' ? narration.textAr : narration.text;
  const positionClass = getPositionClass(narration.position);
  const styleClass = getStyleClass(narration.style);

  return (
    <div className={`absolute ${positionClass} px-6 py-3 ${styleClass}`}>
      <p className="text-lg leading-relaxed" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {text}
      </p>
    </div>
  );
}
```

---

## 10.7 — Hooks

### useEngine

```typescript
// src/battlefield/react/hooks/useEngine.ts

export function useEngine(scenarioId: string) {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const engineRef = useRef<Engine | null>(null);

  useEffect(() => {
    const engine = new Engine();
    engineRef.current = engine;

    engine.loadScenario(scenarioId)
      .then(() => {
        engine.start();
        setIsReady(true);
      })
      .catch((err) => setError(err.message));

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, [scenarioId]);

  return { isReady, error, engine: engineRef.current };
}
```

### usePlayback

```typescript
// src/battlefield/react/hooks/usePlayback.ts

export function usePlayback() {
  const store = usePlaybackStore();
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'Space': e.preventDefault(); store.togglePlay(); break;
        case 'ArrowLeft': store.seek(store.currentTime - 5); break;
        case 'ArrowRight': store.seek(store.currentTime + 5); break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return store;
}
```

---

## 10.8 — Key Principle: React Never Drives Simulation

```
WRONG:  React state change → rerender → update simulation
RIGHT:  Engine tick → update world → write to store → React subscribes
```

React components are **display-only** for simulation data. They can issue commands (play, pause, seek) but these are processed asynchronously by the engine on its next frame.
