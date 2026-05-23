# 08 — State Machines (XState)

## Overview

The battle lifecycle is orchestrated by an **XState state machine**. This provides predictable, debuggable phase transitions with clear entry/exit actions.

---

## 8.1 — Battle Machine States

```
┌─────────────────────────────────────────────────────────────┐
│                    BATTLE STATE MACHINE                       │
│                                                             │
│  ┌──────────┐    ┌───────┐    ┌────────────┐               │
│  │ loading  │───→│ intro │───→│ deployment │               │
│  └──────────┘    └───────┘    └─────┬──────┘               │
│                                     │                       │
│                                     ▼                       │
│  ┌───────────┐    ┌───────┐    ┌──────────────┐            │
│  │ completed │←───│ pause │←──→│active_battle │            │
│  └───────────┘    └───────┘    └──────┬───────┘            │
│       ▲                               │                     │
│       │           ┌────────┐          │                     │
│       └───────────│ replay │←─────────┘                     │
│                   └────────┘                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 8.2 — XState Machine Definition

```typescript
// src/battlefield/machines/battleMachine.ts

import { createMachine, assign } from 'xstate';

// ─── Context ─────────────────────────────────────────

export interface BattleMachineContext {
  scenarioId: string;
  currentPhaseIndex: number;
  totalPhases: number;
  currentTime: number;
  totalDuration: number;
  loadProgress: number;
  error: string | null;
}

// ─── Events ──────────────────────────────────────────

export type BattleMachineEvent =
  | { type: 'LOAD_SCENARIO'; scenarioId: string }
  | { type: 'LOAD_COMPLETE' }
  | { type: 'LOAD_ERROR'; error: string }
  | { type: 'START_INTRO' }
  | { type: 'SKIP_INTRO' }
  | { type: 'INTRO_COMPLETE' }
  | { type: 'BEGIN_DEPLOYMENT' }
  | { type: 'DEPLOYMENT_COMPLETE' }
  | { type: 'START_BATTLE' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'PHASE_ADVANCE'; phaseIndex: number }
  | { type: 'BATTLE_COMPLETE' }
  | { type: 'ENTER_REPLAY' }
  | { type: 'EXIT_REPLAY' }
  | { type: 'SEEK'; time: number }
  | { type: 'RESTART' }
  | { type: 'EXIT' };

// ─── Machine ─────────────────────────────────────────

export const battleMachine = createMachine({
  id: 'battle',
  initial: 'idle',
  context: {
    scenarioId: '',
    currentPhaseIndex: 0,
    totalPhases: 0,
    currentTime: 0,
    totalDuration: 0,
    loadProgress: 0,
    error: null,
  } as BattleMachineContext,

  states: {
    idle: {
      on: {
        LOAD_SCENARIO: {
          target: 'loading',
          actions: assign({ scenarioId: (_, event) => event.scenarioId }),
        },
      },
    },

    loading: {
      entry: ['startLoading'],
      on: {
        LOAD_COMPLETE: { target: 'intro' },
        LOAD_ERROR: {
          target: 'idle',
          actions: assign({ error: (_, event) => event.error }),
        },
      },
    },

    intro: {
      entry: ['playIntroSequence'],
      on: {
        INTRO_COMPLETE: { target: 'deployment' },
        SKIP_INTRO: { target: 'deployment' },
      },
    },

    deployment: {
      entry: ['setupDeployment'],
      on: {
        DEPLOYMENT_COMPLETE: { target: 'active_battle' },
        START_BATTLE: { target: 'active_battle' },
      },
    },

    active_battle: {
      entry: ['startSimulation'],
      on: {
        PAUSE: { target: 'paused' },
        PHASE_ADVANCE: {
          actions: assign({ currentPhaseIndex: (_, event) => event.phaseIndex }),
        },
        BATTLE_COMPLETE: { target: 'completed' },
        ENTER_REPLAY: { target: 'replay' },
      },
    },

    paused: {
      entry: ['pauseSimulation'],
      on: {
        RESUME: { target: 'active_battle' },
        SEEK: {
          actions: ['seekToTime'],
        },
        ENTER_REPLAY: { target: 'replay' },
        EXIT: { target: 'idle' },
      },
    },

    replay: {
      entry: ['enterReplayMode'],
      on: {
        SEEK: {
          actions: ['seekToTime'],
        },
        RESUME: { target: 'active_battle' },
        EXIT_REPLAY: { target: 'paused' },
        EXIT: { target: 'idle' },
      },
    },

    completed: {
      entry: ['showCompletionScreen'],
      on: {
        RESTART: { target: 'loading' },
        ENTER_REPLAY: { target: 'replay' },
        EXIT: { target: 'idle' },
      },
    },
  },
});
```

---

## 8.3 — Machine Actions

```typescript
// Actions are implemented in the service that interprets the machine

const machineActions = {
  startLoading: (context) => {
    // Load scenario data, textures, audio
    // Emit progress events
  },
  
  playIntroSequence: (context) => {
    // Show battle title card
    // Pan camera across battlefield
    // Display historical context narration
  },
  
  setupDeployment: (context) => {
    // Spawn all entities at starting positions
    // Play deployment camera sequence
    // Show faction labels
  },
  
  startSimulation: (context) => {
    // Resume engine clock
    // Start script interpreter
    // Begin camera choreography
  },
  
  pauseSimulation: (context) => {
    // Pause engine clock
    // Pause GSAP timelines
    // Show pause overlay
  },
  
  seekToTime: (context, event) => {
    // Restore nearest snapshot
    // Fast-forward to target time
    // Sync all subsystems
  },
  
  enterReplayMode: (context) => {
    // Enable timeline scrubber
    // Show replay controls
    // Allow free camera movement
  },
  
  showCompletionScreen: (context) => {
    // Display battle outcome
    // Show statistics
    // Offer replay option
  },
};
```

---

## 8.4 — State → UI Mapping

| Machine State | UI Shown | Engine State |
|---------------|----------|--------------|
| `idle` | Nothing (battle not started) | Engine not created |
| `loading` | Loading screen with progress | Loading assets |
| `intro` | Title card + cinematic pan | Engine paused, camera animating |
| `deployment` | Battlefield with units appearing | Engine running (deployment only) |
| `active_battle` | Full battle view + controls | Engine running at full speed |
| `paused` | Pause overlay + controls | Engine paused |
| `replay` | Timeline scrubber + free camera | Engine paused, seek enabled |
| `completed` | Victory/defeat screen + stats | Engine stopped |

---

## 8.5 — Integration with Engine

The XState machine runs in React (via `useMachine` hook) and communicates with the engine through the Zustand stores:

```
React (XState) ──commands──→ Engine (via store actions)
Engine ──state updates──→ Zustand Store ──subscriptions──→ React
```

The machine does NOT directly call engine methods. Instead:
1. Machine transitions trigger store actions
2. Store actions are picked up by the engine on next frame
3. Engine updates are written back to stores
4. React subscribes to store changes for UI updates
