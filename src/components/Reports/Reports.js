import AsyncStorage from "@react-native-async-storage/async-storage";
import { DrawerActions } from "@react-navigation/native";
import React, { Component } from "react";
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Device from "react-native-device-detection";
import scss from "../../commonUtils/assets/styles/HeaderStyles.scss";
import { RF, RH, RW } from "../../Responsive";
import UrmService from "../services/UrmService";
import { GoodsReturn } from "./GoodsReturn";
import { ListOfBarcodes } from "./ListOfBarcodes";
import { ListOfEstimationSlip } from "./ListOfEstimationSlip";
import { ListOfPromotions } from "./ListOfPromotions";
import NewSaleReport from "./NewSaleReport";
import ReportsDashboard from "./ReportsDashboard";
import { SalesSumary } from "./SalesSumary";

var deviceWidth = Dimensions.get("window").width;
var deviceWidth = Dimensions.get("window").width;
var deviceheight = Dimensions.get("window").height;


const data = [true, false, false, false, false, false, false, false, false];

class Reports extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// Header Array
			headerNames: [],
			privilages: [],

			// Navigation Flags
			selectedcolor: "",
			subPrivilages: "",
			flagDashboard: false,
			flagNewSale: false,
			flagGoodsReturn: false,
			flagSalesSummary: false,
			flagListBarcodes: false,
			flagEstimationSlip: false,
			flagListPromotions: false,
			flagFilterDashboard: false,
			flagFilterEstimationSlip: false,
			flagFilterGoodsReturn: false,
			flagFilterListBarcodes: false,
			flagFilterListPromotions: false,
			flagFilterNewSale: false,
			flagFilterSalesSumary: false,
			modalVisible: true,
			filterButton: false,

			// Component Arrays
			estimationSlip: [],
			newSale: [],
			goodsReturn: [],
			salesSumary: [],
			salesSumaryObject: [],
			listBarcodes: [],
			listPromotions: [],
			sbList: [],
			storeId: 0,
			filterActive: false,
			refreshPage: false,
			headersNames: [],
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
							if (privilege.name === "Reports") {
								let privilegeId = privilege.id;
								let sublen = privilege.subPrivileges.length;
								let subPrivileges = privilege.subPrivileges;
								for (let i = 0; i < sublen; i++) {
									if (privilegeId === subPrivileges[i].parentPrivilegeId) {
										let routes = subPrivileges[i].name;
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
			console.log(this.state.privilages);
			if (this.state.privilages.length > 0) {
				if (this.state.privilages[0].name === "Dashboard") {
					this.setState({ filterButton: false, flagDashboard: true });
				} else {
					this.setState({ filterButton: true, flagDashboard: false });
				}
				if (this.state.privilages[0].name === "List of Estimation Slips") {
					this.setState({
						flagEstimationSlip: true,
						filterActive: false,
						estimationSlip: [],
					});
				} else {
					this.setState({ flagEstimationSlip: false });
				}
				if (this.state.privilages[0].name === "New Sale Report") {
					this.setState({
						newSale: [],
						flagNewSale: true,
						filterActive: false,
					});
				} else {
					this.setState({ flagNewSale: false });
				}
				if (this.state.privilages[0].name === "Goods Return") {
					this.setState({
						goodsReturn: [],
						flagGoodsReturn: true,
						filterActive: false,
					});
				} else {
					this.setState({ flagGoodsReturn: false });
				}
				if (this.state.privilages[0].name === "Sales Summary") {
					this.setState({
						salesSumaryObject: [],
						flagSalesSummary: true,
						filterActive: false,
					});
				} else {
					this.setState({ flagSalesSummary: false });
				}
				if (this.state.privilages[0].name === "List of Barcodes") {
					this.setState({
						listBarcodes: [],
						flagListBarcodes: true,
						filterActive: false,
					});
				} else {
					this.setState({ flagListBarcodes: false });
				}
				if (this.state.privilages[0].name === "List of Promotions") {
					this.setState({
						listPromotions: [],
						flagListPromotions: true,
						filterActive: false,
					});
				} else {
					this.setState({ flagListPromotions: false });
				}
			}
		});
	}

	topbarAction1 = (item, index) => {
		if (item.name === "Dashboard") {
			this.setState({ filterButton: false, flagDashboard: true });
		} else {
			this.setState({ filterButton: true, flagDashboard: false });
		}
		if (item.name === "List of Estimation Slips") {
			this.setState({
				estimationSlip: [],
				flagEstimationSlip: true,
				filterActive: false,
			});
		} else {
			this.setState({ flagEstimationSlip: false });
		}
		if (item.name === "New Sale Report") {
			this.setState({ newSale: [], flagNewSale: true, filterActive: false });
		} else {
			this.setState({ flagNewSale: false });
		}
		if (item.name === "Goods Return") {
			this.setState({
				goodsReturn: [],
				flagGoodsReturn: true,
				filterActive: false,
			});
		} else {
			this.setState({ flagGoodsReturn: false });
		}
		if (item.name === "Sales Summary") {
			this.setState({
				salesSumaryObject: [],
				flagSalesSummary: true,
				filterActive: false,
			});
		} else {
			this.setState({ flagSalesSummary: false });
		}
		if (item.name === "List of Barcodes") {
			this.setState({
				listBarcodes: [],
				flagListBarcodes: true,
				filterActive: false,
			});
		} else {
			this.setState({ flagListBarcodes: false });
		}
		if (item.name === "List of promotions") {
			this.setState({
				listPromotions: [],
				flagListPromotions: true,
				filterActive: false,
			});
		} else {
			this.setState({ flagListPromotions: false });
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

	filterAction() {
		if (this.state.flagDashboard === true) {
			this.setState({ flagFilterDashboard: true, modalVisible: true });
		} else {
			this.setState({ flagFilterDashboard: false });
		}
		if (this.state.flagEstimationSlip === true) {
			this.setState({ flagFilterEstimationSlip: true, modalVisible: true });
		} else {
			this.setState({ flagFilterEstimationSlip: false });
		}
		if (this.state.flagNewSale === true) {
			this.setState({ flagFilterNewSale: true, modalVisible: true });
		} else {
			this.setState({ flagFilterNewSale: false });
		}
		if (this.state.flagGoodsReturn === true) {
			this.setState({ flagFilterGoodsReturn: true, modalVisible: true });
		} else {
			this.setState({ flagFilterGoodsReturn: false });
		}
		if (this.state.flagSalesSummary === true) {
			this.setState({ flagFilterSalesSumary: true, modalVisible: true });
		} else {
			this.setState({ flagFilterSalesSumary: false });
		}
		if (this.state.flagListBarcodes === true) {
			this.setState({ flagFilterListBarcodes: true, modalVisible: true });
		} else {
			this.setState({ flagFilterListBarcodes: false });
		}
		if (this.state.flagListPromotions === true) {
			this.setState({ flagFilterListPromotions: true, modalVisible: true });
		} else {
			this.setState({ flagFilterListPromotions: false });
		}
		this.setState({ modalVisible: true });
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

	modelClose() {
		this.setState({ modalVisible: false });
	}

	modelCancel = () => {
		this.modelClose();
	};

	getDetails = (data) => {
		this.setState({ estimationSlip: [] });
		this.setState({ estimationSlip: data });
	};

	getNewsaleDetails = (data) => {
		this.setState({ newSale: [] });
		this.setState({ newSale: data });
	};

	getgoodsReturn = (data) => {
		this.setState({ goodsReturn: [] });
		this.setState({ goodsReturn: data });
	};

	getsalesSumary = (data) => {
		this.setState({ salesSumary: [] });
		this.setState({ salesSumary: data });
		console.log(this.state.salesSumary);
	};

	getsalesSumaryObject = (data) => {
		this.setState({ salesSumaryObject: [1, 2, 3] });
	};

	getlistBarcodes = (data) => {
		this.setState({ listBarcodes: [] });
		this.setState({ listBarcodes: data });
		console.log(this.state.listBarcodes);
	};

	getlistofPromotions = (data) => {
		this.setState({ listPromotions: [] });
		this.setState({ listPromotions: data });
		console.log(this.state.listPromotions);
	};

	filterCahngeAction() {
		// alert("hey");
		this.setState({ filterActive: true });
	}

	filterChange = () => {
		this.filterCahngeAction();
	};

	clearFilter() {
		alert("cleared Functions");
	}

	clearFilterAction() {
		if (this.state.flagEstimationSlip === true) {
			this.setState({ filterActive: false }, () => {
				this.setState({ flagEstimationSlip: true, estimationSlip: [] });
			});
		} else if (this.state.flagNewSale === true) {
			this.setState({ filterActive: false }, () => {
				this.setState({ flagNewSale: true, newSale: [] });
			});
		} else if (this.state.flagGoodsReturn === true) {
			this.setState({ filterActive: false }, () => {
				this.setState({ flagGoodsReturn: true, goodsReturn: [] });
			});
		} else if (this.state.flagSalesSummary === true) {
			this.setState({ filterActive: false }, () => {
				this.setState({
					flagSalesSummary: true,
					salesSumary: [],
					salesSumaryObject: [],
				});
			});
		} else if (this.state.flagListBarcodes === true) {
			this.setState({ filterActive: false }, () => {
				this.setState({ flagListBarcodes: true, listBarcodes: [] });
			});
		} else if (this.state.flagListPromotions === true) {
			this.setState({ filterActive: false }, () => {
				this.setState({ flagListPromotions: true, listPromotions: [] });
			});
		}
	}

	render() {
		return (
			<View style={styles.container}>
				{/* <View style={Device.isTablet ? styles.viewsWidth_tablet : styles.viewsWidth_mobile}>
          <TouchableOpacity style={Device.isTablet ? styles.menuButton_tablet : styles.menuButton_mobile} onPress={() => this.handleMenuButtonClick()}>
            <Image source={require('../assets/images/menu.png')} />
          </TouchableOpacity>
          <Text style={Device.isTablet ? styles.headerTitle_tablet : styles.headerTitle_mobile}> {I18n.t("Reports")} </Text>
          {this.state.filterButton &&
            <View>
              {!this.state.filterActive &&
                <TouchableOpacity
                  style={Device.isTablet ? styles.filterButton_tablet : styles.filterButton_mobile}
                  onPress={() => this.filterAction()} >
                  <Image style={{ alignSelf: 'center', top: 5 }} source={require('../assets/images/promofilter.png')} />
                </TouchableOpacity>
              }
              {this.state.filterActive &&
                <TouchableOpacity
                  style={Device.isTablet ? styles.filterButton_tablet : styles.filterButton_mobile}
                  onPress={() => this.clearFilterAction()} >
                  <Image style={{ alignSelf: 'center', top: 5 }} source={require('../assets/images/clearFilterSearch.png')} />
                </TouchableOpacity>
              }
            </View>
          }
        </View> */}
				<ScrollView>
					<View style={styles.container}>
						<FlatList
							style={scss.pageNavigationContainer}
							horizontal
							data={this.state.privilages}
							showsVerticalScrollIndicator={false}
							showsHorizontalScrollIndicator={false}
							ListEmptyComponent={
								<Text
									style={{
										color: "#cc241d",
										textAlign: "center",
										fontFamily: "bold",
										fontSize: Device.isTablet ? 21 : 17,
										marginTop: deviceheight / 3,
										marginLeft: deviceWidth / 3.5,
									}}
								>
									&#9888; Privileges Not Found
								</Text>
							}
							renderItem={({ item, index }) => (
								<TouchableOpacity
									style={[
											scss.pageNavigationBtn,
											{
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
							ListFooterComponent={<View style={{ width: 15 }}></View>}
						/>

						{this.state.flagDashboard && <ReportsDashboard />}

						{this.state.flagEstimationSlip && (
							<ListOfEstimationSlip
								estimationSlip={this.state.estimationSlip}
								filterActiveCallback={this.filterChange}
								childParams={this.getDetails}
								clearFilter={this.state.refreshPage}
								modalVisible={this.state.modalVisible}
								flagFilterEstimationSlip={this.state.flagFilterEstimationSlip}
								modelCancelCallback={this.modelCancel}
							/>
						)}

						{this.state.flagNewSale && (
							<NewSaleReport
								filterActiveCallback={this.filterChange}
								newSale={this.state.newSale}
								childParamNewsales={this.getNewsaleDetails}
								modalVisible={this.state.modalVisible}
								modelCancelCallback={this.modelCancel}
								flagFilterNewSale={this.state.flagFilterNewSale}
							/>
						)}

						{this.state.flagGoodsReturn && (
							<GoodsReturn
								filterActiveCallback={this.filterChange}
								goodsReturn={this.state.goodsReturn}
								childParamgoodsReturn={this.getgoodsReturn}
								modalVisible={this.state.modalVisible}
								modelCancelCallback={this.modelCancel}
								flagFilterGoodsReturn={this.state.flagFilterGoodsReturn}
							/>
						)}

						{this.state.flagSalesSummary && (
							<SalesSumary
								filterActiveCallback={this.filterChange}
								salesSumary={this.state.salesSumary}
								salesSumaryObject={this.state.salesSumaryObject}
								childParamSalesSummaryObject={this.getsalesSumaryObject}
								childParamSalesSummary={this.getsalesSumary}
								modalVisible={this.state.modalVisible}
								modelCancelCallback={this.modelCancel}
								flagFilterSalesSumary={this.state.flagFilterSalesSumary}
							/>
						)}

						{this.state.flagListBarcodes && (
							<ListOfBarcodes
								filterActiveCallback={this.filterChange}
								listBarcodes={this.state.listBarcodes}
								childParamlistBarcodes={this.getlistBarcodes}
								modalVisible={this.state.modalVisible}
								modelCancelCallback={this.modelCancel}
								flagFilterListBarcodes={this.state.flagFilterListBarcodes}
							/>
						)}

						{this.state.flagListPromotions && (
							<ListOfPromotions
								filterActiveCallback={this.filterChange}
								listPromotions={this.state.listPromotions}
								childParamlistofPromotions={this.getlistofPromotions}
								flagFilterListPromotions={this.state.flagFilterListPromotions}
								modalVisible={this.state.modalVisible}
								modelCancelCallback={this.modelCancel}
							/>
						)}
					</View>
				</ScrollView>
			</View>
		);
	}
}
export default Reports;

const pickerSelectStyles_mobile = StyleSheet.create({
	placeholder: {
		color: "#6F6F6F",
		fontFamily: "regular",
		fontSize: RF(15),
	},
	inputIOS: {
		justifyContent: "center",
		height: RH(42),
		borderRadius: 3,
		borderWidth: 1,
		fontFamily: "regular",
		//paddingLeft: -20,
		fontSize: RF(15),
		borderColor: "#FBFBFB",
		backgroundColor: "#FBFBFB",
	},
	inputAndroid: {
		justifyContent: "center",
		height: RH(42),
		borderRadius: 3,
		borderWidth: 1,
		fontFamily: "regular",
		//paddingLeft: -20,
		fontSize: RF(15),
		borderColor: "#FBFBFB",
		backgroundColor: "#FBFBFB",
		color: "#001B4A",

		// marginLeft: RW(20),
		// marginRight: RW(20),
		// marginTop: RH(10),
		// height: RH(40),
		// backgroundColor: '#ffffff',
		// borderBottomColor: '#456CAF55',
		// color: '#001B4A',
		// fontFamily: "bold",
		// fontSize: RF(16),
		// borderRadius: 3,
	},
});

const pickerSelectStyles_tablet = StyleSheet.create({
	placeholder: {
		color: "#6F6F6F",
		fontFamily: "regular",
		fontSize: RF(20),
	},
	inputIOS: {
		justifyContent: "center",
		height: 52,
		borderRadius: 3,
		borderWidth: 1,
		fontFamily: "regular",
		//paddingLeft: -20,
		fontSize: RF(20),
		borderColor: "#FBFBFB",
		backgroundColor: "#FBFBFB",
	},
	inputAndroid: {
		justifyContent: "center",
		height: 52,
		borderRadius: 3,
		borderWidth: 1,
		fontFamily: "regular",
		//paddingLeft: -20,
		fontSize: RF(20),
		borderColor: "#FBFBFB",
		backgroundColor: "#FBFBFB",
		color: "#001B4A",

		// marginLeft: RW(20),
		// marginRight: RW(20),
		// marginTop: RH(10),
		// height: RH(40),
		// backgroundColor: '#ffffff',
		// borderBottomColor: '#456CAF55',
		// color: '#001B4A',
		// fontFamily: "bold",
		// fontSize: RF(16),
		// borderRadius: 3,
	},
});

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
	},
	imagealign: {
		marginTop: Device.isTablet ? RH(25) : RH(20),
		marginRight: Device.isTablet ? RW(30) : RW(20),
	},
	container: {
		flex: 1,
		justifyContent: "center",
		// backgroundColor: '#FAFAFF'
	},
	flatList: {
		marginTop: RH(20),
	},
	modalActive: {
		backgroundColor: "#000000",
	},
	modalInActive: {
		backgroundColor: "#ffffff",
	},
	modalActiveText: {
		color: "#ffffff",
	},
	modalInActiveText: {
		color: "#000000",
	},
	modalButton1: {
		borderBottomLeftRadius: 5,
		borderTopLeftRadius: 5,
	},
	modalButton2: {
		borderBottomRightRadius: 5,
		borderTopRightRadius: 5,
	},

	// Styles For Mobile
	viewsWidth_mobile: {
		backgroundColor: "#ffffff",
		width: deviceWidth,
		textAlign: "center",
		fontSize: RF(24),
		height: Device.isAndroid ? RH(70) : RH(84),
	},
	menuButton_mobile: {
		position: "absolute",
		left: RW(10),
		bottom: RH(5),
		width: RW(40),
		height: RH(40),
	},
	headerTitle_mobile: {
		position: "absolute",
		left: RW(70),
		bottom: RH(10),
		width: RW(300),
		height: RH(25),
		fontFamily: "bold",
		fontSize: RF(18),
		color: "#353C40",
	},
	filterButton_mobile: {
		position: "absolute",
		right: RW(20),
		top: RH(25),
		backgroundColor: "#ffffff",
		borderRadius: 5,
		width: RW(30),
		height: RH(32),
	},
	modalContainer_mobile: {
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "row",
		alignSelf: "center",
		marginRight: RW(20),
		borderRadius: 5,
		marginTop: RH(20),
		borderColor: "#ED1C24",
		width: "100%",
		height: RH(50),
	},
	modalButton_mobile: {
		borderColor: "#353C40",
		height: RH(32),
		width: "33.3%",
		borderWidth: 1,
		alignSelf: "flex-start",
	},
	modalButtonText_mobile: {
		height: RH(32),
		width: RW(100),
		marginTop: RH(5),
		fontFamily: "medium",
		fontSize: RF(12),
		textAlign: "center",
		alignItems: "center",
	},
	navigationToButton_mobile: {
		position: "absolute",
		right: RW(70),
		bottom: RH(10),
		backgroundColor: "#ED1C24",
		borderRadius: 5,
		width: RW(110),
		height: RH(32),
		textAlign: "center",
		alignItems: "center",
	},
	onlyNavigationToButton_mobile: {
		position: "absolute",
		right: RW(20),
		bottom: RH(10),
		backgroundColor: "#ED1C24",
		borderRadius: 5,
		width: RW(110),
		height: RH(32),
		textAlign: "center",
		alignItems: "center",
	},
	navigationToButtonText_mobile: {
		fontSize: RF(12),
		fontFamily: "regular",
		color: "#ffffff",
		marginTop: RH(8),
		textAlign: "center",
		alignSelf: "center",
	},
	filterBarcodeContainer_mobile: {
		width: deviceWidth,
		alignItems: "center",
		marginLeft: -RW(20),
		backgroundColor: "#ffffff",
		height: RH(500),
		position: "absolute",
		bottom: -RH(20),
	},
	filterByTitle_mobile: {
		position: "absolute",
		left: RW(20),
		top: RH(15),
		width: RW(300),
		height: RH(20),
		fontFamily: "medium",
		fontSize: RF(16),
		color: "#353C40",
	},
	filterByTitleDecoration_mobile: {
		height: Device.isTablet ? 2 : 1,
		width: deviceWidth,
		backgroundColor: "lightgray",
		marginTop: RH(50),
	},
	filterCloseButton_mobile: {
		position: "absolute",
		right: 8,
		top: RH(15),
		width: RW(50),
		height: RH(50),
	},
	filterCloseImage_mobile: {
		color: "#ED1C24",
		fontFamily: "regular",
		fontSize: RF(12),
		position: "absolute",
		top: RH(10),
		right: 0,
	},
	filterDateButton_mobile: {
		width: deviceWidth - RW(40),
		marginLeft: RW(20),
		marginRight: RW(20),
		marginTop: RH(10),
		borderColor: "#8F9EB717",
		borderRadius: 3,
		height: RH(50),
		backgroundColor: "#F6F6F6",
		borderRadius: 5,
	},
	filterDateButtonText_mobile: {
		marginLeft: RW(16),
		marginTop: RH(20),
		color: "#6F6F6F",
		fontSize: RF(15),
		fontFamily: "regular",
	},
	datePickerContainer_mobile: {
		height: RH(280),
		width: deviceWidth,
		backgroundColor: "#ffffff",
	},
	datePickerButton_mobile: {
		position: "absolute",
		left: RW(20),
		top: RH(10),
		height: RH(30),
		backgroundColor: "#ED1C24",
		borderRadius: 5,
	},
	datePickerEndButton_mobile: {
		position: "absolute",
		right: RW(20),
		top: RH(10),
		height: RH(30),
		backgroundColor: "#ED1C24",
		borderRadius: 5,
	},
	datePickerButtonText_mobile: {
		textAlign: "center",
		marginTop: RH(5),
		color: "#ffffff",
		fontSize: RF(15),
		fontFamily: "regular",
	},
	input_mobile: {
		justifyContent: "center",
		marginLeft: RW(20),
		marginRight: RW(20),
		height: RH(44),
		marginTop: RH(5),
		marginBottom: RH(10),
		borderColor: "#8F9EB717",
		borderRadius: 3,
		backgroundColor: "#FBFBFB",
		borderWidth: 1,
		fontFamily: "regular",
		paddingLeft: RW(15),
		fontSize: RF(14),
	},
	filterApplyButton_mobile: {
		width: deviceWidth - RW(40),
		marginLeft: RW(20),
		marginRight: RW(20),
		marginTop: RH(20),
		height: RH(50),
		backgroundColor: "#ED1C24",
		borderRadius: 5,
	},
	filterButtonText_mobile: {
		textAlign: "center",
		marginTop: RH(20),
		color: "#ffffff",
		fontSize: RF(15),
		fontFamily: "regular",
	},
	filterCancelButton_mobile: {
		width: deviceWidth - RW(40),
		marginLeft: RW(20),
		marginRight: RW(20),
		marginTop: RH(20),
		height: RH(50),
		backgroundColor: "#ffffff",
		borderRadius: 5,
		borderWidth: 1,
		borderColor: "#353C4050",
	},
	filterButtonCancelText_mobile: {
		textAlign: "center",
		marginTop: RH(20),
		color: "#000000",
		fontSize: RF(15),
		fontFamily: "regular",
	},
	flatlistContainer_mobile: {
		height: RH(140),
		backgroundColor: "#FBFBFB",
		borderBottomWidth: 5,
		borderBottomColor: "#FFFFFF",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	flatlistSubContainer_mobile: {
		flexDirection: "column",
		width: "100%",
		height: RH(140),
	},
	rnSelect_mobile: {
		color: "#8F9EB7",
		fontSize: RF(15),
	},
	rnSelectContainer_mobile: {
		justifyContent: "center",
		margin: RH(20),
		height: RH(44),
		marginTop: RH(5),
		marginBottom: RH(10),
		borderColor: "#8F9EB717",
		borderRadius: 3,
		backgroundColor: "#FBFBFB",
		borderWidth: 1,
		fontFamily: "regular",
		paddingLeft: RW(15),
		fontSize: RF(14),
	},

	// Styles For Tablet
	viewsWidth_tablet: {
		backgroundColor: "#ffffff",
		width: deviceWidth,
		textAlign: "center",
		fontSize: RF(28),
		height: RH(90),
	},
	menuButton_tablet: {
		position: "absolute",
		left: RW(10),
		top: 38,
		width: 90,
		height: RH(90),
	},
	headerTitle_tablet: {
		position: "absolute",
		left: RW(70),
		top: RH(40),
		width: RW(300),
		height: RH(40),
		fontFamily: "bold",
		fontSize: RF(24),
		color: "#353C40",
	},
	filterButton_tablet: {
		position: "absolute",
		right: RW(20),
		top: RH(40),
		backgroundColor: "#ffffff",
		borderRadius: 5,
		width: RW(35),
		height: RH(37),
	},
	modalContainer_tablet: {
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "row",
		alignSelf: "center",
		marginRight: RW(20),
		borderRadius: 5,
		marginTop: RH(20),
		borderColor: "#ED1C24",
		width: "100%",
		height: RH(50),
	},
	modalButton_tablet: {
		borderColor: "#353C40",
		height: RH(42),
		width: "33.3%",
		borderWidth: 1,
		alignSelf: "flex-start",
	},
	modalButtonText_tablet: {
		height: RH(42),
		width: RW(210),
		marginTop: RH(5),
		fontFamily: "medium",
		fontSize: RF(17),
		textAlign: "center",
		alignItems: "center",
	},
	navigationToButton_tablet: {
		position: "absolute",
		right: RW(70),
		top: RH(40),
		backgroundColor: "#ED1C24",
		borderRadius: 5,
		width: RW(110),
		height: RH(32),
		textAlign: "center",
		alignItems: "center",
	},
	onlyNavigationToButton_tablet: {
		position: "absolute",
		right: RW(20),
		top: RH(40),
		backgroundColor: "#ED1C24",
		borderRadius: 5,
		width: RW(110),
		height: RH(32),
		textAlign: "center",
		alignItems: "center",
	},
	navigationToButtonText_tablet: {
		fontSize: RF(17),
		fontFamily: "regular",
		color: "#ffffff",
		marginTop: RH(6),
		textAlign: "center",
		alignSelf: "center",
	},
	filterBarcodeContainer_tablet: {
		width: deviceWidth,
		alignItems: "center",
		marginLeft: -RW(40),
		backgroundColor: "#ffffff",
		height: RH(600),
		position: "absolute",
		bottom: -RH(40),
	},
	filterByTitle_tablet: {
		position: "absolute",
		left: RW(20),
		top: RH(15),
		width: RW(300),
		height: RH(30),
		fontFamily: "medium",
		fontSize: RF(21),
		color: "#353C40",
	},
	filterByTitleDecoration_tablet: {
		height: Device.isTablet ? 2 : 1,
		width: deviceWidth,
		backgroundColor: "lightgray",
		marginTop: RH(60),
	},
	filterCloseButton_tablet: {
		position: "absolute",
		right: RW(24),
		top: RH(10),
		width: RW(60),
		height: RH(60),
	},
	filterCloseImage_tablet: {
		color: "#ED1C24",
		fontFamily: "regular",
		fontSize: RF(17),
		position: "absolute",
		top: RH(10),
		right: RW(24),
	},
	filterDateButton_tablet: {
		width: deviceWidth - RW(30),
		marginLeft: RW(20),
		marginRight: RW(20),
		marginTop: RH(10),
		borderColor: "#8F9EB717",
		borderRadius: 3,
		height: RH(60),
		backgroundColor: "#F6F6F6",
		borderRadius: 5,
	},
	filterDateButtonText_tablet: {
		marginLeft: RW(16),
		marginTop: RH(20),
		color: "#6F6F6F",
		fontSize: RF(20),
		fontFamily: "regular",
	},
	datePickerButton_tablet: {
		position: "absolute",
		left: RW(20),
		top: RH(10),
		height: RH(40),
		backgroundColor: "#ED1C24",
		borderRadius: 5,
	},
	datePickerButtonText_tablet: {
		textAlign: "center",
		marginTop: RH(5),
		color: "#ffffff",
		fontSize: RF(20),
		fontFamily: "regular",
	},
	datePickerEndButton_tablet: {
		position: "absolute",
		right: RW(20),
		top: RH(10),
		height: RH(40),
		backgroundColor: "#ED1C24",
		borderRadius: 5,
	},
	input_tablet: {
		justifyContent: "center",
		marginLeft: RW(20),
		marginRight: RW(20),
		height: RH(54),
		marginTop: RH(5),
		marginBottom: RH(10),
		borderColor: "#8F9EB717",
		borderRadius: 3,
		backgroundColor: "#FBFBFB",
		borderWidth: 1,
		fontFamily: "regular",
		paddingLeft: RW(15),
		fontSize: RF(20),
	},
	filterApplyButton_tablet: {
		width: deviceWidth - RW(40),
		marginLeft: RW(20),
		marginRight: RW(20),
		marginTop: RH(20),
		height: RH(60),
		backgroundColor: "#ED1C24",
		borderRadius: 5,
	},
	filterButtonText_tablet: {
		textAlign: "center",
		marginTop: RH(20),
		color: "#ffffff",
		fontSize: RF(20),
		fontFamily: "regular",
	},
	filterCancelButton_tablet: {
		width: deviceWidth - RW(40),
		marginLeft: RW(20),
		marginRight: RW(20),
		marginTop: RH(20),
		height: RH(60),
		backgroundColor: "#ffffff",
		borderRadius: 5,
		borderWidth: 1,
		borderColor: "#353C4050",
	},
	filterButtonCancelText_tablet: {
		textAlign: "center",
		marginTop: RH(20),
		color: "#000000",
		fontSize: RF(20),
		fontFamily: "regular",
	},
	flatlistContainer_tablet: {
		height: RH(160),
		backgroundColor: "#FBFBFB",
		borderBottomWidth: 5,
		borderBottomColor: "#FFFFFF",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	flatlistSubContainer_tablet: {
		flexDirection: "column",
		width: "100%",
		height: RH(160),
	},
	rnSelect_tablet: {
		color: "#8F9EB7",
		fontSize: RF(20),
	},
	rnSelectContainer_tablet: {
		justifyContent: "center",
		margin: RH(20),
		height: RH(54),
		marginTop: RH(5),
		marginBottom: RH(10),
		borderColor: "#8F9EB717",
		borderRadius: 3,
		backgroundColor: "#FBFBFB",
		borderWidth: 1,
		fontFamily: "regular",
		paddingLeft: RW(15),
		fontSize: RF(20),
	},
});

// Styles For Flat-Lists

const flats = StyleSheet.create({
	mainText_mobile: {
		fontSize: RF(16),
		marginLeft: RW(16),
		marginTop: RH(10),
		marginBottom: RH(10),
		fontFamily: "medium",
		color: "#ED1C24",
	},
	subText_mobile: {
		fontSize: RF(12),
		marginLeft: RW(16),
		marginTop: RH(10),
		marginBottom: RH(10),
		fontFamily: "medium",
		color: "#353C40",
	},
	commonText_mobile: {
		fontSize: RF(12),
		marginBottom: RH(10),
		marginTop: -RH(90),
		alignSelf: "center",
		textAlign: "center",
		fontFamily: "regular",
		color: "#808080",
	},
	commonTextsub_mobile: {
		fontSize: RF(12),
		marginBottom: RH(10),
		marginTop: RH(10),
		alignSelf: "center",
		textAlign: "center",
		fontFamily: "regular",
		color: "#808080",
	},
	editButton_mobile: {
		position: "absolute",
		right: RW(50),
		top: RH(90),
		width: RW(30),
		height: RH(30),
		borderBottomLeftRadius: 5,
		borderTopLeftRadius: 5,
		borderWidth: 1,
		borderColor: "lightgray",
		// borderRadius:5,
	},
	deleteButton_mobile: {
		position: "absolute",
		right: RW(20),
		top: RH(90),
		width: RW(30),
		height: RH(30),
		borderBottomRightRadius: 5,
		borderTopRightRadius: 5,
		borderWidth: 1,
		borderColor: "lightgray",
	},
	deleteBarcodeContainer_mobile: {
		width: deviceWidth,
		alignItems: "center",
		marginLeft: -RW(20),
		backgroundColor: "#ffffff",
		height: RH(260),
		position: "absolute",
		bottom: -RH(20),
	},
	deleteBarcodeHeading_mobile: {
		position: "absolute",
		left: RW(20),
		top: RH(15),
		width: RW(300),
		height: RH(20),
		fontFamily: "medium",
		fontSize: RF(16),
		color: "#353C40",
	},

	// Tablet styles

	mainText_tablet: {
		fontSize: RF(21),
		marginLeft: RW(16),
		marginTop: RH(10),
		marginBottom: RH(10),
		fontFamily: "medium",
		color: "#ED1C24",
	},
	subText_tablet: {
		fontSize: RF(17),
		marginLeft: RW(16),
		marginTop: RH(10),
		marginBottom: RH(10),
		fontFamily: "medium",
		color: "#353C40",
	},
	commonText_tablet: {
		fontSize: RF(17),
		marginBottom: RH(10),
		marginTop: -120,
		alignSelf: "center",
		textAlign: "center",
		fontFamily: "regular",
		color: "#808080",
	},
	commonTextsub_tablet: {
		fontSize: RF(17),
		marginBottom: RH(10),
		marginTop: RH(10),
		alignSelf: "center",
		textAlign: "center",
		fontFamily: "regular",
		color: "#808080",
	},
	editButton_tablet: {
		position: "absolute",
		right: RW(50),
		top: RH(90),
		width: RW(30),
		height: RH(40),
		borderBottomLeftRadius: 5,
		borderTopLeftRadius: 5,
		borderWidth: 1,
		borderColor: "lightgray",
		// borderRadius:5,
	},
	deleteButton_tablet: {
		position: "absolute",
		right: RW(20),
		top: RH(90),
		width: RW(30),
		height: RH(40),
		borderBottomRightRadius: 5,
		borderTopRightRadius: 5,
		borderWidth: 1,
		borderColor: "lightgray",
	},
	deleteBarcodeContainer_tablet: {
		width: deviceWidth,
		alignItems: "center",
		marginLeft: -RW(20),
		backgroundColor: "#ffffff",
		height: RH(280),
		position: "absolute",
		bottom: -RH(20),
	},
	deleteBarcodeHeading_tablet: {
		position: "absolute",
		left: RW(20),
		top: RH(15),
		width: RW(300),
		height: RH(30),
		fontFamily: "medium",
		fontSize: RF(21),
		color: "#353C40",
	},
});
