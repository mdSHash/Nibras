/**
 * Text-to-Speech Service for Arabic Narration
 *
 * Uses Gemini Flash TTS with Charon voice for authoritative historical content.
 * Provides playback control: play, pause, resume, stop.
 */

import geminiTTS from './ttsGemini';

export interface TTSOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
}

export type TTSProvider = 'gemini' | 'none';

class TTSService {
  private speaking: boolean = false;
  private paused: boolean = false;
  private currentProvider: TTSProvider = 'none';

  isSupported(): boolean {
    return true;
  }

  async speak(text: string, options: TTSOptions = {}): Promise<void> {
    if (!text || text.trim().length === 0) {
      throw new Error('No text provided for narration');
    }

    this.stop();

    const geminiAvailable = await geminiTTS.isAvailable();
    if (!geminiAvailable) {
      throw new Error('Gemini TTS service is not available');
    }

    try {
      this.currentProvider = 'gemini';
      await geminiTTS.speak(text, {
        voice: 'Charon',
        rate: options.rate,
        pitch: options.pitch,
        volume: options.volume,
      });
      this.speaking = false;
      this.paused = false;
      this.currentProvider = 'none';
    } catch (error) {
      this.speaking = false;
      this.paused = false;
      this.currentProvider = 'none';
      throw error;
    }
  }

  stop(): void {
    geminiTTS.stop();
    this.speaking = false;
    this.paused = false;
    this.currentProvider = 'none';
  }

  pause(): void {
    if (!this.speaking || this.paused) {
      return;
    }

    if (this.currentProvider === 'gemini') {
      geminiTTS.pause();
      this.paused = true;
    }
  }

  resume(): void {
    if (!this.paused) {
      return;
    }

    if (this.currentProvider === 'gemini') {
      geminiTTS.resume();
      this.paused = false;
    }
  }

  isSpeaking(): boolean {
    return this.speaking;
  }

  isPaused(): boolean {
    return this.paused;
  }

  getCurrentProvider(): TTSProvider {
    return this.currentProvider;
  }

  getState(): { speaking: boolean; paused: boolean; provider: TTSProvider } {
    return {
      speaking: this.speaking,
      paused: this.paused,
      provider: this.currentProvider,
    };
  }
}

const ttsService = new TTSService();

export default ttsService;

