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
  totalBudget: "$5,000",
  budgetCategories: [
    { id: 1, category: "Groceries", budgeted: 500 },
    { id: 2, category: "Rent", budgeted: 1200 },
    { id: 3, category: "Utilities", budgeted: 200 },
    { id: 4, category: "Dining", budgeted: 300 },
  ],
  savingsCategories: [
    { id: 1, category: "Emergency Fund", budgeted: 500 },
    { id: 2, category: "Vacation", budgeted: 1000 },
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
    <View className="bg-[#1E2A3B] rounded-lg p-5 mb-5">
      <View className="flex-row justify-between items-center">
        <Text className="text-white text-lg font-bold">{item.category}</Text>
        <Text className="text-white text-lg font-bold">${item.budgeted}</Text>
      </View>
    </View>
  );

  const totalBudgetAmount = [
    ...dummyData.budgetCategories,
    ...dummyData.savingsCategories,
  ].reduce((sum, category) => sum + category.budgeted, 0);

  const pieChartData = [
    ...dummyData.budgetCategories,
    {
      name: "Savings",
      amount: dummyData.savingsCategories.reduce(
        (sum, category) => sum + category.budgeted,
        0
      ),
    },
  ].map((category, index) => {
    const isBudgetCategory = (
      cat
    ): cat is { category: string; budgeted: number } => "category" in cat;
    return {
      name: isBudgetCategory(category) ? category.category : category.name,
      amount: isBudgetCategory(category) ? category.budgeted : category.amount,
      color: predefinedColors[index % predefinedColors.length],
      legendFontColor: "#FFF",
      legendFontSize: 15,
      percentage:
        (
          ((isBudgetCategory(category) ? category.budgeted : category.amount) /
            totalBudgetAmount) *
          100
        ).toFixed(2) + "%",
    };
  });

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "living", title: "Living Expenses" },
    { key: "savings", title: "Savings" },
  ]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "living":
        return (
          <FlatList
            data={dummyData.budgetCategories}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          />
        );
      case "savings":
        return (
          <FlatList
            data={dummyData.savingsCategories}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          />
        );
      default:
        return null;
    }
  };

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
              tabStyle={{ width: 200 }} // Fixed width for each tab
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
              <Text className="text-white text-lg mb-5">
                Add Budget Category
              </Text>
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
