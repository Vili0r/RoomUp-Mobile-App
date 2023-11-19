import { View, Text, TouchableOpacity } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BlurView } from "expo-blur";
import { ModalFilterProperties, ModalFilterRoommate } from "../components";

const AdvancedFilterScreen = ({ navigation }) => {
  const [active, setActive] = useState(0);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View className="flex-row justify-center gap-2">
          <TouchableOpacity onPress={() => setActive(0)}>
            <Text
              className={`text-base font-bold ${
                active === 0 ? "underline text-black" : "text-gray-600"
              }`}
            >
              Stays
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActive(1)}>
            <Text
              className={`text-base font-bold ${
                active === 1 ? "underline text-black" : "text-gray-600"
              }`}
            >
              Roommate
            </Text>
          </TouchableOpacity>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-1 bg-white border-[1px] border-gray-600 rounded-3xl"
        >
          <Ionicons name="close-outline" size={22} />
        </TouchableOpacity>
      ),
    });
  }, [active]);

  return (
    <BlurView intensity={70} style={{ flex: 1, paddingTop: 100 }} tint="light">
      {active === 0 ? <ModalFilterProperties /> : <ModalFilterRoommate />}
    </BlurView>
  );
};

export default AdvancedFilterScreen;
