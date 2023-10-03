import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
} from "react-native";
import React from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useForm, Controller } from "react-hook-form";
import { Select, CustomInput } from "../../components";
import { yupResolver } from "@hookform/resolvers/yup";
import { stepTwoSchema } from "../../helpers/FlatValidation";
import Feather from "@expo/vector-icons/Feather";
import {
  Furnishings,
  WhatIAmFlat,
  Bedrooms,
  Types,
} from "../../helpers/arrays";

const PropertyStepTwoScreen = ({ navigation }) => {
  const {
    control,
    handleSubmit,
    formState,
    setError,
    clearErrors,
    setValue,
    reset,
  } = useForm(
    {
      mode: "onBlur",
    },
    {
      resolver: yupResolver(stepTwoSchema),
    }
  );

  const hanldeNext = async (data) => {
    try {
      // await stepTwoSchema.validate(data);
      // If validation succeeds, move to step 2
      navigation.navigate("AddPropertyRoot", {
        screen: "Details",
      });
    } catch (error) {
      setError(error.path, {
        type: "manual",
        message: error.message,
      });
    }
  };

  return (
    <KeyboardAwareScrollView
      bounces={false}
      style={styles.container} //style changed to contentContainerStyle
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar />
      <View className="p-2 mt-5">
        <View className="flex flex-row justify-between">
          <View className="w-[47%]">
            <Controller
              control={control}
              name="size"
              render={({ field: { value, onChange, onBlur }, fieldState }) => (
                <>
                  <Select
                    label="Size"
                    value={value}
                    onBlur={onBlur}
                    items={Bedrooms}
                    onItemChange={(item) => setValue("size", item.value)}
                    isNullable={false}
                    className="p-4 mt-3 text-gray-700 bg-gray-100 rounded-2xl"
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
                  <Select
                    label="Type"
                    value={value}
                    onBlur={onBlur}
                    items={Types}
                    onItemChange={(item) => setValue("type", item.value)}
                    isNullable={false}
                    className="p-4 mt-3 text-gray-700 bg-gray-100 rounded-2xl"
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
        <View className="mt-3">
          <Controller
            control={control}
            name="what_i_am"
            render={({ field: { value, onChange, onBlur }, fieldState }) => (
              <>
                <Select
                  label="What I am"
                  value={value}
                  onBlur={onBlur}
                  items={WhatIAmFlat}
                  onItemChange={(item) => setValue("what_i_am", item.value)}
                  isNullable={false}
                  className="p-4 mt-3 text-gray-700 bg-gray-100 rounded-2xl"
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
        <View className="mt-3">
          <Controller
            control={control}
            name="furnished"
            render={({ field: { value, onChange, onBlur }, fieldState }) => (
              <>
                <Select
                  label="Furnishing"
                  value={value}
                  onBlur={onBlur}
                  items={Furnishings}
                  onItemChange={(item) => setValue("furnished", item.value)}
                  isNullable={false}
                  className="p-4 mt-3 text-gray-700 bg-gray-100 rounded-2xl"
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
      <TouchableOpacity
        onPress={handleSubmit(hanldeNext)}
        // disabled={!formState.isValid}
        className="flex flex-row items-center justify-center py-3 m-3 mt-5 space-x-3 bg-gray-900 rounded-xl"
      >
        <Text className="font-bold text-center text-white font-xl">
          Next step
        </Text>
        <Feather name="arrow-right" size={20} color="white" />
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
};

export default PropertyStepTwoScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flexGrow: 1,
    backgroundColor: "white",
  },
});
