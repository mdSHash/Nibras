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
import type { LineString, MultiLineString } from 'geojson';

// Field descriptions (`.describe()`) are documentation only: they feed the
// field reference in docs/CONTENT_GUIDE.md (npm run docs:content) and never
// change what validates.
const text = z.string().trim().min(1);
const slug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'lowercase-slug id');
// Event ids are frozen as they are, including the legacy ones
// (`event-0-ميلاد-النبي--عام-الفيل`, `battle_yamama`): the chat KB and links between
// records use them. They only have to be usable as file names; the public
// address uses the event's slug (shared/routes.ts, `eventSlug`).
const eventId = z.string().regex(/^[^\s/\\:*?"<>|.][^\s/\\:*?"<>|]*$/, 'usable as a file name, no spaces');
const latLng = z.tuple([z.number().min(-90).max(90), z.number().min(-180).max(180)]);

/** Marker icons; the map draws each with a fixed Lucide icon. */
export const EVENT_ICONS = ['skull', 'crown', 'swords', 'flag', 'book', 'scroll', 'tent', 'pin'] as const;

export const eraSchema = z.strictObject({
  id: slug.describe('Permanent id, e.g. `medinan`. Events point to it with `eraId`.'),
  nameAr: text.describe('Era name on the timeline and in search, e.g. «خلافة الفاروق».'),
  panelTitleAr: text.describe('The badge on the event panel; both prophetic eras show «عهد النبوة».'),
  rulerAr: text.describe('The ruler the event panel names for this era.'),
  colorKey: z.enum(['prophetic', 'abuBakr', 'umar', 'uthman', 'ali']).describe('Colour scheme in `src/utils/eraColors.ts`.'),
  group: z.enum(['prophet', 'rashidun']).describe("The era filter: the Prophet's era or the Rashidun caliphate."),
  order: z.number().int().describe('Position on the timeline (ascending).'),
  anchorEventId: eventId
    .optional()
    .describe(
      "The event the timeline's era button jumps to (the era's start). When a filter hides it, the button goes to the first shown event of the era from this date on.",
    ),
});

