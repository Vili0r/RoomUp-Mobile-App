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

const PropertyCard = ({ item: property }) => {
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
    navigation.navigate("Message Advertiser Screen", {
      id: property.id,
      type: property.model,
    });
  };

  const gotoPropertyDetails = () => {
    navigation.navigate("Property Details Screen", {
      id: property.id,
      model: property.model,
      index: activeIndex,
    });
  };

  return (
    <View className="flex flex-row group">
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
        <View className="flex flex-row items-start justify-between mt-4">
          <TouchableOpacity onPress={() => gotoPropertyDetails()}>
            <View>
              <Text className="text-sm font-bold text-gray-800">
                {property.address_1}, {property.area}
              </Text>
              <Text className="text-sm text-gray-800">{property.title}</Text>
              <Text className="text-sm text-gray-800">
                Available from{" "}
                <Text className="font-semibold">
                  {moment(property.available_from).format("MMM DD, YYYY")}
                </Text>
              </Text>
              <Text className="mt-2 text-sm text-gray-800">
                {" "}
                <Text>${property.cost}</Text> /month
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
        <View className="p-6 pt-3">
          <TouchableOpacity
            onPress={handleClick}
            className="flex w-full select-none rounded-full bg-yellow-400 py-3.5 px-7 text-center justify-center shadow-md shadow-yellow-500/20"
          >
            <Text className="text-sm font-semibold text-center text-black font-base">
              Message {property.first_name}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PropertyCard;
