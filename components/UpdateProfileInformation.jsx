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
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthProvider";
import * as SecureStore from "expo-secure-store";

const UpdateProfileInformation = ({ user, mustVerifyEmail, status, token }) => {
  const navigation = useNavigation();
  const [email, setEmail] = useState(user?.email);
  const [firstName, setFirstName] = useState(user?.first_name);
  const [lastName, setLastName] = useState(user?.last_name);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user: loggedUser, setUser } = useContext(AuthContext);

  const handleUpdate = async () => {
    setIsLoading(true);
    await axiosConfig
      .put(
        `/users/${user.id}/profile`,
        {
          email,
          first_name: firstName,
          last_name: lastName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        const userResponse = {
          token: loggedUser.token,
          id: res.data.user.id,
          first_name: res.data.user.first_name,
          email: res.data.user.email,
          avatar: res.data.user.avatar,
        };
        setUser(userResponse);
        setError(null);
        SecureStore.setItemAsync("user", JSON.stringify(userResponse));
        setIsLoading(false);
        Alert.alert("Personal information updated!");
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
    <View className="">
      <View className="w-full">
        <Text className="text-lg font-medium text-gray-900">
          Profile Information
        </Text>

        <Text className="mt-1 text-sm text-gray-600">
          Update your account's profile information and email address.
        </Text>
        {error && (
          <Text className="text-base font-semibold text-red-500">{error}</Text>
        )}
        <View className="mt-4 mb-4 space-y-2 form">
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
          <Text className="ml-4 text-gray-700">First Name</Text>
          <TextInput
            className="p-4 text-gray-700 bg-gray-100 rounded-2xl"
            onChangeText={setFirstName}
            value={firstName}
            placeholder="First Name"
            placeholderTextColor="gray"
            autoCapitalize="none"
          />

          <View className="mt-3">
            <Text className="mt-4 ml-4 text-gray-700">Last Name</Text>
            <TextInput
              className="p-4 mt-3 text-gray-700 bg-gray-100 rounded-2xl"
              onChangeText={setLastName}
              value={lastName}
              placeholder="Last Name"
              placeholderTextColor="gray"
              autoCapitalize="none"
            />
          </View>
        </View>
        {mustVerifyEmail && user.email_verified_at === null && (
          <View>
            <Text className="mt-2 text-sm text-gray-800 ">
              Your email address is unverified.
              <Text className="text-sm text-gray-600 underline rounded-md">
                Click here to re-send the verification email.
              </Text>
            </Text>

            {status === "verification-link-sent" && (
              <View className="mt-2 text-sm font-medium text-green-600">
                A new verification link has been sent to your email address.
              </View>
            )}
          </View>
        )}
        <View>
          <TouchableOpacity
            onPress={() => handleUpdate()}
            className="flex flex-row justify-center py-3 bg-yellow-400 rounded-xl"
          >
            {isLoading && (
              <ActivityIndicator className="mr-2" size="small" color="white" />
            )}
            <Text className="text-xl font-bold text-center text-gray-700">
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default UpdateProfileInformation;