export const categorySchema = z.strictObject({
  id: slug.describe('Permanent id, e.g. `battle`. Events point to it with `categoryId`.'),
  nameAr: text.describe('Same wording as the map legend in the help window.'),
  color: z.string().regex(/^#[0-9a-f]{6}$/).describe('Marker colour (lowercase hex).'),
});

/** A force size: the original text, plus numbers where the text states them plainly. */
export const countSchema = z.strictObject({
  textAr: text.describe('The size as the text gives it, verbatim, e.g. «حوالي ٣١٣ مقاتلا».'),
  value: z.number().int().positive().optional().describe('The number, when the text states one plainly.'),
  min: z.number().int().positive().optional().describe('Lower bound, when the text gives a range.'),
  max: z.number().int().positive().optional().describe('Upper bound, when the text gives a range.'),
  approx: z.boolean().optional().describe('The text says "about" (حوالي، نحو، قرابة، …).'),
});

export const eventSchema = z.strictObject({
  id: eventId.describe('Permanent id and file name (`content/events/<id>.json`). Never rename.'),
  slug: slug
    .optional()
    .describe(
      'The event\'s address, `/event/<slug>/`. Defaults to the id with `_` → `-`; required when the id is not lowercase ASCII. Never change it once published.',
    ),
  eraId: slug.describe('An `id` from `content/eras.json`.'),
  categoryId: slug.describe('An `id` from `content/categories.json`; sets the marker colour.'),
  isBattle: z.boolean().describe('Counted by the "battles" filter. Stored, never guessed from the title.'),
  icon: z.enum(EVENT_ICONS).describe('Marker icon.'),
  isMajor: z.boolean().optional().describe('Drawn as a larger diamond on the timeline.'),
  title: text.describe('Title as the panel and the timeline show it.'),
  date: z.strictObject({
    sortKey: z.number().describe('Orders the timeline and picks the territory map (Gregorian year with a fraction). Keep the existing values.'),
    tieOrder: z
      .number()
      .int()
      .min(0)
      .optional()
      .describe('Only on events that share a `sortKey`: their order on the timeline (0, 1, 2, …).'),
    gregorian: z.strictObject({ year: z.number().int().describe('Gregorian year; must be the whole-number part of `sortKey`.') }),
    hijri: z
      .strictObject({ year: z.number().int().describe('Hijri year, negative before the Hijra.') })
      .optional()
      .describe('Only where the sources give a Hijri year.'),
    labelAr: text.describe('The date as the panel shows it, e.g. «17 رمضان، 2 هـ».'),
  }).describe('When it happened.'),
  location: z.strictObject({
    nameAr: text.describe('Place name as the panel shows it.'),
    coordinates: latLng.describe('Marker position, `[latitude, longitude]`.'),
  }).describe('Where it happened.'),
  summary: text.describe('Short text on the panel; searched with the title and full description.'),
  fullDescription: text.describe('The narrated text (its audio file is keyed by this text).'),
  courseOfEvents: z.array(text).describe('"Course of events" list, one entry per step.'),
  durationAr: text.optional().describe('Duration, as the sources give it (used by the chat assistant; not shown on the panel).'),
  forces: z
    .strictObject({
      army: countSchema.optional().describe("The Muslims' force."),
      enemyArmy: countSchema.optional().describe("The opponents' force."),
    })
    .optional()
    .describe('Force sizes for the panel.'),
  keyFigures: z
    .array(
      z.strictObject({
        personId: slug.describe('An `id` from `content/people/`.'),
        labelAr: text.describe('The text the chip shows.'),
      }),
    )
    .describe('People chips.'),
  roles: z
    .array(
      z.strictObject({
        personId: slug.describe('An `id` from `content/people/`.'),
        labelAr: text.describe('The name as the list shows it.'),
        roleAr: text.describe("The person's role in the event."),
      }),
    )
    .describe('"Roles in the event" list.'),
  quran: z
    .array(
      z.strictObject({
        surah: z.number().int().min(1).max(114).describe('Surah number.'),
        from: z.number().int().min(1).describe('First ayah.'),
        to: z.number().int().min(1).describe('Last ayah.'),
        labelAr: text.describe('The text the chip shows.'),
      }),
    )
    .describe("Qur'an chips; each needs a passage in `content/quran/passages.json`."),
  hadith: z.array(text).describe('Hadith references, as shown.'),
  sources: z.array(text).describe('Sources, as shown.'),
  battleScenarioId: slug.optional().describe('Battle replay (`src/battlefield/scenarios`), e.g. `battle-of-badr`.'),
  battleVideo: z
    .strictObject({
      provider: z.literal('youtube').describe('Where the video is hosted. Only `youtube` (unlisted, embeddable) for now.'),
      id: z.string().regex(/^[A-Za-z0-9_-]{11}$/, 'a YouTube video id (11 characters)').describe('The YouTube video id, e.g. `HCQru0jnWeA` from `https://youtu.be/HCQru0jnWeA`.'),
      durationSec: z.number().int().positive().describe('Length in whole seconds, rounded up; every caption must end by then.'),
    })
    .optional()
    .describe(
      'The battle\'s narrated video; it opens instead of the replay. Needs `battleScenarioId` (its address) and the folder `content/battle-videos/<id>/` (see "Adding a battle video").',
    ),
  route: z.array(latLng).min(2).optional().describe('A route drawn on the map, `[latitude, longitude]` points.'),
});

export const personSchema = z.strictObject({
  id: slug.describe('Permanent id and file name (`content/people/<id>.json`).'),
  name: text.describe('Full name, the heading of the person window.'),
  title: z.string().describe('Title or kunya.'),
  role: z.string().describe('Main role.'),
  bio: text.describe('Biography in the person window.'),
  birthDeath: z.string().describe('Birth and death, as shown.'),
  aliases: z.array(text).describe('Other names the chat assistant and the person lookup recognise.'),
});

export const citySchema = z.strictObject({
  id: slug.describe('Permanent id and file name (`content/cities/<id>.json`).'),
  name: text.describe('City name.'),
  coordinates: latLng.describe('`[latitude, longitude]`.'),
  description: text.describe('Description.'),
  significance: text.describe('Why the city matters.'),
});

export const quranPassageSchema = z.strictObject({
  key: text.describe("Frozen key used by the chat assistant and the Qur'an window, e.g. «سورة الفيل: 1-5»."),
  surah: z.number().int().min(1).max(114).describe('Surah number.'),
  from: z.number().int().min(1).describe('First ayah.'),
  to: z.number().int().min(1).describe('Last ayah.'),
});

const regionId = z.string().regex(/^[a-z0-9_]+$/, 'lowercase id with underscores');
const lngLat = z.tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)]);

