import { View, Text, Dimensions, Animated, StyleSheet } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { PanGestureHandler } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const BottomSheet = ({ show, onDismiss, children, text }) => {
  const [open, setOpen] = useState(show);
  const bottomSheetHeight = Dimensions.get("window").height * 0.325;
  const bottom = useRef(new Animated.Value(-bottomSheetHeight)).current;
  useEffect(() => {
    if (show) {
      setOpen(show);
      Animated.timing(bottom, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(bottom, {
        toValue: -bottomSheetHeight,
        duration: 500,
        useNativeDriver: false,
      }).start(() => {
        setOpen(false);
      });
    }
  }, [show]);

  const onGesture = (event) => {
    if (event.nativeEvent.translationY > 0) {
      bottom.setValue(-event.nativeEvent.translationY);
    }
  };
  const onGestureEnd = (event) => {
    if (event.nativeEvent.translationY > bottomSheetHeight / 2) {
      onDismiss();
    } else {
      bottom.setValue(0);
    }
  };

  if (!open) {
    return null;
  }
  return (
    <Animated.View
      className="absolute left-0 right-0 bg-white rounded-t-[16px]"
      style={[styles.container, { height: bottomSheetHeight, bottom: bottom }]}
    >
      <PanGestureHandler onGestureEvent={onGesture} onEnded={onGestureEnd}>
        <View className="flex-row items-center justify-center p-4">
          <View className="absolute mt-2 w-[60px] h-[3px] top-0 z-10 bg-slate-300 rounded-lg" />
          <Text className="text-lg font-semibold">{text}</Text>
          <MaterialCommunityIcons
            onPress={onDismiss}
            style={{ position: "absolute", left: 10, alignSelf: "center" }}
            name="close"
            color={"black"}
            size={26}
          />
        </View>
      </PanGestureHandler>
      {children}
    </Animated.View>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
  container: {
    zIndex: 100,
    shadowColor: "#000",
    shadowOffset: {
      height: -3,
      width: 0,
    },
    shadowOpacity: 0.24,
    shadowRadius: 4,
    elevation: 3,
  },
});
