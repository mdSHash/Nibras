/**
 * Modes and levels of the daily challenge, as approved on 2026-11-16
 * (docs/REFACTOR_PLAN.md, Phase 5); since 2026-11-22 three tries (the round is lost at the
 * third wrong pick, fixed 2026-11-23), a clue every two wrong picks, three levels applied to every mode.
 */
export const MODES = ['who', 'battle', 'place', 'year', 'number', 'leader', 'era', 'order'] as const;
export type Mode = (typeof MODES)[number];
export const LEVELS = ['easy', 'mid', 'hard'] as const;
export type Level = (typeof LEVELS)[number];

/** Options per round. */
export const OPTION_COUNT = 5;
/**
 * Picks in a round, in every mode: the round ends at a win or at the third wrong pick
 * (2026-11-22; until 2026-11-23 it wrongly ended at the second).
 */
export const TRIES = 3;
/** One more clue opens after this many wrong picks. */
export const WRONG_PER_CLUE = 2;

export interface LevelConfig {
  /** Clues shown before the first pick. */
  cluesAtStart: number;
  /** Year offsets for «السنة» distractors (both signs are used). */
  yearOffsets: number[];
  /** Factors for «الرقم» distractors. */
  numberFactors: number[];
  /** Solved in this many picks or fewer counts as fast (suggest a harder level). */
  fastPicks: number;
  /** …or in this many seconds or fewer. */
  fastSeconds: number;
}

export const LEVEL_CONFIG: Record<Level, LevelConfig> = {
  easy: { cluesAtStart: 2, yearOffsets: [5, 7, 9, 12, 15, 20], numberFactors: [0.25, 0.4, 2.5, 4, 6, 8], fastPicks: 2, fastSeconds: 20 },
  mid: { cluesAtStart: 1, yearOffsets: [2, 3, 4, 6, 8], numberFactors: [0.5, 0.65, 1.5, 1.9, 2.5, 3], fastPicks: 2, fastSeconds: 25 },
  hard: { cluesAtStart: 1, yearOffsets: [1, 2, 3, 4, 5], numberFactors: [0.6, 0.75, 0.85, 1.2, 1.35, 1.5], fastPicks: 1, fastSeconds: 30 },
};

/** Arabic names, as the level sheet and the header show them. */
export const LEVEL_NAMES: Record<Level, { name: string; desc: string }> = {
  easy: { name: 'لسه ببتدي', desc: 'أسئلة عن أشهر الأحداث والشخصيات، واختيارات بعيدة عن بعض، ودليلين من الأول.' },
  mid: { name: 'عارف شوية', desc: 'أسئلة متوسطة، واختيارات أقرب لبعض، ودليل واحد في الأول.' },
  hard: { name: 'أستاذ فيها', desc: 'أسئلة من كل نبراس، واختيارات قريبة جدًا من بعض.' },
};

export const MODE_NAMES: Record<Mode, { tab: string; title: string; label: string; was: string }> = {
  who: { tab: 'من أكون؟', title: 'مين الشخصية دي؟', label: 'الصحابي', was: 'الصحابي كان' },
  battle: { tab: 'المعركة', title: 'أنهي معركة دي؟', label: 'المعركة', was: 'المعركة كانت' },
  place: { tab: 'المكان', title: 'أنهي مدينة دي؟', label: 'المدينة', was: 'المدينة كانت' },
  year: { tab: 'السنة', title: 'حصل سنة كام؟', label: 'السنة', was: 'السنة كانت' },
  number: { tab: 'الرقم', title: 'كانوا كام؟', label: 'الرقم', was: 'الرقم كان' },
  leader: { tab: 'القائد', title: 'مين القائد؟', label: 'القائد', was: 'القائد كان' },
  era: { tab: 'العهد', title: 'أنهي عهد؟', label: 'العهد', was: 'العهد كان' },
  order: { tab: 'رتّب', title: 'رتّب الأحداث من الأقدم للأحدث', label: 'الترتيب', was: 'الترتيب الصح' },
};
