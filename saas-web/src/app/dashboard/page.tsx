"use client";

import { motion } from "framer-motion";
import {
  Users, GraduationCap, CalendarCheck, BookOpen,
  TrendingUp, AlertTriangle, Zap, ArrowLeft, Activity,
  Eye, PenSquare, Upload, FileText, BarChart2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { KPICard } from "@/components/ui/kpi-card";
import { Stagger, StaggerItem, FadeIn } from "@/components/ui/motion";
import { GeometricMesh, ScoreRing, GradientOrb } from "@/components/ui/geometric-shapes";
import {
  AttendanceAreaChart, GradeDonutChart, PerformanceBarChart,
} from "@/components/dashboard/attendance-chart";
import {
  mockKPIs, mockActivityLogs, mockAIInsights,
  mockMonthlyData, mockGradeDistribution, mockAttendanceData,
  mockStudents,
} from "@/lib/utils/mock-data";
import { formatRelative, riskLevelColor, riskLevelLabel, studentStatusLabel } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <AppLayout title="لوحة التحكم">
      <div className="space-y-6">
        {/* Hero Banner */}
        <HeroBanner />

        {/* KPI Cards */}
        <section>
          <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StaggerItem>
              <KPICard
                title="إجمالي الطلاب"
                value={mockKPIs.totalStudents}
                trend={mockKPIs.trends.students}
                trendLabel="مقارنة بالشهر السابق"
                icon={Users}
                iconBg="bg-blue-50"
                iconColor="text-blue-600"
                accentBarColor="hsl(214 80% 55%)"
              />
            </StaggerItem>
            <StaggerItem>
              <KPICard
                title="نسبة الحضور اليوم"
                value={mockKPIs.avgAttendanceRate}
                suffix="%"
                trend={mockKPIs.trends.attendance}
                trendLabel="مقارنة بالأمس"
                icon={CalendarCheck}
                iconBg="bg-green-50"
                iconColor="text-green-600"
                accentBarColor="hsl(142 70% 40%)"
              />
            </StaggerItem>
            <StaggerItem>
              <KPICard
                title="متوسط الدرجات"
                value={mockKPIs.avgGPA}
                suffix="%"
                trend={mockKPIs.trends.grades}
                trendLabel="ارتفاع ملحوظ هذا الأسبوع"
                icon={BookOpen}
                iconBg="bg-amber-50"
                iconColor="text-amber-600"
                accentBarColor="hsl(38 92% 50%)"
              />
            </StaggerItem>
            <StaggerItem>
              <KPICard
                title="طلاب في خطر"
                value={mockKPIs.atRiskCount}
                trend={mockKPIs.trends.atRisk}
                trendLabel="تحسن ملحوظ"
                icon={AlertTriangle}
                iconBg="bg-red-50"
                iconColor="text-red-600"
                accentBarColor="hsl(0 80% 55%)"
              />
            </StaggerItem>
          </Stagger>
        </section>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Charts Column */}
          <div className="lg:col-span-2 space-y-6">
            <AttendanceTrendCard />
            <div className="grid grid-cols-2 gap-6">
              <GradeDistributionCard />
              <WeeklyAttendanceCard />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <AIInsightsCard />
            <AtRiskStudentsCard />
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActivityFeedCard />
          <QuickActionsCard />
        </div>
      </div>
    </AppLayout>
  );
}

// ─── Hero Banner ─────────────────────────────────────────────────────────────

