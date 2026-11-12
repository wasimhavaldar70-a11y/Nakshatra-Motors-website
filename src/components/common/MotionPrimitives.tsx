import React from 'react';
import { motion } from 'motion/react';

export const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;
export const VIEWPORT_ONCE = { once: true, amount: 0.12 } as const;

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  x?: number;
  scale?: number;
  className?: string;
}

/** Scroll-triggered fade and directional reveal wrapper. */
export const Reveal: React.FC<RevealProps> = ({
  children,
  delay = 0,
  duration = 0.55,
  y = 24,
  x = 0,
  scale = 1,
  className = '',
}) => (
  <motion.div
    initial={{ opacity: 0, x, y, scale }}
    whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
    viewport={VIEWPORT_ONCE}
    transition={{ duration, delay, ease: EASE_OUT_EXPO }}
    className={className}
  >
    {children}
  </motion.div>
);

interface StaggerGridProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

/** Container that staggers entrance animations of direct StaggerCard children. */
export const StaggerGrid: React.FC<StaggerGridProps> = ({
  children,
  staggerDelay = 0.08,
  className = '',
}) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={VIEWPORT_ONCE}
    variants={{
      hidden: {},
      visible: {
        transition: {
          staggerChildren: staggerDelay,
        },
      },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

interface StaggerCardProps {
  children: React.ReactNode;
  hoverLift?: boolean;
  className?: string;
}

const staggerCardVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT_EXPO },
  },
};

/** Staggered child item with optional subtle hover lift. */
export const StaggerCard: React.FC<StaggerCardProps> = ({
  children,
  hoverLift = false,
  className = '',
}) => (
  <motion.div
    variants={staggerCardVariants}
    whileHover={hoverLift ? { y: -5, transition: { duration: 0.2, ease: 'easeOut' } } : undefined}
    className={className}
  >
    {children}
  </motion.div>
);

