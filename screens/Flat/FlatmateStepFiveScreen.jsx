import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useForm, Controller } from "react-hook-form";
import { Select, CustomInput } from "../../components";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axiosConfig from "../../helpers/axiosConfig";
import {
  stepOneSchema,
  stepTwoSchema,
  stepThreeSchema,
  stepFourSchema,
  stepFiveSchema,
  stepSixSchema,
} from "../../helpers/FlatValidation";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";

const FlatmateStepFiveScreen = ({ navigation }) => {
  const [validationErrors, setValidationErrors] = useState({});
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
  } = useForm(
    {
      mode: "onBlur",
    },
    {
      resolver: yupResolver(stepOneSchema),
    }
  );

  return (
    <KeyboardAwareScrollView
      bounces={false}
      style={styles.container} //style changed to contentContainerStyle
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar />

      <TouchableOpacity
        onPress={() =>
          navigation.navigate("AddPropertyRoot", {
            screen: "Confirm",
          })
        }
        disabled={!formState.isValid}
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

export default FlatmateStepFiveScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flexGrow: 1,
    backgroundColor: "white",
  },
});
