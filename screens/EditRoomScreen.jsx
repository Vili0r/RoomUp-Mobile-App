import { View, Text, TouchableOpacity } from "react-native";
import React, { useLayoutEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosConfig from "../helpers/axiosConfig";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialIcons } from "@expo/vector-icons";

const EditRoomScreen = ({ route, navigation }) => {
  const { id, token, title } = route.params;
  const fetchEditRoom = async (id) => {
    const response = await axiosConfig.get(`/rooms/${id}/edit`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.room;
  };

  const singleRoomEditQuery = useQuery({
    queryKey: ["singleRoomEditQuery", id, "edit"],
    queryFn: () => fetchEditRoom(id),
    refetchOnMount: true,
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: false,
      headerTitle: title,
      headerTintColor: "black",
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-[40px] h-[40px] rounded-[20px] bg-white justify-center items-center"
        >
          <Ionicons name="arrow-back" size={24} color="#F1C40F" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => setShowBottomSheet(true)}
          className="w-[40px] h-[40px] rounded-[20px] bg-white justify-center items-center"
        >
          <MaterialIcons name="live-tv" size={24} color="#F1C40F" />
        </TouchableOpacity>
      ),
    });
  }, [singleRoomEditQuery.data]);

  return (
    <View>
      <Text>EditRoomScreen</Text>
    </View>
  );
};

export default EditRoomScreen;
