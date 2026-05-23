# Islamic Battle Replay Engine

A cinematic, data-driven battlefield visualization system for Islamic historical battles. Built with PixiJS, Zustand, GSAP, and XState.

---

## Overview

This engine renders historical Islamic battles as **cinematic replays** — not games. Each battle is scripted as a data file describing troop positions, movements, phases, narration, and camera choreography. The engine plays these back as smooth, educational visualizations.

**Key features:**
- WebGL rendering via PixiJS (500+ entities at 60fps)
- Deterministic replay (same scenario = same visualization every time)
- Cinematic camera with GSAP-powered choreography
- Data-driven scenarios (add battles without writing engine code)
- Bilingual narration (Arabic + English)
- Respectful, educational visual style

---

## Architecture

See [`ARCHITECTURE.md`](ARCHITECTURE.md) for the complete architecture overview and links to detailed design documents in the [`docs/`](docs/) folder.

---

## How to Add a New Battle

### Step 1: Create the Scenario File

Create a new file at `src/battlefield/scenarios/{battle_name}.scenario.ts`:

```typescript
import type { BattleScenario } from '../scripting/types';

export const myBattleScenario: BattleScenario = {
  id: 'my_battle',
  metadata: {
    name: 'Battle Name',
    nameAr: 'اسم المعركة',
    date: '636 CE',
    dateAr: '١٥ هـ',
    hijriYear: 15,
    location: 'Location',
    locationAr: 'الموقع',
    description: 'Brief description.',
    descriptionAr: 'وصف مختصر.',
    outcome: 'muslim_victory',
    significance: 'Why this battle matters.',
    significanceAr: 'أهمية المعركة.',
    totalDuration: 180, // 3 minutes
  },
  terrain: { /* ... */ },
  factions: [ /* ... */ ],
  deployment: { /* ... */ },
  phases: [ /* ... */ ],
  events: [ /* ... */ ],
  narration: [ /* ... */ ],
  cameraCues: [ /* ... */ ],
};
```

### Step 2: Define Terrain

```typescript
terrain: {
  type: 'desert',        // desert | valley | oasis | coastal | plains
  width: 2000,           // world units
  height: 1200,
  features: [
    {
      id: 'hill_1',
      type: 'hill',
      position: { x: 300, y: 200 },
      size: { x: 200, y: 120 },
      blocksMovement: false,
      providesDefenseBonus: 15,
    },
  ],
  ambientColor: '#F5E6D3',
},
```

### Step 3: Define Factions and Units

```typescript
factions: [
  {
    id: 'muslims',
    name: 'Muslim Army',
    nameAr: 'جيش المسلمين',
    team: 'muslim',
    color: '#1B4332',
    secondaryColor: '#15803D',
    commander: {
      name: 'Commander Name',
      nameAr: 'اسم القائد',
      commandRadius: 300,
      moraleBoost: 25,
      position: { x: 1400, y: 600 },
    },
    units: [
      {
        id: 'unit_1',
        label: 'Infantry Division',
        labelAr: 'فرقة المشاة',
        type: 'infantry',       // infantry | cavalry | archer | camel | reserve
        soldierCount: 100,      // 20-200 soldiers per token
        position: { x: 1300, y: 500 },
        facing: Math.PI,        // radians, facing left
        formation: 'line',      // line | wedge | defensive_circle | column | flank | crescent
        stats: {
          health: 100,
          attack: 12,
          defense: 8,
          speed: 40,
          morale: 85,
          range: 30,
          chargeBonus: 0,
        },
      },
    ],
  },
],
```

### Step 4: Script Battle Phases

```typescript
phases: [
  {
    id: 'phase_1',
    type: 'deployment',
    name: 'Deployment',
    nameAr: 'الانتشار',
    startTime: 0,          // seconds
    duration: 15,
    description: 'Armies take positions.',
    descriptionAr: 'تتخذ الجيوش مواقعها.',
    triggerEvents: [],
  },
  // Add more phases...
],
```

### Step 5: Add Scripted Events

