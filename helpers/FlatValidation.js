import * as yup from "yup";

const maxFiles = 9;
const supportedFormats = ["image/jpeg", "image/png", "image/jpg"];

const stepOneSchema = yup.object().shape({
  address_1: yup.string().max(30).required("Address is required"),
  city: yup.string().max(40).required("City is required"),
  post_code: yup
    .string()
    .max(7, "Post code must have maximum six characters")
    .required("Post Code is required"),
  minutes: yup.string().required("Minutes is required"),
  mode: yup.string().required("Mode is required"),
  station: yup.string().required("Station is required"),
});

const stepTwoSchema = yup.object().shape({
  size: yup.string().required("Size is required"),
  furnished: yup.string().required("Furnishing is required"),
  type: yup.string().required("Type is required"),
  what_i_am: yup.string().required("Who i am is required"),
  cost: yup
    .number()
    .typeError("Room cost doesn't look like a number")
    .required("Cost of the room is required"),
  deposit: yup
    .number()
    .typeError("Room deposit doesn't look like a number")
    .required("Deposit of the room is required"),
});
const stepThreeSchema = yup.object().shape({
  amenities: yup
    .array()
    .min(1, "At least one amenity is required")
    .required("Amenities are required"),
  available_from: yup
    .date()
    .typeError("Available from must be a date")
    .min(new Date(), "Available from date must be in the future")
    .required("Available from date is required"),
  // furnished: yup.string().required("Room furnished is required"),
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
});

const stepFourSchema = yup.object().shape({
  first_name: yup.string().max(20).required("First name is required"),
  last_name: yup.string().max(20).required("Last name is required"),
  telephone: yup
    .string()
    .min(8, "Phone number must be at least 8 digits")
    .max(15, "Phone number cannot be more than 15 digits")
    .matches(/^\d+$/, "Phone number can only contain digits")
    .required("Telephone number is required"),
});

const stepFiveSchema = yup.object().shape({
  new_flatmate_min_age: yup
    .number()
    .typeError("That doesn't look like an age")
    .min(18, "Your new flatmate should be more than 18 years old")
    .required("Min Age is required"),
  new_flatmate_max_age: yup
    .number()
    .typeError("That doesn't look like an age")
    .min(18, "Your new flatmate should be more than 18 years old")
    .required("Max Age is required")
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

const stepSixSchema = yup.object().shape({
  title: yup.string().min(10).max(50).required(),
  description: yup.string().min(50).max(500).required(),
  // photos: yup
  //   .array()
  //   .max(maxFiles, `You can upload up to ${maxFiles} images`)
  //   .of(
  //     yup
  //       .mixed()
  //       .test("fileFormat", "Unsupported file format", (value) =>
  //         supportedFormats.includes(value.type)
  //       )
  //       .test("fileSize", "File size is too large", (value) =>
  //         value ? value.size <= 1048576 : true
  //       )
  //   ),
});

export {
  stepOneSchema,
  stepTwoSchema,
  stepThreeSchema,
  stepFourSchema,
  stepFiveSchema,
  stepSixSchema,
};
