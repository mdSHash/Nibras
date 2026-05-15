/**
 * Gemini Flash Text-to-Speech Service - Static Audio Version
 *
 * Loads pre-generated audio files from /audio/ directory.
 * Audio files are named by SHA-256 hash of "text|voice|rate".
 *
 * Default voice: Charon (Informative) - authoritative tone for Islamic historical content.
 *
 * Recommended voices for Nibras:
 * - Charon (Informative) - Best for historical narration
 * - Rasalgethi (Informative) - Educational alternative
 * - Sadaltager (Knowledgeable) - Scholarly tone
 * - Gacrux (Mature) - Dignified delivery
 * - Schedar (Even) - Balanced professional
 *
 * Usage:
 * ```typescript
 * await geminiTTS.speak('النص العربي', { voice: 'Charon', rate: 1.0 });
 * geminiTTS.pause();
 * geminiTTS.resume();
 * geminiTTS.stop();
 * ```
 */

export interface GeminiTTSOptions {
  voice?: GeminiVoice;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export type GeminiVoice =
  | 'Zephyr'
  | 'Puck'
  | 'Charon'
  | 'Kore'
  | 'Fenrir'
  | 'Leda'
  | 'Orus'
  | 'Aoede'
  | 'Callirrhoe'
  | 'Autonoe'
  | 'Enceladus'
  | 'Iapetus'
  | 'Umbriel'
  | 'Algieba'
  | 'Despina'
  | 'Erinome'
  | 'Algenib'
  | 'Rasalgethi'
  | 'Laomedeia'
  | 'Achernar'
  | 'Alnilam'
  | 'Schedar'
  | 'Gacrux'
  | 'Pulcherrima'
  | 'Achird'
  | 'Zubenelgenubi'
  | 'Vindemiatrix'
  | 'Sadachbia'
  | 'Sadaltager'
  | 'Sulafat';

export interface GeminiTTSAudioHandle {
  audio: HTMLAudioElement;
  duration: number;
}

class GeminiTTSService {
  private currentAudio: HTMLAudioElement | null = null;
  private speaking: boolean = false;
  private paused: boolean = false;
  private defaultVoice: GeminiVoice = 'Charon';
  private audioBasePath: string;

  constructor() {
    // Use import.meta.env.BASE_URL to get the correct base path for GitHub Pages
    this.audioBasePath = `${import.meta.env.BASE_URL}audio`;
  }

  /**
   * Check if static audio service is available
   * Always returns true since we're using static files
   */
  async isAvailable(): Promise<boolean> {
    return true;
  }

  /**
   * Normalize whitespace in text (matches server-side normalization)
   */
  private normalizeText(text: string): string {
    return String(text || '').replace(/\s+/g, ' ').trim();
  }

