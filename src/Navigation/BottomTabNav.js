import React, { Component } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import I18n from "react-native-i18n";

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import HomeIcon from "react-native-vector-icons/Entypo";
import ProfileIcon from "react-native-vector-icons/Feather";
import scss from "../commonUtils/assets/styles/Bars.scss";
import UrmService from "../components/services/UrmService";
import { screenMapping } from "./TopBar";

global.homeButtonClicked = false;
global.profileButtonClicked = false;

class BottomTabNav extends Component {
	constructor(props) {
		super(props);
		this.state = {
			firstDisplayName: "",
			firstDisplayNameScreen: "",
		};
	}
	//Before screen render
	async UNSAFE_componentWillMount() {
		var storeStringId = "";
		AsyncStorage.getItem("storeId")
			.then((value) => {
				storeStringId = value;
				this.setState({ storeId: parseInt(storeStringId) });
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
		this.getPrivileges();
	}

	async getPrivileges() {
		await AsyncStorage.getItem("roleType").then((value) => {
			if (value === "config_user") {
				let privilegesSet = new Set();
				global.previlage1 = "";
				global.previlage2 = "";
				global.previlage3 = "";
				global.previlage4 = "";
				global.previlage5 = "";
				global.previlage6 = "";
				global.previlage7 = "URM Portal";
				privilegesSet.add("URM Portal");
				data = Array.from(privilegesSet);
				this.setState({ firstDisplayName: "URM Portal" });
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
						global.userrole = value;
						UrmService.getPrivillagesByRoleName(value).then((res) => {
							console.log({ res });
							if (res.data) {
								let len = res.data.parentPrivileges.length;
								if (len > 0) {
									this.setState({
										firstDisplayName: screenMapping[res.data.parentPrivileges[0].name],
									});
								}
							}
						});
					})
					.catch((err) => {
						console.log(err);
					});
			}
		});
	}

	homeButtonActions() {
		global.homeButtonClicked = true;
		global.profileButtonClicked = false;
		this.props.navigation.navigate(this.state.firstDisplayName);
	}

	profileButtonActions() {
		global.profileButtonClicked = true;
		global.homeButtonClicked = false;
		this.props.navigation.navigate("Settings");
	}
	render() {
		return (
			<View style={scss.bottomTabContainer}>
				<TouchableOpacity
					style={styles.bottomButtons}
					onPress={() => {
						console.log("in home click");
						this.homeButtonActions();
					}}
				>
					<HomeIcon
						name="home"
						color={global.homeButtonClicked === true ? "red" : "#000"}
						size={20}
					/>
					<Text> {I18n.t("Home")}</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.bottomButtons}
					onPress={() => {
						this.profileButtonActions();
					}}
				>
					<ProfileIcon
						name="user"
						color={global.profileButtonClicked === true ? "red" : "#000"}
						size={20}
					/>
					<Text> {I18n.t("Profile")}</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	bottomContainer: {
		flex: 0.1,
		display: "flex",
		backgroundColor: "#fff",
		flexDirection: "row",
		alignItems: "center",
	},
	footer: {
		// position: 'absolute',
		// flex: 1,
		// left: 0,
		// right: 0,
		// bottom: -10,
		display: "flex",
		backgroundColor: "red",
		flexDirection: "row",
		alignItems: "center",
	},
	bottomButtons: {
		alignItems: "center",
		justifyContent: "center",
		flex: 1,
	},
});
export default BottomTabNav;
