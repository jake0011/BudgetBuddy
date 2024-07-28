import React from "react";
import { Stack } from "expo-router";

// This component defines the main layout for the root stack
export default function MainLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hide the header for all screens
      }}
    >
      {/* Define the main drawer screen */}
      <Stack.Screen name="(drawer)" />
    </Stack>
  );
}
