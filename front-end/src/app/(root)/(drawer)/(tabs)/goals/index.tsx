import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Input, Spinner } from "tamagui";
import { Plus } from "@tamagui/lucide-icons";
import { ProgressBar } from "react-native-paper";
import {
  Modal as PaperModal,
  Button as PaperButton,
  Portal,
} from "react-native-paper";
import { useAuthStore } from "@/stores/auth";
import { getGoals } from "@/services/goalsService";
import useSWR from "swr";

const screenWidth = Dimensions.get("window").width;

const Goals = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { control, handleSubmit, reset } = useForm();
  const user = useAuthStore((state) => state.user);

  const fetcher = useCallback(async () => {
    return await getGoals(user?.userId);
  }, [user?.userId]);

  const { data: goalsData, error, isLoading } = useSWR(`/goals/data`, fetcher);

  const onSubmit = (data) => {
    console.log(data);
    // Handle form submission
    reset();
    setModalVisible(false);
  };

  const renderItem = ({ item }) => {
    const progress = item.percentageToGoal / 100;
    return (
      <View className="bg-[#1E2A3B] rounded-lg p-5 mb-5">
        <View className="flex-row justify-between items-center">
          <Text className="text-white text-lg font-bold">{item.title}</Text>
          <Text className="text-white text-lg font-bold">
            ${item.amount * progress} / ${item.amount}
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

  if (error)
    return (
      <SafeAreaView className="flex bg-[#161E2B] h-screen justify-center items-center">
        <Text className="text-white text-center">Failed to load data</Text>
      </SafeAreaView>
    );

  if (isLoading)
    return (
      <SafeAreaView className="flex bg-[#161E2B] h-screen justify-center items-center">
        <Spinner size="large" color="white" />
      </SafeAreaView>
    );

  return (
    <>
      <SafeAreaView className="flex-1 bg-[#161E2B]">
        <View className="bg-[#1E2A3B] rounded-lg p-5 my-5 mx-5">
          <Text className="text-white text-lg mb-2">Total Goals</Text>
          <Text className="text-white text-4xl font-bold">
            {goalsData.length}
          </Text>
        </View>
        <View className="bg-[#1E2A3B] rounded-lg p-5 mb-5 mx-5">
          <Text className="text-white text-lg mb-2">Goals Achieved</Text>
          <Text className="text-white text-4xl font-bold">
            {goalsData.filter((goal) => goal.isGoalReached).length}
          </Text>
        </View>
        <FlatList
          data={goalsData}
          renderItem={renderItem}
          keyExtractor={(item) => item.goalsId.toString()}
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
