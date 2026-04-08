"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Plus, Save, ChevronDown, BarChart2,
  TrendingUp, TrendingDown, Award, Filter,
} from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { Stagger, StaggerItem, FadeIn } from "@/components/ui/motion";
import { AttendanceAreaChart } from "@/components/dashboard/attendance-chart";
import { cn } from "@/lib/utils/cn";
import { mockStudents, mockClasses } from "@/lib/utils/mock-data";
import { formatGrade, formatGradeColor, gradeTypeLabel } from "@/lib/utils/format";
import type { GradeType } from "@/types";

// ─── Mock subjects ────────────────────────────────────────────────────────────

const subjects = [
  { id: "sub1", name: "الرياضيات", color: "#6366f1" },
  { id: "sub2", name: "اللغة العربية", color: "#f59e0b" },
  { id: "sub3", name: "العلوم", color: "#10b981" },
  { id: "sub4", name: "الاجتماعيات", color: "#ef4444" },
];

const gradeTypes: GradeType[] = ["quiz", "homework", "midterm", "final", "project", "participation"];

// ─── Grades Page ──────────────────────────────────────────────────────────────

export default function GradesPage() {
  const [selectedClass, setSelectedClass] = useState(mockClasses[0]);
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]);
  const [selectedType, setSelectedType] = useState<GradeType>("quiz");
  const [maxScore, setMaxScore] = useState(100);
  const [grades, setGrades] = useState<Record<string, number>>({});
  const [view, setView] = useState<"entry" | "analytics">("entry");

  const students = mockStudents.filter(s => s.classId === selectedClass.id);

  const stats = {
    avg: grades && Object.keys(grades).length > 0
      ? Object.values(grades).reduce((a, b) => a + b, 0) / Object.keys(grades).length
      : 0,
    highest: Object.values(grades).length > 0 ? Math.max(...Object.values(grades)) : 0,
    lowest: Object.values(grades).length > 0 ? Math.min(...Object.values(grades)) : 0,
    entered: Object.keys(grades).length,
  };

  const trendData = [
    { label: "اختبار 1", value: 75, secondary: 80 },
    { label: "اختبار 2", value: 78, secondary: 82 },
    { label: "اختبار 3", value: 72, secondary: 79 },
    { label: "منتصف الشعبة/الترم", value: 80, secondary: 85 },
    { label: "اختبار 5", value: 82, secondary: 88 },
    { label: "نهاية الشعبة/الترم", value: 85, secondary: 90 },
  ];

  return (
    <AppLayout title="الدرجات والتقييم">
      <div className="space-y-6">
        {/* Controls */}
        <FadeIn>
          <div className="card-base p-4 space-y-4">
            {/* Row 1 - Class & Subject */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex-1">
                <label className="text-xs text-ink-muted mb-1 block text-right">الصف</label>
                <select
                  value={selectedClass.id}
                  onChange={e => setSelectedClass(mockClasses.find(c => c.id === e.target.value) ?? mockClasses[0])}
                  className="input-base text-right"
                  dir="rtl"
                >
                  {mockClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label className="text-xs text-ink-muted mb-1 block text-right">المادة</label>
                <select
                  value={selectedSubject.id}
                  onChange={e => setSelectedSubject(subjects.find(s => s.id === e.target.value) ?? subjects[0])}
                  className="input-base text-right"
                  dir="rtl"
                >
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label className="text-xs text-ink-muted mb-1 block text-right">نوع التقييم</label>
                <select
                  value={selectedType}
                  onChange={e => setSelectedType(e.target.value as GradeType)}
                  className="input-base text-right"
                  dir="rtl"
                >
                  {gradeTypes.map(t => <option key={t} value={t}>{gradeTypeLabel[t]}</option>)}
                </select>
              </div>
              <div className="w-32">
                <label className="text-xs text-ink-muted mb-1 block text-right">الدرجة الكاملة</label>
                <input
                  type="number"
                  value={maxScore}
                  onChange={e => setMaxScore(Number(e.target.value))}
                  className="input-base text-right"
                  min={1} max={1000}
                />
              </div>
            </div>

            {/* Row 2 - View Toggle */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-surface-50 border border-border rounded-xl p-1">
                <button
                  onClick={() => setView("entry")}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
                    view === "entry" ? "bg-white shadow-card text-ink" : "text-ink-muted hover:text-ink"
                  )}
                >
                  إدخال الدرجات
                </button>
                <button
                  onClick={() => setView("analytics")}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
                    view === "analytics" ? "bg-white shadow-card text-ink" : "text-ink-muted hover:text-ink"
                  )}
                >
                  التحليلات
                </button>
              </div>
              <div className="flex-1" />
              <motion.button
                className="btn-primary gap-2 text-sm"
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  const count = Object.keys(grades).length;
                  if (count === 0) { alert("لم تُدخل أي درجات بعد"); return; }
                  const btn = document.activeElement as HTMLButtonElement;
                  const originalText = btn.innerText;
                  btn.innerText = "جاري الحفظ...";
                  btn.disabled = true;
                  setTimeout(() => {
                    alert(`تم حفظ درجات ${count} طالب بنجاح في سجلات الشعبة ✓`);
                    btn.innerText = originalText;
                    btn.disabled = false;
                  }, 1000);
                }}
              >
                <Save className="w-4 h-4" />
                حفظ الدرجات
              </motion.button>
            </div>
          </div>
        </FadeIn>

        <AnimatePresence mode="wait">
          {view === "entry" ? (
            <motion.div
              key="entry"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              {/* Summary cards */}
              <Stagger className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "متوسط الدرجات", value: `${stats.avg.toFixed(1)}/${maxScore}`, icon: BarChart2, color: "text-blue-600 bg-blue-50" },
                  { label: "أعلى درجة", value: `${stats.highest}/${maxScore}`, icon: Award, color: "text-green-600 bg-green-50" },
                  { label: "أدنى درجة", value: `${stats.lowest}/${maxScore}`, icon: TrendingDown, color: "text-red-600 bg-red-50" },
                  { label: "تم إدخاله", value: `${stats.entered}/${students.length}`, icon: BookOpen, color: "text-amber-600 bg-amber-50" },
                ].map(stat => (
                  <StaggerItem key={stat.label}>
                    <div className="card-base p-4 flex items-center gap-3">
                      <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0", stat.color.split(" ")[1])}>
                        <stat.icon className={cn("w-4 h-4", stat.color.split(" ")[0])} strokeWidth={1.8} />
                      </div>
                      <div className="text-right">
                        <p className="text-base font-bold text-ink">{stat.value}</p>
                        <p className="text-xs text-ink-muted">{stat.label}</p>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>

              {/* Grade entry table */}
              <div className="card-base overflow-hidden">
                <div className="overflow-x-auto">
                <div className="min-w-[520px]">
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-5 py-3 border-b border-border bg-surface-50">
                  {["الطالب", "الدرجة", "النسبة المئوية", "التقدير"].map(h => (
                    <span key={h} className="text-[11px] font-semibold text-ink-muted uppercase tracking-wide text-right">{h}</span>
                  ))}
                </div>

                <div className="divide-y divide-border">
                  {students.map((student, i) => {
                    const grade = grades[student.id];
                    const pct = grade !== undefined ? (grade / maxScore) * 100 : null;

                    return (
                      <motion.div
                        key={student.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-5 py-3 items-center hover:bg-surface-50 transition-colors"
                      >
                        {/* Student */}
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-xs font-bold text-primary-700">{student.firstName.charAt(0)}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-ink">{student.fullName}</p>
                            <p className="text-xs text-ink-muted">{student.studentCode}</p>
                          </div>
                        </div>

                        {/* Grade input */}
                        <div>
                          <input
                            type="number"
                            value={grade ?? ""}
                            onChange={e => {
                              const val = Number(e.target.value);
                              if (val >= 0 && val <= maxScore) {
                                setGrades(prev => ({ ...prev, [student.id]: val }));
                              }
                            }}
                            placeholder={`0 - ${maxScore}`}
                            className={cn(
                              "w-full px-3 py-2 rounded-xl border text-right text-sm font-medium",
                              "bg-surface-50 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
                              "transition-all duration-200",
                              grade !== undefined && pct !== null && (
                                pct >= 90 ? "border-green-200 focus:ring-green-400" :
                                pct >= 70 ? "border-amber-200 focus:ring-amber-400" :
                                "border-red-200 focus:ring-red-400"
                              ),
                              grade === undefined && "border-border"
                            )}
                            min={0}
                            max={maxScore}
                          />
                        </div>

                        {/* Percentage */}
                        <div className="text-right">
                          {pct !== null ? (
                            <div className="flex flex-col items-end gap-1">
                              <span className={cn("text-sm font-bold", formatGradeColor(pct))}>
                                {pct.toFixed(1)}%
                              </span>
                              <div className="w-full max-w-16 h-1 bg-surface-100 rounded-full overflow-hidden">
                                <motion.div
                                  className={cn(
                                    "h-full rounded-full",
                                    pct >= 90 ? "bg-green-500" :
                                    pct >= 70 ? "bg-amber-500" : "bg-red-500"
                                  )}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-ink-subtle">—</span>
                          )}
                        </div>

                        {/* Grade label */}
                        <div className="text-right">
                          {pct !== null ? (
                            <span className={cn(
                              "badge",
                              pct >= 90 ? "bg-green-100 text-green-700" :
                              pct >= 80 ? "bg-blue-100 text-blue-700" :
                              pct >= 70 ? "bg-amber-100 text-amber-700" :
                              pct >= 60 ? "bg-orange-100 text-orange-700" :
                              "bg-red-100 text-red-700"
                            )}>
                              {formatGrade(grade, maxScore)}
                            </span>
                          ) : (
                            <span className="text-xs text-ink-subtle">لم تُدخل بعد</span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              {/* Trend Chart */}
              <div className="card-base p-5">
                <div className="text-right mb-4">
                  <h3 className="text-sm font-semibold text-ink">مسار الأداء عبر الزمن</h3>
                  <p className="text-xs text-ink-muted">مقارنة بين درجات الصف والمتوسط العام</p>
                </div>
                <AttendanceAreaChart data={trendData} />
              </div>

              {/* Student rankings */}
              <div className="card-base p-5">
                <div className="text-right mb-4">
                  <h3 className="text-sm font-semibold text-ink">ترتيب الطلاب حسب الأداء</h3>
                </div>
                <div className="space-y-3">
                  {students
                    .map(s => ({ ...s, grade: s.gpa ?? 0 }))
                    .sort((a, b) => b.grade - a.grade)
                    .map((student, i) => (
                      <div key={student.id} className="flex items-center gap-3">
                        <div className={cn(
                          "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
                          i === 0 ? "bg-amber-400 text-white" :
                          i === 1 ? "bg-gray-300 text-gray-700" :
                          i === 2 ? "bg-amber-700 text-white" :
                          "bg-surface-100 text-ink-muted"
                        )}>
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className={cn("text-sm font-semibold", formatGradeColor(student.grade))}>
                              {student.grade.toFixed(1)}%
                            </span>
                            <span className="text-sm font-medium text-ink">{student.fullName}</span>
                          </div>
                          <div className="h-1.5 bg-surface-100 rounded-full overflow-hidden">
                            <motion.div
                              className={cn(
                                "h-full rounded-full",
                                student.grade >= 90 ? "bg-green-500" :
                                student.grade >= 70 ? "bg-amber-500" : "bg-red-500"
                              )}
                              initial={{ width: 0 }}
                              animate={{ width: `${student.grade}%` }}
                              transition={{ delay: i * 0.05, duration: 0.8 }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
