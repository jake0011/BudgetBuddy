"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { Input, Button } from "tamagui";
import * as z from "zod";

export const schema = z.object({
  email: z.string().email("Invalid email address"),
});

export type formData = z.infer<typeof schema>;

const ForgotPasswordScreen = () => {
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
      <Text className="text-3xl text-white font-bold text-center my-6">
        Forgot Password
      </Text>
      <View className="flex-col gap-6 w-full">
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <View className="flex-col gap-2 w-full">
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
        <Button onPress={handleSubmit(onSubmit)}>Send</Button>
      </View>
    </View>
  );
};

export default ForgotPasswordScreen;
