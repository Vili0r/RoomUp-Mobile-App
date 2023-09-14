import { View, FlatList, ActivityIndicator } from "react-native";
import React from "react";
import FavouritePropertyCard from "./FavouritePropertyCard";

const ViewedProperties = ({ properties, isLoading }) => {
  return (
    <View className="flex-1 p-4" style={{ paddingTop: 20 }}>
      <View className="bg-white">
        {isLoading ? (
          <ActivityIndicator className="mt-2" size="large" color="gray" />
        ) : (
          <FlatList
            data={properties}
            renderItem={(props) => <FavouritePropertyCard {...props} />}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};

export default ViewedProperties;
