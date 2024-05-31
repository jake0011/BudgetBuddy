import React from "react";
import { SafeAreaView, Text, View } from "react-native";

export default function Home() {
    return (
        <SafeAreaView className="flex-1 bg-gray-800">
        <View className="w-full h-full bg-white">
            <Text className="text-black">Home</Text>
        </View>
    </SafeAreaView>
    );
}