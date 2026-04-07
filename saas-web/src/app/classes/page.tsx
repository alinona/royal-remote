"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap, Users, BookOpen, Plus, Eye, Edit2,
  BarChart2, Clock, MapPin,
} from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { Stagger, StaggerItem, FadeIn } from "@/components/ui/motion";
import { ScoreRing } from "@/components/ui/geometric-shapes";
import { cn } from "@/lib/utils/cn";
import { mockClasses, mockTeachers } from "@/lib/utils/mock-data";
import { gradeNameAr } from "@/lib/utils/format";

// ─── Classes Page ─────────────────────────────────────────────────────────────

export default function ClassesPage() {
  const [activeTab, setActiveTab] = useState<"classes" | "teachers">("classes");

  return (
    <AppLayout title="الصفوف والمدرسون">
      <div className="space-y-6">
        {/* Stats */}
        <Stagger className="grid grid-cols-4 gap-4">
          {[
            { label: "إجمالي الصفوف", value: mockClasses.length, icon: GraduationCap, color: "text-primary-600 bg-primary-50" },
            { label: "إجمالي المدرسين", value: mockTeachers.length, icon: Users, color: "text-blue-600 bg-blue-50" },
            { label: "المواد الدراسية", value: 12, icon: BookOpen, color: "text-green-600 bg-green-50" },
            { label: "متوسط الطلاب/صف", value: 30, icon: Users, color: "text-amber-600 bg-amber-50" },
          ].map(stat => (
            <StaggerItem key={stat.label}>
              <div className="card-base p-4 flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", stat.color.split(" ")[1])}>
                  <stat.icon className={cn("w-5 h-5", stat.color.split(" ")[0])} strokeWidth={1.8} />
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-ink">{stat.value}</p>
                  <p className="text-xs text-ink-muted">{stat.label}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Tabs */}
        <div className="flex items-center justify-between">
          <motion.button className="btn-primary gap-2 text-sm" whileTap={{ scale: 0.97 }}>
            <Plus className="w-4 h-4" />
            {activeTab === "classes" ? "صف جديد" : "مدرس جديد"}
          </motion.button>

          <div className="flex items-center gap-1 bg-surface-50 border border-border rounded-xl p-1">
            <button
              onClick={() => setActiveTab("classes")}
              className={cn(
                "px-5 py-2 rounded-lg text-sm font-medium transition-all",
                activeTab === "classes" ? "bg-white shadow-card text-ink" : "text-ink-muted hover:text-ink"
              )}
            >
              الصفوف
            </button>
            <button
              onClick={() => setActiveTab("teachers")}
              className={cn(
                "px-5 py-2 rounded-lg text-sm font-medium transition-all",
                activeTab === "teachers" ? "bg-white shadow-card text-ink" : "text-ink-muted hover:text-ink"
              )}
            >
              المدرسون
            </button>
          </div>
        </div>

        {activeTab === "classes" ? (
          <ClassesGrid />
        ) : (
          <TeachersGrid />
        )}
      </div>
    </AppLayout>
  );
}

// ─── Classes Grid ─────────────────────────────────────────────────────────────

function ClassesGrid() {
  // Group by grade
  const byGrade: Record<number, typeof mockClasses> = {};
  mockClasses.forEach(cls => {
    if (!byGrade[cls.grade]) byGrade[cls.grade] = [];
    byGrade[cls.grade].push(cls);
  });

  return (
    <div className="space-y-6">
      {Object.entries(byGrade).map(([grade, classes]) => (
        <div key={grade}>
          <h3 className="text-sm font-semibold text-ink-muted mb-3 text-right flex items-center gap-2 justify-end">
            <span className="px-2.5 py-0.5 bg-primary-50 text-primary-700 text-xs rounded-lg border border-primary-100">
              {classes.length} شعبة
            </span>
            {gradeNameAr(Number(grade))}
          </h3>
          <Stagger className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map(cls => (
              <StaggerItem key={cls.id}>
                <ClassCard cls={cls} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      ))}
    </div>
  );
}

function ClassCard({ cls }: { cls: typeof mockClasses[0] }) {
  const attendanceRate = 92;
  const avgGrade = 78;

  return (
    <motion.div
      className="card-base p-5 hover:shadow-card-hover cursor-pointer text-right group"
      whileHover={{ y: -2 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1.5 rounded-lg hover:bg-primary-50 text-ink-muted hover:text-primary-600 transition-colors">
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-amber-50 text-ink-muted hover:text-amber-600 transition-colors">
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>
        <div>
          <h3 className="text-base font-bold text-ink">{cls.name}</h3>
          <p className="text-xs text-ink-muted">{gradeNameAr(cls.grade)}</p>
        </div>
      </div>

      {/* Score rings */}
      <div className="flex items-center justify-around mb-4">
        <div className="text-center">
          <ScoreRing value={attendanceRate} size={60} strokeWidth={5} label="حضور" color="hsl(142 70% 40%)" />
        </div>
        <div className="text-center">
          <ScoreRing value={avgGrade} size={60} strokeWidth={5} label="معدل" color="hsl(232 76% 55%)" />
        </div>
      </div>

      {/* Info */}
      <div className="space-y-1.5 text-right">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-ink">{cls.studentsCount}</span>
          <span className="text-xs text-ink-muted flex items-center gap-1">
            <Users className="w-3 h-3" />
            طلاب
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-ink truncate max-w-24">{cls.teacher.fullName}</span>
          <span className="text-xs text-ink-muted flex items-center gap-1">
            <GraduationCap className="w-3 h-3" />
            المعلم
          </span>
        </div>
        {cls.room && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-ink">{cls.room}</span>
            <span className="text-xs text-ink-muted flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              القاعة
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Teachers Grid ────────────────────────────────────────────────────────────

function TeachersGrid() {
  return (
    <Stagger className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {mockTeachers.map(teacher => (
        <StaggerItem key={teacher.id}>
          <motion.div
            className="card-base p-5 hover:shadow-card-hover cursor-pointer text-right group"
            whileHover={{ y: -2 }}
          >
            {/* Avatar */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 rounded-lg hover:bg-primary-50 text-ink-muted hover:text-primary-600 transition-colors">
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-amber-50 text-ink-muted hover:text-amber-600 transition-colors">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <h3 className="text-sm font-bold text-ink">{teacher.fullName}</h3>
                  <p className="text-xs text-ink-muted">{teacher.specialization}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                  <span className="text-base font-bold text-primary-700">{teacher.firstName.charAt(0)}</span>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between mb-4">
              <span className={cn(
                "badge text-[11px]",
                teacher.status === "active" ? "bg-green-100 text-green-700" :
                teacher.status === "on_leave" ? "bg-amber-100 text-amber-700" :
                "bg-surface-100 text-ink-muted"
              )}>
                {teacher.status === "active" ? "نشط" : teacher.status === "on_leave" ? "في إجازة" : "غير نشط"}
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border">
              {[
                { label: "صفوف", value: mockClasses.filter(c => c.teacherId === teacher.id).length, icon: GraduationCap },
                { label: "طلاب", value: mockClasses.filter(c => c.teacherId === teacher.id).reduce((a, c) => a + c.studentsCount, 0), icon: Users },
                { label: "مواد", value: 3, icon: BookOpen },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <p className="text-base font-bold text-ink">{stat.value}</p>
                  <p className="text-[10px] text-ink-subtle">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Qualifications */}
            <div className="mt-3 flex flex-wrap gap-1 justify-end">
              {teacher.qualifications.map(q => (
                <span key={q} className="badge-neutral text-[10px]">{q}</span>
              ))}
            </div>
          </motion.div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
