/**
 * Formation Calculator - computes relative slot positions for unit formations.
 *
 * Each formation type arranges N slots in a specific pattern.
 * Positions are RELATIVE to the formation center (0,0) and facing direction.
 * The caller rotates these positions based on the formation's facing angle.
 */

import type { Vector2D, FormationType } from '../types/components';

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface FormationConfig {
  type: FormationType;
  unitCount: number; // number of sub-unit slots
  spacing: number; // pixels between slots
  facing: number; // radians - direction formation faces (used for rotation)
}

export interface FormationResult {
  slots: Vector2D[]; // relative positions (before rotation)
  rotatedSlots: Vector2D[]; // positions rotated by facing angle
  width: number; // bounding width
  depth: number; // bounding depth
}

// ─── Main Entry Point ────────────────────────────────────────────────────────

/**
 * Calculate formation slot positions.
 * Returns both raw (facing=0, facing right) and rotated positions.
 */
export function calculateFormation(config: FormationConfig): FormationResult {
  const { type, unitCount, spacing, facing } = config;

  if (unitCount <= 0) {
    return { slots: [], rotatedSlots: [], width: 0, depth: 0 };
  }

  let slots: Vector2D[];

  switch (type) {
    case 'line':
      slots = calculateLineFormation(unitCount, spacing);
      break;
    case 'wedge':
      slots = calculateWedgeFormation(unitCount, spacing);
      break;
    case 'defensive_circle':
      slots = calculateCircleFormation(unitCount, spacing);
      break;
    case 'column':
      slots = calculateColumnFormation(unitCount, spacing);
      break;
    case 'flank_left':
      slots = calculateFlankLeftFormation(unitCount, spacing);
      break;
    case 'flank_right':
      slots = calculateFlankRightFormation(unitCount, spacing);
      break;
    case 'crescent':
      slots = calculateCrescentFormation(unitCount, spacing);
      break;
    case 'scattered':
      slots = calculateScatteredFormation(unitCount, spacing);
      break;
    default:
      slots = calculateLineFormation(unitCount, spacing);
      break;
  }

  const rotatedSlots = rotatePositions(slots, facing);
  const bounds = getFormationBounds(rotatedSlots);

  return {
    slots,
    rotatedSlots,
    width: bounds.width,
    depth: bounds.depth,
  };
}

// ─── Formation Calculators ───────────────────────────────────────────────────

/**
 * Calculate slots for LINE formation.
 * Units arranged in a straight line perpendicular to facing direction.
 * Best for: broad front attacks, holding a line
 *
 *   x x x x x x x
 *       (facing →)
 */
export function calculateLineFormation(count: number, spacing: number): Vector2D[] {
  const slots: Vector2D[] = [];

  for (let i = 0; i < count; i++) {
    slots.push({
      x: 0,
      y: (i - (count - 1) / 2) * spacing,
    });
  }

  return slots;
}

/**
 * Calculate slots for WEDGE formation.
 * V-shaped formation pointing in facing direction.
 * Best for: cavalry charges, breaking enemy lines
 *
 *         x
 *       x   x
 *     x       x
 *   x           x
 *       (facing →)
 */
export function calculateWedgeFormation(count: number, spacing: number): Vector2D[] {
  const slots: Vector2D[] = [];

  // First unit at the tip (front)
  slots.push({ x: 0, y: 0 });

  // Subsequent units alternate left/right, each row further back
  for (let i = 1; i < count; i++) {
    const row = Math.ceil(i / 2);
    const side = i % 2 === 1 ? 1 : -1; // odd = right, even = left

    slots.push({
      x: -row * spacing * 0.7, // each row further back
      y: side * row * spacing * 0.7, // spread outward
    });
  }

  return slots;
}

/**
 * Calculate slots for DEFENSIVE_CIRCLE formation.
 * Units arranged in a circle facing outward.
 * Best for: last stand, surrounded defense
 *
 *     x x x
 *   x       x
 *   x       x
 *     x x x
 */
export function calculateCircleFormation(count: number, spacing: number): Vector2D[] {
  const slots: Vector2D[] = [];

  if (count === 1) {
    return [{ x: 0, y: 0 }];
  }

  // Radius based on count and spacing so units are spaced evenly
  const radius = (count * spacing) / (2 * Math.PI);

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * 2 * Math.PI;
    slots.push({
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle),
    });
  }

  return slots;
}

/**
 * Calculate slots for COLUMN formation.
 * Units in a line along the facing direction (marching column).
 * Best for: movement, marching
 *
 *   x
 *   x
 *   x
 *   x
 *   (facing →)
 */
