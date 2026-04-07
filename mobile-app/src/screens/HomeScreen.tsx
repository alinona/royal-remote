import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Dimensions, Platform,
} from "react-native";
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring,
  withRepeat, withTiming, Easing, interpolate,
  FadeInDown, FadeInRight, SlideInLeft,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ─── Colors ───────────────────────────────────────────────────────────────────

const COLORS = {
  primary:    "#4F63D2",
  primaryDark:"#3B4DBF",
  accent:     "#8B5CF6",
  success:    "#10B981",
  warning:    "#F59E0B",
  danger:     "#EF4444",
  surface:    "#F8F9FE",
  card:       "#FFFFFF",
  ink:        "#1A1F36",
  inkMuted:   "#6B7280",
  inkSubtle:  "#9CA3AF",
  border:     "#E5E7EB",
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const teacherData = {
  name:         "أحمد الزهراني",
  specialization: "الرياضيات",
  classes: [
    { id: "c1", name: "الصف الأول - أ", studentsCount: 32, nextPeriod: "08:00", room: "101" },
    { id: "c2", name: "الصف الثاني - ب", studentsCount: 28, nextPeriod: "10:00", room: "205" },
    { id: "c3", name: "الصف الثالث - أ", studentsCount: 30, nextPeriod: "12:00", room: "301" },
  ],
  todayStats: {
    classesTotal: 4,
    classesCompleted: 2,
    studentsPresent: 87,
    studentsTotal: 90,
    pendingGrades: 15,
  },
  recentAlerts: [
    { id: 1, type: "risk",    text: "يوسف الغامدي — غائب 5 أيام متتالية",  urgent: true  },
    { id: 2, type: "grade",   text: "درجات اختبار الوحدة الثالثة تنتظر إدخالها", urgent: false },
    { id: 3, type: "notice",  text: "اجتماع أولياء الأمور — الخميس القادم",  urgent: false },
  ],
};

// ─── Quick Action Button ──────────────────────────────────────────────────────

interface QuickActionProps {
  label:    string;
  emoji:    string;
  color:    string;
  onPress:  () => void;
  delay?:   number;
}

function QuickAction({ label, emoji, color, onPress, delay = 0 }: QuickActionProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSpring(0.92, {}, () => {
      scale.value = withSpring(1);
    });
    onPress();
  };

  return (
    <Animated.View entering={FadeInDown.delay(delay).springify()} style={animatedStyle}>
      <TouchableOpacity onPress={handlePress} style={styles.quickActionBtn}>
        <View style={[styles.quickActionIcon, { backgroundColor: color + "18" }]}>
          <Text style={styles.quickActionEmoji}>{emoji}</Text>
        </View>
        <Text style={styles.quickActionLabel}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Class Card ───────────────────────────────────────────────────────────────

interface ClassCardProps {
  cls:    typeof teacherData.classes[0];
  index:  number;
}

function ClassCard({ cls, index }: ClassCardProps) {
  const scale = useSharedValue(1);
  const [attending, setAttending] = useState(false);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withSpring(0.97, {}, () => {
      scale.value = withSpring(1);
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const progress = 0.75; // Mock attendance progress

  return (
    <Animated.View entering={SlideInLeft.delay(100 * index).springify()} style={animatedStyle}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
        <View style={styles.classCard}>
          {/* Header */}
          <View style={styles.classCardHeader}>
            <View style={styles.classCardActions}>
              <TouchableOpacity
                style={[styles.classCardBtn, attending && styles.classCardBtnActive]}
                onPress={() => { setAttending(!attending); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); }}
              >
                <Text style={[styles.classCardBtnText, attending && { color: "white" }]}>
                  {attending ? "تم الحضور" : "تسجيل الحضور"}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.classCardInfo}>
              <Text style={styles.classCardName}>{cls.name}</Text>
              <Text style={styles.classCardMeta}>{cls.studentsCount} طالب · قاعة {cls.room}</Text>
            </View>
          </View>

          {/* Progress bar */}
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: `${progress * 100}%`,
                  backgroundColor: progress >= 0.9 ? COLORS.success : progress >= 0.75 ? COLORS.warning : COLORS.danger,
                },
              ]}
            />
          </View>

          {/* Footer */}
          <View style={styles.classCardFooter}>
            <Text style={styles.classCardTime}>{cls.nextPeriod}</Text>
            <Text style={styles.classCardAttendance}>{Math.round(progress * cls.studentsCount)}/{cls.studentsCount} حاضر</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Home Screen ──────────────────────────────────────────────────────────────

export default function HomeScreen({ navigation }: any) {
  const pulseValue = useSharedValue(1);

  React.useEffect(() => {
    pulseValue.value = withRepeat(
      withTiming(1.05, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      -1, true
    );
  }, []);

  const greeting = (() => {
    const h = new Date().getHours();
    return h < 12 ? "صباح الخير" : h < 17 ? "مساء الخير" : "مساء النور";
  })();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Gradient */}
      <LinearGradient
        colors={[COLORS.primaryDark, COLORS.primary, "#5A78E8"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        {/* Decorative shapes */}
        <View style={styles.headerShape1} />
        <View style={styles.headerShape2} />

        <Animated.View entering={FadeInDown.springify()}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.teacherName}>{teacherData.name}</Text>
          <Text style={styles.specialization}>{teacherData.specialization}</Text>
        </Animated.View>

        {/* Today's progress */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.todayCard}>
          <View style={styles.todayStats}>
            {[
              { label: "الحصص", value: `${teacherData.todayStats.classesCompleted}/${teacherData.todayStats.classesTotal}` },
              { label: "حضور الطلاب", value: `${teacherData.todayStats.studentsPresent}/${teacherData.todayStats.studentsTotal}` },
              { label: "درجات معلقة", value: teacherData.todayStats.pendingGrades.toString() },
            ].map((stat, i) => (
              <React.Fragment key={stat.label}>
                {i > 0 && <View style={styles.divider} />}
                <View style={styles.todayStat}>
                  <Text style={styles.todayStatValue}>{stat.value}</Text>
                  <Text style={styles.todayStatLabel}>{stat.label}</Text>
                </View>
              </React.Fragment>
            ))}
          </View>
        </Animated.View>
      </LinearGradient>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>إجراءات سريعة</Text>
        <View style={styles.quickActions}>
          <QuickAction label="تسجيل الحضور" emoji="✅" color={COLORS.success} onPress={() => navigation?.navigate("Attendance")} delay={50} />
          <QuickAction label="إدخال الدرجات" emoji="📝" color={COLORS.primary} onPress={() => navigation?.navigate("Grades")} delay={100} />
          <QuickAction label="تقييم السلوك" emoji="⭐" color={COLORS.warning} onPress={() => navigation?.navigate("Behavior")} delay={150} />
          <QuickAction label="المساعد الذكي" emoji="🤖" color={COLORS.accent} onPress={() => navigation?.navigate("AI")} delay={200} />
        </View>
      </View>

      {/* My Classes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>صفوفي اليوم</Text>
        {teacherData.classes.map((cls, i) => (
          <ClassCard key={cls.id} cls={cls} index={i} />
        ))}
      </View>

      {/* Alerts */}
      <View style={[styles.section, { paddingBottom: 32 }]}>
        <Text style={styles.sectionTitle}>التنبيهات</Text>
        {teacherData.recentAlerts.map((alert, i) => (
          <Animated.View
            key={alert.id}
            entering={FadeInRight.delay(50 * i).springify()}
          >
            <TouchableOpacity
              style={[
                styles.alertCard,
                alert.urgent && styles.alertCardUrgent,
              ]}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            >
              <Text style={styles.alertText}>{alert.text}</Text>
              {alert.urgent && (
                <View style={styles.urgentBadge}>
                  <Text style={styles.urgentBadgeText}>عاجل</Text>
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  content: {
    paddingBottom: 24,
  },

  // Header
  header: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 32,
    paddingHorizontal: 20,
    overflow: "hidden",
  },
  headerShape1: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  headerShape2: {
    position: "absolute",
    bottom: -20,
    left: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.04)",
    transform: [{ rotate: "45deg" }],
  },
  greeting: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    textAlign: "right",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  teacherName: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "right",
    marginTop: 4,
  },
  specialization: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    textAlign: "right",
    marginTop: 2,
  },

  // Today card
  todayCard: {
    marginTop: 20,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  todayStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  todayStat: {
    alignItems: "center",
    flex: 1,
  },
  todayStatValue: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  todayStatLabel: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 11,
    marginTop: 4,
    textAlign: "center",
  },
  divider: {
    width: 1,
    height: 36,
    backgroundColor: "rgba(255,255,255,0.2)",
  },

  // Section
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.ink,
    textAlign: "right",
    marginBottom: 12,
  },

  // Quick actions
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  quickActionBtn: {
    flex: 1,
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 12,
    shadowColor: COLORS.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  quickActionEmoji: {
    fontSize: 20,
  },
  quickActionLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.ink,
    textAlign: "center",
  },

  // Class cards
  classCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    shadowColor: COLORS.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  classCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  classCardInfo: {
    flex: 1,
    alignItems: "flex-end",
  },
  classCardName: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.ink,
    textAlign: "right",
  },
  classCardMeta: {
    fontSize: 12,
    color: COLORS.inkMuted,
    textAlign: "right",
    marginTop: 2,
  },
  classCardActions: {
    marginLeft: 12,
  },
  classCardBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  classCardBtnActive: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  classCardBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.primary,
  },
  progressTrack: {
    height: 4,
    backgroundColor: COLORS.surface,
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 10,
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  classCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  classCardTime: {
    fontSize: 12,
    color: COLORS.inkMuted,
  },
  classCardAttendance: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.ink,
  },

  // Alerts
  alertCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  alertCardUrgent: {
    borderColor: "#FECACA",
    backgroundColor: "#FEF2F2",
  },
  alertText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.ink,
    textAlign: "right",
    lineHeight: 20,
  },
  urgentBadge: {
    marginLeft: 8,
    backgroundColor: COLORS.danger,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  urgentBadgeText: {
    color: "white",
    fontSize: 11,
    fontWeight: "700",
  },
});
