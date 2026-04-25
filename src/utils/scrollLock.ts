/**
 * Scroll Lock Utility
 *
 * Manages body scroll locking for modals and overlays.
 * Prevents background scrolling while maintaining scroll position.
 * Handles iOS momentum scrolling and safe area insets.
 */

import { useEffect, createElement, ComponentType } from 'react';

interface ScrollLockState {
  isLocked: boolean;
  scrollY: number;
  scrollbarWidth: number;
  originalStyles: {
    overflow: string;
    position: string;
    top: string;
    width: string;
    paddingRight: string;
  };
}

class ScrollLockManager {
  private state: ScrollLockState = {
    isLocked: false,
    scrollY: 0,
    scrollbarWidth: 0,
    originalStyles: {
      overflow: '',
      position: '',
      top: '',
      width: '',
      paddingRight: '',
    },
  };

  private lockCount = 0;

  /**
   * Calculate scrollbar width to prevent layout shift
   */
  private getScrollbarWidth(): number {
    if (typeof window === 'undefined') return 0;

    // Create temporary element to measure scrollbar
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    outer.style.width = '100px';
    outer.style.position = 'absolute';
    outer.style.top = '-9999px';
    document.body.appendChild(outer);

    const inner = document.createElement('div');
    inner.style.width = '100%';
    outer.appendChild(inner);

    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    document.body.removeChild(outer);

    return scrollbarWidth;
  }

  /**
   * Lock body scroll
   */
  lock(): void {
    if (typeof window === 'undefined') return;

    this.lockCount++;

    // Already locked, just increment counter
    if (this.state.isLocked) return;

    // Store current scroll position
    this.state.scrollY = window.scrollY || window.pageYOffset;
    this.state.scrollbarWidth = this.getScrollbarWidth();

    // Store original styles
    const body = document.body;
    this.state.originalStyles = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      paddingRight: body.style.paddingRight,
    };

    // Apply lock styles
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${this.state.scrollY}px`;
    body.style.width = '100%';

    // Compensate for scrollbar width to prevent layout shift
    if (this.state.scrollbarWidth > 0) {
      body.style.paddingRight = `${this.state.scrollbarWidth}px`;
    }

    // Also lock html element for iOS
    const html = document.documentElement;
    html.style.overflow = 'hidden';

    this.state.isLocked = true;
  }

  /**
   * Unlock body scroll
   */
  unlock(): void {
    if (typeof window === 'undefined') return;

    this.lockCount = Math.max(0, this.lockCount - 1);

    // Still have active locks
    if (this.lockCount > 0) return;

    if (!this.state.isLocked) return;

    // Restore original styles
    const body = document.body;
    body.style.overflow = this.state.originalStyles.overflow;
    body.style.position = this.state.originalStyles.position;
    body.style.top = this.state.originalStyles.top;
    body.style.width = this.state.originalStyles.width;
    body.style.paddingRight = this.state.originalStyles.paddingRight;

    // Restore html element
    const html = document.documentElement;
    html.style.overflow = '';

    // Restore scroll position
    window.scrollTo(0, this.state.scrollY);

    this.state.isLocked = false;
    this.state.scrollY = 0;
  }

  /**
   * Force unlock (emergency use only)
   */
  forceUnlock(): void {
    this.lockCount = 0;
    this.unlock();
  }

  /**
   * Check if scroll is currently locked
   */
  isLocked(): boolean {
    return this.state.isLocked;
  }

  /**
   * Get current lock count
   */
  getLockCount(): number {
    return this.lockCount;
  }
}

// Singleton instance
const scrollLockManager = new ScrollLockManager();

/**
 * Lock body scroll (can be called multiple times)
 */
export const lockScroll = (): void => {
  scrollLockManager.lock();
};

/**
 * Unlock body scroll (must be called same number of times as lock)
 */
export const unlockScroll = (): void => {
  scrollLockManager.unlock();
};

/**
 * Force unlock all scroll locks
 */
export const forceUnlockScroll = (): void => {
  scrollLockManager.forceUnlock();
};

/**
 * Check if scroll is locked
 */
export const isScrollLocked = (): boolean => {
  return scrollLockManager.isLocked();
};

/**
 * React hook for scroll locking
 */
export const useScrollLock = (enabled: boolean): void => {
  useEffect(() => {
    if (enabled) {
      lockScroll();
      return () => unlockScroll();
    }
  }, [enabled]);
};

/**
 * Higher-order function to wrap a component with scroll lock
 */
export const withScrollLock = <T extends object>(
  Component: ComponentType<T>
): ComponentType<T> => {
  return (props: T) => {
    useEffect(() => {
      lockScroll();
      return () => unlockScroll();
    }, []);

    return createElement(Component, props);
  };
};

export default scrollLockManager;

