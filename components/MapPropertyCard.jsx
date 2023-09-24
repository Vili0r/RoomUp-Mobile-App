import React, { useRef, useState, useContext } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Pressable,
  FlatList,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import moment from "moment";
const LISTMARGIN = 10;
const WIDTH = Dimensions.get("screen").width - LISTMARGIN * 2;
import { useNavigation } from "@react-navigation/native";
import axiosConfig from "../helpers/axiosConfig";
import { AuthContext } from "../context/AuthProvider";

const MapPropertyCard = ({ property, toggleFavourite }) => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const viewConfig = { viewAreaCoveragePercentThreshold: 95 };
  const [activeIndex, setActiveIndex] = useState(0);
  const onViewRef = useRef(({ changed }) => {
    if (changed[0].isViewable) {
      setActiveIndex(changed[0].index);
    }
  });
  const imageUrl =
    property.images[0] && `http://127.0.0.1:8000/storage/${property.images[0]}`;

  const handleToggleFavorite = async (id, model) => {
    if (!user) {
      navigation.navigate("Login Screen");
      return;
    }
    await axiosConfig
      .post(`/favourite/${model}/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((response) => {
        toggleFavourite(id);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handlePressLeft = () => {
    if (activeIndex === 0)
      return flatListRef.current?.scrollToIndex({
        animated: false,
        index: property.images.length - 1,
      });

    flatListRef.current?.scrollToIndex({
      index: activeIndex - 1,
    });
  };

  const handlePressRight = () => {
    if (activeIndex === property.images.length - 1)
      return flatListRef.current?.scrollToIndex({
        animated: false,
        index: 0,
      });

    flatListRef.current?.scrollToIndex({
      index: activeIndex + 1,
    });
  };

  return (
    <View className="absolute mx-[10px] bg-white bottom-3 rounded-xl">
      <View className="w-full gap-2">
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Property Details Screen", {
              id: property.id,
              model: property.model,
              index: activeIndex,
            })
          }
        >
          <View className="relative -mr-2 overflow-hidden rounded-t-xl">
            <FlatList
              ref={(ref) => (flatListRef.current = ref)}
              keyExtractor={(item, index) => index.toString()}
              data={property.images}
              viewabilityConfig={viewConfig}
              onViewableItemsChanged={onViewRef.current}
              renderItem={({ item }) => (
                <Image
                  style={{
                    width: WIDTH,
                  }}
                  className="h-[200px] aspect-3/2"
                  source={
                    imageUrl
                      ? { uri: `http://127.0.0.1:8000/storage/${item}` }
                      : require("../assets/images/HousePlaceholder.jpeg")
                  }
                />
              )}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              snapToAlignment="center"
            />
            <Pressable
              style={{ position: "absolute", top: 85, left: 5 }}
              onPress={handlePressLeft}
            >
              <Ionicons size={36} name="chevron-back" color="white" />
            </Pressable>
            <Pressable
              style={{ position: "absolute", top: 85, right: 5 }}
              onPress={handlePressRight}
            >
              <Ionicons size={36} name="chevron-forward" color="white" />
            </Pressable>

            <View className="absolute top-3 right-3">
              <Pressable
                onPress={() =>
                  handleToggleFavorite(property.id, property.model)
                }
                className="relative transition hover:opacity-80"
              >
                <FontAwesome size={28} name="heart-o" color="white" />
                <View className="fill-white absolute top-[2px] right-[2px]">
                  {property.favouritedBy ? (
                    <FontAwesome size={24} name="heart" color="red" />
                  ) : (
                    <FontAwesome
                      size={24}
                      name="heart"
                      color="rgba(128, 128, 128, 0.7)"
                    />
                  )}
                </View>
              </Pressable>
            </View>
          </View>
        </TouchableOpacity>
        <View className="flex flex-row items-start justify-between px-2 pb-2">
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Property Details Screen", {
                id: property.id,
                model: property.model,
                index: activeIndex,
              })
            }
          >
            <View className="">
              <Text className="text-sm font-bold text-gray-800">
                {property.budget
                  ? property.area
                  : property.owner
                  ? property.owner.address?.address_1
                  : property.address.address_1}
                ,
                {property.budget
                  ? property.city
                  : property.owner
                  ? property.owner.address?.area
                  : property.address.area}
              </Text>
              <Text className="text-sm text-gray-800">
                {property.model === "room"
                  ? property.sub_title === null
                    ? property.owner.title
                    : `${property.sub_title} in a ${property.owner.title}`
                  : property.title}
              </Text>
              <Text className="text-sm text-gray-800">
                Available from{" "}
                <Text className="font-semibold">
                  {moment(
                    property.availability
                      ? property.availability.available_from
                      : property.available_from
                  ).format("MMM DD, YYYY")}
                </Text>
              </Text>
              {property.searching_for && (
                <Text className="text-sm text-gray-800">
                  Searching for{" "}
                  <Text className="font-semibold">
                    {property.searching_for}
                  </Text>
                </Text>
              )}
              <Text className="mt-2 text-sm text-gray-800">
                {" "}
                <Text>
                  £
                  {property.budget
                    ? property.budget
                    : property.owner
                    ? property.room_cost
                    : property.cost}
                </Text>{" "}
                /month
              </Text>
            </View>
          </TouchableOpacity>
          <View className="flex flex-row items-center">
            <Text className="flex items-center text-indigo-600 dark:text-indigo-400">
              <Feather
                name="eye"
                size={18}
                className="w-5 h-5 mr-1 stroke-current dark:stroke-indigo-500"
              />
              <Text className="text-lg">({property.views})</Text>
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default MapPropertyCard;
