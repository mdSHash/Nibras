import React from 'react';
import { BookOpen } from 'lucide-react';
import quranData from '../quranData.json';

interface QuranRefProps {
  reference: string;
  onClick?: (ref: string) => void;
}

export default function QuranRef({ reference, onClick }: QuranRefProps) {
  const data = (quranData as any)[reference];

  if (!data) return null;

  return (
    <button
      onClick={() => onClick && onClick(reference)}
      className="w-full text-right bg-ink/5 p-3 rounded-lg border border-accent/20 hover:bg-accent hover:text-parchment hover:border-accent group transition-all flex items-center justify-between mb-2 shadow-sm"
    >
      <span className="font-bold text-[13px] group-hover:text-parchment text-islamic-green flex items-center">
        <BookOpen size={16} className="inline mr-1 ml-2 text-accent group-hover:text-parchment" />
        {reference}
      </span>
      <span className="text-[11px] text-accent/80 group-hover:text-parchment/80 font-bold tracking-wider">
        عرض الآيات ﴾
      </span>
    </button>
  );
}
