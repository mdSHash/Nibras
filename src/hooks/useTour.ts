import { useState, useEffect, useCallback } from 'react';
import { TourState, TourStep, SpotlightPosition, TooltipPosition } from '../types/tour';
import { tourSteps } from '../data/tourSteps';

const TOUR_STORAGE_KEY = 'nibras-tour-state';
const TOUR_PROMPTED_KEY = 'nibras_tour_prompted';

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

/** Check if the tour prompt has ever been shown to this user */
const hasBeenPrompted = (): boolean => {
  try {
    return localStorage.getItem(TOUR_PROMPTED_KEY) === 'true';
  } catch {
    return false;
  }
};

/** Mark that the tour prompt has been shown */
const markAsPrompted = () => {
  try {
    localStorage.setItem(TOUR_PROMPTED_KEY, 'true');
  } catch (error) {
    console.error('Error saving tour prompted state:', error);
  }
};

export const useTour = () => {
  const [state, setState] = useState<TourState>(getInitialState);
  const [currentStepData, setCurrentStepData] = useState<TourStep | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  // Persist tour state
  useEffect(() => {
    saveTourState(state);
  }, [state]);

  // Update current step data when step changes
  useEffect(() => {
    if (state.isActive && state.currentStep < tourSteps.length) {
      setCurrentStepData(tourSteps[state.currentStep]);
    } else {
      setCurrentStepData(null);
    }
  }, [state.isActive, state.currentStep]);

  /**
   * Trigger the tour prompt to show.
   * Called by App.tsx after intro completes, ONLY if this is the first visit.
   * Returns true if the prompt will be shown, false if already prompted before.
   */
  const triggerPrompt = useCallback((): boolean => {
    if (hasBeenPrompted()) {
      return false;
    }
    setShowPrompt(true);
    return true;
  }, []);

  /** Check if this is the user's first visit (never been prompted) */
  const isFirstVisit = useCallback((): boolean => {
    return !hasBeenPrompted();
  }, []);

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
    markAsPrompted();
    startTour();
  }, [startTour]);

  const declineTourPrompt = useCallback(() => {
    markAsPrompted();
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
    localStorage.removeItem(TOUR_PROMPTED_KEY);
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
    triggerPrompt,
    isFirstVisit,
    acceptTourPrompt,
    declineTourPrompt,
    preferences: { hasPrompted: hasBeenPrompted() }
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
  const isMobile = window.innerWidth < 640;
  const spacing = isMobile ? 12 : 20;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const edgeMargin = isMobile ? 16 : spacing;
  
  // Account for tour progress bar at top (approximately 60px on mobile)
  const topReservedSpace = isMobile ? 70 : 80;

  if (position === 'center') {
    return {
      top: Math.max(topReservedSpace, (viewportHeight - tooltipRect.height) / 2),
      left: Math.max(edgeMargin, (viewportWidth - tooltipRect.width) / 2)
    };
  }

  let tooltipPos: TooltipPosition = {};

  // On mobile, handle large targets specially
  if (isMobile && (position === 'left' || position === 'right')) {
    const spaceAbove = targetRect.top;
    const spaceBelow = viewportHeight - targetRect.bottom;
    
    // If target is very large (like map), position tooltip in visible area
    if (targetRect.height > viewportHeight * 0.6) {
      // Position at top of viewport, below progress bar
      return {
        top: topReservedSpace,
        left: edgeMargin
      };
    } else {
      position = spaceBelow > spaceAbove ? 'bottom' : 'top';
    }
  }

  switch (position) {
    case 'top':
      tooltipPos = {
        bottom: viewportHeight - targetRect.top + spacing,
        left: isMobile ? edgeMargin : targetRect.left + targetRect.width / 2,
        transform: isMobile ? undefined : 'translateX(-50%)'
      };
      break;

    case 'bottom':
      tooltipPos = {
        top: Math.min(targetRect.bottom + spacing, viewportHeight - tooltipRect.height - edgeMargin),
        left: isMobile ? edgeMargin : targetRect.left + targetRect.width / 2,
        transform: isMobile ? undefined : 'translateX(-50%)'
      };
      break;

    case 'left':
      tooltipPos = {
        top: Math.max(topReservedSpace, targetRect.top + targetRect.height / 2),
        right: viewportWidth - targetRect.left + spacing,
        transform: 'translateY(-50%)'
      };
      break;

    case 'right':
      tooltipPos = {
        top: Math.max(topReservedSpace, targetRect.top + targetRect.height / 2),
        left: targetRect.right + spacing,
        transform: 'translateY(-50%)'
      };
      break;
  }

  // Ensure tooltip stays within viewport bounds
  if (tooltipPos.left !== undefined) {
    if (tooltipPos.left < edgeMargin) {
      tooltipPos.left = edgeMargin;
      tooltipPos.transform = undefined;
    } else if (tooltipPos.left + tooltipRect.width > viewportWidth - edgeMargin) {
      tooltipPos.left = viewportWidth - tooltipRect.width - edgeMargin;
      tooltipPos.transform = undefined;
    }
  }

  if (tooltipPos.right !== undefined) {
    // Check if right positioning would push tooltip off screen
    const calculatedLeft = viewportWidth - tooltipPos.right - tooltipRect.width;
    if (calculatedLeft < edgeMargin) {
      // Switch to left positioning on mobile
      tooltipPos.left = edgeMargin;
      delete tooltipPos.right;
      tooltipPos.transform = undefined;
    }
  }

  if (tooltipPos.top !== undefined) {
    if (tooltipPos.top < topReservedSpace) {
      tooltipPos.top = topReservedSpace;
      tooltipPos.transform = tooltipPos.transform?.includes('translateX') ? tooltipPos.transform : undefined;
    } else if (tooltipPos.top + tooltipRect.height > viewportHeight - edgeMargin) {
      tooltipPos.top = Math.max(topReservedSpace, viewportHeight - tooltipRect.height - edgeMargin);
      tooltipPos.transform = tooltipPos.transform?.includes('translateX') ? tooltipPos.transform : undefined;
    }
  }

  if (tooltipPos.bottom !== undefined) {
    const calculatedTop = viewportHeight - tooltipPos.bottom;
    if (calculatedTop < edgeMargin) {
      tooltipPos.bottom = viewportHeight - edgeMargin;
      tooltipPos.transform = tooltipPos.transform?.includes('translateX') ? tooltipPos.transform : undefined;
    } else if (calculatedTop + tooltipRect.height > viewportHeight - edgeMargin) {
      // Not enough space at bottom, switch to top
      tooltipPos.top = edgeMargin;
      delete tooltipPos.bottom;
      tooltipPos.transform = undefined;
    }
  }

  return tooltipPos;
};
