# 04 — ECS Architecture

## Overview

The engine uses an **ECS-like** (Entity-Component-System) architecture. It is NOT a full ECS framework — it's a lightweight, purpose-built pattern optimized for deterministic battle replay.

---

## 4.1 — Entity Manager

```typescript
// src/battlefield/core/EntityManager.ts

export class EntityManager {
  private nextId: EntityId = 1;
  private entities: Map<EntityId, Entity> = new Map();
  private components: Map<string, Map<EntityId, Component>> = new Map();
  
  // Tracking for render sync
  private created: EntityId[] = [];
  private destroyed: EntityId[] = [];

  createEntity(type: EntityType): EntityId { /* ... */ }
  destroyEntity(id: EntityId): void { /* ... */ }
  
  addComponent<T extends Component>(entityId: EntityId, component: T): void { /* ... */ }
  removeComponent(entityId: EntityId, componentType: ComponentType): void { /* ... */ }
  getComponent<T extends Component>(entityId: EntityId, type: ComponentType): T | undefined { /* ... */ }
  hasComponent(entityId: EntityId, type: ComponentType): boolean { /* ... */ }
  
  // Query: get all entities with specific component combination
  query(...componentTypes: ComponentType[]): EntityId[] { /* ... */ }
  
  // Frame lifecycle
  flushCreatedDestroyed(): { created: EntityId[]; destroyed: EntityId[] } { /* ... */ }
}
```

---

## 4.2 — World

The World is the top-level container that owns the EntityManager and provides a clean API:

```typescript
// src/battlefield/core/World.ts

export class World {
  entities: EntityManager;
  eventBus: EventBus;
  clock: Clock;
  
  // Convenience methods
  spawn(type: EntityType, components: Component[]): EntityId;
  kill(id: EntityId): void;
  get<T extends Component>(id: EntityId, type: ComponentType): T | undefined;
  
  // Snapshot for replay
  takeSnapshot(): StateSnapshot;
  restoreSnapshot(snapshot: StateSnapshot): void;
}
```

---

## 4.3 — System Interface

Every system implements this interface:

```typescript
// src/battlefield/core/SystemRunner.ts

export interface System {
  readonly name: string;
  readonly priority: number;  // lower = runs first
  
  init(world: World): void;
  update(dt: number, world: World): void;
  destroy(): void;
}

export class SystemRunner {
  private systems: System[] = [];
  
  register(system: System): void {
    this.systems.push(system);
    this.systems.sort((a, b) => a.priority - b.priority);
  }
  
  update(dt: number, world: World): void {
    for (const system of this.systems) {
      system.update(dt, world);
    }
  }
}
```

---

## 4.4 — System Descriptions

### MovementSystem (priority: 10)
- Queries entities with: `Position`, `Velocity`
- Applies velocity to position: `pos.x += vel.vx * dt`
- Applies friction: `vel.vx *= vel.friction`
- Clamps to max speed
- Handles path following for entities with `Path` component

### FormationSystem (priority: 20)
- Queries entities with: `FormationRole`, `Position`, `Velocity`
- Calculates target position from formation config
- Steers units toward their formation slot
- Handles formation morphing (smooth transition between types)
- Updates `isInPosition` flag

### CombatSystem (priority: 30)
- Queries entities with: `CombatStats`, `Position`, `Health`
- Finds targets within attack range
- Applies damage on cooldown
- Triggers charge bonus when velocity > threshold
- Emits `combat:hit` and `combat:kill` events

### ProjectileSystem (priority: 40)
- Queries entities with: `ProjectileData`, `Position`
- Updates projectile position along parabolic arc
- Checks arrival at target
- Applies damage on impact
- Destroys projectile after impact

### MoraleSystem (priority: 50)
- Queries entities with: `Morale`, `TeamAffiliation`
- Calculates morale based on: casualties, nearby allies, commander proximity
- Triggers state transitions: steady → wavering → breaking → routed
- Emits `morale:break` and `morale:rally` events
- Routed units get `retreat` animation and move away

