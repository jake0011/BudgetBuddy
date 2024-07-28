import { zodResolver } from "@hookform/resolvers/zod"; // Importing zodResolver for form validation
import { useLocalSearchParams, useRouter } from "expo-router"; // Importing hooks for navigation and search params
import React, { useEffect, useState } from "react"; // Importing React and hooks for state and lifecycle management
import { Controller, useForm } from "react-hook-form"; // Importing useForm and Controller from react-hook-form for form handling
import { Image, Keyboard, Text, View } from "react-native"; // Importing components from react-native for UI
import { TextInput } from "react-native-paper"; // Importing TextInput from react-native-paper for input fields
import { Button } from "tamagui"; // Importing Button from tamagui for buttons
import * as z from "zod"; // Importing zod for schema validation

export const schema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(50, "Password must be less than 50 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }); // Defining schema for password and confirm password validation

export type formData = z.infer<typeof schema>; // Defining type for form data based on schema

const ResetPasswordScreen = () => {
  const [keyboardVisible, setKeyboardVisible] = useState(false); // State to track if the keyboard is visible
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State to toggle confirm password visibility

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
  } = useForm<formData>({ resolver: zodResolver(schema) }); // Initializing form with zod schema resolver
  const router = useRouter(); // Hook for navigation
  const searchParams = useLocalSearchParams(); // Hook to get search params
  const email = ""; // Placeholder for email, can be retrieved from searchParams if needed

  const onSubmit = async (data: formData) => {
    // Function to handle form submission
    try {
      console.log(data); // Log form data to console
    } catch (error) {
      // Handle error
    }
  };

  return (
    <View className="flex-1 justify-center p-8 items-center">
      {/* Main container with flex layout */}
      <View className="w-full mb-4 justify-center items-center">
        {/* Container for logo and title */}
        {!keyboardVisible && (
          <Image
            source={require("../../../../assets/logo.png")}
            resizeMode="cover"
            className="rounded-full w-60 h-52 object-contain object-center"
          />
        )}
        {/* Display logo if keyboard is not visible */}
        <Text className="text-4xl font-bold text-white">Reset Password</Text>
        {/* Title */}
      </View>
      <View className="flex-col gap-6 w-full">
        {/* Container for form fields */}
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <View className="w-full flex-col gap-2 justify-start">
              <Text className="text-white">Password</Text>
              <TextInput
                style={{
                  height: 45,
                }}
                placeholder="Password"
                value={value}
                onChangeText={onChange}
                secureTextEntry={!showPassword}
                right={
                  <TextInput.Icon
                    icon={showPassword ? "eye" : "eye-off"}
                    onPress={() => setShowPassword(!showPassword)}
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
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, value } }) => (
            <View className="w-full flex-col gap-2 justify-start">
              <Text className="text-white">Confirm Password</Text>
              <TextInput
                style={{
                  height: 45,
                }}
                placeholder="Confirm Password"
                value={value}
                onChangeText={onChange}
                secureTextEntry={!showConfirmPassword}
                right={
                  <TextInput.Icon
                    icon={showConfirmPassword ? "eye" : "eye-off"}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                }
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
        <Button onPress={handleSubmit(onSubmit)}>Reset Password</Button>
        {/* Reset Password button */}
      </View>
    </View>
  );
};

export default ResetPasswordScreen; // Exporting the ResetPasswordScreen component
