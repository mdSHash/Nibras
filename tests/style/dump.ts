// The computed styles of every element on the page (and its ::before and
// ::after), for the style snapshots. Colors are compared as drawn: each color in
// a value is painted over white and over black on a 1×1 canvas and read back as
// 8-bit pixels, so `rgba(20, 15, 10, 0.55)` and Tailwind's `color-mix(in oklab, …)`
// count as equal when they draw the same pixels, and differ when they don't.
import type { Page } from '@playwright/test';

export interface StyleDump {
  /** Each distinct set of values once: `property: value` lines. */
  rows: string[];
  /** Element path → index into rows. */
  els: Record<string, number>;
  /** Element path → a short description (tag, id, tour id, classes) for reading differences. */
  labels: Record<string, string>;
  /** Elements still animating (framer-motion loops): not compared. */
  moving: string[];
}

/** Properties that decide how the page looks or reacts (colors, sizes, the ones `!important` rules set). */
export const PROPERTIES = [
  'color', 'background-color', 'background-image', 'background-size', 'background-position',
  'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color',
  'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width',
  'border-top-style', 'border-right-style', 'border-bottom-style', 'border-left-style',
  'border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius',
  'outline-color', 'outline-style', 'outline-width', 'outline-offset',
  'box-shadow', 'text-shadow', 'fill', 'stroke', 'stroke-width', 'stop-color',
  'filter', 'backdrop-filter', 'opacity', 'mix-blend-mode', 'visibility',
  '-webkit-text-fill-color', '-webkit-background-clip', 'caret-color', 'text-decoration-color', 'accent-color',
  'display', 'position', 'z-index', 'top', 'right', 'bottom', 'left',
  'width', 'height', 'min-width', 'min-height', 'max-width', 'max-height',
  'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
  'row-gap', 'column-gap', 'flex-direction', 'flex-wrap', 'align-items', 'justify-content',
  'overflow-x', 'overflow-y', 'overscroll-behavior-x', 'overscroll-behavior-y',
  'font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'text-align',
  'transform', 'cursor', 'touch-action', 'pointer-events', 'user-select',
  'animation-name', 'animation-duration', 'animation-iteration-count',
  'transition-property', 'transition-duration', 'scroll-behavior', 'content',
  '-webkit-tap-highlight-color', 'scrollbar-color',
] as const;

/** Properties that framer-motion loops (pulses, glows, floating) keep changing. */
const MOTION = [
  'transform', 'scale', 'translate', 'rotate', 'opacity', 'box-shadow', 'background-color', 'background-image',
  'background-position', 'color', 'filter', 'border-top-color', 'outline-color', 'stroke-dashoffset',
  'clip-path', 'width', 'height', 'top', 'left', 'visibility',
];

/**
 * Marks with `data-style-moving` every element whose styles are still changing
 * over 2.4 s (infinite framer-motion loops, which CSS's "animations disabled"
 * does not stop). Those elements are left out of the comparison and hidden in
 * the screenshot (glows reach outside their box, so a mask is not enough);
 * their values come from src/themeColors.ts, which a unit test ties to the
 * tokens. Returns how many there are.
 */
export async function markMoving(page: Page): Promise<number> {
  return page.evaluate(async (motion) => {
    if (!document.getElementById('style-snapshot-moving')) {
      const style = document.createElement('style');
      style.id = 'style-snapshot-moving';
      // Applied only while the screenshot is taken (capture sets the class), so the dump sees the page as it is.
      // The territory borders are hidden too: the map's sub-pixel offset differs from run to run, and
      // so does their anti-aliasing (their fill and stroke are still compared in the dump).
      style.textContent =
        'html.style-snapshot-hide [data-style-moving], html.style-snapshot-hide .leaflet-overlay-pane { visibility: hidden !important; }';
      document.head.append(style);
    }
    const sample = () => {
      const values = new Map<Element, string>();
      for (const el of document.querySelectorAll('*')) {
        const style = getComputedStyle(el);
        values.set(el, motion.map((p) => style.getPropertyValue(p)).join('|'));
      }
      return values;
    };
    const first = sample();
    const moving = new Set<Element>();
    for (let i = 0; i < 6; i++) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      for (const [el, value] of sample()) {
        if (first.has(el) && first.get(el) !== value) moving.add(el);
      }
    }
    for (const el of moving) el.setAttribute('data-style-moving', '');
    return moving.size;
  }, MOTION);
}

