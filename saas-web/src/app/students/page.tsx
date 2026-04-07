"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Plus, Filter, Download, Upload, Eye, Edit2,
  Trash2, ChevronDown, Users, TrendingUp, AlertTriangle,
  CheckCircle, X, SlidersHorizontal, Grid, List, Save,
} from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { Stagger, StaggerItem, FadeIn } from "@/components/ui/motion";
import { ScoreRing } from "@/components/ui/geometric-shapes";
import { cn } from "@/lib/utils/cn";
import {
  mockStudents, mockClasses,
} from "@/lib/utils/mock-data";
import {
  formatDate, studentStatusLabel, riskLevelColor, riskLevelLabel,
  formatPercent,
} from "@/lib/utils/format";
import type { Student, StudentStatus } from "@/types";

// ─── Students Page ────────────────────────────────────────────────────────────

export default function StudentsPage() {
  const [view, setView] = useState<"grid" | "list">("list");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StudentStatus | "all">("all");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Student | null>(null);

  const filtered = useMemo(() => {
    return mockStudents.filter(s => {
      const matchSearch = !search ||
        s.fullName.includes(search) ||
        s.studentCode.includes(search) ||
        s.nationalId.includes(search);
      const matchStatus = statusFilter === "all" || s.status === statusFilter;
      const matchClass = classFilter === "all" || s.classId === classFilter;
      const matchRisk = riskFilter === "all" || s.riskLevel === riskFilter;
      return matchSearch && matchStatus && matchClass && matchRisk;
    });
  }, [search, statusFilter, classFilter, riskFilter]);

  return (
    <AppLayout title="إدارة الطلاب">
      <div className="space-y-5">
        {/* Stats Row */}
        <Stagger className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            { label: "إجمالي الطلاب", value: mockStudents.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "طلاب نشطون", value: mockStudents.filter(s => s.status === "active").length, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
            { label: "في خطر", value: mockStudents.filter(s => s.riskLevel === "high").length, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
            { label: "متوسط الغياب", value: "7.6%", icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
          ].map((stat, i) => (
            <StaggerItem key={stat.label}>
              <div className="card-base p-3 md:p-4 flex items-center gap-3">
                <div className={cn("w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center flex-shrink-0", stat.bg)}>
                  <stat.icon className={cn("w-4 h-4 md:w-5 md:h-5", stat.color)} strokeWidth={1.8} />
                </div>
                <div className="text-right min-w-0">
                  <p className="text-lg md:text-xl font-bold text-ink">{stat.value}</p>
                  <p className="text-[11px] md:text-xs text-ink-muted leading-tight">{stat.label}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Toolbar */}
        <div className="card-base p-3 md:p-4">
          <div className="flex items-center gap-2 md:gap-3 flex-wrap">
            {/* Search */}
            <div className="flex-1 relative min-w-40">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="ابحث بالاسم أو الرقم الوطني..."
                className="input-base pr-9 text-right text-sm"
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
                "btn-secondary gap-1.5 text-sm px-3",
                showFilters && "bg-primary-50 border-primary-200 text-primary-700"
              )}
              whileTap={{ scale: 0.97 }}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">تصفية</span>
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
                className="btn-secondary gap-1.5 text-sm px-3"
                whileTap={{ scale: 0.97 }}
                onClick={() => alert("سيتم تصدير البيانات إلى ملف Excel")}
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">تصدير</span>
              </motion.button>
              <motion.button
                className="btn-primary gap-1.5 text-sm px-3"
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowAddModal(true)}
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">طالب جديد</span>
              </motion.button>
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
                <div className="flex items-center gap-2 md:gap-3 mt-3 pt-3 border-t border-border flex-wrap">
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
                    label="الصف"
                    value={classFilter}
                    onChange={setClassFilter}
                    options={[
                      { value: "all", label: "جميع الصفوف" },
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
            onDelete={setDeleteConfirm}
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
          />
        )}
      </AnimatePresence>

      {/* Add Student Modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddStudentModal onClose={() => setShowAddModal(false)} />
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <DeleteConfirmModal
            student={deleteConfirm}
            onClose={() => setDeleteConfirm(null)}
            onConfirm={() => {
              // In real app: delete student from state/DB
              setDeleteConfirm(null);
            }}
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
          "min-w-28 text-sm"
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
  students,
  onSelect,
  onDelete,
}: {
  students: Student[];
  onSelect: (s: Student) => void;
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
      {/* Scrollable wrapper for mobile */}
      <div className="overflow-x-auto">
        {/* Table header */}
        <div className="min-w-[600px]">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_100px] gap-3 px-4 py-3 border-b border-border bg-surface-50">
            {["الطالب", "الصف", "الحضور", "المعدل", "الخطر", "إجراءات"].map(h => (
              <span key={h} className="text-[11px] font-semibold text-ink-muted uppercase tracking-wide text-right">
                {h}
              </span>
            ))}
          </div>

          <div className="divide-y divide-border">
            {students.map((student, i) => (
              <StudentRow key={student.id} student={student} index={i} onSelect={onSelect} onDelete={onDelete} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentRow({
  student,
  index,
  onSelect,
  onDelete,
}: {
  student: Student;
  index: number;
  onSelect: (s: Student) => void;
  onDelete: (s: Student) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      className="min-w-[600px] grid grid-cols-[2fr_1fr_1fr_1fr_1fr_100px] gap-3 px-4 py-3.5 hover:bg-surface-50 transition-colors group items-center"
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
      <div className="text-right">
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
        <span className={cn("badge text-[10px]", riskLevelColor[student.riskLevel ?? "low"])}>
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
          onClick={() => onSelect(student)}
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
            className="card-base p-4 cursor-pointer hover:shadow-card-hover text-right"
            whileHover={{ y: -3 }}
            onClick={() => onSelect(student)}
          >
            {/* Avatar */}
            <div className="flex items-center gap-2 mb-3">
              <span className={cn("badge text-[10px]", riskLevelColor[student.riskLevel ?? "low"])}>
                {riskLevelLabel[student.riskLevel ?? "low"]}
              </span>
              <div className="mr-auto" />
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-sm font-bold text-primary-700">{student.firstName.charAt(0)}</span>
              </div>
            </div>

            <h3 className="text-sm font-bold text-ink truncate">{student.fullName}</h3>
            <p className="text-xs text-ink-muted mt-0.5">{student.class.name}</p>
            <p className="text-[11px] text-ink-subtle mt-0.5">{student.studentCode}</p>

            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-border">
              <div className="text-center">
                <p className={cn(
                  "text-sm font-bold",
                  (student.gpa ?? 0) >= 80 ? "text-green-600" : "text-amber-600"
                )}>
                  {student.gpa?.toFixed(0)}%
                </p>
                <p className="text-[10px] text-ink-subtle">المعدل</p>
              </div>
              <div className="text-center">
                <p className={cn(
                  "text-sm font-bold",
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

function StudentProfileDrawer({ student, onClose }: { student: Student; onClose: () => void }) {
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
        <div className="sticky top-0 z-10">
          <div className="relative h-28 md:h-32 bg-gradient-to-l from-primary-700 to-primary-500 p-4 md:p-5 flex items-end">
            <button
              onClick={onClose}
              className="absolute top-4 left-4 p-1.5 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 md:gap-4 w-full">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
                <span className="text-xl md:text-2xl font-bold text-white">{student.firstName.charAt(0)}</span>
              </div>
              <div className="text-right flex-1 min-w-0">
                <h2 className="text-base md:text-lg font-bold text-white truncate">{student.fullName}</h2>
                <p className="text-xs md:text-sm text-white/70 truncate">{student.studentCode} · {student.class.name}</p>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium mt-1 bg-white/20 text-white">
                  {studentStatusLabel[student.status]}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 md:p-5 space-y-4 md:space-y-5">
          {/* Score Rings */}
          <div className="flex items-center justify-around">
            {[
              { value: student.gpa ?? 0, label: "المعدل", color: (student.gpa ?? 0) >= 90 ? "#10b981" : (student.gpa ?? 0) >= 70 ? "#f59e0b" : "#ef4444" },
              { value: student.attendanceRate ?? 0, label: "الحضور", color: (student.attendanceRate ?? 0) >= 90 ? "#10b981" : (student.attendanceRate ?? 0) >= 75 ? "#f59e0b" : "#ef4444" },
              { value: student.behaviorScore ?? 0, label: "السلوك", color: "hsl(268 85% 64%)" },
            ].map(ring => (
              <div key={ring.label} className="text-center">
                <ScoreRing value={ring.value} size={72} strokeWidth={6} color={ring.color} />
                <p className="text-xs text-ink-muted mt-1">{ring.label}</p>
              </div>
            ))}
          </div>

          {/* Info Grid */}
          <div>
            <h3 className="text-sm font-semibold text-ink mb-3">معلومات الطالب</h3>
            <div className="space-y-0">
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
          <div className="flex gap-3 pb-4">
            <button
              className="btn-secondary flex-1 text-sm"
              onClick={onClose}
            >
              إغلاق
            </button>
            <button
              className="btn-primary flex-1 text-sm"
              onClick={onClose}
            >
              عرض الملف الكامل
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ─── Add Student Modal ────────────────────────────────────────────────────────

function AddStudentModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    nationalId: "",
    dateOfBirth: "",
    gender: "male",
    classId: mockClasses[0]?.id ?? "",
    guardianName: "",
    guardianPhone: "",
    address: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    if (!form.firstName || !form.lastName || !form.nationalId) {
      alert("يرجى ملء الحقول المطلوبة: الاسم الأول واسم العائلة والرقم الوطني");
      return;
    }
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1500);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed inset-x-4 top-1/2 -translate-y-1/2 z-50",
          "md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg",
          "bg-card rounded-2xl border border-border shadow-card-hover",
          "max-h-[90vh] overflow-y-auto"
        )}
        dir="rtl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card z-10">
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-50 text-ink-muted hover:text-ink transition-colors">
            <X className="w-4 h-4" />
          </button>
          <div className="text-right">
            <h2 className="text-base font-bold text-ink">إضافة طالب جديد</h2>
            <p className="text-xs text-ink-muted">أدخل بيانات الطالب الجديد</p>
          </div>
        </div>

        {/* Form */}
        <div className="p-5 space-y-4">
          {/* Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-ink-muted mb-1 block text-right">اسم العائلة *</label>
              <input
                value={form.lastName}
                onChange={e => update("lastName", e.target.value)}
                placeholder="السلمي"
                className="input-base text-right text-sm"
                dir="rtl"
              />
            </div>
            <div>
              <label className="text-xs text-ink-muted mb-1 block text-right">الاسم الأول *</label>
              <input
                value={form.firstName}
                onChange={e => update("firstName", e.target.value)}
                placeholder="محمد"
                className="input-base text-right text-sm"
                dir="rtl"
              />
            </div>
          </div>

          {/* National ID */}
          <div>
            <label className="text-xs text-ink-muted mb-1 block text-right">الرقم الوطني *</label>
            <input
              value={form.nationalId}
              onChange={e => update("nationalId", e.target.value)}
              placeholder="1234567890"
              className="input-base text-right text-sm"
              dir="rtl"
              maxLength={10}
            />
          </div>

          {/* DOB & Gender */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-ink-muted mb-1 block text-right">الجنس</label>
              <select
                value={form.gender}
                onChange={e => update("gender", e.target.value)}
                className="input-base text-right text-sm appearance-none"
                dir="rtl"
              >
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-ink-muted mb-1 block text-right">تاريخ الميلاد</label>
              <input
                type="date"
                value={form.dateOfBirth}
                onChange={e => update("dateOfBirth", e.target.value)}
                className="input-base text-right text-sm"
              />
            </div>
          </div>

          {/* Class */}
          <div>
            <label className="text-xs text-ink-muted mb-1 block text-right">الصف الدراسي</label>
            <select
              value={form.classId}
              onChange={e => update("classId", e.target.value)}
              className="input-base text-right text-sm appearance-none"
              dir="rtl"
            >
              {mockClasses.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Guardian */}
          <div className="border-t border-border pt-4">
            <h3 className="text-sm font-semibold text-ink mb-3 text-right">معلومات ولي الأمر</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-ink-muted mb-1 block text-right">اسم ولي الأمر</label>
                <input
                  value={form.guardianName}
                  onChange={e => update("guardianName", e.target.value)}
                  placeholder="عبدالله السلمي"
                  className="input-base text-right text-sm"
                  dir="rtl"
                />
              </div>
              <div>
                <label className="text-xs text-ink-muted mb-1 block text-right">رقم الجوال</label>
                <input
                  value={form.guardianPhone}
                  onChange={e => update("guardianPhone", e.target.value)}
                  placeholder="05XXXXXXXX"
                  className="input-base text-right text-sm"
                  dir="rtl"
                />
              </div>
              <div>
                <label className="text-xs text-ink-muted mb-1 block text-right">العنوان</label>
                <input
                  value={form.address}
                  onChange={e => update("address", e.target.value)}
                  placeholder="الرياض - حي النرجس"
                  className="input-base text-right text-sm"
                  dir="rtl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-5 border-t border-border sticky bottom-0 bg-card">
          <button onClick={onClose} className="btn-secondary flex-1 text-sm">
            إلغاء
          </button>
          <motion.button
            onClick={handleSave}
            disabled={saving}
            className={cn("btn-primary flex-1 text-sm gap-2", saving && "opacity-70")}
            whileTap={{ scale: 0.97 }}
          >
            {saving ? (
              <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />جاري الحفظ...</>
            ) : saved ? (
              <><CheckCircle className="w-3.5 h-3.5" />تم الحفظ!</>
            ) : (
              <><Save className="w-3.5 h-3.5" />حفظ الطالب</>
            )}
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────

function DeleteConfirmModal({
  student,
  onClose,
  onConfirm,
}: {
  student: Student;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "fixed inset-x-4 top-1/2 -translate-y-1/2 z-50",
          "md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-80",
          "bg-card rounded-2xl border border-border shadow-card-hover p-6 text-right"
        )}
        dir="rtl"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 mr-auto ml-0">
          <Trash2 className="w-5 h-5 text-red-600" />
        </div>
        <h3 className="text-base font-bold text-ink">حذف الطالب</h3>
        <p className="text-sm text-ink-muted mt-2 mb-5">
          هل أنت متأكد من حذف <span className="font-semibold text-ink">{student.fullName}</span>؟ لا يمكن التراجع عن هذا الإجراء.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1 text-sm">إلغاء</button>
          <button
            onClick={onConfirm}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium text-sm transition-colors"
          >
            حذف
          </button>
        </div>
      </motion.div>
    </>
  );
}
