/**
 * Simulation Store — Holds a snapshot of simulation state for React UI.
 * 
 * Updated at ~10fps from the engine. Contains unit snapshots,
 * faction strengths, and morale for UI display.
 */

import { create } from 'zustand';
import type { Faction } from '../types/components';

export interface UnitSnapshot {
  id: string;
  name: string;
  faction: Faction;
  health: number;
  morale: number;
  soldierCount: number;
  maxSoldiers: number;
  isEngaged: boolean;
  isRouted: boolean;
  positionX: number;
  positionY: number;
}

export interface SimulationState {
  // State
  scenarioId: string | null;
  scenarioName: string | null;
  units: UnitSnapshot[];
  muslimStrength: number;
  enemyStrength: number;
  muslimMorale: number;
  enemyMorale: number;
  activePhaseId: string | null;

  // Actions
  setScenario: (id: string | null, name: string | null) => void;
  updateUnits: (units: UnitSnapshot[]) => void;
  updateStrengths: (muslim: number, enemy: number) => void;
  updateMorale: (muslim: number, enemy: number) => void;
  setActivePhase: (phaseId: string | null) => void;
  reset: () => void;
}

const initialState = {
  scenarioId: null as string | null,
  scenarioName: null as string | null,
  units: [] as UnitSnapshot[],
  muslimStrength: 0,
  enemyStrength: 0,
  muslimMorale: 100,
  enemyMorale: 100,
  activePhaseId: null as string | null,
};

export const useSimulationStore = create<SimulationState>()((set) => ({
  ...initialState,

  setScenario: (id, name) => set({ scenarioId: id, scenarioName: name }),

  updateUnits: (units) => set({ units }),

  updateStrengths: (muslim, enemy) =>
    set({ muslimStrength: muslim, enemyStrength: enemy }),

  updateMorale: (muslim, enemy) =>
    set({ muslimMorale: muslim, enemyMorale: enemy }),

  setActivePhase: (phaseId) => set({ activePhaseId: phaseId }),

  reset: () => set(initialState),
}));
