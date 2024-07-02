import React from "react";
import { Stack, Tabs } from "expo-router";

export default function MainLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        // contentStyle: { backgroundColor: "#161E2B" },
      }}
    >
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
