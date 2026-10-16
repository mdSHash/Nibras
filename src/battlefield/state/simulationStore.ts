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
  units: UnitSnapshot[];
  /** Each side's strength as the header shows it: its force total (the event figure), drained in proportion. */
  muslimStrength: number;
  enemyStrength: number;
  /**
   * Force total ÷ the units' starting soldier count, per side. The units keep
   * their own sizes (often the sources' figures for each contingent, which need
   * not add up to the army's total), so the counters are scaled instead.
   */
  strengthScale: { muslim: number; enemy: number };
  muslimMorale: number;
  enemyMorale: number;
  activePhaseId: string | null;

  // Actions
  setScenario: (id: string | null) => void;
  updateUnits: (units: UnitSnapshot[]) => void;
  setStrengthScale: (scale: { muslim: number; enemy: number }) => void;
  /** Takes the units' live soldier counts per side. */
  updateStrengths: (muslim: number, enemy: number) => void;
  updateMorale: (muslim: number, enemy: number) => void;
  setActivePhase: (phaseId: string | null) => void;
  reset: () => void;
}

const initialState = {
  scenarioId: null as string | null,
  units: [] as UnitSnapshot[],
  muslimStrength: 0,
  enemyStrength: 0,
  strengthScale: { muslim: 1, enemy: 1 },
  muslimMorale: 100,
  enemyMorale: 100,
  activePhaseId: null as string | null,
};

export const useSimulationStore = create<SimulationState>()((set) => ({
  ...initialState,

  setScenario: (id) => set({ scenarioId: id }),

  updateUnits: (units) => set({ units }),

  setStrengthScale: (strengthScale) => set({ strengthScale }),

  updateStrengths: (muslim, enemy) =>
    set((s) => ({
      muslimStrength: Math.round(muslim * s.strengthScale.muslim),
      enemyStrength: Math.round(enemy * s.strengthScale.enemy),
    })),

  updateMorale: (muslim, enemy) =>
    set({ muslimMorale: muslim, enemyMorale: enemy }),

  setActivePhase: (phaseId) => set({ activePhaseId: phaseId }),

  reset: () => set(initialState),
}));
