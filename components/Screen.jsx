import {
  SafeAreaView,
  StyleSheet,
  ViewStyle,
  Platform,
  StatusBar,
} from "react-native";
import React from "react";

const Screen = ({ children, className }) => {
  return (
    <SafeAreaView style={styles.container} className={className}>
      <StatusBar />
      {children}
    </SafeAreaView>
  );
};

export default Screen;
