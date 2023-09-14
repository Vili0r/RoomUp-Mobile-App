import { View, Text } from "react-native";
import React from "react";
import MapView from "react-native-maps";

const Map = () => {
  return (
    <View className="flex-1 overflow-hidden">
      <MapView style={{ height: "100%", width: "100%" }} />
    </View>
  );
};

export default Map;
