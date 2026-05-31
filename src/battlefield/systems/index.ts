/**
 * ECS Systems for the Islamic Battle Replay Engine.
 *
 * MovementSystem — moves entities toward their target positions each frame.
 * RenderSystem — syncs entity state to PixiJS display objects each frame.
 * TerrainRenderer — draws the battlefield background (called once on load).
 */

import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import type { Entity } from '../types/entities';
import type {
  Vector2D,
  MovementComponent,
  TransformComponent,
  VisualComponent,
  UnitComponent,
  UnitVisualState,
  CombatComponent,
  FormationComponent,
  FormationType,
  Faction,
} from '../types/components';
import type { BattleScenario, MapConfig, TerrainZone, Landmark } from '../types/scenario';
import { EntityManager } from '../entities';
import { EventBus } from '../core/EventBus';
import { PixiRenderer } from '../renderer/PixiRenderer';

// ============================================================
// MOVEMENT SYSTEM
// ============================================================

/**
 * MovementSystem - moves entities toward their target positions.
 *
 * For each entity with Transform + Movement components:
 * - If has targetPosition and not arrived:
 *   - Calculate direction vector toward target
 *   - Move at currentSpeed * dt
 *   - If within arrival threshold, mark as arrived
 * - If has path (waypoints):
 *   - Move toward current waypoint
 *   - When arrived at waypoint, advance to next
 *   - When all waypoints done, mark arrived
 * - Update velocity based on movement
 * - Update transform rotation to face movement direction
 */
export class MovementSystem {
  private entityManager: EntityManager;
  private eventBus: EventBus;
  private arrivalThreshold: number;

  constructor(entityManager: EntityManager, eventBus: EventBus, arrivalThreshold: number = 5) {
    this.entityManager = entityManager;
    this.eventBus = eventBus;
    this.arrivalThreshold = arrivalThreshold;
  }

  /** Called each fixed timestep */
  update(dt: number, _time: number): void {
    const entities = this.entityManager.withComponents('transform', 'movement');
    for (const entity of entities) {
      this.moveEntity(entity, dt);
    }
  }

  /** Move a single entity toward its target */
  private moveEntity(entity: Entity, dt: number): void {
    const transform = entity.components.transform!;
    const movement = entity.components.movement!;

    // If already arrived or no target, zero velocity and return
    if (movement.arrived || (!movement.targetPosition && movement.path.length === 0)) {
      movement.velocity = { x: 0, y: 0 };
      return;
    }

    // Determine current target (waypoint or final target)
    let target: Vector2D;
    if (movement.path.length > 0) {
      target = movement.path[0];
    } else {
      target = movement.targetPosition!;
    }

    // Calculate direction
    const dx = target.x - transform.position.x;
    const dy = target.y - transform.position.y;
    const dist = this.distance(transform.position, target);

    if (dist < this.arrivalThreshold) {
      // Arrived at current target
      if (movement.path.length > 0) {
        movement.path.shift(); // advance to next waypoint
        if (movement.path.length === 0 && !movement.targetPosition) {
          movement.arrived = true;
          movement.velocity = { x: 0, y: 0 };
          this.eventBus.emit({
            type: 'movement:arrived',
            payload: { entityId: entity.id, position: { ...transform.position } },
          });
        }
      } else {
        // Arrived at final target
        movement.arrived = true;
        movement.velocity = { x: 0, y: 0 };
        this.eventBus.emit({
          type: 'movement:arrived',
          payload: { entityId: entity.id, position: { ...transform.position } },
        });
      }
      return;
    }

    // Move toward target
    const dir = this.normalize({ x: dx, y: dy });
    const speed = movement.currentSpeed * dt;
    const actualMove = Math.min(speed, dist); // don't overshoot

    transform.position.x += dir.x * actualMove;
    transform.position.y += dir.y * actualMove;
    movement.velocity = { x: dir.x * movement.currentSpeed, y: dir.y * movement.currentSpeed };

    // Update rotation to face movement direction
    transform.rotation = Math.atan2(dir.y, dir.x);
  }

  /** Calculate distance between two points */
  private distance(a: Vector2D, b: Vector2D): number {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /** Normalize a vector */
  private normalize(v: Vector2D): Vector2D {
    const len = Math.sqrt(v.x * v.x + v.y * v.y);
    if (len === 0) {
      return { x: 0, y: 0 };
    }
    return { x: v.x / len, y: v.y / len };
  }
}

// ============================================================
// VISUAL CONSTANTS & PALETTES
// ============================================================

/** Faction color palette — military cartography style.
 *  Each faction has a layered palette (base / light / dark / banner / dot) so
 *  the renderer can shade formations, banner cloth, and individual soldier
 *  dots distinctly without a string switch in render code. */
const FACTION_COLORS: Record<Faction, {
  base: number;
  light: number;
  dark: number;
  banner: number;
  dot: number;
}> = {
  muslim: {
    base: 0x2d5016, light: 0x4a7a2e, dark: 0x1a3009,
    banner: 0x000000, // black banner of the Prophet ﷺ (al-`uqab)
    dot: 0x3d8b3d,
  },
  mamluk: {
    base: 0xb8941f, light: 0xd4af37, dark: 0x7a6010,
    banner: 0xb8941f, // Mamluk gold (Ain Jalut)
    dot: 0xd4af37,
  },
  quraysh: {
    base: 0x8b1a1a, light: 0xb22222, dark: 0x5c1010,
    banner: 0x8b0000, // red eagle/black banner of Quraysh
    dot: 0xcd5c5c,
  },
  jewish_tribes: {
    base: 0x6b4f8b, light: 0x9778b8, dark: 0x3e2c52,
    banner: 0x6b4f8b,
    dot: 0x9778b8,
  },
  hawazin: {
    base: 0xb8860b, light: 0xdaa520, dark: 0x6f5208,
    banner: 0xb8860b, // dark goldenrod (Hawazin / Thaqif)
    dot: 0xdaa520,
  },
  byzantine: {
    base: 0x6b0f12, light: 0x9c1c20, dark: 0x3f0809,
    banner: 0x6b0f12, // imperial purple-red labarum
    dot: 0xc9a14b, // gold accent
  },
  sasanian: {
    base: 0x5d2e8c, light: 0x8a4dcf, dark: 0x331853,
    banner: 0x5d2e8c, // royal purple drafsh kaviani
    dot: 0xd4af37, // gold
  },
  mongol: {
    base: 0x4b5320, light: 0x6e7a32, dark: 0x2c3013,
    banner: 0x4b5320, // olive — tugh standards
    dot: 0x9aa64c,
  },
  neutral: {
    base: 0x6b6b6b, light: 0x8b8b8b, dark: 0x4b4b4b,
    banner: 0x555555,
    dot: 0x999999,
  },
};

/** Desert palette for terrain */
const TERRAIN_PALETTE = {
  sandLight: 0xd4a574,
  sandMid: 0xc4956a,
  sandDark: 0x8b6914,
  oasis: 0x2e6b4a,
  rocky: 0x6b5b4b,
  dune: 0xb8956b,
  grid: 0x8b7355,
  well: 0x4a90d9,
  camp: 0x8b6914,
  hill: 0x7a6b5a,
};

/** Max soldier dots to render per unit (for performance) */
const MAX_DOTS_PER_UNIT = 20;

/** Dot size in pixels */
const DOT_SIZE = 3;

/** Spacing between dots */
const DOT_SPACING = 7;

// ============================================================
// RENDER SYSTEM
// ============================================================

/**
 * RenderSystem - syncs entity state to PixiJS display objects.
 *
 * Each unit is rendered as a formation block with:
 * - Rectangular/shaped arrangement of soldier dots (faction-colored)
 * - Banner/flag with unit name text
 * - Troop count indicator
 * - Commander star indicator (if applicable)
 * - Health/morale arc ring
 * - Movement trail (when moving)
 *
 * Visual style: Military sand table / Total War tactical map
 */
export class RenderSystem {
  private entityManager: EntityManager;
  private renderer: PixiRenderer;
  private eventBus: EventBus;

