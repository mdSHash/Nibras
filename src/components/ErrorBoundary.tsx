import { Component, type ErrorInfo, type ReactNode } from 'react';
import { reportError } from '../services/monitoring';

type Variant = 'page' | 'fill' | 'floating';

interface ErrorBoundaryProps {
  /** Short name of the wrapped part, sent with the crash report ('map', 'chat', …). */
  area: string;
  /**
   * 'page': the whole screen (app root). 'fill': fills the parent (map, battle).
   * 'floating': a card above the app, for panels and modals.
   */
  variant?: Variant;
  /** While true the fallback is not shown (the wrapped panel is closed). */
  hidden?: boolean;
  /** A new value clears the error and renders the children again (another event, a reopened panel). */
  resetKey?: unknown;
  /** Adds a "close" button that closes the broken panel. */
  onDismiss?: () => void;
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Catches a crash in one part of the app so the rest keeps working, shows an
 * Arabic message with a reload button, and reports the error (Sentry, when on).
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    reportError(error, { area: this.props.area, componentStack: info.componentStack ?? undefined });
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    if (this.state.error && !Object.is(prevProps.resetKey, this.props.resetKey)) {
      this.setState({ error: null });
    }
  }

  render(): ReactNode {
    if (!this.state.error) return this.props.children;
    if (this.props.hidden) return null;
    return <ErrorFallback variant={this.props.variant ?? 'floating'} onDismiss={this.props.onDismiss} />;
  }
}

const VARIANT_CLASSES: Record<Variant, string> = {
  page: 'fixed inset-0 flex items-center justify-center p-4 bg-parchment',
  fill: 'absolute inset-0 flex items-center justify-center p-4 bg-parchment',
  floating: 'fixed inset-x-0 top-1/2 -translate-y-1/2 flex justify-center px-4 pointer-events-none',
};

function ErrorFallback({ variant, onDismiss }: { variant: Variant; onDismiss?: () => void }) {
  return (
    <div
      className={VARIANT_CLASSES[variant]}
      style={variant === 'floating' ? { zIndex: 'var(--z-modal)' } : undefined}
      dir="rtl"
    >
      <div
        role="alert"
        className="pointer-events-auto w-full max-w-sm rounded-2xl border border-ink/15 bg-parchment p-6 text-center text-ink shadow-xl"
      >
        <h2 className="mb-2 text-lg font-bold">حدث خطأ غير متوقع</h2>
        <p className="mb-5 text-sm leading-relaxed text-ink/80">
          تعذّر عرض هذا الجزء. أعد تحميل الصفحة للمحاولة مرة أخرى.
        </p>
        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="min-h-[44px] rounded-xl bg-primary-dark px-5 font-bold text-parchment transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            إعادة التحميل
          </button>
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="min-h-[44px] rounded-xl border border-ink/25 px-5 font-bold text-ink transition hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              إغلاق
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ErrorBoundary;
