/**
 * TimelineController - high-level playback coordination.
 *
 * Sits between the Engine and ScriptInterpreter to provide:
 * - Phase tracking (which phase are we in)
 * - Progress calculation
 * - Narration timing coordination
 * - Seek support (reset interpreter, fast-forward)
 * - Auto-pause at phase boundaries (optional)
 * - Battle completion detection
 */

import { EventBus } from '../core/EventBus';
import { Clock } from '../core/Clock';
import { ScriptInterpreter } from '../scripting';
import { usePlaybackStore } from '../state/playbackStore';
import type { BattleScenario } from '../types/scenario';

export interface TimelineOptions {
  /** Auto-pause when a new phase starts (default: false) */
  autoPauseAtPhases?: boolean;
}

export class TimelineController {
  private clock: Clock;
  private eventBus: EventBus;
  private scriptInterpreter: ScriptInterpreter;
  private scenario: BattleScenario | null;
  private autoPauseAtPhases: boolean;
  private completionEmitted: boolean;
  private lastPhaseId: string | null;

  constructor(
    clock: Clock,
    eventBus: EventBus,
    scriptInterpreter: ScriptInterpreter,
    options?: TimelineOptions
  ) {
    this.clock = clock;
    this.eventBus = eventBus;
    this.scriptInterpreter = scriptInterpreter;
    this.scenario = null;
    this.autoPauseAtPhases = options?.autoPauseAtPhases ?? false;
    this.completionEmitted = false;
    this.lastPhaseId = null;

    // Listen for phase transitions to support auto-pause
    this.eventBus.on('phase:started', (event) => {
      if (this.autoPauseAtPhases && this.lastPhaseId !== null) {
        // Auto-pause when a new phase starts (not the first one)
        this.clock.pause();
        usePlaybackStore.getState().setStatus('paused');
      }
      this.lastPhaseId = event.payload.phaseId;
    });
  }

  /** Load a scenario into the timeline */
  loadScenario(scenario: BattleScenario): void {
    this.scenario = scenario;
    this.completionEmitted = false;
    this.lastPhaseId = null;

    // Load phases, narration, and camera keyframes into the script interpreter
    this.scriptInterpreter.load(
      scenario.phases,
      scenario.narration,
      scenario.cameraScript
    );

    // Update playback store with total duration
    const store = usePlaybackStore.getState();
    store.setTotalDuration(scenario.totalDuration);
    store.setCurrentTime(0);
    store.setCurrentPhase(null, null);
  }

  /** Unload current scenario */
  unloadScenario(): void {
    this.scriptInterpreter.unload();
    this.scenario = null;
    this.completionEmitted = false;
    this.lastPhaseId = null;

    usePlaybackStore.getState().reset();
  }

  /** Called each simulation tick */
  update(_dt: number, time: number): void {
    if (!this.scenario) {
      return;
    }

    // time is in seconds (from the engine's clock)
    this.scriptInterpreter.update(time);

    // Update playback store with current time
    usePlaybackStore.getState().setCurrentTime(time);

    // Check for completion
    if (time >= this.scenario.totalDuration && !this.completionEmitted) {
      this.completionEmitted = true;

      this.eventBus.emit({ type: 'playback:completed' });
      usePlaybackStore.getState().setStatus('completed');
    }
  }

  /** Seek to a specific time */
  seek(timeSeconds: number): void {
    if (!this.scenario) {
      return;
    }

    // Clamp to [0, totalDuration]
    const clampedTime = Math.max(0, Math.min(timeSeconds, this.scenario.totalDuration));

    // Reset completion flag if seeking backward
    if (clampedTime < this.scenario.totalDuration) {
      this.completionEmitted = false;
    }

    // Seek the script interpreter (re-executes state up to the target time)
    this.scriptInterpreter.seekTo(clampedTime);

    // Seek the clock (converts seconds to ms)
    this.clock.seek(clampedTime * 1000);

    // Update playback store
    const store = usePlaybackStore.getState();
    store.setCurrentTime(clampedTime);

    // Emit seek event
    this.eventBus.emit({
      type: 'playback:seek',
      payload: { time: clampedTime },
    });
  }

  /** Get current progress (0-1) */
  getProgress(): number {
    if (!this.scenario || this.scenario.totalDuration <= 0) {
      return 0;
    }

    const currentTime = this.clock.getTimeSeconds();
    return Math.max(0, Math.min(1, currentTime / this.scenario.totalDuration));
  }

  /** Get total duration in seconds */
  getDuration(): number {
    return this.scenario?.totalDuration ?? 0;
  }

  /** Get current phase info with phase-local progress */
  getCurrentPhase(): { id: string; name: string; progress: number } | null {
    if (!this.scenario) {
      return null;
    }

    const phaseInfo = this.scriptInterpreter.getCurrentPhase();
    if (!phaseInfo) {
      return null;
    }

    // Find the phase config to calculate local progress
    const phaseConfig = this.scenario.phases.find((p) => p.id === phaseInfo.id);
    if (!phaseConfig) {
      return { ...phaseInfo, progress: 0 };
    }

    const currentTime = this.clock.getTimeSeconds();
    const phaseElapsed = currentTime - phaseConfig.startTime;
    const phaseProgress = Math.max(0, Math.min(1, phaseElapsed / phaseConfig.duration));

    return {
      id: phaseInfo.id,
      name: phaseInfo.name,
      progress: phaseProgress,
    };
  }

  /** Check if battle is complete */
  isComplete(): boolean {
    if (!this.scenario) {
      return false;
    }

    return this.clock.getTimeSeconds() >= this.scenario.totalDuration;
  }

  /** Reset timeline to beginning */
  reset(): void {
    this.scriptInterpreter.reset();
    this.completionEmitted = false;
    this.lastPhaseId = null;

    // Reset clock to beginning
    this.clock.seek(0);

    // Reset stores
    const store = usePlaybackStore.getState();
    store.setCurrentTime(0);
    store.setCurrentPhase(null, null);
  }

  /** Enable/disable auto-pause at phase boundaries */
  setAutoPauseAtPhases(enabled: boolean): void {
    this.autoPauseAtPhases = enabled;
  }

  /** Destroy and clean up */
  destroy(): void {
    this.unloadScenario();
  }
}
