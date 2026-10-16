// The app's content, read from src/generated/ (built from content/ by
// scripts/build-content.ts). Phase 1A keeps the shapes the components used
// before the migration, so they work unchanged; Phase 1B moves them to the
// content/ shapes (shared/contentSchema.ts) and removes this adapter.
import generatedEvents from './generated/events.json';
import generatedPeople from './generated/people.json';
import generatedCities from './generated/cities.json';
import generatedCategories from './generated/categories.json';
import type { Category, City as ContentCity, ContentEvent, EventIcon, Person } from '../shared/contentSchema';
import type { CompanionData } from './companionsList';

export type EventItem = {
  id: string;
  era: string;
  eraId: string;
  /** The category id (content/categories.json). */
  category: string;
  isBattle: boolean;
  icon: EventIcon;
  title: string;
  is_major_event?: boolean;
  battleId?: string;
  date: {
    gregorian: number;
    hijri?: number;
    hijri_relative: string;
  };
  location: {
    name: string;
    coordinates: [number, number];
  };
  details: {
    summary: string;
    full_description: string;
    army_size?: string;
    enemy_army_size?: string;
    duration_days?: string;
    course_of_events?: string[];
    companion_roles?: {
      name: string;
      role_in_event: string;
    }[];
  };
  entities: {
    key_figures?: string[];
    quran_refs?: string[];
    hadith_refs?: string[];
    sources?: string[];
  };
  route?: [number, number][];
};

export type Companion = CompanionData;
export type City = ContentCity;

// The era labels the helpers in src/utils/eventHelpers.ts and eraColors.ts match on
// (one spelling per era). Removed in Phase 1B, when they look up the era id.
const ERA_LABELS: Record<string, string> = {
  meccan: 'العهد المكي',
  medinan: 'العهد المدني',
  'abu-bakr': 'أبو بكر الصديق',
  umar: 'عمر بن الخطاب',
  uthman: 'عهد عثمان بن عفان',
  ali: 'عهد علي بن أبي طالب',
};

// The replay ids the event panel and chat used (src/utils/battleScenario.ts maps them back).
const battleIdOf = (scenarioId: string): string =>
  scenarioId === 'conquest-of-mecca' ? 'fath-makkah' : scenarioId.replace(/^battle-of-/, '');

function toEventItem(e: ContentEvent): EventItem {
  return {
    id: e.id,
    era: ERA_LABELS[e.eraId],
    eraId: e.eraId,
    category: e.categoryId,
    isBattle: e.isBattle,
    icon: e.icon,
    title: e.title,
    ...(e.isMajor !== undefined ? { is_major_event: e.isMajor } : {}),
    ...(e.battleScenarioId ? { battleId: battleIdOf(e.battleScenarioId) } : {}),
    date: {
      gregorian: e.date.sortKey,
      ...(e.date.hijri ? { hijri: e.date.hijri.year } : {}),
      hijri_relative: e.date.labelAr,
    },
    location: { name: e.location.nameAr, coordinates: e.location.coordinates },
    details: {
      summary: e.summary,
      full_description: e.fullDescription,
      ...(e.forces?.army ? { army_size: e.forces.army.textAr } : {}),
      ...(e.forces?.enemyArmy ? { enemy_army_size: e.forces.enemyArmy.textAr } : {}),
      ...(e.durationAr !== undefined ? { duration_days: e.durationAr } : {}),
      course_of_events: e.courseOfEvents,
      companion_roles: e.roles.map(r => ({ name: r.labelAr, role_in_event: r.roleAr })),
    },
    entities: {
      key_figures: e.keyFigures.map(k => k.labelAr),
      quran_refs: e.quran.map(q => q.labelAr),
      hadith_refs: e.hadith,
      sources: e.sources,
    },
    ...(e.route ? { route: e.route } : {}),
  };
}

const toCompanion = (p: Person): Companion => ({
  id: p.id,
  name: p.name,
  title: p.title,
  role: p.role,
  description: p.bio,
  birth_death: p.birthDeath,
  aliases: p.aliases,
});

/** In timeline order. */
export const eventsData: EventItem[] = (generatedEvents as unknown as ContentEvent[]).map(toEventItem);
export const companionsData: Companion[] = (generatedPeople as unknown as Person[]).map(toCompanion);
export const citiesData: City[] = generatedCities as unknown as City[];
export const categories: Category[] = generatedCategories;
