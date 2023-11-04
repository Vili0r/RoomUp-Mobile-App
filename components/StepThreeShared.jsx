import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { Controller } from "react-hook-form";
import {
  DaysAvailable,
  MinStay,
  MaxStay,
  roomSize,
  Furnishings,
} from "../helpers/arrays";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomDropdown from "./CustomDropdown";
import Checkbox from "expo-checkbox";
import { MaterialIcons } from "@expo/vector-icons";

const StepThreeShared = ({
  control,
  setValue,
  getValues,
  backendData,
  roomAttributesValidationErrors,
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [newArr, setNewArr] = useState(getValues("rooms"));
  const [pickedDates, setPickedDates] = useState(
    getValues("rooms").map(() => new Date())
  );

  const updateRoomsAndNewArr = useCallback(() => {
    if (getValues("available_rooms") < backendData.length) {
      const arr = [...backendData];
      const updatedNewArr = [
        ...arr.slice(0, getValues("available_rooms")),
        ...arr.slice(getValues("available_rooms") + 1),
      ];
      setValue("rooms", updatedNewArr);
      setNewArr(updatedNewArr);
    } else if (
      getValues("available_rooms") > backendData.length &&
      getValues("available_rooms") - getValues("rooms").length > 0
    ) {
      const newFields = [];
      for (
        let i = 0;
        i < getValues("available_rooms") - getValues("rooms").length;
        i++
      ) {
        let object = {
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
        };
        newFields.push(object);
      }
      const updatedNewArr = [...getValues("rooms"), ...newFields];
      setValue("rooms", updatedNewArr);
      setNewArr(updatedNewArr);
    } else if (getValues("available_rooms") == backendData.length) {
      const updatedNewArr = [...backendData];
      setValue("rooms", updatedNewArr);
      setNewArr(updatedNewArr);
    } else if (getValues("rooms").length > getValues("available_rooms")) {
      const diff = getValues("rooms").length - getValues("available_rooms");
      const updatedNewArr = getValues("rooms").slice(0, -diff);
      setValue("rooms", updatedNewArr);
      setNewArr(updatedNewArr);
    }
  }, [getValues, setValue, setNewArr, backendData]);

  useEffect(() => {
    updateRoomsAndNewArr();
  }, [updateRoomsAndNewArr]);

  const handleFormChange = (value, index, field) => {
    const updatedAttributes = [...getValues("rooms")];

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
    setValue("rooms", updatedAttributes);
    setNewArr(updatedAttributes);
  };

  return (
    <>
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
      {newArr.map((field, index) => (
        <View
          key={index}
          className="px-3 py-2 mt-4 mb-4 bg-white rounded-lg shadow-lg"
        >
          <View className="flex flex-row justify-between">
            <View className="w-[65%]">
              <Controller
                name={`rooms[${index}].available_from`}
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
                        {getValues("rooms")[index].available_from
                          ? new Date(
                              getValues("rooms")[index].available_from
                            ).toDateString()
                          : new Date().toDateString()}
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
            <View className="justify-center px-3 py-1 bg-gray-600 rounded-md">
              <Text className="text-sm font-bold text-white">
                Room {index + 1}
              </Text>
            </View>
          </View>

          <View className="flex flex-row justify-between mt-8">
            <View className="relative w-[47%]">
              <Controller
                control={control}
                name={`rooms[${index}].room_cost`}
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
                      value={newArr[index].room_cost}
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
                name={`rooms[${index}].room_deposit`}
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
                      value={newArr[index].room_deposit}
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
                name={`rooms[${index}].room_size`}
                render={({
                  field: { value, onChange, onBlur },
                  fieldState,
                }) => (
                  <>
                    <CustomDropdown
                      label="Room Size"
                      value={getValues("rooms")[index].room_size}
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
                name={`rooms[${index}].room_furnished`}
                render={({
                  field: { value, onChange, onBlur },
                  fieldState,
                }) => (
                  <>
                    <CustomDropdown
                      label="Room Furnishing"
                      value={getValues("rooms")[index].room_furnished}
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
                name={`rooms[${index}].minimum_stay`}
                render={({
                  field: { value, onChange, onBlur },
                  fieldState,
                }) => (
                  <>
                    <CustomDropdown
                      label="Minimum Stay"
                      value={getValues("rooms")[index].minimum_stay}
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
                name={`rooms[${index}].maximum_stay`}
                render={({
                  field: { value, onChange, onBlur },
                  fieldState,
                }) => (
                  <>
                    <CustomDropdown
                      label="Maximum Stay"
                      value={getValues("rooms")[index].maximum_stay}
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
              name={`rooms[${index}].room_references`}
              control={control}
              render={({ field: { value, onChange, onBlur }, fieldState }) => (
                <Checkbox
                  style={styles.checkbox}
                  value={newArr[index].room_references}
                  onValueChange={(value) =>
                    handleFormChange(value, index, "room_references")
                  }
                  color={newArr[index].room_references ? "#4630EB" : undefined}
                />
              )}
            />
          </View>

          <View className="flex flex-row justify-between mt-7">
            <View className="w-[47%]">
              <Controller
                control={control}
                name={`rooms[${index}].days_available`}
                render={({
                  field: { value, onChange, onBlur },
                  fieldState,
                }) => (
                  <>
                    <CustomDropdown
                      label="Days Available"
                      value={getValues("rooms")[index].days_available}
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
                name={`rooms[${index}].short_term`}
                control={control}
                render={({
                  field: { value, onChange, onBlur },
                  fieldState,
                }) => (
                  <Checkbox
                    style={styles.checkbox}
                    value={newArr[index].short_term}
                    onValueChange={(value) =>
                      handleFormChange(value, index, "short_term")
                    }
                    color={newArr[index].short_term ? "#4630EB" : undefined}
                  />
                )}
              />
            </View>
          </View>
        </View>
      ))}
    </>
  );
};

export default StepThreeShared;

const styles = StyleSheet.create({
  checkbox: {
    marginTop: 12,
    marginLeft: 6,
  },
});
