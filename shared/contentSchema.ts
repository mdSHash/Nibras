/**
 * Zod schemas for the content as it is stored today (Phase 0B): events in
 * src/dataList.json, companions in src/companionsList.ts, cities in
 * src/citiesList.ts. The shapes are strict (an unknown or misspelled field
 * fails) but the values are permissive enough to pass on today's data.
 * Phase 1 replaces these with the schemas for the new content/ layout.
 */
import { z } from 'zod';

const text = z.string().trim().min(1);
const latLng = z.tuple([z.number().min(-90).max(90), z.number().min(-180).max(180)]);

export const eventSchema = z.strictObject({
  id: text,
  era: text,
  category: text,
  title: text,
  is_major_event: z.boolean().optional(),
  date: z.strictObject({
    gregorian: z.number(),
    hijri: z.number().optional(),
    hijri_relative: text,
  }),
  location: z.strictObject({
    name: text,
    coordinates: latLng,
  }),
  details: z.strictObject({
    summary: text,
    full_description: text,
    army_size: text.optional(),
    enemy_army_size: text.optional(),
    duration_days: text.optional(),
    course_of_events: z.array(text),
    companion_roles: z.array(z.strictObject({ name: text, role_in_event: text })).optional(),
  }),
  entities: z.strictObject({
    key_figures: z.array(text),
    quran_refs: z.array(text).optional(),
    hadith_refs: z.array(text).optional(),
    sources: z.array(text),
  }),
  route: z.array(latLng).min(2).optional(),
});

export const companionSchema = z.strictObject({
  id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'lowercase-slug id'),
  name: text,
  title: z.string(),
  role: z.string(),
  description: text,
  birth_death: z.string(),
  aliases: z.array(text),
});

export const citySchema = z.strictObject({
  id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'lowercase-slug id'),
  name: text,
  coordinates: latLng,
  description: text,
  significance: text,
});

export interface ContentIssue {
  collection: 'events' | 'companions' | 'cities';
  id: string;
  message: string;
}

export interface ContentInput {
  events: unknown[];
  companions: unknown[];
  cities: unknown[];
}

function idOf(record: unknown, index: number): string {
  const id = (record as { id?: unknown } | null)?.id;
  return typeof id === 'string' && id ? id : `#${index}`;
}

function check(collection: ContentIssue['collection'], records: unknown[], schema: z.ZodType): ContentIssue[] {
  const issues: ContentIssue[] = [];
  const seen = new Set<string>();
  records.forEach((record, index) => {
    const id = idOf(record, index);
    const result = schema.safeParse(record);
    if (!result.success) {
      for (const issue of result.error.issues) {
        issues.push({ collection, id, message: `${issue.path.join('.') || '(record)'}: ${issue.message}` });
      }
    }
    if (seen.has(id)) issues.push({ collection, id, message: 'duplicate id' });
    seen.add(id);
  });
  return issues;
}

/** Validates every record; returns an empty list when all content is valid. */
export function validateContent(input: ContentInput): ContentIssue[] {
  return [
    ...check('events', input.events, eventSchema),
    ...check('companions', input.companions, companionSchema),
    ...check('cities', input.cities, citySchema),
  ];
}
