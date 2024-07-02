import AntDesign from "@expo/vector-icons/AntDesign";
import { Tabs, usePathname } from "expo-router";
import React from "react";
import { View, StyleSheet } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
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
          display: usePathname() === "example" ? "none" : "flex",
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
          } else if (route.name === "accounts/index") {
            iconName = "folder1";
          } else if (route.name === "cashflow/index") {
            iconName = "linechart";
          } else if (route.name === "settings/index") {
            iconName = "setting";
          }

          return (
            <View style={styles.iconContainer}>
              <AntDesign name={iconName} size={28} color={color} />
              {focused && <View style={styles.indicator} />}
            </View>
          );
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="accounts/index"
        options={{
          title: "Accounts",
        }}
      />
      <Tabs.Screen
        name="cashflow/index"
        options={{
          title: "Cash Flow",
        }}
      />
      <Tabs.Screen
        name="settings/index"
        options={{
          title: "Settings",
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  focusedTab: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: -5,
  },
  indicator: {
    width: 20,
    height: 2,
    backgroundColor: "white",
    marginTop: 4,
  },
});
