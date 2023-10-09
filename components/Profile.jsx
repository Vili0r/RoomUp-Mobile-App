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
import { AntDesign } from "@expo/vector-icons";

const Profile = () => {
  const navigation = useNavigation();
  const { user, logout, isLoading } = useContext(AuthContext);

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
      onPress: () => navigation.navigate("Add Room Screen"),
      icon: <Ionicons name="bed-outline" size={28} color="gray" />,
    },
    {
      id: 3,
      label: "Add Roommate Listing",
      onPress: () => navigation.navigate("Add Roommate Screen"),
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
  const avatarUrl =
    user.avatar !==
    "https://www.gravatar.com/avatar/000000000000000000000000000000?d=mp"
      ? `http://127.0.0.1:8000/${user.avatar}`
      : "https://www.gravatar.com/avatar/000000000000000000000000000000?d=mp";

  return (
    <ScrollView className="p-3">
      <View className="flex flex-row mt-4">
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Update Photo Profile Screen", {
              id: user.id,
              token: user.token,
              name: user.first_name,
            })
          }
        >
          <Image
            className="object-cover w-16 h-16 mx-2 rounded-full shrink-0 ring-4 ring-gray-300"
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
