import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useForm } from "react-hook-form";
import { Spinner } from "tamagui";
import { Plus } from "@tamagui/lucide-icons";
import { ProgressBar } from "react-native-paper";
import { useAuthStore } from "@/stores/auth";
import { getGoals, addGoal } from "@/services/goalsService";
import useSWR from "swr";
import CustomModal from "@/components/global/CustomModal";
import Toast from "react-native-toast-message";

const Goals = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      amount: "",
    },
  });
  const user = useAuthStore((state) => state.user);

  const fetcher = useCallback(async () => {
    return await getGoals(user?.userId);
  }, [user?.userId]);

  const {
    data: goalsData,
    error,
    isLoading,
    mutate,
  } = useSWR(`/goals/data`, fetcher);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await addGoal(user?.userId, data.title, data.amount);
      Toast.show({
        type: "success",
        text1: response,
        text1Style: {
          color: "green",
          fontSize: 16,
          textAlign: "center",
        },
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: error.response?.data?.error || error.message,
        text1Style: {
          color: "red",
          fontSize: 16,
          textAlign: "center",
        },
      });
    } finally {
      setLoading(false);
      reset();
      setModalVisible(false);
      mutate();
    }
  };

  const renderItem = ({ item }) => {
    const progress = item.percentageToGoal / 100;
    return (
      <View className="bg-[#1E2A3B] rounded-lg p-5 mb-5">
        <View className="flex-row justify-between items-center">
          <Text className="text-white text-lg font-bold">{item.title}</Text>
          <Text className="text-white text-lg font-bold">
            GHS {item.amount * progress} / GHS {item.amount}
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
        <CustomModal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          title="Add Goal"
          control={control}
          errors={errors}
          inputs={[
            {
              name: "title",
              placeholder: "Goal Title",
              keyboardType: "ascii-capable",
            },
            {
              name: "amount",
              placeholder: "Target Amount",
              keyboardType: "numeric",
            },
          ]}
          buttons={[
            { label: "Save", color: "blue", onPress: handleSubmit(onSubmit) },
            {
              label: "Cancel",
              color: "red",
              onPress: () => setModalVisible(false),
            },
          ]}
          loading={loading}
        />
      </SafeAreaView>
    </>
  );
};

export default Goals;
