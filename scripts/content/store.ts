/**
 * Reads content/ and checks it: every file against its Zod schema
 * (shared/contentSchema.ts), file names against ids, and every link between
 * records (era, category, person, Qur'an passage; battle replays are not checked). Used by
 * scripts/build-content.ts (which then emits src/generated/) and by the tests.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { z } from 'zod';
import {
  categorySchema,
  citySchema,
  eraSchema,
  eventSchema,
  personSchema,
  quranPassageSchema,
  quranVersesSchema,
  territoryControlSchema,
  territoryRegionsSchema,
  type Category,
  type City,
  type ContentEvent,
  type Era,
  type Person,
  type GeneratedQuranPassage,
  type TerritoryControl,
  type TerritoryRegions,
} from '../../shared/contentSchema';
import { checkTerritories } from './territories';
import { passageLink, passageText, passageVerseKeys } from '../../shared/quranText';
import { eventSlug, isLowerSlug } from '../../shared/routes';

export interface ContentSet {
  eras: Era[];
  categories: Category[];
  /** In timeline order: by date.sortKey, then date.tieOrder. */
  events: ContentEvent[];
  /** In the curated order of content/people-order.json. */
  people: Person[];
  /** By id. */
  cities: City[];
  /** With the verse text from content/quran/verses.json. */
  quranPassages: GeneratedQuranPassage[];
}

export interface ContentIssue {
  /** Path relative to content/, e.g. "events/battle-badr.json". */
  file: string;
  message: string;
}

/** A file's parsed JSON, before validation. */
export interface RawFile {
  file: string;
  data: unknown;
}

export interface RawContent {
  eras: RawFile;
  categories: RawFile;
  events: RawFile[];
  people: RawFile[];
  peopleOrder: RawFile;
  cities: RawFile[];
  quranPassages: RawFile;
  quranVerses: RawFile;
  territoryRegions: RawFile;
  territoryControl: RawFile;
}

/** The territory files, validated; scripts/content/territories.ts turns them into polygons. */
export interface TerritorySource {
  regions: TerritoryRegions;
  control: TerritoryControl;
}

export const passageRange = (p: { surah: number; from: number; to: number }): string => `${p.surah}:${p.from}-${p.to}`;

function readJson(dir: string, file: string, issues: ContentIssue[]): RawFile {
  const path = join(dir, file);
  if (!existsSync(path)) {
    issues.push({ file, message: 'missing file' });
    return { file, data: undefined };
  }
  try {
    return { file, data: JSON.parse(readFileSync(path, 'utf8')) };
  } catch (error) {
    issues.push({ file, message: `invalid JSON: ${(error as Error).message}` });
    return { file, data: undefined };
  }
}

function readJsonDir(dir: string, sub: string, issues: ContentIssue[]): RawFile[] {
  const path = join(dir, sub);
  if (!existsSync(path)) {
    issues.push({ file: sub, message: 'missing folder' });
    return [];
  }
  return readdirSync(path)
    .filter(name => name.endsWith('.json'))
    .sort()
    .map(name => readJson(dir, `${sub}/${name}`, issues));
}

/** Reads every content file; JSON syntax errors become issues. */
export function readContent(dir: string): { raw: RawContent; issues: ContentIssue[] } {
  const issues: ContentIssue[] = [];
  const raw: RawContent = {
    eras: readJson(dir, 'eras.json', issues),
    categories: readJson(dir, 'categories.json', issues),
    events: readJsonDir(dir, 'events', issues),
    people: readJsonDir(dir, 'people', issues),
    peopleOrder: readJson(dir, 'people-order.json', issues),
    cities: readJsonDir(dir, 'cities', issues),
    quranPassages: readJson(dir, 'quran/passages.json', issues),
    quranVerses: readJson(dir, 'quran/verses.json', issues),
    territoryRegions: readJson(dir, 'territories/regions.json', issues),
    territoryControl: readJson(dir, 'territories/control.json', issues),
  };
  return { raw, issues };
}

function parse<T>(schema: z.ZodType<T>, raw: RawFile, issues: ContentIssue[], where = raw.file): T | undefined {
  const result = schema.safeParse(raw.data);
  if (result.success) return result.data;
  for (const issue of result.error.issues) {
    issues.push({ file: where, message: `${issue.path.join('.') || '(record)'}: ${issue.message}` });
  }
  return undefined;
}

function parseList<T>(schema: z.ZodType<T>, raw: RawFile, issues: ContentIssue[]): T[] {
  if (!Array.isArray(raw.data)) {
    if (raw.data !== undefined) issues.push({ file: raw.file, message: 'expected a list' });
    return [];
  }
  return raw.data.flatMap((item, index) => {
    const parsed = parse(schema, { file: raw.file, data: item }, issues, `${raw.file} [${index}]`);
    return parsed === undefined ? [] : [parsed];
  });
}

