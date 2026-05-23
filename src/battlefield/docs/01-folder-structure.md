# 01 — Folder Structure

## Directory Layout

```
src/battlefield/
├── ARCHITECTURE.md              # Master architecture document (index)
├── README.md                    # Quick-start guide
├── docs/                        # Detailed architecture documents
│   ├── 01-folder-structure.md
│   ├── 02-type-definitions.md
│   ├── 03-rendering-pipeline.md
│   ├── 04-ecs-architecture.md
│   ├── 05-battle-scripting.md
│   ├── 06-camera-system.md
│   ├── 07-timeline-system.md
│   ├── 08-state-machines.md
│   ├── 09-zustand-stores.md
│   ├── 10-react-integration.md
│   ├── 11-performance-strategy.md
│   └── 12-visual-style.md
│
├── core/                        # Engine core (runs OUTSIDE React)
│   ├── Engine.ts                # Main engine class, owns the rAF loop
│   ├── World.ts                 # ECS world — entity registry + system runner
│   ├── EntityManager.ts         # Create/destroy/query entities
│   ├── ComponentRegistry.ts     # Component type registration
│   ├── SystemRunner.ts          # Ordered system execution
│   ├── EventBus.ts              # Pub/sub for engine events
│   └── Clock.ts                 # Deterministic time management
│
├── components/                  # ECS Components (pure data structs)
│   ├── Position.ts
│   ├── Velocity.ts
│   ├── Rotation.ts
│   ├── Health.ts
│   ├── FormationRole.ts
│   ├── AnimationState.ts
│   ├── TeamAffiliation.ts
│   ├── Path.ts
│   ├── Renderable.ts
│   ├── Morale.ts
│   ├── CombatStats.ts
│   ├── ProjectileData.ts
│   ├── CommanderData.ts
│   ├── UnitComposition.ts
│   └── index.ts                 # Barrel export
│
├── systems/                     # ECS Systems (logic processors)
│   ├── MovementSystem.ts
│   ├── FormationSystem.ts
│   ├── CombatSystem.ts
│   ├── ProjectileSystem.ts
│   ├── MoraleSystem.ts
│   ├── AnimationSystem.ts
│   ├── CameraSystem.ts
│   ├── ReplaySystem.ts
│   ├── VisibilitySystem.ts
│   ├── ScriptingSystem.ts
│   ├── ParticleSystem.ts
│   └── index.ts                 # Barrel export
│
├── rendering/                   # PixiJS rendering layer
│   ├── RenderManager.ts         # PixiJS Application setup + layer management
│   ├── layers/
│   │   ├── BackgroundLayer.ts   # Terrain, grid, parchment texture
│   │   ├── TacticalLayer.ts     # Movement arrows, zones, range indicators
│   │   ├── EntityLayer.ts       # Unit sprites, formations, commanders
│   │   ├── FXLayer.ts           # Particles, dust, projectile trails, impacts
│   │   └── UIOverlayLayer.ts    # Labels, health bars, phase banners
│   ├── sprites/
│   │   ├── UnitSprite.ts        # Unit token renderer
│   │   ├── FormationSprite.ts   # Formation outline/shape renderer
│   │   ├── ProjectileSprite.ts  # Arrow/projectile renderer
│   │   ├── CommanderSprite.ts   # Commander marker renderer
│   │   └── MarkerSprite.ts      # Generic map marker
│   ├── effects/
│   │   ├── DustEffect.ts        # Movement dust clouds
│   │   ├── ImpactEffect.ts      # Combat impact flashes
│   │   ├── ArrowVolley.ts       # Massed arrow volley effect
│   │   └── MoraleIndicator.ts   # Morale break visual
│   └── textures/
│       ├── TextureAtlas.ts      # Atlas loader and frame registry
│       └── atlas.json           # Sprite atlas definition
│
├── camera/                      # Camera choreography
│   ├── CameraController.ts      # GSAP-powered camera transforms
│   ├── CameraPresets.ts         # Named camera positions/moves
│   ├── CameraTimeline.ts        # Sequenced camera choreography
│   └── types.ts                 # Camera-specific types
│
├── formations/                  # Formation calculators
│   ├── FormationCalculator.ts   # Master calculator dispatcher
│   ├── LineFormation.ts
│   ├── WedgeFormation.ts
│   ├── DefensiveCircle.ts
│   ├── ColumnFormation.ts
│   ├── FlankFormation.ts
│   ├── CrescentFormation.ts
│   └── FormationMorpher.ts      # Smooth transition between formations
│
├── scripting/                   # Battle scenario scripting
│   ├── ScenarioLoader.ts        # Load + validate scenario configs
│   ├── ScriptInterpreter.ts     # Execute scripted events at timestamps
│   ├── EventHandlers.ts         # Handler registry for script event types
│   └── validators.ts            # Runtime validation of scenario data
│
├── timeline/                    # Playback timeline
│   ├── TimelineController.ts    # Play/pause/seek/speed
│   ├── TimelineRecorder.ts      # Record state snapshots for replay
│   ├── NarrationSync.ts         # Sync narration audio with timeline
│   └── types.ts                 # Timeline-specific types
│
├── state/                       # Zustand stores
│   ├── uiStore.ts               # UI panel visibility, selected entity
│   ├── simulationStore.ts       # Simulation tick state (read-only from React)
│   ├── playbackStore.ts         # Play/pause/speed/seek position
│   ├── cameraStore.ts           # Camera position/zoom/target
│   └── index.ts                 # Barrel export
│
├── machines/                    # XState state machines
│   ├── battleMachine.ts         # Main battle phase orchestrator
│   └── types.ts                 # Machine context/event types
│
├── scenarios/                   # Battle scenario data files
│   ├── badr.scenario.ts         # Battle of Badr
│   ├── uhud.scenario.ts         # Battle of Uhud
│   ├── khandaq.scenario.ts      # Battle of the Trench
│   └── _template.scenario.ts    # Template for new scenarios
│
├── react/                       # React UI shell components
│   ├── BattlePlayer.tsx         # Top-level orchestrator component
│   ├── BattleCanvas.tsx         # PixiJS canvas mount point
│   ├── BattleTimeline.tsx       # Scrubber/progress bar
│   ├── BattleControls.tsx       # Play/pause/speed/restart
│   ├── BattleNarration.tsx      # Narration text overlay
│   ├── BattlePhaseIndicator.tsx # Current phase display
│   ├── BattleMinimap.tsx        # Overview minimap
│   └── hooks/
│       ├── useEngine.ts         # Engine lifecycle hook
│       ├── usePlayback.ts       # Playback controls hook
│       └── useNarration.ts      # Narration sync hook
│
└── utils/                       # Shared utilities
    ├── math.ts                  # Vec2, lerp, clamp, etc.
    ├── spatial.ts               # Spatial hash grid
    ├── pool.ts                  # Object pool implementation
    ├── deterministic.ts         # Seeded RNG for deterministic replay
    └── constants.ts             # Engine constants
```

## Key Principles

1. **`core/`** — Pure TypeScript, zero React dependencies. Runs in rAF loop.
2. **`rendering/`** — PixiJS only. Reads from ECS world, never writes.
3. **`react/`** — Thin UI shell. Subscribes to Zustand stores only.
4. **`state/`** — Zustand bridges engine → React (one-way data flow).
5. **`scenarios/`** — Data-driven. Adding a battle = adding a `.scenario.ts` file.
6. **`systems/`** — Each system does ONE thing. Order matters.

## System Execution Order (per frame)

```
1. ScriptingSystem    — Process scripted events for current timestamp
2. MovementSystem     — Apply velocity, steering, path following
3. FormationSystem    — Calculate formation targets, morphing
4. CombatSystem       — Resolve attacks, apply damage
5. ProjectileSystem   — Update projectile positions, hit detection
6. MoraleSystem       — Calculate morale, trigger routs
7. AnimationSystem    — Update sprite animation states
8. CameraSystem       — Update camera position/zoom
9. VisibilitySystem   — Frustum culling, LOD decisions
10. ParticleSystem    — Update particle emitters
```
