// Arabic text normalization for search matching.
// Strips diacritics (tashkeel), tatweel, and unifies visually-equivalent letter
// forms so a partial or unvocalized query (e.g. "معركه بدر") still matches the
// vocalized stored title (e.g. "مَعْرَكَةُ بَدْرٍ الْكُبْرَى").
//
// Used by the app's search menu and chat question suggestions. The chat
// assistant's own retrieval uses shared/arabicText.ts (stemming, stopwords).
export function normalizeArabic(input: string): string {
  if (!input) return '';
  return input
    // Arabic-Indic digits (٣١٣) → Western (313). The data mixes both, and the
    // punctuation strip below would otherwise delete Arabic-Indic digits
    // entirely, since they fall outside the ء-ي letter range.
    .replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 0x0660))
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
