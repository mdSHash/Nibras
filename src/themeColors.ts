/**
 * Theme colors for styles set from JavaScript where a CSS variable cannot go:
 * framer-motion keyframes and hover targets (it interpolates the numbers) and
 * Leaflet's path options (SVG attributes). Everywhere else, use the tokens in
 * src/index.css (`bg-gold/30`, `rgb(var(--sys-gold-rgb) / 0.3)`).
 *
 * Each value here is a token of src/index.css; tests/themeColors.test.ts checks
 * they stay equal.
 */

/** Channels of a color, for {@link rgba}. */
type Channels = readonly [number, number, number];

/** --sys-gold-rgb: the tour, the cursor, the ⋮ menu. */
export const GOLD: Channels = [212, 168, 83];
/** --sys-gold-bright-rgb: the intro and the tour prompt. */
export const GOLD_BRIGHT: Channels = [212, 175, 55];
/** --sys-gold-bright-rgb as hex, for the intro's pattern (an SVG data URL). */
export const GOLD_BRIGHT_HEX = '#D4AF37';
/** --sys-chrome-ink-rgb: text and glows on the always-dark chrome. */
export const CHROME_INK: Channels = [244, 236, 225];
/** --sys-ridda: the Ridda wars' borders on the map. */
export const RIDDA = '#f87171';

export function rgba([r, g, b]: Channels, alpha: number): string {
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
