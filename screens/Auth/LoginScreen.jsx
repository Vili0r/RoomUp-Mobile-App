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
import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { ModalHeader } from "../../components";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import axiosConfig from "../../helpers/axiosConfig";
import * as SecureStore from "expo-secure-store";
import * as Facebook from "expo-auth-session/providers/facebook";
import * as Google from "expo-auth-session/providers/google";
import * as AppleAuthentication from "expo-apple-authentication";
import * as WebBrowser from "expo-web-browser";
import { useMutation } from "@tanstack/react-query";

WebBrowser.maybeCompleteAuthSession();
const LoginScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(AuthContext);

  const [_, __, fbPromptAsync] = Facebook.useAuthRequest({
    clientId: "733345738609829",
  });

  const [___, ____, googlePromptAsync] = Google.useAuthRequest({
    iosClientId:
      "51453922065-r4rebu0usq1776e4qh9qvsdag6dk77uh.apps.googleusercontent.com",
  });

  const facebookAuthentication = useMutation(async () => {
    const response = await fbPromptAsync();
    if (response.type === "success") {
      const { access_token } = response.params;

      setIsLoading(true);
      await axiosConfig
        .post("/auth/facebook/social-login", {
          token: access_token,
          device_name: "mobile",
        })
        .then((res) => {
          const userResponse = {
            token: res.data.token,
            id: res.data.user.id,
            first_name: res.data.user.first_name,
            email: res.data.user.email,
            avatar: res.data.user.avatar,
          };
          setUser(userResponse);
          setError(null);
          SecureStore.setItemAsync("user", JSON.stringify(userResponse));
          setIsLoading(false);

          navigation.goBack(); // Go back to the previous screen
        })
        .catch((error) => {
          setError(error.response.data.message);
          setIsLoading(false);
          const key = Object.keys(error.response.data.errors)[0];
          setError(error.response.data.errors[key][0]);
        });
    }
  });

  const googleAuthentication = useMutation(async () => {
    const response = await googlePromptAsync();
    if (response.type === "success") {
      const { access_token } = response.params;
      console.log(access_token);

      setIsLoading(true);
      await axiosConfig
        .post("/auth/google/social-login", {
          token: access_token,
          device_name: "mobile",
        })
        .then((res) => {
          const userResponse = {
            token: res.data.token,
            id: res.data.user.id,
            first_name: res.data.user.first_name,
            email: res.data.user.email,
            avatar: res.data.user.avatar,
          };
          setUser(userResponse);
          setError(null);
          SecureStore.setItemAsync("user", JSON.stringify(userResponse));
          setIsLoading(false);

          navigation.goBack(); // Go back to the previous screen
        })
        .catch((error) => {
          console.log(error.response.data.message);
          setError(error.response.data.message);
          setIsLoading(false);
          const key = Object.keys(error.response.data.errors)[0];
          setError(error.response.data.errors[key][0]);
        });
    }
  });

  const appleAuthentication = useMutation(async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      console.log(credential);
    } catch (e) {
      if (e.code === "ERR_REQUEST_CANCELED") {
        console.log(e);
        // handle that the user canceled the sign-in flow
      } else {
        // handle other errors
      }
    }
  });

  const handleLogin = async () => {
    setIsLoading(true);
    await axiosConfig
      .post("/login", {
        email,
        password,
        device_name: "mobile",
      })
      .then((res) => {
        const userResponse = {
          token: res.data.token,
          id: res.data.user.id,
          first_name: res.data.user.first_name,
          email: res.data.user.email,
          avatar: res.data.user.avatar,
        };
        setUser(userResponse);
        setError(null);
        SecureStore.setItemAsync("user", JSON.stringify(userResponse));
        setIsLoading(false);

        navigation.goBack(); // Go back to the previous screen
      })
      .catch((error) => {
        setError(error.response.data.message);
        setIsLoading(false);
        const key = Object.keys(error.response.data.errors)[0];
        setError(error.response.data.errors[key][0]);
      });
  };

  return (
    <KeyboardAwareScrollView
      bounces={false}
      style={styles.container} //style changed to contentContainerStyle
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 bg-white" style={{ backgroundColor: "#877dfa" }}>
        <ModalHeader text="Login to RoomUp" xShown component="login-register" />

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
          {error && <Text className="text-sm text-red-500">{error}</Text>}
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
            <TouchableOpacity
              onPress={() => navigation.navigate("Forgot Password Screen")}
              className="flex items-end"
            >
              <Text className="mb-5 text-gray-700">Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleLogin()}
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
                Login
              </Text>
            </TouchableOpacity>
          </View>
          <Text className="py-5 text-xl font-bold text-center text-gray-700">
            Or
          </Text>
          <View className="flex-row justify-center space-x-12">
            <TouchableOpacity
              onPress={() => googleAuthentication.mutate()}
              className="p-2 bg-gray-100 rounded-2xl"
            >
              <Image
                source={require("../../assets/icons/google.png")}
                className="w-10 h-10"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => appleAuthentication.mutate()}
              className="p-2 bg-gray-100 rounded-2xl"
            >
              <Image
                source={require("../../assets/icons/apple.png")}
                className="w-10 h-10"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => facebookAuthentication.mutate()}
              className="p-2 bg-gray-100 rounded-2xl"
            >
              <Image
                source={require("../../assets/icons/facebook.png")}
                className="w-10 h-10"
              />
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-center mt-7">
            <Text className="font-semibold text-gray-500">
              Don't have an account?
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Register Screen")}
            >
              <Text className="font-semibold text-yellow-500"> Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flexGrow: 1,
    backgroundColor: "white",
  },
});
