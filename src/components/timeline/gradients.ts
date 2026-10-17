import { EventItem } from '../../data';
import { eraColorOf } from '../../utils/eventHelpers';
import { getEraColor } from '../../utils/eraColors';

/**
 * Build a `linear-gradient(to left, ...)` that transitions between era colors
 * along the timeline. Each event contributes one color stop at its index-based
 * percentage, so the rail visually maps 1:1 to the event sequence.
 */
export function buildEraGradient(events: EventItem[]): string {
  if (events.length === 0) {
    return `linear-gradient(to left, ${getEraColor('prophetic')}, ${getEraColor('abuBakr')})`;
  }
  if (events.length === 1) {
    return `linear-gradient(to left, ${eraColorOf(events[0])}, ${eraColorOf(events[0])})`;
  }
  const stops = events
    .map((evt, i) => `${eraColorOf(evt)} ${(i / (events.length - 1)) * 100}%`)
    .join(', ');
  return `linear-gradient(to left, ${stops})`;
}

/**
 * Build the progress-fill gradient covering `events[0..=selectedIndex]`.
 * When only one event is behind the cursor there is nothing to interpolate,
 * so we return that era's solid color.
 */
export function buildProgressGradient(events: EventItem[], selectedIndex: number): string {
  if (selectedIndex < 0) return 'transparent';
  const progress = events.slice(0, selectedIndex + 1);
  if (progress.length < 2) return eraColorOf(progress[0]);
  const stops = progress
    .map((evt, i) => `${eraColorOf(evt)} ${(i / (progress.length - 1)) * 100}%`)
    .join(', ');
  return `linear-gradient(to left, ${stops})`;
}

/**
 * Scroll `container` horizontally so `el`'s center aligns with the container's
 * center. RTL-safe (uses getBoundingClientRect for coordinates). No-op if
 * either argument is missing.
 */
export function centerElementInContainer(
  container: HTMLElement | null,
  el: HTMLElement | null,
  smooth: boolean,
): void {
  if (!container || !el) return;
  const containerRect = container.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  const scrollOffset =
    elRect.left + elRect.width / 2 - (containerRect.left + containerRect.width / 2);
  container.scrollBy({ left: scrollOffset, behavior: smooth ? 'smooth' : 'instant' });
}
