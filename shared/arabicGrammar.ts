/**
 * Small grammar helpers for text the app builds around stored names.
 */

// The "five nouns" (أبو، ذو، أخو) change their vowel letter with case.
const FIVE_NOUNS_GENITIVE: [RegExp, string][] = [
  [/^(أبو|أبا)(?= )/, 'أبي'],
  [/^(ذو|ذا)(?= )/, 'ذي'],
  [/^(أخو|أخا)(?= )/, 'أخي'],
];

/**
 * A name placed after a preposition or as the second term of a construct
 * ("عن أبو ذر" → "عن أبي ذر", "دور أبو بكر" → "دور أبي بكر"). Expects text
 * without vowel marks, as stored names in templates are.
 */
export function genitiveName(name: string): string {
  let result = name.trim();
  for (const [pattern, replacement] of FIVE_NOUNS_GENITIVE) result = result.replace(pattern, replacement);
  return result;
}
