/**
 * ScenarioLoader - converts a BattleScenario config into live entities.
 *
 * Responsibilities:
 * - Parse ForceConfig and UnitConfig from scenario
 * - Create entities with appropriate components for each unit
 * - Set initial positions, formations, stats
 * - Calculate initial formation slot positions
 * - Update simulation store with initial state
 */

import type { BattleScenario, ForceConfig, UnitConfig } from '../types/scenario';
import type { EntityTemplate } from '../types/entities';
import { isMuslimSide, type Faction, type TroopType } from '../types/components';
import { EntityManager } from '../entities';
import { EventBus } from '../core/EventBus';
import { calculateFormation } from '../formations';
import { useSimulationStore, type UnitSnapshot } from '../state/simulationStore';

export class ScenarioLoader {
  private entityManager: EntityManager;
  private eventBus: EventBus;

  constructor(entityManager: EntityManager, eventBus: EventBus) {
    this.entityManager = entityManager;
    this.eventBus = eventBus;
  }

  /**
   * Load a scenario - creates all unit entities from the config.
   * Returns the IDs of all created entities.
   */
  load(scenario: BattleScenario): string[] {
    // Clear any existing entities
    this.unload();

    // Create entities for each force
    const allIds: string[] = [];
    for (const force of scenario.forces) {
      const ids = this.loadForce(force);
      allIds.push(...ids);
    }

    // Sync initial state to the simulation store
    this.syncInitialState(scenario);

    return allIds;
  }

  /**
   * Create entities for a single force (faction).
   */
  private loadForce(force: ForceConfig): string[] {
    const ids: string[] = [];
    for (const unit of force.units) {
      const id = this.createUnit(unit, force.faction);
      ids.push(id);
    }
    return ids;
  }

  /**
   * Create a single unit entity from UnitConfig.
   */
  private createUnit(config: UnitConfig, faction: Faction): string {
    const template = this.buildUnitTemplate(config, faction);
    this.entityManager.createWithId(config.id, template, 0);
    return config.id;
  }

  /**
   * Build the EntityTemplate for a unit.
   */
  private buildUnitTemplate(config: UnitConfig, faction: Faction): EntityTemplate {
    const baseSpeed = this.getBaseSpeed(config.troopType, config.stats.speed);
    const visualSize = this.calculateVisualSize(config.soldierCount, config.troopType);
    const factionTint = this.getFactionTint(faction);

    // Formation slot count: log-scaled so a 200-soldier unit and a 200,000-
    // soldier unit don't render with the same number of slots. Clamps between
    // 3 (tiny detachment) and 48 (massive army).
    const slotCount = Math.max(
      3,
      Math.min(48, Math.round(Math.log10(Math.max(10, config.soldierCount)) * 8))
    );
    const formationResult = calculateFormation({
      type: config.startFormation,
      unitCount: slotCount,
      spacing: 15,
      facing: config.startFacing,
    });

    return {
      name: config.name,
      tags: ['unit', faction, config.troopType],
      components: {
        transform: {
          position: { x: config.startPosition.x, y: config.startPosition.y },
          rotation: config.startFacing,
          scale: { x: 1, y: 1 },
        },
        movement: {
          velocity: { x: 0, y: 0 },
          maxSpeed: baseSpeed,
          currentSpeed: baseSpeed,
          targetPosition: null,
          path: [],
          arrived: true,
        },
        formation: {
          type: config.startFormation,
          spacing: 15,
          facing: config.startFacing,
          slots: formationResult.rotatedSlots,
          cohesion: 1.0,
        },
        combat: {
          health: 100,
          maxHealth: 100,
          attack: config.stats.attack * 10,
          defense: config.stats.defense * 10,
          morale: config.stats.morale * 10,
          isEngaged: false,
          targetEntityId: null,
          lastAttackTime: 0,
          attackCooldown: 2000,
        },
        unit: {
          troopType: config.troopType,
          faction,
          soldierCount: config.soldierCount,
          maxSoldiers: config.soldierCount,
          commanderName: config.commander,
          label: config.name,
          labelAr: config.nameAr,
        },
        visual: {
          state: 'idle',
          tint: factionTint,
          alpha: 1,
          size: visualSize,
          banner: !!config.commander,
          highlighted: false,
        },
        selectable: {
          selected: false,
          hoverable: true,
          tooltipText: `${config.name} (${config.soldierCount} soldiers)`,
        },
        behavior: {
          currentState: 'holding',
          scriptedActions: [],
          currentActionIndex: 0,
          waitUntil: 0,
        },
      },
    };
  }

