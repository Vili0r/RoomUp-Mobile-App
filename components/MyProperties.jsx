import { View, FlatList, ActivityIndicator } from "react-native";
import React from "react";
import MyPropertiesCard from "./MyPropertiesCard";

const MyProperties = ({ properties, isLoading }) => {
  return (
    <View className="flex-1 px-4">
      <View className="bg-white">
        {isLoading ? (
          <ActivityIndicator className="mt-2" size="large" color="gray" />
        ) : (
          <FlatList
            data={properties.properties.data}
            renderItem={(props) => <MyPropertiesCard {...props} />}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};

export default MyProperties;
