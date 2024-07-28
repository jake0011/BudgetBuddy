import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import CustomDrawerContent from "@/components/layout/CustomDrawerContent";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import CustomDatePicker from "@/components/global/CustomDatePicker";
import { useDateStore } from "@/stores/date";

// This component defines the layout for the drawer navigation
export default function DrawerLayout() {
  // Get the router object to navigate programmatically
  const router = useRouter();
  // Get the function to set the date in the date store
  const setDrawerDate = useDateStore((state) => state.setDrawerDate);

  // Handle date change from the custom date picker
  const handleDateChange = (date: Date) => {
    setDrawerDate(date.getMonth(), date.getFullYear());
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          drawerActiveTintColor: "#fff", // Active drawer item text color
          drawerInactiveTintColor: "#ccc", // Inactive drawer item text color
          drawerStyle: {
            backgroundColor: "#161E2B", // Drawer background color
          },
          headerStyle: {
            backgroundColor: "#161E2B", // Header background color
          },
          headerTintColor: "#fff", // Header text color
          headerShown: false, // Hide the header for all screens
        }}
      >
        {/* Define the screens for the drawer navigation */}
        <Drawer.Screen
          name="reports/index"
          options={{
            headerShown: true, // Show the header for this screen
            title: "Reports",
            headerTitleAlign: "center", // Center align the header title
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
              backgroundColor: "#161E2B", // Screen background color
            },
          }}
        />
        <Drawer.Screen
          name="settings/index"
          options={{
            headerShown: true, // Show the header for this screen
            title: "Settings",
            headerTitleAlign: "center", // Center align the header title
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
