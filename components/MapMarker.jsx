import React from "react";
import { Marker } from "react-native-maps";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const MapMarker = ({ long, lat, onPress, color }) => {
  return (
    <Marker coordinate={{ latitude: lat, longitude: long }} onPress={onPress}>
      <MaterialCommunityIcons name="map-marker" size={32} color={color} />
    </Marker>
  );
};

export default MapMarker;
