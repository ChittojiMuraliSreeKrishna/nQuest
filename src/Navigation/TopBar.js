import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component } from "react";
import {
	FlatList,
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import I18n from "react-native-i18n";
import Modal from "react-native-modal";
import scss from "../commonUtils/assets/styles/Bars.scss";
import UrmService from "../components/services/UrmService";
import { RF } from "../Responsive";

var data = [];
var currentSelection = "";
var dataCleared = true;
var firstDisplayRoute = "";
export const screenMapping = {
	"Dashboard": "Home",
	"Billing Portal": "CustomerNavigation",
	"Inventory Portal": "InventoryNavigation",
	"Promotions & Loyalty": "PromoNavigation",
	"Accounting Portal": "AccountingNaviagtion",
	"Reports": "ReportsNavigation",
	"URM Portal": "UrmNavigation",
};

const GetImageBasedOnPrevilageName = (name) => {
	return name === "Dashboard" ? (
		require("../commonUtils/assets/Images/home.png")
	) : name === "Billing Portal" ? (
		require("../commonUtils/assets/Images/billing_portal_header_icon.png")
	) : name === "Inventory Portal" ? (
		require("../commonUtils/assets/Images/inventory_dropdown_icon.png")
	) : name === "Promotions & Loyalty" ? (
		require("../commonUtils/assets/Images/promotions_dropdown_icon.png")
	) : name === "Accounting Portal" ? (
		require("../commonUtils/assets/Images/accounting_dropdown_icon.png")
	) : name === "Reports" ? (
		require("../commonUtils/assets/Images/reports_dropdown_icon.png")
	) : name === "URM Portal" ? (
		require("../commonUtils/assets/Images/urm_dropdown_icon.png")
	) : (
		<></>
	);
};

export class TopBar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dropdown: null,
			route: "",
			domainId: "",
			firstDisplayName: "",
			firstDisplayNameScreen: "",
			modalVisibleData: false,
			refresh: true,
		};
	}

	_renderItem(previlage) {
		return (
			<TouchableOpacity
				style={styles.item}
				onPress={() => {
					currentSelection = previlage.item;
					global.homeButtonClicked = false;
					global.profileButtonClicked = false;
					this.props.navigation.navigate(
						screenMapping[currentSelection],
						this.refresh(),
					);
					this.setState({ modalVisibleData: false });
				}}
			>
				<Image
					style={styles.icon}
					source={GetImageBasedOnPrevilageName(previlage.item)}
				/>
				<Text style={styles.textItem}>{I18n.t(previlage.item)}</Text>
			</TouchableOpacity>
		);
	}

	componentWillUnmount() {
		currentSelection = "";
		console.log("topbar component unmount", this.props.route.name);
	}

	// //Before screen render
	async componentWillMount() {
		var storeStringId = "";
		var domainStringId = "";
		// this.props.navigation.navigate('Login')

		AsyncStorage.getItem("storeId")
			.then((value) => {
				storeStringId = value;
				this.setState({ storeId: parseInt(storeStringId) });
				//console.log(this.state.storeId);
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
				this.getData();
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
										firstDisplayName: res.data.parentPrivileges[0].name,
									});
									const firstDisplayName = this.state.firstDisplayName;
									console.log({ firstDisplayName });
									firstDisplayRoute = res.data.parentPrivileges[0].name;
									var privilegesSet = new Set();
									// this.props.navigation.navigate(firstDisplayName);
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
										privilegesSet.add(previlage.name);
										// data.push(previlage.name);
									}
									data = Array.from(privilegesSet);
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
		const { firstDisplayName, firstDisplayNameScreen } = this.state;
		console.log("data in get data", firstDisplayName, currentSelection);
		if (currentSelection === "") {
			currentSelection = firstDisplayName;
			this.setState({
				firstDisplayNameScreen: screenMapping[firstDisplayName],
			});
			this.props.navigation.navigate(
				this.state.firstDisplayNameScreen,
				this.refresh(),
			);
		} else if (firstDisplayRoute === currentSelection) {
			this.props.navigation.navigate(
				screenMapping[firstDisplayRoute],
				this.refresh(),
			);
		}
	}

	modalHandle() {
		this.setState({ modalVisibleData: !this.state.modalVisibleData });
	}

	refresh() {
		console.log("inside refresh");
		this.setState({ refresh: !this.state.refresh });
	}

	render() {
		var displayName =
			currentSelection === "" ? this.state.firstDisplayName : currentSelection;
		console.log(
			"placeholder data: " +
				this.state.firstDisplayName +
				",current selection " +
				currentSelection,
		);
		return (
			<>
				<View style={scss.topBarContainer}>
					<View style={scss.titleContainer}>
						<View style={scss.titleSubContainer}>
							<Image
								style={scss.logoimg}
								source={require("../commonUtils/assets/Images/r_logo.png")}
							/>
						</View>
						<View style={scss.titleSubContainer}>
							<Text style={[scss.heading_title, { fontWeight: "bold" }]}>
								{global.username}
							</Text>
							<Text style={scss.heading_subtitle}>{global.storeName}</Text>
						</View>
					</View>

					<>
						<TouchableOpacity
							style={{ flexDirection: "row", padding: 15 }}
							onPress={() => this.modalHandle()}
						>
							<Image
								style={styles.icon}
								source={GetImageBasedOnPrevilageName(
									currentSelection === ""
										? this.state.firstDisplayName
										: currentSelection,
								)}
							/>
							<Text style={styles.textItem}>{I18n.t(displayName)}</Text>
							<Image
								style={{ margin: 10 }}
								source={require("../components/assets/images/list_trangle.png")}
							/>
						</TouchableOpacity>
						{this.state.modalVisibleData && (
							<View>
								<Modal
									style={{ margin: 0, backgroundColor: "rgba(0,0,0,0.7)" }}
									transparent={true}
									animationType="fade"
									visible={this.state.modalVisibleData}
									onRequestClose={() => {
										this.modalHandle();
									}}
									onBackButtonPress={() => this.modalHandle()}
									onBackdropPress={() => this.modalHandle()}
								>
									<View style={styles.modalContainer}>
										<View style={styles.modalView}>
											<FlatList
												data={data}
												renderItem={(item) => this._renderItem(item)}
												keyExtractor={(item) => item}
												contentContainerStyle={{
													flexDirection: "column",
													justifyContent: "center",
												}}
											/>
										</View>
									</View>
								</Modal>
							</View>
						)}
					</>
				</View>
			</>
		);
	}
}

const styles = StyleSheet.create({
	headerContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 1,
		backgroundColor: "#fff",
	},
	icon: {
		marginRight: 5,
		width: 22,
		height: 22,
	},
	item: {
		//justifyContent: 'space-evenly',
		//alignItems: 'center',
		flexDirection: "row",
		padding: 15,
		// flexWrap: 'wrap',
		// flexGrow: 1
	},
	textItem: {
		fontSize: RF(11),
		fontFamily: "bold",
	},
	modalContainer: {
		backgroundColor: "rgba(0,0,0,0.4)",
		// opacity:0.5,
		// height:'100%',
		// width:'100%',
		// justifyContent:'center',
		// alignContent:'center',
		// alignItems:'center',
	},
	modalView: {
		backgroundColor: "white",
		justifyContent: "center",
		//flex:1,
		//flexDirection:'row'
		// position: "relative",
		// width: "70%",
		// margin: "0 auto",
		// height: "auto",
		// maxHeight: "70vh",
		// marginTop: "calc(100vh - 85vh - 20px)",
		// backgroundColor: "#fff",
		// borderRadius: 4,
		// padding: 5
	},
	test: {
		height: "1%",
	},
	logoimage: {
		width: 200,
		// height: "90%",
	},
});
export default TopBar;