  // Map entity ID -> PixiJS display object container
  private displayObjects: Map<string, Container>;

  // Cache formation type per entity to avoid unnecessary redraws
  private cachedFormations: Map<string, FormationType>;

  // Cache previous positions for movement trails
  private previousPositions: Map<string, Vector2D>;

  constructor(entityManager: EntityManager, renderer: PixiRenderer, eventBus: EventBus) {
    this.entityManager = entityManager;
    this.renderer = renderer;
    this.eventBus = eventBus;
    this.displayObjects = new Map();
    this.cachedFormations = new Map();
    this.previousPositions = new Map();
  }

  /** Called each frame (after movement, before render). `time` is the
   *  simulation clock in seconds — used to drive periodic visual effects
   *  (charge pulse, fight jitter, march sway). */
  update(_dt: number, time: number): void {
    const entities = this.entityManager.withComponents('transform', 'visual', 'unit');
    const seenIds = new Set<string>();

    for (const entity of entities) {
      seenIds.add(entity.id);

      if (!this.displayObjects.has(entity.id)) {
        const container = this.createDisplayObject(entity);
        this.displayObjects.set(entity.id, container);
      } else {
        this.updateDisplayObject(entity, this.displayObjects.get(entity.id)!, time);
      }
    }

    for (const [id] of this.displayObjects) {
      if (!seenIds.has(id)) {
        this.removeDisplayObject(id);
      }
    }
  }

  /** Derive the visual animation state from movement + combat each frame.
   *  Authors don't have to script visual.state — it's a function of what
   *  the unit is doing right now. */
  private deriveVisualState(entity: Entity): UnitVisualState {
    const combat = entity.components.combat;
    const movement = entity.components.movement;

    if (combat && combat.health <= 0) return 'dead';
    if (combat && combat.morale < 25) return 'routed';
    if (combat && combat.isEngaged) return 'fighting';

    if (movement && !movement.arrived && movement.targetPosition) {
      // Charging vs marching: high current speed → charging
      if (movement.currentSpeed > 100) return 'charging';
      return 'marching';
    }

    if (combat && combat.health < combat.maxHealth * 0.4) return 'retreating';

    return 'idle';
  }

  /** Apply a visual state to a unit container — pulse, jitter, sway, fade.
   *  These effects are deliberately subtle so they don't compete with the
   *  cartography-style aesthetic of the battlefield. */
  private applyVisualState(
    container: Container,
    state: UnitVisualState,
    time: number,
    entityId: string
  ): void {
    // Use entity id hash as a phase offset so units don't pulse in unison
    const phase = (entityId.charCodeAt(0) + entityId.length) * 0.13;

    switch (state) {
      case 'idle':
        container.scale.set(1);
        container.rotation = 0;
        container.alpha = 1;
        break;
      case 'marching': {
        // Gentle horizontal sway, ~2 Hz
        const sway = Math.sin(time * 2 + phase) * 0.015;
        container.rotation = sway;
        container.scale.set(1);
        container.alpha = 1;
        break;
      }
      case 'charging': {
        // Pulsing scale, ~3 Hz, slight rotation forward
        const pulse = 1 + Math.sin(time * 3 + phase) * 0.05;
        container.scale.set(pulse);
        container.rotation = 0;
        container.alpha = 1;
        break;
      }
      case 'fighting': {
        // Sharp jitter at ~10 Hz. Random walk feel.
        const jx = (Math.sin(time * 10 + phase) + Math.cos(time * 13 + phase * 2)) * 0.5;
        container.rotation = jx * 0.04;
        container.scale.set(1 + Math.abs(jx) * 0.04);
        container.alpha = 1;
        break;
      }
      case 'retreating':
        container.scale.set(0.96);
        container.rotation = Math.sin(time * 2 + phase) * 0.02;
        container.alpha = 0.85;
        break;
      case 'routed': {
        // Fast erratic movement
        const e = Math.sin(time * 6 + phase) * 0.06;
        container.rotation = e;
        container.scale.set(0.9);
        container.alpha = 0.7;
        break;
      }
      case 'dead':
        container.scale.set(0.7);
        container.rotation = 0;
        container.alpha = 0.35;
        break;
    }
  }

