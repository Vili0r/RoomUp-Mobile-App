import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import axiosConfig from "../helpers/axiosConfig";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BottomSheet from "../components/BottomSheet";
import { useQuery } from "@tanstack/react-query";
import { EditSharedForm, RoomCard } from "../components";

const EditSharedScreen = ({ route, navigation }) => {
  const { id, token } = route.params;
  const fetchEditShared = async (id) => {
    const response = await axiosConfig.get(`/shareds/${id}/edit`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.shared;
  };

  const singleSharedEditQuery = useQuery({
    queryKey: ["singleSharedEditQuery", id, "edit"],
    queryFn: () => fetchEditShared(id),
    refetchOnMount: true,
  });

  const [showBottomSheet, setShowBottomSheet] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: false,
      headerTitle: singleSharedEditQuery.data?.title,
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
          <MaterialCommunityIcons
            name="bed-king-outline"
            size={28}
            color="#F1C40F"
          />
        </TouchableOpacity>
      ),
    });
  }, [singleSharedEditQuery.data]);

  return (
    <View className="items-center justify-center flex-1 bg-white">
      <StatusBar />
      <View className="flex-1 w-full px-3">
        {singleSharedEditQuery.isLoading ? (
          <ActivityIndicator className="mt-2" size="large" color="gray" />
        ) : (
          <EditSharedForm property={singleSharedEditQuery.data} />
        )}
      </View>
      <BottomSheet
        show={showBottomSheet}
        onDismiss={() => setShowBottomSheet(false)}
        text="Manage Rooms"
        modalHeight="0.55"
      >
        <Text className="p-2 text-gray-600">
          Select each room to edit and upload individual room photos
        </Text>
        <FlatList
          data={singleSharedEditQuery.data?.rooms}
          horizontal
          style={{ marginTop: 10 }}
          showsHorizontalScrollIndicator={false}
          renderItem={(props) => (
            <RoomCard {...props} title={singleSharedEditQuery.data?.title} />
          )}
          keyExtractor={(_, index) => index.toString()}
        />
      </BottomSheet>
    </View>
  );
};

export default EditSharedScreen;
