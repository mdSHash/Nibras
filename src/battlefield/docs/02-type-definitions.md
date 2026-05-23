# 02 — TypeScript Type Definitions

All core interfaces for the Islamic Battle Replay Engine.

---

## 2.1 — Core Primitives

```typescript
// src/battlefield/utils/math.ts

export interface Vec2 {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Color {
  r: number;
  g: number;
  b: number;
  a?: number;
}
```

---

## 2.2 — Entity Types

```typescript
// src/battlefield/core/types.ts

export type EntityId = number;

export type EntityType =
  | 'unit'
  | 'formation'
  | 'commander'
  | 'projectile'
  | 'marker'
  | 'dust_effect'
  | 'impact_effect';

export interface Entity {
  id: EntityId;
  type: EntityType;
  active: boolean;
  components: Set<string>;
}
```

---

## 2.3 — ECS Components

```typescript
// src/battlefield/components/Position.ts
export interface PositionComponent {
  readonly _type: 'Position';
  x: number;
  y: number;
  z: number; // layer depth for rendering order
}

// src/battlefield/components/Velocity.ts
export interface VelocityComponent {
  readonly _type: 'Velocity';
  vx: number;
  vy: number;
  maxSpeed: number;
  acceleration: number;
  friction: number;
}

// src/battlefield/components/Rotation.ts
export interface RotationComponent {
  readonly _type: 'Rotation';
  angle: number;        // radians
  targetAngle: number;  // desired angle
  turnSpeed: number;    // radians per second
}

// src/battlefield/components/Health.ts
export interface HealthComponent {
  readonly _type: 'Health';
  current: number;
  max: number;
  armor: number;
  regeneration: number;
  isDead: boolean;
}

// src/battlefield/components/FormationRole.ts
export interface FormationRoleComponent {
  readonly _type: 'FormationRole';
  formationId: EntityId;
  slotIndex: number;
  localOffset: Vec2;       // offset from formation center
  isInPosition: boolean;
  arrivalThreshold: number;
}

// src/battlefield/components/AnimationState.ts
export type AnimationName =
  | 'idle'
  | 'march'
  | 'charge'
  | 'attack'
  | 'defend'
  | 'retreat'
  | 'death'
  | 'rally';

export interface AnimationStateComponent {
  readonly _type: 'AnimationState';
  current: AnimationName;
  previous: AnimationName;
  frameIndex: number;
  elapsed: number;
  speed: number;
  loop: boolean;
}

// src/battlefield/components/TeamAffiliation.ts
export type TeamId = 'muslim' | 'opponent';

export interface TeamAffiliationComponent {
  readonly _type: 'TeamAffiliation';
  team: TeamId;
  factionId: string;
  color: string;
  secondaryColor: string;
}

// src/battlefield/components/Path.ts
export interface PathComponent {
  readonly _type: 'Path';
  waypoints: Vec2[];
  currentWaypointIndex: number;
  speed: number;
  arrivalDistance: number;
  isComplete: boolean;
  loop: boolean;
}

// src/battlefield/components/Renderable.ts
export type RenderShape = 'circle' | 'triangle' | 'rectangle' | 'sprite';

export interface RenderableComponent {
  readonly _type: 'Renderable';
  visible: boolean;
  shape: RenderShape;
  width: number;
  height: number;
  spriteKey?: string;
  tint: number;         // hex color for PixiJS
  alpha: number;
  scale: number;
  zIndex: number;
  layer: RenderLayer;
}

export type RenderLayer =
  | 'background'
  | 'tactical'
  | 'entity'
  | 'fx'
  | 'ui';

// src/battlefield/components/Morale.ts
export type MoraleState = 'steady' | 'wavering' | 'breaking' | 'routed' | 'rallied';

export interface MoraleComponent {
  readonly _type: 'Morale';
  value: number;          // 0-100
  maxValue: number;
  state: MoraleState;
  breakThreshold: number;
  rallyThreshold: number;
  decayRate: number;
  nearbyAlliesBonus: number;
  commanderBonus: number;
}

// src/battlefield/components/CombatStats.ts
export type UnitType = 'infantry' | 'cavalry' | 'archer' | 'camel' | 'reserve';
export type AttackType = 'melee' | 'ranged' | 'charge';

export interface CombatStatsComponent {
  readonly _type: 'CombatStats';
  unitType: UnitType;
  attackType: AttackType;
  attackDamage: number;
  attackRange: number;
  attackCooldown: number;   // seconds between attacks
  lastAttackTime: number;
  chargeBonus: number;      // extra damage on charge
  defenseValue: number;
  targetEntityId: EntityId | null;
  isEngaged: boolean;
}

// src/battlefield/components/ProjectileData.ts
export interface ProjectileDataComponent {
  readonly _type: 'ProjectileData';
  sourceEntityId: EntityId;
  targetPosition: Vec2;
  damage: number;
  speed: number;
  arcHeight: number;       // parabolic arc peak
  elapsed: number;
  duration: number;
  trailLength: number;
}

// src/battlefield/components/CommanderData.ts
export interface CommanderDataComponent {
  readonly _type: 'CommanderData';
  name: string;
  nameAr: string;
  commandRadius: number;
  moraleBoost: number;
  formationIds: EntityId[];
  isAlive: boolean;
}

// src/battlefield/components/UnitComposition.ts
export interface UnitCompositionComponent {
  readonly _type: 'UnitComposition';
  soldierCount: number;       // 20-200 soldiers represented
  originalCount: number;
  unitType: UnitType;
  label: string;
  labelAr: string;
}
```

