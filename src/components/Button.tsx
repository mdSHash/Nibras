import React, { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { buttonAnimations } from '../utils/animations';
import { prefersReducedMotion } from '../utils/performance';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-parchment hover:bg-accent/90 border-accent',
  secondary: 'bg-card-bg text-ink hover:bg-ink/10 border-border-dark',
  ghost: 'bg-transparent text-ink hover:bg-ink/5 border-transparent',
  danger: 'bg-battle-red text-parchment hover:bg-battle-red/90 border-battle-red',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  disabled,
  className = '',
  ...props
}) => {
  const reducedMotion = prefersReducedMotion();

  return (
    <motion.button
      whileHover={!disabled && !loading && !reducedMotion ? buttonAnimations.hover : undefined}
      whileTap={!disabled && !loading && !reducedMotion ? buttonAnimations.tap : undefined}
      disabled={disabled || loading}
      className={`
        relative inline-flex items-center justify-center gap-2
        font-bold rounded-lg border-2 
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-inherit rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      )}
      
      <span className={`flex items-center gap-2 ${loading ? 'invisible' : ''}`}>
        {icon && iconPosition === 'left' && (
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {icon}
          </motion.span>
        )}
        {children}
        {icon && iconPosition === 'right' && (
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {icon}
          </motion.span>
        )}
      </span>
    </motion.button>
  );
};

// Made with Bob