import SafeAreaViewAndroid from "@/components/global/SafeAreaViewAndroid";
import React from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar } from "tamagui";
import { ChevronRight, Plus } from "@tamagui/lucide-icons";

const DashboardProps = {
  card1: {
    image: require("assets/images/getStarted.png"),
    title: "Card 1 ",
    description: "This is the description for Card 1.",
  },
  card2: {
    image: require("assets/images/getStarted.png"),
    title: "Card 2",
    description: "This is the description for Card 2.",
  },
  card3: {
    image: require("assets/images/getStarted.png"),
    title: "Card 3",
    description: "This is the description for Card 3.",
  },
};

export default function Home() {
  return (
    <View className="w-full h-full bg-gray-900">
      <SafeAreaView style={SafeAreaViewAndroid.AndroidSafeArea}>
        <View className=" flex flex-row w-full h-auto  justify-between">
          <Text className="p-4 text-white text-4xl">Hello, Edem</Text>
          <View className=" flex flex-row gap-2 p-1">
            <Avatar circular size="$5" backgroundColor="$black1">
              <Plus size="$2" color="$blue5" />
            </Avatar>
            <Avatar circular size="$5">
              <Avatar.Image
                accessibilityLabel="Cam"
                // source={require("./assets/images/expenseTracking.jpg")}
                source={{ uri: "./assets/images/expenseTracking.jpg" }}
              />
              <Avatar.Fallback backgroundColor="$black6" />
            </Avatar>
          </View>
        </View>
        <View className="w-full h-full mt-4">
          <TouchableOpacity className="flex flex-row text-black text-2xl items-center ">
            <Text className="text-white pl-4 text-xl ">Home </Text>
            <ChevronRight size="$1" color={"$white2"} />
          </TouchableOpacity>
          {/* 1st card */}
          <View className="w-full h-full mt-1 ">
            <View
              className="w-90 h-1/6 bg-gray-600 rounded-3xl p-1 m-2 overflow-hidden"
              id="card-container"
            >
              <View className="flex flex-col gap-2">
                <Image src="../../../../assets/images/getStarted.png" />
                <Text className="text-white text-2xl px-4">Good News!</Text>
              </View>
            </View>
            <View className="w-full mt-1 ">
              <TouchableOpacity className="flex flex-row text-black text-2xl items-center ">
                <Text className="text-white pl-4 text-xl ">Goals </Text>
                <ChevronRight size="$1" color={"$white2"} />
              </TouchableOpacity>
            </View>
            <View className="w-full h-1/6 flex flex-row gap-2 rounded-3xl p-1 m-1 overflow-scroll ">
              {/* <View
                className="w-2/6 h-full bg-gray-600 rounded-3xl overflow-hidden"
                id="card-container"
              >
                <View className="flex flex-col gap-2" id="content-container">
                  <Image src="../../../../assets/images/getStarted.png" />
                  <Text className="text-white text-2xl px-4">Good News!</Text>
                </View>
              </View>
              <View
                className="w-3/6 h-full bg-gray-600 rounded-3xl overflow-hidden"
                id="card-container"
              >
                <View className="flex flex-col gap-2" id="content-container">
                  <Image src="../../../../assets/images/getStarted.png" />
                  <Text className="text-white text-2xl px-4">Good News!</Text>
                </View>
              </View>
              <View
                className="w-2/6 h-full bg-gray-600 rounded-3xl overflow-hidden"
                id="card-container"
              >
                <View className="flex flex-col gap-2" id="content-container">
                  <Image src="../../../../assets/images/getStarted.png" />
                  <Text className="text-white text-2xl px-4">Good News!</Text>
                </View>
              </View> */}
              <FlatList
                data={[
                  DashboardProps.card1,
                  DashboardProps.card2,
                  DashboardProps.card3,
                ]}
                renderItem={({ item }) => (
                  <View
                    className="h-full mr-4 bg-gray-600 rounded-3xl overflow-hidden"
                    id="card-container"
                  >
                    <View
                      className="flex flex-col gap-2"
                      id="content-container"
                    >
                      {/* <Image src={item.image} /> */}
                      <Text className="text-white text-2xl px-4">
                        {item.title}
                      </Text>
                     
                    </View>
                  </View>
                )}
                horizontal
                keyExtractor={(item) => item.title}
              />
            </View>
            <View className="w-full mt-1  ">
              <TouchableOpacity className="flex flex-row text-black text-2xl items-center ">
                <Text className="text-white pl-4 text-xl ">
                  Expenses Category (October){" "}
                </Text>
                <ChevronRight size="$1" color={"$white2"} />
              </TouchableOpacity>
            </View>
            <View
              className="w-90 h-2/6 bg-gray-600 rounded-3xl p-2 m-3 overflow-hidden"
              id="card-container"
            >
              <View className="flex flex-col gap-2">
                <Image src="../../../../assets/images/getStarted.png" />
                <Text className="text-white text-2xl px-4">Good News!</Text>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
