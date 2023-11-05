import { Text, TouchableOpacity, StatusBar, StyleSheet } from "react-native";
import React, { useContext } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useForm } from "react-hook-form";
import { StepFour } from "../../components";
import { yupResolver } from "@hookform/resolvers/yup";
import { stepThreeSchema } from "../../helpers/RoommateValidation";
import Feather from "@expo/vector-icons/Feather";
import { useRoommateContext } from "../../context/RoommateContext";
import { AuthContext } from "../../context/AuthProvider";

const AdvertiserStepThreeRoommateScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const { advertiserStepThree, setAdvertiserStepThree } = useRoommateContext();
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
      first_name: user.first_name || "",
      last_name: advertiserStepThree?.last_name || "",
      telephone: advertiserStepThree?.telephone || "",
      display_last_name: advertiserStepThree?.display_last_name ? true : false,
      display_telephone: advertiserStepThree?.display_telephone ? true : false,
    },
  });

  const hanldeNext = async (data) => {
    try {
      await stepThreeSchema.validate(data);
      setAdvertiserStepThree(data);
      // If validation succeeds, move to step 2
      navigation.navigate("AddRoommateRoot", {
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

export default AdvertiserStepThreeRoommateScreen;

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
