import AntDesign from "@expo/vector-icons/AntDesign";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Tabs, usePathname } from "expo-router";
import React, { useState } from "react";
import { View, Image } from "react-native";
import CustomDatePicker from "@/components/global/CustomDatePicker";
import { useDateStore } from "@/stores/date";

// This component defines the layout for the tab navigation within the drawer
export default function TabsLayout() {
  // Get the function to set the date in the date store
  const setTabDate = useDateStore((state) => state.setTabDate);

  // Handle date change from the custom date picker
  const handleDateChange = (date: Date) => {
    setTabDate(date.getMonth(), date.getFullYear());
  };

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "white", // Active tab text color
        headerTintColor: "white", // Header text color
        headerStyle: {
          backgroundColor: "#161E2B", // Header background color
        },
        headerTitleAlign: "center", // Center align the header title
        headerLeft: () => {
          return <DrawerToggleButton tintColor="white" />; // Drawer toggle button
        },
        headerTitle: () => (
          <Image
            source={require("../../../../../assets/logo.png")}
            style={{ width: 100, height: 100 }}
            resizeMode="contain"
          />
        ),
        headerRight: () => (
          <CustomDatePicker
            onDateChange={handleDateChange}
            showTimePicker={false}
          />
        ),
        tabBarInactiveTintColor: "gray", // Inactive tab text color
        tabBarHideOnKeyboard: true, // Hide tab bar when keyboard is shown
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "bold",
        },
        tabBarStyle: {
          display: usePathname() === "example" ? "none" : "flex", // Hide tab bar on specific route
          position: "absolute",
          elevation: 0,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderWidth: 1,
          borderColor: "#31363F",
          backgroundColor: "#31363F",
          height: 90,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          if (route.name === "index") {
            iconName = "home";
          } else if (route.name === "income/index") {
            iconName = "wallet";
          } else if (route.name === "expenses/index") {
            iconName = "calculator";
          } else if (route.name === "goals/index") {
            iconName = "flag";
          } else if (route.name === "budget/index") {
            iconName = "profile";
          }

          return (
            <View className="items-center justify-center">
              <AntDesign name={iconName} size={24} color={color} />
              {focused && <View className="w-5 h-0.5 bg-white mt-1" />}
            </View>
          );
        },
      })}
    >
      {/* Define the screens for the tab navigation */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="income/index"
        options={{
          title: "Income",
        }}
      />
      <Tabs.Screen
        name="expenses/index"
        options={{
          title: "Expenses",
        }}
      />
      <Tabs.Screen
        name="budget/index"
        options={{
          title: "Budget",
        }}
      />
      <Tabs.Screen
        name="goals/index"
        options={{
          title: "Goals",
        }}
      />
    </Tabs>
  );
}
