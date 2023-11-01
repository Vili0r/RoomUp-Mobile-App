import * as yup from "yup";

const editRoomSchema = yup.object().shape({
  available_from: yup
    .date()
    .typeError("Available from must be a date")
    .min(new Date(), "Available from date must be in the future")
    .required("Available from date is required"),
  room_cost: yup
    .number()
    .typeError("Room cost doesn't look like a number")
    .required("Cost of the room is required"),
  room_deposit: yup
    .number()
    .typeError("Room deposit doesn't look like a number")
    .required("Deposit of the room is required"),
  room_size: yup.string().required("Size of the room is required"),
  room_furnished: yup.string().required("Room furnished is required"),
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
  sub_title: yup
    .string()
    .min(10, "Title must be at least 10 characters")
    .max(25, "Title must be at least 25 characters")
    .required("Title is required"),
  sub_description: yup
    .string()
    .min(50, "Description must be at least 50 characters")
    .max(250, "Description must be at least 250 characters")
    .required("Description is required"),
});

export { editRoomSchema };
