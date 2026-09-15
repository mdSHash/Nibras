/**
 * Retrieval for the chat assistant. Combines four signals:
 *   1. entity linking — records the question names (exact),
 *   2. BM25 keyword search over light-stemmed Arabic,
 *   3. semantic similarity (only from a complete, current embedding index),
 *   4. question-type hints ("متى" → dates, "كم" → army sizes, …),
 * and returns a compact evidence pack grouped by record.
 */
import type { KbRecord, KbUnit, UnitKind } from '../../shared/chatKb.js';
import { analyze, normalizeForMatch, searchStems } from '../../shared/arabicText.js';
import { embedQueryWith, type EmbeddingProvider } from './embeddings.js';
import { carryContext, type ChatContext } from './context.js';
import { linkEntities, type LinkedEntity } from './entityLinker.js';
import { getKb, plainText, type LoadedKb } from './kb.js';
import { getProviderIndex, semanticScores } from './semanticIndex.js';

export type Intent =
  | 'date' | 'location' | 'quantity' | 'duration' | 'role' | 'quran' | 'hadith' | 'sources'
  | 'list' | 'outcome' | 'reason' | 'biography' | 'death' | 'birth' | 'appearances' | 'military' | 'how';

// Patterns run on normalizeForMatch() text (ة→ه, ى→ي, alef variants folded),
// in both Modern Standard Arabic and Egyptian colloquial phrasing.
const INTENTS: [Intent, RegExp, UnitKind[]][] = [
  ['date', /(^| )(متي|امتي|امتا|تاريخ|اي سنه|اي عام|في سنه|سنه كم|سنه كام|في سنه كام)( |$)/, ['event_date']],
  ['location', /(^| )(اين|فين|منين|مكان|موقع|تقع|مكانها|مكانه)( |$)/, ['event_location', 'city']],
  ['quantity', /(^| )(كم|كام|عدد|تعداد|عددهم|قد ايه)( |$)/, ['event_army', 'event_duration']],
  ['duration', /(^| )(مده|استمرت|استمر|دامت|قعدت)( |$)/, ['event_duration']],
  ['role', /(^| )(دور|دوره|دورها|فعل|موقف|شارك|قاد|قائد|ابلي|عمل ايه|عملت ايه|عملوا ايه|كان بيعمل)( |$)/, ['event_role', 'event_figures']],
  ['hadith', /(^| )(حديث|الحديث|احاديث|الاحاديث)( |$)/, ['event_hadith']],
  ['sources', /(^| )(مصدر|مصادر|المصادر|مراجع|المراجع)( |$)/, ['event_sources']],
  ['list', /(^| )(اذكر|قائمه|قايمه|من هم|من هن|مين هما|مين هم|ما هي|ايه هي|ايه هما|جميع|كل|اهم|ابرز)( |$)/, ['list']],
  ['military', /(^| )(معارك|المعارك|معركه|غزوات|الغزوات|حروب|الحروب|فتوح|الفتوح|فتوحات|الفتوحات|سرايا|السرايا|قتال|حملات)( |$)/, ['list']],
  ['outcome', /(^| )(نتيجه|نتائج|النتيجه|انتهت|خلصت|انتصر|انتصروا|انتصار|كسب|كسبوا|هزم|اتهزم|اتهزموا|هزيمه|خسر|خسروا)( |$)/, ['battle_outcome', 'event_summary']],
  ['reason', /(^| )(لماذا|ليه|سبب|اسباب|اهميه|لم|عشان ايه|علشان ايه)( |$)/, ['event_description', 'battle_outcome', 'companion_bio']],
  ['how', /(^| )(كيف|ازاي|ازاى)( |$)/, ['event_step', 'event_description', 'event_role']],
  ['biography', /(^| )(من هو|من هي|مين هو|مين هي|مين|سيره|حياه|ترجمه|نسب|لقب|سمي|يلقب|لقبه|اتسمي|اسمه)( |$)/, ['companion_profile', 'companion_bio']],
  ['death', /(^| )(توفي|اتوفي|اتوفت|وفاه|استشهد|استشهدت|استشهاد|مات|ماتت|مقتل|قتل|اتقتل|اتقتلت|قتلوه|قتله)( |$)/, ['companion_profile', 'companion_bio', 'event_summary', 'event_role']],
  ['birth', /(^| )(ولد|ولدت|اتولد|اتولدت|مولد|ميلاد|مولده)( |$)/, ['companion_profile', 'event_date']],
  ['appearances', /(^| )(في اي|الاحداث التي|الاحداث اللي|اين ورد|ورد ذكر|اتذكر فين)( |$)/, ['companion_events']],
];

