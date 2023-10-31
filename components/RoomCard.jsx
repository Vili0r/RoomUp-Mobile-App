import React, { useContext } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthProvider";

const RoomCard = ({ item: room, title }) => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  //   const imageUrl =
  //     room?.images[0] && `http://127.0.0.1:8000/storage/${room?.images[0]}`;

  const handleEditRoom = () => {
    navigation.navigate("Edit Room Screen", {
      id: room.id,
      token: user.token,
      title,
    });
  };

  return (
    <View className="p-2">
      <View className="flex flex-col gap-2">
        <TouchableOpacity onPress={handleEditRoom}>
          <View className="relative overflow-hidden aspect-square rounded-xl">
            <Image
              className="w-full h-[300px] aspect-3/2"
              source={require("../assets/images/HousePlaceholder.jpeg")}
            />

            <View className="absolute top-3 right-3">
              <View className="relative">
                {room.live_at === "" || room.live_at === null ? (
                  <View className="flex-row items-center justify-center px-3 py-1 text-gray-500 rounded-full gap-x-2 bg-gray-100/60">
                    <Ionicons
                      name="stop-circle-outline"
                      size={24}
                      color="black"
                    />

                    <Text className="text-sm font-normal">Halted</Text>
                  </View>
                ) : (
                  <View className="flex-row items-center px-3 py-1 rounded-full gap-x-2 text-emerald-500 bg-emerald-100/60">
                    <MaterialIcons name="live-tv" size={24} color="black" />

                    <Text className="text-sm font-normal">
                      Live at {moment(room.live_at).format("MMM DD, YYYY")}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleEditRoom}>
          <View className="flex flex-row items-start justify-between mt-4">
            <View>
              <Text className="text-sm text-gray-800">{room?.sub_title}</Text>

              <Text className="text-sm text-gray-800">
                Available from{" "}
                <Text className="font-semibold">
                  {moment(room.available_from).format("MMM DD, YYYY")}
                </Text>
              </Text>
              <Text className="text-sm text-gray-800">
                £{room.room_cost} /month
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RoomCard;
