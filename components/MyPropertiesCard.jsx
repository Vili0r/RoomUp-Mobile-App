import React, { useRef, useState } from "react";
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
import { MaterialIcons } from "@expo/vector-icons";

const MyPropertiesCard = ({ item: property }) => {
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

  const addToWishlist = (e, id, model) => {
    e.preventDefault();
    console.log(id, model);
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

  const handleClick = () => {
    navigation.navigate("Message Screen");
  };

  const gotoPropertyAvailability = () => {
    // navigation.navigate("Property Details Screen", {
    //   id: property.id,
    //   model: property.model,
    //   index: activeIndex,
    // });
    console.log("Goto Property Availability Screen");
  };

  return (
    <View className="flex flex-row mb-8 group">
      <View className="flex flex-col w-full gap-2">
        <TouchableOpacity onPress={() => gotoPropertyDetails()}>
          <View className="relative w-full overflow-hidden aspect-square rounded-xl">
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
                  className="h-full aspect-3/2"
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
              style={{ position: "absolute", top: 185, left: 5 }}
              onPress={handlePressLeft}
            >
              <Ionicons size={36} name="chevron-back" color="white" />
            </Pressable>
            <Pressable
              style={{ position: "absolute", top: 185, right: 5 }}
              onPress={handlePressRight}
            >
              <Ionicons size={36} name="chevron-forward" color="white" />
            </Pressable>
            <View className="absolute top-3 right-3">
              <Pressable
                onPress={(e) => addToWishlist(property.id, property.model)}
                className="relative transition hover:opacity-80"
              >
                {property.live_at === "" || property.live_at === null ? (
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
                      Live at {moment(property.live_at).format("MMM DD, YYYY")}
                    </Text>
                  </View>
                )}
              </Pressable>
            </View>
          </View>
        </TouchableOpacity>
        <View className="flex flex-row items-start justify-between mt-4">
          <TouchableOpacity onPress={() => gotoPropertyAvailability()}>
            <View>
              <Text className="text-sm text-gray-800">{property.title}</Text>

              <Text className="text-sm text-gray-800">
                Created at{" "}
                <Text className="font-semibold">
                  {moment(property.created_at).format("MMM DD, YYYY")}
                </Text>
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View className="flex flex-row justify-between">
          <TouchableOpacity
            onPress={handleClick}
            className="flex justify-center w-2/5 py-2 text-center bg-black rounded-full select-none px-7"
          >
            <Text className="text-base font-bold text-center text-white">
              Edit
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleClick}
            className="flex justify-center w-2/5 py-2 text-center border-2 rounded-full select-none px-7 border-balck"
          >
            <Text className="text-sm font-semibold text-center text-black font-base">
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default MyPropertiesCard;
