import { YStack, XStack, Card, H3, H4, H5, Circle, Spacer } from "tamagui";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SafeAreaViewAndroid from "@/components/global/SafeAreaViewAndroid";
import { LineChart } from "react-native-chart-kit";
import { Dimensions, ScrollView, Text, View } from "react-native";
import { Calendar } from "@tamagui/lucide-icons";

const screenWidth = Dimensions.get("window").width;

const data = {
  labels: [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43, 50, 75],
      color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
      strokeWidth: 2, // optional
    },
  ],
  legend: ["Cash Flow"], // optional
};

const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false, // optional
};

const CashFlow = () => {
  return (
    <SafeAreaView style={SafeAreaViewAndroid.AndroidSafeArea}>
      <ScrollView
        style={{ padding: 10 }}
        showsVerticalScrollIndicator
        contentContainerStyle={{
          paddingBottom: 150,
        }}
      >
        <>
          <View className="flex flex-row items-start justify-between">
            <Text className="text-white text-2xl ">Cash Flow</Text>
            <Calendar size={24} color="white" />
          </View>
          <ScrollView horizontal={true}>
            <LineChart
              data={data}
              width={1000}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={{
                marginVertical: 16,
                borderRadius: 16,
              }}
            />
          </ScrollView>
          <YStack space="$4">
            <Card
              elevate
              size="$4"
              backgroundColor="$gray8Light"
              borderRadius="$4"
              className="bg-[#161E2B]"
            >
              <Card.Header padded>
                <H3 color="$white">October 2023</H3>
              </Card.Header>
              <Card.Footer padded>
                <YStack space="$2">
                  <XStack alignItems="center" justifyContent="space-between">
                    <XStack alignItems="center">
                      <Circle size="$2" backgroundColor="green" />
                      <Spacer size="$2" />
                      <H4 color="$white">Income</H4>
                    </XStack>
                    <H4 color="$white">$5,850.22</H4>
                  </XStack>
                  <XStack alignItems="center" justifyContent="space-between">
                    <XStack alignItems="center">
                      <Circle size="$2" backgroundColor="red" />
                      <Spacer size="$2" />
                      <H4 color="$white">Expenses</H4>
                    </XStack>
                    <H4 color="$white">$3,650.34</H4>
                  </XStack>
                  <XStack alignItems="center" justifyContent="space-between">
                    <XStack alignItems="center">
                      <Circle size="$2" backgroundColor="yellow" />
                      <Spacer size="$2" />
                      <H4 color="$white">Savings</H4>
                    </XStack>
                    <H4 color="$white">$2,199.88</H4>
                  </XStack>
                </YStack>
              </Card.Footer>
            </Card>
            <Card
              elevate
              size="$4"
              backgroundColor="$gray-800"
              borderRadius="$4"
            >
              <Card.Header padded>
                <H3 color="$white">Income</H3>
              </Card.Header>
              <Card.Footer padded>
                <YStack space="$2">
                  <XStack alignItems="center" justifyContent="space-between">
                    <XStack alignItems="center">
                      <Circle size="$2" backgroundColor="$white" />
                      <Spacer size="$2" />
                      <H4 color="$white">Salary</H4>
                      <Spacer size="$2" />
                      <H5 color="$white">82.87%</H5>
                    </XStack>
                    <H4 color="$white">$4,850.22</H4>
                  </XStack>
                  <XStack alignItems="center" justifyContent="space-between">
                    <XStack alignItems="center">
                      <Circle size="$2" backgroundColor="$white" />
                      <Spacer size="$2" />
                      <H4 color="$white">Investment</H4>
                      <Spacer size="$2" />
                      <H5 color="$white">17.09%</H5>
                    </XStack>
                    <H4 color="$white">$1,000.00</H4>
                  </XStack>
                </YStack>
              </Card.Footer>
            </Card>
            <Card
              elevate
              size="$4"
              backgroundColor="$gray-800"
              borderRadius="$4"
            >
              <Card.Header padded>
                <H3 color="$white">Income</H3>
              </Card.Header>
              <Card.Footer padded>
                <YStack space="$2">
                  <XStack alignItems="center" justifyContent="space-between">
                    <XStack alignItems="center">
                      <Circle size="$2" backgroundColor="$white" />
                      <Spacer size="$2" />
                      <H4 color="$white">Salary</H4>
                      <Spacer size="$2" />
                      <H5 color="$white">82.87%</H5>
                    </XStack>
                    <H4 color="$white">$4,850.22</H4>
                  </XStack>
                  <XStack alignItems="center" justifyContent="space-between">
                    <XStack alignItems="center">
                      <Circle size="$2" backgroundColor="$white" />
                      <Spacer size="$2" />
                      <H4 color="$white">Investment</H4>
                      <Spacer size="$2" />
                      <H5 color="$white">17.09%</H5>
                    </XStack>
                    <H4 color="$white">$1,000.00</H4>
                  </XStack>
                </YStack>
              </Card.Footer>
            </Card>
          </YStack>
        </>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CashFlow;
