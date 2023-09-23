import { View, Text, TouchableOpacity } from "react-native";
import React, { useLayoutEffect } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

const AdvancedFilterScreen = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "Find your ideal home",
      headerTintColor: "black",
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-[40px] h-[40px] rounded-[20px] text-white bg-black justify-center items-center"
        >
          <Ionicons name="md-close" size={24} color="white" />
        </TouchableOpacity>
      ),
    });
  }, []);
  return (
    <KeyboardAwareScrollView
      bounces={false}
      style={{ flexGrow: 1, backgroundColor: "white" }} //style changed to contentContainerStyle
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 bg-white border-2 mt-14 broder-b"></View>
    </KeyboardAwareScrollView>
  );
};

export default AdvancedFilterScreen;