---

## 2.4 — Component Union Type

```typescript
// src/battlefield/components/index.ts

export type Component =
  | PositionComponent
  | VelocityComponent
  | RotationComponent
  | HealthComponent
  | FormationRoleComponent
  | AnimationStateComponent
  | TeamAffiliationComponent
  | PathComponent
  | RenderableComponent
  | MoraleComponent
  | CombatStatsComponent
  | ProjectileDataComponent
  | CommanderDataComponent
  | UnitCompositionComponent;

export type ComponentType = Component['_type'];
```

---

## 2.5 — Formation Types

```typescript
// src/battlefield/formations/types.ts

export type FormationType =
  | 'line'
  | 'wedge'
  | 'defensive_circle'
  | 'column'
  | 'flank'
  | 'crescent';

export interface FormationConfig {
  type: FormationType;
  center: Vec2;
  facing: number;          // radians
  spacing: number;         // pixels between units
  depth: number;           // rows deep
  width: number;           // units wide
  curvature?: number;      // for crescent/wedge
}

export interface FormationSlot {
  index: number;
  localPosition: Vec2;     // relative to formation center
  occupied: boolean;
  entityId: EntityId | null;
}

export interface FormationState {
  id: EntityId;
  config: FormationConfig;
  slots: FormationSlot[];
  morphTarget: FormationType | null;
  morphProgress: number;   // 0-1
  morphDuration: number;   // seconds
}
```

---

## 2.6 — Scenario & Scripting Types

```typescript
// src/battlefield/scripting/types.ts

export interface BattleScenario {
  id: string;
  metadata: ScenarioMetadata;
  terrain: TerrainConfig;
  factions: FactionConfig[];
  deployment: DeploymentConfig;
  phases: BattlePhaseConfig[];
  events: ScriptedEvent[];
  narration: NarrationCue[];
  cameraCues: CameraCue[];
}

export interface ScenarioMetadata {
  name: string;
  nameAr: string;
  date: string;
  dateAr: string;
  hijriYear: number;
  location: string;
  locationAr: string;
  description: string;
  descriptionAr: string;
  outcome: BattleOutcome;
  significance: string;
  significanceAr: string;
  totalDuration: number;   // seconds of replay
}

export type BattleOutcome =
  | 'muslim_victory'
  | 'muslim_defeat'
  | 'inconclusive'
  | 'strategic_withdrawal';

export interface TerrainConfig {
  type: TerrainType;
  width: number;
  height: number;
  features: TerrainFeature[];
  backgroundTexture?: string;
  ambientColor: string;
}

export type TerrainType =
  | 'desert'
  | 'valley'
  | 'oasis'
  | 'coastal'
  | 'mountain_pass'
  | 'plains'
  | 'urban';

export interface TerrainFeature {
  id: string;
  type: TerrainFeatureType;
  position: Vec2;
  size: Vec2;
  rotation?: number;
  label?: string;
  labelAr?: string;
  blocksMovement: boolean;
  providesDefenseBonus: number;
}

export type TerrainFeatureType =
  | 'hill'
  | 'oasis'
  | 'trench'
  | 'wall'
  | 'rocks'
  | 'palm_grove'
  | 'river'
  | 'dune'
  | 'fortification';

export interface FactionConfig {
  id: string;
  name: string;
  nameAr: string;
  team: TeamId;
  color: string;
  secondaryColor: string;
  commander: CommanderConfig;
  units: UnitConfig[];
}

export interface CommanderConfig {
  name: string;
  nameAr: string;
  commandRadius: number;
  moraleBoost: number;
  position: Vec2;
}

export interface UnitConfig {
  id: string;
  label: string;
  labelAr: string;
  type: UnitType;
  soldierCount: number;
  position: Vec2;
  facing: number;
  formation: FormationType;
  stats: UnitStatsConfig;
}

export interface UnitStatsConfig {
  health: number;
  attack: number;
  defense: number;
  speed: number;
  morale: number;
  range: number;
  chargeBonus: number;
}

export interface DeploymentConfig {
  duration: number;        // seconds for deployment phase
  muslimZone: Rect;
  opponentZone: Rect;
}
```

