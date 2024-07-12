import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { MaterialIcons } from "@expo/vector-icons";

interface CustomSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  items: { label: string; value: string }[];
  label: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onValueChange,
  placeholder,
  items,
  label,
}) => {
  return (
    <View className="w-full">
      <Text className="text-white mb-2">{label}</Text>
      <View className="border border-gray-300 rounded-lg bg-white">
        <Picker
          selectedValue={value}
          onValueChange={(itemValue) => onValueChange(itemValue)}
          style={{ color: "black" }}
        >
          <Picker.Item label={placeholder} value="" />
          {items.map((item, index) => (
            <Picker.Item key={index} label={item.label} value={item.value} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

export default CustomSelect;
