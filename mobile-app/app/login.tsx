import React from "react";
import { useRouter } from "expo-router";
import LoginScreen from "../src/screens/LoginScreen";

export default function Login() {
  const router = useRouter();

  const navigation = {
    navigate: (screen: string) => {
      if (screen === "Home") router.replace("/");
    },
  };

  return <LoginScreen navigation={navigation} />;
}
