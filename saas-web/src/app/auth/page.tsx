"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, School, Shield, Zap, Lock, Mail, X, CheckCircle } from "lucide-react";
import { GeometricMesh, FloatingRing, FloatingDiamond, FloatingHex, GradientOrb } from "@/components/ui/geometric-shapes";
import { cn } from "@/lib/utils/cn";

// ─── Auth Page ────────────────────────────────────────────────────────────────

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen flex geometric-bg overflow-hidden" dir="rtl">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-primary-900 via-primary-700 to-primary-500 items-center justify-center overflow-hidden">
        <GeometricMesh />

        {/* Floating shapes */}
        <FloatingRing className="absolute top-16 right-16" size={100} color="rgba(255,255,255,0.1)" />
        <FloatingDiamond className="absolute bottom-32 left-24" size={60} color="rgba(255,255,255,0.08)" delay={1} />
        <FloatingHex className="absolute top-1/3 left-16" size={80} color="rgba(255,255,255,0.06)" delay={2} />
        <FloatingRing className="absolute bottom-16 right-32" size={64} color="rgba(255,255,255,0.12)" delay={3} />

        {/* Content */}
        <div className="relative text-center text-white px-12">
          <motion.div
            className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center mx-auto mb-6"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <School className="w-10 h-10 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold mb-4"
          >
            EduFlow
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-white/80 mb-8"
          >
            نظام إدارة المدارس الحكومية
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/60 text-sm leading-relaxed max-w-xs mx-auto"
          >
            منصة متكاملة وذكية لإدارة جميع جوانب المدرسة — من الطلاب إلى الدرجات، من الحضور إلى التقارير
          </motion.p>

          {/* Feature chips */}
          <div className="flex flex-wrap gap-2 mt-8 justify-center">
            {["ذكاء اصطناعي", "تحليلات متقدمة", "إدارة الملفات", "تطبيق موبايل"].map((f, i) => (
              <motion.span
                key={f}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="px-3 py-1.5 bg-white/10 backdrop-blur border border-white/20 rounded-full text-xs text-white/80"
              >
                {f}
              </motion.span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background relative">
        <GradientOrb className="absolute top-0 right-0 w-96 h-96 -translate-y-1/2 translate-x-1/2" />
        <GradientOrb className="absolute bottom-0 left-0 w-80 h-80 translate-y-1/2 -translate-x-1/2" primary={false} />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md relative"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-glow">
              <School className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-ink">EduFlow</span>
          </div>

          {/* Header */}
          <div className="text-right mb-8">
            <h2 className="text-2xl font-bold text-ink">مرحبًا بعودتك</h2>
            <p className="text-sm text-ink-muted mt-1">سجّل دخولك للوصول إلى لوحة التحكم</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-sm font-medium text-ink block text-right mb-1.5">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@school.edu.sa"
                  className="input-base pr-10 text-right"
                  dir="rtl"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-ink block text-right mb-1.5">
                كلمة المرور
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-base pr-10 pl-10 text-right"
                  dir="rtl"
                  required
                />
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-xs text-primary-600 hover:text-primary-700 hover:underline transition-colors"
              >
                نسيت كلمة المرور؟
              </button>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-xs text-ink-muted">تذكرني</span>
                <input type="checkbox" className="w-4 h-4 rounded accent-primary" />
              </label>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full btn-primary justify-center py-3 text-base"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    جارٍ تسجيل الدخول...
                  </motion.div>
                ) : (
                  <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    تسجيل الدخول
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </form>

          {/* Forgot Password Modal */}
          <AnimatePresence>
            {showForgotPassword && (
              <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} />
            )}
          </AnimatePresence>

          {/* Security badges */}
          <div className="flex items-center gap-4 mt-6 justify-center">
            {[
              { icon: Shield, label: "تشفير SSL" },
              { icon: Lock, label: "بيانات آمنة" },
              { icon: Zap, label: "مصادقة ثنائية" },
            ].map(badge => (
              <div key={badge.label} className="flex items-center gap-1.5 text-ink-subtle">
                <badge.icon className="w-3.5 h-3.5" />
                <span className="text-[11px]">{badge.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Forgot Password Modal ────────────────────────────────────────────────────

function ForgotPasswordModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 1200));
    setSending(false);
    setSent(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto bg-card rounded-2xl border border-border shadow-card-hover overflow-hidden"
        dir="rtl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-50 text-ink-muted hover:text-ink">
            <X className="w-4 h-4" />
          </button>
          <h2 className="text-base font-bold text-ink">استعادة كلمة المرور</h2>
        </div>

        <div className="p-6">
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-base font-bold text-ink">تم إرسال الرابط!</h3>
              <p className="text-sm text-ink-muted mt-2">
                تم إرسال رابط استعادة كلمة المرور إلى <span className="font-semibold text-ink">{email}</span>. تحقق من بريدك الإلكتروني.
              </p>
              <button onClick={onClose} className="btn-primary mt-5 w-full justify-center text-sm">
                حسنًا
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSend} className="space-y-4">
              <p className="text-sm text-ink-muted text-right">
                أدخل بريدك الإلكتروني وسنرسل لك رابطًا لاستعادة كلمة المرور.
              </p>
              <div>
                <label className="text-sm font-medium text-ink block text-right mb-1.5">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@school.edu.sa"
                    className="input-base pr-10 text-right w-full"
                    dir="rtl"
                    required
                    autoFocus
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center text-sm">
                  إلغاء
                </button>
                <motion.button
                  type="submit"
                  disabled={!email.trim() || sending}
                  className={cn("btn-primary flex-1 justify-center text-sm", (!email.trim() || sending) && "opacity-60 cursor-not-allowed")}
                  whileTap={{ scale: 0.97 }}
                >
                  {sending ? (
                    <span className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      إرسال...
                    </span>
                  ) : "إرسال الرابط"}
                </motion.button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </>
  );
}
