import React, { useState, useEffect, useCallback } from "react";
import { View, Text, SafeAreaView, FlatList, Dimensions } from "react-native";
import { ProgressBar } from "react-native-paper";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import useSWR from "swr";
import { useAuthStore } from "@/stores/auth";
import { getSummaryData } from "@/services/incomeService";
import { Spinner } from "tamagui";

const screenWidth = Dimensions.get("window").width;

const tips = [
  "Save at least 20% of your income.",
  "Track your expenses regularly.",
  "Invest in a diversified portfolio.",
  "Set financial goals and stick to them.",
];

const Dashboard = () => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const user = useAuthStore((state) => state.user);

  const fetcher = useCallback(async () => {
    return await getSummaryData(user?.userId);
  }, [user?.userId]);

  const { data, error, isLoading } = useSWR(`/summary/data`, fetcher);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const renderItem = ({ item }) => {
    switch (item.type) {
      case "welcome":
        return (
          <View className="mb-5">
            <Text className="text-white text-center capitalize text-4xl font-bold mb-2">
              Welcome {user?.username}
            </Text>
            <View className="border-b border-gray-600 mb-5" />
          </View>
        );
      case "tips":
        return (
          <View className="bg-[#1E2A3B] rounded-lg p-5 mb-5">
            <Text className="text-white font-bold text-lg mb-2">
              Tips of the Day
            </Text>
            <Animated.View
              entering={FadeIn}
              exiting={FadeOut}
              key={currentTipIndex}
            >
              <Text className="text-white text-lg">
                {tips[currentTipIndex]}
              </Text>
            </Animated.View>
          </View>
        );
      case "balance":
        return (
          <View className="bg-[#1E2A3B] rounded-lg p-5 mb-5">
            <Text className="text-white font-bold text-lg mb-2">
              Total Balance
            </Text>
            <Text className="text-white text-4xl font-bold">
              {data.income.reduce((acc, item) => acc + item.amount, 0) -
                data.expenses.reduce((acc, item) => acc + item.amount, 0)}
            </Text>
          </View>
        );
      case "quickStats":
        return (
          <View className="flex-row justify-between mb-5">
            <View className="bg-[#1E2A3B] rounded-lg p-5 flex-1 mx-1">
              <Text className="text-white font-bold text-lg mb-2">Income</Text>
              <Text className="text-green-500 text-2xl font-bold">
                {data.income.reduce((acc, item) => acc + item.amount, 0)}
              </Text>
            </View>
            <View className="bg-[#1E2A3B] rounded-lg p-5 flex-1 mx-1">
              <Text className="text-white font-bold text-lg mb-2">
                Expenses
              </Text>
              <Text className="text-red-500 text-2xl font-bold">
                {data.expenses.reduce((acc, item) => acc + item.amount, 0)}
              </Text>
            </View>
          </View>
        );
      case "goals":
        return (
          <View className="bg-[#1E2A3B] rounded-lg p-5 mb-5">
            <Text className="text-white font-bold text-lg mb-2">Goals</Text>
            {data.goals.length > 0 ? (
              data.goals.map((goal) => (
                <View key={goal.goalsId} className="mb-4">
                  <Text className="text-white text-base mb-1">
                    {goal.title}
                  </Text>
                  <ProgressBar
                    progress={goal.percentageToGoal / 100}
                    color="#3498db"
                    style={{ marginTop: 10 }}
                  />
                  <Text className="text-[#3498db] text-base mt-1">
                    {goal.percentageToGoal}%
                  </Text>
                </View>
              ))
            ) : (
              <Text className="text-white text-center text-lg font-bold py-5">
                No goals set
              </Text>
            )}
          </View>
        );
      case "recentExpenses":
        return (
          <View className="bg-[#1E2A3B] rounded-lg p-5 mb-5">
            <Text className="text-white font-bold text-lg mb-2">
              Recent Expenses
            </Text>
            {data.recentExpenses.length > 0 ? (
              data.recentExpenses.map((expense) => (
                <View
                  key={expense.expendituresId}
                  className="flex-row justify-between mb-2"
                >
                  <Text className="text-white text-base">
                    {expense.categoryName}
                  </Text>
                  <Text className="text-white text-base font-bold">
                    {expense.amount}
                  </Text>
                  <Text className="text-gray-400 text-sm">
                    {expense.createdAt.split("T")[0]}
                  </Text>
                </View>
              ))
            ) : (
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

  const dataItems = [
    { id: "welcome", type: "welcome" },
    { id: "tips", type: "tips" },
    { id: "balance", type: "balance" },
    { id: "quickStats", type: "quickStats" },
    { id: "goals", type: "goals" },
    { id: "recentExpenses", type: "recentExpenses" },
  ];

  if (error)
    return (
      <SafeAreaView className="flex bg-[#161E2B] h-screen justify-center items-center">
        <Text className="text-white text-center">Failed to load data</Text>
      </SafeAreaView>
    );

  if (isLoading && !data)
    return (
      <SafeAreaView className="flex bg-[#161E2B] h-screen justify-center items-center">
        <Text className="text-white text-center">
          <Spinner size="large" />
        </Text>
      </SafeAreaView>
    );

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
