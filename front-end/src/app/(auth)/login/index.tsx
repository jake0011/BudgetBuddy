import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, Image, Keyboard } from "react-native";
import { TextInput } from "react-native-paper";
import { Button, Input, Spinner } from "tamagui";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, loginSchema } from "../../../helpers/validations";
import { login } from "@/services/authService";
import Toast from "react-native-toast-message";
import { useAuthStore } from "@/stores/auth";
import { MaterialIcons } from "@expo/vector-icons";

const LoginScreen = () => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();

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

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      const response = await login(
        {
          username: data.username,
          password: data.password,
        },
        setUser
      );
      Toast.show({
        type: "success",
        text1: "Login Successful",
        text1Style: {
          color: "green",
          fontSize: 16,
          textAlign: "center",
        },
      });
      if (response) {
        router.push("/");
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: error.response.data.error,
        text1Style: {
          color: "red",
          fontSize: 16,
          textAlign: "center",
        },
      });
    } finally {
      setIsLoading(false);
    }
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
        <View className="w-full flex justify-start">
          <Link
            href="/forgot-password"
            className="text-red-500 text-base font-semibold"
          >
            Forgot Password?
          </Link>
        </View>
      </View>
      <View className="w-full">
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
