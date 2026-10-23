# Content guide

How to add and edit Nibras content: events, people, cities, Qur'an passages, eras, categories and
territories. Replaces the old `ADDING_NEW_CONTENT_GUIDE.md`, which described the data files removed in
Phase 1.

All content lives in `content/` as JSON files in git. There is no database for content. The content
build (`scripts/build-content.ts`) checks every file against its Zod schema
(`shared/contentSchema.ts`) and every link between records, then writes the data the app loads to
`src/generated/` (not in git). The field reference at the end of this guide is generated from those
schemas.

## Ground rules

1. **Never change the meaning of reviewed text.** The Arabic text of events, people, cities, battles and
   Qur'an passages is reviewed historical and religious content. Moving it between fields or files is
   fine; rewording, re-vocalizing, shortening or "fixing" it is not. Put factual conflicts on a list
   for Mostafa instead.
2. **Never type Qur'an text.** Verse text comes only from Quran.com, fetched by `npm run fetch:quran`
   into `content/quran/verses.json` (see [Qur'an passages](#quran-passages)).
3. **Ids and addresses are permanent.** Records link to each other by id. An event's public address is
   `/event/<slug>/` (its `slug`, or its id with `_` → `-`); a person's is `/person/<id>/`. Never rename
   an id or change a slug once published. For a new event, choose a lowercase ASCII id such as
   `battle-of-siffin`, so it needs no separate slug.
4. **Search before adding.** Look for the event, person or city first (`content/events/`,
   `content/people/`, `content/cities/`, or search inside the app), so nothing is added twice.
5. **Cite sources.** Every event lists its `sources`. Check dates, places and numbers against more
   than one of the sources below.

### Reliable sources

- السيرة النبوية: سيرة ابن هشام؛ الرحيق المختوم (صفي الرحمن المباركفوري)؛ زاد المعاد (ابن القيم)
- التاريخ الإسلامي: البداية والنهاية (ابن كثير)؛ تاريخ الطبري؛ الكامل في التاريخ (ابن الأثير)
- تراجم الصحابة: الإصابة في تمييز الصحابة (ابن حجر)؛ أسد الغابة (ابن الأثير)؛ الاستيعاب (ابن عبد البر)
- المواقع الإلكترونية: الدرر السنية؛ إسلام ويب؛ قصة الإسلام

The event texts follow the classical sources the app cites (Ibn Ishaq via Ibn Hisham, al-Tabari),
also for army sizes; see the 2026-10-16 decisions in `docs/REFACTOR_PROGRESS.md`.

## Layout

```
content/
  eras.json                 fixed list of the six eras
  categories.json           fixed list of the seven marker categories
  events/<id>.json          one file per event (the file name is the id)
  people/<id>.json          one file per companion or figure
  people-order.json         the order of people in lists (every person exactly once)
  cities/<id>.json          one file per city
  quran/passages.json       the passages events cite: {key, surah, from, to}
  quran/verses.json         verse text from Quran.com (written by npm run fetch:quran)
  territories/regions.json  the territory map's seed points and land outline
  territories/control.json  who holds each region, period by period
  battle-videos/<event id>/ a battle video's captions.ar.vtt, transcript.txt and sources.md
```

## Adding or editing an event

1. Create `content/events/<id>.json`, or edit the existing file. New ids are lowercase words joined by
   hyphens (`battle-of-badr`); some older ids contain Arabic or underscores and stay as they are.
2. Fill in the fields in the [field reference](#event-contenteventsidjson). Things to watch:
   - **Coordinates are `[latitude, longitude]`**: Mecca is `[21.4225, 39.8262]`, not
     `[39.8262, 21.4225]`. Take them from OpenStreetMap or Google Maps (right-click the place) with
     four decimals.
   - **Dates.** `date.sortKey` orders the timeline and picks the territory map: the Gregorian year
     with a fraction for the time of year (e.g. `624.2`). `date.gregorian.year` must be its
     whole-number part. `date.hijri.year` is negative before the Hijra (the Year of the Elephant is
     `-53`). `date.labelAr` is the date exactly as the panel shows it.
   - **Two events on the same `sortKey`** each need a `date.tieOrder` (0, 1, …) that sets their order.
   - **People**: each entry in `keyFigures` and `roles` points to a person by `personId`. `labelAr`
     is the text shown; it should be one of the person's names or aliases, since a test checks that
     each label finds its person (`tests/appFixes.test.ts`). Add an alias to the person if it does not.
   - **Qur'an chips**: each `{surah, from, to}` needs a matching passage in `content/quran/passages.json`.
   - **Battle replay**: `battleScenarioId` must be a replay registered in
     `src/battlefield/scenarios/index.ts`. The replay shows the event's title and date.
   - `isBattle` and `icon` are stored per event and never derived from the title.
3. Run `npm run validate:content`. It lists every problem with its file.

## Adding or editing a person

1. Create `content/people/<id>.json` (lowercase, hyphens: `muadh-ibn-jabal`).
2. Add the id to `content/people-order.json`, where it should appear in lists. The build fails if a
   person is missing from that list or listed twice.
3. Give `aliases` every form of the name a text or a question may use: the short name, the kunya,
   the title, the name after a preposition. For example, Abu Bakr: «أبو بكر الصديق», «أبو بكر»,
   «أبي بكر», «الصديق», «عبد الله بن أبي قحافة». An alias must belong to this person only: a bare
   «أبو سفيان» was removed from Abu Sufyan ibn al-Harith because it names Abu Sufyan ibn Harb.

## Adding or editing a city

Create or edit `content/cities/<id>.json`; coordinates are `[latitude, longitude]` as for events.

## Qur'an passages

1. Add `{key, surah, from, to}` to `content/quran/passages.json`. `key` is a label such as
   «سورة الفيل: 1-5»; once used it is frozen (the chat assistant cites it).
2. Run `npm run fetch:quran` (needs the network). It fetches the Uthmani text from the Quran.com API
   into `content/quran/verses.json` and prints every verse that is new or changed. Commit the file;
   builds and CI stay offline.
3. Never edit `verses.json` by hand. The chat KB build also checks the text against the Tanzil copy
   in `scripts/data/tanzil/`.

## Adding a battle video

A battle with a video opens it instead of its replay, from the event panel's «مشاهدة المعركة» and
from `/battle/<battleScenarioId>/`. The video is hosted on YouTube; the site shows it with its own
Arabic controls and captions. The video file itself is not needed by the site (Mostafa keeps the
originals); deliveries arrive in `Video/<battle>/`, which git ignores.

1. Upload the video to YouTube as **unlisted**, with embedding allowed. Its id is the part after
   `youtu.be/`.
2. Copy the three reviewed files, unchanged, into `content/battle-videos/<event id>/`:
   `captions.ar.vtt` (timed Arabic captions), `transcript.txt` (the narration script: one line per
   paragraph, each starting with its `[voice direction]`) and `sources.md` (the facts table: script
   line → claim → source). Copy the 1280×720 poster to `public/videos/<event id>/poster.jpg`.
3. Add `battleVideo: { "provider": "youtube", "id": "…", "durationSec": … }` to the event (it must
   have `isBattle: true` and a `battleScenarioId`).
4. Qur'an recitations: give each such cue an id, `quran-<surah>-<ayah>` for a whole verse or
   `quran-<surah>-<ayah>-part` for part of one, with the recited words inside ﴿ ﴾. Run
   `npm run fetch:quran`: the site shows Quran.com's words, never the caption's own.
5. Run `npm run build:content`. It fails, naming the cue or line, if a caption differs from the
   transcript (voice directions aside), cues overlap or run past `durationSec`, a recitation is not
   in the verse its id names, or a `sources.md` row points to a line the script does not have.
6. Run `npm run build:chat-kb` (the chat reads the captions with their sources: only the Arabic book
   references are shown) and `npm run verify`.

## Eras, categories and territories

- `content/eras.json` and `content/categories.json` are fixed lists that the code relies on (era
  colours in `src/utils/eraColors.ts`, the era filter, the map legend). A new era or category is a
  code change: ask Mostafa first.
- Territories: `content/territories/control.json` lists, for each period of the `date.sortKey`
  scale, who holds every land region. Periods join up (each `from` is the previous `to`) and every
  land region has exactly one owner in each. The build precomputes the map polygons from it. The
  borders are approximate (the map legend says so).

## After a change

| What changed | Also do |
| --- | --- |
| Anything in `content/` | `npm run validate:content`, then check it in the app (`npm run dev`): the marker on the map, the date on the timeline, search, the panel. |
| Events, people, cities, passages | Rebuild the chat assistant's knowledge base: `npm run build:chat-kb`, commit `api/_data/chat-kb.json`. Then, on the pull request's branch, run GitHub → Actions → **Chat index** → Run workflow: it embeds the changed units (Gemini free tier, one text each) and commits `api/_data/chat-embeddings-gemini.json`; CI fails until it has (`npm run check:chat-index`). |
| An event's `title` or `fullDescription` | Its narration no longer matches: recordings are keyed by a hash of the text (`public/audio/`). `node scripts/verify-all-audio.js` lists what is missing. Generating narration uses Gemini quota: ask Mostafa first. |
| Any shown text or link | `tests/baseline/content.json` (the content snapshot) will differ and `npm run verify` fails. Write the list of intended differences for Mostafa; after his approval, `npx tsx scripts/baseline/content-snapshot.ts --update`. Never update a baseline only to make a test pass. |
| A schema field (`shared/contentSchema.ts`) | `npm run docs:content` rewrites the field reference below. |

Before a pull request, run `npm run verify` (see `README.md` and `CLAUDE.md`).

## Field reference

Generated from `shared/contentSchema.ts` by `npm run docs:content`; a test fails when it is out of
date. "Required" fields must be present; a "text" field must not be empty. Every record is strict:
a field not listed here is an error.

<!-- field-reference:start (generated by npm run docs:content; do not edit by hand) -->

### Event: `content/events/<id>.json`

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | id usable as a file name (no spaces) | yes | Permanent id and file name (`content/events/<id>.json`). Never rename. |
| `slug` | slug (`a-z`, `0-9`, `-`) |  | The event's address, `/event/<slug>/`. Defaults to the id with `_` → `-`; required when the id is not lowercase ASCII. Never change it once published. |
| `eraId` | slug (`a-z`, `0-9`, `-`) | yes | An `id` from `content/eras.json`. |
| `categoryId` | slug (`a-z`, `0-9`, `-`) | yes | An `id` from `content/categories.json`; sets the marker colour. |
| `isBattle` | true / false | yes | Counted by the "battles" filter. Stored, never guessed from the title. |
| `icon` | one of `skull`, `crown`, `swords`, `flag`, `book`, `scroll`, `tent`, `pin` | yes | Marker icon. |
| `isMajor` | true / false |  | Drawn as a larger diamond on the timeline. |
| `title` | text | yes | Title as the panel and the timeline show it. |
| `date` | object | yes | When it happened. |
| `date.sortKey` | number | yes | Orders the timeline and picks the territory map (Gregorian year with a fraction). Keep the existing values. |
| `date.tieOrder` | integer ≥ 0 |  | Only on events that share a `sortKey`: their order on the timeline (0, 1, 2, …). |
| `date.gregorian` | object | yes |  |
| `date.gregorian.year` | integer | yes | Gregorian year; must be the whole-number part of `sortKey`. |
| `date.hijri` | object |  | Only where the sources give a Hijri year. |
| `date.hijri.year` | integer | yes | Hijri year, negative before the Hijra. |
| `date.labelAr` | text | yes | The date as the panel shows it, e.g. «17 رمضان، 2 هـ». |
| `location` | object | yes | Where it happened. |
| `location.nameAr` | text | yes | Place name as the panel shows it. |
| `location.coordinates` | pair `[number, number]` | yes | Marker position, `[latitude, longitude]`. |
| `summary` | text | yes | Short text on the panel; searched with the title and full description. |
| `fullDescription` | text | yes | The narrated text (its audio file is keyed by this text). |
| `courseOfEvents` | list of text | yes | "Course of events" list, one entry per step. |
| `durationAr` | text |  | Duration, as the sources give it (used by the chat assistant; not shown on the panel). |
| `forces` | object |  | Force sizes for the panel. |
| `forces.army` | object |  | The Muslims' force. |
| `forces.army.textAr` | text | yes | The size as the text gives it, verbatim, e.g. «حوالي ٣١٣ مقاتلا». |
| `forces.army.value` | integer ≥ 1 |  | The number, when the text states one plainly. |
| `forces.army.min` | integer ≥ 1 |  | Lower bound, when the text gives a range. |
| `forces.army.max` | integer ≥ 1 |  | Upper bound, when the text gives a range. |
| `forces.army.approx` | true / false |  | The text says "about" (حوالي، نحو، قرابة، …). |
| `forces.enemyArmy` | object |  | The opponents' force. |
| `forces.enemyArmy.textAr` | text | yes | The size as the text gives it, verbatim, e.g. «حوالي ٣١٣ مقاتلا». |
| `forces.enemyArmy.value` | integer ≥ 1 |  | The number, when the text states one plainly. |
| `forces.enemyArmy.min` | integer ≥ 1 |  | Lower bound, when the text gives a range. |
| `forces.enemyArmy.max` | integer ≥ 1 |  | Upper bound, when the text gives a range. |
| `forces.enemyArmy.approx` | true / false |  | The text says "about" (حوالي، نحو، قرابة، …). |
| `keyFigures` | list of objects | yes | People chips. |
| `keyFigures[].personId` | slug (`a-z`, `0-9`, `-`) | yes | An `id` from `content/people/`. |
| `keyFigures[].labelAr` | text | yes | The text the chip shows. |
| `roles` | list of objects | yes | "Roles in the event" list. |
| `roles[].personId` | slug (`a-z`, `0-9`, `-`) | yes | An `id` from `content/people/`. |
| `roles[].labelAr` | text | yes | The name as the list shows it. |
| `roles[].roleAr` | text | yes | The person's role in the event. |
| `quran` | list of objects | yes | Qur'an chips; each needs a passage in `content/quran/passages.json`. |
| `quran[].surah` | integer 1–114 | yes | Surah number. |
| `quran[].from` | integer ≥ 1 | yes | First ayah. |
| `quran[].to` | integer ≥ 1 | yes | Last ayah. |
| `quran[].labelAr` | text | yes | The text the chip shows. |
| `hadith` | list of text | yes | Hadith references, as shown. |
| `sources` | list of text | yes | Sources, as shown. |
| `battleScenarioId` | slug (`a-z`, `0-9`, `-`) |  | Battle replay (`src/battlefield/scenarios`), e.g. `battle-of-badr`. |
| `battleVideo` | object |  | The battle's narrated video; it opens instead of the replay. Needs `battleScenarioId` (its address) and the folder `content/battle-videos/<id>/` (see "Adding a battle video"). |
| `battleVideo.provider` | `"youtube"` | yes | Where the video is hosted. Only `youtube` (unlisted, embeddable) for now. |
| `battleVideo.id` | text matching `^[A-Za-z0-9_-]{11}$` | yes | The YouTube video id, e.g. `HCQru0jnWeA` from `https://youtu.be/HCQru0jnWeA`. |
| `battleVideo.durationSec` | integer ≥ 1 | yes | Length in whole seconds, rounded up; every caption must end by then. |
| `route` | list of pair `[number, number]` (at least 2) |  | A route drawn on the map, `[latitude, longitude]` points. |

### Person: `content/people/<id>.json`

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | slug (`a-z`, `0-9`, `-`) | yes | Permanent id and file name (`content/people/<id>.json`). |
| `name` | text | yes | Full name, the heading of the person window. |
| `title` | text (may be empty) | yes | Title or kunya. |
| `role` | text (may be empty) | yes | Main role. |
| `bio` | text | yes | Biography in the person window. |
| `birthDeath` | text (may be empty) | yes | Birth and death, as shown. |
| `aliases` | list of text | yes | Other names the chat assistant and the person lookup recognise. |

### City: `content/cities/<id>.json`

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | slug (`a-z`, `0-9`, `-`) | yes | Permanent id and file name (`content/cities/<id>.json`). |
| `name` | text | yes | City name. |
| `coordinates` | pair `[number, number]` | yes | `[latitude, longitude]`. |
| `description` | text | yes | Description. |
| `significance` | text | yes | Why the city matters. |

### Era: `content/eras.json`

A list of objects, each with these fields.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | slug (`a-z`, `0-9`, `-`) | yes | Permanent id, e.g. `medinan`. Events point to it with `eraId`. |
| `nameAr` | text | yes | Era name on the timeline and in search, e.g. «خلافة الفاروق». |
| `panelTitleAr` | text | yes | The badge on the event panel; both prophetic eras show «عهد النبوة». |
| `rulerAr` | text | yes | The ruler the event panel names for this era. |
| `colorKey` | one of `prophetic`, `abuBakr`, `umar`, `uthman`, `ali` | yes | Colour scheme in `src/utils/eraColors.ts`. |
| `group` | one of `prophet`, `rashidun` | yes | The era filter: the Prophet's era or the Rashidun caliphate. |
| `order` | integer | yes | Position on the timeline (ascending). |
| `anchorEventId` | id usable as a file name (no spaces) |  | The event the timeline's era button jumps to (the era's start). When a filter hides it, the button goes to the first shown event of the era from this date on. |

### Category: `content/categories.json`

A list of objects, each with these fields.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | slug (`a-z`, `0-9`, `-`) | yes | Permanent id, e.g. `battle`. Events point to it with `categoryId`. |
| `nameAr` | text | yes | Same wording as the map legend in the help window. |
| `color` | colour `#rrggbb` | yes | Marker colour (lowercase hex). |

### Qur'an passage: `content/quran/passages.json`

A list of objects, each with these fields.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `key` | text | yes | Frozen key used by the chat assistant and the Qur'an window, e.g. «سورة الفيل: 1-5». |
| `surah` | integer 1–114 | yes | Surah number. |
| `from` | integer ≥ 1 | yes | First ayah. |
| `to` | integer ≥ 1 | yes | Last ayah. |

### Qur'an verses: `content/quran/verses.json`

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `source` | text | yes | Where the text was fetched from. |
| `fetchedOn` | date `YYYY-MM-DD` | yes | The day the text was fetched. |
| `verses` | map of text | yes | "surah:ayah" → Uthmani text as Quran.com serves it. |

### Territory regions: `content/territories/regions.json`

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `landOutline` | list of pair `[number, number]` (at least 4) | yes | Land outline the cells are clipped to, `[longitude, latitude]` points. |
| `regions` | list of objects | yes | Seed points, one map cell each. |
| `regions[].id` | id (`a-z`, `0-9`, `_`) | yes | Region id; control.json lists it under its owner. |
| `regions[].titleAr` | text | yes | Region name (the map label of a group that isn't an empire). |
| `regions[].lng` | number | yes | Seed point longitude. |
| `regions[].lat` | number | yes | Seed point latitude. |
| `regions[].sea` | `true` |  | A sea point: keeps cells from crossing the sea; has no owner. |

### Territory control: `content/territories/control.json`

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `empireGroups` | list of id (`a-z`, `0-9`, `_`) | yes | Groups whose map label is the group name; others show the region's name. |
| `periods` | list of objects (at least 1) | yes | Periods in date order, joining up with no gap. |
| `periods[].from` | number |  | Start, inclusive, on the `date.sortKey` scale (absent on the first period). |
| `periods[].to` | number |  | End, exclusive (absent on the last period). |
| `periods[].owners` | list of objects | yes | Who holds what; every land region exactly once. |
| `periods[].owners[].group` | id (`a-z`, `0-9`, `_`) | yes | Owner id. |
| `periods[].owners[].nameAr` | text | yes | Owner name on the map. |
| `periods[].owners[].color` | colour `#rrggbb` | yes | Shading colour (lowercase hex). |
| `periods[].owners[].regions` | list of id (`a-z`, `0-9`, `_`) (at least 1) | yes | The regions it holds in this period. |

<!-- field-reference:end -->
