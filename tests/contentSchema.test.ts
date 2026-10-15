import { describe, expect, it } from 'vitest';
import eventsJson from '../src/dataList.json';
import { citiesData } from '../src/citiesList';
import { companionsData } from '../src/companionsList';
import { eventSchema, validateContent } from '../shared/contentSchema';

const events = eventsJson as unknown[];

describe('content schema', () => {
  it('accepts every event, companion and city as stored today', () => {
    expect(validateContent({ events, companions: companionsData, cities: citiesData })).toEqual([]);
  });

  it('covers the whole content set', () => {
    expect(events).toHaveLength(131);
    expect(companionsData).toHaveLength(161);
    expect(citiesData).toHaveLength(10);
  });

  const sample = events[0] as Record<string, unknown>;

  it('rejects an unknown or misspelled field', () => {
    expect(eventSchema.safeParse({ ...sample, titel: 'x' }).success).toBe(false);
  });

  it('rejects a missing required field', () => {
    const { title: _title, ...withoutTitle } = sample;
    expect(eventSchema.safeParse(withoutTitle).success).toBe(false);
  });

  it('rejects coordinates outside the globe', () => {
    const location = { ...(sample.location as object), coordinates: [200, 39] };
    expect(eventSchema.safeParse({ ...sample, location }).success).toBe(false);
  });

  it('reports duplicate ids', () => {
    const issues = validateContent({ events: [sample, sample], companions: [], cities: [] });
    expect(issues).toEqual([{ collection: 'events', id: sample.id, message: 'duplicate id' }]);
  });
});
