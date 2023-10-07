import React, { useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { View, Text, ActivityIndicator } from "react-native";
import { AuthContext } from "../context/AuthProvider";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import SearchScreen from "../screens/SearchScreen";
import AccountScreen from "../screens/AccountScreen";
import SavedScreen from "../screens/SavedScreen";
import HistoryScreen from "../screens/HistoryScreen";
import MessageScreen from "../screens/MessageScreen";
import PropertyDetailsScreen from "../screens/PropertyDetailsScreen";
import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import ForgotPasswordScreen from "../screens/Auth/ForgotPasswordScreen";
import UpdatePasswordScreen from "../screens/Auth/UpdatePasswordScreen";
import AccountSettingsScreen from "../screens/AccountSettingsScreen";
import AdvancedFilterScreen from "../screens/AdvancedFilterScreen";
import MyPropertiesScreen from "../screens/MyPropertiesScreen";
import AddRoomScreen from "../screens/AddRoomScreen";
import AddRoommateScreen from "../screens/AddRoommateScreen";
import MessageAdvertiserScreen from "../screens/MessageAdvertiserScreen";
import IncomingMessagesScreen from "../screens/IncomingMessagesScreen";
import ChatScreen from "../screens/ChatScreen";
import AddressStepOneScreen from "../screens/Flat/AddressStepOneScreen";
import PropertyStepTwoScreen from "../screens/Flat/PropertyStepTwoScreen";
import DetailsStepThreeScreen from "../screens/Flat/DetailsStepThreeScreen";
import AdvertiserStepFourScreen from "../screens/Flat/AdvertiserStepFourScreen";
import FlatmateStepFiveScreen from "../screens/Flat/FlatmateStepFiveScreen";
import ConfirmStepSixScreen from "../screens/Flat/ConfirmStepSixScreen";
import { FlatContextProvider } from "../context/FlatContext";

export default Navigation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { setUser } = useContext(AuthContext);

  useEffect(() => {
    //check if user is logged in
    //Check securestore for the user object/token
    SecureStore.getItemAsync("user")
      .then((userString) => {
        if (userString) {
          setUser(JSON.parse(userString));
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="gray" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen
          name="Login Screen"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register Screen"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Update Password Screen"
          component={UpdatePasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Forgot Password Screen"
          component={ForgotPasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Property Details Screen"
          component={PropertyDetailsScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Advanced Filter Screen"
          component={AdvancedFilterScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Message Advertiser Screen"
          component={MessageAdvertiserScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Incoming Messages Screen"
          component={IncomingMessagesScreen}
          options={{ headerShown: false }}
        />
      </Stack.Group>
      <Stack.Screen
        name="Account Settings Screen"
        component={AccountSettingsScreen}
        options={{ headerShown: true, title: "Change Personal Information" }}
      />
      <Stack.Screen
        name="My Properties Screen"
        component={MyPropertiesScreen}
        options={{ headerShown: true, title: "My Property Listings" }}
      />
      <Stack.Screen
        name="AddPropertyRoot"
        component={AddPropertStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Add Room Screen"
        component={AddRoomScreen}
        options={{ headerShown: true, title: "Add a Room Listing" }}
      />
      <Stack.Screen
        name="Add Roommate Screen"
        component={AddRoommateScreen}
        options={{ headerShown: true, title: "Add a Roommate Listing" }}
      />
      <Stack.Screen
        name="Chat Screen"
        component={ChatScreen}
        options={{ headerShown: true }}
      />
    </Stack.Navigator>
  );
};

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator initialRouteName="Search">
      <Tab.Screen
        name="Search Screen"
        component={SearchScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Search",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="search1" size={size} color={color} />
          ),
          tabBarLabelStyle: {
            fontSize: 12,
          },
        }}
      />
      <Tab.Screen
        name="Saved Screen"
        component={SavedScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Saved",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="heart-o" size={size} color={color} />
          ),
          tabBarLabelStyle: {
            fontSize: 12,
          },
        }}
      />
      <Tab.Screen
        name="History Screen"
        component={HistoryScreen}
        options={{
          headerShown: false,
          tabBarLabel: "History",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="history" size={size} color={color} />
          ),
          tabBarLabelStyle: {
            fontSize: 12,
          },
        }}
      />
      <Tab.Screen
        name="Message Screen"
        component={MessageScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Inbox",
          tabBarIcon: ({ color, size }) => (
            <Feather name="message-square" size={size} color={color} />
          ),
          tabBarLabelStyle: {
            fontSize: 12,
          },
        }}
      />
      <Tab.Screen
        name="Account Screen"
        component={AccountScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Account",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="user" size={size} color={color} />
          ),
          tabBarLabelStyle: {
            fontSize: 12,
          },
        }}
      />
    </Tab.Navigator>
  );
};

const AddPropertySatckNavigator = createNativeStackNavigator();

const AddPropertStack = () => {
  return (
    <FlatContextProvider>
      <AddPropertySatckNavigator.Navigator initialRouteName="Address">
        <AddPropertySatckNavigator.Screen
          name="Adrress"
          component={AddressStepOneScreen}
        />
        <AddPropertySatckNavigator.Screen
          name="Property"
          component={PropertyStepTwoScreen}
          options={{
            headerTitle: "Property info",
          }}
        />
        <AddPropertySatckNavigator.Screen
          name="Details"
          component={DetailsStepThreeScreen}
          options={{ headerTitle: "Property details" }}
        />
        <AddPropertySatckNavigator.Screen
          name="Advertiser"
          component={AdvertiserStepFourScreen}
          options={{
            headerTitle: "Advertiser info",
          }}
        />
        <AddPropertySatckNavigator.Screen
          name="Flatmate"
          component={FlatmateStepFiveScreen}
          options={{
            headerTitle: "Prefernce for new tenant",
          }}
        />
        <AddPropertySatckNavigator.Screen
          name="Confirm"
          component={ConfirmStepSixScreen}
          options={{
            headerTitle: "Confirm",
          }}
        />
      </AddPropertySatckNavigator.Navigator>
    </FlatContextProvider>
  );
};
