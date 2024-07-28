import React from "react"; // Importing React library
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
} from "react-native"; // Importing components from react-native
import { MaterialIcons } from "@expo/vector-icons"; // Importing icons from expo vector icons
import { useAuthStore } from "@/stores/auth"; // Importing custom hook for authentication store
import { logout } from "@/services/authService"; // Importing logout service
import Toast from "react-native-toast-message"; // Importing Toast for notifications

// Profile component to display and manage user profile settings
const Profile = () => {
  // State to manage notification switch
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  // Get setUser function from auth store
  const setUser = useAuthStore((state) => state.setUser);
  // Get user data from auth store
  const user = useAuthStore((state) => state.user);

  // Function to handle user logout
  const Logout = async () => {
    try {
      // Call logout service
      const response = await logout({ setUser });
      if (response) {
        // Show success toast if logout is successful
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
      // Show error toast if logout fails
      Toast.show({
        type: "error",
        text1: "Logout Failed",
      });
    }
  };

  return (
    // SafeAreaView to ensure content is within safe area boundaries
    <SafeAreaView className="flex-1 bg-[#161E2B]">
      {/* ScrollView to make the content scrollable */}
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* User profile section */}
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

        {/* Account settings section */}
        <View className="bg-[#1E2A3B] rounded-lg p-5 mb-5">
          <Text className="text-white text-lg font-bold mb-2">
            Account Settings
          </Text>
          {/* Username input */}
          <View className="mb-5 flex gap-2">
            <Text className="text-gray-200 text-lg font-bold">Username</Text>
            <TextInput
              className="text-white text-base border-b border-gray-400"
              placeholder="Username"
              placeholderTextColor="gray"
              defaultValue={user?.username}
            />
          </View>
          {/* First name and last name inputs */}
          <View className="mb-5 flex flex-row gap-2 w-full">
            <View className="flex-1">
              <Text className="text-gray-200 text-lg font-bold">
                First Name
              </Text>
              <TextInput
                className="text-white text-base border-b border-gray-400"
                placeholder="First Name"
                placeholderTextColor="gray"
                defaultValue={user?.firstname}
              />
            </View>
            <View className="flex-1">
              <Text className="text-gray-200 text-lg font-bold">Last Name</Text>
              <TextInput
                className="text-white text-base border-b border-gray-400"
                placeholder="Last Name"
                placeholderTextColor="gray"
                defaultValue={user?.lastname}
              />
            </View>
          </View>
          {/* Email input */}
          <View className="mb-5 flex gap-2">
            <Text className="text-gray-200 text-lg font-bold">Email</Text>
            <TextInput
              className="text-white text-base border-b border-gray-400"
              placeholder="Email"
              placeholderTextColor="gray"
              defaultValue={user?.email}
            />
          </View>
          {/* Password input */}
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

        {/* Notification preferences section */}
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

        {/* Other settings section */}
        <View className="bg-[#1E2A3B] rounded-lg p-5 mb-5">
          <Text className="text-white text-lg font-bold mb-2">
            Other Settings
          </Text>
          {/* Privacy Policy link */}
          <TouchableOpacity className="flex-row justify-between items-center mb-5">
            <Text className="text-white text-base">Privacy Policy</Text>
            <MaterialIcons name="chevron-right" size={24} color="white" />
          </TouchableOpacity>
          {/* Terms of Service link */}
          <TouchableOpacity className="flex-row justify-between items-center mb-5">
            <Text className="text-white text-base">Terms of Service</Text>
            <MaterialIcons name="chevron-right" size={24} color="white" />
          </TouchableOpacity>
          {/* Help & Support link */}
          <TouchableOpacity className="flex-row justify-between items-center mb-5">
            <Text className="text-white text-base">Help & Support</Text>
            <MaterialIcons name="chevron-right" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Logout button */}
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

export default Profile; // Exporting the Profile component as default
