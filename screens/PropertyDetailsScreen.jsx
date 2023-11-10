import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import axiosConfig from "../helpers/axiosConfig";
import { useQuery } from "@tanstack/react-query";
import { SinglePropertyDetails } from "../components";
import { useRoute } from "@react-navigation/native";

const PropertyDetailsScreen = () => {
  const route = useRoute();
  const model = route.params?.model;
  const id = route.params?.id;
  const index = route.params?.index;

  const fetchSinglePropertyDetails = async (model, id) => {
    const response = await axiosConfig.get(`/property/${model}/${id}`);
    return response.data;
  };

  const singlePropertyDetailsQuery = useQuery({
    queryKey: ["singlePropertyDetails", model, id],
    queryFn: () => fetchSinglePropertyDetails(model, id),
  });

  return (
    <View className="flex-1 bg-white">
      {singlePropertyDetailsQuery.isLoading ? (
        <ActivityIndicator className="mt-2" size="large" color="gray" />
      ) : singlePropertyDetailsQuery.error ? (
        <Text>Something went wrong</Text>
      ) : (
        <SinglePropertyDetails
          property={singlePropertyDetailsQuery.data}
          imageIndex={index}
        />
      )}
    </View>
  );
};

export default PropertyDetailsScreen;
