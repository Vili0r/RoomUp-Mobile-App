import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { callPhoneNumber } from "../helpers/callPhoneNumber";

const AdvertisedBy = ({ advertiser, occupation }) => {
  return (
    <View className="flex border-0 border-t-2 mt-7 border-t-gray-200">
      <Text className="mt-5 text-xl font-bold text-gray-700 font-popp">
        Advertised by
      </Text>

      <View className="flex flex-row mt-5">
        <View className="flex items-center justify-center w-[52px] h-[52px] text-black bg-gray-300 rounded-md">
          <Text className="text-lg uppercase">{advertiser.initials}</Text>
        </View>
        <View className="grid mx-2">
          <Text className="font-semibold text-gray-800 font-popp">
            {advertiser.first_name}
          </Text>
          <Text className="text-sm text-gray-500 font-popp">{occupation}</Text>
          {advertiser.display_telephone && (
            <TouchableOpacity
              onPress={() => callPhoneNumber(advertiser.telephone)}
            >
              <Text className="text-sm text-gray-500 font-popp">
                Tel: {advertiser.telephone}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View className="flex flex-row mt-3 space-x-1">
        <Text className="flex flex-row gap-2">
          <Feather name="star" size={24} color="black" />
          <Text className="text-sm font-popp">744 reviews</Text>
        </Text>
        <Text>&middot;</Text>
        <Text className="flex flex-row gap-2">
          <Ionicons name="shield-checkmark-outline" size={24} color="black" />
          <Text className="text-sm font-popp">Identity certified</Text>
        </Text>
      </View>
    </View>
  );
};

export default AdvertisedBy;
