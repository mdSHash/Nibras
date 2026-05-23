# 03 — Rendering Pipeline

## Overview

The rendering pipeline uses **PixiJS** (WebGL) with a strict layered container hierarchy. The renderer is a **read-only consumer** of ECS world state — it never modifies entity data.

---

## 3.1 — PixiJS Application Setup

```typescript
// src/battlefield/rendering/RenderManager.ts

import { Application, Container } from 'pixi.js';

export class RenderManager {
  app: Application;
  worldContainer: Container;    // Holds all layers, camera transforms applied here
  
  // Layer containers (bottom to top)
  backgroundLayer: Container;   // z=0: terrain, grid, parchment
  tacticalLayer: Container;     // z=1: movement arrows, zones, ranges
  entityLayer: Container;       // z=2: units, formations, commanders
  fxLayer: Container;           // z=3: particles, dust, projectiles
  uiOverlayLayer: Container;    // z=4: labels, health bars, banners

  constructor(canvas: HTMLCanvasElement, width: number, height: number) {
    // PixiJS app with shared ticker disabled (we use our own rAF)
    this.app = new Application();
    // await app.init({ canvas, width, height, ... })
  }
}
```

---

## 3.2 — Layer Hierarchy

```
Application.stage
└── worldContainer          (camera transform: position, scale, rotation)
    ├── backgroundLayer     (z-index: 0)
    │   ├── ParchmentBackground
    │   ├── TerrainFeatures (hills, rivers, dunes)
    │   └── GridOverlay (subtle tactical grid)
    │
    ├── tacticalLayer       (z-index: 1)
    │   ├── MovementArrows
    │   ├── FormationOutlines
    │   ├── RangeIndicators
    │   └── ZoneHighlights
    │
    ├── entityLayer         (z-index: 2)
    │   ├── UnitSprites (sorted by y-position for depth)
    │   ├── CommanderSprites
    │   └── FormationBanners
    │
    ├── fxLayer             (z-index: 3)
    │   ├── DustParticles
    │   ├── ProjectileSprites
    │   ├── ImpactEffects
    │   └── ArrowVolleys
    │
    └── uiOverlayLayer      (z-index: 4)  [NOT affected by camera]
        ├── UnitLabels
        ├── HealthBars
        ├── PhaseBanner
        └── MoraleIndicators
```

---

## 3.3 — Render Loop Integration

The render loop lives in [`Engine.ts`](../../core/Engine.ts) and calls the renderer after all systems have updated:

```typescript
// Pseudocode for the render frame
function frame(timestamp: number): void {
  const dt = clock.getDelta(timestamp);
  
  // 1. Run all ECS systems (updates entity state)
  systemRunner.update(dt, world);
  
  // 2. Sync ECS state → PixiJS display objects
  renderManager.sync(world);
  
  // 3. Apply camera transform to worldContainer
  renderManager.applyCamera(cameraState);
  
  // 4. PixiJS renders automatically via its internal ticker
  //    OR we call app.render() manually if ticker is disabled
  
  requestAnimationFrame(frame);
}
```

---

## 3.4 — Entity → Sprite Synchronization

Each entity with a `Renderable` component gets a corresponding PixiJS display object. The `RenderManager` maintains a `Map<EntityId, DisplayObject>` for O(1) lookups.

```typescript
// Sync strategy per frame:
sync(world: World): void {
  // 1. Create sprites for new entities
  for (const entity of world.getNewEntities()) {
    const sprite = this.createSprite(entity);
    this.spriteMap.set(entity.id, sprite);
    this.getLayer(entity).addChild(sprite);
  }
  
  // 2. Update existing sprites from component data
  for (const [entityId, sprite] of this.spriteMap) {
    const pos = world.getComponent<PositionComponent>(entityId, 'Position');
    const rot = world.getComponent<RotationComponent>(entityId, 'Rotation');
    const render = world.getComponent<RenderableComponent>(entityId, 'Renderable');
    
    if (pos) { sprite.x = pos.x; sprite.y = pos.y; }
    if (rot) { sprite.rotation = rot.angle; }
    if (render) {
      sprite.visible = render.visible;
      sprite.alpha = render.alpha;
      sprite.scale.set(render.scale);
    }
  }
  
  // 3. Remove sprites for destroyed entities
  for (const entityId of world.getDestroyedEntities()) {
    const sprite = this.spriteMap.get(entityId);
    if (sprite) {
      sprite.parent?.removeChild(sprite);
      this.spriteMap.delete(entityId);
      this.returnToPool(sprite); // object pooling
    }
  }
  
  // 4. Sort entity layer by y-position (depth sorting)
  this.entityLayer.sortChildren();
}
```

