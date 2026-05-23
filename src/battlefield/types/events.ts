/**
 * Event Bus Event Types for the Islamic Battle Replay Engine.
 * 
 * Defines a strongly-typed discriminated union of all events
 * that flow through the engine's event bus.
 */

import type { Vector2D, Faction, BehaviorState, FormationType } from './components';
import type { Entity } from './entities';

// ─── Engine Events (Discriminated Union) ─────────────────────────────────────

/** All possible events emitted by the engine */
export type EngineEvent =
  // Engine lifecycle
  | { type: 'engine:initialized' }
  | { type: 'engine:started' }
  | { type: 'engine:stopped' }
  | { type: 'engine:tick'; payload: { dt: number; time: number; frame: number } }
  | { type: 'engine:error'; payload: { error: Error; context: string } }

  // Scenario events
  | { type: 'scenario:loaded'; payload: { scenarioId: string } }
  | { type: 'scenario:unloaded' }

  // Playback events
  | { type: 'playback:play' }
  | { type: 'playback:pause' }
  | { type: 'playback:stop' }
  | { type: 'playback:seek'; payload: { time: number } }
  | { type: 'playback:speed_changed'; payload: { speed: number } }
  | { type: 'playback:completed' }

  // Phase events
  | { type: 'phase:started'; payload: { phaseId: string; phaseName: string } }
  | { type: 'phase:completed'; payload: { phaseId: string } }
  | { type: 'phase:action_executed'; payload: { phaseId: string; actionIndex: number } }

  // Entity events
  | { type: 'entity:created'; payload: { entity: Entity } }
  | { type: 'entity:destroyed'; payload: { entityId: string } }
  | { type: 'entity:component_added'; payload: { entityId: string; component: string } }
  | { type: 'entity:component_removed'; payload: { entityId: string; component: string } }

  // Combat events
  | { type: 'combat:engagement_started'; payload: { attackerId: string; defenderId: string } }
  | { type: 'combat:damage_dealt'; payload: { attackerId: string; defenderId: string; damage: number } }
  | { type: 'combat:unit_routed'; payload: { entityId: string; faction: Faction } }
  | { type: 'combat:unit_destroyed'; payload: { entityId: string; faction: Faction } }

  // Movement events
  | { type: 'movement:arrived'; payload: { entityId: string; position: Vector2D } }
  | { type: 'movement:formation_changed'; payload: { entityId: string; formation: FormationType } }
  | { type: 'movement:behavior_changed'; payload: { entityId: string; behavior: BehaviorState } }

  // Camera events
  | { type: 'camera:moved'; payload: { position: Vector2D; zoom: number } }
  | { type: 'camera:transition_started'; payload: { type: string; duration: number } }
  | { type: 'camera:transition_completed' }

  // Narration events
  | { type: 'narration:started'; payload: { id: string; text: string } }
  | { type: 'narration:completed'; payload: { id: string } }

  // UI events
  | { type: 'ui:entity_selected'; payload: { entityId: string | null } }
  | { type: 'ui:entity_hovered'; payload: { entityId: string | null } }
  | { type: 'ui:tooltip_show'; payload: { entityId: string; position: Vector2D } }
  | { type: 'ui:tooltip_hide' };

// ─── Utility Types ───────────────────────────────────────────────────────────

/** Extract all event type strings as a union */
export type EngineEventType = EngineEvent['type'];

/** Helper to extract the payload type for a specific event type */
export type EventPayload<T extends EngineEventType> =
  Extract<EngineEvent, { type: T }> extends { payload: infer P } ? P : never;

/** Event handler function type */
export type EventHandler<T extends EngineEventType = EngineEventType> = (
  event: Extract<EngineEvent, { type: T }>
) => void;

/** Subscription handle returned when subscribing to events */
export interface Subscription {
  unsubscribe: () => void;
}