export async function dumpStyles(page: Page, scope?: string): Promise<StyleDump> {
  return page.evaluate(
    ({ properties, scope }) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
      const painted = new Map<string, string>();
      const paint = (color: string): string => {
        const known = painted.get(color);
        if (known) return known;
        const over = (backdrop: string) => {
          ctx.globalCompositeOperation = 'copy';
          ctx.fillStyle = backdrop;
          ctx.fillRect(0, 0, 1, 1);
          ctx.globalCompositeOperation = 'source-over';
          ctx.fillStyle = '#000';
          ctx.fillStyle = color;
          ctx.fillRect(0, 0, 1, 1);
          return [...ctx.getImageData(0, 0, 1, 1).data.slice(0, 3)].join(',');
        };
        const value = `paint(${over('#fff')}|${over('#000')})`;
        painted.set(color, value);
        return value;
      };
      // Resolved colors: rgb()/rgba() and the CSS Color 4 forms Chrome serializes.
      const COLOR = /\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\((?:[^()]|\([^()]*\))*\)|#[0-9a-fA-F]{3,8}\b|\btransparent\b/g;
      // A gradient whose stops include a modern color (oklab(), from Tailwind's
      // color-mix) interpolates in oklab by default, and Chrome then leaves
      // "in oklab" out; with only legacy rgb() stops the default is srgb. Spell
      // the default out, so equal gradients compare equal and a real change of
      // interpolation still shows.
      const GRADIENT = /((?:repeating-)?(?:linear|radial|conic)-gradient\()((?:[^()]|\((?:[^()]|\([^()]*\))*\))*)\)/g;
      const explicit = (value: string) =>
        value.replace(GRADIENT, (whole, head: string, body: string) =>
          / in (?:oklab|oklch|srgb|srgb-linear|lab|lch|hsl|hwb|display-p3|xyz)/.test(` ${body}`) ||
          !/\b(?:oklab|oklch|lab|lch|color)\(/.test(body)
            ? whole
            : `${head}${/^\s*(?:to |\d|-\d|[\d.]+(?:deg|turn|rad))/.test(body) ? body.replace(/^([^,]*)/, '$1 in oklab') : `in oklab, ${body}`})`,
        );
      const normalize = (value: string) => explicit(value).replace(COLOR, paint);

      const root = scope ? document.querySelector(scope) : document.documentElement;
      if (!root) throw new Error(`no element matches ${scope}`);
      const rows: string[] = [];
      const rowIndex = new Map<string, number>();
      const els: Record<string, number> = {};
      const labels: Record<string, string> = {};
      // Map tiles are stubbed, and their number and placement are not styling.
      const skip = (el: Element) => el.classList.contains('leaflet-tile-container') || el.classList.contains('leaflet-tile');

      const record = (path: string, el: Element, pseudo: string | null) => {
        const style = getComputedStyle(el, pseudo);
        if (pseudo && (style.content === 'none' || style.content === 'normal')) return;
        const row = properties.map((p) => `${p}: ${normalize(style.getPropertyValue(p))}`).join('\n');
        let index = rowIndex.get(row);
        if (index === undefined) {
          index = rows.push(row) - 1;
          rowIndex.set(row, index);
        }
        els[path + (pseudo ?? '')] = index;
      };
      const label = (el: Element) => {
        const tour = el.getAttribute('data-tour-id');
        const cls = (el.getAttribute('class') ?? '').trim().slice(0, 80);
        return `<${el.tagName.toLowerCase()}${el.id ? ` #${el.id}` : ''}${tour ? ` tour=${tour}` : ''}${cls ? ` .${cls}` : ''}>`;
      };
      const moving: string[] = [];
      const walk = (el: Element, path: string) => {
        if (skip(el)) return;
        labels[path] = label(el);
        if (el.hasAttribute('data-style-moving')) moving.push(path);
        else record(path, el, null);
        record(path, el, '::before');
        record(path, el, '::after');
        [...el.children].forEach((child, i) => walk(child, `${path}/${child.tagName.toLowerCase()}${i}`));
      };
      walk(root, root.tagName.toLowerCase());
      return { rows, els, labels, moving };
    },
    { properties: [...PROPERTIES], scope },
  );
}
