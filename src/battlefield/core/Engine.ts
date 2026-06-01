/**
 * The main Engine class — central coordinator for the battle replay system.
 *
 * Responsibilities:
 * - Owns the requestAnimationFrame render loop
 * - Manages Clock for deterministic simulation timing
 * - Coordinates EventBus for inter-system communication
 * - Manages PixiRenderer lifecycle
 * - Manages CameraController
 * - Coordinates ECS systems (MovementSystem, RenderSystem)
 * - Manages ScenarioLoader, ScriptInterpreter, TimelineController
 * - Syncs simulation state to Zustand stores at throttled rate (~10fps)
 * - Handles scenario loading/unloading
 *
 * Lifecycle:
 * 1. new Engine() — creates core subsystems
 * 2. engine.init(canvas, width, height) — initializes PixiJS (async)
 * 3. engine.loadScenario(scenario) — loads battle data, spawns entities, creates systems
 * 4. engine.play() — starts the loop
 * 5. engine.pause() / engine.resume() — playback control
 * 6. engine.seek(time) — jump to time
 * 7. engine.destroy() — full cleanup
 */

import { Clock } from './Clock';
import { EventBus } from './EventBus';
import { PixiRenderer } from '../renderer/PixiRenderer';
import { CameraController } from '../camera/CameraController';
import { EntityManager } from '../entities';
import { ScenarioLoader } from '../scenarios';
import { ScriptInterpreter } from '../scripting';
import { TimelineController } from '../timeline';
import { createSystems, type SystemRefs } from '../systems';
import { usePlaybackStore } from '../state/playbackStore';
import { useSimulationStore } from '../state/simulationStore';
import { useCameraStore } from '../state/cameraStore';
import { useUIStore } from '../state/uiStore';
import { BattleAudio } from '../audio/BattleAudio';
import type { BattleScenario } from '../types/scenario';

export interface EngineOptions {
  /** Milliseconds per simulation step (default: 1000/60 ≈ 16.67ms) */
  fixedDeltaTime?: number;
  /** Milliseconds between Zustand store syncs (default: 100ms = ~10fps) */
  storeSyncInterval?: number;
  /** Enable event bus history recording (default: false) */
  historyEnabled?: boolean;
}

export class Engine {
  // Core subsystems
  private clock: Clock;
  private eventBus: EventBus;
  private renderer: PixiRenderer;
  private camera: CameraController | null;

  // ECS
  private entityManager: EntityManager;
  private scenarioLoader: ScenarioLoader;
  private systemRefs: SystemRefs | null;

  // Scripting & Timeline
  private scriptInterpreter: ScriptInterpreter | null;
  private timelineController: TimelineController | null;

  // Loop state
  private rafId: number | null;
  private running: boolean;
  private initialized: boolean;

  // Scenario
  private scenario: BattleScenario | null;

  // Store sync throttle
  private lastStoreSyncTime: number;
  private storeSyncInterval: number;

  // Systems placeholder (for additional custom systems)
  private systems: Array<{ name: string; update: (dt: number, time: number) => void }>;

  // Synthesized battle audio (subscribes to event bus, no asset loading)
  private audio: BattleAudio | null = null;

  constructor(options?: EngineOptions) {
    console.log('[Engine] constructor start');

    // Create Clock with options
    this.clock = new Clock({
      fixedDeltaTime: options?.fixedDeltaTime,
    });
    console.log('[Engine] Clock created');

    // Create EventBus with options
    this.eventBus = new EventBus({
      historyEnabled: options?.historyEnabled ?? false,
    });
    console.log('[Engine] EventBus created');

    // Create PixiRenderer (passing eventBus)
    this.renderer = new PixiRenderer(this.eventBus);
    console.log('[Engine] PixiRenderer created');

    // Create EntityManager
    this.entityManager = new EntityManager(this.eventBus);
    console.log('[Engine] EntityManager created');

    // Create ScenarioLoader
    this.scenarioLoader = new ScenarioLoader(this.entityManager, this.eventBus);
    console.log('[Engine] ScenarioLoader created');

    // Initialize other fields
    this.camera = null;
    this.systemRefs = null;
    this.scriptInterpreter = null;
    this.timelineController = null;
    this.rafId = null;
    this.running = false;
    this.initialized = false;
    this.scenario = null;
    this.lastStoreSyncTime = 0;
    this.storeSyncInterval = options?.storeSyncInterval ?? 100;
    this.systems = [];
    console.log('[Engine] constructor complete');
  }

