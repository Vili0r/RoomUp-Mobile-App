import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axiosConfig from "../helpers/axiosConfig";
import { MyProperties } from "../components";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";

const MyPropertiesScreen = ({ route }) => {
  const navigation = useNavigation();
  const fetchMyPropertiesListings = async () => {
    const response = await axiosConfig.get(`/my-properties`, {
      headers: {
        Authorization: `Bearer ${route.params.token}`,
      },
    });
    // Access the data from response.data using object destructuring
    return response.data;
  };

  const { data, isLoading } = useQuery(
    ["myPropertiesListings"],
    fetchMyPropertiesListings
  );

  return (
    <SafeAreaView className="items-center justify-center flex-1 bg-white">
      <StatusBar />
      <View className="items-center justify-center flex-1 bg-white">
        {!data || data.length === 0 ? (
          <>
            <LottieView
              autoPlay
              style={{ height: 400, width: 400, alignSelf: "center" }}
              source={require("../assets/lotties/MyProperties.json")}
            />
            <View className="mt-[100px]">
              <Text className="text-lg font-semibold text-center text-gray-700">
                You do not have any listings
              </Text>
              <Text
                appearance={"hint"}
                className="mt-2 text-xl font-light text-center text-gray-700"
              >
                List your property
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Add Property Screen")}
                className="flex flex-row justify-center py-3 mt-10 bg-yellow-400 rounded-xl"
              >
                <Text className="text-xl font-bold text-center text-gray-700">
                  List My Property
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <MyProperties properties={data} isLoading={isLoading} />
        )}
      </View>
    </SafeAreaView>
  );
};

export default MyPropertiesScreen;
