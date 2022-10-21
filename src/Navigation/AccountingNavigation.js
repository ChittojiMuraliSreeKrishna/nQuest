import { createStackNavigator } from "@react-navigation/stack";
import React, { Component } from "react";
import AccountingDashboard from '../components/Accounting/AccountingDashboard';
import AddCreditNotes from "../components/Accounting/AddCreditNotes";
import AddDebitNotes from "../components/Accounting/AddDebitNotes";
import AddDomain from "../components/Accounting/AddDomain";
import AddHsnCode from "../components/Accounting/AddHsnCode";
import AddStore from "../components/Accounting/AddStore";
import AddTaxMaster from "../components/Accounting/AddTaxMaster";
import CreateHSNCode from '../components/Accounting/CreateHSNCode';
import CreateTaxMaster from '../components/Accounting/CreateTaxMaster';
import CreditNotes from '../components/Accounting/CreditNotes';
import DebitNotes from '../components/Accounting/DebitNotes';
import Stores from '../components/Accounting/Stores';
import Blank from "../components/Home/Blank";

const Stack = createStackNavigator();
export default class AccountingNaviagtion extends Component {
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
            name="Stores"
            options={{ headerShown: false }}
            component={Stores}
          />
          <Stack.Screen
            name="Dashboard"
            options={{ headerShown: false }}
            component={AccountingDashboard}
          />
          <Stack.Screen
            name="Debit Notes"
            options={{ headerShown: false }}
            component={DebitNotes}
          />
          <Stack.Screen
            name="Credit Notes"
            options={{ headerShown: false }}
            component={CreditNotes}
          />
          <Stack.Screen
            name="Create HSN Code"
            options={{ headerShown: false }}
            component={CreateHSNCode}
          />
          <Stack.Screen
            name="Create Tax Master"
            options={{ headerShown: false }}
            component={CreateTaxMaster}
          />
          <Stack.Screen
            name="AddStore"
            options={{ headerShown: false }}
            component={AddStore}
          />
          <Stack.Screen
            name="AddDomain"
            options={{ headerShown: false }}
            component={AddDomain}
          />
          <Stack.Screen
            name="AddTaxMaster"
            options={{ headerShown: false }}
            component={AddTaxMaster}
          />
          <Stack.Screen
            name="AddHsnCode"
            options={{ headerShown: false }}
            component={AddHsnCode}
          />
          <Stack.Screen
            name="AddCreditNotes"
            options={{ headerShown: false }}
            component={AddCreditNotes}
          />
          <Stack.Screen
            name="AddDebitNotes"
            options={{ headerShown: false }}
            component={AddDebitNotes}
          />
        </Stack.Navigator>
      </>
    );
  }
}