  /**
   * Initialize the engine (async due to PixiJS).
   * Must be called before any rendering or playback.
   */
  async init(canvas: HTMLCanvasElement, width: number, height: number): Promise<void> {
    console.log('[Engine] init() called', { width, height });

    // Initialize PixiJS renderer
    console.log('[Engine] about to call renderer.init()...');
    await this.renderer.init(canvas, width, height);
    console.log('[Engine] renderer.init() completed');

    // Create CameraController with the world container
    console.log('[Engine] creating CameraController...');
    this.camera = new CameraController(
      this.renderer.getWorldContainer(),
      this.eventBus
    );
    this.camera.setViewport(width, height);
    console.log('[Engine] CameraController created');

    this.initialized = true;

    // Wire synthesized battle audio (events → Web Audio sound effects).
    // Created here (after the renderer) so the audio context is unlocked by
    // the same user gesture that triggered the canvas mount.
    if (!this.audio) {
      this.audio = new BattleAudio(this.eventBus);
    }

    // Emit initialization event
    this.eventBus.emit({ type: 'engine:initialized' });
    console.log('[Engine] init() complete — engine ready');
  }

  /**
   * Load a battle scenario.
   * Spawns entities, creates ECS systems, initializes timeline.
   */
  loadScenario(scenario: BattleScenario): void {
    if (!this.initialized) {
      console.warn('[Engine] loadScenario called before init — ignoring');
      return;
    }

    console.log('[Engine] loadScenario() start:', scenario.id);

    // Store scenario reference
    this.scenario = scenario;

    // Update playback store
    const playbackState = usePlaybackStore.getState();
    playbackState.setTotalDuration(scenario.totalDuration);
    playbackState.setStatus('loading');

    // 1. Spawn entities from scenario config
    console.log('[Engine] spawning entities via ScenarioLoader...');
    const entityIds = this.scenarioLoader.load(scenario);
    console.log(`[Engine] spawned ${entityIds.length} entities`);

    // 2. Create ECS systems (MovementSystem + RenderSystem + TerrainRenderer)
    console.log('[Engine] creating ECS systems...');
    this.systemRefs = createSystems(this.entityManager, this.renderer, this.eventBus);
    console.log('[Engine] ECS systems created');

    // 2b. Render terrain background (once, not per-frame)
    console.log('[Engine] rendering terrain...');
    this.systemRefs.terrain.renderTerrain(scenario.map);
    console.log('[Engine] terrain rendered');

    // Register movement system as a fixed-step system
    this.systems = [];
    this.registerSystem('movement', (dt, time) => {
      this.systemRefs!.movement.update(dt, time);
    });

    // 3. Create ScriptInterpreter and TimelineController
    console.log('[Engine] creating ScriptInterpreter and TimelineController...');
    this.scriptInterpreter = new ScriptInterpreter(
      this.entityManager,
      this.eventBus,
      this.camera
    );
    this.timelineController = new TimelineController(
      this.clock,
      this.eventBus,
      this.scriptInterpreter
    );

    // Load scenario into timeline (loads phases, narration, camera keyframes)
    this.timelineController.loadScenario(scenario);
    console.log('[Engine] TimelineController loaded scenario');

    // Register timeline as a fixed-step system
    this.registerSystem('timeline', (_dt, time) => {
      this.timelineController!.update(_dt, time);
    });

    // 4. Set initial camera to fit the unit bounding box (see fitToScenario).
    this.fitToScenario(0);

    // 5. Do an initial render pass so entities appear immediately
    this.systemRefs.render.update(0, 0);
    this.renderer.render();
    console.log('[Engine] initial render pass complete');

    // Emit scenario loaded event
    this.eventBus.emit({
      type: 'scenario:loaded',
      payload: { scenarioId: scenario.id },
    });

    // Set status to paused after loading
    playbackState.setStatus('paused');
    console.log('[Engine] loadScenario() complete');
  }

  /**
   * Unload current scenario.
   * Clears all state and resets to idle.
   */
  unloadScenario(): void {
    // Destroy timeline controller
    if (this.timelineController) {
      this.timelineController.destroy();
      this.timelineController = null;
    }

    // Clear script interpreter
    if (this.scriptInterpreter) {
      this.scriptInterpreter.unload();
      this.scriptInterpreter = null;
    }

    // Destroy render system display objects
    if (this.systemRefs) {
      this.systemRefs.render.destroy();
      this.systemRefs = null;
    }

    // Clear registered systems
    this.systems = [];

    // Unload entities
    this.scenarioLoader.unload();

    // Clear scenario reference
    this.scenario = null;

    // Reset clock
    this.clock.stop();

    // Clear all renderer layers
    this.renderer.clearAllLayers();

    // Reset all stores
    usePlaybackStore.getState().reset();
    useSimulationStore.getState().reset();
    useCameraStore.getState().reset();
    useUIStore.getState().reset();

    // Emit scenario unloaded event
    this.eventBus.emit({ type: 'scenario:unloaded' });
  }

