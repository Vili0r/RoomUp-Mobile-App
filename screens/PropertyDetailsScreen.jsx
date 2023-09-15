import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import axiosConfig from "../helpers/axiosConfig";
import { useQuery } from "react-query";
import { SinglePropertyDetails } from "../components";
import { useRoute } from "@react-navigation/native";

const PropertyDetailsScreen = () => {
  const route = useRoute();
  const model = route.params?.model;
  const id = route.params?.id;
  const index = route.params?.index;

  const { isLoading, error, data } = useQuery("property", () =>
    axiosConfig.get(`/property/${model}/${id}`)
  );

  return (
    <View className="flex-1 bg-white">
      {isLoading ? (
        <ActivityIndicator className="mt-2" size="large" color="gray" />
      ) : error ? (
        <Text>Something went wrong</Text>
      ) : (
        <SinglePropertyDetails property={data.data} imageIndex={index} />
      )}
    </View>
  );
};

export default PropertyDetailsScreen;
