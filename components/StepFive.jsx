import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Controller } from "react-hook-form";
import CustomInput from "./CustomInput";
import CustomDropdown from "./CustomDropdown";
import {
  flatmateGender,
  flatmateSmoker,
  flatmateOccupation,
  flatmatePets,
} from "../helpers/arrays";
import Checkbox from "expo-checkbox";

const StepFive = ({ control, setValue }) => {
  return (
    <View className="p-2 mt-5">
      <View className="">
        <Controller
          control={control}
          name="new_flatmate_smoker"
          render={({ field: { value, onChange, onBlur }, fieldState }) => (
            <>
              <CustomDropdown
                label="Smoker"
                value={value}
                data={flatmateSmoker}
                onItemChange={(item) =>
                  setValue("new_flatmate_smoker", item.value)
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
      <View className="flex flex-row justify-between mt-9">
        <View className="relative w-[47%]">
          <CustomInput
            name="new_flatmate_min_age"
            control={control}
            placeholder=""
          />
          <Text
            htmlFor="new_flatmate_min_age"
            className="absolute left-0 px-1 ml-3 text-sm text-gray-500 transition-all duration-100 ease-in-out origin-left transform -translate-y-1/2 bg-white pointer-events-none -top-3 font-popp peer-placeholder-shown:top-1/2 peer-placeholder-shown:ml-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-0 peer-focus:ml-3 peer-focus:text-sm peer-focus:text-gray-800"
          >
            Min age
          </Text>
        </View>
        <View className="relative w-[47%]">
          <CustomInput
            name="new_flatmate_max_age"
            control={control}
            placeholder=""
          />
          <Text
            htmlFor="new_flatmate_max_age"
            className="absolute left-0 px-1 ml-3 text-sm text-gray-500 transition-all duration-100 ease-in-out origin-left transform -translate-y-1/2 bg-white pointer-events-none -top-3 font-popp peer-placeholder-shown:top-1/2 peer-placeholder-shown:ml-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-0 peer-focus:ml-3 peer-focus:text-sm peer-focus:text-gray-800"
          >
            Max Age
          </Text>
        </View>
      </View>
      <View className="flex flex-row justify-between mt-7">
        <View className="w-[47%]">
          <Controller
            control={control}
            name="new_flatmate_occupation"
            render={({ field: { value, onChange, onBlur }, fieldState }) => (
              <>
                <CustomDropdown
                  label="Occupation"
                  value={value}
                  data={flatmateOccupation}
                  onItemChange={(item) =>
                    setValue("new_flatmate_occupation", item.value)
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
        <View className="w-[47%]">
          <Controller
            control={control}
            name="new_flatmate_pets"
            render={({ field: { value, onChange, onBlur }, fieldState }) => (
              <>
                <CustomDropdown
                  label="Pets"
                  value={value}
                  data={flatmatePets}
                  onItemChange={(item) =>
                    setValue("new_flatmate_pets", item.value)
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
      </View>
      <View className="mt-7">
        <Controller
          control={control}
          name="new_flatmate_gender"
          render={({ field: { value, onChange, onBlur }, fieldState }) => (
            <>
              <CustomDropdown
                label="Gender"
                value={value}
                data={flatmateGender}
                onItemChange={(item) =>
                  setValue("new_flatmate_gender", item.value)
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
      <View className="flex flex-row justify-between mt-2">
        <View className="flex flex-row items-start justify-start flex-1 gap-3 mt-1 ml-1">
          <Controller
            name="new_flatmate_couples"
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
          <Text htmlFor="couples" className="items-center">
            Couples?
          </Text>
        </View>
        <View className="flex flex-row items-start justify-start flex-1 gap-3 mt-1 ml-1">
          <Controller
            name="new_flatmate_references"
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
          <Text htmlFor="display_telephone" className="items-center">
            References
          </Text>
        </View>
      </View>
    </View>
  );
};

export default StepFive;

const styles = StyleSheet.create({
  checkbox: {
    marginTop: 10,
    marginLeft: 6,
  },
});
