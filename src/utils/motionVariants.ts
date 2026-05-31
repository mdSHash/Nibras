import type { Variants } from 'motion/react';

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } 
  },
  exit: { opacity: 0, y: 8, transition: { duration: 0.2 } }
};

export const slideInRight: Variants = {
  hidden: { x: '100%' },
  visible: { 
    x: 0, 
    transition: { type: 'spring', damping: 28, stiffness: 280 } 
  },
  exit: { x: '100%', transition: { type: 'spring', damping: 28, stiffness: 280 } }
};

export const slideInLeft: Variants = {
  hidden: { x: '-100%' },
  visible: { 
    x: 0, 
    transition: { type: 'spring', damping: 28, stiffness: 280 } 
  },
  exit: { x: '-100%', transition: { type: 'spring', damping: 28, stiffness: 280 } }
};

export const slideUp: Variants = {
  hidden: { y: '100%' },
  visible: { 
    y: 0, 
    transition: { type: 'spring', damping: 30, stiffness: 300 } 
  },
  exit: { y: '100%', transition: { type: 'spring', damping: 30, stiffness: 300 } }
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: 0.2 } 
  },
  exit: { opacity: 0, scale: 0.92, transition: { duration: 0.15 } }
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { 
    transition: { staggerChildren: 0.06 } 
  }
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } 
  }
};
