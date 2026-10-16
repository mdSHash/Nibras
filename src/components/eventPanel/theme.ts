import { eraOf, type EventItem } from '../../data';
import { getEraColor, getEraColorScheme } from '../../utils/eraColors';

/** The era's colours, panel badge and ruler (content/eras.json). */
export const getEraTheme = (event: EventItem | null) => {
  const era = event ? eraOf(event) : undefined;
  const color = getEraColor(era?.colorKey);
  const scheme = getEraColorScheme(era?.colorKey);
  return { color, scheme, title: era?.panelTitleAr ?? "", ruler: era?.rulerAr ?? "" };
};

export type EraTheme = ReturnType<typeof getEraTheme>;

/** Font size scaled by the panel's text-size step. */
export type FontScale = (base: number) => { fontSize: string };

/**
 * Lighten or darken a hex color by an amount in [-1, 1]. Used to compute
 * the second stop of the era-gradient hero from a single era color.
 */
export function shadeHex(hex: string, amount: number): string {
  const m = hex.replace('#', '');
  const num = parseInt(m.length === 3 ? m.split('').map((c) => c + c).join('') : m, 16);
  const r = Math.max(0, Math.min(255, ((num >> 16) & 0xff) + Math.round(255 * amount)));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + Math.round(255 * amount)));
  const b = Math.max(0, Math.min(255, (num & 0xff) + Math.round(255 * amount)));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
