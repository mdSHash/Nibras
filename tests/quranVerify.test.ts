import { describe, expect, it } from 'vitest';
import path from 'path';
import quranPassages from '../src/generated/quranPassages.json';
import verseFile from '../content/quran/verses.json';
import { buildSurahIndex, loadTanzil, verifyInlineQuote, verifyQuranEntry } from '../scripts/chat-kb/quranVerify';

const TANZIL = path.join(__dirname, '../scripts/data/tanzil');
const uthmani = loadTanzil(path.join(TANZIL, 'quran-uthmani.txt'));
const index = [...buildSurahIndex(loadTanzil(path.join(TANZIL, 'quran-simple.txt'))), ...buildSurahIndex(uthmani)];

describe('Tanzil text files', () => {
  it('contain all 6236 verses in both scripts', () => {
    expect(uthmani.size).toBe(6236);
    expect(loadTanzil(path.join(TANZIL, 'quran-simple.txt')).size).toBe(6236);
  });
});

describe('verifyQuranEntry', () => {
  it('accepts every passage in src/generated/quranPassages.json (the Quran.com text)', () => {
    for (const { key, ...entry } of quranPassages) {
      const verdict = verifyQuranEntry(entry, uthmani);
      expect(verdict.ok, `${key}: ${verdict.detail}`).toBe(true);
    }
  });

  it("accepts every verse in content/quran/verses.json, the battle videos' recitations included", () => {
    for (const [key, text] of Object.entries(verseFile.verses)) {
      const [surah, ayah] = key.split(':').map(Number);
      const entry = { text: `${text} ﴿${String(ayah).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[Number(d)])}﴾`, surah, from: ayah, to: ayah };
      const verdict = verifyQuranEntry(entry, uthmani);
      expect(verdict.ok, `${key}: ${verdict.detail}`).toBe(true);
    }
  });

  it('rejects a single changed vowel', () => {
    const entry = quranPassages.find(p => p.key === 'سورة الحجر: 94')!;
    const tampered = { ...entry, text: entry.text.replace('تُؤْمَرُ', 'تُؤْمَرَ') };
    expect(verifyQuranEntry(tampered, uthmani).ok).toBe(false);
  });

  it('rejects a wrong ayah range', () => {
    const entry = quranPassages.find(p => p.key === 'سورة الحجر: 94')!;
    expect(verifyQuranEntry({ ...entry, from: 95, to: 95 }, uthmani).ok).toBe(false);
  });
});

describe('verifyInlineQuote', () => {
  it('accepts a correctly vocalized quote and locates it', () => {
    const verdict = verifyInlineQuote('يَوْمَ الْفُرْقَانِ يَوْمَ الْتَقَى الْجَمْعَانِ', index);
    expect(verdict).toMatchObject({ ok: true, surah: 8, ayah: 41 });
  });

  it('tolerates missing vowel marks and ordinary sukun on noon', () => {
    expect(verifyInlineQuote('يوم الفرقان يوم التقى الجمعان', index).ok).toBe(true);
    expect(verifyInlineQuote('وَمَا مُحَمَّدٌ إِلَّا رَسُولٌ قَدْ خَلَتْ مِنْ قَبْلِهِ الرُّسُلُ', index).ok).toBe(true);
  });

  it('rejects a changed case ending (the Badr scenario misquote)', () => {
    const verdict = verifyInlineQuote('يَوْمُ الفُرْقَانِ يَوْمَ الْتَقَى الجَمْعَانِ', index);
    expect(verdict.ok).toBe(false);
    expect(verdict.detail).toContain('vowel mismatch');
  });

  it('rejects a changed letter', () => {
    expect(verifyInlineQuote('يوم الفرقان يوم التقى الجيشان', index).ok).toBe(false);
  });

  it('verifies each segment of an elided quote', () => {
    expect(verifyInlineQuote('فَاصْدَعْ بِمَا تُؤْمَرُ...', index).ok).toBe(true);
    expect(verifyInlineQuote('فَاصْدَعْ بِمَا تُؤْمَرُ ... وَأَعْرِضْ عَنِ الْكَافِرِينَ', index).ok).toBe(false);
  });

  it('matches Uthmani-script quotes too', () => {
    expect(verifyInlineQuote('وَعَلَى ٱلثَّلَٰثَةِ ٱلَّذِينَ خُلِّفُوا۟', index).ok).toBe(true);
  });
});
