import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
} from "react-native";
import React from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useForm, Controller } from "react-hook-form";
import { CustomInput } from "../../components";
import { yupResolver } from "@hookform/resolvers/yup";
import { stepFourSchema } from "../../helpers/FlatValidation";
import Checkbox from "expo-checkbox";
import Feather from "@expo/vector-icons/Feather";

const AdvertiserStepFourScreen = ({ navigation }) => {
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
      resolver: yupResolver(stepFourSchema),
    }
  );

  const hanldeNext = async (data) => {
    try {
      // await stepFourSchema.validate(data);
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
      <View className="p-2 mt-5">
        <View className="relative">
          <CustomInput name="first_name" control={control} placeholder="" />
          <Text
            htmlFor="first_name"
            className="absolute left-0 px-1 ml-3 text-sm text-gray-500 transition-all duration-100 ease-in-out origin-left transform -translate-y-1/2 bg-white pointer-events-none -top-3 font-popp peer-placeholder-shown:top-1/2 peer-placeholder-shown:ml-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-0 peer-focus:ml-3 peer-focus:text-sm peer-focus:text-gray-800"
          >
            First name
          </Text>
        </View>
        <View className="relative mt-5">
          <CustomInput name="last_name" control={control} placeholder="" />
          <Text
            htmlFor="last_name"
            className="absolute left-0 px-1 ml-3 text-sm text-gray-500 transition-all duration-100 ease-in-out origin-left transform -translate-y-1/2 bg-white pointer-events-none -top-3 font-popp peer-placeholder-shown:top-1/2 peer-placeholder-shown:ml-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-0 peer-focus:ml-3 peer-focus:text-sm peer-focus:text-gray-800"
          >
            Last Name
          </Text>
        </View>
        <View className="flex flex-row items-start justify-start flex-1 gap-3 mt-1 ml-1">
          <Controller
            name="display_last_name"
            control={control}
            render={({ field: { value, onChange, onBlur }, fieldState }) => (
              <Checkbox
                style={styles.checkbox}
                value={value}
                onValueChange={onChange}
                color={value ? "#4630EB" : undefined}
              />
            )}
          />
          <Text htmlFor="display_last_name" className="items-center">
            Display Last Name
          </Text>
        </View>
        <View className="relative mt-9">
          <CustomInput name="telephone" control={control} placeholder="" />
          <Text
            htmlFor="telephone"
            className="absolute left-0 px-1 ml-3 text-sm text-gray-500 transition-all duration-100 ease-in-out origin-left transform -translate-y-1/2 bg-white pointer-events-none -top-3 font-popp peer-placeholder-shown:top-1/2 peer-placeholder-shown:ml-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-0 peer-focus:ml-3 peer-focus:text-sm peer-focus:text-gray-800"
          >
            Telephone
          </Text>
        </View>
        <View className="flex flex-row items-start justify-start flex-1 gap-3 mt-1 ml-1">
          <Controller
            name="display_telephone"
            control={control}
            render={({ field: { value, onChange, onBlur }, fieldState }) => (
              <Checkbox
                style={styles.checkbox}
                value={value}
                onValueChange={onChange}
                color={value ? "#4630EB" : undefined}
              />
            )}
          />
          <Text htmlFor="display_telephone" className="items-center">
            Display Telephone
          </Text>
        </View>
      </View>

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

export default AdvertiserStepFourScreen;

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
