/**
 * ECS Component Definitions for the Islamic Battle Replay Engine.
 * 
 * Components are pure data containers attached to entities.
 * Each component represents a single aspect of an entity's state.
 */

// ─── Utility Types ───────────────────────────────────────────────────────────

/** 2D vector for positions, velocities, and directions */
export interface Vector2D {
  x: number;
  y: number;
}

// ─── Transform Component ─────────────────────────────────────────────────────

/** Position, rotation, and scale in world space */
export interface TransformComponent {
  position: Vector2D;
  rotation: number; // radians
  scale: Vector2D;
}

// ─── Movement Component ──────────────────────────────────────────────────────

/** Velocity, speed, and pathfinding state */
export interface MovementComponent {
  velocity: Vector2D;
  maxSpeed: number;
  currentSpeed: number;
  targetPosition: Vector2D | null;
  path: Vector2D[]; // waypoints
  arrived: boolean;
}

// ─── Formation Component ─────────────────────────────────────────────────────

/** Available formation shapes */
export type FormationType =
  | 'line'
  | 'wedge'
  | 'defensive_circle'
  | 'column'
  | 'flank_left'
  | 'flank_right'
  | 'crescent'
  | 'scattered';

/** Formation layout, spacing, and cohesion */
export interface FormationComponent {
  type: FormationType;
  spacing: number; // pixels between unit slots
  facing: number; // radians - direction formation faces
  slots: Vector2D[]; // relative positions for sub-units
  cohesion: number; // 0-1, how well formation is maintained
}

// ─── Combat Component ────────────────────────────────────────────────────────

/** Health, attack, defense, morale, and engagement state */
export interface CombatComponent {
  health: number; // 0-100
  maxHealth: number;
  attack: number;
  defense: number;
  morale: number; // 0-100
  isEngaged: boolean;
  targetEntityId: string | null;
  lastAttackTime: number;
  attackCooldown: number; // ms
}

// ─── Unit Component ──────────────────────────────────────────────────────────

/**
 * Types of troops available in battles. The expanded set covers historical
 * unit types specific to particular battles — Qadisiyyah's elephants,
 * Khaybar's siege engineering, Mongol horse-archers at Ain Jalut.
 */
export type TroopType =
  | 'infantry'
  | 'cavalry'
  | 'archers'
  | 'camel_riders'
  | 'elephant'
  | 'horse_archer'
  | 'heavy_cavalry'
  | 'siege_engineer'
  | 'reserves'
  | 'command';

/**
 * Faction allegiance. Each faction gets a distinct visual tint and (in V2)
 * its own banner sprite. The "muslim side" of any battle is represented by
 * either `muslim` (Prophetic + Rashidun era) or `mamluk` (Ain Jalut, 13th c.)
 * so the simulation store knows which side to count as the protagonist.
 *
 * Add `isMuslimSide(faction)` (helper below) when checking allegiance instead
 * of comparing strings directly — this keeps Ain Jalut's Mamluk troops on the
 * "us" side without conflating their banner/tint with the early caliphate.
 */
export type Faction =
  | 'muslim'
  | 'quraysh'
  | 'jewish_tribes'
  | 'hawazin'
  | 'banu_hanifa'
  | 'byzantine'
  | 'sasanian'
  | 'mongol'
  | 'mamluk'
  | 'neutral';

/**
 * Returns true if a faction represents the "Muslim side" of a battle for the
 * purposes of strength/morale aggregation in the simulation store.
 */
export const isMuslimSide = (faction: Faction): boolean =>
  faction === 'muslim' || faction === 'mamluk';

/** Arabic display name for each faction. UI is Arabic-only. */
export const FACTION_NAME_AR: Record<Faction, string> = {
  muslim: 'المسلمون',
  mamluk: 'المماليك',
  quraysh: 'قريش',
  jewish_tribes: 'يهود خيبر',
  hawazin: 'هوازن وثقيف',
  banu_hanifa: 'بنو حنيفة',
  byzantine: 'الروم',
  sasanian: 'الفرس',
  mongol: 'المغول',
  neutral: 'محايد',
};

