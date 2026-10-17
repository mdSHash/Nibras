import { describe, expect, it } from 'vitest';
import { formatTime, initialPlayerState, playerReducer, type PlayerAction, type PlayerState } from '../src/components/battleVideo/playerState';

const run = (...actions: PlayerAction[]): PlayerState => actions.reduce(playerReducer, initialPlayerState);

describe('the battle video player state', () => {
  it('loads, becomes ready with the duration, then plays', () => {
    expect(run({ type: 'ready', duration: 281 })).toMatchObject({ status: 'ready', duration: 281, started: false });
    expect(run({ type: 'ready', duration: 281 }, { type: 'playing' })).toMatchObject({ status: 'playing', started: true });
  });

  it('asks for a tap only when autoplay was blocked after ready, and forgets it once playing', () => {
    expect(run({ type: 'autoplayBlocked' }).needsTap).toBe(false);
    const blocked = run({ type: 'ready', duration: 1 }, { type: 'autoplayBlocked' });
    expect(blocked.needsTap).toBe(true);
    expect(playerReducer(blocked, { type: 'playing' }).needsTap).toBe(false);
    // Some browsers report paused or buffering when they refuse autoplay.
    expect(run({ type: 'ready', duration: 1 }, { type: 'paused' }, { type: 'autoplayBlocked' }).needsTap).toBe(true);
    expect(run({ type: 'ready', duration: 1 }, { type: 'playing' }, { type: 'paused' }, { type: 'autoplayBlocked' }).needsTap).toBe(false);
  });

  it('keeps an error until a retry, which starts a fresh attempt', () => {
    const failed = run({ type: 'ready', duration: 1 }, { type: 'error', kind: 'unavailable' }, { type: 'paused' }, { type: 'playing' });
    expect(failed).toMatchObject({ status: 'error', error: 'unavailable' });
    expect(playerReducer(failed, { type: 'retry' })).toEqual({ ...initialPlayerState, attempt: 1 });
  });

  it('writes the time with Arabic-Indic digits', () => {
    expect(formatTime(83)).toBe('١:٢٣');
    expect(formatTime(281.9)).toBe('٤:٤١');
    expect(formatTime(-1)).toBe('٠:٠٠');
  });
});
