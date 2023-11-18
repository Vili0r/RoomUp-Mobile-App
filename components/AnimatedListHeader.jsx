import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  TextInput,
  Animated,
  StyleSheet,
  LayoutChangeEvent,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { HEADERHEIGHT } from "../helpers/constants";

const AnimatedListHeader = ({
  scrollAnimation,
  search,
  setSearch,
  mapShow,
  setMapShow,
  handleSearch,
  handleRefresh,
  selectedFilters,
  getFilteredProperties,
  availableProperties,
}) => {
  const navigation = useNavigation();
  const [offsetAnimation] = useState(new Animated.Value(0));
  const [clampedScroll, setClampedScroll] = useState(
    Animated.diffClamp(
      Animated.add(
        scrollAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
          extrapolateLeft: "clamp",
        }),
        offsetAnimation
      ),
      0,
      1
    )
  );

  const navbarTranslate = clampedScroll.interpolate({
    inputRange: [0, HEADERHEIGHT],
    outputRange: [0, -HEADERHEIGHT],
    extrapolate: "clamp",
  });

  const onLayout = (event) => {
    let { height } = event.nativeEvent.layout;
    setClampedScroll(
      Animated.diffClamp(
        Animated.add(
          scrollAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolateLeft: "clamp",
          }),
          offsetAnimation
        ),
        0,
        height
      )
    );
  };

  const filterButtons = [
    {
      iconName: "sliders",
      onPress: () =>
        navigation.navigate("Advanced Filter Screen", {
          selectedFilters,
        }),
    },
    {
      filterId: "shareds",
      label: "room",
    },
    {
      filterId: "1",
      label: "apartment",
    },
    {
      filterId: "2",
      label: "full house",
    },
    {
      filterId: "3",
      label: "property",
    },
    {
      filterId: "roommate",
      label: "flatmate",
    },
    { lasticon: "menu" },
  ];
  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: navbarTranslate }],
        },
      ]}
      onLayout={onLayout}
    >
      <View className="flex-row items-center p-3 mx-3 border border-gray-300 rounded-full">
        <Feather name="search" size={24} stroke="gray" />
        <TextInput
          value={search}
          onChangeText={(value) => {
            setSearch(value);
            handleSearch(value);
          }}
          placeholder="Search your property..."
          className="flex-1 ml-2"
          placeholderTextColor="black"
        />
      </View>

      <FlatList
        data={filterButtons}
        horizontal
        style={{ marginTop: 10 }}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => {
          if (item.iconName) {
            return (
              <Pressable
                className="items-center py-2 w-[50px] h-[40px] mx-3 border-2 border-yellow-400 rounded-full"
                onPress={item.onPress}
              >
                <Feather name={item.iconName} size={20} color="black" />
              </Pressable>
            );
          }

          if (item.label) {
            return (
              <Pressable
                className={`${
                  selectedFilters?.filter?.type === item.filterId ||
                  selectedFilters?.search_type === item.filterId
                    ? "bg-black w-[95px]"
                    : "border-2 border-yellow-400 w-[85px]"
                } items-center py-2 h-[40px] mx-3 rounded-full`}
                onPress={() => getFilteredProperties(item.filterId)}
              >
                <Text
                  className={`${
                    selectedFilters?.filter?.type === item.filterId ||
                    selectedFilters?.search_type === item.filterId
                      ? "text-white text-base font-semibold"
                      : "text-sm font-normal"
                  }  capitalize`}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          }
          return (
            mapShow && (
              <Pressable
                className="items-center py-2 w-[50px] h-[40px] mx-3 border-2 border-yellow-400 rounded-full"
                onPress={() => {
                  setMapShow(!mapShow);
                  // handleRefresh();
                }}
              >
                <Feather
                  name={item.lasticon}
                  size={20}
                  stroke="gray"
                  color="black"
                />
              </Pressable>
            )
          );
        }}
        keyExtractor={(_, index) => index.toString()}
      />
    </Animated.View>
  );
};

export default AnimatedListHeader;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    zIndex: 1000,
    height: 170,
    backgroundColor: "#fff",
    paddingTop: 60,
  },
});
