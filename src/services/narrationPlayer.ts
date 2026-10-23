/**
 * Plays the recorded narration (public/audio/, found by src/narration.ts).
 *
 * One narration plays at a time. Two parts of the app narrate: the timeline's
 * player mode (titles, `requestSpeak('timeline', …)`) and the event panel
 * (descriptions, `createAudio`). The panel always wins: when it starts, the
 * timeline's narration stops.
 */

export interface NarrationAudioHandle {
  audio: HTMLAudioElement;
  /** 0: known once the file's metadata loads. */
  duration: number;
}

class NarrationPlayer {
  private currentAudio: HTMLAudioElement | null = null;

  /** Plays `url` to the end; resolves with its duration in seconds. */
  speak(url: string): Promise<number> {
    this.stop();
    return new Promise((resolve, reject) => {
      let audioDuration = 0;
      const audio = new Audio(url);
      audio.onended = () => {
        this.currentAudio = null;
        resolve(audioDuration);
      };
      audio.onerror = (event) => {
        console.error('[TTS] Audio playback error:', event);
        this.currentAudio = null;
        reject(new Error(`Audio playback error: ${event}`));
      };
      audio
        .play()
        .then(() => {
          audioDuration = audio.duration || 5.0; // Fallback to 5 seconds if duration not available
          this.currentAudio = audio;
        })
        .catch((error: Error) => {
          console.error('[TTS] Failed to start audio playback:', error);
          this.currentAudio = null;
          reject(new Error(`Failed to play audio: ${error.message}`));
        });
    });
  }

  /** An audio element for `url`, not yet playing (the event panel drives it). */
  createAudio(url: string): NarrationAudioHandle {
    this.stop();
    return { audio: new Audio(url), duration: 0 };
  }

  /** Stops the narration started by `speak`, from the beginning. */
  stop(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }
}

const narrationPlayer = new NarrationPlayer();

export type TTSOwner = 'timeline' | 'panel' | null;

let currentOwner: TTSOwner = null;

/**
 * Plays `url` for `owner`. A different owner's narration stops first; the same
 * owner's restarts.
 */
export async function requestSpeak(owner: TTSOwner, url: string): Promise<number> {
  if (currentOwner && currentOwner !== owner) {
    narrationPlayer.stop();
  }
  currentOwner = owner;
  try {
    const duration = await narrationPlayer.speak(url);
    if (currentOwner === owner) {
      currentOwner = null;
    }
    return duration;
  } catch (error) {
    if (currentOwner === owner) {
      currentOwner = null;
    }
    throw error;
  }
}

/** Stops the narration only if `owner` started it, so the panel and the timeline never stop each other's. */
export function releaseOwner(owner: TTSOwner): void {
  if (currentOwner === owner) {
    narrationPlayer.stop();
    currentOwner = null;
  }
}

export default narrationPlayer;
