import {
  SafeAreaView,
  StyleSheet,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import axiosConfig from "../helpers/axiosConfig";
import LottieView from "lottie-react-native";
import { ViewedProperties } from "../components";
import { useNavigation } from "@react-navigation/native";

const HistoryScreen = () => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const [intervalMs, setIntervalMs] = useState(5000);
  const fetchViewedProperties = async () => {
    const response = await axiosConfig.get(`/viewed`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    return response.data;
  };

  //Use useQuery to fetch user data with the token
  const { isLoading, data, refetch } = useQuery(
    ["viewedProperties"],
    fetchViewedProperties,
    {
      refetchOnMount: true,
    }
  );

  return (
    <SafeAreaView
      style={styles.container}
      className="items-center justify-center flex-1 bg-white"
    >
      <StatusBar />
      <View className="items-center justify-center flex-1 bg-white">
        {user ? (
          <>
            <View className="items-center justify-center">
              {!data || data.length === 0 ? (
                <>
                  <LottieView
                    autoPlay
                    style={{ height: 400, width: 400, alignSelf: "center" }}
                    source={require("../assets/lotties/Favourites.json")}
                  />
                  <View className="">
                    <Text className="text-lg font-semibold text-center text-gray-700">
                      You have not visited any properties
                    </Text>
                    <Text
                      appearance={"hint"}
                      className="mt-2 text-xl font-light text-center text-gray-700"
                    >
                      Click the image to navigate to the property
                    </Text>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("Search Screen")}
                      className="flex flex-row justify-center py-3 mt-10 bg-yellow-400 rounded-xl"
                    >
                      <Text className="text-xl font-bold text-center text-gray-700">
                        Search your next home
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <ViewedProperties
                  properties={data}
                  isLoading={isLoading}
                  refetch={refetch}
                />
              )}
            </View>
          </>
        ) : (
          <View className="items-center justify-center">
            <LottieView
              autoPlay
              style={{ height: 400, width: 400, alignSelf: "center" }}
              source={require("../assets/lotties/Favourites.json")}
            />
            <View className="">
              <Text className="text-lg font-semibold text-center text-gray-700">
                You are not logged in. Log in and
              </Text>
              <Text
                appearance={"hint"}
                className="mt-2 text-xl font-light text-center text-gray-700"
              >
                View a property to add it to your recent views
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Login Screen")}
                className="flex flex-row justify-center py-3 mt-10 bg-yellow-400 rounded-xl"
              >
                <Text className="text-xl font-bold text-center text-gray-700">
                  Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
