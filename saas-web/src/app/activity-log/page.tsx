"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Activity, CalendarCheck, BookOpen, Users, Upload,
  FileText, Search, Filter, Download, Eye, Shield,
  Clock, X,
} from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { Stagger, StaggerItem, FadeIn } from "@/components/ui/motion";
import { cn } from "@/lib/utils/cn";
import { mockActivityLogs } from "@/lib/utils/mock-data";
import { formatDate, formatRelative } from "@/lib/utils/format";
import type { ActivityLog, ActivityAction } from "@/types";

// ─── Activity Config ──────────────────────────────────────────────────────────

const actionConfig: Record<ActivityAction, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  attendance_recorded: { label: "تسجيل حضور", icon: CalendarCheck, color: "text-green-600", bg: "bg-green-50" },
  grade_entered:       { label: "إدخال درجة", icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50" },
  created:             { label: "إنشاء سجل", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
  updated:             { label: "تعديل", icon: FileText, color: "text-amber-600", bg: "bg-amber-50" },
  deleted:             { label: "حذف", icon: X, color: "text-red-600", bg: "bg-red-50" },
  viewed:              { label: "عرض", icon: Eye, color: "text-ink-muted", bg: "bg-surface-100" },
  logged_in:           { label: "تسجيل دخول", icon: Shield, color: "text-green-600", bg: "bg-green-50" },
  logged_out:          { label: "تسجيل خروج", icon: Shield, color: "text-ink-muted", bg: "bg-surface-100" },
  uploaded:            { label: "رفع ملف", icon: Upload, color: "text-indigo-600", bg: "bg-indigo-50" },
  downloaded:          { label: "تحميل", icon: Download, color: "text-blue-600", bg: "bg-blue-50" },
  exported:            { label: "تصدير", icon: Download, color: "text-blue-600", bg: "bg-blue-50" },
  report_generated:    { label: "إنشاء تقرير", icon: FileText, color: "text-purple-600", bg: "bg-purple-50" },
  ai_query:            { label: "استعلام ذكاء اصطناعي", icon: Activity, color: "text-accent", bg: "bg-accent/10" },
};

const roleLabels: Record<string, string> = {
  super_admin:  "مدير عام",
  school_admin: "مدير مدرسة",
  teacher:      "مدرس",
  secretary:    "سكرتير",
};

// ─── Extended mock logs ───────────────────────────────────────────────────────

const extendedLogs: ActivityLog[] = [
  ...mockActivityLogs,
  {
    id: "log6",
    userId: "u1",
    user: { id: "u1", name: "أحمد الزهراني", role: "teacher" },
    action: "viewed",
    resource: "student",
    resourceId: "s3",
    details: { studentName: "يوسف الغامدي" },
    ipAddress: "192.168.1.100",
    schoolId: "s1",
    createdAt: new Date(Date.now() - 2 * 60 * 60000),
  },
  {
    id: "log7",
    userId: "u5",
    user: { id: "u5", name: "سلمى الرشيدي", role: "teacher" },
    action: "grade_entered",
    resource: "grade",
    details: { subject: "العلوم", type: "midterm", count: 28 },
    schoolId: "s1",
    createdAt: new Date(Date.now() - 3 * 60 * 60000),
  },
  {
    id: "log8",
    userId: "u2",
    user: { id: "u2", name: "فاطمة العتيبي", role: "teacher" },
    action: "uploaded",
    resource: "file",
    details: { fileName: "خطة الدرس - الشعبة الثانية.docx", size: "245 KB" },
    schoolId: "s1",
    createdAt: new Date(Date.now() - 4 * 60 * 60000),
  },
  {
    id: "log9",
    userId: "u3",
    user: { id: "u3", name: "منى السلمي", role: "school_admin" },
    action: "logged_in",
    resource: "auth",
    ipAddress: "192.168.1.1",
    schoolId: "s1",
    createdAt: new Date(Date.now() - 5 * 60 * 60000),
  },
  {
    id: "log10",
    userId: "u3",
    user: { id: "u3", name: "منى السلمي", role: "school_admin" },
    action: "ai_query",
    resource: "ai",
    details: { query: "تحليل أداء الطلاب المعرضين للخطر" },
    schoolId: "s1",
    createdAt: new Date(Date.now() - 6 * 60 * 60000),
  },
];

// ─── Activity Log Page ────────────────────────────────────────────────────────

export default function ActivityLogPage() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const filtered = extendedLogs.filter(log => {
    const matchSearch = !search ||
      log.user.name.includes(search) ||
      log.resource.includes(search) ||
      (log.details && JSON.stringify(log.details).includes(search));
    const matchAction = actionFilter === "all" || log.action === actionFilter;
    const matchRole = roleFilter === "all" || log.user.role === roleFilter;
    return matchSearch && matchAction && matchRole;
  });

  // Stats
  const todayCount = extendedLogs.filter(l =>
    new Date(l.createdAt).toDateString() === new Date().toDateString()
  ).length;

  const uniqueUsers = new Set(extendedLogs.map(l => l.userId)).size;

  return (
    <AppLayout title="سجل النشاطات">
      <div className="space-y-6">
        {/* Stats */}
        <Stagger className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "نشاطات اليوم", value: todayCount, icon: Activity, color: "text-primary-600 bg-primary-50" },
            { label: "مستخدمون نشطون", value: uniqueUsers, icon: Users, color: "text-green-600 bg-green-50" },
            { label: "تعديلات البيانات", value: extendedLogs.filter(l => l.action === "updated" || l.action === "created").length, icon: FileText, color: "text-amber-600 bg-amber-50" },
            { label: "عمليات الأمان", value: extendedLogs.filter(l => l.action === "logged_in" || l.action === "logged_out").length, icon: Shield, color: "text-blue-600 bg-blue-50" },
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

        {/* Toolbar */}
        <FadeIn delay={0.1}>
          <div className="card-base p-4 flex items-center gap-3 flex-wrap">
            <div className="flex-1 relative min-w-48">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="بحث بالاسم أو النوع..."
                className="input-base pr-10 text-right"
                dir="rtl"
              />
            </div>

            <select
              value={actionFilter}
              onChange={e => setActionFilter(e.target.value)}
              className="input-base w-44 text-right"
              dir="rtl"
            >
              <option value="all">جميع الإجراءات</option>
              {Object.entries(actionConfig).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>

            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="input-base w-36 text-right"
              dir="rtl"
            >
              <option value="all">جميع الأدوار</option>
              {Object.entries(roleLabels).map(([key, val]) => (
                <option key={key} value={key}>{val}</option>
              ))}
            </select>

            <motion.button
              className="btn-secondary gap-2 text-sm"
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                const csvContent = "data:text/csv;charset=utf-8," + filtered.map(l => `${l.user.name},${l.action},${l.resource},${l.createdAt}`).join("\n");
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "activity_log.csv");
                document.body.appendChild(link);
                link.click();
                alert(`تم تصدير ${filtered.length} سجل بنجاح إلى ملف CSV`);
              }}
            >
              <Download className="w-4 h-4" />
              تصدير
            </motion.button>
          </div>
        </FadeIn>

        {/* Results info */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-ink-muted flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            يتم التحديث تلقائيًا
          </p>
          <p className="text-sm text-ink-muted">
            عرض <span className="font-semibold text-ink">{filtered.length}</span> سجل
          </p>
        </div>

        {/* Log Table */}
        <FadeIn delay={0.15}>
          <div className="card-base overflow-hidden">
            <div className="overflow-x-auto">
            <div className="min-w-[700px]">
            <div className="grid grid-cols-[2fr_1fr_1fr_2fr_1fr] gap-4 px-5 py-3 border-b border-border bg-surface-50">
              {["المستخدم", "الإجراء", "العنصر", "التفاصيل", "الوقت"].map(h => (
                <span key={h} className="text-[11px] font-semibold text-ink-muted uppercase tracking-wide text-right">{h}</span>
              ))}
            </div>

            <div className="divide-y divide-border">
              {filtered.map((log, i) => {
                const config = actionConfig[log.action] ?? actionConfig.viewed;
                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="grid grid-cols-[2fr_1fr_1fr_2fr_1fr] gap-4 px-5 py-3.5 hover:bg-surface-50 transition-colors items-center"
                  >
                    {/* User */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-primary-700">{log.user.name.charAt(0)}</span>
                      </div>
                      <div className="text-right min-w-0">
                        <p className="text-sm font-medium text-ink truncate">{log.user.name}</p>
                        <p className="text-xs text-ink-muted">{roleLabels[log.user.role]}</p>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="text-right">
                      <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg", config.bg)}>
                        <config.icon className={cn("w-3 h-3", config.color)} strokeWidth={2} />
                        <span className={cn("text-[11px] font-medium", config.color)}>{config.label}</span>
                      </div>
                    </div>

                    {/* Resource */}
                    <div className="text-right">
                      <span className="badge-neutral text-[11px]">{log.resource}</span>
                    </div>

                    {/* Details */}
                    <div className="text-right">
                      {log.details ? (
                        <p className="text-xs text-ink-muted truncate">
                          {Object.values(log.details).filter(v => typeof v === "string").join(" · ")}
                        </p>
                      ) : (
                        <span className="text-xs text-ink-subtle">—</span>
                      )}
                      {log.ipAddress && (
                        <p className="text-[10px] text-ink-subtle mt-0.5">{log.ipAddress}</p>
                      )}
                    </div>

                    {/* Time */}
                    <div className="text-right">
                      <p className="text-xs text-ink-muted">{formatRelative(log.createdAt)}</p>
                      <p className="text-[10px] text-ink-subtle mt-0.5">{formatDate(log.createdAt, "HH:mm")}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </AppLayout>
  );
}
