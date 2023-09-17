import {
  SafeAreaView,
  StyleSheet,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext } from "react";
import LottieView from "lottie-react-native";
import { AuthContext } from "../context/AuthProvider";
import { useQuery } from "react-query";
import axiosConfig from "../helpers/axiosConfig";
import { FavouriteProperties } from "../components";
import { useNavigation } from "@react-navigation/native";

const SavedScreen = () => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();

  //Use useQuery to fetch user data with the token
  const {
    isLoading,
    error,
    data: properties,
  } = useQuery("favourites", async () => {
    const response = await axiosConfig.get(`/users/${user.id}/favourites`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    // Access the data from response.data
    return response.data.data;
  });

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
              {!properties ? (
                <>
                  <LottieView
                    autoPlay
                    style={{ height: 400, width: 400, alignSelf: "center" }}
                    source={require("../assets/lotties/Wishlist.json")}
                  />
                  <View className="">
                    <Text className="text-lg font-semibold text-center text-gray-700">
                      You do not have any saved properties
                    </Text>
                    <Text
                      appearance={"hint"}
                      className="mt-2 text-xl font-light text-center text-gray-700"
                    >
                      Tap the heart icon to add favourites
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
                <FavouriteProperties
                  properties={properties}
                  isLoading={isLoading}
                />
              )}
            </View>
          </>
        ) : (
          <View className="items-center justify-center">
            <LottieView
              autoPlay
              style={{ height: 400, width: 400, alignSelf: "center" }}
              source={require("../assets/lotties/Wishlist.json")}
            />
            <View className="">
              <Text className="text-lg font-semibold text-center text-gray-700">
                You do not have any saved properties
              </Text>
              <Text
                appearance={"hint"}
                className="mt-2 text-xl font-light text-center text-gray-700"
              >
                {" "}
                Search your next home and Tap the heart icon to add favourites
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

export default SavedScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
