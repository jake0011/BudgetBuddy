import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Modal,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Input, Button as TamaguiButton } from "tamagui";
import { Plus } from "@tamagui/lucide-icons";
import { BlurView } from "expo-blur";
import { ProgressBar } from "react-native-paper";
import {
  Modal as PaperModal,
  Button as PaperButton,
  Portal,
  Provider,
} from "react-native-paper";

const dummyData = {
  totalGoals: 5,
  goalsAchieved: 2,
  goals: [
    {
      id: 1,
      name: "Vacation",
      target: 2000,
      saved: 1500,
    },
    {
      id: 2,
      name: "New Car",
      target: 10000,
      saved: 3000,
    },
  ],
};

const screenWidth = Dimensions.get("window").width;

const Goals = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { control, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    // Handle form submission
    reset();
    setModalVisible(false);
  };

  const renderItem = ({ item }) => {
    const progress = item.saved / item.target;
    return (
      <View className="bg-[#1E2A3B] rounded-lg p-5 mb-5">
        <View className="flex-row justify-between items-center">
          <Text className="text-white text-lg font-bold">{item.name}</Text>
          <Text className="text-white text-lg font-bold">
            ${item.saved} / ${item.target}
          </Text>
        </View>
        <ProgressBar
          progress={progress}
          color="#36A2EB"
          style={{ marginTop: 10 }}
        />
        <Text className="text-[#3498db] text-base mt-1">{progress * 100}%</Text>
      </View>
    );
  };

  return (
    <>
      <SafeAreaView className="flex-1 bg-[#161E2B]">
        <View className="flex-row justify-between items-center p-5">
          <Text className="text-white text-2xl font-bold">Goals</Text>
        </View>
        <View className="bg-[#1E2A3B] rounded-lg p-5 mb-5 mx-5">
          <Text className="text-white text-lg mb-2">Total Goals</Text>
          <Text className="text-white text-4xl font-bold">
            {dummyData.totalGoals}
          </Text>
        </View>
        <View className="bg-[#1E2A3B] rounded-lg p-5 mb-5 mx-5">
          <Text className="text-white text-lg mb-2">Goals Achieved</Text>
          <Text className="text-white text-4xl font-bold">
            {dummyData.goalsAchieved}
          </Text>
        </View>
        <FlatList
          data={dummyData.goals}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        />
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="absolute bottom-32 right-10 bg-blue-500 p-4 rounded-full shadow-lg"
        >
          <Plus color="white" size={28} />
        </TouchableOpacity>
        <Portal>
          <PaperModal
            visible={modalVisible}
            onDismiss={() => setModalVisible(false)}
            contentContainerStyle={{
              backgroundColor: "#1E2A3B",
              padding: 20,
              margin: 20,
              borderRadius: 10,
            }}
          >
            <View className="flex gap-4 rounded-lg p-5 w-11/12">
              <Text className="text-white text-lg mb-5">Add Goal</Text>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Goal Name"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    className="bg-gray-700 text-white mb-4 p-2 rounded-lg"
                  />
                )}
              />
              <Controller
                control={control}
                name="target"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Target Amount"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    className="bg-gray-700 text-white mb-4 p-2 rounded-lg"
                  />
                )}
              />
              <Controller
                control={control}
                name="saved"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Current Amount Saved"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    className="bg-gray-700 text-white mb-4 p-2 rounded-lg"
                  />
                )}
              />
              <Controller
                control={control}
                name="deadline"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Deadline"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    className="bg-gray-700 text-white mb-4 p-2 rounded-lg"
                  />
                )}
              />
              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Description (optional)"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    className="bg-gray-700 text-white mb-4 p-2 rounded-lg"
                  />
                )}
              />
              <PaperButton
                mode="contained"
                onPress={handleSubmit(onSubmit)}
                className="bg-blue-500 text-white p-2 rounded-lg mb-4"
              >
                Save
              </PaperButton>
              <PaperButton
                mode="contained"
                onPress={() => setModalVisible(false)}
                className="bg-red-500 text-white p-2 rounded-lg"
              >
                Cancel
              </PaperButton>
            </View>
          </PaperModal>
        </Portal>
      </SafeAreaView>
    </>
  );
};

export default Goals;
