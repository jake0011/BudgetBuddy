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
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import {
  Modal as PaperModal,
  Button as PaperButton,
  Portal,
} from "react-native-paper";
import CustomSelect from "@/components/global/CustomSelect";
import {
  getExpenditureCategories,
  getUserBudget,
} from "@/services/expenditureService";
import useSWR from "swr";
import { useAuthStore } from "@/stores/auth";

const screenWidth = Dimensions.get("window").width;

const predefinedColors = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
  "#8A2BE2",
  "#FFA500",
  "#00FF00",
  "#FF00FF",
  "#00FFFF",
];

const Expenses = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { control, handleSubmit, reset, watch } = useForm();
  const categoryType = watch("categoryType");
  const savingsType = watch("savingsType");
  const user = useAuthStore((state) => state.user);

  const fetcher = useCallback(async () => {
    const [categories, budget] = await Promise.all([
      getExpenditureCategories(),
      getUserBudget(user.userId),
    ]);
    return { categories, budget };
  }, [user.userId]);

  const { data, error } = useSWR(`/expenditure/data`, fetcher);

  const categoriesData = data?.categories || [];
  const budgetData = data?.budget || [];

  const onSubmit = (data) => {
    console.log(data);
    reset();
    setModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <View className="bg-[#1E2A3B] rounded-lg p-5 mb-5 flex-row justify-between items-center">
      <View>
        <Text className={`text-white text-lg font-bold`}>{item?.name}</Text>
      </View>
      <Text className="text-white text-lg font-bold">${item?.budgeted}</Text>
    </View>
  );

  const categorizedBudget = useMemo(() => {
    const initialCategorizedBudget = {
      living: categoriesData
        .filter((cat) => cat.categoriesId !== 7)
        .map((cat) => ({ ...cat, budgeted: 0 })),
      savings: { goals: [], general: [] },
    };

    budgetData.forEach((budget) => {
      if (budget.categoriesId === 7) {
        if (budget.savingsType === "goals") {
          initialCategorizedBudget.savings.goals.push(budget);
        } else {
          initialCategorizedBudget.savings.general.push(budget);
        }
      } else {
        const category = initialCategorizedBudget.living.find(
          (cat) => cat.categoriesId === budget.categoriesId
        );
        if (category) {
          category.budgeted += budget.budgeted;
        }
      }
    });

    return initialCategorizedBudget;
  }, [categoriesData, budgetData]);

  const totalBudgetAmount = useMemo(() => {
    return (
      categorizedBudget.living.reduce(
        (sum, category) => sum + category.budgeted,
        0
      ) +
      categorizedBudget.savings.goals.reduce(
        (sum, category) => sum + category.budgeted,
        0
      ) +
      categorizedBudget.savings.general.reduce(
        (sum, category) => sum + category.budgeted,
        0
      )
    );
  }, [categorizedBudget]);

  const pieChartData = useMemo(() => {
    const livingExpensesData = categorizedBudget.living.map(
      (category, index) => ({
        name: category.name,
        amount: category.budgeted,
        color: predefinedColors[index % predefinedColors.length],
        legendFontColor: "#FFF",
        legendFontSize: 15,
        percentage:
          ((category.budgeted / totalBudgetAmount) * 100).toFixed(2) + "%",
      })
    );

    const savingsTotalAmount = categorizedBudget.savings.goals
      .concat(categorizedBudget.savings.general)
      .reduce((sum, category) => sum + category.budgeted, 0);

    const savingsData = {
      name: "Savings",
      amount: savingsTotalAmount,
      color:
        predefinedColors[livingExpensesData.length % predefinedColors.length],
      legendFontColor: "#FFF",
      legendFontSize: 15,
      percentage:
        ((savingsTotalAmount / totalBudgetAmount) * 100).toFixed(2) + "%",
    };

    return [...livingExpensesData, savingsData];
  }, [categorizedBudget, totalBudgetAmount]);

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
            data={categorizedBudget.living}
            renderItem={renderItem}
            keyExtractor={(item) => item.categoriesId.toString()}
            contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
            ListEmptyComponent={
              <Text className="text-white text-2xl font-bold text-center">
                No budget
              </Text>
            }
          />
        );
      case "savings":
        return (
          <View className="p-5">
            <Text className="text-gray-400 text-lg font-bold mb-6">Goals</Text>
            <FlatList
              data={categorizedBudget.savings.goals}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{ paddingBottom: 20 }}
              ListEmptyComponent={
                <Text className="text-white text-2xl font-bold text-center">
                  No budget
                </Text>
              }
            />
            <Text className="text-gray-400 text-lg font-bold mb-6">
              General
            </Text>
            <FlatList
              data={categorizedBudget.savings.general}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{ paddingBottom: 20 }}
              ListEmptyComponent={
                <Text className="text-white text-2xl font-bold text-center">
                  No budget
                </Text>
              }
            />
          </View>
        );
      default:
        return null;
    }
  };

  if (error)
    return (
      <SafeAreaView className="flex bg-[#161E2B] h-screen justify-center items-center">
        <Text className="text-white text-center">Failed to load data</Text>
      </SafeAreaView>
    );

  if (!data)
    return (
      <SafeAreaView className="flex bg-[#161E2B] h-screen justify-center items-center">
        <Spinner size="large" color="white" />
      </SafeAreaView>
    );

  return (
    <>
      <SafeAreaView className="flex-1 bg-[#161E2B]">
        <View className="bg-[#1E2A3B] rounded-lg p-5 my-5 mx-5">
          <Text className="text-white text-lg mb-2">Total Budget</Text>
          <Text className="text-white text-4xl font-bold">
            ${totalBudgetAmount.toFixed(2)}
          </Text>
        </View>
        <PieChart
          data={pieChartData}
          width={screenWidth - 20}
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
              <Text className="text-white text-lg mb-5">Add Budget</Text>
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
                      items={categoriesData
                        ?.filter((cat) => cat.categoriesId !== 7)
                        .map((cat) => ({ label: cat.name, value: cat.name }))}
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

export default Expenses;
