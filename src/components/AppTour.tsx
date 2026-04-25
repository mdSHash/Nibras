import React, { useEffect, useState, useRef, useCallback } from 'react';
import { AnimatePresence } from 'motion/react';
import { useTourContext } from '../contexts/TourContext';
import { calculateSpotlightPosition, calculateTooltipPosition } from '../hooks/useTour';
import { TourSpotlight } from './TourSpotlight';
import { TourTooltip } from './TourTooltip';
import { TourProgress } from './TourProgress';
import { TourPrompt } from './TourPrompt';
import { SpotlightPosition, TooltipPosition } from '../types/tour';

export const AppTour: React.FC = () => {
  const {
    state,
    currentStepData,
    totalSteps,
    nextStep,
    previousStep,
    skipTour,
    endTour,
    showPrompt,
    acceptTourPrompt,
    declineTourPrompt
  } = useTourContext();

  const [spotlightPosition, setSpotlightPosition] = useState<SpotlightPosition | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedFocusRef = useRef<HTMLElement | null>(null);

  const updatePositions = useCallback(() => {
    if (!currentStepData || !state.isActive) {
      setSpotlightPosition(null);
      setTooltipPosition(null);
      return;
    }

    // Note: Ensure all data-tour-id values are unique across the app.
    // Duplicate IDs will cause querySelector to match the first occurrence,
    // potentially targeting hidden elements and misplacing the spotlight.
    const targetElement = document.querySelector(currentStepData.target) as HTMLElement;
    
    if (!targetElement) {
      if (currentStepData.target === 'body') {
        setSpotlightPosition({
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight
        });
        
        // For center position, set tooltip position immediately
        if (currentStepData.position === 'center') {
          setTooltipPosition({
            top: window.innerHeight / 2,
            left: window.innerWidth / 2,
            transform: 'translate(-50%, -50%)'
          });
        }
      } else {
        console.warn(`Tour target element not found: ${currentStepData.target}`);
      }
      return;
    }

    // Check if element is visible
    const rect = targetElement.getBoundingClientRect();
    const isVisible = rect.width > 0 && rect.height > 0 &&
                     rect.top < window.innerHeight && rect.bottom > 0 &&
                     rect.left < window.innerWidth && rect.right > 0;
    
    if (!isVisible) {
      console.warn(`Tour target element not visible: ${currentStepData.target}`);
    }

    const padding = currentStepData.spotlightPadding ?? 10;
    const newSpotlightPosition = calculateSpotlightPosition(targetElement, padding);
    setSpotlightPosition(newSpotlightPosition);

    // Calculate tooltip position with retry mechanism
    const calculateTooltip = () => {
      if (!tooltipRef.current) {
        // Retry after a short delay if ref not ready
        setTimeout(calculateTooltip, 50);
        return;
      }
      
      const tooltipElement = tooltipRef.current;
      const newTooltipPosition = calculateTooltipPosition(
        targetElement,
        tooltipElement,
        currentStepData.position
      );
      setTooltipPosition(newTooltipPosition);
    };
    
    calculateTooltip();
  }, [currentStepData, state.isActive]);

  useEffect(() => {
    if (!state.isActive || !currentStepData) return;

    let cancelled = false;

    const executeBeforeShow = async () => {
      if (currentStepData.beforeShow) {
        await currentStepData.beforeShow();
      }
      
      if (!cancelled) {
        setTimeout(() => {
          updatePositions();
        }, 100);
      }
    };

    executeBeforeShow();

    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = setTimeout(updatePositions, 150);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', updatePositions, true);

    return () => {
      cancelled = true;
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', updatePositions, true);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [state.isActive, currentStepData, updatePositions]);

  const handleNext = async () => {
    if (currentStepData?.afterShow) {
      await currentStepData.afterShow();
    }
    
    if (state.currentStep === totalSteps - 1) {
      endTour();
    } else {
      nextStep();
    }
  };

  const handlePrevious = async () => {
    previousStep();
  };

  // Focus trap for accessibility
  useEffect(() => {
    if (!state.isActive) {
      // Restore focus when tour ends
      if (savedFocusRef.current) {
        savedFocusRef.current.focus();
        savedFocusRef.current = null;
      }
      return;
    }

    // Save current focus and focus tooltip
    savedFocusRef.current = document.activeElement as HTMLElement;
    if (tooltipRef.current) {
      const firstFocusable = tooltipRef.current.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !tooltipRef.current) return;

      const focusableElements = tooltipRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [state.isActive]);

  return (
    <>
      <TourPrompt
        isOpen={showPrompt}
        onAccept={acceptTourPrompt}
        onDecline={declineTourPrompt}
      />

      <AnimatePresence mode="wait">
        {state.isActive && spotlightPosition && currentStepData && (
          <div key="tour-overlay">
            <TourProgress
              currentStep={state.currentStep}
              totalSteps={totalSteps}
            />

            <TourSpotlight
              position={spotlightPosition}
              disableInteraction={currentStepData.disableInteraction}
            />

            <div ref={tooltipRef}>
              <TourTooltip
                title={currentStepData.title}
                content={currentStepData.content}
                position={tooltipPosition || {}}
                currentStep={state.currentStep}
                totalSteps={totalSteps}
                onNext={handleNext}
                onPrevious={handlePrevious}
                onSkip={skipTour}
                showPrevious={state.currentStep > 0}
                showNext={true}
              />
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

