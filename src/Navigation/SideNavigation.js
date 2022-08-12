import AsyncStorage from "@react-native-async-storage/async-storage";
import { createDrawerNavigator } from "@react-navigation/drawer";
import * as React from "react";
import { View } from "react-native";
import Device from "react-native-device-detection";
import { ActivityIndicator } from "react-native-paper";
import Home from "../components/Home/Home";
import Settings from "../components/Profile/Settings";
import UrmService from "../components/services/UrmService";
import AccountingNaviagtion from "./AccountingNavigation";
import CustomerNavigation from "./CustomerNavigation";
import CustomerRetailNavigation from "./CustomerRetailNavigation";
import { DrawerContent } from "./DrawerContent";
import InventoryNavigation from "./InventoryNavigation";
import InventoryRetailNavigation from "./InventoryRetailNavigation";
import NewSaleNavigation from "./NewSaleNavigation";
import PromoNavigation from "./PromoNavigation";
import ReportsNavigation from "./ReportsNavigation";
import UrmNavigation from "./UrmNavigation";

global.previlage1 = "";
global.previlage2 = "";
global.previlage3 = "";
global.previlage4 = "";
global.previlage5 = "";
global.previlage6 = "";
global.previlage7 = "";
global.previlage8 = "";
global.isSuperAdmin = "";
global.isConfigUser = "";
global.username = "";
const Drawer = createDrawerNavigator();
export default class SideNavigation extends React.Component {
	state = {
		route: "",
		loading: false,
		domainId: "",
		firstRoute: "",
		firstRoutePath: "",
	};
	initialRouteName = () => {
		if (global.previlage1 === "Dashboard") {
			this.setState({ route: "Home" });
		} else if ((global.previlage2 = "Billing Portal")) {
			this.setState({ route: "CustomerNavigation" });
		} else if ((global.previlage3 = "Inventory Portal")) {
			this.setState({ route: "InventoryNavigation" });
		} else if ((global.previlage4 = "Promotions & Loyalty")) {
			this.setState({ route: "PromoNavigation" });
		} else if ((global.previlage5 = "Accounting Portal")) {
			this.setState({ route: "AccountingNaviagtion" });
		} else if ((global.previlage6 = "Reports")) {
			this.setState({ route: "ReportsNavigation" });
		} else if ((global.previlage7 = "URM Portal")) {
			this.setState({ route: "UrmNavigation" });
		}

		this.setState({ loading: false });
	};
	async componentWillMount() {
		console.warn("Gloal", global.previlage1);
		this.setState({ loading: false });
		var storeStringId = "";
		var domainStringId = "";

		AsyncStorage.getItem("storeId")
			.then((value) => {
				storeStringId = value;
				this.setState({ storeId: parseInt(storeStringId) });
				console.log(this.state.storeId);
				console.log("cssafsfs " + this.state.storeId);
			})
			.catch(() => {
				console.log("There is error getting storeId");
			});

		await AsyncStorage.getItem("rolename")
			.then((value) => {
				global.userrole = value;
			})
			.catch(() => {
				console.log("There is error getting userrole");
			});

		await AsyncStorage.getItem("username").then((value) => {
			global.username = value;
		});

		await AsyncStorage.getItem("storeName").then((value) => {
			global.storeName = value;
		});

		global.previlage1 = "";
		global.previlage2 = "";
		global.previlage3 = "";
		global.previlage4 = "";
		global.previlage5 = "";
		global.previlage6 = "";
		global.previlage7 = "";
		global.previlage8 = "";
		this.initialRouteName();
		this.getPrivileges();
	}

