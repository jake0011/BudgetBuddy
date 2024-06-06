import { Link } from "expo-router";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
// import { TextInput } from "react-native-paper";

const SignupScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSignup = () => {
    // signup logic here
  };

  return (
    // <View className="flex-1 p-6 justify-center gap-10 items-center bg-gray-800">
    //   <Text className="text-4xl font-bold text-white pt-2">
    //     BudgetBuddy Sign Up
    //   </Text>

    //   <View className="w-full flex gap-3 justify-center items-center">
    //     <View className="w-full flex-row gap-4 justify-between">
    //       <View className="w-full flex-1 flex-col gap-2 justify-start">
    //         <Text className="text-white">First Name</Text>
    //         <TextInput
    //           id="firstName"
    //           label={"First Name"}
    //           theme={{ colors: { placeholder: "white", text: "white" } }}
    //           className="w-full text-white p-3 border-2 border-gray-300 placeholder:text-gray-800 rounded-md px-2"
    //           placeholder="First Name"
    //           value={firstName}
    //           autoComplete="name"
    //           onChangeText={(text) => setFirstName(text)}
    //         />
    //       </View>
    //       <View className="w-1/2 flex-col gap-2 justify-start">
    //         <Text className="text-white">Last Name</Text>
    //         <TextInput
    //           id="lastName"
    //           label={"Last Name"}
    //           theme={{ colors: { placeholder: "white", text: "white" } }}
    //           className="w-full text-white p-3 border-2 border-gray-300 placeholder:text-gray-800 rounded-md px-2"
    //           placeholder="Last Name"
    //           autoComplete="name"
    //           value={lastName}
    //           onChangeText={(text) => setLastName(text)}
    //         />
    //       </View>
    //     </View>
    //     <View className="w-full flex-col gap-2 justify-start">
    //       <Text className="text-white">Email</Text>
    //       <TextInput
    //         id="email"
    //         theme={{ colors: { placeholder: "white", text: "white" } }}
    //         className="w-full text-white p-3 border-2 border-gray-300 placeholder:text-gray-800 rounded-md px-2"
    //         placeholder="Email"
    //         autoComplete="email"
    //         value={email}
    //         onChangeText={(text) => setEmail(text)}
    //       />
    //     </View>
    //     <View className="w-full flex-col gap-2 justify-start">
    //       <Text className="text-white">Password</Text>
    //       <TextInput
    //         id="password"
    //         theme={{ colors: { placeholder: "white", text: "white" } }}
    //         className="w-full text-white p-3 border-2 border-gray-300 placeholder:text-gray-800 rounded-md px-2"
    //         placeholder="Password"
    //         value={password}
    //         autoComplete="password"
    //         onChangeText={(text) => setPassword(text)}
    //         secureTextEntry
    //       />
    //     </View>
    //     <View className="w-full flex-col gap-2 justify-start">
    //       <Text className="text-white">Confirm Password</Text>
    //       <TextInput
    //         id="password"
    //         theme={{ colors: { placeholder: "white", text: "white" } }}
    //         className="w-full text-white p-3 border-2 border-gray-300 placeholder:text-gray-800 rounded-md px-2"
    //         placeholder="Password"
    //         value={confirmPassword}
    //         onChangeText={(text) => setConfirmPassword(text)}
    //         secureTextEntry
    //       />
    //     </View>
    //   </View>
    //   <Link href="/dashboard" asChild className="justify-center ">
    //     <TouchableOpacity
    //       className="w-full p-2 bg-slate-600 border border-gray-300 rounded-2xl px-2 "
    //       onPress={handleSignup}
    //     >
    //       <Text className="text-white text-center rounded-xl text-xl py-3 justify-center">
    //         Sign Up
    //       </Text>
    //     </TouchableOpacity>
    //   </Link>
    // </View>
    <View>SIgnup</View>
  );
};

export default SignupScreen;
