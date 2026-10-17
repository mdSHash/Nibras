// A battle's narrated video (Phase 3H): opens from the event panel's
// «مشاهدة المعركة» and from /battle/<id>/ for a battle with a video; the others
// keep their replay (src/components/Overlays.tsx). It looks like the replay
// player: full screen, dark, the battle's name at the top, controls at the bottom.
// The frame, then the captions, then the controls: nothing covers the playing
// YouTube player. Keyboard: Space or K play/pause, ← → seek 5 s, M mute,
// C captions, F full screen, Escape closes (matched by key position, so an
// Arabic keyboard layout works too).
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import type { EventItem } from '../../data';
import { eventSlug } from '../../../shared/routes';
import { toArabicIndic } from '../../../shared/arabic';
import { battleVideoCaptions, useLazyContent } from '../../lazyContent';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useScrollLock } from '../../utils/scrollLock';
import { CaptionBand } from './CaptionBand';
import { VideoControls } from './VideoControls';
import { ERROR_MESSAGES, initialPlayerState, playerReducer } from './playerState';
import { createYouTubeEngine, type VideoEngine } from './videoEngine';

/** How long the player waits for autoplay before asking for a tap. */
const AUTOPLAY_WAIT_MS = 2_500;
const TIME_POLL_MS = 250;

