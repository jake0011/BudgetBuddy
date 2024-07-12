import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, Image, Keyboard, ScrollView } from "react-native";
import { Button, Input } from "tamagui";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignUpFormData } from "../../../helpers/validations";

const SignupScreen = () => {
  const router = useRouter();
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

  const onSubmit = async (data: SignUpFormData) => {
    try {
      // router.push('/otp', { formData: data });
      router.push("/otp");
    } catch (error) {
      console.error("Error requesting OTP:", error);
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
                <Input
                  className="w-full p-3 border-2 border-gray-300 placeholder:text-gray-300 rounded-md px-2"
                  placeholder="Username"
                  value={value}
                  onChangeText={onChange}
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
                <View className="flex-col gap-2 w-1/2">
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
          </View>

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
          fontWeight="$16"
          textAlign="center"
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
        {/* <Link href="/otp">OTP</Link> */}
      </Text>
    </View>
  );
};

export default SignupScreen;
