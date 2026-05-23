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
import type { Faction, TroopType } from '../types/components';
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

    // Calculate formation slots
    const formationResult = calculateFormation({
      type: config.startFormation,
      unitCount: Math.min(Math.floor(config.soldierCount / 20), 10),
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
   * Calculate visual size based on soldier count.
   * More soldiers = larger token (12-30px radius range).
   */
  private calculateVisualSize(soldierCount: number, troopType: TroopType): number {
    // Map soldierCount from range [20, 200] to radius [12, 28]
    const clamped = Math.max(20, Math.min(200, soldierCount));
    const t = (clamped - 20) / (200 - 20); // normalize to 0-1
    let radius = 12 + t * (28 - 12);

    // Cavalry gets +3 bonus
    if (troopType === 'cavalry' || troopType === 'camel_riders') {
      radius += 3;
    }

    // Clamp to [10, 30]
    return Math.max(10, Math.min(30, radius));
  }

  /**
   * Get base tint color for a faction.
   */
  private getFactionTint(faction: Faction): number {
    switch (faction) {
      case 'muslim':
        return 0x2D5016; // green
      case 'quraysh':
        return 0x8B1A1A; // red/brown
      case 'neutral':
        return 0x6B6B6B; // gray
      default:
        return 0x6B6B6B;
    }
  }

  /**
   * Calculate base speed for a troop type.
   */
  private getBaseSpeed(troopType: TroopType, speedStat: number): number {
    const baseSpeeds: Record<TroopType, number> = {
      infantry: 60,
      cavalry: 120,
      archers: 50,
      camel_riders: 100,
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

        // Accumulate strengths and morale
        if (unit.faction === 'muslim') {
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
import { battleOfAinJalut } from './ain-jalut';

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
  'battle-of-ain-jalut': battleOfAinJalut,
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

export { battleOfBadr, battleOfUhud, battleOfKhandaq, battleOfKhaybar, conquestOfMecca, battleOfHunayn, battleOfYarmouk, battleOfQadisiyyah, battleOfMutah, expeditionOfTabuk, battleOfAinJalut };
