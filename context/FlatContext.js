import { createContext, useContext, useState } from "react";
import { AuthContext } from "./AuthProvider";
import axiosConfig from "../helpers/axiosConfig";

const FlatContext = createContext();

export const FlatContextProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
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
      ...confirmStepSix,
    };
    console.log(combinedData);
    axiosConfig
      .post("/flats", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        combinedData,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
        setValidationErrors(error.response.data.message);
        const key = Object.keys(error.response.data.errors)[0];
        setValidationErrors(error.response.data.errors[key][0]);
      });
  };
  return (
    <FlatContext.Provider
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
    </FlatContext.Provider>
  );
};

export const useFlatContext = () => useContext(FlatContext);
