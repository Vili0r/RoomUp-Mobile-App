import {
  SafeAreaView,
  StyleSheet,
  Platform,
  StatusBar,
  Text,
  Button,
  View,
} from "react-native";
import React from "react";

const SearchScreen = () => {
  return (
    <SafeAreaView style={styles.container} className="flex-1 bg-white">
      <StatusBar />
      <View className="items-center justify-center flex-1">
        <Text>Search!</Text>
        <Button
          title="Go to Home"
          onPress={() => navigation.navigate("Home")}
        />
      </View>
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
