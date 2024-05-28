import { Link } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
} from "react-native";

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // login logic here
  };

  return (
    <View className="flex-1 p-6 justify-center gap-10 items-center bg-gray-800">
      <View className=" w-full justify-center items-center">
        <Image
          source={require("assets/images/expenseTracking.jpg")}
          className="w-full h-64 rounded-3xl"
          resizeMode="cover"
        />
        <Text className="text-2xl font-bold text-white pt-5">
          BudgetBuddy Login
        </Text>
      </View>
      <View className="w-full flex gap-4 justify-center items-center">
        <View className="w-full flex-col gap-2 justify-start">
          <Text className="text-white">Email</Text>
          <TextInput
            id="email"
            className="w-full p-3 border-2 border-gray-300 placeholder:text-gray-300 rounded-md px-2"
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        <View className="w-full flex-col gap-2 justify-start">
          <Text className="text-white">Password</Text>
          <TextInput
            id="password"
            className="w-full p-3 border-2 border-gray-300 placeholder:text-gray-300 rounded-md px-2"
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
        </View>
      </View>
      <Link href="/signup" asChild className="justify-center">
        <TouchableOpacity
          className="w-full p-2 bg-slate-600 border border-gray-300 rounded-2xl px-2 mb-2"
          onPress={handleLogin}
        >
          <Text className="text-white text-center rounded-xl text-xl py-3 justify-center">
            Login
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default LoginScreen;
