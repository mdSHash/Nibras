import { describe, expect, it } from 'vitest';
import dataList from '../src/dataList.json';
import { eventsData } from '../src/data';
import { findCompanion } from '../src/companionsList';
import { getEraTitle, isProphetEra, isRashidunEra } from '../src/utils/eventHelpers';
import { normalizeArabic } from '../shared/searchNormalize';

describe('findCompanion', () => {
  it('resolves fully vocalized names that carry a vocalized honorific', () => {
    expect(findCompanion('عُثْمَانُ بْنُ عَفَّانَ رَضِيَ اللهُ عَنْهُ')?.id).toBe('uthman');
    expect(findCompanion('خَدِيجَةُ بِنْتُ خُوَيْلِدٍ رَضِيَ اللهُ عَنْهَا')?.id).toBe('khadija');
    expect(findCompanion('جَعْفَرُ بْنُ أَبِي طَالِبٍ رَضِيَ اللهُ عَنْهُ')?.id).toBe('jafar');
  });

  it('still resolves plain names and rejects unknown ones', () => {
    expect(findCompanion('أبو بكر الصديق')?.id).toBe('abu-bakr');
    expect(findCompanion('شخص غير موجود')).toBeUndefined();
  });

  it('resolves every companion named in event records', () => {
    const names = new Set(eventsData.flatMap(e => [...(e.entities.key_figures ?? []), ...(e.details.companion_roles ?? []).map(r => r.name)]));
    const unresolved = [...names].filter(n => !findCompanion(n));
    expect(unresolved).toEqual([]);
  });
});

describe('era helpers', () => {
  it('puts every event in exactly one of the two era filters', () => {
    for (const event of eventsData) {
      expect(isProphetEra(event) !== isRashidunEra(event), `${event.id} (${event.era})`).toBe(true);
    }
  });

  it('includes the event whose era is spelled "عهد أبي بكر الصديق"', () => {
    const death = eventsData.find(e => e.era === 'عهد أبي بكر الصديق');
    expect(death && isRashidunEra(death)).toBe(true);
  });

  it('uses the correct genitive in era titles', () => {
    expect(getEraTitle('عهد عثمان بن عفان')).toBe('خلافة ذي النورين');
  });
});

describe('event ids', () => {
  it('are stored in the data file, unique, and identical to the ids the app generated before', () => {
    const raw = dataList as { id?: string; title: string }[];
    expect(raw.every(e => typeof e.id === 'string' && e.id.length > 0)).toBe(true);
    expect(new Set(raw.map(e => e.id)).size).toBe(raw.length);
    expect(raw[0].id).toBe('event-0-ميلاد-النبي--عام-الفيل');
  });
});

describe('chat question suggestions', () => {
  it('never assume a gender or show case endings after a preposition', async () => {
    const { getMatchingSuggestions } = await import('../src/utils/chatSuggestions');
    const samples = ['خديجة', 'عائشة', 'بدر', 'الخندق', 'عمر', 'فاطمة', 'مكة', 'الهجرة'].flatMap(q => getMatchingSuggestions(q));
    expect(samples.length).toBeGreaterThan(8);
    for (const question of samples) {
      expect(question).not.toMatch(/^من هو /);
      expect(question).not.toMatch(/[ً-ْ]/);
    }
  });
});

describe('normalizeArabic (search menu)', () => {
  it('keeps Arabic-Indic digits as numbers instead of deleting them', () => {
    expect(normalizeArabic('حوالي ٣١٣ مقاتلا')).toBe('حوالي 313 مقاتلا');
    expect(normalizeArabic('غَزْوَةُ بَدْرٍ')).toBe('غزوه بدر');
  });
});
