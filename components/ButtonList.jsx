import { Pressable, View, Text } from "react-native";

export const ButtonList = ({ data, header }) => {
  const getListHeaderComponent = () => {
    if (!header) return null;

    return (
      <View className="mt-7">
        <Text className="text-xl font-semibold text-gray-800">{header}</Text>
      </View>
    );
  };

  return (
    <View className="px-4 mt-2">
      {getListHeaderComponent()}
      {data.map((item, index) => (
        <>
          <Pressable
            className="flex-row items-center justify-start mt-4 space-x-4"
            key={item.label}
            onPress={item.onPress}
          >
            {item.icon}
            <Text className="text-lg font-normal text-gray-600">
              {item.label}
            </Text>
          </Pressable>
          <View className="mt-3 border-b-2 border-b-gray-100"></View>
        </>
      ))}
    </View>
  );
};
