import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { stepThreeSchema } from "../../helpers/SharedValidation";
import Feather from "@expo/vector-icons/Feather";
import { useSharedContext } from "../../context/SharedContext";
import {
  DaysAvailable,
  MinStay,
  MaxStay,
  roomSize,
  Furnishings,
} from "../../helpers/arrays";
import DateTimePicker from "@react-native-community/datetimepicker";
import { CustomDropdown } from "../../components";
import Checkbox from "expo-checkbox";
import { MaterialIcons } from "@expo/vector-icons";

const DetailsStepThreeSharedScreen = ({ navigation }) => {
  const { detailsStepThree, setDetailsStepThree, propertyStepTwo } =
    useSharedContext();
  const [roomAttributesValidationErrors, setRoomAttributesValidationErrors] =
    useState({});
  const [showCalendar, setShowCalendar] = useState(false);
  const [roomAttributes, setRoomAttributes] = useState([
    {
      room_size: "",
      room_cost: "",
      room_deposit: "",
      room_references: false,
      room_furnished: "",
      available_from: "",
      minimum_stay: "",
      maximum_stay: "",
      days_available: "",
      short_term: false,
    },
  ]);

  const [pickedDates, setPickedDates] = useState(
    roomAttributes.map(() => new Date())
  );

  const {
    control,
    handleSubmit,
    formState,
    getValues,
    setError,
    clearErrors,
    setValue,
    reset,
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(stepThreeSchema),
    defaultValues: {
      rooms: detailsStepThree.rooms || "",
    },
  });
  console.log(detailsStepThree.rooms);

  useEffect(() => {
    //Adding quantity of rooms based on user input
    if (propertyStepTwo.available_rooms >= 1) {
      setRoomAttributes((prevFields) => {
        if (prevFields) {
          const newFields = [];
          for (let i = 0; i < propertyStepTwo.available_rooms; i++) {
            let object = {
              room_size: "",
              room_cost: "",
              room_deposit: "",
              room_references: "",
              room_furnished: "",
              available_from: "",
              minimum_stay: "",
              maximum_stay: "",
              days_available: "",
              short_term: "",
            };
            newFields.push(object);
          }
          return newFields;
        }
      });
    }
  }, [propertyStepTwo.available_rooms]);

  const hanldeNext = async () => {
    const data = getValues();
    try {
      const isValid = await validateDynamicInputs(data.rooms);
      if (!isValid) {
        return;
      }
      setDetailsStepThree(data);
      // If validation succeeds, move to step 2
      navigation.navigate("AddSharedRoot", {
        screen: "Advertiser",
      });
    } catch (error) {
      setError(error.path, {
        type: "manual",
        message: error.message,
      });
    }
  };

  const validateDynamicInputs = async (items) => {
    console.log("validateDynamicInputs", items);
    try {
      await stepThreeSchema.validate(items, {
        abortEarly: false,
      });
      return true;
    } catch (errors) {
      const validationErrors = {};
      errors.inner.forEach((error) => {
        const { path, message } = error;
        const [index, inputName] = path.split(".");
        validationErrors[`roomAttributes.${index}.${inputName}`] = (
          <Text>{message}</Text>
        );
      });
      setRoomAttributesValidationErrors(validationErrors);
      return false;
    }
  };

  const handleFormChange = (value, index, field) => {
    const updatedAttributes = [...roomAttributes];

    // Check the field type and update accordingly
    if (typeof value === "string" || typeof value === "number") {
      // Handle TextInput
      updatedAttributes[index][field] = value;
    } else if (typeof value === "boolean") {
      // Handle Checkbox
      updatedAttributes[index][field] = value;
    } else if (value instanceof Date) {
      // Handle Date input
      updatedAttributes[index][field] = value; // You can format it as needed
    }
    setRoomAttributes(updatedAttributes);
    setValue("rooms", roomAttributes);
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar />
      {Object.keys(roomAttributesValidationErrors).length > 0 && (
        <View className="mt-3 mb-2 border-l-8 border-red-900 bg-red-50">
          <View className="flex items-center">
            <View className="p-2">
              <View className="flex items-center">
                <View className="ml-2">
                  <MaterialIcons name="error-outline" size={24} color="red" />
                </View>
                <Text className="px-6 py-4 text-lg font-semibold text-red-900">
                  Please fix the following errors before procceding.
                </Text>
              </View>
              <View className="px-16 mb-4">
                {Object.keys(roomAttributesValidationErrors).map((errorKey) => (
                  <Text
                    key={errorKey}
                    className="text-sm font-bold text-red-500 text-md"
                  >
                    {roomAttributesValidationErrors[errorKey]}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        </View>
      )}
      {roomAttributes.map((field, index) => (
        <View
          key={index}
          className="px-3 py-2 mt-4 mb-4 bg-white rounded-lg shadow-lg"
        >
          <View className="flex flex-row justify-between">
            <View className="w-[65%]">
              <Controller
                name={`roomAttributes[${index}].available_from`}
                control={control}
                render={({
                  field: { value, onChange, onBlur },
                  fieldState,
                }) => (
                  <>
                    <Pressable
                      onPress={() => setShowCalendar(index)}
                      className="w-full px-3 py-3 border border-gray-300 rounded-md peer"
                    >
                      <Text className="mt-3">
                        {(pickedDates[index] || new Date()).toDateString()}
                      </Text>
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
              {showCalendar === index && (
                <DateTimePicker
                  value={pickedDates[index] || new Date()}
                  mode="date"
                  onChange={(event, selectedDate) => {
                    if (selectedDate) {
                      setShowCalendar(null);
                      handleFormChange(selectedDate, index, "available_from");
                      const updatedPickedDates = [...pickedDates];
                      updatedPickedDates[index] = selectedDate;
                      setPickedDates(updatedPickedDates);
                    }
                  }}
                />
              )}
            </View>
            <View className="justify-center px-3 py-1 bg-gray-600 rounded-md ">
              <Text className="text-sm font-bold text-white">
                Room {index + 1}
              </Text>
            </View>
          </View>

          <View className="flex flex-row justify-between mt-8">
            <View className="relative w-[47%]">
              <Controller
                control={control}
                name={`roomAttributes[${index}].room_cost`}
                render={({
                  field: { value, onChange, onBlur },
                  fieldState,
                }) => (
                  <>
                    <TextInput
                      className="w-full px-3 py-3 border border-gray-300 rounded-md peer"
                      onChangeText={(text) =>
                        handleFormChange(text, index, "room_cost")
                      }
                      value={value}
                      onBlur={onBlur}
                      placeholderTextColor="gray"
                      autoCapitalize="none"
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

              <Text
                htmlFor="room_cost"
                className="absolute left-0 px-1 ml-3 text-sm text-gray-500 transition-all duration-100 ease-in-out origin-left transform -translate-y-1/2 bg-white pointer-events-none -top-3 font-popp peer-placeholder-shown:top-1/2 peer-placeholder-shown:ml-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-0 peer-focus:ml-3 peer-focus:text-sm peer-focus:text-gray-800"
              >
                Cost per month
              </Text>
            </View>
            <View className="relative w-[47%]">
              <Controller
                control={control}
                name={`roomAttributes[${index}].room_deposit`}
                render={({
                  field: { value, onChange, onBlur },
                  fieldState,
                }) => (
                  <>
                    <TextInput
                      className="w-full px-3 py-3 border border-gray-300 rounded-md peer"
                      onChangeText={(text) =>
                        handleFormChange(text, index, "room_deposit")
                      }
                      value={value}
                      onBlur={onBlur}
                      placeholderTextColor="gray"
                      autoCapitalize="none"
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
              <Text
                htmlFor="room_deposit"
                className="absolute left-0 px-1 ml-3 text-sm text-gray-500 transition-all duration-100 ease-in-out origin-left transform -translate-y-1/2 bg-white pointer-events-none -top-3 font-popp peer-placeholder-shown:top-1/2 peer-placeholder-shown:ml-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-0 peer-focus:ml-3 peer-focus:text-sm peer-focus:text-gray-800"
              >
                Deposit
              </Text>
            </View>
          </View>

          <View className="flex flex-row justify-between mt-5">
            <View className="w-[47%]">
              <Controller
                control={control}
                name={`roomAttributes[${index}].room_size`}
                render={({
                  field: { value, onChange, onBlur },
                  fieldState,
                }) => (
                  <>
                    <CustomDropdown
                      label="Room Size"
                      value={value}
                      data={roomSize}
                      onItemChange={(item) =>
                        handleFormChange(item.value, index, "room_size")
                      }
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
                name={`roomAttributes[${index}].room_furnished`}
                render={({
                  field: { value, onChange, onBlur },
                  fieldState,
                }) => (
                  <>
                    <CustomDropdown
                      label="Room Furnishing"
                      value={value}
                      data={Furnishings}
                      onItemChange={(item) =>
                        handleFormChange(item.value, index, "room_furnished")
                      }
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

          <View className="flex flex-row justify-between mt-5">
            <View className="w-[47%]">
              <Controller
                control={control}
                name={`roomAttributes[${index}].minimum_stay`}
                render={({
                  field: { value, onChange, onBlur },
                  fieldState,
                }) => (
                  <>
                    <CustomDropdown
                      label="Minimum Stay"
                      value={value}
                      data={MinStay}
                      onItemChange={(item) =>
                        handleFormChange(item.value, index, "minimum_stay")
                      }
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
                name={`roomAttributes[${index}].maximum_stay`}
                render={({
                  field: { value, onChange, onBlur },
                  fieldState,
                }) => (
                  <>
                    <CustomDropdown
                      label="Maximum Stay"
                      value={value}
                      data={MaxStay}
                      onItemChange={(item) =>
                        handleFormChange(item.value, index, "maximum_stay")
                      }
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

          <View className="flex flex-row items-start flex-1 gap-3 mt-3">
            <Text htmlFor="city" className="items-center">
              References?
            </Text>
            <Controller
              name={`roomAttributes[${index}].room_references`}
              control={control}
              render={({ field: { value, onChange, onBlur }, fieldState }) => (
                <Checkbox
                  style={styles.checkbox}
                  value={roomAttributes[index].room_references}
                  onValueChange={(value) =>
                    handleFormChange(value, index, "room_references")
                  }
                  color={
                    roomAttributes[index].room_references
                      ? "#4630EB"
                      : undefined
                  }
                />
              )}
            />
          </View>

          <View className="flex flex-row justify-between mt-7">
            <View className="w-[47%]">
              <Controller
                control={control}
                name={`roomAttributes[${index}].days_available`}
                render={({
                  field: { value, onChange, onBlur },
                  fieldState,
                }) => (
                  <>
                    <CustomDropdown
                      label="Days Available"
                      value={value}
                      data={DaysAvailable}
                      onItemChange={(item) =>
                        handleFormChange(item.value, index, "days_available")
                      }
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
                name={`roomAttributes[${index}].short_term`}
                control={control}
                render={({
                  field: { value, onChange, onBlur },
                  fieldState,
                }) => (
                  <Checkbox
                    style={styles.checkbox}
                    value={roomAttributes[index].short_term}
                    onValueChange={(value) =>
                      handleFormChange(value, index, "short_term")
                    }
                    color={
                      roomAttributes[index].short_term ? "#4630EB" : undefined
                    }
                  />
                )}
              />
            </View>
          </View>
        </View>
      ))}
      <TouchableOpacity
        onPress={hanldeNext}
        // disabled={!formState.isValid}
        className="flex flex-row items-center justify-center py-3 m-3 mt-5 mb-10 space-x-3 bg-gray-900 rounded-xl"
      >
        <Text className="font-bold text-center text-white font-xl">
          Next step
        </Text>
        <Feather name="arrow-right" size={20} color="white" />
      </TouchableOpacity>
    </ScrollView>
  );
};

export default DetailsStepThreeSharedScreen;

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
