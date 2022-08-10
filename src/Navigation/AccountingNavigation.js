import { createStackNavigator } from "@react-navigation/stack";
import React, { Component } from "react";
import AccountManagement from "../components/Accounting/AccountManagement";
import AddCreditNotes from "../components/Accounting/AddCreditNotes";
import AddDebitNotes from "../components/Accounting/AddDebitNotes";
import AddDomain from "../components/Accounting/AddDomain";
import AddHsnCode from "../components/Accounting/AddHsnCode";
import AddStore from "../components/Accounting/AddStore";
import AddTaxMaster from "../components/Accounting/AddTaxMaster";

const Stack = createStackNavigator();
export default class AccountingNaviagtion extends Component {
	render() {
		return (
			<>
				{/* <TopBar {...this.props}/> */}
				<Stack.Navigator initialRouteName="AccountManagement">
					<Stack.Screen
						name="AccountManagement"
						options={{ headerShown: false }}
						component={AccountManagement}
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
