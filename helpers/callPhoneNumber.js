import * as Linking from "expo-linking";

export const callPhoneNumber = (phoneNumber) => {
  Linking.openURL(`tel:${phoneNumber}`);
};
