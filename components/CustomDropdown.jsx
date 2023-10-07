import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import React, { useState, useMemo } from "react";
import { Ionicons } from "@expo/vector-icons";

const CustomDropdown = ({ label, value, data, onItemChange }) => {
  const getSelectedValue = (data, value) => {
    for (const type of data) {
      if (type.value == value) {
        return type.label;
      }
    }
    return "";
  };

  const [selectedValue, setSelectedValue] = useState(
    useMemo(() => getSelectedValue(data, value), [data, value])
  );

  const [isClicked, setIsClicked] = useState(false);
  return (
    <View className="">
      <Text className="text-gray-700">{label}</Text>
      <TouchableOpacity
        onPress={() => setIsClicked(!isClicked)}
        className="w-[100%] h-[50px] rounded-md border border-gray-300 self-center mt-3 flex-row items-center pl-3 pr-3 justify-between"
      >
        <Text>{selectedValue}</Text>
        {isClicked ? (
          <Ionicons name="chevron-up" size={22} color="black" />
        ) : (
          <Ionicons name="chevron-down" size={22} color="black" />
        )}
      </TouchableOpacity>
      {isClicked && (
        <View className="w-[90%] border border-gray-300 rounded-md mt-4 bg-[#fff] self-center">
          <FlatList
            data={data}
            style={{ maxHeight: 200 }}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    onItemChange(item);
                    setSelectedValue(item.label);
                    setIsClicked(false);
                  }}
                  className="w-[85%] h-[50px] border-b-2 border-b-gray-300 self-center justify-center"
                >
                  <Text>{item.label}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      )}
    </View>
  );
};

export default CustomDropdown;
