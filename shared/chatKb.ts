/**
 * Shape of the chat assistant's knowledge base (public/data/chat-kb.json),
 * shared by the offline builder (scripts/build-chat-kb.ts) and the runtime
 * (api/_lib/*). Every displayable string in here is either copied verbatim
 * from Nibras's own data or a fixed template label around verbatim values.
 */

export interface EntityRefs {
  eventId?: string;
  companionId?: string;
  quranKey?: string;
  battleId?: string;
  cityId?: string;
}

export type RecordType = 'event' | 'companion' | 'city' | 'quran' | 'battle' | 'list';

export interface KbRecord {
  id: string;
  type: RecordType;
  /** Verbatim display title (event title, companion name, verse key…). */
  title: string;
  /** Original era label from the data, when the record belongs to one. */
  era?: string;
  refs: EntityRefs;
  /** Phrases that identify this record in a question. Never displayed. */
  aliases: string[];
  /** Short/shared aliases that should only weakly suggest this record. */
  weakAliases: string[];
  /** For event records: whether the app classifies it as a battle. */
  isBattle?: boolean;
  /**
   * For event records: the kind of military event, if it is one.
   * ghazwa  — Prophet's era with the Prophet ﷺ present;
   * sariyya — Prophet's era without him (expeditions he sent);
   * harb    — Prophet's era before the mission (e.g. حرب الفجار);
   * maaraka — any battle or military conquest (فتح) after him.
   */
  military?: MilitaryKind;
  /** For era list records: the companion record of that era's ruler. */
  rulerRecordId?: string;
  /** Canonical era key, used to answer "events of era X" questions. */
  eraKey?: EraKey;
}

export type EraKey = 'meccan' | 'medinan' | 'abuBakr' | 'umar' | 'uthman' | 'ali';

export type MilitaryKind = 'ghazwa' | 'sariyya' | 'harb' | 'maaraka';

export type UnitKind =
  | 'event_summary'
  | 'event_description'
  | 'event_step'
  | 'event_date'
  | 'event_location'
  | 'event_army'
  | 'event_duration'
  | 'event_role'
  | 'event_figures'
  | 'event_quran'
  | 'event_hadith'
  | 'event_sources'
  | 'companion_profile'
  | 'companion_bio'
  | 'companion_events'
  | 'city'
  | 'quran_verse'
  | 'battle_description'
  | 'battle_phases'
  | 'battle_narration'
  | 'battle_outcome'
  | 'battle_landmarks'
  | 'list';

export interface KbUnit {
  /** Stable id: `${recordId}#${slug}`. */
  id: string;
  recordId: string;
  kind: UnitKind;
  /** Verbatim display text. */
  text: string;
  /** Event records are authoritative; battle-scenario text is secondary. */
  trust: 'primary' | 'secondary';
  /**
   * Qur'an verses and hadith: the model may cite these but never restate
   * them — the server shows the stored text itself.
   */
  verbatimOnly: boolean;
  /** Extra records this unit is about (e.g. a role unit → the companion). */
  alsoAbout?: string[];
  /**
   * For list-shaped units: the heading and each item verbatim. The server
   * renders these itself so a list answer can never silently drop an item.
   */
  list?: { heading: string; items: string[] };
  refs: EntityRefs;
}

export interface ChatKb {
  version: 2;
  builtAt: string;
  /** Hash of all unit texts — lets embedding indexes detect staleness. */
  contentHash: string;
  records: KbRecord[];
  units: KbUnit[];
  /** Normalized 4-word sequences from verified Qur'an text (answer validator). */
  quranFourGrams: string[];
}

export const ERA_LABELS: Record<EraKey, string> = {
  meccan: 'العهد المكي',
  medinan: 'العهد المدني',
  abuBakr: 'عهد أبي بكر الصديق',
  umar: 'عهد عمر بن الخطاب',
  uthman: 'عهد عثمان بن عفان',
  ali: 'عهد علي بن أبي طالب',
};

/** Mirrors the includes-based era matching the app itself uses (eventHelpers.ts). */
export function eraKeyOf(era: string | undefined): EraKey | undefined {
  if (!era) return undefined;
  if (era.includes('المكي')) return 'meccan';
  if (era.includes('المدني')) return 'medinan';
  if (era.includes('أبي بكر') || era.includes('أبو بكر')) return 'abuBakr';
  if (era.includes('عمر')) return 'umar';
  if (era.includes('عثمان')) return 'uthman';
  if (era.includes('علي')) return 'ali';
  return undefined;
}
