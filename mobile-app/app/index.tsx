import React from "react";
import { useRouter } from "expo-router";
import HomeScreen from "../src/screens/HomeScreen";

export default function Index() {
  const router = useRouter();

  // Mock navigation object to pass to dummy screens
  const navigation = {
    navigate: (screen: string, params?: any) => {
      if (screen === "Login") router.push("/login");
      else if (screen === "Attendance") router.push("/attendance");
      else if (screen === "Home") router.push("/");
      else console.log("Navigate to", screen);
    },
    goBack: () => router.back(),
  };

  return <HomeScreen navigation={navigation} />;
}
