import { View, Text } from "react-native";
import React from "react";
import { Controller } from "react-hook-form";
import CustomInput from "./CustomInput";
import CustomDropdown from "./CustomDropdown";
import {
  currentFlatmateGender,
  currentFlatmateSmoker,
  currentFlatmateOccupation,
  currentFlatmatePets,
} from "../helpers/arrays";

const PersonalInformation = ({ control, setValue }) => {
  return (
    <View className="p-2">
      <View className="relative ">
        <CustomInput name="age" control={control} placeholder="" />
        <Text
          htmlFor="age"
          className="absolute left-0 px-1 ml-3 text-sm text-gray-500 transition-all duration-100 ease-in-out origin-left transform -translate-y-1/2 bg-white pointer-events-none -top-3 font-popp peer-placeholder-shown:top-1/2 peer-placeholder-shown:ml-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-0 peer-focus:ml-3 peer-focus:text-sm peer-focus:text-gray-800"
        >
          Age
        </Text>
      </View>
      <View className="mt-5">
        <Controller
          control={control}
          name="smoker"
          render={({ field: { value, onChange, onBlur }, fieldState }) => (
            <>
              <CustomDropdown
                label="Smoker"
                value={value}
                data={currentFlatmateSmoker}
                onItemChange={(item) => setValue("smoker", item.value)}
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

      <View className="flex flex-row justify-between mt-5">
        <View className="w-[47%]">
          <Controller
            control={control}
            name="occupation"
            render={({ field: { value, onChange, onBlur }, fieldState }) => (
              <>
                <CustomDropdown
                  label="Occupation"
                  value={value}
                  data={currentFlatmateOccupation}
                  onItemChange={(item) => setValue("occupation", item.value)}
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
            name="pets"
            render={({ field: { value, onChange, onBlur }, fieldState }) => (
              <>
                <CustomDropdown
                  label="Pets"
                  value={value}
                  data={currentFlatmatePets}
                  onItemChange={(item) => setValue("pets", item.value)}
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
      <View className="mt-5">
        <Controller
          control={control}
          name="gender"
          render={({ field: { value, onChange, onBlur }, fieldState }) => (
            <>
              <CustomDropdown
                label="Gender"
                value={value}
                data={currentFlatmateGender}
                onItemChange={(item) => setValue("gender", item.value)}
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

export default PersonalInformation;
