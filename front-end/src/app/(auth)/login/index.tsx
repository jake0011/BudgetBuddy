import { Link, useRouter } from "expo-router"; // Importing Link and useRouter from expo-router for navigation
import React, { useEffect, useState } from "react"; // Importing React and hooks for state and lifecycle management
import { View, Text, Image, Keyboard } from "react-native"; // Importing components from react-native for UI
import { TextInput } from "react-native-paper"; // Importing TextInput from react-native-paper for input fields
import { Button, Spinner } from "tamagui"; // Importing Button and Spinner from tamagui for buttons and loading indicators
import { useForm, Controller } from "react-hook-form"; // Importing useForm and Controller from react-hook-form for form handling
import { zodResolver } from "@hookform/resolvers/zod"; // Importing zodResolver for form validation
import { LoginFormData, loginSchema } from "../../../helpers/validations"; // Importing validation schema and types
import { login } from "@/services/authService"; // Importing login function from authService
import Toast from "react-native-toast-message"; // Importing Toast for displaying messages
import { useAuthStore } from "@/stores/auth"; // Importing useAuthStore for state management

const LoginScreen = () => {
  const [keyboardVisible, setKeyboardVisible] = useState(false); // State to track if the keyboard is visible
  const [isLoading, setIsLoading] = useState(false); // State to track if a request is loading
  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility
  const setUser = useAuthStore((state) => state.setUser); // Function to set the user in the global state
  const router = useRouter(); // Hook for navigation

  useEffect(() => {
    // Effect to handle keyboard visibility
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true) // Set keyboardVisible to true when keyboard is shown
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false) // Set keyboardVisible to false when keyboard is hidden
    );

    return () => {
      // Cleanup listeners on component unmount
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const {
    control, // Control object for form handling
    handleSubmit, // Function to handle form submission
    formState: { errors }, // Object containing form errors
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema), // Resolver for form validation using zod schema
  });

  const onSubmit = async (data: LoginFormData) => {
    // Function to handle form submission
    try {
      setIsLoading(true); // Set loading state to true
      const response = await login(
        {
          username: data.username,
          password: data.password,
        },
        setUser
      ); // Call login function with form data and set user in global state
      Toast.show({
        type: "success",
        text1: "Login Successful",
        text1Style: {
          color: "green",
          fontSize: 16,
          textAlign: "center",
        },
      }); // Show success message
      if (response) {
        router.push("/"); // Navigate to the home page
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: error?.response?.data?.error || error.message,
        text1Style: {
          color: "red",
          fontSize: 16,
          textAlign: "center",
        },
      }); // Show error message
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  return (
    <View className="flex-1 p-6 justify-center gap-10 items-center">
      {/* Main container with flex layout */}
      <View className="w-full justify-center items-center">
        {/* Container for logo and title */}
        {!keyboardVisible && (
          <Image
            source={require("../../../../assets/logo.png")}
            resizeMode="cover"
            className="rounded-full w-60 h-52 object-contain object-center"
          />
        )}
        {/* Display logo if keyboard is not visible */}
        <Text className="text-4xl font-bold text-white">Login</Text>
        {/* Title */}
      </View>
      <View className="w-full flex gap-4 justify-center items-center">
        {/* Container for form fields */}
        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, value } }) => (
            <View className="w-full flex-col gap-2 justify-start">
              <Text className="text-white">Username</Text>
              <TextInput
                placeholder="Username"
                value={value}
                onChangeText={onChange}
                error={!!errors.username}
                outlineColor="gray"
                activeOutlineColor="black"
                style={{
                  height: 45,
                }}
              />
              {errors.username && (
                <Text className="text-red-500">{errors.username.message}</Text>
              )}
            </View>
          )}
        />
        {/* Username field with validation */}
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <View className="w-full flex-col gap-2 justify-start">
              <Text className="text-white">Password</Text>
              <TextInput
                placeholder="Password"
                autoComplete="password"
                value={value}
                onChangeText={onChange}
                secureTextEntry={!passwordVisible}
                error={!!errors.password}
                style={{
                  height: 45,
                }}
                right={
                  <TextInput.Icon
                    icon={passwordVisible ? "eye-off" : "eye"}
                    onPress={() => setPasswordVisible(!passwordVisible)}
                  />
                }
              />
              {errors.password && (
                <Text className="text-red-500">{errors.password.message}</Text>
              )}
            </View>
          )}
        />
        {/* Password field with toggle visibility and validation */}
        <View className="w-full flex justify-start">
          <Link
            href="/forgot-password"
            className="text-red-500 text-base font-semibold"
          >
            Forgot Password?
          </Link>
        </View>
        {/* Link to the forgot password page */}
      </View>
      <View className="w-full">
        {/* Container for the login button */}
        <Button
          size="$5"
          theme="active"
          fontWeight="$16"
          textAlign="center"
          disabled={isLoading}
          icon={isLoading ? <Spinner size="small" color="$green10" /> : null}
          radiused
          onPress={handleSubmit(onSubmit)}
        >
          Login
        </Button>
        {/* Login button with loading indicator */}
      </View>

      <Text className="text-gray-400 text-xl font-normal">
        Don't have an account?{" "}
        <Link href="/signup" className="text-white font-bold cursor-pointer">
          Sign Up
        </Link>
      </Text>
      {/* Link to the signup page */}
    </View>
  );
};

export default LoginScreen; // Exporting the LoginScreen component
