// The video behind the battle player (Phase 3H). The player talks to a
// provider-neutral VideoEngine; today the only provider is YouTube (unlisted
// videos, free), played through the IFrame API with YouTube's own controls,
// captions and keyboard turned off: Nibras draws its own Arabic controls and
// captions, below the frame (YouTube's API policies forbid covering the player).
// A paid host later is another engine here plus a content change (battleVideo.provider).

export type VideoErrorKind = 'script' | 'invalid' | 'unplayable' | 'unavailable';

export type EngineEvent =
  | { type: 'ready'; duration: number }
  | { type: 'playing' }
  | { type: 'paused' }
  | { type: 'buffering' }
  | { type: 'ended' }
  | { type: 'error'; kind: VideoErrorKind };

export interface VideoEngine {
  play(): void;
  pause(): void;
  seek(seconds: number): void;
  setMuted(muted: boolean): void;
  /** Seconds played. */
  time(): number;
  destroy(): void;
}

// The parts of the IFrame API the engine uses (https://developers.google.com/youtube/iframe_api_reference).
interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  mute(): void;
  unMute(): void;
  getCurrentTime(): number;
  getDuration(): number;
  getIframe(): HTMLIFrameElement;
  /** Undocumented but long-standing: unloads a player module, here YouTube's own captions. */
  unloadModule?(name: string): void;
  destroy(): void;
}
interface YTNamespace {
  Player: new (
    element: HTMLElement,
    options: {
      videoId: string;
      host: string;
      width: string;
      height: string;
      playerVars: Record<string, string | number>;
      events: {
        onReady: () => void;
        onStateChange: (event: { data: number }) => void;
        onError: (event: { data: number }) => void;
        onApiChange: () => void;
      };
    },
  ) => YTPlayer;
}
declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const API_URL = 'https://www.youtube.com/iframe_api';
const API_TIMEOUT_MS = 15_000;
let api: Promise<YTNamespace> | null = null;

/** Loads the IFrame API script once; a failure is forgotten, so a retry loads it again. */
export function loadYouTubeApi(): Promise<YTNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  api ??= new Promise<YTNamespace>((resolve, reject) => {
    const script = document.createElement('script');
    const fail = () => {
      clearTimeout(timer);
      script.remove();
      api = null;
      reject(new Error('YouTube IFrame API did not load'));
    };
    const timer = setTimeout(fail, API_TIMEOUT_MS);
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      clearTimeout(timer);
      if (window.YT?.Player) resolve(window.YT);
      else fail();
    };
    script.src = API_URL;
    script.async = true;
    script.onerror = fail;
    document.head.appendChild(script);
  });
  return api;
}

// YT.PlayerState: -1 unstarted, 0 ended, 1 playing, 2 paused, 3 buffering, 5 cued.
const STATE_EVENT: Record<number, EngineEvent['type']> = { 0: 'ended', 1: 'playing', 2: 'paused', 3: 'buffering' };
// onError codes: 2 bad id, 5 HTML5 player error, 100 removed or private, 101/150 embedding not allowed.
const ERROR_KIND: Record<number, VideoErrorKind> = { 2: 'invalid', 5: 'unplayable', 100: 'unavailable', 101: 'unavailable', 150: 'unavailable' };

/** Mounts a YouTube player in `host` and reports what it does through `onEvent`. */
export function createYouTubeEngine(host: HTMLElement, videoId: string, onEvent: (event: EngineEvent) => void): VideoEngine {
  const mount = document.createElement('div');
  host.appendChild(mount);
  let player: YTPlayer | null = null;
  let destroyed = false;
  // YouTube turns on its own (auto-generated) captions for some viewers even with
  // cc_load_policy 0; Nibras shows the reviewed captions, so YouTube's are unloaded.
  const hideYouTubeCaptions = () => {
    player?.unloadModule?.('captions');
    player?.unloadModule?.('cc');
  };

  loadYouTubeApi().then(
    (YT) => {
      if (destroyed) return;
      player = new YT.Player(mount, {
        videoId,
        host: 'https://www.youtube-nocookie.com',
        width: '100%',
        height: '100%',
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          cc_load_policy: 0,
          iv_load_policy: 3,
          rel: 0,
          playsinline: 1,
          fs: 0,
          hl: 'ar',
          origin: window.location.origin,
        },
        events: {
          onReady: () => {
            if (destroyed || !player) return;
            // The controls are Nibras's own; the frame itself is not a tab stop.
            player.getIframe().tabIndex = -1;
            player.getIframe().title = 'فيديو المعركة';
            onEvent({ type: 'ready', duration: player.getDuration() });
          },
          onApiChange: hideYouTubeCaptions,
          onStateChange: ({ data }) => {
            if (data === 1) hideYouTubeCaptions();
            const type = STATE_EVENT[data];
            if (!destroyed && type) onEvent({ type } as EngineEvent);
          },
          onError: ({ data }) => {
            if (!destroyed) onEvent({ type: 'error', kind: ERROR_KIND[data] ?? 'unplayable' });
          },
        },
      });
    },
    () => {
      if (!destroyed) onEvent({ type: 'error', kind: 'script' });
    },
  );

  return {
    play: () => player?.playVideo(),
    pause: () => player?.pauseVideo(),
    seek: (seconds) => player?.seekTo(seconds, true),
    setMuted: (muted) => (muted ? player?.mute() : player?.unMute()),
    time: () => player?.getCurrentTime() ?? 0,
    destroy: () => {
      destroyed = true;
      player?.destroy();
      host.replaceChildren();
    },
  };
}
