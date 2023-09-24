import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";

const MessageCard = ({ item: message }) => {
  const navigation = useNavigation();
  const imageUrl =
    message.owner.images[0] &&
    `http://127.0.0.1:8000/storage/${message.owner.images[0]}`;
  return (
    <View className="flex flex-row p-4 mt-4">
      <TouchableOpacity onPress={() => navigation.navigate("Message Screen")}>
        <Image
          className="w-[100px] h-[80px] rounded-md mr-5"
          source={
            imageUrl
              ? { uri: imageUrl }
              : require("../assets/images/HousePlaceholder.jpeg")
          }
        />
      </TouchableOpacity>
      <View className="flex">
        <TouchableOpacity
          className="flex flex-row gap-2"
          onPress={() => navigation.navigate("Message Screen")}
        >
          <Text numberOfLines={1} className="font-semibold">
            {message.full_name}
          </Text>

          <Text>&middot;</Text>
          <Text numberOfLines={1} className="text-xs text-gray-500">
            {moment(message.owner.created_at).format("MMM DD, YYYY")}
          </Text>
          <Text>&middot;</Text>
          <Text numberOfLines={1} className="text-xs text-gray-500">
            {message.owner.size} {"room "}
          </Text>
          <Text>&middot;</Text>
          <Text numberOfLines={1} className="text-xs text-gray-500">
            {message.owner.type}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="mt-2"
          onPress={() => navigation.navigate("Message Screen")}
        >
          <Text className="font-bold leading-5">{message.message_text}</Text>
        </TouchableOpacity>
        <View className="flex flex-row items-center mt-3 space-x-2">
          <Text className="text-xs text-gray-500"> {message.owner.title}</Text>
          <Text>&middot;</Text>
          <Text className="text-xs text-gray-500">
            {message.owner.address_1},{message.owner.area}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default MessageCard;
