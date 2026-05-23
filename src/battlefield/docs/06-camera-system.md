# 06 — Camera System

## Overview

The camera system provides **cinematic choreography** using GSAP for smooth, documentary-style camera movements. Camera cues are defined in scenario data and executed by the CameraSystem during replay.

---

## 6.1 — Camera Controller

```typescript
// src/battlefield/camera/CameraController.ts

import gsap from 'gsap';

export class CameraController {
  private state: CameraState;
  private timeline: gsap.core.Timeline;
  private presets: Map<string, CameraPreset> = new Map();
  
  constructor(bounds: Rect) {
    this.state = {
      x: bounds.width / 2,
      y: bounds.height / 2,
      zoom: 0.8,
      rotation: 0,
      targetX: bounds.width / 2,
      targetY: bounds.height / 2,
      targetZoom: 0.8,
      isAnimating: false,
      followEntityId: null,
      bounds,
    };
    this.timeline = gsap.timeline({ paused: true });
  }

  // ─── Movement Methods ─────────────────────────────

  panTo(target: Vec2, duration: number, easing: CameraEasing): void {
    this.state.isAnimating = true;
    gsap.to(this.state, {
      x: target.x,
      y: target.y,
      duration,
      ease: easing,
      onComplete: () => { this.state.isAnimating = false; },
    });
  }

  zoomTo(zoom: number, duration: number, easing: CameraEasing): void {
    gsap.to(this.state, {
      zoom: Math.max(0.3, Math.min(3.0, zoom)),
      duration,
      ease: easing,
    });
  }

  focusOn(target: Vec2, zoom: number, duration: number, easing: CameraEasing): void {
    this.state.isAnimating = true;
    gsap.to(this.state, {
      x: target.x,
      y: target.y,
      zoom,
      duration,
      ease: easing,
      onComplete: () => { this.state.isAnimating = false; },
    });
  }

  follow(entityId: EntityId): void {
    this.state.followEntityId = entityId;
  }

  stopFollow(): void {
    this.state.followEntityId = null;
  }

  overview(duration: number, easing: CameraEasing): void {
    const centerX = this.state.bounds.width / 2;
    const centerY = this.state.bounds.height / 2;
    this.focusOn({ x: centerX, y: centerY }, 0.5, duration, easing);
  }

  cinematicSweep(from: Vec2, to: Vec2, duration: number, easing: CameraEasing): void {
    this.state.x = from.x;
    this.state.y = from.y;
    this.panTo(to, duration, easing);
  }

  // ─── Update (called each frame) ───────────────────

  update(world: World): void {
    // If following an entity, smoothly track its position
    if (this.state.followEntityId !== null) {
      const pos = world.get<PositionComponent>(this.state.followEntityId, 'Position');
      if (pos) {
        // Smooth follow with lerp
        this.state.x += (pos.x - this.state.x) * 0.05;
        this.state.y += (pos.y - this.state.y) * 0.05;
      }
    }
    
    // Clamp to bounds
    this.clampToBounds();
  }

  private clampToBounds(): void {
    const { bounds, zoom } = this.state;
    const viewW = bounds.width / zoom / 2;
    const viewH = bounds.height / zoom / 2;
    this.state.x = Math.max(viewW, Math.min(bounds.width - viewW, this.state.x));
    this.state.y = Math.max(viewH, Math.min(bounds.height - viewH, this.state.y));
  }

  getState(): Readonly<CameraState> {
    return this.state;
  }
}
```

---

## 6.2 — Camera Cue Execution

The CameraSystem processes camera cues from the scenario:

```typescript
// Inside CameraSystem.update()

processCue(cue: CameraCue, world: World): void {
  const controller = this.cameraController;
  
  switch (cue.moveType) {
    case 'pan':
      if (cue.target) controller.panTo(cue.target, cue.duration, cue.easing);
      break;
      
    case 'zoom':
      if (cue.zoom) controller.zoomTo(cue.zoom, cue.duration, cue.easing);
      break;
      
    case 'follow':
      if (cue.entityId) {
        const entityId = world.resolveEntityId(cue.entityId);
        controller.follow(entityId);
        if (cue.zoom) controller.zoomTo(cue.zoom, cue.duration, cue.easing);
      }
      break;
      
    case 'overview':
      controller.overview(cue.duration, cue.easing);
      break;
      
    case 'focus':
      if (cue.target) {
        controller.focusOn(cue.target, cue.zoom || 1.0, cue.duration, cue.easing);
      }
      break;
      
    case 'cinematic_sweep':
      // Sweep requires a start position (current) and end position (target)
      if (cue.target) {
        const current = { x: controller.getState().x, y: controller.getState().y };
        controller.cinematicSweep(current, cue.target, cue.duration, cue.easing);
      }
      break;
  }
}
```

---

## 6.3 — Camera Presets

Named camera positions for common views:

```typescript
// src/battlefield/camera/CameraPresets.ts

export const DEFAULT_PRESETS: CameraPreset[] = [
  { name: 'overview', position: { x: 1000, y: 600 }, zoom: 0.5 },
  { name: 'muslim_camp', position: { x: 1400, y: 600 }, zoom: 1.0 },
  { name: 'opponent_camp', position: { x: 500, y: 600 }, zoom: 1.0 },
  { name: 'center_field', position: { x: 900, y: 600 }, zoom: 0.8 },
  { name: 'close_combat', position: { x: 900, y: 600 }, zoom: 1.8 },
];
```

---

## 6.4 — GSAP Timeline for Sequenced Moves

For complex camera choreography, multiple moves are sequenced on a GSAP timeline:

```typescript
// src/battlefield/camera/CameraTimeline.ts

export class CameraTimeline {
  private tl: gsap.core.Timeline;
  
  constructor(private controller: CameraController) {
    this.tl = gsap.timeline({ paused: true });
  }

  buildFromCues(cues: CameraCue[]): void {
    this.tl.clear();
    
    for (const cue of cues) {
      // Add each cue at its absolute timestamp position
      this.tl.call(
        () => this.controller.processCue(cue),
        [],
        cue.timestamp
      );
      
      // If cue has a hold, add a delay label
      if (cue.hold) {
        this.tl.addLabel(`hold_${cue.id}`, cue.timestamp + cue.duration);
      }
    }
  }

  play(): void { this.tl.play(); }
  pause(): void { this.tl.pause(); }
  seek(time: number): void { this.tl.seek(time); }
  setSpeed(speed: number): void { this.tl.timeScale(speed); }
}
```

---

## 6.5 — Camera Easing Reference

| Easing | Use Case |
|--------|----------|
| `linear` | Steady pans across battlefield |
| `power1.inOut` | Gentle transitions between views |
| `power2.inOut` | Standard cinematic moves |
| `power3.inOut` | Dramatic focus shifts |
| `back.out` | Slight overshoot for emphasis |
| `elastic.out` | Impact moments (use sparingly) |

---

## 6.6 — Camera Constraints

- **Min zoom**: 0.3 (full battlefield visible)
- **Max zoom**: 3.0 (close-up on single unit)
- **Default zoom**: 0.8 (comfortable overview)
- **Follow smoothing**: lerp factor 0.05 (smooth tracking)
- **Bounds clamping**: Camera cannot show area outside terrain
