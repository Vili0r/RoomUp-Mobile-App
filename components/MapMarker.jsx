import React from "react";
import { Marker } from "react-native-maps";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const MapMarker = ({ long, lat, onPress, color }) => {
  console.log("long", long);
  console.log("lat", lat);
  return (
    <Marker coordinate={{ latitude: lat, longitude: long }} onPress={onPress}>
      <MaterialCommunityIcons name="map-marker" size={32} color={color} />
    </Marker>
  );
};

export default MapMarker;
