import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Z_INDEX } from '../constants';
import { cn } from '../utils/cn';
import { fadeUp } from '../utils/motionVariants';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type,
  onClose,
  duration = 3000
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const config = {
    success: {
      icon: <CheckCircle size={20} className="text-[var(--color-islamic-green)]" />,
    },
    error: {
      icon: <AlertCircle size={20} className="text-battle-red" />,
    },
    info: {
      icon: <Info size={20} className="text-accent" />,
    },
  };

  const { icon } = config[type];

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={cn(
        "px-6 py-4 flex items-center gap-3",
        "bg-[var(--glass-bg)] backdrop-blur-[16px]",
        "border border-[var(--glass-border)]",
        "rounded-[var(--radius-md)]",
        "shadow-[var(--glass-shadow)]",
        "max-w-[90vw] md:max-w-[400px]",
        "font-bold text-ink"
      )}
      dir="rtl"
      role="alert"
      aria-live="polite"
    >
      {icon}
      <span className="flex-1">{message}</span>
      <button
        onClick={onClose}
        className="hover:bg-ink/10 rounded-full p-1 transition-colors"
        aria-label="إغلاق"
      >
        <X size={18} />
      </button>
    </motion.div>
  );
};

// Toast Container Component
interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; type: ToastType }>;
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemove
}) => {
  return (
    <div
      className={cn(
        "fixed left-1/2 -translate-x-1/2",
        // Mobile: bottom-center (above timeline bar + safe area + gap)
        "bottom-[calc(64px+env(safe-area-inset-bottom)+16px)]",
        // Desktop: top (below header)
        "md:bottom-auto md:top-[80px]",
        "flex flex-col gap-2 items-center"
      )}
      style={{ zIndex: Z_INDEX.toast }}
      role="alert"
      aria-live="polite"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => onRemove(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
