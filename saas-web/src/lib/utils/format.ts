import { format, formatDistanceToNow, parseISO } from "date-fns";
import { ar } from "date-fns/locale";

// ─── Date Formatting ─────────────────────────────────────────────────────────

export function formatDate(date: Date | string, pattern = "dd MMM yyyy"): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, pattern);
}

export function formatDateAr(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "dd MMMM yyyy", { locale: ar });
}

export function formatRelative(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "HH:mm");
}

// ─── Number Formatting ───────────────────────────────────────────────────────

export function formatNumber(n: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat("ar-SA", options).format(n);
}

export function formatPercent(n: number, decimals = 1): string {
  return `${n.toFixed(decimals)}%`;
}

export function formatGrade(score: number, maxScore: number): string {
  const pct = (score / maxScore) * 100;
  if (pct >= 90) return "ممتاز";
  if (pct >= 80) return "جيد جدًا";
  if (pct >= 70) return "جيد";
  if (pct >= 60) return "مقبول";
  return "ضعيف";
}

export function formatGradeColor(pct: number): string {
  if (pct >= 90) return "text-green-600";
  if (pct >= 80) return "text-blue-600";
  if (pct >= 70) return "text-amber-600";
  if (pct >= 60) return "text-orange-600";
  return "text-red-600";
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

// ─── Grade Level Names ────────────────────────────────────────────────────────

export function gradeNameAr(grade: number): string {
  const names: Record<number, string> = {
    1: "الصف الأول",
    2: "الصف الثاني",
    3: "الصف الثالث",
    4: "الصف الرابع",
    5: "الصف الخامس",
    6: "الصف السادس",
    7: "الصف السابع",
    8: "الصف الثامن",
    9: "الصف التاسع",
    10: "الصف العاشر",
    11: "الصف الحادي عشر",
    12: "الصف الثاني عشر",
  };
  return names[grade] ?? `الصف ${grade}`;
}

// ─── Status Labels ───────────────────────────────────────────────────────────

export const studentStatusLabel: Record<string, string> = {
  active: "نشط",
  inactive: "غير نشط",
  graduated: "خريج",
  transferred: "منقول",
  suspended: "موقوف",
};

export const attendanceStatusLabel: Record<string, string> = {
  present: "حاضر",
  absent: "غائب",
  late: "متأخر",
  excused: "غياب بعذر",
};

export const behaviorTypeLabel: Record<string, string> = {
  positive: "إيجابي",
  negative: "سلبي",
  neutral: "محايد",
};

export const gradeTypeLabel: Record<string, string> = {
  quiz: "اختبار قصير",
  homework: "واجب منزلي",
  midterm: "اختبار منتصف الفصل",
  final: "اختبار نهاية الفصل",
  project: "مشروع",
  participation: "مشاركة صفية",
};

// ─── Risk Level ──────────────────────────────────────────────────────────────

export function getRiskLevel(attendance: number, gpa: number): "low" | "medium" | "high" {
  const score = attendance * 0.6 + (gpa / 100) * 40;
  if (score >= 80) return "low";
  if (score >= 60) return "medium";
  return "high";
}

export const riskLevelLabel: Record<string, string> = {
  low: "منخفض",
  medium: "متوسط",
  high: "مرتفع",
};

export const riskLevelColor: Record<string, string> = {
  low: "text-green-600 bg-green-50",
  medium: "text-amber-600 bg-amber-50",
  high: "text-red-600 bg-red-50",
};
