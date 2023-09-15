import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Pressable,
  TextInput,
  Button,
} from "react-native";
import PropertyCard from "./PropertyCard";
import Feather from "@expo/vector-icons/Feather";
import axiosConfig from "../helpers/axiosConfig";
import axios from "axios";
import MapView from "react-native-maps";

const AllProperties = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAtEndOfScrolling, setIsAtEndOfScrolling] = useState(false);
  const [nextPage, setNextPage] = useState("");
  const [search, setSearch] = useState("");
  const [mapShow, setMapShow] = useState(false);

  useEffect(() => {
    getProperties();
  }, []);

  const getProperties = () => {
    axiosConfig
      .get("/home-search")
      .then((response) => {
        setData(response.data.data);
        setIsLoading(false);
        setIsRefreshing(false);
        setNextPage(response.data.next_page_url);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        setIsRefreshing(false);
      });
  };

  const getNextPageProperties = () => {
    if (nextPage) {
      axios
        .get(nextPage)
        .then((response) => {
          setData((prevData) => [...prevData, ...response.data.data]);

          if (!response.data.next_page_url) {
            setIsAtEndOfScrolling(true);
          }
          setIsLoading(false);
          setIsRefreshing(false);
          setNextPage(response.data.next_page_url);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
          setIsRefreshing(false);
        });
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    getProperties();
  };

  const handleEnd = () => {
    getNextPageProperties();
  };

  const handleSearch = async (text) => {
    await axiosConfig
      .get(`home-search/?search=${encodeURIComponent(text)}`)
      .then((response) => {
        setData(response.data.data);
        setNextPage(response.data.next_page_url);
        setIsRefreshing(false);
        setIsLoading(false);
      });
  };

  const filterButtons = [
    { iconName: "sliders", onPress: () => console.log("filter") },
    { label: "room", onPress: () => console.log("room") },
    { label: "property", onPress: () => console.log("property") },
    { label: "flatmate", onPress: () => console.log("flatmate") },
  ];

  return (
    <>
      <View className="flex-row items-center px-6 pb-2 space-x-2">
        <View className="flex-row items-center flex-1 p-3 border border-gray-300 rounded-full">
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
      </View>
      <View className="flex-row">
        {filterButtons.map((button, index) => (
          <View key={index}>
            {button.iconName ? (
              <Pressable
                className="items-center py-2 w-[50px] mx-3 border-2 border-yellow-400 rounded-full"
                onPress={button.onPress}
              >
                <Feather name={button.iconName} size={20} color="black" />
              </Pressable>
            ) : (
              <Pressable
                className="items-center py-2 w-[80px] mx-3 border-2 border-yellow-400 rounded-full"
                onPress={button.onPress}
              >
                <Text className="text-sm font-normal capitalize">
                  {button.label}
                </Text>
              </Pressable>
            )}
          </View>
        ))}
      </View>

      <View className="p-4">
        <View className="bg-white">
          {isLoading ? (
            <ActivityIndicator className="mt-2" size="large" color="gray" />
          ) : mapShow ? (
            <View className="flex-1 overflow-hidden">
              <MapView style={{ height: "100%", width: "100%" }} />
            </View>
          ) : (
            <FlatList
              data={data}
              renderItem={(props) => <PropertyCard {...props} />}
              keyExtractor={(item, index) => index.toString()}
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              onEndReached={handleEnd}
              onEndReachedThreshold={0}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={() =>
                !isAtEndOfScrolling && (
                  <ActivityIndicator
                    className="mb-10"
                    size="large"
                    color="gray"
                  />
                )
              }
            />
          )}
          {!isLoading && (
            <TouchableOpacity
              onPress={() => setMapShow(!mapShow)}
              className="absolute bottom-[100px] right-[150px] items-center justify-center px-3 py-3 bg-gray-800 rounded-full"
            >
              {!mapShow ? (
                <View className="flex flex-row space-x-2">
                  <Feather name="map" size={26} stroke="gray" color="white" />
                  <Text className="text-base font-semibold text-white">
                    Map
                  </Text>
                </View>
              ) : (
                <View className="flex flex-row space-x-2">
                  <Feather name="menu" size={26} stroke="gray" color="white" />
                  <Text className="text-base font-semibold text-white">
                    List
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
};

export default AllProperties;