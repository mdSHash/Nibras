import { useCallback, useEffect, useState } from 'react';
import { TourState, TourStep } from '../types/tour';
import { tourSteps } from '../data/tourSteps';

const TOUR_STATE_KEY = 'nibras-tour-state';
const TOUR_PROMPTED_KEY = 'nibras_tour_prompted';

const readJson = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...(JSON.parse(raw) as T) } : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage disabled — silently continue */
  }
};

const INITIAL_STATE: TourState = { isActive: false, currentStep: 0 };

const loadState = (): TourState => ({
  ...readJson(TOUR_STATE_KEY, INITIAL_STATE),
  isActive: false,
});

const hasBeenPrompted = () => {
  try {
    return localStorage.getItem(TOUR_PROMPTED_KEY) === 'true';
  } catch {
    return false;
  }
};

export const useTour = () => {
  const [state, setState] = useState<TourState>(loadState);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    writeJson(TOUR_STATE_KEY, state);
  }, [state]);

  const currentStepData: TourStep | null =
    state.isActive && state.currentStep < tourSteps.length
      ? tourSteps[state.currentStep]
      : null;

  const startTour = useCallback(() => {
    setState({ isActive: true, currentStep: 0 });
    setShowPrompt(false);
  }, []);

  const endTour = useCallback(() => {
    setState((prev) => ({ ...prev, isActive: false }));
  }, []);

  const nextStep = useCallback(() => {
    setState((prev) =>
      prev.currentStep + 1 >= tourSteps.length
        ? { ...prev, isActive: false }
        : { ...prev, currentStep: prev.currentStep + 1 }
    );
  }, []);

  const previousStep = useCallback(() => {
    setState((prev) => ({ ...prev, currentStep: Math.max(0, prev.currentStep - 1) }));
  }, []);

  const skipTour = useCallback(() => {
    setState((prev) => ({ ...prev, isActive: false }));
  }, []);

  const triggerPrompt = useCallback((): boolean => {
    if (hasBeenPrompted()) return false;
    setShowPrompt(true);
    return true;
  }, []);

  const isFirstVisit = useCallback(() => !hasBeenPrompted(), []);

  const markPrompted = () => {
    try {
      localStorage.setItem(TOUR_PROMPTED_KEY, 'true');
    } catch {
      /* storage disabled */
    }
  };

  const acceptTourPrompt = useCallback(() => {
    markPrompted();
    startTour();
  }, [startTour]);

  const declineTourPrompt = useCallback(() => {
    markPrompted();
    setShowPrompt(false);
  }, []);

  return {
    state,
    currentStepData,
    totalSteps: tourSteps.length,
    startTour,
    endTour,
    nextStep,
    previousStep,
    skipTour,
    showPrompt,
    triggerPrompt,
    isFirstVisit,
    acceptTourPrompt,
    declineTourPrompt,
  };
};
