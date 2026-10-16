/**
 * The chat KB's names for eras and battles, which the chat API, its prompts and
 * citations use (shared/chatKb.ts). Kept as they were before Phase 1B, when the
 * events carried these labels; Phase 3 moves the chat to era and replay ids.
 */
import type { EraKey } from '../../shared/chatKb';

/** KbRecord.era, by content era id. */
export const KB_ERA_LABEL: Record<string, string> = {
  meccan: 'العهد المكي',
  medinan: 'العهد المدني',
  'abu-bakr': 'أبو بكر الصديق',
  umar: 'عمر بن الخطاب',
  uthman: 'عهد عثمان بن عفان',
  ali: 'عهد علي بن أبي طالب',
};

/** KbRecord.eraKey, by content era id. */
export const KB_ERA_KEY: Record<string, EraKey> = {
  meccan: 'meccan',
  medinan: 'medinan',
  'abu-bakr': 'abuBakr',
  umar: 'umar',
  uthman: 'uthman',
  ali: 'ali',
};

/** The chat's battle key for a replay id ("battle-of-badr" → "badr"). */
export const kbBattleId = (scenarioId: string): string =>
  scenarioId === 'conquest-of-mecca' ? 'fath-makkah' : scenarioId.replace(/^battle-of-/, '');
