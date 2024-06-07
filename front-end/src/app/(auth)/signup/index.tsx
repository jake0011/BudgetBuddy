import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, Image, Keyboard, ScrollView } from "react-native";
import { Button, Input } from "tamagui";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignUpFormData } from "../../../helpers/validations";

const SignupScreen = () => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = (data: SignUpFormData) => {
    // Handle signup logic here
    console.log(data);
  };

  return (
    <View className="flex-1 p-6 justify-center gap-10 items-center ">
      <View className="w-full justify-center items-center">
        {!keyboardVisible && (
          <Image
            source={require("../../../../assets/logo.png")}
            resizeMode="cover"
            className="rounded-full w-60 h-60 object-contain object-center"
          />
        )}
        <Text className="text-4xl font-bold text-white ">Sign Up</Text>
      </View>

      <ScrollView keyboardShouldPersistTaps="handled" style={{ width: "100%" }}>
        <View className="w-full flex gap-4 justify-center items-center">
          {/* <View className="w-full flex-row gap-4 pr-4"> */}
          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, value } }) => (
              <View className="flex-col gap-2 w-full">
                <Text className="text-white">First Name</Text>
                <Input
                  className="w-full p-3 border-2 border-gray-300 placeholder:text-gray-300 rounded-md px-2"
                  placeholder="First Name"
                  value={value}
                  onChangeText={onChange}
                />
                {errors.firstName && (
                  <Text className="text-red-500">
                    {errors.firstName.message}
                  </Text>
                )}
              </View>
            )}
          />
          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, value } }) => (
              <View className="flex-col gap-2 w-full">
                <Text className="text-white">Last Name</Text>
                <Input
                  className="w-full p-3 border-2 border-gray-300 placeholder:text-gray-300 rounded-md px-2"
                  placeholder="Last Name"
                  value={value}
                  onChangeText={onChange}
                />
                {errors.lastName && (
                  <Text className="text-red-500">
                    {errors.lastName.message}
                  </Text>
                )}
              </View>
            )}
          />
          {/* </View> */}

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <View className="w-full flex-col gap-2 justify-start">
                <Text className="text-white">Email</Text>
                <Input
                  className="w-full p-3 border-2 border-gray-300 placeholder:text-gray-300 rounded-md px-2"
                  placeholder="Email"
                  value={value}
                  onChangeText={onChange}
                />
                {errors.email && (
                  <Text className="text-red-500">{errors.email.message}</Text>
                )}
              </View>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <View className="w-full flex-col gap-2 justify-start">
                <Text className="text-white">Password</Text>
                <Input
                  id="password"
                  className="w-full p-3 border-2 border-gray-300 placeholder:text-gray-300 rounded-md px-2"
                  placeholder="Password"
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry
                />
                {errors.password && (
                  <Text className="text-red-500">
                    {errors.password.message}
                  </Text>
                )}
              </View>
            )}
          />
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <View className="w-full flex-col gap-2 justify-start">
                <Text className="text-white">Confirm Password</Text>
                <Input
                  className="w-full p-3 border-2 border-gray-300 placeholder:text-gray-300 rounded-md px-2"
                  placeholder="Confirm Password"
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry
                />
                {errors.confirmPassword && (
                  <Text className="text-red-500">
                    {errors.confirmPassword.message}
                  </Text>
                )}
              </View>
            )}
          />
        </View>
      </ScrollView>
      <View className="w-full">
        <Button
          size="$5"
          theme="active"
          variant="outlined"
          color="white"
          fontWeight="$16"
          textAlign="center"
          radiused
          onPress={handleSubmit(onSubmit)}
        >
          Sign Up
        </Button>
      </View>

      <Text className="text-white text-xl font-bold">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-blue-500 underline underline-offset-4"
        >
          Login
        </Link>
      </Text>
    </View>
  );
};

export default SignupScreen;
