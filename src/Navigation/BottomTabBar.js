import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { Component } from "react";
import { Dimensions } from "react-native";
import HomeIcon from "react-native-vector-icons/Entypo";
import ProfileIcon from "react-native-vector-icons/Feather";
import Settings from "../components/Profile/Settings";
import TopBarNavigation from "./TopBarNavigation";

const Tab = createBottomTabNavigator();
const SCREEN_HEIGHT = Dimensions.get("window").height;

class BottomTabBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      clientId: null
    }
  }
  async componentDidMount() {
    await AsyncStorage.getItem("custom:clientId").then((value) => {
      this.setState({ clientId: value })
    })
    await AsyncStorage.getItem("roleType").then((value) => {
      if (value === "client_support") {
        if (this.state.clientId === 0 || this.state.clientId === null || this.state.clientId === undefined) {
          // this.props.navigation.navigate('SelectClient')
          // alert("Please Select the client")
        }
      }
    });
  }
  render() {
    return (
      <Tab.Navigator
        initialRouteName="Home"
        firstRouteName="Home"
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
          name="Home"
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
          name="Profile"
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
