/**
 * «تحدي اليوم»'s own tour (Phase 7): the same illustrated cards as Nibras's, with the game's seven
 * steps, for players who open the game alone. Loaded on demand from App.tsx: on a first visit right
 * after the player picks a level, and from «إزاي ألعب؟» in the header. The recordings live with
 * Nibras's (`<base>/audio/`).
 */
import tours from '../../generated/tours.json';
import type { GeneratedTours } from '../../../shared/tours';
import { TourCards } from '../../tour/TourCards';
import { nibrasBase } from '../engine/daily';

export default function GameTour({ start, onClose }: { start: 'ask' | 'play'; onClose: (how: 'done' | 'skip') => void }) {
  return <TourCards tour={(tours as GeneratedTours).game} audioBase={`${nibrasBase()}audio/`} start={start} onClose={onClose} />;
}
