// The HTML of the map's markers and cluster bubbles (Leaflet divIcons), built
// as strings so the app needs no react-dom/server (Phase 2B). The markup is the
// same, byte for byte, as the React elements it replaces rendered with
// renderToStaticMarkup; tests/markerIcons.test.ts compares the two for every
// icon and state.
import { __iconNode as book } from 'lucide-react/dist/esm/icons/book.js';
import { __iconNode as crown } from 'lucide-react/dist/esm/icons/crown.js';
import { __iconNode as flag } from 'lucide-react/dist/esm/icons/flag.js';
import { __iconNode as mapPin } from 'lucide-react/dist/esm/icons/map-pin.js';
import { __iconNode as scrollText } from 'lucide-react/dist/esm/icons/scroll-text.js';
import { __iconNode as skull } from 'lucide-react/dist/esm/icons/skull.js';
import { __iconNode as swords } from 'lucide-react/dist/esm/icons/swords.js';
import { __iconNode as tent } from 'lucide-react/dist/esm/icons/tent.js';
import type { EventIcon } from '../../../shared/contentSchema';

type Style = Record<string, string | number | undefined>;
type Attrs = Record<string, string | number | undefined>;

const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' };
const escapeHtml = (value: string | number): string => String(value).replace(/[&<>"']/g, (c) => ESCAPES[c]);

// Properties React writes without "px" when given a number.
const UNITLESS = new Set(['opacity', 'zIndex', 'fontWeight']);

/** A style object as React serializes it: kebab-case, numbers in px, ";" between. */
function styleText(style: Style): string {
  return Object.entries(style)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => {
      const css = key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
      const text = typeof value === 'number' && value !== 0 && !UNITLESS.has(key) ? `${value}px` : String(value);
      return `${css}:${text}`;
    })
    .join(';');
}

function el(tag: string, attrs: Attrs, ...children: string[]): string {
  const attrText = Object.entries(attrs)
    .filter(([, value]) => value !== undefined)
    .map(([name, value]) => ` ${name}="${escapeHtml(value!)}"`)
    .join('');
  return `<${tag}${attrText}>${children.join('')}</${tag}>`;
}

const div = (style: Style, ...children: string[]): string => el('div', { style: styleText(style) }, ...children);

type IconNode = [tag: string, attrs: Record<string, string>][];

const ICONS: Record<EventIcon, { name: string; node: IconNode }> = {
  skull: { name: 'skull', node: skull },
  crown: { name: 'crown', node: crown },
  swords: { name: 'swords', node: swords },
  flag: { name: 'flag', node: flag },
  book: { name: 'book', node: book },
  scroll: { name: 'scroll-text', node: scrollText },
  tent: { name: 'tent', node: tent },
  pin: { name: 'map-pin', node: mapPin },
};

/** A lucide icon as lucide-react draws it, 14 px and white. */
function iconSvg(icon: EventIcon): string {
  const { name, node } = ICONS[icon];
  const shapes = node.map(([tag, { key: _key, ...attrs }]) => el(tag, attrs));
  return el(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      width: 14,
      height: 14,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: '#fff',
      'stroke-width': 2,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      class: `lucide lucide-${name}`,
      'aria-hidden': 'true',
    },
    ...shapes,
  );
}

export interface MarkerOptions {
  color: string;
  label: string;
  icon: EventIcon;
  isSelected?: boolean;
  isDimmed?: boolean;
  hasBattle?: boolean;
  isMobile: boolean;
}

/** An event marker: the coloured disc with its icon, the replay badge and the place label. */
export function markerHtml({ color, label, icon, isSelected, isDimmed, hasBattle, isMobile }: MarkerOptions): string {
  const iconSize = isMobile ? (isSelected ? '48px' : '40px') : (isSelected ? '44px' : '36px');
  const discSize = isMobile ? (isSelected ? '44px' : '36px') : (isSelected ? '40px' : '32px');
  const badgeSize = isMobile ? 16 : 14;

  const ping = isSelected
    ? div({
        position: 'absolute',
        inset: 0,
        borderRadius: '9999px',
        opacity: 0.75,
        margin: '0 auto',
        width: '100%',
        height: '100%',
        backgroundColor: color,
        animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
      })
    : '';
  const disc = div(
    {
      position: 'relative',
      width: discSize,
      height: discSize,
      borderRadius: '9999px',
      border: '3px solid white',
      boxShadow: isSelected ? '0 4px 16px rgba(0,0,0,0.5)' : '0 2px 8px rgba(0,0,0,0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'transform 300ms',
      transform: isSelected ? 'scale(1.25)' : 'scale(1)',
      backgroundColor: color,
      zIndex: isSelected ? 1000 : 'auto',
    },
    iconSvg(icon),
  );
  // Filled play triangle, optically nudged to visually center.
  const badge =
    hasBattle && !isDimmed
      ? el(
          'div',
          {
            'aria-hidden': 'true',
            style: styleText({
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: `${badgeSize}px`,
              height: `${badgeSize}px`,
              borderRadius: '9999px',
              backgroundColor: 'var(--color-accent)',
              border: '1.5px solid rgb(var(--sys-chrome-rgb) / 0.9)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 11,
            }),
          },
          el(
            'svg',
            { width: badgeSize - 6, height: badgeSize - 6, viewBox: '0 0 8 8', style: 'fill: rgb(var(--sys-chrome-rgb) / 0.95)' },
            el('path', { d: 'M2 1.2 L6.6 4 L2 6.8 Z' }),
          ),
        )
      : '';
  const placeLabel = !isDimmed
    ? div(
        {
          position: 'absolute',
          top: isMobile ? '48px' : '42px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgb(var(--sys-chrome-raised-rgb) / 0.95)',
          color: 'rgb(var(--sys-chrome-ink-rgb))',
          padding: isMobile ? '8px 14px' : '6px 12px',
          borderRadius: '8px',
          fontSize: isMobile ? '13px' : '12px',
          fontWeight: 700,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 10,
          boxShadow: '0 2px 12px rgba(0,0,0,0.5)',
          border: '2px solid rgba(255,255,255,0.2)',
          backdropFilter: 'blur(4px)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          minWidth: 'max-content',
          maxWidth: isMobile ? '200px' : 'none',
          overflow: isMobile ? 'hidden' : 'visible',
          textOverflow: isMobile ? 'ellipsis' : 'clip',
        },
        escapeHtml(label),
      )
    : '';

  return div(
    {
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      transition: 'all 700ms',
      width: iconSize,
      height: iconSize,
      opacity: isDimmed ? 0.4 : 1,
      filter: isDimmed ? 'grayscale(0.8)' : 'none',
    },
    ping,
    disc,
    badge,
    placeLabel,
  );
}

/** A cluster bubble with its event count; dimmed while an event is open. */
export function clusterHtml(pointCount: number, isDimmed: boolean): string {
  const dimClass = isDimmed ? 'opacity-40 grayscale-[0.8]' : 'opacity-100';
  return el(
    'div',
    {
      class: `relative flex justify-center items-center w-11 h-11 rounded-full border-[3px] border-white shadow-[0_2px_10px_rgba(0,0,0,0.5)] bg-accent transition-transform hover:scale-110 ${dimClass}`,
    },
    el(
      'span',
      {
        class: 'text-white font-extrabold text-base drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]',
        style: styleText({ fontFamily: 'system-ui, -apple-system, sans-serif' }),
      },
      escapeHtml(pointCount),
    ),
  );
}
