/** The Phase 4 audit's data files, docs/audit/<era>/*.json (scripts/audit/report.ts). */

/** A source quote. `b` is a book from scripts/audit/shamela.ts (p = Shamela page id), or 'dorar'
 * (p = the label of the cached al-Durar search, with who, where and ruling copied from it). */
export interface Cite {
  b: string;
  p: number | string;
  q: string;
  search?: string;
  who?: string;
  where?: string;
  ruling?: string;
}

export interface Finding {
  id: string;
  /** Defaults to the record it is listed under, e.g. «event:fijar-war». */
  record?: string;
  /** Path in the record's JSON, e.g. «fullDescription», «courseOfEvents[3]», «keyFigures[1].labelAr». */
  field: string;
  kind: 'تشكيل' | 'نحو' | 'حقيقة' | 'عدد' | 'تاريخ' | 'اسم' | 'نسبة حديث' | 'مصدر' | 'اتساق' | 'إضافة';
  /** Exact current text (a substring of the field); empty for an addition (kind «إضافة»). */
  current: string;
  proposed: string;
  narrated: boolean;
  confidence: 'proven' | 'likely' | 'uncertain';
  cites?: Cite[];
  /** For a finding no quote can carry, e.g. a grammar rule or the record's own other field. */
  basis?: string;
  note?: string;
}

export interface AuditRecord {
  record: string;
  heading: string;
  /** What was checked and found right, with its source, for the reader. */
  checked?: string;
  /** Quotes behind `checked`, verified like a finding's. */
  checkedCites?: Cite[];
  findings: Finding[];
}

export interface AuditFile {
  title: string;
  intro?: string;
  records: AuditRecord[];
  outro?: string;
}
