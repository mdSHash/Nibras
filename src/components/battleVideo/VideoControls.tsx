// The battle video's controls (Phase 3H), in the replay player's style: round
// dark buttons, a green progress bar filling left to right, Arabic labels. Two
// layouts: a bar under the captions, or, on a phone held sideways, the buttons
// in a column beside the video and the progress bar under it.
import { Captions, CaptionsOff, FastForward, Maximize, Minimize, Pause, Play, Rewind, Volume2, VolumeX } from 'lucide-react';
import type { ReactNode } from 'react';
import { formatTime } from './playerState';

const BUTTON =
  'flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-full bg-gray-800/80 hover:bg-gray-700 transition-colors text-white border border-gray-600/50 ' +
  'disabled:opacity-40 disabled:hover:bg-gray-800/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400';

function ControlButton({
  label,
  onClick,
  disabled,
  children,
}: {
  /** Names the action the button takes now («كتم الصوت» / «إلغاء الكتم»), so no aria-pressed. */
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button type="button" className={BUTTON} onClick={onClick} disabled={disabled} aria-label={label} title={label}>
      {children}
    </button>
  );
}

export interface VideoControlsProps {
  ready: boolean;
  playing: boolean;
  time: number;
  duration: number;
  muted: boolean;
  captionsOn: boolean;
  isFullscreen: boolean;
  canFullscreen: boolean;
  onTogglePlay: () => void;
  onSeek: (seconds: number) => void;
  onToggleMute: () => void;
  onToggleCaptions: () => void;
  onToggleFullscreen: () => void;
}

/** Play and ±10 s ('transport'), or mute, captions and full screen ('options'). */
export function ControlButtons({ part, ...props }: VideoControlsProps & { part: 'transport' | 'options' }) {
  const { ready, playing, time, muted, captionsOn, isFullscreen, canFullscreen } = props;
  if (part === 'transport') {
    return (
      <>
        <ControlButton label={playing ? 'إيقاف مؤقت' : 'تشغيل'} onClick={props.onTogglePlay} disabled={!ready}>
          {playing ? <Pause className="w-5 h-5" aria-hidden /> : <Play className="w-5 h-5" aria-hidden />}
        </ControlButton>
        <ControlButton label="رجوع ١٠ ثوانٍ" onClick={() => props.onSeek(time - 10)} disabled={!ready}>
          <Rewind className="w-5 h-5" aria-hidden />
        </ControlButton>
        <ControlButton label="تقديم ١٠ ثوانٍ" onClick={() => props.onSeek(time + 10)} disabled={!ready}>
          <FastForward className="w-5 h-5" aria-hidden />
        </ControlButton>
      </>
    );
  }
  return (
    <>
      <ControlButton label={muted ? 'إلغاء الكتم' : 'كتم الصوت'} onClick={props.onToggleMute} disabled={!ready}>
        {muted ? <VolumeX className="w-5 h-5" aria-hidden /> : <Volume2 className="w-5 h-5" aria-hidden />}
      </ControlButton>
      <ControlButton label={captionsOn ? 'إخفاء الترجمة' : 'إظهار الترجمة'} onClick={props.onToggleCaptions}>
        {captionsOn ? <Captions className="w-5 h-5" aria-hidden /> : <CaptionsOff className="w-5 h-5" aria-hidden />}
      </ControlButton>
      {canFullscreen && (
        <ControlButton label={isFullscreen ? 'إنهاء ملء الشاشة' : 'ملء الشاشة'} onClick={props.onToggleFullscreen}>
          {isFullscreen ? <Minimize className="w-5 h-5" aria-hidden /> : <Maximize className="w-5 h-5" aria-hidden />}
        </ControlButton>
      )}
    </>
  );
}

/** The time and the progress bar; same direction as the replay's: it fills from the left. */
export function SeekBar({
  ready,
  time,
  duration,
  onSeek,
  className = '',
}: Pick<VideoControlsProps, 'ready' | 'time' | 'duration' | 'onSeek'> & { className?: string }) {
  return (
    <>
      <span className="text-gray-300 text-xs font-mono tabular-nums min-w-[78px] text-center" dir="ltr" aria-hidden>
        {formatTime(time)} / {formatTime(duration)}
      </span>
      <input
        type="range"
        dir="ltr"
        min={0}
        max={Math.max(1, Math.floor(duration))}
        step={1}
        value={Math.min(Math.floor(time), Math.floor(duration))}
        onChange={(e) => onSeek(Number(e.target.value))}
        disabled={!ready}
        aria-label="موضع الفيديو"
        aria-valuetext={`${formatTime(time)} من ${formatTime(duration)}`}
        className={`h-3 sm:h-2 accent-green-500 cursor-pointer disabled:cursor-default ${className}`}
      />
    </>
  );
}

/** The bar under the captions (computers and tablets; phones use the column, playerLayout.ts). */
export function VideoControls(props: VideoControlsProps) {
  return (
    <div
      className="shrink-0 px-3 sm:px-4 pt-2 bg-gray-900"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      dir="rtl"
      lang="ar"
    >
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <ControlButtons {...props} part="transport" />
        <SeekBar {...props} className="basis-full order-last sm:basis-auto sm:flex-1 sm:order-none" />
        <ControlButtons {...props} part="options" />
      </div>
    </div>
  );
}
