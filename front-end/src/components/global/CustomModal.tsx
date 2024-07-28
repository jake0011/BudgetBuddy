import React, { useEffect } from "react"; // Importing React library and useEffect hook
import { View, Text, TouchableOpacity } from "react-native"; // Importing components from react-native
import { Portal, Modal as PaperModal, TextInput } from "react-native-paper"; // Importing components from react-native-paper
import { Controller } from "react-hook-form"; // Importing Controller from react-hook-form
import { Spinner } from "tamagui"; // Importing Spinner component from tamagui
import CustomSelect from "@/components/global/CustomSelect"; // Importing CustomSelect component

// Defining the props for the input fields
interface InputProps {
  name: string; // Name of the input field
  placeholder: string; // Placeholder text
  keyboardType?: "numeric" | "ascii-capable"; // Keyboard type
  defaultValue?: any; // Default value
}

// Defining the props for the select fields
interface SelectProps {
  name: string; // Name of the select field
  placeholder: string; // Placeholder text
  items: { label: string; value: any }[]; // List of items to display in the picker
  label: string; // Label for the picker
  dependentOn?: string; // Name of the field this select is dependent on
  dependentItems?: { [key: string]: { label: string; value: any }[] }; // Dependent items based on the value of the dependent field
  watch?: any; // Function to watch the value of the dependent field
}

// Defining the props for the buttons
interface ButtonProps {
  label: string; // Button label
  color: string; // Button color
  onPress?: () => void; // Function to call when the button is pressed
  loading?: boolean; // Whether a loading spinner should be shown
}

// Defining the props for the CustomModal component
interface CustomModalProps {
  visible: boolean; // Whether the modal is visible
  onDismiss: () => void; // Function to call when the modal is dismissed
  title: string; // Title of the modal
  control: any; // Control object from react-hook-form
  reset: any; // Reset function from react-hook-form
  errors: any; // Errors object from react-hook-form
  inputs: InputProps[]; // List of input fields
  selects?: SelectProps[]; // List of select fields
  buttons: ButtonProps[]; // List of buttons
  loading: boolean; // Whether a loading spinner should be shown
}

// CustomModal component definition
const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onDismiss,
  title,
  control,
  errors,
  inputs,
  selects = [],
  buttons,
  loading = false,
  reset,
}) => {
  // Effect to reset form values when the modal is closed
  useEffect(() => {
    if (!visible) {
      const resetValues = inputs.reduce((acc, input) => {
        acc[input.name] = null;
        return acc;
      }, {});
      reset(resetValues);
    }
  }, [visible, reset]);

  return (
    <Portal>
      {/* Modal component from react-native-paper */}
      <PaperModal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={{
          backgroundColor: "#1E2A3B",
          padding: 20,
          margin: 20,
          borderRadius: 10,
        }}
      >
        <View className="flex gap-4 rounded-lg p-5 w-11/12">
          {/* Modal title */}
          <Text className="text-white text-center text-2xl font-bold mb-5">
            {title}
          </Text>
          {/* Mapping input fields to TextInput components */}
          {inputs.map((input, index) => (
            <Controller
              key={index}
              control={control}
              name={input.name}
              defaultValue={input.defaultValue || ""}
              render={({ field: { onChange, onBlur, value } }) => (
                <View className="w-full flex-col gap-2 justify-start">
                  <TextInput
                    keyboardType={input.keyboardType}
                    placeholder={input.placeholder}
                    onBlur={onBlur}
                    onChangeText={(text) =>
                      onChange(
                        input.keyboardType === "numeric" && text !== ""
                          ? parseFloat(text)
                          : text
                      )
                    }
                    value={
                      value !== undefined && value !== null
                        ? value.toString()
                        : ""
                    }
                    error={!!errors[input.name]}
                    outlineColor="gray"
                    style={{ height: 45 }}
                    activeOutlineColor="black"
                  />
                  {/* Displaying error message if any */}
                  {errors[input.name] && (
                    <Text className="text-red-500">
                      {errors[input.name]?.message?.toString()}
                    </Text>
                  )}
                </View>
              )}
            />
          ))}
          {/* Mapping select fields to CustomSelect components */}
          {selects.map((select, index) => {
            const dependentValue = select.dependentOn
              ? select.watch?.(select.dependentOn)
              : null;
            const items = dependentValue
              ? select.dependentItems?.[dependentValue] || []
              : select.items;

            if (select.dependentOn && !dependentValue) return null;
            if (select.name === "goal" && dependentValue !== "goals")
              return null; // Specific check for "goals"
            return (
              <Controller
                key={index}
                control={control}
                name={select.name}
                render={({ field: { onChange, value } }) => (
                  <View className="w-full flex-col gap-2 justify-start">
                    <CustomSelect
                      value={value}
                      onValueChange={onChange}
                      placeholder={select.placeholder}
                      items={items}
                      label={select.label}
                    />
                    {/* Displaying error message if any */}
                    {errors[select.name] && (
                      <Text className="text-red-500">
                        {errors[select.name]?.message?.toString()}
                      </Text>
                    )}
                  </View>
                )}
              />
            );
          })}
          {/* Mapping buttons to TouchableOpacity components */}
          <View className="flex-row justify-between">
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                onPress={button.onPress}
                disabled={loading}
                className={`bg-${button.color}-500 flex flex-row gap-2 justify-center items-center text-white p-4 rounded-lg mb-4 flex-1 mx-1`}
              >
                {/* Displaying loading spinner if loading */}
                {index === 0 && loading && (
                  <Spinner size="small" color="$white1" />
                )}
                <Text className="text-center text-white text-lg">
                  {button.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </PaperModal>
    </Portal>
  );
};

export default CustomModal; // Exporting the CustomModal component as default
