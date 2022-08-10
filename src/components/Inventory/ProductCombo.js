import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component } from "react";
import {
	Dimensions,
	FlatList,
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import DatePicker from "react-native-date-picker";
import Device from "react-native-device-detection";
import I18n from "react-native-i18n";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Modal from "react-native-modal";
import scss from "../../commonUtils/assets/styles/style.scss";
import Loader from "../../commonUtils/loader";
import { RH, RW } from "../../Responsive";
import InventoryService from "../services/InventoryService";
import {
	cancelBtn,
	cancelBtnText,
	datePicker,
	datePickerBtnText,
	datePickerButton1,
	datePickerButton2,
	dateSelector,
	dateText,
	submitBtn,
	submitBtnText,
} from "../Styles/FormFields";
import {
	filterCloseImage,
	filterHeading,
	filterMainContainer,
	filterSubContainer,
} from "../Styles/PopupStyles";
import {
	filterBtn,
	flatListMainContainer,
	flatlistSubContainer,
	flatListTitle,
	highText,
	listEmptyMessage,
	textContainer,
	textStyleLight,
	textStyleMedium,
} from "../Styles/Styles";
var deviceWidth = Dimensions.get("window").width;
var deviceheight = Dimensions.get("window").height;

export default class ProductCombo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			domainId: 0,
			storeId: 0,
			fromDate: "",
			toDate: "",
			productComboList: [],
			loading: false,
			filterActive: false,
			flagFilterOpen: false,
			modalVisible: true,
			startDate: "",
			endDate: "",
			date: new Date(),
			enddate: new Date(),
		};
	}

	async componentDidMount() {
		const storeId = await AsyncStorage.getItem("storeId");
		this.setState({ storeId: parseInt(storeId) });
		this.getAllProductsCombo();
	}

	// Refreshing the codes
	refresh() {
		this.setState({ productComboList: [] }, () => {
			this.getAllProductsCombo();
		});
	}

	async getAllProductsCombo() {
		this.setState({ loading: true });
		const { storeId, fromDate, toDate } = this.state;
		let params = `?storeId=${storeId}`;
		console.log({ params });
		InventoryService.getProductCombo(params)
			.then((res) => {
				console.log({ res });
				let productComboList = res.data.result.content;
				console.log({ productComboList });
				this.setState({ productComboList: productComboList, loading: false });
			})
			.catch((err) => {
				console.log({ err });
				this.setState({ loading: false });
			});
	}

	filterAction() {
		this.setState({ flagFilterOpen: true, modalVisible: true });
	}

	clearFilterAction() {
		this.setState({ filterActive: false });
	}

	modelCancel() {
		this.setState({ modalVisible: false });
	}

	// Date Actions
	datepickerClicked() {
		this.setState({ datepickerOpen: true });
	}

	enddatepickerClicked() {
		this.setState({ datepickerendOpen: true });
	}
	datepickerDoneClicked() {
		if (
			parseInt(this.state.date.getDate()) < 10 &&
			parseInt(this.state.date.getMonth()) < 10
		) {
			this.setState({
				startDate:
					this.state.date.getFullYear() +
					"-0" +
					(this.state.date.getMonth() + 1) +
					"-" +
					"0" +
					this.state.date.getDate(),
			});
		} else if (parseInt(this.state.date.getDate()) < 10) {
			this.setState({
				startDate:
					this.state.date.getFullYear() +
					"-" +
					(this.state.date.getMonth() + 1) +
					"-" +
					"0" +
					this.state.date.getDate(),
			});
		} else if (parseInt(this.state.date.getMonth()) < 10) {
			this.setState({
				startDate:
					this.state.date.getFullYear() +
					"-0" +
					(this.state.date.getMonth() + 1) +
					"-" +
					this.state.date.getDate(),
			});
		} else {
			this.setState({
				startDate:
					this.state.date.getFullYear() +
					"-" +
					(this.state.date.getMonth() + 1) +
					"-" +
					this.state.date.getDate(),
			});
		}
		this.setState({
			doneButtonClicked: true,
			datepickerOpen: false,
			datepickerendOpen: false,
		});
	}

	datepickerendDoneClicked() {
		if (
			parseInt(this.state.enddate.getDate()) < 10 &&
			parseInt(this.state.enddate.getMonth()) < 10
		) {
			this.setState({
				endDate:
					this.state.enddate.getFullYear() +
					"-0" +
					(this.state.enddate.getMonth() + 1) +
					"-" +
					"0" +
					this.state.enddate.getDate(),
			});
		} else if (parseInt(this.state.enddate.getDate()) < 10) {
			this.setState({
				endDate:
					this.state.enddate.getFullYear() +
					"-" +
					(this.state.enddate.getMonth() + 1) +
					"-" +
					"0" +
					this.state.enddate.getDate(),
			});
		} else if (parseInt(this.state.enddate.getMonth()) < 10) {
			this.setState({
				endDate:
					this.state.enddate.getFullYear() +
					"-0" +
					(this.state.enddate.getMonth() + 1) +
					"-" +
					this.state.enddate.getDate(),
			});
		} else {
			this.setState({
				endDate:
					this.state.enddate.getFullYear() +
					"-" +
					(this.state.enddate.getMonth() + 1) +
					"-" +
					this.state.enddate.getDate(),
			});
		}
		this.setState({
			enddoneButtonClicked: true,
			datepickerOpen: false,
			datepickerendOpen: false,
		});
	}

	datepickerCancelClicked() {
		this.setState({
			date: new Date(),
			enddate: new Date(),
			datepickerOpen: false,
			datepickerendOpen: false,
		});
	}

	handleAddProductCombo() {
		this.props.navigation.navigate("AddProduct", {
			isEdit: false,
			goBack: () => this.refresh(),
			onGoBack: () => this.refresh(),
		});
	}

	render() {
		return (
			<View>
				{this.state.loading && <Loader loading={this.state.loading} />}
				<FlatList
					style={scss.flatListBody}
					ListHeaderComponent={
						<View style={scss.headerContainer}>
							<Text style={flatListTitle}>
								Products Combo -{" "}
								<Text style={{ color: "#ED1C24" }}>
									{this.state.productComboList.length}
								</Text>{" "}
							</Text>
							<View style={scss.headerContainer}>
								<TouchableOpacity
									style={filterBtn}
									onPress={() => this.handleAddProductCombo()}
								>
									<Image
										style={{ marginTop: 8 }}
										source={require("../../commonUtils/assets/Images/add_barcode.png")}
									/>
								</TouchableOpacity>
								{!this.state.filterActive && (
									<TouchableOpacity
										style={filterBtn}
										onPress={() => this.filterAction()}
									>
										<Image
											style={{ alignSelf: "center", top: 5 }}
											source={require("../assets/images/promofilter.png")}
										/>
									</TouchableOpacity>
								)}
								{this.state.filterActive && (
									<TouchableOpacity
										style={filterBtn}
										onPress={() => this.clearFilterAction()}
									>
										<Image
											style={{ alignSelf: "center", top: 5 }}
											source={require("../assets/images/clearFilterSearch.png")}
										/>
									</TouchableOpacity>
								)}
							</View>
						</View>
					}
					data={this.state.productComboList}
					scrollEnabled={true}
					keyExtractor={(item, i) => i.toString()}
					ListEmptyComponent={
						<Text style={listEmptyMessage}>&#9888; Records Not Found</Text>
					}
					renderItem={({ item, index }) => (
						<View style={flatListMainContainer}>
							<View style={flatlistSubContainer}>
								<View style={textContainer}>
									<Text style={highText}>Invetory-ID: {item.id}</Text>
								</View>
								<View style={textContainer}>
									<Text style={textStyleMedium}>Store Id: {item.storeId}</Text>
									<Text style={textStyleLight}>Combo Name: {item.name}</Text>
								</View>
								<View style={textContainer}>
									<Text style={textStyleLight}>
										No.of Items: {item.bundleQuantity}
									</Text>
									<Text style={textStyleLight}>Unit Price: {item.value}</Text>
								</View>
							</View>
						</View>
					)}
				/>
				{this.state.flagFilterOpen && (
					<View>
						<Modal style={{ margin: 0 }} isVisible={this.state.modalVisible}>
							<View style={filterMainContainer}>
								<View>
									<View style={filterSubContainer}>
										<View>
											<Text style={filterHeading}> {I18n.t("Filter By")} </Text>
										</View>
										<View>
											<TouchableOpacity
												style={filterCloseImage}
												onPress={() => this.modelCancel()}
											>
												<Image
													style={{ margin: RH(5) }}
													source={require("../assets/images/modelcancel.png")}
												/>
											</TouchableOpacity>
										</View>
									</View>
								</View>
								<KeyboardAwareScrollView enableOnAndroid={true}>
									<TouchableOpacity
										style={dateSelector}
										testID="openModal"
										onPress={() => this.datepickerClicked()}
									>
										<Text style={dateText}>
											{this.state.startDate === ""
												? "Start Date"
												: this.state.startDate}
										</Text>
										<Image
											style={styles.calenderpng}
											source={require("../assets/images/calender.png")}
										/>
									</TouchableOpacity>
									{this.state.datepickerOpen && (
										<View style={styles.dateTopView}>
											<View style={styles.dateTop2}>
												<TouchableOpacity
													style={datePickerButton1}
													onPress={() => this.datepickerCancelClicked()}
												>
													<Text style={datePickerBtnText}> Cancel </Text>
												</TouchableOpacity>

												<TouchableOpacity
													style={datePickerButton2}
													onPress={() => this.datepickerDoneClicked()}
												>
													<Text style={datePickerBtnText}> Done </Text>
												</TouchableOpacity>
											</View>
											<DatePicker
												style={datePicker}
												date={this.state.date}
												mode={"date"}
												onDateChange={(date) => this.setState({ date })}
											/>
										</View>
									)}
									<TouchableOpacity
										style={dateSelector}
										testID="openModal"
										onPress={() => this.enddatepickerClicked()}
									>
										<Text style={dateText}>
											{this.state.endDate === ""
												? "End Date"
												: this.state.endDate}
										</Text>
										<Image
											style={styles.calenderpng}
											source={require("../assets/images/calender.png")}
										/>
									</TouchableOpacity>

									{this.state.datepickerendOpen && (
										<View style={styles.dateTopView}>
											<View style={styles.dateTop2}>
												<View>
													<TouchableOpacity
														style={datePickerButton1}
														onPress={() => this.datepickerCancelClicked()}
													>
														<Text style={datePickerBtnText}> Cancel </Text>
													</TouchableOpacity>
												</View>
												<View>
													<TouchableOpacity
														style={datePickerButton2}
														onPress={() => this.datepickerendDoneClicked()}
													>
														<Text style={datePickerBtnText}> Done </Text>
													</TouchableOpacity>
												</View>
											</View>
											<DatePicker
												style={datePicker}
												date={this.state.enddate}
												mode={"date"}
												onDateChange={(enddate) => this.setState({ enddate })}
											/>
										</View>
									)}
									<TouchableOpacity
										style={submitBtn}
										onPress={() => this.applyBarcodeFilter()}
									>
										<Text style={submitBtnText}>{I18n.t("APPLY")}</Text>
									</TouchableOpacity>
									<TouchableOpacity
										style={cancelBtn}
										onPress={() => this.modelCancel()}
									>
										<Text style={cancelBtnText}>{I18n.t("CANCEL")}</Text>
									</TouchableOpacity>
								</KeyboardAwareScrollView>
							</View>
						</Modal>
					</View>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	spaceText: {
		height: Device.isTablet ? 2 : 1,
		width: deviceWidth,
		backgroundColor: "lightgray",
	},
	date: {
		width: deviceWidth,
		height: RH(200),
		marginTop: RH(50),
	},
	calenderpng: {
		position: "absolute",
		top: RH(10),
		right: 0,
	},
	dateTopView: {
		height: RW(280),
		width: deviceWidth,
		backgroundColor: "#ffffff",
	},
	dateTop2: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: Device.isTablet ? 15 : RH(10),
		marginLeft: Device.isTablet ? 20 : RW(10),
		marginRight: Device.isTablet ? 20 : RW(10),
	},
	mainContainer: {
		flex: 1,
	},
});
