import eventsDataJson from './dataList.json';
import { citiesData as importedCities, CityData } from './citiesList';
import { companionsData as importedCompanions, CompanionData } from './companionsList';

export type EventItem = {
  id: string;
  era: string;
  category: string;
  title: string;
  is_major_event?: boolean;
  date: {
    gregorian: number;
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
export type City = CityData;

export const eventsData: EventItem[] = (eventsDataJson as any[]).map((e, idx) => ({
  ...e,
  id: e.id || `event-${idx}-${e.title.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-أ-ي]/g, '')}`
})) as EventItem[];
export const citiesData: City[] = importedCities;
export const companionsData: Companion[] = importedCompanions;
