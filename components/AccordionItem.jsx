import {
  View,
  Text,
  Animated,
  LayoutAnimation,
  TouchableOpacity,
} from "react-native";
import React, { useState, useRef } from "react";
import { Feather } from "@expo/vector-icons";
import { toggleAnimation } from "../services/animations/toggleAnimation";

const AccordionItem = ({ title, children }) => {
  const [showContent, setShowContent] = useState(false);
  const animationRef = useRef(new Animated.Value(0)).current;

  const toggleListItem = () => {
    const config = {
      duration: 300,
      toValue: showContent ? 0 : 1,
      useNativeDriver: true,
    };
    Animated.timing(animationRef, config).start();
    LayoutAnimation.configureNext(toggleAnimation);
    setShowContent((prev) => !prev);
  };
  const arrowTransform = animationRef.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  return (
    <View className="w-full p-2 mt-3 overflow-hidden bg-gray-200 rounded-xl">
      <TouchableOpacity onPress={() => toggleListItem()}>
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-bold">{title}</Text>

          <Animated.View style={{ transform: [{ rotateZ: arrowTransform }] }}>
            <Feather name={"arrow-right"} size={24} color="black" />
          </Animated.View>
        </View>
      </TouchableOpacity>
      {showContent && (
        <View className="px-2 py-3 mt-3 bg-white">{children}</View>
      )}
    </View>
  );
};

export default AccordionItem;
