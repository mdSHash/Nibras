// The content as stored before Phase 1 (src/dataList.json and friends), loaded the
// way the app loaded it. Read only by scripts/migrate-content.ts; the app reads
// content/ through src/data.ts. Removed in Phase 1C with the old files.
import eventsDataJson from './dataList.json';
import { citiesData as importedCities, CityData } from './citiesList';
import { companionsData as importedCompanions, CompanionData } from './companionsList';

export type EventItem = {
  id: string;
  era: string;
  category: string;
  title: string;
  is_major_event?: boolean;
  battleId?: string;
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

const BATTLE_ID_MAP: Record<string, string> = {
  'غَزْوَةُ بَدْرٍ الْكُبْرَى': 'badr',
  'غَزْوَةُ أُحُدٍ': 'uhud',
  'غَزْوَةُ الْخَنْدَقِ (الْأَحْزَابُ)': 'khandaq',
  'غَزْوَةُ خَيْبَرَ': 'khaybar',
  'فَتْحُ مَكَّةَ الْمُكَرَّمَةِ': 'fath-makkah',
  'غَزْوَةُ حُنَيْنٍ': 'hunayn',
  'مَعْرَكَةُ الْيَرْمُوكِ': 'yarmouk',
  'مَعْرَكَةُ الْقَادِسِيَّةِ': 'qadisiyyah',
  'مَعْرَكَةُ مُؤْتَةَ': 'mutah',
  'غَزْوَةُ تَبُوكَ (جَيْشُ الْعُسْرَةِ)': 'tabuk',
  'مَعْرَكَةُ الْيَمَامَةِ (حَدِيقَةُ الْمَوْتِ)': 'yamama',
  'مَعْرَكَةُ نَهَاوَنْدَ (فَتْحُ الْفُتُوحِ)': 'nahavand',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- untyped dataList.json; replaced by the Phase 1 content model
export const eventsData: EventItem[] = (eventsDataJson as any[]).map((e, idx) => ({
  ...e,
  id: e.id || `event-${idx}-${e.title.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-أ-ي]/g, '')}`,
  ...(BATTLE_ID_MAP[e.title] ? { battleId: BATTLE_ID_MAP[e.title] } : {}),
})) as EventItem[];
export const citiesData: City[] = importedCities;
export const companionsData: Companion[] = importedCompanions;

// The era helpers the app used before Phase 1B, when events carried an era
// label instead of an era id (title matching). The migration derives
// content/eras.json from them. Removed in Phase 1C with this file.
export const getEraTitle = (era: string): string => {
  if (era.includes('المكي')) return 'العهد المكي';
  if (era.includes('المدني')) return 'العهد المدني';
  if (era.includes('أبي بكر') || era.includes('أبو بكر')) return 'خلافة الصديق';
  if (era.includes('عمر')) return 'خلافة الفاروق';
  if (era.includes('عثمان')) return 'خلافة ذي النورين';
  if (era.includes('علي')) return 'خلافة الإمام علي';
  return '';
};

export const getRulerName = (era: string): string => {
  if (era.includes('المكي') || era.includes('المدني')) return 'النبي محمد ﷺ';
  if (era.includes('أبي بكر') || era.includes('أبو بكر')) return 'أبو بكر الصديق';
  if (era.includes('عمر')) return 'عمر بن الخطاب';
  if (era.includes('عثمان')) return 'عثمان بن عفان';
  if (era.includes('علي')) return 'علي بن أبي طالب';
  return '';
};

export function getEraKey(era?: string): 'prophetic' | 'abuBakr' | 'umar' | 'uthman' | 'ali' {
  if (!era) return 'prophetic';
  if (['المكي', 'قبل البعثة', 'البعثة', 'المدني', 'الوحي'].some(s => era.includes(s))) return 'prophetic';
  if (era.includes('أبي بكر') || era.includes('أبو بكر')) return 'abuBakr';
  if (era.includes('عمر')) return 'umar';
  if (era.includes('عثمان')) return 'uthman';
  if (era.includes('علي')) return 'ali';
  if (era.includes('الراشدة')) return 'abuBakr';
  return 'prophetic';
}
