import React from "react";
import { useRouter } from "expo-router";
import AttendanceScreen from "../../src/screens/AttendanceScreen";

export default function Attendance() {
  const router = useRouter();

  const navigation = {
    goBack: () => router.back(),
  };

  return <AttendanceScreen navigation={navigation} />;
}
