import React, { useState, useEffect, useCallback } from "react";
import { View, Text, SafeAreaView, FlatList, Dimensions } from "react-native";
import { ProgressBar } from "react-native-paper";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import useSWR from "swr";
import { useAuthStore } from "@/stores/auth";
import { getSummaryData } from "@/services/incomeService";
import { Spinner } from "tamagui";
import { useDateStore } from "@/stores/date";

// Get the screen width of the device
const screenWidth = Dimensions.get("window").width;

// Array of financial tips to display
const tips = [
  "Save at least 20% of your income.",
  "Track your expenses regularly.",
  "Invest in a diversified portfolio.",
  "Set financial goals and stick to them.",
];

const Dashboard = () => {
  // State to keep track of the current tip index
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // Get the user and date information from the stores
  const user = useAuthStore((state) => state.user);
  const tabDate = useDateStore((state) => state.tabDate);

  // Function to fetch summary data based on user ID and date
  const fetcher = useCallback(async () => {
    return await getSummaryData(user?.userId, tabDate.month, tabDate.year);
  }, [user?.userId, tabDate.month, tabDate.year]);

  // Use SWR to fetch data and handle loading and error states
  const { data, error, isLoading } = useSWR(
    `/summary/data/${tabDate.month}/${tabDate.year}`,
    fetcher
  );

  // Effect to change the tip every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Function to render different types of items in the list
  const renderItem = ({ item }) => {
    switch (item.type) {
      case "welcome":
        return (
          // Container for the welcome message
          <View className="mb-5">
            {/* Welcome text displaying the username */}
            <Text className="text-white text-center capitalize text-4xl font-bold mb-2">
              Welcome {user?.username}
            </Text>
            {/* A horizontal line below the welcome text */}
            <View className="border-b border-gray-600 mb-5" />
          </View>
        );
      case "tips":
        return (
          // Container for the tips section
          <View className="bg-[#1E2A3B] rounded-lg p-5 mb-5">
            {/* Title for the tips section */}
            <Text className="text-white font-bold text-lg mb-2">
              Tips of the Day
            </Text>
            {/* Animated view for the tips text */}
            <Animated.View
              entering={FadeIn}
              exiting={FadeOut}
              key={currentTipIndex}
            >
              {/* Display the current tip */}
              <Text className="text-white text-lg">
                {tips[currentTipIndex]}
              </Text>
            </Animated.View>
          </View>
        );
      case "balance":
        return (
          // Container for the total balance section
          <View className="bg-[#1E2A3B] rounded-lg p-5 mb-5">
            {/* Title for the total balance section */}
            <Text className="text-white font-bold text-lg mb-2">
              Total Balance
            </Text>
            {/* Display the calculated total balance */}
            <Text className="text-white text-4xl font-bold">
              {data.income.reduce((acc, item) => acc + item.amount, 0) -
                data.expenses.reduce((acc, item) => acc + item.amount, 0)}
            </Text>
          </View>
        );
      case "quickStats":
        return (
          // Container for the quick stats section
          <View className="flex-row justify-between mb-5">
            {/* Container for the income stats */}
            <View className="bg-[#1E2A3B] rounded-lg p-5 flex-1 mx-1">
              {/* Title for the income stats */}
              <Text className="text-white font-bold text-lg mb-2">Income</Text>
              {/* Display the total income */}
              <Text className="text-green-500 text-2xl font-bold">
                {data.income.reduce((acc, item) => acc + item.amount, 0)}
              </Text>
            </View>
            {/* Container for the expenses stats */}
            <View className="bg-[#1E2A3B] rounded-lg p-5 flex-1 mx-1">
              {/* Title for the expenses stats */}
              <Text className="text-white font-bold text-lg mb-2">
                Expenses
              </Text>
              {/* Display the total expenses */}
              <Text className="text-red-500 text-2xl font-bold">
                {data.expenses.reduce((acc, item) => acc + item.amount, 0)}
              </Text>
            </View>
          </View>
        );
      case "goals":
        return (
          // Container for the goals section
          <View className="bg-[#1E2A3B] rounded-lg p-5 mb-5">
            {/* Title for the goals section */}
            <Text className="text-white font-bold text-lg mb-2">Goals</Text>
            {data.goals.length > 0 ? (
              // Map through the goals and display each one
              data.goals.map((goal) => (
                <View key={goal.goalsId} className="mb-4">
                  {/* Display the goal title */}
                  <Text className="text-white text-base mb-1">
                    {goal.title}
                  </Text>
                  {/* Progress bar for the goal */}
                  <ProgressBar
                    progress={goal.percentageToGoal / 100}
                    color="#3498db"
                    style={{ marginTop: 10 }}
                  />
                  {/* Display the percentage to goal */}
                  <Text className="text-[#3498db] text-base mt-1">
                    {goal.percentageToGoal}%
                  </Text>
                </View>
              ))
            ) : (
              // Display message if no goals are set
              <Text className="text-white text-center text-lg font-bold py-5">
                No goals set
              </Text>
            )}
          </View>
        );
      case "recentExpenses":
        return (
          // Container for the recent expenses section
          <View className="bg-[#1E2A3B] rounded-lg p-5 mb-5">
            {/* Title for the recent expenses section */}
            <Text className="text-white font-bold text-lg mb-2">
              Recent Expenses
            </Text>
            {data.recentExpenses.length > 0 ? (
              // Map through the recent expenses and display each one
              data.recentExpenses.map((expense) => (
                <View
                  key={expense.expendituresId}
                  className="flex-row justify-between mb-2"
                >
                  {/* Display the expense category */}
                  <Text className="text-white text-base">
                    {expense.categoryName}
                  </Text>
                  {/* Display the expense amount */}
                  <Text className="text-white text-base font-bold">
                    {expense.amount}
                  </Text>
                  {/* Display the date of the expense */}
                  <Text className="text-gray-400 text-sm">
                    {expense.createdAt.split("T")[0]}
                  </Text>
                </View>
              ))
            ) : (
              // Display message if no recent expenses are found
              <Text className="text-white text-center text-lg font-bold py-5">
                No recent expenses
              </Text>
            )}
          </View>
        );
      default:
        return null;
    }
  };

  // Array of data items to be rendered in the FlatList
  const dataItems = [
    { id: "welcome", type: "welcome" },
    { id: "tips", type: "tips" },
    { id: "balance", type: "balance" },
    { id: "quickStats", type: "quickStats" },
    { id: "goals", type: "goals" },
    { id: "recentExpenses", type: "recentExpenses" },
  ];

  // If there's an error, display an error message
  if (error)
    return (
      <SafeAreaView className="flex bg-[#161E2B] h-screen justify-center items-center">
        <Text className="text-white text-center">Failed to load data</Text>
      </SafeAreaView>
    );

  // If data is loading, display a loading spinner
  if (isLoading && !data)
    return (
      <SafeAreaView className="flex bg-[#161E2B] h-screen justify-center items-center">
        <Text className="text-white text-center">
          <Spinner size="large" />
        </Text>
      </SafeAreaView>
    );

  // Main render of the dashboard
  return (
    <SafeAreaView className="flex-1 bg-[#161E2B]">
      <FlatList
        data={dataItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
};

export default Dashboard;
