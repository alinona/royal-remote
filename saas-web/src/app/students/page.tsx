"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Plus, Filter, Download, Upload, Eye, Edit2,
  Trash2, ChevronDown, Users, TrendingUp, AlertTriangle,
  CheckCircle, X, SlidersHorizontal, Grid, List, Save,
} from "lucide-react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { Stagger, StaggerItem, FadeIn } from "@/components/ui/motion";
import { ScoreRing } from "@/components/ui/geometric-shapes";
import { cn } from "@/lib/utils/cn";
import {
  mockStudents as _mockStudents, mockClasses,
} from "@/lib/utils/mock-data";
import {
  formatDate, studentStatusLabel, riskLevelColor, riskLevelLabel,
  formatPercent,
} from "@/lib/utils/format";
import type { Student, StudentStatus } from "@/types";

// ─── Students Page ────────────────────────────────────────────────────────────

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>(_mockStudents);
  const [view, setView] = useState<"grid" | "list">("list");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StudentStatus | "all">("all");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [deleteStudent, setDeleteStudent] = useState<Student | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return students.filter(s => {
      const matchSearch = !search ||
        s.fullName.includes(search) ||
        s.studentCode.includes(search) ||
        s.nationalId.includes(search);
      const matchStatus = statusFilter === "all" || s.status === statusFilter;
      const matchClass = classFilter === "all" || s.classId === classFilter;
      const matchRisk = riskFilter === "all" || s.riskLevel === riskFilter;
      return matchSearch && matchStatus && matchClass && matchRisk;
    });
  }, [students, search, statusFilter, classFilter, riskFilter]);

  const handleDelete = (student: Student) => {
    setStudents(prev => prev.filter(s => s.id !== student.id));
    setDeleteStudent(null);
    if (selectedStudent?.id === student.id) setSelectedStudent(null);
  };

  const handleEditSave = (updated: Student) => {
    setStudents(prev => prev.map(s => s.id === updated.id ? updated : s));
    setEditStudent(null);
    if (selectedStudent?.id === updated.id) setSelectedStudent(updated);
  };

  return (
    <AppLayout title="إدارة الطلاب">
      <div className="space-y-6">
        {/* Stats Row */}
        <Stagger className="grid grid-cols-4 gap-4">
          {[
            { label: "إجمالي الطلاب", value: students.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "طلاب نشطون", value: students.filter(s => s.status === "active").length, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
            { label: "في خطر", value: students.filter(s => s.riskLevel === "high").length, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
            { label: "متوسط الغياب", value: "7.6%", icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
          ].map((stat, i) => (
            <StaggerItem key={stat.label}>
              <div className="card-base p-4 flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", stat.bg)}>
                  <stat.icon className={cn("w-5 h-5", stat.color)} strokeWidth={1.8} />
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-ink">{stat.value}</p>
                  <p className="text-xs text-ink-muted">{stat.label}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Toolbar */}
        <div className="card-base p-4">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="flex-1 relative min-w-48">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="ابحث بالاسم أو الرقم الوطني أو كود الطالب..."
                className="input-base pr-10 text-right"
                dir="rtl"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter toggle */}
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "btn-secondary gap-2",
                showFilters && "bg-primary-50 border-primary-200 text-primary-700"
              )}
              whileTap={{ scale: 0.97 }}
            >
              <SlidersHorizontal className="w-4 h-4" />
              تصفية
              {(statusFilter !== "all" || classFilter !== "all" || riskFilter !== "all") && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </motion.button>

            {/* View toggle */}
            <div className="flex items-center gap-1 bg-surface-50 border border-border rounded-xl p-1">
              <button
                onClick={() => setView("list")}
                className={cn(
                  "p-1.5 rounded-lg transition-all",
                  view === "list" ? "bg-white shadow-card text-ink" : "text-ink-muted hover:text-ink"
                )}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView("grid")}
                className={cn(
                  "p-1.5 rounded-lg transition-all",
                  view === "grid" ? "bg-white shadow-card text-ink" : "text-ink-muted hover:text-ink"
                )}
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-shrink-0 flex gap-2">
              <motion.button
                className="btn-secondary gap-2"
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  const header = "الاسم,الكود,الصف,الحالة,المعدل,الحضور\n";
                  const rows = students.map(s =>
                    `${s.fullName},${s.studentCode},${s.class.name},${studentStatusLabel[s.status]},${s.gpa?.toFixed(1) ?? ""}%,${s.attendanceRate ?? ""}%`
                  ).join("\n");
                  const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + header + rows;
                  const link = document.createElement("a");
                  link.setAttribute("href", encodeURI(csvContent));
                  link.setAttribute("download", "students_report.csv");
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                <Download className="w-4 h-4" />
                تصدير
              </motion.button>
              <motion.button
                className="btn-secondary gap-2"
                whileTap={{ scale: 0.97 }}
                onClick={() => alert("سيتم تفعيل خاصية الاستيراد من ملفات Excel قريباً")}
              >
                <Upload className="w-4 h-4" />
                استيراد
              </motion.button>
              <Link href="/students/new">
                <motion.button className="btn-primary gap-2" whileTap={{ scale: 0.97 }}>
                  <Plus className="w-4 h-4" />
                  طالب جديد
                </motion.button>
              </Link>
            </div>
          </div>

          {/* Expanded filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border flex-wrap">
                  <FilterSelect
                    label="الحالة"
                    value={statusFilter}
                    onChange={v => setStatusFilter(v as StudentStatus | "all")}
                    options={[
                      { value: "all", label: "جميع الحالات" },
                      { value: "active", label: "نشط" },
                      { value: "inactive", label: "غير نشط" },
                      { value: "graduated", label: "خريج" },
                      { value: "transferred", label: "منقول" },
                    ]}
                  />
                  <FilterSelect
                    label="الشعبة"
                    value={classFilter}
                    onChange={setClassFilter}
                    options={[
                      { value: "all", label: "جميع الشعب" },
                      ...mockClasses.map(c => ({ value: c.id, label: c.name })),
                    ]}
                  />
                  <FilterSelect
                    label="مستوى الخطر"
                    value={riskFilter}
                    onChange={setRiskFilter}
                    options={[
                      { value: "all", label: "جميع المستويات" },
                      { value: "high", label: "مرتفع" },
                      { value: "medium", label: "متوسط" },
                      { value: "low", label: "منخفض" },
                    ]}
                  />

                  {(statusFilter !== "all" || classFilter !== "all" || riskFilter !== "all") && (
                    <button
                      onClick={() => { setStatusFilter("all"); setClassFilter("all"); setRiskFilter("all"); }}
                      className="flex items-center gap-1 text-xs text-danger hover:underline"
                    >
                      <X className="w-3 h-3" />
                      مسح الفلاتر
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-ink-muted">
            {search && <span>نتائج البحث عن &quot;{search}&quot;: </span>}
          </div>
          <p className="text-sm text-ink-muted">
            عرض <span className="font-semibold text-ink">{filtered.length}</span> طالب
          </p>
        </div>

        {/* Student List */}
        {view === "list" ? (
          <StudentListView
            students={filtered}
            onSelect={setSelectedStudent}
            onEdit={setEditStudent}
            onDelete={setDeleteStudent}
          />
        ) : (
          <StudentGridView students={filtered} onSelect={setSelectedStudent} />
        )}
      </div>

      {/* Student Profile Drawer */}
      <AnimatePresence>
        {selectedStudent && (
          <StudentProfileDrawer
            student={selectedStudent}
            onClose={() => setSelectedStudent(null)}
            onEdit={() => { setEditStudent(selectedStudent); setSelectedStudent(null); }}
          />
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editStudent && (
          <EditStudentModal
            student={editStudent}
            onClose={() => setEditStudent(null)}
            onSave={handleEditSave}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteStudent && (
          <DeleteConfirmModal
            student={deleteStudent}
            onClose={() => setDeleteStudent(null)}
            onConfirm={() => handleDelete(deleteStudent)}
          />
        )}
      </AnimatePresence>
    </AppLayout>
  );
}

// ─── Filter Select ────────────────────────────────────────────────────────────

function FilterSelect({
  label, value, onChange, options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={cn(
          "input-base py-2 pr-3 pl-8 text-right appearance-none cursor-pointer",
          "min-w-32"
        )}
        dir="rtl"
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronDown className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-subtle pointer-events-none" />
    </div>
  );
}

// ─── Student List View ────────────────────────────────────────────────────────

function StudentListView({
  students, onSelect, onEdit, onDelete,
}: {
  students: Student[];
  onSelect: (s: Student) => void;
  onEdit: (s: Student) => void;
  onDelete: (s: Student) => void;
}) {
  if (students.length === 0) {
    return (
      <FadeIn>
        <div className="card-base p-12 text-center">
          <Users className="w-12 h-12 text-ink-subtle mx-auto mb-3 opacity-40" />
          <p className="text-ink-muted text-sm">لا توجد نتائج مطابقة</p>
        </div>
      </FadeIn>
    );
  }

  return (
    <div className="card-base overflow-hidden">
      {/* Table header */}
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_120px] gap-4 px-5 py-3 border-b border-border bg-surface-50">
        {["الطالب", "الصف", "الحضور", "المعدل", "الخطر", "إجراءات"].map(h => (
          <span key={h} className="text-[11px] font-semibold text-ink-muted uppercase tracking-wide text-right">
            {h}
          </span>
        ))}
      </div>

      <div className="divide-y divide-border">
        {students.map((student, i) => (
          <StudentRow
            key={student.id}
            student={student}
            index={i}
            onSelect={onSelect}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

function StudentRow({
  student, index, onSelect, onEdit, onDelete,
}: {
  student: Student;
  index: number;
  onSelect: (s: Student) => void;
  onEdit: (s: Student) => void;
  onDelete: (s: Student) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_120px] gap-4 px-5 py-3.5 hover:bg-surface-50 transition-colors group items-center"
    >
      {/* Student info */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-bold text-primary-700">{student.firstName.charAt(0)}</span>
        </div>
        <div className="text-right min-w-0">
          <p className="text-sm font-semibold text-ink truncate">{student.fullName}</p>
          <p className="text-xs text-ink-muted">{student.studentCode}</p>
        </div>
      </div>

      {/* Class */}
      <div className="text-right">
        <span className="text-xs font-medium text-ink">{student.class.name}</span>
      </div>

      {/* Attendance */}
      <div className="flex items-center justify-end">
        <span className={cn(
          "text-sm font-bold",
          (student.attendanceRate ?? 0) >= 90 ? "text-green-600" :
          (student.attendanceRate ?? 0) >= 75 ? "text-amber-600" : "text-red-600"
        )}>
          {formatPercent(student.attendanceRate ?? 0)}
        </span>
      </div>

      {/* GPA */}
      <div className="text-right">
        <span className={cn(
          "text-sm font-bold",
          (student.gpa ?? 0) >= 90 ? "text-green-600" :
          (student.gpa ?? 0) >= 70 ? "text-amber-600" : "text-red-600"
        )}>
          {student.gpa?.toFixed(1)}%
        </span>
      </div>

      {/* Risk */}
      <div className="text-right">
        <span className={cn("badge", riskLevelColor[student.riskLevel ?? "low"])}>
          {riskLevelLabel[student.riskLevel ?? "low"]}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 justify-start opacity-0 group-hover:opacity-100 transition-opacity">
        <motion.button
          onClick={() => onSelect(student)}
          className="p-1.5 rounded-lg hover:bg-primary-50 text-ink-muted hover:text-primary-600 transition-colors"
          whileTap={{ scale: 0.9 }}
          title="عرض الملف"
        >
          <Eye className="w-3.5 h-3.5" />
        </motion.button>
        <motion.button
          onClick={() => onEdit(student)}
          className="p-1.5 rounded-lg hover:bg-amber-50 text-ink-muted hover:text-amber-600 transition-colors"
          whileTap={{ scale: 0.9 }}
          title="تعديل"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </motion.button>
        <motion.button
          onClick={() => onDelete(student)}
          className="p-1.5 rounded-lg hover:bg-red-50 text-ink-muted hover:text-red-600 transition-colors"
          whileTap={{ scale: 0.9 }}
          title="حذف"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Student Grid View ────────────────────────────────────────────────────────

function StudentGridView({ students, onSelect }: { students: Student[]; onSelect: (s: Student) => void }) {
  return (
    <Stagger className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {students.map((student) => (
        <StaggerItem key={student.id}>
          <motion.div
            className="card-base p-5 cursor-pointer hover:shadow-card-hover text-right"
            whileHover={{ y: -3 }}
            onClick={() => onSelect(student)}
          >
            {/* Avatar */}
            <div className="flex items-center gap-3 mb-4">
              <span className={cn("badge text-[10px]", riskLevelColor[student.riskLevel ?? "low"])}>
                {riskLevelLabel[student.riskLevel ?? "low"]}
              </span>
              <div className="ml-auto" />
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-base font-bold text-primary-700">{student.firstName.charAt(0)}</span>
              </div>
            </div>

            <h3 className="text-sm font-bold text-ink">{student.fullName}</h3>
            <p className="text-xs text-ink-muted mt-0.5">{student.class.name}</p>
            <p className="text-[11px] text-ink-subtle mt-0.5">{student.studentCode}</p>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="text-center">
                <p className={cn(
                  "text-base font-bold",
                  (student.gpa ?? 0) >= 80 ? "text-green-600" : "text-amber-600"
                )}>
                  {student.gpa?.toFixed(0)}%
                </p>
                <p className="text-[10px] text-ink-subtle">المعدل</p>
              </div>
              <div className="text-center">
                <p className={cn(
                  "text-base font-bold",
                  (student.attendanceRate ?? 0) >= 90 ? "text-green-600" : "text-amber-600"
                )}>
                  {student.attendanceRate}%
                </p>
                <p className="text-[10px] text-ink-subtle">الحضور</p>
              </div>
            </div>
          </motion.div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

// ─── Student Profile Drawer ───────────────────────────────────────────────────

function StudentProfileDrawer({
  student, onClose, onEdit,
}: {
  student: Student;
  onClose: () => void;
  onEdit: () => void;
}) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-ink/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed left-0 inset-y-0 z-50 w-full max-w-md",
          "bg-card shadow-card-hover border-r border-border",
          "overflow-y-auto"
        )}
        dir="rtl"
      >
        {/* Header */}
        <div className="relative h-32 bg-gradient-to-l from-primary-700 to-primary-500 p-5 flex items-end">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-1.5 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-4 w-full">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-white">{student.firstName.charAt(0)}</span>
            </div>
            <div className="text-right">
              <h2 className="text-lg font-bold text-white">{student.fullName}</h2>
              <p className="text-sm text-white/70">{student.studentCode} · {student.class.name}</p>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium mt-1 bg-white/20 text-white">
                {studentStatusLabel[student.status]}
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5">
          {/* Score Rings */}
          <div className="flex items-center justify-around">
            <div className="text-center">
              <ScoreRing
                value={student.gpa ?? 0}
                size={80}
                strokeWidth={6}
                color={
                  (student.gpa ?? 0) >= 90 ? "#10b981" :
                  (student.gpa ?? 0) >= 70 ? "#f59e0b" : "#ef4444"
                }
              />
              <p className="text-xs text-ink-muted mt-1">المعدل التراكمي</p>
            </div>
            <div className="text-center">
              <ScoreRing
                value={student.attendanceRate ?? 0}
                size={80}
                strokeWidth={6}
                color={
                  (student.attendanceRate ?? 0) >= 90 ? "#10b981" :
                  (student.attendanceRate ?? 0) >= 75 ? "#f59e0b" : "#ef4444"
                }
              />
              <p className="text-xs text-ink-muted mt-1">نسبة الحضور</p>
            </div>
            <div className="text-center">
              <ScoreRing
                value={student.behaviorScore ?? 0}
                size={80}
                strokeWidth={6}
                color="hsl(268 85% 64%)"
              />
              <p className="text-xs text-ink-muted mt-1">السلوك</p>
            </div>
          </div>

          {/* Info Grid */}
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-ink mb-3">معلومات الطالب</h3>
            {[
              { label: "الرقم الوطني", value: student.nationalId },
              { label: "تاريخ الميلاد", value: formatDate(student.dateOfBirth) },
              { label: "تاريخ التسجيل", value: formatDate(student.enrollmentDate) },
              { label: "الجنس", value: student.gender === "male" ? "ذكر" : "أنثى" },
              { label: "العنوان", value: student.address },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-sm text-ink">{value}</span>
                <span className="text-xs text-ink-muted">{label}</span>
              </div>
            ))}
          </div>

          {/* Guardian Info */}
          <div>
            <h3 className="text-sm font-semibold text-ink mb-3">ولي الأمر</h3>
            <div className="bg-surface-50 rounded-xl p-4 text-right space-y-2">
              {[
                { label: "الاسم", value: student.guardianName },
                { label: "الصلة", value: student.guardianRelation },
                { label: "الهاتف", value: student.guardianPhone },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-sm text-ink">{value}</span>
                  <span className="text-xs text-ink-muted">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Risk level */}
          <div className={cn(
            "p-4 rounded-xl border text-right",
            student.riskLevel === "high" ? "bg-red-50 border-red-200" :
            student.riskLevel === "medium" ? "bg-amber-50 border-amber-200" :
            "bg-green-50 border-green-200"
          )}>
            <div className="flex items-center justify-between">
              <span className={cn("badge", riskLevelColor[student.riskLevel ?? "low"])}>
                {riskLevelLabel[student.riskLevel ?? "low"]}
              </span>
              <p className="text-sm font-semibold text-ink">مستوى الخطر الأكاديمي</p>
            </div>
            {student.riskLevel === "high" && (
              <p className="text-xs text-red-600 mt-2">
                يحتاج هذا الطالب متابعة فورية. يُنصح بالتواصل مع ولي الأمر وتقديم دعم أكاديمي إضافي.
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={onEdit} className="btn-secondary flex-1 text-sm">تعديل البيانات</button>
            <button
              onClick={onClose}
              className="btn-primary flex-1 text-sm"
            >
              إغلاق الملف
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ─── Edit Student Modal ───────────────────────────────────────────────────────

function EditStudentModal({
  student, onClose, onSave,
}: {
  student: Student;
  onClose: () => void;
  onSave: (s: Student) => void;
}) {
  const [form, setForm] = useState({
    firstName: student.firstName,
    lastName: student.lastName,
    guardianName: student.guardianName,
    guardianPhone: student.guardianPhone,
    guardianRelation: student.guardianRelation,
    address: student.address,
    status: student.status,
    classId: student.classId,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      const cls = mockClasses.find(c => c.id === form.classId) ?? student.class;
      const updated: Student = {
        ...student,
        ...form,
        fullName: `${form.firstName} ${form.lastName}`,
        class: cls,
        updatedAt: new Date(),
      };
      setSaving(false);
      onSave(updated);
    }, 800);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-4 top-16 bottom-4 z-50 max-w-xl mx-auto bg-card rounded-2xl border border-border shadow-card-hover overflow-y-auto"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-card z-10">
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-50 text-ink-muted">
            <X className="w-4 h-4" />
          </button>
          <h2 className="text-base font-bold text-ink">تعديل بيانات الطالب</h2>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-ink-muted mb-1.5 text-right">الاسم الأول</label>
              <input
                value={form.firstName}
                onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                className="input-base text-right"
                dir="rtl"
              />
            </div>
            <div>
              <label className="block text-xs text-ink-muted mb-1.5 text-right">اسم العائلة</label>
              <input
                value={form.lastName}
                onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                className="input-base text-right"
                dir="rtl"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-ink-muted mb-1.5 text-right">الصف</label>
            <select
              value={form.classId}
              onChange={e => setForm(f => ({ ...f, classId: e.target.value }))}
              className="input-base text-right"
              dir="rtl"
            >
              {mockClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs text-ink-muted mb-1.5 text-right">الحالة</label>
            <select
              value={form.status}
              onChange={e => setForm(f => ({ ...f, status: e.target.value as StudentStatus }))}
              className="input-base text-right"
              dir="rtl"
            >
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
              <option value="graduated">خريج</option>
              <option value="transferred">منقول</option>
              <option value="suspended">موقوف</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-ink-muted mb-1.5 text-right">العنوان</label>
            <input
              value={form.address}
              onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
              className="input-base text-right"
              dir="rtl"
            />
          </div>

          <div className="pt-2 border-t border-border">
            <p className="text-sm font-semibold text-ink mb-3 text-right">بيانات ولي الأمر</p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-ink-muted mb-1.5 text-right">اسم ولي الأمر</label>
                <input
                  value={form.guardianName}
                  onChange={e => setForm(f => ({ ...f, guardianName: e.target.value }))}
                  className="input-base text-right"
                  dir="rtl"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-ink-muted mb-1.5 text-right">صلة القرابة</label>
                  <select
                    value={form.guardianRelation}
                    onChange={e => setForm(f => ({ ...f, guardianRelation: e.target.value }))}
                    className="input-base text-right"
                    dir="rtl"
                  >
                    <option value="أب">أب</option>
                    <option value="أم">أم</option>
                    <option value="أخ">أخ</option>
                    <option value="أخت">أخت</option>
                    <option value="جد">جد</option>
                    <option value="أخرى">أخرى</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-ink-muted mb-1.5 text-right">رقم الهاتف</label>
                  <input
                    value={form.guardianPhone}
                    onChange={e => setForm(f => ({ ...f, guardianPhone: e.target.value }))}
                    className="input-base text-right"
                    dir="rtl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex items-center justify-between gap-3">
          <button onClick={onClose} className="btn-secondary text-sm">إلغاء</button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary gap-2 text-sm min-w-32 justify-center"
          >
            {saving ? (
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                جارٍ الحفظ...
              </div>
            ) : (
              <>
                <Save className="w-4 h-4" />
                حفظ التعديلات
              </>
            )}
          </button>
        </div>
      </motion.div>
    </>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────

function DeleteConfirmModal({
  student, onClose, onConfirm,
}: {
  student: Student;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.25 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm bg-card rounded-2xl border border-border shadow-card-hover p-6 text-center"
        dir="rtl"
      >
        <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-7 h-7 text-red-600" />
        </div>
        <h3 className="text-base font-bold text-ink mb-2">حذف الطالب</h3>
        <p className="text-sm text-ink-muted mb-1">
          هل أنت متأكد من حذف بيانات الطالب
        </p>
        <p className="text-sm font-semibold text-ink mb-4">{student.fullName}؟</p>
        <p className="text-xs text-red-500 mb-5">هذا الإجراء لا يمكن التراجع عنه.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1 text-sm">إلغاء</button>
          <button
            onClick={onConfirm}
            className="flex-1 btn-primary bg-red-600 hover:bg-red-700 border-red-600 hover:border-red-700 text-sm"
          >
            نعم، احذف
          </button>
        </div>
      </motion.div>
    </>
  );
}
