import React, { useState, useCallback } from "react"; // Importing necessary hooks from React
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native"; // Importing components from react-native
import { PieChart } from "react-native-chart-kit"; // Importing PieChart component from react-native-chart-kit
import { ProgressBar } from "react-native-paper"; // Importing ProgressBar component from react-native-paper
import { TabView, SceneMap, TabBar } from "react-native-tab-view"; // Importing components for tab navigation
import { MaterialIcons } from "@expo/vector-icons"; // Importing icons from expo vector icons
import useSWR from "swr"; // Importing SWR for data fetching
import { useAuthStore } from "@/stores/auth"; // Importing custom hook for authentication store
import { getReportData } from "@/services/incomeService"; // Importing service to get report data
import { Spinner } from "tamagui"; // Importing Spinner component from tamagui
import { useDateStore } from "@/stores/date"; // Importing custom hook for date store

// Getting the screen width for responsive design
const screenWidth = Dimensions.get("window").width;

// Predefined colors for the charts
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

// AppBar component to display the top bar with title and filter icon
const AppBar = () => (
  <View
    style={{
      flexDirection: "row", // Align items in a row
      justifyContent: "space-between", // Space out items evenly
      alignItems: "center", // Center items vertically
      padding: 20, // Add padding
      backgroundColor: "#1E2A3B", // Background color
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

// Overview component to display the total balance, income, and expenses
const Overview = ({ data }) => (
  <ScrollView style={{ padding: 20 }}>
    <View className="bg-[#1E2A3B] rounded-lg p-5 mb-5">
      <Text className="text-white font-bold text-lg mb-2">Total Balance</Text>
      <Text className="text-white text-4xl font-bold">
        $
        {(
          data.income.reduce((acc, item) => acc + item.amount, 0) - // Calculate total income
          data.expenses.reduce((acc, item) => acc + item.amount, 0)
        ) // Subtract total expenses
          .toFixed(2)}
      </Text>
    </View>
    <View className="flex-row justify-between mb-5">
      <View className="bg-[#1E2A3B] rounded-lg p-5 flex-1 mx-1">
        <Text className="text-white font-bold text-lg mb-2">Income</Text>
        <Text className="text-green-500 text-2xl font-bold">
          ${data.income.reduce((acc, item) => acc + item.amount, 0).toFixed(2)}{" "}
          // Display total income
        </Text>
      </View>
      <View className="bg-[#1E2A3B] rounded-lg p-5 flex-1 mx-1">
        <Text className="text-white font-bold text-lg mb-2">Expenses</Text>
        <Text className="text-red-500 text-2xl font-bold">
          $
          {data.expenses.reduce((acc, item) => acc + item.amount, 0).toFixed(2)}{" "}
          // Display total expenses
        </Text>
      </View>
    </View>
  </ScrollView>
);

// Expenses component to display the expenses in a pie chart and list
const Expenses = ({ data }) => {
  // Filter out savings from expenses
  const filteredExpenses = data.expenses.filter(
    (expense) => expense.categoryName !== "Savings"
  );

  return (
    <ScrollView style={{ padding: 20 }}>
      {filteredExpenses.length > 0 ? ( // Check if there are any expenses
        <>
          <PieChart
            data={filteredExpenses.map((expense, index) => ({
              name: expense.categoryName, // Category name
              amount: expense.amount, // Amount spent
              color: predefinedColors[index % predefinedColors.length], // Assign color
              legendFontColor: "#FFF", // Legend font color
              legendFontSize: 15, // Legend font size
            }))}
            width={screenWidth - 40} // Chart width
            height={220} // Chart height
            chartConfig={{
              backgroundColor: "#1E2A3B", // Background color
              backgroundGradientFrom: "#1E2A3B", // Gradient start color
              backgroundGradientTo: "#1E2A3B", // Gradient end color
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Chart color
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Label color
              decimalPlaces: 2, // Decimal places
            }}
            accessor={"amount"} // Data accessor
            backgroundColor={"transparent"} // Background color
            paddingLeft={"15"} // Padding left
            absolute // Absolute positioning
            hasLegend={true} // Show legend
            center={[0, 0]} // Center the chart
          />
          {filteredExpenses.map((expense, index) => (
            <View
              key={index}
              className="bg-[#1E2A3B] flex flex-row justify-between rounded-lg p-5 mb-5"
            >
              <Text className="text-white text-lg font-bold">
                {expense.categoryName} // Display category name
              </Text>
              <Text className="text-gray-200 font-semibold">
                GHS {expense.amount} // Display amount spent
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

// Income component to display the income in a pie chart and list
const Income = ({ data }) => (
  <ScrollView style={{ padding: 20 }}>
    <View className="bg-[#1E2A3B]  rounded-lg p-5 mb-5">
      <Text className="text-white font-bold text-lg mb-2">Total Income</Text>
      <Text className="text-white text-4xl font-bold">
        ${data.income.reduce((acc, item) => acc + item.amount, 0)} // Display
        total income
      </Text>
    </View>
    {data && data.income.length > 0 ? ( // Check if there is any income
      <>
        <PieChart
          data={data.income.map((source, index) => ({
            name: source.source, // Source of income
            amount: source.amount, // Amount earned
            color: predefinedColors[index % predefinedColors.length], // Assign color
            legendFontColor: "#FFF", // Legend font color
            legendFontSize: 15, // Legend font size
          }))}
          width={screenWidth - 40} // Chart width
          height={220} // Chart height
          chartConfig={{
            backgroundColor: "#1E2A3B", // Background color
            backgroundGradientFrom: "#1E2A3B", // Gradient start color
            backgroundGradientTo: "#1E2A3B", // Gradient end color
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Chart color
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Label color
            decimalPlaces: 2, // Decimal places
          }}
          accessor={"amount"} // Data accessor
          backgroundColor={"transparent"} // Background color
          paddingLeft={"15"} // Padding left
          absolute // Absolute positioning
          hasLegend={true} // Show legend
          center={[0, 0]} // Center the chart
        />
        <View className="border-b border-gray-600 mb-5" />
        {data.income.map((source, index) => (
          <View
            key={index}
            className="bg-[#1E2A3B] flex flex-row justify-between rounded-lg p-5 mb-5"
          >
            <Text className="text-white text-lg font-bold">
              {source.source} // Display source of income
            </Text>
            <Text className="text-gray-200 font-semibold">
              GHS {source.amount} // Display amount earned
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

// Savings component to display the savings expenses
const Savings = ({ data }) => {
  // Find savings expenses
  const savingsExpenses =
    data.expenses.find((expense) => expense.categoryName === "Savings")
      ?.expenses || [];

  // Map goals to their titles
  const goalsMap = data.goals.reduce((acc, goal) => {
    acc[goal.goalsId] = goal.title;
    return acc;
  }, {});

  // Map savings expenses to their names
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
      {savingsWithNames.length > 0 ? ( // Check if there are any savings expenses
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

// Main Reports component to display the tab view with different reports
const Reports = () => {
  const [index, setIndex] = useState(0); // State to manage the current tab index
  const [routes] = useState([
    { key: "overview", title: "Overview" },
    { key: "income", title: "Income" },
    { key: "expenses", title: "Expenses" },
    { key: "savings", title: "Savings" },
  ]); // Define the routes for the tabs

  const user = useAuthStore((state) => state.user); // Get the user from the auth store
  const drawerDate = useDateStore((state) => state.drawerDate); // Get the selected date from the date store

  // Fetcher function to get the report data
  const fetcher = useCallback(async () => {
    return await getReportData(user?.userId, drawerDate.month, drawerDate.year);
  }, [user?.userId, drawerDate.month, drawerDate.year]);

  // Use SWR to fetch the data
  const { data, error, isLoading } = useSWR(`/report/data`, fetcher);

  // Define the scenes for the tabs
  const renderScene = SceneMap({
    overview: () => <Overview data={data} />,
    income: () => <Income data={data} />,
    expenses: () => <Expenses data={data} />,
    savings: () => <Savings data={data} />,
  });

  // Display error message if data fetching fails
  if (error)
    return (
      <SafeAreaView className="flex bg-[#161E2B] h-screen justify-center items-center">
        <Text className="text-white text-center">Failed to load data</Text>
      </SafeAreaView>
    );

  // Display loading spinner while data is being fetched
  if (isLoading)
    return (
      <SafeAreaView className="flex bg-[#161E2B] h-screen justify-center items-center">
        <Spinner size="large" color="white" />
      </SafeAreaView>
    );

  // Render the tab view with the fetched data
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#161E2B", paddingBottom: 10 }}
    >
      <TabView
        navigationState={{ index, routes }} // Set the navigation state
        renderScene={renderScene} // Render the scenes
        onIndexChange={setIndex} // Handle tab index change
        initialLayout={{ width: screenWidth }} // Set the initial layout
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: "white", height: 3 }} // Indicator style
            style={{ backgroundColor: "#1E2A3B" }} // Tab bar style
            labelStyle={{ color: "white" }} // Label style
            scrollEnabled={true} // Enable scrolling
            tabStyle={{ width: Dimensions.get("window").width / 4 }} // Tab style
            contentContainerStyle={{ flexGrow: 1 }} // Content container style
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Reports; // Export the Reports component as default
