# 05 — Battle Scripting

## Overview

Battles are **data-driven**. Each battle is described as a scenario configuration file — NOT coded procedurally. The scripting system reads these configs and executes events at the correct timestamps during replay.

---

## 5.1 — Scenario File Structure

Each scenario is a TypeScript file exporting a `BattleScenario` object:

```typescript
// src/battlefield/scenarios/badr.scenario.ts

import type { BattleScenario } from '../scripting/types';

export const badrScenario: BattleScenario = {
  id: 'badr',
  metadata: { /* ... */ },
  terrain: { /* ... */ },
  factions: [ /* ... */ ],
  deployment: { /* ... */ },
  phases: [ /* ... */ ],
  events: [ /* ... */ ],
  narration: [ /* ... */ ],
  cameraCues: [ /* ... */ ],
};
```

---

## 5.2 — Complete Scenario Example (Battle of Badr)

```typescript
export const badrScenario: BattleScenario = {
  id: 'badr',
  
  metadata: {
    name: 'Battle of Badr',
    nameAr: 'غزوة بدر',
    date: '624 CE',
    dateAr: '١٧ رمضان ٢ هـ',
    hijriYear: 2,
    location: 'Badr, Hejaz',
    locationAr: 'بدر، الحجاز',
    description: 'The first major battle between Muslims and Quraysh.',
    descriptionAr: 'أول معركة كبرى بين المسلمين وقريش.',
    outcome: 'muslim_victory',
    significance: 'Decisive victory establishing Muslim military credibility.',
    significanceAr: 'نصر حاسم أثبت القدرة العسكرية للمسلمين.',
    totalDuration: 180, // 3 minutes of replay
  },

  terrain: {
    type: 'desert',
    width: 2000,
    height: 1200,
    features: [
      {
        id: 'hill_north',
        type: 'hill',
        position: { x: 300, y: 200 },
        size: { x: 200, y: 120 },
        label: 'Northern Hill',
        labelAr: 'التل الشمالي',
        blocksMovement: false,
        providesDefenseBonus: 15,
      },
      {
        id: 'wells_badr',
        type: 'oasis',
        position: { x: 900, y: 600 },
        size: { x: 100, y: 80 },
        label: 'Wells of Badr',
        labelAr: 'آبار بدر',
        blocksMovement: false,
        providesDefenseBonus: 0,
      },
    ],
    backgroundTexture: 'terrain_desert_01',
    ambientColor: '#F5E6D3',
  },

  factions: [
    {
      id: 'muslims',
      name: 'Muslim Army',
      nameAr: 'جيش المسلمين',
      team: 'muslim',
      color: '#1B4332',
      secondaryColor: '#15803D',
      commander: {
        name: 'Prophet Muhammad ﷺ',
        nameAr: 'النبي محمد ﷺ',
        commandRadius: 300,
        moraleBoost: 30,
        position: { x: 1400, y: 600 },
      },
      units: [
        {
          id: 'muslim_infantry_1',
          label: 'Muhajirun Infantry',
          labelAr: 'مشاة المهاجرين',
          type: 'infantry',
          soldierCount: 80,
          position: { x: 1300, y: 500 },
          facing: Math.PI,
          formation: 'crescent',
          stats: { health: 100, attack: 12, defense: 8, speed: 40, morale: 90, range: 30, chargeBonus: 0 },
        },
        {
          id: 'muslim_infantry_2',
          label: 'Ansar Infantry',
          labelAr: 'مشاة الأنصار',
          type: 'infantry',
          soldierCount: 170,
          position: { x: 1300, y: 700 },
          facing: Math.PI,
          formation: 'line',
          stats: { health: 100, attack: 10, defense: 10, speed: 38, morale: 85, range: 30, chargeBonus: 0 },
        },
        {
          id: 'muslim_cavalry_1',
          label: 'Muslim Cavalry',
          labelAr: 'فرسان المسلمين',
          type: 'cavalry',
          soldierCount: 30,
          position: { x: 1400, y: 400 },
          facing: Math.PI,
          formation: 'wedge',
          stats: { health: 80, attack: 18, defense: 5, speed: 80, morale: 85, range: 30, chargeBonus: 25 },
        },
      ],
    },
    {
      id: 'quraysh',
      name: 'Quraysh Army',
      nameAr: 'جيش قريش',
      team: 'opponent',
      color: '#7C2D12',
      secondaryColor: '#9A3412',
      commander: {
        name: 'Abu Jahl',
        nameAr: 'أبو جهل',
        commandRadius: 250,
        moraleBoost: 15,
        position: { x: 500, y: 600 },
      },
      units: [
        {
          id: 'quraysh_infantry_1',
          label: 'Quraysh Infantry',
          labelAr: 'مشاة قريش',
          type: 'infantry',
          soldierCount: 400,
          position: { x: 600, y: 500 },
          facing: 0,
          formation: 'line',
          stats: { health: 100, attack: 10, defense: 7, speed: 35, morale: 70, range: 30, chargeBonus: 0 },
        },
        {
          id: 'quraysh_cavalry_1',
          label: 'Quraysh Cavalry',
          labelAr: 'فرسان قريش',
          type: 'cavalry',
          soldierCount: 200,
          position: { x: 500, y: 300 },
          facing: 0,
          formation: 'line',
          stats: { health: 80, attack: 15, defense: 5, speed: 75, morale: 65, range: 30, chargeBonus: 20 },
        },
        {
          id: 'quraysh_archers_1',
          label: 'Quraysh Archers',
          labelAr: 'رماة قريش',
          type: 'archer',
          soldierCount: 100,
          position: { x: 600, y: 750 },
          facing: 0,
          formation: 'line',
          stats: { health: 60, attack: 14, defense: 3, speed: 30, morale: 60, range: 200, chargeBonus: 0 },
        },
      ],
    },
  ],

  deployment: {
    duration: 10,
    muslimZone: { x: 1100, y: 200, width: 600, height: 800 },
    opponentZone: { x: 300, y: 200, width: 600, height: 800 },
  },

  phases: [
    {
      id: 'phase_deployment',
      type: 'deployment',
      name: 'Deployment',
      nameAr: 'الانتشار',
      startTime: 0,
      duration: 15,
      description: 'Both armies take their positions.',
      descriptionAr: 'يتخذ الجيشان مواقعهما.',
      triggerEvents: [],
    },
    {
      id: 'phase_duel',
      type: 'opening_engagement',
      name: 'Champion Duels',
      nameAr: 'المبارزة',
      startTime: 15,
      duration: 25,
      description: 'Champions from both sides engage in single combat.',
      descriptionAr: 'يتبارز أبطال من الجانبين.',
      triggerEvents: ['event_duel_start'],
    },
    {
      id: 'phase_advance',
      type: 'main_clash',
      name: 'General Advance',
      nameAr: 'الهجوم العام',
      startTime: 40,
      duration: 60,
      description: 'The Muslim army advances in crescent formation.',
      descriptionAr: 'يتقدم جيش المسلمين بتشكيل الهلال.',
      triggerEvents: ['event_muslim_advance'],
    },
    {
      id: 'phase_rout',
      type: 'retreat',
      name: 'Quraysh Rout',
      nameAr: 'انهزام قريش',
      startTime: 100,
      duration: 40,
      description: 'Quraysh morale collapses and they flee.',
      descriptionAr: 'تنهار معنويات قريش ويفرون.',
      triggerEvents: ['event_quraysh_rout'],
    },
    {
      id: 'phase_victory',
      type: 'victory',
      name: 'Victory',
      nameAr: 'النصر',
      startTime: 140,
      duration: 40,
      description: 'The Muslims achieve a decisive victory.',
      descriptionAr: 'يحقق المسلمون نصرًا حاسمًا.',
      triggerEvents: ['event_victory'],
    },
  ],

  events: [
    {
      id: 'event_muslim_advance',
      type: 'move_unit',
      timestamp: 40,
      target: 'muslim_infantry_1',
      params: { type: 'move_unit', destination: { x: 900, y: 500 }, speed: 40 },
    },
    {
      id: 'event_cavalry_charge',
      type: 'trigger_charge',
      timestamp: 60,
      target: 'muslim_cavalry_1',
      params: { type: 'trigger_charge', targetEntityId: 'quraysh_cavalry_1', speedMultiplier: 2.0 },
    },
    {
      id: 'event_arrow_volley',
      type: 'arrow_volley',
      timestamp: 45,
      target: 'quraysh_archers_1',
      params: { type: 'arrow_volley', sourceUnitId: 'quraysh_archers_1', targetArea: { x: 1000, y: 550 }, arrowCount: 30, damage: 8, duration: 2 },
    },
    {
      id: 'event_quraysh_rout',
      type: 'morale_break',
      timestamp: 100,
      target: 'quraysh_infantry_1',
      params: { type: 'morale_break', severity: 80 },
    },
  ],

  narration: [
    {
      id: 'narr_intro',
      timestamp: 0,
      duration: 8,
      text: 'On the 17th of Ramadan, 2 AH, the Muslim army of 313 faced the Quraysh force of over 1000 at the wells of Badr.',
      textAr: 'في ١٧ رمضان سنة ٢ هـ، واجه جيش المسلمين البالغ ٣١٣ مقاتلًا جيش قريش الذي يفوق ١٠٠٠ عند آبار بدر.',
      position: 'bottom',
      style: 'standard',
      autoAdvance: true,
    },
    {
      id: 'narr_charge',
      timestamp: 60,
      duration: 5,
      text: 'The Muslim cavalry launches a decisive charge against the Quraysh horsemen.',
      textAr: 'يشن فرسان المسلمين هجومًا حاسمًا على فرسان قريش.',
      position: 'bottom',
      style: 'dramatic',
      autoAdvance: true,
    },
  ],

  cameraCues: [
    { id: 'cam_overview', timestamp: 0, moveType: 'overview', zoom: 0.6, duration: 3, easing: 'power2.inOut', hold: 5 },
    { id: 'cam_muslim_deploy', timestamp: 5, moveType: 'focus', target: { x: 1300, y: 600 }, zoom: 1.0, duration: 2, easing: 'power2.inOut' },
    { id: 'cam_charge', timestamp: 58, moveType: 'follow', entityId: 'muslim_cavalry_1', zoom: 1.5, duration: 1, easing: 'power3.inOut' },
    { id: 'cam_final_overview', timestamp: 140, moveType: 'overview', zoom: 0.5, duration: 3, easing: 'power2.inOut' },
  ],
};
```

