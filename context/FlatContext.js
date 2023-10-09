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
      ...confirmStepSixInfo,
    };
    // const date = new Date(detailsStepThree.available_from);
    // const year = date.getFullYear();
    // const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based, so add 1
    // const day = String(date.getDate()).padStart(2, "0");
    // const formattedDate = `${year}-${month}-${day}`;

    // const form = new FormData();
    // form.append("address_1", addressStepOne.address_1);
    // form.append("area", addressStepOne.area);
    // form.append("city", addressStepOne.city);
    // form.append("post_code", addressStepOne.post_code);
    // form.append("lat", addressStepOne.lat);
    // form.append("long", addressStepOne.long);
    // form.append("display_name", addressStepOne.display_name);
    // form.append("minutes", addressStepOne.minutes);
    // form.append("mode", addressStepOne.mode);
    // form.append("station", addressStepOne.station);
    // form.append("size", propertyStepTwo.size);
    // form.append("type", propertyStepTwo.type);
    // form.append("what_i_am", propertyStepTwo.what_i_am);
    // form.append("cost", propertyStepTwo.cost);
    // form.append("deposit", propertyStepTwo.deposit);
    // form.append("furnished", propertyStepTwo.furnished);
    // form.append("amenities", detailsStepThree.amenities);
    // form.append("minimum_stay", detailsStepThree.minimum_stay);
    // form.append("maximum_stay", detailsStepThree.maximum_stay);
    // form.append("available_from", formattedDate);
    // form.append("days_available", detailsStepThree.days_available);
    // form.append("short_term", detailsStepThree.short_term);
    // form.append("first_name", advertiserStepFour.first_name);
    // form.append("last_name", advertiserStepFour.last_name);
    // form.append("telephone", advertiserStepFour.telephone);
    // form.append("display_telephone", advertiserStepFour.display_telephone);
    // form.append("display_last_name", advertiserStepFour.display_last_name);
    // form.append("new_flatmate_smoker", flatmateStepFive.new_flatmate_smoker);
    // form.append("new_flatmate_min_age", flatmateStepFive.new_flatmate_min_age);
    // form.append("new_flatmate_max_age", flatmateStepFive.new_flatmate_max_age);
    // form.append(
    //   "new_flatmate_occupation",
    //   flatmateStepFive.new_flatmate_occupation
    // );
    // form.append("new_flatmate_pets", flatmateStepFive.new_flatmate_pets);
    // form.append("new_flatmate_gender", flatmateStepFive.new_flatmate_gender);
    // form.append("new_flatmate_couples", flatmateStepFive.new_flatmate_couples);
    // form.append(
    //   "new_flatmate_references",
    //   flatmateStepFive.new_flatmate_references
    // );
    // form.append("title", confirmStepSix.title);
    // form.append("description", confirmStepSix.description);
    // form.append("images", confirmStepSix.images);
    console.log(combinedData);
    axiosConfig
      .post("/flats", combinedData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error.response.data);
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
