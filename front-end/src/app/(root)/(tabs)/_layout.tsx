import AntDesign from "@expo/vector-icons/AntDesign";
import { Tabs, usePathname } from "expo-router";
import React from "react";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "white",
        headerShown: false,
        tabBarInactiveTintColor: "gray",
        tabBarHideOnKeyboard: true,
        tabBarAccessibilityLabel: "Home",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
        },
        tabBarStyle: {
          display: usePathname() === "example" ? "none" : "flex", // {To hide the TabItem from the list where necessary }
          position: "absolute",
          elevation: 0,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: "#31363F",
          backgroundColor: "#31363F",
          height: 110,
          // shadowColor: "#000",
          // shadowOffset: { width: 0, height: 2 },
          // shadowOpacity: 0.8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",

          tabBarIcon: ({ color }) => (
            <AntDesign size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(accounts)/index"
        options={{
          // href: null,   {To hide the TabItem from the list where necessary }
          title: "Accounts",
          tabBarIcon: ({ color }) => (
            <AntDesign size={28} name="creditcard" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(cashflow)/index"
        options={{
          title: "Cash Flow",
          tabBarIcon: ({ color }) => (
            <AntDesign size={28} name="piechart" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(settings)/index"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <AntDesign size={28} name="setting" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
