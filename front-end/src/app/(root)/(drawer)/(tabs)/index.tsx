import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, FlatList, Dimensions } from "react-native";
import { ProgressBar } from "react-native-paper";
import { LineChart } from "react-native-chart-kit";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

const dummyData = {
  totalBalance: "$2,450.75",
  income: "$3,200",
  expenses: "$749.25",
  savingsGoal: 45,
  recentExpenses: [
    { id: 1, category: "Groceries", amount: "$150.25", time: "2 hours ago" },
    { id: 2, category: "Rent", amount: "$600", time: "1 day ago" },
    { id: 3, category: "Utilities", amount: "$100", time: "3 days ago" },
    { id: 4, category: "Dining", amount: "$50", time: "5 days ago" },
  ],
  tips: [
    "Track your expenses daily.",
    "Set a monthly budget and stick to it.",
    "Save at least 20% of your income.",
    "Invest in a diversified portfolio.",
  ],
  goals: [
    { id: 1, name: "Emergency Fund", progress: 70 },
    { id: 2, name: "Vacation", progress: 40 },
    { id: 3, name: "New Car", progress: 20 },
  ],
};

const screenWidth = Dimensions.get("window").width;

const Dashboard = () => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex(
        (prevIndex) => (prevIndex + 1) % dummyData.tips.length
      );
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const renderItem = ({ item }) => {
    switch (item.type) {
      case "welcome":
        return (
          <View className="mb-5">
            <Text className="text-white text-center text-4xl font-bold mb-2">
              Welcome Synx!
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
                {dummyData.tips[currentTipIndex]}
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
              {dummyData.totalBalance}
            </Text>
          </View>
        );
      case "quickStats":
        return (
          <View className="flex-row justify-between mb-5">
            <View className="bg-[#1E2A3B] rounded-lg p-5 flex-1 mx-1">
              <Text className="text-white font-bold text-lg mb-2">Income</Text>
              <Text className="text-green-500 text-2xl font-bold">
                {dummyData.income}
              </Text>
            </View>
            <View className="bg-[#1E2A3B] rounded-lg p-5 flex-1 mx-1">
              <Text className="text-white font-bold text-lg mb-2">
                Expenses
              </Text>
              <Text className="text-red-500 text-2xl font-bold">
                {dummyData.expenses}
              </Text>
            </View>
          </View>
        );
      case "goals":
        return (
          <View className="bg-[#1E2A3B] rounded-lg p-5 mb-5">
            <Text className="text-white font-bold text-lg mb-2">Goals</Text>
            {dummyData.goals.map((goal) => (
              <View key={goal.id} className="mb-4">
                <Text className="text-white text-base mb-1">{goal.name}</Text>
                <ProgressBar
                  progress={goal.progress / 100}
                  color="#3498db"
                  style={{ marginTop: 10 }}
                />
                <Text className="text-[#3498db] text-base mt-1">
                  {goal.progress}%
                </Text>
              </View>
            ))}
          </View>
        );
      case "recentExpenses":
        return (
          <View className="bg-[#1E2A3B] rounded-lg p-5 mb-5">
            <Text className="text-white font-bold text-lg mb-2">
              Recent Expenses
            </Text>
            {dummyData.recentExpenses.map((expense) => (
              <View key={expense.id} className="flex-row justify-between mb-2">
                <Text className="text-white text-base">{expense.category}</Text>
                <Text className="text-white text-base font-bold">
                  {expense.amount}
                </Text>
                <Text className="text-gray-400 text-sm">{expense.time}</Text>
              </View>
            ))}
          </View>
        );
      case "chart":
      case "chart":
        return (
          <View className="bg-[#1E2A3B] rounded-lg p-5 mb-5">
            <Text className="text-white font-bold text-lg mb-2">
              Income vs Expenses
            </Text>
            <LineChart
              data={{
                labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
                datasets: [
                  {
                    data: [800, 900, 750, 850],
                    color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`, // Green
                    strokeWidth: 2,
                  },
                  {
                    data: [200, 300, 250, 400],
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
        );
      default:
        return null;
    }
  };

  const data = [
    { id: "welcome", type: "welcome" },
    { id: "tips", type: "tips" },
    { id: "balance", type: "balance" },
    { id: "quickStats", type: "quickStats" },
    { id: "goals", type: "goals" },
    { id: "recentExpenses", type: "recentExpenses" },
    { id: "chart", type: "chart" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#161E2B]">
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }} // Added paddingBottom
      />
    </SafeAreaView>
  );
};

export default Dashboard;
