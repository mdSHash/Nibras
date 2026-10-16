// Finds a person by a name as written in a text: by id, name, title or alias,
// ignoring vowel marks, honorifics and letter-form variants (normalizeName in
// shared/arabic.ts).
import { normalizeName } from '../../shared/arabic';

type Named = { id: string; name: string; title: string; aliases: string[] };

const searchKeys = (person: Named): string[] =>
  Array.from(new Set([person.id, person.name, person.title, ...person.aliases].filter(Boolean).map(normalizeName)));

/** Every person a name matches. */
export function findPersonCandidatesIn<T extends Named>(people: T[], name: string): T[] {
  const query = normalizeName(name);
  if (!query) return [];
  return people.filter(person => searchKeys(person).includes(query));
}

/** The first person in `people` that a name matches. */
export function findPersonIn<T extends Named>(people: T[], name: string): T | undefined {
  const query = normalizeName(name);
  if (!query) return undefined;
  return people.find(person => searchKeys(person).some(key => key === query));
}
