import { View, Text } from "react-native";
import React from "react";
import MapView from "react-native-maps";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MapMarker from "./MapMarker";

const PropertyLocation = ({ address }) => {
  return (
    <>
      <View className="flex border-0 border-t-2 mt-7 border-t-gray-200">
        <Text className="mt-5 text-xl font-bold text-gray-700">
          Where will you live
        </Text>
      </View>

      <View className="flex flex-row mt-4">
        <MaterialCommunityIcons name="map-outline" color="black" size={26} />
        <Text className="ml-3 text-lg font-semibold text-gray-700">Map</Text>
      </View>
      <View className="overflow-hidden w-[100%] h-[250px] mt-3 rounded-md">
        <MapView
          provider="google"
          style={{ width: "100%", height: "100%" }}
          initialRegion={{
            latitude: address.lat,
            longitude: address.long,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <MapMarker long={address.long} lat={address.lat} color={"black"} />
        </MapView>
      </View>
    </>
  );
};

export default PropertyLocation;
