import { createStackNavigator } from "@react-navigation/stack";
import React, { Component } from "react";
import AddGiftVoucher from "../components/CustomerPortal/AddGiftVoucher";
import NewSaleTextile from "../components/CustomerPortal/NewSaleTextile";
import TextilePayment from "../components/CustomerPortal/TextilePayment";
import ScanBarCode from "../components/Newsale/ScanBarCode";

const Stack = createStackNavigator();
export default class CustomerNavigation extends Component {
	render() {
		return (
			<>
				<Stack.Navigator initialRouteName="NewSaleTextile">
					<Stack.Screen
						name="NewSaleTextile"
						options={{ headerShown: false }}
						component={NewSaleTextile}
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
					<Stack.Screen
						name="AddGiftVoucher"
						options={{ headerShow: false }}
						component={AddGiftVoucher}
					/>
				</Stack.Navigator>
			</>
		);
	}
}
