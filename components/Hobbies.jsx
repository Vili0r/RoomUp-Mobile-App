import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Controller } from "react-hook-form";
import Checkbox from "expo-checkbox";
import { hobbies } from "../helpers/arrays";

const Hobbies = ({ control, selectedHobbies, toggleHobbies }) => {
  return (
    <View className="">
      <Controller
        control={control}
        name="hobbies"
        render={({ field: { value, onChange, onBlur }, fieldState }) => (
          <>
            <View className="">
              {hobbies.map((hobby) => (
                <View
                  key={hobby.key}
                  className="flex flex-row items-center space-x-2"
                >
                  <Checkbox
                    value={selectedHobbies?.includes(hobby.key)}
                    onValueChange={() => toggleHobbies(hobby.key)}
                    style={styles.checkbox}
                    color={
                      selectedHobbies?.includes(hobby.key)
                        ? "#4630EB"
                        : undefined
                    }
                  />
                  <Text className="mt-3">{hobby.value}</Text>
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
  );
};

export default Hobbies;

const styles = StyleSheet.create({
  checkbox: {
    marginTop: 12,
    marginLeft: 6,
  },
});
