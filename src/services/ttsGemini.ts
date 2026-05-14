/**
 * Gemini Flash Text-to-Speech Service
 *
 * Backend proxy for Google Gemini TTS API with 30 available voices.
 * Default voice: Charon (Informative) - authoritative tone for Islamic historical content.
 *
 * Recommended voices for Nibras:
 * - Charon (Informative) - Best for historical narration
 * - Rasalgethi (Informative) - Educational alternative
 * - Sadaltager (Knowledgeable) - Scholarly tone
 * - Gacrux (Mature) - Dignified delivery
 * - Schedar (Even) - Balanced professional
 *
 * Architecture:
 * - Frontend calls backend at /api/synthesize
 * - Backend handles Gemini API and converts L16 PCM to WAV
 * - Frontend plays audio via HTMLAudioElement
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
  private backendUrl: string;
  private currentAudio: HTMLAudioElement | null = null;
  private speaking: boolean = false;
  private paused: boolean = false;
  private defaultVoice: GeminiVoice = 'Charon';
  private backendAvailable: boolean | null = null;

  constructor() {
    this.backendUrl = '';
  }

  /**
   * Check if backend TTS service is available
   * Tests connectivity to backend API
   */
  async isAvailable(): Promise<boolean> {
    if (this.backendAvailable !== null) {
      return this.backendAvailable;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch('/api/synthesize', {
        method: 'OPTIONS',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      this.backendAvailable = response.ok;
      return response.ok;
    } catch (error) {
      this.backendAvailable = false;
      return false;
    }
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
    const available = await this.isAvailable();
    if (!available) {
      throw new Error('Backend TTS service is not available');
    }

    if (!text || text.trim().length === 0) {
      throw new Error('No text provided for synthesis');
    }

    if (text.length > 5000) {
      throw new Error('Text exceeds maximum length of 5000 characters');
    }

    const normalizedOptions = this.normalizeOptions(options);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch('/api/synthesize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voice: normalizedOptions.voice,
          rate: normalizedOptions.rate,
          pitch: normalizedOptions.pitch,
          volume: normalizedOptions.volume,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.audio) {
        throw new Error('No audio data received from API');
      }

      if (data.cached) {
        console.log('[TTS] Using cached audio, duration:', data.duration?.toFixed(2), 'seconds');
      } else {
        console.log('[TTS] Generated new audio, duration:', data.duration?.toFixed(2), 'seconds');
      }

      return {
        audioUrl: data.audio,
        duration: data.duration || 0,
        volume: normalizedOptions.volume,
      };
    } catch (error) {
      this.speaking = false;
      this.paused = false;
      this.currentAudio = null;

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout: API took too long to respond (30s limit)');
        }
        if (error.message.includes('fetch')) {
          throw new Error('Network error: Unable to connect to API');
        }
        throw error;
      }
      throw new Error('Failed to synthesize speech');
    }
  }

  /**
   * Synthesize speech from Arabic text using Gemini Flash TTS
   *
   * @param text - Arabic text to synthesize (max 5000 characters)
   * @param options - Voice and audio configuration options
   * @returns Promise that resolves with audio duration when playback completes
   * @throws Error if API key is missing, text is invalid, or API request fails
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
   * Play audio from URL (Blob URL or data URL)
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
