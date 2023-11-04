import { View, Text } from "react-native";
import React from "react";
import { Controller } from "react-hook-form";
import CustomDropdown from "./CustomDropdown";
import {
  availableRooms,
  WhatIAmShared,
  Bedrooms,
  Types,
  currentOccupants,
} from "../helpers/arrays";

const StepTwoSharedEdit = ({
  control,
  setValue,
  setAvailableRooms,
  setCurrentOccupants,
}) => {
  return (
    <View className="p-2 mt-5">
      <View className="">
        <Controller
          control={control}
          name="available_rooms"
          render={({ field: { value, onChange, onBlur }, fieldState }) => (
            <>
              <CustomDropdown
                label="Availble rooms"
                value={value}
                data={availableRooms}
                onItemChange={(item) => {
                  setValue("available_rooms", item.value);
                  setAvailableRooms(item.value);
                }}
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
      <View className="flex flex-row justify-between mt-6">
        <View className="w-[47%]">
          <Controller
            control={control}
            name="size"
            render={({ field: { value, onChange, onBlur }, fieldState }) => (
              <>
                <CustomDropdown
                  label="Size"
                  value={value}
                  data={Bedrooms}
                  onItemChange={(item) => setValue("size", item.value)}
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
            name="type"
            render={({ field: { value, onChange, onBlur }, fieldState }) => (
              <>
                <CustomDropdown
                  label="Type"
                  value={value}
                  data={Types}
                  onItemChange={(item) => setValue("type", item.value)}
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
      <View className="mt-6">
        <Controller
          control={control}
          name="current_occupants"
          render={({ field: { value, onChange, onBlur }, fieldState }) => (
            <>
              <CustomDropdown
                label="Current Occupants"
                value={value}
                data={currentOccupants}
                onItemChange={(item) => {
                  setValue("current_occupants", item.value);
                  setCurrentOccupants(item.value);
                }}
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
          name="what_i_am"
          render={({ field: { value, onChange, onBlur }, fieldState }) => (
            <>
              <CustomDropdown
                label="What I am"
                value={value}
                data={WhatIAmShared}
                onItemChange={(item) => setValue("what_i_am", item.value)}
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

export default StepTwoSharedEdit;
