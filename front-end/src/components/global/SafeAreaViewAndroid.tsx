import { StyleSheet, Platform, StatusBar } from "react-native";

export default StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: "rgb(31 41 55)",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : "auto",
  },
});
