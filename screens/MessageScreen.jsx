import {
  SafeAreaView,
  StyleSheet,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import React, { useContext } from "react";
import LottieView from "lottie-react-native";
import { AuthContext } from "../context/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import axiosConfig from "../helpers/axiosConfig";
import { ConversationCard } from "../components";
import { useNavigation } from "@react-navigation/native";

const MessageScreen = () => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const fetchConversations = async () => {
    const response = await axiosConfig.get(`/conversation`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    return response.data;
  };

  //Use useQuery to fetch user data with the token
  const { isLoading, error, data } = useQuery(
    ["getConversations"],
    fetchConversations
  );

  return (
    <SafeAreaView style={styles.container} className="flex-1 bg-white">
      <StatusBar />
      <View className="flex-1 bg-white ">
        {user ? (
          <>
            {!data || data.length === 0 ? (
              <View className="items-center justify-center">
                <LottieView
                  autoPlay
                  style={{ height: 400, width: 400, alignSelf: "center" }}
                  source={require("../assets/lotties/Contacted.json")}
                />
                <View className="">
                  <Text className="text-lg font-semibold text-center text-gray-700">
                    You do not have any messages
                  </Text>
                  <Text
                    appearance={"hint"}
                    className="mt-2 text-xl font-light text-center text-gray-700"
                  >
                    Send messages to the owner and follow up
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
              </View>
            ) : (
              <FlatList
                data={data}
                renderItem={(props) => <ConversationCard {...props} />}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => (
                  <View className="border-b border-gray-200"></View>
                )}
              />
            )}
          </>
        ) : (
          <View className="items-center justify-center">
            <LottieView
              autoPlay
              style={{ height: 400, width: 400, alignSelf: "center" }}
              source={require("../assets/lotties/Contacted.json")}
            />
            <View className="">
              <Text className="text-lg font-semibold text-center text-gray-700">
                You do not have any messages
              </Text>
              <Text
                appearance={"hint"}
                className="mt-2 text-xl font-light text-center text-gray-700"
              >
                {" "}
                Search your next home and chat with the owner
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

export default MessageScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
