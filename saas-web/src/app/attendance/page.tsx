"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarCheck, ChevronLeft, ChevronRight, Check, X,
  Clock, AlertCircle, Users, Download, Filter,
} from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { Stagger, StaggerItem, FadeIn } from "@/components/ui/motion";
import { cn } from "@/lib/utils/cn";
import { mockStudents, mockClasses } from "@/lib/utils/mock-data";
import { formatDate, attendanceStatusLabel } from "@/lib/utils/format";
import type { AttendanceStatus } from "@/types";

// ─── Attendance Page ──────────────────────────────────────────────────────────

type AttendanceMap = Record<string, AttendanceStatus>;

export default function AttendancePage() {
  const [selectedClass, setSelectedClass] = useState(mockClasses[0]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendance, setAttendance] = useState<AttendanceMap>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const students = mockStudents.filter(s => s.classId === selectedClass.id);

  const stats = {
    present: Object.values(attendance).filter(v => v === "present").length,
    absent: Object.values(attendance).filter(v => v === "absent").length,
    late: Object.values(attendance).filter(v => v === "late").length,
    excused: Object.values(attendance).filter(v => v === "excused").length,
    total: students.length,
    unrecorded: students.length - Object.keys(attendance).length,
  };

  const setAll = (status: AttendanceStatus) => {
    const map: AttendanceMap = {};
    students.forEach(s => { map[s.id] = status; });
    setAttendance(map);
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1200));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AppLayout title="الحضور والغياب">
      <div className="space-y-6">
        {/* Header Controls */}
        <FadeIn>
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Class Selector */}
            <div className="flex items-center gap-2 flex-wrap">
              {mockClasses.map(cls => (
                <motion.button
                  key={cls.id}
                  onClick={() => { setSelectedClass(cls); setAttendance({}); setSaved(false); }}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                    selectedClass.id === cls.id
                      ? "bg-primary text-white shadow-glow"
                      : "bg-surface-50 border border-border text-ink-muted hover:text-ink hover:bg-surface-100"
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {cls.name}
                </motion.button>
              ))}
            </div>

            {/* Date Navigator */}
            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => setSelectedDate(d => new Date(d.getTime() - 86400000))}
                className="p-2 rounded-xl hover:bg-surface-50 border border-border text-ink-muted hover:text-ink transition-colors"
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight className="w-4 h-4" />
              </motion.button>

              <div className="flex items-center gap-2 px-4 py-2 bg-surface-50 border border-border rounded-xl">
                <CalendarCheck className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-medium text-ink">
                  {formatDate(selectedDate, "EEEE، dd MMMM yyyy")}
                </span>
              </div>

              <motion.button
                onClick={() => setSelectedDate(d => new Date(d.getTime() + 86400000))}
                className="p-2 rounded-xl hover:bg-surface-50 border border-border text-ink-muted hover:text-ink transition-colors"
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </FadeIn>

        {/* Stats Strip */}
        <Stagger className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {[
            { label: "حاضر", value: stats.present, color: "text-green-600 bg-green-50 border-green-100", icon: Check },
            { label: "غائب", value: stats.absent, color: "text-red-600 bg-red-50 border-red-100", icon: X },
            { label: "متأخر", value: stats.late, color: "text-amber-600 bg-amber-50 border-amber-100", icon: Clock },
            { label: "بعذر", value: stats.excused, color: "text-blue-600 bg-blue-50 border-blue-100", icon: AlertCircle },
            { label: "لم يسجَّل", value: stats.unrecorded, color: "text-ink-muted bg-surface-50 border-surface-100", icon: Users },
          ].map(stat => (
            <StaggerItem key={stat.label}>
              <div className={cn("flex items-center gap-2 p-3 rounded-xl border", stat.color)}>
                <stat.icon className="w-4 h-4 flex-shrink-0" strokeWidth={2} />
                <div className="text-right flex-1">
                  <p className="text-xl font-bold leading-none">{stat.value}</p>
                  <p className="text-xs opacity-80 mt-0.5">{stat.label}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Quick Actions */}
        <FadeIn delay={0.1}>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm text-ink-muted">تعيين الكل:</span>
            {[
              { status: "present" as AttendanceStatus, label: "حاضر", color: "hover:bg-green-50 hover:text-green-700 hover:border-green-200" },
              { status: "absent" as AttendanceStatus, label: "غائب", color: "hover:bg-red-50 hover:text-red-700 hover:border-red-200" },
            ].map(({ status, label, color }) => (
              <motion.button
                key={status}
                onClick={() => setAll(status)}
                className={cn("btn-secondary text-sm", color)}
                whileTap={{ scale: 0.97 }}
              >
                {label}
              </motion.button>
            ))}

            <div className="flex-1" />

            <motion.button 
              className="btn-secondary gap-2 text-sm" 
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                const csvContent = "data:text/csv;charset=utf-8," + Object.entries(attendance).map(([id, status]) => `${id},${status}`).join("\n");
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", `attendance_${formatDate(selectedDate, "yyyy-MM-dd")}.csv`);
                document.body.appendChild(link);
                link.click();
                alert("تم تصدير تقرير الحضور بنجاح");
              }}
            >
              <Download className="w-4 h-4" />
              تصدير
            </motion.button>

            <motion.button
              onClick={handleSave}
              disabled={saving || Object.keys(attendance).length === 0}
              className={cn(
                "btn-primary gap-2 text-sm min-w-32 justify-center",
                (saving || Object.keys(attendance).length === 0) && "opacity-60 cursor-not-allowed"
              )}
              whileTap={{ scale: 0.97 }}
            >
              <AnimatePresence mode="wait">
                {saving ? (
                  <motion.div
                    key="saving"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    حفظ...
                  </motion.div>
                ) : saved ? (
                  <motion.div
                    key="saved"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Check className="w-3.5 h-3.5" />
                    تم الحفظ
                  </motion.div>
                ) : (
                  <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    حفظ الحضور
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </FadeIn>

        {/* Attendance Table */}
        <FadeIn delay={0.15}>
          <div className="card-base overflow-hidden">
            {/* Progress bar */}
            <div className="h-1 bg-surface-100">
              <motion.div
                className="h-full bg-primary"
                animate={{ width: `${(Object.keys(attendance).length / students.length) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>

            <div className="divide-y divide-border">
              {students.map((student, i) => {
                const status = attendance[student.id];
                return (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={cn(
                      "flex items-center gap-4 px-5 py-3.5 transition-colors",
                      !status && "bg-surface-50/50",
                      status === "present" && "bg-green-50/30",
                      status === "absent" && "bg-red-50/30",
                      status === "late" && "bg-amber-50/30",
                      status === "excused" && "bg-blue-50/30",
                    )}
                  >
                    {/* Status badge */}
                    <div className="flex-shrink-0 w-20 text-right">
                      {status ? (
                        <motion.span
                          key={status}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={cn(
                            "badge text-[11px]",
                            status === "present" && "bg-green-100 text-green-700",
                            status === "absent" && "bg-red-100 text-red-700",
                            status === "late" && "bg-amber-100 text-amber-700",
                            status === "excused" && "bg-blue-100 text-blue-700",
                          )}
                        >
                          {attendanceStatusLabel[status]}
                        </motion.span>
                      ) : (
                        <span className="badge bg-surface-100 text-ink-subtle text-[11px]">لم يسجَّل</span>
                      )}
                    </div>

                    {/* Student info */}
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary-700">{student.firstName.charAt(0)}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-ink">{student.fullName}</p>
                        <p className="text-xs text-ink-muted">{student.studentCode}</p>
                      </div>
                    </div>

                    {/* Quick attendance buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {(["present", "late", "excused", "absent"] as AttendanceStatus[]).map(s => (
                        <AttendanceButton
                          key={s}
                          status={s}
                          active={status === s}
                          onClick={() => setAttendance(prev => ({ ...prev, [student.id]: s }))}
                        />
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </FadeIn>
      </div>
    </AppLayout>
  );
}

// ─── Attendance Button ────────────────────────────────────────────────────────

const statusConfig: Record<AttendanceStatus, { label: string; active: string; inactive: string; icon: React.ElementType }> = {
  present: { label: "حاضر", active: "bg-green-500 text-white border-green-500", inactive: "hover:bg-green-50 hover:border-green-300 text-ink-muted", icon: Check },
  absent:  { label: "غائب", active: "bg-red-500 text-white border-red-500",   inactive: "hover:bg-red-50 hover:border-red-300 text-ink-muted",   icon: X },
  late:    { label: "متأخر", active: "bg-amber-500 text-white border-amber-500", inactive: "hover:bg-amber-50 hover:border-amber-300 text-ink-muted", icon: Clock },
  excused: { label: "بعذر",  active: "bg-blue-500 text-white border-blue-500", inactive: "hover:bg-blue-50 hover:border-blue-300 text-ink-muted",   icon: AlertCircle },
};

function AttendanceButton({
  status, active, onClick,
}: { status: AttendanceStatus; active: boolean; onClick: () => void }) {
  const config = statusConfig[status];
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "w-8 h-8 rounded-lg border flex items-center justify-center transition-all duration-150",
        active ? config.active : `border-border bg-surface-50 ${config.inactive}`
      )}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title={config.label}
    >
      <config.icon className="w-3.5 h-3.5" strokeWidth={2.5} />
    </motion.button>
  );
}
