import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import React from "react";
import { Controller } from "react-hook-form";
import CustomInput from "./CustomInput";
import Checkbox from "expo-checkbox";
import { Amenities } from "../helpers/arrays";

const StepFourRoommate = ({
  control,
  selectImage,
  selectedAmenities,
  toggleAmenity,
}) => {
  return (
    <View className="p-2">
      <View className="">
        <Controller
          control={control}
          name="amenities"
          render={({ field: { value, onChange, onBlur }, fieldState }) => (
            <>
              <View className="">
                {Amenities.map((amenity) => (
                  <View
                    key={amenity.key}
                    className="flex flex-row items-center space-x-2"
                  >
                    <Checkbox
                      value={selectedAmenities?.includes(amenity.key)}
                      onValueChange={() => toggleAmenity(amenity.key)}
                      style={styles.checkbox}
                      color={
                        selectedAmenities?.includes(amenity.key)
                          ? "#4630EB"
                          : undefined
                      }
                    />
                    <Text className="mt-3">{amenity.value}</Text>
                  </View>
                ))}
              </View>
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
      <View className="relative mt-7">
        <CustomInput
          name="title"
          control={control}
          placeholder=""
          editable={true}
        />
        <Text
          htmlFor="title"
          className="absolute left-0 px-1 ml-3 text-sm text-gray-500 transition-all duration-100 ease-in-out origin-left transform -translate-y-1/2 bg-white pointer-events-none -top-3 font-popp peer-placeholder-shown:top-1/2 peer-placeholder-shown:ml-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-0 peer-focus:ml-3 peer-focus:text-sm peer-focus:text-gray-800"
        >
          Title
        </Text>
      </View>
      <View className="relative mt-10">
        <Controller
          control={control}
          name="description"
          render={({ field: { value, onChange, onBlur }, fieldState }) => (
            <>
              <TextInput
                className="w-full px-3 py-3 border border-gray-300 rounded-md peer"
                onChangeText={onChange}
                value={value}
                onBlur={onBlur}
                placeholder=""
                placeholderTextColor="gray"
                autoCapitalize="none"
                multiline
                numberOfLines={10}
                style={{ minHeight: 200 }}
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
        <Text
          htmlFor="short_description"
          className="absolute left-0 px-1 ml-3 text-sm text-gray-500 transition-all duration-100 ease-in-out origin-left transform -translate-y-1/2 bg-white pointer-events-none -top-3 font-popp peer-placeholder-shown:top-1/2 peer-placeholder-shown:ml-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-0 peer-focus:ml-3 peer-focus:text-sm peer-focus:text-gray-800"
        >
          Short Description
        </Text>
      </View>
      <View className="flex flex-row justify-around mt-4">
        <Pressable
          onPress={() => selectImage(true)}
          className="flex flex-row justify-center px-4 py-3 bg-yellow-400 rounded-xl"
        >
          <Text className="text-base font-semibold text-center text-gray-700">
            Upload Images
          </Text>
        </Pressable>
        <Pressable
          onPress={() => selectImage(false)}
          className="flex flex-row justify-center px-3 py-3 bg-yellow-400 rounded-xl"
        >
          <Text className="text-base font-semibold text-center text-gray-700">
            Camera
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default StepFourRoommate;

const styles = StyleSheet.create({
  checkbox: {
    marginTop: 12,
    marginLeft: 6,
  },
});