export function calculateColumnFormation(count: number, spacing: number): Vector2D[] {
  const slots: Vector2D[] = [];

  for (let i = 0; i < count; i++) {
    slots.push({
      x: -i * spacing, // first unit at front, rest trail behind
      y: 0,
    });
  }

  return slots;
}

/**
 * Calculate slots for FLANK_LEFT formation.
 * Angled line extending to the left of facing direction.
 * Best for: flanking maneuvers
 */
export function calculateFlankLeftFormation(count: number, spacing: number): Vector2D[] {
  const slots: Vector2D[] = [];
  const angle45 = Math.PI / 4;
  const cosA = Math.cos(angle45);
  const sinA = Math.sin(angle45);

  for (let i = 0; i < count; i++) {
    slots.push({
      x: -i * spacing * cosA,
      y: -i * spacing * sinA, // negative Y = left
    });
  }

  return slots;
}

/**
 * Calculate slots for FLANK_RIGHT formation.
 * Angled line extending to the right of facing direction.
 * Best for: flanking maneuvers
 */
export function calculateFlankRightFormation(count: number, spacing: number): Vector2D[] {
  const slots: Vector2D[] = [];
  const angle45 = Math.PI / 4;
  const cosA = Math.cos(angle45);
  const sinA = Math.sin(angle45);

  for (let i = 0; i < count; i++) {
    slots.push({
      x: -i * spacing * cosA,
      y: i * spacing * sinA, // positive Y = right
    });
  }

  return slots;
}

/**
 * Calculate slots for CRESCENT formation.
 * Arc/crescent shape (like a bow) - classic Islamic battle formation.
 * Best for: envelopment, surrounding enemy flanks
 *
 *   x           x
 *     x       x
 *       x   x
 *         x
 *       (facing →)
 */
export function calculateCrescentFormation(count: number, spacing: number): Vector2D[] {
  const slots: Vector2D[] = [];

  if (count === 1) {
    return [{ x: 0, y: 0 }];
  }

  // Arc spans ~120 degrees (2π/3 radians), centered on the facing direction
  const arcAngle = (2 * Math.PI) / 3; // 120 degrees
  const startAngle = -arcAngle / 2; // start at -60 degrees
  const radius = (count * spacing) / arcAngle; // radius to maintain spacing

  for (let i = 0; i < count; i++) {
    // Distribute evenly along the arc
    const t = count > 1 ? i / (count - 1) : 0.5;
    const angle = startAngle + t * arcAngle;

    // The crescent curves backward (negative x) at the wings
    slots.push({
      x: radius * Math.cos(angle) - radius, // shift so center is at front
      y: radius * Math.sin(angle),
    });
  }

  return slots;
}

/**
 * Calculate slots for SCATTERED formation.
 * Loose, irregular spacing (for retreating/routed units).
 * Uses deterministic pseudo-random based on index.
 */
export function calculateScatteredFormation(count: number, spacing: number): Vector2D[] {
  const slots: Vector2D[] = [];

  for (let i = 0; i < count; i++) {
    // Deterministic pseudo-random using sin-based hash
    const hashX = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
    const hashY = Math.abs(Math.sin(i * 78.233 + 1.0) * 43758.5453) % 1;

    // Spread units in a rough area, centered at origin
    const spreadRadius = spacing * Math.sqrt(count);
    slots.push({
      x: (hashX - 0.5) * spreadRadius * 2,
      y: (hashY - 0.5) * spreadRadius * 2,
    });
  }

  return slots;
}

// ─── Utility Functions ───────────────────────────────────────────────────────

/**
 * Rotate a set of positions around origin by angle (radians).
 * Uses 2D rotation matrix:
 *   x' = x*cos(a) - y*sin(a)
 *   y' = x*sin(a) + y*cos(a)
 */
export function rotatePositions(positions: Vector2D[], angle: number): Vector2D[] {
  if (angle === 0) {
    return positions.map((p) => ({ x: p.x, y: p.y }));
  }

  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  return positions.map((p) => ({
    x: p.x * cos - p.y * sin,
    y: p.x * sin + p.y * cos,
  }));
}

/**
 * Get the bounding box dimensions of a set of positions.
 */
export function getFormationBounds(positions: Vector2D[]): { width: number; depth: number } {
  if (positions.length === 0) {
    return { width: 0, depth: 0 };
  }

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const pos of positions) {
    if (pos.x < minX) minX = pos.x;
    if (pos.x > maxX) maxX = pos.x;
    if (pos.y < minY) minY = pos.y;
    if (pos.y > maxY) maxY = pos.y;
  }

  return {
    width: maxY - minY, // width is perpendicular to facing (Y-axis)
    depth: maxX - minX, // depth is along facing direction (X-axis)
  };
}
