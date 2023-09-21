import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState, useContext } from "react";
import axiosConfig from "../helpers/axiosConfig";
import { AuthContext } from "../context/AuthProvider";
import { useNavigation } from "@react-navigation/native";

const DeleteUser = () => {
  const navigation = useNavigation();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, logout } = useContext(AuthContext);

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    await axiosConfig
      .delete(
        `/profile`,
        {
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((res) => {
        setIsLoading(false);
        logout();
        Alert.alert("Account deleted!");
        navigation.navigate("Search Screen");
      })
      .catch((error) => {
        console.log(error.response.data);
        setError(error.response.data.message);
        setIsLoading(false);
        // const key = Object.keys(error.response.data.errors)[0];
        // setError(error.response.data.errors[key][0]);
      });
    setIsLoading(false);
  };
  return (
    <View className="">
      <View className="w-full">
        <Text className="text-lg font-medium text-gray-900">
          Delete Account
        </Text>

        <Text className="mt-1 text-sm text-gray-600">
          Once your account is deleted, all of its resources and data will be
          permanently deleted. Before deleting your account, please download any
          data or information that you wish to retain.
        </Text>

        {error && (
          <Text className="text-base font-semibold text-red-500">{error}</Text>
        )}
        <View className="mt-4 mb-4 space-y-2 form">
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
        </View>

        <View>
          <TouchableOpacity
            onPress={() => handleDeleteAccount()}
            className="flex flex-row justify-center py-3 bg-red-700 rounded-xl"
          >
            {isLoading && (
              <ActivityIndicator className="mr-2" size="small" color="white" />
            )}
            <Text className="text-xl font-bold text-center text-gray-200">
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default DeleteUser;
