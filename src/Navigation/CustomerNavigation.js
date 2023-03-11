import React, { Component } from "react";
import { BackHandler } from "react-native";
import AddCustomer from '../components/CustomerPortal/AddCustomer';
import DayClosure from '../components/CustomerPortal/DayClosure';
import GenerateEstimationSlip from "../components/CustomerPortal/GenerateEstimationSlip";
import GenerateInvoiceSlip from "../components/CustomerPortal/GenerateInvoiceSlip";
import GenerateReturnSlip from '../components/CustomerPortal/GenerateReturnSlip';
import GiftVoucher from '../components/CustomerPortal/GiftVocher';
import Invoice from "../components/CustomerPortal/Invoice";
import LoyaltyPoints from "../components/CustomerPortal/LoyaltyPoints";
import TextilePayment from "../components/CustomerPortal/TextilePayment";
import Blank from "../components/Home/Blank";
import ScanBarCode from "../components/Newsale/ScanBarCode";

import { createStackNavigator } from "@react-navigation/stack";
import Payment from "../components/Newsale/Payment";
const Stack = createStackNavigator();
export default class CustomerNavigation extends Component {


  componentDidMount() {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", this.backAction());
    return () => backHandler.remove();
    alert("hey");
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
            name="Generate Invoice"
            options={{ headerShown: false }}
            component={GenerateInvoiceSlip}
          />
          <Stack.Screen
            name="Day Closure Activity"
            options={{ headerShown: false }}
            component={DayClosure}
          />
          <Stack.Screen
            name="Add Customer"
            options={{ headerShown: false }}
            component={AddCustomer}
          />
          <Stack.Screen
            name="Generate Estimation Slip"
            options={{ headerShown: false }}
            component={GenerateEstimationSlip}
          />
          <Stack.Screen
            name="Gift Voucher"
            options={{ headerShown: false }}
            component={GiftVoucher}
          />
          <Stack.Screen
            name="Generate Return Slip"
            options={{ headerShown: false }}
            component={GenerateReturnSlip}
          />
          <Stack.Screen
            name="Loyalty points"
            options={{ headerShown: false }}
            component={LoyaltyPoints}
          />
          <Stack.Screen
            name="TextilePayment"
            options={{ headerShown: false }}
            component={TextilePayment}
          />
          <Stack.Screen
            name="Payment"
            options={{ headerShown: false }}
            component={Payment}
          />
          <Stack.Screen
            name="ScanBarCode"
            options={{ headerShown: false }}
            component={ScanBarCode}
          />
          <Stack.Screen
            name="Invoice"
            options={{ headerShown: false }}
            component={Invoice}
          />
        </Stack.Navigator>
      </>
    );
  }
}
