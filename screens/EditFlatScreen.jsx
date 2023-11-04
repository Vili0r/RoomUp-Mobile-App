import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Switch,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import axiosConfig from "../helpers/axiosConfig";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialIcons } from "@expo/vector-icons";
import BottomSheet from "../components/BottomSheet";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useQuery } from "@tanstack/react-query";
import { EditFlatForm } from "../components";

const EditFlatScreen = ({ route, navigation }) => {
  const { id, token } = route.params;
  const fetchEditFlat = async (id) => {
    const response = await axiosConfig.get(`/flats/${id}/edit`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.flat;
  };

  const singleFlatEditQuery = useQuery({
    queryKey: ["singleFlatEditQuery", id, "edit"],
    queryFn: () => fetchEditFlat(id),
    refetchOnMount: true,
  });

  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [isEnabled, setIsEnabled] = useState(
    singleFlatEditQuery.data?.available == 1 ? true : false
  );
  const [pickedDate, setPickedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [serverErrors, setServerErrors] = useState(null);

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: false,
      headerTitle: singleFlatEditQuery.data?.title,
      headerTintColor: "black",
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-[40px] h-[40px] rounded-[20px] bg-white justify-center items-center"
        >
          <Ionicons name="arrow-back" size={24} color="#F1C40F" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => setShowBottomSheet(true)}
          className="w-[40px] h-[40px] rounded-[20px] bg-white justify-center items-center"
        >
          <MaterialIcons name="live-tv" size={24} color="#F1C40F" />
        </TouchableOpacity>
      ),
    });
  }, [singleFlatEditQuery.data]);

  const handleUpdate = () => {
    setIsUpdating(true);
    axiosConfig
      .put(
        `/availability/flat/${id}`,
        {
          live_at: pickedDate,
          available: isEnabled,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setIsUpdating(false);
        setShowBottomSheet(false);
        Alert.alert("Availability updated successfully");
      })
      .catch((error) => {
        setServerErrors(error.response.data.message);
        setIsUpdating(false);
        const key = Object.keys(error.response.data.errors)[0];
        setServerErrors(error.response.data.errors[key][0]);
      });
  };

  return (
    <View className="items-center justify-center flex-1 bg-white">
      <StatusBar />
      <View className="flex-1 w-full px-3">
        {singleFlatEditQuery.isLoading ? (
          <ActivityIndicator className="mt-2" size="large" color="gray" />
        ) : (
          <EditFlatForm property={singleFlatEditQuery.data} />
        )}
      </View>
      <BottomSheet
        show={showBottomSheet}
        onDismiss={() => setShowBottomSheet(false)}
        text="Change Availability"
        modalHeight="0.325"
      >
        {serverErrors && (
          <Text className="text-sm text-red-500">{serverErrors}</Text>
        )}
        <View className="p-1 mt-5">
          <Pressable
            onPress={() => setShowCalendar(true)}
            className="w-full px-3 py-3 border border-gray-300 rounded-md peer"
          >
            <Text className="mt-3">
              {singleFlatEditQuery.data?.live_at
                ? singleFlatEditQuery.data?.live_at
                : pickedDate?.toDateString()}
            </Text>
          </Pressable>

          <Text
            htmlFor="live_at"
            className="absolute left-0 px-1 ml-3 text-base text-gray-500 transition-all duration-100 ease-in-out origin-left transform -translate-y-1/2 bg-white pointer-events-none -top-2 font-popp peer-placeholder-shown:top-1/2 peer-placeholder-shown:ml-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-0 peer-focus:ml-3 peer-focus:text-sm peer-focus:text-gray-800"
          >
            Live at
          </Text>
          {showCalendar && (
            <DateTimePicker
              value={pickedDate}
              mode="date"
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  setShowCalendar(false);
                  setPickedDate(selectedDate);
                }
              }}
            />
          )}
        </View>
        <View className="p-1 mt-5">
          <Text
            htmlFor="live_at"
            className="px-1 text-base text-gray-500 bg-white"
          >
            Available
          </Text>
          <Switch
            trackColor={{ false: "#767577", true: "#F1C40F" }}
            thumbColor={isEnabled ? "#585857" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
        <TouchableOpacity
          onPress={handleUpdate}
          className="flex flex-row self-center justify-center w-2/5 py-2 text-center border-2 rounded-full select-none px-7 border-balck"
        >
          {isUpdating && (
            <ActivityIndicator className="mr-2" size="small" color="black" />
          )}
          <Text className="text-sm font-semibold text-center text-black font-base">
            Update
          </Text>
        </TouchableOpacity>
      </BottomSheet>
    </View>
  );
};

export default EditFlatScreen;
