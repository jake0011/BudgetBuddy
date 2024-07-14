import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, Image, Keyboard, ScrollView } from "react-native";
import { TextInput } from "react-native-paper";
import { Button, Spinner } from "tamagui";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignUpFormData } from "../../../helpers/validations";
import { signUp, login } from "@/services/authService";
import Toast from "react-native-toast-message";
import { useAuthStore } from "@/stores/auth";

const SignupScreen = () => {
  const router = useRouter();

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);

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

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setIsLoading(true);

      const response = await signUp({
        username: data.username,

        password: data.password,
        email: data.email,
        firstname: data.firstName,

        lastname: data.lastName,
      });
      if (response.message) {
        await login(
          {
            username: data.username,
            password: data.password,
          },
          setUser
        );
        Toast.show({
          type: "success",
          text1: "Signup Successful",

          text1Style: {
            color: "green",
            fontSize: 16,

            textAlign: "center",
          },
        });

        router.push("/");
      }
    } catch (error) {
      Toast.show({
        type: "error",

        text1: error.response?.data?.error || "Signup failed",
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
    <View className="flex-1 p-4 justify-center gap-10 items-center ">
      <View className="w-full justify-center items-center pt-4">
        {!keyboardVisible && (
          <Image
            source={require("../../../../assets/logo.png")}
            resizeMode="cover"
            className="rounded-full w-60 h-52 object-contain object-center"
          />
        )}

        <Text className="text-4xl font-bold text-white ">Sign Up</Text>
      </View>

      <ScrollView keyboardShouldPersistTaps="handled" style={{ width: "100%" }}>
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
          <View className="w-full flex-row gap-3 pr-4 ">
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
        </View>
      </ScrollView>
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
          Sign Up
        </Button>
      </View>

      <Text className="text-gray-400 text-xl font-normal">
        Already have an account?{" "}
        <Link href="/login" className="text-white font-bold cursor-pointer">
          Login
        </Link>
      </Text>
    </View>
  );
};

export default SignupScreen;
