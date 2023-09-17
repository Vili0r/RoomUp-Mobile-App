import { View, ScrollView } from "react-native";
import React from "react";
import { DeleteUser, UpdateProfileInformation } from "../components";
import { useQuery } from "@tanstack/react-query";
import axiosConfig from "../helpers/axiosConfig";

const AccountSettingsScreen = ({ route }) => {
  const fetchPersonalInformation = async () => {
    const response = await axiosConfig.get(
      `/users/${route.params.id}/profile`,
      {
        headers: {
          Authorization: `Bearer ${route.params.token}`,
        },
      }
    );
    // Access the data from response.data using object destructuring
    return response.data;
  };

  const { data } = useQuery(
    ["userPersonalInformation"],
    fetchPersonalInformation
  );

  return (
    <ScrollView className="p-4 space-y-6">
      <View className="p-2 bg-white rounded-lg shadow">
        <UpdateProfileInformation
          mustVerifyEmail={data?.mustVerifyEmail}
          user={data?.user}
          status={data?.status}
          token={route.params.token}
        />
      </View>
      <View className="p-4 bg-white rounded-lg shadow">
        <DeleteUser />
      </View>
    </ScrollView>
  );
};

export default AccountSettingsScreen;
