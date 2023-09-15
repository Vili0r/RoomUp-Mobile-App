import { View, Text } from "react-native";
import React from "react";
import { useRoute } from "@react-navigation/native";

const ResetPasswordScreen = () => {
  const route = useRoute();
  const token = route.params?.token;

  return (
    <View>
      <Text>Reset Password Screen</Text>
    </View>
  );
};

export default ResetPasswordScreen;
