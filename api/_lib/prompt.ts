/**
 * The answer prompt. The model receives numbered passages and returns JSON
 * that groups passage ids into sections with a shape — it writes no text; the
 * server renders each passage whole (shapes.ts). The older `points` answer
 * (model sentences, checked by the validator) is still accepted.
 */
import type { KbUnit } from '../../shared/chatKb.js';
import { plainText } from '../../shared/arabic.js';
import type { EvidenceRecord } from './search.js';
import { HEADINGS, isHeading, type ModelSection } from './shapes.js';

const RECORD_TYPE_LABEL: Record<string, string> = {
  event: 'حدث',
  companion: 'شخصية',
  city: 'مدينة',
  quran: 'آية',
  battle: 'محاكاة معركة',
  list: 'قائمة',
};

export interface PromptPack {
  system: string;
  /** Passage id in the prompt (s1, s2…) → knowledge-base unit. */
  unitByRef: Map<string, KbUnit>;
}

export function buildPrompt(evidence: EvidenceRecord[]): PromptPack {
  const unitByRef = new Map<string, KbUnit>();
  const blocks: string[] = [];
  let n = 0;
  for (const { record, units } of evidence) {
    const era = record.era ? ` — ${plainText(record.era)}` : '';
    // A battle's units come from its video's captions when it has one (3H), else from its replay.
    const label = record.type === 'battle' && units.some(u => u.kind === 'battle_video') ? 'فيديو المعركة' : RECORD_TYPE_LABEL[record.type];
    const lines = [`[${plainText(record.title)}] (${label ?? ''}${era})`];
    for (const unit of units) {
      const ref = `s${++n}`;
      unitByRef.set(ref, unit);
      const tag =
        unit.kind === 'quran_verse' ? ' [نص آية]' : unit.verbatimOnly ? ' [نص مأثور]' : unit.list ? ' [قائمة]' : unit.fact ? ' [معلومة]' : '';
      lines.push(`${ref}${tag}: ${plainText(unit.text)}`);
    }
    blocks.push(lines.join('\n'));
  }

  const system = `أنت مساعد تطبيق "نبراس" للتاريخ الإسلامي. تجيب من المقاطع المرقّمة أدناه فقط، ولا تكتب أي نص بنفسك: تختار المقاطع التي تجيب عن السؤال، ويُعرض نصها للمستخدم كما هو.

أعد كائن JSON واحداً فقط بلا أي نص قبله أو بعده، بهذا الشكل:
{"answerable": true, "sections": [{"shape": "paragraph", "heading": "", "refs": ["s1", "s2"]}]}

القواعد:
1. كل قسم (section) مجموعة مقاطع تُعرض معاً. shape واحد من:
   - "paragraph": شرح أو سرد متصل.
   - "steps": أحداث متتابعة بالترتيب (عند السؤال عن كيف جرى الأمر أو ماذا حدث بعد ذلك).
   - "facts": معلومات قصيرة: تاريخ، مكان، عدد، مدة، دور شخص (المقاطع الموسومة [معلومة]).
   - "list": مقطع قائمة (الموسوم [قائمة])؛ يُعرض كاملاً.
2. heading واحد من: ${HEADINGS.map(h => `"${h}"`).join('، ')}، أو "" بلا عنوان. في الجواب القصير اترك العنوان فارغاً.
3. اختر ما يجيب عن السؤال نفسه وحده: لسؤال عن معلومة واحدة مقطع أو مقطعان، ولسؤال «لماذا» أو «كيف» المقاطع التي تشرح ذلك. لا تتجاوز 10 مقاطع في الجواب كله.
4. لا تختر مقطعين يقولان الشيء نفسه؛ اختر الأوفى منهما. ولا تكرر مقطعاً.
5. الآيات والأحاديث (الموسومة [نص آية] أو [نص مأثور]): اذكر معرّفها في refs إن كانت تجيب عن السؤال، وسيُعرض نصها المحفوظ.
6. إن كان في المقاطع ما يجيب عن السؤال ولو ضمناً (مثل «وصاحبه في الغار» ضمن ترجمة شخص) فاختره.
7. إن لم يكن في المقاطع ما يجيب عن السؤال نفسه فأعد {"answerable": false} فقط، ولا تجب عن سؤال آخر قريب منه.
8. إن تضمنت رسالة المستخدم «السؤال السابق» فهو للسياق فقط: افهم الضمائر والإشارات والأسئلة المختصرة (مثل «وأحد؟») على أنها تعود إليه، وأجب عن السؤال الحالي.
9. قد يسأل المستخدم بالعامية المصرية (مثل: مين، إيه، فين، إمتى، كام، عمل إيه، اتقتل إزاي، زعل ليه) أو بأخطاء إملائية؛ افهم المقصود.

المقاطع:
${blocks.join('\n\n')}`;

  return { system, unitByRef };
}

export interface ModelAnswer {
  answerable: boolean;
  intro: string;
  /** The current format: passages grouped by shape. */
  sections?: ModelSection[];
  /** The older format: model sentences with the passages they quote. */
  points: { text: string; refs: string[] }[];
}

const SHAPES = new Set<ModelSection['shape']>(['paragraph', 'steps', 'facts', 'list']);

const stringList = (value: unknown): string[] => (Array.isArray(value) ? value.filter((r): r is string => typeof r === 'string') : []);

/** Lenient JSON extraction: tolerates code fences or stray text around the object. */
export function parseModelAnswer(raw: string): ModelAnswer | null {
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end <= start) return null;
  let data: unknown;
  try {
    data = JSON.parse(raw.slice(start, end + 1));
  } catch {
    return null;
  }
  if (!data || typeof data !== 'object') return null;
  const obj = data as Record<string, unknown>;
  if (obj.answerable === false) return { answerable: false, intro: '', sections: [], points: [] };
  if (Array.isArray(obj.sections)) {
    const sections = obj.sections
      .filter((s): s is Record<string, unknown> => !!s && typeof s === 'object')
      .map(s => ({
        shape: SHAPES.has(s.shape as ModelSection['shape']) ? (s.shape as ModelSection['shape']) : 'paragraph',
        ...(isHeading(s.heading) ? { heading: s.heading } : {}),
        refs: stringList(s.refs),
      }))
      .filter(s => s.refs.length > 0);
    if (sections.length === 0) return null;
    return { answerable: true, intro: '', sections, points: [] };
  }
  if (!Array.isArray(obj.points)) return null;
  const points = obj.points
    .filter((p): p is Record<string, unknown> => !!p && typeof p === 'object')
    .map(p => ({
      text: typeof p.text === 'string' ? p.text : '',
      refs: stringList(p.refs),
    }))
    .filter(p => p.refs.length > 0);
  return { answerable: true, intro: typeof obj.intro === 'string' ? obj.intro : '', sections: [], points };
}
