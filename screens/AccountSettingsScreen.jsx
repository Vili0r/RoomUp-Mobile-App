import { View, ScrollView } from "react-native";
import React from "react";
import { DeleteUser, UpdateProfileInformation } from "../components";
import { useQuery } from "@tanstack/react-query";
import axiosConfig from "../helpers/axiosConfig";

const AccountSettingsScreen = ({ route }) => {
  const fetchPersonalInformation = async () => {
    const response = await axiosConfig.get(`/profile`, {
      headers: {
        Authorization: `Bearer ${route.params.token}`,
      },
    });
    // Access the data from response.data using object destructuring
    return response.data;
  };

  const userPersonalInformationQuery = useQuery({
    queryKey: ["userPersonalInformation"],
    queryFn: fetchPersonalInformation,
    refetchOnMount: true,
  });

  return (
    <ScrollView className="p-4 space-y-6">
      <View className="p-2 bg-white rounded-lg shadow">
        <UpdateProfileInformation
          mustVerifyEmail={userPersonalInformationQuery.data?.mustVerifyEmail}
          user={userPersonalInformationQuery.data?.user}
          status={userPersonalInformationQuery.data?.status}
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
