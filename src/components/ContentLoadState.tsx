import { RotateCw } from 'lucide-react';
import type { LazyContent } from '../lazyContent';
import { cn } from '../utils/cn';

/**
 * What a panel shows while its text loads (src/lazyContent.ts): text-line
 * skeletons, or an Arabic error with a retry button. Renders nothing once the
 * content is ready.
 */
export function ContentLoadState<T>({
  state,
  lines = 5,
  className,
}: {
  state: LazyContent<T>;
  /** Skeleton lines while loading. */
  lines?: number;
  className?: string;
}) {
  if (state.status === 'ready') return null;
  if (state.status === 'error') {
    return (
      <div role="alert" className={cn('flex flex-col items-center gap-3 py-6 text-center', className)}>
        <p className="text-ink/85 font-medium">تعذّر تحميل المحتوى. تحقّق من الاتصال ثم أعد المحاولة.</p>
        <button
          type="button"
          onClick={state.retry}
          className="inline-flex items-center gap-2 rounded-lg border border-border-dark/30 px-4 py-2 font-bold text-ink hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-accent transition-colors"
        >
          <RotateCw size={16} aria-hidden="true" />
          إعادة المحاولة
        </button>
      </div>
    );
  }
  return (
    <div role="status" aria-label="جارٍ التحميل" className={cn('flex flex-col gap-3 py-2', className)}>
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="h-4 rounded bg-ink/10 animate-pulse motion-reduce:animate-none"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
}
