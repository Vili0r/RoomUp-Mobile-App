import React, { useState, useEffect, useContext } from "react";
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
import { AuthContext } from "../context/AuthProvider";

const AllProperties = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAtEndOfScrolling, setIsAtEndOfScrolling] = useState(false);
  const [nextPage, setNextPage] = useState("");
  const [search, setSearch] = useState("");
  const [mapShow, setMapShow] = useState(false);

  const setAuthToken = () => {
    if (user && user.token) {
      axiosConfig.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${user.token}`;
    } else {
      delete axiosConfig.defaults.headers.common["Authorization"];
    }
  };

  useEffect(() => {
    getProperties();
  }, [user?.token]);

  const getProperties = () => {
    setAuthToken();

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
      const authConfig = {};

      if (user && user.token) {
        authConfig.headers = {
          Authorization: `Bearer ${user.token}`,
        };
      }

      axios
        .get(nextPage, authConfig)
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
    setAuthToken();

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
    { lasticon: "menu", onPress: () => setMapShow(!mapShow) },
  ];

  const toggleFavourite = (propertyId) => {
    // Update the favorite status in the main component's state
    setData((prevData) =>
      prevData.map((property) =>
        property.id === propertyId
          ? { ...property, favouritedBy: !property.favouritedBy }
          : property
      )
    );
  };

  return (
    <>
      <View className="">
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
                  className="items-center py-2 w-[80px] h-[40px] mx-3 border-2 border-yellow-400 rounded-full"
                  onPress={item.onPress}
                >
                  <Text className="text-sm font-normal capitalize">
                    {item.label}
                  </Text>
                </Pressable>
              );
            }
            return (
              mapShow && (
                <Pressable
                  className="items-center py-2 w-[50px] h-[40px] mx-3 border-2 border-yellow-400 rounded-full"
                  onPress={item.onPress}
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
      </View>

      {mapShow ? (
        <View className="flex-1 mt-4 overflow-hidden">
          <MapView style={{ height: "100%", width: "100%" }}></MapView>
        </View>
      ) : (
        <View className="p-4">
          {isLoading ? (
            <ActivityIndicator className="mt-2" size="large" color="gray" />
          ) : (
            <FlatList
              data={data}
              renderItem={(props) => (
                <PropertyCard {...props} toggleFavourite={toggleFavourite} />
              )}
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
        </View>
      )}
      {!isLoading && !mapShow && (
        <TouchableOpacity
          onPress={() => setMapShow(!mapShow)}
          className="absolute bottom-[20px] right-[150px] items-center justify-center px-3 py-3 bg-gray-800 rounded-full"
        >
          <View className="flex flex-row space-x-2">
            <Feather name="map" size={26} stroke="gray" color="white" />
            <Text className="text-base font-semibold text-white">Map</Text>
          </View>
        </TouchableOpacity>
      )}
    </>
  );
};

export default AllProperties;
