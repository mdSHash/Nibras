import React from 'react';
import { BookOpen } from 'lucide-react';
import { passageFor } from '../data';
import type { ContentEvent } from '../../shared/contentSchema';

interface QuranRefProps {
  /** An event's Qur'an reference: the passage and the text the chip shows. */
  quranRef: ContentEvent['quran'][number];
  /** Called with the passage key, which the Qur'an window opens. */
  onClick?: (key: string) => void;
}

export default function QuranRef({ quranRef, onClick }: QuranRefProps) {
  const passage = passageFor(quranRef);

  if (!passage) return null;

  return (
    <button
      onClick={() => onClick && onClick(passage.key)}
      className="w-full text-right bg-ink/5 p-3 rounded-lg border border-accent/20 hover:bg-accent hover:text-parchment hover:border-accent group transition-all flex items-center justify-between mb-2 shadow-sm"
    >
      <span className="font-bold text-[13px] group-hover:text-parchment text-islamic-green flex items-center text-right leading-relaxed">
        <BookOpen size={16} className="inline mr-1 ml-2 shrink-0 text-accent group-hover:text-parchment" />
        {quranRef.labelAr}
      </span>
      <span className="text-[11px] text-accent/80 group-hover:text-parchment/80 font-bold tracking-wider shrink-0 mr-4">
        عرض الآيات ﴾
      </span>
    </button>
  );
}
