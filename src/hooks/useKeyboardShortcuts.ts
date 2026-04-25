import { useEffect } from 'react';

/**
 * Custom hook to handle keyboard shortcuts
 * 
 * @param handlers - Object mapping keyboard shortcuts to handler functions
 * @example
 * useKeyboardShortcuts({
 *   'escape': () => closeModal(),
 *   'ctrl+k': () => openSearch(),
 *   'arrowleft': () => navigatePrevious(),
 *   'arrowright': () => navigateNext(),
 * });
 */
export const useKeyboardShortcuts = (
  handlers: Record<string, () => void>
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const ctrl = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;
      const alt = e.altKey;
      
      // Build shortcut string
      let shortcut = '';
      if (ctrl) shortcut += 'ctrl+';
      if (shift) shortcut += 'shift+';
      if (alt) shortcut += 'alt+';
      shortcut += key;
      
      // Check if handler exists for this shortcut
      if (handlers[shortcut]) {
        e.preventDefault();
        handlers[shortcut]();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlers]);
};

