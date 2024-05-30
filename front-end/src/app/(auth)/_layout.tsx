import React, { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { useAuthStore } from "@/stores/auth";

export default function AuthLayout() {
  const onBoarded = useAuthStore((state) => state.onBoarded);
  const segments = useSegments();
  const router = useRouter();
  const currentRouteName = segments[segments.length - 1];

  useEffect(() => {
    if (onBoarded && currentRouteName === "onboarding") {
      router.replace("/login");
    }
  }, [onBoarded, currentRouteName]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="onboarding/index" />
      <Stack.Screen name="login/index" />
      <Stack.Screen name="signup/index" />
    </Stack>
  );
}
