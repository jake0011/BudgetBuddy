import React, { Fragment, useState } from "react";
import { Link } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";

// import { Image } from "expo-image";

interface OnboardingScreenProps {
  title: string;
  description: string;
  image: number;
}


const handleOnboardingComplete = () => {
  // Logic for completing the onboarding process
};

const OnboardingScreen: React.FC = () => {
  const [activeScreenIndex, setActiveScreenIndex] = useState(0);

  /**
   * Handles the skip action, which completes the onboarding process.
   *
   * @return {void} No return value.
   */
  const onSkip = () => {
    // Complete the onboarding process.
    handleOnboardingComplete();
  };

  /**
   * Updates the active screen index to the next index in the onboardingScreens array.
   *
   * @return {void} No return value.
   */
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

  const onboardingScreens: OnboardingScreenProps[] = [
    {
      title: "Welcome to BudgetBuddy!",
      description:
        "Track your expenses, manage your budget, and achieve your financial goals. BudgetBuddy provides intuitive features and insightful analytics to help you take control of your finances and make informed decisions.",
      image: require("../../../assets/images/welcome.jpg"),
    },
    {
      title: "Expense Tracking",
      description:
        "Easily track your expenses and categorize them to gain a clear understanding of where your money is going. BudgetBuddy helps you stay on top of your spending habits and identify areas where you can save.",
      image: require("../../../assets/images/expenseTracking.jpg"),
    },
    {
      title: "Budget Management",
      description:
        "Create personalized budgets and set spending limits for different categories. BudgetBuddy helps you stay within your budget and provides real-time updates on your progress.",
      image: require("../../../assets/images/budgetManagement.png"),
    },
    {
      title: "Financial Goals",
      description:
        "Set financial goals and track your progress towards achieving them. Whether you're saving for a vacation, a new car, or a down payment on a house, BudgetBuddy helps you stay motivated and on track.",
      image: require("../../../assets/images/financialGoals.jpg"),
    },
    {
      title: "Let's get going!",
      description:
        "Sign up or log in now to start managing your finances with BudgetBuddy.",
      image: require("../../../assets/images/getStarted.png"),
    },
  ];

  const currentScreen = onboardingScreens[activeScreenIndex];

  return (
    <Fragment>
      <SafeAreaView className="flex-1 bg-gray-800  my-auto">
        <View className="h-1/2 flex">
          {/* TODO: Make this logic better. */}

          <View className=" flex flex-row  justify-between mx-4">
            {activeScreenIndex === onboardingScreens.length - 5 ? (
              <TouchableOpacity   
                className=" p-4  rounded-3xl bg-gray-800  justify-start"
                onPress={onBack}
              ></TouchableOpacity>
            ) : (
              <TouchableOpacity
                className=" p-4  rounded-3xl bg-gray-900 justify-start"
                onPress={onBack}
              >
                <Text className="text-white font-bold">Back</Text>
              </TouchableOpacity>
            )}

            <Link
              className={`p-4 rounded-3xl bg-gray-900 `}
              href="/signup"
              asChild
            >
              <TouchableOpacity className=" p-4 rounded-2xl bg-gray-900 ">
                <Text className="text-white font-bold">Skip</Text>
              </TouchableOpacity>
            </Link>
          </View>
          <View className="items-center">
            {/* {console.log(currentScreen.image)} */}
            <Image
              // source={{ uri: currentScreen.image }}
              source={currentScreen.image}
              // source = {require('../../../assets/images/onboarding-5.jpg')}
              className="h-4/5 w-4/5 rounded-2xl mt-8 items-center"
              // contentFit="cover"
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
              <>
                <TouchableOpacity
                  activeOpacity={0.5}
                  className={`${
                    activeScreenIndex === onboardingScreens.length - 5
                      ? "bg-orange-100"
                      : activeScreenIndex === onboardingScreens.length - 4
                      ? "bg-red-200"
                      : activeScreenIndex === onboardingScreens.length - 3
                      ? "bg-red-200"
                      : activeScreenIndex === onboardingScreens.length - 2
                      ? "bg-gray-200"
                      : "bg-red-300"
                  }  py-4 px-4 mb-4 w-64 rounded-2xl`}
                  onPress={onNext}
                >
                  <Text className="text-center text-2xl text-black">Next</Text>
                </TouchableOpacity>
              </>
            ) : (
              <Link href="/signup" asChild>
                <TouchableOpacity
                  activeOpacity={0.5}
                  className="bg-rose-200 text-white py-4 px-4 w-64 rounded-2xl"
                  onPress={handleOnboardingComplete}
                >
                  <Text className="text-center text-2xl text-black">
                    Get Started
                  </Text>
                </TouchableOpacity>
              </Link>
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
