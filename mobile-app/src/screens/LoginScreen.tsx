import React, { useState, useRef } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Platform, KeyboardAvoidingView,
  ScrollView, Dimensions,
} from "react-native";
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring,
  FadeInDown, withSequence, withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import * as LocalAuthentication from "expo-local-authentication";
import * as Haptics from "expo-haptics";

const { width } = Dimensions.get("window");

const COLORS = {
  primary:    "#4F63D2",
  primaryDark:"#3B4DBF",
  accent:     "#8B5CF6",
  surface:    "#F8F9FE",
  card:       "#FFFFFF",
  ink:        "#1A1F36",
  inkMuted:   "#6B7280",
  border:     "#E5E7EB",
  danger:     "#EF4444",
};

// ─── Login Screen ─────────────────────────────────────────────────────────────

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [pinMode, setPinMode]   = useState(false);
  const [pin, setPin]           = useState("");

  const shakeValue = useSharedValue(0);

  const shake = () => {
    shakeValue.value = withSequence(
      withTiming(-8, { duration: 60 }),
      withTiming(8, { duration: 60 }),
      withTiming(-8, { duration: 60 }),
      withTiming(0, { duration: 60 }),
    );
  };

  const formStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeValue.value }],
  }));

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("يرجى إدخال البريد الإلكتروني وكلمة المرور");
      shake();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    setError("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    navigation?.navigate("Main");
  };

  const handleBiometric = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) return;
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "تسجيل الدخول ببصمة الإصبع",
      cancelLabel: "إلغاء",
      fallbackLabel: "استخدم كلمة المرور",
    });
    if (result.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation?.navigate("Main");
    }
  };

  const handlePinDigit = (digit: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (pin.length < 6) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 6) {
        setTimeout(() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          navigation?.navigate("Main");
        }, 300);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        {/* Background gradient */}
        <LinearGradient
          colors={[COLORS.primaryDark, COLORS.primary]}
          style={styles.bgGradient}
        >
          {/* Decorative shapes */}
          <View style={styles.shape1} />
          <View style={styles.shape2} />
          <View style={styles.shape3} />
        </LinearGradient>

        {/* Logo area */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.logoArea}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>🏫</Text>
          </View>
          <Text style={styles.appName}>EduFlow</Text>
          <Text style={styles.appTagline}>تطبيق المدرسين</Text>
        </Animated.View>

        {/* Form Card */}
        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.formCard}>
          {/* Tab: Password / PIN */}
          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tab, !pinMode && styles.tabActive]}
              onPress={() => { setPinMode(false); setPin(""); }}
            >
              <Text style={[styles.tabText, !pinMode && styles.tabTextActive]}>كلمة المرور</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, pinMode && styles.tabActive]}
              onPress={() => { setPinMode(true); setError(""); }}
            >
              <Text style={[styles.tabText, pinMode && styles.tabTextActive]}>رمز PIN</Text>
            </TouchableOpacity>
          </View>

          {pinMode ? (
            <PINEntry pin={pin} onDigit={handlePinDigit} onClear={() => setPin(pin.slice(0, -1))} />
          ) : (
            <Animated.View style={formStyle}>
              {error ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>البريد الإلكتروني</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="teacher@school.edu.sa"
                  placeholderTextColor={COLORS.inkMuted}
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  textAlign="right"
                  returnKeyType="next"
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>كلمة المرور</Text>
                <View style={styles.passwordField}>
                  <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                    <Text>{showPass ? "🙈" : "👁️"}</Text>
                  </TouchableOpacity>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••"
                    placeholderTextColor={COLORS.inkMuted}
                    secureTextEntry={!showPass}
                    style={[styles.input, { flex: 1 }]}
                    textAlign="right"
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
                onPress={handleLogin}
                disabled={loading}
              >
                <Text style={styles.loginBtnText}>
                  {loading ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
                </Text>
              </TouchableOpacity>

              {/* Biometric */}
              <TouchableOpacity style={styles.biometricBtn} onPress={handleBiometric}>
                <Text style={styles.biometricText}>🔐 تسجيل الدخول بالبصمة</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </Animated.View>

        {/* Footer */}
        <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.footer}>
          <Text style={styles.footerText}>© 2026 EduFlow · وزارة التعليم</Text>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── PIN Entry ────────────────────────────────────────────────────────────────

function PINEntry({
  pin, onDigit, onClear,
}: {
  pin: string;
  onDigit: (d: string) => void;
  onClear: () => void;
}) {
  const digits = ["1","2","3","4","5","6","7","8","9","","0","⌫"];

  return (
    <View style={pinStyles.container}>
      {/* PIN dots */}
      <View style={pinStyles.dots}>
        {Array.from({ length: 6 }).map((_, i) => (
          <View
            key={i}
            style={[
              pinStyles.dot,
              i < pin.length && pinStyles.dotFilled,
            ]}
          />
        ))}
      </View>

      {/* Keypad */}
      <View style={pinStyles.keypad}>
        {digits.map((d, i) => (
          <TouchableOpacity
            key={i}
            style={[pinStyles.key, d === "" && pinStyles.keyEmpty]}
            onPress={() => {
              if (d === "⌫") onClear();
              else if (d) onDigit(d);
            }}
            disabled={d === ""}
          >
            <Text style={pinStyles.keyText}>{d}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary },
  scrollContent: { flexGrow: 1, justifyContent: "flex-end" },
  bgGradient: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  shape1: {
    position: "absolute", top: -60, right: -60,
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  shape2: {
    position: "absolute", top: 100, left: -40,
    width: 140, height: 140, borderRadius: 70,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  shape3: {
    position: "absolute", bottom: 200, right: 20,
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.05)",
    transform: [{ rotate: "45deg" }],
  },
  logoArea: {
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 80 : 60,
    paddingBottom: 40,
  },
  logoContainer: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center", justifyContent: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  logoIcon: { fontSize: 36 },
  appName: { color: "white", fontSize: 28, fontWeight: "700" },
  appTagline: { color: "rgba(255,255,255,0.65)", fontSize: 14, marginTop: 4 },

  formCard: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
  },
  tabRow: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: "center" },
  tabActive: { backgroundColor: COLORS.card, shadowColor: COLORS.ink, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  tabText: { fontSize: 14, color: COLORS.inkMuted, fontWeight: "500" },
  tabTextActive: { color: COLORS.ink, fontWeight: "700" },

  errorBox: { backgroundColor: "#FEF2F2", borderRadius: 10, padding: 10, marginBottom: 12, borderWidth: 1, borderColor: "#FECACA" },
  errorText: { color: COLORS.danger, fontSize: 13, textAlign: "center" },

  field: { marginBottom: 16 },
  fieldLabel: { fontSize: 13, fontWeight: "600", color: COLORS.ink, textAlign: "right", marginBottom: 6 },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.ink,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  passwordField: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.surface, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, overflow: "hidden" },
  eyeBtn: { paddingHorizontal: 12, paddingVertical: 12 },

  loginBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  loginBtnDisabled: { opacity: 0.6 },
  loginBtnText: { color: "white", fontSize: 16, fontWeight: "700" },

  biometricBtn: { marginTop: 16, alignItems: "center", paddingVertical: 8 },
  biometricText: { color: COLORS.primary, fontSize: 14, fontWeight: "600" },

  footer: { padding: 16, alignItems: "center" },
  footerText: { color: "rgba(255,255,255,0.5)", fontSize: 12 },
});

const pinStyles = StyleSheet.create({
  container: { paddingVertical: 8 },
  dots: { flexDirection: "row", justifyContent: "center", gap: 12, marginBottom: 28 },
  dot: { width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: COLORS.border, backgroundColor: COLORS.surface },
  dotFilled: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  keypad: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  key: {
    width: (width - 48 - 24) / 3, height: 60,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: COLORS.border,
  },
  keyEmpty: { backgroundColor: "transparent", borderColor: "transparent" },
  keyText: { fontSize: 22, fontWeight: "600", color: COLORS.ink },
});
