import { Text, TouchableOpacity, StatusBar, StyleSheet } from "react-native";
import React, { useContext } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useForm } from "react-hook-form";
import { StepFour } from "../../components";
import { yupResolver } from "@hookform/resolvers/yup";
import { stepFourSchema } from "../../helpers/FlatValidation";
import Feather from "@expo/vector-icons/Feather";
import { useFlatContext } from "../../context/FlatContext";
import { AuthContext } from "../../context/AuthProvider";

const AdvertiserStepFourFlatScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const { advertiserStepFour, setAdvertiserStepFour } = useFlatContext();
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
    resolver: yupResolver(stepFourSchema),
    defaultValues: {
      first_name: user.first_name || "",
      last_name: advertiserStepFour?.last_name || "",
      telephone: advertiserStepFour?.telephone || "",
      display_last_name: advertiserStepFour?.display_last_name ? true : false,
      display_telephone: advertiserStepFour?.display_telephone ? true : false,
    },
  });

  const hanldeNext = async (data) => {
    try {
      await stepFourSchema.validate(data);
      setAdvertiserStepFour(data);
      // If validation succeeds, move to step 2
      navigation.navigate("AddPropertyRoot", {
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
    <KeyboardAwareScrollView
      bounces={false}
      style={styles.container} //style changed to contentContainerStyle
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar />
      <StepFour control={control} />

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

export default AdvertiserStepFourFlatScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flexGrow: 1,
    backgroundColor: "white",
  },
  checkbox: {
    marginTop: 12,
    marginLeft: 6,
  },
});
