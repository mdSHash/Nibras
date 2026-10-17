import type { ReactNode } from 'react';
import type { FontScale } from './theme';

export function PullQuote({
  color,
  variant,
  children,
}: {
  color: string;
  variant: 'quran' | 'hadith';
  children: ReactNode;
}) {
  return (
    <div
      className="relative rounded-xl px-5 py-4 my-1"
      style={{
        backgroundColor: variant === 'quran' ? color + '14' : 'rgba(0,0,0,0.04)',
        borderInlineStart: `4px solid ${color}`,
      }}
    >
      <span
        aria-hidden="true"
        className="absolute -top-2 right-3 px-2 rounded-full text-white text-xs font-bold tracking-wide"
        style={{ backgroundColor: color }}
      >
        {variant === 'quran' ? 'آية' : 'حديث'}
      </span>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

// ─── Section heading helper ────────────────────────────────────────────────

export function SectionHeading({
  icon,
  label,
  color,
  fs,
}: {
  icon: ReactNode;
  label: string;
  color: string;
  fs: FontScale;
}) {
  return (
    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border-dark/15" style={{ color }}>
      <span className="shrink-0">{icon}</span>
      <h3 className="font-bold flex-1 min-w-0" style={fs(15)}>
        {label}
      </h3>
    </div>
  );
}
