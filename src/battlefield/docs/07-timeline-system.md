# 07 — Timeline System

## Overview

The timeline system provides **play/pause/seek/speed** controls for deterministic battle replay. It synchronizes simulation time, narration audio, camera choreography, and scripted events.

---

## 7.1 — Timeline Controller

```typescript
// src/battlefield/timeline/TimelineController.ts

export class TimelineController {
  private state: PlaybackState = {
    isPlaying: false,
    speed: 1,
    currentTime: 0,
    totalDuration: 0,
    isComplete: false,
    loopEnabled: false,
  };

  private markers: TimelineMarker[] = [];
  private onStateChange: ((state: PlaybackState) => void) | null = null;

  // ─── Playback Controls ─────────────────────────────

  play(): void {
    this.state.isPlaying = true;
    this.state.isComplete = false;
    this.notify();
  }

  pause(): void {
    this.state.isPlaying = false;
    this.notify();
  }

  togglePlay(): void {
    if (this.state.isPlaying) this.pause();
    else this.play();
  }

  setSpeed(speed: PlaybackSpeed): void {
    this.state.speed = speed;
    this.notify();
  }

  seek(time: number): void {
    this.state.currentTime = Math.max(0, Math.min(time, this.state.totalDuration));
    this.state.isComplete = false;
    this.notify();
  }

  restart(): void {
    this.state.currentTime = 0;
    this.state.isComplete = false;
    this.state.isPlaying = true;
    this.notify();
  }

  // ─── Frame Update ──────────────────────────────────

  advance(dt: number): void {
    if (!this.state.isPlaying) return;
    
    this.state.currentTime += dt * this.state.speed;
    
    if (this.state.currentTime >= this.state.totalDuration) {
      if (this.state.loopEnabled) {
        this.state.currentTime = 0;
      } else {
        this.state.currentTime = this.state.totalDuration;
        this.state.isPlaying = false;
        this.state.isComplete = true;
      }
    }
    
    this.notify();
  }

  // ─── Markers ───────────────────────────────────────

  buildMarkers(scenario: BattleScenario): void {
    this.markers = [];
    
    // Phase markers
    for (const phase of scenario.phases) {
      this.markers.push({
        id: phase.id,
        time: phase.startTime,
        label: phase.name,
        labelAr: phase.nameAr,
        type: 'phase',
        color: '#D4A574',
      });
    }
    
    // Narration markers
    for (const narr of scenario.narration) {
      this.markers.push({
        id: narr.id,
        time: narr.timestamp,
        label: narr.text.substring(0, 30) + '...',
        labelAr: narr.textAr.substring(0, 30) + '...',
        type: 'narration',
        color: '#1B4332',
      });
    }
  }

  getMarkers(): TimelineMarker[] { return this.markers; }
  getState(): Readonly<PlaybackState> { return this.state; }
  getProgress(): number { return this.state.currentTime / this.state.totalDuration; }

  private notify(): void {
    this.onStateChange?.(this.state);
  }
}
```

---

## 7.2 — Timeline Recorder (for Seek/Replay)

To enable seeking to any point in time, the recorder takes periodic snapshots:

```typescript
// src/battlefield/timeline/TimelineRecorder.ts

export class TimelineRecorder {
  private snapshots: StateSnapshot[] = [];
  private snapshotInterval: number = 0.5; // seconds
  private lastSnapshotTime: number = 0;
  private maxSnapshots: number = 600; // 5 minutes at 0.5s intervals

  record(currentTime: number, world: World): void {
    if (currentTime - this.lastSnapshotTime >= this.snapshotInterval) {
      const snapshot = world.takeSnapshot();
      snapshot.timestamp = currentTime;
      
      // Ring buffer: overwrite oldest if at capacity
      if (this.snapshots.length >= this.maxSnapshots) {
        this.snapshots.shift();
      }
      this.snapshots.push(snapshot);
      this.lastSnapshotTime = currentTime;
    }
  }

  seekTo(time: number, world: World): void {
    // Find nearest snapshot before the target time
    let nearest: StateSnapshot | null = null;
    for (let i = this.snapshots.length - 1; i >= 0; i--) {
      if (this.snapshots[i].timestamp <= time) {
        nearest = this.snapshots[i];
        break;
      }
    }
    
    if (nearest) {
      // Restore world state from snapshot
      world.restoreSnapshot(nearest);
      // Then fast-forward from snapshot time to target time
      // (re-run systems without rendering)
    }
  }

  clear(): void {
    this.snapshots = [];
    this.lastSnapshotTime = 0;
  }
}
```

---

## 7.3 — Narration Synchronization

```typescript
// src/battlefield/timeline/NarrationSync.ts

export class NarrationSync {
  private cues: NarrationCue[] = [];
  private activeCue: NarrationCue | null = null;
  private nextCueIndex: number = 0;
  private onNarrationChange: ((cue: NarrationCue | null) => void) | null = null;

  load(cues: NarrationCue[]): void {
    this.cues = [...cues].sort((a, b) => a.timestamp - b.timestamp);
    this.nextCueIndex = 0;
    this.activeCue = null;
  }

  update(currentTime: number): void {
    // Check if active cue has expired
    if (this.activeCue) {
      const endTime = this.activeCue.timestamp + this.activeCue.duration;
      if (currentTime >= endTime) {
        this.activeCue = null;
        this.onNarrationChange?.(null);
      }
    }

    // Check if next cue should start
    while (
      this.nextCueIndex < this.cues.length &&
      this.cues[this.nextCueIndex].timestamp <= currentTime
    ) {
      const cue = this.cues[this.nextCueIndex];
      const endTime = cue.timestamp + cue.duration;
      
      if (currentTime < endTime) {
        this.activeCue = cue;
        this.onNarrationChange?.(cue);
      }
      this.nextCueIndex++;
    }
  }

  seek(time: number): void {
    this.nextCueIndex = 0;
    this.activeCue = null;
    // Find the cue active at the seek time
    for (let i = 0; i < this.cues.length; i++) {
      const cue = this.cues[i];
      if (cue.timestamp <= time && time < cue.timestamp + cue.duration) {
        this.activeCue = cue;
        this.nextCueIndex = i + 1;
        break;
      }
      if (cue.timestamp > time) {
        this.nextCueIndex = i;
        break;
      }
    }
    this.onNarrationChange?.(this.activeCue);
  }

  getActiveCue(): NarrationCue | null { return this.activeCue; }
}
```

---

## 7.4 — Seek Strategy

Seeking is the most complex operation. The strategy:

```
User seeks to time T
        │
        ▼
┌─────────────────────────────┐
│ Find nearest snapshot <= T  │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ Restore world from snapshot │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ Fast-forward systems from   │
│ snapshot.time → T           │
│ (no rendering, fixed dt)    │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ Sync camera timeline to T   │
│ Sync narration to T         │
│ Sync script interpreter to T│
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ Resume normal playback      │
└─────────────────────────────┘
```

---

## 7.5 — Speed Control

| Speed | Label | Use Case |
|-------|-------|----------|
| 0.5x | Slow | Detailed observation of maneuvers |
| 1.0x | Normal | Standard viewing speed |
| 1.5x | Fast | Quick review |
| 2.0x | Faster | Skipping familiar sections |
| 4.0x | Skip | Rapid fast-forward |

Speed affects:
- Simulation dt multiplier
- GSAP timeline timeScale
- Narration display duration (stays readable)
- Audio playback rate (if audio narration)
