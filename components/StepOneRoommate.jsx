import { View, Text, Pressable, StyleSheet } from "react-native";
import React, { useState } from "react";
import { Controller } from "react-hook-form";
import CustomDropdown from "./CustomDropdown";
import CustomInput from "./CustomInput";
import {
  DaysAvailable,
  MinStay,
  MaxStay,
  roomSize,
  searchingFor,
} from "../helpers/arrays";
import DateTimePicker from "@react-native-community/datetimepicker";
import Checkbox from "expo-checkbox";

const StepOneRoommate = ({ control, setValue, availableFrom }) => {
  const [pickedDate, setPickedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  return (
    <View className="p-2">
      <View className="relative mt-5">
        <CustomInput name="budget" control={control} placeholder="" />
        <Text
          htmlFor="budget"
          className="absolute left-0 px-1 ml-3 text-sm text-gray-500 transition-all duration-100 ease-in-out origin-left transform -translate-y-1/2 bg-white pointer-events-none -top-3 font-popp peer-placeholder-shown:top-1/2 peer-placeholder-shown:ml-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-0 peer-focus:ml-3 peer-focus:text-sm peer-focus:text-gray-800"
        >
          Budget
        </Text>
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
                <Text className="mt-3">
                  {availableFrom
                    ? availableFrom.toDateString()
                    : pickedDate.toDateString()}
                </Text>
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
            name="room_size"
            render={({ field: { value, onChange, onBlur }, fieldState }) => (
              <>
                <CustomDropdown
                  label="Room Size"
                  value={value}
                  data={roomSize}
                  onItemChange={(item) => setValue("room_size", item.value)}
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
            name="searching_for"
            render={({ field: { value, onChange, onBlur }, fieldState }) => (
              <>
                <CustomDropdown
                  label="Searching For"
                  value={value}
                  data={searchingFor}
                  onItemChange={(item) => setValue("searching_for", item.value)}
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

      <View className="flex flex-row justify-between mt-8">
        <View className="relative w-[47%]">
          <CustomInput name="city" control={control} placeholder="" />
          <Text
            htmlFor="city"
            className="absolute left-0 px-1 ml-3 text-sm text-gray-500 transition-all duration-100 ease-in-out origin-left transform -translate-y-1/2 bg-white pointer-events-none -top-3 font-popp peer-placeholder-shown:top-1/2 peer-placeholder-shown:ml-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-0 peer-focus:ml-3 peer-focus:text-sm peer-focus:text-gray-800"
          >
            City
          </Text>
        </View>
        <View className="relative w-[47%]">
          <CustomInput name="area" control={control} placeholder="" />
          <Text
            htmlFor="area"
            className="absolute left-0 px-1 ml-3 text-sm text-gray-500 transition-all duration-100 ease-in-out origin-left transform -translate-y-1/2 bg-white pointer-events-none -top-3 font-popp peer-placeholder-shown:top-1/2 peer-placeholder-shown:ml-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-0 peer-focus:ml-3 peer-focus:text-sm peer-focus:text-gray-800"
          >
            Area
          </Text>
        </View>
      </View>
    </View>
  );
};

export default StepOneRoommate;

const styles = StyleSheet.create({
  checkbox: {
    marginTop: 12,
    marginLeft: 6,
  },
});
