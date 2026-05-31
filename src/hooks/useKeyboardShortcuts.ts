import { useEffect, useRef } from 'react';

interface ShortcutOptions {
  /**
   * Predicate that gates non-Escape shortcuts. Return false to suppress —
   * useful when a modal/menu is open and arrow keys should not navigate
   * the underlying timeline.
   *
   * Escape always fires (so users can dismiss the active surface).
   */
  isShortcutEnabled?: (shortcut: string) => boolean;
}

/**
 * Custom hook to handle keyboard shortcuts.
 * Skips when typing in INPUT/TEXTAREA/contentEditable, when focus is inside
 * a [role="dialog"] (so modal-internal keys aren't hijacked), and respects
 * the optional isShortcutEnabled predicate.
 */
export const useKeyboardShortcuts = (
  handlers: Record<string, () => void>,
  options: ShortcutOptions = {}
) => {
  // Store handlers and predicate in refs so the effect doesn't re-register
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;
  const enabledRef = useRef(options.isShortcutEnabled);
  enabledRef.current = options.isShortcutEnabled;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Don't fire when typing
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      const key = e.key.toLowerCase();
      const ctrl = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;
      const alt = e.altKey;

      let shortcut = '';
      if (ctrl) shortcut += 'ctrl+';
      if (shift) shortcut += 'shift+';
      if (alt) shortcut += 'alt+';
      shortcut += key;

      // Skip if focus is inside a dialog (modal manages its own keys)
      if (shortcut !== 'escape' && target.closest('[role="dialog"]')) {
        return;
      }

      // Allow caller to gate (e.g. suppress arrow keys when modal open)
      const gate = enabledRef.current;
      if (gate && shortcut !== 'escape' && !gate(shortcut)) {
        return;
      }

      if (handlersRef.current[shortcut]) {
        e.preventDefault();
        handlersRef.current[shortcut]();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
};
