import React from "react";
import { Text, View, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

function HomeScreen({ navigation }) {
  return (
    <View className="items-center justify-center flex-1 bg-white">
      <Text>Roomup!</Text>
      <Button
        title="Go to Details"
        onPress={() =>
          navigation.navigate("Details", {
            itemId: 86,
            otherParam: "anything you want here",
          })
        }
      />
    </View>
  );
}
function BookmarkScreen({ route, navigation }) {
  // const { itemId, otherParam } = route.params;
  return (
    <View className="items-center justify-center flex-1 bg-white">
      <Text>Bookmark!</Text>

      <Button title="Go to Home" onPress={() => navigation.navigate("Home")} />
    </View>
  );
}
function HistoryScreen({ route, navigation }) {
  // const { itemId, otherParam } = route.params;
  return (
    <View className="items-center justify-center flex-1 bg-white">
      <Text>History!</Text>

      <Button title="Go to Home" onPress={() => navigation.navigate("Home")} />
    </View>
  );
}
function MessageScreen({ route, navigation }) {
  // const { itemId, otherParam } = route.params;
  return (
    <View className="items-center justify-center flex-1 bg-white">
      <Text>Messages!</Text>

      <Button title="Go to Home" onPress={() => navigation.navigate("Home")} />
    </View>
  );
}
function ProfileScreen({ route, navigation }) {
  // const { itemId, otherParam } = route.params;
  return (
    <View className="items-center justify-center flex-1 bg-white">
      <Text>Profile!</Text>

      <Button title="Go to Home" onPress={() => navigation.navigate("Home")} />
    </View>
  );
}

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: "Search",
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="search1" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Bookmark"
          component={BookmarkScreen}
          options={{
            tabBarLabel: "Bookmark",
            tabBarIcon: ({ color, size }) => (
              <Feather name="bookmark" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="History"
          component={HistoryScreen}
          options={{
            tabBarLabel: "History",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="history" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Message"
          component={MessageScreen}
          options={{
            tabBarLabel: "Message",
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="message1" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: "Profile",
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="user" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
// export default function App() {
//   return (
//     <NavigationContainer>
//     <Stack.Navigator>
//       <Stack.Screen name="Home" component={HomeScreen} />
//       <Stack.Screen name="Details" component={DetailsScreen} />
//     </Stack.Navigator>
//   </NavigationContainer>
//   );
// }
// export default function App() {
//   return (
//     <NavigationContainer>
//       <Drawer.Navigator initialRouteName="Home">
//         <Drawer.Screen name="Home" component={HomeScreen} />
//         <Drawer.Screen name="Notifications" component={BookmarkScreen} />
//       </Drawer.Navigator>
//     </NavigationContainer>
//   );
// }
