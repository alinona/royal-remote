"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  UserPlus, ArrowRight, Save, User, 
  Calendar, MapPin, Phone, Mail, 
  GraduationCap, ShieldCheck, AlertCircle
} from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { FadeIn, Stagger, StaggerItem } from "@/components/ui/motion";
import { cn } from "@/lib/utils/cn";

export default function NewStudentPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert("تم حفظ بيانات الطالب بنجاح في النظام");
      router.push("/students");
    }, 1500);
  };

  return (
    <AppLayout title="إضافة طالب جديد">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => router.back()}
            className="btn-secondary gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            رجوع
          </button>
          <div className="text-right">
            <h1 className="text-2xl font-bold text-ink">تسجيل طالب جديد</h1>
            <p className="text-sm text-ink-muted">إدخال بيانات الطالب الأساسية والأكاديمية</p>
          </div>
        </div>

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
                    <input type="text" required className="input-base text-right" placeholder="أدخل الاسم الأول" />
                  </div>
                  <div className="text-right">
                    <label className="block text-sm font-medium text-ink mb-1.5">اسم العائلة</label>
                    <input type="text" required className="input-base text-right" placeholder="أدخل اسم العائلة" />
                  </div>
                  <div className="text-right">
                    <label className="block text-sm font-medium text-ink mb-1.5">تاريخ الميلاد</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" />
                      <input type="date" required className="input-base pl-10 text-right" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-right">
                    <label className="block text-sm font-medium text-ink mb-1.5">الجنس</label>
                    <select className="input-base text-right" dir="rtl">
                      <option value="male">ذكر</option>
                      <option value="female">أنثى</option>
                    </select>
                  </div>
                  <div className="text-right">
                    <label className="block text-sm font-medium text-ink mb-1.5">رقم الهوية / الإقامة</label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" />
                      <input type="text" required maxLength={10} className="input-base pl-10 text-right" placeholder="10 أرقام" />
                    </div>
                  </div>
                  <div className="text-right">
                    <label className="block text-sm font-medium text-ink mb-1.5">العنوان</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" />
                      <input type="text" className="input-base pl-10 text-right" placeholder="الحي، الشارع" />
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
                  <select className="input-base text-right" dir="rtl">
                    <option value="1">الصف الأول</option>
                    <option value="2">الصف الثاني</option>
                    <option value="3">الصف الثالث</option>
                  </select>
                </div>
                <div className="text-right">
                  <label className="block text-sm font-medium text-ink mb-1.5">الشعبة</label>
                  <select className="input-base text-right" dir="rtl">
                    <option value="A">شعبة أ</option>
                    <option value="B">شعبة ب</option>
                    <option value="C">شعبة ج</option>
                  </select>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <button 
              type="button"
              onClick={() => router.back()}
              className="btn-secondary px-8"
            >
              إلغاء
            </button>
            <button 
              type="submit"
              disabled={saving}
              className="btn-primary gap-2 px-8"
            >
              <Save className="w-4 h-4" />
              {saving ? "جاري الحفظ..." : "حفظ البيانات"}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
