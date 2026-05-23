/**
 * ScriptInterpreter - executes battle phase actions at scheduled times.
 *
 * The battle is divided into phases (from BattleScenario.phases).
 * Each phase has a startTime, duration, and list of actions.
 * Actions have optional delays (relative to phase start).
 *
 * The interpreter is called each simulation tick with the current time.
 * It checks which phases are active and which actions should fire.
 * Actions are one-shot (fire once when their time arrives).
 */

import type { BattlePhaseConfig, PhaseAction, NarrationPoint, CameraKeyframe } from '../types/scenario';
import type { FormationType, Vector2D, BehaviorState } from '../types/components';
import type { EntityTemplate } from '../types/entities';
import { EntityManager } from '../entities';
import { EventBus } from '../core/EventBus';
import { CameraController } from '../camera/CameraController';
import { useUIStore } from '../state/uiStore';
import { usePlaybackStore } from '../state/playbackStore';

export class ScriptInterpreter {
  private phases: BattlePhaseConfig[];
  private narrationPoints: NarrationPoint[];
  private cameraKeyframes: CameraKeyframe[];
  private entityManager: EntityManager;
  private eventBus: EventBus;
  private camera: CameraController | null;

  // Tracking which actions have been executed (by phase index + action index)
  private executedActions: Set<string>; // "phaseIdx:actionIdx"
  private executedNarrations: Set<string>; // narration IDs
  private activeNarrations: Set<string>; // currently displayed narration IDs
  private executedCameraKeyframes: Set<number>; // keyframe indices
  private currentPhaseIndex: number;
  private lastTime: number;

  constructor(
    entityManager: EntityManager,
    eventBus: EventBus,
    camera: CameraController | null
  ) {
    this.entityManager = entityManager;
    this.eventBus = eventBus;
    this.camera = camera;

    this.phases = [];
    this.narrationPoints = [];
    this.cameraKeyframes = [];

    this.executedActions = new Set();
    this.executedNarrations = new Set();
    this.activeNarrations = new Set();
    this.executedCameraKeyframes = new Set();
    this.currentPhaseIndex = -1;
    this.lastTime = 0;
  }

  /** Load scenario script data */
  load(
    phases: BattlePhaseConfig[],
    narration: NarrationPoint[],
    cameraKeyframes: CameraKeyframe[]
  ): void {
    this.phases = [...phases];
    // Sort narration by time
    this.narrationPoints = [...narration].sort((a, b) => a.time - b.time);
    // Sort camera keyframes by time
    this.cameraKeyframes = [...cameraKeyframes].sort((a, b) => a.time - b.time);

    // Reset execution tracking
    this.reset();
  }

  /** Called each simulation tick - checks and executes due actions */
  update(currentTimeSeconds: number): void {
    if (this.phases.length === 0) {
      return;
    }

    // Check for phase transitions and execute actions
    for (let phaseIdx = 0; phaseIdx < this.phases.length; phaseIdx++) {
      const phase = this.phases[phaseIdx];
      const phaseStart = phase.startTime;
      const phaseEnd = phase.startTime + phase.duration;

      // Check if phase is currently active
      const isActive = currentTimeSeconds >= phaseStart && currentTimeSeconds < phaseEnd;

      if (isActive) {
        // Phase just became active (different from current)
        if (this.currentPhaseIndex !== phaseIdx) {
          this.currentPhaseIndex = phaseIdx;

          this.eventBus.emit({
            type: 'phase:started',
            payload: { phaseId: phase.id, phaseName: phase.nameAr || phase.name },
          });

          usePlaybackStore.getState().setCurrentPhase(phase.id, phase.nameAr || phase.name);
        }

        // Check each action in this phase
        for (let actionIdx = 0; actionIdx < phase.actions.length; actionIdx++) {
          const action = phase.actions[actionIdx];
          const actionKey = `${phaseIdx}:${actionIdx}`;

          // Skip already executed actions
          if (this.executedActions.has(actionKey)) {
            continue;
          }

          // Check if action is due
          const actionTime = phaseStart + (action.delay || 0);
          if (currentTimeSeconds >= actionTime) {
            this.executeAction(action, phase.id);
            this.executedActions.add(actionKey);

            this.eventBus.emit({
              type: 'phase:action_executed',
              payload: { phaseId: phase.id, actionIndex: actionIdx },
            });
          }
        }
      }

      // Check if phase just ended (was active last tick, now past end)
      if (this.lastTime < phaseEnd && currentTimeSeconds >= phaseEnd) {
        this.eventBus.emit({
          type: 'phase:completed',
          payload: { phaseId: phase.id },
        });
      }
    }

    // Check narration points
    this.checkNarration(currentTimeSeconds);

    // Check camera keyframes
    this.checkCameraKeyframes(currentTimeSeconds);

    this.lastTime = currentTimeSeconds;
  }

