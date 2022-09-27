import { createStackNavigator } from "@react-navigation/stack";
import React, { Component } from "react";
import { BackHandler } from "react-native";
import Blank from '../components/Home/Blank';
import AddBarcode from "../components/Inventory/AddBarcode";
import AddProductCombo from "../components/Inventory/AddProductCombo";
import Barcode from "../components/Inventory/Barcode";
import EditBarcode from "../components/Inventory/EditBarcode";
import ProductCombo from "../components/Inventory/ProductCombo";
import ReBarcode from "../components/Inventory/ReBarcode";
import ViewReBarcode from "../components/Inventory/ViewReBarcode";
const Stack = createStackNavigator();
export default class InventoryNavigation extends Component {

  componentDidMount () {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", this.backAction());
    return () => backHandler.remove();
  }

  backAction () {
    return true;
  }

  render () {
    return (
      <>
        <Stack.Navigator>
          <Stack.Screen
            name="Blank"
            options={{ headerShown: false }}
            component={Blank}
          />
          <Stack.Screen
            name="Barcode List"
            options={{ headerShown: false }}
            component={Barcode}
          />
          <Stack.Screen
            name="Re-Barcode List"
            options={{ headerShown: false }}
            component={ReBarcode}
          />
          <Stack.Screen
            name="Product Combo"
            options={{ headerShown: false }}
            component={ProductCombo}
          />
          <Stack.Screen
            name="AddBarcode"
            options={{ headerShown: false }}
            component={AddBarcode}
          />
          <Stack.Screen
            name="EditBarcode"
            options={{ headerShown: false }}
            component={EditBarcode}
          />
          <Stack.Screen
            name="ViewReBarcode"
            options={{ headerShown: false }}
            component={ViewReBarcode}
          />
          <Stack.Screen
            name="AddProduct"
            options={{ headerShown: false }}
            component={AddProductCombo}
          />
        </Stack.Navigator>
      </>
    );
  }
}