  /** Create display object for a new entity */
  private createDisplayObject(entity: Entity): Container {
    const container = new Container();
    container.label = entity.id;

    const unit = entity.components.unit!;
    const visual = entity.components.visual!;
    const formation = entity.components.formation;
    const combat = entity.components.combat;

    // 1. Movement trail graphic (behind everything)
    const trail = new Graphics();
    trail.label = 'trail';
    container.addChild(trail);

    // 2. Health/morale arc ring
    const healthRing = new Graphics();
    healthRing.label = 'healthRing';
    container.addChild(healthRing);

    // 3. Formation shape (soldier dots)
    const formationGraphic = new Graphics();
    formationGraphic.label = 'formation';
    container.addChild(formationGraphic);

    // 4. Banner/flag with unit name
    const bannerContainer = new Container();
    bannerContainer.label = 'banner';
    container.addChild(bannerContainer);

    this.drawBanner(bannerContainer, unit);

    // 5. Troop count text
    const countStyle = new TextStyle({
      fontSize: 9,
      fill: 0xffffff,
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'bold',
      dropShadow: {
        alpha: 0.8,
        angle: Math.PI / 4,
        blur: 2,
        color: 0x000000,
        distance: 1,
      },
    });
    const countText = new Text({
      text: `${unit.soldierCount}`,
      style: countStyle,
    });
    countText.label = 'count';
    countText.anchor.set(0.5, 0);
    container.addChild(countText);

    // 6. Commander indicator (golden star)
    if (unit.commanderName) {
      const commanderStar = new Graphics();
      commanderStar.label = 'commander';
      this.drawCommanderStar(commanderStar);
      container.addChild(commanderStar);
    }

    // Draw initial formation shape
    const formationType = formation?.type ?? 'line';
    this.drawFormation(formationGraphic, unit, formationType);
    this.cachedFormations.set(entity.id, formationType);

    // Draw health ring
    this.drawHealthRing(healthRing, unit, combat, formationType);

    // Position elements relative to formation
    const dims = this.getFormationDimensions(unit.soldierCount, formationType);
    bannerContainer.position.set(0, -dims.height / 2 - 20);
    countText.position.set(0, dims.height / 2 + 4);

    if (unit.commanderName) {
      const star = container.getChildByLabel('commander') as Graphics;
      if (star) {
        star.position.set(dims.width / 2 + 10, -dims.height / 2 - 5);
      }
    }

    // Add to entity layer
    this.renderer.getLayer('entity').addChild(container);

    // Position from transform
    const transform = entity.components.transform!;
    container.position.set(transform.position.x, transform.position.y);
    container.alpha = visual.alpha;

    // Store initial position for trail
    this.previousPositions.set(entity.id, { ...transform.position });

    return container;
  }

  /** Update existing display object from entity state */
  private updateDisplayObject(entity: Entity, container: Container, time: number): void {
    const transform = entity.components.transform!;
    const visual = entity.components.visual!;
    const unit = entity.components.unit!;
    const formation = entity.components.formation;
    const combat = entity.components.combat;
    const movement = entity.components.movement;

    // Update position
    container.position.set(transform.position.x, transform.position.y);

    // Derive + cache visual state, then apply state-based animation effects
    visual.state = this.deriveVisualState(entity);
    this.applyVisualState(container, visual.state, time, entity.id);

    // Check if formation type changed — only redraw if needed
    const currentFormationType = formation?.type ?? 'line';
    const cachedFormation = this.cachedFormations.get(entity.id);

    if (cachedFormation !== currentFormationType) {
      // Formation changed — redraw
      const formationGraphic = container.getChildByLabel('formation') as Graphics;
      if (formationGraphic) {
        this.drawFormation(formationGraphic, unit, currentFormationType);
      }
      this.cachedFormations.set(entity.id, currentFormationType);

      // Reposition elements
      const dims = this.getFormationDimensions(unit.soldierCount, currentFormationType);
      const bannerContainer = container.getChildByLabel('banner') as Container;
      if (bannerContainer) {
        bannerContainer.position.set(0, -dims.height / 2 - 20);
      }
      const countText = container.getChildByLabel('count') as Text;
      if (countText) {
        countText.position.set(0, dims.height / 2 + 4);
      }
    }

    // Update health ring
    const healthRing = container.getChildByLabel('healthRing') as Graphics;
    if (healthRing) {
      this.drawHealthRing(healthRing, unit, combat, currentFormationType);
    }

    // Update troop count
    const countText = container.getChildByLabel('count') as Text;
    if (countText) {
      countText.text = `${unit.soldierCount}/${unit.maxSoldiers}`;
    }

    // Update movement trail
    const trail = container.getChildByLabel('trail') as Graphics;
    if (trail && movement) {
      const prevPos = this.previousPositions.get(entity.id);
      if (prevPos && !movement.arrived && movement.targetPosition) {
        this.drawMovementTrail(trail, transform.position, movement.targetPosition, unit.faction);
      } else {
        trail.clear();
      }
    }

    // Update previous position
    this.previousPositions.set(entity.id, { ...transform.position });

    // Selection highlight
    if (visual.highlighted) {
      const formationGraphic = container.getChildByLabel('formation') as Graphics;
      if (formationGraphic) {
        // Redraw with highlight
        this.drawFormation(formationGraphic, unit, currentFormationType, true);
      }
    }
  }

  /** Remove display object for destroyed entity */
  private removeDisplayObject(entityId: string): void {
    const container = this.displayObjects.get(entityId);
    if (container) {
      container.destroy({ children: true });
      this.displayObjects.delete(entityId);
    }
    this.cachedFormations.delete(entityId);
    this.previousPositions.delete(entityId);
  }

  // ─── FORMATION DRAWING ─────────────────────────────────────────────────────

  /** Get formation dimensions (width x height in pixels) */
  private getFormationDimensions(
    soldierCount: number,
    formationType: FormationType
  ): { width: number; height: number; cols: number; rows: number } {
    const dotCount = Math.min(soldierCount, MAX_DOTS_PER_UNIT);

    switch (formationType) {
      case 'line': {
        // Wide and shallow
        const cols = Math.min(dotCount, 10);
        const rows = Math.ceil(dotCount / cols);
        return {
          width: cols * DOT_SPACING,
          height: rows * DOT_SPACING,
          cols,
          rows,
        };
      }
      case 'column': {
        // Narrow and deep
        const cols = Math.min(dotCount, 3);
        const rows = Math.ceil(dotCount / cols);
        return {
          width: cols * DOT_SPACING,
          height: rows * DOT_SPACING,
          cols,
          rows,
        };
      }
      case 'wedge': {
        // Triangle shape — approximate bounding box
        const side = Math.ceil(Math.sqrt(dotCount * 2));
        return {
          width: side * DOT_SPACING,
          height: side * DOT_SPACING,
          cols: side,
          rows: side,
        };
      }
      case 'defensive_circle': {
        // Circle — approximate bounding box
        const radius = Math.ceil(Math.sqrt(dotCount)) * DOT_SPACING / 2;
        return {
          width: radius * 2,
          height: radius * 2,
          cols: Math.ceil(Math.sqrt(dotCount)),
          rows: Math.ceil(Math.sqrt(dotCount)),
        };
      }
      case 'crescent': {
        // Wide arc
        const cols = Math.min(dotCount, 12);
        const rows = Math.ceil(dotCount / cols);
        return {
          width: cols * DOT_SPACING,
          height: rows * DOT_SPACING + 10,
          cols,
          rows,
        };
      }
      default: {
        // Default rectangular
        const cols = Math.ceil(Math.sqrt(dotCount * 2));
        const rows = Math.ceil(dotCount / cols);
        return {
          width: cols * DOT_SPACING,
          height: rows * DOT_SPACING,
          cols,
          rows,
        };
      }
    }
  }

