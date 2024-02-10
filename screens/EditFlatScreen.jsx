import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Switch,
  Pressable,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import React, { useLayoutEffect, useState, useContext } from "react";
import axiosConfig from "../helpers/axiosConfig";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialIcons } from "@expo/vector-icons";
import BottomSheet from "../components/BottomSheet";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useQuery } from "@tanstack/react-query";
import { EditFlatForm } from "../components";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthProvider";
import { useStripe } from "@stripe/stripe-react-native";
import * as yup from "yup";

const EditFlatScreen = ({ route, navigation }) => {
  const { id, token } = route.params;
  const { user } = useContext(AuthContext);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const schema = yup.object().shape({
    fullName: yup.string().max(50).required("Contact Name is required"),
    details: yup.string().max(500).required("Details is required"),
    phoneNumber: yup
      .string()
      .min(8, "Phone number must be at least 8 digits")
      .max(12, "Phone number cannot be more than 15 digits")
      .matches(/^\d+$/, "Phone number can only contain digits")
      .required("Telephone number is required"),
    email: yup.string().email().required("Email is required"),
  });
  const fetchEditFlat = async (id) => {
    const response = await axiosConfig.get(`/flats/${id}/edit`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.flat;
  };

  const singleFlatEditQuery = useQuery({
    queryKey: ["singleFlatEditQuery", id, "edit"],
    queryFn: () => fetchEditFlat(id),
    refetchOnMount: true,
  });

  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showVirtualTourBottomSheet, setShowVirtualTourBottomSheet] =
    useState(false);
  const [isEnabled, setIsEnabled] = useState(
    singleFlatEditQuery.data?.available == 1 ? true : false
  );
  const [pickedDate, setPickedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [serverErrors, setServerErrors] = useState(null);
  const [formValues, setFormValues] = useState({
    fullName: user.first_name,
    phoneNumber: "",
    email: "",
    details: "",
  });
  const [clientSecretKey, setClientSecretKey] = useState("");
  const [errors, setErrors] = useState({});

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: false,
      headerTitle: singleFlatEditQuery.data?.title,
      headerTintColor: "black",
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-[40px] h-[40px] rounded-[20px] bg-white justify-center items-center"
        >
          <Ionicons name="arrow-back" size={24} color="#F1C40F" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <>
          <TouchableOpacity
            onPress={() => setShowBottomSheet(true)}
            className="w-[40px] h-[40px] rounded-[20px] bg-white justify-center items-center"
          >
            <MaterialIcons name="live-tv" size={24} color="#F1C40F" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowVirtualTourBottomSheet(true)}
            className="w-[40px] h-[40px] rounded-[20px] bg-white justify-center items-center"
          >
            <MaterialCommunityIcons
              name="safety-goggles"
              size={24}
              color="#F1C40F"
            />
          </TouchableOpacity>
        </>
      ),
    });
  }, [singleFlatEditQuery.data]);

  const handleUpdate = () => {
    setIsUpdating(true);
    axiosConfig
      .put(
        `/availability/flat/${id}`,
        {
          live_at: pickedDate,
          available: isEnabled,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setIsUpdating(false);
        setShowBottomSheet(false);
        Alert.alert("Availability updated successfully");
      })
      .catch((error) => {
        setServerErrors(error.response.data.message);
        setIsUpdating(false);
        const key = Object.keys(error.response.data.errors)[0];
        setServerErrors(error.response.data.errors[key][0]);
      });
  };

  const onCheckout = async () => {
    // 1. Validate fields
    try {
      // Validate the fullName
      await schema.validate(formValues, { abortEarly: false });

      // 2. Send request to server
      const { paymentIntent } = await fetchPaymentSheetParams(token);
      // 3. Initialize the Payment sheet
      const initResponse = await initPaymentSheet({
        merchantDisplayName: "RoomUp",
        paymentIntentClientSecret: paymentIntent,
      });

      if (initResponse.error) {
        Alert.alert("Something went wrong");
        return;
      }

      // 4. Present the Payment Sheet from Stripe
      const paymentResponse = await presentPaymentSheet();
      if (paymentResponse.error) {
        Alert.alert(
          `Error code: ${paymentResponse.error.code}`,
          paymentResponse.error.message
        );
        return;
      }

      // 5. If payment ok -> create the order
      handleBookVirtualTour();
    } catch (error) {
      // Collect and set validation errors
      const validationErrors = {};
      if (error.inner) {
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
      } else {
        validationErrors[error.path] = error.message;
      }
      setErrors(validationErrors);
    }
  };

  const fetchPaymentSheetParams = async (token) => {
    try {
      const response = await axiosConfig.post(
        "/virtual-tour/payment-intent",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { clientSecret } = response.data;
      setClientSecretKey(clientSecret);
      return {
        paymentIntent: clientSecret,
      };
    } catch (error) {
      Alert.alert("Something went wrong");
    }
  };

  const handleBookVirtualTour = async () => {
    await axiosConfig
      .post(
        "/virtual-tour/success",
        {
          contact_name: formValues.fullName,
          contact_number: formValues.phoneNumber,
          email: formValues.email,
          details: formValues.details,
          owner_id: id,
          owner_type: "flat",
          payment_session_id: clientSecretKey,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((res) => {
        navigation.navigate("My Properties Screen");
        Alert.alert("Payment completed successfully!");
      })
      .catch((error) => {
        Alert.alert(
          `Error code: ${error.response.data.errors[key][0]}`,
          error.response.data.message
        );
      });
  };

  return (
    <View className="items-center justify-center flex-1 bg-white">
      <StatusBar />
      <View className="flex-1 w-full px-3">
        {singleFlatEditQuery.isLoading ? (
          <ActivityIndicator className="mt-2" size="large" color="gray" />
        ) : (
          <EditFlatForm property={singleFlatEditQuery.data} />
        )}
      </View>
      <BottomSheet
        show={showBottomSheet}
        onDismiss={() => setShowBottomSheet(false)}
        text="Change Availability"
        modalHeight="0.325"
      >
        {serverErrors && (
          <Text className="text-sm text-red-500">{serverErrors}</Text>
        )}
        <View className="p-1 mt-5">
          <Pressable
            onPress={() => setShowCalendar(true)}
            className="w-full px-3 py-3 border border-gray-300 rounded-md peer"
          >
            <Text className="mt-3">
              {singleFlatEditQuery.data?.live_at
                ? singleFlatEditQuery.data?.live_at
                : pickedDate?.toDateString()}
            </Text>
          </Pressable>

          <Text
            htmlFor="live_at"
            className="absolute left-0 px-1 ml-3 text-base text-gray-500 transition-all duration-100 ease-in-out origin-left transform -translate-y-1/2 bg-white pointer-events-none -top-2 font-popp peer-placeholder-shown:top-1/2 peer-placeholder-shown:ml-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-0 peer-focus:ml-3 peer-focus:text-sm peer-focus:text-gray-800"
          >
            Live at
          </Text>
          {showCalendar && (
            <DateTimePicker
              value={pickedDate}
              mode="date"
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  setShowCalendar(false);
                  setPickedDate(selectedDate);
                }
              }}
            />
          )}
        </View>
        <View className="p-1 mt-5">
          <Text
            htmlFor="live_at"
            className="px-1 text-base text-gray-500 bg-white"
          >
            Available
          </Text>
          <Switch
            trackColor={{ false: "#767577", true: "#F1C40F" }}
            thumbColor={isEnabled ? "#585857" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
        <TouchableOpacity
          onPress={handleUpdate}
          className="flex flex-row self-center justify-center w-2/5 py-2 text-center border-2 rounded-full select-none px-7 border-balck"
        >
          {isUpdating && (
            <ActivityIndicator className="mr-2" size="small" color="black" />
          )}
          <Text className="text-sm font-semibold text-center text-black font-base">
            Update
          </Text>
        </TouchableOpacity>
      </BottomSheet>
      <BottomSheet
        show={showVirtualTourBottomSheet}
        onDismiss={() => setShowVirtualTourBottomSheet(false)}
        text="Book a Virtual Tour"
        modalHeight="0.6"
      >
        <View className="p-2 space-y-2 form">
          <View className="relative mb-5">
            <TextInput
              className="w-full px-3 py-3 border border-gray-300 rounded-md peer"
              onChangeText={(value) =>
                setFormValues((prev) => ({ ...prev, fullName: value }))
              }
              value={formValues.fullName}
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
              onChangeText={(value) =>
                setFormValues((prev) => ({ ...prev, email: value }))
              }
              value={formValues.email}
              placeholderTextColor="gray"
              textContentType="emailAddress"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Text className="absolute left-0 px-1 ml-3 text-sm text-gray-500 transition-all duration-100 ease-in-out origin-left transform -translate-y-1/2 bg-white pointer-events-none -top-3 font-popp peer-placeholder-shown:top-1/2 peer-placeholder-shown:ml-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-0 peer-focus:ml-3 peer-focus:text-sm peer-focus:text-gray-800">
              Email Address
            </Text>
            {errors.email && (
              <Text className="text-red-500">{errors.email}</Text>
            )}
          </View>
          <View className="relative mb-3">
            <TextInput
              className="w-full px-3 py-3 border border-gray-300 rounded-md peer"
              onChangeText={(value) =>
                setFormValues((prev) => ({ ...prev, phoneNumber: value }))
              }
              value={formValues.phoneNumber}
              placeholderTextColor="gray"
              autoCapitalize="none"
            />
            <Text className="absolute left-0 px-1 ml-3 text-sm text-gray-500 transition-all duration-100 ease-in-out origin-left transform -translate-y-1/2 bg-white pointer-events-none -top-3 font-popp peer-placeholder-shown:top-1/2 peer-placeholder-shown:ml-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-0 peer-focus:ml-3 peer-focus:text-sm peer-focus:text-gray-800">
              Phone Number
            </Text>
            {errors.email && (
              <Text className="text-red-500">{errors.phoneNumber}</Text>
            )}
          </View>
          <View className="relative">
            <TextInput
              className="w-full px-3 py-3 border border-gray-300 rounded-md peer"
              onChangeText={(value) =>
                setFormValues((prev) => ({ ...prev, details: value }))
              }
              value={formValues.details}
              placeholderTextColor="gray"
              autoCapitalize="none"
              multiline
              numberOfLines={4}
              style={{ minHeight: 100 }}
            />
            <Text className="absolute left-0 px-1 ml-3 text-sm text-gray-500 transition-all duration-100 ease-in-out origin-left transform -translate-y-1/2 bg-white pointer-events-none -top-3 font-popp peer-placeholder-shown:top-1/2 peer-placeholder-shown:ml-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-0 peer-focus:ml-3 peer-focus:text-sm peer-focus:text-gray-800">
              Details
            </Text>
            {errors.email && (
              <Text className="text-red-500">{errors.details}</Text>
            )}
          </View>
        </View>
        <TouchableOpacity
          onPress={onCheckout}
          className="flex flex-row self-center justify-center w-3/5 py-2 text-center border-2 rounded-full select-none mt-7 px-7 border-balck"
        >
          {isUpdating && (
            <ActivityIndicator className="mr-2" size="small" color="black" />
          )}
          <Text className="text-sm font-semibold text-center text-black font-base">
            Book Virtual Tour
          </Text>
        </TouchableOpacity>
      </BottomSheet>
    </View>
  );
};

export default EditFlatScreen;
