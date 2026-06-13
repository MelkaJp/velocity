// ──────────────────────────────────────────
// Transitions
// ──────────────────────────────────────────

export const spring = { type: 'spring', stiffness: 300, damping: 20 };
export const springStiff = { type: 'spring', stiffness: 400, damping: 25 };
export const springBouncy = { type: 'spring', stiffness: 300, damping: 15 };
export const springGentle = { type: 'spring', stiffness: 200, damping: 25 };

export const smoothEase = { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] };
export const fastEase = { duration: 0.3, ease: 'easeInOut' };
export const slowEase = { duration: 0.8, ease: 'easeOut' };

// ──────────────────────────────────────────
// Scroll Reveal Variants
// ──────────────────────────────────────────

export const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: smoothEase }
};

export const fadeDown = {
  hidden: { opacity: 0, y: -40 },
  visible: { opacity: 1, y: 0, transition: smoothEase }
};

export const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: smoothEase }
};

export const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: smoothEase }
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: smoothEase }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: smoothEase }
};

// ──────────────────────────────────────────
// Staggered Container Variants
// ──────────────────────────────────────────

export const staggerContainer = (staggerDelay = 0.12, childDelay = 0.1) => ({
  hidden: {},
  visible: { transition: { staggerChildren: staggerDelay, delayChildren: childDelay } }
});

export const staggerFast = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } }
};

export const staggerMedium = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};

export const staggerCards = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
};

export const staggerItems = (delay = 0.08) => ({
  hidden: {},
  visible: { transition: { staggerChildren: delay } }
});

// ──────────────────────────────────────────
// Card / Tile Hover Variants
// ──────────────────────────────────────────

export const cardHover = {
  whileHover: { y: -8, transition: spring }
};

export const cardHoverLift = {
  whileHover: { y: -12, scale: 1.02, transition: springBouncy }
};

export const cardHoverScale = {
  whileHover: { scale: 1.05, transition: spring }
};

export const iconWobble = {
  whileHover: { rotate: [0, -10, 10, 0], scale: 1.1, transition: { duration: 0.4 } }
};

export const buttonHover = {
  whileHover: { x: 4 },
  whileTap: { scale: 0.99 }
};

// ──────────────────────────────────────────
// Page / View Transition Variants
// ──────────────────────────────────────────

export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: fastEase
};

export const pageSlide = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
  transition: fastEase
};

// ──────────────────────────────────────────
// Floating / Continuous Animation Variants
// ──────────────────────────────────────────

export const floatVertical = (height = 8, duration = 4) => ({
  y: [0, -height, 0],
  transition: { duration, repeat: Infinity, ease: 'easeInOut' }
});

export const floatVerticalReverse = (height = 8, duration = 5) => ({
  y: [0, height, 0],
  transition: { duration, repeat: Infinity, ease: 'easeInOut' }
});

// ──────────────────────────────────────────
// Progress Bar Variants
// ──────────────────────────────────────────

export const progressFill = {
  initial: { width: '0%' },
  animate: { width: '100%' },
  transition: { duration: 0.8, ease: 'easeOut' }
};

// ──────────────────────────────────────────
// FAQ Accordion Variants
// ──────────────────────────────────────────

export const accordionContent = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: fastEase
};

export const chevronRotate = (open) => ({
  rotate: open ? 180 : 0,
  transition: { duration: 0.3 }
});

// ──────────────────────────────────────────
// Step Entrance Variants (PortalView)
// ──────────────────────────────────────────

export const stepPill = (delay = 0) => ({
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0, transition: { delay } }
});
