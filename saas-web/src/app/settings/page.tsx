"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings, User, Bell, Shield, Palette, Globe,
  Save, Eye, EyeOff, Check, ChevronLeft, School,
  Moon, Sun, Smartphone, Mail, Lock, Database,
} from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { FadeIn, Stagger, StaggerItem } from "@/components/ui/motion";
import { cn } from "@/lib/utils/cn";

// ─── Settings Sections ────────────────────────────────────────────────────────

const sections = [
  { id: "profile",  label: "الملف الشخصي",    icon: User,       color: "text-blue-600 bg-blue-50" },
  { id: "school",   label: "إعدادات المدرسة",  icon: School,     color: "text-purple-600 bg-purple-50" },
  { id: "notify",   label: "الإشعارات",         icon: Bell,       color: "text-amber-600 bg-amber-50" },
  { id: "security", label: "الأمان",            icon: Shield,     color: "text-red-600 bg-red-50" },
  { id: "appear",   label: "المظهر",            icon: Palette,    color: "text-pink-600 bg-pink-50" },
  { id: "system",   label: "النظام",            icon: Database,   color: "text-green-600 bg-green-50" },
];

// ─── Settings Page ────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <AppLayout title="الإعدادات">
      <div className="space-y-6">
        {/* Section Nav */}
        <FadeIn>
          <div className="flex items-center gap-2 flex-wrap">
            {sections.map(s => (
              <motion.button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                  activeSection === s.id
                    ? "bg-primary text-white shadow-glow"
                    : "bg-surface-50 border border-border text-ink-muted hover:text-ink hover:bg-surface-100"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <s.icon className="w-4 h-4" strokeWidth={1.8} />
                {s.label}
              </motion.button>
            ))}
          </div>
        </FadeIn>

        {/* Section Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {activeSection === "profile"  && <ProfileSection />}
            {activeSection === "school"   && <SchoolSection />}
            {activeSection === "notify"   && <NotifySection />}
            {activeSection === "security" && <SecuritySection />}
            {activeSection === "appear"   && <AppearSection />}
            {activeSection === "system"   && <SystemSection />}
          </motion.div>
        </AnimatePresence>

        {/* Save Button */}
        <FadeIn delay={0.2}>
          <div className="flex justify-start">
            <motion.button
              onClick={handleSave}
              className="btn-primary gap-2 px-8"
              whileTap={{ scale: 0.97 }}
            >
              <AnimatePresence mode="wait">
                {saved ? (
                  <motion.span key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    تم الحفظ
                  </motion.span>
                ) : (
                  <motion.span key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    حفظ التغييرات
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </FadeIn>
      </div>
    </AppLayout>
  );
}