  /** Draw formation shape as soldier dots */
  private drawFormation(
    graphics: Graphics,
    unit: UnitComponent,
    formationType: FormationType,
    highlighted: boolean = false
  ): void {
    graphics.clear();

    const colors = FACTION_COLORS[unit.faction];
    const dotCount = Math.min(unit.soldierCount, MAX_DOTS_PER_UNIT);
    const dims = this.getFormationDimensions(unit.soldierCount, formationType);

    // Draw a subtle background shape for the formation
    const bgAlpha = 0.15;
    switch (formationType) {
      case 'wedge':
        this.drawWedgeBackground(graphics, dims, colors.dark, bgAlpha);
        break;
      case 'defensive_circle':
        this.drawCircleBackground(graphics, dims, colors.dark, bgAlpha);
        break;
      default:
        // Rectangle background
        graphics.roundRect(
          -dims.width / 2 - 4,
          -dims.height / 2 - 4,
          dims.width + 8,
          dims.height + 8,
          3
        );
        graphics.fill({ color: colors.dark, alpha: bgAlpha });
        break;
    }

    // Draw individual soldier dots based on formation type
    const positions = this.getSoldierPositions(dotCount, formationType, dims);
    for (const pos of positions) {
      graphics.circle(pos.x, pos.y, DOT_SIZE);
      graphics.fill({ color: colors.dot, alpha: 0.9 });
    }

    // Highlight border if selected
    if (highlighted) {
      switch (formationType) {
        case 'wedge':
          this.drawWedgeBackground(graphics, dims, 0xffd700, 0.4);
          break;
        case 'defensive_circle':
          graphics.circle(0, 0, dims.width / 2 + 6);
          graphics.stroke({ color: 0xffd700, width: 2, alpha: 0.8 });
          break;
        default:
          graphics.roundRect(
            -dims.width / 2 - 6,
            -dims.height / 2 - 6,
            dims.width + 12,
            dims.height + 12,
            4
          );
          graphics.stroke({ color: 0xffd700, width: 2, alpha: 0.8 });
          break;
      }
    }
  }

  /** Get soldier dot positions for a given formation */
  private getSoldierPositions(
    dotCount: number,
    formationType: FormationType,
    dims: { width: number; height: number; cols: number; rows: number }
  ): Vector2D[] {
    const positions: Vector2D[] = [];

    switch (formationType) {
      case 'line': {
        // Grid arrangement, wide and shallow
        for (let i = 0; i < dotCount; i++) {
          const col = i % dims.cols;
          const row = Math.floor(i / dims.cols);
          positions.push({
            x: col * DOT_SPACING - (dims.cols - 1) * DOT_SPACING / 2,
            y: row * DOT_SPACING - (dims.rows - 1) * DOT_SPACING / 2,
          });
        }
        break;
      }
      case 'column': {
        // Narrow column
        for (let i = 0; i < dotCount; i++) {
          const col = i % dims.cols;
          const row = Math.floor(i / dims.cols);
          positions.push({
            x: col * DOT_SPACING - (dims.cols - 1) * DOT_SPACING / 2,
            y: row * DOT_SPACING - (dims.rows - 1) * DOT_SPACING / 2,
          });
        }
        break;
      }
      case 'wedge': {
        // Triangle/wedge shape — each row has one more dot than the previous
        let placed = 0;
        let row = 0;
        while (placed < dotCount) {
          const dotsInRow = row + 1;
          for (let col = 0; col < dotsInRow && placed < dotCount; col++) {
            positions.push({
              x: col * DOT_SPACING - (dotsInRow - 1) * DOT_SPACING / 2,
              y: row * DOT_SPACING - dims.height / 3,
            });
            placed++;
          }
          row++;
        }
        break;
      }
      case 'defensive_circle': {
        // Ring arrangement
        const radius = dims.width / 2 - DOT_SIZE;
        for (let i = 0; i < dotCount; i++) {
          const angle = (i / dotCount) * Math.PI * 2;
          positions.push({
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
          });
        }
        break;
      }
      case 'crescent': {
        // Arc/crescent shape
        for (let i = 0; i < dotCount; i++) {
          const t = i / (dotCount - 1 || 1);
          const angle = Math.PI * 0.3 + t * Math.PI * 0.4; // partial arc
          const radius = dims.width / 2;
          const row = Math.floor(i / dims.cols);
          positions.push({
            x: Math.cos(angle) * (radius - row * DOT_SPACING) - radius * 0.3,
            y: Math.sin(angle) * (radius - row * DOT_SPACING) - radius * 0.5,
          });
        }
        break;
      }
      default: {
        // Scattered/default rectangular
        for (let i = 0; i < dotCount; i++) {
          const col = i % dims.cols;
          const row = Math.floor(i / dims.cols);
          positions.push({
            x: col * DOT_SPACING - (dims.cols - 1) * DOT_SPACING / 2,
            y: row * DOT_SPACING - (dims.rows - 1) * DOT_SPACING / 2,
          });
        }
        break;
      }
    }

    return positions;
  }

  /** Draw wedge-shaped background */
  private drawWedgeBackground(
    graphics: Graphics,
    dims: { width: number; height: number },
    color: number,
    alpha: number
  ): void {
    graphics.moveTo(0, -dims.height / 3);
    graphics.lineTo(dims.width / 2 + 4, dims.height * 2 / 3 + 4);
    graphics.lineTo(-dims.width / 2 - 4, dims.height * 2 / 3 + 4);
    graphics.closePath();
    graphics.fill({ color, alpha });
  }

  /** Draw circle-shaped background */
  private drawCircleBackground(
    graphics: Graphics,
    dims: { width: number; height: number },
    color: number,
    alpha: number
  ): void {
    graphics.circle(0, 0, dims.width / 2 + 4);
    graphics.fill({ color, alpha });
  }

  // ─── BANNER DRAWING ────────────────────────────────────────────────────────

