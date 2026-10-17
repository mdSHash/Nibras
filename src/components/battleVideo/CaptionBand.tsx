// The captions under the battle video (Phase 3H): the reviewed Arabic
// captions, on by default, drawn below the frame (never over the YouTube
// player). Recitations show in Quran.com's text, in Amiri Quran.
import { cueAt } from '../../../shared/webvtt';
import type { VideoCaption } from '../../../shared/battleVideo';
import type { LazyContent } from '../../lazyContent';

export function CaptionBand({
  captions,
  time,
  visible,
}: {
  captions: LazyContent<VideoCaption[]>;
  time: number;
  visible: boolean;
}) {
  const cue = captions.status === 'ready' ? cueAt(captions.data, time) : undefined;
  return (
    // aria-live stays off: the narration already speaks every caption.
    <div
      className="shrink-0 min-h-[4.5rem] sm:min-h-[5rem] px-4 py-2 flex items-center justify-center text-center bg-black"
      dir="rtl"
      lang="ar"
      aria-live="off"
      data-testid="video-captions"
    >
      {captions.status === 'error' ? (
        <p className="text-gray-300 text-sm" role="alert">
          تعذّر تحميل الترجمة.{' '}
          <button
            type="button"
            onClick={captions.retry}
            className="underline underline-offset-4 text-white min-h-[44px] px-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
          >
            إعادة المحاولة
          </button>
        </p>
      ) : (
        visible &&
        cue && (
          <p
            className="max-w-4xl text-white leading-relaxed bg-gray-900/90 rounded-lg px-3 py-1"
            style={
              cue.quranKey
                ? { fontFamily: "'Amiri Quran', serif", fontSize: 'clamp(1.05rem, 2.4vw, 1.5rem)', lineHeight: 2 }
                : { fontSize: 'clamp(0.95rem, 2.1vw, 1.3rem)' }
            }
          >
            {cue.text}
          </p>
        )
      )}
    </div>
  );
}
