/**
 * Entity Definitions for the Islamic Battle Replay Engine.
 * 
 * Entities are unique identifiers with a collection of components.
 * They represent units, terrain features, effects, and markers on the battlefield.
 */

import type { ComponentMap } from './components';

// ─── Base Entity ─────────────────────────────────────────────────────────────

/** A runtime entity in the ECS world */
export interface Entity {
  id: string;
  name: string;
  tags: Set<string>; // e.g. 'unit', 'terrain', 'effect', 'marker'
  components: ComponentMap;
  active: boolean; // whether entity participates in simulation
  createdAt: number; // simulation time created
  destroyedAt: number | null; // simulation time destroyed
}

// ─── Entity Template ─────────────────────────────────────────────────────────

/** Template for creating entities from configuration data */
export interface EntityTemplate {
  name: string;
  tags: string[];
  components: Partial<ComponentMap>;
}

// ─── Entity Query ────────────────────────────────────────────────────────────

/** Query descriptor for filtering entities by components and tags */
export interface EntityQuery {
  withComponents: (keyof ComponentMap)[];
  withTags?: string[];
  withoutTags?: string[];
  active?: boolean;
}
