import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthProvider";
import { ButtonList } from "./ButtonList";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

const Profile = () => {
  const navigation = useNavigation();
  const { user, logout, isLoading } = useContext(AuthContext);

  const profileButtons = [
    {
      label: "Add a Property",
      onPress: () => console.log("add a property"),
      icon: (
        <MaterialCommunityIcons
          name="home-plus-outline"
          size={28}
          color="gray"
        />
      ),
    },
    {
      label: "View My Properties",
      onPress: () => console.log("view my properties"),
      icon: (
        <MaterialCommunityIcons
          name="home-search-outline"
          size={28}
          color="gray"
        />
      ),
    },
    {
      label: "Roommate listing",
      onPress: () => console.log("flatmate"),
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
      label: "Help Center",
      onPress: () => console.log("help center"),
      icon: <Feather name="help-circle" size={28} color="gray" />,
    },
    {
      label: "Terms and Conditions",
      onPress: () => console.log("terms"),
      icon: <Entypo name="open-book" size={28} color="gray" />,
    },
  ];

  const rentingButtons = [
    {
      label: "Favourite Properties",
      onPress: () => navigation.navigate("Root", { screen: "Saved" }),
      icon: <MaterialCommunityIcons name="home-heart" size={28} color="gray" />,
    },
  ];
  const accountButtons = [
    {
      label: "Account Settings",
      onPress: () => console.log("view my properties"),
      icon: <Ionicons name="settings-outline" size={28} color="gray" />,
    },
    {
      label: "Reset Password",
      onPress: () =>
        navigation.navigate("Reset Password Screen", { token: user.token }),
      icon: <MaterialCommunityIcons name="lock-reset" size={28} color="gray" />,
    },
  ];
  return (
    <ScrollView className="p-3">
      <View className="flex flex-row mt-4">
        <Image
          className="object-cover w-16 h-16 mx-2 rounded-full shrink-0 ring-4 ring-gray-300"
          source={{
            uri: user.avatar,
          }}
        />
        <View className="m-2">
          <Text className="text-base font-semibold text-gray-800">
            {user.first_name}
          </Text>
          <Text className="text-base text-gray-500">{user.email}</Text>
        </View>
      </View>
      <View className="mt-4 border-b-2 border-b-gray-200"></View>
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
    </ScrollView>
  );
};

export default Profile;