/**
 * content/territories/regions.json: the region shapes of the territory map, in the sources' own units
 * (junds, kuwar, tribal lands). Drawn by hand past the coast and clipped to Natural Earth at build.
 */
export const territoryRegionsSchema = z.strictObject({
  note: text.describe('How the shapes were made.'),
  regions: z.array(
    z.strictObject({
      id: regionId.describe('Region id; the ledger names it.'),
      nameAr: text.describe('Region name (its label on the map, unless a ledger row gives another).'),
      kind: z.enum(['city', 'province', 'tribal']).describe("A town and its land, a named unit in the sources, or where a tribe's pastures lay."),
      ring: z.array(lngLat).min(3).describe('Outline, `[longitude, latitude]` points. Earlier regions win where two overlap; gaps stay unclaimed.'),
    }),
  ).describe('The shapes.'),
});

export const TERRITORY_KINDS = ['state', 'city', 'client', 'treaty', 'contested', 'tribal'] as const;

/** content/territories/holders.json: the names of whoever holds land on the map. */
export const territoryHoldersSchema = z.strictObject({
  holders: z.array(
    z.strictObject({
      id: regionId.describe('Holder id; the ledger names it. Its colors are the `--sys-terr-<id>` tokens in src/index.css.'),
      nameAr: text.describe('Name on the map and in the legend.'),
      shortAr: text.optional().describe('Shorter name for phones.'),
      labelAt: lngLat.optional().describe('Where the name goes, when the middle of the land is a poor place for it.'),
      names: z.array(z.strictObject({
        fromEvent: text.describe('From this event on the holder has the name below.'),
        nameAr: text.describe('The name from then on.'),
      })).optional().describe('Later names, in date order.'),
    }),
  ).describe('The holders.'),
  kinds: z.strictObject({
    treaty: text.describe('Legend line for land on terms.'),
    contested: text.describe('Legend line for contested land.'),
    tribal: text.describe('Legend line for tribal land.'),
  }).describe('Legend lines of the kinds of hold that are not named after a holder.'),
  uncertainAr: text.describe('Legend line for land whose row is marked uncertain.'),
});

const territoryCiteSchema = z.strictObject({
  b: text.describe('Book key (docs/territories/README.md).'),
  p: z.number().int().positive().describe("The site's page id."),
  q: text.describe('The exact phrase; scripts/territories/checkLedger.ts confirms it is on that page.'),
  printed: z.string().optional().describe('The printed page.'),
});

/**
 * One row of content/territories/ledger/*.json: one change of hold. A region's holder at any date is
 * its latest row at or before that date. A row with an event takes that event's date.sortKey, so
 * the map and the timeline cannot drift apart; only a row with no event has its own date.
 */
export const territoryLedgerRowSchema = z
  .strictObject({
    r: z.union([regionId, z.array(regionId).min(1)]).describe('Region id, or a list of them.'),
    at: z.number().min(0).optional().describe('Gregorian year with a fraction, for a row with no event; `0` means before the timeline starts.'),
    ev: text.optional().describe('The event that causes the change. The row then has no `at`.'),
    h: regionId.describe('Holder id.'),
    k: z.enum(TERRITORY_KINDS).describe('Kind of hold.'),
    c: z.enum(['proven', 'likely', 'uncertain']).describe('How sure: quoted, implied, or drawn from context.'),
    cite: z.array(territoryCiteSchema).optional().describe('The sources.'),
    n: z.string().optional().describe('Why it is uncertain, what else is reported.'),
    name: text.optional().describe("The region's label from this row on."),
  })
  .refine(row => (row.ev === undefined) !== (row.at === undefined), { message: 'a row has either "ev" or "at", not both' });
export const territoryLedgerSchema = z.array(territoryLedgerRowSchema);

