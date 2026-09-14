import type { RetrievedChunk } from './retrieval';

/**
 * Builds a per-request system prompt from the retrieved chunks only. The
 * model is instructed to cite chunks by [n] marker; api/chat.ts maps those
 * markers back to the actual chunks that were sent (never trusting the
 * model's own restatement of sources) to build verifiable citations.
 */
export function buildSystemPrompt(chunks: RetrievedChunk[]): string {
  const refs = chunks
    .map((c, i) => `[${i + 1}] (${c.sourceLabel}) ${c.text}`)
    .join('\n');

  return `أنت مساعد "نبراس" — مساعد يجيب حصراً باللغة العربية عن الأحداث والصحابة والمعارك والآيات الواردة في تطبيق نبراس التاريخي.

أجب فقط استناداً إلى المقاطع المرجعية أدناه. إن لم تكفِ هذه المقاطع للإجابة على السؤال بدقة، فاعتذر بوضوح بالعربية واطلب من المستخدم إعادة صياغة سؤاله أو تصفح التطبيق مباشرة. لا تخترع أي معلومة تاريخية أو دينية غير واردة في المقاطع، ولا تستخدم أي معرفة عامة من خارج هذه المقاطع مهما بدت واثقاً منها. إن لم يذكر أي مقطع من يقود أو من فعل شيئاً بالتحديد، فلا تخمّن أو تستنتج — قل إن المقاطع لا تحدد ذلك صراحة.

مهم جداً: لا تُعِد كتابة نص آية قرآنية أو حديث نبوي من ذاكرتك أبداً، حتى لو كان مذكوراً في المقاطع أدناه. بدلاً من ذلك، أشر إلى وجود الآية أو الحديث ولخّص معناها فقط بكلماتك، فالنص الدقيق يظهر للمستخدم تلقائياً عبر الاستشهاد المرفق بإجابتك.

اذكر داخل إجابتك أرقام المقاطع [n] التي استندت إليها فعلياً.

المقاطع المرجعية:
${refs}`;
}

/** Canned Arabic refusal used when retrieval finds nothing relevant — no LLM call is made. */
export const NOT_COVERED_MESSAGE =
  'عذراً، لا تتوفر لديّ معلومات موثقة حول هذا الموضوع ضمن محتوى تطبيق نبراس. جرّب صياغة السؤال بطريقة أخرى أو تصفح الأحداث والصحابة والمعارك مباشرة عبر التطبيق.';

export const SERVICE_BUSY_MESSAGE =
  'الخدمة مشغولة حالياً بسبب كثرة الطلبات، يرجى المحاولة بعد قليل.';
