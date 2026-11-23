import { useCallback, useState } from 'react';

/**
 * Nibras's tour state (Phase 7, the illustrated cards in src/tour/). A first visit gets the first
 * card's question once, after the intro (`triggerPrompt`); the compass button opens it at any time
 * (`startTour`), and that tap lets the browser play the narration at once. Answering the question
 * or closing the tour marks it seen, so it doesn't come back by itself. The key is the old tour's,
 * so visitors who answered that one aren't asked again.
 */
const TOUR_PROMPTED_KEY = 'nibras_tour_prompted';

const hasBeenPrompted = (): boolean => {
  try {
    return localStorage.getItem(TOUR_PROMPTED_KEY) === 'true';
  } catch {
    return false;
  }
};

const markPrompted = (): void => {
  try {
    localStorage.setItem(TOUR_PROMPTED_KEY, 'true');
  } catch {
    /* storage disabled: the question may come back next visit */
  }
};

export interface TourState {
  isActive: boolean;
  /** `ask` on a first visit, `play` from the tour button. */
  start: 'ask' | 'play';
}

export const useTour = () => {
  const [state, setState] = useState<TourState>({ isActive: false, start: 'ask' });

  const startTour = useCallback(() => setState({ isActive: true, start: 'play' }), []);

  const endTour = useCallback(() => {
    markPrompted();
    setState((prev) => ({ ...prev, isActive: false }));
  }, []);

  const triggerPrompt = useCallback((): boolean => {
    if (hasBeenPrompted()) return false;
    setState({ isActive: true, start: 'ask' });
    return true;
  }, []);

  const isFirstVisit = useCallback(() => !hasBeenPrompted(), []);

  return { state, startTour, endTour, triggerPrompt, isFirstVisit };
};
