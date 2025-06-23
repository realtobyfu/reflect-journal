import { Variants } from 'framer-motion';

// Emotion-Aware Animations
export const microInteractions = {
  // Entry Save Animation
  saveSuccess: {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: [0, 1.2, 1],
      opacity: 1,
      transition: { duration: 0.4, ease: 'easeOut' }
    },
    exit: { opacity: 0, transition: { delay: 1 } }
  } as Variants,
  
  // Mood Selection Feedback
  moodSelect: {
    whileTap: { scale: 0.95 },
    whileHover: { scale: 1.05 },
    transition: { type: 'spring', stiffness: 400, damping: 17 }
  },
  
  // Insight Reveal
  insightReveal: {
    initial: { y: 20, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { 
        delay: 0.1,
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  } as Variants,
  
  // Page Transitions
  pageTransition: {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.2 }
    }
  } as Variants,
  
  // Card Hover
  cardHover: {
    whileHover: { 
      scale: 1.02,
      y: -2,
      transition: { duration: 0.2, ease: 'easeOut' }
    },
    whileTap: { scale: 0.98 }
  },
  
  // Button Press
  buttonPress: {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { type: 'spring', stiffness: 400, damping: 17 }
  },
  
  // Floating Action Button
  fab: {
    whileHover: { 
      scale: 1.1,
      boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
    },
    whileTap: { scale: 0.95 },
    transition: { type: 'spring', stiffness: 400, damping: 17 }
  },
  
  // Slide In From Right
  slideInRight: {
    initial: { x: 100, opacity: 0 },
    animate: { 
      x: 0, 
      opacity: 1,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    },
    exit: { 
      x: 100, 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  } as Variants,
  
  // Fade In Up
  fadeInUp: {
    initial: { y: 30, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
    }
  } as Variants,
  
  // Stagger Children
  staggerChildren: {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  } as Variants,
  
  // Scale In
  scaleIn: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: 'spring', 
        stiffness: 500, 
        damping: 30 
      }
    },
    exit: { 
      scale: 0.8, 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  } as Variants,
  
  // Gentle Bounce
  gentleBounce: {
    animate: {
      y: [0, -5, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  } as Variants,
  
  // Pulse
  pulse: {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  } as Variants
};

// Haptic Feedback Manager
export class HapticFeedback {
  static light() {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  }
  
  static medium() {
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
  }
  
  static success() {
    if ('vibrate' in navigator) {
      navigator.vibrate([10, 50, 10]);
    }
  }
  
  static error() {
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 100, 50]);
    }
  }
  
  static selection() {
    if ('vibrate' in navigator) {
      navigator.vibrate(5);
    }
  }
}

// Animation Presets for Different UI States
export const animationPresets = {
  // Loading states
  loading: {
    spinner: {
      animate: {
        rotate: 360,
        transition: {
          duration: 1,
          repeat: Infinity,
          ease: 'linear'
        }
      }
    },
    dots: {
      animate: {
        y: [0, -10, 0],
        transition: {
          duration: 0.6,
          repeat: Infinity,
          ease: 'easeInOut',
          staggerChildren: 0.1
        }
      }
    }
  },
  
  // Success states
  success: {
    checkmark: {
      initial: { scale: 0, rotate: -180 },
      animate: { 
        scale: 1, 
        rotate: 0,
        transition: { 
          type: 'spring', 
          stiffness: 500, 
          damping: 15 
        }
      }
    },
    confetti: {
      animate: {
        y: [0, -20, 0],
        rotate: [0, 180, 360],
        transition: {
          duration: 1,
          ease: 'easeOut'
        }
      }
    }
  },
  
  // Error states
  error: {
    shake: {
      animate: {
        x: [-5, 5, -5, 5, 0],
        transition: {
          duration: 0.4,
          ease: 'easeInOut'
        }
      }
    },
    pulse: {
      animate: {
        scale: [1, 1.05, 1],
        transition: {
          duration: 0.3,
          ease: 'easeInOut'
        }
      }
    }
  }
};

// Utility function to create staggered animations
export const createStaggerAnimation = (
  delay: number = 0.1,
  staggerDirection: 'normal' | 'reverse' = 'normal'
) => ({
  animate: {
    transition: {
      staggerChildren: delay,
      staggerDirection: staggerDirection === 'reverse' ? -1 : 1,
      delayChildren: 0.1
    }
  }
});

// Utility function to create scroll-triggered animations
export const createScrollAnimation = (threshold: number = 0.1) => ({
  initial: { opacity: 0, y: 50 },
  whileInView: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
  },
  viewport: { once: true, amount: threshold }
});