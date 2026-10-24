// The event panel's narration: plays the recorded description (public/audio,
// found by src/narration.ts), with play/pause, a progress ring and an Arabic
// error. Stops when the event changes or the panel closes. `hasNarration` is false
// when the event has no fresh recording; the panel then shows no play button.
import { useEffect, useRef, useState } from 'react';
import type { EventItem } from '../../data';
import narrationPlayer, { releaseOwner } from '../../services/narrationPlayer';
import { narrationUrl } from '../../narration';
import { toArabicIndic } from '../../../shared/arabic';

export type AudioState = 'idle' | 'playing' | 'paused';

export interface Narration {
  hasNarration: boolean;
  audioState: AudioState;
  isAudioLoading: boolean;
  audioError: string | null;
  currentTime: number;
  duration: number;
  progressFraction: number;
  formatAudioTime: (time: number) => string;
  startAudio: (restart?: boolean) => Promise<void>;
  pauseAudio: () => void;
}

const formatAudioTime = (time: number) => {
  const safe = Number.isFinite(time) ? Math.max(0, Math.floor(time)) : 0;
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return toArabicIndic(`${m}:${s.toString().padStart(2, '0')}`);
};

export function useNarration(event: EventItem | null): Narration {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [audioState, setAudioState] = useState<AudioState>('idle');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const cleanupAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.onloadedmetadata = null;
      audioRef.current.ontimeupdate = null;
      audioRef.current.onpause = null;
      audioRef.current.onplay = null;
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current = null;
    }
    releaseOwner('panel');
    narrationPlayer.stop();
    setAudioState('idle');
    setCurrentTime(0);
    setDuration(0);
    setIsAudioLoading(false);
  };

  useEffect(() => {
    setAudioError(null);
    cleanupAudio();
  }, [event?.id]);

  useEffect(() => {
    return () => cleanupAudio();
  }, []);

  const setupAudioListeners = (audio: HTMLAudioElement, initialDuration = 0) => {
    audio.onloadedmetadata = () => setDuration(audio.duration || initialDuration || 0);
    audio.ontimeupdate = () => setCurrentTime(audio.currentTime);
    audio.onplay = () => {
      setAudioState('playing');
      setAudioError(null);
    };
    audio.onpause = () => {
      if (!audio.ended) setAudioState('paused');
    };
    audio.onended = () => {
      setAudioState('paused');
      setCurrentTime(0);
      audio.currentTime = 0;
    };
    audio.onerror = () => {
      setAudioError('تعذّر تشغيل الصوت لهذا الحدث');
      setAudioState('idle');
      setIsAudioLoading(false);
    };
  };

  const url = event ? narrationUrl(event, 'description') : null;

  const startAudio = async (restart = false) => {
    if (!url || isAudioLoading) return;
    try {
      setAudioError(null);
      if (!audioRef.current) {
        setIsAudioLoading(true);
        const { audio, duration: audioDuration } = narrationPlayer.createAudio(url);
        audioRef.current = audio;
        setupAudioListeners(audio, audioDuration);
        setDuration(audioDuration || 0);
        setCurrentTime(0);
        setIsAudioLoading(false);
      }
      const audio = audioRef.current;
      if (!audio) return;
      if (restart) {
        audio.currentTime = 0;
        setCurrentTime(0);
      }
      await audio.play();
    } catch (error) {
      setIsAudioLoading(false);
      setAudioState('idle');
      setAudioError(error instanceof Error ? error.message : 'تعذّر تحميل الصوت');
    }
  };

  const pauseAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setCurrentTime(audioRef.current.currentTime);
    setAudioState('paused');
  };

  const progressFraction = duration > 0 ? Math.min(currentTime / duration, 1) : 0;

  return {
    hasNarration: url !== null,
    audioState,
    isAudioLoading,
    audioError,
    currentTime,
    duration,
    progressFraction,
    formatAudioTime,
    startAudio,
    pauseAudio,
  };
}
