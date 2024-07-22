import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Dimensions,
  SectionList,
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
  getUserBudget,
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

const budgetSchema = z.object({
  categoryType: z.string().min(1, "Category type is required"),
  category: z.string().min(1, "Category is required"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
});

const Budget = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(budgetSchema),
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
    const [categories, budget, goals] = await Promise.all([
      getExpenditureCategories(),
      getUserBudget(user?.userId, tabDate.month, tabDate.year),
      getGoals(user?.userId),
    ]);
    return { categories, budget, goals };
  }, [user?.userId, tabDate.month, tabDate.year]);

  const { data, error, isLoading, mutate } = useSWR(
    `/expenditure/data`,
    fetcher
  );

  const categoriesData = data?.categories || [];
  const budgetData = data?.budget || [];
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
        type: "budget",
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
        <Text className={`text-white text-lg font-bold`}>{item?.name}</Text>
      </View>
      <Text className="text-white text-lg font-bold">${item?.amount}</Text>
    </View>
  );

  const categorizedBudget = useMemo(() => {
    const initialCategorizedBudget = {
      living: categoriesData
        .filter((cat) => cat.categoriesId !== 7)
        .map((cat) => ({ ...cat, amount: 0 })),
      savings: { goals: [], general: [] },
    };

    budgetData.forEach((budget) => {
      if (budget.categoriesId === 7) {
        if (budget.goalsId) {
          const goal = goalsData.find(
            (goal) => goal.goalsId === budget.goalsId
          );
          if (goal) {
            const existingGoal = initialCategorizedBudget.savings.goals.find(
              (g) => g.goalsId === goal.goalsId
            );
            if (existingGoal) {
              existingGoal.amount += budget.amount;
            } else {
              initialCategorizedBudget.savings.goals.push({
                ...goal,
                name: goal.title,
                amount: budget.amount,
              });
            }
          }
        } else {
          const existingGeneral = initialCategorizedBudget.savings.general.find(
            (g) => g.name === (budget.title || "General")
          );
          if (existingGeneral) {
            existingGeneral.amount += budget.amount;
          } else {
            initialCategorizedBudget.savings.general.push({
              ...budget,
              name: budget.title || "General",
              amount: budget.amount,
            });
          }
        }
      } else {
        const category = initialCategorizedBudget.living.find(
          (cat) => cat.categoriesId === budget.categoriesId
        );
        if (category) {
          category.amount += budget.amount;
        }
      }
    });

    return initialCategorizedBudget;
  }, [categoriesData, budgetData, goalsData]);
  const totalBudgetAmount = useMemo(() => {
    return (
      categorizedBudget.living.reduce(
        (sum, category) => sum + category.amount,
        0
      ) +
      categorizedBudget.savings.goals.reduce(
        (sum, category) => sum + category.amount,
        0
      ) +
      categorizedBudget.savings.general.reduce(
        (sum, category) => sum + category.amount,
        0
      )
    );
  }, [categorizedBudget]);

  const pieChartData = useMemo(() => {
    const livingExpensesData = categorizedBudget.living.map(
      (category, index) => ({
        name: category.name,
        amount: category.amount,
        color: predefinedColors[index % predefinedColors.length],
        legendFontColor: "#FFF",
        legendFontSize: 15,
        percentage:
          totalBudgetAmount === 0
            ? "0.00%"
            : ((category.amount / totalBudgetAmount) * 100).toFixed(2) + "%",
      })
    );

    const savingsTotalAmount = categorizedBudget.savings.goals
      .concat(categorizedBudget.savings.general)
      .reduce((sum, category) => sum + category.amount, 0);

    const savingsData = {
      name: "Savings",
      amount: savingsTotalAmount,
      color:
        predefinedColors[livingExpensesData.length % predefinedColors.length],
      legendFontColor: "#FFF",
      legendFontSize: 15,
      percentage:
        totalBudgetAmount === 0
          ? "0.00%"
          : ((savingsTotalAmount / totalBudgetAmount) * 100).toFixed(2) + "%",
    };

    return [...livingExpensesData, savingsData];
  }, [categorizedBudget, totalBudgetAmount]);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "living", title: "Living Expenses" },
    { key: "savings", title: "Savings" },
  ]);

  const renderSectionHeader = ({ section: { title } }) => (
    <Text className="text-gray-400 text-lg font-bold mb-6">{title}</Text>
  );

  const renderSectionFooter = ({ section }) => {
    if (section.data.length === 0) {
      return (
        <Text className="text-white text-2xl font-bold text-center">
          No budget
        </Text>
      );
    }
    return null;
  };

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "living":
        return (
          <FlatList
            data={categorizedBudget.living}
            renderItem={renderItem}
            keyExtractor={(item) => item?.categoriesId?.toString()}
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
          <SectionList
            sections={[
              { title: "Goals", data: categorizedBudget.savings.goals },
              { title: "General", data: categorizedBudget.savings.general },
            ]}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            renderSectionFooter={renderSectionFooter}
            keyExtractor={(item, index) =>
              item?.goalsId?.toString() || index.toString()
            }
            contentContainerStyle={{ padding: 20, paddingBottom: 150 }}
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
        <View className="bg-[#1E2A3B] rounded-lg p-5 mt-6 mx-5">
          <Text className="text-white text-lg mb-2">Total Budget</Text>
          <Text className="text-white text-4xl font-bold">
            ${totalBudgetAmount.toFixed(2)}
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
          title="Add Budget"
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

export default Budget;
