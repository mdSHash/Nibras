import { lazy, Suspense } from 'react';
import { useTourContext } from '../contexts/TourContext';
import { ErrorBoundary } from './ErrorBoundary';

// The cards, their text and drawings load only when the tour opens (Phase 7, src/tour/).
const SiteTour = lazy(() => import('../tour/SiteTour'));

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
