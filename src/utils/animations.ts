/**
 * Animation utilities and presets
 * Provides reusable animation configurations for Framer Motion
 */

import { Variants, Transition } from 'motion/react';
import { prefersReducedMotion, getAnimationDuration } from './performance';

/**
 * Spring animation presets
 */
export const springPresets = {
  gentle: {
    type: 'spring' as const,
    stiffness: 120,
    damping: 14,
    mass: 0.5,
  },
  bouncy: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 20,
    mass: 0.8,
  },
  snappy: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 30,
    mass: 0.5,
  },
  smooth: {
    type: 'spring' as const,
    stiffness: 100,
    damping: 15,
    mass: 1,
  },
};

/**
 * Easing presets
 */
export const easingPresets = {
  easeInOut: [0.4, 0, 0.2, 1] as [number, number, number, number],
  easeOut: [0, 0, 0.2, 1] as [number, number, number, number],
  easeIn: [0.4, 0, 1, 1] as [number, number, number, number],
  sharp: [0.4, 0, 0.6, 1] as [number, number, number, number],
  anticipate: [0.68, -0.55, 0.265, 1.55] as [number, number, number, number],
};

/**
 * Fade animation variants
 */
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: getAnimationDuration(300) / 1000 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: getAnimationDuration(200) / 1000 }
  },
};

/**
 * Slide animation variants
 */
export const slideVariants = {
  fromRight: {
    hidden: { x: '100%', opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: springPresets.smooth
    },
    exit: { 
      x: '100%', 
      opacity: 0,
      transition: { duration: getAnimationDuration(200) / 1000 }
    },
  },
  fromLeft: {
    hidden: { x: '-100%', opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: springPresets.smooth
    },
    exit: { 
      x: '-100%', 
      opacity: 0,
      transition: { duration: getAnimationDuration(200) / 1000 }
    },
  },
  fromTop: {
    hidden: { y: '-100%', opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: springPresets.smooth
    },
    exit: { 
      y: '-100%', 
      opacity: 0,
      transition: { duration: getAnimationDuration(200) / 1000 }
    },
  },
  fromBottom: {
    hidden: { y: '100%', opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: springPresets.smooth
    },
    exit: { 
      y: '100%', 
      opacity: 0,
      transition: { duration: getAnimationDuration(200) / 1000 }
    },
  },
};

/**
 * Scale animation variants
 */
export const scaleVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: springPresets.bouncy
  },
  exit: { 
    scale: 0.8, 
    opacity: 0,
    transition: { duration: getAnimationDuration(200) / 1000 }
  },
};

/**
 * Stagger children animation
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: getAnimationDuration(100) / 1000,
      delayChildren: getAnimationDuration(100) / 1000,
    },
  },
};

/**
 * Stagger item animation
 */
export const staggerItem: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: springPresets.gentle,
  },
};

/**
 * Button hover and tap animations
 */
export const buttonAnimations = {
  hover: {
    scale: 1.05,
    transition: { duration: getAnimationDuration(150) / 1000 },
  },
  tap: {
    scale: 0.95,
    transition: { duration: getAnimationDuration(100) / 1000 },
  },
};

/**
 * Card hover animations
 */
export const cardAnimations = {
  hover: {
    y: -4,
    boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
    transition: springPresets.gentle,
  },
  tap: {
    y: -2,
    transition: { duration: getAnimationDuration(100) / 1000 },
  },
};

/**
 * Shimmer loading animation
 */
export const shimmerVariants: Variants = {
  initial: { x: '-100%' },
  animate: {
    x: '100%',
    transition: {
      repeat: Infinity,
      duration: getAnimationDuration(1500) / 1000,
      ease: 'linear',
    },
  },
};

/**
 * Pulse animation
 */
export const pulseVariants: Variants = {
  initial: { scale: 1, opacity: 1 },
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      repeat: Infinity,
      duration: getAnimationDuration(2000) / 1000,
      ease: 'easeInOut',
    },
  },
};

/**
 * Rotate animation
 */
export const rotateVariants: Variants = {
  initial: { rotate: 0 },
  animate: {
    rotate: 360,
    transition: {
      repeat: Infinity,
      duration: getAnimationDuration(1000) / 1000,
      ease: 'linear',
    },
  },
};

/**
 * Bounce animation
 */
export const bounceVariants: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-10, 0, -10],
    transition: {
      repeat: Infinity,
      duration: getAnimationDuration(1000) / 1000,
      ease: 'easeInOut',
    },
  },
};

/**
 * Page transition variants
 */
export const pageTransitionVariants: Variants = {
  initial: { 
    opacity: 0,
    y: 20,
  },
  animate: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: getAnimationDuration(400) / 1000,
      ease: easingPresets.easeOut,
    },
  },
  exit: { 
    opacity: 0,
    y: -20,
    transition: {
      duration: getAnimationDuration(300) / 1000,
      ease: easingPresets.easeIn,
    },
  },
};

/**
 * Modal backdrop variants
 */
export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: getAnimationDuration(200) / 1000 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: getAnimationDuration(150) / 1000 }
  },
};

/**
 * Notification variants (toast)
 */
export const notificationVariants: Variants = {
  hidden: { 
    opacity: 0,
    y: -50,
    scale: 0.3,
  },
  visible: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springPresets.bouncy,
  },
  exit: { 
    opacity: 0,
    scale: 0.5,
    transition: { duration: getAnimationDuration(200) / 1000 }
  },
};

/**
 * Create custom transition with reduced motion support
 */
export const createTransition = (
  duration: number,
  ease: [number, number, number, number] | string = easingPresets.easeInOut
): Transition => {
  if (prefersReducedMotion()) {
    return { duration: 0 };
  }
  
  return {
    duration: duration / 1000,
    ease: ease as any,
  };
};

/**
 * Create custom spring transition with reduced motion support
 */
export const createSpringTransition = (
  stiffness: number = 300,
  damping: number = 30
): Transition => {
  if (prefersReducedMotion()) {
    return { duration: 0 };
  }
  
  return {
    type: 'spring',
    stiffness,
    damping,
  };
};

// Made with Bob