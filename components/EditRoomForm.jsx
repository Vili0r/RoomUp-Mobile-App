import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  ScrollView,
  Pressable,
  FlatList,
  Image,
  Alert,
} from "react-native";
import React, { useState, useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Feather from "@expo/vector-icons/Feather";
import {
  DaysAvailable,
  MinStay,
  MaxStay,
  roomSize,
  Furnishings,
} from "../helpers/arrays";
import { editRoomSchema } from "../helpers/RoomValidation";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomDropdown from "./CustomDropdown";
import CustomInput from "./CustomInput";
import Checkbox from "expo-checkbox";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AuthContext } from "../context/AuthProvider";
import axiosConfig from "../helpers/axiosConfig";
import { useNavigation } from "@react-navigation/native";

const imgDir = FileSystem.documentDirectory + "images/";

const ensureDirExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(imgDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(imgDir, { intermediates: true });
  }
};

const EditRoomForm = ({ room }) => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const [images, setImages] = useState([]);
  const [serverImages, setServerImages] = useState(room?.images || []);
  const [serverErrors, setServerErrors] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [pickedDate, setPickedDate] = useState(new Date(room?.available_from));

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
    resolver: yupResolver(editRoomSchema),
    defaultValues: {
      sub_title: room?.sub_title || "",
      sub_description: room?.sub_description || "",
      room_size: room?.room_size,
      room_cost: room?.room_cost.toString(),
      room_deposit: room?.room_deposit.toString(),
      room_references: room?.room_references === 1 ? true : false,
      room_furnished: room?.room_furnished,
      available_from: room?.available_from,
      minimum_stay: room?.minimum_stay,
      maximum_stay: room?.maximum_stay,
      days_available: room?.days_available,
      short_term: room?.short_term === 1 ? true : false,
    },
  });

  const hanldeUpdate = async () => {
    const data = getValues();
    try {
      await editRoomSchema.validate(data);
      const imagesData = await uploadImage();
      // Combine the data with the uploaded images
      const combinedData = {
        ...data,
        images: imagesData, // Add the images data to combinedData
      };

      await axiosConfig
        .put(`/rooms/${room.id}`, combinedData, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((response) => {
          Alert.alert("Listing was updated successfully!");
          navigation.navigate("My Properties Screen", {
            token: user.token,
          });
        })
        .catch((error) => {
          setServerErrors(error.response.data.message);
          const key = Object.keys(error.response.data.errors)[0];
          setServerErrors(error.response.data.errors[key][0]);
          Alert.alert("Listing was not updated successfully");
        });
    } catch (error) {
      setError(error.path, {
        type: "manual",
        message: error.message,
      });
    }
  };

  const selectImage = async (useLibrary) => {
    let result;
    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.75,
    };

    if (useLibrary) {
      result = await ImagePicker.launchImageLibraryAsync(options);
    } else {
      await ImagePicker.requestCameraPermissionsAsync();
      result = await ImagePicker.launchCameraAsync(options);
    }

    // Save image if not cancelled
    if (!result.canceled) {
      saveImage(result.assets[0].uri);
    }
  };

  const saveImage = async (uri) => {
    await ensureDirExists();
    const filename = new Date().getTime() + ".jpeg";
    const dest = imgDir + filename;
    await FileSystem.copyAsync({ from: uri, to: dest });
    setImages([...images, dest]);
  };

  // Delete image from file system
  const deleteImage = async (uri) => {
    await FileSystem.deleteAsync(uri);
    setImages(images.filter((i) => i !== uri));
  };

  // Upload image from file system to server
  const uploadImage = async () => {
    if (images.length === 0) {
      return null;
    }
    const formData = new FormData();
    images.map((item, index) => {
      formData.append("images[]", {
        uri: Platform.OS === "android" ? item : item.replace("file://", ""),
        name: "image/jpeg",
        type: item.split("/").pop(),
      });
    });

    try {
      const response = await axiosConfig.post("/upload", formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      setServerErrors(error.response.data.message);
      const key = Object.keys(error.response.data.errors)[0];
      setServerErrors(error.response.data.errors[key][0]);
    }
  };

  const handleDeletePhoto = (fileName) => {
    axiosConfig
      .delete(`/room/${property.id}/delete-photo`, {
        data: { fileName },
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((response) => {
        Alert.alert("Image deleted successfully!");
        setServerImages(serverImages.filter((i) => i !== fileName));
      })
      .catch((error) => {
        setServerErrors(error.response.data.message);
        const key = Object.keys(error.response.data.errors)[0];
        setServerErrors(error.response.data.errors[key][0]);
      });
  };

  const renderItem = (item) => {
    const filename = item.item.split("/").pop();

    return (
      <View className="flex-row items-center gap-1 m-1">
        <Image style={{ width: 80, height: 80 }} source={{ uri: item.item }} />
        <Text className="flex-1">{filename}</Text>
        <Ionicons.Button name="trash" onPress={() => deleteImage(item.item)} />
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View className="px-3">
        {serverErrors && (
          <Text className="text-sm text-red-500">{serverErrors}</Text>
        )}
        <View className="relative mt-5">
          <CustomInput
            name="sub_title"
            control={control}
            placeholder=""
            editable={true}
          />
          <Text
            htmlFor="sub_title"
            className="absolute left-0 px-1 ml-3 text-sm text-gray-500 transition-all duration-100 ease-in-out origin-left transform -translate-y-1/2 bg-white pointer-events-none -top-3 font-popp peer-placeholder-shown:top-1/2 peer-placeholder-shown:ml-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-0 peer-focus:ml-3 peer-focus:text-sm peer-focus:text-gray-800"
          >
            Title
          </Text>
        </View>
        <View className="relative mt-7">
          <Controller
            control={control}
            name="sub_description"
            render={({ field: { value, onChange, onBlur }, fieldState }) => (
              <>
                <TextInput
                  className="w-full px-3 py-3 border border-gray-300 rounded-md peer"
                  onChangeText={onChange}
                  value={value}
                  onBlur={onBlur}
                  placeholder=""
                  placeholderTextColor="gray"
                  autoCapitalize="none"
                  multiline
                  numberOfLines={10}
                  style={{ minHeight: 150 }}
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
            htmlFor="sub_description"
            className="absolute left-0 px-1 ml-3 text-sm text-gray-500 transition-all duration-100 ease-in-out origin-left transform -translate-y-1/2 bg-white pointer-events-none -top-3 font-popp peer-placeholder-shown:top-1/2 peer-placeholder-shown:ml-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-0 peer-focus:ml-3 peer-focus:text-sm peer-focus:text-gray-800"
          >
            Short Description
          </Text>
        </View>

        <View className="w-[65%] mt-7">
          <Controller
            name="available_from"
            control={control}
            render={({ field: { value, onChange, onBlur }, fieldState }) => (
              <>
                <Pressable
                  onPress={() => setShowCalendar(true)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-md peer"
                >
                  <Text className="mt-3">{pickedDate.toDateString()}</Text>
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
                  setPickedDate(selectedDate);
                  setValue("available_from", selectedDate);
                }
              }}
            />
          )}
        </View>

        <View className="flex flex-row justify-between mt-8">
          <View className="relative w-[47%]">
            <CustomInput name="room_cost" control={control} placeholder="" />
            <Text
              htmlFor="room_cost"
              className="absolute left-0 px-1 ml-3 text-sm text-gray-500 transition-all duration-100 ease-in-out origin-left transform -translate-y-1/2 bg-white pointer-events-none -top-3 font-popp peer-placeholder-shown:top-1/2 peer-placeholder-shown:ml-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-0 peer-focus:ml-3 peer-focus:text-sm peer-focus:text-gray-800"
            >
              Cost per month
            </Text>
          </View>
          <View className="relative w-[47%]">
            <CustomInput name="room_deposit" control={control} placeholder="" />
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
              name="room_size"
              render={({ field: { value, onChange, onBlur }, fieldState }) => (
                <>
                  <CustomDropdown
                    label="Room Size"
                    value={value}
                    data={roomSize}
                    onItemChange={(item) => setValue("room_size", item.value)}
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
              name="room_furnished"
              render={({ field: { value, onChange, onBlur }, fieldState }) => (
                <>
                  <CustomDropdown
                    label="Room Furnishing"
                    value={value}
                    data={Furnishings}
                    onItemChange={(item) =>
                      setValue("room_furnished", item.value)
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
              name="minimum_stay"
              render={({ field: { value, onChange, onBlur }, fieldState }) => (
                <>
                  <CustomDropdown
                    label="Minimum Stay"
                    value={value}
                    data={MinStay}
                    onItemChange={(item) =>
                      setValue("minimum_stay", item.value)
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
              name="maximum_stay"
              render={({ field: { value, onChange, onBlur }, fieldState }) => (
                <>
                  <CustomDropdown
                    label="Maximum Stay"
                    value={value}
                    data={MaxStay}
                    onItemChange={(item) =>
                      setValue("maximum_stay", item.value)
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
            name="room_references"
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

        <View className="flex flex-row justify-between mt-7">
          <View className="w-[47%]">
            <Controller
              control={control}
              name="days_available"
              render={({ field: { value, onChange, onBlur }, fieldState }) => (
                <>
                  <CustomDropdown
                    label="Days Available"
                    value={value}
                    data={DaysAvailable}
                    onItemChange={(item) =>
                      setValue("days_available", item.value)
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

        {serverImages?.length > 0 && (
          <>
            <Text className="mt-1">
              Images uploaded when creating advertisment
            </Text>

            {serverImages.map((file, index) => (
              <View key={index} className="flex mt-2">
                <View className="">
                  <View
                    className="relative w-1/3 px-3 overflow-hidden transition-all rounded-lg group hover:w-full"
                    key={index}
                  >
                    <Image
                      style={{
                        width: 100,
                        height: 100,
                      }}
                      className="object-cover origin-bottom rounded-lg"
                      source={{
                        uri: `http://127.0.0.1:8000/storage/${file}`,
                      }}
                    />

                    <TouchableOpacity
                      className="absolute top-0 z-50 p-1 bg-white rounded-bl right-1 focus:outline-none"
                      onPress={() => handleDeletePhoto(file)}
                    >
                      <Ionicons name="trash-outline" size={24} color="black" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </>
        )}
        <View className="flex flex-row justify-around mt-4">
          <Pressable
            onPress={() => selectImage(true)}
            className="flex flex-row justify-center px-4 py-3 bg-yellow-400 rounded-xl"
          >
            <Text className="text-base font-semibold text-center text-gray-700">
              Upload Images
            </Text>
          </Pressable>
          <Pressable
            onPress={() => selectImage(false)}
            className="flex flex-row justify-center px-3 py-3 bg-yellow-400 rounded-xl"
          >
            <Text className="text-base font-semibold text-center text-gray-700">
              Camera
            </Text>
          </Pressable>
        </View>
      </View>
      <FlatList data={images} renderItem={renderItem} />
      <TouchableOpacity
        onPress={hanldeUpdate}
        // disabled={!formState.isValid}
        className="flex flex-row items-center justify-center py-3 m-3 mt-5 mb-10 space-x-3 bg-gray-900 rounded-xl"
      >
        <Text className="font-bold text-center text-white font-xl">
          Update Room
        </Text>
        <Feather name="arrow-right" size={20} color="white" />
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditRoomForm;

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
