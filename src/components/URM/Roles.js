import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component } from "react";
import {
	Dimensions,
	FlatList,
	Image,
	ScrollView,
	Text,

	TouchableOpacity,
	View,
} from "react-native";
import { TextInput } from "react-native-paper";
import DatePicker from "react-native-date-picker";
import Device from "react-native-device-detection";
import I18n from "react-native-i18n";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Modal from "react-native-modal";
import scss from "../../commonUtils/assets/styles/style.scss";
import EmptyList from "../Errors/EmptyList";
import UrmService from "../services/UrmService";
import {
	cancelBtn,
	cancelBtnText,
	datePicker,
	datePickerBtnText,
	datePickerButton1,
	datePickerButton2,
	datePickerContainer,
	dateSelector,
	dateText,
	inputField,
	submitBtn,
	submitBtnText,
} from "../Styles/FormFields";
import forms from '../../commonUtils/assets/styles/formFields.scss';

import {
	filterCloseImage,
	filterHeading,
	filterMainContainer,
	filterSubContainer,
} from "../Styles/PopupStyles";
import { filterBtn, flatListTitle } from "../Styles/Styles";

var deviceheight = Dimensions.get("window").height;
var deviceWidth = Dimensions.get("window").width;

export default class Roles extends Component {
	constructor(props) {
		super(props);
		this.state = {
			clientId: "",
			rolesData: [],
			filterRolesData: [],
			pageNumber: 0,
			flagFilterOpen: false,
			modalVisible: true,
			createdDate: "",
			date: new Date(),
			role: ''
		};
	}

	async componentDidMount() {
		const clientId = await AsyncStorage.getItem("custom:clientId1");
		this.setState({ clientId: clientId });
		this.getRolesList();
	}

	// Refreshing the List
	refresh() {
		this.setState({ rolesData: [] }, () => {
			this.getRolesList();
		});
	}

	// Getting Roles List
	getRolesList() {
		this.setState({ rolesData: [] });
		const { clientId, pageNumber } = this.state;
		UrmService.getAllRoles(clientId, pageNumber).then((res) => {
			if (res) {
				let response = res.data;
				console.log({ response });
				this.setState({ rolesData: res.data });
			}
		});
	}

	// Filter Section
	filterAction() {
		this.setState({ flagFilterOpen: true, modalVisible: true });
	}

	// Create Role Navigation
	navigateToCreateRoles() {
		this.props.navigation.navigate("CreateRole", {
			isEdit: false,
			onGoBack: () => this.refresh(),
			goBack: () => this.refresh(),
		});
	}

	// Filter Clear Action
	clearFilterAction() {
		this.setState({ filterActive: false });
		this.getRolesList();
	}

	// Filter Cancel Action
	modelCancel() {
		this.setState({ modalVisible: false });
	}

	// Created By Action
	handleCreatedBy = (value) => {
		this.setState({ createdBy: value });
	};

	// Role Name Action
	handleRole = (value) => {
		this.setState({ role: value });
	};

	// Created Date Action
	datepickerClicked() {
		this.setState({ datepickerOpen: true });
	}

	datepickerCancelClicked() {
		this.setState({
			date: new Date(),
			enddate: new Date(),
			datepickerOpen: false,
			datepickerendOpen: false,
		});
	}

