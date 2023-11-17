import { View, TouchableOpacity, Platform } from "react-native";
import React, { useState, useContext } from "react";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import MapMarker from "./MapMarker";
import { useNavigation } from "@react-navigation/native";
import MapPropertyCard from "./MapPropertyCard";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axiosConfig from "../helpers/axiosConfig";
import { AuthContext } from "../context/AuthProvider";

const INITIAL_REGION = {
  latitude: 38.2,
  longitude: 23.2,
  latitudeDelts: 2,
  longitudeDelta: 2,
};
const Map = ({ properties }) => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = useState(-1);
  const [listings, setListings] = useState(null);
  const [serverErrors, setServerErrors] = useState(null);

  const setAuthToken = () => {
    if (user && user?.token) {
      axiosConfig.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${user.token}`;
    } else {
      delete axiosConfig.defaults.headers.common["Authorization"];
    }
  };

  const handleMarkerPress = (index) => {
    setActiveIndex(index);
    navigation.setOptions({ tabBarStyle: { display: "none" } });
  };

  const unFocusProperty = () => {
    setActiveIndex(-1);
    navigation.setOptions({ tabBarStyle: { display: "flex" } });
  };
  const handleMapPress = () => {
    if (Platform.OS === "android") unFocusProperty();
  };

  const onRegionChange = async (region) => {
    // console.log("map_lat", region.latitude);
    // console.log("map_long", region.longitude);
    setAuthToken();
    await axiosConfig
      .post(
        `/map-search`,
        {
          latitude: region.latitude,
          longitude: region.longitude,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((response) => {
        setListings(response.data);
      })
      .catch((error) => {
        setServerErrors(error.response.data.message);
        const key = Object.keys(error.response.data.errors)[0];
        setServerErrors(error.response.data.errors[key][0]);
      });
  };

  return (
    <View className="flex-1 mt-4 overflow-hidden">
      <MapView
        style={{ height: "100%", width: "100%" }}
        onPress={handleMapPress}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        showsMyLocationButton
        initialRegion={INITIAL_REGION}
        onRegionChangeComplete={onRegionChange}
      >
        {properties &&
          properties.map((item, index) => (
            <MapMarker
              key={item.id}
              lat={item.owner ? item.owner.address?.lat : item.address.lat}
              long={item.owner ? item.owner.address?.long : item.address.long}
              color={activeIndex === index ? "rgb(250 204 21)" : "black"}
              onPress={() => handleMarkerPress(index)}
            />
          ))}
        {listings?.length > 0 &&
          listings?.map((item, index) => (
            <MapMarker
              key={item.id}
              lat={item.owner ? item.owner.address?.lat : item.address.lat}
              long={item.owner ? item.owner.address?.long : item.address.long}
              color={activeIndex === index ? "rgb(200 204 21)" : "blue"}
              onPress={() => handleMarkerPress(index)}
            />
          ))}
      </MapView>
      {activeIndex > -1 && (
        <>
          {Platform.OS === "ios" && (
            <TouchableOpacity
              className="bg-gray-900/50 rounded-full top-[10px] left-[10px] absolute p-2"
              onPress={unFocusProperty}
            >
              <MaterialCommunityIcons name="close" color="white" size={24} />
            </TouchableOpacity>
          )}
          <MapPropertyCard property={properties[activeIndex]} />
        </>
      )}
    </View>
  );
};

export default Map;
