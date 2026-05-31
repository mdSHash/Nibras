import React, { useEffect, useState, useRef, useCallback } from 'react';
import { AnimatePresence } from 'motion/react';
import { useTourContext } from '../contexts/TourContext';
import { calculateSpotlightPosition, calculateTooltipPosition } from '../hooks/useTour';
import { TourSpotlight } from './TourSpotlight';
import { TourTooltip } from './TourTooltip';
import { TourProgress } from './TourProgress';
import { TourPrompt } from './TourPrompt';
import { SpotlightPosition, TooltipPosition } from '../types/tour';
import { Z_INDEX } from '../constants';

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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedFocusRef = useRef<HTMLElement | null>(null);

  const updatePositions = useCallback(() => {
    if (!currentStepData || !state.isActive) {
      setSpotlightPosition(null);
      setTooltipPosition(null);
      return;
    }

    const targetElement = document.querySelector(currentStepData.target) as HTMLElement | null;

    if (!targetElement) {
      // Fullscreen step (e.g. welcome / completion) — spotlight covers viewport.
      if (currentStepData.target === 'body') {
        setSpotlightPosition({
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        });

        if (currentStepData.position === 'center') {
          setTooltipPosition({
            top: window.innerHeight / 2,
            left: window.innerWidth / 2,
            transform: 'translate(-50%, -50%)',
          });
        }
        return;
      }

      // Target missing — clear stale spotlight/tooltip so we don't render an
      // out-of-place overlay from the previous step.
      console.warn(`Tour target not found: ${currentStepData.target}`);
      setSpotlightPosition(null);
      setTooltipPosition(null);
      return;
    }

    const rect = targetElement.getBoundingClientRect();
    const isVisible = rect.width > 0 && rect.height > 0 &&
                     rect.top < window.innerHeight && rect.bottom > 0 &&
                     rect.left < window.innerWidth && rect.right > 0;

    if (!isVisible) {
      console.warn(`Tour target not visible: ${currentStepData.target}`);
      setSpotlightPosition(null);
      setTooltipPosition(null);
      return;
    }

    const padding = currentStepData.spotlightPadding ?? 10;
    setSpotlightPosition(calculateSpotlightPosition(targetElement, padding));

    const calculateTooltip = () => {
      if (!tooltipRef.current) {
        setTimeout(calculateTooltip, 50);
        return;
      }
      setTooltipPosition(
        calculateTooltipPosition(targetElement, tooltipRef.current, currentStepData.position)
      );
    };
    calculateTooltip();
  }, [currentStepData, state.isActive]);

  useEffect(() => {
    if (!state.isActive || !currentStepData) return;

    let cancelled = false;
    let pollInterval: ReturnType<typeof setInterval> | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let mutationObserver: MutationObserver | null = null;
    let observedTarget: Element | null = null;

    const observeTarget = () => {
      const target = document.querySelector(currentStepData.target);
      if (!target || target === observedTarget) return;
      observedTarget = target;

      // ResizeObserver: target resized (e.g. mobile drawer expanded) → reposition.
      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver?.disconnect();
        resizeObserver = new ResizeObserver(() => updatePositions());
        resizeObserver.observe(target);
      }
    };

    const executeBeforeShow = async () => {
      setIsTransitioning(true);

      if (currentStepData.beforeShow) {
        await currentStepData.beforeShow();
      }

      if (cancelled) return;

      // Brief delay for spotlight morphing before showing tooltip
      setTimeout(() => {
        updatePositions();
        observeTarget();

        // If target wasn't there yet (a beforeShow may have just opened a
        // drawer that mounts the target on the next frame), poll for up to
        // 2s before giving up.
        if (
          currentStepData.target !== 'body' &&
          !document.querySelector(currentStepData.target)
        ) {
          let elapsed = 0;
          pollInterval = setInterval(() => {
            elapsed += 100;
            if (cancelled) {
              if (pollInterval) clearInterval(pollInterval);
              return;
            }
            if (document.querySelector(currentStepData.target)) {
              if (pollInterval) clearInterval(pollInterval);
              pollInterval = null;
              updatePositions();
              observeTarget();
            } else if (elapsed >= 2000) {
              if (pollInterval) clearInterval(pollInterval);
              pollInterval = null;
            }
          }, 100);
        }

        setTimeout(() => {
          if (!cancelled) setIsTransitioning(false);
        }, 150);
      }, 100);
    };

    executeBeforeShow();

    // MutationObserver: target may be re-mounted (route change, conditional
    // render). Reposition when its presence/attributes change.
    if (typeof MutationObserver !== 'undefined') {
      mutationObserver = new MutationObserver(() => {
        const stillThere = document.querySelector(currentStepData.target);
        if (stillThere && stillThere !== observedTarget) {
          observeTarget();
          updatePositions();
        }
      });
      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style', 'hidden'],
      });
    }

    const handleResize = () => {
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = setTimeout(updatePositions, 150);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', updatePositions, true);

    return () => {
      cancelled = true;
      if (pollInterval) clearInterval(pollInterval);
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', updatePositions, true);
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
    };
  }, [state.isActive, currentStepData, updatePositions]);

  const handleNext = useCallback(async () => {
    if (isTransitioning) return;

    if (currentStepData?.afterShow) {
      await currentStepData.afterShow();
    }
    
    if (state.currentStep === totalSteps - 1) {
      endTour();
    } else {
      nextStep();
    }
  }, [currentStepData, state.currentStep, totalSteps, endTour, nextStep, isTransitioning]);

  const handlePrevious = useCallback(async () => {
    if (isTransitioning) return;
    if (state.currentStep > 0) {
      previousStep();
    }
  }, [previousStep, state.currentStep, isTransitioning]);

  const handleSkip = useCallback(() => {
    skipTour();
  }, [skipTour]);

  // Keyboard navigation: Arrow keys + Escape
  useEffect(() => {
    if (!state.isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          // In RTL, ArrowLeft = next
          e.preventDefault();
          handleNext();
          break;
        case 'ArrowRight':
          // In RTL, ArrowRight = previous
          e.preventDefault();
          handlePrevious();
          break;
        case 'Escape':
          e.preventDefault();
          handleSkip();
          break;
        case 'Enter':
        case ' ':
          // Allow Enter/Space to advance if not focused on a button
          if (!(document.activeElement instanceof HTMLButtonElement)) {
            e.preventDefault();
            handleNext();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [state.isActive, handleNext, handlePrevious, handleSkip]);

  // Focus management and focus trap
  useEffect(() => {
    if (!state.isActive) {
      if (savedFocusRef.current) {
        savedFocusRef.current.focus();
        savedFocusRef.current = null;
      }
      return;
    }

    savedFocusRef.current = document.activeElement as HTMLElement;
    if (tooltipRef.current) {
      const firstFocusable = tooltipRef.current.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }

    const handleTabKey = (e: KeyboardEvent) => {
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

    document.addEventListener('keydown', handleTabKey);

    return () => {
      document.removeEventListener('keydown', handleTabKey);
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
          <div key="tour-overlay" style={{ zIndex: Z_INDEX.tourBackdrop }}>
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
                onSkip={handleSkip}
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
