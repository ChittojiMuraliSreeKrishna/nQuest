import { createStackNavigator } from "@react-navigation/stack";
import React, { Component } from "react";
import { BackHandler } from "react-native";
import AddStore from "../components/Accounting/AddStore";
import Stores from '../components/Accounting/Stores';
import Blank from '../components/Home/Blank';
import AddUser from "../components/URM/AddUser";
import CreateRole from "../components/URM/CreateRole";
import EditRole from "../components/URM/EditRole";
import EditUser from "../components/URM/EditUser";
import Privilages from "../components/URM/Privilages";
import Roles from "../components/URM/Roles";
import Users from "../components/URM/users";

const Stack = createStackNavigator();
export default class UrmNavigation extends Component {

  componentDidMount() {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", this.backAction());
    return () => backHandler.remove();
  }

  backAction() {
    return true;
  }

  render() {
    return (
      <>
        <Stack.Navigator initialRouteName="Blank">
          <Stack.Screen
            name="Blank"
            options={{ headerShown: false }}
            component={Blank}
          />
          <Stack.Screen
            name="Users"
            options={{ headerShown: false }}
            component={Users}
          />
          <Stack.Screen
            name="Stores"
            options={{ headerShown: false }}
            component={Stores}
          />
          <Stack.Screen
            name="Roles"
            options={{ headerShown: false }}
            component={Roles}
          />
        </Stack.Navigator>
      </>
    );
  }
}
2;
