import * as yup from "yup";

const maxFiles = 9;
const supportedFormats = ["image/jpeg", "image/png", "image/jpg"];

const stepOneSchema = yup.object().shape({
  city: yup.string().max(20).required("City is required"),
  area: yup.string().max(20).required("Area is required"),
  available_from: yup
    .date()
    .typeError("Available from must be a date")
    .min(new Date(), "Available from date must be in the future")
    .required("Available from date is required"),
  searching_for: yup.string().required("Searching for is required"),
  room_size: yup.string().required("Room size is required"),
  minimum_stay: yup.string().required("Minimum stay is required"),
  maximum_stay: yup
    .string()
    .test(
      "greater-than-minimum",
      "Maximum stay must be greater than minimum stay",
      function (value) {
        const minimumStay = this.resolve(yup.ref("minimum_stay"));
        if (!minimumStay || !value) {
          return true; // Allow validation to pass if either field is empty
        }
        return parseInt(value, 10) > parseInt(minimumStay, 10);
      }
    )
    .required("Maximum stay is required"),
  days_available: yup.string().required("Days available is required"),
  budget: yup
    .number()
    .typeError("That doesn't look like a number")
    .required("Budget is required"),
});

const stepTwoNewFlatmateSchema = yup.object().shape({
  new_flatmate_min_age: yup
    .number()
    .typeError("That doesn't look like an age")
    .min(18, "Your new flatmate should be more than 18 years old")
    .required(),
  new_flatmate_max_age: yup
    .number()
    .typeError("That doesn't look like an age")
    .min(18, "Your new flatmate should be more than 18 years old")
    .required()
    .when("new_flatmate_min_age", (new_flatmate_min_age, schema) => {
      return schema.test({
        test: (new_flatmate_max_age) =>
          new_flatmate_max_age > new_flatmate_min_age,
        message: "Max age must be greater than the min age",
      });
    }),
  new_flatmate_smoker: yup.string().required("Smoker field is required"),
  new_flatmate_pets: yup.string().required("Pet field is required"),
  new_flatmate_occupation: yup
    .string()
    .required("Occupation field is required"),
  new_flatmate_gender: yup.string().required("Gender field is required"),
});

const stepTwoHobbiesSchema = yup.object().shape({
  hobbies: yup
    .array()
    .min(1, "At least one hobby is required")
    .required("Hobbies are required"),
});

const stepTwoPersonalInformationSchema = yup.object().shape({
  hobbies: yup
    .array()
    .min(1, "At least one hobby is required")
    .required("Hobbies are required"),
  age: yup
    .number()
    .typeError("That doesn't look like an age")
    .min(18, "You should be more than 18 years old")
    .required("Age is required"),
  smoker: yup.string().required("Smoker field is required"),
  pets: yup.string().required("Pet field is required"),
  occupation: yup.string().required("Occupation field is required"),
  gender: yup.string().required("Gender field is required"),
});

const stepThreeSchema = yup.object().shape({
  first_name: yup.string().max(20).required("First name is required"),
  last_name: yup.string().max(20).required("Last name is required"),
  telephone: yup
    .string()
    .min(8, "Phone number must be at least 8 digits")
    .max(15, "Phone number cannot be more than 15 digits")
    .matches(/^\d+$/, "Phone number can only contain digits")
    .required("Telephone number is required"),
});

const stepFourSchema = yup.object().shape({
  amenities: yup
    .array()
    .min(1, "At least one amenity is required")
    .required("Amenities are required"),
  title: yup.string().min(10).max(50).required(),
  description: yup.string().min(50).max(500).required(),
});

export {
  stepOneSchema,
  stepTwoHobbiesSchema,
  stepTwoNewFlatmateSchema,
  stepTwoPersonalInformationSchema,
  stepThreeSchema,
  stepFourSchema,
};