/**
 * Qur'an questions are detected on letters before ة→ه folding: the Egyptian
 * "إيه" (what) and "آية" (verse) are identical once folded.
 */
const QURAN_WORDS = /(^| )(اية|ايات|الاية|الايه|الايات|قران|القران|سوره|سورة|السورة|نزلت|نزل)( |$)/;

export function detectIntents(question: string): { intents: Intent[]; kinds: Set<UnitKind> } {
  const normalized = ` ${normalizeForMatch(question)} `;
  const intents: Intent[] = [];
  const kinds = new Set<UnitKind>();
  for (const [intent, pattern, unitKinds] of INTENTS) {
    if (pattern.test(normalized)) {
      intents.push(intent);
      unitKinds.forEach(k => kinds.add(k));
    }
  }
  const raw = ` ${analyze(question).map(t => t.raw).join(' ')} `;
  if (QURAN_WORDS.test(raw)) {
    intents.push('quran');
    kinds.add('event_quran');
    kinds.add('quran_verse');
  }
  return { intents, kinds };
}

// Mild prior so that, for a bare "tell me about X", the defining units lead.
const KIND_PRIOR: Partial<Record<UnitKind, number>> = {
  event_summary: 0.006, companion_profile: 0.006, city: 0.005, quran_verse: 0.005, list: 0.004,
  event_date: 0.004, event_location: 0.003, battle_outcome: 0.002, event_description: 0.002,
  companion_bio: 0.002, event_step: 0.001,
};

const BM25_K1 = 1.2;
const BM25_B = 0.75;
const BM25_MIN = 2.5;
const SEMANTIC_MIN: Record<EmbeddingProvider, number> = { gemini: 0.62, openrouter: 0.45 };
const RRF_K = 60;

// Same-meaning vocabulary in this domain. A question word from a group also
// searches the other members at reduced weight, so "أسلم" finds "آمن".
// Egyptian colloquial forms ("اتقتل", "اتولد", "كسب", "حصل") are listed with
// the standard words the data uses, so dialect questions reach the same text.
const SYNONYM_GROUPS = [
  'أسلم آمن إسلام إيمان',
  'استشهد قتل توفي مات وفاة استشهاد مقتل اتقتل قتلوه اتوفى',
  'غزوة معركة موقعة وقعة',
  'خليفة خلافة تولى',
  'هاجر هجرة',
  'تزوج زواج زوجة زوج اتجوز',
  'ولد مولد ميلاد اتولد',
  'جيش جند مقاتل مقاتلين عساكر',
  'قاد قائد قيادة',
  'نبي رسول',
  'سبب أسباب دافع',
  'انتصر نصر انتصار كسب فاز',
  'هزم هزيمة خسر اتهزم انهزم',
  'حصل وقع جرى',
  'راح خرج ذهب توجه',
  'دفن اتدفن مدفون',
  'بنى بناء اتبنى',
];

const SYNONYMS = new Map<string, string[]>();
for (const group of SYNONYM_GROUPS) {
  const stems = [...new Set(searchStems(group))];
  for (const stem of stems) SYNONYMS.set(stem, stems.filter(s => s !== stem));
}

const SYNONYM_WEIGHT = 0.6;

function bm25(kb: LoadedKb, stems: string[]): { unitIndex: number; score: number; matched: number }[] {
  const n = kb.units.length;
  const weights = new Map<string, number>(stems.map(s => [s, 1]));
  for (const stem of stems) for (const alt of SYNONYMS.get(stem) ?? []) if (!weights.has(alt)) weights.set(alt, SYNONYM_WEIGHT);
  const idf = new Map([...weights.keys()].map(s => {
    const df = kb.docFreq.get(s) ?? 0;
    return [s, Math.log(1 + (n - df + 0.5) / (df + 0.5))];
  }));
  const results: { unitIndex: number; score: number; matched: number }[] = [];
  for (let i = 0; i < n; i++) {
    const tf = kb.termFreqs[i];
    let score = 0;
    let matched = 0;
    for (const [stem, weight] of weights) {
      const f = tf.get(stem);
      if (!f) continue;
      if (weight === 1) matched++;
      const norm = f + BM25_K1 * (1 - BM25_B + (BM25_B * kb.docLengths[i]) / kb.avgDocLength);
      score += weight * (idf.get(stem) ?? 0) * ((f * (BM25_K1 + 1)) / norm);
    }
    if (score > 0) results.push({ unitIndex: i, score, matched });
  }
  return results.sort((a, b) => b.score - a.score);
}

