import AntDesign from "@expo/vector-icons/AntDesign";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Tabs, usePathname } from "expo-router";
import React, { useState } from "react";
import { View, Image, TouchableOpacity, Modal, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

export default function TabsLayout() {
  const [show, setShow] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from(new Array(101), (val, index) => index + 2000);

  const showPicker = () => {
    setShow(true);
  };

  const handleOk = () => {
    // Handle the OK action here
    setShow(false);
  };

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "white",
        // headerShown: false,
        headerTintColor: "white",
        headerStyle: {
          backgroundColor: "#161E2B",
        },
        headerTitleAlign: "center",
        headerLeft: () => {
          return <DrawerToggleButton tintColor="white" />;
        },
        headerTitle: () => (
          <Image
            source={require("../../../../../assets/logo.png")}
            style={{ width: 100, height: 100 }}
            resizeMode="contain"
          />
        ),
        headerRight: () => {
          return (
            <>
              <TouchableOpacity onPress={showPicker}>
                <MaterialIcons
                  name="calendar-month"
                  size={24}
                  color="white"
                  className="mr-4"
                />
              </TouchableOpacity>
              {show && (
                <Modal
                  transparent={true}
                  animationType="slide"
                  visible={show}
                  onRequestClose={() => setShow(false)}
                >
                  <View
                    className="flex-1 p-8 justify-center items-center bg-transparent bg-opacity-75"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                  >
                    <View className="bg-white rounded-lg p-5 items-center">
                      <View className="flex-row justify-between w-full">
                        <View className="flex-1 items-center">
                          <Text className="text-lg font-bold mb-2">Month</Text>
                          <Picker
                            selectedValue={selectedMonth}
                            onValueChange={(itemValue) =>
                              setSelectedMonth(itemValue)
                            }
                            style={{ width: 150, height: 50 }}
                          >
                            {months.map((month, index) => (
                              <Picker.Item
                                key={index}
                                label={month}
                                value={index}
                              />
                            ))}
                          </Picker>
                        </View>
                        <View className="flex-1 items-center">
                          <Text className="text-lg font-bold mb-2">Year</Text>
                          <Picker
                            selectedValue={selectedYear}
                            onValueChange={(itemValue) =>
                              setSelectedYear(itemValue)
                            }
                            style={{ width: 150, height: 50 }}
                          >
                            {years.map((year, index) => (
                              <Picker.Item
                                key={index}
                                label={year.toString()}
                                value={year}
                              />
                            ))}
                          </Picker>
                        </View>
                      </View>
                      <View className="flex-row justify-end mt-5 w-full">
                        <TouchableOpacity
                          onPress={handleOk}
                          className="bg-green-500 p-4 w-[70px]  rounded mr-2"
                        >
                          <Text className="text-white text-center font-bold">
                            OK
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => setShow(false)}
                          className="bg-red-500 p-4 w-[70px] rounded"
                        >
                          <Text className="text-white text-center font-bold">
                            Close
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Modal>
              )}
            </>
          );
        },
        tabBarInactiveTintColor: "gray",
        tabBarHideOnKeyboard: true,
        tabBarAccessibilityLabel: "Home",
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "bold",
        },
        tabBarStyle: {
          display: usePathname() === "example" ? "none" : "flex",
          position: "absolute",
          elevation: 0,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderWidth: 1,
          borderColor: "#31363F",
          backgroundColor: "#31363F",
          height: 90,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          if (route.name === "index") {
            iconName = "home";
          } else if (route.name === "income/index") {
            iconName = "wallet";
          } else if (route.name === "expenses/index") {
            iconName = "calculator";
          } else if (route.name === "goals/index") {
            iconName = "flag";
          } else if (route.name === "budget/index") {
            iconName = "profile";
          }

          return (
            <View className="items-center justify-center">
              <AntDesign name={iconName} size={24} color={color} />
              {focused && <View className="w-5 h-0.5 bg-white mt-1" />}
            </View>
          );
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="income/index"
        options={{
          title: "Income",
        }}
      />
      <Tabs.Screen
        name="expenses/index"
        options={{
          title: "Expenses",
        }}
      />
      <Tabs.Screen
        name="budget/index"
        options={{
          title: "Budget",
        }}
      />
      <Tabs.Screen
        name="goals/index"
        options={{
          title: "Goals",
        }}
      />
    </Tabs>
  );
}
