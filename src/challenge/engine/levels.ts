/**
 * Levels and what each changes (docs/phase5/challenge-spec.md, section 3).
 */
import type { Tier } from '../../../shared/gameData';

export const MODES = ['who', 'battle', 'place', 'time', 'number', 'full'] as const;
export type Mode = (typeof MODES)[number];
export const LEVELS = ['easy', 'mid', 'hard'] as const;
export type Level = (typeof LEVELS)[number];

export interface LevelConfig {
  /** Tiers the day's answer is drawn from, in order of preference. */
  tiers: Tier[];
  /** Tiers to borrow from, in order, when a pool has fewer than 4 items. */
  borrow: Tier[];
  /** Clues shown at the start of «من أكون؟» and «معركة اليوم». */
  cluesAtStart: number;
  attempts: Record<Mode, number>;
  /** Year offsets for «زمان اليوم» distractors (both signs are used). */
  yearOffsets: number[];
  /** Factors for «رقم اليوم» distractors. */
  numberFactors: number[];
  /** Minimum spacing between the four places in «الحدث الكامل», in km. */
  placeSpacingKm: number;
}

const attempts = (whoBattle: number): Record<Mode, number> => ({ who: whoBattle, battle: whoBattle, place: 3, time: 3, number: 3, full: 2 });

export const LEVEL_CONFIG: Record<Level, LevelConfig> = {
  easy: {
    tiers: [1],
    borrow: [2],
    cluesAtStart: 2,
    attempts: attempts(4),
    yearOffsets: [5, 7, 9, 12, 15, 20],
    numberFactors: [0.25, 0.4, 2.5, 4, 6],
    placeSpacingKm: 300,
  },
  mid: {
    tiers: [2],
    borrow: [1, 3],
    cluesAtStart: 1,
    attempts: attempts(4),
    yearOffsets: [2, 3, 4, 6, 8],
    numberFactors: [0.5, 0.65, 1.5, 1.9, 2.5],
    placeSpacingKm: 150,
  },
  hard: {
    tiers: [3, 2],
    borrow: [1],
    cluesAtStart: 1,
    attempts: attempts(3),
    yearOffsets: [1, 2, 3, 4],
    numberFactors: [0.75, 0.85, 1.2, 1.35, 1.5],
    placeSpacingKm: 40,
  },
};

/** Points per stage of «الحدث الكامل»; a round of 60 or more counts as won. */
export const FULL_STAGES = { name: 40, place: 30, year: 30 } as const;
export const FULL_WIN_POINTS = 60;
