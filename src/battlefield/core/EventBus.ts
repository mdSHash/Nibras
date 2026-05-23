/**
 * Typed event bus for engine-wide communication.
 *
 * Key features:
 * - Fully typed events using discriminated union from types/events.ts
 * - Subscribe to specific event types
 * - Subscribe to all events (wildcard)
 * - One-time subscriptions
 * - Event history for debugging (optional, limited buffer)
 * - Synchronous dispatch (no async)
 */

import type { EngineEvent, EngineEventType, Subscription } from '../types/events';

export interface EventBusOptions {
  /** Enable event history recording (default: false) */
  historyEnabled?: boolean;
  /** Maximum number of events to keep in history (default: 100) */
  maxHistorySize?: number;
}

export class EventBus {
  private listeners: Map<string, Set<(event: any) => void>>;
  private wildcardListeners: Set<(event: EngineEvent) => void>;
  private history: EngineEvent[];
  private historyEnabled: boolean;
  private maxHistorySize: number;
  private destroyed: boolean = false;

  constructor(options?: EventBusOptions) {
    this.listeners = new Map();
    this.wildcardListeners = new Set();
    this.history = [];
    this.historyEnabled = options?.historyEnabled ?? false;
    this.maxHistorySize = options?.maxHistorySize ?? 100;
  }

  /** Subscribe to a specific event type */
  on<T extends EngineEventType>(
    type: T,
    handler: (event: Extract<EngineEvent, { type: T }>) => void
  ): Subscription {
    if (this.destroyed) {
      return { unsubscribe: () => {} };
    }

    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }

    const handlerSet = this.listeners.get(type)!;
    handlerSet.add(handler);

    return {
      unsubscribe: () => {
        handlerSet.delete(handler);
        // Clean up empty sets
        if (handlerSet.size === 0) {
          this.listeners.delete(type);
        }
      },
    };
  }

  /** Subscribe to a specific event type, auto-unsubscribe after first call */
  once<T extends EngineEventType>(
    type: T,
    handler: (event: Extract<EngineEvent, { type: T }>) => void
  ): Subscription {
    const subscription = this.on(type, (event) => {
      subscription.unsubscribe();
      handler(event);
    });
    return subscription;
  }

  /** Subscribe to ALL events */
  onAny(handler: (event: EngineEvent) => void): Subscription {
    if (this.destroyed) {
      return { unsubscribe: () => {} };
    }

    this.wildcardListeners.add(handler);

    return {
      unsubscribe: () => {
        this.wildcardListeners.delete(handler);
      },
    };
  }

  /** Emit an event to all subscribers */
  emit(event: EngineEvent): void {
    if (this.destroyed) {
      return;
    }

    // Record in history if enabled
    if (this.historyEnabled) {
      this.history.push(event);
      // Circular buffer: remove oldest when full
      if (this.history.length > this.maxHistorySize) {
        this.history.shift();
      }
    }

    // Dispatch to type-specific listeners first
    const typeListeners = this.listeners.get(event.type);
    if (typeListeners) {
      // Iterate over a copy in case handlers modify the set (e.g., once)
      for (const handler of [...typeListeners]) {
        handler(event);
      }
    }

    // Then dispatch to wildcard listeners
    for (const handler of [...this.wildcardListeners]) {
      handler(event);
    }
  }

  /** Remove all listeners for a specific event type */
  off(type: EngineEventType): void {
    this.listeners.delete(type);
  }

  /** Remove ALL listeners */
  clear(): void {
    this.listeners.clear();
    this.wildcardListeners.clear();
  }

  /** Get event history (if enabled) */
  getHistory(): ReadonlyArray<EngineEvent> {
    return this.history;
  }

  /** Clear event history */
  clearHistory(): void {
    this.history = [];
  }

  /** Get count of listeners for a specific event type */
  listenerCount(type: EngineEventType): number {
    const typeListeners = this.listeners.get(type);
    return typeListeners ? typeListeners.size : 0;
  }

  /** Destroy the event bus, removing all listeners and history */
  destroy(): void {
    this.clear();
    this.history = [];
    this.destroyed = true;
  }
}
