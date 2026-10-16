/**
 * Builds a Qur'an passage as the app shows it, from the Quran.com verse text in
 * content/quran/verses.json: each verse followed by its number in an ornate
 * parenthesis, e.g. "… ﴿١﴾ … ﴿٢﴾". Used by scripts/content/store.ts at build time.
 */
import type { QuranPassage } from './contentSchema';
import { toArabicIndic } from './arabic';

/** The verse keys ("surah:ayah") a passage needs, in order. */
export function passageVerseKeys(p: Pick<QuranPassage, 'surah' | 'from' | 'to'>): string[] {
  const keys: string[] = [];
  for (let ayah = p.from; ayah <= p.to; ayah++) keys.push(`${p.surah}:${ayah}`);
  return keys;
}

/** The passage text, or null if a verse is missing. */
export function passageText(p: Pick<QuranPassage, 'surah' | 'from' | 'to'>, verses: Record<string, string>): string | null {
  const parts: string[] = [];
  for (const key of passageVerseKeys(p)) {
    const verse = verses[key];
    if (verse === undefined) return null;
    parts.push(`${verse} ﴿${toArabicIndic(Number(key.split(':')[1]))}﴾`);
  }
  return parts.join(' ');
}

/** The passage on Quran.com (Arabic interface). */
export const passageLink = (p: Pick<QuranPassage, 'surah' | 'from' | 'to'>): string =>
  `https://quran.com/ar/${p.surah}/${p.from === p.to ? p.from : `${p.from}-${p.to}`}`;
