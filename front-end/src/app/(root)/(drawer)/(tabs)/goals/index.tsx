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
import {
  getGoals,
  addGoal,
  updateGoal,
  deleteGoals,
} from "@/services/goalsService";
import useSWR from "swr";
import CustomModal from "@/components/global/CustomModal";
import Toast from "react-native-toast-message";
import CustomAlert from "@/components/global/CustomAlert";

const Goals = () => {
  // State variables for modal visibility, alert visibility, loading state, current goal, and goal to delete
  const [modalVisible, setModalVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentGoal, setCurrentGoal] = useState(null);
  const [goalToDelete, setGoalToDelete] = useState(null);

  // Initialize form handling using react-hook-form
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

  // Get user information from the auth store
  const user = useAuthStore((state) => state.user);

  // Function to fetch goals data based on user ID
  const fetcher = useCallback(async () => {
    return await getGoals(user?.userId);
  }, [user?.userId]);

  // Use SWR to fetch data and handle loading and error states
  const {
    data: goalsData,
    error,
    isLoading,
    mutate,
  } = useSWR(`/goals/data`, fetcher);

  // Function to handle modal dismissal
  const handleModalDismiss = () => {
    setModalVisible(false);
    reset({
      title: null,
      amount: null,
    });
    setCurrentGoal(null);
  };

  // Function to handle editing a goal
  const handleEdit = (goal) => {
    setCurrentGoal(goal);
    setModalVisible(true);
    reset({
      title: goal.title,
      amount: goal.amount,
    });
  };

  // Function to handle form submission for adding or updating a goal
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (currentGoal) {
        // Update existing goal
        const response = await updateGoal(
          user?.userId,
          currentGoal.goalsId,
          data.title,
          data.amount
        );
        Toast.show({
          type: "success",
          text1: response,
          text1Style: {
            color: "green",
            fontSize: 16,
            textAlign: "center",
          },
        });
      } else {
        // Add new goal
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
      }
      mutate();
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
      handleModalDismiss();
    }
  };

  // Function to handle deleting a goal
  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await deleteGoals(user?.userId, goalToDelete.goalsId);
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
      setAlertVisible(false);
      setGoalToDelete(null);
      mutate();
    }
  };

  // Function to handle delete button press
  const handleDeletePress = (goal) => {
    setGoalToDelete(goal);
    setAlertVisible(true);
  };

  // Function to render each goal item
  const renderItem = ({ item }) => {
    const progress = item.percentageToGoal / 100;
    return (
      <TouchableOpacity onPress={() => handleEdit(item)}>
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
          <View className="flex-row justify-between items-center mt-1">
            <Text className="text-[#3498db] text-base">
              {(progress * 100).toFixed(1)}%
            </Text>
            <View className="flex-row gap-2">
              <TouchableOpacity onPress={() => handleEdit(item)}>
                <Text className="text-blue-500">Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeletePress(item)}>
                <Text className="text-red-500">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // If there's an error, display an error message
  if (error)
    return (
      <SafeAreaView className="flex bg-[#161E2B] h-screen justify-center items-center">
        <Text className="text-white text-center">Failed to load data</Text>
      </SafeAreaView>
    );

  // If data is loading, display a loading spinner
  if (isLoading)
    return (
      <SafeAreaView className="flex bg-[#161E2B] h-screen justify-center items-center">
        <Spinner size="large" color="white" />
      </SafeAreaView>
    );

  // Main render of the goals screen
  return (
    <>
      <SafeAreaView className="flex-1 bg-[#161E2B]">
        {/* Container for total goals display */}
        <View
          className="bg-[#1E2A3B] rounded-lg p-5 mx-5"
          style={{
            marginVertical: 20,
          }}
        >
          <Text className="text-white text-lg mb-2">Total Goals</Text>
          <Text className="text-white text-4xl font-bold">
            {goalsData.length}
          </Text>
        </View>
        {/* Container for goals achieved display */}
        <View className="bg-[#1E2A3B] rounded-lg p-5 mb-5 mx-5">
          <Text className="text-white text-lg mb-2">Goals Achieved</Text>
          <Text className="text-white text-4xl font-bold">
            {goalsData.filter((goal) => goal.isGoalReached).length}
          </Text>
        </View>
        {/* List of goals */}
        <FlatList
          data={goalsData}
          renderItem={renderItem}
          keyExtractor={(item) => item.goalsId.toString()}
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        />
        {/* Button to add a new goal */}
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="absolute bottom-32 right-10 bg-blue-500 p-4 rounded-full shadow-lg"
        >
          <Plus color="white" size={28} />
        </TouchableOpacity>
        {/* Modal for adding or updating a goal */}
        <CustomModal
          visible={modalVisible}
          onDismiss={handleModalDismiss}
          title={currentGoal ? "Update Goal" : "Add Goal"}
          control={control}
          errors={errors}
          reset={reset}
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
              onPress: handleModalDismiss,
            },
          ]}
          loading={loading}
        />
        {/* Alert for confirming goal deletion */}
        <CustomAlert
          visible={alertVisible}
          onDismiss={() => setAlertVisible(false)}
          onConfirm={handleDelete}
          message="Are you sure you want to delete this goal?"
          loading={loading}
        />
      </SafeAreaView>
    </>
  );
};

export default Goals;
