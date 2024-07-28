import { Link, useRouter } from "expo-router"; // Importing Link and useRouter from expo-router for navigation
import React, { useEffect, useState } from "react"; // Importing React and hooks for state and lifecycle management
import { View, Text, Image, Keyboard, ScrollView } from "react-native"; // Importing components from react-native for UI
import { TextInput } from "react-native-paper"; // Importing TextInput from react-native-paper for input fields
import { Button, Spinner } from "tamagui"; // Importing Button and Spinner from tamagui for buttons and loading indicators
import { useForm, Controller } from "react-hook-form"; // Importing useForm and Controller from react-hook-form for form handling
import { zodResolver } from "@hookform/resolvers/zod"; // Importing zodResolver for form validation
import { signupSchema, SignUpFormData } from "../../../helpers/validations"; // Importing validation schema and types
import { signUp, login } from "@/services/authService"; // Importing signUp and login functions from authService
import Toast from "react-native-toast-message"; // Importing Toast for displaying messages
import { useAuthStore } from "@/stores/auth"; // Importing useAuthStore for state management

const SignupScreen = () => {
  const router = useRouter(); // Hook for navigation

  const [keyboardVisible, setKeyboardVisible] = useState(false); // State to track if the keyboard is visible
  const [isLoading, setIsLoading] = useState(false); // State to track if a request is loading
  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); // State to toggle confirm password visibility
  const setUser = useAuthStore((state) => state.setUser); // Function to set the user in the global state

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
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signupSchema), // Resolver for form validation using zod schema
  });

  const onSubmit = async (data: SignUpFormData) => {
    // Function to handle form submission
    try {
      setIsLoading(true); // Set loading state to true

      const response = await signUp({
        username: data.username,
        password: data.password,
        email: data.email,
        firstname: data.firstName,
        lastname: data.lastName,
      }); // Call signUp function with form data

      if (response.message) {
        // If signup is successful
        await login(
          {
            username: data.username,
            password: data.password,
          },
          setUser
        ); // Log the user in and set the user in the global state

        Toast.show({
          type: "success",
          text1: "Signup Successful",
          text1Style: {
            color: "green",
            fontSize: 16,
            textAlign: "center",
          },
        }); // Show success message

        router.push("/"); // Navigate to the home page
      }
    } catch (error) {
      // If an error occurs
      Toast.show({
        type: "error",
        text1: error.response?.data?.error || error.message,
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
    <View className="flex-1 p-4 justify-center gap-10 items-center ">
      {/* Main container with flex layout */}
      <View className="w-full justify-center items-center pt-4">
        {/* Container for logo and title */}
        {!keyboardVisible && (
          <Image
            source={require("../../../../assets/logo.png")}
            resizeMode="cover"
            className="rounded-full w-60 h-52 object-contain object-center"
          />
        )}
        {/* Display logo if keyboard is not visible */}
        <Text className="text-4xl font-bold text-white ">Sign Up</Text>
        {/* Title */}
      </View>

      <ScrollView keyboardShouldPersistTaps="handled" style={{ width: "100%" }}>
        {/* Scrollable container for form fields */}
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
                  style={{
                    height: 45,
                  }}
                  activeOutlineColor="black"
                />
                {errors.username && (
                  <Text className="text-red-500">
                    {errors.username.message}
                  </Text>
                )}
              </View>
            )}
          />
          {/* Username field with validation */}

          <View className="w-full flex-row gap-3 pr-4 ">
            {/* Container for first and last name fields */}
            <Controller
              control={control}
              name="firstName"
              render={({ field: { onChange, value } }) => (
                <View className="flex-col gap-2 w-1/2">
                  <Text className="text-white">First Name</Text>
                  <TextInput
                    placeholder="First Name"
                    value={value}
                    onChangeText={onChange}
                    error={!!errors.firstName}
                    outlineColor="gray"
                    style={{
                      height: 45,
                    }}
                    activeOutlineColor="black"
                  />
                  {errors.firstName && (
                    <Text className="text-red-500">
                      {errors.firstName.message}
                    </Text>
                  )}
                </View>
              )}
            />
            {/* First name field with validation */}

            <Controller
              control={control}
              name="lastName"
              render={({ field: { onChange, value } }) => (
                <View className="flex-col gap-2 w-1/2">
                  <Text className="text-white">Last Name</Text>
                  <TextInput
                    placeholder="Last Name"
                    value={value}
                    onChangeText={onChange}
                    error={!!errors.lastName}
                    outlineColor="gray"
                    style={{
                      height: 45,
                    }}
                    activeOutlineColor="black"
                  />
                  {errors.lastName && (
                    <Text className="text-red-500">
                      {errors.lastName.message}
                    </Text>
                  )}
                </View>
              )}
            />
            {/* Last name field with validation */}
          </View>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <View className="w-full flex-col gap-2 justify-start">
                <Text className="text-white">Email</Text>
                <TextInput
                  placeholder="Email"
                  value={value}
                  onChangeText={onChange}
                  error={!!errors.email}
                  outlineColor="gray"
                  style={{
                    height: 45,
                  }}
                  activeOutlineColor="black"
                />
                {errors.email && (
                  <Text className="text-red-500">{errors.email.message}</Text>
                )}
              </View>
            )}
          />
          {/* Email field with validation */}

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
                  style={{
                    height: 45,
                  }}
                  error={!!errors.password}
                  right={
                    <TextInput.Icon
                      icon={passwordVisible ? "eye-off" : "eye"}
                      onPress={() => setPasswordVisible(!passwordVisible)}
                    />
                  }
                  outlineColor="gray"
                  activeOutlineColor="black"
                />
                {errors.password && (
                  <Text className="text-red-500">
                    {errors.password.message}
                  </Text>
                )}
              </View>
            )}
          />
          {/* Password field with toggle visibility and validation */}

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <View className="w-full flex-col gap-2 justify-start">
                <Text className="text-white">Confirm Password</Text>
                <TextInput
                  placeholder="Confirm Password"
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry={!confirmPasswordVisible}
                  error={!!errors.confirmPassword}
                  style={{
                    height: 45,
                  }}
                  right={
                    <TextInput.Icon
                      icon={confirmPasswordVisible ? "eye-off" : "eye"}
                      onPress={() =>
                        setConfirmPasswordVisible(!confirmPasswordVisible)
                      }
                    />
                  }
                  outlineColor="gray"
                  activeOutlineColor="black"
                />
                {errors.confirmPassword && (
                  <Text className="text-red-500">
                    {errors.confirmPassword.message}
                  </Text>
                )}
              </View>
            )}
          />
          {/* Confirm password field with toggle visibility and validation */}
        </View>
      </ScrollView>

      <View className="w-full">
        {/* Container for the sign-up button */}
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
          Sign Up
        </Button>
        {/* Sign-up button with loading indicator */}
      </View>

      <Text className="text-gray-400 text-xl font-normal">
        Already have an account?{" "}
        <Link href="/login" className="text-white font-bold cursor-pointer">
          Login
        </Link>
      </Text>
      {/* Link to the login page */}
    </View>
  );
};

export default SignupScreen; // Exporting the SignupScreen component