function HeroBanner() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "صباح الخير" : hour < 17 ? "مساء الخير" : "مساء النور";
  const day = new Date().toLocaleDateString("ar-SA", { weekday: "long", day: "numeric", month: "long" });

  return (
    <FadeIn>
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-primary-700 via-primary-600 to-primary-500 p-6 text-white">
        <GeometricMesh />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Stats rings */}
            <div className="flex gap-3">
              <div className="text-center">
                <ScoreRing value={92} size={64} strokeWidth={5} color="white" label="حضور" className="opacity-90" />
              </div>
              <div className="text-center">
                <ScoreRing value={78} size={64} strokeWidth={5} color="rgba(255,255,255,0.7)" label="GPA" className="opacity-90" />
              </div>
            </div>

            <div className="h-12 w-px bg-white/20" />

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "حضر اليوم", value: "1,192", sub: "من 1,248" },
                { label: "غياب", value: "56", sub: "طالبًا" },
                { label: "مدرس نشط", value: "84", sub: "من 87" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-white/70 mt-0.5">{stat.label}</div>
                  <div className="text-xs text-white/50">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Greeting */}
          <div className="text-right">
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white/60 text-sm"
            >
              {day}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl font-bold mt-1"
            >
              {greeting}، منى
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white/70 text-sm mt-1"
            >
              لديك 3 تنبيهات تحتاج إلى مراجعة
            </motion.p>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

// ─── Attendance Trend ─────────────────────────────────────────────────────────

function AttendanceTrendCard() {
  return (
    <FadeIn delay={0.1}>
      <div className="card-base p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-primary" />
              <span className="text-xs text-ink-muted">نسبة الحضور</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-accent" />
              <span className="text-xs text-ink-muted">متوسط الدرجات</span>
            </div>
          </div>
          <div className="text-right">
            <h3 className="text-sm font-semibold text-ink">تحليل الأداء الأسبوعي</h3>
            <p className="text-xs text-ink-muted">آخر 7 أسابيع</p>
          </div>
        </div>
        <AttendanceAreaChart data={mockMonthlyData} />
      </div>
    </FadeIn>
  );
}

// ─── Grade Distribution ───────────────────────────────────────────────────────

