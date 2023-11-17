import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import RangeSlider from "../components/RangeSlider";
import Animated, {
  SlideInDown,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";
import DatePicker from "react-native-modern-datepicker";
import { Amenities } from "../helpers/arrays";
import Checkbox from "expo-checkbox";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

export const bedrooms = [
  { id: 1, title: "Studio/1" },
  { id: 2, title: "2" },
  { id: 3, title: "3" },
  { id: 4, title: "4" },
  { id: 5, title: "5" },
  { id: 6, title: "6+" },
];
const MIN_DEFAULT = 10;
const MAX_DEFAULT = 5000;

const ModalFilterProperties = () => {
  const [openCard, setOpenCard] = useState(0);
  const today = new Date().toISOString().substring(0, 10);
  const [size, setSize] = useState("");
  const [minPrice, setMinPrice] = useState(MIN_DEFAULT);
  const [maxPrice, setMaxPrice] = useState(MAX_DEFAULT);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const toggleAmenity = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(
        selectedAmenities.filter((item) => item !== amenity)
      );
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };
  const onClearAll = () => {
    setOpenCard(0);
  };
  const handleSearch = () => {};

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginBottom: 100 }}
      >
        {/* Where */}
        <View style={styles.card}>
          {openCard != 0 && (
            <AnimatedTouchableOpacity
              onPress={() => setOpenCard(0)}
              className="flex-row justify-between p-5"
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
            >
              <Text className="font-medium text-gray-500">Where</Text>
              <Text className="font-medium text-gray-800">I'm flexible</Text>
            </AnimatedTouchableOpacity>
          )}

          {openCard === 0 && (
            <>
              <Text className="p-5 text-2xl font-bold">
                Where are you looking?
              </Text>
            </>
          )}
          {openCard === 0 && (
            <Animated.View
              entering={FadeIn}
              exiting={FadeOut}
              className="px-5 pb-5"
            >
              <View className="h-[50px] flex-row justify-center items-center bg-white border-[1px] border-gray-300 rounded-lg mb-4">
                <Ionicons
                  style={{ padding: 10 }}
                  name="ios-search"
                  size={20}
                  color="#000"
                />
                <TextInput
                  className="flex-1 p-2 bg-white"
                  placeholder="Search location"
                  placeholderTextColor="#5E5D5E"
                />
              </View>
            </Animated.View>
          )}
        </View>
        {/* When */}
        <View style={styles.card}>
          {openCard != 1 && (
            <AnimatedTouchableOpacity
              onPress={() => setOpenCard(1)}
              className="flex-row justify-between p-5"
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
            >
              <Text className="font-medium text-gray-500">When</Text>
              <Text className="font-medium text-gray-800">Any time</Text>
            </AnimatedTouchableOpacity>
          )}
          {openCard === 1 && (
            <>
              <Text className="p-5 text-2xl font-bold">
                When you want to move?
              </Text>
            </>
          )}
          {openCard === 1 && (
            <Animated.View
              entering={FadeIn}
              exiting={FadeOut}
              className="px-5 pb-5"
            >
              <DatePicker
                options={{
                  mainColor: "black",
                  borderColor: "transparent",
                }}
                current={today}
                selected={today}
                mode={"calendar"}
              />
            </Animated.View>
          )}
        </View>
        {/* Who
      <View style={styles.card}>
        {openCard != 2 && (
          <AnimatedTouchableOpacity
            onPress={() => setOpenCard(2)}
            className="flex-row justify-between p-5"
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
          >
            <Text className="font-medium text-gray-500">Who</Text>
            <Text className="font-medium text-gray-800">Add guest</Text>
          </AnimatedTouchableOpacity>
        )}
        {openCard === 2 && (
          <>
            <Text className="p-5 text-2xl font-bold">Who's moving?</Text>
          </>
        )}
        {openCard === 2 && (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            className="px-5 pb-5"
          >
            <View className="px-5 pb-5">
              {groups.map((item, index) => (
                <View
                  key={index}
                  style={[
                    styles.guestItem,
                    index + 1 < guestsGropus.length ? styles.itemBorder : null,
                  ]}
                >
                  <View>
                    <Text style={{ fontSize: 14 }}>{item.name}</Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#898686",
                      }}
                    >
                      {item.text}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        const newGroups = [...groups];
                        newGroups[index].count =
                          newGroups[index].count > 0
                            ? newGroups[index].count - 1
                            : 0;

                        setGroups(newGroups);
                      }}
                    >
                      <Ionicons
                        name="remove-circle-outline"
                        size={26}
                        color={groups[index].count > 0 ? "#898686" : "#cdcdcd"}
                      />
                    </TouchableOpacity>
                    <Text
                      style={{
                        fontSize: 16,
                        minWidth: 18,
                        textAlign: "center",
                      }}
                    >
                      {item.count}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        const newGroups = [...groups];
                        newGroups[index].count++;
                        setGroups(newGroups);
                      }}
                    >
                      <Ionicons
                        name="add-circle-outline"
                        size={26}
                        color="#898686"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </Animated.View>
        )}
      </View> */}
        {/* Property size */}
        <View style={styles.card}>
          {openCard != 3 && (
            <AnimatedTouchableOpacity
              onPress={() => setOpenCard(3)}
              className="flex-row justify-between p-5"
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
            >
              <Text className="font-medium text-gray-500">Property size</Text>
              <Text className="font-medium text-gray-800">Any size</Text>
            </AnimatedTouchableOpacity>
          )}
          {openCard === 3 && (
            <>
              <Text className="p-5 text-2xl font-bold">Bedrooms?</Text>
            </>
          )}
          {openCard === 3 && (
            <Animated.View
              entering={FadeIn}
              exiting={FadeOut}
              className="px-5 pb-5"
            >
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ paddingBottom: 20 }}
              >
                {bedrooms.map((bedroom, index) => (
                  <TouchableOpacity
                    onPress={() => setSize(bedroom.id)}
                    key={index}
                    className={`${
                      size == bedroom.id ? "bg-black " : "bg-white"
                    } relative p-1 py-2 px-6 border border-[#d2d1d1] rounded-lg mr-5`}
                  >
                    <Text
                      className={`${
                        size == bedroom.id ? " text-white" : " text-black"
                      } text-base font-semibold`}
                    >
                      {bedroom.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Animated.View>
          )}
        </View>
        {/* Property price */}
        <View style={styles.card}>
          {openCard != 4 && (
            <AnimatedTouchableOpacity
              onPress={() => setOpenCard(4)}
              className="flex-row justify-between p-5"
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
            >
              <Text className="font-medium text-gray-500">Property price</Text>
              <Text className="font-medium text-gray-800">Any price</Text>
            </AnimatedTouchableOpacity>
          )}
          {openCard === 4 && (
            <>
              <Text className="p-5 text-2xl font-bold">Price?</Text>
            </>
          )}
          {openCard === 4 && (
            <Animated.View
              entering={FadeIn}
              exiting={FadeOut}
              className="px-5 pb-10 mt-3"
            >
              <RangeSlider
                sliderWidth={300}
                min={MIN_DEFAULT}
                max={MAX_DEFAULT}
                step={10}
                onValueChange={(range) => {
                  setMinPrice(range.min);
                  setMaxPrice(range.max);
                }}
              />
              <View className="flex-row items-center justify-between px-6 mt-9">
                <View className="border-gray-300 border-[1px] p-2 rounded-lg">
                  <Text className="font-extralight">Minimum Price</Text>
                  <Text className="text-lg font-semibold">£{minPrice}</Text>
                </View>
                <Text className="text-5xl font-extralight">-</Text>
                <View className="border-gray-300 border-[1px] p-2 rounded-lg">
                  <Text className="font-extralight">Maximum Price</Text>
                  <Text className="text-lg font-semibold">£{maxPrice}</Text>
                </View>
              </View>
            </Animated.View>
          )}
        </View>
        {/* Amenities */}
        <View style={styles.card}>
          {openCard != 5 && (
            <AnimatedTouchableOpacity
              onPress={() => setOpenCard(5)}
              className="flex-row justify-between p-5"
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
            >
              <Text className="font-medium text-gray-500">Amenities</Text>
              <Text className="font-medium text-gray-800">Any amenities</Text>
            </AnimatedTouchableOpacity>
          )}
          {openCard === 5 && (
            <>
              <Text className="p-5 text-2xl font-bold">Amenities?</Text>
            </>
          )}
          {openCard === 5 && (
            <Animated.View
              entering={FadeIn}
              exiting={FadeOut}
              className="px-5 pb-10"
            >
              {Amenities.map((amenity) => (
                <View
                  key={amenity.key}
                  className="flex flex-row justify-between pb-2 space-y-2"
                >
                  <Text className="text-lg">{amenity.value}</Text>
                  <Checkbox
                    value={selectedAmenities?.includes(amenity.key)}
                    onValueChange={() => toggleAmenity(amenity.key)}
                    style={styles.checkbox}
                    color={
                      selectedAmenities?.includes(amenity.key)
                        ? "#04030c"
                        : undefined
                    }
                  />
                </View>
              ))}
            </Animated.View>
          )}
        </View>
      </ScrollView>
      {/* Footer */}
      <Animated.View
        className="absolute w-full bottom-0 right-0 bg-white px-2 py-5 border-t-gray-500 h-[100px]"
        style={{ borderTopWidth: StyleSheet.hairlineWidth }}
        entering={SlideInDown.delay(200)}
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={onClearAll}>
            <Text className="text-lg font-semibold underline">Clear all</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSearch}
            className="flex-row px-3 py-3 space-x-3 bg-black rounded-lg"
          >
            <Ionicons name="search-outline" size={24} color="white" />
            <Text className="text-lg font-semibold text-white">Search</Text>
          </TouchableOpacity>
        </View>
        {/* </View> */}
      </Animated.View>
    </>
  );
};

export default ModalFilterProperties;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    margin: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    gap: 20,
  },
  guestItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  itemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#898686",
  },
});