### AnimationSystem (priority: 60)
- Queries entities with: `AnimationState`, `Velocity`, `CombatStats`
- Determines animation from entity state:
  - Moving fast → `march` or `charge`
  - In combat → `attack`
  - Health <= 0 → `death`
  - Morale routed → `retreat`
  - Otherwise → `idle`
- Updates frame index and elapsed time

### CameraSystem (priority: 70)
- Reads camera cues from scenario timeline
- Applies GSAP-driven camera transitions
- Handles follow mode (track entity position)
- Updates camera store for React UI

### ReplaySystem (priority: 75)
- Takes periodic state snapshots (every 0.5s)
- Enables seek-to-time by restoring nearest snapshot
- Maintains snapshot ring buffer (max 600 snapshots = 5 min)

### VisibilitySystem (priority: 80)
- Queries all entities with `Renderable`, `Position`
- Checks if entity is within camera viewport (with margin)
- Sets `renderable.visible = false` for off-screen entities
- Reduces render load for large battles

### ScriptingSystem (priority: 5) — RUNS FIRST
- Reads scripted events from scenario
- Fires events whose timestamp <= currentTime
- Dispatches to EventHandlers which modify entity state
- Ensures deterministic replay

### ParticleSystem (priority: 85)
- Manages particle emitters (dust, impact, fire)
- Updates particle positions, lifetimes, alpha
- Recycles dead particles back to pool

---

## 4.5 — Component Storage Strategy

Components are stored in **Structure of Arrays** style for cache efficiency:

```typescript
// Each component type has its own Map
components = {
  'Position': Map<EntityId, PositionComponent>,
  'Velocity': Map<EntityId, VelocityComponent>,
  'Health':   Map<EntityId, HealthComponent>,
  // ...
}
```

This allows systems to iterate over only the components they need without touching unrelated data.

---

## 4.6 — Entity Archetypes

Pre-defined component bundles for common entity types:

```typescript
// Unit archetype
const UNIT_ARCHETYPE: ComponentType[] = [
  'Position', 'Velocity', 'Rotation', 'Health',
  'FormationRole', 'AnimationState', 'TeamAffiliation',
  'Renderable', 'Morale', 'CombatStats', 'UnitComposition'
];

// Commander archetype
const COMMANDER_ARCHETYPE: ComponentType[] = [
  'Position', 'Velocity', 'Rotation', 'Health',
  'AnimationState', 'TeamAffiliation', 'Renderable',
  'CommanderData'
];

// Projectile archetype
const PROJECTILE_ARCHETYPE: ComponentType[] = [
  'Position', 'Velocity', 'Renderable', 'ProjectileData'
];

// Marker archetype (non-interactive)
const MARKER_ARCHETYPE: ComponentType[] = [
  'Position', 'Renderable'
];
```

---

## 4.7 — Event Bus

Internal pub/sub for decoupled communication between systems:

```typescript
// src/battlefield/core/EventBus.ts

export class EventBus {
  private listeners: Map<EngineEventType, Set<EventHandler>> = new Map();
  
  on(type: EngineEventType, handler: EventHandler): void;
  off(type: EngineEventType, handler: EventHandler): void;
  emit(event: EngineEvent): void;
  
  // Buffered mode: collect events during frame, flush at end
  buffer(event: EngineEvent): void;
  flush(): void;
}
```

---

## 4.8 — Deterministic Clock

```typescript
// src/battlefield/core/Clock.ts

export class Clock {
  private currentTime: number = 0;
  private speed: number = 1;
  private paused: boolean = false;
  
  getDelta(realTimestamp: number): number {
    if (this.paused) return 0;
    // Fixed timestep for determinism
    const fixedDt = 1 / 60; // 16.67ms
    return fixedDt * this.speed;
  }
  
  seek(time: number): void { this.currentTime = time; }
  setSpeed(speed: number): void { this.speed = speed; }
  pause(): void { this.paused = true; }
  resume(): void { this.paused = false; }
}
```

The clock uses a **fixed timestep** to ensure deterministic replay regardless of actual frame rate.
