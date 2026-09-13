// Arabic text normalization for search matching.
// Strips diacritics (tashkeel), tatweel, and unifies visually-equivalent letter
// forms so a partial or unvocalized query (e.g. "معركه بدر") still matches the
// vocalized stored title (e.g. "مَعْرَكَةُ بَدْرٍ الْكُبْرَى").
//
// Lives outside src/ because both the Vite-bundled client (src/components/SearchMenu.tsx)
// and the Node serverless chat function (api/_lib/retrieval.ts) need the identical
// implementation, and neither side should import across the src//api boundary.
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
    // Strip punctuation (Arabic question mark/comma/semicolon, Latin
    // punctuation, etc.) so a trailing "؟" doesn't turn "بدر؟" into a token
    // that no longer matches the bare "بدر" stored in the corpus/haystack.
    .replace(/[^ء-ي0-9a-z\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function tokenizeQuery(query: string): string[] {
  const normalized = normalizeArabic(query);
  if (!normalized) return [];
  return normalized.split(' ').filter(Boolean);
}
