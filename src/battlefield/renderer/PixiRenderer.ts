/**
 * PixiRenderer manages the PixiJS Application lifecycle and layer hierarchy.
 *
 * Architecture:
 * - Creates a PixiJS Application (WebGL)
 * - Sets up a world container (moved by camera)
 * - Creates 5 layer containers inside the world container
 * - Provides API to access layers for adding/removing display objects
 * - Handles resize events
 * - Does NOT own the render loop (Engine does via app.ticker or rAF)
 */

import { Application, Container } from 'pixi.js';
// Pre-import PixiJS browser environment extensions to prevent dynamic import hangs.
// PixiJS v8 uses dynamic `import()` internally during Application.init() to load
// browser extensions (accessibility, events, rendering, etc.).
// If the bundler (Vite) doesn't properly resolve these dynamic imports, the init
// promise hangs forever with no error. By statically importing the browser bundle
// here via the official export path, the modules are already in the module cache
// when PixiJS tries to dynamically import them.
// NOTE: 'pixi.js/browser' is the official export (see pixi.js package.json "exports").
// Do NOT use deep internal paths like 'pixi.js/lib/...' — they are not in the
// exports map and Vite's dev server will return a 500 error for them.
import 'pixi.js/browser';
import { EventBus } from '../core/EventBus';
import { LAYER_NAMES, type LayerName } from './layers';

/** Default timeout for PixiJS initialization (ms) */
const INIT_TIMEOUT_MS = 10_000;

export class PixiRenderer {
  private app: Application;
  private worldContainer: Container;
  private layers: Map<LayerName, Container>;
  private eventBus: EventBus;
  private initialized: boolean;
  private _width: number;
  private _height: number;

  constructor(eventBus: EventBus) {
    console.log('[PixiRenderer] constructor called');
    this.app = new Application();
    this.worldContainer = new Container();
    this.layers = new Map();
    this.eventBus = eventBus;
    this.initialized = false;
    this._width = 0;
    this._height = 0;
  }

  /**
   * Initialize the PixiJS application and mount to DOM element.
   * Must be called before any rendering.
   * PixiJS v8 uses async init.
   *
   * Includes a timeout to prevent indefinite hangs if WebGL context
   * creation fails silently.
   */
  async init(canvas: HTMLCanvasElement, width: number, height: number): Promise<void> {
    console.log('[PixiRenderer] init() called', { width, height, canvasExists: !!canvas });

    if (this.initialized) {
      console.log('[PixiRenderer] already initialized, skipping');
      return;
    }

    this._width = width;
    this._height = height;

    // Do NOT set canvas.width/height manually — let PixiJS handle it via resolution + autoDensity.
    // Setting canvas dimensions before PixiJS init can conflict with its internal sizing logic
    // and cause WebGL context creation to hang in some browsers.
    console.log('[PixiRenderer] about to call initWithTimeout...');

    // Initialize PixiJS v8 Application with the provided canvas.
    // Wrap in a timeout to prevent indefinite hangs if WebGL context
    // creation fails silently (e.g., GPU driver issues, context limit reached).
    await this.initWithTimeout(canvas, width, height);

    console.log('[PixiRenderer] initWithTimeout resolved successfully');

    // Disable built-in ticker — Engine manages the render loop
    this.app.ticker.stop();
    console.log('[PixiRenderer] ticker stopped');

    // Set up world container (camera manipulates this)
    this.worldContainer = new Container();
    this.worldContainer.label = 'world';
    this.app.stage.addChild(this.worldContainer);

    // Create layer containers in order (background first, ui last)
    for (const layerName of LAYER_NAMES) {
      const container = new Container();
      container.label = `layer-${layerName}`;
      this.worldContainer.addChild(container);
      this.layers.set(layerName, container);
    }

    this.initialized = true;
    console.log('[PixiRenderer] fully initialized with layers');
  }

