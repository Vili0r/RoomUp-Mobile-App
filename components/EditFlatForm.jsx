import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useState, useLayoutEffect, useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import AccordionItem from "./AccordionItem";
import StepOneFlat from "./StepOneFlat";
import Feather from "@expo/vector-icons/Feather";
import { stepOneSchema } from "../helpers/FlatValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import ScrollViewComponent from "./ScrollViewComponent";
import StepTwoFlat from "./StepTwoFlat";
import StepThreeFlat from "./StepThreeFlat";

const EditFlatForm = ({ data }) => {
  const [search, setSearch] = useState("");
  const [selectedAddress, setSelectedAddress] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
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
      address_1: data.address?.address_1 || "",
      area: data.address?.area || "",
      city: data.address?.city || "",
      post_code: data.address?.post_code || "",
      minutes: data.transport?.minutes || "",
      mode: data.transport?.mode || "",
      station: data.transport?.station || "",
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

  const hanldeUpdate = async (data) => {
    try {
      await stepOneSchema.validate(data);
      setAddressStepOne(data);
      // If validation succeeds, move to step 2
    } catch (error) {
      setError(error.path, {
        type: "manual",
        message: error.message,
      });
    }
  };
  return (
    <>
      <AccordionItem title="Property Address">
        <StepOneFlat
          control={control}
          setValue={setValue}
          handleSelectedAddress={handleSelectedAddress}
          search={search}
          setSearch={setSearch}
        />
      </AccordionItem>
      <AccordionItem title="Property Information">
        <StepTwoFlat control={control} setValue={setValue} />
      </AccordionItem>
      <AccordionItem title="Property Details">
        <StepThreeFlat control={control} setValue={setValue} />
      </AccordionItem>
      <TouchableOpacity
        onPress={handleSubmit(hanldeUpdate)}
        className="flex flex-row items-center justify-center py-3 m-3 mt-5 space-x-3 bg-gray-900 rounded-xl"
      >
        <Text className="font-bold text-center text-white font-xl">Update</Text>
        <Feather name="arrow-right" size={20} color="white" />
      </TouchableOpacity>
    </>
  );
};

export default EditFlatForm;
