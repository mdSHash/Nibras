import { useEffect, useRef } from 'react';

/**
 * Custom hook to trap focus within a container element
 * Useful for modals and dialogs to maintain accessibility
 * 
 * @param isActive - Whether the focus trap should be active
 * @returns ref - Ref to attach to the container element
 */
export const useFocusTrap = (isActive: boolean) => {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!isActive || !ref.current) return;
    
    const container = ref.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    // Focus first element when trap activates
    firstElement?.focus();
    
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };
    
    document.addEventListener('keydown', handleTab);
    
    return () => {
      document.removeEventListener('keydown', handleTab);
    };
  }, [isActive]);
  
  return ref;
};

