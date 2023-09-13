import React from "react";
import { View, Text, Image } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";

const AdvertisedBy = ({ id, model, advertiser, occupation }) => {
  // const { data, get } = useForm({
  //     id: id,
  //     type: model,
  // });

  return (
    <View className="flex border-0 border-t-2 mt-7 border-t-gray-200">
      <Text className="mt-5 text-xl font-bold text-gray-700 font-popp">
        Advertised by
      </Text>

      <View className="flex flex-row mt-8">
        <Image
          className="object-cover w-16 h-16 mx-2 rounded-full shrink-0 ring-4 ring-gray-300 dark:ring-gray-700"
          source={{
            uri: "https://www.gravatar.com/avatar/000000000000000000000000000000?d=mp",
          }}
        />
        <View className="grid mx-2">
          <Text className="font-semibold text-gray-800 font-popp">
            {advertiser.first_name}
          </Text>
          <Text className="text-sm text-gray-500 font-popp">{occupation}</Text>
          <Text className="text-sm text-gray-500 font-popp">
            Tel:{" "}
            {advertiser.display_telephone ? advertiser.telephone : "Message Me"}
          </Text>
        </View>
      </View>

      <View className="flex flex-row mt-2 space-x-1">
        <View className="flex flex-row gap-2">
          <Feather name="star" size={24} color="black" />
          <Text className="text-sm font-popp">744 reviews</Text>
        </View>
        <Text className="font-extrabold">.</Text>
        <View className="flex flex-row gap-2">
          <Ionicons name="shield-checkmark-outline" size={24} color="black" />
          <Text className="text-sm font-popp">Identity certified</Text>
        </View>
      </View>
    </View>
  );
};

export default AdvertisedBy;