	async getPrivileges() {
		await AsyncStorage.getItem("roleType").then((value) => {
			if (value === "config_user") {
				global.previlage1 = "";
				global.previlage2 = "";
				global.previlage3 = "";
				global.previlage4 = "";
				global.previlage5 = "";
				global.previlage6 = "";
				global.previlage7 = "URM Portal";
			} else if (value === "super_admin") {
				global.previlage1 = "Dashboard";
				global.previlage2 = "Billing Portal";
				global.previlage3 = "Inventory Portal";
				global.previlage4 = "Promotions & Loyalty";
				global.previlage5 = "Accounting Portal";
				global.previlage6 = "Reports";
				global.previlage7 = "URM Portal";
			} else {
				AsyncStorage.getItem("rolename")
					.then((value) => {
						console.log("role name", value);
						global.userrole = value;
						UrmService.getPrivillagesByRoleName(value).then((res) => {
							console.log("Privileges", res.data);
							if (res.data) {
								let len = res.data.parentPrivileges.length;
								// console.log(.name)
								if (len > 0) {
									this.setState({
										firstRoute: res.data.parentPrivileges[0].name,
									});
									const firstRoute = this.state.firstRoute;
									console.log({ firstRoute });
									for (let i = 0; i < len; i++) {
										let previlage = res.data.parentPrivileges[i];
										if (previlage.name === "Dashboard") {
											global.previlage1 = "Dashboard";
										}
										if (previlage.name === "Billing Portal") {
											global.previlage2 = "Billing Portal";
										}
										if (previlage.name === "Inventory Portal") {
											global.previlage3 = "Inventory Portal";
										}
										if (previlage.name === "Promotions & Loyalty") {
											global.previlage4 = "Promotions & Loyalty";
										}
										if (previlage.name === "Accounting Portal") {
											global.previlage5 = "Accounting Portal";
										}
										if (previlage.name === "Reports") {
											global.previlage6 = "Reports";
										}
										if (previlage.name === "URM Portal") {
											global.previlage7 = "URM Portal";
										}
									}
									// this.props.navigation.navigate('CustomerNavigation');
									//this.setState({ loading: false });
								}
								this.getData();
							}
						});
					})
					.catch((err) => {
						console.log(err);
					});
			}
		});
	}
	async getData() {
		console.error("calling");
		const { firstRoute } = this.state;
		if (firstRoute === "Dashboard") {
			this.setState({ firstRoutePath: "Home" });
		} else if (firstRoute === "Billing Portal") {
			// return 'CustomerNavigation';
			this.setState({ firstRoutePath: "CustomerNavigation" });
		} else if (firstRoute === "Promotions & Loyalty") {
			// return 'PromoNavigation';
			this.setState({ firstRoutePath: "PromoNavigation" });
		} else if (firstRoute === "Accounting Portal") {
			// return 'AccountingNaviagtion';
			this.setState({ firstRoutePath: "AccountingNaviagtion" });
		} else if (firstRoute === "URM Portal") {
			// return 'UrmNavigation';
			this.setState({ firstRoutePath: "UrmNavigation" });
		}
		console.log(this.state.firstRoutePath);
	}
	render() {
		// alert(this.state.route)
		return this.state.loading ? (
			<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
				<ActivityIndicator size={"large"} color={"red"} />
			</View>
		) : (
			<Drawer.Navigator
				drawerPosition={"top"}
				// initialRouteName={firstRoute === 'Dashboard' ? "Home" : firstRoute === 'Billing Portal' ? "CustomerNavigation" : firstRoute === 'Inventory Portal' ? "InventoryNavigation " : firstRoute === 'Promotions & Loyalty' ? "PromoNavigation" : firstRoute === 'Accounting Portal' ? "AccountingNaviagtion" : firstRoute === 'Reports' ? "ReportsNavigation" : firstRoute === 'URM Portal' ? "UrmNavigation" : 'Settings'}
				initialRouteName={this.state.firstRoutePath}
				screenOptions={{
					drawerStyle: {
						width: Device.isTablet ? 400 : 300,
					},
				}}
				drawerContent={(props) => <DrawerContent {...props} />}
			>
				<Drawer.Screen
					name="Home"
					options={{ headerShown: false }}
					component={Home}
				/>
				<Drawer.Screen
					name="Settings"
					options={{ headerShown: false }}
					component={Settings}
				/>
				<Drawer.Screen
					name="PromoNavigation"
					options={{ headerShown: false }}
					component={PromoNavigation}
				/>
				<Drawer.Screen
					name="InventoryNavigation"
					options={{ headerShown: false }}
					component={InventoryNavigation}
				/>
				<Drawer.Screen
					name="UrmNavigation"
					options={{ headerShown: false }}
					component={UrmNavigation}
				/>
				<Drawer.Screen
					name="ReportsNavigation"
					options={{ headerShown: false }}
					component={ReportsNavigation}
				/>
				<Drawer.Screen
					name="AccountingNaviagtion"
					options={{ headerShown: false }}
					component={AccountingNaviagtion}
				/>
				<Drawer.Screen
					name="CustomerNavigation"
					options={{ headerShown: false }}
					component={CustomerNavigation}
				/>
				<Drawer.Screen
					name="CustomerRetailNavigation"
					options={{ headerShown: false }}
					component={CustomerRetailNavigation}
				/>
				<Drawer.Screen
					name="NewSaleNavigation"
					options={{ headerShown: false }}
					component={NewSaleNavigation}
				/>
				<Drawer.Screen
					name="InventoryRetailNavigation"
					options={{ headerShown: false }}
					component={InventoryRetailNavigation}
				/>
				{/* <Drawer.Screen name="NewSaleTextileNavigation" options={{ headerShown: false }} component={NewSaleTextileNavigation} /> */}
			</Drawer.Navigator>
		);
	}
}
