// Where each territory label goes on screen, so labels neither hide event markers nor each other
// (3F left this open: markers touched about ten labels per picture). Pure, so it is tested without
// a map: tests/labelPlacement.test.ts. Labels sit below the markers and take no clicks, so a marker
// stays clickable whatever happens here; this keeps the labels readable.

export interface Box {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface LabelBox {
  /** The label's anchor on screen: the middle of the box when it does not move. */
  x: number;
  y: number;
  width: number;
  height: number;
  /** 1 realm, 2 small realm, 3 region, 4 province under a state: the lower, the earlier it is placed. */
  level: number;
}

export interface Placement {
  dx: number;
  dy: number;
  visible: boolean;
}

// How far a label may leave its anchor, in pixels. Far enough to clear a marker or a cluster bubble,
// near enough to still read as the name of that land. Realm names cover a large land, so they may go further.
const REGION_STEPS = [14, 26, 40, 56];
const REALM_STEPS = [...REGION_STEPS, 76, 100, 130];
// Labels are wider than tall, so the sideways step is longer.
const DIRECTIONS: readonly [number, number][] = [
  [0, -1], [0, 1], [-1.8, 0], [1.8, 0], [-1.4, -0.8], [1.4, -0.8], [-1.4, 0.8], [1.4, 0.8],
];
const MARKER_GAP = 3;
const LABEL_GAP_X = 4;
const LABEL_GAP_Y = 2;

const clashes = (a: Box, b: Box, gapX: number, gapY: number): boolean =>
  a.right + gapX > b.left && a.left - gapX < b.right && a.bottom + gapY > b.top && a.top - gapY < b.bottom;

function boxAt(label: LabelBox, dx: number, dy: number): Box {
  const left = label.x + dx - label.width / 2;
  const top = label.y + dy - label.height / 2;
  return { left, top, right: left + label.width, bottom: top + label.height };
}

/**
 * Places labels in order of importance, each at the nearest spot clear of the obstacles (markers, the
 * selected event's name, the legend, the panels over the map) and of the labels already placed. On the
 * screen a label is either whole or not at all: never cut by its edge. A label with no clear spot is hidden.
 * Returns one placement per label, in the order given.
 */
export function placeLabels(labels: readonly LabelBox[], obstacles: readonly Box[], screen?: Box): Placement[] {
  const order = labels.map((_, i) => i).sort((a, b) => labels[a].level - labels[b].level || a - b);
  const placed: Box[] = [];
  const out: Placement[] = labels.map(() => ({ dx: 0, dy: 0, visible: false }));
  const cutByScreen = (box: Box): boolean => {
    if (!screen) return false;
    const inside = box.left >= screen.left && box.right <= screen.right && box.top >= screen.top && box.bottom <= screen.bottom;
    const outside = box.right <= screen.left || box.left >= screen.right || box.bottom <= screen.top || box.top >= screen.bottom;
    return !inside && !outside;
  };
  const free = (box: Box): boolean =>
    !cutByScreen(box) && !obstacles.some(o => clashes(box, o, MARKER_GAP, MARKER_GAP)) && !placed.some(p => clashes(box, p, LABEL_GAP_X, LABEL_GAP_Y));

  for (const i of order) {
    const label = labels[i];
    const steps = label.level <= 1 ? REALM_STEPS : REGION_STEPS;
    const candidates: [number, number][] = [[0, 0]];
    for (const step of steps) for (const [x, y] of DIRECTIONS) candidates.push([Math.round(x * step), Math.round(y * step)]);
    for (const [dx, dy] of candidates) {
      const box = boxAt(label, dx, dy);
      if (free(box)) {
        placed.push(box);
        out[i] = { dx, dy, visible: true };
        break;
      }
    }
  }
  return out;
}

/** From which zoom a label shows: realm names first, then regions, then provinces (as in the chosen direction). */
export const labelShowsAtZoom = (level: number, zoom: number): boolean => level <= zoom - 2;