/** Unit identity: troop type, count, faction, and commander */
export interface UnitComponent {
  troopType: TroopType;
  faction: Faction;
  soldierCount: number; // current alive
  maxSoldiers: number; // starting count
  commanderName?: string; // e.g. "Hamza ibn Abdul-Muttalib"
  label: string; // display name e.g. "Muslim Right Flank"
  labelAr?: string; // Arabic display name e.g. "الجناح الأيمن"
}

// ─── Visual Component ────────────────────────────────────────────────────────

/** Visual animation states for a unit */
export type UnitVisualState =
  | 'idle'
  | 'marching'
  | 'charging'
  | 'fighting'
  | 'retreating'
  | 'routed'
  | 'dead';

/** Appearance and animation state */
export interface VisualComponent {
  state: UnitVisualState;
  tint: number; // hex color
  alpha: number; // 0-1
  size: number; // radius in pixels
  banner: boolean; // show banner/flag
  highlighted: boolean;
}

// ─── Selectable Component ────────────────────────────────────────────────────

/** UI interaction state for selection and hover */
export interface SelectableComponent {
  selected: boolean;
  hoverable: boolean;
  tooltipText: string;
}

// ─── Behavior Component ──────────────────────────────────────────────────────

/** AI/scripted behavior states */
export type BehaviorState =
  | 'holding'
  | 'advancing'
  | 'attacking'
  | 'flanking'
  | 'retreating'
  | 'pursuing'
  | 'regrouping';

/** Scripted behavior controller */
export interface BehaviorComponent {
  currentState: BehaviorState;
  scriptedActions: ScriptedAction[];
  currentActionIndex: number;
  waitUntil: number; // timestamp to wait until before next action
}

/** A single scripted action in a unit's behavior queue */
export interface ScriptedAction {
  type: 'move' | 'attack' | 'hold' | 'retreat' | 'change_formation' | 'wait';
  target?: Vector2D | string; // position or entity ID
  duration?: number; // ms
  formation?: FormationType;
  speed?: number; // multiplier
}

// ─── Terrain Component ───────────────────────────────────────────────────────

/**
 * Types of terrain on the battlefield. Original types (sand/rocky/oasis/
 * dune/flat/elevated) drive base appearance + speed. Variant types
 * (trench/fortress_wall/river/gorge/mountain/snow) add scenario-specific
 * obstacles — the Movement system blocks passage through trench/river/gorge
 * except at landmarks.
 */
export type TerrainType =
  | 'sand'
  | 'rocky'
  | 'oasis'
  | 'dune'
  | 'flat'
  | 'elevated'
  | 'trench'
  | 'fortress_wall'
  | 'river'
  | 'gorge'
  | 'mountain'
  | 'snow';

/** Terrain awareness and modifiers */
export interface TerrainComponent {
  currentTerrain: TerrainType;
  speedModifier: number; // multiplier based on terrain
  defenseModifier: number;
}

// ─── Particle Component ──────────────────────────────────────────────────────

/** Particle/effect emitter for visual effects (arrows, dust, etc.) */
export interface ParticleComponent {
  emitterType: 'dust' | 'arrows' | 'blood_mist' | 'banner_flutter';
  emitting: boolean;
  intensity: number; // 0-1
}

// ─── Component Map ───────────────────────────────────────────────────────────

/** All possible components that can be attached to an entity */
export interface ComponentMap {
  transform?: TransformComponent;
  movement?: MovementComponent;
  formation?: FormationComponent;
  combat?: CombatComponent;
  unit?: UnitComponent;
  visual?: VisualComponent;
  selectable?: SelectableComponent;
  behavior?: BehaviorComponent;
  terrain?: TerrainComponent;
  particle?: ParticleComponent;
}

/** Union of all component type keys */
export type ComponentType = keyof ComponentMap;
