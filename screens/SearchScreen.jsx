import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Platform,
  StatusBar,
  Animated,
} from "react-native";
import { PropertyCard, Map, AnimatedListHeader } from "../components";
import Feather from "@expo/vector-icons/Feather";
import axiosConfig from "../helpers/axiosConfig";
import axios from "axios";
import { AuthContext } from "../context/AuthProvider";
import { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { HEADERHEIGHT } from "../helpers/constants";
import { useRoute } from "@react-navigation/native";

const SearchScreen = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAtEndOfScrolling, setIsAtEndOfScrolling] = useState(false);
  const [nextPage, setNextPage] = useState("");
  const [search, setSearch] = useState("");
  const [mapShow, setMapShow] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState(null);
  const [flatmate, setFlatmate] = useState("");
  const [scrollAnimation] = useState(new Animated.Value(0));
  const route = useRoute();
  const href = route.params?.href;

  const setAuthToken = () => {
    if (user && user?.token) {
      axiosConfig.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${user.token}`;
    } else {
      delete axiosConfig.defaults.headers.common["Authorization"];
    }
  };

  useEffect(() => {
    if (href) {
      getSearchedProperties();
    }
  }, [route]);

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
        setSelectedFilters(null);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        setIsRefreshing(false);
      });
  };

  const getSearchedProperties = () => {
    setAuthToken();

    axiosConfig
      .get(href)
      .then((response) => {
        setData(response.data.data);
        setIsLoading(false);
        setIsRefreshing(false);
        setNextPage(response.data.pagination.links.next);
        setSelectedFilters(response.data.selectedListingQueries);
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

          if (
            !response.data.next_page_url ||
            !response.data?.pagination?.links.next
          ) {
            setIsAtEndOfScrolling(true);
          }
          setIsLoading(false);
          setIsRefreshing(false);
          if (response.data?.pagination) {
            setNextPage(response.data?.pagination?.links.next);
          } else {
            setNextPage(response.data.next_page_url);
          }
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
    setSelectedFilters(null);
    getProperties();
  };

  const handleEnd = () => {
    getNextPageProperties();
  };

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

  const handleSearch = async (text) => {
    setAuthToken();

    await axiosConfig
      .get(`home-search/?search=${encodeURIComponent(text)}`)
      .then((response) => {
        setData(response.data.data);
        setNextPage(response.data.next_page_url);
        setIsRefreshing(false);
        setIsLoading(false);
        setSelectedFilters(null);
      });
  };

  const getFilteredProperties = (propertyType) => {
    setAuthToken();

    if (propertyType === "1" || propertyType === "2" || propertyType === "3") {
      setFlatmate("");
      axiosConfig
        .get(`/header-filter?filter[type]=${propertyType}`)
        .then((response) => {
          setData(response.data.data);
          setIsLoading(false);
          setIsRefreshing(false);
          setNextPage(response.data.pagination.links.next);
          setSelectedFilters(response.data.selectedPropertyQueries);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
          setIsRefreshing(false);
        });
    } else if (propertyType === "shareds") {
      setFlatmate("");
      axiosConfig
        .get(`/header-filter?search_type=${propertyType}`)
        .then((response) => {
          setData(response.data.data);
          setIsLoading(false);
          setIsRefreshing(false);
          setNextPage(response.data.pagination.links.next);
          setSelectedFilters(response.data.selectedPropertyQueries);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
          setIsRefreshing(false);
        });
    } else if (propertyType === "roommate") {
      setFlatmate("roommate");
      axiosConfig
        .get(`/header-filter?search_type=${propertyType}`)
        .then((response) => {
          setMapShow(false);
          setData(response.data.data);
          setIsLoading(false);
          setIsRefreshing(false);
          setNextPage(response.data.pagination.links.next);
          setSelectedFilters(response.data.selectedPropertyQueries);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
          setIsRefreshing(false);
        });
    }
  };

  return (
    <SafeAreaView style={styles.container} className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <AnimatedListHeader
        scrollAnimation={scrollAnimation}
        search={search}
        setSearch={setSearch}
        mapShow={mapShow}
        setMapShow={setMapShow}
        selectedFilters={selectedFilters}
        handleSearch={handleSearch}
        handleRefresh={handleRefresh}
        getFilteredProperties={getFilteredProperties}
        availableProperties={data ? data.length : undefined}
      />
      {mapShow ? (
        <Map properties={data} />
      ) : (
        <Animated.View
          className="pl-1 ml-[8px]"
          entering={FadeInRight}
          exiting={FadeOutLeft}
        >
          {isLoading ? (
            <ActivityIndicator className="mt-2" size="large" color="gray" />
          ) : (
            <Animated.FlatList
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        y: scrollAnimation,
                      },
                    },
                  },
                ],
                { useNativeDriver: true }
              )}
              data={data}
              renderItem={(props) => (
                <PropertyCard {...props} toggleFavourite={toggleFavourite} />
              )}
              keyExtractor={(item, index) => index.toString()}
              refreshing={isRefreshing}
              bounces={false}
              contentContainerStyle={{ paddingTop: HEADERHEIGHT - 70 }}
              scrollEventThrottle={16}
              onRefresh={handleRefresh}
              onEndReached={handleEnd}
              onEndReachedThreshold={0}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={() =>
                !isAtEndOfScrolling && (
                  <ActivityIndicator size="large" color="gray" />
                )
              }
            />
          )}
        </Animated.View>
      )}
      {!isLoading && !mapShow && flatmate === "" && (
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
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
