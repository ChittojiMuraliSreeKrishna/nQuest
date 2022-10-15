import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import ForgotPassword from "../components/Login/ForgotPassword";
import Login from "../components/Login/Login";
import SelectClient from "../components/Login/SelectClient";
import SelectStore from "../components/Login/SelectStore";
import UpdateNewpassword from "../components/Login/UpdateNewpassword";
import Settings from "../components/Profile/Settings";
import ManagePassword from "../components/URM/ManagePassword";
import RegisterClient from "../components/URM/RegisterClient";
import LoginAfterLanguageSelect from "../components/Welcome/LoginAfterLanguageSelect";
import InventoryNavigation from "./InventoryNavigation";
import TopBarNavigation from "./TopBarNavigation";

const Stack = createStackNavigator();
export default class HomeNavigation extends React.Component {
  componentDidMount () {
    this.props.navigation.push("TopBarNavigation");
  }
  render () {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="TopBarNavigation"
          options={{ headerShown: false, gestureEnabled: false, }}
          component={TopBarNavigation}
        />
        <Stack.Screen
          name="Login"
          options={{ headerShown: false, gestureEnabled: false }}
          component={Login}
        />
        <Stack.Screen
          name="Inventory"
          options={{ headerShown: false, gestureEnabled: false }}
          component={InventoryNavigation}
        />
        <Stack.Screen
          name="LoginAfterLanguageSelect"
          options={{ headerShown: false }}
          component={LoginAfterLanguageSelect}
        />
        <Stack.Screen
          name="SelectStore"
          options={{ headerShown: false }}
          component={SelectStore}
        />
        <Stack.Screen
          name="ForgotPassword"
          options={{ headerShown: false }}
          component={ForgotPassword}
        />
        <Stack.Screen
          name="RegisterClient"
          options={{ headerShown: false }}
          component={RegisterClient}
        />
        <Stack.Screen
          name="UpdateNewpassword"
          options={{ headerShown: false }}
          component={UpdateNewpassword}
        />
        <Stack.Screen
          name="ManagePassword"
          options={{ headerShown: false }}
          component={ManagePassword}
        />
        <Stack.Screen name="SelectClient" options={{ headerShown: false }} component={SelectClient} />
        <Stack.Screen
          name="Settings"
          options={{ headerShown: false }}
          component={Settings}
        />
      </Stack.Navigator>
    );
  }
}
