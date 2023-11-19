import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import RangeSlider from "../components/RangeSlider";
import Animated, {
  SlideInDown,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";
import DatePicker from "react-native-modern-datepicker";
import { Amenities } from "../helpers/arrays";
import Checkbox from "expo-checkbox";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSelectedFiltersContext } from "../context/SelectedFiltersContext";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const places = [
  {
    id: 1,
    title: "Apartment",
    icon: <MaterialIcons name="apartment" size={26} color="black" />,
  },
  {
    id: 2,
    title: "Full House",
    icon: <MaterialIcons name="house" size={26} color="black" />,
  },
  {
    id: 3,
    title: "Property",
    icon: (
      <MaterialCommunityIcons
        name="office-building-outline"
        size={26}
        color="black"
      />
    ),
  },
  {
    id: 4,
    title: "Room",
    icon: <Ionicons name="bed-outline" size={26} color="black" />,
  },
];

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
  const { selectedPropertyFilterQueries } = useSelectedFiltersContext();
  const navigation = useNavigation();
  const [openCard, setOpenCard] = useState(0);
  const today = new Date().toISOString().substring(0, 10);
  const [size, setSize] = useState(
    selectedPropertyFilterQueries?.filter?.size ?? ""
  );
  const [minPrice, setMinPrice] = useState(
    selectedPropertyFilterQueries?.filter?.min_price ?? MIN_DEFAULT
  );
  const [maxPrice, setMaxPrice] = useState(
    selectedPropertyFilterQueries?.filter?.max_price ?? MAX_DEFAULT
  );
  const amenitiesArray =
    selectedPropertyFilterQueries?.filter?.amenity ?? ""
      ? selectedPropertyFilterQueries.filter.amenity.split(",").map(Number)
      : [];

  const [selectedAmenities, setSelectedAmenities] = useState(
    amenitiesArray ?? []
  );
  const [furnished, setFurnished] = useState("");
  const [furnishedCheckbox, setFurnishedCheckbox] = useState(
    selectedPropertyFilterQueries?.filter?.furnished === "1" ? true : false
  );
  const [shortTerm, setShortTerm] = useState(false);
  const [pet, setPet] = useState("");
  const [petCheckbox, setPetCheckbox] = useState(
    selectedPropertyFilterQueries?.filter?.new_flatmate_pets === "2"
      ? true
      : false
  );
  const [selectedDate, setSelectedDate] = useState(
    selectedPropertyFilterQueries?.filter?.available_from ??
      new Date().toISOString().substring(0, 10)
  );
  const [search, setSearch] = useState(
    selectedPropertyFilterQueries?.search ?? ""
  );
  const [type, setType] = useState(
    selectedPropertyFilterQueries?.filter?.type
      ? selectedPropertyFilterQueries?.filter?.type
      : selectedPropertyFilterQueries?.search_type === "shareds"
      ? 4
      : ""
  );
  console.log("backend Property", selectedPropertyFilterQueries);
  const onClearAll = () => {
    setOpenCard(0);
    setSize("");
    setMinPrice(MIN_DEFAULT);
    setMaxPrice(MAX_DEFAULT);
    setSelectedAmenities([]);
    setFurnished("");
    setFurnishedCheckbox(false);
    setShortTerm(false);
    setPet("");
    setPetCheckbox(false);
    setSelectedDate(new Date().toISOString().substring(0, 10));
    setSearch("");
    setType("");
  };

  const toggleAmenity = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(
        selectedAmenities.filter((item) => item !== amenity)
      );
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleFurnishedCheckbox = (value) => {
    setFurnishedCheckbox(value);
    if (value) {
      setFurnished(1);
    } else {
      setFurnished(2);
    }
  };

  const handlePetCheckbox = (value) => {
    setPetCheckbox(value);
    if (!value) {
      setPet(1);
    } else {
      setPet(2);
    }
  };

  const handleSearch = () => {
    let href = "/search?";

    if (type !== "" && type !== 4) {
      href += "filter[type]=" + type + "&";
    }
    if (type === 4) {
      href += "search_type=shareds&";
    }
    if (search !== "") {
      href += "search=" + search + "&";
    }
    if (size !== "") {
      href += "filter[size]=" + size + "&";
    }
    if (minPrice !== 10 && minPrice !== "") {
      href += "filter[min_price]=" + minPrice + "&";
    }
    if (maxPrice !== 5000 && maxPrice !== "") {
      href += "filter[max_price]=" + maxPrice + "&";
    }
    if (selectedAmenities.length) {
      href += "filter[amenity]=" + selectedAmenities + "&";
    }
    if (furnished !== "") {
      href += "filter[furnished]=" + furnished + "&";
    }
    if (pet !== "" && type === 4) {
      href += "filter[current_flatmate_pets]=" + pet + "&";
    }
    if (pet !== "" && type !== 4) {
      href += "filter[new_flatmate_pets]=" + pet + "&";
    }
    if (shortTerm) {
      href += "&filter[short_term]=" + shortTerm + "&";
    }
    href += "filter[available_from]=" + selectedDate;
    // if (gender !== "" && type === 4) {
    //   href += "&filter[current_flatmate_gender]=" + gender + "&";
    // }
    // if (occupation !== "" && type === 4) {
    //   href += "&filter[current_flatmate_occupation]=" + occupation + "&";
    // }
    // if (smoker !== "" && type === 4) {
    //   href += "&filter[current_flatmate_smoker]=" + smoker + "&";
    // }

    navigation.navigate("Search Screen", {
      href,
    });
  };

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
                  onChangeText={(value) => setSearch(value)}
                />
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ paddingBottom: 20, marginTop: 10 }}
              >
                {places.map((place, index) => (
                  <AnimatedTouchableOpacity
                    onPress={() => setType(place.id)}
                    key={place.id}
                    entering={FadeIn.duration(200)}
                    exiting={FadeOut.duration(200)}
                    className={`${
                      type === place.id ? "border-black" : "border-gray-200"
                    } justify-center h-[100px] w-[120px] border-[1px] rounded-xl items-center mr-2 mt-3`}
                  >
                    {place.icon}
                    <Text className="mb-2 text-base ">{place.title}</Text>
                  </AnimatedTouchableOpacity>
                ))}
              </ScrollView>
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
                selected={selectedDate}
                onSelectedChange={(date) => setSelectedDate(date)}
                mode={"calendar"}
              />
            </Animated.View>
          )}
        </View>
        {/* Property size */}
        <View style={styles.card}>
          {openCard != 2 && (
            <AnimatedTouchableOpacity
              onPress={() => setOpenCard(2)}
              className="flex-row justify-between p-5"
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
            >
              <Text className="font-medium text-gray-500">Property size</Text>
              <Text className="font-medium text-gray-800">Any size</Text>
            </AnimatedTouchableOpacity>
          )}
          {openCard === 2 && (
            <>
              <Text className="p-5 text-2xl font-bold">Bedrooms?</Text>
            </>
          )}
          {openCard === 2 && (
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
          {openCard != 3 && (
            <AnimatedTouchableOpacity
              onPress={() => setOpenCard(3)}
              className="flex-row justify-between p-5"
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
            >
              <Text className="font-medium text-gray-500">Property price</Text>
              <Text className="font-medium text-gray-800">Any price</Text>
            </AnimatedTouchableOpacity>
          )}
          {openCard === 3 && (
            <>
              <Text className="p-5 text-2xl font-bold">Price?</Text>
            </>
          )}
          {openCard === 3 && (
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
          {openCard != 4 && (
            <AnimatedTouchableOpacity
              onPress={() => setOpenCard(4)}
              className="flex-row justify-between p-5"
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
            >
              <Text className="font-medium text-gray-500">Amenities</Text>
              <Text className="font-medium text-gray-800">Any amenities</Text>
            </AnimatedTouchableOpacity>
          )}
          {openCard === 4 && (
            <>
              <Text className="p-5 text-2xl font-bold">Amenities?</Text>
            </>
          )}
          {openCard === 4 && (
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
        {/* Details */}
        <View style={styles.card}>
          {openCard != 5 && (
            <AnimatedTouchableOpacity
              onPress={() => setOpenCard(5)}
              className="flex-row justify-between p-5"
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
            >
              <Text className="font-medium text-gray-500">Details</Text>
              <Text className="font-medium text-gray-800">
                Additional details
              </Text>
            </AnimatedTouchableOpacity>
          )}
          {openCard === 5 && (
            <>
              <Text className="p-5 text-2xl font-bold">Check details?</Text>
            </>
          )}
          {openCard === 5 && (
            <Animated.View
              entering={FadeIn}
              exiting={FadeOut}
              className="px-5 pb-10"
            >
              <View className="flex flex-row justify-between pb-2 space-y-2">
                <Text className="text-lg">Furnished</Text>
                <Checkbox
                  value={furnishedCheckbox}
                  onValueChange={(value) => handleFurnishedCheckbox(value)}
                  style={styles.checkbox}
                  color={furnishedCheckbox ? "#04030c" : undefined}
                />
              </View>
              <View className="flex flex-row justify-between pb-2 space-y-2">
                <Text className="text-lg">Short Term</Text>
                <Checkbox
                  value={shortTerm}
                  onValueChange={() => setShortTerm(!shortTerm)}
                  style={styles.checkbox}
                  color={shortTerm ? "#04030c" : undefined}
                />
              </View>
              <View className="flex flex-row justify-between pb-2 space-y-2">
                <Text className="text-lg">Pet's allowed</Text>
                <Checkbox
                  value={petCheckbox}
                  onValueChange={(value) => handlePetCheckbox(value)}
                  style={styles.checkbox}
                  color={petCheckbox ? "#04030c" : undefined}
                />
              </View>
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
  checkbox: {
    marginTop: 12,
    marginLeft: 6,
  },
});
