import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Button,
  Pressable,
  Platform,
  Alert,
  StyleSheet,
  StatusBar,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState, useEffect, useContext } from "react";
import axiosConfig from "../../helpers/axiosConfig";
import Feather from "@expo/vector-icons/Feather";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useForm, Controller } from "react-hook-form";
import { Select, ModalHeader, CustomInput } from "../../components";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "../../context/AuthProvider";
import * as SecureStore from "expo-secure-store";
import { genders, lookingFor } from "../../helpers/arrays";

const RegisterScreen = ({ navigation }) => {
  const stepOneSchema = yup.object().shape({
    first_name: yup.string().required("First Name is required"),
    last_name: yup.string().required("last Name is required"),
    email: yup.string().email().required("Email is required"),
    password: yup.string().min(6).max(20).required("Password is required"),
    password_confirmation: yup
      .string()
      .oneOf([yup.ref("password"), null])
      .required("Password confirmation is required"),
  });

  const stepTwoSchema = yup.object().shape({
    birthdate: yup
      .string()
      .required("DOB is Required")
      .test(
        "birthdate",
        "Please choose a valid date of birth",
        (date) => moment().diff(moment(date), "years") >= 18
      ),
    gender: yup.string().required("Gender is required"),
    looking_for: yup.string().required("Looking for is required"),
  });
  const { setUser } = useContext(AuthContext);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [serverErrors, setServerErrors] = useState([]);
  const { control, handleSubmit, formState, setError, setValue, reset } =
    useForm(
      {
        mode: "onBlur",
        validationSchema: step === 1 ? stepOneSchema : stepTwoSchema,
      },
      {
        resolver: yupResolver(stepOneSchema),
      }
    );

  const handleLogin = async (email, password) => {
    setIsLoading(true);
    await axiosConfig
      .post("/login", {
        email,
        password,
        device_name: "mobile",
      })
      .then((res) => {
        const userResponse = {
          token: res.data.token,
          id: res.data.user.id,
          first_name: res.data.user.first_name,
          email: res.data.user.email,
          avatar: res.data.user.avatar,
        };
        setUser(userResponse);
        SecureStore.setItemAsync("user", JSON.stringify(userResponse));
        navigation.navigate("Account Screen"); // Go back to the previous screen
      })
      .catch((error) => {
        navigation.navigate("Login Screen"); // Go back to the previous screen
      });
  };

  const onSubmit = async (data) => {
    if (step === 1) {
      // Validate step 1
      try {
        await stepOneSchema.validate(data);
        // If validation succeeds, move to step 2
        setStep(2);
      } catch (error) {
        setError(error.path, {
          type: "manual",
          message: error.message,
        });
      }
    } else {
      // Step 2: Send data to the server
      try {
        const date = new Date(data.birthdate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based, so add 1
        const day = String(date.getDate()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;

        const formData = new FormData();
        formData.append("first_name", data.first_name);
        formData.append("last_name", data.last_name);
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("password_confirmation", data.password_confirmation);
        formData.append("gender", data.gender.value);
        formData.append("birthdate", formattedDate);
        formData.append("looking_for", data.looking_for.value);
        formData.append("avatar", {
          type: avatar.type,
          uri: avatar.uri,
          name: avatar.fileName,
        });

        await axiosConfig
          .post("/register", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              // You may also need to include any authorization headers if required
            },
          })
          .then((response) => {
            Alert.alert("User created successfully!");
            handleLogin(data.email, data.password);
          })
          .catch((error) => {
            if (error.response.status === 422) {
              setServerErrors(error.response.data.errors);
            }
          });
      } catch (error) {
        console.error("Error sending data:", error);
      }
    }
  };

  useEffect(() => {
    return () => {
      reset({
        password: "",
        password_confirmation: "",
      });
    };
  }, []);

  const toggleDatepicker = () => {
    setShowPicker(!showPicker);
  };

  const onDateChange = ({ type }, selectedDate) => {
    if (type == "set") {
      const currentDate = selectedDate;
      setDate(currentDate);
      if (Platform.OS === "android") {
        toggleDatepicker();
        setBirthdate(currentDate.toDateString());
      }
    } else {
      toggleDatepicker();
    }
  };

  const confirmIOSDate = () => {
    setValue("birthdate", date.toDateString());
    toggleDatepicker();
  };

  const handleBack = () => {
    setServerErrors({});
    setStep(step - 1);
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0]);
    }
  };

  return (
    <KeyboardAwareScrollView
      bounces={false}
      style={styles.container} //style changed to contentContainerStyle
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 bg-white" style={{ backgroundColor: "#877dfa" }}>
        <ModalHeader
          text="Register to RoomUp"
          xShown
          component="login-register"
        />

        <View
          style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
          className="px-8 pt-8 bg-white"
        >
          {step == "2" && (
            <View className="flex-row justify-end">
              <TouchableOpacity
                onPress={handleBack}
                className="flex flex-row items-center p-2 ml-4 space-x-2 bg-yellow-400 rounded-xl"
              >
                <Text>{step}/2</Text>
                <Feather name="arrow-left" size={20} color="black" />
              </TouchableOpacity>
            </View>
          )}

          {step == "1" && (
            <View className="space-y-2 form">
              <View className="">
                <Text className="mb-2 ml-4 text-gray-700">First Name</Text>
                <CustomInput
                  name="first_name"
                  control={control}
                  placeholder="First Name"
                />
              </View>
              <View className="mt-2">
                <Text className="mt-2 mb-2 ml-4 text-gray-700">Last Name</Text>
                <CustomInput
                  name="last_name"
                  control={control}
                  placeholder="Last Name"
                />
              </View>

              <View className="mt-2">
                <Text className="mt-2 mb-2 ml-2 text-gray-700">
                  Email Address
                </Text>
                <Controller
                  control={control}
                  name="email"
                  render={({
                    field: { value, onChange, onBlur },
                    fieldState,
                  }) => (
                    <>
                      <TextInput
                        className="p-4 text-gray-700 bg-gray-100 rounded-2xl"
                        onChangeText={onChange}
                        value={value}
                        onBlur={onBlur}
                        placeholder="Email"
                        placeholderTextColor="gray"
                        textContentType="emailAddress"
                        keyboardType="email-address"
                        autoCapitalize="none"
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
              </View>

              <View className="mt-2">
                <Text className="mt-2 mb-2 ml-4 text-gray-700">Password</Text>

                <CustomInput
                  name="password"
                  control={control}
                  placeholder="Password"
                  secureTextEntry
                />
              </View>

              <View className="mb-2">
                <Text className="mt-2 mb-2 ml-4 text-gray-700">
                  Confirm Password
                </Text>
                <CustomInput
                  name="password_confirmation"
                  control={control}
                  placeholder="Password Confirmation"
                  secureTextEntry
                />
              </View>
            </View>
          )}

          {step == "2" && (
            <>
              <View className="flex flex-col">
                {Object.entries(serverErrors).map(([fieldName, fieldErrors]) =>
                  fieldErrors.map((error, index) => (
                    <Text
                      key={`${fieldName}_${index}`}
                      className="mt-2 ml-4 text-sm text-red-500"
                    >
                      {error}
                    </Text>
                  ))
                )}
              </View>

              <View className="space-y-2 form">
                <Text className="ml-4 text-gray-700 ">Birthdate</Text>
                {showPicker && (
                  <DateTimePicker
                    mode="date"
                    display="spinner"
                    value={date}
                    onChange={onDateChange}
                    style={{ height: 120, marginTop: -10 }}
                  />
                )}
                {showPicker && Platform.OS === "ios" && (
                  <View className="flex flex-row justify-around">
                    <TouchableOpacity
                      onPress={toggleDatepicker}
                      className="px-3 py-3 bg-gray-100 rounded-xl"
                    >
                      <Text>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={confirmIOSDate}
                      className="px-3 py-3 bg-gray-100 rounded-xl"
                    >
                      <Text>Confirm</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {!showPicker && (
                  <Controller
                    control={control}
                    name="birthdate"
                    render={({
                      field: { value, onChange, onBlur },
                      fieldState,
                    }) => (
                      <>
                        <Pressable onPress={toggleDatepicker}>
                          <TextInput
                            className="p-4 mt-0 text-gray-700 bg-gray-100 rounded-2xl"
                            onChangeText={onChange}
                            value={value}
                            onBlur={onBlur}
                            placeholder="Birthdate"
                            placeholderTextColor="gray"
                            autoCapitalize="none"
                            editable={false}
                            onPressIn={toggleDatepicker}
                          />
                        </Pressable>

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
                )}

                <View className="mt-2">
                  <Controller
                    control={control}
                    name="looking_for"
                    render={({
                      field: { value, onChange, onBlur },
                      fieldState,
                    }) => (
                      <>
                        <Select
                          label="What you are Looking for"
                          value={value}
                          onBlur={onBlur}
                          items={lookingFor}
                          onItemChange={onChange}
                          isNullable={false}
                          className="p-4 mt-3 text-gray-700 bg-gray-100 rounded-2xl"
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
                </View>
                <View className="mt-2">
                  <Controller
                    control={control}
                    name="gender"
                    render={({
                      field: { value, onChange, onBlur },
                      fieldState,
                    }) => (
                      <>
                        <Select
                          label="Select your gender"
                          value={value}
                          onBlur={onBlur}
                          items={genders}
                          onItemChange={onChange}
                          isNullable={false}
                          className="p-4 mt-3 text-gray-700 bg-gray-100 rounded-2xl"
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
                </View>
                <View className="mt-2">
                  <Button
                    title="Pick an image from camera roll"
                    onPress={pickImage}
                  />
                  {avatar && (
                    <Image
                      source={{ uri: avatar.uri }}
                      style={{ width: 200, height: 200 }}
                    />
                  )}
                </View>
              </View>
            </>
          )}
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={!formState.isValid}
            className="flex flex-row items-center justify-center py-3 mt-5 space-x-3 bg-yellow-400 rounded-xl"
          >
            <Text className="font-bold text-center text-gray-700 font-xl">
              Next step
            </Text>
            <Feather name="arrow-right" size={20} color="black" />
          </TouchableOpacity>
          {step === 1 && (
            <View className="flex-row justify-center mt-7">
              <Text className="font-semibold text-gray-500">
                Already have an account?
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Login Screen")}
              >
                <Text className="font-semibold text-yellow-500"> Login</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flexGrow: 1,
    backgroundColor: "white",
  },
});
