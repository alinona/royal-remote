import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Platform,
} from "react-native";
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring,
  FadeInDown, Layout,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

const COLORS = {
  primary:  "#4F63D2",
  success:  "#10B981",
  warning:  "#F59E0B",
  danger:   "#EF4444",
  info:     "#3B82F6",
  surface:  "#F8F9FE",
  card:     "#FFFFFF",
  ink:      "#1A1F36",
  inkMuted: "#6B7280",
  border:   "#E5E7EB",
};

type AttendanceStatus = "present" | "absent" | "late" | "excused" | null;

interface StudentAttendance {
  id:       string;
  name:     string;
  code:     string;
  status:   AttendanceStatus;
}

const mockStudents: StudentAttendance[] = [
  { id: "1", name: "عمر الشمري",   code: "STU001", status: null },
  { id: "2", name: "سارة الدوسري", code: "STU002", status: null },
  { id: "3", name: "يوسف الغامدي", code: "STU003", status: null },
  { id: "4", name: "نورة العنزي",  code: "STU004", status: null },
  { id: "5", name: "ريم المطيري",  code: "STU005", status: null },
  { id: "6", name: "فهد السلمي",   code: "STU006", status: null },
];

const statusConfig = {
  present: { label: "حاضر", color: COLORS.success, emoji: "✓" },
  absent:  { label: "غائب", color: COLORS.danger,  emoji: "✗" },
  late:    { label: "متأخر",color: COLORS.warning, emoji: "⏰" },
  excused: { label: "بعذر", color: COLORS.info,    emoji: "📋" },
};

// ─── Attendance Screen ────────────────────────────────────────────────────────

