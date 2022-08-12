import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { Component } from "react";
import {
	Dimensions,
	FlatList,
	Image,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import Device from "react-native-device-detection";
import I18n from "react-native-i18n";
import Modal from "react-native-modal";
import Loader from "../../commonUtils/loader";
import Stores from "../Accounting/Stores";
import EmptyList from "../Errors/EmptyList";
import UrmService from "../services/UrmService";
import {
	deleteCloseBtn,
	deleteContainer,
	deleteHeader,
	deleteHeading,
	deleteText,
	filterCloseImage,
	filterHeading,
	filterSubContainer,
} from "../Styles/PopupStyles";
import Roles from "./Roles";
import UrmDashboard from "./UrmDashboard";
import Users from "./users";

import scss from "../../commonUtils/assets/styles/HeaderStyles.scss";
var deviceheight = Dimensions.get("window").height;
var deviceWidth = Dimensions.get("window").width;

export default class UserManagement extends Component {
	constructor(props) {
		super(props);
		this.state = {
			flagUser: false,
			flagRole: false,
			flagFilterRoles: false,
			flagFilterUsers: false,
			filterButton: false,
			modalVisible: true,
			createdDate: "",
			date: new Date(),
			role: "",
			createdBy: "",
			branch: "",
			rolesData: [],
			usersData: [],
			roleDelete: false,
			userDelete: false,
			privilages: [],
			headerNames: [],
			clientId: 0,
			doneButtonClicked: false,
			navtext: "",
			flagDashboard: false,
			filterActive: false,
			usersError: "",
			rolesError: "",
			flagStore: false,
			configHeaders: [{ name: "Stores" }, { name: "Roles" }, { name: "Users" }],
		};
	}

	async componentDidMount() {
		const clientId = await AsyncStorage.getItem("custom:clientId1");
		this.setState({ clientId: clientId });
		console.log({ clientId });
		AsyncStorage.getItem("rolename").then((value) => {
			console.log({ value });
			if (value === "config_user") {
				for (let i = 0; i < this.state.configHeaders.length; i++) {
					if (i === 0) {
						this.state.privilages.push({
							bool: true,
							name: this.state.configHeaders[i].name,
						});
						this.setState({ flagStore: true });
					} else {
						this.state.privilages.push({
							bool: false,
							name: this.state.configHeaders[i].name,
						});
					}
				}
			} else {
				UrmService.getPrivillagesByRoleName(value).then((res) => {
					let resp = res.data.parentPrivileges;
					console.log({ resp });
					if (res) {
						if (res.data) {
							let len = res.data.parentPrivileges.length;
							for (let i = 0; i < len; i++) {
								let privilege = res.data.parentPrivileges[i];
								console.log({ privilege });
								if (privilege.name === "URM Portal") {
									let privilegeId = privilege.id;
									let sublen = privilege.subPrivileges.length;
									let subPrivileges = privilege.subPrivileges;
									console.log({ subPrivileges });
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
			}
		});
	}

	initialNavigation() {
		this.setState({ privilages: this.state.privilages }, () => {
			// console.error(this.state.privilages.length)
			if (this.state.privilages.length > 0) {
				if (this.state.privilages[0].name === "Dashboard") {
					this.setState({
						flagUser: false,
						flagRole: false,
						flagDashboard: true,
						filterButton: false,
					});
				} else if (this.state.privilages[0].name === "Users") {
					this.setState({
						flagUser: true,
						flagRole: false,
						flagDashboard: false,
						filterButton: true,
						filterActive: false,
					});
				} else if (this.state.privilages[0].name === "Roles") {
					this.setState({
						flagUser: false,
						flagRole: true,
						flagDashboard: false,
						filterButton: true,
						filterActive: false,
					});
				} else if (this.state.privilages[0].name === "Stores") {
					this.setState({ flagStore: true });
				} else {
					this.setState({
						flagUser: false,
						flagRole: false,
						flagDashboard: false,
						filterButton: true,
						filterActive: false,
						flagStore: false,
					});
					console.log("please update the privilages in Line.no: 161");
				}
			}
		});
	}

	getRolesList() {
		this.setState({ rolesData: [] });
		this.setState({ loading: true });

		axios
			.get(UrmService.getAllRoles() + this.state.clientId)
			.then((res) => {
				let len = res.data["result"].length;
				if (len > 0) {
					for (let i = 0; i < len; i++) {
						let number = res.data.result[i];
						// console.log('sfsdfdfsdfdsfsfsdfs' + number);
						console.log(number);
						this.setState({ loading: false });
						this.state.rolesData.push(number);
					}
					this.setState({
						rolesData: this.state.rolesData,
						rolesError: "",
						loading: false,
					});
				} else {
					this.setState({ rolesError: "Records Not Found", loading: false });
				}
			})
			.catch(() => {
				this.setState({ loading: false, rolesError: "Records Not Found" });
				console.log("There is an Error Getting Roles");
			});
	}

	topbarAction = (item, index) => {
		if (item.name === "Users") {
			this.setState(
				{
					flagUser: true,
					flagRole: false,
					flagDashboard: false,
					filterButton: true,
					filterActive: false,
					flagStore: false,
				},
				() => {},
			);
		} else if (item.name === "Roles") {
			this.setState(
				{
					flagRole: true,
					flagUser: false,
					flagDashboard: false,
					filterButton: true,
					flagStore: false,
					filterActive: false,
				},
				() => {
					this.getRolesList();
				},
			);
		} else if (item.name === "Dashboard") {
			this.setState({
				flagRole: false,
				flagUser: false,
				flagDashboard: true,
				filterButton: false,
				flagStore: false,
			});
		} else if (item.name === "Stores") {
			this.setState({
				flagRole: false,
				flagUser: false,
				flagDashboard: false,
				filterButton: false,
				flagStore: true,
			});
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

	handleBackButtonClick() {
		this.props.navigation.openDrawer();
	}

	render() {
		return (
			<View style={[styles.mainContainer, { backgroundColor: "#fff" }]}>
				{this.state.loading && <Loader loading={this.state.loading} />}
				<SafeAreaView style={styles.mainContainer}>
					<ScrollView>
						<View style={styles.container}>
							<FlatList
								style={scss.pageNavigationContainer}
								horizontal
								data={this.state.privilages}
								ListEmptyComponent={
									<EmptyList message={this.state.rolesError} />
								}
								showsVerticalScrollIndicator={false}
								showsHorizontalScrollIndicator={false}
								renderItem={({ item, index }) => (
									<TouchableOpacity
										style={[
											scss.pageNavigationBtn,
											{ borderColor: item.bool ? "#ED1C24" : "#d7d7d7" },
										]}
										onPress={() => this.topbarAction(item, index)}
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
							{console.log(this.state.privilages)}
						</View>
						<View>
							{this.state.flagDashboard && <UrmDashboard />}
							{this.state.flagRole && (
								<Roles
									ref={(instance) => {
										this.child = instance;
									}}
									navigation={this.props.navigation}
								/>
							)}
							{this.state.flagUser && (
								<Users
									ref={(instance) => {
										this.child = instance;
									}}
									navigation={this.props.navigation}
								/>
							)}
							{this.state.flagStore && (
								<Stores
									ref={(instance) => {
										this.child = instance;
									}}
									navigation={this.props.navigation}
								/>
							)}
						</View>
						{this.state.flagRole && this.state.roleDelete && (
							<View>
								<Modal
									isVisible={this.state.modalVisible}
									style={{ margin: 0 }}
								>
									<View style={deleteContainer}>
										<View>
											<View style={filterSubContainer}>
												<View style={deleteHeader}>
													<Text style={filterHeading}>
														{" "}
														{I18n.t("Delete Role")}{" "}
													</Text>
												</View>
												<View>
													<TouchableOpacity
														style={filterCloseImage}
														onPress={() => this.modelCancel()}
													>
														<Image
															style={deleteCloseBtn}
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

										<Text style={deleteText}>
											{" "}
											{I18n.t("Are you sure want to delete Role")} ?{" "}
										</Text>
										<TouchableOpacity
											style={filterSubmitBtn}
											onPress={() => this.deleteRole(item, index)}
										>
											<Text style={filterApplyBtnText}>
												{" "}
												{I18n.t("DELETE")}{" "}
											</Text>
										</TouchableOpacity>

										<TouchableOpacity
											style={filterCancelBtn}
											onPress={() => this.modelCancel()}
										>
											<Text style={filterCancelBtnText}>
												{" "}
												{I18n.t("CANCEL")}{" "}
											</Text>
										</TouchableOpacity>
									</View>
								</Modal>
							</View>
						)}
						{this.state.flagUser && this.state.userDelete && (
							<View>
								<Modal
									isVisible={this.state.modalVisible}
									style={{ margin: 0 }}
								>
									<View style={deleteContainer}>
										<View>
											<View style={deleteHeader}>
												<View>
													<Text style={deleteHeading}>
														{" "}
														{I18n.t("Delete User")}{" "}
													</Text>
												</View>
												<View>
													<TouchableOpacity
														style={filterCloseImage}
														onPress={() => this.modelCancel()}
													>
														<Image
															style={deleteCloseBtn}
															source={require("../assets/images/modalCloseWhite.png")}
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
										<Text style={deleteText}>
											{" "}
											{I18n.t("Are you sure want to delete User")}?{" "}
										</Text>
										<TouchableOpacity
											style={filterSubmitBtn}
											onPress={() => this.deleteUser(item, index)}
										>
											<Text style={filterApplyBtnText}>
												{" "}
												{I18n.t("DELETE")}{" "}
											</Text>
										</TouchableOpacity>

										<TouchableOpacity
											style={filterCancelBtn}
											onPress={() => this.modelCancel()}
										>
											<Text style={filterCancelBtnText}>
												{" "}
												{I18n.t("CANCEL")}{" "}
											</Text>
										</TouchableOpacity>
									</View>
								</Modal>
							</View>
						)}
					</ScrollView>
				</SafeAreaView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
	},
	imagealign: {
		marginTop: Device.isTablet ? 25 : 20,
		marginRight: Device.isTablet ? 30 : 20,
	},
	container: {
		flex: 1,
		justifyContent: "center",
		// backgroundColor: '#FAFAFF'
	},
	flatList: {
		marginTop: 20,
	},
});
