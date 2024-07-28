import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Spinner } from "tamagui";
import { Plus } from "@tamagui/lucide-icons";
import { PieChart } from "react-native-chart-kit";
import useSWR from "swr";
import {
  addIncome,
  getIncome,
  updateIncome,
  deleteIncome,
} from "@/services/incomeService";
import { useAuthStore } from "@/stores/auth";
import { useDateStore } from "@/stores/date";
import CustomModal from "@/components/global/CustomModal";
import CustomAlert from "@/components/global/CustomAlert";
import Toast from "react-native-toast-message";

// Get the screen width of the device
const screenWidth = Dimensions.get("window").width;

// Predefined colors for the pie chart
const predefinedColors = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
  "#FF5733",
  "#33FF57",
  "#3357FF",
  "#FF33A1",
  "#A133FF",
  "#33FFF5",
  "#F5FF33",
  "#FF8C33",
  "#33FF8C",
];

// Schema for form validation using Zod
const incomeSchema = z.object({
  source: z.string().min(1, "Source is required"),
  amount: z.number().min(0.01, "Amount must be a number"),
});

const Income = () => {
  // State variables for modal visibility, loading state, and current income
  const [modalVisible, setModalVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentIncome, setCurrentIncome] = useState(null);
  const [incomeToDelete, setIncomeToDelete] = useState(null);

  // Get user and date information from stores
  const user = useAuthStore((state) => state.user);
  const tabDate = useDateStore((state) => state.tabDate);

  // Function to fetch income data based on user ID and date
  const fetcher = useCallback(async () => {
    return await getIncome(user?.userId, tabDate.month, tabDate.year);
  }, [user?.userId, tabDate.month, tabDate.year]);

  // Use SWR to fetch data and handle loading and error states
  const { data, error, isLoading, mutate } = useSWR(`/income/data`, fetcher);

  // Initialize form handling using react-hook-form and Zod for validation
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      source: "",
      amount: "",
    },
  });

  // Function to handle form submission for adding or updating income
  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (currentIncome) {
        // Update existing income
        const response = await updateIncome(
          user?.userId,
          currentIncome.incomesId,
          data.amount,
          data.source,
          tabDate.month,
          tabDate.year
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
        // Add new income
        const response = await addIncome(
          user?.userId,
          tabDate.month,
          tabDate.year,
          data.amount,
          data.source
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
      }
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
      setCurrentIncome(null);
      mutate();
    }
  };

  // Function to handle editing an income entry
  const handleEdit = (income: any) => {
    setCurrentIncome(income);
    setModalVisible(true);
    reset({
      source: income.source,
      amount: income.amount,
    });
  };

  // Function to handle dismissing the modal
  const handleModalDismiss = () => {
    setModalVisible(false);
    setCurrentIncome(null);
    reset({
      source: "",
      amount: "",
    });
  };

  // Function to handle deleting an income entry
  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await deleteIncome(
        user?.userId,
        incomeToDelete.incomesId
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
      setIncomeToDelete(null);
      mutate();
    }
  };

  // Function to handle pressing the delete button
  const handleDeletePress = (income: any) => {
    setIncomeToDelete(income);
    setAlertVisible(true);
  };

  // Function to render each income item in the list
  const renderItem = ({ item }: { item: any }) => (
    <View className="bg-[#1E2A3B] rounded-lg p-5 mb-5 flex-row justify-between items-center">
      <View>
        <Text className="text-white text-lg font-bold">{item.source}</Text>
      </View>
      <Text className="text-white text-lg font-bold">GHS {item.amount}</Text>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <TouchableOpacity onPress={() => handleEdit(item)}>
          <Text className="text-blue-500">Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeletePress(item)}>
          <Text className="text-red-500">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Memoized data for the pie chart
  const pieChartData = useMemo(() => {
    return (
      data?.map((source: any, index: number) => ({
        name: source.source,
        amount: source.amount,
        color: predefinedColors[index % predefinedColors.length],
        legendFontColor: "#FFF",
        legendFontSize: 15,
      })) || []
    );
  }, [data]);

  // Memoized calculation of total income
  const totalIncome = useMemo(() => {
    return data?.reduce((sum: number, item: any) => sum + item.amount, 0) || 0;
  }, [data]);

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

  // Main render of the income screen
  return (
    <>
      <SafeAreaView className="flex-1 bg-[#161E2B]">
        {/* Container for the total income display */}
        <View
          className="bg-[#1E2A3B] rounded-lg p-5 mx-5"
          style={{
            marginTop: 20,
          }}
        >
          <Text className="text-white text-lg mb-2">Total Income</Text>
          <Text className="text-white text-4xl font-bold">
            GHS {totalIncome.toFixed(2)}
          </Text>
        </View>
        {data && data.length > 0 ? (
          <>
            {/* Pie chart to display income distribution */}
            <PieChart
              data={pieChartData}
              width={screenWidth - 20}
              height={240}
              chartConfig={{
                backgroundColor: "#1E2A3B",
                backgroundGradientFrom: "#1E2A3B",
                backgroundGradientTo: "#1E2A3B",
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                decimalPlaces: 2,
              }}
              accessor={"amount"}
              backgroundColor={"transparent"}
              paddingLeft={"10"}
              absolute
              hasLegend={true}
              center={[0, 0]}
            />
            {/* List of income items */}
            <FlatList
              data={data}
              renderItem={({ item }) => renderItem({ item })}
              keyExtractor={(item: any) => item.incomesId.toString()}
              contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
            />
          </>
        ) : (
          // Display message if no income data is available
          <View className="h-[60vh] flex items-center justify-center">
            <Text className="text-white text-2xl font-bold text-center mt-5">
              No income for this month
            </Text>
          </View>
        )}

        {/* Button to add new income */}
        <TouchableOpacity
          onPress={() => {
            setCurrentIncome(null);
            setModalVisible(true);
          }}
          className="absolute bottom-32 right-10 bg-blue-500 p-4 rounded-full shadow-lg"
        >
          <Plus color="white" size={28} />
        </TouchableOpacity>

        {/* Modal for adding or updating income */}
        <CustomModal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          title={currentIncome ? "Update Income Source" : "Add Income Source"}
          control={control}
          errors={errors}
          reset={reset}
          inputs={[
            {
              name: "source",
              placeholder: "Source Name",
              keyboardType: "ascii-capable",
              defaultValue: currentIncome?.source,
            },
            {
              name: "amount",
              placeholder: "Amount",
              keyboardType: "numeric",
              defaultValue: currentIncome?.amount,
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
        {/* Alert for confirming income deletion */}
        <CustomAlert
          visible={alertVisible}
          onDismiss={() => setAlertVisible(false)}
          onConfirm={handleDelete}
          message="Are you sure you want to delete this income?"
          loading={loading}
        />
      </SafeAreaView>
    </>
  );
};

export default Income;
