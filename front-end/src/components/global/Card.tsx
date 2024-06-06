import React from "react";
import { View, Text } from "react-native";

export default interface CardProps {
    image: string;
    title: string;
    description: string;
  }
  
  
  export const Card: React.FC<CardProps> = ({ image, title, description }) => {
    return (
      <View className="flex bg-gray-200 shadow-md rounded-3xl overflow-hidden mx-4">
        <View className={`w-1/3 bg-cover bg-center bg-[url('${image}')]`} />
        <View className="w-2/3 p-6">
          <Text className="text-lg font-bold mb-2">{title}</Text>
          <Text className="text-gray-600">{description}</Text>
        </View>
      </View>
    );
  };
  