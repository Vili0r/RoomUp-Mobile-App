import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  Image,
  FlatList,
} from "react-native";
import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { StepSixFlat } from "../../components";
import { yupResolver } from "@hookform/resolvers/yup";
import { stepSixSchema } from "../../helpers/FlatValidation";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFlatContext } from "../../context/FlatContext";
import { AuthContext } from "../../context/AuthProvider";
import axiosConfig from "../../helpers/axiosConfig";

const imgDir = FileSystem.documentDirectory + "images/";

const ensureDirExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(imgDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(imgDir, { intermediates: true });
  }
};

const ConfirmStepSixScreen = () => {
  const { user } = useContext(AuthContext);
  const { confirmStepSixScreen, onSubmitAll, validationErrors } =
    useFlatContext();
  const [images, setImages] = useState([]);
  const [serverErrors, setServerErrors] = useState(null);
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
      description: confirmStepSixScreen?.description || "",
    },
  });

  const hanldeNext = async (data) => {
    try {
      await uploadImage();
      await stepSixSchema.validate(data);
      await onSubmitAll(data);
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
    const formData = new FormData();
    images.map((item, index) => {
      formData.append("images[]", {
        uri: Platform.OS === "android" ? item : item.replace("file://", ""),
        name: "image/jpeg",
        type: item.split("/").pop(),
      });
    });

    await axiosConfig
      .post("/upload", formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setValue("images", response.data);
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
    <View className="flex-1 bg-white">
      <SafeAreaView style={styles.container}>
        <StatusBar />
        {serverErrors && (
          <Text className="text-sm text-red-500">{serverErrors}</Text>
        )}
        {validationErrors && typeof validationErrors === "string" && (
          <Text className="text-sm text-red-500">{validationErrors}</Text>
        )}
        <StepSixFlat control={control} selectImage={selectImage} />
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
