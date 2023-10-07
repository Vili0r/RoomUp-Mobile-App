import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  TextInput,
  Pressable,
  SafeAreaView,
  Image,
  FlatList,
  Alert,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import { CustomInput } from "../../components";
import { yupResolver } from "@hookform/resolvers/yup";
import { stepSixSchema } from "../../helpers/FlatValidation";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFlatContext } from "../../context/FlatContext";
import { AuthContext } from "../../context/AuthProvider";

const imgDir = FileSystem.documentDirectory + "images/";

const ensureDirExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(imgDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(imgDir, { intermediates: true });
  }
};

const ConfirmStepSixScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const { confirmStepSixScreen, onSubmitAll, validationErrors } =
    useFlatContext();
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);
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
    resolver: yupResolver(stepSixSchema),
    defaultValues: {
      title: confirmStepSixScreen?.title || "",
      short_description: confirmStepSixScreen?.short_description || "",
    },
  });

  useEffect(() => {
    loadImages();
  }, []);

  // Load images from file system
  const loadImages = async () => {
    await ensureDirExists();
    const files = await FileSystem.readDirectoryAsync(imgDir);
    if (files.length > 0) {
      setImages(files.map((f) => imgDir + f));
    }
  };
  // console.log(validationErrors, images);

  const hanldeNext = async (data) => {
    setValue("photos", images);
    try {
      await stepSixSchema.validate(data);
      onSubmitAll(data);
      // const response = await onSubmitAll();
      // if (response) {
      //   navigation.navigate("My Properties Screen", {
      //     token: user.token,
      //   });
      // } else {
      //   Alert.alert("Listing was not added successfully");
      // }
    } catch (error) {
      console.log(error);
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

  // Upload image to server
  const uploadImage = async (uri) => {
    setUploading(true);
    setValue("images", uri);
    setUploading(false);
  };

  // Delete image from file system
  const deleteImage = async (uri) => {
    await FileSystem.deleteAsync(uri);
    setImages(images.filter((i) => i !== uri));
  };

  const renderItem = (item) => {
    const filename = item.item.split("/").pop();

    return (
      <View className="flex-row items-center gap-1 m-1">
        <Image style={{ width: 80, height: 80 }} source={{ uri: item.item }} />
        <Text className="flex-1">{filename}</Text>
        {/* <Ionicons.Button
          name="cloud-upload"
          onPress={() => uploadImage(item.item)}
        /> */}
        <Ionicons.Button name="trash" onPress={() => deleteImage(item.item)} />
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView style={styles.container}>
        <StatusBar />
        <View className="p-2 mt-5">
          <View className="relative">
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
          <View className="relative mt-10">
            <Controller
              control={control}
              name="description"
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
          onPress={handleSubmit(hanldeNext)}
          // disabled={!formState.isValid}
          className="flex flex-row items-center justify-center py-3 m-3 mt-2 space-x-3 bg-gray-900 rounded-xl"
        >
          <Text className="text-xl font-bold text-center text-white">
            Submit
          </Text>
          <AntDesign name="enter" size={20} color="white" />
        </TouchableOpacity>
      </SafeAreaView>
      <FlatList data={images} renderItem={renderItem} />
    </View>
  );
};

export default ConfirmStepSixScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flexGrow: 1,
    backgroundColor: "white",
  },
});
