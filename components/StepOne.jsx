import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useState, useContext } from "react";
import { Controller } from "react-hook-form";
import CustomInput from "./CustomInput";
import CustomDropdown from "./CustomDropdown";
import axiosConfig from "../helpers/axiosConfig";
import Feather from "@expo/vector-icons/Feather";
import { Minutes, Modes, Stations } from "../helpers/arrays";
import { AuthContext } from "../context/AuthProvider";

const StepOneFlat = ({
  control,
  setValue,
  handleSelectedAddress,
  search,
  setSearch,
}) => {
  const { user } = useContext(AuthContext);
  const [selectedAddress, setSelectedAddress] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const getAddresses = (search) => {
    if (search) {
      axiosConfig
        .get(`/autocomplete?query=${encodeURIComponent(search)}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then(function (response) {
          setSearchResults(response.data);
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  };
  return (
    <View className="p-2 mt-5">
      <View className="flex-row items-center p-3 mx-3 border border-gray-300 rounded-full">
        <Feather name="search" size={24} stroke="gray" />
        <TextInput
          value={search}
          onChangeText={(value) => {
            setSearch(value);
            getAddresses(value);
          }}
          placeholder="Search your address..."
          className="flex-1 ml-2"
          placeholderTextColor="black"
        />
      </View>

      {search.length >= 2 &&
        (searchResults?.length > 0 ? (
          <Text className="w-full mt-4 overflow-y-auto text-sm rounded max-h-80">
            {searchResults.map((address, index) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedAddress(address);
                  handleSelectedAddress(address);
                }}
                key={index}
                className="flex items-center w-full px-3 py-3 transition border-b border-gray-200 tansition-all"
              >
                <Text className="ml-4">{address.display_name}</Text>
              </TouchableOpacity>
            ))}
          </Text>
        ) : (
          <Text className="px-3 py-3">No results for "{search}"</Text>
        ))}
      <View className="relative mt-8">
        <CustomInput
          name="address_1"
          control={control}
          placeholder=""
          editable={false}
        />
        <Text
          htmlFor="address_1"
          className="absolute left-0 px-1 ml-3 text-sm text-gray-500 transition-all duration-100 ease-in-out origin-left transform -translate-y-1/2 bg-white pointer-events-none -top-3 font-popp peer-placeholder-shown:top-1/2 peer-placeholder-shown:ml-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-0 peer-focus:ml-3 peer-focus:text-sm peer-focus:text-gray-800"
        >
          Address Line 1
        </Text>
      </View>
      <View className="flex flex-row justify-between mt-5">
        <View className="relative w-[47%]">
          <CustomInput
            name="address_2"
            control={control}
            placeholder=""
            editable={false}
          />
          <Text
            htmlFor="address_2"
            className="absolute left-0 px-1 ml-3 text-sm text-gray-500 transition-all duration-100 ease-in-out origin-left transform -translate-y-1/2 bg-white pointer-events-none -top-3 font-popp peer-placeholder-shown:top-1/2 peer-placeholder-shown:ml-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-0 peer-focus:ml-3 peer-focus:text-sm peer-focus:text-gray-800"
          >
            Address Line 2
          </Text>
        </View>
        <View className="relative w-[47%]">
          <CustomInput
            name="post_code"
            control={control}
            placeholder=""
            editable={false}
          />
          <Text
            htmlFor="post_code"
            className="absolute left-0 px-1 ml-3 text-sm text-gray-500 transition-all duration-100 ease-in-out origin-left transform -translate-y-1/2 bg-white pointer-events-none -top-3 font-popp peer-placeholder-shown:top-1/2 peer-placeholder-shown:ml-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-0 peer-focus:ml-3 peer-focus:text-sm peer-focus:text-gray-800"
          >
            Post Code
          </Text>
        </View>
      </View>
      <View className="flex flex-row justify-between mt-5">
        <View className="relative w-[47%]">
          <CustomInput
            name="city"
            control={control}
            placeholder=""
            editable={false}
          />
          <Text
            htmlFor="city"
            className="absolute left-0 px-1 ml-3 text-sm text-gray-500 transition-all duration-100 ease-in-out origin-left transform -translate-y-1/2 bg-white pointer-events-none -top-3 font-popp peer-placeholder-shown:top-1/2 peer-placeholder-shown:ml-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-0 peer-focus:ml-3 peer-focus:text-sm peer-focus:text-gray-800"
          >
            City
          </Text>
        </View>
        <View className="relative w-[47%]">
          <CustomInput
            name="area"
            control={control}
            placeholder=""
            editable={false}
          />
          <Text
            htmlFor="area"
            className="absolute left-0 px-1 ml-3 text-sm text-gray-500 transition-all duration-100 ease-in-out origin-left transform -translate-y-1/2 bg-white pointer-events-none -top-3 font-popp peer-placeholder-shown:top-1/2 peer-placeholder-shown:ml-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-0 peer-focus:ml-3 peer-focus:text-sm peer-focus:text-gray-800"
          >
            Area
          </Text>
        </View>
      </View>
      <View className="mt-6">
        <Controller
          control={control}
          name="minutes"
          render={({ field: { value, onChange, onBlur }, fieldState }) => (
            <>
              <CustomDropdown
                label="Minutes"
                value={value}
                data={Minutes}
                onItemChange={(item) => setValue("minutes", item.value)}
              />
              <View className="flex flex-row">
                {fieldState.error && (
                  <Text className="mt-2 ml-4 text-sm text-red-500">
                    {fieldState.error.message}
                  </Text>
                )}
              </View>
            </>
          )}
        />
      </View>
      <View className="mt-6">
        <Controller
          control={control}
          name="mode"
          render={({ field: { value, onChange, onBlur }, fieldState }) => (
            <>
              <CustomDropdown
                label="Mode"
                value={value}
                data={Modes}
                onItemChange={(item) => setValue("mode", item.value)}
              />
              <View className="flex flex-row">
                {fieldState.error && (
                  <Text className="mt-2 ml-4 text-sm text-red-500">
                    {fieldState.error.message}
                  </Text>
                )}
              </View>
            </>
          )}
        />
      </View>
      <View className="mt-6">
        <Controller
          control={control}
          name="station"
          render={({ field: { value, onChange, onBlur }, fieldState }) => (
            <>
              <CustomDropdown
                label="Stations"
                value={value}
                data={Stations}
                onItemChange={(item) => setValue("station", item.value)}
              />
              <View className="flex flex-row">
                {fieldState.error && (
                  <Text className="mt-2 ml-4 text-sm text-red-500">
                    {fieldState.error.message}
                  </Text>
                )}
              </View>
            </>
          )}
        />
      </View>
    </View>
  );
};

export default StepOneFlat;
