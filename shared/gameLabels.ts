/**
 * Display labels for the daily challenge, kept apart from the Zod schemas
 * (shared/gameData.ts) so the game bundle does not pull in Zod.
 */
import type { DeathRegion, Islam, KnownFor, LastEra, Migration } from './gameData';

/**
 * The «من أكون؟» tiles' Arabic labels (drafted by Claude in Mostafa's Egyptian
 * register, 2026-11-16; listed for his review in docs/phase5/data-report.md).
 */
export const FACT_LABELS = {
  islam: { before: 'قبل الهجرة', after: 'بعد الهجرة' },
  migration: { muhajir: 'مهاجر', ansari: 'أنصاري', other: 'من قبيلة تانية' },
  knownFor: {
    caliph: 'خليفة',
    commander: 'قائد جيوش',
    scholar: 'عالم وراوي',
    family: 'من أهل النبي ﷺ',
    early: 'من أوائل المسلمين',
    ansarLeader: 'من كبار الأنصار',
    muezzin: 'مؤذن النبي ﷺ',
    advisor: 'صاحب رأي ومشورة',
    hero: 'فارس شجاع',
    poet: 'شاعر',
    confidant: 'صاحب سر النبي ﷺ',
  },
  deathPlace: {
    madinah: 'المدينة',
    makkah: 'مكة',
    hijaz: 'الحجاز',
    sham: 'الشام',
    iraq: 'العراق',
    egypt: 'مصر',
    rum: 'بلاد الروم',
    yamama: 'اليمامة',
  },
  lastEra: {
    prophet: 'عهد النبي ﷺ',
    'abu-bakr': 'عهد أبي بكر',
    umar: 'عهد عمر',
    uthman: 'عهد عثمان',
    ali: 'عهد علي',
    after: 'بعد الخلفاء الراشدين',
  },
} as const satisfies {
  islam: Record<Islam, string>;
  migration: Record<Migration, string>;
  knownFor: Record<KnownFor, string>;
  deathPlace: Record<DeathRegion, string>;
  lastEra: Record<LastEra, string>;
};

/** Tile titles for «من أكون؟». */
export const FACT_TITLES = {
  islam: 'أسلم',
  migration: 'مهاجر ولا أنصاري؟',
  knownFor: 'اشتهر بإيه؟',
  lastEra: 'عاش لحد عهد مين؟',
  deathPlace: 'اتوفّى فين',
} as const;
