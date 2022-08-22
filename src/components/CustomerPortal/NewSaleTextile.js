import AsyncStorage from "@react-native-async-storage/async-storage";
import { DrawerActions } from "@react-navigation/native";
import Constants from "expo-constants";
import React, { Component } from "react";
import {
	Dimensions,
	FlatList,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import Device from "react-native-device-detection";
import scss from "../../commonUtils/assets/styles/HeaderStyles.scss";
import UrmService from "../services/UrmService";
import { pageNavigationBtnContainer } from "../Styles/Styles";
import AddCustomer from "./AddCustomer";
import DayClosure from "./DayClosure";
import GenerateEstimationSlip from "./GenerateEstimationSlip";
import GenerateInvoiceSlip from "./GenerateInvoiceSlip";
import GenerateReturnSlip from "./GenerateReturnSlip";
import GiftVocher from "./GiftVocher";

var deviceWidth = Dimensions.get("window").width;
var deviceWidth = Dimensions.get("window").width;
const data = [true, false, false, false, false, false, false, false, false];

class NewSaleTextile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			flagGenerateEstimationSlip: false,
			flagGenerateInvoice: false,
			flagGenerateReturnSlip: false,
			falgAddCustomer: false,
			flagGiftVoucher: false,
			flagDayClosure: false,
			flaggenerateInvoice: false,

			privilages: [],
			flagone: true,
			flagtwo: false,
			flagthree: false,
			flagfour: false,
			selectedcolor: "",
			subPrivilages: "",
			headerNames: [],
			barcodes: [1, 2],
		};
	}

	async componentDidMount() {
		AsyncStorage.getItem("rolename").then((value) => {
			console.log({ value });
			UrmService.getPrivillagesByRoleName(value).then((res) => {
				if (res) {
					if (res.data) {
						let len = res.data.parentPrivileges.length;
						for (let i = 0; i < len; i++) {
							let privilege = res.data.parentPrivileges[i];
							if (privilege.name === "Billing Portal") {
								let privilegeId = privilege.id;
								let sublen = privilege.subPrivileges.length;
								let subPrivileges = privilege.subPrivileges;
								for (let i = 0; i < sublen; i++) {
									if (privilegeId === subPrivileges[i].parentPrivilegeId) {
										let routes = subPrivileges[i].name.trim();
										this.state.headerNames.push({ name: routes });
										console.log("Header Names", this.state.headerNames);
									}
								}
								this.setState({ headerNames: this.state.headerNames }, () => {
									for (let j = 0; j < this.state.headerNames.length; j++) {
										if (j === 0) {
											this.state.privilages.push({
												bool: true,
												name: this.state.headerNames[j].name,
											});
										} else {
											this.state.privilages.push({
												bool: false,
												name: this.state.headerNames[j].name,
											});
										}
									}
								});
								this.initialNavigation();
							}
						}
					}
				}
			});
		});
	}

	initialNavigation() {
		this.setState({ privilages: this.state.privilages }, () => {
			if (this.state.privilages.length > 0) {
				if (this.state.privilages[0].name === "Generate Estimation Slip") {
					this.setState({ flagGenerateEstimationSlip: true });
				} else {
					this.setState({ flagGenerateEstimationSlip: false });
				}
				if (this.state.privilages[0].name === "Generate Invoice") {
					this.setState({ flagGenerateInvoice: true });
				} else {
					this.setState({ flagGenerateInvoice: false });
				}
				if (this.state.privilages[0].name === "Generate Return Slip") {
					this.setState({ flagGenerateReturnSlip: true });
				} else {
					this.setState({ flagGenerateReturnSlip: false });
				}
				if (this.state.privilages[0].name === "Add Customer") {
					this.setState({ falgAddCustomer: true });
				} else {
					this.setState({ falgAddCustomer: false });
				}
				if (this.state.privilages[0].name === "Gift Voucher") {
					this.setState({ flagGiftVoucher: true });
				} else {
					this.setState({ flagGiftVoucher: false });
				}
				if (this.state.privilages[0].name === "Day Closure Activity") {
					this.setState({ flagDayClosure: true });
				} else {
					this.setState({ flagDayClosure: false });
				}
			}
		});
	}

	topbarAction1 = (item, index) => {
		if (item.name === "Generate Estimation Slip") {
			this.setState({ flagGenerateEstimationSlip: true });
		} else {
			this.setState({ flagGenerateEstimationSlip: false });
		}
		if (item.name === "Generate Invoice") {
			this.setState({ flagGenerateInvoice: true });
		} else {
			this.setState({ flagGenerateInvoice: false });
		}
		if (item.name === "Generate Return Slip") {
			this.setState({ flagGenerateReturnSlip: true });
		} else {
			this.setState({ flagGenerateReturnSlip: false });
		}
		if (item.name === "Add Customer") {
			this.setState({ falgAddCustomer: true });
		} else {
			this.setState({ falgAddCustomer: false });
		}
		if (item.name === "Gift Voucher") {
			this.setState({ flagGiftVoucher: true });
		} else {
			this.setState({ flagGiftVoucher: false });
		}
		if (item.name === "Day Closure Activity") {
			this.setState({ flagDayClosure: true });
		} else {
			this.setState({ flagDayClosure: false });
		}

		if (this.state.privilages[index].bool === true) {
			this.state.privilages[index].bool = false;
		} else {
			this.state.privilages[index].bool = true;
		}
		for (let i = 0; i < this.state.privilages.length; i++) {
			if (index != i) {
				this.state.privilages[i].bool = false;
			}
			this.setState({ privilages: this.state.privilages });
		}
	};

	navigateToGenerateEstimationSlip() {
		this.props.navigation.navigate("GenerateEstimationSlip");
	}

	statatics() {
		this.props.navigation.navigate("Statitics");
	}

	menuAction() {
		this.props.navigation.dispatch(DrawerActions.openDrawer());
	}

	handleMenuButtonClick() {
		this.props.navigation.openDrawer();
		// this.props.navigation.navigate('Home')
	}

	render() {
		return (
			< ScrollView >
				<View style={styles.container}>
					<FlatList
						style={pageNavigationBtnContainer}
						horizontal
						data={this.state.privilages}
						showsVerticalScrollIndicator={false}
						showsHorizontalScrollIndicator={false}
						renderItem={({ item, index }) => (
							<TouchableOpacity
								style={[
									scss.pageNavigationBtn,
									{
										// backgroundColor: item.bool ? '#ED1C24' : '#d7d7d7',
										borderColor: item.bool ? "#ED1C24" : "#d7d7d7",
									},
								]}
								onPress={() => this.topbarAction1(item, index)}
							>
								<Text
									style={[
										scss.pageNavigationBtnText,
										{ color: item.bool ? "#ED1C24" : "#00000073" },
									]}
								>
									{item.name}
								</Text>
							</TouchableOpacity>
						)}
						ListFooterComponent={<View style={{ }}></View>}
					/>

					{this.state.flagGenerateEstimationSlip && (
						<GenerateEstimationSlip navigation={this.props.navigation} />
					)}

					{this.state.flagGenerateInvoice && (
						<GenerateInvoiceSlip navigation={this.props.navigation} />
					)}

					{this.state.flagGenerateReturnSlip && (
						<GenerateReturnSlip navigation={this.props.navigation} />
					)}

					{this.state.falgAddCustomer && <AddCustomer />}

					{this.state.flagGiftVoucher && <GiftVocher />}

					{this.state.flagDayClosure && <DayClosure />}
				</View>
			</ScrollView >
		);
	}
}
export default NewSaleTextile;

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		justifyContent: "center",
		backgroundColor: "#FAFAFF",
	},
	image: {
		marginTop: 40,
		marginLeft: 10,
		width: 80,
		height: 80,
		borderWidth: 0,
		borderRadius: 40,
	},
	viewswidth: {
		backgroundColor: "#ffffff",
		width: deviceWidth,
		textAlign: "center",
		fontSize: 24,
		height: 84,
	},
	input: {
		justifyContent: "center",
		margin: 20,
		height: 40,
		marginTop: 5,
		marginBottom: 10,
		borderColor: "#8F9EB717",
		borderRadius: 3,
		backgroundColor: "white",
		borderWidth: 1,
		fontFamily: "semibold",
		fontSize: 10,
	},
	signInButton: {
		backgroundColor: "#0196FD",
		justifyContent: "center",
		marginLeft: 30,
		marginRight: 30,
		marginTop: 50,
		height: 55,
		borderRadius: 30,
		fontWeight: "bold",
		// marginBottom:100,
	},
	signInButtonText: {
		color: "white",
		alignSelf: "center",
		fontSize: 14,
		fontFamily: "regular",
	},
	signInFieldStyle: {
		color: "#456CAF55",
		marginLeft: 20,
		marginTop: 5,
		fontSize: 12,
		fontFamily: "regular",
	},
	findIteminput: {
		marginLeft: 30,
		marginRight: 30,
		marginTop: 20,
		marginBottom: 1000,
		height: 50,
		backgroundColor: "#DEF1FF",
		borderRadius: 10,
		color: "#001B4A",
		fontFamily: "regular",
		fontSize: 12,
	},
	signUptext: {
		marginTop: 40,
		fontFamily: "regular",
		alignSelf: "center",
		color: "#FFFFFF",
		fontSize: 28,
	},
	saleBillsText: {
		marginLeft: 0,
		marginTop: -20,
		marginBottom: 10,
		fontFamily: "bold",
		color: "#0F2851",
		fontSize: 14,
	},
	tablecontainer: {
		flex: 1,
		// width:deviceWidth,
		marginLeft: 20,
		marginRight: 20,
		padding: 20,
		paddingTop: 30,
		backgroundColor: "#FFFFFF",
		borderRadius: 10,
	},
	container: {
		flex: 1,
		justifyContent: "center",
		// backgroundColor: '#FAFAFF'
	},
	flatList: {
		marginTop: 20,
	},
	flatlistbox: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		height: 150,
		width: 220,
		borderWidth: 1,
		backgroundColor: "#00C656",
		borderColor: "#ffffff",
		borderRadius: 10,
		marginLeft: 10,
		//  paddingHorizontal: 15,
		// padding:15,
		// marginRight: 15,
	},

	head: {
		height: 45,
		borderColor: "#FAFAFF",
		borderWidth: 1,
		borderRadius: 10,
	},
	text: {
		margin: 6,
		color: "#0196FD",
		fontFamily: "semibold",
		fontSize: 11,
	},
	textData: {
		margin: 6,
		color: "#48596B",
		fontFamily: "regular",
		fontSize: 10,
	},

	Topcontainer: {
		flexDirection: "row",
		marginLeft: 0,
		marginRight: 0,
		width: "100%",
		backgroundColor: "grey",
		height: 50,
	},

	TopcontainerforModel: {
		flexDirection: "row",
		marginLeft: 0,
		marginRight: 0,
		marginTop: 10,
		width: "100%",
		backgroundColor: "grey",
		borderRadius: 20,
		height: 50,
	},
	redbox: {
		backgroundColor: "#1CA2FF",
		alignSelf: "flex-start",

		//marginHorizontal: "1%",
		marginBottom: 6,
		width: "25%",
		height: 45,
		textAlign: "center",
	},
	bluebox: {
		backgroundColor: "#0196FD",
		alignSelf: "flex-start",
		//marginHorizontal: "1%",
		marginBottom: 6,
		width: "25%",
		height: 45,
		textAlign: "center",
	},
	blackbox: {
		backgroundColor: "#0196FD",
		alignSelf: "flex-start",
		//marginHorizontal: "1%",
		marginBottom: 6,
		width: "25%",
		height: 45,
		textAlign: "center",
	},
	greenbox: {
		backgroundColor: "#0196FD",
		alignSelf: "flex-start",
		//marginHorizontal: "1%",
		marginBottom: 6,
		width: "25%",
		height: 45,
		textAlign: "center",
	},
	tabBar: {
		flexDirection: "row",
		paddingTop: Constants.statusBarHeight,
	},
	tabItem: {
		flex: 1,
		alignItems: "center",
		padding: 16,
	},
	box: {
		width: 50,
		height: 50,
	},
	row: {
		flexDirection: "row",
		flexWrap: "wrap",
	},
	button: {
		paddingHorizontal: 8,
		paddingVertical: 6,
		//borderRadius: 4,
		backgroundColor: "#0196FD",
		alignSelf: "flex-start",
		//marginHorizontal: "1%",
		marginBottom: 6,
		width: "25%",
		height: 45,
		textAlign: "center",
	},
	selected: {
		backgroundColor: "#BBE3FF",
		borderWidth: 0,
		backgroundColor: "#0196FD",
	},
	buttonLabel: {
		textAlign: "center",
		color: "#BBE3FF",
		fontFamily: "regular",
		fontSize: 14,
	},
	selectedLabel: {
		color: "white",
		textAlign: "center",
		alignSelf: "center",
		marginTop: 10,
		fontFamily: "regular",
		fontSize: 14,
	},
	label: {
		textAlign: "center",
		marginBottom: 10,
		fontSize: 24,
	},

	//model
	modelcontainer: {
		alignItems: "center",
		backgroundColor: "#ede3f2",
		padding: 100,
	},
	modal: {
		flex: 1,
		alignItems: "center",
		backgroundColor: "#f7021a",
		padding: 100,
	},
	modeltext: {
		color: "#3f2949",
		marginTop: 10,
	},

	// Styles For Mobile
	viewsWidth_mobile: {
		backgroundColor: "#ffffff",
		width: deviceWidth,
		textAlign: "center",
		fontSize: 24,
		height: Device.isAndroid ? 70 : 84,
	},
	navigationToButton_mobile: {
		position: "absolute",
		right: 70,
		bottom: 10,
		backgroundColor: "#ED1C24",
		borderRadius: 5,
		width: 110,
		height: 32,
		textAlign: "center",
		alignItems: "center",
	},
	navigationToButton_tablet: {
		position: "absolute",
		right: 70,
		top: 40,
		backgroundColor: "#ED1C24",
		borderRadius: 5,
		width: 110,
		height: 32,
		textAlign: "center",
		alignItems: "center",
	},
	menuButton_mobile: {
		position: "absolute",
		left: 10,
		bottom: 0,
		width: 40,
		height: 40,
	},
	headerTitle_mobile: {
		position: "absolute",
		left: 70,
		bottom: 10,
		width: 300,
		height: 25,
		fontFamily: "bold",
		fontSize: 18,
		color: "#353C40",
	},
	navButton_mobile: {
		position: "absolute",
		right: 20,
		top: 37,
		backgroundColor: "#ED1C24",
		borderRadius: 5,
		width: 105,
		height: 32,
	},
	// Styles For Tablet
	viewsWidth_tablet: {
		backgroundColor: "#ffffff",
		width: deviceWidth,
		textAlign: "center",
		fontSize: 28,
		height: 90,
	},
	menuButton_tablet: {
		position: "absolute",
		left: 10,
		top: 38,
		width: 90,
		height: 90,
	},
	navButton_tablet: {
		position: "absolute",
		right: 20,
		top: 27,
		backgroundColor: "#ED1C24",
		borderRadius: 5,
		width: 155,
		height: 42,
	},
	headerTitle_tablet: {
		position: "absolute",
		left: 70,
		top: 40,
		width: 300,
		height: 40,
		fontFamily: "bold",
		fontSize: 24,
		color: "#353C40",
	},
	navButtonText_tablet: {
		fontSize: 17,
		fontFamily: "regular",
		color: "#ffffff",
		marginLeft: 10,
		marginTop: 8,
		alignSelf: "center",
	},
	navButtonText_mobile: {
		fontSize: 12,
		fontFamily: "regular",
		color: "#ffffff",
		marginLeft: 10,
		marginTop: 8,
		alignSelf: "center",
	},
});
