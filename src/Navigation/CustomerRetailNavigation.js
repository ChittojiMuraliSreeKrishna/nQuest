import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import NewSaleRetail from "../components/CustomerPortal/NewSaleRetail";
import ImageScanner from "../components/Newsale/ImageScanner";
import NewSale from "../components/Newsale/NewSale";
import Orders from "../components/Newsale/Orders";
import Payment from "../components/Newsale/Payment";
import ProductEdit from "../components/Newsale/ProductEdit";
import ScanBarCode from "../components/Newsale/ScanBarCode";

const Stack = createStackNavigator();
export default class CustomerRetailNavigation extends React.Component {
	render() {
		return (
			<>
				<Stack.Navigator>
					<Stack.Screen
						name="NewSaleRetail"
						options={{ headerShown: false }}
						component={NewSaleRetail}
					/>
					<Stack.Screen
						name="NewSale"
						options={{ headerShown: false }}
						component={NewSale}
					/>
					<Stack.Screen
						name="Orders"
						options={{ headerShown: false }}
						component={Orders}
					/>
					<Stack.Screen
						name="ScanBarCode"
						options={{ headerShown: false }}
						component={ScanBarCode}
					/>
					<Stack.Screen
						name="ImageScanner"
						options={{ headerShown: false }}
						component={ImageScanner}
					/>
					<Stack.Screen
						name="ProductEdit"
						options={{ headerShown: false }}
						component={ProductEdit}
					/>
					<Stack.Screen
						name="Payment"
						options={{ headerShown: false }}
						component={Payment}
					/>
				</Stack.Navigator>
			</>
		);
	}
}
