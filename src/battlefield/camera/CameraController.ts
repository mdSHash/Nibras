/**
 * CameraController manipulates the world container's position and scale
 * to create camera movement effects.
 *
 * Camera works by inverse-transforming the world container:
 * - To "move camera right", move world container LEFT
 * - To "zoom in", scale world container UP
 *
 * Uses GSAP for smooth animated transitions between positions.
 */

import { Container } from 'pixi.js';
import gsap from 'gsap';
import { EventBus } from '../core/EventBus';
import type { Vector2D } from '../types/components';
import type { CameraKeyframe } from '../types/scenario';
import { useCameraStore } from '../state/cameraStore';

export interface CameraOptions {
  minZoom?: number; // default 0.3
  maxZoom?: number; // default 3.0
  initialPosition?: Vector2D; // default { x: 0, y: 0 }
  initialZoom?: number; // default 1.0
  followSmoothing?: number; // default 0.05
}

export class CameraController {
  private worldContainer: Container;
  private eventBus: EventBus;

  // Camera state
  private position: Vector2D;
  private zoom: number;
  private minZoom: number;
  private maxZoom: number;

  // Viewport dimensions
  private viewportWidth: number;
  private viewportHeight: number;

  // Follow target
  private followTarget: { x: number; y: number } | null;
  private followSmoothing: number;

  // Active GSAP tween
  private activeTween: gsap.core.Tween | null;

  constructor(worldContainer: Container, eventBus: EventBus, options?: CameraOptions) {
    this.worldContainer = worldContainer;
    this.eventBus = eventBus;

    this.position = options?.initialPosition
      ? { ...options.initialPosition }
      : { x: 0, y: 0 };
    this.zoom = options?.initialZoom ?? 1.0;
    this.minZoom = options?.minZoom ?? 0.3;
    this.maxZoom = options?.maxZoom ?? 3.0;

    this.viewportWidth = 0;
    this.viewportHeight = 0;

    this.followTarget = null;
    this.followSmoothing = options?.followSmoothing ?? 0.05;

    this.activeTween = null;

    // Apply initial transform
    this.applyTransform();
    this.syncStore();
  }

  /** Set viewport dimensions (call on resize) */
  setViewport(width: number, height: number): void {
    this.viewportWidth = width;
    this.viewportHeight = height;
    this.applyTransform();
  }

  /** Immediately set camera position (no animation) */
  setPosition(x: number, y: number): void {
    this.stop();
    this.position.x = x;
    this.position.y = y;
    this.applyTransform();
    this.syncStore();
    this.eventBus.emit({
      type: 'camera:moved',
      payload: { position: { ...this.position }, zoom: this.zoom },
    });
  }

  /** Immediately set zoom level (no animation) */
  setZoom(zoom: number): void {
    this.stop();
    this.zoom = this.clampZoom(zoom);
    this.applyTransform();
    this.syncStore();
    this.eventBus.emit({
      type: 'camera:moved',
      payload: { position: { ...this.position }, zoom: this.zoom },
    });
  }

  /** Animate camera to a position */
  panTo(x: number, y: number, duration: number = 1.0, easing: string = 'power2.inOut'): void {
    this.stop();

    this.eventBus.emit({
      type: 'camera:transition_started',
      payload: { type: 'pan', duration },
    });
    this.syncStoreTransitioning(true);

    this.activeTween = gsap.to(this.position, {
      x,
      y,
      duration,
      ease: easing,
      onUpdate: () => {
        this.applyTransform();
        this.syncStore();
      },
      onComplete: () => {
        this.activeTween = null;
        this.syncStoreTransitioning(false);
        this.eventBus.emit({ type: 'camera:transition_completed' });
        this.eventBus.emit({
          type: 'camera:moved',
          payload: { position: { ...this.position }, zoom: this.zoom },
        });
      },
    });
  }

  /** Animate zoom to a level */
  zoomTo(zoom: number, duration: number = 0.5, easing: string = 'power2.inOut'): void {
    this.stop();
    const targetZoom = this.clampZoom(zoom);

    this.eventBus.emit({
      type: 'camera:transition_started',
      payload: { type: 'zoom', duration },
    });
    this.syncStoreTransitioning(true);

    // Use a proxy object for zoom since GSAP needs a property to tween
    const proxy = { zoom: this.zoom };
    this.activeTween = gsap.to(proxy, {
      zoom: targetZoom,
      duration,
      ease: easing,
      onUpdate: () => {
        this.zoom = proxy.zoom;
        this.applyTransform();
        this.syncStore();
      },
      onComplete: () => {
        this.activeTween = null;
        this.syncStoreTransitioning(false);
        this.eventBus.emit({ type: 'camera:transition_completed' });
        this.eventBus.emit({
          type: 'camera:moved',
          payload: { position: { ...this.position }, zoom: this.zoom },
        });
      },
    });
  }