  /**
   * Calculate visual size based on soldier count, log-scaled across the full
   * range from a 100-man detachment to a 200,000-strong Byzantine army.
   * Uses log10 so each order-of-magnitude increase adds a roughly equal step.
   */
  private calculateVisualSize(soldierCount: number, troopType: TroopType): number {
    const safeCount = Math.max(10, soldierCount);
    // log10(10) = 1 → small; log10(200,000) ≈ 5.3 → large.
    const logScale = (Math.log10(safeCount) - 1) / (5.3 - 1); // normalize to ~[0, 1]
    let radius = 10 + Math.max(0, Math.min(1, logScale)) * 24; // → [10, 34]

    // Mounted units read slightly larger; elephants distinctly so.
    if (
      troopType === 'cavalry' ||
      troopType === 'heavy_cavalry' ||
      troopType === 'horse_archer' ||
      troopType === 'camel_riders'
    ) {
      radius += 3;
    } else if (troopType === 'elephant') {
      radius += 6; // war elephants dwarf everything else
    }

    return Math.max(10, Math.min(44, radius));
  }

  /**
   * Get base tint color for a faction. Using a Record<Faction, number> means
   * TypeScript will flag any new faction added to the union that isn't tinted
   * here — no silent fallback to gray.
   */
  private getFactionTint(faction: Faction): number {
    const tints: Record<Faction, number> = {
      muslim: 0x2D5016,        // dark green — Prophetic / Rashidun banner
      mamluk: 0xD4AF37,        // gold — Mamluk Sultanate (Ain Jalut)
      quraysh: 0x8B1A1A,       // red — pre-Islamic Mecca
      jewish_tribes: 0x6B4F8B, // muted purple — Khaybar tribes
      hawazin: 0xB8860B,       // dark goldenrod — Hawazin/Thaqif (Hunayn)
      banu_hanifa: 0x8a4f1a,   // rusty ochre — Banu Hanifa of al-Yamamah
      byzantine: 0x6B0F12,     // imperial purple-red — Eastern Rome
      sasanian: 0x5D2E8C,      // royal purple — Sasanian Persia
      mongol: 0x4B5320,        // olive — Ilkhanate
      neutral: 0x6B6B6B,       // gray — civilians, terrain entities
    };
    return tints[faction] ?? 0x6B6B6B;
  }

  /**
   * Calculate base speed for a troop type.
   */
  private getBaseSpeed(troopType: TroopType, speedStat: number): number {
    const baseSpeeds: Record<TroopType, number> = {
      infantry: 60,
      cavalry: 120,
      heavy_cavalry: 95,    // Sasanian Savaran, Byzantine cataphracts — slower than light cav
      horse_archer: 130,    // Mongol/Steppe — fastest, hit-and-run
      archers: 50,
      camel_riders: 100,
      elephant: 35,         // Qadisiyyah war elephants — slow, terrifying
      siege_engineer: 30,   // Khaybar/fortress assault — slowest
      reserves: 55,
      command: 70,
    };

    const base = baseSpeeds[troopType] ?? 60;
    // Multiply by (speedStat / 5) to scale by stat (stat is 1-10, so /5 gives 0.2-2.0 multiplier)
    return base * (speedStat / 5);
  }