---

## 2.7 — Battle Phase Types

```typescript
// src/battlefield/scripting/types.ts (continued)

export type BattlePhaseType =
  | 'deployment'
  | 'opening_engagement'
  | 'cavalry_maneuver'
  | 'archer_exchange'
  | 'flanking_attack'
  | 'main_clash'
  | 'retreat'
  | 'pursuit'
  | 'victory';

export interface BattlePhaseConfig {
  id: string;
  type: BattlePhaseType;
  name: string;
  nameAr: string;
  startTime: number;       // seconds into replay
  duration: number;        // seconds
  description: string;
  descriptionAr: string;
  triggerEvents: string[]; // event IDs to fire at phase start
  endCondition?: PhaseEndCondition;
}

export type PhaseEndCondition =
  | { type: 'time_elapsed' }
  | { type: 'units_in_range'; distance: number }
  | { type: 'casualties_threshold'; percentage: number; team: TeamId }
  | { type: 'morale_break'; team: TeamId }
  | { type: 'position_reached'; entityId: string; target: Vec2; radius: number };
```

---

## 2.8 — Scripted Event Types

```typescript
// src/battlefield/scripting/types.ts (continued)

export type ScriptedEventType =
  | 'move_unit'
  | 'rotate_formation'
  | 'change_formation'
  | 'trigger_charge'
  | 'play_narration'
  | 'focus_camera'
  | 'spawn_projectile'
  | 'arrow_volley'
  | 'morale_break'
  | 'retreat'
  | 'reveal_reinforcements'
  | 'set_speed'
  | 'spawn_effect'
  | 'remove_entity'
  | 'set_morale'
  | 'commander_death';

export interface ScriptedEvent {
  id: string;
  type: ScriptedEventType;
  timestamp: number;       // seconds into replay
  duration?: number;       // how long the event takes
  target: string;          // entity/unit ID
  params: ScriptedEventParams;
}

export type ScriptedEventParams =
  | MoveUnitParams
  | RotateFormationParams
  | ChangeFormationParams
  | TriggerChargeParams
  | PlayNarrationParams
  | FocusCameraParams
  | SpawnProjectileParams
  | ArrowVolleyParams
  | MoraleBreakParams
  | RetreatParams
  | RevealReinforcementsParams
  | SetSpeedParams
  | SpawnEffectParams
  | RemoveEntityParams
  | SetMoraleParams
  | CommanderDeathParams;

export interface MoveUnitParams {
  type: 'move_unit';
  destination: Vec2;
  speed?: number;
  waypoints?: Vec2[];
}

export interface RotateFormationParams {
  type: 'rotate_formation';
  targetAngle: number;
  duration: number;
}

export interface ChangeFormationParams {
  type: 'change_formation';
  newFormation: FormationType;
  morphDuration: number;
}

export interface TriggerChargeParams {
  type: 'trigger_charge';
  targetEntityId: string;
  speedMultiplier: number;
}

export interface PlayNarrationParams {
  type: 'play_narration';
  narrationId: string;
}

export interface FocusCameraParams {
  type: 'focus_camera';
  cameraPreset?: string;
  position?: Vec2;
  zoom?: number;
  duration: number;
  easing?: string;
}

export interface SpawnProjectileParams {
  type: 'spawn_projectile';
  origin: Vec2;
  target: Vec2;
  count: number;
  spread: number;
  damage: number;
}

export interface ArrowVolleyParams {
  type: 'arrow_volley';
  sourceUnitId: string;
  targetArea: Vec2;
  arrowCount: number;
  damage: number;
  duration: number;
}

export interface MoraleBreakParams {
  type: 'morale_break';
  severity: number;
}

export interface RetreatParams {
  type: 'retreat';
  direction: Vec2;
  speed: number;
}

export interface RevealReinforcementsParams {
  type: 'reveal_reinforcements';
  units: UnitConfig[];
  entryPoint: Vec2;
  entryDirection: number;
}

export interface SetSpeedParams {
  type: 'set_speed';
  speed: number;
}

export interface SpawnEffectParams {
  type: 'spawn_effect';
  effectType: 'dust' | 'impact' | 'rally_banner' | 'fire';
  position: Vec2;
  duration: number;
  scale: number;
}

export interface RemoveEntityParams {
  type: 'remove_entity';
  fadeOut: boolean;
  fadeDuration: number;
}

export interface SetMoraleParams {
  type: 'set_morale';
  value: number;
}

export interface CommanderDeathParams {
  type: 'commander_death';
  moraleImpact: number;
  narrationId?: string;
}
```

