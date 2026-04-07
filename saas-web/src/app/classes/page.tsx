"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, Users, BookOpen, Plus, Eye, Edit2,
  MapPin, X, Check, Phone, Mail, Award,
} from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { Stagger, StaggerItem, FadeIn } from "@/components/ui/motion";
import { ScoreRing } from "@/components/ui/geometric-shapes";
import { cn } from "@/lib/utils/cn";
import { mockClasses, mockTeachers } from "@/lib/utils/mock-data";
import { gradeNameAr } from "@/lib/utils/format";

type ClassItem = typeof mockClasses[0];
type TeacherItem = typeof mockTeachers[0];

// ─── Classes Page ─────────────────────────────────────────────────────────────

export default function ClassesPage() {
  const [activeTab, setActiveTab] = useState<"classes" | "teachers">("classes");

  // Modal state
  const [showAddClass, setShowAddClass] = useState(false);
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [viewClass, setViewClass] = useState<ClassItem | null>(null);
  const [editClass, setEditClass] = useState<ClassItem | null>(null);
  const [viewTeacher, setViewTeacher] = useState<TeacherItem | null>(null);
  const [editTeacher, setEditTeacher] = useState<TeacherItem | null>(null);

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

        {/* Tabs + Add Button */}
        <div className="flex items-center justify-between">
          <motion.button
            onClick={() => activeTab === "classes" ? setShowAddClass(true) : setShowAddTeacher(true)}
            className="btn-primary gap-2 text-sm"
            whileTap={{ scale: 0.97 }}
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
          <ClassesGrid onView={setViewClass} onEdit={setEditClass} />
        ) : (
          <TeachersGrid onView={setViewTeacher} onEdit={setEditTeacher} />
        )}
      </div>

      {/* ── Modals ── */}
      <AnimatePresence>
        {showAddClass && <AddClassModal onClose={() => setShowAddClass(false)} />}
        {showAddTeacher && <AddTeacherModal onClose={() => setShowAddTeacher(false)} />}
        {viewClass && <ClassDetailModal cls={viewClass} onClose={() => setViewClass(null)} onEdit={() => { setEditClass(viewClass); setViewClass(null); }} />}
        {editClass && <EditClassModal cls={editClass} onClose={() => setEditClass(null)} />}
        {viewTeacher && <TeacherDetailModal teacher={viewTeacher} onClose={() => setViewTeacher(null)} onEdit={() => { setEditTeacher(viewTeacher); setViewTeacher(null); }} />}
        {editTeacher && <EditTeacherModal teacher={editTeacher} onClose={() => setEditTeacher(null)} />}
      </AnimatePresence>
    </AppLayout>
  );
}

// ─── Classes Grid ─────────────────────────────────────────────────────────────

function ClassesGrid({ onView, onEdit }: { onView: (c: ClassItem) => void; onEdit: (c: ClassItem) => void }) {
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
                <ClassCard cls={cls} onView={() => onView(cls)} onEdit={() => onEdit(cls)} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      ))}
    </div>
  );
}

