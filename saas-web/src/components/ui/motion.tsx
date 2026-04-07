"use client";

import { motion, type HTMLMotionProps, type Variants, AnimatePresence } from "framer-motion";
import { forwardRef, type ReactNode } from "react";

// ─── Standard Variants ───────────────────────────────────────────────────────

export const fadeIn: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

export const slideInFromRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, x: 32, transition: { duration: 0.25 } },
};

// ─── Motion Components ───────────────────────────────────────────────────────

export const MotionDiv = motion.div;
export const MotionSpan = motion.span;
export const MotionButton = motion.button;
export const MotionSection = motion.section;
export const MotionLi = motion.li;
export const MotionUl = motion.ul;
export const MotionP = motion.p;
export const MotionH1 = motion.h1;
export const MotionH2 = motion.h2;

// ─── FadeIn Wrapper ──────────────────────────────────────────────────────────

interface FadeInProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
}

export const FadeIn = forwardRef<HTMLDivElement, FadeInProps>(
  ({ children, delay = 0, direction = "up", duration = 0.4, ...props }, ref) => {
    const initial = {
      opacity: 0,
      y: direction === "up" ? 12 : direction === "down" ? -12 : 0,
      x: direction === "left" ? -16 : direction === "right" ? 16 : 0,
    };

    return (
      <motion.div
        ref={ref}
        initial={initial}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
FadeIn.displayName = "FadeIn";

// ─── Stagger Container ───────────────────────────────────────────────────────

interface StaggerProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  stagger?: number;
  delay?: number;
}

export function Stagger({ children, stagger = 0.06, delay = 0, ...props }: StaggerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, ...props }: HTMLMotionProps<"div"> & { children: ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 12 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ─── Page Transition ─────────────────────────────────────────────────────────

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─── Presence Wrapper ─────────────────────────────────────────────────────────

export { AnimatePresence };

// ─── Number Counter ──────────────────────────────────────────────────────────

export function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {value.toLocaleString("ar-SA")}{suffix}
    </motion.span>
  );
}

// ─── Floating Element ────────────────────────────────────────────────────────

export function FloatingElement({ children, amplitude = 6, duration = 3 }: {
  children: ReactNode;
  amplitude?: number;
  duration?: number;
}) {
  return (
    <motion.div
      animate={{ y: [0, -amplitude, 0] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

// ─── Pulse Glow ──────────────────────────────────────────────────────────────

export function PulseGlow({ children, color = "primary" }: {
  children: ReactNode;
  color?: string;
}) {
  return (
    <motion.div
      animate={{
        boxShadow: [
          `0 0 0 0 hsl(232 76% 55% / 0.3)`,
          `0 0 0 8px hsl(232 76% 55% / 0)`,
        ],
      }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className="rounded-full"
    >
      {children}
    </motion.div>
  );
}
