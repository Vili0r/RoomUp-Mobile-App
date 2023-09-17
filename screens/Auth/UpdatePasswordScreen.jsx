import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { ModalHeader } from "../../components";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import axiosConfig from "../../helpers/axiosConfig";
import { useRoute } from "@react-navigation/native";

const UpdatePasswordScreen = () => {
  const route = useRoute();
  const token = route.params?.token;
  const [error, setError] = useState(null);
  const [email, setEmail] = useState(route.params?.email);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    setIsLoading(true);
    setStatus(null);

    try {
      const response = await axiosConfig.post("/reset-password", {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      setStatus(response.data.status);
      setIsLoading(false);
    } catch (error) {
      if (error.response.status === 422) {
        setError(error.response.data.errors);
      }
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      bounces={false}
      style={{ flexGrow: 1, backgroundColor: "white" }} //style changed to contentContainerStyle
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 bg-white" style={{ backgroundColor: "#877dfa" }}>
        <ModalHeader text="Reset my password" xShown />

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
            <Text className="ml-4 text-gray-700">Password</Text>
            <TextInput
              className="p-4 text-gray-700 bg-gray-100 rounded-2xl"
              onChangeText={setPassword}
              value={password}
              placeholder="Password"
              placeholderTextColor="gray"
              autoCapitalize="none"
              secureTextEntry={true}
            />
            <View className="mt-3">
              <Text className="mt-4 ml-4 text-gray-700">
                Password Confirmation
              </Text>
              <TextInput
                className="p-4 mb-8 text-gray-700 bg-gray-100 rounded-2xl"
                onChangeText={setPasswordConfirmation}
                value={passwordConfirmation}
                placeholder="Password"
                placeholderTextColor="gray"
                autoCapitalize="none"
                secureTextEntry={true}
              />
            </View>

            <TouchableOpacity
              onPress={() => handleResetPassword()}
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
                Reset Password
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default UpdatePasswordScreen;
