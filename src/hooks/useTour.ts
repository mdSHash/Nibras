import { useState, useEffect, useCallback } from 'react';
import { TourState, TourStep, SpotlightPosition, TooltipPosition } from '../types/tour';
import { tourSteps } from '../data/tourSteps';

const TOUR_STORAGE_KEY = 'nibras-tour-state';
const TOUR_PREFERENCES_KEY = 'nibras-tour-preferences';

interface TourPreferences {
  autoStart: boolean;
  hasPrompted: boolean;
}

const getTourPreferences = (): TourPreferences => {
  try {
    const stored = localStorage.getItem(TOUR_PREFERENCES_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading tour preferences:', error);
  }
  
  return {
    autoStart: false,
    hasPrompted: false
  };
};

const saveTourPreferences = (preferences: TourPreferences) => {
  try {
    localStorage.setItem(TOUR_PREFERENCES_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving tour preferences:', error);
  }
};

const getInitialState = (): TourState => {
  try {
    const stored = localStorage.getItem(TOUR_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading tour state:', error);
  }
  
  return {
    isActive: false,
    currentStep: 0,
    isCompleted: false,
    hasSeenTour: false
  };
};

const saveTourState = (state: TourState) => {
  try {
    localStorage.setItem(TOUR_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving tour state:', error);
  }
};

export const useTour = () => {
  const [state, setState] = useState<TourState>(getInitialState);
  const [currentStepData, setCurrentStepData] = useState<TourStep | null>(null);
  const [preferences, setPreferences] = useState<TourPreferences>(getTourPreferences);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    saveTourState(state);
  }, [state]);

  useEffect(() => {
    saveTourPreferences(preferences);
  }, [preferences]);

  useEffect(() => {
    const prefs = getTourPreferences();
    const tourState = getInitialState();
    
    if (!prefs.hasPrompted && !tourState.hasSeenTour) {
      setShowPrompt(true);
    } else if (prefs.autoStart && !tourState.hasSeenTour && !tourState.isCompleted) {
      setTimeout(() => {
        startTour();
      }, 1000);
    }
  }, []);

  useEffect(() => {
    if (state.isActive && state.currentStep < tourSteps.length) {
      setCurrentStepData(tourSteps[state.currentStep]);
    } else {
      setCurrentStepData(null);
    }
  }, [state.isActive, state.currentStep]);

  const startTour = useCallback(() => {
    setState({
      isActive: true,
      currentStep: 0,
      isCompleted: false,
      hasSeenTour: true
    });
    setShowPrompt(false);
  }, []);

  const acceptTourPrompt = useCallback(() => {
    setPreferences({
      autoStart: true,
      hasPrompted: true
    });
    startTour();
  }, [startTour]);

  const declineTourPrompt = useCallback(() => {
    setPreferences({
      autoStart: false,
      hasPrompted: true
    });
    setState(prev => ({
      ...prev,
      hasSeenTour: true
    }));
    setShowPrompt(false);
  }, []);

  const endTour = useCallback(() => {
    setState(prev => ({
      ...prev,
      isActive: false,
      isCompleted: true
    }));
  }, []);

  const nextStep = useCallback(() => {
    setState(prev => {
      const nextStepIndex = prev.currentStep + 1;
      if (nextStepIndex >= tourSteps.length) {
        return {
          ...prev,
          isActive: false,
          isCompleted: true
        };
      }
      return {
        ...prev,
        currentStep: nextStepIndex
      };
    });
  }, []);

  const previousStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(0, prev.currentStep - 1)
    }));
  }, []);

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < tourSteps.length) {
      setState(prev => ({
        ...prev,
        currentStep: step
      }));
    }
  }, []);

  const skipTour = useCallback(() => {
    setState(prev => ({
      ...prev,
      isActive: false,
      hasSeenTour: true,
      isCompleted: false
    }));
  }, []);

  const resetTour = useCallback(() => {
    setState({
      isActive: false,
      currentStep: 0,
      isCompleted: false,
      hasSeenTour: false
    });
    localStorage.removeItem(TOUR_STORAGE_KEY);
  }, []);

  return {
    state,
    currentStepData,
    totalSteps: tourSteps.length,
    startTour,
    endTour,
    nextStep,
    previousStep,
    goToStep,
    skipTour,
    resetTour,
    showPrompt,
    acceptTourPrompt,
    declineTourPrompt,
    preferences
  };
};

export const calculateSpotlightPosition = (element: HTMLElement, padding: number = 10): SpotlightPosition => {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top - padding,
    left: rect.left - padding,
    width: rect.width + padding * 2,
    height: rect.height + padding * 2
  };
};

export const calculateTooltipPosition = (
  targetElement: HTMLElement,
  tooltipElement: HTMLElement,
  position: 'top' | 'bottom' | 'left' | 'right' | 'center'
): TooltipPosition => {
  const targetRect = targetElement.getBoundingClientRect();
  const tooltipRect = tooltipElement.getBoundingClientRect();
  const spacing = 20;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  if (position === 'center') {
    return {
      top: (viewportHeight - tooltipRect.height) / 2,
      left: (viewportWidth - tooltipRect.width) / 2
    };
  }

  let tooltipPos: TooltipPosition = {};

  switch (position) {
    case 'top':
      tooltipPos = {
        bottom: viewportHeight - targetRect.top + spacing,
        left: targetRect.left + targetRect.width / 2,
        transform: 'translateX(-50%)'
      };
      break;

    case 'bottom':
      tooltipPos = {
        top: targetRect.bottom + spacing,
        left: targetRect.left + targetRect.width / 2,
        transform: 'translateX(-50%)'
      };
      break;

    case 'left':
      tooltipPos = {
        top: targetRect.top + targetRect.height / 2,
        right: viewportWidth - targetRect.left + spacing,
        transform: 'translateY(-50%)'
      };
      break;

    case 'right':
      tooltipPos = {
        top: targetRect.top + targetRect.height / 2,
        left: targetRect.right + spacing,
        transform: 'translateY(-50%)'
      };
      break;
  }

  if (tooltipPos.left !== undefined) {
    if (tooltipPos.left < spacing) {
      tooltipPos.left = spacing;
      tooltipPos.transform = undefined;
    } else if (tooltipPos.left + tooltipRect.width > viewportWidth - spacing) {
      tooltipPos.left = viewportWidth - tooltipRect.width - spacing;
      tooltipPos.transform = undefined;
    }
  }

  if (tooltipPos.top !== undefined) {
    if (tooltipPos.top < spacing) {
      tooltipPos.top = spacing;
      tooltipPos.transform = tooltipPos.transform?.includes('translateX') ? tooltipPos.transform : undefined;
    } else if (tooltipPos.top + tooltipRect.height > viewportHeight - spacing) {
      tooltipPos.top = viewportHeight - tooltipRect.height - spacing;
      tooltipPos.transform = tooltipPos.transform?.includes('translateX') ? tooltipPos.transform : undefined;
    }
  }

  return tooltipPos;
};

// Made with Bob
