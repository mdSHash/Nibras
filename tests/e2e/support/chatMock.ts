// A mocked chat API answer in the real contract (shared/chatApi.ts). Text is
// taken verbatim from the app's own data, and the citations cover every kind
// of screen a citation can open: an event, a person, a Quran passage, a battle.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { ChatSuccessBody } from '../../../shared/chatApi';
import type { ChatResponder } from './stubs';

const ROOT = join(import.meta.dirname, '..', '..', '..');
const events = JSON.parse(readFileSync(join(ROOT, 'src', 'dataList.json'), 'utf8')) as {
  id: string;
  title: string;
  era: string;
  details: { summary: string };
}[];
const quran = Object.fromEntries(
  (
    JSON.parse(readFileSync(join(ROOT, 'src', 'generated', 'quranPassages.json'), 'utf8')) as {
      key: string;
      text: string;
      link: string;
    }[]
  ).map((p) => [p.key, p]),
);

const badr = events.find((e) => e.id === 'battle-badr')!;
export const MOCK_QURAN_KEY = 'سورة الأنفال: 9';
export const MOCK_COMPANION_ID = 'abu-bakr';
export const MOCK_BATTLE_ID = 'badr';

export const CITATION_LABELS = {
  event: badr.title,
  companion: 'أبو بكر الصديق',
  quran: MOCK_QURAN_KEY,
  battle: 'محاكاة غزوة بدر',
};

export const mockChatAnswer: ChatSuccessBody = {
  answer: badr.details.summary,
  blocks: [
    { type: 'text', text: badr.details.summary, citations: ['event:battle-badr'] },
    {
      type: 'quran',
      key: MOCK_QURAN_KEY,
      text: quran[MOCK_QURAN_KEY].text,
      link: quran[MOCK_QURAN_KEY].link,
      citations: [`quran:${MOCK_QURAN_KEY}`],
    },
  ],
  citations: [
    { chunkId: 'event:battle-badr', sourceLabel: CITATION_LABELS.event, type: 'event', era: badr.era, entityRefs: { eventId: 'battle-badr' } },
    { chunkId: `companion:${MOCK_COMPANION_ID}`, sourceLabel: CITATION_LABELS.companion, type: 'companion', entityRefs: { companionId: MOCK_COMPANION_ID } },
    { chunkId: `quran:${MOCK_QURAN_KEY}`, sourceLabel: CITATION_LABELS.quran, type: 'quran', entityRefs: { quranKey: MOCK_QURAN_KEY } },
    { chunkId: `battle:${MOCK_BATTLE_ID}`, sourceLabel: CITATION_LABELS.battle, type: 'battle', entityRefs: { battleId: MOCK_BATTLE_ID } },
  ],
  grounded: true,
  mode: 'composed',
  context: { recordIds: ['event:battle-badr'], carried: [] },
  followUps: ['متى كانت غزوة أحد؟'],
};

export const defaultChatReply: ChatResponder = () => ({ json: mockChatAnswer });
