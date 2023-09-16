import React from "react";
import { TextInput, View, Text } from "react-native";
import { Controller } from "react-hook-form";

const CustomInput = ({ control, name, placeholder, secureTextEntry }) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, onBlur }, fieldState }) => (
        <>
          <TextInput
            className="p-4 text-gray-700 bg-gray-100 rounded-2xl"
            onChangeText={onChange}
            value={value}
            onBlur={onBlur}
            placeholder={placeholder}
            placeholderTextColor="gray"
            autoCapitalize="none"
            secureTextEntry={secureTextEntry}
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
  );
};

export default CustomInput;
