import { Link } from "expo-router";
import { Activity, Airplay } from "@tamagui/lucide-icons";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Button, Input, Label } from "tamagui";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, loginSchema } from "../../../helpers/validations";

const LoginScreen = () => {
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
    <View className="flex-1 p-6 justify-center gap-10 items-center bg-gray-800">
      <View className="w-full justify-center items-center">
        <Text className="text-4xl font-bold text-white pt-5">Login</Text>
      </View>
      <View className="w-full flex gap-4 justify-center items-center">
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <View className="w-full flex-col gap-2 justify-start">
              <Text className="text-white">Email</Text>
              <Input
                id="email"
                autoComplete="email"
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
                autoComplete="password"
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
      </View>
      <View className="w-full">
        <Button
          size="$5"
          theme="active"
          variant="outlined"
          color="white"
          fontWeight="$16"
          textAlign="center"
          radiused
        >
          Login
        </Button>
      </View>
      <Link href="/signup" asChild className="justify-center">
        <Button>Log in</Button>
      </Link>
    </View>
  );
};

export default LoginScreen;