  /**
   * Wraps PixiJS Application.init() with a timeout.
   * If init doesn't resolve within INIT_TIMEOUT_MS, rejects with an error.
   *
   * PixiJS v8 API notes:
   * - Uses `canvas` (not `view`) for the canvas element
   * - Uses `preference: 'webgl'` instead of `preferWebGLVersion`
   * - `autoDensity` and `resolution` control HiDPI
   */
  private initWithTimeout(
    canvas: HTMLCanvasElement,
    width: number,
    height: number
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let settled = false;
      const timeoutId = setTimeout(() => {
        if (!settled) {
          settled = true;
          console.error('[PixiRenderer] TIMEOUT — init did not resolve within', INIT_TIMEOUT_MS, 'ms');
          reject(
            new Error(
              `[PixiRenderer] Initialization timed out after ${INIT_TIMEOUT_MS}ms. ` +
                'WebGL context creation may have failed. ' +
                'Check that your browser supports WebGL and no other tab is using too many GPU resources.'
            )
          );
        }
      }, INIT_TIMEOUT_MS);

      console.log('[PixiRenderer] calling app.init() with PixiJS v8 options...');

      this.app
        .init({
          canvas,
          width,
          height,
          backgroundColor: 0xd4a574, // match terrain sand color so no dark borders show
          antialias: true,
          resolution: window.devicePixelRatio || 1,
          autoDensity: true,
          preference: 'webgl',
          // Skip dynamic import of environment extensions — we statically import
          // 'pixi.js/browser' above to avoid Vite bundler issues with PixiJS's
          // internal dynamic imports that can cause the init promise to hang.
          manageImports: false,
        })
        .then(() => {
          if (!settled) {
            settled = true;
            clearTimeout(timeoutId);
            console.log('[PixiRenderer] app.init() resolved OK');
            resolve();
          }
        })
        .catch((err: unknown) => {
          if (!settled) {
            settled = true;
            clearTimeout(timeoutId);
            console.error('[PixiRenderer] app.init() rejected:', err);
            reject(
              new Error(
                `[PixiRenderer] Failed to initialize: ${err instanceof Error ? err.message : String(err)}`
              )
            );
          }
        });
    });
  }

  /** Get a specific layer container to add display objects to */
  getLayer(name: LayerName): Container {
    const layer = this.layers.get(name);
    if (!layer) {
      throw new Error(`[PixiRenderer] Layer "${name}" not found. Is the renderer initialized?`);
    }
    return layer;
  }

  /** Get the world container (for camera manipulation) */
  getWorldContainer(): Container {
    return this.worldContainer;
  }

  /** Get the PixiJS Application instance */
  getApp(): Application {
    return this.app;
  }

  /** Get canvas width */
  getWidth(): number {
    return this._width;
  }

  /** Get canvas height */
  getHeight(): number {
    return this._height;
  }

  /** Handle window/container resize */
  resize(width: number, height: number): void {
    if (!this.initialized) {
      return;
    }

    this._width = width;
    this._height = height;
    this.app.renderer.resize(width, height);
  }

  /** Clear all display objects from a specific layer */
  clearLayer(name: LayerName): void {
    const layer = this.layers.get(name);
    if (layer) {
      layer.removeChildren();
    }
  }

  /** Clear all layers */
  clearAllLayers(): void {
    for (const layerName of LAYER_NAMES) {
      this.clearLayer(layerName);
    }
  }

  /** Render one frame (called by Engine) */
  render(): void {
    if (!this.initialized) {
      return;
    }
    this.app.render();
  }

  /** Destroy the renderer and clean up */
  destroy(): void {
    if (!this.initialized) {
      return;
    }

    this.initialized = false;

    // Clear all layers
    this.clearAllLayers();
    this.layers.clear();

    // Destroy the PixiJS application and all children
    this.app.destroy(true, { children: true });
  }

  /** Check if initialized */
  isInitialized(): boolean {
    return this.initialized;
  }
}
