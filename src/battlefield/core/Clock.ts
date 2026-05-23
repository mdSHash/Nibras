/**
 * Deterministic fixed-timestep clock for the battle simulation.
 *
 * Key features:
 * - Fixed timestep (default 16.67ms = 60 updates/sec) for deterministic simulation
 * - Variable playback speed (0.25x to 4x)
 * - Accumulator pattern to decouple render from simulation
 * - Pause/resume support
 * - Seek to arbitrary time
 * - Frame counting
 */

export interface ClockOptions {
  /** Milliseconds per simulation step (default: 1000/60 ≈ 16.67ms) */
  fixedDeltaTime?: number;
  /** Maximum delta time cap to prevent spiral of death (default: 250ms) */
  maxDeltaTime?: number;
  /** Initial playback speed multiplier (default: 1.0) */
  speed?: number;
}

export class Clock {
  // Configuration
  private fixedDeltaTime: number;
  private maxDeltaTime: number;

  // State
  private accumulator: number = 0;
  private simulationTime: number = 0;
  private realTime: number = 0;
  private frame: number = 0;
  private speed: number;
  private paused: boolean = false;
  private started: boolean = false;

  constructor(options?: ClockOptions) {
    this.fixedDeltaTime = options?.fixedDeltaTime ?? 1000 / 60;
    this.maxDeltaTime = options?.maxDeltaTime ?? 250;
    this.speed = Math.min(4.0, Math.max(0.25, options?.speed ?? 1.0));
  }

  /** Start the clock (records initial real time) */
  start(): void {
    this.started = true;
    this.paused = false;
    this.accumulator = 0;
    this.simulationTime = 0;
    this.realTime = 0;
    this.frame = 0;
  }

  /** Stop/reset the clock */
  stop(): void {
    this.started = false;
    this.paused = false;
    this.accumulator = 0;
    this.simulationTime = 0;
    this.realTime = 0;
    this.frame = 0;
  }

  /** Pause simulation (accumulator stops growing) */
  pause(): void {
    this.paused = true;
  }

  /** Resume from pause */
  resume(): void {
    this.paused = false;
    // Reset realTime so the next update doesn't accumulate the paused duration
    this.realTime = 0;
  }

  /**
   * Update the clock with current real time.
   * Returns the number of fixed steps that should be executed this frame.
   * Call this once per requestAnimationFrame.
   */
  update(currentTime: number): number {
    if (!this.started || this.paused) {
      this.realTime = currentTime;
      return 0;
    }

    // First frame after start or resume: just record time, no steps
    if (this.realTime === 0) {
      this.realTime = currentTime;
      return 0;
    }

    // Calculate real elapsed time since last update
    let rawDelta = currentTime - this.realTime;
    this.realTime = currentTime;

    // Cap delta to prevent spiral of death (e.g., tab was backgrounded)
    if (rawDelta > this.maxDeltaTime) {
      rawDelta = this.maxDeltaTime;
    }

    // Apply speed multiplier and add to accumulator
    this.accumulator += rawDelta * this.speed;

    // Calculate how many fixed steps to execute
    const steps = Math.floor(this.accumulator / this.fixedDeltaTime);

    // Subtract consumed time from accumulator
    this.accumulator -= steps * this.fixedDeltaTime;

    // Advance simulation time and frame counter
    this.simulationTime += steps * this.fixedDeltaTime;
    this.frame += steps;

    return steps;
  }

  /** Seek to a specific simulation time (ms) */
  seek(timeMs: number): void {
    this.simulationTime = Math.max(0, timeMs);
    this.accumulator = 0;
    this.frame = Math.round(this.simulationTime / this.fixedDeltaTime);
  }

  /** Set playback speed (clamped between 0.25 and 4.0) */
  setSpeed(speed: number): void {
    this.speed = Math.min(4.0, Math.max(0.25, speed));
  }

  /** Get current simulation time in milliseconds */
  getTime(): number {
    return this.simulationTime;
  }

  /** Get current simulation time in seconds */
  getTimeSeconds(): number {
    return this.simulationTime / 1000;
  }

  /** Get the fixed delta time per step in seconds */
  getDeltaSeconds(): number {
    return this.fixedDeltaTime / 1000;
  }

  /** Get the fixed delta time per step in milliseconds */
  getDeltaMs(): number {
    return this.fixedDeltaTime;
  }

  /** Get current frame number */
  getFrame(): number {
    return this.frame;
  }

  /** Get current playback speed */
  getSpeed(): number {
    return this.speed;
  }

  /** Check if clock is paused */
  isPaused(): boolean {
    return this.paused;
  }

  /** Check if clock has been started */
  isStarted(): boolean {
    return this.started;
  }

  /** Get interpolation alpha for rendering between fixed steps (0-1) */
  getAlpha(): number {
    return this.accumulator / this.fixedDeltaTime;
  }
}
