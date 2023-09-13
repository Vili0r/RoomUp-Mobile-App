import {
  SafeAreaView,
  StyleSheet,
  Platform,
  StatusBar,
  Text,
  Button,
} from "react-native";
import React from "react";

const AccountScreen = () => {
  return (
    <SafeAreaView
      style={styles.container}
      className="items-center justify-center flex-1 bg-white"
    >
      <StatusBar />
      <Text>Account!</Text>

      <Button title="Go to Home" onPress={() => navigation.navigate("Home")} />
    </SafeAreaView>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
