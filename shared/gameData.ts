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
  /** The question bank (content/game/questions/), checked against the content. */
  questions: BankQuestion[];
  eras: { id: string; nameAr: string }[];
  events: GameEvent[];
  people: GamePerson[];
  cities: GameCity[];
}

/**
 * The «من أكون؟» tiles' Arabic labels (drafted by Claude in Mostafa's Egyptian
 * register, 2026-11-16; listed for his review in docs/phase5/data-report.md).
 */
export const FACT_LABELS = {
  islam: { before: 'قبل الهجرة', after: 'بعد الهجرة' },
  migration: { muhajir: 'مهاجر', ansari: 'أنصاري', other: 'من قبيلة تانية' },
  knownFor: {
    caliph: 'خليفة',
    commander: 'قائد جيوش',
    scholar: 'عالم وراوي',
    family: 'من أهل النبي ﷺ',
    early: 'من أوائل المسلمين',
    ansarLeader: 'من كبار الأنصار',
    muezzin: 'مؤذن النبي ﷺ',
  },
  deathPlace: {
    madinah: 'المدينة',
    makkah: 'مكة',
    hijaz: 'الحجاز',
    sham: 'الشام',
    iraq: 'العراق',
    egypt: 'مصر',
    rum: 'بلاد الروم',
  },
  lastEra: {
    prophet: 'عهد النبي ﷺ',
    'abu-bakr': 'عهد أبي بكر',
    umar: 'عهد عمر',
    uthman: 'عهد عثمان',
    ali: 'عهد علي',
    after: 'بعد الخلفاء الراشدين',
  },
} as const satisfies {
  islam: Record<Islam, string>;
  migration: Record<Migration, string>;
  knownFor: Record<KnownFor, string>;
  deathPlace: Record<DeathRegion, string>;
  lastEra: Record<LastEra, string>;
};

/** Tile titles for «من أكون؟». */
export const FACT_TITLES = {
  islam: 'أسلم',
  migration: 'مهاجر ولا أنصاري؟',
  knownFor: 'اشتهر بإيه؟',
  lastEra: 'عاش لحد عهد مين؟',
  deathPlace: 'اتوفّى فين',
} as const;

/** Modes the question bank covers (content/game/questions/<mode>.json). */
export const BANK_MODES = ['who', 'battle', 'place', 'year', 'number', 'title', 'order', 'there', 'quote'] as const;
export type BankMode = (typeof BANK_MODES)[number];
export const BANK_LEVELS = ['easy', 'mid', 'hard'] as const;

const bankSource = z.strictObject({
  /** A field of the record: person bio/role/title/name, event summary/course/full/date/place/forces/title, city description/significance/name. */
  from: z.enum(['bio', 'role', 'title', 'name', 'summary', 'course', 'full', 'date', 'place', 'forces', 'description', 'significance']),
  /** Another record than the answer's: `person:<id>`, `event:<id>` or `city:<id>`. */
  of: z.string().regex(/^(person|event|city):.+$/).optional(),
  quote: text,
});

export const questionBankSchema = z.strictObject({
  mode: z.enum(BANK_MODES),
  questions: z.array(
    z.strictObject({
      id: z.string().regex(/^[a-z0-9-]+$/),
      level: z.enum(BANK_LEVELS),
      /** The answer's record id (person, event or city by mode), or `<event id>:army|enemyArmy` for «الرقم». */
      answer: z.string().min(1),
      /** A prompt of its own (story-style questions); the mode's default prompt otherwise. */
      prompt: text.optional(),
      clues: z.array(z.strictObject({ text, sources: z.array(bankSource).min(1) })),
      /** Hand-picked wrong options (ids); the engine picks them by level otherwise. */
      options: z.array(z.string()).optional(),
    }),
  ),
});
export type QuestionBank = z.infer<typeof questionBankSchema>;
export type BankQuestion = QuestionBank['questions'][number] & { mode: BankMode };
