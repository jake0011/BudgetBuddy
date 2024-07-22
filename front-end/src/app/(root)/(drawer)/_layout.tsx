import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import CustomDrawerContent from "@/components/layout/CustomDrawerContent";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import CustomDatePicker from "@/components/global/CustomDatePicker";

export default function DrawerLayout() {
  const router = useRouter();
  const handleDateChange = (date: Date) => {
    // Handle date change
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          drawerActiveTintColor: "#fff",
          drawerInactiveTintColor: "#ccc",
          drawerStyle: {
            backgroundColor: "#161E2B",
          },
          headerStyle: {
            backgroundColor: "#161E2B",
          },
          headerTintColor: "#fff",
          headerShown: false,
        }}
      >
        <Drawer.Screen
          name="reports/index"
          options={{
            headerShown: true,
            title: "Reports",
            headerTitleAlign: "center",
            headerLeft: () => (
              <MaterialIcons
                name="arrow-back"
                size={24}
                color="white"
                onPress={() => {
                  router.navigate("(drawer)");
                }}
                className="ml-2"
              />
            ),
            headerRight: () => (
              <CustomDatePicker
                onDateChange={handleDateChange}
                showTimePicker={true}
              />
            ),
            sceneContainerStyle: {
              backgroundColor: "#161E2B",
            },
          }}
        />
        <Drawer.Screen
          name="settings/index"
          options={{
            headerShown: true,
            title: "Settings",
            headerTitleAlign: "center",
            headerLeft: () => (
              <MaterialIcons
                name="arrow-back"
                size={24}
                color="white"
                onPress={() => {
                  router.navigate("(drawer)");
                }}
                className="ml-2"
              />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
