import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { PieChart, BarChart, LineChart } from "react-native-chart-kit";
import { ProgressBar } from "react-native-paper";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { MaterialIcons } from "@expo/vector-icons";

const dummyData = {
  totalBalance: "$2,450.75",
  totalIncome: "$3,200",
  totalExpenses: "$1,500",
  savingsGoal: 45,
  expenses: [
    { category: "Groceries", amount: 150.25 },
    { category: "Rent", amount: 600 },
    { category: "Utilities", amount: 100 },
    { category: "Dining", amount: 50 },
  ],
  incomeSources: [
    { name: "Salary", amount: 2000 },
    { name: "Freelance", amount: 1000 },
    { name: "Investments", amount: 200 },
  ],
  goals: [
    { id: 1, name: "Emergency Fund", target: 1000, saved: 700 },
    { id: 2, name: "Vacation", target: 2000, saved: 800 },
    { id: 3, name: "New Car", target: 10000, saved: 3000 },
    { id: 4, name: "Home Renovation", target: 5000, saved: 2500 },
    { id: 5, name: "Education Fund", target: 15000, saved: 4500 },
    { id: 6, name: "Retirement", target: 20000, saved: 12000 },
  ],
};

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

const Overview = () => (
  <ScrollView style={{ padding: 20 }}>
    <View className="bg-[#1E2A3B] rounded-lg p-5 mb-5">
      <Text className="text-white font-bold text-lg mb-2">Total Balance</Text>
      <Text className="text-white text-4xl font-bold">
        {dummyData.totalBalance}
      </Text>
    </View>
    <View className="flex-row justify-between mb-5">
      <View className="bg-[#1E2A3B] rounded-lg p-5 flex-1 mx-1">
        <Text className="text-white font-bold text-lg mb-2">Income</Text>
        <Text className="text-green-500 text-2xl font-bold">
          {dummyData.totalIncome}
        </Text>
      </View>
      <View className="bg-[#1E2A3B] rounded-lg p-5 flex-1 mx-1">
        <Text className="text-white font-bold text-lg mb-2">Expenses</Text>
        <Text className="text-red-500 text-2xl font-bold">
          {dummyData.totalExpenses}
        </Text>
      </View>
    </View>
    <View className="bg-[#1E2A3B] rounded-lg p-5 mb-5">
      <Text className="text-white font-bold text-lg mb-2">
        Income vs Expenses
      </Text>
      <LineChart
        data={{
          labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
          datasets: [
            {
              data: [2000, 2100, 2500, 2200],
              color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`, // Green
              strokeWidth: 2,
            },
            {
              data: [800, 900, 750, 850, 950, 1000],
              color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`, // Red
              strokeWidth: 2,
            },
          ],
        }}
        width={screenWidth - 60} // from react-native
        height={220}
        chartConfig={{
          backgroundColor: "#1E2A3B",
          backgroundGradientFrom: "#1E2A3B",
          backgroundGradientTo: "#1E2A3B",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "6",
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  </ScrollView>
);

const Expenses = () => (
  <ScrollView style={{ padding: 20 }}>
    <PieChart
      data={dummyData.expenses.map((expense, index) => ({
        name: expense.category,
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
    <BarChart
      data={{
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        datasets: [
          {
            data: [150, 200, 250, 300],
          },
        ],
      }}
      width={screenWidth - 40}
      height={220}
      yAxisLabel="$"
      yAxisSuffix="k"
      chartConfig={{
        backgroundColor: "#1E2A3B",
        backgroundGradientFrom: "#1E2A3B",
        backgroundGradientTo: "#1E2A3B",
        decimalPlaces: 2,
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
          borderRadius: 16,
        },
      }}
      style={{
        marginVertical: 8,
        borderRadius: 16,
      }}
    />
  </ScrollView>
);

const Income = () => (
  <ScrollView style={{ padding: 20 }}>
    <LineChart
      data={{
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        datasets: [
          {
            data: [2000, 2100, 2500, 2200],
            color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
            strokeWidth: 2,
          },
        ],
      }}
      width={screenWidth - 40}
      height={220}
      chartConfig={{
        backgroundColor: "#1E2A3B",
        backgroundGradientFrom: "#1E2A3B",
        backgroundGradientTo: "#1E2A3B",
        decimalPlaces: 2,
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
          borderRadius: 16,
        },
        propsForDots: {
          r: "6",
        },
      }}
      bezier
      style={{
        marginVertical: 8,
        borderRadius: 16,
      }}
    />
  </ScrollView>
);

const Savings = () => (
  <ScrollView style={{ padding: 20 }}>
    {dummyData.goals.map((goal) => {
      const progress = goal.saved / goal.target;
      return (
        <View key={goal.id} className="bg-[#1E2A3B] rounded-lg p-5 mb-5">
          <View className="flex-row justify-between items-center">
            <Text className="text-white text-lg font-bold">{goal.name}</Text>
            <Text className="text-white text-lg font-bold">
              ${goal.saved} / ${goal.target}
            </Text>
          </View>
          <ProgressBar
            progress={progress}
            color="#36A2EB"
            style={{ marginTop: 10 }}
          />
          <Text className="text-[#3498db] text-base mt-1">
            {(progress * 100).toFixed(2)}%
          </Text>
        </View>
      );
    })}
  </ScrollView>
);

const Reports = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "overview", title: "Overview" },
    { key: "income", title: "Income" },
    { key: "expenses", title: "Expenses" },
    { key: "savings", title: "Savings" },
  ]);

  const renderScene = SceneMap({
    overview: Overview,
    income: Income,
    expenses: Expenses,
    savings: Savings,
  });

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#161E2B", paddingBottom: 10 }}
    >
      {/* <AppBar /> */}
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
            tabStyle={{ width: 200 }}
            contentContainerStyle={{ flexGrow: 1 }}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Reports;
