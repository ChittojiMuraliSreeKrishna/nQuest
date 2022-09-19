import { createStackNavigator } from "@react-navigation/stack";
import React, { Component } from "react";
import Blank from "../components/Home/Blank";
import Home from "../components/Home/Home";
import Settings from "../components/Profile/Settings";
import AccountingNaviagtion from "./AccountingNavigation";
import CustomerNavigation from "./CustomerNavigation";
import InventoryNavigation from "./InventoryNavigation";
import NewSaleNavigation from "./NewSaleNavigation";
import PromoNavigation from "./PromoNavigation";
import ReportsNavigation from "./ReportsNavigation";
import TopBar from "./TopBar";
import UrmNavigation from "./UrmNavigation";

const Stack = createStackNavigator();

export default class TopBarNavigation extends Component {
  render () {
    return (
      <>
        <TopBar {...this.props} />
        <Stack.Navigator>
          <Stack.Screen
            name="Blank"
            options={{ headerShown: false }}
            component={Blank}
          />
          <Stack.Screen
            name="Home"
            options={{ headerShown: false }}
            component={Home}
          />
          <Stack.Screen
            name="PromoNavigation"
            options={{ headerShown: false }}
            component={PromoNavigation}
          />
          <Stack.Screen
            name="InventoryNavigation"
            options={{ headerShown: false }}
            component={InventoryNavigation}
          />
          <Stack.Screen
            name="UrmNavigation"
            options={{ headerShown: false }}
            component={UrmNavigation}
          />
          <Stack.Screen
            name="ReportsNavigation"
            options={{ headerShown: false }}
            component={ReportsNavigation}
          />
          <Stack.Screen
            name="AccountingNaviagtion"
            options={{ headerShown: false }}
            component={AccountingNaviagtion}
          />
          <Stack.Screen
            name="CustomerNavigation"
            options={{ headerShown: false }}
            component={CustomerNavigation}
          />
          <Stack.Screen
            name="NewSaleNavigation"
            options={{ headerShown: false }}
            component={NewSaleNavigation}
          />
          <Stack.Screen
            name="Settings"
            options={{ headerShown: false }}
            component={Settings}
          />
        </Stack.Navigator>
      </>
    );
  }
}
