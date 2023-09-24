import { Platform, Text, TouchableOpacity, View, FlatList } from "react-native";
import React, { useContext, useState, useEffect } from "react";
import LottieView from "lottie-react-native";
import { AuthContext } from "../context/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import axiosConfig from "../helpers/axiosConfig";
import { useNavigation } from "@react-navigation/native";
import { MessageCard, ModalHeader } from "../components";

const IncomingMessagesScreen = () => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const fetchPropertyMessages = async () => {
    const response = await axiosConfig.get(`/message`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    return response.data.data;
  };

  //Use useQuery to fetch user data with the token
  const { isLoading, error, data } = useQuery(
    ["getPropertyMessages"],
    fetchPropertyMessages
  );
  return (
    <View className="flex-1 bg-white">
      {Platform.OS === "ios" ? (
        <ModalHeader
          text="My Messages"
          xShown
          style={{ borderBottom: "2px solid #2a2a2c" }}
        />
      ) : null}
      <View className="flex-1 bg-white">
        {!data ? (
          <View className="items-center justify-center">
            <LottieView
              autoPlay
              style={{ height: 400, width: 400, alignSelf: "center" }}
              source={require("../assets/lotties/Inbox.json")}
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
                onPress={() =>
                  navigation.navigate("Root", { screen: "Search" })
                }
                className="flex flex-row justify-center py-3 mt-10 bg-yellow-400 rounded-xl"
              >
                <Text className="text-xl font-bold text-center text-gray-700">
                  Search your next home
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : isLoading ? (
          <ActivityIndicator className="mt-2" size="large" color="gray" />
        ) : (
          <FlatList
            data={data}
            renderItem={(props) => <MessageCard {...props} />}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => (
              <View className="border-b border-gray-200"></View>
            )}
          />
        )}
      </View>
    </View>
  );
};

export default IncomingMessagesScreen;
