import { View, Text, Pressable, StyleSheet } from "react-native";
import React, { useState } from "react";
import { Controller } from "react-hook-form";
import CustomDropdown from "./CustomDropdown";
import { DaysAvailable, MinStay, MaxStay, Amenities } from "../helpers/arrays";
import DateTimePicker from "@react-native-community/datetimepicker";
import Checkbox from "expo-checkbox";

const StepThreeFlat = ({
  control,
  setValue,
  selectedAmenities,
  data,
  toggleAmenity,
}) => {
  const [pickedDate, setPickedDate] = useState(
    new Date(data?.available_from ?? "")
  );
  const [showCalendar, setShowCalendar] = useState(false);

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

      <View className="flex flex-row justify-between mt-5">
        <View className="w-[47%]">
          <Controller
            control={control}
            name="minimum_stay"
            render={({ field: { value, onChange, onBlur }, fieldState }) => (
              <>
                <CustomDropdown
                  label="Minimum Stay"
                  value={value}
                  data={MinStay}
                  onItemChange={(item) => setValue("minimum_stay", item.value)}
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
        <View className="w-[47%]">
          <Controller
            control={control}
            name="maximum_stay"
            render={({ field: { value, onChange, onBlur }, fieldState }) => (
              <>
                <CustomDropdown
                  label="Maximum Stay"
                  value={value}
                  data={MaxStay}
                  onItemChange={(item) => setValue("maximum_stay", item.value)}
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

      <View className="mt-8">
        <Controller
          name="available_from"
          control={control}
          render={({ field: { value, onChange, onBlur }, fieldState }) => (
            <>
              <Pressable
                onPress={() => setShowCalendar(true)}
                className="w-full px-3 py-3 border border-gray-300 rounded-md peer"
              >
                <Text className="mt-3">{pickedDate?.toDateString()}</Text>
              </Pressable>
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
          htmlFor="available_from"
          className="absolute left-0 px-1 ml-3 text-sm text-gray-500 transition-all duration-100 ease-in-out origin-left transform -translate-y-1/2 bg-white pointer-events-none -top-2 font-popp peer-placeholder-shown:top-1/2 peer-placeholder-shown:ml-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-0 peer-focus:ml-3 peer-focus:text-sm peer-focus:text-gray-800"
        >
          Available from
        </Text>
        {showCalendar && (
          <DateTimePicker
            value={pickedDate}
            mode="date"
            onChange={(event, selectedDate) => {
              if (selectedDate) {
                setShowCalendar(false);
                setValue("available_from", selectedDate);
                setPickedDate(selectedDate);
              }
            }}
          />
        )}
      </View>

      <View className="flex flex-row justify-between mt-7">
        <View className="w-[47%]">
          <Controller
            control={control}
            name="days_available"
            render={({ field: { value, onChange, onBlur }, fieldState }) => (
              <>
                <CustomDropdown
                  label="Days Available"
                  value={value}
                  data={DaysAvailable}
                  onItemChange={(item) =>
                    setValue("days_available", item.value)
                  }
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
        <View className="flex flex-row items-center justify-center flex-1 gap-3">
          <Text htmlFor="city" className="items-center">
            Short Term
          </Text>
          <Controller
            name="short_term"
            control={control}
            render={({ field: { value, onChange, onBlur }, fieldState }) => (
              <Checkbox
                style={styles.checkbox}
                value={value}
                onValueChange={onChange}
                color={value ? "#4630EB" : undefined}
              />
            )}
          />
        </View>
      </View>
    </View>
  );
};

export default StepThreeFlat;

const styles = StyleSheet.create({
  checkbox: {
    marginTop: 12,
    marginLeft: 6,
  },
});
