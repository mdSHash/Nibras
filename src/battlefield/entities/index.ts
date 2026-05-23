/**
 * EntityManager - manages all entities in the ECS simulation.
 *
 * Responsibilities:
 * - Create entities from templates
 * - Destroy entities (mark inactive, emit events)
 * - Query entities by components and tags
 * - Provide fast access by ID
 * - Track active/inactive entities
 */

import type { Entity, EntityTemplate, EntityQuery } from '../types/entities';
import type { ComponentMap, ComponentType } from '../types/components';
import { EventBus } from '../core/EventBus';

export class EntityManager {
  private entities: Map<string, Entity>;
  private eventBus: EventBus;
  private nextId: number;

  constructor(eventBus: EventBus) {
    this.entities = new Map();
    this.eventBus = eventBus;
    this.nextId = 1;
  }

  /** Create an entity from a template, returns the entity */
  create(template: EntityTemplate, simulationTime: number = 0): Entity {
    const id = this.generateId();
    return this.createWithId(id, template, simulationTime);
  }

  /** Create an entity with explicit ID (for scenario loading) */
  createWithId(id: string, template: EntityTemplate, simulationTime: number = 0): Entity {
    const entity: Entity = {
      id,
      name: template.name,
      tags: new Set(template.tags),
      components: { ...template.components },
      active: true,
      createdAt: simulationTime,
      destroyedAt: null,
    };

    this.entities.set(id, entity);

    this.eventBus.emit({
      type: 'entity:created',
      payload: { entity },
    });

    return entity;
  }

  /** Get entity by ID (returns undefined if not found) */
  get(id: string): Entity | undefined {
    return this.entities.get(id);
  }

  /** Get entity by ID (throws if not found) */
  getOrThrow(id: string): Entity {
    const entity = this.entities.get(id);
    if (!entity) {
      throw new Error(`Entity not found: ${id}`);
    }
    return entity;
  }

  /** Check if entity exists and is active */
  isActive(id: string): boolean {
    const entity = this.entities.get(id);
    return entity !== undefined && entity.active;
  }

  /** Destroy an entity (marks inactive, emits event) */
  destroy(id: string, simulationTime: number = 0): void {
    const entity = this.entities.get(id);
    if (!entity) {
      return;
    }

    entity.active = false;
    entity.destroyedAt = simulationTime;

    this.eventBus.emit({
      type: 'entity:destroyed',
      payload: { entityId: id },
    });
  }

  /** Query entities matching criteria */
  query(query: EntityQuery): Entity[] {
    const results: Entity[] = [];

    for (const entity of this.entities.values()) {
      // Filter by active flag (default: only active)
      const activeFilter = query.active !== undefined ? query.active : true;
      if (entity.active !== activeFilter) {
        continue;
      }

      // Filter by required components (all must be present)
      if (query.withComponents && query.withComponents.length > 0) {
        const hasAll = query.withComponents.every(
          (comp) => entity.components[comp] !== undefined
        );
        if (!hasAll) {
          continue;
        }
      }

      // Filter by required tags (all withTags must be present)
      if (query.withTags && query.withTags.length > 0) {
        const hasAllTags = query.withTags.every((tag) => entity.tags.has(tag));
        if (!hasAllTags) {
          continue;
        }
      }

      // Filter by excluded tags (none of withoutTags must be present)
      if (query.withoutTags && query.withoutTags.length > 0) {
        const hasExcluded = query.withoutTags.some((tag) => entity.tags.has(tag));
        if (hasExcluded) {
          continue;
        }
      }

      results.push(entity);
    }

    return results;
  }

  /** Get all entities with specific components (fast path for systems) */
  withComponents(...components: ComponentType[]): Entity[] {
    const results: Entity[] = [];

    for (const entity of this.entities.values()) {
      if (!entity.active) {
        continue;
      }

      const hasAll = components.every(
        (comp) => entity.components[comp] !== undefined
      );
      if (hasAll) {
        results.push(entity);
      }
    }

    return results;
  }

  /** Get all entities with a specific tag */
  withTag(tag: string): Entity[] {
    const results: Entity[] = [];

    for (const entity of this.entities.values()) {
      if (!entity.active) {
        continue;
      }

      if (entity.tags.has(tag)) {
        results.push(entity);
      }
    }

    return results;
  }

  /** Get all active entities */
  getAll(): Entity[] {
    const results: Entity[] = [];

    for (const entity of this.entities.values()) {
      if (entity.active) {
        results.push(entity);
      }
    }

    return results;
  }

  /** Get count of active entities */
  count(): number {
    let count = 0;
    for (const entity of this.entities.values()) {
      if (entity.active) {
        count++;
      }
    }
    return count;
  }

  /** Add a component to an existing entity */
  addComponent<K extends ComponentType>(
    entityId: string,
    componentType: K,
    component: NonNullable<ComponentMap[K]>
  ): void {
    const entity = this.getOrThrow(entityId);
    (entity.components as any)[componentType] = component;

    this.eventBus.emit({
      type: 'entity:component_added',
      payload: { entityId, component: componentType },
    });
  }

  /** Remove a component from an entity */
  removeComponent(entityId: string, componentType: ComponentType): void {
    const entity = this.getOrThrow(entityId);
    delete entity.components[componentType];

    this.eventBus.emit({
      type: 'entity:component_removed',
      payload: { entityId, component: componentType },
    });
  }

  /** Clear all entities (for scenario unload) */
  clear(): void {
    this.entities.clear();
    this.nextId = 1;
  }

  /** Generate a unique entity ID */
  private generateId(): string {
    const id = `entity_${String(this.nextId).padStart(3, '0')}`;
    this.nextId++;
    return id;
  }
}