function ClassCard({ cls, onView, onEdit }: { cls: ClassItem; onView: () => void; onEdit: () => void }) {
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
          <button
            onClick={e => { e.stopPropagation(); onView(); }}
            className="p-1.5 rounded-lg hover:bg-primary-50 text-ink-muted hover:text-primary-600 transition-colors"
            title="عرض التفاصيل"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={e => { e.stopPropagation(); onEdit(); }}
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

function TeachersGrid({ onView, onEdit }: { onView: (t: TeacherItem) => void; onEdit: (t: TeacherItem) => void }) {
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

// ─── Modal Backdrop ───────────────────────────────────────────────────────────

function ModalBackdrop({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-lg mx-auto bg-card rounded-2xl border border-border shadow-card-hover overflow-hidden"
        dir="rtl"
        onClick={e => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </>
  );
}

function ModalHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-border">
      <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-50 text-ink-muted hover:text-ink">
        <X className="w-4 h-4" />
      </button>
      <h2 className="text-base font-bold text-ink">{title}</h2>
    </div>
  );
}

// ─── Add Class Modal ──────────────────────────────────────────────────────────

function AddClassModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("1");
  const [room, setRoom] = useState("");
  const [teacherId, setTeacherId] = useState(mockTeachers[0]?.id ?? "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    onClose();
  };

  return (
    <ModalBackdrop onClose={onClose}>
      <ModalHeader title="إضافة صف جديد" onClose={onClose} />
      <div className="p-5 space-y-4">
        <div>
          <label className="text-sm font-medium text-ink block text-right mb-1">اسم الشعبة</label>
          <input
            value={name} onChange={e => setName(e.target.value)}
            placeholder="مثال: 1/أ"
            className="input-base text-right w-full" dir="rtl"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink block text-right mb-1">المرحلة</label>
          <select value={grade} onChange={e => setGrade(e.target.value)} className="input-base w-full text-right" dir="rtl">
            {Array.from({ length: 12 }, (_, i) => i + 1).map(g => (
              <option key={g} value={g}>{gradeNameAr(g)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-ink block text-right mb-1">المدرس المسؤول</label>
          <select value={teacherId} onChange={e => setTeacherId(e.target.value)} className="input-base w-full text-right" dir="rtl">
            {mockTeachers.map(t => (
              <option key={t.id} value={t.id}>{t.fullName}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-ink block text-right mb-1">رقم القاعة</label>
          <input
            value={room} onChange={e => setRoom(e.target.value)}
            placeholder="مثال: A101"
            className="input-base text-right w-full" dir="rtl"
          />
        </div>
      </div>
      <div className="flex items-center gap-3 px-5 pb-5">
        <button onClick={onClose} className="btn-secondary flex-1 justify-center text-sm">إلغاء</button>
        <motion.button
          onClick={handleSave}
          disabled={!name.trim() || saving}
          className={cn("btn-primary flex-1 justify-center text-sm", (!name.trim() || saving) && "opacity-60 cursor-not-allowed")}
          whileTap={{ scale: 0.97 }}
        >
          {saving ? (
            <span className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              حفظ...
            </span>
          ) : "حفظ"}
        </motion.button>
      </div>
    </ModalBackdrop>
  );
}

// ─── Edit Class Modal ─────────────────────────────────────────────────────────

function EditClassModal({ cls, onClose }: { cls: ClassItem; onClose: () => void }) {
  const [name, setName] = useState(cls.name);
  const [room, setRoom] = useState(cls.room ?? "");
  const [teacherId, setTeacherId] = useState(cls.teacherId);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    onClose();
  };

  return (
    <ModalBackdrop onClose={onClose}>
      <ModalHeader title={`تعديل الصف: ${cls.name}`} onClose={onClose} />
      <div className="p-5 space-y-4">
        <div>
          <label className="text-sm font-medium text-ink block text-right mb-1">اسم الشعبة</label>
          <input value={name} onChange={e => setName(e.target.value)} className="input-base text-right w-full" dir="rtl" />
        </div>
        <div>
          <label className="text-sm font-medium text-ink block text-right mb-1">المرحلة</label>
          <input value={gradeNameAr(cls.grade)} className="input-base text-right w-full bg-surface-50" dir="rtl" disabled />
        </div>
        <div>
          <label className="text-sm font-medium text-ink block text-right mb-1">المدرس المسؤول</label>
          <select value={teacherId} onChange={e => setTeacherId(e.target.value)} className="input-base w-full text-right" dir="rtl">
            {mockTeachers.map(t => (
              <option key={t.id} value={t.id}>{t.fullName}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-ink block text-right mb-1">رقم القاعة</label>
          <input value={room} onChange={e => setRoom(e.target.value)} className="input-base text-right w-full" dir="rtl" />
        </div>
      </div>
      <div className="flex items-center gap-3 px-5 pb-5">
        <button onClick={onClose} className="btn-secondary flex-1 justify-center text-sm">إلغاء</button>
        <motion.button
          onClick={handleSave}
          disabled={saving}
          className={cn("btn-primary flex-1 justify-center text-sm", saving && "opacity-60 cursor-not-allowed")}
          whileTap={{ scale: 0.97 }}
        >
          {saving ? (
            <span className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              حفظ...
            </span>
          ) : "حفظ التغييرات"}
        </motion.button>
      </div>
    </ModalBackdrop>
  );
}

// ─── Class Detail Modal ───────────────────────────────────────────────────────

function ClassDetailModal({ cls, onClose, onEdit }: { cls: ClassItem; onClose: () => void; onEdit: () => void }) {
  return (
    <ModalBackdrop onClose={onClose}>
      <ModalHeader title="تفاصيل الصف" onClose={onClose} />
      <div className="p-5 space-y-4 text-right">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center">
            <GraduationCap className="w-7 h-7 text-primary-600" strokeWidth={1.8} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-ink">{cls.name}</h3>
            <p className="text-sm text-ink-muted">{gradeNameAr(cls.grade)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "عدد الطلاب", value: cls.studentsCount.toString(), icon: Users },
            { label: "القاعة", value: cls.room ?? "—", icon: MapPin },
            { label: "المعلم", value: cls.teacher.fullName, icon: GraduationCap },
            { label: "معدل الحضور", value: "92%", icon: Check },
          ].map(row => (
            <div key={row.label} className="p-3 bg-surface-50 rounded-xl border border-border">
              <p className="text-[11px] text-ink-muted flex items-center gap-1 justify-end">
                <row.icon className="w-3 h-3" />
                {row.label}
              </p>
              <p className="text-sm font-bold text-ink mt-0.5">{row.value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3 px-5 pb-5">
        <button onClick={onClose} className="btn-secondary flex-1 justify-center text-sm">إغلاق</button>
        <button onClick={onEdit} className="btn-primary flex-1 justify-center text-sm gap-2">
          <Edit2 className="w-3.5 h-3.5" />
          تعديل
        </button>
      </div>
    </ModalBackdrop>
  );
}

// ─── Add Teacher Modal ────────────────────────────────────────────────────────

function AddTeacherModal({ onClose }: { onClose: () => void }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    onClose();
  };

  return (
    <ModalBackdrop onClose={onClose}>
      <ModalHeader title="إضافة مدرس جديد" onClose={onClose} />
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-ink block text-right mb-1">الاسم الأول</label>
            <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="مثال: أحمد" className="input-base text-right w-full" dir="rtl" />
          </div>
          <div>
            <label className="text-sm font-medium text-ink block text-right mb-1">اسم العائلة</label>
            <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="مثال: الحربي" className="input-base text-right w-full" dir="rtl" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-ink block text-right mb-1">التخصص</label>
          <input value={specialization} onChange={e => setSpecialization(e.target.value)} placeholder="مثال: رياضيات" className="input-base text-right w-full" dir="rtl" />
        </div>
        <div>
          <label className="text-sm font-medium text-ink block text-right mb-1">البريد الإلكتروني</label>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="teacher@school.edu.sa" className="input-base text-right w-full" dir="rtl" />
        </div>
      </div>
      <div className="flex items-center gap-3 px-5 pb-5">
        <button onClick={onClose} className="btn-secondary flex-1 justify-center text-sm">إلغاء</button>
        <motion.button
          onClick={handleSave}
          disabled={!firstName.trim() || !lastName.trim() || saving}
          className={cn("btn-primary flex-1 justify-center text-sm", (!firstName.trim() || !lastName.trim() || saving) && "opacity-60 cursor-not-allowed")}
          whileTap={{ scale: 0.97 }}
        >
          {saving ? (
            <span className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              حفظ...
            </span>
          ) : "حفظ"}
        </motion.button>
      </div>
    </ModalBackdrop>
  );
}

// ─── Edit Teacher Modal ───────────────────────────────────────────────────────

function EditTeacherModal({ teacher, onClose }: { teacher: TeacherItem; onClose: () => void }) {
  const [firstName, setFirstName] = useState(teacher.firstName);
  const [lastName, setLastName] = useState(teacher.lastName);
  const [specialization, setSpecialization] = useState(teacher.specialization);
  const [status, setStatus] = useState(teacher.status);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    onClose();
  };

  return (
    <ModalBackdrop onClose={onClose}>
      <ModalHeader title={`تعديل: ${teacher.fullName}`} onClose={onClose} />
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-ink block text-right mb-1">الاسم الأول</label>
            <input value={firstName} onChange={e => setFirstName(e.target.value)} className="input-base text-right w-full" dir="rtl" />
          </div>
          <div>
            <label className="text-sm font-medium text-ink block text-right mb-1">اسم العائلة</label>
            <input value={lastName} onChange={e => setLastName(e.target.value)} className="input-base text-right w-full" dir="rtl" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-ink block text-right mb-1">التخصص</label>
          <input value={specialization} onChange={e => setSpecialization(e.target.value)} className="input-base text-right w-full" dir="rtl" />
        </div>
        <div>
          <label className="text-sm font-medium text-ink block text-right mb-1">الحالة</label>
          <select value={status} onChange={e => setStatus(e.target.value as TeacherItem["status"])} className="input-base w-full text-right" dir="rtl">
            <option value="active">نشط</option>
            <option value="on_leave">في إجازة</option>
            <option value="inactive">غير نشط</option>
          </select>
        </div>
      </div>
      <div className="flex items-center gap-3 px-5 pb-5">
        <button onClick={onClose} className="btn-secondary flex-1 justify-center text-sm">إلغاء</button>
        <motion.button
          onClick={handleSave}
          disabled={saving}
          className={cn("btn-primary flex-1 justify-center text-sm", saving && "opacity-60 cursor-not-allowed")}
          whileTap={{ scale: 0.97 }}
        >
          {saving ? (
            <span className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              حفظ...
            </span>
          ) : "حفظ التغييرات"}
        </motion.button>
      </div>
    </ModalBackdrop>
  );
}

// ─── Teacher Detail Modal ─────────────────────────────────────────────────────

function TeacherDetailModal({ teacher, onClose, onEdit }: { teacher: TeacherItem; onClose: () => void; onEdit: () => void }) {
  const assignedClasses = mockClasses.filter(c => c.teacherId === teacher.id);

  return (
    <ModalBackdrop onClose={onClose}>
      <ModalHeader title="ملف المدرس" onClose={onClose} />
      <div className="p-5 space-y-4 text-right">
        {/* Avatar + Name */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-700">{teacher.firstName.charAt(0)}</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-ink">{teacher.fullName}</h3>
            <p className="text-sm text-ink-muted">{teacher.specialization}</p>
            <span className={cn(
              "badge text-[11px] mt-1",
              teacher.status === "active" ? "bg-green-100 text-green-700" :
              teacher.status === "on_leave" ? "bg-amber-100 text-amber-700" :
              "bg-surface-100 text-ink-muted"
            )}>
              {teacher.status === "active" ? "نشط" : teacher.status === "on_leave" ? "في إجازة" : "غير نشط"}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "الصفوف", value: assignedClasses.length, icon: GraduationCap },
            { label: "الطلاب", value: assignedClasses.reduce((a, c) => a + c.studentsCount, 0), icon: Users },
            { label: "المواد", value: 3, icon: BookOpen },
          ].map(s => (
            <div key={s.label} className="p-3 bg-surface-50 rounded-xl border border-border text-center">
              <p className="text-xl font-bold text-ink">{s.value}</p>
              <p className="text-[11px] text-ink-muted">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Qualifications */}
        {teacher.qualifications.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-ink-muted mb-2 flex items-center gap-1 justify-end">
              <Award className="w-3.5 h-3.5" />
              المؤهلات
            </p>
            <div className="flex flex-wrap gap-1.5 justify-end">
              {teacher.qualifications.map(q => (
                <span key={q} className="badge-neutral text-[11px]">{q}</span>
              ))}
            </div>
          </div>
        )}

        {/* Assigned Classes */}
        {assignedClasses.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-ink-muted mb-2">الصفوف المسندة</p>
            <div className="flex flex-wrap gap-1.5 justify-end">
              {assignedClasses.map(c => (
                <span key={c.id} className="px-2.5 py-1 bg-primary-50 text-primary-700 text-xs rounded-lg border border-primary-100">{c.name}</span>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center gap-3 px-5 pb-5">
        <button onClick={onClose} className="btn-secondary flex-1 justify-center text-sm">إغلاق</button>
        <button onClick={onEdit} className="btn-primary flex-1 justify-center text-sm gap-2">
          <Edit2 className="w-3.5 h-3.5" />
          تعديل
        </button>
      </div>
    </ModalBackdrop>
  );
}
