import { zodResolver } from "@hookform/resolvers/zod"; // Importing zodResolver for form validation
import { Link, useRouter } from "expo-router"; // Importing Link and useRouter from expo-router for navigation
import React, { useEffect, useState } from "react"; // Importing React and hooks for state and lifecycle management
import { Controller, useForm } from "react-hook-form"; // Importing useForm and Controller from react-hook-form for form handling
import { Image, Keyboard, Text, View } from "react-native"; // Importing components from react-native for UI
import { TextInput } from "react-native-paper"; // Importing TextInput from react-native-paper for input fields
import { Button } from "tamagui"; // Importing Button from tamagui for buttons
import * as z from "zod"; // Importing zod for schema validation

export const schema = z.object({
  email: z.string().email("Invalid email address"), // Defining schema for email validation
});

export type formData = z.infer<typeof schema>; // Defining type for form data based on schema

const ForgotPasswordScreen = () => {
  const [keyboardVisible, setKeyboardVisible] = useState(false); // State to track if the keyboard is visible

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
        <Text className="text-4xl font-bold text-white">Forgot Password</Text>
        {/* Title */}
      </View>
      <View className="flex-col gap-6 w-full">
        {/* Container for form fields */}
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <View className="flex-col gap-2 w-full">
              <Text className="text-white">Email</Text>
              <TextInput
                placeholder="Email"
                value={value}
                onChangeText={onChange}
                style={{
                  height: 45,
                }}
              />
              {errors.email && (
                <Text className="text-red-500">{errors.email.message}</Text>
              )}
            </View>
          )}
        />
        {/* Email field with validation */}
        <Button onPress={handleSubmit(onSubmit)}>Send</Button>
        {/* Send button */}
      </View>
      <Text className="text-gray-400 text-xl font-normal py-4">
        Remembered your password?{" "}
        <Link href="/login" className="text-white font-bold cursor-pointer">
          Login
        </Link>
      </Text>
      {/* Link to the login page */}
    </View>
  );
};

export default ForgotPasswordScreen; // Exporting the ForgotPasswordScreen component
