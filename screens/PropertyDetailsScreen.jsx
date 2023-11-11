import React, { useContext, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import axiosConfig from "../helpers/axiosConfig";
import { useQuery, useMutation } from "@tanstack/react-query";
import { SinglePropertyDetails } from "../components";
import { useRoute } from "@react-navigation/native";
import { AuthContext } from "../context/AuthProvider";

const PropertyDetailsScreen = () => {
  const { user } = useContext(AuthContext);
  const route = useRoute();
  const model = route.params?.model;
  const id = route.params?.id;
  const index = route.params?.index;
  const [isFavourited, setIsFavourited] = useState("");

  const setAuthToken = () => {
    if (user && user?.token) {
      axiosConfig.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${user.token}`;
    } else {
      delete axiosConfig.defaults.headers.common["Authorization"];
    }
  };

  const fetchSinglePropertyDetails = async (model, id) => {
    setAuthToken();
    const response = await axiosConfig.get(`/property/${model}/${id}`);
    setIsFavourited(response.data.favouritedBy);
    return response.data;
  };
  const {
    data: singlePropertyDetailsQuery,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["singlePropertyDetails", model, id],
    queryFn: () => fetchSinglePropertyDetails(model, id),
  });

  const toggleFavouriteMutation = useMutation(
    () =>
      axiosConfig.post(`/favourite/${model}/${id}`, null, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }),
    {
      onSuccess: () => {
        // Optional: handle success
      },
      onError: (error) => {
        // Optional: handle error and revert local state
        console.error("Error updating favourite status:", error);
        setIsFavourited(!isFavourited);
      },
      onSettled: () => {
        // Always refetch the data from the server, regardless of success or error
        refetch();
      },
    }
  );

  const handleToggleFavourite = () => {
    if (!user) {
      navigation.navigate("Login Screen");
      return;
    }
    // Optimistic update
    setIsFavourited(!isFavourited);

    // Mutate the data and send the request to the server
    toggleFavouriteMutation.mutate();
  };

  return (
    <View className="flex-1 bg-white">
      {isLoading ? (
        <ActivityIndicator className="mt-2" size="large" color="gray" />
      ) : error ? (
        <Text>Something went wrong</Text>
      ) : (
        <SinglePropertyDetails
          property={singlePropertyDetailsQuery}
          imageIndex={index}
          isFavourited={isFavourited}
          handleToggleFavourite={handleToggleFavourite}
        />
      )}
    </View>
  );
};

export default PropertyDetailsScreen;
