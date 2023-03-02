import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import AddCreditNotes from "../components/Accounting/AddCreditNotes";
import AddDebitNotes from "../components/Accounting/AddDebitNotes";
import AddHsnCode from "../components/Accounting/AddHsnCode";
import AddStore from "../components/Accounting/AddStore";
import AddTaxMaster from "../components/Accounting/AddTaxMaster";
import CartDetails from "../components/CustomerPortal/CartDetails";
import AddBarcode from "../components/Inventory/AddBarcode";
import AddItemList from "../components/Inventory/AddItemList";
import AddProductCombo from "../components/Inventory/AddProductCombo";
import EditBarcode from "../components/Inventory/EditBarcode";
import ForgotPassword from "../components/Login/ForgotPassword";
import Login from "../components/Login/Login";
import SelectClient from "../components/Login/SelectClient";
import SelectStore from "../components/Login/SelectStore";
import UpdateNewpassword from "../components/Login/UpdateNewpassword";
import Settings from "../components/Profile/Settings";
import AddUser from "../components/URM/AddUser";
import CreateRole from "../components/URM/CreateRole";
import EditRole from "../components/URM/EditRole";
import EditUser from "../components/URM/EditUser";
import ManagePassword from "../components/URM/ManagePassword";
import Privilages from "../components/URM/Privilages";
import RegisterClient from "../components/URM/RegisterClient";
import LoginAfterLanguageSelect from "../components/Welcome/LoginAfterLanguageSelect";
import InventoryNavigation from "./InventoryNavigation";
import TopBarNavigation from "./TopBarNavigation";

const Stack = createStackNavigator();
export default class HomeNavigation extends React.Component {
  componentDidMount() {
    this.props.navigation.push("TopBarNavigation");
  }
  render() {
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
        <Stack.Screen
          name="CreateRole"
          options={{ headerShown: false }}
          component={CreateRole}
        />
        <Stack.Screen
          name="AddUser"
          options={{ headerShown: false }}
          component={AddUser}
        />
        <Stack.Screen
          name="AddStore"
          options={{ headerShown: false }}
          component={AddStore}
        />
        <Stack.Screen
          name="EditUser"
          options={{ headerShown: false }}
          component={EditUser}
        />
        <Stack.Screen
          name="EditRole"
          options={{ headerShown: false }}
          component={EditRole}
        />
        <Stack.Screen
          name="Privilages"
          options={{ headerShown: false }}
          component={Privilages}
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
          name="AddProduct"
          options={{ headerShown: false }}
          component={AddProductCombo}
        />
        <Stack.Screen
          name="AddListItem"
          options={{ headerShown: false }}
          component={AddItemList}
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
        <Stack.Screen
          name="CartDetails"
          options={{ headerShown: false }}
          component={CartDetails}
        />

      </Stack.Navigator>
    );
  }
}
