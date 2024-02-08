import {
  View,
  Platform,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState, useContext } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AuthContext } from "../context/AuthProvider";
import axiosConfig from "../helpers/axiosConfig";
import { ModalHeader } from "../components";
import { useNavigation } from "@react-navigation/native";
import CustomDropdown from "../components/CustomDropdown";
import { reasonForReporting } from "../helpers/arrays";

const ReportListingScreen = ({ route }) => {
  const { id, type, title } = route.params;
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const [error, setError] = useState(null);
  const [fullName, setFullName] = useState(user.first_name, user.last_name);
  const [email, setEmail] = useState("");
  const [details, setDetails] = useState("");
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleReportListing = async () => {
    setIsLoading(true);
    await axiosConfig
      .post(
        "/report-listing/store",
        {
          contact_name: fullName,
          email,
          reason,
          details,
          owner_id: id,
          owner_type: type,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((res) => {
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
    <KeyboardAwareScrollView
      bounces={false}
      style={{ flexGrow: 1, backgroundColor: "white" }} //style changed to contentContainerStyle
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 bg-white">
        {Platform.OS === "ios" ? (
          <ModalHeader
            text={`Report ${title}`}
            xShown
            style={{ borderBottom: "2px solid #2a2a2c" }}
          />
        ) : null}
        {error && (
          <Text className="p-3 mt-10 font-semibold text-red-500 text-md">
            {error}
          </Text>
        )}

        <View className="p-2 mt-5 space-y-2 form">
          <View className="relative mb-5">
            <TextInput
              className="w-full px-3 py-3 border border-gray-300 rounded-md peer"
              onChangeText={setFullName}
              value={fullName}
              placeholder="Full Name"
              placeholderTextColor="gray"
              autoCapitalize="none"
              editable={false}
            />
            <Text className="absolute left-0 px-1 ml-3 text-sm text-gray-500 transition-all duration-100 ease-in-out origin-left transform -translate-y-1/2 bg-white pointer-events-none -top-3 font-popp peer-placeholder-shown:top-1/2 peer-placeholder-shown:ml-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-0 peer-focus:ml-3 peer-focus:text-sm peer-focus:text-gray-800">
              Full Name
            </Text>
          </View>
          <View className="relative mb-3">
            <TextInput
              className="w-full px-3 py-3 border border-gray-300 rounded-md peer"
              onChangeText={setEmail}
              value={email}
              placeholderTextColor="gray"
              textContentType="emailAddress"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Text className="absolute left-0 px-1 ml-3 text-sm text-gray-500 transition-all duration-100 ease-in-out origin-left transform -translate-y-1/2 bg-white pointer-events-none -top-3 font-popp peer-placeholder-shown:top-1/2 peer-placeholder-shown:ml-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-0 peer-focus:ml-3 peer-focus:text-sm peer-focus:text-gray-800">
              Email Address
            </Text>
          </View>

          <View className="mb-5">
            <CustomDropdown
              label="Nature of Report"
              value={reason}
              data={reasonForReporting}
              onItemChange={(item) => setReason(item.value)}
            />
          </View>
          <View className="relative">
            <TextInput
              className="w-full px-3 py-3 border border-gray-300 rounded-md peer"
              onChangeText={setDetails}
              value={details}
              placeholderTextColor="gray"
              autoCapitalize="none"
              multiline
              numberOfLines={4}
              style={{ minHeight: 100 }}
            />
            <Text className="absolute left-0 px-1 ml-3 text-sm text-gray-500 transition-all duration-100 ease-in-out origin-left transform -translate-y-1/2 bg-white pointer-events-none -top-3 font-popp peer-placeholder-shown:top-1/2 peer-placeholder-shown:ml-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-0 peer-focus:ml-3 peer-focus:text-sm peer-focus:text-gray-800">
              Details
            </Text>
          </View>
        </View>
        <View className="p-5">
          <TouchableOpacity
            onPress={() => handleReportListing()}
            className="flex flex-row justify-center py-3 bg-gray-800 rounded-xl"
          >
            {isLoading && (
              <ActivityIndicator className="mr-2" size="small" color="white" />
            )}
            <Text className="text-xl font-bold text-center text-white">
              Report Listing
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default ReportListingScreen;
