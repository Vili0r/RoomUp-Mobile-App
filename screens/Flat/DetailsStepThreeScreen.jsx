import {
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { StepThreeFlat } from "../../components";
import { yupResolver } from "@hookform/resolvers/yup";
import { stepThreeSchema } from "../../helpers/FlatValidation";
import Feather from "@expo/vector-icons/Feather";
import { useFlatContext } from "../../context/FlatContext";

const DetailsStepThreeScreen = ({ navigation }) => {
  const { detailsStepThree, setDetailsStepThree } = useFlatContext();
  const [selectedAmenities, setSelectedAmenities] = useState(
    detailsStepThree?.amenities ?? []
  );

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
    resolver: yupResolver(stepThreeSchema),
    defaultValues: {
      amenities: detailsStepThree?.amenities,
      minimum_stay: detailsStepThree?.minimum_stay,
      maximum_stay: detailsStepThree?.maximum_stay,
      available_from: detailsStepThree?.available_from,
      days_available: detailsStepThree?.days_available,
      short_term: detailsStepThree?.short_term ? true : false,
    },
  });

  const hanldeNext = async (data) => {
    setValue("amenities", selectedAmenities);
    try {
      await stepThreeSchema.validate(data);
      setDetailsStepThree(data);
      // If validation succeeds, move to step 2
      navigation.navigate("AddPropertyRoot", {
        screen: "Advertiser",
      });
    } catch (error) {
      setError(error.path, {
        type: "manual",
        message: error.message,
      });
    }
  };

  const toggleAmenity = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(
        selectedAmenities.filter((item) => item !== amenity)
      );
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
    setValue("amenities", selectedAmenities);
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar />
      <StepThreeFlat
        control={control}
        setValue={setValue}
        selectedAmenities={selectedAmenities}
        data={detailsStepThree}
        toggleAmenity={toggleAmenity}
      />
      <TouchableOpacity
        onPress={handleSubmit(hanldeNext)}
        // disabled={!formState.isValid}
        className="flex flex-row items-center justify-center py-3 m-3 mt-5 mb-10 space-x-3 bg-gray-900 rounded-xl"
      >
        <Text className="font-bold text-center text-white font-xl">
          Next step
        </Text>
        <Feather name="arrow-right" size={20} color="white" />
      </TouchableOpacity>
    </ScrollView>
  );
};

export default DetailsStepThreeScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flexGrow: 1,
    backgroundColor: "white",
  },
  input: {
    borderColor: "#e8e8e8",
    borderRadius: 3,
    borderWidth: 1,
    height: 40,
    paddingLeft: 15,
    backgroundColor: "#fbfbfb",
  },
  checkbox: {
    marginTop: 12,
    marginLeft: 6,
  },
});
