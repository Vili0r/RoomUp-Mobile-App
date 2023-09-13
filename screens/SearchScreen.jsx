import { SafeAreaView, StyleSheet, Platform, StatusBar } from "react-native";
import React from "react";
import { AllProperties } from "../components";

const SearchScreen = () => {
  return (
    <SafeAreaView style={styles.container} className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <AllProperties />
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