export type QueryEmbedder = (question: string) => Promise<{ provider: EmbeddingProvider; vector: number[] } | null>;

export function defaultEmbedder(kb: LoadedKb, keys: { gemini?: string; openrouter?: string }): QueryEmbedder {
  return async question => {
    for (const provider of ['gemini', 'openrouter'] as const) {
      if (!getProviderIndex(kb, provider).usable) continue;
      const vector = await embedQueryWith(provider, question, keys[provider]);
      if (vector) return { provider, vector };
    }
    return null;
  };
}

export interface EvidenceRecord {
  record: KbRecord;
  units: KbUnit[];
}

export interface SearchOutcome {
  evidence: EvidenceRecord[];
  entities: LinkedEntity[];
  intents: Intent[];
  confidence: 'high' | 'medium' | 'none';
  semanticProvider?: EmbeddingProvider;
}

export async function search(question: string, embed?: QueryEmbedder, kb: LoadedKb = getKb(), context?: ChatContext): Promise<SearchOutcome> {
  const stems = [...new Set(searchStems(question))];
  const named = linkEntities(question, kb);
  const entities = [...named, ...carryContext(question, named, context, kb).filter(c => !named.some(n => n.recordId === c.recordId))];
  const { intents, kinds } = detectIntents(question);
  if (stems.length === 0 && entities.length === 0) return { evidence: [], entities, intents, confidence: 'none' };

  const keyword = bm25(kb, stems);
  const semanticResult = embed ? await embed(question) : null;
  const semantic = semanticResult ? semanticScores(getProviderIndex(kb, semanticResult.provider), semanticResult.vector) : [];
  const semanticMin = semanticResult ? SEMANTIC_MIN[semanticResult.provider] : 1;

  const strong = new Set(entities.filter(e => e.strong).map(e => e.recordId));
  const weak = new Set(entities.filter(e => !e.strong).map(e => e.recordId));

  // Paraphrased titles: "متى توفي النبي" covers every stem of "وفاة النبي ﷺ"
  // once synonyms are included, even though no alias phrase matches.
  const queryStems = new Set(stems);
  for (const stem of stems) for (const alt of SYNONYMS.get(stem) ?? []) queryStems.add(alt);
  const titleBoost = new Map<string, number>();
  for (const [recordId, titleStems] of kb.titleStems) {
    if (titleStems.length < 2 || strong.has(recordId)) continue;
    const overlap = titleStems.filter(s => queryStems.has(s)).length;
    if (overlap >= 2 && overlap / titleStems.length >= 0.66) titleBoost.set(recordId, overlap === titleStems.length ? 0.035 : 0.02);
  }
  const linked = new Set([...strong, ...weak, ...titleBoost.keys()]);

  const scores = new Map<number, number>();
  const bump = (i: number, v: number) => scores.set(i, (scores.get(i) ?? 0) + v);
  keyword.slice(0, 250).forEach((r, rank) => {
    if (r.score >= BM25_MIN || linked.has(kb.units[r.unitIndex].recordId)) bump(r.unitIndex, 1 / (RRF_K + rank + 1));
  });
  semantic.slice(0, 150).forEach((r, rank) => {
    if (r.score >= semanticMin) bump(r.unitIndex, 1 / (RRF_K + rank + 1));
  });
  kb.units.forEach((unit, i) => {
    if (linked.has(unit.recordId)) bump(i, 0);
    if (unit.alsoAbout?.some(id => linked.has(id))) bump(i, 0);
  });

  // "What did Khalid do at Uhud?": passages about the person inside the named
  // event matter; his roles in other events are off topic.
  const strongEvents = new Set([...strong].filter(id => ['event', 'battle'].includes(kb.recordById.get(id)?.type ?? '')));
  const eventBattleIds = new Set([...strongEvents].map(id => kb.recordById.get(id)?.refs.battleId).filter(Boolean));
  const inStrongEvent = (recordId: string) => strongEvents.has(recordId) || eventBattleIds.has(kb.recordById.get(recordId)?.refs.battleId);
  const strongPeopleNames = [...strong]
    .map(id => kb.recordById.get(id))
    .filter(r => r?.type === 'companion')
    .flatMap(r => r!.aliases.filter(a => a.includes(' ')).map(a => normalizeForMatch(a)));

  for (const [i, base] of scores) {
    const unit = kb.units[i];
    let score = base;
    if (strong.has(unit.recordId)) score += 0.04;
    else score += Math.max(weak.has(unit.recordId) ? 0.012 : 0, titleBoost.get(unit.recordId) ?? 0);
    const about = unit.alsoAbout ?? [];
    const offTopicRole = strongEvents.size > 0 && about.some(id => strong.has(id)) && !inStrongEvent(unit.recordId);
    if (about.some(id => strong.has(id)) && !offTopicRole) score += 0.03;
    if (offTopicRole) score *= 0.5;
    if (strongEvents.size > 0 && inStrongEvent(unit.recordId) && strongPeopleNames.some(name => normalizeForMatch(unit.text).includes(name))) score += 0.05;
    // "What did Ali do at Badr?" — the role unit tying both named records.
    if (linked.has(unit.recordId) && about.some(id => linked.has(id))) score += 0.05;
    if (kinds.has(unit.kind)) score += linked.has(unit.recordId) || about.some(id => linked.has(id)) ? 0.03 : 0.012;
    score += KIND_PRIOR[unit.kind] ?? 0;
    if (unit.trust === 'secondary') score *= 0.85;
    // When the question clearly names a record, other records only get in on
    // strong keyword evidence ("نتيجة معركة اليرموك" must not fill up with
    // other battles' "نتيجة …" lines).
    if (strong.size > 0 && !linked.has(unit.recordId) && !about.some(id => linked.has(id))) score *= 0.5;
    scores.set(i, score);
  }

  const ranked = [...scores].sort((a, b) => b[1] - a[1]);
  const topKeyword = keyword[0];
  const topSemantic = semantic[0];
  const confidence: SearchOutcome['confidence'] =
    strong.size > 0 || (topKeyword && topKeyword.matched >= 2 && topKeyword.score >= 6)
      ? 'high'
      : (topKeyword && topKeyword.score >= BM25_MIN) || (topSemantic && topSemantic.score >= semanticMin) || weak.size > 0
        ? 'medium'
        : 'none';

  const evidence = packEvidence(kb, ranked, intents.includes('list') || intents.includes('military'), strong, intents.includes('military'));
  return { evidence, entities, intents, confidence, semanticProvider: semanticResult?.provider };
}

