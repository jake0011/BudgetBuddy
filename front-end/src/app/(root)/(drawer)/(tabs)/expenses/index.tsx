import React, { useState, useCallback, useMemo, useEffect } from "react";
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
import {
  getExpenditureCategories,
  getUserExpenses,
  addExpenditure,
  updateExpenditure,
  deleteExpenditure,
} from "@/services/expenditureService";
import { useAuthStore } from "@/stores/auth";
import { useDateStore } from "@/stores/date";
import CustomModal from "@/components/global/CustomModal";
import Toast from "react-native-toast-message";
import { TabBar, TabView } from "react-native-tab-view";
import { getGoals } from "@/services/goalsService";
import CustomAlert from "@/components/global/CustomAlert";

// Get the screen width of the device
const screenWidth = Dimensions.get("window").width;

// Predefined colors for the pie chart
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

// Schema for form validation using Zod
const expenseSchema = z
  .object({
    categoryType: z.string().min(1, "Category type is required"),
    category: z.string().min(1, "Category is required"),
    amount: z.number().min(0.01, "Amount must be greater than 0"),
    goal: z.number().optional(),
  })
  .refine(
    (data) => {
      if (
        data.category === "goals" &&
        (data.goal === undefined || data.goal === null)
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Goal is required when category is 'goals'",
      path: ["goal"],
    }
  );

const Expenses = () => {
  // State variables for modal visibility, alert visibility, loading state, current expense, and expense to delete
  const [modalVisible, setModalVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  // Initialize form handling using react-hook-form
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

  // Get user and date information from stores
  const user = useAuthStore((state) => state.user);
  const tabDate = useDateStore((state) => state.tabDate);

  // State variables for fetched data
  const [data, setData] = useState({ categories: [], expenses: [], goals: [] });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch expenditure categories, user expenses, and goals
  const fetcher = useCallback(async () => {
    try {
      const [categories, expenses, goals] = await Promise.all([
        getExpenditureCategories(),
        getUserExpenses(user?.userId, tabDate.month, tabDate.year),
        getGoals(user?.userId),
      ]);
      setData({ categories, expenses, goals });
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.userId, tabDate.month, tabDate.year]);

  // Use useEffect to fetch data on component mount and when dependencies change
  useEffect(() => {
    fetcher();
  }, [fetcher]);

  // Extract categories, expenses, and goals data from the fetched data
  const categoriesData = data.categories;
  const expensesData = data.expenses;
  const goalsData = data.goals;

  // Function to handle modal dismissal
  const handleModalDismiss = () => {
    setModalVisible(false);
    reset({
      categoryType: null,
      category: null,
      amount: null,
      goal: null,
    });
    setCurrentExpense(null);
  };

  // Function to handle editing an expense
  const handleEdit = (expense) => {
    setCurrentExpense(expense);
    setModalVisible(true);
    reset({
      categoryType: expense.type,
      category: expense.category,
      amount: expense.amount,
      goal: expense.goal,
    });
  };

  // Function to handle form submission for adding or updating an expense
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const selectedCategory = categoriesData.find(
        (cat) => cat.name === data.category
      );

      if (currentExpense) {
        // Update existing expense
        const response = await updateExpenditure(
          user?.userId,
          currentExpense.expenditureId,
          {
            amount: data.amount,
            month: tabDate.month,
            year: tabDate.year,
            type: "expenses",
            categoriesId: selectedCategory?.categoriesId || 7,
            goalsId: data.goal || null,
          }
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
      } else {
        // Add new expense
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
      }
      fetcher();
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
      handleModalDismiss();
    }
  };

  // Function to handle deleting an expense
  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await deleteExpenditure(
        user?.userId,
        expenseToDelete.expendituresId
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
      setLoading(false);
      setAlertVisible(false);
      setExpenseToDelete(null);
      fetcher();
    }
  };

  // Function to handle delete button press
  const handleDeletePress = (expense) => {
    setExpenseToDelete(expense);
    setAlertVisible(true);
  };

  // Function to render each expense item
  const renderItem = ({ item }: { item: any }) => (
    <View className="bg-[#1E2A3B] rounded-lg p-5 mb-5 flex-row justify-between items-center">
      <View>
        {item.name && (
          <Text className={`text-white text-lg font-bold`}>{item.name}</Text>
        )}
        <Text className="text-gray-400 font-bold text-lg">
          {item.createdAt.split("T")[0]}
        </Text>
      </View>
      <Text className="text-white text-lg font-bold">GHS {item.amount}</Text>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <TouchableOpacity onPress={() => handleEdit(item)}>
          <Text className="text-blue-500">Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeletePress(item)}>
          <Text className="text-red-500">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Memoized categorized expenses data
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

  // Memoized total expenses amount
  const totalExpensesAmount = useMemo(
    () => expensesData.reduce((sum, expense) => sum + expense.amount, 0) || 0,
    [expensesData]
  );

  // Memoized pie chart data
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

  // State variables for tab navigation
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

  // Function to render living expenses scene
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

  // Function to render savings scene
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

  // Function to render the main scene based on the selected tab
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

  // If there's an error, display an error message
  if (error)
    return (
      <SafeAreaView className="flex bg-[#161E2B] h-screen justify-center items-center">
        <Text className="text-white text-center">Failed to load data</Text>
      </SafeAreaView>
    );

  // If data is loading, display a loading spinner
  if (isLoading)
    return (
      <SafeAreaView className="flex bg-[#161E2B] h-screen justify-center items-center">
        <Spinner size="large" color="white" />
      </SafeAreaView>
    );

  // Main render of the expenses screen
  return (
    <>
      <SafeAreaView className="flex-1 bg-[#161E2B]">
        {/* Container for total expenses display */}
        <View
          className="bg-[#1E2A3B] rounded-lg p-5 mx-5"
          style={{
            marginTop: 20,
          }}
        >
          <Text className="text-white text-lg mb-2">Total Expenses</Text>
          <Text className="text-white text-4xl font-bold">
            GHS {totalExpensesAmount.toFixed(2)}
          </Text>
        </View>
        {/* Pie chart for expenses distribution */}
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
        {/* Tab view for living expenses and savings */}
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
        {/* Button to add a new expense */}
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="absolute bottom-32 right-10 bg-blue-500 p-4 rounded-full shadow-lg"
        >
          <Plus color="white" size={28} />
        </TouchableOpacity>
        {/* Modal for adding or updating an expense */}
        <CustomModal
          visible={modalVisible}
          onDismiss={handleModalDismiss}
          title={currentExpense ? "Update Expense" : "Add Expense"}
          control={control}
          errors={errors}
          reset={reset}
          inputs={[
            {
              name: "amount",
              placeholder: "Amount",
              keyboardType: "numeric",
              defaultValue: currentExpense?.amount,
            },
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
              onPress: handleModalDismiss,
            },
          ]}
          loading={loading}
        />
        {/* Alert for confirming expense deletion */}
        <CustomAlert
          visible={alertVisible}
          onDismiss={() => setAlertVisible(false)}
          onConfirm={handleDelete}
          message="Are you sure you want to delete this expense?"
          loading={loading}
        />
      </SafeAreaView>
    </>
  );
};

export default Expenses;
