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
import { Input, Spinner, Button as TamaguiButton } from "tamagui";
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
  getUserExpenses,
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
    const [categories, expenses] = await Promise.all([
      getExpenditureCategories(),
      getUserExpenses(user.userId),
    ]);
    return { categories, expenses };
  }, [user.userId]);

  const { data, error } = useSWR(`/expenditure/data`, fetcher);

  const fetcher2 = useCallback(async () => {
    const budget = await getUserBudget(user.userId);
    return budget;
  }, [user.userId]);
  const { data: budgetData, error: budgetError } = useSWR(
    `/budget/data`,
    fetcher2
  );

  console.log(budgetData);

  const categoriesData = data?.categories || [];
  const expensesData = data?.expenses || [];

  const onSubmit = (data) => {
    console.log(data);
    reset();
    setModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <View className="bg-[#1E2A3B] rounded-lg p-5 mb-5 flex-row justify-between items-center">
      <View>
        <Text className={`text-white text-lg font-bold`}>{item.category}</Text>
        <Text className="text-gray-400 font-bold text-lg">
          {item.createdAt.split("T")[0]}
        </Text>
      </View>
      <Text className="text-white text-lg font-bold">${item.amount}</Text>
    </View>
  );

  const categorizedExpenses = useMemo(() => {
    const initialCategorizedExpenses = {
      living: categoriesData
        .filter((cat) => cat.categoriesId !== 7)
        .map((cat) => ({ ...cat, expenses: [] })),
      savings: { goals: [], general: [] },
    };

    expensesData.forEach((expense) => {
      if (expense.categoriesId === 7) {
        if (expense.goalsId) {
          initialCategorizedExpenses.savings.goals.push(expense);
        } else {
          initialCategorizedExpenses.savings.general.push(expense);
        }
      } else {
        const category = initialCategorizedExpenses.living.find(
          (cat) => cat.categoriesId === expense.categoriesId
        );
        if (category) {
          category.expenses.push(expense);
        }
      }
    });

    return initialCategorizedExpenses;
  }, [categoriesData, expensesData]);

  const totalExpensesAmount = useMemo(
    () => expensesData.reduce((sum, expense) => sum + expense.amount, 0) || 0,
    [expensesData]
  );

  const pieChartData = useMemo(() => {
    const livingExpensesData = categorizedExpenses.living.map(
      (category, index) => {
        const totalAmount = category.expenses.reduce(
          (sum, expense) => sum + expense.amount,
          0
        );
        return {
          name: category.name,
          amount: totalAmount,
          color: predefinedColors[index % predefinedColors.length],
          legendFontColor: "#FFF",
          legendFontSize: 15,
          percentage:
            ((totalAmount / totalExpensesAmount) * 100).toFixed(2) + "%",
        };
      }
    );

    const savingsTotalAmount = categorizedExpenses.savings.goals
      .concat(categorizedExpenses.savings.general)
      .reduce((sum, expense) => sum + expense.amount, 0);

    const savingsData = {
      name: "Savings",
      amount: savingsTotalAmount,
      color:
        predefinedColors[livingExpensesData.length % predefinedColors.length],
      legendFontColor: "#FFF",
      legendFontSize: 15,
      percentage:
        ((savingsTotalAmount / totalExpensesAmount) * 100).toFixed(2) + "%",
    };

    return [...livingExpensesData, savingsData];
  }, [categorizedExpenses, totalExpensesAmount]);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "living", title: "Living Expenses" },
    { key: "savings", title: "Savings" },
  ]);

  const [livingIndex, setLivingIndex] = useState(0);
  const livingRoutes = useMemo(
    () =>
      categorizedExpenses.living.map((cat) => ({
        key: cat.categoriesId.toString(),
        title: cat.name,
      })),
    [categorizedExpenses.living]
  );

  const [savingsIndex, setSavingsIndex] = useState(0);
  const [savingsRoutes] = useState([
    { key: "goals", title: "Goals" },
    { key: "general", title: "General" },
  ]);

  const renderLivingExpensesScene = ({ route }) => {
    const category = categorizedExpenses.living.find(
      (cat) => cat.categoriesId.toString() === route.key
    );
    return (
      <FlatList
        data={category.expenses}
        renderItem={renderItem}
        keyExtractor={(item) => item.expendituresId.toString()}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        ListEmptyComponent={
          <Text className="text-white text-2xl font-bold text-center">
            No expenses
          </Text>
        }
      />
    );
  };

  const renderSavingsScene = ({ route }) => {
    const data =
      route.key === "goals"
        ? categorizedExpenses.savings.goals
        : categorizedExpenses.savings.general;
    return (
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.expendituresId.toString()}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        ListEmptyComponent={
          <Text className="text-white text-2xl font-bold text-center">
            No savings
          </Text>
        }
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
                tabStyle={{ width: Dimensions.get("window").width / 2 }}
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
                tabStyle={{ width: Dimensions.get("window").width / 2 }}
                contentContainerStyle={{ flexGrow: 1 }}
              />
            )}
          />
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
          <Text className="text-white text-lg mb-2">Total Expenses</Text>
          <Text className="text-white text-4xl font-bold">
            ${totalExpensesAmount.toFixed(2)}
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
