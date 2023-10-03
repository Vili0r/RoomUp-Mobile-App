import {
  View,
  Image,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import axiosConfig from "../helpers/axiosConfig";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";

const MessageForm = ({ property }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [fullName, setFullName] = useState(user.first_name, user.last_name);
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const imageUrl =
    property.images[0] && `http://127.0.0.1:8000/storage/${property.images[0]}`;

  const handleSendMessage = async () => {
    setIsLoading(true);
    await axiosConfig
      .post(
        "/message/store",
        {
          email,
          phone_number: phoneNumber,
          message_text: message,
          full_name: fullName,
          owner_id: property.id,
          owner_type: property.model,
          receiver_id: property.user_id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        setError(null);
        setIsLoading(false);
        navigation.goBack(); // Go back to the previous screen
      })
      .catch((error) => {
        setError(error.response.data.message);
        setIsLoading(false);
        const key = Object.keys(error.response.data.errors)[0];
        setError(error.response.data.errors[key][0]);
      });
  };
  return (
    <>
      <View className="flex flex-row items-center px-3 mt-4">
        <Image
          className="w-[100px] h-[80px] rounded-md"
          source={
            imageUrl
              ? { uri: imageUrl }
              : require("../assets/images/HousePlaceholder.jpeg")
          }
        />
        <View className="ml-4">
          <Text className="text-sm font-bold text-gray-800">
            {property.title}
          </Text>
          <Text className="text-sm text-gray-800">
            {property.address.address_1}, {property.address.area}
          </Text>
          <Text className="text-sm text-gray-800">{property.type}</Text>
          <Text className="text-sm text-gray-800">
            Created at{" "}
            <Text className="font-semibold">
              {moment(property.created_at).format("MMM DD, YYYY")}
            </Text>
          </Text>
        </View>
      </View>
      {error && (
        <Text className="p-3 mt-10 font-semibold text-red-500 text-md">
          {error}
        </Text>
      )}
      <View className="p-2 mt-5 space-y-2 form">
        <Text className="ml-4 text-gray-700">Full Name</Text>
        <TextInput
          className="p-4 mb-3 text-gray-700 bg-gray-100 rounded-2xl"
          onChangeText={setFullName}
          value={fullName}
          placeholder="Full Name"
          placeholderTextColor="gray"
          autoCapitalize="none"
          editable={false}
        />
        <Text className="ml-4 text-gray-700">Email Address</Text>
        <TextInput
          className="p-4 mb-3 text-gray-700 bg-gray-100 rounded-2xl"
          onChangeText={setEmail}
          value={email}
          placeholder="Email"
          placeholderTextColor="gray"
          textContentType="emailAddress"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Text className="ml-4 text-gray-700">Phone Number</Text>
        <TextInput
          className="p-4 mb-3 text-gray-700 bg-gray-100 rounded-2xl"
          onChangeText={setPhoneNumber}
          value={phoneNumber}
          placeholder="Phone Number"
          placeholderTextColor="gray"
          autoCapitalize="none"
        />
        <Text className="ml-4 text-gray-700">Message</Text>
        <TextInput
          className="p-4 mb-3 text-gray-700 bg-gray-100 rounded-2xl"
          onChangeText={setMessage}
          value={message}
          placeholder="Message"
          placeholderTextColor="gray"
          autoCapitalize="none"
          multiline
          numberOfLines={4}
          style={{ minHeight: 100 }}
        />
      </View>
      <View className="p-5">
        <TouchableOpacity
          onPress={() => handleSendMessage()}
          className="flex flex-row justify-center py-3 bg-yellow-400 rounded-xl"
        >
          {isLoading && (
            <ActivityIndicator className="mr-2" size="small" color="white" />
          )}
          <Text className="text-xl font-bold text-center text-gray-700">
            Send Message
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default MessageForm;