---

## 3.5 — Unit Sprite Design

Each unit token represents 20-200 soldiers. Visual design:

```
┌─────────────────────────────────────┐
│  Unit Token (top-down view)         │
│                                     │
│  ┌───────────┐                      │
│  │  ▲ shape  │  ← Triangle/circle   │
│  │  (tinted) │    based on type      │
│  └───────────┘                      │
│  │ health bar │  ← Below token       │
│  │ ████░░░░░ │                      │
│  └───────────┘                      │
│  "50 Infantry"   ← Label (optional) │
└─────────────────────────────────────┘
```

Shape by unit type:
- **Infantry**: Rectangle (shield wall)
- **Cavalry**: Triangle pointing forward (wedge)
- **Archers**: Diamond (dispersed)
- **Camel**: Rounded rectangle
- **Reserve**: Circle (uncommitted)

---

## 3.6 — Camera Transform

Camera transforms are applied to `worldContainer` only. The UI overlay layer is a sibling that stays fixed:

```typescript
applyCamera(camera: CameraState): void {
  this.worldContainer.x = -camera.x * camera.zoom + this.app.screen.width / 2;
  this.worldContainer.y = -camera.y * camera.zoom + this.app.screen.height / 2;
  this.worldContainer.scale.set(camera.zoom);
  this.worldContainer.rotation = camera.rotation;
}
```

---

## 3.7 — Texture Atlas Strategy

All unit sprites, effects, and terrain features are packed into a single texture atlas to minimize draw calls:

```json
{
  "frames": {
    "unit_infantry": { "frame": { "x": 0, "y": 0, "w": 32, "h": 32 } },
    "unit_cavalry": { "frame": { "x": 32, "y": 0, "w": 32, "h": 32 } },
    "unit_archer": { "frame": { "x": 64, "y": 0, "w": 32, "h": 32 } },
    "unit_camel": { "frame": { "x": 96, "y": 0, "w": 32, "h": 32 } },
    "effect_dust_01": { "frame": { "x": 0, "y": 32, "w": 16, "h": 16 } },
    "effect_impact_01": { "frame": { "x": 16, "y": 32, "w": 16, "h": 16 } },
    "arrow_projectile": { "frame": { "x": 32, "y": 32, "w": 8, "h": 24 } },
    "terrain_hill": { "frame": { "x": 0, "y": 64, "w": 128, "h": 64 } },
    "terrain_oasis": { "frame": { "x": 128, "y": 64, "w": 64, "h": 64 } }
  }
}
```

---

## 3.8 — Batched Rendering

PixiJS automatically batches sprites sharing the same texture. Our strategy:

1. **Single atlas** — All sprites from one texture = one draw call for all units
2. **Container sorting** — Sort by `zIndex` within layers, by `y` within entity layer
3. **Visibility culling** — Set `sprite.visible = false` for off-screen entities
4. **Graphics pooling** — Reuse `Graphics` objects for health bars and indicators

---

## 3.9 — Data Flow Diagram

```
┌──────────────────────────────────────────────────────────┐
│                    RENDER PIPELINE                         │
│                                                          │
│  ECS World ──read──→ RenderManager.sync()                │
│       │                    │                             │
│       │              ┌─────┴─────┐                       │
│       │              │ spriteMap │                        │
│       │              └─────┬─────┘                       │
│       │                    │                             │
│       │         ┌──────────┼──────────┐                  │
│       │         ▼          ▼          ▼                  │
│       │    Background  Entity     FX Layer               │
│       │      Layer      Layer                            │
│       │         │          │          │                  │
│       │         └──────────┼──────────┘                  │
│       │                    ▼                             │
│       │            worldContainer                        │
│       │                    │                             │
│  Camera ──transform──→     │                             │
│  State                     ▼                             │
│                      PixiJS Render                        │
│                            │                             │
│                            ▼                             │
│                     WebGL Canvas                          │
└──────────────────────────────────────────────────────────┘
```
