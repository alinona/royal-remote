"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings, Bell, Shield, Palette, Database, Save,
  School, Mail, Phone, Check, Eye, EyeOff, Download,
  Upload, Trash2, RefreshCw, Moon, Sun, Monitor,
  Lock, Key, Smartphone, AlertTriangle, X,
} from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { FadeIn, Stagger, StaggerItem } from "@/components/ui/motion";
import { cn } from "@/lib/utils/cn";

const tabs = [
  { id: "general",       label: "إعدادات عامة",  icon: School },
  { id: "notifications", label: "التنبيهات",      icon: Bell },
  { id: "security",      label: "الأمان",         icon: Shield },
  { id: "appearance",    label: "المظهر",         icon: Palette },
  { id: "data",          label: "البيانات",       icon: Database },
];

// ─── Toggle Component ─────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        "relative w-10 h-5.5 rounded-full transition-colors duration-200 flex-shrink-0",
        checked ? "bg-primary" : "bg-surface-200"
      )}
      style={{ height: "22px" }}
    >
      <motion.div
        className="absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow-sm"
        style={{ width: "18px", height: "18px" }}
        animate={{ x: checked ? "22px" : "2px" }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

// ─── Settings Page ────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1200);
  };

  return (
    <AppLayout title="الإعدادات">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-right",
                activeTab === tab.id
                  ? "bg-primary text-white shadow-glow"
                  : "bg-card text-ink-muted hover:bg-surface-50 hover:text-ink border border-border"
              )}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <FadeIn>
            <div className="card-base p-6">
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-border">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className={cn(
                    "btn-primary gap-2 min-w-32 justify-center",
                    saved && "bg-green-600 border-green-600 hover:bg-green-700"
                  )}
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : saved ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {saving ? "جاري الحفظ..." : saved ? "تم الحفظ!" : "حفظ التغييرات"}
                </button>
                <div className="text-right">
                  <h2 className="text-lg font-bold text-ink">
                    {tabs.find(t => t.id === activeTab)?.label}
                  </h2>
                  <p className="text-sm text-ink-muted">إدارة إعدادات النظام وتخصيص التجربة</p>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === "general"       && <GeneralTab />}
                  {activeTab === "notifications"  && <NotificationsTab />}
                  {activeTab === "security"       && <SecurityTab />}
                  {activeTab === "appearance"     && <AppearanceTab />}
                  {activeTab === "data"           && <DataTab />}
                </motion.div>
              </AnimatePresence>
            </div>
          </FadeIn>
        </div>
      </div>
    </AppLayout>
  );
}

// ─── General Tab ──────────────────────────────────────────────────────────────

