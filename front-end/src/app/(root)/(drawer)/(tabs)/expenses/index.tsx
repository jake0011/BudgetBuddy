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
  getExpenditureCategories,
  getUserExpenses,
  addExpenditure,
} from "@/services/expenditureService";
import { useAuthStore } from "@/stores/auth";
import { useDateStore } from "@/stores/date";
import CustomModal from "@/components/global/CustomModal";
import Toast from "react-native-toast-message";
import { TabBar, TabView } from "react-native-tab-view";
import { getGoals } from "@/services/goalsService";

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

const expenseSchema = z.object({
  categoryType: z.string().min(1, "Category type is required"),
  category: z.string().min(1, "Category is required"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
});

const Expenses = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      categoryType: "",
      category: "",
      amount: "",
      goal: "",
    },
  });

  const user = useAuthStore((state) => state.user);
  const tabDate = useDateStore((state) => state.tabDate);

  const fetcher = useCallback(async () => {
    const [categories, expenses, goals] = await Promise.all([
      getExpenditureCategories(),
      getUserExpenses(user?.userId, tabDate.month, tabDate.year),
      getGoals(user?.userId),
    ]);
    return { categories, expenses, goals };
  }, [user?.userId, tabDate.month, tabDate.year]);

  const { data, error, isLoading, mutate } = useSWR(
    `/expenditure/data`,
    fetcher
  );

  const categoriesData = data?.categories || [];
  const expensesData = data?.expenses || [];
  const goalsData = data?.goals || [];

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const selectedCategory = categoriesData.find(
        (cat) => cat.name === data.category
      );

      const response = await addExpenditure(user?.userId, {
        amount: data.amount,
        month: tabDate.month,
        year: tabDate.year,
        type: "expenses",
        categoriesId: selectedCategory?.categoriesId || 7,
        goalsId: data.goal || null,
      });
      Toast.show({
        type: "success",
        text1: response,
        text1Style: {
          color: "green",
          fontSize: 16,
          textAlign: "center",
        },
      });
      mutate();
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
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View className="bg-[#1E2A3B] rounded-lg p-5 mb-5 flex-row justify-between items-center">
      <View>
        <Text className="text-white text-lg font-bold">{item.name}</Text>
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
          const goal = goalsData.find(
            (goal) => goal.goalsId === expense.goalsId
          );
          if (goal) {
            initialCategorizedExpenses.savings.goals.push({
              ...expense,
              name: goal.title,
            });
          }
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
        const percentage = ((totalAmount / totalExpensesAmount) * 100).toFixed(
          2
        );
        return {
          name: category.name,
          amount: totalAmount,
          color: predefinedColors[index % predefinedColors.length],
          legendFontColor: "#FFF",
          legendFontSize: 15,
        };
      }
    );

    const savingsTotalAmount = categorizedExpenses.savings.goals
      .concat(categorizedExpenses.savings.general)
      .reduce((sum, expense) => sum + expense.amount, 0);

    const savingsPercentage = (
      (savingsTotalAmount / totalExpensesAmount) *
      100
    ).toFixed(2);

    const savingsData = {
      name: "Savings",
      amount: savingsTotalAmount,
      color:
        predefinedColors[livingExpensesData.length % predefinedColors.length],
      legendFontColor: "#FFF",
      legendFontSize: 15,
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

  if (isLoading)
    return (
      <SafeAreaView className="flex bg-[#161E2B] h-screen justify-center items-center">
        <Spinner size="large" color="white" />
      </SafeAreaView>
    );

  return (
    <>
      <SafeAreaView className="flex-1 bg-[#161E2B]">
        <View
          className="bg-[#1E2A3B] rounded-lg p-5 mx-5"
          style={{
            marginTop: 20,
          }}
        >
          <Text className="text-white text-lg mb-2">Total Expenses</Text>
          <Text className="text-white text-4xl font-bold">
            ${totalExpensesAmount.toFixed(2)}
          </Text>
        </View>
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
        <CustomModal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          title="Add Expense"
          control={control}
          errors={errors}
          inputs={[
            { name: "amount", placeholder: "Amount", keyboardType: "numeric" },
          ]}
          selects={[
            {
              name: "categoryType",
              placeholder: "Select Category Type",
              items: [
                { label: "Living Expenses", value: "living" },
                { label: "Savings", value: "savings" },
              ],
              label: "Category Type",
              watch: watch,
            },
            {
              name: "category",
              placeholder: "Select Subcategory",
              items: categoriesData
                .filter((cat) => cat.categoriesId !== 7)
                .map((cat) => ({ label: cat.name, value: cat.name })),
              label: "Subcategory",
              dependentOn: "categoryType",
              dependentItems: {
                living: categoriesData
                  .filter((cat) => cat.categoriesId !== 7)
                  .map((cat) => ({ label: cat.name, value: cat.name })),
                savings: [
                  { label: "Goals", value: "goals" },
                  { label: "General", value: "general" },
                ],
              },
              watch: watch,
            },
            {
              name: "goal",
              placeholder: "Select Goal",
              items: goalsData.map((goal) => ({
                label: goal.title,
                value: goal.goalsId,
              })),
              label: "Goal",
              dependentOn: "category",
              dependentItems: {
                goals: goalsData.map((goal) => ({
                  label: goal.title,
                  value: goal.goalsId,
                })),
              },
              watch: watch,
            },
          ]}
          buttons={[
            { label: "Save", color: "blue", onPress: handleSubmit(onSubmit) },
            {
              label: "Cancel",
              color: "red",
              onPress: () => {
                setModalVisible(false), reset();
              },
            },
          ]}
          loading={loading}
        />
      </SafeAreaView>
    </>
  );
};

export default Expenses;
