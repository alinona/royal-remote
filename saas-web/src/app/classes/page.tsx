"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, Users, BookOpen, Plus, Eye, Edit2,
  BarChart2, Clock, MapPin, X, Save, Mail, Phone,
} from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { Stagger, StaggerItem, FadeIn } from "@/components/ui/motion";
import { ScoreRing } from "@/components/ui/geometric-shapes";
import { cn } from "@/lib/utils/cn";
import { mockClasses as _mockClasses, mockTeachers as _mockTeachers } from "@/lib/utils/mock-data";
import { gradeNameAr } from "@/lib/utils/format";
import type { ClassSection, Teacher } from "@/types";

// ─── Classes Page ─────────────────────────────────────────────────────────────

export default function ClassesPage() {
  const [activeTab, setActiveTab] = useState<"classes" | "teachers">("classes");
  const [classes, setClasses] = useState<ClassSection[]>(_mockClasses);
  const [teachers, setTeachers] = useState<Teacher[]>(_mockTeachers);
  const [showNewModal, setShowNewModal] = useState(false);
  const [viewClass, setViewClass] = useState<ClassSection | null>(null);
  const [editClass, setEditClass] = useState<ClassSection | null>(null);
  const [viewTeacher, setViewTeacher] = useState<Teacher | null>(null);
  const [editTeacher, setEditTeacher] = useState<Teacher | null>(null);

  return (
    <AppLayout title="الصفوف والمدرسون">
      <div className="space-y-6">
        {/* Stats */}
        <Stagger className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "إجمالي الصفوف", value: classes.length, icon: GraduationCap, color: "text-primary-600 bg-primary-50" },
            { label: "إجمالي المدرسين", value: teachers.length, icon: Users, color: "text-blue-600 bg-blue-50" },
            { label: "المواد الدراسية", value: 12, icon: BookOpen, color: "text-green-600 bg-green-50" },
            { label: "متوسط الطلاب/صف", value: Math.round(classes.reduce((a, c) => a + c.studentsCount, 0) / (classes.length || 1)), icon: Users, color: "text-amber-600 bg-amber-50" },
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
          <motion.button
            className="btn-primary gap-2 text-sm"
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowNewModal(true)}
          >
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
          <ClassesGrid
            classes={classes}
            onView={setViewClass}
            onEdit={setEditClass}
          />
        ) : (
          <TeachersGrid
            teachers={teachers}
            classes={classes}
            onView={setViewTeacher}
            onEdit={setEditTeacher}
          />
        )}
      </div>

      {/* New Modal */}
      <AnimatePresence>
        {showNewModal && (
          activeTab === "classes" ? (
            <NewClassModal
              teachers={teachers}
              onClose={() => setShowNewModal(false)}
              onSave={(cls) => { setClasses(prev => [...prev, cls]); setShowNewModal(false); }}
            />
          ) : (
            <NewTeacherModal
              onClose={() => setShowNewModal(false)}
              onSave={(t) => { setTeachers(prev => [...prev, t]); setShowNewModal(false); }}
            />
          )
        )}
      </AnimatePresence>

      {/* View Class Modal */}
      <AnimatePresence>
        {viewClass && (
          <ClassDetailModal
            cls={viewClass}
            onClose={() => setViewClass(null)}
            onEdit={() => { setEditClass(viewClass); setViewClass(null); }}
          />
        )}
      </AnimatePresence>

      {/* Edit Class Modal */}
      <AnimatePresence>
        {editClass && (
          <EditClassModal
            cls={editClass}
            teachers={teachers}
            onClose={() => setEditClass(null)}
            onSave={(updated) => {
              setClasses(prev => prev.map(c => c.id === updated.id ? updated : c));
              setEditClass(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* View Teacher Modal */}
      <AnimatePresence>
        {viewTeacher && (
          <TeacherDetailModal
            teacher={viewTeacher}
            classes={classes}
            onClose={() => setViewTeacher(null)}
            onEdit={() => { setEditTeacher(viewTeacher); setViewTeacher(null); }}
          />
        )}
      </AnimatePresence>

      {/* Edit Teacher Modal */}
      <AnimatePresence>
        {editTeacher && (
          <EditTeacherModal
            teacher={editTeacher}
            onClose={() => setEditTeacher(null)}
            onSave={(updated) => {
              setTeachers(prev => prev.map(t => t.id === updated.id ? updated : t));
              setEditTeacher(null);
            }}
          />
        )}
      </AnimatePresence>
    </AppLayout>
  );
}

// ─── Classes Grid ─────────────────────────────────────────────────────────────

function ClassesGrid({
  classes, onView, onEdit,
}: {
  classes: ClassSection[];
  onView: (c: ClassSection) => void;
  onEdit: (c: ClassSection) => void;
}) {
  const byGrade: Record<number, ClassSection[]> = {};
  classes.forEach(cls => {
    if (!byGrade[cls.grade]) byGrade[cls.grade] = [];
    byGrade[cls.grade].push(cls);
  });

  return (
    <div className="space-y-6">
      {Object.entries(byGrade).map(([grade, gradeClasses]) => (
        <div key={grade}>
          <h3 className="text-sm font-semibold text-ink-muted mb-3 text-right flex items-center gap-2 justify-end">
            <span className="px-2.5 py-0.5 bg-primary-50 text-primary-700 text-xs rounded-lg border border-primary-100">
              {gradeClasses.length} شعبة
            </span>
            {gradeNameAr(Number(grade))}
          </h3>
          <Stagger className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {gradeClasses.map(cls => (
              <StaggerItem key={cls.id}>
                <ClassCard cls={cls} onView={onView} onEdit={onEdit} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      ))}
    </div>
  );
}

function ClassCard({
  cls, onView, onEdit,
}: {
  cls: ClassSection;
  onView: (c: ClassSection) => void;
  onEdit: (c: ClassSection) => void;
}) {
  const attendanceRate = 92;
  const avgGrade = 78;

  return (
    <motion.div
      className="card-base p-5 hover:shadow-card-hover cursor-pointer text-right group"
      whileHover={{ y: -2 }}
      onClick={() => onView(cls)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={e => { e.stopPropagation(); onView(cls); }}
            className="p-1.5 rounded-lg hover:bg-primary-50 text-ink-muted hover:text-primary-600 transition-colors"
            title="عرض التفاصيل"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={e => { e.stopPropagation(); onEdit(cls); }}
            className="p-1.5 rounded-lg hover:bg-amber-50 text-ink-muted hover:text-amber-600 transition-colors"
            title="تعديل"
          >
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

function TeachersGrid({
  teachers, classes, onView, onEdit,
}: {
  teachers: Teacher[];
  classes: ClassSection[];
  onView: (t: Teacher) => void;
  onEdit: (t: Teacher) => void;
}) {
  return (
    <Stagger className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {teachers.map(teacher => (
        <StaggerItem key={teacher.id}>
          <motion.div
            className="card-base p-5 hover:shadow-card-hover cursor-pointer text-right group"
            whileHover={{ y: -2 }}
            onClick={() => onView(teacher)}
          >
            {/* Avatar */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={e => { e.stopPropagation(); onView(teacher); }}
                  className="p-1.5 rounded-lg hover:bg-primary-50 text-ink-muted hover:text-primary-600 transition-colors"
                  title="عرض التفاصيل"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={e => { e.stopPropagation(); onEdit(teacher); }}
                  className="p-1.5 rounded-lg hover:bg-amber-50 text-ink-muted hover:text-amber-600 transition-colors"
                  title="تعديل"
                >
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
                { label: "صفوف", value: classes.filter(c => c.teacherId === teacher.id).length, icon: GraduationCap },
                { label: "طلاب", value: classes.filter(c => c.teacherId === teacher.id).reduce((a, c) => a + c.studentsCount, 0), icon: Users },
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

// ─── Shared Modal Wrapper ─────────────────────────────────────────────────────

function ModalWrapper({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
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
        className="fixed inset-x-4 top-12 bottom-4 z-50 max-w-lg mx-auto bg-card rounded-2xl border border-border shadow-card-hover overflow-y-auto"
        dir="rtl"
        onClick={e => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </>
  );
}

// ─── New Class Modal ──────────────────────────────────────────────────────────

function NewClassModal({
  teachers, onClose, onSave,
}: {
  teachers: Teacher[];
  onClose: () => void;
  onSave: (cls: ClassSection) => void;
}) {
  const [form, setForm] = useState({ name: "", grade: 1, section: "أ", room: "", teacherId: teachers[0]?.id ?? "" });
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    if (!form.name || !form.teacherId) return;
    setSaving(true);
    setTimeout(() => {
      const teacher = teachers.find(t => t.id === form.teacherId)!;
      const newClass: ClassSection = {
        id: `c${Date.now()}`,
        name: form.name,
        grade: form.grade,
        section: form.section,
        academicYear: "1446",
        schoolId: "s1",
        teacherId: form.teacherId,
        teacher,
        studentsCount: 0,
        subjectsCount: 8,
        room: form.room,
        createdAt: new Date(),
      };
      setSaving(false);
      onSave(newClass);
    }, 700);
  };

  return (
    <ModalWrapper onClose={onClose}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-card">
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-50 text-ink-muted"><X className="w-4 h-4" /></button>
        <h2 className="text-base font-bold text-ink">إضافة صف جديد</h2>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <label className="block text-xs text-ink-muted mb-1.5 text-right">اسم الصف</label>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="مثال: الصف الثالث - ج" className="input-base text-right" dir="rtl" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-ink-muted mb-1.5 text-right">المرحلة الدراسية</label>
            <select value={form.grade} onChange={e => setForm(f => ({ ...f, grade: Number(e.target.value) }))} className="input-base text-right" dir="rtl">
              {[1,2,3,4,5,6].map(g => <option key={g} value={g}>{gradeNameAr(g)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-ink-muted mb-1.5 text-right">الشعبة</label>
            <select value={form.section} onChange={e => setForm(f => ({ ...f, section: e.target.value }))} className="input-base text-right" dir="rtl">
              {["أ","ب","ج","د","هـ"].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs text-ink-muted mb-1.5 text-right">المعلم المسؤول</label>
          <select value={form.teacherId} onChange={e => setForm(f => ({ ...f, teacherId: e.target.value }))} className="input-base text-right" dir="rtl">
            {teachers.map(t => <option key={t.id} value={t.id}>{t.fullName}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-ink-muted mb-1.5 text-right">رقم القاعة (اختياري)</label>
          <input value={form.room} onChange={e => setForm(f => ({ ...f, room: e.target.value }))} placeholder="مثال: 301" className="input-base text-right" dir="rtl" />
        </div>
      </div>
      <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex gap-3">
        <button onClick={onClose} className="btn-secondary flex-1 text-sm">إلغاء</button>
        <button onClick={handleSave} disabled={saving || !form.name} className="btn-primary flex-1 gap-2 text-sm justify-center">
          {saving ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "جاري الحفظ..." : "إضافة الصف"}
        </button>
      </div>
    </ModalWrapper>
  );
}

// ─── New Teacher Modal ────────────────────────────────────────────────────────

function NewTeacherModal({
  onClose, onSave,
}: {
  onClose: () => void;
  onSave: (t: Teacher) => void;
}) {
  const [form, setForm] = useState({ firstName: "", lastName: "", specialization: "", email: "", phone: "" });
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    if (!form.firstName || !form.lastName) return;
    setSaving(true);
    setTimeout(() => {
      const newTeacher: Teacher = {
        id: `t${Date.now()}`,
        nationalId: "",
        employeeCode: `T${Date.now()}`.slice(-4),
        firstName: form.firstName,
        lastName: form.lastName,
        fullName: `${form.firstName} ${form.lastName}`,
        gender: "male",
        email: form.email,
        phone: form.phone,
        specialization: form.specialization,
        status: "active",
        schoolId: "s1",
        classes: [],
        subjects: [],
        hireDate: new Date(),
        qualifications: [],
        createdAt: new Date(),
      };
      setSaving(false);
      onSave(newTeacher);
    }, 700);
  };

  return (
    <ModalWrapper onClose={onClose}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-card">
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-50 text-ink-muted"><X className="w-4 h-4" /></button>
        <h2 className="text-base font-bold text-ink">إضافة مدرس جديد</h2>
      </div>
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-ink-muted mb-1.5 text-right">الاسم الأول</label>
            <input value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} className="input-base text-right" dir="rtl" />
          </div>
          <div>
            <label className="block text-xs text-ink-muted mb-1.5 text-right">اسم العائلة</label>
            <input value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} className="input-base text-right" dir="rtl" />
          </div>
        </div>
        <div>
          <label className="block text-xs text-ink-muted mb-1.5 text-right">التخصص</label>
          <input value={form.specialization} onChange={e => setForm(f => ({ ...f, specialization: e.target.value }))} placeholder="مثال: الرياضيات" className="input-base text-right" dir="rtl" />
        </div>
        <div>
          <label className="block text-xs text-ink-muted mb-1.5 text-right">البريد الإلكتروني</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" />
            <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} type="email" className="input-base text-right pl-10" dir="rtl" />
          </div>
        </div>
        <div>
          <label className="block text-xs text-ink-muted mb-1.5 text-right">رقم الهاتف</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" />
            <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} type="tel" className="input-base text-right pl-10" dir="rtl" />
          </div>
        </div>
      </div>
      <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex gap-3">
        <button onClick={onClose} className="btn-secondary flex-1 text-sm">إلغاء</button>
        <button onClick={handleSave} disabled={saving || !form.firstName} className="btn-primary flex-1 gap-2 text-sm justify-center">
          {saving ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "جاري الحفظ..." : "إضافة المدرس"}
        </button>
      </div>
    </ModalWrapper>
  );
}

// ─── Class Detail Modal ───────────────────────────────────────────────────────

function ClassDetailModal({
  cls, onClose, onEdit,
}: {
  cls: ClassSection;
  onClose: () => void;
  onEdit: () => void;
}) {
  return (
    <ModalWrapper onClose={onClose}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-card">
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-50 text-ink-muted"><X className="w-4 h-4" /></button>
        <h2 className="text-base font-bold text-ink">تفاصيل الصف</h2>
      </div>
      <div className="p-6 space-y-5">
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center mx-auto mb-3">
            <GraduationCap className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="text-xl font-bold text-ink">{cls.name}</h3>
          <p className="text-sm text-ink-muted mt-1">{gradeNameAr(cls.grade)}</p>
        </div>

        <div className="flex justify-around">
          <ScoreRing value={92} size={72} strokeWidth={5} label="حضور" color="hsl(142 70% 40%)" />
          <ScoreRing value={78} size={72} strokeWidth={5} label="معدل" color="hsl(232 76% 55%)" />
        </div>

        <div className="space-y-2">
          {[
            { label: "المعلم المسؤول", value: cls.teacher.fullName },
            { label: "عدد الطلاب", value: `${cls.studentsCount} طالب` },
            { label: "رقم القاعة", value: cls.room ?? "غير محدد" },
            { label: "العام الدراسي", value: cls.academicYear },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <span className="text-sm font-medium text-ink">{value}</span>
              <span className="text-xs text-ink-muted">{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex gap-3">
        <button onClick={onClose} className="btn-secondary flex-1 text-sm">إغلاق</button>
        <button onClick={onEdit} className="btn-primary flex-1 gap-2 text-sm"><Edit2 className="w-4 h-4" /> تعديل الصف</button>
      </div>
    </ModalWrapper>
  );
}

// ─── Edit Class Modal ─────────────────────────────────────────────────────────

function EditClassModal({
  cls, teachers, onClose, onSave,
}: {
  cls: ClassSection;
  teachers: Teacher[];
  onClose: () => void;
  onSave: (c: ClassSection) => void;
}) {
  const [form, setForm] = useState({ name: cls.name, room: cls.room ?? "", teacherId: cls.teacherId });
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      const teacher = teachers.find(t => t.id === form.teacherId) ?? cls.teacher;
      onSave({ ...cls, ...form, teacher });
      setSaving(false);
    }, 700);
  };

  return (
    <ModalWrapper onClose={onClose}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-card">
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-50 text-ink-muted"><X className="w-4 h-4" /></button>
        <h2 className="text-base font-bold text-ink">تعديل الصف</h2>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <label className="block text-xs text-ink-muted mb-1.5 text-right">اسم الصف</label>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-base text-right" dir="rtl" />
        </div>
        <div>
          <label className="block text-xs text-ink-muted mb-1.5 text-right">المعلم المسؤول</label>
          <select value={form.teacherId} onChange={e => setForm(f => ({ ...f, teacherId: e.target.value }))} className="input-base text-right" dir="rtl">
            {teachers.map(t => <option key={t.id} value={t.id}>{t.fullName}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-ink-muted mb-1.5 text-right">رقم القاعة</label>
          <input value={form.room} onChange={e => setForm(f => ({ ...f, room: e.target.value }))} className="input-base text-right" dir="rtl" />
        </div>
      </div>
      <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex gap-3">
        <button onClick={onClose} className="btn-secondary flex-1 text-sm">إلغاء</button>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 gap-2 text-sm justify-center">
          {saving ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "جاري الحفظ..." : "حفظ التعديلات"}
        </button>
      </div>
    </ModalWrapper>
  );
}

// ─── Teacher Detail Modal ─────────────────────────────────────────────────────

function TeacherDetailModal({
  teacher, classes, onClose, onEdit,
}: {
  teacher: Teacher;
  classes: ClassSection[];
  onClose: () => void;
  onEdit: () => void;
}) {
  const teacherClasses = classes.filter(c => c.teacherId === teacher.id);

  return (
    <ModalWrapper onClose={onClose}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-card">
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-50 text-ink-muted"><X className="w-4 h-4" /></button>
        <h2 className="text-base font-bold text-ink">ملف المدرس</h2>
      </div>
      <div className="p-6 space-y-5">
        <div className="text-center py-4">
          <div className="w-20 h-20 rounded-2xl bg-primary-100 flex items-center justify-center mx-auto mb-3">
            <span className="text-3xl font-bold text-primary-700">{teacher.firstName.charAt(0)}</span>
          </div>
          <h3 className="text-xl font-bold text-ink">{teacher.fullName}</h3>
          <p className="text-sm text-ink-muted mt-1">{teacher.specialization}</p>
          <span className={cn(
            "inline-block mt-2 badge text-xs",
            teacher.status === "active" ? "bg-green-100 text-green-700" :
            teacher.status === "on_leave" ? "bg-amber-100 text-amber-700" :
            "bg-surface-100 text-ink-muted"
          )}>
            {teacher.status === "active" ? "نشط" : teacher.status === "on_leave" ? "في إجازة" : "غير نشط"}
          </span>
        </div>

        <div className="space-y-2">
          {[
            { label: "البريد الإلكتروني", value: teacher.email },
            { label: "الهاتف", value: teacher.phone },
            { label: "كود الموظف", value: teacher.employeeCode },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <span className="text-sm font-medium text-ink">{value}</span>
              <span className="text-xs text-ink-muted">{label}</span>
            </div>
          ))}
        </div>

        {teacherClasses.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-ink mb-2 text-right">الصفوف المسندة</p>
            <div className="flex flex-wrap gap-2 justify-end">
              {teacherClasses.map(c => (
                <span key={c.id} className="badge-neutral text-xs">{c.name}</span>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="text-sm font-semibold text-ink mb-2 text-right">المؤهلات</p>
          <div className="flex flex-wrap gap-2 justify-end">
            {teacher.qualifications.map(q => (
              <span key={q} className="badge-neutral text-xs">{q}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex gap-3">
        <button onClick={onClose} className="btn-secondary flex-1 text-sm">إغلاق</button>
        <button onClick={onEdit} className="btn-primary flex-1 gap-2 text-sm"><Edit2 className="w-4 h-4" /> تعديل البيانات</button>
      </div>
    </ModalWrapper>
  );
}

// ─── Edit Teacher Modal ───────────────────────────────────────────────────────

function EditTeacherModal({
  teacher, onClose, onSave,
}: {
  teacher: Teacher;
  onClose: () => void;
  onSave: (t: Teacher) => void;
}) {
  const [form, setForm] = useState({
    firstName: teacher.firstName,
    lastName: teacher.lastName,
    specialization: teacher.specialization,
    email: teacher.email,
    phone: teacher.phone,
    status: teacher.status,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      onSave({
        ...teacher,
        ...form,
        fullName: `${form.firstName} ${form.lastName}`,
      });
      setSaving(false);
    }, 700);
  };

  return (
    <ModalWrapper onClose={onClose}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-card">
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-50 text-ink-muted"><X className="w-4 h-4" /></button>
        <h2 className="text-base font-bold text-ink">تعديل بيانات المدرس</h2>
      </div>
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-ink-muted mb-1.5 text-right">الاسم الأول</label>
            <input value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} className="input-base text-right" dir="rtl" />
          </div>
          <div>
            <label className="block text-xs text-ink-muted mb-1.5 text-right">اسم العائلة</label>
            <input value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} className="input-base text-right" dir="rtl" />
          </div>
        </div>
        <div>
          <label className="block text-xs text-ink-muted mb-1.5 text-right">التخصص</label>
          <input value={form.specialization} onChange={e => setForm(f => ({ ...f, specialization: e.target.value }))} className="input-base text-right" dir="rtl" />
        </div>
        <div>
          <label className="block text-xs text-ink-muted mb-1.5 text-right">الحالة الوظيفية</label>
          <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Teacher["status"] }))} className="input-base text-right" dir="rtl">
            <option value="active">نشط</option>
            <option value="on_leave">في إجازة</option>
            <option value="inactive">غير نشط</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-ink-muted mb-1.5 text-right">البريد الإلكتروني</label>
          <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} type="email" className="input-base text-right" dir="rtl" />
        </div>
        <div>
          <label className="block text-xs text-ink-muted mb-1.5 text-right">رقم الهاتف</label>
          <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} type="tel" className="input-base text-right" dir="rtl" />
        </div>
      </div>
      <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex gap-3">
        <button onClick={onClose} className="btn-secondary flex-1 text-sm">إلغاء</button>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 gap-2 text-sm justify-center">
          {saving ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "جاري الحفظ..." : "حفظ التعديلات"}
        </button>
      </div>
    </ModalWrapper>
  );
}