  /** Draw unit banner with Arabic name label + faction-specific icon glyph.
   *  The glyph is a small Graphics-drawn symbol (~12 px) that distinguishes
   *  factions at a glance even if banner cloth colors are similar:
   *   - muslim:        ☪ crescent (Prophetic black banner = al-`uqab)
   *   - mamluk:        ✦ four-point gold star (Mamluk standards)
   *   - quraysh:       ⌖ stylized eagle silhouette
   *   - byzantine:     ☧ Chi-Rho / labarum cross
   *   - sasanian:      ◆ rhombus (drafsh kaviani panels)
   *   - mongol:        ⨯ tugh tail-mark
   *   - hawazin:       ⌒ tribal arc
   *   - jewish_tribes: ✡ six-point star (historical accuracy)
   *   - neutral:       small dot
   */
  private drawBanner(bannerContainer: Container, unit: UnitComponent): void {
    const colors = FACTION_COLORS[unit.faction];

    // Banner flag background
    const bannerBg = new Graphics();
    bannerBg.label = 'bannerBg';

    // Use Arabic label exclusively (project is Arabic-only).
    const labelText = unit.labelAr || unit.label;
    const textWidth = Math.max(labelText.length * 7, 50);
    const iconSize = 14;
    const iconGap = 4;
    const totalWidth = textWidth + iconSize + iconGap;

    bannerBg.roundRect(-totalWidth / 2 - 4, -8, totalWidth + 8, 16, 2);
    bannerBg.fill({ color: colors.banner, alpha: 0.85 });
    bannerBg.roundRect(-totalWidth / 2 - 4, -8, totalWidth + 8, 16, 2);
    bannerBg.stroke({ color: colors.light, width: 1, alpha: 0.6 });
    bannerContainer.addChild(bannerBg);

    // Faction icon — drawn left of the text in RTL banner reading order
    const icon = new Graphics();
    icon.label = 'factionIcon';
    icon.position.set(-totalWidth / 2 + iconSize / 2, 0);
    this.drawFactionGlyph(icon, unit.faction, iconSize);
    bannerContainer.addChild(icon);

    // Banner text
    const textStyle = new TextStyle({
      fontSize: 11,
      fill: 0xffffff,
      fontFamily: "'Noto Sans Arabic', 'Segoe UI', 'Tahoma', Arial, sans-serif",
      fontWeight: 'bold',
    });
    const text = new Text({ text: labelText, style: textStyle });
    text.anchor.set(0.5, 0.5);
    text.position.set(iconSize / 2 + iconGap / 2, 0);
    text.label = 'bannerText';
    bannerContainer.addChild(text);

    // Banner pole
    const pole = new Graphics();
    pole.label = 'pole';
    pole.moveTo(0, 8);
    pole.lineTo(0, 20);
    pole.stroke({ color: colors.light, width: 1.5, alpha: 0.6 });
    bannerContainer.addChild(pole);
  }

  /** Render a small faction-identifying glyph in the banner.
   *  Sized so the longest dimension fits within `size` pixels. */
  private drawFactionGlyph(g: Graphics, faction: Faction, size: number): void {
    const r = size / 2;
    const stroke = { color: 0xffffff, width: 1.4, alpha: 0.95 };

    switch (faction) {
      case 'muslim': {
        // Crescent (Islamic banner)
        g.circle(0, 0, r);
        g.stroke(stroke);
        g.circle(r * 0.35, 0, r * 0.85);
        g.fill({ color: FACTION_COLORS.muslim.banner, alpha: 1 });
        break;
      }
      case 'mamluk': {
        // Four-point star
        const arms = [0, Math.PI / 2, Math.PI, Math.PI * 1.5];
        for (const a of arms) {
          g.moveTo(0, 0);
          g.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        g.moveTo(Math.cos(Math.PI / 4) * r * 0.4, Math.sin(Math.PI / 4) * r * 0.4);
        for (let i = 0; i < 4; i++) {
          const a = Math.PI / 4 + i * Math.PI / 2;
          g.lineTo(Math.cos(a) * r * 0.4, Math.sin(a) * r * 0.4);
        }
        g.stroke({ color: 0xffe27a, width: 1.4, alpha: 1 });
        g.fill({ color: 0xd4af37, alpha: 0.6 });
        break;
      }
      case 'quraysh': {
        // Stylized eagle silhouette (V-shape with body)
        g.moveTo(-r, -r * 0.2);
        g.lineTo(0, r * 0.4);
        g.lineTo(r, -r * 0.2);
        g.lineTo(r * 0.5, -r * 0.1);
        g.lineTo(0, r * 0.1);
        g.lineTo(-r * 0.5, -r * 0.1);
        g.closePath();
        g.fill({ color: 0xffffff, alpha: 0.9 });
        break;
      }
      case 'byzantine': {
        // Chi-Rho / labarum: vertical + diagonal cross
        g.moveTo(0, -r);
        g.lineTo(0, r);
        g.moveTo(-r * 0.7, -r * 0.7);
        g.lineTo(r * 0.7, r * 0.7);
        g.stroke({ color: 0xfff0a0, width: 1.6, alpha: 1 });
        // Small loop atop the upright (the rho)
        g.circle(0, -r * 0.5, r * 0.25);
        g.stroke({ color: 0xfff0a0, width: 1.2, alpha: 1 });
        break;
      }
      case 'sasanian': {
        // Drafsh Kaviani — diamond / rhombus
        g.moveTo(0, -r);
        g.lineTo(r, 0);
        g.lineTo(0, r);
        g.lineTo(-r, 0);
        g.closePath();
        g.fill({ color: 0xd4af37, alpha: 0.85 });
        g.stroke({ color: 0x5d2e8c, width: 1.2, alpha: 1 });
        break;
      }
      case 'mongol': {
        // Tugh — vertical pole with horsehair tassels (X-mark style)
        g.moveTo(-r, -r);
        g.lineTo(r, r);
        g.moveTo(r, -r);
        g.lineTo(-r, r);
        g.stroke({ color: 0xffffff, width: 1.6, alpha: 1 });
        break;
      }
      case 'hawazin': {
        // Tribal arc (curved bow shape)
        g.arc(0, r * 0.4, r * 0.95, Math.PI, 0);
        g.stroke({ color: 0xffe27a, width: 1.6, alpha: 1 });
        break;
      }
      case 'jewish_tribes': {
        // Six-pointed star (two overlapping triangles)
        const tri = (offsetAngle: number) => {
          for (let i = 0; i < 3; i++) {
            const a = offsetAngle + (i * 2 * Math.PI) / 3 - Math.PI / 2;
            const x = Math.cos(a) * r;
            const y = Math.sin(a) * r;
            if (i === 0) g.moveTo(x, y);
            else g.lineTo(x, y);
          }
          g.closePath();
        };
        tri(0);
        tri(Math.PI);
        g.stroke({ color: 0xffffff, width: 1.2, alpha: 0.9 });
        break;
      }
      case 'neutral':
      default:
        g.circle(0, 0, r * 0.4);
        g.fill({ color: 0xffffff, alpha: 0.6 });
        break;
    }
  }

  // ─── HEALTH RING ───────────────────────────────────────────────────────────

  /** Draw health/morale arc ring around formation */
  private drawHealthRing(
    graphics: Graphics,
    unit: UnitComponent,
    combat: CombatComponent | undefined,
    formationType: FormationType
  ): void {
    graphics.clear();

    if (!combat) return;

    const healthPercent = combat.health / combat.maxHealth;
    const moralePercent = combat.morale / 100;
    const dims = this.getFormationDimensions(unit.soldierCount, formationType);

    // Determine ring color based on health
    let healthColor: number;
    if (healthPercent > 0.7) {
      healthColor = 0x44cc44; // green
    } else if (healthPercent > 0.4) {
      healthColor = 0xcccc44; // yellow
    } else {
      healthColor = 0xcc4444; // red
    }

    // Draw health arc (bottom half)
    const radius = Math.max(dims.width, dims.height) / 2 + 8;
    const startAngle = Math.PI * 0.5;
    const endAngle = startAngle + Math.PI * 2 * healthPercent;

    graphics.arc(0, 0, radius, startAngle, endAngle);
    graphics.stroke({ color: healthColor, width: 2.5, alpha: 0.7 });

    // Draw morale indicator (thin inner arc, top half)
    if (moralePercent < 1) {
      const moraleRadius = radius - 3;
      const moraleEnd = Math.PI * -0.5 + Math.PI * 2 * moralePercent;
      graphics.arc(0, 0, moraleRadius, -Math.PI * 0.5, moraleEnd);
      graphics.stroke({ color: 0x6699ff, width: 1.5, alpha: 0.5 });
    }
  }

  // ─── COMMANDER STAR ────────────────────────────────────────────────────────

  /** Draw a golden star for commander units */
  private drawCommanderStar(graphics: Graphics): void {
    const size = 6;
    const points = 5;
    const outerRadius = size;
    const innerRadius = size * 0.4;

    // Draw star shape
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) {
        graphics.moveTo(x, y);
      } else {
        graphics.lineTo(x, y);
      }
    }
    graphics.closePath();
    graphics.fill({ color: 0xffd700, alpha: 0.9 });
    graphics.stroke({ color: 0xb8860b, width: 1, alpha: 0.8 });
  }

