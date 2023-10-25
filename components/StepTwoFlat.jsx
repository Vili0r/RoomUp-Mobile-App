import { View, Text } from "react-native";
import React from "react";
import { Controller } from "react-hook-form";
import CustomInput from "./CustomInput";
import CustomDropdown from "./CustomDropdown";
import { Furnishings, WhatIAmFlat, Bedrooms, Types } from "../helpers/arrays";

const StepTwoFlat = ({ control, setValue }) => {
  return (
    <View className="p-2 mt-5">
      <View className="flex flex-row justify-between">
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
          name="what_i_am"
          render={({ field: { value, onChange, onBlur }, fieldState }) => (
            <>
              <CustomDropdown
                label="What I am"
                value={value}
                data={WhatIAmFlat}
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
      <View className="flex flex-row justify-between mt-8">
        <View className="relative w-[47%]">
          <CustomInput name="cost" control={control} placeholder="" />
          <Text
            htmlFor="cost"
            className="absolute left-0 px-1 ml-3 text-sm text-gray-500 transition-all duration-100 ease-in-out origin-left transform -translate-y-1/2 bg-white pointer-events-none -top-3 font-popp peer-placeholder-shown:top-1/2 peer-placeholder-shown:ml-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-0 peer-focus:ml-3 peer-focus:text-sm peer-focus:text-gray-800"
          >
            Cost per month
          </Text>
        </View>
        <View className="relative w-[47%]">
          <CustomInput name="deposit" control={control} placeholder="" />
          <Text
            htmlFor="deposit"
            className="absolute left-0 px-1 ml-3 text-sm text-gray-500 transition-all duration-100 ease-in-out origin-left transform -translate-y-1/2 bg-white pointer-events-none -top-3 font-popp peer-placeholder-shown:top-1/2 peer-placeholder-shown:ml-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-0 peer-focus:ml-3 peer-focus:text-sm peer-focus:text-gray-800"
          >
            Deposit
          </Text>
        </View>
      </View>
      <View className="mt-6">
        <Controller
          control={control}
          name="furnished"
          render={({ field: { value, onChange, onBlur }, fieldState }) => (
            <>
              <CustomDropdown
                label="Furnishing"
                value={value}
                data={Furnishings}
                onItemChange={(item) => setValue("furnished", item.value)}
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

export default StepTwoFlat;