const CHAR_BUDGET = 7000;

function packEvidence(kb: LoadedKb, ranked: [number, number][], listQuestion: boolean, strong: Set<string>, militaryQuestion: boolean): EvidenceRecord[] {
  const maxRecords = listQuestion ? 10 : 6;
  // A question about one or two named records gets their full narrative.
  const focused = strong.size > 0 && strong.size <= 2 && !listQuestion;
  const maxPerRecord = (recordId: string) => (focused && strong.has(recordId) ? 16 : listQuestion ? 4 : 5);
  const chosen = new Map<string, number[]>();
  let chars = 0;
  for (const [unitIndex] of ranked) {
    const unit = kb.units[unitIndex];
    // "Which battles…" must not get the era's non-military events list, and
    // vice versa "what happened…" keeps both.
    if (militaryQuestion && unit.kind === 'list' && unit.id.endsWith('#events')) continue;
    const picked = chosen.get(unit.recordId);
    if (!picked && chosen.size >= maxRecords) continue;
    if (picked && picked.length >= maxPerRecord(unit.recordId)) continue;
    const length = plainText(unit.text).length;
    if (chars + length > CHAR_BUDGET) continue;
    chars += length;
    chosen.set(unit.recordId, [...(picked ?? []), unitIndex]);
  }
  return [...chosen].map(([recordId, indexes]) => ({
    record: kb.recordById.get(recordId)!,
    // Knowledge-base order keeps narratives (course of events) in sequence.
    units: indexes.sort((a, b) => a - b).map(i => kb.units[i]),
  }));
}
