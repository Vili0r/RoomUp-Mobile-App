import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";
import Feather from "@expo/vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading } = useContext(AuthContext);

  return (
    <View className="flex-1 bg-white" style={{ backgroundColor: "#877dfa" }}>
      <Text>This is the register screen</Text>
    </View>
  );
};

export default RegisterScreen;
