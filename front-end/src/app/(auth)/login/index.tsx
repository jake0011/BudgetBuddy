import { Link } from "expo-router";
import { Activity, Airplay } from "@tamagui/lucide-icons";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, Keyboard } from "react-native";
import { Button as B } from "react-native-paper";
import { Button, Input, Label } from "tamagui";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, loginSchema } from "../../../helpers/validations";

const LoginScreen = () => {
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
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    // Handle login logic here
    console.log(data);
  };

  return (
    <View className="flex-1 p-6 justify-center gap-10 items-center">
      <View className="w-full justify-center items-center">
        {!keyboardVisible && (
          <Image
            source={require("../../../../assets/logo.png")}
            resizeMode="cover"
            className="rounded-full w-60 h-52 object-contain object-center"
          />
        )}
        <Text className="text-4xl font-bold text-white">Login</Text>
      </View>

      <View className="w-full flex gap-4 justify-center items-center">
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
                className="w-full p-3 border-2 border-gray-300 placeholder:text-gray-300 rounded-md px-2"
                placeholder="Password"
                value={value}
                onChangeText={onChange}
                secureTextEntry
              />
              {errors.password && (
                <Text className="text-red-500">{errors.password.message}</Text>
              )}
            </View>
          )}
        />
        <View className="w-full flex justify-start">
          <Link
            href="/forgot-password"
            className="text-red-500 text-base font-semibold"
          >
            Forgot Password?
          </Link>
        </View>
      </View>
      {/* <TouchableOpacity
        className="w-full p-2 bg-slate-600 border border-gray-300 rounded-2xl px-2 mb-2"
        // onPress={handleSubmit(onSubmit)}
      >
        <Text className="text-white text-center rounded-xl text-xl py-3 justify-center">
          Login
        </Text>
      </TouchableOpacity> */}
      <View className="w-full">
        <Button
          size="$5"
          theme="active"
          fontWeight="$16"
          textAlign="center"
          radiused
          onPress={handleSubmit(onSubmit)}
        >
          Login
        </Button>
      </View>

      <Text className="text-gray-400 text-xl font-normal">
        Don't have an account?{" "}
        <Link href="/signup" className="text-white font-bold cursor-pointer">
          Sign Up
        </Link>
      </Text>
    </View>
  );
};

export default LoginScreen;
