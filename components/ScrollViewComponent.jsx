import React from "react";
import { FlatList } from "react-native";

const ScrollViewComponent = (props) => {
  return (
    <FlatList
      {...props}
      data={[]}
      keyExtractor={(_e, i) => "dom" + i.toString()}
      ListEmptyComponent={null}
      renderItem={null}
      ListHeaderComponent={() => <>{props.children}</>}
    />
  );
};

export default ScrollViewComponent;
