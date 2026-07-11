import { SpotlightPosition, TooltipPosition, TourPosition } from '../types/tour';

/**
 * Resolve a tour target selector to the first visible matching element.
 * Selectors may match multiple elements when a component ships responsive
 * variants (only one visible at a time). Falls back to the first match.
 */
export const queryVisibleTourTarget = (selector: string): HTMLElement | null => {
  if (!selector) return null;
  const nodes = document.querySelectorAll<HTMLElement>(selector);
  for (const el of nodes) {
    const { width, height } = el.getBoundingClientRect();
    if (width > 0 && height > 0) return el;
  }
  return nodes[0] ?? null;
};

export const calculateSpotlightPosition = (
  element: HTMLElement,
  padding = 10
): SpotlightPosition => {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top - padding,
    left: rect.left - padding,
    width: rect.width + padding * 2,
    height: rect.height + padding * 2,
  };
};

const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'] as const;

export const toArabicNumeral = (num: number): string =>
  String(num)
    .split('')
    .map((d) => ARABIC_DIGITS[Number(d)] ?? d)
    .join('');

export const calculateTooltipPosition = (
  target: HTMLElement,
  tooltip: HTMLElement,
  position: TourPosition
): TooltipPosition => {
  const t = target.getBoundingClientRect();
  const tip = tooltip.getBoundingClientRect();
  const isMobile = window.innerWidth < 640;
  const spacing = isMobile ? 12 : 20;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const edge = isMobile ? 16 : spacing;
  const topReserved = isMobile ? 70 : 80;

  if (position === 'center') {
    return {
      top: Math.max(topReserved, (vh - tip.height) / 2),
      left: Math.max(edge, (vw - tip.width) / 2),
    };
  }

  // On mobile, sideways placement collapses to vertical (or top-of-viewport
  // when the target is very tall — e.g. the map).
  let resolved: TourPosition = position;
  if (isMobile && (position === 'left' || position === 'right')) {
    if (t.height > vh * 0.6) return { top: topReserved, left: edge };
    resolved = vh - t.bottom > t.top ? 'bottom' : 'top';
  }

  let pos: TooltipPosition = {};
  switch (resolved) {
    case 'top':
      pos = {
        bottom: vh - t.top + spacing,
        left: isMobile ? edge : t.left + t.width / 2,
        transform: isMobile ? undefined : 'translateX(-50%)',
      };
      break;
    case 'bottom':
      pos = {
        top: Math.min(t.bottom + spacing, vh - tip.height - edge),
        left: isMobile ? edge : t.left + t.width / 2,
        transform: isMobile ? undefined : 'translateX(-50%)',
      };
      break;
    case 'left':
      pos = {
        top: Math.max(topReserved, t.top + t.height / 2),
        right: vw - t.left + spacing,
        transform: 'translateY(-50%)',
      };
      break;
    case 'right':
      pos = {
        top: Math.max(topReserved, t.top + t.height / 2),
        left: t.right + spacing,
        transform: 'translateY(-50%)',
      };
      break;
  }

  // Clamp horizontally.
  if (pos.left !== undefined) {
    if (pos.left < edge) {
      pos.left = edge;
      pos.transform = undefined;
    } else if (pos.left + tip.width > vw - edge) {
      pos.left = vw - tip.width - edge;
      pos.transform = undefined;
    }
  }
  if (pos.right !== undefined && vw - pos.right - tip.width < edge) {
    pos = { top: pos.top, left: edge };
  }

  // Clamp vertically.
  if (pos.top !== undefined) {
    if (pos.top < topReserved) pos.top = topReserved;
    else if (pos.top + tip.height > vh - edge) {
      pos.top = Math.max(topReserved, vh - tip.height - edge);
    }
  }
  if (pos.bottom !== undefined && vh - pos.bottom < edge) {
    pos = { ...pos, top: edge, bottom: undefined };
  }

  return pos;
};
