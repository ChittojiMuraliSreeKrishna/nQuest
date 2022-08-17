import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component } from "react";
import {
	Dimensions,
	FlatList,
	Image,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import Device from "react-native-device-detection";
import I18n from "react-native-i18n";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Modal from "react-native-modal";
import RNPickerSelect from "react-native-picker-select";
import { Chevron } from "react-native-shapes";
import scss from "../../commonUtils/assets/styles/style.scss";
import Loader from "../../commonUtils/loader";
import UrmService from "../services/UrmService";
import {
	cancelBtn,
	cancelBtnText,
	inputField,
	rnPicker,
	rnPickerContainer,
	submitBtn,
	submitBtnText,
} from "../Styles/FormFields";
import {
	filterCloseImage,
	filterHeading,
	filterMainContainer,
	filterSubContainer,
} from "../Styles/PopupStyles";
import { filterBtn } from "../Styles/Styles";
var deviceWidth = Dimensions.get("window").width;
var deviceHeight = Dimensions.get("window").height;

export default class Stores extends Component {
	constructor(props) {
		super(props);
		this.state = {
			storesDelete: false,
			modalVisible: true,
			storesList: [],
			city: "",
			storeName: "",
			storeDistrict: "",
			storeState: "",
			modalFalse: false,
			statesArray: [],
			states: [],
			stateId: 0,
			statecode: "",
			dictrictArray: [],
			dictricts: [],
			districtId: "",
			filterStoresData: [],
			loading: false,
			flagFilterOpen: false,
			filterActive: false,
			pageNumber: 0,
		};
	}

	componentDidMount() {
		this.getStoresList();
		this.getMasterStatesList();
		this.getMasterDistrictsList();
	}

	// Edit Store Navigation
	handleeditStore(item, index) {
		console.log(item);
		this.props.navigation.navigate("AddStore", {
			item: item,
			isEdit: true,
			onGoBack: () => this.refresh(),
			goBack: () => this.refresh(),
		});
	}

	// Create Store Navigation
	handleCreateStore(item, index) {
		this.props.navigation.navigate("AddStore", {
			isEdit: false,
			onGoBack: () => this.refresh(),
			goBack: () => this.refresh(),
		});
	}

	// Refreshing Stores
	refresh() {
		this.setState({ storesList: [] }, () => {
			this.getStoresList();
		});
	}

	// Get All Stores
	async getStoresList() {
		this.setState({ storesList: [] });
		const clientId = await AsyncStorage.getItem("custom:clientId1");
		console.log({ clientId });
		this.setState({ loading: true });
		const { pageNumber } = this.state;
		const isActive = false;
		UrmService.getAllStores(clientId, pageNumber, isActive)
			.then((res) => {
				if (res) {
					if (res.data) {
						let response = res.data;
						console.log({ response });
						this.setState({
							storesList: this.state.storesList.concat(response),
						});
					}
				}
				this.setState({ loading: false });
			})
			.catch((err) => {
				console.error({ err });
				this.setState({ loading: false });
				if (this.state.flagStore === true) {
					this.setState({ storeError: "Records Not Found" });
					// alert("There is an Error while Getting Stores");
				}
			});
	}

	// Filter Actions
	// Store States
	getMasterStatesList() {
		this.setState({ states: [] });
		this.setState({ loading: false });
		var states = [];
		UrmService.getStates().then((res) => {
			if (res.data["result"]) {
				for (var i = 0; i < res.data["result"].length; i++) {
					states.push({
						value: res.data.result[i].stateCode,
						label: res.data.result[i].stateName,
					});

					if (res.data["result"][i].stateId === this.state.stateId) {
						console.log("stateId is" + this.state.statesArray[i].name);
						this.setState({ storeState: this.state.statesArray[i].name });
						this.getMasterDistrictsList();
						this.getGSTNumber();
					}
				}
				this.setState({
					states: states,
				});
				this.setState({ statesArray: this.state.statesArray });
			}
		});
	}
	handleStoreState = (value) => {
		this.setState({ storeState: value, statecode: value }, () => {
			console.log(this.state.statecode, "yktld");
			this.getMasterDistrictsList(this.state.statecode);
		});
	};

	// Store Districts
	getMasterDistrictsList() {
		this.setState({ loading: false, dictricts: [], dictrictArray: [] });
		UrmService.getDistricts(this.state.statecode).then((res) => {
			if (res.data["result"]) {
				this.setState({ loading: false });
				let dictricts = [];
				for (var i = 0; i < res.data["result"].length; i++) {
					dictricts.push({
						value: res.data.result[i].districtId,
						label: res.data.result[i].districtName,
					});
					this.setState({
						dictricts: dictricts,
					});
					this.setState({ dictrictArray: this.state.dictrictArray });
					if (this.state.dictrictArray[i].id === this.state.districtId) {
						console.log("district name  is" + this.state.dictrictArray[i].name);
						this.setState({ storeDistrict: this.state.dictrictArray[i].name });
					}
				}
			}
		});
	}
	handleDistrict = (value) => {
		this.setState({ storeDistrict: value, districtId: value });
	};

	// Store Name Actions
	handleStoreName = (value) => {
		this.setState({ storeName: value });
	};

	// Applying Filter
	applyStoreFilter() {
		const searchStore = {
			stateId: this.state.statecode,
			cityId: null,
			districtId: this.state.districtId ? this.state.districtId : 0,
			storeName: this.state.storeName ? this.state.storeName : null,
		};
		console.log("store search", searchStore);
		UrmService.getStoresBySearch(searchStore)
			.then((res) => {
				if (res) {
					if (res.data.isSuccess === "true") {
						this.setState({
							filterStoresData: res.data.result,
							filterActive: true,
						});
					} else {
						this.setState({ filterStoresData: [], filterActive: true });
					}
					console.log(res.data);
				}
				this.setState({ flagFilterOpen: false });
			})
			.catch((err) => {
				this.setState({ flagFilterOpen: false, filterActive: false });
			});
	}

	// Filter Cancel Actions
	filterAction() {
		this.setState({ flagFilterOpen: true, modalVisible: true });
	}
	clearFilterAction() {
		this.setState({ filterActive: false });
		this.getStoresList();
	}
	modelCancel() {
		this.setState({ modalVisible: false, flagFilterOpen: false });
	}

	render() {
		return (
			<View style={scss.mainContainer}>
				{this.state.loading && <Loader loading={this.state.loading} />}
				<FlatList
					ListHeaderComponent={
						<View style={scss.headerContainer}>
							<Text style={scss.flat_heading}>
								Stores -{" "}
								<Text style={{ color: "#ED1C24" }}>
									{this.state.storesList.length}
								</Text>
							</Text>
							<View style={scss.subHeader}>
								<TouchableOpacity
									style={[filterBtn]}
									onPress={() => this.handleCreateStore()}
								>
									<Image
										style={{
											alignSelf: "flex-end",
											height: 20,
											width: 30,
										}}
										source={require("../../commonUtils/assets/Images/add_store.png")}
									/>
								</TouchableOpacity>
								{!this.state.filterActive && (
									<TouchableOpacity
										style={filterBtn}
										onPress={() => this.filterAction()}
									>
										<Image
											style={{ alignSelf: "flex-end" }}
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
											style={{ alignSelf: "center" }}
											source={require("../assets/images/clearFilterSearch.png")}
										/>
									</TouchableOpacity>
								)}
							</View>
						</View>
					}
					data={
						this.state.filterActive
							? this.state.filterStoresData
							: this.state.storesList
					}
					scrollEnabled={true}
					keyExtractor={(item, i) => i.toString()}
					style={scss.flatListBody}
					ListEmptyComponent={
						<Text
							style={{
								color: "#cc241d",
								textAlign: "center",
								fontFamily: "bold",
								fontSize: Device.isTablet ? 21 : 17,
								marginTop: deviceHeight / 3,
							}}
						>
							&#9888; Records Not Found
						</Text>
					}
					renderItem={({ item, index }) => (
						<View>
							<ScrollView>
								<View style={scss.flatListContainer}>
									<View style={scss.flatListSubContainer}>
										<View style={scss.textContainer}>
											<Text style={scss.textStyleLight}>
												{I18n.t("Store Name")} {"\n"}
												<Text style={scss.textStyleMedium}>{item.name}</Text>
											</Text>
											<Text style={(scss.textStyleLight, scss.text_right)}>
												{I18n.t("Store Id")}
												{"\n"}
												<Text style={[scss.textStyleMedium, scss.text_right]}>
													{item.id}{" "}
												</Text>
											</Text>
										</View>
										<View style={scss.textContainer}>
											<Text style={scss.textStyleLight}>
												{I18n.t("Location")}
												{"\n"}
												<Text style={scss.textStyleMedium}>{item.cityId} </Text>
											</Text>
											<View style={scss.buttonContainer}>
												{item.isActive ? (
													<Text style={scss.textStyleLight}>
														Status{"\n"}
														<Text
															style={[scss.textStyleMedium, scss.active_txt]}
														>
															Active
														</Text>
													</Text>
												) : (
													<Text
														style={[
															scss.textStyleMedium,
															{
																backgroundColor: "#ee0000",
																color: "#ffffff",
																marginTop: 5,
																padding: Device.isTablet ? 10 : 5,
																alignSelf: "flex-start",
																borderRadius: 5,
																fontFamily: "medium",
															},
														]}
													>
														In-Active
													</Text>
												)}
											</View>
										</View>
										<View style={scss.textContainer}>
											<Text style={scss.textStyleLight}>
												{I18n.t("Created By")}
												{"\n"}
												<Text style={scss.textStyleMedium}>
													{item.createdBy}
												</Text>
											</Text>
										</View>
										<View style={scss.flatListFooter}>
											<Text style={scss.footerText}>
												{I18n.t("Date")} :{" "}
												{item.createdDate
													? item.createdDate.toString().split(/T/)[0]
													: item.createdDate}
											</Text>
											<TouchableOpacity
												style={scss.footerSingleBtn}
												onPress={() => this.handleeditStore(item, index)}
											>
												<Image
													style={scss.footerBtnImg}
													source={require("../../commonUtils/assets/Images/edit.png")}
												/>
											</TouchableOpacity>
										</View>
									</View>
								</View>
							</ScrollView>
						</View>
					)}
				/>
				{this.state.flagFilterOpen && (
					<View>
						<Modal isVisible={this.state.modalVisible} style={{ margin: 0 }}>
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
													style={{ margin: 5 }}
													source={require("../assets/images/modelcancel.png")}
												/>
											</TouchableOpacity>
										</View>
									</View>
									<Text
										style={{
											height: Device.isTablet ? 2 : 1,
											width: deviceWidth,
											backgroundColor: "lightgray",
										}}
									></Text>
								</View>
								<KeyboardAwareScrollView enableOnAndroid={true}>
									<View style={rnPickerContainer}>
										<RNPickerSelect
											placeholder={{
												label: "STATE",
											}}
											Icon={() => {
												return (
													<Chevron
														style={styles.imagealign}
														size={1.5}
														color="gray"
													/>
												);
											}}
											items={this.state.states}
											onValueChange={(value) => this.handleStoreState(value)}
											style={rnPicker}
											value={this.state.storeState}
											useNativeAndroidPickerStyle={false}
										/>
									</View>
									<View style={rnPickerContainer}>
										<RNPickerSelect
											placeholder={{
												label: "DISTRICT",
											}}
											Icon={() => {
												return (
													<Chevron
														style={styles.imagealign}
														size={1.5}
														color="gray"
													/>
												);
											}}
											items={this.state.dictricts}
											onValueChange={(value) => this.handleDistrict(value)}
											style={rnPicker}
											value={this.state.storeDistrict}
											useNativeAndroidPickerStyle={false}
										/>
									</View>
									<TextInput
										style={inputField}
										underlineColorAndroid="transparent"
										placeholder={I18n.t("STORE NAME")}
										placeholderTextColor="#6F6F6F"
										textAlignVertical="center"
										autoCapitalize="none"
										value={this.state.storeName}
										onChangeText={this.handleStoreName}
									/>
									<TouchableOpacity
										style={submitBtn}
										onPress={() => this.applyStoreFilter()}
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
	imagealign: {
		marginTop: Device.isTablet ? 25 : 20,
		marginRight: Device.isTablet ? 30 : 20,
	},
});
