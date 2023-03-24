import { createStackNavigator } from "@react-navigation/stack";
import React, { Component } from "react";
import { BackHandler } from "react-native";
import Blank from '../components/Home/Blank';
import AddBarcode from "../components/Inventory/AddBarcode";
import AddItemList from "../components/Inventory/AddItemList";
import AddProductCombo from "../components/Inventory/AddProductCombo";
import Barcode from "../components/Inventory/Barcode";
import EditBarcode from "../components/Inventory/EditBarcode";
import GoodsTransfer from "../components/Inventory/GoodsTransfer";
import ItemList from "../components/Inventory/ItemList";
import OrderShipment from "../components/Inventory/OrderShipment";
import ProductCombo from "../components/Inventory/ProductCombo";
import ReBarcode from "../components/Inventory/ReBarcode";
import RecieveOrder from "../components/Inventory/RecieveOrder";
import TableManageMent from "../components/Inventory/TableManageMent";
import ScanBarCode from "../components/Newsale/ScanBarCode";
import RoomManagement from "../components/Inventory/RoomManagement";
const Stack = createStackNavigator();
export default class InventoryNavigation extends Component {

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
            name="Receive Order"
            options={{ headerShown: false }}
            component={RecieveOrder}
          />
          <Stack.Screen
            name="Goods Transfer"
            options={{ headerShown: false }}
            component={GoodsTransfer}
          />
          <Stack.Screen
            name="Order Shipment"
            options={{ headerShown: false }}
            component={OrderShipment}
          />
          <Stack.Screen
            name="Item List"
            options={{ headerShown: false }}
            component={ItemList}
          />
          <Stack.Screen
            name="ScanBarCode"
            options={{ headerShown: false }}
            component={ScanBarCode}
          />
          <Stack.Screen
            name="Table Management"
            options={{ headerShown: false }}
            component={TableManageMent}
          />
          <Stack.Screen
            name="Room Management"
            options={{ headerShown: false }}
            component={RoomManagement}
          />
        </Stack.Navigator>
      </>
    );
  }
}
