import {
  Text,
  TouchableOpacity,
  ScrollView,
  View,
  TextInput,
  Pressable,
  Image,
  Alert,
  FlatList,
  StyleSheet,
} from "react-native";
import React, { useState, useContext, useCallback, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import AccordionItem from "./AccordionItem";
import Feather from "@expo/vector-icons/Feather";
import {
  stepOneSchema,
  stepTwoHobbiesSchema,
  stepTwoNewFlatmateSchema,
  stepTwoPersonalInformationSchema,
  stepThreeSchema,
  stepFourSchema,
} from "../helpers/RoommateValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import ScrollViewComponent from "./ScrollViewComponent";
import StepOneRoommate from "./StepOneRoommate";
import StepFour from "./StepFour";
import StepFive from "./StepFive";
import CustomInput from "./CustomInput";
import { AuthContext } from "../context/AuthProvider";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axiosConfig from "../helpers/axiosConfig";
import Hobbies from "./Hobbies";
import PersonalInformation from "./PersonalInformation";
import { Amenities } from "../helpers/arrays";
import Checkbox from "expo-checkbox";

const imgDir = FileSystem.documentDirectory + "images/";

const ensureDirExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(imgDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(imgDir, { intermediates: true });
  }
};

const EditFlatForm = ({ listing }) => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const [selectedAmenities, setSelectedAmenities] = useState(
    listing?.amenities.map((item) => item.id) ?? []
  );
  const [selectedHobbies, setSelectedHobbies] = useState(
    listing?.hobbies.map((item) => item.id) ?? []
  );
  const [images, setImages] = useState([]);
  const [serverImages, setServerImages] = useState(listing?.images);
  const [serverErrors, setServerErrors] = useState(null);
  const [validationErrors, setValidationErrors] = useState(null);

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
    resolver: yupResolver(stepOneSchema),
    defaultValues: {
      city: listing?.city || "",
      area: listing?.area || "",
      room_size: listing?.room_size || "",
      searching_for: listing?.searching_for || "",
      budget: listing?.budget || "",
      amenities: listing?.amenities,
      hobbies: listing?.hobbies,
      minimum_stay: listing?.availability.minimum_stay || "",
      maximum_stay: listing?.availability.maximum_stay || "",
      days_available: listing?.availability.days_available || "",
      available_from: listing.availability?.available_from || "",
      days_available: listing.availability?.days_available || "",
      short_term: listing.availability?.short_term ? true : false,
      first_name: listing.advertiser.first_name || "",
      last_name: listing.advertiser?.last_name || "",
      telephone: listing.advertiser?.telephone || "",
      display_last_name:
        listing.advertiser?.display_last_name === 1 ? true : false,
      display_telephone:
        listing.advertiser?.display_telephone === 1 ? true : false,
      new_flatmate_smoker: listing.flatmate?.new_flatmate_smoker || "",
      new_flatmate_min_age:
        listing.flatmate?.new_flatmate_min_age.toString() || "",
      new_flatmate_max_age:
        listing.flatmate?.new_flatmate_max_age.toString() || "",
      new_flatmate_occupation: listing.flatmate?.new_flatmate_occupation || "",
      new_flatmate_pets: listing.flatmate?.new_flatmate_pets || "",
      new_flatmate_gender: listing.flatmate?.new_flatmate_gender || "",
      new_flatmate_couples:
        listing.flatmate?.new_flatmate_couples === 1 ? true : false,
      new_flatmate_references:
        listing.flatmate?.new_flatmate_references === 1 ? true : false,
      age: listing?.age.toString() || "",
      smoker: listing?.smoker || "",
      pets: listing?.pets || "",
      occupation: listing?.occupation || "",
      gender: listing?.gender || "",
      title: listing?.title || "",
      description: listing?.description || "",
    },
  });

  useEffect(() => {
    // Update the form value when selectedAmenities changes
    setValue("amenities", selectedAmenities);
  }, [selectedAmenities, setValue]);

  useEffect(() => {
    // Update the form value when selectedAmenities changes
    setValue("hobbies", selectedHobbies);
  }, [selectedHobbies, setValue]);

  const hanldeUpdate = async (data) => {
    try {
      await stepOneSchema.validate(data);
      await stepTwoHobbiesSchema.validate(data);
      await stepTwoNewFlatmateSchema.validate(data);
      await stepTwoPersonalInformationSchema.validate(data);
      await stepThreeSchema.validate(data);
      await stepFourSchema.validate(data);
      // Call uploadImage and store the response data
      const imagesData = await uploadImage();
      // Combine the data with the uploaded images
      const combinedData = {
        ...data,
        images: imagesData, // Add the images data to combinedData
      };
      // If validation succeeds on all above steps
      await axiosConfig
        .put(`/roommates/${listing.id}`, combinedData, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((response) => {
          Alert.alert("Listing was updated successfully!");
          navigation.navigate("Account Screen");
        })
        .catch((error) => {
          setValidationErrors(error.response.data.message);
          const key = Object.keys(error.response.data.errors)[0];
          setValidationErrors(error.response.data.errors[key][0]);
          Alert.alert("Listing was not updated successfully");
        });
    } catch (error) {
      setError(error.path, {
        type: "manual",
        message: error.message,
      });
    }
  };

  const toggleAmenity = useCallback((amenity) => {
    setSelectedAmenities((prevSelectedAmenities) => {
      if (prevSelectedAmenities.includes(amenity)) {
        return prevSelectedAmenities.filter((item) => item !== amenity);
      } else {
        return [...prevSelectedAmenities, amenity];
      }
    });
    // After updating selectedAmenities, set the form value
    setValue("amenities", selectedAmenities);
  }, []);

  const toggleHobbies = useCallback((hobby) => {
    if (selectedHobbies.includes(hobby)) {
      setSelectedHobbies(selectedHobbies.filter((item) => item !== hobby));
    } else {
      setSelectedHobbies([...selectedHobbies, hobby]);
    }
    setValue("hobbies", selectedHobbies);
  }, []);

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
  //Deleting images from database
  const handleDeletePhoto = (fileName) => {
    axiosConfig
      .delete(`/roommate/${listing.id}/delete-photo`, {
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

  return (
    <ScrollView>
      {validationErrors && typeof validationErrors === "string" && (
        <Text className="text-sm text-red-500">{validationErrors}</Text>
      )}
      <AccordionItem title="Property">
        <StepOneRoommate
          control={control}
          setValue={setValue}
          availableFrom={listing?.available_from}
        />
      </AccordionItem>
      <AccordionItem title="Your Hobbies">
        <Hobbies
          control={control}
          selectedHobbies={selectedHobbies}
          toggleHobbies={toggleHobbies}
        />
      </AccordionItem>
      <AccordionItem title="Your Information">
        <PersonalInformation control={control} setValue={setValue} />
      </AccordionItem>

      <AccordionItem title="New Flatmate Information">
        <StepFive control={control} setValue={setValue} />
      </AccordionItem>

      <AccordionItem title="Advertiser Information">
        <StepFour control={control} />
      </AccordionItem>

      <AccordionItem title="Upload Images">
        <>
          {serverErrors && (
            <Text className="text-sm text-red-500">{serverErrors}</Text>
          )}
          <View className="p-2">
            <View className="">
              <Controller
                control={control}
                name="amenities"
                render={({
                  field: { value, onChange, onBlur },
                  fieldState,
                }) => (
                  <>
                    <View className="">
                      {Amenities.map((amenity) => (
                        <View
                          key={amenity.key}
                          className="flex flex-row items-center space-x-2"
                        >
                          <Checkbox
                            value={selectedAmenities?.includes(amenity.key)}
                            onValueChange={() => toggleAmenity(amenity.key)}
                            style={styles.checkbox}
                            color={
                              selectedAmenities?.includes(amenity.key)
                                ? "#4630EB"
                                : undefined
                            }
                          />
                          <Text className="mt-3">{amenity.value}</Text>
                        </View>
                      ))}
                    </View>
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
            <View className="relative mt-7">
              <CustomInput
                name="title"
                control={control}
                placeholder=""
                editable={true}
              />
              <Text
                htmlFor="title"
                className="absolute left-0 px-1 ml-3 text-sm text-gray-500 transition-all duration-100 ease-in-out origin-left transform -translate-y-1/2 bg-white pointer-events-none -top-3 font-popp peer-placeholder-shown:top-1/2 peer-placeholder-shown:ml-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-0 peer-focus:ml-3 peer-focus:text-sm peer-focus:text-gray-800"
              >
                Title
              </Text>
            </View>
            <View className="relative mt-7">
              <Controller
                control={control}
                name="description"
                render={({
                  field: { value, onChange, onBlur },
                  fieldState,
                }) => (
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
                      style={{ minHeight: 200 }}
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
                htmlFor="short_description"
                className="absolute left-0 px-1 ml-3 text-sm text-gray-500 transition-all duration-100 ease-in-out origin-left transform -translate-y-1/2 bg-white pointer-events-none -top-3 font-popp peer-placeholder-shown:top-1/2 peer-placeholder-shown:ml-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-0 peer-focus:ml-3 peer-focus:text-sm peer-focus:text-gray-800"
              >
                Short Description
              </Text>
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
                          <Ionicons
                            name="trash-outline"
                            size={24}
                            color="black"
                          />
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
            <FlatList data={images} renderItem={renderItem} />
          </View>
        </>
      </AccordionItem>
      <TouchableOpacity
        onPress={handleSubmit(hanldeUpdate)}
        className="flex flex-row items-center justify-center py-3 m-3 mt-5 space-x-3 bg-gray-900 rounded-xl"
      >
        <Text className="text-lg font-bold text-center text-white font-xl">
          Update
        </Text>
        <Feather name="arrow-right" size={20} color="white" />
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditFlatForm;

const styles = StyleSheet.create({
  checkbox: {
    marginTop: 12,
    marginLeft: 6,
  },
});
