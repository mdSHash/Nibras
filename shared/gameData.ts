/**
 * The daily challenge's data (Phase 5): the reviewed config in content/game/
 * and the dataset scripts/game/build.ts generates from content/ for the game.
 */
import { z } from 'zod';

const id = z.string().min(1);
const text = z.string().trim().min(1);

export const exclusionsSchema = z.strictObject({
  eras: z.array(z.strictObject({ id, reason: text })),
  events: z.array(z.strictObject({ id, reason: text })),
  /** A clue that contains one of these words is never shown (sensitive episodes). */
  clueWords: z.array(text),
});

const tierList = z.array(id);
export const tiersSchema = z.strictObject({
  events: z.strictObject({
    tier1: tierList,
    /** Events in these eras are tier 2 unless listed in tier1. */
    tier2Eras: z.array(id),
    /** Events with force sizes are tier 2 unless listed in tier1. */
    tier2WithForces: z.boolean(),
    /** Explicit tier for an event, overriding the rules above. */
    overrides: z.record(id, z.union([z.literal(1), z.literal(2), z.literal(3)])),
  }),
  people: z.strictObject({ tier1: tierList, tier3: tierList }),
  cities: z.strictObject({ tier1: tierList, tier3: tierList }),
});

export const ISLAM = ['before', 'after'] as const;
export const MIGRATION = ['muhajir', 'ansari', 'other'] as const;
export const KNOWN_FOR = ['caliph', 'commander', 'scholar', 'family', 'early', 'ansarLeader', 'muezzin'] as const;
export const DEATH_REGIONS = ['madinah', 'makkah', 'hijaz', 'sham', 'iraq', 'egypt', 'rum'] as const;

const evidence = z.array(
  z.strictObject({
    /** `bio`, `role` or `title` of the person, or `event:<id>` (the event's place name). */
    from: z.string().regex(/^(bio|role|title|event:.+)$/),
    quote: text,
  }),
);
const fact = <T extends readonly [string, ...string[]]>(values: T) =>
  z.strictObject({ value: z.enum(values), evidence, pending: text.optional() });

export const companionFactsSchema = z.strictObject({
  _note: z.string(),
  people: z.array(
    z.strictObject({
      id,
      islam: fact(ISLAM),
      migration: fact(MIGRATION),
      knownFor: fact(KNOWN_FOR),
      deathPlace: fact(DEATH_REGIONS),
      legacy: z.strictObject({ clan: text, ten: z.boolean() }),
    }),
  ),
});

export type Tier = 1 | 2 | 3;
export type Islam = (typeof ISLAM)[number];
export type Migration = (typeof MIGRATION)[number];
export type KnownFor = (typeof KNOWN_FOR)[number];
export type DeathRegion = (typeof DEATH_REGIONS)[number];
/** The era a person lived to: an era id, or `after` (after the Rightly Guided Caliphs). */
export type LastEra = 'prophet' | 'abu-bakr' | 'umar' | 'uthman' | 'ali' | 'after';

export interface GameForce {
  value: number;
  /** The force text verbatim, shown on the result screen. */
  textAr: string;
}

export interface GameEvent {
  id: string;
  /** Address in Nibras, `/event/<slug>/`. */
  slug: string;
  title: string;
  year: number;
  disputed: boolean;
  dateLabel: string;
  place: string;
  lat: number;
  lon: number;
  era: string;
  battle: boolean;
  /** First word of the title when it is غزوة / سرية / معركة / فتح / موقعة, else `حدث`. */
  kind: string;
  prophetPresent: boolean;
  tier: Tier;
  summary: string;
  /** Masked clues, vague to specific. */
  clues: string[];
  /** Masked excerpt for «الحدث الكامل». */
  excerpt: string[];
  /** Folded name tokens (for tests and leak checks). */
  keys: string[];
  army?: GameForce;
  enemyArmy?: GameForce;
}

export interface GamePerson {
  id: string;
  name: string;
  deathYear: number;
  disputed: boolean;
  lastEra: LastEra;
  role: string;
  title: string;
  /** The first two bio sentences, verbatim. */
  bioShort: string;
  tier: Tier;
  clues: string[];
  keys: string[];
  islam: Islam;
  migration: Migration;
  knownFor: KnownFor;
  deathPlace: DeathRegion;
}

export interface GameCity {
  id: string;
  name: string;
  lat: number;
  lon: number;
  description: string;
  tier: Tier;
  clues: string[];
  keys: string[];
}

export interface GameData {
  eras: { id: string; nameAr: string }[];
  events: GameEvent[];
  people: GamePerson[];
  cities: GameCity[];
}
