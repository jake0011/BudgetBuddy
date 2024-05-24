import React, { Fragment, useState } from "react";
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

interface OnboardingScreenProps {
  title: string;
  description: string;
  image: string;
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

  const onboardingScreens: OnboardingScreenProps[] = [
    {
      title: "Welcome to BudgetBuddy!",
      description:
        "Track your expenses, manage your budget, and achieve your financial goals. BudgetBuddy provides intuitive features and insightful analytics to help you take control of your finances and make informed decisions.",
      image:
        "https://images.pexels.com/photos/2988232/pexels-photo-2988232.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      title: "Expense Tracking",
      description:
        "Easily track your expenses and categorize them to gain a clear understanding of where your money is going. BudgetBuddy helps you stay on top of your spending habits and identify areas where you can save.",
      image:
        "https://images.pexels.com/photos/730564/pexels-photo-730564.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      title: "Budget Management",
      description:
        "Create personalized budgets and set spending limits for different categories. BudgetBuddy helps you stay within your budget and provides real-time updates on your progress.",
      image:
        "https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      title: "Financial Goals",
      description:
        "Set financial goals and track your progress towards achieving them. Whether you're saving for a vacation, a new car, or a down payment on a house, BudgetBuddy helps you stay motivated and on track.",
      image:
        "https://images.pexels.com/photos/3943723/pexels-photo-3943723.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      title: "Get Started",
      description:
        "Sign up or log in now to start managing your finances with BudgetBuddy.",
      image:
        "https://images.pexels.com/photos/8834493/pexels-photo-8834493.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
  ];

  const currentScreen = onboardingScreens[activeScreenIndex];

  return (
    <Fragment>
      <SafeAreaView className="flex-1 bg-gray-800">
        <View className="h-1/2 flex items-center justify-center p-1">
          <Image
            source={{ uri: currentScreen.image }}
            className="h-4/5 w-4/5 rounded-2xl"
            resizeMode="cover"
          />
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
                  className="bg-white text-white py-2 px-4 mb-4 w-64 rounded-2xl"
                  onPress={onNext}
                >
                  <Text className="text-center text-2xl text-black">Next</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.5}
                  className="bg-gray-600 border border-gray-300 py-2 px-4 w-64 rounded-2xl"
                  onPress={onSkip}
                >
                  <Text className="text-center text-2xl text-black-">Skip</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                activeOpacity={0.5}
                className="bg-white text-white py-2 px-4 w-64 rounded-2xl"
                onPress={handleOnboardingComplete}
              >
                <Text className="text-center text-2xl text-black">
                  Get Started
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View className="flex flex-row items-center justify-center mt-2">
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
