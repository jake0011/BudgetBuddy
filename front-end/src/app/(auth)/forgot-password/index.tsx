"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Image, Keyboard, Text, View } from "react-native";
import { TextInput } from "react-native-paper";
import { Input, Button } from "tamagui";
import * as z from "zod";

export const schema = z.object({
  email: z.string().email("Invalid email address"),
});

export type formData = z.infer<typeof schema>;

const ForgotPasswordScreen = () => {
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
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formData>({ resolver: zodResolver(schema) });

  const router = useRouter();

  const onSubmit = async (data: formData) => {
    try {
      console.log(data);
    } catch (error) {}
  };

  return (
    <View className="flex-1 justify-center p-8 items-center">
      <View className="w-full mb-4 justify-center items-center">
        {!keyboardVisible && (
          <Image
            source={require("../../../../assets/logo.png")}
            resizeMode="cover"
            className="rounded-full w-60 h-52 object-contain object-center"
          />
        )}
        <Text className="text-4xl font-bold text-white">Forgot Password</Text>
      </View>
      <View className="flex-col gap-6 w-full">
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
        <Button onPress={handleSubmit(onSubmit)}>Send</Button>
      </View>
      <Text className="text-gray-400 text-xl font-normal py-4">
        Remembered your password?{" "}
        <Link href="/login" className="text-white font-bold cursor-pointer">
          Login
        </Link>
      </Text>
    </View>
  );
};

export default ForgotPasswordScreen;