```typescript
events: [
  {
    id: 'event_advance',
    type: 'move_unit',
    timestamp: 15,         // when to fire (seconds)
    target: 'unit_1',      // which unit
    params: {
      type: 'move_unit',
      destination: { x: 900, y: 500 },
      speed: 40,
    },
  },
  {
    id: 'event_charge',
    type: 'trigger_charge',
    timestamp: 45,
    target: 'cavalry_1',
    params: {
      type: 'trigger_charge',
      targetEntityId: 'enemy_unit_1',
      speedMultiplier: 2.0,
    },
  },
],
```

### Step 6: Add Narration

```typescript
narration: [
  {
    id: 'narr_1',
    timestamp: 0,
    duration: 8,
    text: 'English narration text...',
    textAr: 'نص السرد بالعربية...',
    position: 'bottom',    // top | bottom | center | subtitle
    style: 'standard',     // standard | dramatic | quran_verse | hadith | historical_note
    autoAdvance: true,
  },
],
```

### Step 7: Add Camera Cues

```typescript
cameraCues: [
  {
    id: 'cam_1',
    timestamp: 0,
    moveType: 'overview',  // pan | zoom | follow | overview | focus | cinematic_sweep
    zoom: 0.6,
    duration: 3,
    easing: 'power2.inOut',
    hold: 5,
  },
  {
    id: 'cam_2',
    timestamp: 45,
    moveType: 'follow',
    entityId: 'cavalry_1',
    zoom: 1.5,
    duration: 1,
    easing: 'power3.inOut',
  },
],
```

### Step 8: Register the Scenario

Add your scenario to the scenario index so the engine can find it.

---

## Available Event Types

| Event Type | Description |
|-----------|-------------|
| `move_unit` | Move a unit to a destination |
| `rotate_formation` | Rotate a formation to face a direction |
| `change_formation` | Morph to a different formation type |
| `trigger_charge` | Launch a charge at a target |
| `play_narration` | Trigger a narration cue |
| `focus_camera` | Move camera to a position |
| `spawn_projectile` | Create projectiles |
| `arrow_volley` | Launch a volley of arrows |
| `morale_break` | Force morale collapse |
| `retreat` | Order a unit to retreat |
| `reveal_reinforcements` | Spawn new units mid-battle |
| `set_speed` | Change unit movement speed |
| `spawn_effect` | Create a visual effect |
| `remove_entity` | Remove a unit from the field |
| `set_morale` | Set morale to a specific value |
| `commander_death` | Kill a commander with morale impact |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    BATTLE REPLAY ENGINE                       │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                 ENGINE CORE (rAF)                    │    │
│  │                                                     │    │
│  │  Scenario ──→ ScriptInterpreter ──→ EventHandlers   │    │
│  │                      │                              │    │
│  │                      ▼                              │    │
│  │  ┌─────────────────────────────────────────────┐   │    │
│  │  │              ECS WORLD                       │   │    │
│  │  │  Entities + Components + Systems             │   │    │
│  │  │  (Movement, Formation, Combat, Morale, etc.) │   │    │
│  │  └──────────────────┬──────────────────────────┘   │    │
│  │                     │                              │    │
│  │         ┌───────────┼───────────┐                  │    │
│  │         ▼           ▼           ▼                  │    │
│  │    RenderMgr    CameraCtrl   Timeline              │    │
│  │    (PixiJS)     (GSAP)       (Playback)            │    │
│  └─────────────────────────────────────────────────────┘    │
│                         │                                    │
│              Zustand Stores (10fps)                          │
│                         │                                    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              REACT UI SHELL                          │    │
│  │  BattlePlayer > Canvas + Controls + Timeline + Narr │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              XSTATE MACHINE                          │    │
│  │  idle → loading → intro → deployment → active →     │    │
│  │  pause → replay → completed                         │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## Dependencies (to be installed)

```json
{
  "pixi.js": "^8.x",
  "zustand": "^5.x",
  "gsap": "^3.x",
  "xstate": "^5.x",
  "@xstate/react": "^4.x"
}
```

---

## File Structure

See [`docs/01-folder-structure.md`](docs/01-folder-structure.md) for the complete directory layout.
