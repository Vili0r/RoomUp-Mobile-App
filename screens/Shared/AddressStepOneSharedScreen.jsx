import {
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import React, { useState, useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import { StepOne } from "../../components";
import { yupResolver } from "@hookform/resolvers/yup";
import { stepOneSchema } from "../../helpers/SharedValidation";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSharedContext } from "../../context/SharedContext";

const AddressStepOneSharedScreen = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const { addressStepOne, setAddressStepOne } = useSharedContext();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: false,
      headerTitle: "Address",
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
      address_1: addressStepOne?.address_1 || "",
      area: addressStepOne?.area || "",
      city: addressStepOne?.city || "",
      post_code: addressStepOne?.post_code || "",
      minutes: addressStepOne?.minutes || "",
      mode: addressStepOne?.mode || "",
      station: addressStepOne?.station || "",
    },
  });

  const handleSelectedAddress = (selectedAddress) => {
    setValue("address_1", selectedAddress.address.name);
    setValue("city", selectedAddress.address.state);
    setValue(
      "area",
      selectedAddress.address.suburb || selectedAddress.address.city
    );
    setValue("post_code", selectedAddress.address.postcode);
    setValue("lat", selectedAddress.lat);
    setValue("long", selectedAddress.lon);
    setValue("display_name", selectedAddress.display_name);
    setSearch("");
  };

  const hanldeNext = async (data) => {
    try {
      await stepOneSchema.validate(data);
      setAddressStepOne(data);
      // If validation succeeds, move to step 2
      navigation.navigate("AddSharedRoot", {
        screen: "Property",
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
      <StepOne
        control={control}
        setValue={setValue}
        handleSelectedAddress={handleSelectedAddress}
        search={search}
        setSearch={setSearch}
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

export default AddressStepOneSharedScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flexGrow: 1,
    backgroundColor: "white",
  },
});
