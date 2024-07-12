import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Input, Button as TamaguiButton } from "tamagui";
import { Plus } from "@tamagui/lucide-icons";
import { PieChart } from "react-native-chart-kit";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import {
  Modal as PaperModal,
  Button as PaperButton,
  Portal,
} from "react-native-paper";
import CustomSelect from "@/components/global/CustomSelect";

const dummyData = {
  totalExpenses: "$1,500",
  expenses: [
    { id: 1, category: "Groceries", amount: 150.25, date: "2023-10-01" },
    { id: 2, category: "Rent", amount: 600, date: "2023-10-01" },
    { id: 3, category: "Utilities", amount: 100, date: "2023-10-05" },
    { id: 4, category: "Dining", amount: 50, date: "2023-10-10" },
  ],
  savings: [
    { id: 1, category: "Emergency Fund", amount: 200, date: "2023-10-01" },
    { id: 2, category: "Vacation", amount: 300, date: "2023-10-05" },
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
  const { control, handleSubmit, reset, watch } = useForm();
  const categoryType = watch("categoryType");
  const savingsType = watch("savingsType");

  const onSubmit = (data) => {
    console.log(data);
    // Handle form submission
    reset();
    setModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <View className="bg-[#1E2A3B] rounded-lg p-5 mb-5 flex-row justify-between items-center">
      <View>
        <Text className={`text-white text-lg font-bold`}>{item.category}</Text>
        <Text className="text-gray-400">Date: {item.date}</Text>
      </View>
      <Text className="text-white text-lg font-bold">${item.amount}</Text>
    </View>
  );

  // const renderItem = ({ item }) => (
  //   <View className="bg-[#1E2A3B] rounded-lg p-5 mb-5 flex-row justify-between items-center">
  //     <View className="flex gap-1">
  //       <Text className="text-white font-semibold text-base">Date:</Text>
  //       <Text className="text-white font-bold text-lg"> {item.date}</Text>
  //     </View>
  //     <View className="flex gap-1">
  //       <Text className="text-white font-semibold text-base">Amount:</Text>
  //       <Text className="text-white font-bold text-lg"> ${item.amount}</Text>
  //     </View>
  //   </View>
  // );

  const totalExpensesAmount = [
    ...dummyData.expenses,
    ...dummyData.savings,
  ].reduce((sum, expense) => sum + expense.amount, 0);

  const pieChartData = [
    ...dummyData.expenses,
    {
      name: "Savings",
      amount: dummyData.savings.reduce(
        (sum, expense) => sum + expense.amount,
        0
      ),
    },
  ].map((expense, index) => {
    const isExpense = (exp): exp is { category: string; amount: number } =>
      "category" in exp;
    return {
      name: isExpense(expense) ? expense.category : expense.name,
      amount: expense.amount,
      color: predefinedColors[index % predefinedColors.length],
      legendFontColor: "#FFF",
      legendFontSize: 15,
      percentage:
        ((expense.amount / totalExpensesAmount) * 100).toFixed(2) + "%",
    };
  });

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "living", title: "Living Expenses" },
    { key: "savings", title: "Savings" },
  ]);

  const [livingIndex, setLivingIndex] = useState(0);
  const [livingRoutes] = useState([
    { key: "groceries", title: "Groceries" },
    { key: "rent", title: "Rent" },
    { key: "utilities", title: "Utilities" },
    { key: "dining", title: "Dining" },
  ]);

  const [savingsIndex, setSavingsIndex] = useState(0);
  const [savingsRoutes] = useState([
    { key: "goals", title: "Goals" },
    { key: "general", title: "General" },
  ]);

  const renderLivingExpensesScene = ({ route }) => {
    const subcategories = {
      groceries: dummyData.expenses.filter(
        (item) => item.category === "Groceries"
      ),
      rent: dummyData.expenses.filter((item) => item.category === "Rent"),
      utilities: dummyData.expenses.filter(
        (item) => item.category === "Utilities"
      ),
      dining: dummyData.expenses.filter((item) => item.category === "Dining"),
    };

    return (
      <FlatList
        data={subcategories[route.key]}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
      />
    );
  };

  const renderSavingsScene = ({ route }) => {
    const subcategories = {
      goals: dummyData.savings.filter(
        (item) =>
          item.category === "Emergency Fund" || item.category === "Vacation"
      ),
      general: dummyData.savings.filter(
        (item) =>
          item.category !== "Emergency Fund" && item.category !== "Vacation"
      ),
    };

    return (
      <FlatList
        data={subcategories[route.key]}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
      />
    );
  };

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "living":
        return (
          <TabView
            navigationState={{ index: livingIndex, routes: livingRoutes }}
            renderScene={renderLivingExpensesScene}
            onIndexChange={setLivingIndex}
            initialLayout={{ width: screenWidth }}
            renderTabBar={(props) => (
              <TabBar
                {...props}
                indicatorStyle={{ backgroundColor: "white", height: 3 }}
                style={{ backgroundColor: "#1E2A3B" }}
                labelStyle={{ color: "white" }}
                scrollEnabled={true}
                tabStyle={{ width: 200 }}
                contentContainerStyle={{ flexGrow: 1 }}
              />
            )}
          />
        );
      case "savings":
        return (
          <TabView
            navigationState={{ index: savingsIndex, routes: savingsRoutes }}
            renderScene={renderSavingsScene}
            onIndexChange={setSavingsIndex}
            initialLayout={{ width: screenWidth }}
            renderTabBar={(props) => (
              <TabBar
                {...props}
                indicatorStyle={{ backgroundColor: "white", height: 3 }}
                style={{ backgroundColor: "#1E2A3B" }}
                labelStyle={{ color: "white" }}
                scrollEnabled={true}
                tabStyle={{ width: Dimensions.get("window").width / 3 }}
                contentContainerStyle={{ flexGrow: 1 }}
              />
            )}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <SafeAreaView className="flex-1 bg-[#161E2B]">
        <View className="bg-[#1E2A3B] rounded-lg p-5 my-5 mx-5">
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
              indicatorStyle={{ backgroundColor: "white", height: 3 }}
              style={{ backgroundColor: "#1E2A3B" }}
              labelStyle={{ color: "white" }}
              scrollEnabled={true}
              tabStyle={{ width: Dimensions.get("window").width / 2 }}
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
              <Text className="text-white text-lg mb-5">Add Expense</Text>
              <Controller
                control={control}
                name="categoryType"
                render={({ field: { onChange, value } }) => (
                  <CustomSelect
                    value={value}
                    onValueChange={onChange}
                    placeholder="Select Category Type"
                    items={[
                      { label: "Living Expenses", value: "living" },
                      { label: "Savings", value: "savings" },
                    ]}
                    label="Category Type"
                  />
                )}
              />
              {categoryType === "living" && (
                <Controller
                  control={control}
                  name="category"
                  render={({ field: { onChange, value } }) => (
                    <CustomSelect
                      value={value}
                      onValueChange={onChange}
                      placeholder="Select Subcategory"
                      items={[
                        { label: "Groceries", value: "Groceries" },
                        { label: "Rent", value: "Rent" },
                        { label: "Utilities", value: "Utilities" },
                        { label: "Dining", value: "Dining" },
                      ]}
                      label="Subcategory"
                    />
                  )}
                />
              )}
              {categoryType === "savings" && (
                <>
                  <Controller
                    control={control}
                    name="savingsType"
                    render={({ field: { onChange, value } }) => (
                      <CustomSelect
                        value={value}
                        onValueChange={onChange}
                        placeholder="Select Savings Type"
                        items={[
                          { label: "Goals", value: "goals" },
                          { label: "General", value: "general" },
                        ]}
                        label="Savings Type"
                      />
                    )}
                  />
                  {savingsType === "goals" && (
                    <Controller
                      control={control}
                      name="goal"
                      render={({ field: { onChange, value } }) => (
                        <CustomSelect
                          value={value}
                          onValueChange={onChange}
                          placeholder="Select Goal"
                          items={[
                            {
                              label: "Emergency Fund",
                              value: "Emergency Fund",
                            },
                            { label: "Vacation", value: "Vacation" },
                          ]}
                          label="Goal"
                        />
                      )}
                    />
                  )}
                  {savingsType === "general" && (
                    <Controller
                      control={control}
                      name="generalSavings"
                      render={({ field: { onChange, value } }) => (
                        <Input
                          placeholder="General Savings"
                          onChangeText={onChange}
                          value={value}
                          className="bg-gray-700 text-white mb-4 p-2 rounded-lg"
                        />
                      )}
                    />
                  )}
                </>
              )}
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

export default Expenses;
