/**
 * Shared Tailwind class strings for the timeline subsystem.
 * Centralized so a WCAG-target-size or focus-ring change happens in one place.
 */

/** 44×44 minimum-tap-target icon button base. */
export const ICON_BTN =
  'min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full shrink-0';

/**
 * Visible focus indicator for interactive elements NOT inside the rail's
 * overflow-hidden container (docks, expand FAB). Uses ring-offset for
 * separation from the button surface.
 */
export const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black';

/**
 * Inset variant for interactive elements INSIDE the rail's overflow-hidden
 * wrapper (event items, mobile-collapsed play button, chevrons). A regular
 * ring would be clipped at the rail boundary; the inset version stays inside
 * the element itself.
 */
export const FOCUS_RING_INSET =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-inset';
