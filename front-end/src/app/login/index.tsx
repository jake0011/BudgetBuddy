import { Link } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput, Button, Image, TouchableOpacity } from "react-native";

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // login logic here
  };

  return (
    <View className="flex-1 justify-center gap-10 items-center bg-gray-800">
      <View className="w-1/2 justify-center items-center">
        <Image
          source={require("assets/images/expenseTracking.jpg")}
          className="w-64 h-64 rounded-3xl"
          resizeMode="cover"
        />
        <Text className="text-2xl font-bold text-white pt-5">
          BudgetBuddy Login
        </Text>
      </View>
      <View className="w-1/2 justify-center items-center">
        <TextInput
          className="w-64 h-10 border-2 border-gray-300 placeholder:text-gray-300 rounded-md mb-2 px-2"
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          className="w-64 h-10 border-2 border-gray-300  placeholder:text-gray-300 rounded-md mb-2 px-2"
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <Link href="/signup" asChild className="justify-center my-6">
          <TouchableOpacity
            className="w-64 h-14 bg-slate-600 border border-gray-300 rounded-2xl px-2 mb-2"
            onPress={handleLogin}
          >
            <Text className="text-white text-center rounded-xl text-xl py-3 justify-center">
              Login
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

export default LoginScreen;
