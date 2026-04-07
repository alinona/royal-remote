"use client";

import { cn } from "@/lib/utils/cn";
import { motion } from "framer-motion";

// ─── Background Mesh ─────────────────────────────────────────────────────────

export function GeometricMesh({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {/* Large blobs */}
      <motion.div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-[0.06]"
        style={{ background: "hsl(var(--primary))" }}
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 15, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full opacity-[0.04]"
        style={{ background: "hsl(var(--accent))" }}
        animate={{
          scale: [1, 1.15, 1],
          rotate: [0, -10, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full opacity-[0.03]"
        style={{ background: "hsl(var(--primary-300))" }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--ink)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--ink)) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />
    </div>
  );
}

// ─── Floating Shapes ─────────────────────────────────────────────────────────

interface ShapeProps {
  className?: string;
  size?: number;
  color?: string;
  delay?: number;
}

export function FloatingRing({ className, size = 64, color, delay = 0 }: ShapeProps) {
  return (
    <motion.div
      className={cn("rounded-full border-2 opacity-20", className)}
      style={{
        width: size,
        height: size,
        borderColor: color ?? "hsl(var(--primary))",
      }}
      animate={{
        y: [0, -8, 0],
        rotate: [0, 180, 360],
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

export function FloatingDiamond({ className, size = 48, color, delay = 0 }: ShapeProps) {
  return (
    <motion.div
      className={cn("opacity-15", className)}
      style={{
        width: size,
        height: size,
        background: color ?? "hsl(var(--primary))",
        clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
      }}
      animate={{
        y: [0, -10, 0],
        rotate: [0, 45, 0],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

export function FloatingTriangle({ className, size = 40, color, delay = 0 }: ShapeProps) {
  return (
    <motion.div
      className={cn("opacity-10", className)}
      style={{
        width: 0,
        height: 0,
        borderLeft: `${size / 2}px solid transparent`,
        borderRight: `${size / 2}px solid transparent`,
        borderBottom: `${size}px solid ${color ?? "hsl(var(--accent))"}`,
      }}
      animate={{
        y: [0, -6, 0],
        rotate: [0, 10, 0],
      }}
      transition={{
        duration: 7,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

export function FloatingHex({ className, size = 56, color, delay = 0 }: ShapeProps) {
  return (
    <motion.div
      className={cn("opacity-10", className)}
      style={{
        width: size,
        height: size,
        background: color ?? "hsl(var(--primary-300))",
        clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
      }}
      animate={{
        y: [0, -8, 0],
        rotate: [0, 30, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 9,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

// ─── Decorative Background Shapes ────────────────────────────────────────────

export function ShapesBackground({ density = "normal" }: { density?: "sparse" | "normal" | "dense" }) {
  const count = density === "sparse" ? 3 : density === "dense" ? 8 : 5;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      <FloatingRing className="absolute top-8 right-12" size={80} delay={0} />
      <FloatingDiamond className="absolute top-1/4 left-8" size={40} delay={1} />
      {count > 3 && <FloatingHex className="absolute bottom-1/3 right-1/4" size={60} delay={2} />}
      {count > 3 && <FloatingTriangle className="absolute top-1/2 right-8" size={36} delay={3} />}
      {count > 5 && <FloatingRing className="absolute bottom-16 left-1/3" size={48} delay={4} />}
      {count > 5 && <FloatingDiamond className="absolute top-16 left-1/2" size={32} delay={5} />}
      {count > 7 && <FloatingHex className="absolute bottom-8 right-16" size={44} delay={6} />}
      {count > 7 && <FloatingTriangle className="absolute top-1/3 left-1/4" size={28} delay={7} />}
    </div>
  );
}

// ─── Score Ring ──────────────────────────────────────────────────────────────

interface ScoreRingProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  className?: string;
}

export function ScoreRing({
  value,
  max = 100,
  size = 80,
  strokeWidth = 6,
  color,
  label,
  className,
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(value / max, 1);
  const offset = circumference * (1 - pct);

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--surface-100))"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color ?? "hsl(var(--primary))"}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-lg font-bold text-ink"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {value}
        </motion.span>
        {label && (
          <span className="text-[10px] text-ink-muted">{label}</span>
        )}
      </div>
    </div>
  );
}

// ─── Gradient Orb ────────────────────────────────────────────────────────────

export function GradientOrb({
  className,
  primary = true,
}: {
  className?: string;
  primary?: boolean;
}) {
  return (
    <div
      className={cn("rounded-full blur-3xl opacity-20 pointer-events-none", className)}
      style={{
        background: primary
          ? "radial-gradient(circle, hsl(var(--primary)), transparent)"
          : "radial-gradient(circle, hsl(var(--accent)), transparent)",
      }}
    />
  );
}
