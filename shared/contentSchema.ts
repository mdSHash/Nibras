/**
 * Zod schemas for the content in content/ (Phase 1 layout, docs/REFACTOR_PLAN.md).
 * One file per event, person and city; fixed lists for eras and categories.
 * Records link to each other by id only; scripts/build-content.ts checks every
 * link and emits the data the app loads (src/generated/).
 *
 * Every Arabic text field holds the reviewed text verbatim: it is moved here
 * from the old files, never reworded (CLAUDE.md, rule 1).
 */
import { z } from 'zod';

const text = z.string().trim().min(1);
const slug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'lowercase-slug id');
// Event ids are the future public URLs and are frozen as they are, including
// the legacy ones (`event-0-ميلاد-النبي--عام-الفيل`, `battle_yamama`). They only
// have to be usable as file names.
const eventId = z.string().regex(/^[^\s/\\:*?"<>|.][^\s/\\:*?"<>|]*$/, 'usable as a file name, no spaces');
const latLng = z.tuple([z.number().min(-90).max(90), z.number().min(-180).max(180)]);

/** Marker icons; the map draws each with a fixed Lucide icon. */
export const EVENT_ICONS = ['skull', 'crown', 'swords', 'flag', 'book', 'scroll', 'tent', 'pin'] as const;

export const eraSchema = z.strictObject({
  id: slug,
  /** Era name on the timeline and in search, e.g. "خلافة الفاروق". */
  nameAr: text,
  /** The badge on the event panel; both prophetic eras show "عهد النبوة". */
  panelTitleAr: text,
  rulerAr: text,
  /** Colour scheme in src/utils/eraColors.ts. */
  colorKey: z.enum(['prophetic', 'abuBakr', 'umar', 'uthman', 'ali']),
  /** The era filter: the Prophet's era or the Rashidun caliphate. */
  group: z.enum(['prophet', 'rashidun']),
  order: z.number().int(),
});

export const categorySchema = z.strictObject({
  id: slug,
  /** Same wording as the map legend in the help window. */
  nameAr: text,
  /** Marker colour. */
  color: z.string().regex(/^#[0-9a-f]{6}$/),
});

/** A force size: the original text, plus numbers where the text states them plainly. */
export const countSchema = z.strictObject({
  textAr: text,
  value: z.number().int().positive().optional(),
  min: z.number().int().positive().optional(),
  max: z.number().int().positive().optional(),
  /** The text says "about" (حوالي، نحو، قرابة، …). */
  approx: z.boolean().optional(),
});

export const eventSchema = z.strictObject({
  id: eventId,
  eraId: slug,
  categoryId: slug,
  /** Counted by the "battles" filter. Stored, never guessed from the title. */
  isBattle: z.boolean(),
  icon: z.enum(EVENT_ICONS),
  isMajor: z.boolean().optional(),
  title: text,
  date: z.strictObject({
    /** Orders the timeline and picks the territory map. Hand-set; keep the existing values. */
    sortKey: z.number(),
    /** Only on events that share a sortKey: their order on the timeline (0, 1, 2, …). */
    tieOrder: z.number().int().min(0).optional(),
    gregorian: z.strictObject({ year: z.number().int() }),
    /** Hijri year (negative before the Hijra), where the old data had one. */
    hijri: z.strictObject({ year: z.number().int() }).optional(),
    /** The date as the panel shows it, e.g. "17 رمضان، 2 هـ". */
    labelAr: text,
  }),
  location: z.strictObject({ nameAr: text, coordinates: latLng }),
  summary: text,
  fullDescription: text,
  courseOfEvents: z.array(text),
  durationAr: text.optional(),
  forces: z.strictObject({ army: countSchema.optional(), enemyArmy: countSchema.optional() }).optional(),
  /** People chips; `labelAr` is the text the chip shows. */
  keyFigures: z.array(z.strictObject({ personId: slug, labelAr: text })),
  /** "Roles in the event" list. */
  roles: z.array(z.strictObject({ personId: slug, labelAr: text, roleAr: text })),
  /** Qur'an chips: the passage {surah, from, to}; `labelAr` is the text the chip shows. */
  quran: z.array(
    z.strictObject({
      surah: z.number().int().min(1).max(114),
      from: z.number().int().min(1),
      to: z.number().int().min(1),
      labelAr: text,
    }),
  ),
  hadith: z.array(text),
  sources: z.array(text),
  /** Battle replay (src/battlefield/scenarios), e.g. "battle-of-badr". */
  battleScenarioId: slug.optional(),
  route: z.array(latLng).min(2).optional(),
});

export const personSchema = z.strictObject({
  id: slug,
  name: text,
  title: z.string(),
  role: z.string(),
  bio: text,
  birthDeath: z.string(),
  /** Other names the chat assistant and search recognise. */
  aliases: z.array(text),
});

export const citySchema = z.strictObject({
  id: slug,
  name: text,
  coordinates: latLng,
  description: text,
  significance: text,
});

export const quranPassageSchema = z.strictObject({
  /** Frozen key used by the chat assistant and the Qur'an window, e.g. "سورة الفيل: 1-5". */
  key: text,
  surah: z.number().int().min(1).max(114),
  from: z.number().int().min(1),
  to: z.number().int().min(1),
});

export type Era = z.infer<typeof eraSchema>;
export type Category = z.infer<typeof categorySchema>;
export type Count = z.infer<typeof countSchema>;
export type ContentEvent = z.infer<typeof eventSchema>;
export type EventIcon = (typeof EVENT_ICONS)[number];
export type Person = z.infer<typeof personSchema>;
export type City = z.infer<typeof citySchema>;
export type QuranPassage = z.infer<typeof quranPassageSchema>;
