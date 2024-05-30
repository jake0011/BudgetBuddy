import React, { Fragment, useState } from "react";
import { Link, useRouter } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import SafeAreaViewAndroid from "@/components/global/SafeAreaViewAndroid";
import { useAuthStore } from "@/stores/auth";

const OnboardingScreen: React.FC = () => {
  const [activeScreenIndex, setActiveScreenIndex] = useState(0);
  const setOnBoarded = useAuthStore((state) => state.setOnBoarded);
  const router = useRouter();

  const onboardingScreens = [
    {
      title: "Welcome to BudgetBuddy!",
      description:
        "Track your expenses, manage your budget, and achieve your financial goals. BudgetBuddy provides intuitive features and insightful analytics to help you take control of your finances and make informed decisions.",
      image: require("../../../../assets/images/welcome.jpg"),
    },
    {
      title: "Expense Tracking",
      description:
        "Easily track your expenses and categorize them to gain a clear understanding of where your money is going. BudgetBuddy helps you stay on top of your spending habits and identify areas where you can save.",
      image: require("../../../../assets/images/expenseTracking.jpg"),
    },
    {
      title: "Budget Management",
      description:
        "Create personalized budgets and set spending limits for different categories. BudgetBuddy helps you stay within your budget and provides real-time updates on your progress.",
      image: require("../../../../assets/images/budgetManagement.png"),
    },
    {
      title: "Financial Goals",
      description:
        "Set financial goals and track your progress towards achieving them. Whether you're saving for a vacation, a new car, or a down payment on a house, BudgetBuddy helps you stay motivated and on track.",
      image: require("../../../../assets/images/financialGoals.jpg"),
    },
    {
      title: "Let's get going!",
      description:
        "Sign up or log in now to start managing your finances with BudgetBuddy.",
      image: require("../../../../assets/images/getStarted.png"),
    },
  ];

  const currentScreen = onboardingScreens[activeScreenIndex];

  const handleOnboardingComplete = () => {
    setOnBoarded(true);
    router.replace("/login");
  };

  const onSkip = () => {
    handleOnboardingComplete();
  };

  const onNext = () => {
    const nextIndex = activeScreenIndex + 1;
    if (nextIndex < onboardingScreens.length) {
      setActiveScreenIndex(nextIndex);
    }
  };

  const onBack = () => {
    const nextIndex = activeScreenIndex - 1;
    if (nextIndex >= 0) {
      setActiveScreenIndex(nextIndex);
    }
  };

  return (
    <Fragment>
      <SafeAreaView style={SafeAreaViewAndroid.AndroidSafeArea}>
        <View className="h-1/2 flex">
          <View className="flex flex-row justify-between mx-4">
            {activeScreenIndex === 0 ? (
              <TouchableOpacity
                className="p-2 rounded-2xl bg-gray-800 justify-start"
                onPress={onBack}
              ></TouchableOpacity>
            ) : (
              <TouchableOpacity
                className="p-2 px-4 rounded-2xl my-4 bg-gray-900 justify-start"
                onPress={onBack}
              >
                <Text className="text-white font-bold">Back</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              className="p-2 px-4 rounded-2xl my-4 bg-gray-900"
              onPress={onSkip}
            >
              <Text className="text-white font-bold">Skip</Text>
            </TouchableOpacity>
          </View>
          <View className="items-center">
            <Image
              source={currentScreen.image}
              className="h-4/5 w-4/5 rounded-2xl mt-8 items-center"
              resizeMode="cover"
            />
          </View>
        </View>
        <View className="h-1/2 p-6 color-white">
          <View className="items-center justify-center h-1/2 color-white">
            <Text className="text-2xl text-center font-bold mb-2 color-white">
              {currentScreen.title}
            </Text>
            <Text className="text-lg text-center mb-6 color-white">
              {currentScreen.description}
            </Text>
          </View>

          <View className="flex-col items-center justify-center h-1/2 color-white">
            {activeScreenIndex < onboardingScreens.length - 1 ? (
              <TouchableOpacity
                activeOpacity={0.5}
                className={`py-4 px-4 mb-4 w-64 rounded-2xl ${
                  activeScreenIndex === 0
                    ? "bg-orange-100"
                    : activeScreenIndex === 1
                    ? "bg-red-200"
                    : activeScreenIndex === 2
                    ? "bg-red-200"
                    : activeScreenIndex === 3
                    ? "bg-gray-200"
                    : "bg-red-300"
                }`}
                onPress={onNext}
              >
                <Text className="text-center text-2xl text-black">Next</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.5}
                className="bg-rose-200 text-white py-4 px-4 w-64 rounded-2xl"
                onPress={handleOnboardingComplete}
              >
                <Text className="text-center text-2xl text-black">
                  Get Started
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View className="flex flex-row items-center justify-center pt-2">
            {onboardingScreens.map((screen, index) => (
              <View
                key={index}
                className={`w-2 h-2 rounded-full mx-1 ${
                  index === activeScreenIndex ? "bg-gray-500" : "bg-gray-300"
                }`}
              />
            ))}
          </View>
        </View>
      </SafeAreaView>
    </Fragment>
  );
};

export default OnboardingScreen;
