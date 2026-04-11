"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { mockClasses } from "@/lib/utils/mock-data";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Save, User,
  Calendar, MapPin, Phone,
  GraduationCap, ShieldCheck, Check,
} from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { FadeIn } from "@/components/ui/motion";
import { cn } from "@/lib/utils/cn";

export default function NewStudentPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "male",
    nationalId: "",
    address: "",
    classGrade: "1",
    section: "A",
    guardianName: "",
    guardianPhone: "",
    guardianRelation: "أب",
  });

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      // Persist the new student to localStorage so students/page.tsx can pick it up
      try {
        const cls = mockClasses.find(c => c.grade === Number(form.classGrade) && c.section === form.section) ?? mockClasses[0];
        const newStudent = {
          id: `s${Date.now()}`,
          studentCode: `STD${Date.now().toString().slice(-5)}`,
          nationalId: form.nationalId,
          firstName: form.firstName,
          lastName: form.lastName,
          fullName: `${form.firstName} ${form.lastName}`,
          gender: form.gender,
          dateOfBirth: new Date(form.dateOfBirth || '2010-01-01').toISOString(),
          address: form.address,
          classId: cls.id,
          class: cls,
          status: 'active',
          enrollmentDate: new Date().toISOString(),
          schoolId: 's1',
          guardianName: form.guardianName,
          guardianRelation: form.guardianRelation,
          guardianPhone: form.guardianPhone,
          gpa: undefined,
          attendanceRate: undefined,
          behaviorScore: undefined,
          riskLevel: 'low',
          tags: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const existingRaw = localStorage.getItem('eduflow_students');
        const existing = existingRaw ? JSON.parse(existingRaw) : [];
        localStorage.setItem('eduflow_students', JSON.stringify([newStudent, ...existing]));
      } catch {}
      setSaving(false);
      setSaved(true);
      setTimeout(() => router.push("/students"), 1800);
    }, 1500);
  };

  return (
    <AppLayout title="إضافة طالب جديد">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.back()} className="btn-secondary gap-2">
            <ArrowRight className="w-4 h-4" />
            رجوع
          </button>
          <div className="text-right">
            <h1 className="text-2xl font-bold text-ink">تسجيل طالب جديد</h1>
            <p className="text-sm text-ink-muted">إدخال بيانات الطالب الأساسية والأكاديمية</p>
          </div>
        </div>

        {/* Success Banner */}
        <AnimatePresence>
          {saved && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-green-800">تم حفظ بيانات الطالب بنجاح!</p>
                <p className="text-xs text-green-600 mt-0.5">جارٍ التوجيه إلى قائمة الطلاب...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Personal Info */}
          <FadeIn>
            <div className="card-base p-6">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border justify-end">
                <h3 className="font-bold text-ink">البيانات الشخصية</h3>
                <User className="w-5 h-5 text-primary" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="text-right">
                    <label className="block text-sm font-medium text-ink mb-1.5">الاسم الأول</label>
                    <input
                      type="text" required
                      value={form.firstName} onChange={set("firstName")}
                      className="input-base text-right" placeholder="أدخل الاسم الأول"
                      dir="rtl"
                    />
                  </div>
                  <div className="text-right">
                    <label className="block text-sm font-medium text-ink mb-1.5">اسم العائلة</label>
                    <input
                      type="text" required
                      value={form.lastName} onChange={set("lastName")}
                      className="input-base text-right" placeholder="أدخل اسم العائلة"
                      dir="rtl"
                    />
                  </div>
                  <div className="text-right">
                    <label className="block text-sm font-medium text-ink mb-1.5">تاريخ الميلاد</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" />
                      <input
                        type="date" required
                        value={form.dateOfBirth} onChange={set("dateOfBirth")}
                        className="input-base pl-10 text-right"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-right">
                    <label className="block text-sm font-medium text-ink mb-1.5">الجنس</label>
                    <select value={form.gender} onChange={set("gender")} className="input-base text-right" dir="rtl">
                      <option value="male">ذكر</option>
                      <option value="female">أنثى</option>
                    </select>
                  </div>
                  <div className="text-right">
                    <label className="block text-sm font-medium text-ink mb-1.5">رقم الهوية / الإقامة</label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" />
                      <input
                        type="text" required maxLength={10}
                        value={form.nationalId} onChange={set("nationalId")}
                        className="input-base pl-10 text-right" placeholder="10 أرقام"
                        dir="rtl"
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <label className="block text-sm font-medium text-ink mb-1.5">العنوان</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" />
                      <input
                        type="text"
                        value={form.address} onChange={set("address")}
                        className="input-base pl-10 text-right" placeholder="الحي، الشارع"
                        dir="rtl"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Academic Info */}
          <FadeIn delay={0.1}>
            <div className="card-base p-6">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border justify-end">
                <h3 className="font-bold text-ink">البيانات الأكاديمية</h3>
                <GraduationCap className="w-5 h-5 text-primary" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-right">
                  <label className="block text-sm font-medium text-ink mb-1.5">الصف الدراسي</label>
                  <select value={form.classGrade} onChange={set("classGrade")} className="input-base text-right" dir="rtl">
                    {[1,2,3,4,5,6].map(g => (
                      <option key={g} value={String(g)}>الصف {["الأول","الثاني","الثالث","الرابع","الخامس","السادس"][g-1]}</option>
                    ))}
                  </select>
                </div>
                <div className="text-right">
                  <label className="block text-sm font-medium text-ink mb-1.5">الشعبة</label>
                  <select value={form.section} onChange={set("section")} className="input-base text-right" dir="rtl">
                    {["A","B","C","D"].map((s, i) => (
                      <option key={s} value={s}>شعبة {["أ","ب","ج","د"][i]}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Guardian Info */}
          <FadeIn delay={0.15}>
            <div className="card-base p-6">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border justify-end">
                <h3 className="font-bold text-ink">بيانات ولي الأمر</h3>
                <Phone className="w-5 h-5 text-primary" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-right">
                  <label className="block text-sm font-medium text-ink mb-1.5">اسم ولي الأمر</label>
                  <input
                    type="text" required
                    value={form.guardianName} onChange={set("guardianName")}
                    className="input-base text-right" placeholder="الاسم الكامل"
                    dir="rtl"
                  />
                </div>
                <div className="text-right">
                  <label className="block text-sm font-medium text-ink mb-1.5">صلة القرابة</label>
                  <select value={form.guardianRelation} onChange={set("guardianRelation")} className="input-base text-right" dir="rtl">
                    {["أب","أم","أخ","أخت","جد","أخرى"].map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="text-right">
                  <label className="block text-sm font-medium text-ink mb-1.5">رقم الجوال</label>
                  <input
                    type="tel" required
                    value={form.guardianPhone} onChange={set("guardianPhone")}
                    className="input-base text-right" placeholder="05xxxxxxxx"
                    dir="rtl"
                  />
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <button type="button" onClick={() => router.back()} className="btn-secondary px-8">إلغاء</button>
            <motion.button
              type="submit"
              disabled={saving || saved}
              className={cn(
                "btn-primary gap-2 px-8 min-w-40 justify-center",
                saved && "bg-green-600 border-green-600"
              )}
              whileTap={{ scale: 0.97 }}
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : saved ? (
                <Check className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? "جاري الحفظ..." : saved ? "تم الحفظ!" : "حفظ البيانات"}
            </motion.button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
