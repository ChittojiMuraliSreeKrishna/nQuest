import AsyncStorage from "@react-native-async-storage/async-storage";
import { createStackNavigator } from "@react-navigation/stack";
import React, { Component } from "react";
import Blank from "../components/Home/Blank";
import Home from "../components/Home/Home";
import AccountingNaviagtion from "./AccountingNavigation";
import CustomerNavigation from "./CustomerNavigation";
import InventoryNavigation from "./InventoryNavigation";
import KitchenNavigation from "./KitchenNavigation";
import MenuNavigation from "./MenuNavigation";
import NewSaleNavigation from "./NewSaleNavigation";
import PromoNavigation from "./PromoNavigation";
import ReportsNavigation from "./ReportsNavigation";
import { TicketingNavigation } from "./TicketingNavigation";
import TopBar from "./TopBar";
import UrmNavigation from "./UrmNavigation";

const Stack = createStackNavigator();

export default class TopBarNavigation extends Component {

  constructor(props) {
    super(props)
    this.state = {
      showTable: false
    }
  }

  componentDidMount() {
    AsyncStorage.setItem("Home", "isLogged");
  }


  updateTable = () => {
    this.setState({ showTable: true }, () => {
    })
  }

  render() {
    return (
      <>
        <TopBar {...this.props}
          updateTable={this.updateTable}
        />
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
            name="TicketingNavigation"
            options={{ headerShown: false }}
            component={TicketingNavigation}
          />
          <Stack.Screen
            name="KitchenNavigation"
            options={{ headerShown: false }}
            component={KitchenNavigation}
          />

          <Stack.Screen
            name="MenuNavigation"
            options={{ headerShown: false }}
            component={MenuNavigation}
            showTable={this.state.showTable}
          />
        </Stack.Navigator>
      </>
    );
  }
}
