import { View, FlatList, ActivityIndicator } from "react-native";
import React from "react";
import MyRoommateCard from "./MyRoommateCard";

const MyRoommateListings = ({ listings, isLoading }) => {
  return (
    <View className="flex-1 px-4">
      <View className="bg-white">
        {isLoading ? (
          <ActivityIndicator className="mt-2" size="large" color="gray" />
        ) : (
          <FlatList
            data={listings}
            renderItem={(props) => <MyRoommateCard {...props} />}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};

export default MyRoommateListings;
