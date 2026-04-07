"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { AnimatedNumber } from "./motion";

interface KPICardProps {
  title: string;
  value: number;
  suffix?: string;
  trend?: number;
  trendLabel?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  description?: string;
  className?: string;
  delay?: number;
  accentBar?: boolean;
  accentBarColor?: string;
}

export function KPICard({
  title,
  value,
  suffix = "",
  trend,
  trendLabel,
  icon: Icon,
  iconColor = "text-primary-600",
  iconBg = "bg-primary-50",
  description,
  className,
  delay = 0,
  accentBar = true,
  accentBarColor,
}: KPICardProps) {
  const isPositive = trend !== undefined && trend >= 0;
  const isNegative = trend !== undefined && trend < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={cn(
        "card-base relative overflow-hidden p-5 cursor-default group",
        className
      )}
    >
      {/* Accent bar */}
      {accentBar && (
        <div
          className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
          style={{ background: accentBarColor ?? "hsl(var(--primary))" }}
        />
      )}

      {/* Background shape */}
      <div
        className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-5 transition-transform duration-500 group-hover:scale-125"
        style={{ background: "hsl(var(--primary))" }}
      />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className={cn("p-2.5 rounded-xl", iconBg)}>
            <Icon className={cn("w-5 h-5", iconColor)} strokeWidth={1.8} />
          </div>

          {trend !== undefined && (
            <motion.div
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.2 }}
              className={cn(
                "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                isPositive && "bg-green-50 text-green-600",
                isNegative && "bg-red-50 text-red-600",
                !isPositive && !isNegative && "bg-surface-100 text-ink-muted"
              )}
            >
              {isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {Math.abs(trend)}%
            </motion.div>
          )}
        </div>

        {/* Value */}
        <div className="mb-1">
          <span className="text-3xl font-bold text-ink tracking-tight">
            <AnimatedNumber value={value} suffix={suffix} />
          </span>
        </div>

        {/* Title */}
        <p className="text-sm font-medium text-ink-muted">{title}</p>

        {/* Description or trend label */}
        {(description ?? trendLabel) && (
          <p className="text-xs text-ink-subtle mt-1.5">
            {description ?? trendLabel}
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ─── Mini KPI ────────────────────────────────────────────────────────────────

interface MiniKPIProps {
  label: string;
  value: string | number;
  color?: "primary" | "success" | "warning" | "danger";
}

export function MiniKPI({ label, value, color = "primary" }: MiniKPIProps) {
  const colorMap = {
    primary: "text-primary-600",
    success: "text-green-600",
    warning: "text-amber-600",
    danger: "text-red-600",
  };

  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-ink-muted">{label}</span>
      <span className={cn("text-sm font-bold", colorMap[color])}>{value}</span>
    </div>
  );
}
