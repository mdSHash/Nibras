import { describe, expect, it } from 'vitest';
import { labelShowsAtZoom, placeLabels, type Box, type LabelBox } from '../src/components/map/labelPlacement';

const label = (x: number, y: number, level = 3, width = 60, height = 20): LabelBox => ({ x, y, width, height, level });
const box = (b: LabelBox, dx: number, dy: number): Box => ({
  left: b.x + dx - b.width / 2,
  right: b.x + dx + b.width / 2,
  top: b.y + dy - b.height / 2,
  bottom: b.y + dy + b.height / 2,
});
const overlap = (a: Box, b: Box): boolean => a.right > b.left && a.left < b.right && a.bottom > b.top && a.top < b.bottom;

describe('placeLabels', () => {
  it('leaves a label at its anchor when nothing is in the way', () => {
    expect(placeLabels([label(100, 100)], [])).toEqual([{ dx: 0, dy: 0, visible: true }]);
  });

  it('moves a label off a marker, by as little as it can', () => {
    const marker = { left: 90, right: 110, top: 90, bottom: 110 };
    const [p] = placeLabels([label(100, 100)], [marker]);
    expect(p.visible).toBe(true);
    expect(overlap(box(label(100, 100), p.dx, p.dy), marker)).toBe(false);
    expect(Math.hypot(p.dx, p.dy)).toBeLessThan(40);
  });

  it('hides a region label with no clear spot', () => {
    const wall = { left: -500, right: 500, top: -500, bottom: 500 };
    expect(placeLabels([label(100, 100)], [wall])[0].visible).toBe(false);
  });

  it('gives a realm name its spot before a region name', () => {
    const [region, realm] = placeLabels([label(100, 100, 3), label(100, 100, 1)], []);
    expect(realm).toEqual({ dx: 0, dy: 0, visible: true });
    expect(region.visible).toBe(true);
    expect(Math.hypot(region.dx, region.dy)).toBeGreaterThan(0);
  });

  it('lets a realm name go further than a region name', () => {
    const near = { left: 20, right: 180, top: 40, bottom: 160 };
    const [region, realm] = placeLabels([label(100, 100, 3), label(100, 100, 1)], [near]);
    expect(region.visible).toBe(false);
    expect(realm.visible).toBe(true);
  });

  it('never overlaps a marker or another label, on a crowded map', () => {
    const markers: Box[] = [];
    for (let i = 0; i < 40; i++) {
      const x = (i * 137) % 900;
      const y = (i * 271) % 700;
      markers.push({ left: x, right: x + 40, top: y, bottom: y + 40 });
    }
    const labels: LabelBox[] = Array.from({ length: 50 }, (_, i) => label((i * 191) % 900, (i * 113) % 700, (i % 4) + 1, 90));
    const placements = placeLabels(labels, markers);
    const seen: Box[] = [];
    placements.forEach((p, i) => {
      if (!p.visible) return;
      const b = box(labels[i], p.dx, p.dy);
      for (const m of markers) expect(overlap(b, m)).toBe(false);
      for (const s of seen) expect(overlap(b, s)).toBe(false);
      seen.push(b);
    });
    expect(seen.length).toBeGreaterThan(10);
  });

  it('gives the same result for the same input', () => {
    const labels = [label(10, 10), label(12, 12, 1), label(14, 14, 2)];
    expect(placeLabels(labels, [])).toEqual(placeLabels(labels, []));
  });
});

describe('placeLabels at the edge of the screen', () => {
  const screen = { left: 0, top: 0, right: 400, bottom: 800 };

  it('moves a label the edge would cut back inside', () => {
    const l = label(385, 100);
    const [p] = placeLabels([l], [], screen);
    expect(p.visible).toBe(true);
    expect(box(l, p.dx, p.dy).right).toBeLessThanOrEqual(400);
  });

  it('leaves a label wholly off screen where it is, ready for a pan', () => {
    expect(placeLabels([label(900, 100)], [], screen)[0]).toEqual({ dx: 0, dy: 0, visible: true });
  });

  it('hides a label too wide to fit', () => {
    expect(placeLabels([label(200, 100, 3, 500)], [], screen)[0].visible).toBe(false);
  });
});

describe('labelShowsAtZoom', () => {
  it('shows realm names from zoom 3 and provinces only from zoom 6', () => {
    expect(labelShowsAtZoom(1, 3)).toBe(true);
    expect(labelShowsAtZoom(3, 4)).toBe(false);
    expect(labelShowsAtZoom(4, 5)).toBe(false);
    expect(labelShowsAtZoom(4, 6)).toBe(true);
  });
});
