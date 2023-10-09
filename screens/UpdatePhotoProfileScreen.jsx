import {
  View,
  Alert,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import axiosConfig from "../helpers/axiosConfig";
import * as ImagePicker from "expo-image-picker";

const UpdatePhotoProfileScreen = ({ route, navigation }) => {
  const { token } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [error, setError] = useState(null);

  const handleProfileChange = async () => {
    setIsLoading(true);
    const uri =
      Platform.OS === "android"
        ? avatar.uri
        : avatar.uri.replace("file://", "");
    const filename = avatar.uri.split("/").pop();
    const match = /\.(\w+)$/.exec(filename);
    const ext = match?.[1];
    const type = match ? `image/${match[1]}` : `image`;
    const formData = new FormData();
    formData.append("avatar", {
      uri,
      name: `image.${ext}`,
      type,
    });

    await axiosConfig
      .post("/profile-photo", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
          // You may also need to include any authorization headers if required
        },
      })
      .then((response) => {
        Alert.alert("User profile Updated!");
        navigation.goBack();
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        setError(error.response.data.message);
      });
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
      setAvatar(result.assets[0]);
    }
  };
  return (
    <KeyboardAwareScrollView
      bounces={false}
      style={{ flexGrow: 1, backgroundColor: "white" }} //style changed to contentContainerStyle
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 bg-white">
        {error && <Text className="text-sm text-red-500">{error}</Text>}
        <View className="mt-3">
          {avatar && (
            <Image
              source={{ uri: avatar.uri }}
              style={{ width: 200, height: 200 }}
            />
          )}
        </View>
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
      <TouchableOpacity
        onPress={handleProfileChange}
        className="w-[80%] flex flex-row self-center items-center justify-center py-3 mt-5 space-x-3 border-2 rounded-xl"
      >
        {isLoading && (
          <ActivityIndicator className="mr-2" size="small" color="black" />
        )}
        <Text className="text-xl font-bold text-center text-gray-700">
          Update Photo
        </Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
};

export default UpdatePhotoProfileScreen;
