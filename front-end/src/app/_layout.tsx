import "../global.css";
import "@tamagui/core/reset.css";
import React, { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { useAuthStore } from "@/stores/auth";
import * as SplashScreen from "expo-splash-screen";
import { TamaguiProvider } from "tamagui";
import tamaguiConfig from "tamagui.config";
import { useFonts } from "expo-font";
import { StatusBar, View } from "react-native";
import { Provider } from "react-native-paper";

SplashScreen.preventAutoHideAsync();

const StackLayout = () => {
  const user = useAuthStore((state) => state.user);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    setTimeout(SplashScreen.hideAsync, 1500);
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
    <>
      <StatusBar barStyle="default" />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(root)" />
      </Stack>
    </>
  );
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    const prepareApp = async () => {
      if (fontsLoaded) {
        setAppIsReady(true);
      }
    };

    prepareApp();
  }, [fontsLoaded]);

  if (!appIsReady) {
    return null;
  }
  return (
    <Provider>
      <TamaguiProvider config={tamaguiConfig}>
        <StackLayout />
      </TamaguiProvider>
    </Provider>
  );
}
