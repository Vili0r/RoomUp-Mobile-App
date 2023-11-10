import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import React, { useContext, useLayoutEffect, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import axiosConfig from "../helpers/axiosConfig";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { ChatDetails } from "../components";
import {
  PUSHER_APP_KEY,
  PUSHER_APP_CLUSTER,
  PUSHER_HOST,
  PUSHER_PORT,
} from "@env";
import Echo from "laravel-echo";
import socketio from "socket.io-client";

const echo = new Echo({
  broadcaster: "socket.io",
  client: socketio,
  key: PUSHER_APP_KEY,
  cluster: PUSHER_APP_CLUSTER ?? "mt1",
  wsHost: PUSHER_HOST,
  wsPort: PUSHER_PORT,
  wssPort: PUSHER_PORT,
  forceTLS: false,
  encrypted: true,
  disableStats: true,
  enabledTransports: ["ws", "wss"],
});

const ChatScreen = ({ route }) => {
  const { id, title } = route.params;
  const { user } = useContext(AuthContext);
  const [body, setBody] = useState("");
  const [serverError, setServerError] = useState(null);
  const [replies, setReplies] = useState([]);
  const [singleConversation, setSingleConversation] = useState([]);
  const navigation = useNavigation();

  const fetchSingleConversation = async () => {
    const response = await axiosConfig.get(`/conversation/${id}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    const responseData = response.data;
    if (responseData.singleConversation.replies) {
      setReplies(responseData.singleConversation.replies);
    }
    setSingleConversation(responseData.singleConversation);
    return responseData;
  };

  //Use useQuery to fetch user data with the token
  const { isLoading, error, data } = useQuery(
    ["getSingleConversation"],
    fetchSingleConversation
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: false,
      headerTitle: title,
      headerTintColor: "black",
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-[40px] h-[40px] rounded-[20px] bg-white justify-center items-center"
        >
          <Ionicons name="arrow-back" size={24} color="#F1C40F" />
        </TouchableOpacity>
      ),
    });
  }, []);

  const handleSendMessage = async () => {
    if (singleConversation != null) {
      echo.leave(`conversation.${id}`);
    }
    await axiosConfig
      .post(
        `/conversation/${id}/reply`,
        {
          body,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((res) => {
        setServerError(null);
        setBody("");
        add();
      })
      .catch((error) => {
        setServerError(error.response.data.message);
        const key = Object.keys(error.response.data.errors)[0];
        setServerError(error.response.data.errors[key][0]);
      });
  };
  const add = () => {
    if (singleConversation != null) {
      echo
        .private(`conversation.${id}`)
        .listen("ConversationReplyCreated", (e) => {
          console.log(e);
          setReplies((prevReplies) => [e, ...prevReplies]);
        });
    }
  };

  return (
    <>
      <KeyboardAwareScrollView
        bounces={false}
        style={{ flexGrow: 1, backgroundColor: "white" }} //style changed to contentContainerStyle
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 bg-white">
          {isLoading ? (
            <ActivityIndicator className="mt-2" size="large" color="gray" />
          ) : (
            <ChatDetails
              conversation={data.singleConversation}
              replies={replies}
            />
          )}
        </View>
      </KeyboardAwareScrollView>
      <View className="absolute bottom-0 flex flex-row items-center justify-between h-16 pr-3 bg-white left-5 mb-7 rounded-xl">
        <TextInput
          className="flex w-[80%] h-10 pl-4 border rounded-xl"
          onChangeText={setBody}
          value={body}
          placeholder="Type your message..."
          placeholderTextColor="gray"
          autoCapitalize="none"
        />

        <TouchableOpacity
          onPress={handleSendMessage}
          className="flex items-center justify-center flex-shrink-0 px-4 py-2 text-white bg-black hover:bg-gray-800 rounded-xl"
        >
          <Ionicons name="paper-plane-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default ChatScreen;
