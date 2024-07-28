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
import Toast from "react-native-toast-message";
import swrConfig from "@/utils/swrConfig";
import { SWRConfig } from "swr";
import axios from "@/utils/axios";

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// This component defines the stack layout for the app
const StackLayout = () => {
  // Get the user state from the authentication store
  const user = useAuthStore((state) => state.user);
  // Get the current route segments
  const segments = useSegments();
  // Get the router object to navigate programmatically
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(root)";
    // Redirect based on user authentication status
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
          headerShown: false, // Hide the header for all screens
        }}
      >
        {/* Define the main stack screens */}
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(root)" />
      </Stack>
    </>
  );
};

// This component defines the root layout for the app
export default function RootLayout() {
  // Load custom fonts using the useFonts hook from expo-font
  const [fontsLoaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"), // Load Inter-Medium font
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"), // Load Inter-Bold font
  });

  // State to track if the app is ready
  const [appIsReady, setAppIsReady] = useState(false);

  // Get the user state from the authentication store
  const user = useAuthStore((state) => state.user);

  // useEffect to prepare the app once fonts are loaded and user state is available
  useEffect(() => {
    const prepareApp = async () => {
      if (fontsLoaded) {
        // Check if fonts are loaded
        if (user?.token) {
          // Check if user has a token
          axios.defaults.headers.common["Authorization"] = `${user.token}`; // Set the authorization header with the user token
        }
        setAppIsReady(true); // Set appIsReady to true
      }
    };

    prepareApp(); // Call the prepareApp function
  }, [fontsLoaded, user]); // Dependencies: fontsLoaded and user

  // useEffect to hide the splash screen once the app is ready
  useEffect(() => {
    if (appIsReady) {
      // Check if app is ready
      SplashScreen.hideAsync(); // Hide the splash screen
    }
  }, [appIsReady]); // Dependency: appIsReady

  // If the app is not ready, return null to render nothing
  if (!appIsReady) {
    return null;
  }

  // Render the root layout of the app
  return (
    <SWRConfig value={swrConfig}>
      <Provider>
        <TamaguiProvider config={tamaguiConfig}>
          <StackLayout />
          <Toast />
        </TamaguiProvider>
      </Provider>
    </SWRConfig>
  );
}
