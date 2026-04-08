import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Dimensions, Platform } from "react-native";
import Animated, { FadeInDown, SlideInRight } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const COLORS = {
  primary: "#4F63D2",
  primaryDark: "#3B4DBF",
  surface: "#F8F9FE",
  card: "#FFFFFF",
  ink: "#1A1F36",
  inkMuted: "#6B7280",
  success: "#10B981",
  border: "#E5E7EB",
};

const DUMMY_STUDENTS = [
  { id: "1", name: "أحمد محمد", code: "S001", grade: 85 },
  { id: "2", name: "يوسف الغامدي", code: "S002", grade: "" },
  { id: "3", name: "خالد سعيد", code: "S003", grade: 92 },
  { id: "4", name: "عمر فهد", code: "S004", grade: "" },
];

export default function GradesScreen({ navigation }: any) {
  const [students, setStudents] = useState<any[]>(DUMMY_STUDENTS);

  const updateGrade = (id: string, val: string) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, grade: val } : s));
  };

  const saveGrades = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    alert("تم حفظ الدرجات بنجاح!");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[COLORS.primaryDark, COLORS.primary]} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>رجوع</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>إدخال الترجات (الصف الأول)</Text>
      </LinearGradient>
      
      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          {students.map((student, idx) => (
            <Animated.View key={student.id} entering={SlideInRight.delay(idx * 50).springify()} style={styles.card}>
              <View style={styles.info}>
                <Text style={styles.name}>{student.name}</Text>
                <Text style={styles.code}>{student.code}</Text>
              </View>
              <TextInput 
                style={styles.input}
                keyboardType="numeric"
                placeholder="0"
                value={String(student.grade)}
                onChangeText={(text) => updateGrade(student.id, text)}
                maxLength={3}
              />
            </Animated.View>
          ))}
        </Animated.View>
        <TouchableOpacity style={styles.saveBtn} onPress={saveGrades}>
          <Text style={styles.saveBtnText}>حفظ الدرجات</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  header: { paddingTop: Platform.OS === "ios" ? 60 : 40, paddingBottom: 20, paddingHorizontal: 20 },
  backBtn: { marginBottom: 10, alignSelf: "flex-start", backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  backBtnText: { color: "#FFF", fontSize: 13, fontWeight: "bold" },
  headerTitle: { color: "#FFF", fontSize: 24, fontWeight: "bold", textAlign: "right" },
  content: { padding: 20 },
  card: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: COLORS.card, padding: 15, borderRadius: 12, marginBottom: 10, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  info: { alignItems: "flex-end", flex: 1, marginRight: 15 },
  name: { fontSize: 16, fontWeight: "bold", color: COLORS.ink },
  code: { fontSize: 12, color: COLORS.inkMuted },
  input: { backgroundColor: COLORS.surface, width: 60, height: 45, borderRadius: 8, textAlign: "center", fontSize: 18, fontWeight: "bold", color: COLORS.primary, borderWidth: 1, borderColor: COLORS.border },
  saveBtn: { backgroundColor: COLORS.success, padding: 15, borderRadius: 12, alignItems: "center", marginTop: 20 },
  saveBtnText: { color: "#FFF", fontSize: 16, fontWeight: "bold" }
});
