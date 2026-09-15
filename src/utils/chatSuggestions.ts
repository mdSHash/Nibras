import { eventsData, citiesData, companionsData } from '../data';
import { isBattle } from './eventHelpers';
import { normalizeArabic } from './searchNormalize';

export interface ChatSuggestion {
  /** The full question text to show/send. */
  question: string;
  /** Normalized haystack (label + aliases) this suggestion matches against. */
  normalizedHaystack: string;
}

/**
 * A static list of ready-made questions derived from the app's own data
 * (companions, events/battles, cities), built once at module load. Powers
 * the "suggest questions as you type" feature in ChatPanel — purely
 * client-side pattern matching, no API calls, so it can't add to the chat
 * backend's free-tier request pressure.
 */
function buildSuggestions(): ChatSuggestion[] {
  const suggestions: ChatSuggestion[] = [];

  for (const companion of companionsData) {
    if (!companion.name) continue;
    // Gender-neutral on purpose: "من هو" was shown for women, and the data
    // has no reliable gender field to choose between هو and هي.
    suggestions.push({
      question: `ماذا تعرف عن ${withoutVowelMarks(companion.name)}؟`,
      normalizedHaystack: normalizeArabic([companion.name, ...(companion.aliases || [])].join(' ')),
    });
  }

  for (const event of eventsData) {
    if (!event.title) continue;
    const title = withoutVowelMarks(event.title);
    const question = isBattle(event) ? `ماذا حدث في ${title}؟` : `ما قصة ${title}؟`;
    suggestions.push({
      question,
      normalizedHaystack: normalizeArabic(event.title),
    });
  }

  for (const city of citiesData) {
    if (!city.name) continue;
    suggestions.push({
      question: `ما هي مدينة ${city.name}؟`,
      normalizedHaystack: normalizeArabic(city.name),
    });
  }

  return suggestions;
}

/**
 * Stored titles carry nominative case endings (غَزْوَةُ بَدْرٍ) that are wrong
 * after a preposition ("في غَزْوَةُ"); unvocalized text is correct anywhere.
 */
function withoutVowelMarks(text: string): string {
  return text.replace(/[ً-ٰٟ]/g, '');
}

let cached: ChatSuggestion[] | null = null;

function getAllSuggestions(): ChatSuggestion[] {
  if (!cached) cached = buildSuggestions();
  return cached;
}

const MIN_QUERY_CHARS = 2;
const MAX_RESULTS = 4;

/** Returns up to MAX_RESULTS question suggestions whose source name matches the current draft text. */
export function getMatchingSuggestions(draft: string): string[] {
  const query = normalizeArabic(draft);
  if (query.length < MIN_QUERY_CHARS) return [];

  const seen = new Set<string>();
  const results: string[] = [];
  for (const s of getAllSuggestions()) {
    if (!s.normalizedHaystack.includes(query)) continue;
    if (seen.has(s.question)) continue;
    seen.add(s.question);
    results.push(s.question);
    if (results.length >= MAX_RESULTS) break;
  }
  return results;
}
