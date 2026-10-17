// A stand-in for YouTube's IFrame API (https://www.youtube.com/iframe_api), so the
// battle video player can be tested without the network or a real video
// (Phase 3H: never play the real videos in tests). It draws a plain box instead
// of an iframe, plays on a real-time clock and answers the calls the player makes.
// Tests reach it through `window.__fakeYouTube`.
export const FAKE_YOUTUBE_API = `(() => {
  const PLAYING = 1, PAUSED = 2, ENDED = 0;
  const DURATION = 281;
  window.YT = {
    Player: function (element, options) {
      const box = document.createElement('div');
      box.dataset.fakeYoutube = options.videoId;
      box.style.cssText = 'width:100%;height:100%;background:#123';
      element.replaceWith(box);
      const frame = document.createElement('iframe');
      let base = 0, startedAt = null, muted = false, state = -1;
      const now = () => base + (startedAt === null ? 0 : (performance.now() - startedAt) / 1000);
      const setState = (next) => { state = next; options.events.onStateChange({ data: next }); };
      const player = {
        playVideo() { if (state !== PLAYING) { startedAt = performance.now(); setState(PLAYING); } },
        pauseVideo() { if (state === PLAYING) { base = now(); startedAt = null; setState(PAUSED); } },
        seekTo(seconds) { base = Math.min(seconds, DURATION); if (startedAt !== null) startedAt = performance.now(); },
        mute() { muted = true; },
        unMute() { muted = false; },
        isMuted() { return muted; },
        getCurrentTime() { return Math.min(now(), DURATION); },
        getDuration() { return DURATION; },
        getIframe() { return frame; },
        destroy() { box.remove(); },
      };
      window.__fakeYouTube = { player, videoId: options.videoId, get state() { return state; }, end() { base = DURATION; startedAt = null; setState(ENDED); } };
      setTimeout(() => options.events.onReady({ target: player }), 50);
      return player;
    },
  };
  window.onYouTubeIframeAPIReady && window.onYouTubeIframeAPIReady();
})();`;