function GeneralTab() {
  const [form, setForm] = useState({
    name: "مدرسة منارات المستقبل النموذجية",
    email: "info@future-school.edu.sa",
    phone: "+966 50 123 4567",
    address: "الرياض، حي الملقا، طريق الملك فهد",
    year: "1446",
    gradeSystem: "100",
    principal: "أ. منى السلمي",
  });

  return (
    <Stagger className="space-y-4">
      <StaggerItem>
        <label className="block text-sm font-medium text-ink mb-1.5 text-right">اسم المدرسة</label>
        <input
          type="text"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          className="input-base text-right"
          dir="rtl"
        />
      </StaggerItem>
      <div className="grid grid-cols-2 gap-4">
        <StaggerItem>
          <label className="block text-sm font-medium text-ink mb-1.5 text-right">البريد الإلكتروني</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" />
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="input-base pl-10 text-right"
              dir="rtl"
            />
          </div>
        </StaggerItem>
        <StaggerItem>
          <label className="block text-sm font-medium text-ink mb-1.5 text-right">رقم الهاتف</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" />
            <input
              type="tel"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              className="input-base pl-10 text-right"
              dir="rtl"
            />
          </div>
        </StaggerItem>
      </div>
      <StaggerItem>
        <label className="block text-sm font-medium text-ink mb-1.5 text-right">العنوان</label>
        <textarea
          rows={3}
          value={form.address}
          onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
          className="input-base text-right"
          dir="rtl"
        />
      </StaggerItem>
      <div className="grid grid-cols-2 gap-4">
        <StaggerItem>
          <label className="block text-sm font-medium text-ink mb-1.5 text-right">العام الدراسي</label>
          <select
            value={form.year}
            onChange={e => setForm(f => ({ ...f, year: e.target.value }))}
            className="input-base text-right"
            dir="rtl"
          >
            {["1445", "1446", "1447"].map(y => <option key={y} value={y}>{y}/{Number(y)+1} هـ</option>)}
          </select>
        </StaggerItem>
        <StaggerItem>
          <label className="block text-sm font-medium text-ink mb-1.5 text-right">نظام التقييم</label>
          <select
            value={form.gradeSystem}
            onChange={e => setForm(f => ({ ...f, gradeSystem: e.target.value }))}
            className="input-base text-right"
            dir="rtl"
          >
            <option value="100">نسبة مئوية (100)</option>
            <option value="letter">حروف (A-F)</option>
            <option value="gpa">GPA (4.0)</option>
          </select>
        </StaggerItem>
      </div>
      <StaggerItem>
        <label className="block text-sm font-medium text-ink mb-1.5 text-right">اسم مدير المدرسة</label>
        <input
          type="text"
          value={form.principal}
          onChange={e => setForm(f => ({ ...f, principal: e.target.value }))}
          className="input-base text-right"
          dir="rtl"
        />
      </StaggerItem>
    </Stagger>
  );
}

// ─── Notifications Tab ────────────────────────────────────────────────────────

