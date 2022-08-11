import { createStackNavigator } from "@react-navigation/stack";
import React, { Component } from "react";
import AddBarcode from "../components/Inventory/AddBarcode";
import AddProductCombo from "../components/Inventory/AddProductCombo";
import EditBarcode from "../components/Inventory/EditBarcode";
import Inventory from "../components/Inventory/Inventory";
import ViewReBarcode from "../components/Inventory/ViewReBarcode";
const Stack = createStackNavigator();
export default class InventoryNavigation extends Component {
	render() {
		return (
			<>
				<Stack.Navigator>
					<Stack.Screen
						name="Inventory"
						options={{ headerShown: false }}
						component={Inventory}
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
