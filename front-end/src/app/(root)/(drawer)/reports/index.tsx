import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import { ProgressBar } from "react-native-paper";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { MaterialIcons } from "@expo/vector-icons";
import useSWR from "swr";
import { useAuthStore } from "@/stores/auth";
import { getReportData } from "@/services/incomeService";
import { Spinner } from "tamagui";
import { useDateStore } from "@/stores/date";

const screenWidth = Dimensions.get("window").width;

const predefinedColors = [
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FF00FF",
  "#FFFF00",
  "#00FFFF",
  "#FFA500",
  "#800080",
  "#008000",
  "#800000",
  "#008080",
  "#FF69B4",
];

const AppBar = () => (
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 20,
      backgroundColor: "#1E2A3B",
    }}
  >
    <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
      Reports
    </Text>
    <TouchableOpacity>
      <MaterialIcons name="filter-list" size={24} color="white" />
    </TouchableOpacity>
  </View>
);

const Overview = ({ data }) => (
  <ScrollView style={{ padding: 20 }}>
    <View className="bg-[#1E2A3B] rounded-lg p-5 mb-5">
      <Text className="text-white font-bold text-lg mb-2">Total Balance</Text>
      <Text className="text-white text-4xl font-bold">
        $
        {(
          data.income.reduce((acc, item) => acc + item.amount, 0) -
          data.expenses.reduce((acc, item) => acc + item.amount, 0)
        ).toFixed(2)}
      </Text>
    </View>
    <View className="flex-row justify-between mb-5">
      <View className="bg-[#1E2A3B] rounded-lg p-5 flex-1 mx-1">
        <Text className="text-white font-bold text-lg mb-2">Income</Text>
        <Text className="text-green-500 text-2xl font-bold">
          ${data.income.reduce((acc, item) => acc + item.amount, 0).toFixed(2)}
        </Text>
      </View>
      <View className="bg-[#1E2A3B] rounded-lg p-5 flex-1 mx-1">
        <Text className="text-white font-bold text-lg mb-2">Expenses</Text>
        <Text className="text-red-500 text-2xl font-bold">
          $
          {data.expenses.reduce((acc, item) => acc + item.amount, 0).toFixed(2)}
        </Text>
      </View>
    </View>
  </ScrollView>
);

const Expenses = ({ data }) => {
  const filteredExpenses = data.expenses.filter(
    (expense) => expense.categoryName !== "Savings"
  );

  return (
    <ScrollView style={{ padding: 20 }}>
      {filteredExpenses.length > 0 ? (
        <>
          <PieChart
            data={filteredExpenses.map((expense, index) => ({
              name: expense.categoryName,
              amount: expense.amount,
              color: predefinedColors[index % predefinedColors.length],
              legendFontColor: "#FFF",
              legendFontSize: 15,
            }))}
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
          {filteredExpenses.map((expense, index) => (
            <View
              key={index}
              className="bg-[#1E2A3B] flex flex-row justify-between rounded-lg p-5 mb-5"
            >
              <Text className="text-white text-lg font-bold">
                {expense.categoryName}
              </Text>
              <Text className="text-gray-200 font-semibold">
                GHS {expense.amount}
              </Text>
            </View>
          ))}
        </>
      ) : (
        <View className="h-[70vh] flex items-center justify-center">
          <Text className="text-white text-2xl font-bold text-center mt-5">
            No expenses for this month
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const Income = ({ data }) => (
  <ScrollView style={{ padding: 20 }}>
    <View className="bg-[#1E2A3B]  rounded-lg p-5 mb-5">
      <Text className="text-white font-bold text-lg mb-2">Total Income</Text>
      <Text className="text-white text-4xl font-bold">
        ${data.income.reduce((acc, item) => acc + item.amount, 0)}
      </Text>
    </View>
    {data && data.income.length > 0 ? (
      <>
        <PieChart
          data={data.income.map((source, index) => ({
            name: source.source,
            amount: source.amount,
            color: predefinedColors[index % predefinedColors.length],
            legendFontColor: "#FFF",
            legendFontSize: 15,
          }))}
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
        <View className="border-b border-gray-600 mb-5" />
        {data.income.map((source, index) => (
          <View
            key={index}
            className="bg-[#1E2A3B] flex flex-row justify-between rounded-lg p-5 mb-5"
          >
            <Text className="text-white text-lg font-bold">
              {source.source}
            </Text>
            <Text className="text-gray-200 font-semibold">
              GHS {source.amount}
            </Text>
          </View>
        ))}
      </>
    ) : (
      <View className="h-[70vh] flex items-center justify-center">
        <Text className="text-white text-2xl font-bold text-center mt-5">
          No income for this month
        </Text>
      </View>
    )}
  </ScrollView>
);

const Savings = ({ data }) => {
  const savingsExpenses =
    data.expenses.find((expense) => expense.categoryName === "Savings")
      ?.expenses || [];

  const goalsMap = data.goals.reduce((acc, goal) => {
    acc[goal.goalsId] = goal.title;
    return acc;
  }, {});

  const savingsWithNames = savingsExpenses.map((expense) => {
    return {
      ...expense,
      name: expense.goalsId
        ? goalsMap[expense.goalsId] || "General"
        : "General",
    };
  });

  return (
    <ScrollView style={{ padding: 20 }}>
      {savingsWithNames.length > 0 ? (
        savingsWithNames.map((expense, index) => (
          <View
            key={index}
            className="bg-[#1E2A3B] flex flex-row justify-between rounded-lg p-5 mb-5"
          >
            <Text className="text-white text-lg font-bold">{expense.name}</Text>
            <Text className="text-gray-200 font-semibold">
              GHS {expense.amount}
            </Text>
          </View>
        ))
      ) : (
        <View className="h-[70vh] flex items-center justify-center">
          <Text className="text-white text-2xl font-bold text-center mt-5">
            No savings expenses
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const Reports = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "overview", title: "Overview" },
    { key: "income", title: "Income" },
    { key: "expenses", title: "Expenses" },
    { key: "savings", title: "Savings" },
  ]);

  const user = useAuthStore((state) => state.user);
  const drawerDate = useDateStore((state) => state.drawerDate);

  const fetcher = useCallback(async () => {
    return await getReportData(user?.userId, drawerDate.month, drawerDate.year);
  }, [user?.userId, drawerDate.month, drawerDate.year]);

  const { data, error, isLoading } = useSWR(`/report/data`, fetcher);

  const renderScene = SceneMap({
    overview: () => <Overview data={data} />,
    income: () => <Income data={data} />,
    expenses: () => <Expenses data={data} />,
    savings: () => <Savings data={data} />,
  });

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
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#161E2B", paddingBottom: 10 }}
    >
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
            tabStyle={{ width: Dimensions.get("window").width / 4 }}
            contentContainerStyle={{ flexGrow: 1 }}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Reports;
