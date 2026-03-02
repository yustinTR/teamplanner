import type { Transition, Variants } from "framer-motion";

// --- Spring presets ---

export const spring = {
  snappy: { type: "spring", stiffness: 300, damping: 30 } as Transition,
  smooth: { type: "spring", stiffness: 200, damping: 25 } as Transition,
  bouncy: { type: "spring", stiffness: 400, damping: 15 } as Transition,
};

// --- Transition presets ---

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: spring.smooth },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: spring.snappy },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
};

export const slideInFromRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: spring.smooth },
  exit: { opacity: 0, x: -20, transition: { duration: 0.15 } },
};

// --- Stagger container ---

export function staggerContainer(staggerDelay = 0.03): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };
}

// --- Stagger item (use inside a stagger container) ---

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: spring.smooth },
};
