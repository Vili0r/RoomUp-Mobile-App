import {
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import React from "react";
import { useForm } from "react-hook-form";
import { StepFiveFlat } from "../../components";
import { yupResolver } from "@hookform/resolvers/yup";
import { stepFiveSchema } from "../../helpers/FlatValidation";
import Feather from "@expo/vector-icons/Feather";
import { useFlatContext } from "../../context/FlatContext";

const FlatmateStepFiveFlatScreen = ({ navigation }) => {
  const { flatmateStepFive, setFlatmateStepFive } = useFlatContext();
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
    resolver: yupResolver(stepFiveSchema),
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
    },
  });

  const hanldeNext = async (data) => {
    try {
      await stepFiveSchema.validate(data);
      setFlatmateStepFive(data);
      // If validation succeeds, move to step 2
      navigation.navigate("AddPropertyRoot", {
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
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <StepFiveFlat control={control} setValue={setValue} />

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

export default FlatmateStepFiveFlatScreen;

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