	datepickerDoneClicked() {
		if (
			parseInt(this.state.date.getDate()) < 10 &&
			parseInt(this.state.date.getMonth()) < 10
		) {
			this.setState({
				createdDate:
					this.state.date.getFullYear() +
					"-0" +
					(this.state.date.getMonth() + 1) +
					"-" +
					"0" +
					this.state.date.getDate(),
			});
		} else if (parseInt(this.state.date.getDate()) < 10) {
			this.setState({
				createdDate:
					this.state.date.getFullYear() +
					"-" +
					(this.state.date.getMonth() + 1) +
					"-" +
					"0" +
					this.state.date.getDate(),
			});
		} else if (parseInt(this.state.date.getMonth()) < 10) {
			this.setState({
				createdDate:
					this.state.date.getFullYear() +
					"-0" +
					(this.state.date.getMonth() + 1) +
					"-" +
					this.state.date.getDate(),
			});
		} else {
			this.setState({
				createdDate:
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

	// Apply Filter Action
	applyRoleFilter() {
		const { role, createdBy, createdDate } = this.state;
		this.setState({ loading: true });
		const searchRole = {
			roleName: role ? role : null,
			createdBy: createdBy ? createdBy : null,
			createdDate: createdDate ? createdDate : null,
		};
		console.log(searchRole);
		UrmService.getRolesBySearch(searchRole).then((res) => {
			console.log(res);
			if (res && res.data && res.data['status'] === 200) {
				let rolesList = res.data.result;
				console.log({ rolesList });
				this.setState({ filterRolesData: rolesList, filterActive: true });
			}
			else {
				alert(res && res.data && res.data.message)
			}
			this.setState({ loading: false, modalVisible: false, role: '', createdBy: '' });
		})
	}

	// Edit Role Action
	handleeditrole(item, index) {
		this.props.navigation.navigate("CreateRole", {
			item: item,
			isEdit: true,
			onGoBack: () => this.refresh(),
			goBack: () => this.refresh(),
		});
	}

	render() {
		const { filterActive, rolesData, filterRolesData } = this.state;
		return (
			<View>
				<FlatList
					style={scss.flatListBody}
					ListHeaderComponent={
						<View style={scss.headerContainer}>
							<Text style={flatListTitle}>
								Roles -{" "}
								<Text style={{ color: "#ED1C24" }}>
									{this.state.rolesData.length}
								</Text>
							</Text>
							<View style={scss.headerContainer}>
								<TouchableOpacity
									style={filterBtn}
									onPress={() => this.navigateToCreateRoles()}
								>
									<Text style={{ fontSize: 20 }}>+</Text>
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
					data={filterActive ? filterRolesData : rolesData}
					ListEmptyComponent={<EmptyList message={this.state.rolesError} />}
					scrollEnabled={true}
					renderItem={({ item, index }) => (
						<View>
							<ScrollView>
								<View style={scss.flatListContainer}>
									<View style={scss.flatListSubContainer}>
										<View style={scss.textContainer}>
											<Text style={scss.highText}>S.No {index + 1}</Text>
										</View>
										<View style={scss.textContainer}>
											<Text style={scss.textStyleMedium}>
												Role: {item.roleName}
											</Text>
											<Text style={scss.textStyleLight}>
												User Count: {item.usersCount}
											</Text>
										</View>
										<View style={scss.textContainer}>
											<Text style={scss.textStyleMedium}>
												Created By: {item.createdBy}
											</Text>
										</View>
										<View style={scss.flatListFooter}>
											<Text style={scss.footerText}>
												Date:{" "}
												{item.createdDate
													? item.createdDate.toString().split(/T/)[0]
													: item.createdDate}
											</Text>
											<TouchableOpacity
												style={scss.footerSingleBtn}
												onPress={() => this.handleeditrole(item, index)}
											>
												<Image
													style={scss.footerBtnImg}
													source={require("../assets/images/edit.png")}
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
									<TextInput
										mode="outlined"
										outlineColor="#dfdfdf"
										activeOutlineColor="#dfdfdf"
										style={inputField}
										underlineColorAndroid="transparent"
										placeholder={I18n.t("ROLE")}
										placeholderTextColor="#6F6F6F"
										textAlignVertical="center"
										autoCapitalize="none"
										value={this.state.role}
										onChangeText={this.handleRole}
									/>
									<TextInput
										mode="outlined"
										outlineColor="#dfdfdf"
										activeOutlineColor="#dfdfdf"
										style={inputField}
										underlineColorAndroid="transparent"
										placeholder={I18n.t("CREATED BY")}
										placeholderTextColor="#6F6F6F"
										textAlignVertical="center"
										autoCapitalize="none"
										value={this.state.createdBy}
										onChangeText={this.handleCreatedBy}
									/>
									<TouchableOpacity
										style={dateSelector}
										testID="openModal"
										onPress={() => this.datepickerClicked()}
									>
										<Text style={dateText}>
											{" "}
											{this.state.createdDate === ""
												? "CREATED DATE"
												: this.state.createdDate}
										</Text>
										<Image
											style={{ position: "absolute", top: 10, right: 0 }}
											source={require("../assets/images/calender.png")}
										/>
									</TouchableOpacity>
									{this.state.datepickerOpen && (
										<View style={datePickerContainer}>
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
											<DatePicker
												style={datePicker}
												date={this.state.date}
												mode={"date"}
												onDateChange={(date) => this.setState({ date })}
											/>
										</View>
									)}
									<View style={forms.action_buttons_container}>
										<TouchableOpacity style={[forms.action_buttons, forms.submit_btn]}
											onPress={() => this.applyRoleFilter()}>
											<Text style={forms.submit_btn_text} >{I18n.t("APPLY")}</Text>
										</TouchableOpacity>
										<TouchableOpacity style={[forms.action_buttons, forms.cancel_btn]}
											onPress={() => this.modelCancel()}>
											<Text style={forms.cancel_btn_text}>{I18n.t("CANCEL")}</Text>
										</TouchableOpacity>
									</View>
								</KeyboardAwareScrollView>
							</View>
						</Modal>
					</View>
				)}
			</View>
		);
	}
}