  /**
   * Start/resume playback.
   * Starts the rAF loop and clock.
   */
  play(): void {
    if (!this.initialized || !this.scenario) {
      return;
    }

    this.running = true;

    // Start or resume clock
    if (!this.clock.isStarted()) {
      this.clock.start();
    } else {
      this.clock.resume();
    }

    // Update playback store
    usePlaybackStore.getState().setStatus('playing');

    // Emit playback event
    this.eventBus.emit({ type: 'playback:play' });

    // Start the rAF loop
    this.rafId = requestAnimationFrame((t) => this.loop(t));
  }

  /**
   * Pause playback.
   * Stops the rAF loop and pauses the clock.
   */
  pause(): void {
    this.running = false;

    // Pause clock
    this.clock.pause();

    // Cancel rAF
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    // Update playback store
    usePlaybackStore.getState().setStatus('paused');

    // Emit playback event
    this.eventBus.emit({ type: 'playback:pause' });
  }

  /**
   * Resume from pause (alias for play).
   */
  resume(): void {
    this.play();
  }

  /**
   * Stop playback and reset to beginning.
   */
  stop(): void {
    // Pause first
    this.pause();

    // Seek to beginning
    this.seek(0);

    // Update playback store status to idle
    usePlaybackStore.getState().setStatus('idle');

    // Emit playback event
    this.eventBus.emit({ type: 'playback:stop' });
  }

  /**
   * Fit the camera to the bounding box of all unit start positions.
   *
   * Called automatically once on scenario load, and exposed publicly so the
   * BattlePlayer can offer a "reset view" control after the user has
   * pinch-zoomed or panned away. Pass `duration > 0` to animate the move.
   *
   * Padding is mobile-aware: phones get a tighter fit factor since every
   * pixel of viewport matters, desktops get a bit more breathing room.
   */
  fitToScenario(duration: number = 0.6): void {
    if (!this.camera || !this.scenario) return;

    const viewportW = this.renderer.getWidth();
    const viewportH = this.renderer.getHeight();
    const isMobile =
      typeof window !== 'undefined' && window.matchMedia
        ? window.matchMedia('(max-width: 767px)').matches
        : false;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    let hasAny = false;
    for (const force of this.scenario.forces) {
      for (const u of force.units) {
        hasAny = true;
        minX = Math.min(minX, u.startPosition.x);
        minY = Math.min(minY, u.startPosition.y);
        maxX = Math.max(maxX, u.startPosition.x);
        maxY = Math.max(maxY, u.startPosition.y);
      }
    }
    if (!hasAny) {
      minX = 0; minY = 0;
      maxX = this.scenario.map.width; maxY = this.scenario.map.height;
    }

    // Pad bbox so formations near the edges aren't clipped (each formation
    // is ~150 world-units wide with banner above + count below).
    const padding = 160;
    const bboxW = (maxX - minX) + padding * 2;
    const bboxH = (maxY - minY) + padding * 2;
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;

    const fitFactor = isMobile ? 0.96 : 0.92;
    const bboxFitZoom = Math.min(viewportW / bboxW, viewportH / bboxH) * fitFactor;

    // Floor: ensure each soldier figure is at least this many CSS pixels.
    // Without this, a wide bbox on a small viewport would zoom out so far
    // that figures become 2 px specks. We accept cropping over invisibility.
    // Figures are ~7 world-units wide; target 11 px on mobile, 9 px on desktop.
    const targetFigurePx = isMobile ? 11 : 9;
    const minZoomFloor = targetFigurePx / 7;

    const fitZoom = Math.max(bboxFitZoom, minZoomFloor);

    this.camera.moveTo(cx, cy, fitZoom, duration, 'power2.inOut');
  }

  /**
   * Seek to a specific time in seconds.
   */
  seek(timeSeconds: number): void {
    // Use timeline controller for seek if available (handles script re-execution)
    if (this.timelineController) {
      this.timelineController.seek(timeSeconds);
    } else {
      // Fallback: just seek the clock
      this.clock.seek(timeSeconds * 1000);
      usePlaybackStore.getState().setCurrentTime(timeSeconds);
      this.eventBus.emit({
        type: 'playback:seek',
        payload: { time: timeSeconds },
      });
    }

    // Update render system to reflect new positions after seek
    if (this.systemRefs) {
      this.systemRefs.render.update(0, timeSeconds);
      this.renderer.render();
    }
  }

  /**
   * Set playback speed multiplier.
   */
  setSpeed(speed: number): void {
    this.clock.setSpeed(speed);

    // Update playback store
    usePlaybackStore.getState().setSpeed(speed);

    // Emit speed changed event
    this.eventBus.emit({
      type: 'playback:speed_changed',
      payload: { speed },
    });
  }

