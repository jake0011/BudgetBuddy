import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Input, Button as TamaguiButton } from "tamagui";
import { Plus } from "@tamagui/lucide-icons";
import { PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import {
  Modal as PaperModal,
  Button as PaperButton,
  Portal,
  Provider,
} from "react-native-paper";

const dummyData = {
  totalIncome: "$3,200",
  incomeSources: [
    {
      id: 1,
      name: "Salary",
      amount: 2000,
      date: "1st of every month",
      recurrence: "Monthly",
    },
    {
      id: 2,
      name: "Freelance",
      amount: 1000,
      date: "15th of every month",
      recurrence: "Monthly",
    },
    {
      id: 3,
      name: "Investments",
      amount: 200,
      date: "20th of every month",
      recurrence: "Monthly",
    },
  ],
};

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

  const onSubmit = (data) => {
    console.log(data);
    // Handle form submission
    reset();
    setModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <View className="bg-[#1E2A3B] rounded-lg p-5 mb-5 flex-row justify-between items-center">
      <View>
        <Text className="text-white text-lg font-bold">{item.name}</Text>
        <Text className="text-gray-400">Amount: ${item.amount}</Text>
        <Text className="text-gray-400">Date: {item.date}</Text>
        <Text className="text-gray-400">Recurrence: {item.recurrence}</Text>
      </View>
      <Text className="text-white text-lg font-bold">${item.amount}</Text>
    </View>
  );

  const data = [
    { id: "header", type: "header" },
    ...dummyData.incomeSources.map((source) => ({
      ...source,
      type: "incomeSource",
    })),
  ];

  const pieChartData = dummyData.incomeSources.map((source, index) => ({
    name: source.name,
    amount: source.amount,
    color: predefinedColors[index % predefinedColors.length],
    legendFontColor: "#FFF",
    legendFontSize: 15,
  }));

  return (
    <>
      <SafeAreaView className="flex-1 bg-[#161E2B]">
        <FlatList
          data={data}
          renderItem={({ item }) => {
            if (item.type === "header") {
              return (
                <View className="mb-5">
                  <View className="bg-[#1E2A3B] rounded-lg p-5 mb-5">
                    <Text className="text-white text-lg mb-2">
                      Total Income
                    </Text>
                    <Text className="text-white text-4xl font-bold">
                      {dummyData.totalIncome}
                    </Text>
                  </View>
                  <PieChart
                    data={pieChartData}
                    width={screenWidth - 40}
                    height={220}
                    chartConfig={{
                      backgroundColor: "#1E2A3B",
                      backgroundGradientFrom: "#1E2A3B",
                      backgroundGradientTo: "#1E2A3B",
                      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                      labelColor: (opacity = 1) =>
                        `rgba(255, 255, 255, ${opacity})`,
                    }}
                    accessor={"amount"}
                    backgroundColor={"transparent"}
                    paddingLeft={"15"}
                    absolute
                  />
                  <View className="border-b border-gray-600 mb-5" />
                </View>
              );
            }
            return renderItem({ item });
          }}
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
              <Text className="text-white text-lg mb-5">Add Income Source</Text>
              <Controller
                control={control}
                name="name"
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
                name="date"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Date Received"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    className="bg-gray-700 text-white mb-4 p-2 rounded-lg"
                  />
                )}
              />
              <Controller
                control={control}
                name="recurrence"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Recurrence"
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