  /** Execute a single phase action */
  private executeAction(action: PhaseAction, phaseId: string): void {
    switch (action.type) {
      case 'move_unit':
        this.handleMoveUnit(action.params, action.targetUnitId);
        break;
      case 'attack_unit':
        this.handleAttackUnit(action.params, action.targetUnitId);
        break;
      case 'change_formation':
        this.handleChangeFormation(action.params, action.targetUnitId);
        break;
      case 'set_behavior':
        this.handleSetBehavior(action.params, action.targetUnitId);
        break;
      case 'spawn_unit':
        this.handleSpawnUnit(action.params);
        break;
      case 'destroy_unit':
        this.handleDestroyUnit(action.params, action.targetUnitId);
        break;
      case 'camera_move':
        this.handleCameraMove(action.params);
        break;
      case 'play_effect':
        this.handlePlayEffect(action.params);
        break;
      default:
        // Unknown action type — ignore silently
        break;
    }
    // Suppress unused variable warning
    void phaseId;
  }

  /** Handle move_unit action */
  private handleMoveUnit(params: Record<string, unknown>, targetUnitId?: string): void {
    if (!targetUnitId) return;

    const entity = this.entityManager.get(targetUnitId);
    if (!entity || !entity.components.movement) return;

    const movement = entity.components.movement;

    // Set target position
    if (params.position) {
      const pos = params.position as Vector2D;
      movement.targetPosition = { x: pos.x, y: pos.y };
      movement.arrived = false;
    }

    // Override speed if specified
    if (params.speed !== undefined) {
      movement.currentSpeed = params.speed as number;
    }

    // Set path if provided
    if (params.path) {
      movement.path = params.path as Vector2D[];
    }
  }

  /** Handle attack_unit action */
  private handleAttackUnit(params: Record<string, unknown>, targetUnitId?: string): void {
    if (!targetUnitId) return;

    const entity = this.entityManager.get(targetUnitId);
    if (!entity || !entity.components.combat) return;

    const combat = entity.components.combat;
    const defenderId = params.targetId as string;

    combat.targetEntityId = defenderId;
    combat.isEngaged = true;

    this.eventBus.emit({
      type: 'combat:engagement_started',
      payload: { attackerId: targetUnitId, defenderId },
    });
  }

  /** Handle change_formation action */
  private handleChangeFormation(params: Record<string, unknown>, targetUnitId?: string): void {
    if (!targetUnitId) return;

    const entity = this.entityManager.get(targetUnitId);
    if (!entity || !entity.components.formation) return;

    const newFormation = params.formation as FormationType;
    entity.components.formation.type = newFormation;

    this.eventBus.emit({
      type: 'movement:formation_changed',
      payload: { entityId: targetUnitId, formation: newFormation },
    });
  }

  /** Handle set_behavior action */
  private handleSetBehavior(params: Record<string, unknown>, targetUnitId?: string): void {
    if (!targetUnitId) return;

    const entity = this.entityManager.get(targetUnitId);
    if (!entity || !entity.components.behavior) return;

    entity.components.behavior.currentState = params.behavior as BehaviorState;

    this.eventBus.emit({
      type: 'movement:behavior_changed',
      payload: {
        entityId: targetUnitId,
        behavior: params.behavior as BehaviorState,
      },
    });
  }