/** One record per file, named after its id. */
function parseRecords<T extends { id: string }>(schema: z.ZodType<T>, files: RawFile[], issues: ContentIssue[]): T[] {
  return files.flatMap(raw => {
    const record = parse(schema, raw, issues);
    if (!record) return [];
    const expected = `${record.id}.json`;
    if (!raw.file.endsWith(`/${expected}`)) issues.push({ file: raw.file, message: `file name must be ${expected}` });
    return [record];
  });
}

function checkUnique<T>(
  items: T[],
  key: (item: T) => string,
  file: (item: T) => string,
  what: string,
  issues: ContentIssue[],
): void {
  const seen = new Set<string>();
  for (const item of items) {
    const k = key(item);
    if (seen.has(k)) issues.push({ file: file(item), message: `duplicate ${what} "${k}"` });
    seen.add(k);
  }
}

/**
 * Validates the content and every link. Returns the ordered content set, or
 * the issues found (an empty list means the content is valid).
 */
export function checkContent(
  raw: RawContent,
): { content: ContentSet; territories: TerritorySource | undefined; issues: ContentIssue[] } {
  const issues: ContentIssue[] = [];
  const eras = parseList(eraSchema, raw.eras, issues).sort((a, b) => a.order - b.order);
  const categories = parseList(categorySchema, raw.categories, issues);
  const events = parseRecords(eventSchema, raw.events, issues);
  const people = parseRecords(personSchema, raw.people, issues);
  const cities = parseRecords(citySchema, raw.cities, issues).sort((a, b) => a.id.localeCompare(b.id));
  const quranPassages = parseList(quranPassageSchema, raw.quranPassages, issues);

  const eventFile = (e: ContentEvent) => `events/${e.id}.json`;
  checkUnique(
    eras,
    e => e.id,
    () => raw.eras.file,
    'era id',
    issues,
  );
  checkUnique(
    eras,
    e => String(e.order),
    () => raw.eras.file,
    'era order',
    issues,
  );
  checkUnique(
    categories,
    c => c.id,
    () => raw.categories.file,
    'category id',
    issues,
  );
  checkUnique(
    quranPassages,
    p => p.key,
    () => raw.quranPassages.file,
    'passage key',
    issues,
  );
  checkUnique(quranPassages, passageRange, () => raw.quranPassages.file, 'passage range', issues);
  for (const p of quranPassages) {
    if (p.from > p.to)
      issues.push({ file: raw.quranPassages.file, message: `${p.key}: verse range ends before it starts` });
  }

  // Verse text: every passage verse fetched from Quran.com (scripts/fetch-quran.ts).
  const verses = parse(quranVersesSchema, raw.quranVerses, issues)?.verses ?? {};
  const generatedPassages: GeneratedQuranPassage[] = quranPassages.flatMap(p => {
    const missing = passageVerseKeys(p).filter(key => verses[key] === undefined);
    if (missing.length > 0) {
      if (raw.quranVerses.data !== undefined) {
        issues.push({
          file: raw.quranVerses.file,
          message: `${p.key}: no text for verse ${missing.join(', ')}; run npm run fetch:quran`,
        });
      }
      return [];
    }
    return [{ ...p, text: passageText(p, verses) as string, link: passageLink(p) }];
  });

  // People order: every person exactly once.
  const peopleById = new Map(people.map(p => [p.id, p]));
  const order = Array.isArray(raw.peopleOrder.data) ? (raw.peopleOrder.data as unknown[]) : [];
  if (raw.peopleOrder.data !== undefined && !Array.isArray(raw.peopleOrder.data)) {
    issues.push({ file: raw.peopleOrder.file, message: 'expected a list of person ids' });
  }
  const listed = new Set<string>();
  for (const id of order) {
    if (typeof id !== 'string' || !peopleById.has(id))
      issues.push({ file: raw.peopleOrder.file, message: `unknown person id "${String(id)}"` });
    else if (listed.has(id)) issues.push({ file: raw.peopleOrder.file, message: `"${id}" is listed twice` });
    else listed.add(id);
  }
  for (const person of people) {
    if (!listed.has(person.id))
      issues.push({ file: raw.peopleOrder.file, message: `"${person.id}" is missing from the list` });
  }

  // Links from events.
  const eraIds = new Set(eras.map(e => e.id));
  const categoryIds = new Set(categories.map(c => c.id));
  const passageRanges = new Set(quranPassages.map(passageRange));
  for (const event of events) {
    const file = eventFile(event);
    if (!eraIds.has(event.eraId)) issues.push({ file, message: `unknown era "${event.eraId}"` });
    if (!categoryIds.has(event.categoryId)) issues.push({ file, message: `unknown category "${event.categoryId}"` });
    for (const ref of [...event.keyFigures, ...event.roles]) {
      if (!peopleById.has(ref.personId))
        issues.push({ file, message: `unknown person "${ref.personId}" (${ref.labelAr})` });
    }
    for (const ref of event.quran) {
      if (!passageRanges.has(passageRange(ref))) {
        issues.push({ file, message: `no Quran passage ${passageRange(ref)} in quran/passages.json (${ref.labelAr})` });
      }
    }
    // battleScenarioId is not checked: battle replays are left out of every check until they are
    // replaced by videos (Mostafa, 2026-10-17).
    if (event.date.gregorian.year !== Math.floor(event.date.sortKey)) {
      issues.push({ file, message: 'date.gregorian.year must be the whole-number part of date.sortKey' });
    }
  }
  checkUnique(events, e => e.id, eventFile, 'event id', issues);
  // Addresses (/event/<slug>/): lowercase ASCII, one per event, and never
  // another event's id (an old link by id must reach that event).
  for (const event of events) {
    if (event.slug === undefined && !isLowerSlug(eventSlug(event))) {
      issues.push({ file: eventFile(event), message: 'the id is not a lowercase ASCII slug: set slug' });
    }
  }
  checkUnique(events, eventSlug, eventFile, 'event slug', issues);
  const idOwners = new Map(events.map(e => [e.id, e]));
  for (const event of events) {
    const owner = idOwners.get(eventSlug(event));
    if (owner && owner !== event) {
      issues.push({ file: eventFile(event), message: `slug "${eventSlug(event)}" is the id of ${owner.id}` });
    }
  }
  const eventsById = new Map(events.map(e => [e.id, e]));
  for (const era of eras) {
    if (era.anchorEventId === undefined) continue;
    const anchor = eventsById.get(era.anchorEventId);
    if (!anchor) issues.push({ file: raw.eras.file, message: `${era.id}: unknown anchorEventId "${era.anchorEventId}"` });
    else if (anchor.eraId !== era.id)
      issues.push({ file: raw.eras.file, message: `${era.id}: anchorEventId "${anchor.id}" belongs to era "${anchor.eraId}"` });
  }

  // Events that share a sortKey need distinct tieOrder values; others need none.
  const bySortKey = new Map<number, ContentEvent[]>();
  for (const event of events) bySortKey.set(event.date.sortKey, [...(bySortKey.get(event.date.sortKey) ?? []), event]);
  for (const group of bySortKey.values()) {
    if (group.length === 1) {
      if (group[0].date.tieOrder !== undefined) {
        issues.push({
          file: eventFile(group[0]),
          message: 'date.tieOrder is only for events that share a date.sortKey',
        });
      }
      continue;
    }
    for (const event of group) {
      if (event.date.tieOrder === undefined) {
        const others = group
          .filter(e => e !== event)
          .map(e => e.id)
          .join(', ');
        issues.push({
          file: eventFile(event),
          message: `shares date.sortKey ${event.date.sortKey} with ${others}: set date.tieOrder`,
        });
      }
    }
    checkUnique(
      group.filter(e => e.date.tieOrder !== undefined),
      e => String(e.date.tieOrder),
      eventFile,
      `tieOrder at sortKey ${group[0].date.sortKey}:`,
      issues,
    );
  }
  events.sort((a, b) => a.date.sortKey - b.date.sortKey || (a.date.tieOrder ?? 0) - (b.date.tieOrder ?? 0));

  const orderedPeople = order.flatMap(id => {
    const person = typeof id === 'string' ? peopleById.get(id) : undefined;
    return person ? [person] : [];
  });

  // Territories: every land region has one owner in each period.
  const territoryRegions = parse(territoryRegionsSchema, raw.territoryRegions, issues);
  const territoryControl = parse(territoryControlSchema, raw.territoryControl, issues);
  let territories: TerritorySource | undefined;
  if (territoryRegions && territoryControl) {
    const territoryIssues = checkTerritories(territoryRegions, territoryControl, raw.territoryControl.file);
    issues.push(...territoryIssues);
    if (territoryIssues.length === 0) territories = { regions: territoryRegions, control: territoryControl };
  }

  return {
    content: { eras, categories, events, people: orderedPeople, cities, quranPassages: generatedPassages },
    territories,
    issues,
  };
}
