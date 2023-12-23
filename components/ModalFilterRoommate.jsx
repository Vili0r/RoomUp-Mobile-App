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
import { hobbies } from "../helpers/arrays";
import Checkbox from "expo-checkbox";
import { useNavigation } from "@react-navigation/native";
import { useSelectedFiltersContext } from "../context/SelectedFiltersContext";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const MIN_DEFAULT = 10;
const MAX_DEFAULT = 5000;

export const roomSize = [
  { id: 1, title: "Single" },
  { id: 2, title: "Double" },
];
export const Genders = [
  { id: 1, title: "Female" },
  { id: 2, title: "Male" },
];
export const Occupations = [
  { id: 1, title: "Student" },
  { id: 2, title: "Professional" },
];

const ModalFilterRoommate = () => {
  const { selectedRoommateFilterQueries } = useSelectedFiltersContext();
  const navigation = useNavigation();
  const [openCard, setOpenCard] = useState(0);
  const today = new Date().toISOString().substring(0, 10);
  const [size, setSize] = useState(
    selectedRoommateFilterQueries?.filter?.room_size ?? ""
  );
  const [minBudget, setMinBudget] = useState(
    selectedRoommateFilterQueries?.filter?.min_budget ?? MIN_DEFAULT
  );
  const [maxBudget, setMaxBudget] = useState(
    selectedRoommateFilterQueries?.filter?.max_budget ?? MAX_DEFAULT
  );
  const hobbiesArray =
    selectedRoommateFilterQueries?.filter?.amenity ?? ""
      ? selectedRoommateFilterQueries.filter.amenity.split(",").map(Number)
      : [];
  const [selectedHobbies, setSelectedHobbies] = useState(hobbiesArray ?? []);
  const [furnished, setFurnished] = useState("");
  const [furnishedCheckbox, setFurnishedCheckbox] = useState(
    selectedRoommateFilterQueries?.filter?.furnished === "1" ? true : false
  );
  const [shortTerm, setShortTerm] = useState(
    selectedRoommateFilterQueries?.filter?.short_term
      ? JSON.parse(selectedRoommateFilterQueries?.filter?.short_term)
      : false
  );
  const [pet, setPet] = useState("");
  const [petCheckbox, setPetCheckbox] = useState(
    selectedRoommateFilterQueries?.filter?.pets === "2" ? true : false
  );
  const [selectedDate, setSelectedDate] = useState(
    selectedRoommateFilterQueries?.filter?.available_from ??
      new Date().toISOString().substring(0, 10)
  );
  const [search, setSearch] = useState(
    selectedRoommateFilterQueries?.search ?? ""
  );
  const [smoker, setSmoker] = useState("");
  const [smokerCheckbox, setSmokerCheckbox] = useState(
    selectedRoommateFilterQueries?.filter?.smoker === "2" ? true : false
  );
  const [minAge, setMinAge] = useState(
    selectedRoommateFilterQueries?.filter?.min_age?.toString() ?? ""
  );
  const [maxAge, setMaxAge] = useState(
    selectedRoommateFilterQueries?.filter?.max_age?.toString() ?? ""
  );
  const [gender, setGender] = useState(
    selectedRoommateFilterQueries?.filter?.gender ?? ""
  );
  const [occupation, setOccupation] = useState(
    selectedRoommateFilterQueries?.filter?.occupation ?? ""
  );

  const onClearAll = () => {
    setOpenCard(0);
    setSize("");
    setMinBudget(MIN_DEFAULT);
    setMaxBudget(MAX_DEFAULT);
    setSelectedHobbies([]);
    setFurnished("");
    setFurnishedCheckbox(false);
    setShortTerm(false);
    setPet("");
    setPetCheckbox(false);
    setSmoker("");
    setSmokerCheckbox(false);
    setSelectedDate(new Date().toISOString().substring(0, 10));
    setSearch("");
    setMinAge("");
    setMaxAge("");
  };

  const toggleHobby = (hobby) => {
    if (selectedHobbies.includes(hobby)) {
      setSelectedHobbies(selectedHobbies.filter((item) => item !== hobby));
    } else {
      setSelectedHobbies([...selectedHobbies, hobby]);
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

  const handleSmokerCheckbox = (value) => {
    setSmokerCheckbox(value);
    if (!value) {
      setSmoker(1);
    } else {
      setSmoker(2);
    }
  };

  const handleSearch = () => {
    let href = "/roommate-search?";

    if (search !== "") {
      href += "search=" + search + "&";
    }
    if (size !== "") {
      href += "filter[size]=" + size + "&";
    }
    if (minBudget !== 10 && minBudget !== "") {
      href += "filter[min_budget]=" + minBudget + "&";
    }
    if (maxBudget !== 5000 && maxBudget !== "") {
      href += "filter[max_budget]=" + maxBudget + "&";
    }
    if (selectedHobbies.length) {
      href += "filter[hobbies]=" + selectedHobbies + "&";
    }
    if (furnished) {
      href += "filter[furnished]=" + furnished + "&";
    }
    if (minAge !== "") {
      href += "filter[min_age]=" + minAge + "&";
    }
    if (maxAge !== "") {
      href += "filter[max_age]=" + maxAge + "&";
    }
    if (size !== "") {
      href += "filter[room_size]=" + size + "&";
    }
    if (pet !== "") {
      href += "filter[pets]=" + pet + "&";
    }
    if (gender !== "") {
      href += "filter[gender]=" + gender + "&";
    }
    if (occupation !== "") {
      href += "filter[occupation]=" + occupation + "&";
    }
    if (smoker !== "") {
      href += "filter[smoker]=" + smoker + "&";
    }
    if (shortTerm) {
      href += "filter[short_term]=" + shortTerm + "&";
    }
    href += "filter[available_from]=" + selectedDate;

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
                  value={search}
                  className="flex-1 p-2 bg-white"
                  placeholder="Search City or Area"
                  placeholderTextColor="#5E5D5E"
                  onChangeText={(value) => setSearch(value)}
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
              <Text className="p-5 text-2xl font-bold">Room size?</Text>
            </>
          )}
          {openCard === 2 && (
            <Animated.View
              entering={FadeIn}
              exiting={FadeOut}
              className="px-5 pb-5"
            >
              <View className="flex flex-row justify-around">
                {roomSize.map((room, index) => (
                  <TouchableOpacity
                    onPress={() => setSize(room.id)}
                    key={index}
                    className={`${
                      size == room.id ? "bg-black " : "bg-white"
                    } relative p-1 py-2 px-6 border border-[#d2d1d1] rounded-lg mr-5`}
                  >
                    <Text
                      className={`${
                        size == room.id ? " text-white" : " text-black"
                      } text-base font-semibold`}
                    >
                      {room.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          )}
        </View>
        {/* Property Budget */}
        <View style={styles.card}>
          {openCard != 3 && (
            <AnimatedTouchableOpacity
              onPress={() => setOpenCard(3)}
              className="flex-row justify-between p-5"
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
            >
              <Text className="font-medium text-gray-500">Property Budget</Text>
              <Text className="font-medium text-gray-800">Any Budget</Text>
            </AnimatedTouchableOpacity>
          )}
          {openCard === 3 && (
            <>
              <Text className="p-5 text-2xl font-bold">Budget?</Text>
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
                  setMinBudget(range.min);
                  setMaxBudget(range.max);
                }}
              />
              <View className="flex-row items-center justify-between px-6 mt-9">
                <View className="border-gray-300 border-[1px] p-2 rounded-lg">
                  <Text className="font-extralight">Minimum Budget</Text>
                  <Text className="text-lg font-semibold">£{minBudget}</Text>
                </View>
                <Text className="text-5xl font-extralight">-</Text>
                <View className="border-gray-300 border-[1px] p-2 rounded-lg">
                  <Text className="font-extralight">Maximum Budget</Text>
                  <Text className="text-lg font-semibold">£{maxBudget}</Text>
                </View>
              </View>
            </Animated.View>
          )}
        </View>
        {/* Hobbies */}
        <View style={styles.card}>
          {openCard != 4 && (
            <AnimatedTouchableOpacity
              onPress={() => setOpenCard(4)}
              className="flex-row justify-between p-5"
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
            >
              <Text className="font-medium text-gray-500">Hobbies</Text>
              <Text className="font-medium text-gray-800">Any Hobbies</Text>
            </AnimatedTouchableOpacity>
          )}
          {openCard === 4 && (
            <>
              <Text className="p-5 text-2xl font-bold">Hobbies?</Text>
            </>
          )}
          {openCard === 4 && (
            <Animated.View
              entering={FadeIn}
              exiting={FadeOut}
              className="px-5 pb-10"
            >
              {hobbies.map((hobby) => (
                <View
                  key={hobby.key}
                  className="flex flex-row justify-between pb-2 space-y-2"
                >
                  <Text className="text-lg">{hobby.value}</Text>
                  <Checkbox
                    value={selectedHobbies?.includes(hobby.key)}
                    onValueChange={() => toggleHobby(hobby.key)}
                    style={styles.checkbox}
                    color={
                      selectedHobbies?.includes(hobby.key)
                        ? "#04030c"
                        : undefined
                    }
                  />
                </View>
              ))}
            </Animated.View>
          )}
        </View>
        {/* Property Details */}
        <View style={styles.card}>
          {openCard != 5 && (
            <AnimatedTouchableOpacity
              onPress={() => setOpenCard(5)}
              className="flex-row justify-between p-5"
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
            >
              <Text className="font-medium text-gray-500">
                Property Details
              </Text>
              <Text className="font-medium text-gray-800">Any</Text>
            </AnimatedTouchableOpacity>
          )}
          {openCard === 5 && (
            <>
              <Text className="p-5 text-2xl font-bold">
                Check property details?
              </Text>
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
              <View className="flex flex-row justify-between pb-2 space-y-2">
                <Text className="text-lg">Smoker</Text>
                <Checkbox
                  value={smokerCheckbox}
                  onValueChange={(value) => handleSmokerCheckbox(value)}
                  style={styles.checkbox}
                  color={smokerCheckbox ? "#04030c" : undefined}
                />
              </View>
            </Animated.View>
          )}
        </View>
        {/* Roommate Details */}
        <View style={styles.card}>
          {openCard != 6 && (
            <AnimatedTouchableOpacity
              onPress={() => setOpenCard(6)}
              className="flex-row justify-between p-5"
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
            >
              <Text className="font-medium text-gray-500">
                Roommate Details
              </Text>
              <Text className="font-medium text-gray-800">Any</Text>
            </AnimatedTouchableOpacity>
          )}
          {openCard === 6 && (
            <>
              <Text className="p-5 text-2xl font-bold">
                Check roommate details?
              </Text>
            </>
          )}
          {openCard === 6 && (
            <Animated.View
              entering={FadeIn}
              exiting={FadeOut}
              className="px-5 pb-10"
            >
              <View className="flex-row items-center justify-between px-6">
                <View className="border-gray-300 border-[1px] p-2 rounded-lg">
                  <Text className="font-extralight">Minimum Age</Text>
                  <TextInput
                    value={minAge}
                    className="flex-1 p-2 bg-white"
                    placeholder=""
                    placeholderTextColor="#5E5D5E"
                    onChangeText={(value) => setMinAge(value)}
                  />
                </View>
                <Text className="text-5xl font-extralight">-</Text>
                <View className="border-gray-300 border-[1px] p-2 rounded-lg">
                  <Text className="font-extralight">Maximum Age</Text>
                  <TextInput
                    value={maxAge}
                    className="flex-1 p-2 bg-white"
                    placeholder=""
                    placeholderTextColor="#5E5D5E"
                    onChangeText={(value) => setMaxAge(value)}
                  />
                </View>
              </View>
              <View className="flex flex-row justify-around mt-4 ml-5">
                {Occupations.map((item, index) => (
                  <TouchableOpacity
                    onPress={() => setOccupation(item.id)}
                    key={index}
                    className={`${
                      occupation == item.id ? "bg-black " : "bg-white"
                    } ${
                      item.id === 2 ? "" : "mr-14"
                    }    relative p-1 py-2 px-6 border border-[#d2d1d1] rounded-lg`}
                  >
                    <Text
                      className={`${
                        occupation == item.id ? " text-white" : " text-black"
                      } text-base font-semibold`}
                    >
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View className="flex flex-row justify-around mt-4">
                {Genders.map((item, index) => (
                  <TouchableOpacity
                    onPress={() => setGender(item.id)}
                    key={index}
                    className={`${
                      gender == item.id ? "bg-black " : "bg-white"
                    } relative p-1 py-2 px-6 border border-[#d2d1d1] rounded-lg mr-5`}
                  >
                    <Text
                      className={`${
                        gender == item.id ? " text-white" : " text-black"
                      } text-base font-semibold`}
                    >
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                ))}
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

export default ModalFilterRoommate;

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
