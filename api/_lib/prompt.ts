/**
 * The answer prompt. The model receives numbered passages and must return
 * JSON that cites passage ids — it composes, the server verifies and renders.
 */
import type { KbUnit } from '../../shared/chatKb.js';
import { plainText } from './kb.js';
import type { EvidenceRecord } from './search.js';

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
    const lines = [`[${plainText(record.title)}] (${RECORD_TYPE_LABEL[record.type] ?? ''}${era})`];
    for (const unit of units) {
      const ref = `s${++n}`;
      unitByRef.set(ref, unit);
      const tag = unit.kind === 'quran_verse' ? ' [نص آية — لا تنسخه]' : unit.verbatimOnly ? ' [نص مأثور — لا تنسخه]' : '';
      lines.push(`${ref}${tag}: ${plainText(unit.text)}`);
    }
    blocks.push(lines.join('\n'));
  }

  const system = `أنت مساعد تطبيق "نبراس" للتاريخ الإسلامي. تجيب بالعربية فقط، ومن المقاطع المرقّمة أدناه فقط.

أعد كائن JSON واحداً فقط بلا أي نص قبله أو بعده، بهذا الشكل:
{"answerable": true, "points": [{"text": "**عنوان قصير**: نص منقول من المقطع", "refs": ["s1"]}]}

القواعد:
1. كل نقطة تتكوّن من عنوان قصير اختياري (اسم الشخص أو الموضوع كما ورد في المقاطع) ثم نقطتين ثم نص منقول من المقطع، ولكل نقطة refs بمعرّفات المقاطع التي نقلت منها.
2. النص بعد العنوان يُنقل حرفياً: عبارات كاملة كما هي بين علامات الترقيم (، . : ؛). لا تحذف كلمة من داخل عبارة، ولا تغيّر ترتيب الكلمات، ولا تضف كلمة، ولا تستعمل مرادفاً. يجوز فقط ترك عبارات كاملة لا تلزم.
3. لا تكتب نص أي آية أو حديث أبداً. إن كان مقطع الآية أو الحديث مفيداً فاذكر معرّفه في refs فقط، وسيُعرض نصه للمستخدم تلقائياً.
4. في الأسئلة عن قائمة أو مجموعة: إن وُجد مقطع قائمة فاستشهد به في نقطة واحدة. وإلا فاجعل كل عنصر نقطة مستقلة، ولا تكرر عنصراً، ولا تذكر عدداً إجمالياً.
5. رتّب النقاط بحسب صلتها بالسؤال، ولا تتجاوز 8 نقاط.
6. إن كان في المقاطع ما يجيب عن السؤال ولو ضمناً (مثل «وصاحبه في الغار» ضمن ترجمة شخص) فأجب منه.
7. إن لم يكن في المقاطع ما يجيب عن السؤال نفسه فأعد {"answerable": false} فقط، ولا تجب عن سؤال آخر قريب منه.

المقاطع:
${blocks.join('\n\n')}`;

  return { system, unitByRef };
}

export interface ModelAnswer {
  answerable: boolean;
  intro: string;
  points: { text: string; refs: string[] }[];
}

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
  if (obj.answerable === false) return { answerable: false, intro: '', points: [] };
  if (!Array.isArray(obj.points)) return null;
  const points = obj.points
    .filter((p): p is Record<string, unknown> => !!p && typeof p === 'object')
    .map(p => ({
      text: typeof p.text === 'string' ? p.text : '',
      refs: Array.isArray(p.refs) ? p.refs.filter((r): r is string => typeof r === 'string') : [],
    }))
    .filter(p => p.refs.length > 0);
  return { answerable: true, intro: typeof obj.intro === 'string' ? obj.intro : '', points };
}
