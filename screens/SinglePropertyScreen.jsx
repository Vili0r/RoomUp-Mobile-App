import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import axios from "axios";
import { useQuery } from "react-query";
import { SinglePropertyDetails } from "../components";

const SinglePropertyScreen = ({ route }) => {
  const { isLoading, error, data } = useQuery("property", () =>
    axios(
      `http://roomup.test/api/property/${route.params.model}/${route.params.id}`
    )
  );

  return (
    <View className="flex-1 bg-white">
      {isLoading ? (
        <ActivityIndicator className="mt-2" size="large" color="gray" />
      ) : error ? (
        <Text>Something went wrong</Text>
      ) : (
        <SinglePropertyDetails
          property={data.data}
          imageIndex={route.params.index}
        />
      )}
    </View>
  );
};

export default SinglePropertyScreen;