  /** Combined pan + zoom animation */
  moveTo(
    x: number,
    y: number,
    zoom: number,
    duration: number = 1.0,
    easing: string = 'power2.inOut'
  ): void {
    this.stop();
    const targetZoom = this.clampZoom(zoom);

    this.eventBus.emit({
      type: 'camera:transition_started',
      payload: { type: 'move', duration },
    });
    this.syncStoreTransitioning(true);

    // Use a proxy object that holds both position and zoom
    const proxy = { x: this.position.x, y: this.position.y, zoom: this.zoom };
    this.activeTween = gsap.to(proxy, {
      x,
      y,
      zoom: targetZoom,
      duration,
      ease: easing,
      onUpdate: () => {
        this.position.x = proxy.x;
        this.position.y = proxy.y;
        this.zoom = proxy.zoom;
        this.applyTransform();
        this.syncStore();
      },
      onComplete: () => {
        this.activeTween = null;
        this.syncStoreTransitioning(false);
        this.eventBus.emit({ type: 'camera:transition_completed' });
        this.eventBus.emit({
          type: 'camera:moved',
          payload: { position: { ...this.position }, zoom: this.zoom },
        });
      },
    });
  }

  /** Follow a moving target (call each frame with target position) */
  setFollowTarget(target: { x: number; y: number } | null, smoothing?: number): void {
    this.followTarget = target;
    if (smoothing !== undefined) {
      this.followSmoothing = smoothing;
    }
    if (target) {
      this.stop(); // Stop any active animation when following
    }
  }

  /** Update follow camera (call each frame) */
  update(_dt: number): void {
    if (!this.followTarget) {
      return;
    }

    // Lerp position toward target
    const dx = this.followTarget.x - this.position.x;
    const dy = this.followTarget.y - this.position.y;

    // Only update if there's meaningful distance
    if (Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01) {
      this.position.x += dx * this.followSmoothing;
      this.position.y += dy * this.followSmoothing;
      this.applyTransform();
      this.syncStore();
    }
  }

  /** Execute a camera keyframe from scenario script */
  executeKeyframe(keyframe: CameraKeyframe): void {
    const { type, position, zoom, duration, easing, followEntityId } = keyframe;
    const ease = easing ?? 'power2.inOut';

    switch (type) {
      case 'pan':
        this.panTo(position.x, position.y, duration, ease);
        break;

      case 'zoom':
        this.zoomTo(zoom, duration, ease);
        break;

      case 'follow':
        // For follow, we set the target — the entity system will update the target position
        // We also move to the initial position
        if (followEntityId) {
          useCameraStore.getState().setFollowing(followEntityId);
        }
        this.moveTo(position.x, position.y, zoom, duration, ease);
        break;

      case 'overview':
        this.moveTo(position.x, position.y, zoom, duration, ease);
        break;

      case 'focus':
        this.focusOn(position.x, position.y, zoom, duration);
        break;
    }
  }

  /** Show overview of entire battlefield */
  showOverview(worldWidth: number, worldHeight: number, duration: number = 1.5): void {
    // Calculate zoom to fit the entire world in the viewport
    const zoomX = this.viewportWidth / worldWidth;
    const zoomY = this.viewportHeight / worldHeight;
    const targetZoom = this.clampZoom(Math.min(zoomX, zoomY) * 0.9); // 90% to add padding

    // Center on the world
    const centerX = worldWidth / 2;
    const centerY = worldHeight / 2;

    this.moveTo(centerX, centerY, targetZoom, duration, 'power2.inOut');
  }

  /** Focus on a specific world position with appropriate zoom */
  focusOn(x: number, y: number, zoom: number = 1.5, duration: number = 1.0): void {
    this.moveTo(x, y, zoom, duration, 'power2.out');
  }

  /** Stop any active camera animation */
  stop(): void {
    if (this.activeTween) {
      this.activeTween.kill();
      this.activeTween = null;
      this.syncStoreTransitioning(false);
    }
  }

  /** Get current camera position */
  getPosition(): Vector2D {
    return { ...this.position };
  }

  /** Get current zoom */
  getZoom(): number {
    return this.zoom;
  }

  /** Check if camera is currently animating */
  isAnimating(): boolean {
    return this.activeTween !== null && this.activeTween.isActive();
  }

  /** Convert screen coordinates to world coordinates */
  screenToWorld(screenX: number, screenY: number): Vector2D {
    return {
      x: (screenX - this.viewportWidth / 2) / this.zoom + this.position.x,
      y: (screenY - this.viewportHeight / 2) / this.zoom + this.position.y,
    };
  }

  /** Convert world coordinates to screen coordinates */
  worldToScreen(worldX: number, worldY: number): Vector2D {
    return {
      x: (worldX - this.position.x) * this.zoom + this.viewportWidth / 2,
      y: (worldY - this.position.y) * this.zoom + this.viewportHeight / 2,
    };
  }

  /** Destroy and clean up GSAP tweens */
  destroy(): void {
    this.stop();
    this.followTarget = null;
  }

  /** Apply current camera state to the world container transform */
  private applyTransform(): void {
    // Camera works by inverse-transforming the world:
    // worldContainer.position = viewport_center - camera_position * zoom
    this.worldContainer.position.x = this.viewportWidth / 2 - this.position.x * this.zoom;
    this.worldContainer.position.y = this.viewportHeight / 2 - this.position.y * this.zoom;
    this.worldContainer.scale.set(this.zoom);
  }

  /** Clamp zoom between min and max */
  private clampZoom(zoom: number): number {
    return Math.max(this.minZoom, Math.min(this.maxZoom, zoom));
  }

  /** Sync camera state to the Zustand store for React overlays */
  private syncStore(): void {
    const store = useCameraStore.getState();
    store.setPosition(this.position.x, this.position.y);
    store.setZoom(this.zoom);
  }

  /** Sync transitioning state to the Zustand store */
  private syncStoreTransitioning(transitioning: boolean): void {
    useCameraStore.getState().setTransitioning(transitioning);
  }
}
