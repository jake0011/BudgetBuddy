import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Portal, Modal as PaperModal, TextInput } from "react-native-paper";
import { Controller } from "react-hook-form";
import { Spinner } from "tamagui";
import CustomSelect from "@/components/global/CustomSelect";

interface InputProps {
  name: string;
  placeholder: string;
  keyboardType?: "numeric" | "ascii-capable";
}

interface SelectProps {
  name: string;
  placeholder: string;
  items: { label: string; value: any }[];
  label: string;
  dependentOn?: string;
  dependentItems?: { [key: string]: { label: string; value: any }[] };
  watch?: any; // Add watch as an optional prop
}

interface ButtonProps {
  label: string;
  color: string;
  onPress?: () => void;
  loading?: boolean;
}

interface CustomModalProps {
  visible: boolean;
  onDismiss: () => void;
  title: string;
  control: any;
  errors: any;
  inputs: InputProps[];
  selects?: SelectProps[];
  buttons: ButtonProps[];
  loading: boolean;
}

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
}) => {
  return (
    <Portal>
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
          <Text className="text-white text-center text-2xl font-bold mb-5">
            {title}
          </Text>
          {inputs.map((input, index) => (
            <Controller
              key={index}
              control={control}
              name={input.name}
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
                  {errors[input.name] && (
                    <Text className="text-red-500">
                      {errors[input.name]?.message?.toString()}
                    </Text>
                  )}
                </View>
              )}
            />
          ))}
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
          <View className="flex-row justify-between">
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                onPress={button.onPress}
                disabled={loading}
                className={`bg-${button.color}-500 flex flex-row gap-2 justify-center items-center text-white p-4 rounded-lg mb-4 flex-1 mx-1`}
              >
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

export default CustomModal;
