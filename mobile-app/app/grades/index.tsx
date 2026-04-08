import React from "react";
import { useRouter } from "expo-router";
import GradesScreen from "../../src/screens/GradesScreen";

export default function Grades() {
  const router = useRouter();

  const navigation = {
    goBack: () => router.back(),
  };

  return <GradesScreen navigation={navigation} />;
}