export default function BattleVideoPlayer({
  event,
  onClose,
  onReplayInstead,
}: {
  event: EventItem & { battleVideo: NonNullable<EventItem['battleVideo']> };
  onClose: () => void;
  /** Opens the battle's replay in place of the video (offered when the video cannot play). */
  onReplayInstead?: () => void;
}) {
  const [state, dispatch] = useReducer(playerReducer, initialPlayerState);
  const [time, setTime] = useState(0);
  const [muted, setMuted] = useState(false);
  const [captionsOn, setCaptionsOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tapFailed, setTapFailed] = useState(false);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  // Where focus was when the player opened (the panel's button), to give it back on close.
  const [openedFrom] = useState(() => document.activeElement);
  const captions = useLazyContent(battleVideoCaptions, eventSlug(event));
  const engineRef = useRef<VideoEngine | null>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const rootRef = useFocusTrap(true);
  useScrollLock(true);

  const ready = state.status !== 'loading' && state.status !== 'error';
  const playing = state.status === 'playing' || state.status === 'buffering';
  const { id: videoId, durationSec } = event.battleVideo;
  const duration = state.duration || durationSec;

  // One engine per attempt; a retry mounts a fresh one.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let started = false;
    let autoplayTimer: ReturnType<typeof setTimeout> | undefined;
    const engine = createYouTubeEngine(host, videoId, (engineEvent) => {
      if (engineEvent.type === 'ready') {
        engine.play();
        autoplayTimer = setTimeout(() => !started && dispatch({ type: 'autoplayBlocked' }), AUTOPLAY_WAIT_MS);
      }
      if (engineEvent.type === 'playing') started = true;
      dispatch(engineEvent);
    });
    engineRef.current = engine;
    setTime(0);
    setTapFailed(false);
    return () => {
      clearTimeout(autoplayTimer);
      clearTimeout(tapTimer.current);
      engine.destroy();
      engineRef.current = null;
    };
  }, [videoId, state.attempt]);

  // The time drives the captions and the progress bar.
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => setTime(engineRef.current?.time() ?? 0), TIME_POLL_MS);
    return () => clearInterval(timer);
  }, [playing]);

  // The first play, by tap or key: if the browser still refuses, the poster steps
  // aside so the visitor can start YouTube's own player.
  const startByTap = useCallback(() => {
    engineRef.current?.play();
    clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => setTapFailed(true), AUTOPLAY_WAIT_MS);
  }, []);

  const togglePlay = useCallback(() => {
    if (!ready) return;
    if (!state.started) startByTap();
    else if (playing) engineRef.current?.pause();
    else engineRef.current?.play();
  }, [ready, playing, state.started, startByTap]);

  const seek = useCallback(
    (seconds: number) => {
      if (!ready) return;
      const to = Math.min(Math.max(0, seconds), duration);
      engineRef.current?.seek(to);
      setTime(to);
    },
    [ready, duration],
  );

  const toggleMute = useCallback(() => {
    if (!ready) return;
    setMuted((was) => {
      engineRef.current?.setMuted(!was);
      return !was;
    });
  }, [ready]);

  const canFullscreen = typeof document !== 'undefined' && document.fullscreenEnabled === true;
  const toggleFullscreen = useCallback(() => {
    if (!canFullscreen) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void rootRef.current?.requestFullscreen();
  }, [canFullscreen, rootRef]);

  useEffect(() => {
    const onChange = () => setIsFullscreen(document.fullscreenElement !== null);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  // A click on the video moves focus into YouTube's frame, where the keys would no
  // longer reach the player: take focus back. On close, focus returns to where it was.
  useEffect(() => {
    const onBlur = () =>
      setTimeout(() => {
        const active = document.activeElement;
        if (active instanceof HTMLIFrameElement && rootRef.current?.contains(active)) rootRef.current.focus();
      });
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('blur', onBlur);
      if (openedFrom instanceof HTMLElement && openedFrom.isConnected) openedFrom.focus();
    };
  }, [rootRef, openedFrom]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        // Ours alone: the app's own Escape would go home instead of back to the event.
        e.preventDefault();
        e.stopPropagation();
        if (document.fullscreenElement) return; // the browser leaves full screen first
        onClose();
        return;
      }
      const target = e.target as HTMLElement | null;
      // The seek bar takes its own arrows; buttons take their own Space.
      if (target?.closest('input, textarea, select')) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      switch (e.code) {
        case 'Space':
          if (target?.closest('button')) return;
          e.preventDefault();
          togglePlay();
          break;
        case 'KeyK':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          seek(time - 5);
          break;
        case 'ArrowRight':
          e.preventDefault();
          seek(time + 5);
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;
        case 'KeyC':
          e.preventDefault();
          setCaptionsOn((on) => !on);
          break;
        case 'KeyF':
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };
    // Capture phase, so the player sees each key before the app's shortcuts.
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [onClose, togglePlay, seek, toggleMute, toggleFullscreen, time]);

  const showPoster = !state.started && !tapFailed;
  const titleId = 'battle-video-title';

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 bg-black flex flex-col overflow-hidden text-white focus:outline-none"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      dir="rtl"
      lang="ar"
    >
      {/* Header: back + the battle's name, as in the replay player. */}
      <div
        className="shrink-0 flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 bg-gray-900"
        style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
      >
        <button
          type="button"
          onClick={onClose}
          className="flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-lg bg-gray-800/60 hover:bg-gray-700/80 transition-colors text-gray-300 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
          aria-label="رجوع"
        >
          <svg className="w-5 h-5 -scale-x-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="min-w-0">
          <h1 id={titleId} className="text-white font-semibold text-base sm:text-lg leading-tight truncate">
            {event.title}
          </h1>
          <p className="text-gray-400 text-xs truncate">{toArabicIndic(event.date.labelAr)}</p>
        </div>
      </div>

      {/* The frame: 16:9, as large as the space between header and captions allows. */}
      <div className="relative flex-1 min-h-0 flex items-center justify-center" style={{ containerType: 'size' }}>
        <div className="relative bg-black" style={{ width: 'min(100cqw, 100cqh * 16 / 9)', aspectRatio: '16 / 9' }}>
          <div ref={hostRef} key={state.attempt} className="absolute inset-0" data-testid="video-frame" />

          {showPoster && state.status !== 'error' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={`${import.meta.env.BASE_URL}videos/${event.id}/poster.jpg`}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                decoding="async"
              />
              {state.needsTap ? (
                <button
                  type="button"
                  onClick={startByTap}
                  className="relative flex items-center gap-2 px-6 py-4 rounded-full bg-gray-900/90 hover:bg-gray-800 border border-gray-600/50 text-white font-bold text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
                >
                  <Play className="w-6 h-6" aria-hidden />
                  تشغيل الفيديو
                </button>
              ) : (
                <div className="relative flex flex-col items-center gap-3 rounded-xl bg-gray-900/80 px-5 py-4" role="status">
                  <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin motion-reduce:animate-none" aria-hidden />
                  <p className="text-gray-200">جارٍ تحميل الفيديو...</p>
                </div>
              )}
            </div>
          )}

          {state.status === 'error' && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 px-6" role="alert">
              <div className="text-center space-y-4 max-w-md">
                <h2 className="text-xl font-semibold">تعذّر تشغيل الفيديو</h2>
                <p className="text-gray-300">{ERROR_MESSAGES[state.error ?? 'unplayable']}</p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => dispatch({ type: 'retry' })}
                    className="px-5 min-h-[44px] bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
                  >
                    إعادة المحاولة
                  </button>
                  {onReplayInstead && (
                    <button
                      type="button"
                      onClick={onReplayInstead}
                      className="px-5 min-h-[44px] bg-gray-800 hover:bg-gray-700 border border-gray-600/50 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
                    >
                      مشاهدة المحاكاة بدلاً منه
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <CaptionBand captions={captions} time={time} visible={captionsOn} />

      <VideoControls
        ready={ready}
        playing={playing}
        time={time}
        duration={duration}
        muted={muted}
        captionsOn={captionsOn}
        isFullscreen={isFullscreen}
        canFullscreen={canFullscreen}
        onTogglePlay={togglePlay}
        onSeek={seek}
        onToggleMute={toggleMute}
        onToggleCaptions={() => setCaptionsOn((on) => !on)}
        onToggleFullscreen={toggleFullscreen}
      />
    </div>
  );
}
