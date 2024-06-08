"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { Button, Input } from "tamagui";
import * as z from "zod";

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
  });

export type formData = z.infer<typeof schema>;

const ResetPasswordScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<formData>({ resolver: zodResolver(schema) });
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const email = "";

  const onSubmit = async (data: formData) => {
    try {
      console.log(data);
    } catch (error) {}
  };

  return (
    <View className="flex-1 justify-center p-8 items-center">
      <Text className="text-3xl text-white font-bold text-center my-6">
        Reset Password
      </Text>
      <View className="flex-col gap-6 w-full">
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
        <Button onPress={handleSubmit(onSubmit)}>Reset Password</Button>
      </View>
    </View>
  );
};

export default ResetPasswordScreen;
