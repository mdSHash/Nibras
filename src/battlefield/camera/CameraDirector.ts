/**
 * CameraDirector — cinematic camera that responds to combat events.
 *
 * The scenario's `cameraScript` defines authored keyframes (e.g. "pan to
 * the trench at 3 s, zoom on the duel at 8 s"). Between those keyframes,
 * the camera previously held its last position — so a 50-second battle
 * had only 5–10 cinematic moments and a lot of static viewing.
 *
 * The director fills the gaps by listening to the EventBus and reacting
 * to combat moments:
 *   - `combat:engagement_started` → smooth pan-zoom to the midpoint of
 *     the two engaged units, hold for ~2 s
 *   - `combat:unit_destroyed` → snap zoom to the destroyed unit for ~1.5 s
 *   - `combat:unit_routed` → pan to the routed unit (looser zoom)
 *
 * Two rules keep the director from fighting the authored cinematics:
 *   1. While `CameraController` reports an active scripted tween it stays
 *      passive (`yieldUntil` blocks autonomous moves).
 *   2. A cooldown after each director move prevents rapid camera whiplash
 *      when many units engage in the same second.
 *
 * After a director move, the camera is NOT auto-restored — the next
 * scripted keyframe or a manual `fitToScenario` call returns to overview.
 */

import type { CameraController } from './CameraController';
import type { EventBus } from '../core/EventBus';
import type { EntityManager } from '../entities';
import type { Subscription } from '../types/events';

export interface CameraDirectorOptions {
  /** Minimum seconds between consecutive director-driven moves. */
  cooldown?: number;
  /** Zoom factor relative to the base "fit" zoom for combat focus. */
  combatZoom?: number;
  /** Zoom factor for unit-destroyed dramatic moments. */
  killZoom?: number;
  /** Duration of the autonomous pan/zoom transitions. */
  transitionDuration?: number;
  /** How long after a scripted tween starts the director stays passive. */
  scriptedYieldDuration?: number;
}

export class CameraDirector {
  private camera: CameraController;
  private eventBus: EventBus;
  private entityManager: EntityManager;
  private subscriptions: Subscription[] = [];

  private lastMoveAt = -Infinity;
  private yieldUntil = -Infinity;
  private now = 0; // sim seconds, fed by tick()

  private readonly cooldown: number;
  private readonly combatZoom: number;
  private readonly killZoom: number;
  private readonly transitionDuration: number;
  private readonly scriptedYieldDuration: number;

  constructor(
    camera: CameraController,
    eventBus: EventBus,
    entityManager: EntityManager,
    opts: CameraDirectorOptions = {},
  ) {
    this.camera = camera;
    this.eventBus = eventBus;
    this.entityManager = entityManager;

    this.cooldown = opts.cooldown ?? 1.4;
    this.combatZoom = opts.combatZoom ?? 1.6;
    this.killZoom = opts.killZoom ?? 2.0;
    this.transitionDuration = opts.transitionDuration ?? 0.9;
    this.scriptedYieldDuration = opts.scriptedYieldDuration ?? 1.5;

    this.subscribe();
  }

  /** Called from the engine each tick so the director knows the sim time
   *  without having to reach into the Clock. */
  tick(simTime: number): void {
    this.now = simTime;
  }

  destroy(): void {
    for (const s of this.subscriptions) s.unsubscribe();
    this.subscriptions = [];
  }

  private subscribe(): void {
    this.subscriptions.push(
      this.eventBus.on('camera:transition_started', () => {
        // A scripted CameraController.moveTo / panTo / zoomTo is now active.
        // Stay passive until it completes (plus a small grace period so we
        // don't immediately override the moment it ends).
        this.yieldUntil = this.now + this.scriptedYieldDuration;
      }),
      this.eventBus.on('combat:engagement_started', (e) => {
        this.focusOnEngagement(e.payload.attackerId, e.payload.defenderId);
      }),
      this.eventBus.on('combat:unit_destroyed', (e) => {
        this.focusOnUnit(e.payload.entityId, this.killZoom, true);
      }),
      this.eventBus.on('combat:unit_routed', (e) => {
        this.focusOnUnit(e.payload.entityId, this.combatZoom * 0.85, false);
      }),
    );
  }

  /** True if the director is allowed to move the camera right now. */
  private canMove(force: boolean): boolean {
    if (this.now < this.yieldUntil) return false;
    if (!force && this.now - this.lastMoveAt < this.cooldown) return false;
    return true;
  }

  /** Pan-zoom to the midpoint of an engagement. Treated as a normal move
   *  (subject to cooldown). */
  private focusOnEngagement(attackerId: string, defenderId: string): void {
    if (!this.canMove(false)) return;
    const a = this.entityManager.get(attackerId)?.components.transform;
    const d = this.entityManager.get(defenderId)?.components.transform;
    if (!a || !d) return;

    const cx = (a.position.x + d.position.x) / 2;
    const cy = (a.position.y + d.position.y) / 2;

    const targetZoom = this.camera.getZoom() * this.combatZoom;
    this.camera.moveTo(cx, cy, this.clampZoom(targetZoom), this.transitionDuration, 'power2.inOut');
    this.lastMoveAt = this.now;
  }

  /** Snap to a single unit. `force=true` bypasses the cooldown for high-
   *  impact moments (a unit dying). */
  private focusOnUnit(entityId: string, zoomFactor: number, force: boolean): void {
    if (!this.canMove(force)) return;
    const t = this.entityManager.get(entityId)?.components.transform;
    if (!t) return;

    const targetZoom = this.camera.getZoom() * zoomFactor;
    this.camera.moveTo(
      t.position.x,
      t.position.y,
      this.clampZoom(targetZoom),
      this.transitionDuration * 0.75,
      'power3.out',
    );
    this.lastMoveAt = this.now;
  }

  /** Keep autonomous zooms within reasonable bounds — the camera has its
   *  own min/max but the director shouldn't get anywhere near them. */
  private clampZoom(z: number): number {
    return Math.max(0.5, Math.min(2.6, z));
  }
}
