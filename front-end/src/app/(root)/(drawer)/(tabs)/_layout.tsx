import AntDesign from "@expo/vector-icons/AntDesign";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Tabs, usePathname } from "expo-router";
import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "white",
        // headerShown: false,
        headerTintColor: "white",
        headerStyle: {
          backgroundColor: "#161E2B",
        },
        headerTitleAlign: "center",
        headerLeft: () => {
          return <DrawerToggleButton tintColor="white" />;
        },
        headerTitle: () => (
          <Image
            source={require("../../../../../assets/logo.png")}
            style={{ width: 100, height: 100 }}
            resizeMode="contain"
          />
        ),
        headerRight: () => {
          return (
            <MaterialIcons
              name="calendar-month"
              size={24}
              color="white"
              className="mr-4"
            />
          );
        },
        tabBarInactiveTintColor: "gray",
        tabBarHideOnKeyboard: true,
        tabBarAccessibilityLabel: "Home",
        tabBarLabelStyle: {
          fontSize: 10,
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
            <View style={styles.iconContainer}>
              <AntDesign name={iconName} size={24} color={color} />
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
    marginTop: 5,
  },
});
