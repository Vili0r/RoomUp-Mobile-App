import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Pressable,
  Platform,
} from "react-native";
import React, { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthProvider";
import { ButtonList } from "./ButtonList";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import axiosConfig from "../helpers/axiosConfig";
import * as ImagePicker from "expo-image-picker";
import BottomSheet from "./BottomSheet";
import * as SecureStore from "expo-secure-store";

const Profile = ({ handleScroll }) => {
  const navigation = useNavigation();
  const { user, logout, isLoading, setUser } = useContext(AuthContext);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [error, setError] = useState(null);

  const handleOpenBottomSheet = () => {
    setShowBottomSheet(true);
    handleScroll();
  };

  const handleProfileChange = async () => {
    setIsUploading(true);
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
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setUser((prevUser) => ({
          ...prevUser,
          avatar: response.data.avatar,
        }));
        SecureStore.setItemAsync(
          "user",
          JSON.stringify({ ...user, avatar: response.data.avatar })
        );
        Alert.alert("User profile Updated!");
        navigation.goBack();
        setIsUploading(false);
        setShowBottomSheet(false);
      })
      .catch((error) => {
        setIsUploading(false);
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

  const profileButtons = [
    {
      id: 1,
      label: "Add Whole Property Listing",
      onPress: () =>
        navigation.navigate("AddPropertyRoot", {
          screen: "Address",
        }),
      icon: (
        <MaterialCommunityIcons
          name="home-plus-outline"
          size={28}
          color="gray"
        />
      ),
    },
    {
      id: 2,
      label: "Add Room Listing",
      onPress: () =>
        navigation.navigate("AddSharedRoot", {
          screen: "Address",
        }),
      icon: <Ionicons name="bed-outline" size={28} color="gray" />,
    },
    {
      id: 3,
      label: "Add Roommate Listing",
      onPress: () =>
        navigation.navigate("AddRoommateRoot", {
          screen: "Property",
        }),
      icon: (
        <MaterialCommunityIcons
          name="human-male-female"
          size={28}
          color="gray"
        />
      ),
    },
  ];

  const supportButtons = [
    {
      id: 4,
      label: "Help Center",
      onPress: () => console.log("help center"),
      icon: <Feather name="help-circle" size={28} color="gray" />,
    },
    {
      id: 5,
      label: "Terms and Conditions",
      onPress: () => console.log("terms"),
      icon: <Entypo name="open-book" size={28} color="gray" />,
    },
  ];

  const rentingButtons = [
    {
      id: 6,
      label: "Favourite Properties",
      onPress: () => navigation.navigate("Saved Screen"),
      icon: <MaterialCommunityIcons name="home-heart" size={28} color="gray" />,
    },
    {
      id: 7,
      label: "Messages",
      onPress: () => navigation.navigate("Incoming Messages Screen"),
      icon: <AntDesign name="message1" size={28} color="gray" />,
    },
    {
      id: 8,
      label: "View My Properties",
      onPress: () =>
        navigation.navigate("My Properties Screen", {
          token: user.token,
        }),
      icon: (
        <MaterialCommunityIcons
          name="home-search-outline"
          size={28}
          color="gray"
        />
      ),
    },
    {
      id: 9,
      label: "View My Roommate listing",
      onPress: () =>
        navigation.navigate("My Roommate Listings Screen", {
          token: user.token,
        }),
      icon: (
        <MaterialCommunityIcons
          name="human-male-female"
          size={28}
          color="gray"
        />
      ),
    },
  ];

  const accountButtons = [
    {
      id: 10,
      label: "Account Settings",
      onPress: () =>
        navigation.navigate("Account Settings Screen", {
          id: user.id,
          token: user.token,
        }),
      icon: <Ionicons name="settings-outline" size={28} color="gray" />,
    },
    {
      id: 11,
      label: "Update Password",
      onPress: () => navigation.navigate("Update Password Screen"),
      icon: <MaterialCommunityIcons name="lock-reset" size={28} color="gray" />,
    },
  ];

  const avatarUrl = user.avatar.startsWith("https://")
    ? user.avatar
    : `http://127.0.0.1:8000/${user.avatar}`;

  return (
    <View className="p-3">
      <View className="flex flex-row mt-2">
        <TouchableOpacity onPress={handleOpenBottomSheet}>
          <Image
            className="object-cover mx-2 rounded-full w-14 h-14 shrink-0 ring-4 ring-gray-300"
            source={{
              uri: avatarUrl,
            }}
          />
        </TouchableOpacity>
        <View className="m-2">
          <Text className="text-base font-semibold text-gray-800">
            {user.first_name}
          </Text>
          <Text className="text-base text-gray-500">{user.email}</Text>
        </View>
      </View>
      <View className="mt-4 border-b-2 border-b-gray-200" />
      <View className="mt-4 mb-8">
        <ButtonList data={profileButtons} header={"Renting Made Easy"} />
        <ButtonList data={supportButtons} header={"Support"} />
        <ButtonList data={rentingButtons} header={"Renting tools"} />
        <ButtonList data={accountButtons} header={"Account"} />
      </View>
      <TouchableOpacity
        onPress={() => logout()}
        className="flex flex-row justify-center py-3 mb-6 space-x-3 bg-yellow-400 rounded-xl"
      >
        {isLoading && (
          <ActivityIndicator className="mr-2" size="small" color="white" />
        )}
        <MaterialIcons name="logout" size={28} color="black" />
        <Text className="text-xl font-bold text-center text-gray-700">
          Logout
        </Text>
      </TouchableOpacity>
      <BottomSheet
        show={showBottomSheet}
        onDismiss={() => setShowBottomSheet(false)}
        text="Change Photo"
        modalHeight="0.45"
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
          {isUploading && (
            <ActivityIndicator className="mr-2" size="small" color="black" />
          )}
          <Text className="text-xl font-bold text-center text-gray-700">
            Update Photo
          </Text>
        </TouchableOpacity>
      </BottomSheet>
    </View>
  );
};

export default Profile;
