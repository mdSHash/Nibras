// Arabic text normalization for search matching.
// Strips diacritics (tashkeel), tatweel, and unifies visually-equivalent letter
// forms so a partial or unvocalized query (e.g. "معركه بدر") still matches the
// vocalized stored title (e.g. "مَعْرَكَةُ بَدْرٍ الْكُبْرَى").
export function normalizeArabic(input: string): string {
  if (!input) return '';
  return input
    .toLowerCase()
    // Tashkeel (fatha/kasra/damma/shadda/sukun/tanwin), superscript alef, tatweel
    .replace(/[ً-ْٰـ]/g, '')
    // Alef variants → bare alef
    .replace(/[آأإٱ]/g, 'ا')
    // Teh marbuta → heh
    .replace(/ة/g, 'ه')
    // Alef maksura → yeh
    .replace(/ى/g, 'ي')
    // Hamza on yeh → yeh
    .replace(/ئ/g, 'ي')
    // Hamza on waw → waw
    .replace(/ؤ/g, 'و')
    .replace(/\s+/g, ' ')
    .trim();
}

export function tokenizeQuery(query: string): string[] {
  const normalized = normalizeArabic(query);
  if (!normalized) return [];
  return normalized.split(' ').filter(Boolean);
}
