import { createContext, useContext, useState } from "react";
import { AuthContext } from "./AuthProvider";
import axiosConfig from "../helpers/axiosConfig";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";

const RoommateContext = createContext();

export const RoommateContextProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const [propertyStepOne, setPropertyStepOne] = useState(null);
  const [flatmateStepTwo, setFlatmateStepTwo] = useState(null);
  const [advertiserStepThree, setAdvertiserStepThree] = useState(null);
  const [confirmStepFour, setConfirmStepFour] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const onSubmitAll = (confirmStepFourInfo) => {
    setConfirmStepFour(confirmStepFourInfo);

    const combinedData = {
      ...propertyStepOne,
      ...flatmateStepTwo,
      ...advertiserStepThree,
      ...confirmStepFourInfo,
    };

    axiosConfig
      .post("/roommates", combinedData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        navigation.navigate("My Properties Screen", {
          token: user.token,
        });
      })
      .catch((error) => {
        setValidationErrors(error.response.data.message);
        const key = Object.keys(error.response.data.errors)[0];
        setValidationErrors(error.response.data.errors[key][0]);
        Alert.alert("Listing was not added successfully");
      });
  };
  return (
    <RoommateContext.Provider
      value={{
        propertyStepOne,
        setPropertyStepOne,
        flatmateStepTwo,
        setFlatmateStepTwo,
        advertiserStepThree,
        setAdvertiserStepThree,
        confirmStepFour,
        onSubmitAll,
        validationErrors,
      }}
    >
      {children}
    </RoommateContext.Provider>
  );
};

export const useRoommateContext = () => useContext(RoommateContext);
