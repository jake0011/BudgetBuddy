import React from "react"; // Importing React library
import { View, Text, TouchableOpacity } from "react-native"; // Importing components from react-native
import { Picker } from "@react-native-picker/picker"; // Importing Picker component
import { MaterialIcons } from "@expo/vector-icons"; // Importing icons from expo vector icons

// Defining the props for the CustomSelect component
interface CustomSelectProps {
  value: string; // Selected value
  onValueChange: (value: string) => void; // Function to call when the value changes
  placeholder: string; // Placeholder text
  items: { label: string; value: string }[]; // List of items to display in the picker
  label: string; // Label for the picker
}

// CustomSelect component definition
const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onValueChange,
  placeholder,
  items,
  label,
}) => {
  return (
    <View className="w-full">
      {/* Label for the picker */}
      <Text className="text-white mb-2">{label}</Text>
      {/* Picker component wrapped in a styled view */}
      <View className="border border-gray-300 rounded-lg bg-white">
        <Picker
          selectedValue={value}
          onValueChange={(itemValue) => onValueChange(itemValue)}
          style={{ color: "black" }}
        >
          {/* Placeholder item */}
          <Picker.Item label={placeholder} value="" />
          {/* Mapping items to Picker.Item components */}
          {items.map((item, index) => (
            <Picker.Item key={index} label={item.label} value={item.value} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

export default CustomSelect; // Exporting the CustomSelect component as default