const lines = z.strictObject({ type: z.enum(['LineString', 'MultiLineString']), coordinates: z.array(z.unknown()) });
const polygonal = z.strictObject({ type: z.enum(['Polygon', 'MultiPolygon']), coordinates: z.array(z.unknown()) });
/** content/territories/land.json and rivers.json: Natural Earth, written by scripts/territories/buildLand.ts. */
export const territoryLandSchema = z.array(polygonal);
export const territoryRiversSchema = z.array(lines);

/** content/quran/verses.json, written by scripts/fetch-quran.ts; never edited by hand. */
export const quranVersesSchema = z.strictObject({
  source: text.describe('Where the text was fetched from.'),
  fetchedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe('The day the text was fetched.'),
  verses: z.record(z.string().regex(/^\d+:\d+$/), text).describe('"surah:ayah" → Uthmani text as Quran.com serves it.'),
});


export type Era = z.infer<typeof eraSchema>;
export type Category = z.infer<typeof categorySchema>;
export type Count = z.infer<typeof countSchema>;
export type ContentEvent = z.infer<typeof eventSchema>;
export type EventIcon = (typeof EVENT_ICONS)[number];
export type Person = z.infer<typeof personSchema>;
export type City = z.infer<typeof citySchema>;
export type QuranPassage = z.infer<typeof quranPassageSchema>;
export type QuranVerses = z.infer<typeof quranVersesSchema>;
export type TerritoryRegions = z.infer<typeof territoryRegionsSchema>;
export type TerritoryHolders = z.infer<typeof territoryHoldersSchema>;
export type TerritoryLedgerRow = z.infer<typeof territoryLedgerRowSchema>;
export type TerritoryKind = (typeof TERRITORY_KINDS)[number];

/** One drawn area: one holder's land of one kind, or one tribe's. */
export interface GeneratedTerritoryShape {
  holder: string;
  kind: TerritoryKind;
  /** The row behind it is marked uncertain, so it must look uncertain. */
  uncertain: boolean;
  nameAr: string;
  /** The outline: polygons of rings, each ring as text (shared/territoryMap.ts). */
  rings: string[][];
}
export interface TerritoryLabel {
  text: string;
  /** Shorter text for phones. */
  short?: string;
  lat: number;
  lng: number;
  /** 1 realm, 2 small realm, 3 region, 4 province under a state. */
  level: number;
  kind: TerritoryKind;
  holder: string;
}
export interface TerritoryLegendItem {
  holder: string;
  kind: TerritoryKind | 'uncertain';
  text: string;
}
/** The map between two changes: `from` is inclusive, `to` exclusive, on the date.sortKey scale. */
export interface GeneratedTerritoryPeriod {
  from: number;
  to?: number;
  /** Indexes into `shapes`, largest land first. */
  areas: number[];
  labels: TerritoryLabel[];
  legend: TerritoryLegendItem[];
  /** The events that cause this period's changes. */
  causes: string[];
}
/** src/generated/territories.json: the whole map, precomputed at build, loaded on demand. */
export interface GeneratedTerritoryMap {
  rivers: (LineString | MultiLineString)[];
  shapes: GeneratedTerritoryShape[];
  periods: GeneratedTerritoryPeriod[];
}
/** A passage as src/generated/quranPassages.json carries it (scripts/build-content.ts). */
export type GeneratedQuranPassage = QuranPassage & { text: string; link: string };

// Narration manifest, public/audio/manifest.json (Phase 3D; shared/narration.ts).
export const narrationEntrySchema = z.strictObject({
  file: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*\.(title|description)\.[0-9a-f]{8}\.m4a$/),
  /** SHA-256 (hex) of the normalized text the recording says. */
  textHash: z.string().regex(/^[0-9a-f]{64}$/),
  durationSec: z.number().positive(),
  /** What made it, e.g. `gemini` (the 2026 recordings) or `voicestudio/omnivoice`. */
  engine: z.string().min(1),
  voice: z.string().min(1),
});
export type NarrationEntry = z.infer<typeof narrationEntrySchema>;

export const narrationManifestSchema = z.strictObject({
  events: z.record(
    z.string(),
    z.strictObject({ title: narrationEntrySchema.optional(), description: narrationEntrySchema.optional() }),
  ),
});
export type NarrationManifest = z.infer<typeof narrationManifestSchema>;
