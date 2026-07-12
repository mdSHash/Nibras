import { EventItem } from '../data';
import { normalizeArabic } from './searchNormalize';
// Re-export era color utilities from the shared module
export { getEraColor, getEraColorScheme, getEraKey } from './eraColors';

/**
 * Check if an event is a battle/military event
 */
export const isBattle = (event: EventItem): boolean => {
  return (
    event.category === 'battle' ||
    event.category === 'معركة' ||
    event.category === 'غزوات ومعارك'
  );
};

/**
 * Check if an event is from the Prophet's era (Meccan or Medinan period)
 */
export const isProphetEra = (event: EventItem): boolean => {
  return event.era === 'العهد المكي' || event.era === 'العهد المدني';
};

/**
 * Check if an event is from the Rashidun Caliphate era
 */
export const isRashidunEra = (event: EventItem): boolean => {
  const rashidunEras = [
    'أبو بكر الصديق',
    'عمر بن الخطاب',
    'عهد عثمان بن عفان',
    'عهد علي بن أبي طالب'
  ];
  return rashidunEras.includes(event.era);
};

/**
 * Get the era title in Arabic
 */
export const getEraTitle = (era: string): string => {
  if (era.includes('المكي')) return 'العهد المكي';
  if (era.includes('المدني')) return 'العهد المدني';
  if (era.includes('أبي بكر') || era.includes('أبو بكر')) return 'خلافة الصديق';
  if (era.includes('عمر')) return 'خلافة الفاروق';
  if (era.includes('عثمان')) return 'خلافة ذو النورين';
  if (era.includes('علي')) return 'خلافة الإمام علي';
  return '';
};

/**
 * Get the ruler name for a specific era
 */
export const getRulerName = (era: string): string => {
  if (era.includes('المكي') || era.includes('المدني')) return 'النبي محمد ﷺ';
  if (era.includes('أبي بكر') || era.includes('أبو بكر')) return 'أبو بكر الصديق';
  if (era.includes('عمر')) return 'عمر بن الخطاب';
  if (era.includes('عثمان')) return 'عثمان بن عفان';
  if (era.includes('علي')) return 'علي بن أبي طالب';
  return '';
};

/**
 * Locate the anchor event for a given era-pill label. Prefers the coronation
 * (entry) event over other era events, matched via a distinctive marker in the
 * title:
 *   - Abu Bakr → السقيفة
 *   - Uthman  → الشورى
 *   - Umar / Ali → تولي <name>
 * Falls back to the first event whose era field matches. Comparisons use
 * `normalizeArabic` so vocalized titles (تَوَلِّي أَبِي بَكْرٍ) and case-form
 * variants (أبي / أبو) match plain queries — the prior includes-based check
 * missed the coronation because the title has أبي (genitive) while the era on
 * that event is "أبو بكر الصديق" and the death event is the only one whose
 * era literally contains "أبي بكر".
 */
export const findEraAnchor = (events: EventItem[], era: string): EventItem | undefined => {
  const nMatch = (s: string | undefined, needle: string) =>
    normalizeArabic(s ?? '').includes(normalizeArabic(needle));

  if (era === 'العهد النبوي') {
    return events.find(e => nMatch(e.era, 'الوحي') || nMatch(e.era, 'المدني') || nMatch(e.title, 'نزول'));
  }
  if (era === 'أبو بكر الصديق') {
    return (
      events.find(e => nMatch(e.title, 'السقيفة'))
      ?? events.find(e => nMatch(e.era, 'أبي بكر') || nMatch(e.era, 'أبو بكر'))
    );
  }
  if (era === 'عمر بن الخطاب') {
    return (
      events.find(e => nMatch(e.title, 'تولي عمر'))
      ?? events.find(e => nMatch(e.era, 'عمر'))
    );
  }
  if (era === 'عثمان بن عفان') {
    return (
      events.find(e => nMatch(e.title, 'الشورى') || nMatch(e.title, 'تولي عثمان'))
      ?? events.find(e => nMatch(e.era, 'عثمان'))
    );
  }
  if (era === 'علي بن أبي طالب') {
    return (
      events.find(e => nMatch(e.title, 'تولي علي'))
      ?? events.find(e => nMatch(e.era, 'علي'))
    );
  }
  return undefined;
};