// ─── Field Component ──────────────────────────────────────────────────────────

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-2 md:gap-6 py-4 border-b border-border last:border-0 items-start">
      <div className="text-right">
        <p className="text-sm font-medium text-ink">{label}</p>
        {hint && <p className="text-xs text-ink-muted mt-0.5">{hint}</p>}
      </div>
      <div>{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <div className="flex items-center justify-between">
      <motion.button
        onClick={() => onChange(!checked)}
        className={cn(
          "relative w-10 h-5.5 rounded-full transition-colors duration-300",
          checked ? "bg-primary" : "bg-surface-200"
        )}
        style={{ height: 22 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow-card"
          style={{ width: 18, height: 18 }}
          animate={{ right: checked ? 2 : "auto", left: checked ? "auto" : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
        />
      </motion.button>
      <span className="text-sm text-ink mr-3">{label}</span>
    </div>
  );
}

// ─── Profile Section ──────────────────────────────────────────────────────────

function ProfileSection() {
  const [name, setName] = useState("منى السلمي");
  const [email, setEmail] = useState("mona@school.sa");
  const [phone, setPhone] = useState("0501234567");
  const [bio, setBio] = useState("مديرة مدرسة الأمل الابتدائية - الرياض");

  return (
    <div className="card-base p-5 md:p-6">
      <h2 className="text-base font-bold text-ink mb-5 text-right">الملف الشخصي</h2>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-6 flex-row-reverse">
        <div className="w-20 h-20 rounded-2xl bg-primary-100 flex items-center justify-center flex-shrink-0">
          <span className="text-2xl font-bold text-primary-700">م.ن</span>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-ink">{name}</p>
          <p className="text-xs text-ink-muted">مديرة المدرسة</p>
          <button className="text-xs text-primary-600 hover:text-primary-700 mt-1 hover:underline">
            تغيير الصورة
          </button>
        </div>
      </div>

      <Field label="الاسم الكامل" hint="الاسم الذي يظهر في النظام">
        <input value={name} onChange={e => setName(e.target.value)} className="input-base text-right text-sm" dir="rtl" />
      </Field>
      <Field label="البريد الإلكتروني">
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-base text-right text-sm" dir="rtl" />
      </Field>
      <Field label="رقم الجوال">
        <input value={phone} onChange={e => setPhone(e.target.value)} className="input-base text-right text-sm" dir="rtl" />
      </Field>
      <Field label="نبذة مختصرة">
        <textarea
          value={bio}
          onChange={e => setBio(e.target.value)}
          rows={2}
          className="input-base text-right text-sm w-full resize-none"
          dir="rtl"
        />
      </Field>
    </div>
  );
}

// ─── School Section ───────────────────────────────────────────────────────────

function SchoolSection() {
  const [schoolName, setSchoolName] = useState("مدرسة الأمل الابتدائية");
  const [city, setCity] = useState("الرياض");
  const [district, setDistrict] = useState("حي النرجس");
  const [academicYear, setAcademicYear] = useState("1446-1447");

  return (
    <div className="card-base p-5 md:p-6">
      <h2 className="text-base font-bold text-ink mb-5 text-right">إعدادات المدرسة</h2>
      <Field label="اسم المدرسة">
        <input value={schoolName} onChange={e => setSchoolName(e.target.value)} className="input-base text-right text-sm" dir="rtl" />
      </Field>
      <Field label="المدينة">
        <input value={city} onChange={e => setCity(e.target.value)} className="input-base text-right text-sm" dir="rtl" />
      </Field>
      <Field label="الحي">
        <input value={district} onChange={e => setDistrict(e.target.value)} className="input-base text-right text-sm" dir="rtl" />
      </Field>
      <Field label="العام الدراسي">
        <input value={academicYear} onChange={e => setAcademicYear(e.target.value)} className="input-base text-right text-sm" dir="rtl" />
      </Field>
      <Field label="المرحلة الدراسية" hint="نوع المدرسة">
        <select className="input-base text-right text-sm appearance-none" dir="rtl">
          <option>ابتدائي</option>
          <option>متوسط</option>
          <option>ثانوي</option>
          <option>ابتدائي + متوسط</option>
        </select>
      </Field>
    </div>
  );
}

// ─── Notifications Section ────────────────────────────────────────────────────

function NotifySection() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [appNotif, setAppNotif] = useState(true);
  const [atRiskAlert, setAtRiskAlert] = useState(true);
  const [attendanceAlert, setAttendanceAlert] = useState(true);
  const [reportReady, setReportReady] = useState(false);
  const [loginAlert, setLoginAlert] = useState(true);

  return (
    <div className="card-base p-5 md:p-6">
      <h2 className="text-base font-bold text-ink mb-5 text-right">إعدادات الإشعارات</h2>

      <div className="space-y-0">
        <Field label="إشعارات البريد الإلكتروني" hint="إرسال تنبيهات على البريد">
          <Toggle checked={emailNotif} onChange={setEmailNotif} label={emailNotif ? "مفعّل" : "معطّل"} />
        </Field>
        <Field label="الرسائل النصية SMS" hint="إشعارات عبر الجوال">
          <Toggle checked={smsNotif} onChange={setSmsNotif} label={smsNotif ? "مفعّل" : "معطّل"} />
        </Field>
        <Field label="إشعارات التطبيق" hint="إشعارات داخل النظام">
          <Toggle checked={appNotif} onChange={setAppNotif} label={appNotif ? "مفعّل" : "معطّل"} />
        </Field>
        <Field label="تنبيهات الطلاب في الخطر" hint="إخطار فوري عند رصد طالب في خطر">
          <Toggle checked={atRiskAlert} onChange={setAtRiskAlert} label={atRiskAlert ? "مفعّل" : "معطّل"} />
        </Field>
        <Field label="تنبيهات الحضور" hint="إخطار يومي بنسبة الغياب">
          <Toggle checked={attendanceAlert} onChange={setAttendanceAlert} label={attendanceAlert ? "مفعّل" : "معطّل"} />
        </Field>
        <Field label="جاهزية التقارير" hint="إشعار عند اكتمال تقرير">
          <Toggle checked={reportReady} onChange={setReportReady} label={reportReady ? "مفعّل" : "معطّل"} />
        </Field>
        <Field label="تنبيهات تسجيل الدخول" hint="إخطار عند دخول مستخدم جديد">
          <Toggle checked={loginAlert} onChange={setLoginAlert} label={loginAlert ? "مفعّل" : "معطّل"} />
        </Field>
      </div>
    </div>
  );
}

// ─── Security Section ─────────────────────────────────────────────────────────

function SecuritySection() {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("60");

  return (
    <div className="card-base p-5 md:p-6">
      <h2 className="text-base font-bold text-ink mb-5 text-right">إعدادات الأمان</h2>

      <Field label="كلمة المرور الحالية">
        <div className="relative">
          <input
            type={showOld ? "text" : "password"}
            placeholder="••••••••"
            className="input-base text-right text-sm pl-10"
            dir="rtl"
          />
          <button
            onClick={() => setShowOld(v => !v)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
          >
            {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </Field>

      <Field label="كلمة المرور الجديدة" hint="8 أحرف على الأقل">
        <div className="relative">
          <input
            type={showNew ? "text" : "password"}
            placeholder="••••••••"
            className="input-base text-right text-sm pl-10"
            dir="rtl"
          />
          <button
            onClick={() => setShowNew(v => !v)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
          >
            {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </Field>

      <Field label="تأكيد كلمة المرور">
        <input type="password" placeholder="••••••••" className="input-base text-right text-sm" dir="rtl" />
      </Field>

      <Field label="التحقق الثنائي (2FA)" hint="أمان إضافي لحسابك">
        <Toggle checked={twoFactor} onChange={setTwoFactor} label={twoFactor ? "مفعّل" : "معطّل"} />
      </Field>

      <Field label="مهلة الجلسة" hint="تسجيل خروج تلقائي بعد">
        <select
          value={sessionTimeout}
          onChange={e => setSessionTimeout(e.target.value)}
          className="input-base text-right text-sm appearance-none w-48"
          dir="rtl"
        >
          <option value="30">30 دقيقة</option>
          <option value="60">ساعة واحدة</option>
          <option value="120">ساعتان</option>
          <option value="480">8 ساعات</option>
          <option value="0">لا تسجيل خروج تلقائي</option>
        </select>
      </Field>
    </div>
  );
}

// ─── Appearance Section ───────────────────────────────────────────────────────

const colorThemes = [
  { label: "أزرق (افتراضي)", color: "#6366f1" },
  { label: "أخضر", color: "#10b981" },
  { label: "برتقالي", color: "#f59e0b" },
  { label: "أحمر", color: "#ef4444" },
  { label: "بنفسجي", color: "#8b5cf6" },
  { label: "وردي", color: "#ec4899" },
];

function AppearSection() {
  const [theme, setTheme] = useState("light");
  const [selectedColor, setSelectedColor] = useState(0);
  const [fontSize, setFontSize] = useState("medium");
  const [compactMode, setCompactMode] = useState(false);

  return (
    <div className="card-base p-5 md:p-6">
      <h2 className="text-base font-bold text-ink mb-5 text-right">إعدادات المظهر</h2>

      <Field label="السمة" hint="وضع العرض">
        <div className="flex items-center gap-3">
          {[
            { value: "light", label: "نهاري", icon: Sun },
            { value: "dark",  label: "ليلي",  icon: Moon },
            { value: "auto",  label: "تلقائي", icon: Smartphone },
          ].map(t => (
            <motion.button
              key={t.value}
              onClick={() => setTheme(t.value)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all border",
                theme === t.value
                  ? "bg-primary text-white border-primary shadow-glow"
                  : "bg-surface-50 border-border text-ink-muted hover:text-ink"
              )}
              whileTap={{ scale: 0.97 }}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </motion.button>
          ))}
        </div>
      </Field>

      <Field label="لون التمييز" hint="اللون الرئيسي للنظام">
        <div className="flex items-center gap-3 flex-wrap">
          {colorThemes.map((c, i) => (
            <motion.button
              key={c.label}
              onClick={() => setSelectedColor(i)}
              className="relative w-8 h-8 rounded-full border-2 transition-all"
              style={{
                background: c.color,
                borderColor: selectedColor === i ? c.color : "transparent",
                boxShadow: selectedColor === i ? `0 0 0 3px ${c.color}40` : "none",
              }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              title={c.label}
            >
              {selectedColor === i && (
                <Check className="w-3 h-3 text-white absolute inset-0 m-auto" />
              )}
            </motion.button>
          ))}
        </div>
      </Field>

      <Field label="حجم الخط" hint="حجم النص في النظام">
        <div className="flex items-center gap-2">
          {[
            { value: "small",  label: "صغير" },
            { value: "medium", label: "متوسط" },
            { value: "large",  label: "كبير" },
          ].map(f => (
            <button
              key={f.value}
              onClick={() => setFontSize(f.value)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm border transition-all",
                fontSize === f.value
                  ? "bg-primary text-white border-primary"
                  : "bg-surface-50 border-border text-ink-muted hover:text-ink"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </Field>

      <Field label="الوضع المضغوط" hint="عرض المزيد من المعلومات في مساحة أصغر">
        <Toggle checked={compactMode} onChange={setCompactMode} label={compactMode ? "مفعّل" : "معطّل"} />
      </Field>
    </div>
  );
}

// ─── System Section ───────────────────────────────────────────────────────────

function SystemSection() {
  const [autoBackup, setAutoBackup] = useState(true);
  const [language, setLanguage] = useState("ar");

  return (
    <div className="card-base p-5 md:p-6">
      <h2 className="text-base font-bold text-ink mb-5 text-right">إعدادات النظام</h2>

      <Field label="اللغة" hint="لغة واجهة النظام">
        <select
          value={language}
          onChange={e => setLanguage(e.target.value)}
          className="input-base text-right text-sm appearance-none w-48"
          dir="rtl"
        >
          <option value="ar">العربية</option>
          <option value="en">English</option>
        </select>
      </Field>

      <Field label="النسخ الاحتياطي التلقائي" hint="نسخ احتياطي يومي للبيانات">
        <Toggle checked={autoBackup} onChange={setAutoBackup} label={autoBackup ? "مفعّل" : "معطّل"} />
      </Field>

      <Field label="الإصدار" hint="معلومات النظام">
        <div className="text-right space-y-1">
          <p className="text-sm text-ink">EduFlow v1.0.0</p>
          <p className="text-xs text-ink-muted">Next.js 14 · TypeScript · Tailwind CSS</p>
          <button className="text-xs text-primary-600 hover:underline mt-1">التحقق من التحديثات</button>
        </div>
      </Field>

      <Field label="استيراد البيانات" hint="استيراد من نظام آخر">
        <button
          className="btn-secondary text-sm gap-2"
          onClick={() => alert("سيتم فتح نافذة الاستيراد")}
        >
          <Database className="w-4 h-4" />
          استيراد البيانات
        </button>
      </Field>

      <Field label="منطقة الخطر" hint="إجراءات لا يمكن التراجع عنها">
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-right space-y-3">
          <p className="text-sm text-red-700 font-medium">تحذير: هذه الإجراءات لا يمكن التراجع عنها</p>
          <div className="flex gap-2 flex-wrap">
            <button
              className="px-3 py-1.5 text-xs rounded-lg bg-red-100 hover:bg-red-200 text-red-700 font-medium transition-colors"
              onClick={() => confirm("هل أنت متأكد؟ سيتم حذف جميع بيانات الفصل الحالي") && alert("تم حذف بيانات الفصل")}
            >
              حذف بيانات الفصل
            </button>
            <button
              className="px-3 py-1.5 text-xs rounded-lg bg-red-100 hover:bg-red-200 text-red-700 font-medium transition-colors"
              onClick={() => confirm("هل أنت متأكد؟ سيتم إعادة تعيين النظام بالكامل") && alert("تم إعادة التعيين")}
            >
              إعادة تعيين النظام
            </button>
          </div>
        </div>
      </Field>
    </div>
  );
}
