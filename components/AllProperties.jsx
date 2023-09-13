import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Pressable,
  TextInput,
} from "react-native";
import PropertyCard from "./PropertyCard";
import Feather from "@expo/vector-icons/Feather";
import axiosConfig from "../helpers/axiosConfig";
import axios from "axios";

const AllProperties = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAtEndOfScrolling, setIsAtEndOfScrolling] = useState(false);
  const [nextPage, setNextPage] = useState("");
  const [search, setSearch] = useState("");

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

  return (
    <>
      <View className="flex-row items-center px-6 pb-2 space-x-2">
        <View className="flex-row items-center flex-1 p-3 border border-gray-300 rounded-full">
          <Feather name="search" size={18} stroke="gray" />
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
          <View className="flex-row items-center pl-2 space-x-1 border-0 border-l-2 border-l-gray-300">
            <Pressable>
              {({ pressed }) => (
                <Feather
                  name="sliders"
                  size={18}
                  stroke="gray"
                  style={{ opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          </View>
        </View>
      </View>
      <View className="p-4">
        <View className="bg-white">
          {isLoading ? (
            <ActivityIndicator className="mt-2" size="large" color="gray" />
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
            <TouchableOpacity className="absolute bottom-[45px] right-[150px] items-center justify-center px-3 py-3 bg-gray-800 rounded-full">
              <View className="flex flex-row space-x-2">
                <Feather name="map" size={26} stroke="gray" color="white" />
                <Text className="text-base font-semibold text-white">Map</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
};

export default AllProperties;
