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
import {
  Modal as PaperModal,
  Button as PaperButton,
  Portal,
  Provider,
} from "react-native-paper";

const dummyData = {
  totalBudget: "$5,000",
  budgetCategories: [
    { id: 1, category: "Groceries", budgeted: 500 },
    { id: 2, category: "Rent", budgeted: 1200 },
    { id: 3, category: "Utilities", budgeted: 200 },
    { id: 4, category: "Dining", budgeted: 300 },
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

const Budget = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { control, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    // Handle form submission
    reset();
    setModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <View className="bg-[#1E2A3B] rounded-lg p-5 mb-5">
      <View className="flex-row justify-between items-center">
        <Text className="text-white text-lg font-bold">{item.category}</Text>
        <Text className="text-white text-lg font-bold">${item.budgeted}</Text>
      </View>
    </View>
  );

  const totalBudgetAmount = dummyData.budgetCategories.reduce(
    (sum, category) => sum + category.budgeted,
    0
  );

  const pieChartData = dummyData.budgetCategories.map((category, index) => ({
    name: category.category,
    amount: category.budgeted,
    color: predefinedColors[index % predefinedColors.length],
    legendFontColor: "#FFF",
    legendFontSize: 15,
    percentage:
      ((category.budgeted / totalBudgetAmount) * 100).toFixed(2) + "%",
  }));

  return (
    <>
      <SafeAreaView className="flex-1 bg-[#161E2B]">
        <View className="flex-row justify-between items-center p-5">
          <Text className="text-white text-2xl font-bold">Budget</Text>
        </View>
        <View className="bg-[#1E2A3B] rounded-lg p-5 mb-5 mx-5">
          <Text className="text-white text-lg mb-2">Total Budget</Text>
          <Text className="text-white text-4xl font-bold">
            {dummyData.totalBudget}
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
        <FlatList
          data={dummyData.budgetCategories}
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
              <Text className="text-white text-lg mb-5">
                Add Budget Category
              </Text>
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
                name="budgeted"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Budgeted Amount"
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

export default Budget;
