import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { useTourContext } from '../contexts/TourContext';
import {
  calculateSpotlightPosition,
  calculateTooltipPosition,
  queryVisibleTourTarget,
} from '../utils/tour';
import { closeAllPanels } from '../data/tourSteps';
import { TourSpotlight } from './TourSpotlight';
import { TourTooltip } from './TourTooltip';
import { TourProgress } from './TourProgress';
import { TourPrompt } from './TourPrompt';
import { SpotlightPosition, TooltipPosition } from '../types/tour';
import { Z_INDEX } from '../constants';

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
const TARGET_POLL_MS = 2000;
const TARGET_POLL_INTERVAL = 100;

export const AppTour = () => {
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
    declineTourPrompt,
  } = useTourContext();

  const [spotlight, setSpotlight] = useState<SpotlightPosition | null>(null);
  const [tooltip, setTooltip] = useState<TooltipPosition | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const savedFocusRef = useRef<HTMLElement | null>(null);

  const updatePositions = useCallback(() => {
    if (!currentStepData || !state.isActive) {
      setSpotlight(null);
      setTooltip(null);
      return;
    }

    // Fullscreen step (welcome / navigation-tips / complete) — spotlight covers viewport.
    if (currentStepData.target === 'body') {
      setSpotlight({ top: 0, left: 0, width: window.innerWidth, height: window.innerHeight });
      if (currentStepData.position === 'center') {
        setTooltip({
          top: window.innerHeight / 2,
          left: window.innerWidth / 2,
          transform: 'translate(-50%, -50%)',
        });
      }
      return;
    }

    const target = queryVisibleTourTarget(currentStepData.target);
    if (!target) {
      setSpotlight(null);
      setTooltip(null);
      return;
    }

    const padding = currentStepData.spotlightPadding ?? 10;
    setSpotlight(calculateSpotlightPosition(target, padding));

    // Tooltip depends on its own measured size, so wait one frame if the ref
    // hasn't mounted yet (first render of this step).
    const placeTooltip = () => {
      if (!tooltipRef.current) return requestAnimationFrame(placeTooltip);
      setTooltip(calculateTooltipPosition(target, tooltipRef.current, currentStepData.position));
    };
    placeTooltip();
  }, [currentStepData, state.isActive]);

  // Run step lifecycle: beforeShow → measure → observe target for resizes.
  useEffect(() => {
    if (!state.isActive || !currentStepData) return;

    let cancelled = false;
    let pollId: ReturnType<typeof setInterval> | null = null;
    let resizeObserver: ResizeObserver | null = null;

    const observeTarget = () => {
      const target = queryVisibleTourTarget(currentStepData.target);
      if (!target) return;
      resizeObserver?.disconnect();
      resizeObserver = new ResizeObserver(() => updatePositions());
      resizeObserver.observe(target);
    };

    const run = async () => {
      setTransitioning(true);
      // Step-specific setup, or default panel cleanup for steps without one.
      await (currentStepData.beforeShow ?? closeAllPanels)();
      if (cancelled) return;

      updatePositions();
      observeTarget();

      // Target may not be mounted yet (a drawer that beforeShow opened will
      // mount the target on the next frame). Poll briefly.
      if (currentStepData.target !== 'body' && !queryVisibleTourTarget(currentStepData.target)) {
        let elapsed = 0;
        pollId = setInterval(() => {
          if (cancelled) return;
          elapsed += TARGET_POLL_INTERVAL;
          if (queryVisibleTourTarget(currentStepData.target)) {
            if (pollId) clearInterval(pollId);
            updatePositions();
            observeTarget();
          } else if (elapsed >= TARGET_POLL_MS && pollId) {
            clearInterval(pollId);
          }
        }, TARGET_POLL_INTERVAL);
      }

      setTimeout(() => {
        if (!cancelled) setTransitioning(false);
      }, 150);
    };
    run();

    const onResize = () => updatePositions();
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, true);

    return () => {
      cancelled = true;
      if (pollId) clearInterval(pollId);
      resizeObserver?.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize, true);
    };
  }, [state.isActive, currentStepData, updatePositions]);

  const handleNext = useCallback(async () => {
    if (transitioning) return;
    await currentStepData?.afterShow?.();
    if (state.currentStep === totalSteps - 1) endTour();
    else nextStep();
  }, [currentStepData, state.currentStep, totalSteps, endTour, nextStep, transitioning]);

  const handlePrevious = useCallback(() => {
    if (transitioning || state.currentStep === 0) return;
    previousStep();
  }, [previousStep, state.currentStep, transitioning]);

  // Keyboard: arrows (RTL-aware), Escape, Enter/Space to advance.
  useEffect(() => {
    if (!state.isActive) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); handleNext(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); handlePrevious(); }
      else if (e.key === 'Escape') { e.preventDefault(); skipTour(); }
      else if ((e.key === 'Enter' || e.key === ' ') && !(document.activeElement instanceof HTMLButtonElement)) {
        e.preventDefault();
        handleNext();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [state.isActive, handleNext, handlePrevious, skipTour]);

  // Focus save/restore + focus trap inside the tooltip.
  useEffect(() => {
    if (!state.isActive) {
      savedFocusRef.current?.focus();
      savedFocusRef.current = null;
      return;
    }

    savedFocusRef.current = document.activeElement as HTMLElement;
    tooltipRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !tooltipRef.current) return;
      const focusables = tooltipRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', trap);
    return () => document.removeEventListener('keydown', trap);
  }, [state.isActive]);

  return (
    <>
      <TourPrompt isOpen={showPrompt} onAccept={acceptTourPrompt} onDecline={declineTourPrompt} />

      <AnimatePresence mode="wait">
        {state.isActive && spotlight && currentStepData && (
          <div key="tour-overlay" style={{ zIndex: Z_INDEX.tourBackdrop }}>
            <TourProgress currentStep={state.currentStep} totalSteps={totalSteps} />
            <TourSpotlight position={spotlight} disableInteraction={currentStepData.disableInteraction} />
            <div ref={tooltipRef}>
              <TourTooltip
                title={currentStepData.title}
                content={currentStepData.content}
                position={tooltip ?? {}}
                currentStep={state.currentStep}
                totalSteps={totalSteps}
                onNext={handleNext}
                onPrevious={handlePrevious}
                onSkip={skipTour}
                showPrevious={state.currentStep > 0}
              />
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
