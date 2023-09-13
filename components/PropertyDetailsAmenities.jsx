import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Fontisto from "@expo/vector-icons/Fontisto";

const allAmenities = [
  { id: 1, name: "Parking", icon: <FontAwesome5 name="car" size={24} /> },
  {
    id: 2,
    name: "Garden",
    icon: <MaterialCommunityIcons name="tree-outline" size={24} />,
  },
  {
    id: 3,
    name: "Garage",
    icon: <MaterialCommunityIcons name="garage-open-variant" size={24} />,
  },
  {
    id: 4,
    name: "Balcony",
    icon: <MaterialCommunityIcons name="balcony" size={24} />,
  },
  {
    id: 5,
    name: "Disable access",
    icon: <Fontisto name="paralysis-disability" size={24} />,
  },
  {
    id: 6,
    name: "Living room",
    icon: <FontAwesome5 name="couch" size={20} />,
  },
  {
    id: 7,
    name: "Broadband",
    icon: <Ionicons name="wifi-outline" size={24} />,
  },
  {
    id: 8,
    name: "Air conditioning",
    icon: <FontAwesome name="snowflake-o" size={24} />,
  },
  { id: 9, name: "Central heating", icon: <Feather name="sun" size={24} /> },
  {
    id: 10,
    name: "Dishwasher",
    icon: <MaterialCommunityIcons name="dishwasher" size={24} />,
  },
  {
    id: 11,
    name: "Microwave",
    icon: <MaterialCommunityIcons name="microwave" size={24} />,
  },
  {
    id: 12,
    name: "Oven",
    icon: <MaterialCommunityIcons name="toaster-oven" size={24} />,
  },
  {
    id: 13,
    name: "Washing machine",
    icon: <MaterialCommunityIcons name="washing-machine" size={24} />,
  },
  {
    id: 14,
    name: "Refrigirator",
    icon: <MaterialCommunityIcons name="fridge-outline" size={24} />,
  },
  { id: 15, name: "Storage", icon: <MaterialIcons name="storage" size={24} /> },
];

const PropertyDetailsAmenities = ({ amenities }) => {
  const matchedAmenities = allAmenities.map((element1) => {
    return amenities.some((element2) => element2.name === element1.name);
  });
  return (
    <View className="flex border-0 border-t-2 mt-7 border-t-gray-200">
      <Text className="mt-5 text-xl font-bold text-gray-700 font-popp">
        Amenities
      </Text>

      <View className="mt-7">
        {allAmenities.map((amenity, index) => (
          <View key={amenity.id} className="flex flex-row gap-5">
            <Text
              style={[
                styles.text,
                matchedAmenities[index]
                  ? styles.boldText
                  : styles.lineThroughText,
              ]}
            >
              {amenity.icon}
            </Text>
            <Text
              style={[
                styles.text,
                matchedAmenities[index]
                  ? styles.boldText
                  : styles.lineThroughText,
              ]}
            >
              {amenity.name}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default PropertyDetailsAmenities;

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
  },
  boldText: {
    fontWeight: 500, // Apply bold font
  },
  lineThroughText: {
    textDecorationLine: "line-through", // Apply line-through
    color: "rgba(128, 128, 128, 0.5)",
  },
});
