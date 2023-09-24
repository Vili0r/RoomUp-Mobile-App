import { View, Platform, ActivityIndicator } from "react-native";
import React, { useContext, useMemo } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AuthContext } from "../context/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import axiosConfig from "../helpers/axiosConfig";
import { MessageForm, ModalHeader } from "../components";

const MessageAdvertiserScreen = ({ route }) => {
  const { id, type } = route.params;
  const { user } = useContext(AuthContext);

  const fetchCreateMessageProperty = async () => {
    const queryParams = {
      id,
      type,
    };
    const queryString = new URLSearchParams(queryParams).toString();
    const response = await axiosConfig.get(`/message/create?${queryString}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    return response.data;
  };

  //Use useQuery to fetch user data with the token
  const { isLoading, error, data } = useQuery(
    ["createMessageProperty"],
    fetchCreateMessageProperty
  );

  const name = useMemo(() => {
    return data?.advertiser !== null ? data?.advertiser.first_name : null;
  }, [data]);

  return (
    <KeyboardAwareScrollView
      bounces={false}
      style={{ flexGrow: 1, backgroundColor: "white" }} //style changed to contentContainerStyle
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 bg-white">
        {Platform.OS === "ios" ? (
          <ModalHeader
            text={`Sent a message to ${name}`}
            xShown
            style={{ borderBottom: "2px solid #2a2a2c" }}
          />
        ) : null}
        {isLoading ? (
          <ActivityIndicator className="mt-2" size="large" color="gray" />
        ) : (
          <MessageForm property={data} />
        )}
      </View>
    </KeyboardAwareScrollView>
  );
};

export default MessageAdvertiserScreen;
