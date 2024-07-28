import React, { useState } from "react"; // Importing React library and useState hook
import { View, TouchableOpacity, Modal, Text } from "react-native"; // Importing components from react-native
import { Picker } from "@react-native-picker/picker"; // Importing Picker component
import { MaterialIcons } from "@expo/vector-icons"; // Importing icons from expo vector icons

// Defining the props for the CustomDatePicker component
interface CustomDatePickerProps {
  onDateChange: (date: Date) => void; // Function to call when the date changes
  showTimePicker: boolean; // Whether to show the time picker
}

// CustomDatePicker component definition
const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  onDateChange,
  showTimePicker,
}) => {
  const [show, setShow] = useState(false); // State to manage the visibility of the modal
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // State to manage the selected month
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // State to manage the selected year

  // Function to handle the confirm button press
  const handleConfirm = () => {
    const selectedDate = new Date(selectedYear, selectedMonth, 1); // Create a new date with the selected year and month
    setShow(false); // Hide the modal
    onDateChange(selectedDate); // Call the onDateChange function with the selected date
  };

  return (
    <>
      {/* Button to open the date picker modal */}
      <TouchableOpacity onPress={() => setShow(true)}>
        <MaterialIcons
          name="calendar-month"
          size={24}
          color="white"
          className="mr-5"
        />
      </TouchableOpacity>
      {/* Displaying the selected month and year */}
      <Text className="text-white mr-2">{`${
        selectedMonth + 1
      }/${selectedYear}`}</Text>
      {/* Modal for the date picker */}
      <Modal visible={show} transparent={true} animationType="slide">
        <View
          className="flex-1 justify-center items-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <View className="bg-white rounded-lg p-5 w-4/5">
            {/* Picker for selecting the month */}
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
            {/* Picker for selecting the year */}
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
            {/* Confirm button */}
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

export default CustomDatePicker; // Exporting the CustomDatePicker component as default
