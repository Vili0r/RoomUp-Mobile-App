import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { CustomInput, CustomDropdown } from "../../components";
import { yupResolver } from "@hookform/resolvers/yup";
import { stepTwoSchema } from "../../helpers/FlatValidation";
import Feather from "@expo/vector-icons/Feather";
import {
  Furnishings,
  WhatIAmFlat,
  Bedrooms,
  Types,
} from "../../helpers/arrays";
import { useFlatContext } from "../../context/FlatContext";
import { Picker } from "@react-native-picker/picker";

const PropertyStepTwoScreen = ({ navigation }) => {
  const { propertyStepTwo, setPropertyStepTwo } = useFlatContext();
  const {
    control,
    handleSubmit,
    formState,
    setError,
    clearErrors,
    setValue,
    reset,
    getValues,
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(stepTwoSchema),
    defaultValues: {
      size: propertyStepTwo?.size || "",
      type: propertyStepTwo?.type || "",
      what_i_am: propertyStepTwo?.what_i_am || "",
      cost: propertyStepTwo?.cost.toString() || "",
      deposit: propertyStepTwo?.deposit.toString() || "",
      furnished: propertyStepTwo?.furnished || "",
    },
  });

  const hanldeNext = async (data) => {
    try {
      await stepTwoSchema.validate(data);
      setPropertyStepTwo(data);
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
    <SafeAreaView style={styles.container}>
      <StatusBar />
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
        <View className="mt-3">
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
        <View className="mt-3">
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
    </SafeAreaView>
  );
};

export default PropertyStepTwoScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flexGrow: 1,
    backgroundColor: "white",
  },
  selectContainer: {
    backgroundColor: "#fff",
  },
  pickerStyles: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    marginBottom: 10,
  },

  textInput: {
    marginLeft: 15,
    marginTop: 5,
  },
  errorText: { color: "#f15c5c" },
});
