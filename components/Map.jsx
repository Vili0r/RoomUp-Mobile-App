import { View, TouchableOpacity, Platform } from "react-native";
import React, { useState, useEffect } from "react";
import MapView from "react-native-maps";
import MapMarker from "./MapMarker";
import { useNavigation } from "@react-navigation/native";
import MapPropertyCard from "./MapPropertyCard";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Map = ({ properties }) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const navigation = useNavigation();
  const handleMarkerPress = (index) => {
    setActiveIndex(index);
    navigation.setOptions({ tabBarStyle: { display: "none" } });
  };

  const unFocusProperty = () => {
    setActiveIndex(-1);
    navigation.setOptions({ tabBarStyle: { display: "flex" } });
  };
  const handleMapPress = () => {
    if (Platform.OS === "android") unFocusProperty();
  };

  return (
    <View className="flex-1 mt-4 overflow-hidden">
      <MapView
        style={{ height: "100%", width: "100%" }}
        onPress={handleMapPress}
      >
        {properties &&
          properties.map((item, index) => (
            <MapMarker
              key={item.id}
              lat={item.owner ? item.owner.address?.lat : item.address.lat}
              long={item.owner ? item.owner.address?.long : item.address.long}
              color={activeIndex === index ? "rgb(250 204 21)" : "black"}
              onPress={() => handleMarkerPress(index)}
            />
          ))}
      </MapView>
      {activeIndex > -1 && (
        <>
          {Platform.OS === "ios" && (
            <TouchableOpacity
              className="bg-gray-900/50 rounded-full top-[10px] left-[10px] absolute p-2"
              onPress={unFocusProperty}
            >
              <MaterialCommunityIcons name="close" color="white" size={24} />
            </TouchableOpacity>
          )}
          <MapPropertyCard property={properties[activeIndex]} />
        </>
      )}
    </View>
  );
};

export default Map;
