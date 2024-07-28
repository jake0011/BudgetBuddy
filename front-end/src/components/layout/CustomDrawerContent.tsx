import React from "react"; // Importing React library
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer"; // Importing components from react-navigation/drawer
import { View, Text } from "react-native"; // Importing components from react-native
import { MaterialIcons } from "@expo/vector-icons"; // Importing icons from expo vector icons
import { Avatar, Separator } from "tamagui"; // Importing components from tamagui
import { usePathname } from "expo-router"; // Importing hook to get the current pathname
import { useAuthStore } from "@/stores/auth"; // Importing custom hook for authentication store

// CustomDrawerContent component definition
const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const pathname = usePathname(); // Get the current pathname
  const user = useAuthStore((state) => state.user); // Get the user data from the auth store

  return (
    <View style={{ flex: 1 }}>
      {/* DrawerContentScrollView to make the drawer content scrollable */}
      <DrawerContentScrollView {...props} className="h-[500px] bg-[#161E2B]">
        {/* User profile section */}
        <View className="items-center my-5">
          {/* User avatar icon */}
          <MaterialIcons name="account-circle" size={100} color="white" />
          {/* Display user's first and last name */}
          <Text className="text-white mt-2 text-2xl font-bold">
            {user?.firstname} {user?.lastname}
          </Text>
          {/* Display user's email */}
          <Text className="text-white mt-2 text-lg font-bold">
            {user?.email}
          </Text>
        </View>

        {/* Separator line */}
        <Separator paddingVertical={"$2"} />

        {/* Drawer item for Reports */}
        <DrawerItem
          label="Reports" // Label for the drawer item
          icon={({ color, size }) => (
            <MaterialIcons
              name="assessment" // Icon for the drawer item
              color={pathname !== "/reports" ? "white" : "#161E2B"} // Change color based on the current path
              size={size}
            />
          )}
          style={{
            backgroundColor: pathname === "/reports" ? "white" : "#161E2B", // Change background color based on the current path
            marginVertical: 10, // Vertical margin
          }}
          onPress={() => props.navigation.navigate("reports/index")} // Navigate to the reports screen
          labelStyle={{
            color: pathname !== "/reports" ? "white" : "#161E2B", // Change text color based on the current path
            fontSize: 20, // Font size
            marginLeft: -18, // Left margin
          }}
        />

        {/* Drawer item for Settings */}
        <DrawerItem
          label="Settings" // Label for the drawer item
          icon={({ color, size }) => (
            <MaterialIcons
              name="settings" // Icon for the drawer item
              color={pathname !== "/settings" ? "white" : "#161E2B"} // Change color based on the current path
              size={size}
            />
          )}
          style={{
            backgroundColor: pathname === "/settings" ? "white" : "#161E2B", // Change background color based on the current path
            marginVertical: 10, // Vertical margin
          }}
          onPress={() => props.navigation.navigate("settings/index")} // Navigate to the settings screen
          labelStyle={{
            color: pathname !== "/settings" ? "white" : "#161E2B", // Change text color based on the current path
            fontSize: 20, // Font size
            marginLeft: -18, // Left margin
          }}
        />
      </DrawerContentScrollView>
    </View>
  );
};

export default CustomDrawerContent; // Exporting the CustomDrawerContent component as default