  // ─── MOVEMENT TRAIL ────────────────────────────────────────────────────────

  /** Draw dotted movement trail from current position to target */
  private drawMovementTrail(
    graphics: Graphics,
    _currentPos: Vector2D,
    targetPos: Vector2D,
    faction: Faction
  ): void {
    graphics.clear();

    const colors = FACTION_COLORS[faction];
    // Draw relative to container (current pos is 0,0 in local space)
    const localTarget = { x: targetPos.x - _currentPos.x, y: targetPos.y - _currentPos.y };

    // Dotted line from origin to target
    const dist = Math.sqrt(localTarget.x * localTarget.x + localTarget.y * localTarget.y);
    const dotSpacing = 12;
    const numDots = Math.min(Math.floor(dist / dotSpacing), 30);

    for (let i = 1; i <= numDots; i++) {
      const t = i / (numDots + 1);
      const x = localTarget.x * t;
      const y = localTarget.y * t;
      graphics.circle(x, y, 1.5);
      graphics.fill({ color: colors.light, alpha: 0.3 + t * 0.3 });
    }

    // Small arrow at target
    if (dist > 20) {
      graphics.circle(localTarget.x, localTarget.y, 3);
      graphics.fill({ color: colors.light, alpha: 0.6 });
    }
  }

  /** Clean up all display objects */
  destroy(): void {
    for (const [_id, container] of this.displayObjects) {
      container.destroy({ children: true });
    }
    this.displayObjects.clear();
    this.cachedFormations.clear();
    this.previousPositions.clear();
  }
}

// ============================================================
// TERRAIN RENDERER
// ============================================================

/**
 * TerrainRenderer - draws the battlefield background once during scenario load.
 *
 * Renders:
 * - Desert sand gradient background
 * - Terrain zones (oasis, rocky, dunes) with subtle fills
 * - Landmarks (wells, camps, hills) with icons and labels
 * - Faint grid lines for scale reference
 * - Compass rose indicator
 */
export class TerrainRenderer {
  private renderer: PixiRenderer;

  constructor(renderer: PixiRenderer) {
    this.renderer = renderer;
  }

  /** Render the complete battlefield terrain (called once on scenario load) */
  renderTerrain(mapConfig: MapConfig): void {
    this.drawBackground(mapConfig);
    this.drawTerrainZones(mapConfig.terrain);
    this.drawGrid(mapConfig.width, mapConfig.height);
    this.drawLandmarks(mapConfig.landmarks);
    this.drawCompassRose(mapConfig.width, mapConfig.height);
  }

  /** Draw desert sand gradient background — extends well beyond map bounds
   *  so the terrain color fills the viewport at any camera zoom/position */
  private drawBackground(mapConfig: MapConfig): void {
    const bg = new Graphics();
    bg.label = 'terrain-background';

    const w = mapConfig.width;
    const h = mapConfig.height;

    // Draw a massive background (4x the map size) centered on the map
    // This ensures no dark canvas background is visible at any zoom level
    const padding = Math.max(w, h) * 1.5; // 1.5x the largest dimension as padding on each side
    const bgX = -padding;
    const bgY = -padding;
    const bgW = w + padding * 2;
    const bgH = h + padding * 2;

    // Base sand color fill — covers entire extended area
    bg.rect(bgX, bgY, bgW, bgH);
    bg.fill({ color: TERRAIN_PALETTE.sandLight, alpha: 1 });

    // Darker center gradient (simulated with overlapping rects) — only within map bounds
    const gradientSteps = 5;
    for (let i = 0; i < gradientSteps; i++) {
      const t = i / gradientSteps;
      const inset = t * 300;
      const alpha = t * 0.15;
      bg.rect(inset, inset, w - inset * 2, h - inset * 2);
      bg.fill({ color: TERRAIN_PALETTE.sandMid, alpha });
    }

    // Subtle noise texture (scattered small dots for sand grain effect) — within map bounds
    const noiseCount = 200;
    for (let i = 0; i < noiseCount; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const size = 1 + Math.random() * 2;
      bg.circle(x, y, size);
      bg.fill({ color: TERRAIN_PALETTE.sandDark, alpha: 0.03 + Math.random() * 0.04 });
    }

    this.renderer.getLayer('background').addChild(bg);
  }

