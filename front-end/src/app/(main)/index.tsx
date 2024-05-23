import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Page() {
  const { top, bottom } = useSafeAreaInsets();
  return (
    <View
      className="flex-1 px-4"
      style={{ marginTop: top, marginBottom: bottom }}
    >
      <Text className="text-3xl font-bold">Budget Buddy</Text>
    </View>
  );
}
