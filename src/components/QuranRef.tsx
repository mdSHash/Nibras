import React, { useMemo } from 'react';
import { BookOpen } from 'lucide-react';
import quranData from '../quranData.json';
import { matchQuranKey } from '../utils/quranMatch';

interface QuranRefProps {
  reference: string;
  onClick?: (ref: string) => void;
}

export default function QuranRef({ reference, onClick }: QuranRefProps) {
  const mappedKey = useMemo(() => matchQuranKey(reference, Object.keys(quranData)), [reference]);

  const data = mappedKey ? (quranData as any)[mappedKey] : null;

  if (!data) return null;

  return (
    <button
      onClick={() => onClick && mappedKey && onClick(mappedKey)}
      className="w-full text-right bg-ink/5 p-3 rounded-lg border border-accent/20 hover:bg-accent hover:text-parchment hover:border-accent group transition-all flex items-center justify-between mb-2 shadow-sm"
    >
      <span className="font-bold text-[13px] group-hover:text-parchment text-islamic-green flex items-center text-right leading-relaxed">
        <BookOpen size={16} className="inline mr-1 ml-2 shrink-0 text-accent group-hover:text-parchment" />
        {reference}
      </span>
      <span className="text-[11px] text-accent/80 group-hover:text-parchment/80 font-bold tracking-wider shrink-0 mr-4">
        عرض الآيات ﴾
      </span>
    </button>
  );
}