---

## 2.9 — Camera Types

```typescript
// src/battlefield/camera/types.ts

export type CameraEasing =
  | 'linear'
  | 'power1.inOut'
  | 'power2.inOut'
  | 'power3.inOut'
  | 'back.out'
  | 'elastic.out';

export type CameraMoveType =
  | 'pan'
  | 'zoom'
  | 'follow'
  | 'overview'
  | 'focus'
  | 'cinematic_sweep';

export interface CameraCue {
  id: string;
  timestamp: number;       // seconds into replay
  moveType: CameraMoveType;
  target?: Vec2;
  entityId?: string;       // for follow mode
  zoom?: number;           // 0.5 = zoomed out, 2.0 = zoomed in
  duration: number;
  easing: CameraEasing;
  hold?: number;           // seconds to hold after arriving
}

export interface CameraState {
  x: number;
  y: number;
  zoom: number;
  rotation: number;
  targetX: number;
  targetY: number;
  targetZoom: number;
  isAnimating: boolean;
  followEntityId: EntityId | null;
  bounds: Rect;
}

export interface CameraPreset {
  name: string;
  position: Vec2;
  zoom: number;
  rotation?: number;
}
```

---

## 2.10 — Narration Types

```typescript
// src/battlefield/timeline/types.ts

export interface NarrationCue {
  id: string;
  timestamp: number;       // seconds into replay
  duration: number;        // display duration
  text: string;
  textAr: string;
  audioUrl?: string;
  position: NarrationPosition;
  style: NarrationStyle;
  autoAdvance: boolean;
}

export type NarrationPosition =
  | 'top'
  | 'bottom'
  | 'center'
  | 'subtitle';

export type NarrationStyle =
  | 'standard'
  | 'dramatic'
  | 'quran_verse'
  | 'hadith'
  | 'historical_note';
```

---

## 2.11 — Timeline Types

```typescript
// src/battlefield/timeline/types.ts (continued)

export type PlaybackSpeed = 0.5 | 1 | 1.5 | 2 | 4;

export interface PlaybackState {
  isPlaying: boolean;
  speed: PlaybackSpeed;
  currentTime: number;     // seconds
  totalDuration: number;   // seconds
  isComplete: boolean;
  loopEnabled: boolean;
}

export interface TimelineMarker {
  id: string;
  time: number;
  label: string;
  labelAr: string;
  type: 'phase' | 'event' | 'narration';
  color: string;
}

export interface StateSnapshot {
  timestamp: number;
  entities: Map<EntityId, Component[]>;
  phase: BattlePhaseType;
  camera: CameraState;
}
```

---

## 2.12 — Engine Event Bus Types

```typescript
// src/battlefield/core/EventBus.ts

export type EngineEventType =
  | 'engine:started'
  | 'engine:stopped'
  | 'engine:tick'
  | 'phase:changed'
  | 'entity:created'
  | 'entity:destroyed'
  | 'combat:hit'
  | 'combat:kill'
  | 'morale:break'
  | 'morale:rally'
  | 'formation:changed'
  | 'narration:start'
  | 'narration:end'
  | 'camera:move_complete'
  | 'scenario:loaded'
  | 'playback:seek'
  | 'playback:speed_changed';

export interface EngineEvent {
  type: EngineEventType;
  timestamp: number;
  payload: Record<string, unknown>;
}
```
