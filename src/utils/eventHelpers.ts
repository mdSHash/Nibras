import { EventItem } from '../data';

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
 * Get the theme color for a specific era
 */
export const getEraColor = (era: string): string => {
  if (era.includes('المكي') || era.includes('المدني')) return '#10b981';
  if (era.includes('أبي بكر') || era.includes('أبو بكر')) return '#fbbf24';
  if (era.includes('عمر')) return '#ef4444';
  if (era.includes('عثمان')) return '#06b6d4';
  if (era.includes('علي')) return '#818cf8';
  return '#8b7355';
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

// Made with Bob
