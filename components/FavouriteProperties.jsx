import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useState } from "react";
import FavouritePropertyCard from "./FavouritePropertyCard";

const FavouriteProperties = ({ properties, isLoading, refetch }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const handleRefresh = () => {
    setIsRefreshing(true);
    refetch(["savedProperties"]);
    setIsRefreshing(false);
  };
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
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
              />
            }
          />
        )}
      </View>
    </View>
  );
};

export default FavouriteProperties;