  /** Draw terrain zones (oasis, rocky, dunes) */
  private drawTerrainZones(terrainZones: TerrainZone[]): void {
    for (const zone of terrainZones) {
      if (zone.id === 'main-field') continue; // skip the base field

      const zoneGraphic = new Graphics();
      zoneGraphic.label = `terrain-${zone.id}`;

      // Draw polygon fill
      if (zone.polygon.length > 2) {
        zoneGraphic.moveTo(zone.polygon[0].x, zone.polygon[0].y);
        for (let i = 1; i < zone.polygon.length; i++) {
          zoneGraphic.lineTo(zone.polygon[i].x, zone.polygon[i].y);
        }
        zoneGraphic.closePath();

        // Different styles per terrain type
        switch (zone.type) {
          case 'oasis':
            zoneGraphic.fill({ color: TERRAIN_PALETTE.oasis, alpha: 0.2 });
            zoneGraphic.stroke({ color: TERRAIN_PALETTE.oasis, width: 1.5, alpha: 0.3 });
            break;
          case 'rocky':
            zoneGraphic.fill({ color: TERRAIN_PALETTE.rocky, alpha: 0.15 });
            this.drawRockyDetails(zoneGraphic, zone.polygon);
            break;
          case 'dune':
            zoneGraphic.fill({ color: TERRAIN_PALETTE.dune, alpha: 0.2 });
            this.drawDuneLines(zoneGraphic, zone.polygon);
            break;
          // ─── Scenario-specific terrain variants ───────────────────────────
          case 'trench':
            // Khandaq — dark, dug-out earth. Soldiers cannot cross except at
            // designated landmarks (handled in MovementSystem).
            zoneGraphic.fill({ color: 0x2a1a08, alpha: 0.55 });
            zoneGraphic.stroke({ color: 0x4a3318, width: 2, alpha: 0.7 });
            this.drawTrenchHatching(zoneGraphic, zone.polygon);
            break;
          case 'fortress_wall':
            // Khaybar forts, Yarmouk Roman castra. Solid stone wall.
            zoneGraphic.fill({ color: 0x6b6359, alpha: 0.6 });
            zoneGraphic.stroke({ color: 0x3d3833, width: 3, alpha: 0.85 });
            break;
          case 'river':
            // Yarmouk gorge river, Qadisiyyah Ateeq. Blue, blocks movement.
            zoneGraphic.fill({ color: 0x2a5e8c, alpha: 0.55 });
            zoneGraphic.stroke({ color: 0x4080b8, width: 2, alpha: 0.6 });
            break;
          case 'gorge':
            // Yarmouk wadi where the Byzantine right was driven over the cliff.
            zoneGraphic.fill({ color: 0x1c1a18, alpha: 0.7 });
            zoneGraphic.stroke({ color: 0x5c1010, width: 2, alpha: 0.5 });
            break;
          case 'mountain':
            // Uhud archers' hill. Higher contrast rocky.
            zoneGraphic.fill({ color: 0x4a3a2a, alpha: 0.35 });
            this.drawRockyDetails(zoneGraphic, zone.polygon);
            break;
          case 'snow':
            // Reserved for winter scenarios.
            zoneGraphic.fill({ color: 0xeaf0f5, alpha: 0.4 });
            zoneGraphic.stroke({ color: 0xffffff, width: 1, alpha: 0.6 });
            break;
          default:
            zoneGraphic.fill({ color: zone.color, alpha: 0.15 });
            break;
        }
      }

      // Zone label
      if (zone.label) {
        const labelStyle = new TextStyle({
          fontSize: 11,
          fill: 0xcccccc,
          fontFamily: 'Arial, sans-serif',
          fontStyle: 'italic',
        });
        const label = new Text({ text: zone.label, style: labelStyle });
        label.anchor.set(0.5, 0.5);
        // Position at center of polygon
        const center = this.getPolygonCenter(zone.polygon);
        label.position.set(center.x, center.y);
        label.alpha = 0.5;
        zoneGraphic.addChild(label);
      }

      this.renderer.getLayer('background').addChild(zoneGraphic);
    }
  }

  /** Draw rocky terrain details */
  private drawRockyDetails(graphics: Graphics, polygon: Vector2D[]): void {
    const bounds = this.getPolygonBounds(polygon);
    const rockCount = 15;

    for (let i = 0; i < rockCount; i++) {
      const x = bounds.minX + Math.random() * (bounds.maxX - bounds.minX);
      const y = bounds.minY + Math.random() * (bounds.maxY - bounds.minY);
      const size = 3 + Math.random() * 5;

      // Small irregular rock shapes
      graphics.ellipse(x, y, size, size * 0.7);
      graphics.fill({ color: TERRAIN_PALETTE.rocky, alpha: 0.2 + Math.random() * 0.1 });
    }
  }

  /** Draw diagonal hatching to suggest a dug-out trench (Khandaq).
   *  Strokes diagonal lines across the polygon's bounding box and fills the
   *  whole zone darker so the trench reads as a barrier from any zoom level. */
  private drawTrenchHatching(graphics: Graphics, polygon: Vector2D[]): void {
    const bounds = this.getPolygonBounds(polygon);
    const spacing = 14;
    const startX = bounds.minX - (bounds.maxY - bounds.minY);
    const endX = bounds.maxX;
    for (let x = startX; x < endX; x += spacing) {
      graphics.moveTo(x, bounds.minY);
      graphics.lineTo(x + (bounds.maxY - bounds.minY), bounds.maxY);
    }
    graphics.stroke({ color: 0x6b4f1f, width: 1, alpha: 0.45 });
  }

  /** Draw wavy dune lines */
  private drawDuneLines(graphics: Graphics, polygon: Vector2D[]): void {
    const bounds = this.getPolygonBounds(polygon);
    const lineCount = 4;

    for (let i = 0; i < lineCount; i++) {
      const y = bounds.minY + (i + 1) * (bounds.maxY - bounds.minY) / (lineCount + 1);
      const startX = bounds.minX + 50;
      const endX = bounds.maxX - 50;

      graphics.moveTo(startX, y);
      // Wavy line using quadratic curves
      const segments = 6;
      for (let s = 0; s < segments; s++) {
        const t = (s + 1) / segments;
        const cx = startX + (endX - startX) * (t - 0.5 / segments);
        const cy = y + (s % 2 === 0 ? -8 : 8);
        const ex = startX + (endX - startX) * t;
        graphics.quadraticCurveTo(cx, cy, ex, y);
      }
      graphics.stroke({ color: TERRAIN_PALETTE.dune, width: 1, alpha: 0.3 });
    }
  }

  /** Draw grid lines for scale reference */
  private drawGrid(width: number, height: number): void {
    const grid = new Graphics();
    grid.label = 'grid';

    const spacing = 200;

    // Vertical lines
    for (let x = spacing; x < width; x += spacing) {
      grid.moveTo(x, 0);
      grid.lineTo(x, height);
    }

    // Horizontal lines
    for (let y = spacing; y < height; y += spacing) {
      grid.moveTo(0, y);
      grid.lineTo(width, y);
    }

    grid.stroke({ color: TERRAIN_PALETTE.grid, width: 0.5, alpha: 0.12 });

    this.renderer.getLayer('tactical').addChild(grid);
  }

