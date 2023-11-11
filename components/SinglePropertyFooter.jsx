import { View, Text, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import Feather from "@expo/vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthProvider";
import Animated, { SlideInDown } from "react-native-reanimated";

const SinglePropertyFooter = ({ id, type, name }) => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleSendMessage = () => {
    if (!user) {
      navigation.navigate("Login Screen");
    } else {
      navigation.navigate("Message Advertiser Screen", {
        id,
        type,
      });
    }
  };

  return (
    <Animated.View
      className="flex"
      style={{ paddingBottom: 100 }}
      entering={SlideInDown.delay(200)}
    >
      <View className="absolute top-0 bottom-0 right-0 w-full p-3 pt-4 h-[100px]">
        <View className="flex px-8 py-3 bg-black rounded-full">
          <TouchableOpacity
            onPress={handleSendMessage}
            className="flex flex-row items-center justify-center space-x-4"
          >
            <Feather name="mail" size={24} color="white" />

            <Text className="text-base font-medium text-white">
              Message {name}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

export default SinglePropertyFooter;
