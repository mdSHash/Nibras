/**
 * Battle Scenario Configuration for the Islamic Battle Replay Engine.
 * 
 * Scenarios define the complete data-driven script for a battle replay,
 * including forces, phases, narration, camera choreography, and outcomes.
 */

import type { Vector2D, FormationType, TroopType, Faction, TerrainType } from './components';

// ─── Battle Scenario ─────────────────────────────────────────────────────────

/**
 * Time of day for atmospheric tinting. Affects the global color overlay
 * the renderer applies to the scene. Defaults to 'day' if unset.
 */
export type DayPhase = 'dawn' | 'day' | 'dusk' | 'night';

/**
 * Weather condition for the battle. Each value drives a different particle
 * system in the WeatherSystem. Defaults to 'clear' if unset.
 *
 *  - sandstorm: Qadisiyyah day three (the historical providential storm)
 *  - storm:    Khandaq's "wind from the heavens" that scattered the Confederates
 *  - rain:     reserved
 *  - dust:     light haze, e.g. cavalry charges in arid terrain
 */
export type WeatherCondition = 'clear' | 'sandstorm' | 'storm' | 'rain' | 'dust';

/** Complete battle scenario definition — the top-level config for a replay */
export interface BattleScenario {
  id: string;
  name: string; // e.g. "Battle of Badr"
  nameAr: string; // Arabic name
  date: string; // e.g. "17 Ramadan 2 AH (13 March 624 CE)"
  location: string;
  description: string;
  descriptionAr: string;

  /** Map configuration */
  map: MapConfig;

  /**
   * Time of day for atmospheric tinting. Optional — defaults to 'day'.
   * Khandaq is 'night', Qadisiyyah day three is 'day' with sandstorm, etc.
   */
  dayPhase?: DayPhase;

  /**
   * Weather condition. Optional — defaults to 'clear'.
   */
  weather?: WeatherCondition;

  /**
   * Real-world duration of the historical battle, in days. When set, the
   * BattlePlayer shows a day counter that maps simulation time to real days
   * (e.g. Khandaq compressed 27 days into 50 simulation seconds).
   * Omit for engagements that took less than a day.
   */
  actualDayCount?: number;

  /** Forces participating in the battle */
  forces: ForceConfig[];

  /** Battle phases/script */
  phases: BattlePhaseConfig[];

  /** Narration points displayed during replay */
  narration: NarrationPoint[];

  /** Camera choreography keyframes */
  cameraScript: CameraKeyframe[];

  /** Historical outcome */
  outcome: BattleOutcome;

  /** Duration in simulation seconds */
  totalDuration: number;
}

// ─── Map Configuration ───────────────────────────────────────────────────────

/** Battlefield map dimensions, terrain, and landmarks */
export interface MapConfig {
  width: number; // world units
  height: number;
  terrain: TerrainZone[];
  landmarks: Landmark[];
  backgroundColor: number; // hex
}

/** A terrain zone defined by a polygon boundary */
export interface TerrainZone {
  id: string;
  type: TerrainType;
  polygon: Vector2D[]; // boundary points
  color: number; // hex tint
  label?: string;
}

/** A named landmark on the battlefield */
export interface Landmark {
  id: string;
  position: Vector2D;
  type: 'well' | 'hill' | 'camp' | 'oasis' | 'mountain_pass' | 'marker';
  label: string;
  labelAr?: string;
}

// ─── Force Configuration ─────────────────────────────────────────────────────

/** Configuration for one side's forces */
export interface ForceConfig {
  faction: Faction;
  label: string;
  labelAr?: string;
  totalStrength: number; // total soldiers
  units: UnitConfig[];
}

/** Configuration for a single unit within a force */
export interface UnitConfig {
  id: string;
  name: string;
  nameAr?: string;
  troopType: TroopType;
  soldierCount: number;
  commander?: string;
  startPosition: Vector2D;
  startFormation: FormationType;
  startFacing: number; // radians
  stats: UnitStats;
}

/** Base stats for a unit (1-10 scale) */
export interface UnitStats {
  attack: number; // 1-10
  defense: number; // 1-10
  speed: number; // 1-10
  morale: number; // 1-10
}

// ─── Battle Phase Scripting ──────────────────────────────────────────────────

/** A phase of the battle with timed actions and triggers */
export interface BattlePhaseConfig {
  id: string;
  name: string;
  nameAr?: string;
  startTime: number; // simulation seconds
  duration: number; // simulation seconds
  description?: string;
  actions: PhaseAction[];
  triggers?: PhaseTrigger[];
}

/** An action executed during a battle phase */
export interface PhaseAction {
  type:
    | 'move_unit'
    | 'attack_unit'
    | 'change_formation'
    | 'spawn_unit'
    | 'destroy_unit'
    | 'set_behavior'
    | 'play_effect'
    | 'camera_move';
  targetUnitId?: string;
  params: Record<string, unknown>;
  delay?: number; // seconds after phase start
}

/** A conditional trigger that fires actions when conditions are met */
export interface PhaseTrigger {
  type: 'time' | 'unit_health_below' | 'unit_reached_position' | 'morale_below';
  condition: Record<string, unknown>;
  actions: PhaseAction[];
}

// ─── Narration ───────────────────────────────────────────────────────────────

/** A narration point displayed during the replay */
export interface NarrationPoint {
  id: string;
  time: number; // simulation seconds
  duration: number; // how long to display
  text: string;
  textAr?: string;
  position?: 'top' | 'bottom' | 'center';
  style?: 'normal' | 'dramatic' | 'quote';
  audioUrl?: string;
}

// ─── Camera Keyframes ────────────────────────────────────────────────────────

/** A camera keyframe for cinematic choreography */
export interface CameraKeyframe {
  time: number; // simulation seconds
  position: Vector2D;
  zoom: number;
  duration: number; // transition duration in seconds
  easing?: string; // GSAP easing string e.g. "power2.inOut"
  type: 'pan' | 'zoom' | 'follow' | 'overview' | 'focus';
  followEntityId?: string;
}

// ─── Battle Outcome ──────────────────────────────────────────────────────────

/**
 * The historical verdict of an engagement. `muslim_victory` / `enemy_victory`
 * are the simple cases. `tactical_withdrawal` covers Mu'tah (the three
 * commanders fell, Khalid extracted the army intact). `unfought_expedition`
 * covers Tabuk (no battle occurred — the Byzantine army did not appear).
 * `draw` and `inconclusive` are kept for engagements scholars dispute.
 */
export type BattleVerdict =
  | 'muslim_victory'
  | 'enemy_victory'
  | 'tactical_withdrawal'
  | 'unfought_expedition'
  | 'draw'
  | 'inconclusive';

/** Historical outcome of the battle */
export interface BattleOutcome {
  verdict: BattleVerdict;
  muslimCasualties: number;
  /** May be undefined for unfought expeditions (e.g. Tabuk). */
  enemyCasualties?: number;
  summary: string;
  summaryAr?: string;
  significance: string;
}
