import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import React, { Component } from "react";
import { Dimensions } from "react-native";
import HomeIcon from "react-native-vector-icons/Entypo";
import ProfileIcon from "react-native-vector-icons/Feather";
import Settings from "../components/Profile/Settings";
import TopBarNavigation from "./TopBarNavigation";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const SCREEN_HEIGHT = Dimensions.get("window").height;

class BottomTabBar extends Component {
  render() {
    return (
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          keyboardHidesTabBar: true,
          labelStyle: {
            fontSize: 12,
          },
          style: {
            backgroundColor: "#fff",
            color: "#dddddd",
            height:
              Platform.OS === "android"
                ? SCREEN_HEIGHT / 11
                : SCREEN_HEIGHT / 9,
            borderTopWidth: 2,
          },
          indicatorStyle: {
            width: 20,
            color: "red",
            backgroundColor: "blue",
            borderTopColor: "red",
          },
          tabStyle: {
            alignItem: "center",
            paddingBottom: 5,
          },
          tabBarActiveTintColor: "#ED1C24",
          tabBarInactiveTintColor: "#353C40",
        }}
      >
        <Tab.Screen
          name="HOME"
          title="Home"
          options={{
            headerShown: false,
            tabBarLabel: "Home",
            tabBarIcon: ({ color, size }) => (
              <HomeIcon name="home" color={color} size={size} />
            ),
          }}
          component={TopBarNavigation}
        />

        <Tab.Screen
          name="PROFILE"
          options={{
            headerShown: false,
            tabBarLabel: "Profile",
            tabBarIcon: ({ color, size }) => (
              <ProfileIcon name="user" color={color} size={size} />
            ),
          }}
          component={Settings}
        />
      </Tab.Navigator>
    );
  }
}

export default BottomTabBar;
