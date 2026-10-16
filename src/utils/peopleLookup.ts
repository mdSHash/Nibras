// Finds a person by a name as written in a text: by id, name, title or alias,
// ignoring vowel marks, honorifics and letter-form variants. Works on the
// content people (content/people) and, for the Phase 1 migration, on the old list.
// Phase 1C moves the normalization into the shared Arabic module.

type Named = { id: string; name: string; title: string; aliases: string[] };

// Longest alternative FIRST so the regex engine doesn't match a prefix (e.g. عنهم
// as a prefix of عنهما) and leave a stray letter behind.
const HONORIFICS_PATTERN =
  /رضي الله عنهما|رضي الله عنهم|رضي الله عنها|رضي الله عنه|رحمهم الله|رحمها الله|رحمه الله|صلى الله عليه وسلم|عليه السلام|ﷺ/g;

// Diacritics are stripped BEFORE honorifics are removed: a fully vocalized
// "رَضِيَ اللهُ عَنْهُ" never matches the plain-letter pattern otherwise, which
// left names like "عُثْمَانُ بْنُ عَفَّانَ رَضِيَ اللهُ عَنْهُ" unresolved.
const normalizeArabicName = (value: string): string =>
  value
    .normalize("NFKC")
    .replace(/[ً-ٰٟ]/g, "")
    .replace(HONORIFICS_PATTERN, "")
    .replace(/[إأآا]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[ؤئ]/g, "ء")
    .replace(/ـ/g, "")
    .replace(/[ً-ٟ]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

const searchKeys = (person: Named): string[] =>
  Array.from(new Set([person.id, person.name, person.title, ...person.aliases].filter(Boolean).map(normalizeArabicName)));

/** Every person a name matches. */
export function findPersonCandidatesIn<T extends Named>(people: T[], name: string): T[] {
  const query = normalizeArabicName(name);
  if (!query) return [];
  return people.filter(person => searchKeys(person).includes(query));
}

/** The first person in `people` that a name matches. */
export function findPersonIn<T extends Named>(people: T[], name: string): T | undefined {
  const query = normalizeArabicName(name);
  if (!query) return undefined;
  return people.find(person => searchKeys(person).some(key => key === query));
}
