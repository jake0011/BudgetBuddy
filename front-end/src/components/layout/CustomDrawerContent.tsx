import React from "react";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Avatar, Separator } from "tamagui";
import { usePathname } from "expo-router";
import { useAuthStore } from "@/stores/auth";

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} className="h-[500px] bg-[#161E2B]">
        <View className="items-center my-5">
          <MaterialIcons name="account-circle" size={100} color="white" />
          <Text className="text-white mt-2 text-2xl font-bold">
            {user?.firstname} {user?.lastname}
          </Text>
          <Text className="text-white mt-2 text-lg font-bold">
            {user?.email}
          </Text>
        </View>

        <Separator paddingVertical={"$2"} />

        <DrawerItem
          label="Reports"
          icon={({ color, size }) => (
            <MaterialIcons
              name="assessment"
              color={pathname !== "/reports" ? "white" : "#161E2B"}
              size={size}
            />
          )}
          style={{
            backgroundColor: pathname === "/reports" ? "white" : "#161E2B",
            marginVertical: 10,
          }}
          onPress={() => props.navigation.navigate("reports/index")}
          labelStyle={{
            color: pathname !== "/reports" ? "white" : "#161E2B",
            fontSize: 20,
            marginLeft: -18,
          }}
        />
        <DrawerItem
          label="Settings"
          icon={({ color, size }) => (
            <MaterialIcons
              name="settings"
              color={pathname !== "/settings" ? "white" : "#161E2B"}
              size={size}
            />
          )}
          style={{
            backgroundColor: pathname === "/settings" ? "white" : "#161E2B",
            marginVertical: 10,
          }}
          onPress={() => props.navigation.navigate("settings/index")}
          labelStyle={{
            color: pathname !== "/settings" ? "white" : "#161E2B",
            fontSize: 20,
            marginLeft: -18,
          }}
        />
      </DrawerContentScrollView>
      {/* <Separator paddingVertical={"$2"} />
      <View style={{ justifyContent: "flex-end", padding: 16 }}>
        <Button
          mode="contained"
          onPress={() => {
            // Add your logout logic here
          }}
          icon="logout"
          buttonColor="red"
          loading={false}
        >
          Logout
        </Button>
      </View> */}
    </View>
  );
};

export default CustomDrawerContent;
