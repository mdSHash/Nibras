# 11 — Performance Strategy

## Overview

Target: **500+ active entities at 60fps** on mid-range hardware. This requires careful optimization across spatial queries, rendering, memory allocation, and update frequency.

---

## 11.1 — Spatial Partitioning

A spatial hash grid enables O(1) neighbor queries instead of O(n^2) brute force:

```typescript
// src/battlefield/utils/spatial.ts

export class SpatialHashGrid {
  private cellSize: number;
  private cells: Map<string, EntityId[]> = new Map();

  constructor(cellSize: number = 64) {
    this.cellSize = cellSize;
  }

  private key(x: number, y: number): string {
    const cx = Math.floor(x / this.cellSize);
    const cy = Math.floor(y / this.cellSize);
    return `${cx},${cy}`;
  }

  clear(): void {
    this.cells.clear();
  }

  insert(entityId: EntityId, x: number, y: number): void {
    const k = this.key(x, y);
    const cell = this.cells.get(k);
    if (cell) cell.push(entityId);
    else this.cells.set(k, [entityId]);
  }

  query(x: number, y: number, radius: number): EntityId[] {
    const results: EntityId[] = [];
    const minCx = Math.floor((x - radius) / this.cellSize);
    const maxCx = Math.floor((x + radius) / this.cellSize);
    const minCy = Math.floor((y - radius) / this.cellSize);
    const maxCy = Math.floor((y + radius) / this.cellSize);

    for (let cx = minCx; cx <= maxCx; cx++) {
      for (let cy = minCy; cy <= maxCy; cy++) {
        const cell = this.cells.get(`${cx},${cy}`);
        if (cell) results.push(...cell);
      }
    }
    return results;
  }
}
```

**Usage**: Rebuilt every frame. CombatSystem and MoraleSystem use it for range queries.

---

## 11.2 — Object Pooling

Avoid GC pressure by reusing objects:

```typescript
// src/battlefield/utils/pool.ts

export class ObjectPool<T> {
  private pool: T[] = [];
  private factory: () => T;
  private reset: (obj: T) => void;

  constructor(factory: () => T, reset: (obj: T) => void, initialSize: number = 50) {
    this.factory = factory;
    this.reset = reset;
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(factory());
    }
  }

  acquire(): T {
    if (this.pool.length > 0) {
      return this.pool.pop()!;
    }
    return this.factory();
  }

  release(obj: T): void {
    this.reset(obj);
    this.pool.push(obj);
  }
}
```

**Pooled objects**:
- Projectile entities (frequent create/destroy)
- Particle effects (dust, impact)
- PixiJS Sprites (reuse for destroyed/created entities)
- Vec2 temporary calculations

---

## 11.3 — Render Culling

Only render entities visible in the camera viewport:

```typescript
// VisibilitySystem logic
update(dt: number, world: World): void {
  const camera = this.cameraState;
  const viewportWidth = screenWidth / camera.zoom;
  const viewportHeight = screenHeight / camera.zoom;
  const margin = 100; // pixels of margin beyond viewport

  const viewRect = {
    left: camera.x - viewportWidth / 2 - margin,
    right: camera.x + viewportWidth / 2 + margin,
    top: camera.y - viewportHeight / 2 - margin,
    bottom: camera.y + viewportHeight / 2 + margin,
  };

  for (const entityId of world.entities.query('Position', 'Renderable')) {
    const pos = world.get<PositionComponent>(entityId, 'Position')!;
    const render = world.get<RenderableComponent>(entityId, 'Renderable')!;
    
    render.visible = (
      pos.x >= viewRect.left &&
      pos.x <= viewRect.right &&
      pos.y >= viewRect.top &&
      pos.y <= viewRect.bottom
    );
  }
}
```

---

## 11.4 — Batched Rendering Strategy

| Technique | Benefit |
|-----------|---------|
| Single texture atlas | 1 draw call for all unit sprites |
| PixiJS auto-batching | Sprites with same texture batched automatically |
| Container sorting | Minimize state changes |
| Graphics reuse | Health bars share Graphics objects |
| Visibility culling | Skip off-screen sprites entirely |

---

## 11.5 — Fixed Timestep

The simulation uses a fixed timestep (1/60s) regardless of actual frame rate:

```typescript
// Engine.ts - Fixed timestep accumulator

private accumulator: number = 0;
private fixedDt: number = 1 / 60;

frame(realTimestamp: number): void {
  const realDt = (realTimestamp - this.lastTimestamp) / 1000;
  this.lastTimestamp = realTimestamp;
  this.accumulator += realDt;

  // Run simulation in fixed steps
  while (this.accumulator >= this.fixedDt) {
    this.systemRunner.update(this.fixedDt * this.speed, this.world);
    this.accumulator -= this.fixedDt;
  }

  // Render once per frame (interpolated)
  this.renderManager.sync(this.world);
  requestAnimationFrame(this.frame.bind(this));
}
```

Benefits:
- **Deterministic**: Same input = same output regardless of frame rate
- **Stable physics**: No frame-rate-dependent behavior
- **Replay-safe**: Seeking restores exact state

---

## 11.6 — Store Update Throttling

React store updates are throttled to 10fps (100ms intervals):

```
Engine runs at 60fps → Systems update every frame
Store updates at 10fps → React rerenders max 10x/second
Render sync at 60fps → PixiJS sprites update every frame
```

This means:
- PixiJS rendering is smooth (60fps)
- React UI updates are efficient (10fps is plenty for text/numbers)
- No wasted React reconciliation cycles

---

## 11.7 — Memory Budget

| Category | Budget | Notes |
|----------|--------|-------|
| Entity components | ~50KB | 500 entities x ~100 bytes each |
| Sprite objects | ~200KB | 500 PixiJS sprites |
| Texture atlas | ~2MB | Single atlas, compressed |
| Snapshots | ~30MB | 600 snapshots x ~50KB each |
| Particle pool | ~10KB | 200 particles pre-allocated |
| Spatial grid | ~5KB | Rebuilt each frame |
| **Total** | **~32MB** | Well within browser limits |

---

## 11.8 — Performance Monitoring

```typescript
// Built-in performance metrics (dev mode only)
interface PerformanceMetrics {
  fps: number;
  frameTime: number;        // ms
  systemTimes: Record<string, number>; // ms per system
  entityCount: number;
  visibleEntities: number;
  drawCalls: number;
  spriteCount: number;
}
```

---

## 11.9 — Degradation Strategy

If frame rate drops below 30fps:

1. **Level 1** (45fps): Reduce particle count by 50%
2. **Level 2** (35fps): Disable dust effects entirely
3. **Level 3** (25fps): Reduce store update rate to 5fps
4. **Level 4** (20fps): Disable formation outlines and range indicators
