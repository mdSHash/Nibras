import { describe, expect, it } from 'vitest';
import { normalizeForSearch } from '../shared/arabic';
import { EVENT_DETAIL_FIELDS } from '../shared/contentSplit';
import { eventSlug } from '../shared/routes';
import type { GeneratedQuranPassage } from '../shared/contentSchema';
import { fullEvents, fullPeople } from '../scripts/content/generated';
import fullPassages from '../src/generated/quranPassages.json';
import { companionsData, eventsData, quranPassages } from '../src/data';
import { bios, eventDetails, passageTexts, searchTexts } from '../src/lazyContent';

describe('the content split (Phase 2B)', () => {
  it('index plus details give back every event exactly', async () => {
    expect(eventsData.map((e) => e.id)).toEqual(fullEvents.map((e) => e.id));
    for (const [i, summary] of eventsData.entries()) {
      for (const field of EVENT_DETAIL_FIELDS) expect(summary).not.toHaveProperty(field);
      const details = await eventDetails.load(eventSlug(summary));
      expect({ ...summary, ...details }).toEqual(fullEvents[i]);
    }
  });

  it('index plus details give back every person exactly', async () => {
    expect(companionsData.map((p) => p.id)).toEqual(fullPeople.map((p) => p.id));
    for (const [i, summary] of companionsData.entries()) {
      expect(Object.keys(summary).sort()).toEqual(['aliases', 'id', 'name']);
      expect({ ...summary, ...(await bios.load(summary.id)) }).toEqual(fullPeople[i]);
    }
  });

  it("every Qur'an passage keeps its Quran.com text", async () => {
    for (const passage of fullPassages as GeneratedQuranPassage[]) {
      const { text, ...summary } = passage;
      expect(quranPassages[passage.key]).toEqual(summary);
      expect(await passageTexts.load(passage.key)).toBe(text);
    }
  });

  it('the search index holds the text the search drawer matched before the split', async () => {
    const index = await searchTexts.load('');
    expect(Object.keys(index)).toEqual(fullEvents.map((e) => e.id));
    for (const e of fullEvents) {
      const before = normalizeForSearch(
        [e.title, e.summary, e.fullDescription, e.location.nameAr, String(e.date.sortKey), e.date.labelAr].join(' '),
      );
      expect(index[e.id]).toBe(before);
    }
  });

  it('a missing file fails, and a later load of a real one still works', async () => {
    await expect(eventDetails.load('no-such-event')).rejects.toThrow();
    await expect(bios.load('no-such-person')).rejects.toThrow();
    await expect(passageTexts.load('no such passage')).rejects.toThrow();
    expect(eventDetails.peek(eventSlug(eventsData[0]))).toBeDefined();
  });
});
