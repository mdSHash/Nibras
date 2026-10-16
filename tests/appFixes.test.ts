import { describe, expect, it } from 'vitest';
import dataList from '../src/dataList.json';
import { companionsData, eventsData, getEra } from '../src/data';
import { findPersonIn } from '../src/utils/peopleLookup';
import { isProphetEra, isRashidunEra } from '../src/utils/eventHelpers';

const findCompanion = (name: string) => findPersonIn(companionsData, name);
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

  it('finds, for every person chip in the events, the person the chip links to', () => {
    const links = eventsData.flatMap(e => [...e.keyFigures, ...e.roles]);
    const mismatched = links.filter(l => findCompanion(l.labelAr)?.id !== l.personId).map(l => `${l.labelAr} → ${l.personId}`);
    expect(mismatched).toEqual([]);
  });
});

describe('era helpers', () => {
  it('puts every event in exactly one of the two era filters', () => {
    for (const event of eventsData) {
      expect(isProphetEra(event) !== isRashidunEra(event), `${event.id} (${event.eraId})`).toBe(true);
    }
  });

  // Its era was spelled "عهد أبي بكر الصديق" before Phase 1 and was once dropped from the filter.
  it('counts the death of Abu Bakr in the Rashidun era', () => {
    const death = eventsData.find(e => e.id === 'event-65-وفاة-أبي-بكر-الصديق');
    expect(death?.eraId).toBe('abu-bakr');
    expect(death && isRashidunEra(death)).toBe(true);
  });

  it('uses the correct genitive in era titles', () => {
    expect(getEra('uthman')?.nameAr).toBe('خلافة ذي النورين');
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

describe('narration audio', () => {
  it('has a cached recording for every narrated text (event titles and full descriptions)', async () => {
    const crypto = await import('crypto');
    const fs = await import('fs');
    const path = await import('path');
    const missing: string[] = [];
    for (const event of eventsData) {
      for (const text of [event.title, event.fullDescription]) {
        const key = crypto.createHash('sha256').update(`${String(text).replace(/\s+/g, ' ').trim()}|Charon|1`).digest('hex');
        if (!fs.existsSync(path.join(__dirname, '../public/audio', `${key}.wav`))) missing.push(`${event.id}: ${text.slice(0, 40)}`);
      }
    }
    expect(missing).toEqual([]);
  });
});

describe('"المعارك فقط" filter (isBattle)', () => {
  it('counts conquests titled فتح as battles without renaming them', async () => {
    const { isBattle } = await import('../src/utils/eventHelpers');
    const byId = (id: string) => eventsData.find(e => e.id === id)!;
    for (const id of ['conquest-damascus', 'conquest-egypt', 'conquest-mecca', 'battle-yarmouk', 'battle-badr', 'sariyyat-hamza']) {
      expect(isBattle(byId(id)), id).toBe(true);
    }
    expect(byId('conquest-damascus').title.replace(/[ً-ٰٟ]/g, '')).toBe('فتح دمشق');
    for (const id of ['boycott-hashim', 'treaty-hudaybiyyah', 'prophet-death']) {
      expect(isBattle(byId(id)), id).toBe(false);
    }
  });
});
