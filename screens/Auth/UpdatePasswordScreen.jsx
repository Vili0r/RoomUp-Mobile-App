import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
  StyleSheet,
  StatusBar,
} from "react-native";
import React, { useState, useContext } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import axiosConfig from "../../helpers/axiosConfig";
import { AuthContext } from "../../context/AuthProvider";
import { ModalHeader } from "../../components";

const UpdatePasswordScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordUpdate = async () => {
    setIsLoading(true);

    try {
      await axiosConfig
        .put(
          `/password`,
          {
            current_password: currentPassword,
            password,
            password_confirmation: passwordConfirmation,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        )
        .then((response) => {
          setPassword("");
          setPasswordConfirmation("");
          setCurrentPassword("");
          setIsLoading(false);
          Alert.alert("Password updated!");
          navigation.goBack();
        });
    } catch (error) {
      setError(error.response.data.errors);
      if (error.response.data.errors.password) {
        setPassword("");
        setPasswordConfirmation("");
      }
      if (error.response.data.errors.current_password) {
        setCurrentPassword("");
      }
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  return (
    <KeyboardAwareScrollView
      bounces={false}
      style={styles.container} //style changed to contentContainerStyle
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 bg-white" style={{ backgroundColor: "#877dfa" }}>
        <ModalHeader text="Update your password" xShown />

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
            <View className="flex flex-col">
              {Object.entries(error).map(([fieldName, fieldErrors]) =>
                fieldErrors.map((error, index) => (
                  <Text
                    key={`${fieldName}_${index}`}
                    className="mt-2 ml-4 text-sm text-red-500"
                  >
                    {error}
                  </Text>
                ))
              )}
            </View>
          )}

          <Text className="text-lg font-medium text-gray-900">
            Update Password
          </Text>

          <Text className="mt-1 text-sm text-gray-600">
            Ensure your account is using a long, random password to stay secure.
          </Text>
          <View className="space-y-2 form">
            <Text className="mt-8 ml-4 text-gray-700">Current Password</Text>
            <TextInput
              className="p-4 mb-3 text-gray-700 bg-gray-100 rounded-2xl"
              onChangeText={setCurrentPassword}
              value={currentPassword}
              placeholder="Password"
              placeholderTextColor="gray"
              autoCapitalize="none"
              secureTextEntry={true}
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
                className="p-4 mt-3 mb-8 text-gray-700 bg-gray-100 rounded-2xl"
                onChangeText={setPasswordConfirmation}
                value={passwordConfirmation}
                placeholder="Password"
                placeholderTextColor="gray"
                autoCapitalize="none"
                secureTextEntry={true}
              />
            </View>

            <TouchableOpacity
              onPress={() => handlePasswordUpdate()}
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
                Update Password
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default UpdatePasswordScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flexGrow: 1,
    backgroundColor: "white",
  },
});
