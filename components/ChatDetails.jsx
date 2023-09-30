import { View, Text } from "react-native";
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";

const ChatDetails = ({ conversation, replies }) => {
  const { user } = useContext(AuthContext);

  return (
    <View className="p-3">
      {replies?.length > 0 &&
        replies?.map((reply) =>
          reply.user_id !== user.id ? (
            <View key={reply.id} className="mt-2">
              <View className="flex flex-row items-center">
                <View className="flex items-center justify-center text-black w-10 h-10 bg-[#F5B041] rounded-md">
                  <Text className="uppercase">
                    {conversation.user_id === user.id
                      ? conversation.message.owner.receiver.initial
                      : conversation.message.initial}
                  </Text>
                </View>
                <View className="relative px-4 py-2 ml-3 text-sm bg-white shadow rounded-xl">
                  <Text>{reply.body}</Text>
                </View>
              </View>
            </View>
          ) : (
            <View className="mt-2">
              <View className="flex flex-row-reverse items-center justify-start">
                <View className="flex items-center justify-center w-10 h-10 text-black bg-[#F5B041] rounded-md">
                  <Text className="uppercase">
                    {conversation.user_id !== user.id
                      ? conversation.message.owner.receiver.initial
                      : conversation.message.initial}
                  </Text>
                </View>
                <View className="relative px-4 py-2 mr-3 text-sm bg-indigo-100 shadow rounded-xl">
                  <Text>{reply.body}</Text>
                </View>
              </View>
            </View>
          )
        )}
      {conversation.user_id === user.id ? (
        <View className="mt-2">
          <View className="flex flex-row-reverse items-center justify-start">
            <View className="flex items-center justify-center w-10 h-10 text-black bg-[#F5B041] rounded-md">
              <Text className="uppercase">
                {conversation.user_id !== user.id
                  ? conversation.message.owner.receiver.initial
                  : conversation.message.initial}
              </Text>
            </View>
            <View className="relative px-4 py-2 mr-3 text-sm bg-indigo-100 shadow rounded-xl">
              <Text>{conversation.body}</Text>
            </View>
          </View>
        </View>
      ) : (
        <View className="mt-2 ">
          <View className="flex flex-row items-center">
            <View className="flex items-center justify-center text-black w-10 h-10 bg-[#F5B041] rounded-md">
              <Text className="uppercase">
                {conversation.user_id === user.id
                  ? conversation.message.owner.receiver.initial
                  : conversation.message?.initial}
              </Text>
            </View>
            <View className="relative px-4 py-2 ml-3 text-sm bg-white shadow rounded-xl">
              <Text>{conversation.body}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default ChatDetails;
