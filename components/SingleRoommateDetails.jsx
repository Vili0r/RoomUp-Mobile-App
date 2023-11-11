import React, { useLayoutEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Share,
  FlatList,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import moment from "moment";
import AdvertisedBy from "./AdvertisedBy";
import SinglePropertyFooter from "./SinglePropertyFooter";
import PropertyDetailsAmenities from "./PropertyDetailsAmenities";
import { useNavigation } from "@react-navigation/native";
import ParallaxScrollView from "./ParallaxScrollView";

const SingleRoommateDetails = ({
  listing,
  imageIndex,
  isFavourited,
  handleToggleFavourite,
}) => {
  const navigation = useNavigation();
  const imageUrl =
    listing.images[imageIndex] &&
    `http://127.0.0.1:8000/storage/${listing.images[imageIndex]}`;

  const shareListing = async () => {
    try {
      await Share.share({
        title: listing.title,
        url: listing.url,
      });
    } catch (err) {
      console.log(err);
    }
  };

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
          <Ionicons name="chevron-back" size={24} color={"#000"} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View className="flex-row items-center justify-center gap-1">
          <TouchableOpacity
            onPress={shareListing}
            className="w-[40px] h-[40px] rounded-[20px] bg-white justify-center items-center"
          >
            <Ionicons name="share-outline" size={22} color={"#000"} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleToggleFavourite}
            className="w-[40px] h-[40px] rounded-[20px] bg-white justify-center items-center"
          >
            {isFavourited ? (
              <Ionicons name="heart" size={22} color={"#ed5353"} />
            ) : (
              <Ionicons name="heart-outline" size={22} color={"#000"} />
            )}
          </TouchableOpacity>
        </View>
      ),
    });
  }, [isFavourited]);

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
            className="bg-white ml-[50px] mt-1"
            style={{
              justifyContent: "flex-end",
            }}
          >
            <Text className="m-[10px] text-lg font-medium">
              {listing.title}
            </Text>
          </View>
        )}
      >
        <View className="p-3">
          <Text className="text-xl font-bold text-gray-700">
            {listing.title}
          </Text>

          <View className="flex items-start mt-2 space-y-1">
            <Text className="text-base font-semibold">
              £{listing.budget}
              /month
            </Text>

            <Text className="flex gap-1 font-semibold underline">
              <Ionicons name="location-outline" size={24} color="gray" />

              <Text className="text-base font-semibold text-gray-700 capitalize">
                {listing.area},
              </Text>

              <Text className="text-base font-semibold text-gray-700 capitalize">
                {" "}
                {listing.city}
              </Text>
            </Text>
          </View>

          <View className="flex items-start border-0 border-t-2 mt-7 border-t-gray-200">
            <Text className="mt-5 text-xl font-bold text-gray-700 ">
              Overview
            </Text>
            <Text className="mt-3 text-base font-medium text-gray-700">
              {listing.description}
            </Text>
            <View className="flex flex-col gap-1 font-[450px] mt-9 text-neutral-500">
              <Text className="">Available from: {listing.room_size} </Text>
              <Text>Searching for: {listing.searching_for}</Text>
              <Text>
                Available from:{" "}
                {moment(listing.availability?.available_from).format(
                  "MMM DD, YYYY"
                )}
              </Text>
            </View>
          </View>
          <View className="mt-[1rem]">
            <PropertyDetailsAmenities amenities={listing.amenities} />
          </View>

          <View className="flex border-0 border-t-2 mt-7 border-t-gray-200">
            <Text className="mt-5 text-xl font-bold text-gray-700">
              Availability
            </Text>
            <View className="flex flex-col gap-2 font-[450px] mt-2 text-neutral-500 text-base">
              <Text className="flex items-center gap-2 capitalize">
                <Feather name="minimize" size={20} />
                {listing.availability.minimum_stay}
              </Text>

              <Text className="flex gap-2 capitalize">
                <Feather name="maximize" size={20} />
                {listing.availability.maximum_stay}
              </Text>

              <Text className="flex gap-2 capitalize">
                <Ionicons name="calendar-outline" size={20} />
                {listing.availability.days_available}
              </Text>
              <Text className="flex gap-2 capitalize">
                <MaterialIcons name="short-text" size={20} />
                {listing.availability.short_term}
              </Text>
            </View>
          </View>

          <View className="flex border-0 border-t-2 mt-7 border-t-gray-200">
            <Text className="mt-5 text-xl font-bold text-gray-700">
              Hobbies
            </Text>
            <FlatList
              data={listing.hobbies}
              renderItem={({ item, index }) => (
                <View className="flex flex-row items-center gap-3 mt-1 mr-5">
                  <Text
                    className="text-neutral-500 text-base font-[450px]"
                    key={item.id}
                  >
                    {item.name}
                  </Text>
                  {index % 2 === 0 && <Text className="font-bold">·</Text>}
                </View>
              )}
              keyExtractor={(item) => item.id}
              numColumns={2}
            />
          </View>

          <View className="flex border-0 border-t-2 mt-7 border-t-gray-200">
            <Text className="mt-5 text-xl font-bold text-gray-700">
              Know me better
            </Text>
            <View className="flex flex-row items-center gap-3 mt-1 mr-5">
              <Text className="text-neutral-500 text-base font-[450px]">
                Age: {listing.age}
              </Text>
              <Text className="font-bold">·</Text>
              <Text className="text-neutral-500 text-base font-[450px]">
                Smoker: {listing.smoker}
              </Text>
              <Text className="font-bold">·</Text>
              <Text className="text-neutral-500 text-base font-[450px]">
                Gender: {listing.gender}
              </Text>
            </View>
          </View>

          <AdvertisedBy
            advertiser={listing.advertiser}
            occupation={listing.occupation}
          />
        </View>
      </ParallaxScrollView>

      <SinglePropertyFooter
        id={listing.id}
        type={listing.model}
        name={listing.advertiser.first_name}
      />
    </>
  );
};

export default SingleRoommateDetails;
