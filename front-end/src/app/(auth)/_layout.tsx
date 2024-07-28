import React, { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { useAuthStore } from "@/stores/auth";

// This component defines the layout for the authentication flow
export default function AuthLayout() {
  // Get the onBoarded state from the authentication store
  const onBoarded = useAuthStore((state) => state.onBoarded);
  // Get the current route segments
  const segments = useSegments();
  // Get the router object to navigate programmatically
  const router = useRouter();
  // Get the name of the current route
  const currentRouteName = segments[segments.length - 1];

  useEffect(() => {
    // If the user is onboarded and currently on the onboarding screen, redirect to login
    if (onBoarded && currentRouteName === "onboarding") {
      router.replace("/login");
    }
  }, [onBoarded, currentRouteName]);

  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hide the header for all screens
        contentStyle: { backgroundColor: "#161E2B" }, // Set the background color for all screens
      }}
    >
      {/* Define the screens for the authentication flow */}
      <Stack.Screen name="onboarding/index" />
      <Stack.Screen name="login/index" />
      <Stack.Screen name="signup/index" />
      <Stack.Screen name="otp/index" />
    </Stack>
  );
}
