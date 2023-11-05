import {
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  AccordionItem,
  Hobbies,
  PersonalInformation,
  StepFive,
} from "../../components";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  stepTwoHobbiesSchema,
  stepTwoNewFlatmateSchema,
  stepTwoPersonalInformationSchema,
} from "../../helpers/RoommateValidation";
import Feather from "@expo/vector-icons/Feather";
import { useRoommateContext } from "../../context/RoommateContext";

const FlatmateStepTwoRoommateScreen = ({ navigation }) => {
  const { flatmateStepTwo, setFlatmateStepTwo } = useRoommateContext();
  const [selectedHobbies, setSelectedHobbies] = useState(
    flatmateStepTwo?.hobbies ?? []
  );
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
    resolver: yupResolver(stepTwoHobbiesSchema),
    defaultValues: {
      hobbies: flatmateStepTwo?.hobbies,
      new_flatmate_smoker: flatmateStepTwo?.new_flatmate_smoker || "",
      new_flatmate_min_age:
        flatmateStepTwo?.new_flatmate_min_age.toString() || "",
      new_flatmate_max_age:
        flatmateStepTwo?.new_flatmate_max_age.toString() || "",
      new_flatmate_occupation: flatmateStepTwo?.new_flatmate_occupation || "",
      new_flatmate_pets: flatmateStepTwo?.new_flatmate_pets || "",
      new_flatmate_gender: flatmateStepTwo?.new_flatmate_gender || "",
      new_flatmate_couples: flatmateStepTwo?.new_flatmate_couples
        ? true
        : false,
      new_flatmate_references: flatmateStepTwo?.new_flatmate_references
        ? true
        : false,
      age: flatmateStepTwo?.age.toString() || "",
      smoker: flatmateStepTwo?.smoker || "",
      pets: flatmateStepTwo?.pets || "",
      occupation: flatmateStepTwo?.occupation || "",
      gender: flatmateStepTwo?.gender || "",
    },
  });

  const hanldeNext = async () => {
    setValue("hobbies", selectedHobbies);
    const data = getValues();
    try {
      clearErrors();
      await stepTwoHobbiesSchema.validate(data);
      await stepTwoPersonalInformationSchema.validate(data);
      await stepTwoNewFlatmateSchema.validate(data);
      setFlatmateStepTwo(data);
      clearErrors();
      // If validation succeeds, move to step 2
      navigation.navigate("AddRoommateRoot", {
        screen: "Advertiser",
      });
    } catch (error) {
      setError(error.path, {
        type: "manual",
        message: error.message,
      });
    }
  };

  const toggleHobbies = (hobby) => {
    if (selectedHobbies.includes(hobby)) {
      setSelectedHobbies(selectedHobbies.filter((item) => item !== hobby));
    } else {
      setSelectedHobbies([...selectedHobbies, hobby]);
    }
    setValue("hobbies", selectedHobbies);
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar />
      <AccordionItem title="Your Hobbies">
        <Hobbies
          control={control}
          selectedHobbies={selectedHobbies}
          toggleHobbies={toggleHobbies}
        />
      </AccordionItem>
      <AccordionItem title="Your Information">
        <PersonalInformation control={control} setValue={setValue} />
      </AccordionItem>

      <AccordionItem title="New Flatmate Information">
        <StepFive control={control} setValue={setValue} />
      </AccordionItem>

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

export default FlatmateStepTwoRoommateScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flexGrow: 1,
    backgroundColor: "white",
    marginBottom: 10,
  },
  checkbox: {
    marginTop: 10,
    marginLeft: 6,
  },
});
