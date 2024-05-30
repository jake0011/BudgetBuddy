import "../global.css";
import "@tamagui/core/reset.css";
import React, { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { useAuthStore } from "@/stores/auth";
import * as SplashScreen from "expo-splash-screen";
import { TamaguiProvider } from "tamagui";
import tamaguiConfig from "tamagui.config";
import { useFonts } from "expo-font";

SplashScreen.preventAutoHideAsync();

const StackLayout = () => {
  const user = useAuthStore((state) => state.user);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    setTimeout(SplashScreen.hideAsync, 2000);
  }, []);

  // const [loaded] = useFonts({
  //   Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
  //   InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  // });

  // useEffect(() => {
  //   if (loaded) {
  //     SplashScreen.hideAsync();
  //   }
  // }, [loaded]);

  // if (!loaded) {
  //   return null;
  // }

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
  return (
    <TamaguiProvider config={tamaguiConfig}>
      <StackLayout />
    </TamaguiProvider>
  );
}