  /** Draw landmarks (wells, camps, hills) */
  private drawLandmarks(landmarks: Landmark[]): void {
    for (const landmark of landmarks) {
      const container = new Container();
      container.label = `landmark-${landmark.id}`;
      container.position.set(landmark.position.x, landmark.position.y);

      const icon = new Graphics();
      icon.label = 'icon';

      switch (landmark.type) {
        case 'well':
          // Blue circle with inner ring — high contrast
          icon.circle(0, 0, 8);
          icon.fill({ color: 0xFFFFFF, alpha: 0.85 });
          icon.circle(0, 0, 4);
          icon.fill({ color: 0x1565C0, alpha: 0.9 });
          icon.circle(0, 0, 8);
          icon.stroke({ color: 0x1A237E, width: 1.5, alpha: 0.9 });
          break;

        case 'camp':
          // Small tent shape (triangle) — white fill with dark outline
          icon.moveTo(0, -8);
          icon.lineTo(8, 4);
          icon.lineTo(-8, 4);
          icon.closePath();
          icon.fill({ color: 0xFFFFFF, alpha: 0.9 });
          icon.moveTo(0, -8);
          icon.lineTo(8, 4);
          icon.lineTo(-8, 4);
          icon.closePath();
          icon.stroke({ color: 0x2D2D2D, width: 1.5, alpha: 0.95 });
          break;

        case 'hill':
          // Contour-like curved lines — dark with high visibility
          icon.arc(0, 4, 12, Math.PI, 0);
          icon.stroke({ color: 0x2D2D2D, width: 2, alpha: 0.85 });
          icon.arc(0, 6, 16, Math.PI * 0.9, Math.PI * 0.1);
          icon.stroke({ color: 0x2D2D2D, width: 1.5, alpha: 0.7 });
          break;

        default:
          // Generic marker — white with dark outline
          icon.circle(0, 0, 5);
          icon.fill({ color: 0xFFFFFF, alpha: 0.85 });
          icon.circle(0, 0, 5);
          icon.stroke({ color: 0x2D2D2D, width: 1.5, alpha: 0.9 });
          break;
      }

      container.addChild(icon);

      // Label background pill for readability (Arabic preferred)
      const labelText = landmark.labelAr ?? landmark.label;
      const labelStyle = new TextStyle({
        fontSize: 11,
        fill: 0xFFFFFF,
        fontFamily: "'Noto Sans Arabic', 'Segoe UI', 'Tahoma', Arial, sans-serif",
        fontWeight: 'bold',
        dropShadow: {
          alpha: 0.8,
          angle: Math.PI / 4,
          blur: 2,
          color: 0x000000,
          distance: 1,
        },
      });
      const label = new Text({
        text: labelText,
        style: labelStyle,
      });
      label.anchor.set(0.5, 0);
      label.position.set(0, 14);
      label.alpha = 1;

      // Semi-transparent dark background behind label text
      const labelBg = new Graphics();
      labelBg.label = 'labelBg';
      const padding = 4;
      const textWidth = label.width || (labelText.length * 6);
      const textHeight = label.height || 12;
      labelBg.roundRect(
        -textWidth / 2 - padding,
        14 - 1,
        textWidth + padding * 2,
        textHeight + padding,
        4
      );
      labelBg.fill({ color: 0x1A1A1A, alpha: 0.65 });

      container.addChild(labelBg);
      container.addChild(label);

      this.renderer.getLayer('tactical').addChild(container);
    }
  }

  /** Draw compass rose in the top-right corner */
  private drawCompassRose(width: number, _height: number): void {
    const compass = new Container();
    compass.label = 'compass';
    compass.position.set(width - 60, 60);

    const g = new Graphics();
    g.label = 'compassGraphic';

    const size = 20;

    // North arrow (pointed)
    g.moveTo(0, -size);
    g.lineTo(4, -4);
    g.lineTo(-4, -4);
    g.closePath();
    g.fill({ color: 0xcc4444, alpha: 0.7 });

    // South arrow
    g.moveTo(0, size);
    g.lineTo(4, 4);
    g.lineTo(-4, 4);
    g.closePath();
    g.fill({ color: 0xaaaaaa, alpha: 0.4 });

    // East arrow
    g.moveTo(size, 0);
    g.lineTo(4, 4);
    g.lineTo(4, -4);
    g.closePath();
    g.fill({ color: 0xaaaaaa, alpha: 0.4 });

    // West arrow
    g.moveTo(-size, 0);
    g.lineTo(-4, 4);
    g.lineTo(-4, -4);
    g.closePath();
    g.fill({ color: 0xaaaaaa, alpha: 0.4 });

    // Center dot
    g.circle(0, 0, 2);
    g.fill({ color: 0xffffff, alpha: 0.5 });

    compass.addChild(g);

    // "N" label
    const nStyle = new TextStyle({
      fontSize: 10,
      fill: 0xcc4444,
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'bold',
    });
    const nLabel = new Text({ text: 'N', style: nStyle });
    nLabel.anchor.set(0.5, 1);
    nLabel.position.set(0, -size - 4);
    nLabel.alpha = 0.7;
    compass.addChild(nLabel);

    this.renderer.getLayer('ui').addChild(compass);
  }

  // ─── UTILITY ───────────────────────────────────────────────────────────────

  /** Get center point of a polygon */
  private getPolygonCenter(polygon: Vector2D[]): Vector2D {
    let cx = 0;
    let cy = 0;
    for (const p of polygon) {
      cx += p.x;
      cy += p.y;
    }
    return { x: cx / polygon.length, y: cy / polygon.length };
  }

  /** Get bounding box of a polygon */
  private getPolygonBounds(polygon: Vector2D[]): {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  } {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const p of polygon) {
      if (p.x < minX) minX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.x > maxX) maxX = p.x;
      if (p.y > maxY) maxY = p.y;
    }
    return { minX, minY, maxX, maxY };
  }
}

// ============================================================
// SYSTEM FACTORY
// ============================================================

/**
 * Create and register all systems with the engine.
 * Returns references to systems for external access.
 */
export interface SystemRefs {
  movement: MovementSystem;
  render: RenderSystem;
  terrain: TerrainRenderer;
}

export function createSystems(
  entityManager: EntityManager,
  renderer: PixiRenderer,
  eventBus: EventBus
): SystemRefs {
  const movement = new MovementSystem(entityManager, eventBus);
  const render = new RenderSystem(entityManager, renderer, eventBus);
  const terrain = new TerrainRenderer(renderer);

  return { movement, render, terrain };
}
