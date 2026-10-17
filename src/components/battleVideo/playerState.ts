// The battle video player's state (Phase 3H): what the engine reports
// (videoEngine.ts) and what the visitor asked for, as a pure reducer.
import { toArabicIndic } from '../../../shared/arabic';
import type { EngineEvent, VideoErrorKind } from './videoEngine';

export type PlayerStatus = 'loading' | 'ready' | 'playing' | 'paused' | 'buffering' | 'ended' | 'error';

export interface PlayerState {
  status: PlayerStatus;
  error?: VideoErrorKind;
  /** The browser blocked autoplay: the visitor has to start the video. */
  needsTap: boolean;
  /** True once the video has played, so the poster no longer covers the frame. */
  started: boolean;
  /** Seconds; 0 until the engine is ready. */
  duration: number;
  /** Increases on every retry, so the player mounts a fresh engine. */
  attempt: number;
}

export type PlayerAction = EngineEvent | { type: 'autoplayBlocked' } | { type: 'retry' };

export const initialPlayerState: PlayerState = { status: 'loading', needsTap: false, started: false, duration: 0, attempt: 0 };

export function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case 'ready':
      return state.status === 'loading' ? { ...state, status: 'ready', duration: action.duration } : state;
    case 'playing':
      return { ...state, status: 'playing', needsTap: false, started: true };
    case 'paused':
    case 'buffering':
    case 'ended':
      return state.status === 'error' ? state : { ...state, status: action.type };
    case 'autoplayBlocked':
      return state.status === 'ready' ? { ...state, needsTap: true } : state;
    case 'error':
      return { ...state, status: 'error', error: action.kind, needsTap: false };
    case 'retry':
      return { ...initialPlayerState, attempt: state.attempt + 1 };
  }
}

/** The error message the player shows, in Arabic. */
export const ERROR_MESSAGES: Record<VideoErrorKind, string> = {
  script: 'تعذّر الاتصال بيوتيوب لتشغيل الفيديو. تحقّق من الاتصال ثم أعد المحاولة.',
  invalid: 'تعذّر العثور على هذا الفيديو.',
  unplayable: 'تعذّر تشغيل الفيديو في هذا المتصفح.',
  unavailable: 'هذا الفيديو غير متاح الآن على يوتيوب.',
};

/** 83 → «١:٢٣», as the app writes numbers (Arabic-Indic digits). */
export function formatTime(seconds: number): string {
  const whole = Math.max(0, Math.floor(seconds));
  return toArabicIndic(`${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`);
}
