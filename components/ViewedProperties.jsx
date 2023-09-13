import { View, FlatList, ActivityIndicator } from "react-native";
import React from "react";
import SavedPropertyCard from "./SavedPropertyCard";

const ViewedProperties = ({ properties, isLoading }) => {
  return (
    <View className="flex-1 p-4" style={{ paddingTop: 70 }}>
      <View className="bg-white">
        {isLoading ? (
          <ActivityIndicator className="mt-2" size="large" color="gray" />
        ) : (
          <FlatList
            data={properties}
            renderItem={(props) => <SavedPropertyCard {...props} />}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};

export default ViewedProperties;
