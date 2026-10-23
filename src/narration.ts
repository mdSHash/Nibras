// Where an event's recorded narration is (Phase 3D): src/generated/narration.json
// lists the fresh recordings of public/audio/manifest.json (scripts/build-content.ts).
// No entry means no narration: the panel hides its play button and player mode
// pauses on the title instead.
import generatedNarration from './generated/narration.json';
import { narrationFileName, type GeneratedNarration, type NarrationKind } from '../shared/narration';
import { eventSlug } from '../shared/routes';

const narration: GeneratedNarration = generatedNarration;

export function narrationUrl(event: { id: string; slug?: string }, kind: NarrationKind): string | null {
  const hash = narration[event.id]?.[kind];
  return hash ? `${import.meta.env.BASE_URL}audio/${narrationFileName(eventSlug(event), kind, hash)}` : null;
}
