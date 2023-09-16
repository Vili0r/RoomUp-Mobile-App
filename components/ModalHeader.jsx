import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

const ModalHeader = ({ xShown, text, onPress }) => {
  const navigation = useNavigation();

  if (text) {
    return (
      <View className="flex-row items-center justify-center p-4 border-b-2 border-b-[#7d72f2]">
        {xShown ? (
          <MaterialCommunityIcons
            onPress={onPress ? onPress : navigation.goBack}
            style={{ position: "absolute", left: 10, alignSelf: "center" }}
            name="close"
            color={"black"}
            size={26}
          />
        ) : null}
        <Text className="text-lg font-semibold">{text}</Text>
      </View>
    );
  }

  return (
    <View className="flex-row items-center justify-center p-4 border-b-1 border-b-gray-200">
      <View className="w-[50px] bg-gray-100 h-[4px] border-[30px]" />
    </View>
  );
};

export default ModalHeader;
