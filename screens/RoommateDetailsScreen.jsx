import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import axiosConfig from "../helpers/axiosConfig";
import { useQuery } from "@tanstack/react-query";
import { SingleRoommateDetails } from "../components";
import { useRoute } from "@react-navigation/native";

const RoommateDetailsScreen = () => {
  const route = useRoute();
  const id = route.params?.id;
  const index = route.params?.index;

  const fetchSingleRoommateDetails = async (id) => {
    const response = await axiosConfig.get(`/roommates/${id}/quest`);
    return response.data.roommate;
  };

  const singleRoommateDetailsQuery = useQuery({
    queryKey: ["singleRoommateDetails", id],
    queryFn: () => fetchSingleRoommateDetails(id),
  });

  return (
    <View className="flex-1 bg-white">
      {singleRoommateDetailsQuery.isLoading ? (
        <ActivityIndicator className="mt-2" size="large" color="gray" />
      ) : singleRoommateDetailsQuery.error ? (
        <Text>Something went wrong</Text>
      ) : (
        <SingleRoommateDetails
          listing={singleRoommateDetailsQuery.data}
          imageIndex={index}
        />
      )}
    </View>
  );
};

export default RoommateDetailsScreen;
