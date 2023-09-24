import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Feather from "@expo/vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";

const SinglePropertyFooter = ({ id, type, name }) => {
  const navigation = useNavigation();

  return (
    <View className="flex" style={{ paddingBottom: 100 }}>
      <View className="absolute top-0 bottom-0 w-full p-3 pt-4">
        <View className="flex px-8 py-3 bg-black rounded-full">
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Message Advertiser Screen", {
                id,
                type,
              })
            }
            className="flex flex-row items-center justify-center space-x-4"
          >
            <Feather name="mail" size={24} color="white" />

            <Text className="text-base font-medium text-white">
              Message {name}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SinglePropertyFooter;
