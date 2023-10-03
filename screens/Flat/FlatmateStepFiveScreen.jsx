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
import { Select, CustomInput } from "../../components";
import { yupResolver } from "@hookform/resolvers/yup";
import { stepFiveSchema } from "../../helpers/FlatValidation";
import Feather from "@expo/vector-icons/Feather";
import {
  flatmateGender,
  flatmateSmoker,
  flatmateOccupation,
  flatmatePets,
} from "../../helpers/arrays";
import Checkbox from "expo-checkbox";

const FlatmateStepFiveScreen = ({ navigation }) => {
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
      resolver: yupResolver(stepFiveSchema),
    }
  );

  const hanldeNext = async (data) => {
    console.log(data);
    try {
      // await stepFiveSchema.validate(data);
      // If validation succeeds, move to step 2
      navigation.navigate("AddPropertyRoot", {
        screen: "Confirm",
      });
    } catch (error) {
      console.log(error);
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
        <View className="">
          <Controller
            control={control}
            name="new_flatmate_smoker"
            render={({ field: { value, onChange, onBlur }, fieldState }) => (
              <>
                <Select
                  label="Smoker"
                  value={value}
                  onBlur={onBlur}
                  items={flatmateSmoker}
                  onItemChange={(item) =>
                    setValue("new_flatmate_smoker", item.value)
                  }
                  isNullable={false}
                  className="p-4 mt-3 text-gray-700 bg-gray-100 rounded-2xl"
                />

                <View className="flex flex-row">
                  {fieldState.error && (
                    <Text className="mt-2 ml-4 text-sm text-red-500">
                      {fieldState.error.message}
                    </Text>
                  )}
                </View>
              </>
            )}
          />
        </View>
        <View className="flex flex-row justify-between mt-7">
          <View className="relative w-[47%]">
            <CustomInput
              name="new_flatmate_min_age"
              control={control}
              placeholder=""
            />
            <Text
              htmlFor="new_flatmate_min_age"
              className="absolute left-0 px-1 ml-3 text-sm text-gray-500 transition-all duration-100 ease-in-out origin-left transform -translate-y-1/2 bg-white pointer-events-none -top-3 font-popp peer-placeholder-shown:top-1/2 peer-placeholder-shown:ml-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-0 peer-focus:ml-3 peer-focus:text-sm peer-focus:text-gray-800"
            >
              Min age
            </Text>
          </View>
          <View className="relative w-[47%]">
            <CustomInput
              name="new_flatmate_max_age"
              control={control}
              placeholder=""
            />
            <Text
              htmlFor="new_flatmate_max_age"
              className="absolute left-0 px-1 ml-3 text-sm text-gray-500 transition-all duration-100 ease-in-out origin-left transform -translate-y-1/2 bg-white pointer-events-none -top-3 font-popp peer-placeholder-shown:top-1/2 peer-placeholder-shown:ml-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-0 peer-focus:ml-3 peer-focus:text-sm peer-focus:text-gray-800"
            >
              Max Age
            </Text>
          </View>
        </View>
        <View className="flex flex-row justify-between mt-3">
          <View className="w-[47%]">
            <Controller
              control={control}
              name="new_flatmate_occupation"
              render={({ field: { value, onChange, onBlur }, fieldState }) => (
                <>
                  <Select
                    label="Occupation"
                    value={value}
                    onBlur={onBlur}
                    items={flatmateOccupation}
                    onItemChange={(item) =>
                      setValue("new_flatmate_occupation", item.value)
                    }
                    isNullable={false}
                    className="p-4 mt-3 text-gray-700 bg-gray-100 rounded-2xl"
                  />

                  <View className="flex flex-row">
                    {fieldState.error && (
                      <Text className="mt-2 ml-4 text-sm text-red-500">
                        {fieldState.error.message}
                      </Text>
                    )}
                  </View>
                </>
              )}
            />
          </View>
          <View className="w-[47%]">
            <Controller
              control={control}
              name="new_flatmate_pets"
              render={({ field: { value, onChange, onBlur }, fieldState }) => (
                <>
                  <Select
                    label="Pets"
                    value={value}
                    onBlur={onBlur}
                    items={flatmatePets}
                    onItemChange={(item) =>
                      setValue("new_flatmate_pets", item.value)
                    }
                    isNullable={false}
                    className="p-4 mt-3 text-gray-700 bg-gray-100 rounded-2xl"
                  />

                  <View className="flex flex-row">
                    {fieldState.error && (
                      <Text className="mt-2 ml-4 text-sm text-red-500">
                        {fieldState.error.message}
                      </Text>
                    )}
                  </View>
                </>
              )}
            />
          </View>
        </View>
        <View className="mt-3">
          <Controller
            control={control}
            name="new_flatmate_gender"
            render={({ field: { value, onChange, onBlur }, fieldState }) => (
              <>
                <Select
                  label="Gender"
                  value={value}
                  onBlur={onBlur}
                  items={flatmateGender}
                  onItemChange={(item) =>
                    setValue("new_flatmate_gender", item.value)
                  }
                  isNullable={false}
                  className="p-4 mt-3 text-gray-700 bg-gray-100 rounded-2xl"
                />

                <View className="flex flex-row">
                  {fieldState.error && (
                    <Text className="mt-2 ml-4 text-sm text-red-500">
                      {fieldState.error.message}
                    </Text>
                  )}
                </View>
              </>
            )}
          />
        </View>
        <View className="flex flex-row justify-between">
          <View className="flex flex-row items-start justify-start flex-1 gap-3 mt-1 ml-1">
            <Controller
              name="couples"
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
            <Text htmlFor="couples" className="items-center">
              Couples?
            </Text>
          </View>
          <View className="flex flex-row items-start justify-start flex-1 gap-3 mt-1 ml-1">
            <Controller
              name="references"
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
              References
            </Text>
          </View>
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

export default FlatmateStepFiveScreen;

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
