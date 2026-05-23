# Islamic Battle Replay Engine — Architecture

> A cinematic historical educational battlefield visualization system.

---

## What This Is

A **production-grade PixiJS-based replay engine** for visualizing Islamic historical battles as cinematic, data-driven educational experiences. This is NOT a game — it is a documentary-style visualization tool.

---

## Technology Stack

| Technology | Role |
|-----------|------|
| **PixiJS** | WebGL rendering (layered containers) |
| **Zustand** | State bridge between engine and React |
| **GSAP** | Cinematic camera animations |
| **XState** | Battle phase orchestration |
| **requestAnimationFrame** | Render loop (outside React) |
| **React 19** | UI shell only (controls, narration, timeline) |
| **TypeScript** | Full type safety throughout |

---

## Design Principles

1. **Simulation NEVER triggers React rerenders** — Engine writes to Zustand stores at 10fps
2. **Deterministic playback** — Fixed timestep, seeded RNG, same scenario = same replay
3. **Data-driven battles** — Scenarios described in config files, not procedural code
4. **Cinematic camera** — GSAP-choreographed documentary-style camera movements
5. **500+ entities at 60fps** — Spatial partitioning, object pooling, render culling
6. **Respectful and educational** — No gore, dignified representation, atmospheric style

---

## Architecture Documents

Detailed design is split across focused documents:

| # | Document | Contents |
|---|----------|----------|
| 01 | [Folder Structure](docs/01-folder-structure.md) | Complete directory layout, system execution order |
| 02 | [Type Definitions](docs/02-type-definitions.md) | All TypeScript interfaces for the engine |
| 03 | [Rendering Pipeline](docs/03-rendering-pipeline.md) | PixiJS layers, sprite sync, texture atlas |
| 04 | [ECS Architecture](docs/04-ecs-architecture.md) | Entity/Component/System design, all systems |
| 05 | [Battle Scripting](docs/05-battle-scripting.md) | Scenario format, complete example, authoring guide |
| 06 | [Camera System](docs/06-camera-system.md) | GSAP camera controller, presets, choreography |
| 07 | [Timeline System](docs/07-timeline-system.md) | Playback controls, seek, narration sync |
| 08 | [State Machines](docs/08-state-machines.md) | XState battle lifecycle machine |
| 09 | [Zustand Stores](docs/09-zustand-stores.md) | All store definitions, data flow |
| 10 | [React Integration](docs/10-react-integration.md) | UI components, hooks, mount strategy |
| 11 | [Performance](docs/11-performance-strategy.md) | Spatial hash, pooling, culling, budgets |
| 12 | [Visual Style](docs/12-visual-style.md) | Color palette, typography, token design |

---

## High-Level Data Flow

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐  │
│  │   Scenario   │────→│    Engine     │────→│   PixiJS     │  │
│  │   .ts file   │     │  (rAF loop)  │     │  (WebGL)     │  │
│  └──────────────┘     └──────┬───────┘     └──────────────┘  │
│                              │                                 │
│                    writes (10fps)                               │
│                              │                                 │
│                              ▼                                 │
│                    ┌──────────────────┐                        │
│                    │  Zustand Stores  │                        │
│                    └────────┬─────────┘                        │
│                             │                                  │
│                   subscribes│                                  │
│                             ▼                                  │
│                    ┌──────────────────┐                        │
│                    │  React UI Shell  │                        │
│                    │  (controls, etc) │                        │
│                    └──────────────────┘                        │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## Implementation Phases

### Phase 1: Foundation
- Engine core (World, EntityManager, SystemRunner, Clock)
- Basic PixiJS setup with layer hierarchy
- Zustand stores (skeleton)
- BattlePlayer React shell

### Phase 2: Rendering
- RenderManager with sprite sync
- Unit token sprites (all 5 types)
- Terrain background rendering
- Texture atlas setup

### Phase 3: Systems
- MovementSystem + FormationSystem
- CombatSystem + ProjectileSystem
- MoraleSystem
- AnimationSystem

### Phase 4: Scripting & Camera
- ScriptInterpreter + EventHandlers
- CameraController with GSAP
- Camera cue processing
- NarrationSync

### Phase 5: Timeline & Playback
- TimelineController (play/pause/speed)
- TimelineRecorder (snapshots for seek)
- XState battle machine
- Full playback controls

### Phase 6: Polish
- Particle effects (dust, impact)
- Formation morphing animations
- Performance optimization pass
- First complete scenario (Battle of Badr)

### Phase 7: Content
- Additional scenarios (Uhud, Khandaq, etc.)
- Audio narration integration
- Minimap
- Mobile responsiveness

---

## Key Entities

| Entity Type | Components | Represents |
|-------------|-----------|------------|
| Unit | Position, Velocity, Rotation, Health, FormationRole, AnimationState, TeamAffiliation, Renderable, Morale, CombatStats, UnitComposition | 20-200 soldiers |
| Commander | Position, Velocity, Rotation, Health, AnimationState, TeamAffiliation, Renderable, CommanderData | Army leader |
| Projectile | Position, Velocity, Renderable, ProjectileData | Arrow volley |
| Formation | (virtual — tracked by FormationSystem) | Unit grouping |
| Marker | Position, Renderable | Map annotation |
| DustEffect | Position, Renderable | Particle emitter |

---

## Troop Types

- **Infantry** — Slow, high defense, melee
- **Cavalry** — Fast, charge bonus, flanking
- **Archers** — Ranged, low defense, area damage
- **Camel** — Medium speed, desert bonus
- **Reserve** — Uncommitted, high morale

## Formation Types

- **Line** — Standard battle line
- **Wedge** — Cavalry charge formation
- **Defensive Circle** — Last stand / surrounded
- **Column** — March / movement formation
- **Flank** — Split for flanking maneuver
- **Crescent** — Envelopment formation
