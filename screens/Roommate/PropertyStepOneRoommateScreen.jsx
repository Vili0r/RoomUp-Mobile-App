import {
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import React, { useState, useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { stepOneSchema } from "../../helpers/RoommateValidation.js";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRoommateContext } from "../../context/RoommateContext";
import { StepOneRoommate } from "../../components";

const PropertyStepOneRoommateScreen = ({ navigation }) => {
  const { propertyStepOne, setPropertyStepOne } = useRoommateContext();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: false,
      headerTitle: "Property",
      headerTintColor: "black",
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#F1C40F" />
        </TouchableOpacity>
      ),
    });
  }, []);

  const {
    control,
    handleSubmit,
    formState,
    setError,
    clearErrors,
    setValue,
    reset,
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(stepOneSchema),
    defaultValues: {
      city: propertyStepOne?.city || "",
      area: propertyStepOne?.area || "",
      available_from: propertyStepOne?.available_from || "",
      room_size: propertyStepOne?.room_size || "",
      minimum_stay: propertyStepOne?.minimum_stay || "",
      maximum_stay: propertyStepOne?.maximum_stay || "",
      days_available: propertyStepOne?.days_available || "",
      budget: propertyStepOne?.budget || "",
    },
  });

  const hanldeNext = async (data) => {
    try {
      await stepOneSchema.validate(data);
      setPropertyStepOne(data);
      // If validation succeeds, move to step 2
      navigation.navigate("AddRoommateRoot", {
        screen: "Flatmate",
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
      <StepOneRoommate
        control={control}
        setValue={setValue}
        availableFrom={propertyStepOne?.available_from}
      />

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

export default PropertyStepOneRoommateScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flexGrow: 1,
    backgroundColor: "white",
  },
});
