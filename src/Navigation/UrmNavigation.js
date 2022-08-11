import { createStackNavigator } from "@react-navigation/stack";
import React, { Component } from "react";
import AddStore from "../components/Accounting/AddStore";
import AddUser from "../components/URM/AddUser";
import CreateRole from "../components/URM/CreateRole";
import EditRole from "../components/URM/EditRole";
import EditUser from "../components/URM/EditUser";
import Privilages from "../components/URM/Privilages";
import UserManagement from "../components/URM/UserManagement";

const Stack = createStackNavigator();
export default class UrmNavigation extends Component {
	render() {
		return (
			<>
				<Stack.Navigator initialRouteName="UserManagement">
					<Stack.Screen
						name="UserManagement"
						options={{ headerShown: false }}
						component={UserManagement}
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
						name="CreateRole"
						options={{ headerShown: false }}
						component={CreateRole}
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
				</Stack.Navigator>
			</>
		);
	}
}
2;
