import { createContext, useContext, useState } from "react";
import { AuthContext } from "./AuthProvider";
import axiosConfig from "../helpers/axiosConfig";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";

const SharedContext = createContext();

export const SharedContextProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const [addressStepOne, setAddressStepOne] = useState(null);
  const [propertyStepTwo, setPropertyStepTwo] = useState(null);
  const [detailsStepThree, setDetailsStepThree] = useState(null);
  const [advertiserStepFour, setAdvertiserStepFour] = useState(null);
  const [flatmateStepFive, setFlatmateStepFive] = useState(null);
  const [confirmStepSix, setConfirmStepSix] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const onSubmitAll = (confirmStepSixInfo) => {
    setConfirmStepSix(confirmStepSixInfo);

    const combinedData = {
      ...addressStepOne,
      ...propertyStepTwo,
      ...detailsStepThree,
      ...advertiserStepFour,
      ...flatmateStepFive,
      ...confirmStepSixInfo,
    };

    axiosConfig
      .post("/shareds", combinedData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        Alert.alert("Listing was added successfully");
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
    <SharedContext.Provider
      value={{
        addressStepOne,
        setAddressStepOne,
        propertyStepTwo,
        setPropertyStepTwo,
        detailsStepThree,
        setDetailsStepThree,
        advertiserStepFour,
        setAdvertiserStepFour,
        flatmateStepFive,
        setFlatmateStepFive,
        confirmStepSix,
        onSubmitAll,
        validationErrors,
      }}
    >
      {children}
    </SharedContext.Provider>
  );
};

export const useSharedContext = () => useContext(SharedContext);