function GradeDistributionCard() {
  return (
    <FadeIn delay={0.15}>
      <div className="card-base p-5">
        <div className="text-right mb-2">
          <h3 className="text-sm font-semibold text-ink">توزيع الدرجات</h3>
          <p className="text-xs text-ink-muted">الشعبة الحالية</p>
        </div>
        <GradeDonutChart data={mockGradeDistribution} />
        <div className="space-y-1.5 mt-2">
          {mockGradeDistribution.slice(0, 3).map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <span className="text-xs font-semibold text-ink">{item.value}</span>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-ink-muted">{item.label}</span>
                <div className="w-2 h-2 rounded-full" style={{ background: item.color ?? "#6366f1" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </FadeIn>
  );
}

// ─── Weekly Attendance ────────────────────────────────────────────────────────

function WeeklyAttendanceCard() {
  return (
    <FadeIn delay={0.2}>
      <div className="card-base p-5">
        <div className="text-right mb-2">
          <h3 className="text-sm font-semibold text-ink">حضور هذا الأسبوع</h3>
          <p className="text-xs text-ink-muted">حسب اليوم</p>
        </div>
        <PerformanceBarChart
          data={mockAttendanceData.map(d => ({ name: d.label, value: d.value }))}
        />
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <span className="text-xs font-bold text-green-600">94.2% متوسط</span>
          <span className="text-xs text-ink-muted">أفضل يوم: الاثنين</span>
        </div>
      </div>
    </FadeIn>
  );
}

// ─── AI Insights ──────────────────────────────────────────────────────────────

function AIInsightsCard() {
  const router = useRouter();
  const severityColors: Record<string, string> = {
    high: "border-red-200 bg-red-50",
    medium: "border-amber-200 bg-amber-50",
    low: "border-green-200 bg-green-50",
    critical: "border-red-300 bg-red-100",
  };
  const severityDot: Record<string, string> = {
    high: "bg-red-500",
    medium: "bg-amber-500",
    low: "bg-green-500",
    critical: "bg-red-600",
  };

  return (
    <FadeIn delay={0.1}>
      <div className="card-base p-5">
        <div className="flex items-center justify-between mb-4">
          <Zap className="w-4 h-4 text-accent" />
          <div className="text-right">
            <h3 className="text-sm font-semibold text-ink">تنبيهات الذكاء الاصطناعي</h3>
            <p className="text-xs text-ink-muted">محدّث للتو</p>
          </div>
        </div>

        <div className="space-y-2.5">
          {mockAIInsights.map((insight) => (
            <motion.div
              key={insight.id}
              onClick={() => router.push("/ai-assistant")}
              className={cn(
                "p-3 rounded-xl border text-right cursor-pointer",
                "hover:shadow-card transition-all duration-200",
                severityColors[insight.severity]
              )}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1 flex-shrink-0">
                  <span className="text-[10px] text-ink-muted">{insight.confidence}%</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 justify-end">
                    <p className="text-xs font-semibold text-ink text-right">{insight.title}</p>
                    <div className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", severityDot[insight.severity])} />
                  </div>
                  <p className="text-[11px] text-ink-muted mt-0.5 line-clamp-2">{insight.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <button
          onClick={() => router.push("/ai-assistant")}
          className="mt-3 w-full flex items-center justify-center gap-2 text-xs text-primary-600 hover:text-primary-700 py-2 rounded-xl hover:bg-primary-50 transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          عرض جميع التنبيهات
        </button>
      </div>
    </FadeIn>
  );
}

// ─── At Risk Students ─────────────────────────────────────────────────────────

function AtRiskStudentsCard() {
  const router = useRouter();
  const atRisk = mockStudents.filter(s => s.riskLevel !== "low");

  return (
    <FadeIn delay={0.2}>
      <div className="card-base p-5">
        <div className="flex items-center justify-between mb-4">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <div className="text-right">
            <h3 className="text-sm font-semibold text-ink">طلاب يحتاجون متابعة</h3>
            <p className="text-xs text-ink-muted">{atRisk.length} طلاب</p>
          </div>
        </div>

        <div className="space-y-2.5">
          {atRisk.map((student) => (
            <motion.div
              key={student.id}
              onClick={() => router.push(`/students?id=${student.id}`)}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-50 transition-colors cursor-pointer"
              whileHover={{ x: -2 }}
            >
              <div className="text-left flex-shrink-0">
                <span className={cn("badge text-[10px]", riskLevelColor[student.riskLevel ?? "low"])}>
                  {riskLevelLabel[student.riskLevel ?? "low"]}
                </span>
              </div>

              <div className="flex-1 min-w-0 text-right">
                <p className="text-xs font-semibold text-ink truncate">{student.fullName}</p>
                <p className="text-[11px] text-ink-muted">{student.class.name}</p>
              </div>

              <div className="w-8 h-8 rounded-full bg-surface-100 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-ink-muted">
                  {student.fullName.charAt(0)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <button
          onClick={() => router.push("/students?risk=high")}
          className="mt-3 w-full flex items-center justify-center gap-2 text-xs text-primary-600 hover:text-primary-700 py-2 rounded-xl hover:bg-primary-50 transition-colors"
        >
          <Eye className="w-3 h-3" />
          عرض جميع الطلاب
        </button>
      </div>
    </FadeIn>
  );
}

// ─── Activity Feed ────────────────────────────────────────────────────────────

const actionIcons: Record<string, React.ElementType> = {
  attendance_recorded: CalendarCheck,
  grade_entered: BookOpen,
  created: Users,
  uploaded: Upload,
  report_generated: FileText,
  updated: PenSquare,
  deleted: Activity,
};

const actionLabels: Record<string, string> = {
  attendance_recorded: "سجّل الحضور",
  grade_entered: "أدخل درجة",
  created: "أنشأ",
  uploaded: "رفع ملف",
  report_generated: "أنشأ تقريرًا",
  updated: "عدّل",
  deleted: "حذف",
};

function ActivityFeedCard() {
  const router = useRouter();
  return (
    <FadeIn delay={0.25}>
      <div className="card-base p-5">
        <div className="flex items-center justify-between mb-4">
          <Activity className="w-4 h-4 text-ink-muted" />
          <div className="text-right">
            <h3 className="text-sm font-semibold text-ink">آخر النشاطات</h3>
            <p className="text-xs text-ink-muted">النشاط الحي</p>
          </div>
        </div>

        <div className="relative space-y-0">
          {/* Timeline line */}
          <div className="absolute right-5 top-0 bottom-0 w-px bg-border" />

          {mockActivityLogs.map((log, i) => {
            const Icon = actionIcons[log.action] ?? Activity;
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                className="relative flex items-start gap-3 pr-10 pb-4"
              >
                {/* Icon dot */}
                <div className="absolute right-0 top-1 w-10 flex justify-center">
                  <div className="w-6 h-6 rounded-full bg-primary-50 border-2 border-primary-100 flex items-center justify-center">
                    <Icon className="w-3 h-3 text-primary-600" strokeWidth={2} />
                  </div>
                </div>

                <div className="flex-1 min-w-0 bg-surface-50 rounded-xl p-3 text-right">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] text-ink-subtle flex-shrink-0 mt-0.5">
                      {formatRelative(log.createdAt)}
                    </span>
                    <div>
                      <p className="text-xs text-ink">
                        <span className="font-semibold">{log.user.name}</span>
                        {" "}{actionLabels[log.action] ?? log.action}
                        {log.details && typeof log.details === "object" && "classId" in log.details &&
                          <span className="text-ink-muted"> في الصف</span>
                        }
                      </p>
                      {log.details && (
                        <p className="text-[11px] text-ink-muted mt-0.5">
                          {Object.values(log.details as Record<string, unknown>).filter(v => typeof v === "string")[0] as string}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <button
          onClick={() => router.push("/activity-log")}
          className="w-full flex items-center justify-center gap-2 text-xs text-primary-600 hover:text-primary-700 py-2 rounded-xl hover:bg-primary-50 transition-colors"
        >
          <BarChart2 className="w-3 h-3" />
          عرض سجل النشاطات الكامل
        </button>
      </div>
    </FadeIn>
  );
}

// ─── Quick Actions ────────────────────────────────────────────────────────────

const quickActions = [
  { label: "إضافة طالب جديد", icon: Users, color: "bg-blue-50 text-blue-600", href: "/students/new" },
  { label: "تسجيل الحضور", icon: CalendarCheck, color: "bg-green-50 text-green-600", href: "/attendance" },
  { label: "إدخال الدرجات", icon: BookOpen, color: "bg-amber-50 text-amber-600", href: "/grades" },
  { label: "إنشاء تقرير", icon: BarChart2, color: "bg-purple-50 text-purple-600", href: "/reports" },
  { label: "رفع ملف", icon: Upload, color: "bg-pink-50 text-pink-600", href: "/files" },
  { label: "مساعد ذكي", icon: Zap, color: "bg-indigo-50 text-indigo-600", href: "/ai-assistant" },
];

function QuickActionsCard() {
  return (
    <FadeIn delay={0.3}>
      <div className="card-base p-5">
        <div className="text-right mb-4">
          <h3 className="text-sm font-semibold text-ink">إجراءات سريعة</h3>
          <p className="text-xs text-ink-muted">الوصول الفوري للمهام الشائعة</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {quickActions.map((action, i) => (
            <Link key={action.label} href={action.href}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.04 * i }}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-xl h-full",
                  "hover:shadow-card transition-all duration-200 cursor-pointer",
                  "border border-border hover:border-surface-200"
                )}
              >
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", action.color)}>
                  <action.icon className="w-5 h-5" strokeWidth={1.8} />
                </div>
                <span className="text-xs font-medium text-ink text-center leading-tight">
                  {action.label}
                </span>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </FadeIn>
  );
}
