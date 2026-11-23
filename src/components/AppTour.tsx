import { lazy, Suspense } from 'react';
import { useTourContext } from '../contexts/TourContext';
import { ErrorBoundary } from './ErrorBoundary';

// The cards, their text and drawings load only when needed (Phase 7, src/tour/). On a first visit
// App.tsx starts the download during the intro, so the first card is ready when it asks.
export const preloadSiteTour = () => import('../tour/SiteTour');
const SiteTour = lazy(preloadSiteTour);

export const AppTour = () => {
  const { state, endTour } = useTourContext();
  if (!state.isActive) return null;
  return (
    <ErrorBoundary area="tour" variant="floating" onDismiss={endTour}>
      <Suspense fallback={null}>
        <SiteTour start={state.start} onClose={endTour} />
      </Suspense>
    </ErrorBoundary>
  );
};
