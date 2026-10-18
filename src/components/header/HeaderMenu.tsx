import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { EllipsisVertical } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Z_INDEX } from '../../constants';
import { cn } from '../../utils/cn';
import { HeaderButton } from './HeaderButton';

export interface HeaderMenuItem {
  key: string;
  icon: ReactNode;
  /** The row's visible text. */
  label: string;
  /** Accessible name when it differs from the label (it contains the label). */
  ariaLabel?: string;
  onSelect: () => void;
}

interface HeaderMenuProps {
  items: HeaderMenuItem[];
  /** Gold pulse on the ⋮ button: a first-visit hint while help is unopened. */
  pulse?: boolean;
}

/**
 * The ⋮ button of the phone header (below 640 px) and its dropdown: the
 * header's controls that do not fit, one row each with icon and label, in the
 * header's dark glass. Arrow keys move between rows, Escape and Tab close it.
 * The dropdown is portalled to <body> so it sits above the event panel, which
 * on phones can reach the header's height.
 */
export function HeaderMenu({ items, pulse = false }: HeaderMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  // Where the dropdown sits: under the ⋮ button, aligned with its left edge.
  const [anchor, setAnchor] = useState({ top: 0, left: 0 });
  const reducedMotion = useReducedMotion();
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const rows = () => Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);

  const toggle = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) setAnchor({ top: rect.bottom + 10, left: rect.left });
    setIsOpen(open => !open);
  };

  const close = (returnFocus: boolean) => {
    setIsOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  };

  // Opening moves focus to the first row; a press outside or a resize closes the menu.
  useEffect(() => {
    if (!isOpen) return;
    rows()[0]?.focus();
    const onPressOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (!menuRef.current?.contains(target) && !triggerRef.current?.contains(target)) setIsOpen(false);
    };
    const onResize = () => setIsOpen(false);
    // Capture phase: the map and the panel stop some presses from bubbling.
    // mousedown and touchstart, not pointerdown, which some touch setups skip.
    document.addEventListener('mousedown', onPressOutside, true);
    document.addEventListener('touchstart', onPressOutside, true);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('mousedown', onPressOutside, true);
      document.removeEventListener('touchstart', onPressOutside, true);
      window.removeEventListener('resize', onResize);
    };
  }, [isOpen]);

  const onMenuKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const list = rows();
    const index = list.indexOf(document.activeElement as HTMLElement);
    const focusAt = (i: number) => list[(i + list.length) % list.length]?.focus();
    switch (e.key) {
      case 'ArrowDown':
        focusAt(index + 1);
        break;
      case 'ArrowUp':
        focusAt(index - 1);
        break;
      case 'Home':
        focusAt(0);
        break;
      case 'End':
        focusAt(list.length - 1);
        break;
      case 'Escape':
        // Only the menu closes, not the open event (the app's Escape shortcut).
        e.stopPropagation();
        close(true);
        break;
      case 'Tab':
        close(false);
        return;
      default:
        return;
    }
    e.preventDefault();
  };

  return (
    <div className="relative sm:hidden">
      <HeaderButton
        ref={triggerRef}
        delay={0.65}
        pulse={pulse}
        data-tour-id="header-menu"
        onClick={toggle}
        aria-label="المزيد من الخيارات"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
      >
        <EllipsisVertical size={18} strokeWidth={2.5} aria-hidden="true" />
      </HeaderButton>

      {createPortal(
        // Opens with a short fade; closes at once, as menus do.
        isOpen && (
          <motion.div
            ref={menuRef}
            id={menuId}
            role="menu"
            aria-label="المزيد من الخيارات"
            onKeyDown={onMenuKeyDown}
            initial={reducedMotion ? false : { opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className={cn(
              'fixed min-w-[220px] origin-top-left',
              'py-1.5 rounded-2xl',
              'bg-chrome/92 backdrop-blur-[20px] backdrop-saturate-150',
              'border border-[var(--glass-border)]',
              'shadow-[0_8px_30px_rgba(0,0,0,0.4)]',
              'pointer-events-auto',
            )}
            style={{ zIndex: Z_INDEX.headerMenu, top: anchor.top, left: anchor.left }}
            dir="rtl"
          >
            {items.map(item => (
              <button
                key={item.key}
                type="button"
                role="menuitem"
                tabIndex={-1}
                aria-label={item.ariaLabel}
                onClick={() => {
                  close(true);
                  item.onSelect();
                }}
                className={cn(
                  'w-full min-h-12 px-4 flex items-center gap-3',
                  'text-[15px] font-bold text-chrome-ink text-right',
                  // The fixed gold, not `bg-accent`: the accent turns light in dark
                  // mode, under the menu's light text.
                  'hover:bg-gold/16 active:bg-gold/28',
                  'focus-visible:outline-none focus-visible:bg-gold/22',
                  'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold',
                  'transition-colors duration-150',
                )}
              >
                <span className="shrink-0 text-chrome-ink" aria-hidden="true">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            ))}
          </motion.div>
        ),
        document.body,
      )}
    </div>
  );
}
