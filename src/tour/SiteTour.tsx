/**
 * Nibras's tour (Phase 7): the cards with the site's steps. Loaded on demand (src/components/AppTour.tsx),
 * so the tour's text and drawings cost nothing until it opens. A step inside the event panel shows
 * the panel, and opens غزوة بدر when the open event lacks the part the card points at (not every
 * event has people, verses or a video), so «وريني فين» always has something to light.
 */
import tours from '../generated/tours.json';
import type { GeneratedTours, TourStep } from '../../shared/tours';
import { useAppStore } from '../store/appStore';
import { eventsData } from '../data';
import { selectEvent } from '../router';
import { TourCards } from './TourCards';

const SAMPLE_EVENT = 'battle-badr';

const wait = (ms: number) => new Promise((r) => window.setTimeout(r, ms));

async function prepare(step: TourStep): Promise<void> {
  if (!step.needsEvent) return;
  const { eventId, isPanelHidden, setPanelHidden } = useAppStore.getState();
  if (isPanelHidden) setPanelHidden(false);
  if (eventId) await wait(150);
  if (eventId === SAMPLE_EVENT || (eventId && step.target && document.querySelector(`[data-tour-id="${step.target}"]`))) return;
  const sample = eventsData.find((e) => e.id === SAMPLE_EVENT);
  if (sample) selectEvent(sample);
}

export default function SiteTour({ start, onClose }: { start: 'ask' | 'play'; onClose: (how: 'done' | 'skip') => void }) {
  return <TourCards tour={(tours as GeneratedTours).site} audioBase={`${import.meta.env.BASE_URL}audio/`} start={start} onClose={onClose} prepare={prepare} />;
}