export default function AttendanceScreen() {
  const [students, setStudents] = useState(mockStudents);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const setStatus = (id: string, status: AttendanceStatus) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStudents(prev =>
      prev.map(s => s.id === id ? { ...s, status } : s)
    );
  };

  const setAll = (status: AttendanceStatus) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setStudents(prev => prev.map(s => ({ ...s, status })));
  };

  const stats = {
    present: students.filter(s => s.status === "present").length,
    absent:  students.filter(s => s.status === "absent").length,
    late:    students.filter(s => s.status === "late").length,
    excused: students.filter(s => s.status === "excused").length,
    total:   students.length,
    recorded:students.filter(s => s.status !== null).length,
  };

  const progress = stats.recorded / stats.total;

  const handleSave = async () => {
    if (saving || stats.recorded === 0) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSaving(true);
    await new Promise(r => setTimeout(r, 1500));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={["#10B981", "#059669"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>تسجيل الحضور</Text>
        <Text style={styles.headerSubtitle}>
          الصف الأول - أ · {new Date().toLocaleDateString("ar-SA", { weekday: "long", day: "numeric", month: "long" })}
        </Text>

        {/* Progress */}
        <View style={styles.progressSection}>
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressFill,
                { width: `${progress * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {stats.recorded}/{stats.total} مسجَّل
          </Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          {[
            { label: "حاضر",  value: stats.present,  color: "#FFFFFF" },
            { label: "غائب",  value: stats.absent,   color: "#FCA5A5" },
            { label: "متأخر", value: stats.late,     color: "#FCD34D" },
            { label: "بعذر",  value: stats.excused,  color: "#93C5FD" },
          ].map(stat => (
            <View key={stat.label} style={styles.statItem}>
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      {/* Quick set all */}
      <View style={styles.quickSet}>
        <Text style={styles.quickSetLabel}>تعيين الكل:</Text>
        <View style={styles.quickSetBtns}>
          <TouchableOpacity
            style={[styles.quickSetBtn, { backgroundColor: COLORS.success + "20", borderColor: COLORS.success + "40" }]}
            onPress={() => setAll("present")}
          >
            <Text style={[styles.quickSetBtnText, { color: COLORS.success }]}>حاضر</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickSetBtn, { backgroundColor: COLORS.danger + "20", borderColor: COLORS.danger + "40" }]}
            onPress={() => setAll("absent")}
          >
            <Text style={[styles.quickSetBtnText, { color: COLORS.danger }]}>غائب</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Student List */}
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {students.map((student, i) => (
          <Animated.View
            key={student.id}
            entering={FadeInDown.delay(50 * i).springify()}
            layout={Layout.springify()}
          >
            <StudentRow
              student={student}
              onSetStatus={(status) => setStatus(student.id, status)}
            />
          </Animated.View>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.saveBtn,
            (saving || stats.recorded === 0) && styles.saveBtnDisabled,
            saved && styles.saveBtnSaved,
          ]}
          onPress={handleSave}
          disabled={saving || stats.recorded === 0}
        >
          {saving ? (
            <Text style={styles.saveBtnText}>جارٍ الحفظ...</Text>
          ) : saved ? (
            <Text style={styles.saveBtnText}>تم الحفظ بنجاح ✓</Text>
          ) : (
            <Text style={styles.saveBtnText}>
              حفظ الحضور ({stats.recorded}/{stats.total})
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Student Row ──────────────────────────────────────────────────────────────

function StudentRow({
  student,
  onSetStatus,
}: {
  student: StudentAttendance;
  onSetStatus: (status: AttendanceStatus) => void;
}) {
  return (
    <View style={[
      styles.studentRow,
      student.status === "present" && styles.studentRowPresent,
      student.status === "absent"  && styles.studentRowAbsent,
      student.status === "late"    && styles.studentRowLate,
    ]}>
      <View style={styles.studentInfo}>
        <View style={styles.studentAvatar}>
          <Text style={styles.studentAvatarText}>{student.name.charAt(0)}</Text>
        </View>
        <View>
          <Text style={styles.studentName}>{student.name}</Text>
          <Text style={styles.studentCode}>{student.code}</Text>
        </View>
      </View>

      <View style={styles.attendanceBtns}>
        {(["present", "late", "excused", "absent"] as AttendanceStatus[]).map(status => {
          if (!status) return null;
          const config = statusConfig[status];
          const isActive = student.status === status;
          return (
            <TouchableOpacity
              key={status}
              onPress={() => onSetStatus(isActive ? null : status)}
              style={[
                styles.attendanceBtn,
                isActive && { backgroundColor: config.color, borderColor: config.color },
              ]}
            >
              <Text style={[
                styles.attendanceBtnText,
                isActive && { color: "white" },
              ]}>
                {config.emoji}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 56 : 36,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "right",
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
    textAlign: "right",
    marginTop: 2,
  },
  progressSection: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "white",
    borderRadius: 3,
  },
  progressText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    fontWeight: "600",
  },
  statsRow: {
    flexDirection: "row",
    marginTop: 16,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 12,
    padding: 12,
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
  },
  statLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    marginTop: 2,
  },
  quickSet: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  quickSetLabel: {
    fontSize: 14,
    color: COLORS.inkMuted,
  },
  quickSetBtns: {
    flexDirection: "row",
    gap: 8,
  },
  quickSetBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
  },
  quickSetBtnText: {
    fontSize: 13,
    fontWeight: "600",
  },
  list: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  studentRow: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: COLORS.ink,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  studentRowPresent: { backgroundColor: "#F0FDF4", borderWidth: 1, borderColor: "#BBF7D0" },
  studentRowAbsent:  { backgroundColor: "#FEF2F2", borderWidth: 1, borderColor: "#FECACA" },
  studentRowLate:    { backgroundColor: "#FFFBEB", borderWidth: 1, borderColor: "#FDE68A" },
  studentInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  studentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  studentAvatarText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
  },
  studentName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.ink,
  },
  studentCode: {
    fontSize: 11,
    color: COLORS.inkMuted,
    marginTop: 1,
  },
  attendanceBtns: {
    flexDirection: "row",
    gap: 6,
  },
  attendanceBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  attendanceBtnText: {
    fontSize: 14,
    color: COLORS.inkMuted,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 32 : 16,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  saveBtnDisabled: {
    backgroundColor: COLORS.border,
    shadowOpacity: 0,
  },
  saveBtnSaved: {
    backgroundColor: COLORS.success,
  },
  saveBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});
