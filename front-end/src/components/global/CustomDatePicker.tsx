import React, { useState } from "react";
import { View, TouchableOpacity, Modal, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { MaterialIcons } from "@expo/vector-icons";

interface CustomDatePickerProps {
  onDateChange: (date: Date) => void;
  showTimePicker: boolean;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  onDateChange,
  showTimePicker,
}) => {
  const [show, setShow] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const handleConfirm = () => {
    const selectedDate = new Date(selectedYear, selectedMonth, 1);
    setShow(false);
    onDateChange(selectedDate);
  };

  return (
    <>
      <TouchableOpacity onPress={() => setShow(true)}>
        <MaterialIcons
          name="calendar-month"
          size={24}
          color="white"
          className="mr-5"
        />
      </TouchableOpacity>
      <Text className="text-white mr-2">{`${
        selectedMonth + 1
      }/${selectedYear}`}</Text>
      <Modal visible={show} transparent={true} animationType="slide">
        <View
          className="flex-1 justify-center items-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <View className="bg-white rounded-lg p-5 w-4/5">
            <View className="mb-4">
              <Text className="text-lg font-bold mb-2">Month</Text>
              <View className="border border-gray-300 rounded-lg">
                <Picker
                  selectedValue={selectedMonth}
                  onValueChange={(itemValue) => setSelectedMonth(itemValue)}
                  className="w-full"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <Picker.Item key={i} label={`${i + 1}`} value={i} />
                  ))}
                </Picker>
              </View>
            </View>
            <View className="mb-4">
              <Text className="text-lg font-bold mb-2">Year</Text>
              <View className="border border-gray-300 rounded-lg">
                <Picker
                  selectedValue={selectedYear}
                  onValueChange={(itemValue) => setSelectedYear(itemValue)}
                  className="w-full"
                >
                  {Array.from({ length: 101 }, (_, i) => (
                    <Picker.Item
                      key={i}
                      label={`${2000 + i}`}
                      value={2000 + i}
                    />
                  ))}
                </Picker>
              </View>
            </View>
            <TouchableOpacity
              onPress={handleConfirm}
              className="mt-4 bg-gray-800 p-3 rounded-lg items-center"
            >
              <Text className="text-white font-bold">Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default CustomDatePicker;
