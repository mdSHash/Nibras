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
 * content/territories/regions.json: the seed points of the territory map (one
 * Voronoi cell each, clipped to the land outline) and the outline itself, both
 * as [lng, lat]. Sea points only keep cells from crossing the seas.
 */
export const territoryRegionsSchema = z.strictObject({
  landOutline: z.array(lngLat).min(4).describe('Land outline the cells are clipped to, `[longitude, latitude]` points.'),
  regions: z.array(
    z.strictObject({
      id: regionId.describe('Region id; control.json lists it under its owner.'),
      titleAr: text.describe("Region name (the map label of a group that isn't an empire)."),
      lng: z.number().describe('Seed point longitude.'),
      lat: z.number().describe('Seed point latitude.'),
      sea: z.literal(true).optional().describe('A sea point: keeps cells from crossing the sea; has no owner.'),
    }),
  ).describe('Seed points, one map cell each.'),
});

/**
 * content/territories/control.json: who holds each region, period by period.
 * A period runs from `from` (inclusive) to `to` (exclusive) on the event
 * date.sortKey scale; the first has no `from`, the last no `to`. Every land
 * region has exactly one owner per period.
 */
export const territoryControlSchema = z.strictObject({
  empireGroups: z.array(regionId).describe("Groups whose map label is the group name; others show the region's name."),
  periods: z
    .array(
      z.strictObject({
        from: z.number().optional().describe('Start, inclusive, on the `date.sortKey` scale (absent on the first period).'),
        to: z.number().optional().describe('End, exclusive (absent on the last period).'),
        owners: z.array(
          z.strictObject({
            group: regionId.describe('Owner id.'),
            nameAr: text.describe('Owner name on the map.'),
            color: z.string().regex(/^#[0-9a-f]{6}$/).describe('Shading colour (lowercase hex).'),
            regions: z.array(regionId).min(1).describe('The regions it holds in this period.'),
          }),
        ).describe('Who holds what; every land region exactly once.'),
      }),
    )
    .min(1)
    .describe('Periods in date order, joining up with no gap.'),
});

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
export type TerritoryControl = z.infer<typeof territoryControlSchema>;

/** A territory polygon as the map draws it: rings of [lat, lng]. */
export interface TerritoryPolygon {
  name: string;
  color: string;
  coordinates: [number, number][][];
}
export interface TerritoryGroup {
  id: string;
  name: string;
  color: string;
  isEmpire: boolean;
  /** Name of the group's last region (the label of non-empire groups). */
  specificName: string;
  polygons: TerritoryPolygon[];
}
/** src/generated/territories.json: the map for each control period, precomputed at build. */
export interface GeneratedTerritoryPeriod {
  from?: number;
  to?: number;
  groups: TerritoryGroup[];
}
/** A passage as src/generated/quranPassages.json carries it (scripts/build-content.ts). */
export type GeneratedQuranPassage = QuranPassage & { text: string; link: string };
