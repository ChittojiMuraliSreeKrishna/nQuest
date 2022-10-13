import { createStackNavigator } from "@react-navigation/stack";
import React, { Component } from "react";
import AddCustomer from '../components/CustomerPortal/AddCustomer';
import DayClosure from '../components/CustomerPortal/DayClosure';
import GenerateEstimationSlip from "../components/CustomerPortal/GenerateEstimationSlip";
import GenerateInvoiceSlip from "../components/CustomerPortal/GenerateInvoiceSlip";
import GenerateReturnSlip from '../components/CustomerPortal/GenerateReturnSlip';
import GiftVoucher from '../components/CustomerPortal/GiftVocher';
import LoyaltyPoints from "../components/CustomerPortal/LoyaltyPoints";
import TextilePayment from "../components/CustomerPortal/TextilePayment";
import Blank from "../components/Home/Blank";
import ScanBarCode from "../components/Newsale/ScanBarCode";

const Stack = createStackNavigator();
export default class CustomerNavigation extends Component {
  render () {
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
            name="ScanBarCode"
            options={{ headerShown: false }}
            component={ScanBarCode}
          />
        </Stack.Navigator>
      </>
    );
  }
}
