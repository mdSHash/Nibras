import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

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
      bg: 'bg-islamic-green',
      icon: <CheckCircle size={20} />,
    },
    error: {
      bg: 'bg-battle-red',
      icon: <AlertCircle size={20} />,
    },
    info: {
      bg: 'bg-accent',
      icon: <Info size={20} />,
    },
  };

  const { bg, icon } = config[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`fixed bottom-24 left-1/2 -translate-x-1/2 px-6 py-4 rounded-lg shadow-lg z-[9999] ${bg} text-parchment font-bold flex items-center gap-3 max-w-md`}
      dir="rtl"
      role="alert"
      aria-live="polite"
    >
      {icon}
      <span className="flex-1">{message}</span>
      <button
        onClick={onClose}
        className="hover:bg-white/20 rounded-full p-1 transition-colors"
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
    <AnimatePresence>
      {toasts.map((toast, index) => (
        <motion.div
          key={toast.id}
          style={{ bottom: `${6 + index * 5}rem` }}
          className="fixed left-1/2 -translate-x-1/2 z-[9999]"
        >
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => onRemove(toast.id)}
          />
        </motion.div>
      ))}
    </AnimatePresence>
  );
};

// Made with Bob
