export function matchQuranKey(reference: string, keys: string[]): string | null {
  if (keys.includes(reference)) return reference;

  const match = keys.find(k => reference.startsWith(k));
  if (match) return match;

  const namePart = reference.split(':')[0].trim();
  if (namePart.includes('سورة')) {
    const partialMatch = keys.find(k => k.startsWith(namePart) || namePart.startsWith(k));
    if (partialMatch) return partialMatch;
  } else {
    const matchNoSurah = keys.find(k => k.includes(namePart));
    if (matchNoSurah) return matchNoSurah;
  }

  // specific fallbacks
  if (reference.includes('الممتحنة')) return 'سورة الممتحنة: 12';
  if (reference.includes('نزل قرآن ثم نُسخ تلاوته')) return null;
  if (reference.includes('سورة التوبة فضحت المنافقين')) return 'سورة التوبة: 117';

  return null;
}