  /**
   * Get current simulation time in seconds.
   */
  getTime(): number {
    return this.clock.getTimeSeconds();
  }

  /**
   * Get the event bus (for external subscriptions).
   */
  getEventBus(): EventBus {
    return this.eventBus;
  }

  /**
   * Get the renderer.
   */
  getRenderer(): PixiRenderer {
    return this.renderer;
  }

  /**
   * Get the camera controller.
   */
  getCamera(): CameraController | null {
    return this.camera;
  }

  /**
   * Get the clock.
   */
  getClock(): Clock {
    return this.clock;
  }

  /**
   * Check if engine is initialized.
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Check if engine is currently running.
   */
  isRunning(): boolean {
    return this.running;
  }

  /**
   * Handle resize.
   */
  resize(width: number, height: number): void {
    this.renderer.resize(width, height);
    this.camera?.setViewport(width, height);
  }

  /**
   * Register a system (for Phase 2 - ECS systems).
   * Systems are called in registration order each fixed step.
   */
  registerSystem(name: string, updateFn: (dt: number, time: number) => void): void {
    this.systems.push({ name, update: updateFn });
  }

  /**
   * The main loop (called via requestAnimationFrame).
   * Runs fixed-timestep simulation steps and renders.
   */
  private loop(currentTime: number): void {
    if (!this.running) {
      return;
    }

    // Get number of fixed steps from clock
    const steps = this.clock.update(currentTime);

    // Run fixed simulation steps (movement + timeline)
    const dt = this.clock.getDeltaSeconds();
    let simTime = this.clock.getTimeSeconds();

    for (let i = 0; i < steps; i++) {
      // Run all registered systems (movement, timeline)
      for (const system of this.systems) {
        system.update(dt, simTime);
      }

      // Emit tick event
      this.eventBus.emit({
        type: 'engine:tick',
        payload: { dt, time: simTime, frame: this.clock.getFrame() },
      });

      // simTime advances by dt each step (for systems that need per-step time)
      simTime += dt;
    }

    // Update camera (with last dt for follow smoothing)
    if (this.camera) {
      this.camera.update(dt);
    }

    // Update render system every frame (syncs PixiJS display objects to entity state)
    if (this.systemRefs) {
      this.systemRefs.render.update(dt, this.clock.getTimeSeconds());
    }

    // Render the frame (PixiJS draw call)
    this.renderer.render();

    // Sync to stores (throttled)
    this.syncToStores();

    // Check if simulation completed
    if (this.scenario && this.clock.getTimeSeconds() >= this.scenario.totalDuration) {
      this.running = false;
      usePlaybackStore.getState().setStatus('completed');
      this.eventBus.emit({ type: 'playback:completed' });
      return;
    }

    // Schedule next frame
    this.rafId = requestAnimationFrame((t) => this.loop(t));
  }

  /**
   * Sync engine state to Zustand stores (throttled to ~10fps).
   * Prevents excessive React re-renders from 60fps updates.
   */
  private syncToStores(): void {
    const now = performance.now();

    if (now - this.lastStoreSyncTime < this.storeSyncInterval) {
      return;
    }

    this.lastStoreSyncTime = now;

    // Update playback store with current time
    usePlaybackStore.getState().setCurrentTime(this.clock.getTimeSeconds());
  }

  /**
   * Destroy the engine and all subsystems.
   * Full cleanup — the engine cannot be used after this.
   */
  destroy(): void {
    // Stop the loop
    this.running = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    // Tear down audio (closes AudioContext, unsubscribes event listeners)
    if (this.audio) {
      this.audio.destroy();
      this.audio = null;
    }

    // Destroy timeline controller
    if (this.timelineController) {
      this.timelineController.destroy();
      this.timelineController = null;
    }

    // Clear script interpreter
    if (this.scriptInterpreter) {
      this.scriptInterpreter.unload();
      this.scriptInterpreter = null;
    }

    // Destroy render system display objects
    if (this.systemRefs) {
      this.systemRefs.render.destroy();
      this.systemRefs = null;
    }

    // Clear registered systems
    this.systems = [];

    // Unload entities
    this.scenarioLoader.unload();

    // Destroy camera
    if (this.camera) {
      this.camera.destroy();
      this.camera = null;
    }

    // Destroy renderer
    this.renderer.destroy();

    // Destroy event bus
    this.eventBus.destroy();

    // Reset all stores
    usePlaybackStore.getState().reset();
    useSimulationStore.getState().reset();
    useCameraStore.getState().reset();
    useUIStore.getState().reset();

    // Clear references
    this.scenario = null;
    this.initialized = false;
  }
}
