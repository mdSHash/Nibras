// How the battle video player is laid out (Phase 3H). Videos are watched
// sideways (Mostafa, 2026-10-17), so on a phone held upright the player is
// drawn a quarter turn round: the visitor turns the phone and the video fills
// the long side. Safari on iPhone can neither lock the orientation nor show a
// page element full screen, so the turn is drawn with CSS; where the browser
// can (Chrome on Android), the full-screen button also locks the screen sideways.
import { useMatchMedia } from '../../hooks/useMatchMedia';

/** A phone held upright. */
const UPRIGHT_PHONE = '(orientation: portrait) and (pointer: coarse) and (max-width: 600px)';
/** A phone held sideways: little height, so the buttons go beside the video. */
const SIDEWAYS_PHONE = '(orientation: landscape) and (max-height: 500px)';

/** `rotated`: drawn a quarter turn round; `sideways`: buttons beside the video; `standard`: bar below. */
export type PlayerLayout = 'standard' | 'sideways' | 'rotated';

export function usePlayerLayout(): PlayerLayout {
  const upright = useMatchMedia(UPRIGHT_PHONE);
  const sideways = useMatchMedia(SIDEWAYS_PHONE);
  return upright ? 'rotated' : sideways ? 'sideways' : 'standard';
}

type LockableOrientation = ScreenOrientation & { lock?: (orientation: 'landscape') => Promise<void>; unlock?: () => void };

/** Full screen, then the screen locked sideways where the browser allows it (it needs full screen first). */
export async function enterFullscreen(element: HTMLElement): Promise<void> {
  await element.requestFullscreen();
  try {
    await (screen.orientation as LockableOrientation | undefined)?.lock?.('landscape');
  } catch {
    // Desktop browsers and iPad refuse the lock; full screen alone is fine there.
  }
}

export function exitFullscreen(): void {
  (screen.orientation as LockableOrientation | undefined)?.unlock?.();
  if (document.fullscreenElement) void document.exitFullscreen();
}
