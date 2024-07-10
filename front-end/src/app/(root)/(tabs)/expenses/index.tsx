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
import { PieChart } from "react-native-chart-kit";
import { BlurView } from "expo-blur";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { Text as SvgText } from "react-native-svg";

const dummyData = {
  totalExpenses: "$1,500",
  expenses: [
    {
      id: 1,
      category: "Groceries",
      amount: 150.25,
      date: "2023-10-01",
      recurrence: "One-time",
    },
    {
      id: 2,
      category: "Rent",
      amount: 600,
      date: "2023-10-01",
      recurrence: "Monthly",
    },
    {
      id: 3,
      category: "Utilities",
      amount: 100,
      date: "2023-10-05",
      recurrence: "Monthly",
    },
    {
      id: 4,
      category: "Dining",
      amount: 50,
      date: "2023-10-10",
      recurrence: "One-time",
    },
    {
      id: 5,
      category: "Resting",
      amount: 50,
      date: "2023-10-10",
      recurrence: "One-time",
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
];

const Expenses = () => {
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
        <Text className="text-white text-lg font-bold">{item.category}</Text>
        <Text className="text-gray-400">Amount: ${item.amount}</Text>
        <Text className="text-gray-400">Date: {item.date}</Text>
        <Text className="text-gray-400">Recurrence: {item.recurrence}</Text>
      </View>
      <Text className="text-white text-lg font-bold">${item.amount}</Text>
    </View>
  );

  const totalExpensesAmount = dummyData.expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const pieChartData = dummyData.expenses.map((expense, index) => ({
    name: expense.category,
    amount: expense.amount,
    color: predefinedColors[index % predefinedColors.length],
    legendFontColor: "#FFF",
    legendFontSize: 15,
    percentage: ((expense.amount / totalExpensesAmount) * 100).toFixed(2) + "%",
  }));

  const renderLabel = ({ slices }) => {
    return slices.map((slice, index) => {
      const { pieCentroid, data } = slice;
      return (
        <SvgText
          key={`label-${index}`}
          x={pieCentroid[0]}
          y={pieCentroid[1]}
          fill="white"
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize={15}
        >
          {data.percentage}
        </SvgText>
      );
    });
  };

  const generateScenes = (expenses) => {
    const categories = [
      ...new Set(expenses.map((expense) => expense.category)),
    ];
    const scenes = {};
    categories.forEach((category: string) => {
      scenes[category.toLowerCase()] = () => (
        <FlatList
          data={expenses.filter((expense) => expense.category === category)}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        />
      );
    });

    return scenes;
  };

  const renderScene = SceneMap(generateScenes(dummyData.expenses));

  const [index, setIndex] = useState(0);
  const categories = [
    ...new Set(dummyData.expenses.map((expense) => expense.category)),
  ];
  const [routes] = useState(
    categories.map((category) => ({
      key: category.toLowerCase(),
      title: category,
    }))
  );

  return (
    <SafeAreaView className="flex-1 bg-[#161E2B]">
      <View className="flex-row justify-between items-center p-5">
        <Text className="text-white text-2xl font-bold">Expenses</Text>
      </View>
      <View className="bg-[#1E2A3B] rounded-lg p-5 mb-5 mx-5">
        <Text className="text-white text-lg mb-2">Total Expenses</Text>
        <Text className="text-white text-4xl font-bold">
          {dummyData.totalExpenses}
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
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          decimalPlaces: 2,
        }}
        accessor={"amount"}
        backgroundColor={"transparent"}
        paddingLeft={"15"}
        absolute
        hasLegend={true}
        center={[0, 0]}
      />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: screenWidth }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{
              backgroundColor: "white",
              height: 3, // Adjust the height of the indicator
            }}
            style={{ backgroundColor: "#1E2A3B" }}
            labelStyle={{ color: "white" }}
            scrollEnabled={true} // Enable horizontal scrolling
            tabStyle={{ width: 120 }} // Fixed width for each tab
            contentContainerStyle={{ flexGrow: 1 }}
          />
        )}
      />
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="absolute bottom-32 right-10 bg-blue-500 p-4 rounded-full shadow-lg"
      >
        <Plus color="white" size={28} />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <BlurView intensity={50} className="flex-1 justify-center items-center">
          <View className="bg-[#1E2A3B] flex gap-4 rounded-lg p-5 w-11/12">
            <Text className="text-white text-lg mb-5">Add Expense</Text>
            <Controller
              control={control}
              name="category"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Category"
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
                  placeholder="Date"
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
            <TamaguiButton
              onPress={handleSubmit(onSubmit)}
              className="bg-blue-500 text-white p-2 rounded-lg mb-4"
            >
              Save
            </TamaguiButton>
            <TamaguiButton
              onPress={() => setModalVisible(false)}
              className="bg-red-500 text-white p-2 rounded-lg"
            >
              Cancel
            </TamaguiButton>
          </View>
        </BlurView>
      </Modal>
    </SafeAreaView>
  );
};

export default Expenses;
