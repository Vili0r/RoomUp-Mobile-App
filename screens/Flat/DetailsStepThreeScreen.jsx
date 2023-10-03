import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useForm, Controller } from "react-hook-form";
import { Select, CustomInput } from "../../components";
import { yupResolver } from "@hookform/resolvers/yup";
import { stepThreeSchema } from "../../helpers/FlatValidation";
import Feather from "@expo/vector-icons/Feather";
import {
  DaysAvailable,
  MinStay,
  MaxStay,
  Amenities,
} from "../../helpers/arrays";
import DateTimePicker from "@react-native-community/datetimepicker";
import Checkbox from "expo-checkbox";
import { MultipleSelectList } from "react-native-dropdown-select-list";

const DetailsStepThreeScreen = ({ navigation }) => {
  const [pickedDate, setPickedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

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
      resolver: yupResolver(stepThreeSchema),
    }
  );

  const hanldeNext = async (data) => {
    try {
      // await stepThreeSchema.validate(data);
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

  return (
    <KeyboardAwareScrollView
      bounces={false}
      style={styles.container} //style changed to contentContainerStyle
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar />

      <View className="p-2 mt-5">
        <View className="mt-2">
          <Controller
            control={control}
            name="amenities"
            render={({ field: { value, onChange, onBlur }, fieldState }) => (
              <>
                <MultipleSelectList
                  setSelected={(val) => setSelectedAmenities(val)}
                  data={Amenities}
                  save="value"
                  onSelect={() => setValue("amenities", selectedAmenities)}
                  label="Amenities"
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
          <View className="w-[47%]">
            <Controller
              control={control}
              name="minimum_stay"
              render={({ field: { value, onChange, onBlur }, fieldState }) => (
                <>
                  <Select
                    label="Minimum Stay"
                    value={value}
                    onBlur={onBlur}
                    items={MinStay}
                    onItemChange={(item) =>
                      setValue("minimum_stay", item.value)
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
              name="maximum_stay"
              render={({ field: { value, onChange, onBlur }, fieldState }) => (
                <>
                  <Select
                    label="Maximum Stay"
                    value={value}
                    onBlur={onBlur}
                    items={MaxStay}
                    onItemChange={(item) =>
                      setValue("maximum_stay", item.value)
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

        <View className="mt-10">
          <Controller
            name="available_from"
            control={control}
            render={({ field: { value, onChange, onBlur }, fieldState }) => (
              <>
                <Pressable
                  onPress={() => setShowCalendar(true)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-md peer"
                >
                  <Text className="mt-3">{pickedDate?.toDateString()}</Text>
                </Pressable>
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
          <Text
            htmlFor="available_from"
            className="absolute left-0 px-1 ml-3 text-sm text-gray-500 transition-all duration-100 ease-in-out origin-left transform -translate-y-1/2 bg-white pointer-events-none -top-2 font-popp peer-placeholder-shown:top-1/2 peer-placeholder-shown:ml-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-0 peer-focus:ml-3 peer-focus:text-sm peer-focus:text-gray-800"
          >
            Available from
          </Text>
          {showCalendar && (
            <DateTimePicker
              value={pickedDate}
              mode="date"
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  setShowCalendar(false);
                  setValue("available_from", selectedDate);
                  setPickedDate(selectedDate);
                }
              }}
            />
          )}
        </View>

        <View className="flex flex-row justify-between mt-5">
          <View className="w-[47%]">
            <Controller
              control={control}
              name="days_available"
              render={({ field: { value, onChange, onBlur }, fieldState }) => (
                <>
                  <Select
                    label="Days Available"
                    value={value}
                    onBlur={onBlur}
                    items={DaysAvailable}
                    onItemChange={(item) =>
                      setValue("days_available", item.value)
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
          <View className="flex flex-row items-center justify-center flex-1 gap-3">
            <Text htmlFor="city" className="items-center">
              Short Term
            </Text>
            <Controller
              name="short_term"
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