function NotificationsTab() {
  const [settings, setSettings] = useState({
    emailAttendance:   true,
    emailGrades:       true,
    emailReports:      false,
    emailAI:           true,
    pushAbsence:       true,
    pushRisk:          true,
    pushSystem:        false,
    pushNewStudent:    true,
    digestDaily:       true,
    digestWeekly:      false,
    alertLowAttendance: true,
    alertHighRisk:     true,
  });

  const toggle = (key: keyof typeof settings) =>
    setSettings(s => ({ ...s, [key]: !s[key] }));

  const groups = [
    {
      title: "إشعارات البريد الإلكتروني",
      icon: Mail,
      items: [
        { key: "emailAttendance",  label: "تقارير الحضور اليومية",        desc: "ملخص يومي بعد إغلاق الحضور" },
        { key: "emailGrades",      label: "إدخال الدرجات",               desc: "عند إدخال درجات جديدة" },
        { key: "emailReports",     label: "التقارير المُنشأة",            desc: "إرسال التقارير فور إنشائها" },
        { key: "emailAI",          label: "تنبيهات الذكاء الاصطناعي",    desc: "عند اكتشاف مخاطر جديدة" },
      ],
    },
    {
      title: "الإشعارات الفورية (Push)",
      icon: Bell,
      items: [
        { key: "pushAbsence",   label: "غياب الطلاب",          desc: "عند تسجيل غياب متكرر" },
        { key: "pushRisk",      label: "طلاب في خطر",          desc: "عند تصنيف طالب ضمن خطر عالي" },
        { key: "pushSystem",    label: "تحديثات النظام",        desc: "صيانة وتحديثات النظام" },
        { key: "pushNewStudent", label: "طالب جديد",           desc: "عند تسجيل طالب جديد" },
      ],
    },
    {
      title: "التنبيهات الذكية",
      icon: AlertTriangle,
      items: [
        { key: "alertLowAttendance", label: "انخفاض نسبة الحضور",  desc: "تحت 85% للصف" },
        { key: "alertHighRisk",      label: "ارتفاع مستوى الخطر",  desc: "أكثر من 10% من الطلاب في خطر" },
        { key: "digestDaily",        label: "ملخص يومي",           desc: "تقرير موجز كل يوم دراسي" },
        { key: "digestWeekly",       label: "ملخص أسبوعي",        desc: "تقرير أسبوعي شامل" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {groups.map(group => (
        <div key={group.title}>
          <div className="flex items-center gap-2 mb-4">
            <group.icon className="w-4 h-4 text-ink-muted" />
            <h3 className="text-sm font-semibold text-ink">{group.title}</h3>
          </div>
          <div className="space-y-3">
            {group.items.map(item => (
              <div key={item.key} className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-50 transition-colors">
                <Toggle
                  checked={settings[item.key as keyof typeof settings]}
                  onChange={() => toggle(item.key as keyof typeof settings)}
                />
                <div className="text-right flex-1 mr-3">
                  <p className="text-sm font-medium text-ink">{item.label}</p>
                  <p className="text-xs text-ink-muted mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Security Tab ─────────────────────────────────────────────────────────────

function SecurityTab() {
  const [showCurrent, setShowCurrent]   = useState(false);
  const [showNew, setShowNew]           = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [currentPw, setCurrentPw]       = useState("");
  const [newPw, setNewPw]               = useState("");
  const [confirmPw, setConfirmPw]       = useState("");
  const [changingPw, setChangingPw]     = useState(false);
  const [pwChanged, setPwChanged]       = useState(false);
  const [pwError, setPwError]           = useState("");
  const [twoFA, setTwoFA]               = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("60");

  const handleChangePw = () => {
    setPwError("");
    if (!currentPw) { setPwError("أدخل كلمة المرور الحالية"); return; }
    if (newPw.length < 8) { setPwError("كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل"); return; }
    if (newPw !== confirmPw) { setPwError("كلمتا المرور غير متطابقتين"); return; }
    setChangingPw(true);
    setTimeout(() => {
      setChangingPw(false);
      setPwChanged(true);
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
      setTimeout(() => setPwChanged(false), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <div>
        <h3 className="text-sm font-semibold text-ink mb-4 flex items-center gap-2">
          <Lock className="w-4 h-4 text-ink-muted" />
          تغيير كلمة المرور
        </h3>
        <div className="space-y-3">
          {[
            { label: "كلمة المرور الحالية", value: currentPw, onChange: setCurrentPw, show: showCurrent, toggle: () => setShowCurrent(!showCurrent) },
            { label: "كلمة المرور الجديدة", value: newPw, onChange: setNewPw, show: showNew, toggle: () => setShowNew(!showNew) },
            { label: "تأكيد كلمة المرور", value: confirmPw, onChange: setConfirmPw, show: showConfirm, toggle: () => setShowConfirm(!showConfirm) },
          ].map(field => (
            <div key={field.label}>
              <label className="block text-xs text-ink-muted mb-1.5 text-right">{field.label}</label>
              <div className="relative">
                <button
                  onClick={field.toggle}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink"
                >
                  {field.show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <input
                  type={field.show ? "text" : "password"}
                  value={field.value}
                  onChange={e => field.onChange(e.target.value)}
                  className="input-base text-right pl-10"
                  dir="rtl"
                />
              </div>
            </div>
          ))}

          {pwError && (
            <p className="text-xs text-red-600 text-right flex items-center gap-1.5">
              <X className="w-3 h-3" /> {pwError}
            </p>
          )}
          {pwChanged && (
            <p className="text-xs text-green-600 text-right flex items-center gap-1.5">
              <Check className="w-3 h-3" /> تم تغيير كلمة المرور بنجاح
            </p>
          )}

          <button
            onClick={handleChangePw}
            disabled={changingPw}
            className="btn-primary gap-2 text-sm"
          >
            {changingPw
              ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <Key className="w-4 h-4" />
            }
            {changingPw ? "جاري التغيير..." : "تغيير كلمة المرور"}
          </button>
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <h3 className="text-sm font-semibold text-ink mb-4 flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-ink-muted" />
          التحقق الثنائي (2FA)
        </h3>
        <div className="flex items-center justify-between p-4 rounded-xl bg-surface-50 border border-border">
          <div className="flex items-center gap-3">
            <Toggle checked={twoFA} onChange={setTwoFA} />
            {twoFA && (
              <span className="badge bg-green-100 text-green-700 text-[11px]">مفعّل</span>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-ink">المصادقة الثنائية عبر التطبيق</p>
            <p className="text-xs text-ink-muted mt-0.5">
              {twoFA ? "حسابك محمي بطبقة إضافية من الأمان" : "قم بتفعيل التحقق الثنائي لزيادة أمان حسابك"}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <h3 className="text-sm font-semibold text-ink mb-4 flex items-center gap-2">
          <Settings className="w-4 h-4 text-ink-muted" />
          إعدادات الجلسة
        </h3>
        <div>
          <label className="block text-xs text-ink-muted mb-1.5 text-right">انتهاء الجلسة تلقائيًا بعد</label>
          <select
            value={sessionTimeout}
            onChange={e => setSessionTimeout(e.target.value)}
            className="input-base text-right w-56"
            dir="rtl"
          >
            <option value="30">30 دقيقة</option>
            <option value="60">ساعة واحدة</option>
            <option value="120">ساعتان</option>
            <option value="480">8 ساعات</option>
            <option value="never">لا تنتهي</option>
          </select>
        </div>
        <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              آخر تسجيل دخول: اليوم · 09:34 ص · الرياض، المملكة العربية السعودية
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Appearance Tab ───────────────────────────────────────────────────────────

function AppearanceTab() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("eduflow_theme") as "light" | "dark" | "system") ?? "light";
    }
    return "light";
  });
  const [primaryHue, setPrimaryHue] = useState<number>(() => {
    if (typeof window !== "undefined") {
      return Number(localStorage.getItem("eduflow_hue") ?? "232");
    }
    return 232;
  });
  const [fontSize, setFontSize] = useState<string>(() => {
    if (typeof window !== "undefined") return localStorage.getItem("eduflow_fontsize") ?? "medium";
    return "medium";
  });
  const [sidebarCompact, setSidebarCompact] = useState(false);
  const [animations, setAnimations] = useState(true);
  const [rtl, setRtl] = useState(true);

  const presetColors = [
    { label: "بنفسجي (الافتراضي)", hue: 232, color: "#4f46e5" },
    { label: "أزرق", hue: 210, color: "#2563eb" },
    { label: "أخضر", hue: 142, color: "#16a34a" },
    { label: "ذهبي", hue: 38, color: "#d97706" },
    { label: "وردي", hue: 330, color: "#db2777" },
    { label: "أحمر", hue: 0, color: "#dc2626" },
  ];

  // Apply dark/light/system theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
    } else {
      root.classList.toggle("dark", window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    localStorage.setItem("eduflow_theme", theme);
  }, [theme]);

  // Apply primary color CSS variables
  useEffect(() => {
    const H = primaryHue;
    const r = document.documentElement;
    r.style.setProperty("--primary-50",  `${H} 100% 97%`);
    r.style.setProperty("--primary-100", `${H} 96% 93%`);
    r.style.setProperty("--primary-200", `${H} 92% 86%`);
    r.style.setProperty("--primary-300", `${H} 88% 76%`);
    r.style.setProperty("--primary-400", `${H} 82% 65%`);
    r.style.setProperty("--primary-500", `${H} 76% 55%`);
    r.style.setProperty("--primary-600", `${H} 72% 48%`);
    r.style.setProperty("--primary-700", `${H} 68% 40%`);
    r.style.setProperty("--primary-800", `${H} 64% 32%`);
    r.style.setProperty("--primary-900", `${H} 60% 22%`);
    r.style.setProperty("--primary",     `${H} 76% 55%`);
    r.style.setProperty("--ring",        `${H} 76% 55%`);
    localStorage.setItem("eduflow_hue", String(H));
  }, [primaryHue]);

  // Apply font size
  useEffect(() => {
    const sizes: Record<string, string> = { small: "13px", medium: "15px", large: "17px" };
    document.documentElement.style.setProperty("--font-size-base", sizes[fontSize] ?? "15px");
    localStorage.setItem("eduflow_fontsize", fontSize);
  }, [fontSize]);

  // Apply animations toggle
  useEffect(() => {
    document.documentElement.classList.toggle("no-animations", !animations);
  }, [animations]);

  return (
    <div className="space-y-6">
      {/* Theme */}
      <div>
        <h3 className="text-sm font-semibold text-ink mb-3">وضع العرض</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: "light", label: "فاتح", icon: Sun },
            { id: "dark", label: "داكن", icon: Moon },
            { id: "system", label: "تلقائي", icon: Monitor },
          ].map(option => (
            <button
              key={option.id}
              onClick={() => setTheme(option.id as typeof theme)}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all",
                theme === option.id
                  ? "border-primary bg-primary-50 text-primary-700"
                  : "border-border bg-surface-50 text-ink-muted hover:bg-surface-100"
              )}
            >
              <option.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <h3 className="text-sm font-semibold text-ink mb-3">لون النظام الأساسي</h3>
        <div className="grid grid-cols-3 gap-2">
          {presetColors.map(preset => (
            <button
              key={preset.hue}
              onClick={() => setPrimaryHue(preset.hue)}
              className={cn(
                "flex items-center gap-2.5 p-3 rounded-xl border transition-all text-right",
                primaryHue === preset.hue
                  ? "border-current bg-current/10"
                  : "border-border bg-surface-50 hover:bg-surface-100"
              )}
              style={primaryHue === preset.hue ? { borderColor: preset.color, background: preset.color + "18" } : {}}
            >
              {primaryHue === preset.hue && (
                <Check className="w-3 h-3 flex-shrink-0" style={{ color: preset.color }} />
              )}
              <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: preset.color }} />
              <span className="text-xs text-ink">{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div>
        <h3 className="text-sm font-semibold text-ink mb-3">حجم الخط</h3>
        <div className="flex items-center gap-2">
          {["small", "medium", "large"].map(size => (
            <button
              key={size}
              onClick={() => setFontSize(size)}
              className={cn(
                "px-4 py-2 rounded-xl border text-sm transition-all",
                fontSize === size
                  ? "bg-primary text-white border-primary"
                  : "border-border bg-surface-50 text-ink-muted hover:bg-surface-100"
              )}
            >
              {size === "small" ? "صغير" : size === "medium" ? "متوسط" : "كبير"}
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-3">
        {[
          { key: "sidebarCompact", label: "قائمة جانبية مضغوطة", desc: "إخفاء النصوص وعرض الأيقونات فقط", value: sidebarCompact, onChange: setSidebarCompact },
          { key: "animations", label: "تفعيل الحركات والانتقالات", desc: "حركات ناعمة بين الصفحات والمكونات", value: animations, onChange: setAnimations },
          { key: "rtl", label: "الاتجاه من اليمين لليسار (RTL)", desc: "مخصص للغة العربية", value: rtl, onChange: setRtl },
        ].map(item => (
          <div key={item.key} className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-50 transition-colors">
            <Toggle checked={item.value} onChange={item.onChange} />
            <div className="text-right flex-1 mr-3">
              <p className="text-sm font-medium text-ink">{item.label}</p>
              <p className="text-xs text-ink-muted mt-0.5">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Data Tab ─────────────────────────────────────────────────────────────────

function DataTab() {
  const [backingUp, setBackingUp] = useState(false);
  const [backedUp, setBackedUp]   = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const [retention, setRetention]   = useState("365");
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting]   = useState(false);
  const [imported, setImported]     = useState(false);
  const importRef = React.useRef<HTMLInputElement>(null);

  const handleBackup = () => {
    setBackingUp(true);
    setTimeout(() => {
      setBackingUp(false);
      setBackedUp(true);
      setTimeout(() => setBackedUp(false), 4000);
    }, 2000);
  };

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      // Generate comprehensive CSV export
      const csvContent = "data:text/csv;charset=utf-8,\uFEFFنوع البيانات,العدد,آخر تحديث\nطلاب,1248,اليوم\nمدرسون,87,اليوم\nصفوف,42,اليوم\nسجلات حضور,18500,اليوم\nدرجات,12300,اليوم";
      const link = document.createElement("a");
      link.href = encodeURI(csvContent);
      link.download = `eduflow_export_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setExporting(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Backup */}
      <div>
        <h3 className="text-sm font-semibold text-ink mb-4 flex items-center gap-2">
          <Database className="w-4 h-4 text-ink-muted" />
          نسخة احتياطية
        </h3>
        <div className="p-4 bg-surface-50 rounded-xl border border-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-ink-muted">آخر نسخة احتياطية: منذ 3 أيام</span>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-xs text-amber-600">يُنصح بالتحديث</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleBackup}
              disabled={backingUp}
              className={cn(
                "btn-primary gap-2 text-sm",
                backedUp && "bg-green-600 border-green-600"
              )}
            >
              {backingUp
                ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : backedUp ? <Check className="w-4 h-4" />
                : <RefreshCw className="w-4 h-4" />
              }
              {backingUp ? "جاري النسخ..." : backedUp ? "تم بنجاح!" : "إنشاء نسخة احتياطية"}
            </button>
            <button
              className="btn-secondary gap-2 text-sm"
              onClick={() => {
                const content = "نسخة احتياطية - مدرسة منارات المستقبل\nالتاريخ: " + new Date().toLocaleDateString("ar-SA");
                const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `backup_${new Date().toISOString().slice(0, 10)}.txt`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
              }}
            >
              <Download className="w-4 h-4" />
              تحميل آخر نسخة
            </button>
          </div>
        </div>
      </div>

      {/* Export */}
      <div className="border-t border-border pt-6">
        <h3 className="text-sm font-semibold text-ink mb-4 flex items-center gap-2">
          <Download className="w-4 h-4 text-ink-muted" />
          تصدير البيانات
        </h3>
        <div className="space-y-3">
          <p className="text-xs text-ink-muted text-right">
            قم بتصدير جميع بيانات المدرسة (طلاب، درجات، حضور، مدرسون) في ملف شامل.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "تصدير كامل (CSV)", format: "csv" },
              { label: "تصدير Excel", format: "xlsx" },
            ].map(opt => (
              <button
                key={opt.format}
                onClick={handleExport}
                disabled={exporting}
                className="btn-secondary gap-2 text-sm justify-center"
              >
                {exporting
                  ? <div className="w-3.5 h-3.5 border-2 border-ink-muted/30 border-t-ink-muted rounded-full animate-spin" />
                  : <Download className="w-4 h-4" />
                }
                {exporting ? "جاري التصدير..." : opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Import */}
      <div className="border-t border-border pt-6">
        <h3 className="text-sm font-semibold text-ink mb-4 flex items-center gap-2">
          <Upload className="w-4 h-4 text-ink-muted" />
          استيراد البيانات
        </h3>
        <input
          ref={importRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          className="hidden"
          onChange={e => {
            const f = e.target.files?.[0];
            if (f) { setImportFile(f); setImported(false); }
          }}
        />
        <div
          onClick={() => importRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
            importFile ? "border-primary bg-primary-50" : "border-border hover:border-primary-300 hover:bg-surface-50"
          }`}
        >
          <Upload className={`w-8 h-8 mx-auto mb-2 ${importFile ? "text-primary-600" : "text-ink-subtle"}`} />
          {importFile ? (
            <>
              <p className="text-sm font-semibold text-primary-700">{importFile.name}</p>
              <p className="text-xs text-ink-muted mt-1">{(importFile.size / 1024).toFixed(1)} KB — جاهز للاستيراد</p>
            </>
          ) : (
            <>
              <p className="text-sm text-ink-muted mb-1">اسحب ملف CSV أو Excel هنا</p>
              <p className="text-xs text-ink-subtle mb-3">أو</p>
            </>
          )}
          {!importFile && (
            <button
              onClick={e => { e.stopPropagation(); importRef.current?.click(); }}
              className="btn-secondary text-sm gap-2"
            >
              <Upload className="w-4 h-4" />
              اختر ملفًا من جهازك
            </button>
          )}
        </div>
        {importFile && !imported && (
          <button
            onClick={() => {
              setImporting(true);
              setTimeout(() => { setImporting(false); setImported(true); }, 1500);
            }}
            disabled={importing}
            className="btn-primary gap-2 text-sm mt-3"
          >
            {importing ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {importing ? "جارٍ الاستيراد..." : "استيراد الآن"}
          </button>
        )}
        {imported && (
          <p className="text-xs text-green-600 flex items-center gap-1.5 mt-2">
            <Check className="w-3 h-3" /> تم استيراد البيانات بنجاح
          </p>
        )}
      </div>

      {/* Retention */}
      <div className="border-t border-border pt-6">
        <h3 className="text-sm font-semibold text-ink mb-4 flex items-center gap-2">
          <Settings className="w-4 h-4 text-ink-muted" />
          سياسة الاحتفاظ بالبيانات
        </h3>
        <div>
          <label className="block text-xs text-ink-muted mb-1.5 text-right">
            الاحتفاظ بسجل النشاطات لمدة
          </label>
          <select
            value={retention}
            onChange={e => setRetention(e.target.value)}
            className="input-base text-right w-56"
            dir="rtl"
          >
            <option value="90">3 أشهر</option>
            <option value="180">6 أشهر</option>
            <option value="365">سنة كاملة</option>
            <option value="730">سنتان</option>
            <option value="forever">للأبد</option>
          </select>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="border-t border-red-100 pt-6">
        <h3 className="text-sm font-semibold text-red-600 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          منطقة الخطر
        </h3>
        <div className="p-4 bg-red-50 rounded-xl border border-red-200">
          <p className="text-sm font-medium text-red-700 text-right mb-1">حذف جميع بيانات المدرسة</p>
          <p className="text-xs text-red-600 text-right mb-3">
            هذا الإجراء لا يمكن التراجع عنه. ستُحذف جميع البيانات نهائيًا.
          </p>
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="btn-secondary text-sm text-red-600 border-red-300 hover:bg-red-100 gap-2"
            >
              <Trash2 className="w-4 h-4" />
              حذف جميع البيانات
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-red-600 text-right">اكتب <strong>احذف بياناتي</strong> للتأكيد:</p>
              <input
                value={deleteText}
                onChange={e => setDeleteText(e.target.value)}
                placeholder="احذف بياناتي"
                className="input-base text-right border-red-300 focus:ring-red-400"
                dir="rtl"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => { setShowDeleteConfirm(false); setDeleteText(""); }}
                  className="btn-secondary flex-1 text-sm"
                >
                  إلغاء
                </button>
                <button
                  disabled={deleteText !== "احذف بياناتي"}
                  className={cn(
                    "flex-1 btn-primary bg-red-600 border-red-600 hover:bg-red-700 text-sm",
                    deleteText !== "احذف بياناتي" && "opacity-40 cursor-not-allowed"
                  )}
                >
                  تأكيد الحذف
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
