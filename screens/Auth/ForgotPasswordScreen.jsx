import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
} from "react-native";
import React, { useState } from "react";
import { ModalHeader } from "../../components";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import axiosConfig from "../../helpers/axiosConfig";

const ForgotPasswordScreen = () => {
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async () => {
    setIsLoading(true);
    setStatus(null);

    try {
      const response = await axiosConfig.post("/forgot-password", {
        email,
      });
      setStatus(response.data.status);
      setIsLoading(false);
    } catch (error) {
      if (error.response.status === 422) {
        setError(error.response.data.errors);
      }
      setIsLoading(false);
    }
  };
  return (
    <KeyboardAwareScrollView
      bounces={false}
      style={styles.container} //style changed to contentContainerStyle
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 bg-white" style={{ backgroundColor: "#877dfa" }}>
        <ModalHeader text="Forgot my password" xShown />

        <View className="flex-row justify-center">
          <Image
            source={require("../../assets/images/logo.png")}
            style={{ width: 200, height: 200 }}
          />
        </View>

        <View
          style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
          className="px-8 pt-8 bg-white"
        >
          {error && (
            <Text className="mb-3 text-base font-semibold text-red-500">
              {error}
            </Text>
          )}
          {status && (
            <Text className="mb-3 text-base font-semibold text-green-500">
              {status}
            </Text>
          )}
          <Text className="mb-4 text-sm text-gray-600">
            Forgot your password? No problem. Just let us know your email
            address and we will email you a password reset link that will allow
            you to choose a new one.
          </Text>
          <View className="space-y-2 form">
            <Text className="ml-4 text-gray-700">Email Address</Text>
            <TextInput
              className="p-4 mb-3 text-gray-700 bg-gray-100 rounded-2xl"
              onChangeText={setEmail}
              value={email}
              placeholder="Email"
              placeholderTextColor="gray"
              textContentType="emailAddress"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TouchableOpacity
              onPress={() => handleForgotPassword()}
              className="flex flex-row justify-center py-3 bg-yellow-400 rounded-xl"
            >
              {isLoading && (
                <ActivityIndicator
                  className="mr-2"
                  size="small"
                  color="white"
                />
              )}
              <Text className="text-xl font-bold text-center text-gray-700">
                Send Link
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flexGrow: 1,
    backgroundColor: "white",
  },
});