  /**
   * Update simulation store with initial unit snapshots.
   */
  private syncInitialState(scenario: BattleScenario): void {
    const store = useSimulationStore.getState();

    // Set scenario info
    store.setScenario(scenario.id, scenario.name);

    // Build unit snapshots from all entities
    const snapshots: UnitSnapshot[] = [];
    let muslimStrength = 0;
    let enemyStrength = 0;
    let muslimMoraleTotal = 0;
    let muslimUnitCount = 0;
    let enemyMoraleTotal = 0;
    let enemyUnitCount = 0;

    for (const force of scenario.forces) {
      for (const unitConfig of force.units) {
        const entity = this.entityManager.get(unitConfig.id);
        if (!entity) continue;

        const combat = entity.components.combat;
        const unit = entity.components.unit;
        const transform = entity.components.transform;

        if (!combat || !unit || !transform) continue;

        snapshots.push({
          id: entity.id,
          name: unit.label,
          faction: unit.faction,
          health: combat.health,
          morale: combat.morale,
          soldierCount: unit.soldierCount,
          maxSoldiers: unit.maxSoldiers,
          isEngaged: combat.isEngaged,
          isRouted: false,
          positionX: transform.position.x,
          positionY: transform.position.y,
        });

        // Accumulate strengths and morale (Mamluks count as the muslim side)
        if (isMuslimSide(unit.faction)) {
          muslimStrength += unit.soldierCount;
          muslimMoraleTotal += combat.morale;
          muslimUnitCount++;
        } else {
          enemyStrength += unit.soldierCount;
          enemyMoraleTotal += combat.morale;
          enemyUnitCount++;
        }
      }
    }

    // Update store
    store.updateUnits(snapshots);
    store.updateStrengths(muslimStrength, enemyStrength);
    store.updateMorale(
      muslimUnitCount > 0 ? muslimMoraleTotal / muslimUnitCount : 100,
      enemyUnitCount > 0 ? enemyMoraleTotal / enemyUnitCount : 100
    );
  }

  /**
   * Unload all entities (for scenario switch).
   */
  unload(): void {
    this.entityManager.clear();
    useSimulationStore.getState().reset();
  }
}

// ─── Scenario Registry ─────────────────────────────────────────────────────────

// Import and re-export the scenarios
import { battleOfBadr } from './badr';
import { battleOfUhud } from './uhud';
import { battleOfKhandaq } from './khandaq';
import { battleOfKhaybar } from './khaybar';
import { conquestOfMecca } from './fath-makkah';
import { battleOfHunayn } from './hunayn';
import { battleOfYarmouk } from './yarmouk';
import { battleOfQadisiyyah } from './qadisiyyah';
import { battleOfMutah } from './mutah';
import { expeditionOfTabuk } from './tabuk';
import { battleOfYamama } from './yamama';
import { battleOfNahavand } from './nahavand';

// Scenario registry
export const scenarios: Record<string, BattleScenario> = {
  'battle-of-badr': battleOfBadr,
  'battle-of-uhud': battleOfUhud,
  'battle-of-khandaq': battleOfKhandaq,
  'battle-of-khaybar': battleOfKhaybar,
  'conquest-of-mecca': conquestOfMecca,
  'battle-of-hunayn': battleOfHunayn,
  'battle-of-yarmouk': battleOfYarmouk,
  'battle-of-qadisiyyah': battleOfQadisiyyah,
  'battle-of-mutah': battleOfMutah,
  'battle-of-tabuk': expeditionOfTabuk,
  'battle-of-yamama': battleOfYamama,
  'battle-of-nahavand': battleOfNahavand,
};

// Get available scenario IDs
export function getAvailableScenarios(): Array<{ id: string; name: string; nameAr: string }> {
  return Object.values(scenarios).map(s => ({
    id: s.id,
    name: s.name,
    nameAr: s.nameAr,
  }));
}

// Get a scenario by ID
export function getScenario(id: string): BattleScenario | undefined {
  return scenarios[id];
}

export { battleOfBadr, battleOfUhud, battleOfKhandaq, battleOfKhaybar, conquestOfMecca, battleOfHunayn, battleOfYarmouk, battleOfQadisiyyah, battleOfMutah, expeditionOfTabuk, battleOfYamama, battleOfNahavand };
