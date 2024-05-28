import { Link } from "expo-router";
import React from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";

const SignupScreen: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");

  const handleSignup = () => {
  };

  {
    /* Use ReactHookForm to make the form handling better */
  }

  return (
    <View className="flex-1 justify-center items-center gap-10 bg-gray-800">
      <View className="w-1/2 justify-center gap-1 items-center bg-gray-800">
        <Image
          source={require("assets/images/expenseTracking.jpg")}
          className=" w-64 h-64 rounded-3xl"
        />
        <Text className="text-xl font-bold  py-4 color-slate-200">
          BudgetBuddy Sign Up
        </Text>
      </View>
      <View className="w-1/2 justify-center gap-1 items-center bg-gray-800">
        <TextInput
          className="w-64 h-10 border border-gray-300 placeholder:text-gray-300 rounded px-2 mb-2"
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          className="w-64 h-10 border border-gray-300 placeholder:text-gray-300 rounded px-2 mb-2"
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          className="w-64 h-10 border border-gray-300 placeholder:text-gray-300 rounded px-2 mb-2"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          className="w-64 h-10 border border-gray-300 placeholder:text-gray-300 rounded px-2 mb-2"
          placeholder="Password"
          inlineImageLeft="password_icon"
          secureTextEntry
          value={password}
          enablesReturnKeyAutomatically
          onChangeText={setPassword}
        />
        <TextInput
          className="w-64 h-10 border border-gray-300 placeholder:text-gray-300 rounded px-2 mb-2"
          placeholder="Re-enter Password"
          inlineImageLeft="password_icon"
          secureTextEntry
          value={password}
          enablesReturnKeyAutomatically
          onChangeText={setPassword}
        />
        <Link href="/login" asChild className="justify-center my-6">
          <TouchableOpacity
            className="w-64 h-14 bg-slate-600 border border-gray-300 rounded-2xl px-2 mb-2"
            onPress={handleSignup}
          >
            <Text className="text-white text-center rounded-xl text-xl py-3 justify-center">
              Sign Up
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

export default SignupScreen;