  /** Handle spawn_unit action */
  private handleSpawnUnit(params: Record<string, unknown>): void {
    const template: EntityTemplate = {
      name: (params.name as string) || 'Spawned Unit',
      tags: (params.tags as string[]) || ['unit'],
      components: (params.components as EntityTemplate['components']) || {},
    };

    const id = params.id as string | undefined;
    if (id) {
      this.entityManager.createWithId(id, template);
    } else {
      this.entityManager.create(template);
    }
  }

  /** Handle destroy_unit action */
  private handleDestroyUnit(params: Record<string, unknown>, targetUnitId?: string): void {
    const entityId = targetUnitId || (params.entityId as string);
    if (!entityId) return;

    this.entityManager.destroy(entityId);
  }

  /** Handle camera_move action */
  private handleCameraMove(params: Record<string, unknown>): void {
    if (!this.camera) return;

    const position = params.position as Vector2D | undefined;
    const zoom = params.zoom as number | undefined;
    const duration = (params.duration as number) ?? 1.0;
    const easing = (params.easing as string) ?? 'power2.inOut';

    if (position && zoom !== undefined) {
      this.camera.moveTo(position.x, position.y, zoom, duration, easing);
    } else if (position) {
      this.camera.panTo(position.x, position.y, duration, easing);
    } else if (zoom !== undefined) {
      this.camera.zoomTo(zoom, duration, easing);
    }
  }

  /** Handle play_effect action */
  private handlePlayEffect(params: Record<string, unknown>): void {
    // Emit an event for the effect system to pick up
    // The effect system (Phase 4) will handle rendering
    this.eventBus.emit({
      type: 'phase:action_executed',
      payload: {
        phaseId: 'effect',
        actionIndex: 0,
      },
    });

    // Suppress unused variable warning — effect params will be used by effect system
    void params;
  }

  /** Check and display narration points */
  private checkNarration(currentTimeSeconds: number): void {
    for (const narration of this.narrationPoints) {
      const narrationEnd = narration.time + narration.duration;

      // Check if narration should start
      if (
        currentTimeSeconds >= narration.time &&
        currentTimeSeconds < narrationEnd &&
        !this.executedNarrations.has(narration.id)
      ) {
        // Start narration
        this.executedNarrations.add(narration.id);
        this.activeNarrations.add(narration.id);

        useUIStore.getState().setNarration({
          id: narration.id,
          text: narration.text,
          textAr: narration.textAr,
          position: narration.position || 'bottom',
          style: narration.style || 'normal',
        });

        this.eventBus.emit({
          type: 'narration:started',
          payload: { id: narration.id, text: narration.text },
        });
      }

      // Check if narration should end
      if (
        currentTimeSeconds >= narrationEnd &&
        this.activeNarrations.has(narration.id)
      ) {
        this.activeNarrations.delete(narration.id);

        // Only clear narration display if no other narration is active
        if (this.activeNarrations.size === 0) {
          useUIStore.getState().setNarration(null);
        }

        this.eventBus.emit({
          type: 'narration:completed',
          payload: { id: narration.id },
        });
      }
    }
  }

  /** Check and execute camera keyframes */
  private checkCameraKeyframes(currentTimeSeconds: number): void {
    if (!this.camera) return;

    for (let i = 0; i < this.cameraKeyframes.length; i++) {
      const keyframe = this.cameraKeyframes[i];

      if (
        currentTimeSeconds >= keyframe.time &&
        !this.executedCameraKeyframes.has(i)
      ) {
        this.executedCameraKeyframes.add(i);
        this.camera.executeKeyframe(keyframe);
      }
    }
  }

  /** Reset all execution tracking (for seek/restart) */
  reset(): void {
    this.executedActions.clear();
    this.executedNarrations.clear();
    this.activeNarrations.clear();
    this.executedCameraKeyframes.clear();
    this.currentPhaseIndex = -1;
    this.lastTime = 0;
  }

