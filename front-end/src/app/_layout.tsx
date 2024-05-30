import "../global.css";
import React, { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { useAuthStore } from "@/stores/auth";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

const StackLayout = () => {
  const user = useAuthStore((state) => state.user);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    setTimeout(SplashScreen.hideAsync, 2000);
  }, []);

  useEffect(() => {
    const inAuthGroup = segments[0] === "(root)";
    if (!user && inAuthGroup) {
      router.replace("/onboarding");
    } else if (user && !inAuthGroup) {
      router.replace("/(root)");
    }
  }, [user, segments, router]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(root)" />
    </Stack>
  );
};

export default function RootLayout() {
  return <StackLayout />;
}
