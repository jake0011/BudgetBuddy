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
import { addIncome, getIncome } from "@/services/incomeService";
import { useAuthStore } from "@/stores/auth";
import { useDateStore } from "@/stores/date";
import CustomModal from "@/components/global/CustomModal";
import Toast from "react-native-toast-message";

const screenWidth = Dimensions.get("window").width;

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

const incomeSchema = z.object({
  source: z.string().min(1, "Source is required"),
  amount: z.number().min(0.01, "Amount must be a number"),
});

const Income = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setloading] = useState(false);
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
  const user = useAuthStore((state) => state.user);
  const tabDate = useDateStore((state) => state.tabDate);

  const fetcher = useCallback(async () => {
    return await getIncome(user?.userId, tabDate.month, tabDate.year);
  }, [user?.userId, tabDate.month, tabDate.year]);

  const { data, error, isLoading, mutate } = useSWR(`/income/data`, fetcher);

  const onSubmit = async (data: any) => {
    setloading(true);
    try {
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
      setloading(false);
      reset();
      setModalVisible(false);
      mutate();
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View className="bg-[#1E2A3B] rounded-lg p-5 mb-5 flex-row justify-between items-center">
      <View>
        <Text className="text-white text-lg font-bold">{item.source}</Text>
      </View>
      <Text className="text-white text-lg font-bold">${item.amount}</Text>
    </View>
  );

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

  const totalIncome = useMemo(() => {
    return data?.reduce((sum: number, item: any) => sum + item.amount, 0) || 0;
  }, [data]);

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
        <View className="bg-[#1E2A3B] rounded-lg p-5 mt-5 mx-5">
          <Text className="text-white text-lg mb-2">Total Income</Text>
          <Text className="text-white text-4xl font-bold">
            ${totalIncome.toFixed(2)}
          </Text>
        </View>
        {data && data.length > 0 ? (
          <>
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
            <FlatList
              data={data}
              renderItem={({ item }) => renderItem({ item })}
              keyExtractor={(item: any) => item.incomesId.toString()}
              contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
            />
          </>
        ) : (
          <View className="h-[50%] flex items-center justify-center">
            <Text className="text-white text-2xl font-bold text-center mt-5">
              No income for this month
            </Text>
          </View>
        )}

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="absolute bottom-32 right-10 bg-blue-500 p-4 rounded-full shadow-lg"
        >
          <Plus color="white" size={28} />
        </TouchableOpacity>

        <CustomModal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          title="Add Income Source"
          control={control}
          errors={errors}
          inputs={[
            {
              name: "source",
              placeholder: "Source Name",
              keyboardType: "ascii-capable",
            },
            { name: "amount", placeholder: "Amount", keyboardType: "numeric" },
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

export default Income;
