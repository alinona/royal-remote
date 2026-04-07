"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
  Legend, LineChart, Line, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis,
} from "recharts";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number; name?: string; color?: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-card border border-border rounded-xl shadow-card-hover p-3 text-right">
      <p className="text-xs font-semibold text-ink mb-1.5">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-ink-muted">{entry.name ?? "القيمة"}:</span>
          <span className="font-bold text-ink">{entry.value}%</span>
        </div>
      ))}
    </div>
  );
};

// ─── Attendance Area Chart ────────────────────────────────────────────────────

interface AttendanceChartProps {
  data: Array<{ label: string; value: number; secondary?: number }>;
  className?: string;
}

export function AttendanceAreaChart({ data, className }: AttendanceChartProps) {
  const chartData = data.map(d => ({
    name: d.label,
    "نسبة الحضور": d.value,
    "متوسط الدرجات": d.secondary,
  }));

  return (
    <div className={cn("w-full h-48", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="attendanceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(232 76% 55%)" stopOpacity={0.25} />
              <stop offset="95%" stopColor="hsl(232 76% 55%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradesGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(268 85% 64%)" stopOpacity={0.2} />
              <stop offset="95%" stopColor="hsl(268 85% 64%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 12% 90%)" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "hsl(220 10% 58%)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[60, 100]}
            tick={{ fontSize: 11, fill: "hsl(220 10% 58%)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="نسبة الحضور"
            stroke="hsl(232 76% 55%)"
            strokeWidth={2.5}
            fill="url(#attendanceGrad)"
            dot={{ r: 4, fill: "hsl(232 76% 55%)", strokeWidth: 2, stroke: "white" }}
            activeDot={{ r: 6 }}
          />
          {chartData[0]?.["متوسط الدرجات"] !== undefined && (
            <Area
              type="monotone"
              dataKey="متوسط الدرجات"
              stroke="hsl(268 85% 64%)"
              strokeWidth={2}
              fill="url(#gradesGrad)"
              dot={{ r: 3, fill: "hsl(268 85% 64%)", strokeWidth: 2, stroke: "white" }}
              activeDot={{ r: 5 }}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Grade Distribution Donut ─────────────────────────────────────────────────

const DONUT_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#f97316", "#ef4444"];
const RADIAN = Math.PI / 180;

const renderCustomLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent,
}: {
  cx: number; cy: number; midAngle: number;
  innerRadius: number; outerRadius: number; percent: number;
}) => {
  if (percent < 0.05) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="600">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

interface DonutChartProps {
  data: Array<{ label: string; value: number; color?: string }>;
  className?: string;
}

export function GradeDonutChart({ data, className }: DonutChartProps) {
  const chartData = data.map((d, i) => ({
    name: d.label,
    value: d.value,
    color: d.color ?? DONUT_COLORS[i % DONUT_COLORS.length],
  }));

  return (
    <div className={cn("w-full h-52", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
            labelLine={false}
            label={renderCustomLabel}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [value, name]}
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid hsl(220 12% 90%)",
              boxShadow: "0 4px 16px hsl(220 30% 10% / 0.08)",
              textAlign: "right",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Performance Bar Chart ────────────────────────────────────────────────────

interface BarChartProps {
  data: Array<{ name: string; value: number; secondary?: number }>;
  className?: string;
}

export function PerformanceBarChart({ data, className }: BarChartProps) {
  return (
    <div className={cn("w-full h-48", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }} barSize={20}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 12% 90%)" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "hsl(220 10% 58%)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "hsl(220 10% 58%)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="value"
            name="نسبة الحضور"
            fill="hsl(232 76% 55%)"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Mini Sparkline ───────────────────────────────────────────────────────────

interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
  className?: string;
}

export function Sparkline({ data, color = "hsl(232 76% 55%)", height = 40, className }: SparklineProps) {
  const chartData = data.map((v, i) => ({ i, v }));

  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
