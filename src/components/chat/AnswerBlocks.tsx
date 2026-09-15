import { BookOpen } from 'lucide-react';
import type { AnswerBlock, ChatCitation } from '../../hooks/useChat';
import { cn } from '../../utils/cn';

/**
 * Renders a structured chat answer. Every block's wording comes from Nibras's
 * own data (see api/_lib/validator.ts): text blocks are verified clauses,
 * quotes and lists are stored text, verses are the app's verified Qur'an text.
 */

/** **bold** labels + paragraph breaks, without ever interpreting other markup. */
export function FormattedText({ text }: { text: string }) {
  const paragraphs = text.split(/\n\s*\n/).filter(Boolean);
  return (
    <>
      {paragraphs.map((para, pi) => (
        <p key={pi} className={pi > 0 ? 'mt-2.5' : undefined}>
          {para.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
            part.startsWith('**') && part.endsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : <span key={i}>{part}</span>
          )}
        </p>
      ))}
    </>
  );
}

interface AnswerBlocksProps {
  blocks: AnswerBlock[];
  onVerseOpen: (citation: ChatCitation) => void;
}

export function AnswerBlocks({ blocks, onVerseOpen }: AnswerBlocksProps) {
  return (
    <div className="flex flex-col gap-2.5">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'text':
            return (
              <div key={i}>
                <FormattedText text={block.text} />
              </div>
            );
          case 'quote':
            return (
              <blockquote key={i} className="border-s-2 border-[var(--color-accent)]/50 ps-3">
                <p>{block.text}</p>
                {block.source && <footer className="mt-1 text-[11px] text-[var(--color-ink)]/65">— {block.source}</footer>}
              </blockquote>
            );
          case 'list':
            return (
              <div key={i}>
                <p className="font-bold">{block.heading}:</p>
                <ul className="mt-1 list-disc ps-5 space-y-0.5 marker:text-[var(--color-accent)]">
                  {block.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              </div>
            );
          case 'quran':
            return (
              <figure
                key={i}
                className={cn(
                  'rounded-xl px-3 py-2.5',
                  'bg-[var(--color-accent)]/[0.07] border border-[var(--color-accent)]/25',
                )}
              >
                <p className="text-lg leading-[2.1] text-center text-[var(--color-ink)]" style={{ fontFamily: "'Amiri Quran', serif" }}>
                  {block.text}
                </p>
                <figcaption className="mt-1.5 flex items-center justify-between gap-2 text-[11px] text-[var(--color-ink)]/75">
                  <span className="font-bold">{block.key}</span>
                  <button
                    type="button"
                    onClick={() =>
                      onVerseOpen({ chunkId: `quran:${block.key}`, sourceLabel: block.key, type: 'quran', entityRefs: { quranKey: block.key } })
                    }
                    className={cn(
                      'inline-flex items-center gap-1 px-2 py-1 rounded-full',
                      'hover:bg-[var(--color-accent)] hover:text-parchment transition-colors',
                      'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]',
                    )}
                    aria-label={`عرض ${block.key}`}
                  >
                    <BookOpen size={12} aria-hidden="true" />
                    عرض الآية
                  </button>
                </figcaption>
              </figure>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
