import {
  SafeAreaView,
  StyleSheet,
  Platform,
  StatusBar,
  Text,
} from "react-native";
import React, { useContext } from "react";
import LottieView from "lottie-react-native";
import { AuthContext } from "../context/AuthProvider";
import axiosConfig from "../helpers/axiosConfig";
import navigation from "../navigation";

const fetchFavouriteProperties = async (userId, token) => {
  const response = await axiosConfig.get(`/users/${userId}/favourites`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};

const AccountScreen = () => {
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
              <LottieView
                autoPlay
                style={{ height: 400, width: 400, alignSelf: "center" }}
                source={require("../assets/lotties/Profile.json")}
              />
              <View className="">
                <TouchableOpacity
                  onPress={logout}
                  className="flex flex-row justify-center px-3 py-3 mt-10 bg-yellow-400 rounded-xl"
                >
                  <Text className="text-xl font-bold text-center text-gray-700">
                    Logout as {user.first_name}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          <View className="items-center justify-center">
            <LottieView
              autoPlay
              style={{ height: 400, width: 400, alignSelf: "center" }}
              source={require("../assets/lotties/Profile.json")}
            />
            <View className="">
              <Text className="text-lg font-semibold text-center text-gray-700">
                You are not logged in. Find your dream home
              </Text>
              <Text
                appearance={"hint"}
                className="mt-2 text-xl font-light text-center text-gray-700"
              >
                or RoomUp your property
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

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
