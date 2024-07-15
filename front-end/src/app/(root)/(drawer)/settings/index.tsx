import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuthStore } from "@/stores/auth";
import { logout } from "@/services/authService";
import Toast from "react-native-toast-message";

const Profile = () => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);

  const Logout = async () => {
    try {
      const response = await logout({ setUser });
      if (response) {
        Toast.show({
          type: "success",
          text1: "Logout Success",
          text1Style: {
            fontSize: 16,
            textAlign: "center",
            color: "green",
          },
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Logout Failed",
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#161E2B]">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View className="flex-row items-center mb-5">
          <MaterialIcons name="account-circle" size={100} color="white" />
          <View className="ml-5">
            <Text className="text-white text-2xl font-bold">
              {user?.firstname} {user?.lastname}
            </Text>
            <Text className="text-gray-200  text-xl font-bold">
              {user?.username}
            </Text>
            <Text className="text-gray-400 text-lg">{user?.email}</Text>
          </View>
        </View>

        <View className="bg-[#1E2A3B] rounded-lg p-5 mb-5">
          <Text className="text-white text-lg font-bold mb-2">
            Account Settings
          </Text>
          <View className="mb-5 flex gap-2">
            <Text className="text-gray-200 text-lg font-bold">Username</Text>
            <TextInput
              className="text-white text-base border-b border-gray-400"
              placeholder="Username"
              placeholderTextColor="gray"
              defaultValue={user?.username}
            />
          </View>
          <View className="mb-5 flex flex-row gap-2 w-full">
            <View className="w-[50%]">
              <Text className="text-gray-200 text-lg font-bold">
                First Name
              </Text>
              <TextInput
                className="text-white text-base border-b border-gray-400"
                placeholder="Email"
                placeholderTextColor="gray"
                defaultValue={user?.firstname}
              />
            </View>
            <View className="w-[50%]">
              <Text className="text-gray-200 text-lg font-bold">Last Name</Text>
              <TextInput
                className="text-white text-base border-b border-gray-400"
                placeholder="Email"
                placeholderTextColor="gray"
                defaultValue={user?.lastname}
              />
            </View>
          </View>
          <View className="mb-5 flex gap-2">
            <Text className="text-gray-200 text-lg font-bold">Email</Text>
            <TextInput
              className="text-white text-base border-b border-gray-400"
              placeholder="Email"
              placeholderTextColor="gray"
              defaultValue={user?.email}
            />
          </View>

          <View className="mb-5 flex gap-2">
            <Text className="text-gray-200 text-lg font-bold">Password</Text>
            <TextInput
              className="text-white text-base border-b border-gray-400"
              placeholder="Password"
              placeholderTextColor="gray"
              secureTextEntry
              defaultValue="***********"
            />
          </View>
        </View>

        <View className="bg-[#1E2A3B] rounded-lg p-5 mb-5">
          <Text className="text-white text-lg font-bold mb-2">
            Notification Preferences
          </Text>
          <View className="flex-row justify-between items-center mb-5">
            <Text className="text-white text-base">Enable Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={(value) => setNotificationsEnabled(value)}
              thumbColor={notificationsEnabled ? "#3498db" : "#f4f3f4"}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
            />
          </View>
        </View>

        <View className="bg-[#1E2A3B] rounded-lg p-5 mb-5">
          <Text className="text-white text-lg font-bold mb-2">
            Other Settings
          </Text>
          <TouchableOpacity className="flex-row justify-between items-center mb-5">
            <Text className="text-white text-base">Privacy Policy</Text>
            <MaterialIcons name="chevron-right" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row justify-between items-center mb-5">
            <Text className="text-white text-base">Terms of Service</Text>
            <MaterialIcons name="chevron-right" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row justify-between items-center mb-5">
            <Text className="text-white text-base">Help & Support</Text>
            <MaterialIcons name="chevron-right" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="bg-red-600 rounded-lg p-4 items-center"
          onPress={Logout}
        >
          <Text className="text-white text-lg font-bold">Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