---

## 5.3 — Script Interpreter

The `ScriptInterpreter` processes events in timestamp order:

```typescript
// src/battlefield/scripting/ScriptInterpreter.ts

export class ScriptInterpreter {
  private events: ScriptedEvent[];
  private nextEventIndex: number = 0;
  private executedEvents: Set<string> = new Set();

  load(scenario: BattleScenario): void {
    // Sort events by timestamp
    this.events = [...scenario.events].sort((a, b) => a.timestamp - b.timestamp);
    this.nextEventIndex = 0;
    this.executedEvents.clear();
  }

  update(currentTime: number, world: World): void {
    // Fire all events whose timestamp has been reached
    while (
      this.nextEventIndex < this.events.length &&
      this.events[this.nextEventIndex].timestamp <= currentTime
    ) {
      const event = this.events[this.nextEventIndex];
      if (!this.executedEvents.has(event.id)) {
        this.executeEvent(event, world);
        this.executedEvents.add(event.id);
      }
      this.nextEventIndex++;
    }
  }

  seek(time: number): void {
    // Reset and replay all events up to the seek time
    this.nextEventIndex = 0;
    this.executedEvents.clear();
  }
}
```

---

## 5.4 — Event Handlers

Each event type has a dedicated handler:

```typescript
// src/battlefield/scripting/EventHandlers.ts

export const eventHandlers: Record<ScriptedEventType, EventHandler> = {
  move_unit: (event, world) => {
    const params = event.params as MoveUnitParams;
    const entityId = world.resolveEntityId(event.target);
    const path = world.get<PathComponent>(entityId, 'Path');
    if (path) {
      path.waypoints = params.waypoints || [params.destination];
      path.currentWaypointIndex = 0;
      path.isComplete = false;
      path.speed = params.speed || 40;
    }
  },
  
  trigger_charge: (event, world) => {
    const params = event.params as TriggerChargeParams;
    const entityId = world.resolveEntityId(event.target);
    const vel = world.get<VelocityComponent>(entityId, 'Velocity');
    const combat = world.get<CombatStatsComponent>(entityId, 'CombatStats');
    if (vel) vel.maxSpeed *= params.speedMultiplier;
    if (combat) combat.isEngaged = true;
  },
  
  // ... handlers for each event type
};
```

---

## 5.5 — Scenario Authoring Guide

To add a new battle:

1. Create `src/battlefield/scenarios/{battle_name}.scenario.ts`
2. Export a `BattleScenario` object following the interface
3. Define terrain, factions, units with positions
4. Script the battle phases with timestamps
5. Add scripted events for key moments
6. Add narration cues for educational content
7. Add camera cues for cinematic presentation
8. Register in scenario index

**Key rules:**
- All timestamps are in seconds from replay start
- Events MUST be ordered by timestamp
- Unit IDs must be unique within the scenario
- Camera cues should align with dramatic moments
- Narration should not overlap (check durations)
