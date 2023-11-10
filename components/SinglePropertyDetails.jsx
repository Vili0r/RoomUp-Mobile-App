import React, { useLayoutEffect } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import moment from "moment";
import ParallaxScrollView from "./ParallaxScrollView";
import AdvertisedBy from "./AdvertisedBy";
import SinglePropertyFooter from "./SinglePropertyFooter";
import PropertyDetailsAmenities from "./PropertyDetailsAmenities";
import PropertyLocation from "./PropertyLocation";
import { useNavigation } from "@react-navigation/native";

const SinglePropertyDetails = ({ property, imageIndex }) => {
  const navigation = useNavigation();
  const imageUrl =
    property.images[imageIndex] &&
    `http://127.0.0.1:8000/storage/${property.images[imageIndex]}`;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "",
      headerTintColor: "white",
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-[40px] h-[40px] rounded-[20px] bg-white justify-center items-center"
        >
          <Ionicons name="arrow-back" size={24} color="#F1C40F" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View className="flex-row items-center justify-center gap-1">
          <TouchableOpacity className="w-[40px] h-[40px] rounded-[20px] bg-white justify-center items-center">
            <Ionicons name="share-outline" size={24} color="#F1C40F" />
          </TouchableOpacity>
          <TouchableOpacity className="w-[40px] h-[40px] rounded-[20px] bg-white justify-center items-center">
            <Ionicons name="search-outline" size={24} color="#F1C40F" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, []);

  return (
    <>
      <ParallaxScrollView
        backgroundColor={"#fff"}
        style={{ flex: 1 }}
        parallaxHeaderHeight={300}
        stickyHeaderHeight={65}
        contentBackgroundColor={"#fff"}
        renderBackground={() => (
          <Image
            className="object-cover w-full h-[300px]"
            source={
              imageUrl
                ? { uri: imageUrl }
                : require("../assets/images/HousePlaceholder.jpeg")
            }
          />
        )}
        renderStickyHeader={() => (
          <View
            key="sticky-header"
            className="bg-white ml-[85px] mt-1"
            style={{
              justifyContent: "flex-end",
            }}
          >
            <Text className="m-[10px] text-lg font-medium">
              {property.model === "room"
                ? property.owner.title
                : property.title}
            </Text>
          </View>
        )}
      >
        <View className="p-3">
          <Text className="text-xl font-bold text-gray-700">
            {property.model === "room"
              ? property.sub_title === null
                ? property.owner.title
                : `${property.sub_title} in a ${property.owner.title}`
              : property.title}
          </Text>

          <View className="flex items-start mt-2 space-y-1">
            <Text className="text-base font-semibold">
              £{property.owner ? property.room_cost : property.cost}
              /month
            </Text>

            <Text className="flex gap-1 font-semibold underline">
              <Ionicons name="location-outline" size={24} color="gray" />

              <Text className="text-base font-semibold text-gray-700">
                {property.owner
                  ? property.owner.address?.address_1
                  : property.address?.address_1}
                ,
              </Text>

              <Text className="text-base font-semibold text-gray-700">
                {property.owner
                  ? property.owner.address?.city
                  : property.address?.city}
              </Text>
            </Text>
          </View>

          <View className="flex items-start">
            <Text className="mt-5 text-xl font-bold text-gray-700 ">
              Overview
            </Text>
            <Text className="mt-3 text-base font-medium text-gray-700">
              {property.description}

              {property.owner && property.owner.description}
            </Text>
            <View className="flex flex-col gap-1 font-[450px] mt-9 text-neutral-500">
              <Text className="">
                {property.owner ? property.owner.size : property.size} rooms
              </Text>
              <Text>
                Type: {property.owner ? property.owner.type : property.type}
              </Text>
              <Text>
                Available from:{" "}
                {moment(
                  property.owner
                    ? property.available_from
                    : property.availability?.available_from
                ).format("MMM DD, YYYY")}
              </Text>
              <Text>
                {property.owner ? property.room_furnished : property.furnished}
              </Text>
            </View>
          </View>
          <View className="mt-[1rem]">
            {property.owner ? (
              <PropertyDetailsAmenities amenities={property.owner.amenities} />
            ) : (
              <PropertyDetailsAmenities amenities={property.amenities} />
            )}
          </View>

          {property.owner ? (
            <PropertyLocation address={property.owner.address} />
          ) : (
            <PropertyLocation address={property.address} />
          )}

          <View className="flex border-0 border-t-2 mt-7 border-t-gray-200">
            <Text className="mt-5 text-xl font-bold text-gray-700">
              Availability
            </Text>
            <View className="flex flex-col gap-2 font-[450px] mt-2 text-neutral-500 text-base">
              <Text className="flex items-center gap-2 capitalize">
                <Feather name="minimize" size={20} />
                {property.owner
                  ? property.minimum_stay
                  : property.availability?.minimum_stay}
              </Text>

              <Text className="flex gap-2 capitalize">
                <Feather name="maximize" size={20} />

                {property.owner
                  ? property.maximum_stay
                  : property.availability?.maximum_stay}
              </Text>

              <Text className="flex gap-2 capitalize">
                <Ionicons name="calendar-outline" size={20} />
                {property.owner
                  ? property.days_available
                  : property.availability?.days_available}
              </Text>
              <Text className="flex gap-2 capitalize">
                <MaterialIcons name="short-text" size={20} />
                {property.owner
                  ? property.short_term
                  : property.availability?.short_term}
              </Text>
            </View>
          </View>

          <View className="flex border-0 border-t-2 mt-7 border-t-gray-200">
            <Text className="mt-5 text-xl font-bold text-gray-700">
              Transport
            </Text>
            <View className="flex flex-row gap-3 items-start font-[450px] mt-2 text-neutral-500 text-base">
              <Text className="flex items-start gap-2 capitalize">
                <Ionicons name="hourglass-outline" size={20} />{" "}
                {property.owner
                  ? property.owner.transport.minutes
                  : property.transport?.minutes}
              </Text>
              <Text className="block">|</Text>
              <Text className="flex items-start capitalize">
                <Ionicons name="airplane-outline" size={20} />

                {property.owner
                  ? property.owner.transport.mode
                  : property.transport?.mode}
              </Text>
              <Text className="block ">|</Text>
              <Text className="flex items-start gap-2 capitalize">
                <Ionicons name="train-outline" size={20} />

                {property.owner
                  ? property.owner.transport.station
                  : property.transport?.station}
              </Text>
            </View>
          </View>

          {property.owner ? (
            <AdvertisedBy
              advertiser={property.owner.advertiser}
              occupation={property.owner.what_i_am}
            />
          ) : (
            <AdvertisedBy
              advertiser={property.advertiser}
              occupation={property.what_i_am}
            />
          )}
        </View>
      </ParallaxScrollView>
      {property.owner ? (
        <SinglePropertyFooter
          id={property.id}
          type={property.model}
          name={property.owner.advertiser.first_name}
        />
      ) : (
        <SinglePropertyFooter
          id={property.id}
          type={property.model}
          name={property.advertiser.first_name}
        />
      )}
    </>
  );
};

export default SinglePropertyDetails;