  /**
   * Generate SHA-256 hash for cache key
   * Format: "text|voice|rate"
   * IMPORTANT: Text must be normalized before hashing to match server-side cache keys
   */
  private async generateCacheKey(text: string, voice: string, rate: number): Promise<string> {
    const normalizedText = this.normalizeText(text);
    const cacheString = `${normalizedText}|${voice}|${rate}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(cacheString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }

  /**
   * Validate and normalize TTS options
   * Ensures all parameters are within acceptable ranges
   */
  private normalizeOptions(options: GeminiTTSOptions = {}): Required<GeminiTTSOptions> {
    return {
      voice: options.voice || this.defaultVoice,
      rate: Math.max(0.25, Math.min(4.0, options.rate || 1.0)),
      pitch: Math.max(-20.0, Math.min(20.0, options.pitch || 0.0)),
      volume: Math.max(0.0, Math.min(1.0, options.volume || 1.0)),
    };
  }

  private async synthesize(text: string, options: GeminiTTSOptions = {}): Promise<{ audioUrl: string; duration: number; volume: number }> {
    if (!text || text.trim().length === 0) {
      throw new Error('No text provided for synthesis');
    }

    if (text.length > 5000) {
      throw new Error('Text exceeds maximum length of 5000 characters');
    }

    const normalizedOptions = this.normalizeOptions(options);

    try {
      // Generate cache key to find the audio file
      const cacheKey = await this.generateCacheKey(text, normalizedOptions.voice, normalizedOptions.rate);
      const audioUrl = `${this.audioBasePath}/${cacheKey}.wav`;

      console.log('[TTS] Loading static audio file:', cacheKey);

      // Test if file exists by attempting to fetch it
      const response = await fetch(audioUrl, { method: 'HEAD' });
      if (!response.ok) {
        throw new Error(`Audio file not found: ${cacheKey}.wav`);
      }

      return {
        audioUrl,
        duration: 0, // Will be determined during playback
        volume: normalizedOptions.volume,
      };
    } catch (error) {
      this.speaking = false;
      this.paused = false;
      this.currentAudio = null;

      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to load audio file');
    }
  }

  /**
   * Synthesize speech from Arabic text using pre-generated audio files
   *
   * @param text - Arabic text to synthesize (max 5000 characters)
   * @param options - Voice and audio configuration options
   * @returns Promise that resolves with audio duration when playback completes
   * @throws Error if text is invalid or audio file not found
   */
  async speak(text: string, options: GeminiTTSOptions = {}): Promise<number> {
    this.stop();

    const { audioUrl, volume } = await this.synthesize(text, options);
    const duration = await this.playAudio(audioUrl, volume);
    return duration;
  }

  async createAudio(text: string, options: GeminiTTSOptions = {}): Promise<GeminiTTSAudioHandle> {
    this.stop();

    const { audioUrl, duration, volume } = await this.synthesize(text, options);
    const audio = new Audio(audioUrl);
    audio.volume = volume;

    return {
      audio,
      duration,
    };
  }

  /**
   * Play audio from URL
   * Creates HTMLAudioElement and manages playback lifecycle
   * @returns Promise that resolves with audio duration when playback completes
   */
  private playAudio(audioUrl: string, volume: number): Promise<number> {
    return new Promise((resolve, reject) => {
      let audioDuration = 0;
      const audio = new Audio(audioUrl);
      audio.volume = volume;
      
      // Set up event handlers before playing
      audio.onended = () => {
        console.log('[TTS] Audio playback completed, duration was:', audioDuration.toFixed(2), 'seconds');
        this.speaking = false;
        this.paused = false;
        this.currentAudio = null;
        resolve(audioDuration);
      };

      audio.onerror = (event) => {
        console.error('[TTS] Audio playback error:', event);
        this.speaking = false;
        this.paused = false;
        this.currentAudio = null;
        reject(new Error(`Audio playback error: ${event}`));
      };

      // Start playback
      audio.play()
        .then(() => {
          audioDuration = audio.duration || 5.0; // Fallback to 5 seconds if duration not available
          console.log('[TTS] Audio playback started, duration:', audioDuration.toFixed(2), 'seconds');
          this.currentAudio = audio;
          this.speaking = true;
          this.paused = false;
        })
        .catch((error) => {
          console.error('[TTS] Failed to start audio playback:', error);
          this.speaking = false;
          this.paused = false;
          this.currentAudio = null;
          reject(new Error(`Failed to play audio: ${error.message}`));
        });
    });
  }

  /**
   * Stop current audio playback immediately
   * Resets playback position to beginning
   */
  stop(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }

    this.speaking = false;
    this.paused = false;
  }

  /**
   * Pause current audio playback
   * Can be resumed from current position
   */
  pause(): void {
    if (!this.speaking || this.paused || !this.currentAudio) {
      return;
    }

    this.currentAudio.pause();
    this.paused = true;
  }

  /**
   * Resume paused audio playback
   * Continues from paused position
   */
  resume(): void {
    if (!this.paused || !this.currentAudio) {
      return;
    }

    this.currentAudio.play().catch((error) => {
      console.error('Failed to resume audio:', error);
      this.stop();
    });

    this.paused = false;
  }

  /**
   * Check if audio is currently playing
   */
  isSpeaking(): boolean {
    return this.speaking && !this.paused;
  }

  /**
   * Check if audio is paused
   */
  isPaused(): boolean {
    return this.paused;
  }

  /**
   * Get current playback state
   */
  getState(): { speaking: boolean; paused: boolean; voice: GeminiVoice } {
    return {
      speaking: this.speaking,
      paused: this.paused,
      voice: this.defaultVoice,
    };
  }

  /**
   * Set default voice for all subsequent synthesis requests
   * @param voice - Gemini voice identifier
   */
  setDefaultVoice(voice: GeminiVoice): void {
    this.defaultVoice = voice;
  }

  /**
   * Get current default voice
   */
  getDefaultVoice(): GeminiVoice {
    return this.defaultVoice;
  }

  /**
   * Get list of all available Gemini voices
   * Returns voice identifiers with characteristics
   *
   * RECOMMENDED FOR NIBRAS: Charon, Rasalgethi, Sadaltager, Gacrux, Schedar
   */
  getAvailableVoices(): Array<{ id: GeminiVoice; description: string; characteristic: string; recommendedForNibras: boolean }> {
    return [
      {
        id: 'Charon',
        description: 'Informative, authoritative - BEST for Islamic historical narration',
        characteristic: 'Informative',
        recommendedForNibras: true,
      },
      {
        id: 'Rasalgethi',
        description: 'Knowledgeable, educational - Excellent alternative for historical content',
        characteristic: 'Informative',
        recommendedForNibras: true,
      },
      {
        id: 'Sadaltager',
        description: 'Scholarly, wise - Perfect for religious and educational content',
        characteristic: 'Knowledgeable',
        recommendedForNibras: true,
      },
      {
        id: 'Gacrux',
        description: 'Mature, dignified - Respectful tone for serious content',
        characteristic: 'Mature',
        recommendedForNibras: true,
      },
      {
        id: 'Schedar',
        description: 'Balanced, professional - Reliable for all content types',
        characteristic: 'Even',
        recommendedForNibras: true,
      },
      {
        id: 'Iapetus',
        description: 'Clear, precise articulation',
        characteristic: 'Clear',
        recommendedForNibras: false,
      },
      {
        id: 'Alnilam',
        description: 'Firm, authoritative tone',
        characteristic: 'Firm',
        recommendedForNibras: false,
      },
      {
        id: 'Kore',
        description: 'Strong, decisive delivery',
        characteristic: 'Firm',
        recommendedForNibras: false,
      },
      {
        id: 'Orus',
        description: 'Solid, confident voice',
        characteristic: 'Firm',
        recommendedForNibras: false,
      },
      {
        id: 'Algieba',
        description: 'Polished, refined tone',
        characteristic: 'Smooth',
        recommendedForNibras: false,
      },
      {
        id: 'Despina',
        description: 'Elegant, flowing delivery',
        characteristic: 'Smooth',
        recommendedForNibras: false,
      },
      {
        id: 'Erinome',
        description: 'Sharp, distinct articulation',
        characteristic: 'Clear',
        recommendedForNibras: false,
      },
      {
        id: 'Zephyr',
        description: 'Clear, uplifting tone',
        characteristic: 'Bright',
        recommendedForNibras: false,
      },
      {
        id: 'Autonoe',
        description: 'Cheerful, clear voice',
        characteristic: 'Bright',
        recommendedForNibras: false,
      },
      {
        id: 'Achernar',
        description: 'Gentle, soothing delivery',
        characteristic: 'Soft',
        recommendedForNibras: false,
      },
      {
        id: 'Vindemiatrix',
        description: 'Kind, soft-spoken tone',
        characteristic: 'Gentle',
        recommendedForNibras: false,
      },
      {
        id: 'Enceladus',
        description: 'Soft, gentle voice',
        characteristic: 'Breathy',
        recommendedForNibras: false,
      },
      {
        id: 'Sulafat',
        description: 'Comforting, inviting tone',
        characteristic: 'Warm',
        recommendedForNibras: false,
      },
      {
        id: 'Achird',
        description: 'Warm, welcoming voice',
        characteristic: 'Friendly',
        recommendedForNibras: false,
      },
      {
        id: 'Callirrhoe',
        description: 'Relaxed, comfortable delivery',
        characteristic: 'Easy-going',
        recommendedForNibras: false,
      },
      {
        id: 'Umbriel',
        description: 'Calm, approachable tone',
        characteristic: 'Easy-going',
        recommendedForNibras: false,
      },
      {
        id: 'Algenib',
        description: 'Deep, textured voice',
        characteristic: 'Gravelly',
        recommendedForNibras: false,
      },
      {
        id: 'Pulcherrima',
        description: 'Direct, assertive delivery',
        characteristic: 'Forward',
        recommendedForNibras: false,
      },
      {
        id: 'Puck',
        description: 'Energetic, positive - Too playful for religious content',
        characteristic: 'Upbeat',
        recommendedForNibras: false,
      },
      {
        id: 'Laomedeia',
        description: 'Positive, lively - Too casual for historical narration',
        characteristic: 'Upbeat',
        recommendedForNibras: false,
      },
      {
        id: 'Fenrir',
        description: 'Dynamic, enthusiastic - Too excitable for Islamic content',
        characteristic: 'Excitable',
        recommendedForNibras: false,
      },
      {
        id: 'Sadachbia',
        description: 'Animated, spirited - Too lively for respectful narration',
        characteristic: 'Lively',
        recommendedForNibras: false,
      },
      {
        id: 'Leda',
        description: 'Fresh, young - Too youthful for authoritative content',
        characteristic: 'Youthful',
        recommendedForNibras: false,
      },
      {
        id: 'Aoede',
        description: 'Light, casual - Too breezy for serious content',
        characteristic: 'Breezy',
        recommendedForNibras: false,
      },
      {
        id: 'Zubenelgenubi',
        description: 'Informal, relaxed - Too casual for Islamic history',
        characteristic: 'Casual',
        recommendedForNibras: false,
      },
    ];
  }
}

const geminiTTS = new GeminiTTSService();

export default geminiTTS;
