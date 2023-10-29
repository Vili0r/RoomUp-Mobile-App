import {
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import React from "react";
import { useForm } from "react-hook-form";
import { StepTwoShared } from "../../components";
import { yupResolver } from "@hookform/resolvers/yup";
import { stepTwoSchema } from "../../helpers/SharedValidation";
import Feather from "@expo/vector-icons/Feather";
import { useSharedContext } from "../../context/SharedContext";

const PropertyStepTwoSharedScreen = ({ navigation }) => {
  const { propertyStepTwo, setPropertyStepTwo } = useSharedContext();
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
      available_rooms: propertyStepTwo?.available_rooms || "",
      size: propertyStepTwo?.size || "",
      type: propertyStepTwo?.type || "",
      current_occupants: propertyStepTwo?.current_occupants || "",
      what_i_am: propertyStepTwo?.what_i_am || "",
    },
  });

  const hanldeNext = async (data) => {
    try {
      await stepTwoSchema.validate(data);
      setPropertyStepTwo(data);
      // If validation succeeds, move to step 2
      navigation.navigate("AddSharedRoot", {
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
      <StepTwoShared control={control} setValue={setValue} />
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

export default PropertyStepTwoSharedScreen;

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
