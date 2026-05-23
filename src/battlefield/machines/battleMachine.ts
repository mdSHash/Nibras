/**
 * Battle state machine using XState v5.
 *
 * States:
 * - idle: No scenario loaded
 * - loading: Scenario being loaded (entities spawning)
 * - intro: Showing battle intro/overview (camera pan, title)
 * - deployment: Units in starting positions, ready to begin
 * - active_battle: Battle playing (simulation running)
 * - paused: Battle paused
 * - completed: Battle finished, showing outcome
 *
 * Events:
 * - LOAD_SCENARIO: { scenarioId: string; scenarioName: string }
 * - SCENARIO_LOADED
 * - START_INTRO
 * - INTRO_COMPLETE
 * - START_BATTLE
 * - PAUSE
 * - RESUME
 * - SEEK: { time: number }
 * - BATTLE_COMPLETE
 * - RESET
 * - UNLOAD
 * - ERROR: { message: string }
 * - UPDATE_PROGRESS: { progress: number }
 * - UPDATE_PHASE: { phaseId: string; phaseName: string }
 */

import { createMachine, assign } from 'xstate';

// ─── Context Type ────────────────────────────────────────────────────────────

export interface BattleMachineContext {
  scenarioId: string | null;
  scenarioName: string | null;
  currentPhaseId: string | null;
  currentPhaseName: string | null;
  progress: number; // 0-1
  error: string | null;
}

// ─── Event Types ─────────────────────────────────────────────────────────────

export type BattleMachineEvent =
  | { type: 'LOAD_SCENARIO'; scenarioId: string; scenarioName: string }
  | { type: 'SCENARIO_LOADED' }
  | { type: 'START_INTRO' }
  | { type: 'INTRO_COMPLETE' }
  | { type: 'START_BATTLE' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'SEEK'; time: number }
  | { type: 'BATTLE_COMPLETE' }
  | { type: 'RESET' }
  | { type: 'UNLOAD' }
  | { type: 'ERROR'; message: string }
  | { type: 'UPDATE_PROGRESS'; progress: number }
  | { type: 'UPDATE_PHASE'; phaseId: string; phaseName: string };

// ─── Machine Definition ──────────────────────────────────────────────────────

export const battleMachine = createMachine({
  id: 'battle',
  initial: 'idle',
  context: {
    scenarioId: null,
    scenarioName: null,
    currentPhaseId: null,
    currentPhaseName: null,
    progress: 0,
    error: null,
  } as BattleMachineContext,
  states: {
    idle: {
      on: {
        LOAD_SCENARIO: {
          target: 'loading',
          actions: assign({
            scenarioId: ({ event }) => (event as { type: 'LOAD_SCENARIO'; scenarioId: string; scenarioName: string }).scenarioId,
            scenarioName: ({ event }) => (event as { type: 'LOAD_SCENARIO'; scenarioId: string; scenarioName: string }).scenarioName,
            error: () => null,
          }),
        },
      },
    },
    loading: {
      on: {
        SCENARIO_LOADED: { target: 'deployment' },
        START_INTRO: { target: 'intro' },
        ERROR: {
          target: 'idle',
          actions: assign({
            error: ({ event }) => (event as { type: 'ERROR'; message: string }).message,
          }),
        },
      },
    },
    intro: {
      on: {
        INTRO_COMPLETE: { target: 'deployment' },
        PAUSE: { target: 'paused' },
      },
    },
    deployment: {
      on: {
        START_BATTLE: { target: 'active_battle' },
        UNLOAD: {
          target: 'idle',
          actions: assign({
            scenarioId: () => null,
            scenarioName: () => null,
            currentPhaseId: () => null,
            currentPhaseName: () => null,
            progress: () => 0,
          }),
        },
      },
    },
    active_battle: {
      on: {
        PAUSE: { target: 'paused' },
        BATTLE_COMPLETE: { target: 'completed' },
        UPDATE_PROGRESS: {
          actions: assign({
            progress: ({ event }) => (event as { type: 'UPDATE_PROGRESS'; progress: number }).progress,
          }),
        },
        UPDATE_PHASE: {
          actions: assign({
            currentPhaseId: ({ event }) => (event as { type: 'UPDATE_PHASE'; phaseId: string; phaseName: string }).phaseId,
            currentPhaseName: ({ event }) => (event as { type: 'UPDATE_PHASE'; phaseId: string; phaseName: string }).phaseName,
          }),
        },
        SEEK: {
          // Stay in active_battle, handled externally
        },
      },
    },
    paused: {
      on: {
        RESUME: { target: 'active_battle' },
        SEEK: {
          // Stay in paused, handled externally
        },
        RESET: {
          target: 'deployment',
          actions: assign({
            currentPhaseId: () => null,
            currentPhaseName: () => null,
            progress: () => 0,
          }),
        },
        UNLOAD: {
          target: 'idle',
          actions: assign({
            scenarioId: () => null,
            scenarioName: () => null,
            currentPhaseId: () => null,
            currentPhaseName: () => null,
            progress: () => 0,
          }),
        },
      },
    },
    completed: {
      on: {
        RESET: {
          target: 'deployment',
          actions: assign({
            currentPhaseId: () => null,
            currentPhaseName: () => null,
            progress: () => 0,
          }),
        },
        UNLOAD: {
          target: 'idle',
          actions: assign({
            scenarioId: () => null,
            scenarioName: () => null,
            currentPhaseId: () => null,
            currentPhaseName: () => null,
            progress: () => 0,
          }),
        },
      },
    },
  },
});

// Export the machine type for use with useActor
export type BattleMachine = typeof battleMachine;