  /** Seek to a specific time - re-execute all actions up to that time */
  seekTo(timeSeconds: number): void {
    // Reset all tracking
    this.reset();

    // Fast-forward: iterate through all phases/actions that should have fired by timeSeconds
    for (let phaseIdx = 0; phaseIdx < this.phases.length; phaseIdx++) {
      const phase = this.phases[phaseIdx];
      const phaseStart = phase.startTime;
      const phaseEnd = phase.startTime + phase.duration;

      // If this phase has started by the seek time
      if (timeSeconds >= phaseStart) {
        // Mark this as the current phase if it's still active
        if (timeSeconds < phaseEnd) {
          this.currentPhaseIndex = phaseIdx;
          usePlaybackStore.getState().setCurrentPhase(phase.id, phase.nameAr || phase.name);
        }

        // Mark all actions that would have fired as executed
        for (let actionIdx = 0; actionIdx < phase.actions.length; actionIdx++) {
          const action = phase.actions[actionIdx];
          const actionTime = phaseStart + (action.delay || 0);

          if (timeSeconds >= actionTime) {
            const actionKey = `${phaseIdx}:${actionIdx}`;
            this.executedActions.add(actionKey);

            // For seek, we execute state-setting actions (formation, behavior, position)
            // but skip transient actions (effects, camera moves)
            if (action.type === 'move_unit') {
              this.handleMoveUnit(action.params, action.targetUnitId);
            } else if (action.type === 'change_formation') {
              this.handleChangeFormation(action.params, action.targetUnitId);
            } else if (action.type === 'set_behavior') {
              this.handleSetBehavior(action.params, action.targetUnitId);
            } else if (action.type === 'attack_unit') {
              this.handleAttackUnit(action.params, action.targetUnitId);
            } else if (action.type === 'spawn_unit') {
              this.handleSpawnUnit(action.params);
            } else if (action.type === 'destroy_unit') {
              this.handleDestroyUnit(action.params, action.targetUnitId);
            }
          }
        }
      }
    }

    // Mark narrations that have already passed as executed
    for (const narration of this.narrationPoints) {
      const narrationEnd = narration.time + narration.duration;

      if (timeSeconds >= narrationEnd) {
        // Narration fully passed
        this.executedNarrations.add(narration.id);
      } else if (timeSeconds >= narration.time) {
        // Narration is currently active
        this.executedNarrations.add(narration.id);
        this.activeNarrations.add(narration.id);

        useUIStore.getState().setNarration({
          id: narration.id,
          text: narration.text,
          textAr: narration.textAr,
          position: narration.position || 'bottom',
          style: narration.style || 'normal',
        });
      }
    }

    // Mark camera keyframes that have already passed as executed
    for (let i = 0; i < this.cameraKeyframes.length; i++) {
      if (timeSeconds >= this.cameraKeyframes[i].time) {
        this.executedCameraKeyframes.add(i);
      }
    }

    // Execute the last camera keyframe before the seek time for correct camera state
    if (this.camera && this.cameraKeyframes.length > 0) {
      let lastKeyframeIdx = -1;
      for (let i = 0; i < this.cameraKeyframes.length; i++) {
        if (timeSeconds >= this.cameraKeyframes[i].time) {
          lastKeyframeIdx = i;
        }
      }
      if (lastKeyframeIdx >= 0) {
        this.camera.executeKeyframe(this.cameraKeyframes[lastKeyframeIdx]);
      }
    }

    this.lastTime = timeSeconds;
  }

  /** Get current active phase info */
  getCurrentPhase(): { id: string; name: string } | null {
    if (this.currentPhaseIndex < 0 || this.currentPhaseIndex >= this.phases.length) {
      return null;
    }

    const phase = this.phases[this.currentPhaseIndex];
    return { id: phase.id, name: phase.name };
  }

  /** Unload all script data */
  unload(): void {
    this.phases = [];
    this.narrationPoints = [];
    this.cameraKeyframes = [];
    this.reset();
  }
}
