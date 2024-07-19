import React, { useState, useCallback, useMemo } from "react";
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
import { PieChart } from "react-native-chart-kit";
import {
  Modal as PaperModal,
  Button as PaperButton,
  Portal,
} from "react-native-paper";
import useSWR from "swr";
import { getIncome } from "@/services/incomeService";
import { useAuthStore } from "@/stores/auth";

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

const Income = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { control, handleSubmit, reset } = useForm();
  const user = useAuthStore((state) => state.user);

  const fetcher = useCallback(async () => {
    return await getIncome(user?.userId);
  }, [user?.userId]);

  const { data, error, isLoading } = useSWR(`/income/data`, fetcher);

  const onSubmit = (data) => {
    console.log(data);
    reset();
    setModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <View className="bg-[#1E2A3B] rounded-lg p-5 mb-5 flex-row justify-between items-center">
      <View>
        <Text className="text-white text-lg font-bold">{item.source}</Text>
      </View>
      <Text className="text-white text-lg font-bold">${item.amount}</Text>
    </View>
  );

  const pieChartData = useMemo(() => {
    return (
      data?.map((source, index) => ({
        name: source.source,
        amount: source.amount,
        color: predefinedColors[index % predefinedColors.length],
        legendFontColor: "#FFF",
        legendFontSize: 15,
      })) || []
    );
  }, [data]);

  const totalIncome = useMemo(() => {
    return data?.reduce((sum, item) => sum + item.amount, 0) || 0;
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
              keyExtractor={(item) => item.incomesId.toString()}
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
              <Text className="text-white text-lg mb-5">Add Income Source</Text>
              <Controller
                control={control}
                name="source"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Source Name"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    className="bg-gray-700 text-white mb-4 p-2 rounded-lg"
                  />
                )}
              />
              <Controller
                control={control}
                name="amount"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Amount"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    className="bg-gray-700 text-white mb-4 p-2 rounded-lg"
                  />
                )}
              />
              <Controller
                control={control}
                name="monthOfTheYear"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Month"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    className="bg-gray-700 text-white mb-4 p-2 rounded-lg"
                  />
                )}
              />
              <Controller
                control={control}
                name="year"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Year"
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

export default Income;
