import {
  SafeAreaView,
  StyleSheet,
  Platform,
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useContext } from "react";
import LottieView from "lottie-react-native";
import { AuthContext } from "../context/AuthProvider";
import { useNavigation } from "@react-navigation/native";
import Profile from "../components/Profile";

const AccountScreen = () => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  return (
    <SafeAreaView style={styles.container} className="flex-1 bg-white">
      <StatusBar />
      <ScrollView showsVerticalScrollIndicator={false}>
        {user ? (
          <Profile />
        ) : (
          <View className="items-center justify-center flex-1 bg-white">
            <LottieView
              autoPlay
              style={{ height: 400, width: 400, alignSelf: "center" }}
              source={require("../assets/lotties/Profile.json")}
            />
            <View className="">
              <Text className="text-lg font-semibold text-center text-gray-700">
                Renting has never been easier!
              </Text>
              <Text
                appearance={"hint"}
                className="mt-2 text-xl font-light text-center text-gray-700"
              >
                Are you property owner or tenant?
              </Text>
              <Text
                appearance={"hint"}
                className="mt-2 text-xl font-light text-center text-gray-700"
              >
                Navigate through the properties and start receiving applications
                in minutes
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Login Screen")}
                className="flex flex-row justify-center py-3 mt-10 bg-yellow-400 rounded-xl"
              >
                <Text className="text-xl font-bold text-center text-gray-700">
                  Login
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("Register Screen")}
                className="flex flex-row justify-center py-3 mt-5 border-2 border-yellow-400 rounded-xl"
              >
                <Text className="text-xl font-bold text-center text-gray-700">
                  Register
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
