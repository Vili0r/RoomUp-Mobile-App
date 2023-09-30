import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useNavigation } from "@react-navigation/native";

const ConversationCard = ({ item: conversation }) => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  const imageUrl =
    conversation.user_id === user.id
      ? conversation.message.owner.receiver.avatar !==
        "https://www.gravatar.com/avatar/000000000000000000000000000000?d=mp"
        ? conversation.message.owner.receiver.avatar
        : "https://www.gravatar.com/avatar/000000000000000000000000000000?d=mp"
      : conversation.sender.avatar !==
        "https://www.gravatar.com/avatar/000000000000000000000000000000?d=mp"
      ? conversation.sender.avatar
      : "https://www.gravatar.com/avatar/000000000000000000000000000000?d=mp";
  return (
    <View className="flex flex-row p-4 mt-4">
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Chat Screen", {
            id: conversation.id,
            title: conversation.message.owner.title,
          })
        }
      >
        <Image
          className="w-[90px] h-[70px] rounded-md mr-5"
          source={{ uri: imageUrl }}
        />
      </TouchableOpacity>
      <View className="flex">
        <TouchableOpacity
          className="flex flex-row gap-2"
          onPress={() =>
            navigation.navigate("Chat Screen", {
              id: conversation.id,
              title: conversation.message.owner.title,
            })
          }
        >
          <Text numberOfLines={1} className="font-semibold">
            {conversation.user_id === user.id
              ? conversation.message.owner.receiver?.first_name
              : conversation.sender.first_name}
          </Text>

          <Text>&middot;</Text>
          <Text numberOfLines={1} className="text-xs text-gray-500">
            {conversation.last_reply}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="mt-2"
          onPress={() =>
            navigation.navigate("Chat Screen", {
              id: conversation.id,
              title: conversation.message.owner.title,
            })
          }
        >
          <Text className="font-bold">{conversation.message.message_text}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="mt-2"
          onPress={() =>
            navigation.navigate("Chat Screen", {
              id: conversation.id,
              title: conversation.message.owner.title,
            })
          }
        >
          <View className="flex flex-row items-center space-x-2">
            <Text className="text-xs font-semibold text-gray-500 ">
              {conversation.message.owner.title}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ConversationCard;
