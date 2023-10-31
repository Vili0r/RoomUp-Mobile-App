import {
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  ScrollView,
} from "react-native";
import React from "react";
import { useForm } from "react-hook-form";
import { AccordionItem, CurrentFlatmate, StepFive } from "../../components";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  stepFiveNewFlatmateSchema,
  stepFiveCurrentFlatmateSchema,
} from "../../helpers/SharedValidation";
import Feather from "@expo/vector-icons/Feather";
import { useSharedContext } from "../../context/SharedContext";

const FlatmateStepFiveSharedScreen = ({ navigation }) => {
  const { flatmateStepFive, setFlatmateStepFive, propertyStepTwo } =
    useSharedContext();
  const {
    control,
    handleSubmit,
    formState,
    setError,
    clearErrors,
    setValue,
    getValues,
    reset,
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(stepFiveNewFlatmateSchema),
    defaultValues: {
      new_flatmate_smoker: flatmateStepFive?.new_flatmate_smoker || "",
      new_flatmate_min_age:
        flatmateStepFive?.new_flatmate_min_age.toString() || "",
      new_flatmate_max_age:
        flatmateStepFive?.new_flatmate_max_age.toString() || "",
      new_flatmate_occupation: flatmateStepFive?.new_flatmate_occupation || "",
      new_flatmate_pets: flatmateStepFive?.new_flatmate_pets || "",
      new_flatmate_gender: flatmateStepFive?.new_flatmate_gender || "",
      new_flatmate_couples: flatmateStepFive?.new_flatmate_couples
        ? true
        : false,
      new_flatmate_references: flatmateStepFive?.new_flatmate_references
        ? true
        : false,
      current_flatmate_age:
        flatmateStepFive?.current_flatmate_age.toString() || "",
      current_flatmate_smoker: flatmateStepFive?.current_flatmate_smoker || "",
      current_flatmate_pets: flatmateStepFive?.current_flatmate_pets || "",
      current_flatmate_occupation:
        flatmateStepFive?.current_flatmate_occupation || "",
      current_flatmate_gender: flatmateStepFive?.current_flatmate_gender || "",
    },
  });

  const hanldeNext = async () => {
    const data = getValues();
    try {
      clearErrors();
      if (propertyStepTwo.current_occupants > 0) {
        await stepFiveCurrentFlatmateSchema.validate(data);
      }
      await stepFiveNewFlatmateSchema.validate(data);
      setFlatmateStepFive(data);
      clearErrors();
      // If validation succeeds, move to step 2
      navigation.navigate("AddSharedRoot", {
        screen: "Confirm",
      });
    } catch (error) {
      setError(error.path, {
        type: "manual",
        message: error.message,
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar />

      {propertyStepTwo.current_occupants > 0 && (
        <AccordionItem title="Current Flatmate Information">
          <CurrentFlatmate control={control} setValue={setValue} />
        </AccordionItem>
      )}

      {propertyStepTwo.available_rooms > 0 && (
        <AccordionItem title="New Flatmate Information">
          <StepFive control={control} setValue={setValue} />
        </AccordionItem>
      )}

      <TouchableOpacity
        onPress={hanldeNext}
        // disabled={!formState.isValid}
        className="flex flex-row items-center justify-center py-3 m-3 mt-5 space-x-3 bg-gray-900 rounded-xl"
      >
        <Text className="font-bold text-center text-white font-xl">
          Next step
        </Text>
        <Feather name="arrow-right" size={20} color="white" />
      </TouchableOpacity>
    </ScrollView>
  );
};

export default FlatmateStepFiveSharedScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flexGrow: 1,
    backgroundColor: "white",
  },
  checkbox: {
    marginTop: 10,
    marginLeft: 6,
  },
});
