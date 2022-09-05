import React, { Component } from "react";
import {
	Dimensions,
	Image,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import Device from "react-native-device-detection";
import { Appbar, TextInput } from "react-native-paper";
import RNPickerSelect from "react-native-picker-select";
import { Chevron } from "react-native-shapes";
import AccountingService from "../services/AccountingService";
import {
	cancelBtn,
	cancelBtnText,
	inputField,
	inputHeading,
	rnPicker,
	rnPickerContainer,
	submitBtn,
	submitBtnText,
} from "../Styles/FormFields";
import {
	backButton,
	backButtonImage,
	headerTitle,
	headerTitleContainer,
	headerTitleSubContainer,
} from "../Styles/Styles";

var deviceWidth = Dimensions.get("window").width;

export default class AddHsnCode extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hsnCode: "",
			taxAppliesOn: "",
			taxType: "",
			taxes: [],
			fromPrice: "",
			toPrice: "",
			description: "",
			taxId: "",
			taxAppliedTypes: [
				{ label: "Hsn Code", value: "Hsncode" },
				{ label: "Price Slab", value: "Priceslab" },
			],
			taxMasterArray: [],
			taxList: [],
			descriptionArray: [],
			descriptionList: [],
			taxAppliesArray: [],
			taxAppliesList: [],
			slabValues: [{ priceFrom: "", priceTo: "", taxId: "" }],
			isEdit: false,
			navText: "",
			taxLabel: "",
		};
	}

	async componentDidMount() {
		this.setState({ isEdit: this.props.route.params.isEdit }, () => {
			console.log(this.state.isEdit);
			if (this.state.isEdit === true) {
				const {
					taxAppliesOn,
					taxId,
					description,
					taxType,
					hsnCode,
					fromPrice,
					toPrice,
					taxAppliedType,
					taxList,
					id,
				} = this.props.route.params.item;
				this.setState({
					taxAppliesOn: taxAppliesOn,
					taxId: taxId,
					taxLabel: taxId,
					description: description,
					taxType: taxType,
					hsnCode: hsnCode,
					fromPrice: fromPrice,
					id: id,
					toPrice: toPrice,
					taxType: taxAppliedType,
					navText: "Edit HSN Code",
				});
			} else {
				this.setState({ navText: "Add HSN Code" });
			}
		});
		console.log("oooo", this.props.route.params);
		this.getAllTaxes();
		this.getDescription();
		this.getTaxAppliesOn();
	}

	getAllTaxes() {
		let taxList = [];
		AccountingService.getAllMasterTax().then((res) => {
			if (res) {
				console.log("Taxes", res.data);
				let len = res.data.result.length;
				if (len > 0) {
					for (let i = 0; i < len; i++) {
						let number = res.data.result[i];
						taxList.push({
							value: number.id,
							label: number.taxLabel,
						});
					}
					this.setState({
						taxList: taxList,
					});
				}
			}
		});
	}

	getDescription() {
		let descriptionList = [];
		AccountingService.getDescrition().then((res) => {
			if (res) {
				let len = res.data.result.length;
				if (len > 0) {
					for (let i = 0; i < len; i++) {
						let number = res.data.result[i];
						this.state.descriptionArray.push({
							name: number.name,
							id: number.id,
						});
						descriptionList.push({
							value: this.state.descriptionArray[i].name,
							label: this.state.descriptionArray[i].name,
						});
					}
					this.setState({
						descriptionList: descriptionList,
						descriptionArray: this.state.descriptionArray,
					});
				}
			}
		});
	}

	getTaxAppliesOn() {
		let taxAppliesList = [];
		AccountingService.getTaxAppliesOn().then((res) => {
			if (res) {
				let len = res.data.result.length;
				if (len > 0) {
					for (let i = 0; i < len; i++) {
						let number = res.data.result[i];
						this.state.taxAppliesArray.push({
							name: number.name,
							id: number.id,
						});
						taxAppliesList.push({
							value: this.state.taxAppliesArray[i].name,
							label: this.state.taxAppliesArray[i].name,
						});
					}
					this.setState({
						taxAppliesList: taxAppliesList,
						taxAppliesArray: this.state.taxAppliesArray,
					});
				}
			}
		});
	}

	handleBackButtonClick() {
		this.props.navigation.goBack(null);
		return true;
	}

	handleHsnCode = (value) => {
		this.setState({ hsnCode: value });
	};

	handleAppliesOn = (value) => {
		this.setState({ taxAppliesOn: value });
	};

	handleTaxLabel = (value) => {
		this.setState({ taxId: value, taxLabel: value });
	};

	handleTaxApplicableType = (value) => {
		this.setState({ taxType: value });
	};

	handleDescription = (value) => {
		this.setState({ description: value });
	};

	handlefromPrice = (value) => {
		this.setState({ fromPrice: value });
		let slabValues = this.state.slabValues;
		slabValues["priceFrom"] = value;
	};

	handleToPrice = (value) => {
		this.setState({ toPrice: value });
		let slabValues = this.state.slabValues;
		slabValues["priceTo"] = value;
	};
	updateHsnCode() {
		const {
			taxAppliesOn,
			taxId,
			description,
			taxType,
			hsnCode,
			fromPrice,
			toPrice,
			isEdit,
			id,
		} = this.state;
		const obj = {
			description: description ? description : "",
			hsnCode: hsnCode ? hsnCode : "",
			taxAppliedType: taxType ? taxType : "",
			taxAppliesOn: taxAppliesOn ? taxAppliesOn : "",
			taxId: taxType === "Hsncode" ? taxId : null,
			slabs:
				taxType === "Priceslab"
					? [{ priceFrom: fromPrice, priceTo: toPrice, taxId: taxId }]
					: [],
			id: parseInt(id),
		};
		console.log(obj);
		if (isEdit) {
			AccountingService.updateHsnCode(obj).then((res) => {
				if (res && res.status === 200) {
					alert("Hsn Updated Sucessfully");
					this.props.navigation.goBack();
					this.props.route.params.onGoBack();
				}
			});
		}
	}
	saveHsnCode() {
		const {
			taxAppliesOn,
			taxId,
			description,
			taxType,
			hsnCode,
			fromPrice,
			toPrice,
			isEdit,
		} = this.state;
		const obj = {
			description: description ? description : "",
			hsnCode: hsnCode ? hsnCode : "",
			taxAppliedType: taxType ? taxType : "",
			taxAppliesOn: taxAppliesOn ? taxAppliesOn : "",
			taxId: taxType === "Hsncode" ? taxId : null,
			slabs:
				taxType === "Priceslab"
					? [{ priceFrom: fromPrice, priceTo: toPrice, taxId: taxId }]
					: [],
		};
		console.log(obj);
		if (!isEdit) {
			AccountingService.saveHsnCode(obj).then((res) => {
				if (res) {
					console.log({ res });
					if (res.status === 200) {
						alert("Added HSN successfully");
					}
					this.props.navigation.goBack();
					this.props.route.params.onGoBack();
				}
			});
		}
	}
	cancel() {
		this.props.navigation.goBack(null);
		this.props.route.params.onGoBack(null);
		return true;
	}

	render() {
		return (
			<View style={styles.mainContainer}>
		<Appbar mode="center-aligned">
          <Appbar.BackAction onPress={() => this.handleBackButtonClick()}  />
          <Appbar.Content title={this.state.navText} />
        </Appbar>
				<ScrollView>
					<Text style={inputHeading}>HSN Code</Text>
					<TextInput
						style={inputField}
						underlineColorAndroid="transparent"
						placeholder="HSN Code"
						placeholderTextColor="#6F6F6F"
						textAlignVertical="center"
						autoCapitalize="none"
						value={this.state.hsnCode}
						onChangeText={this.handleHsnCode}
					/>
					{this.state.taxType === "Priceslab" ? (
						<View>
							<Text style={inputHeading}>Tax Label</Text>
							<View style={rnPickerContainer}>
								<RNPickerSelect
									placeholder={{
										label: "TAX Label",
										value: "",
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
									items={this.state.taxList}
									onValueChange={this.handleTaxLabel}
									style={rnPicker}
									value={this.state.taxLabel}
									useNativeAndroidPickerStyle={false}
								/>
							</View>
							<Text style={inputHeading}>From Price</Text>
							<TextInput
								style={inputField}
								underlineColorAndroid="transparent"
								placeholder="From Price"
								placeholderTextColor="#6F6F6F"
								textAlignVertical="center"
								autoCapitalize="none"
								value={this.state.fromPrice}
								onChangeText={this.handlefromPrice}
							/>
							<Text style={inputHeading}>To Price</Text>
							<TextInput
								style={inputField}
								underlineColorAndroid="transparent"
								placeholder="To Price"
								placeholderTextColor="#6F6F6F"
								textAlignVertical="center"
								autoCapitalize="none"
								value={this.state.toPrice}
								onChangeText={this.handleToPrice}
							/>
						</View>
					) : (
						<View>
							<Text style={inputHeading}>Tax Label</Text>
							<View style={rnPickerContainer}>
								<RNPickerSelect
									placeholder={{
										label: "TAX Label",
										value: "",
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
									items={this.state.taxList}
									onValueChange={this.handleTaxLabel}
									style={rnPicker}
									value={this.state.taxLabel}
									useNativeAndroidPickerStyle={false}
								/>
							</View>
						</View>
					)}
					<Text style={inputHeading}>Tax Applies On</Text>
					<View style={rnPickerContainer}>
						<RNPickerSelect
							placeholder={{
								label: "TAX %",
							}}
							Icon={() => {
								return (
									<Chevron style={styles.imagealign} size={1.5} color="gray" />
								);
							}}
							items={this.state.taxAppliesList}
							onValueChange={this.handleAppliesOn}
							style={rnPicker}
							value={this.state.taxAppliesOn}
							useNativeAndroidPickerStyle={false}
						/>
					</View>
					<Text style={inputHeading}>Description</Text>
					<View style={rnPickerContainer}>
						<RNPickerSelect
							placeholder={{
								label: "DESCRIPTION",
							}}
							Icon={() => {
								return (
									<Chevron style={styles.imagealign} size={1.5} color="gray" />
								);
							}}
							items={this.state.descriptionList}
							onValueChange={this.handleDescription}
							style={rnPicker}
							value={this.state.description}
							useNativeAndroidPickerStyle={false}
						/>
					</View>

					<Text style={inputHeading}>Tax Applied Type</Text>
					<View style={rnPickerContainer}>
						<RNPickerSelect
							placeholder={{
								label: "TAX TYPE",
							}}
							Icon={() => {
								return (
									<Chevron style={styles.imagealign} size={1.5} color="gray" />
								);
							}}
							items={this.state.taxAppliedTypes}
							onValueChange={this.handleTaxApplicableType}
							style={rnPicker}
							value={this.state.taxType}
							useNativeAndroidPickerStyle={false}
						/>
					</View>
					<TouchableOpacity
						style={submitBtn}
						onPress={() =>
							this.state.isEdit ? this.updateHsnCode() : this.saveHsnCode()
						}
					>
						<Text style={submitBtnText}>SAVE</Text>
					</TouchableOpacity>
					<TouchableOpacity style={cancelBtn} onPress={() => this.cancel()}>
						<Text style={cancelBtnText}>CANCEL</Text>
					</TouchableOpacity>
				</ScrollView>
			</View>
		);
	}
}

const pickerSelectStyles_mobile = StyleSheet.create({
	placeholder: {
		color: "#6F6F6F",
		fontFamily: "regular",
		fontSize: 15,
	},
	inputIOS: {
		justifyContent: "center",
		height: 42,
		borderRadius: 3,
		borderWidth: 1,
		fontFamily: "regular",
		//paddingLeft: -20,
		fontSize: 15,
		borderColor: "#FBFBFB",
		backgroundColor: "#FBFBFB",
	},
	inputAndroid: {
		justifyContent: "center",
		height: 42,
		borderRadius: 3,
		borderWidth: 1,
		fontFamily: "regular",
		//paddingLeft: -20,
		fontSize: 15,
		borderColor: "#FBFBFB",
		backgroundColor: "#FBFBFB",
		color: "#001B4A",
	},
});

const pickerSelectStyles_tablet = StyleSheet.create({
	placeholder: {
		color: "#6F6F6F",
		fontFamily: "regular",
		fontSize: 20,
	},
	inputIOS: {
		justifyContent: "center",
		height: 52,
		borderRadius: 3,
		borderWidth: 1,
		fontFamily: "regular",
		//paddingLeft: -20,
		fontSize: 20,
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
		fontSize: 20,
		borderColor: "#FBFBFB",
		backgroundColor: "#FBFBFB",
		color: "#001B4A",

		// marginLeft: 20,
		// marginRight: 20,
		// marginTop: 10,
		// height: 40,
		// backgroundColor: '#ffffff',
		// borderBottomColor: '#456CAF55',
		// color: '#001B4A',
		// fontFamily: "bold",
		// fontSize: 16,
		// borderRadius: 3,
	},
});

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		backgroundColor: "#fff",
	},
	imagealign: {
		marginTop: Device.isTablet ? 25 : 20,
		marginRight: Device.isTablet ? 30 : 20,
	},
	bottomContainer: {
		margin: 50,
	},

	// Styles For Mobile

	viewsWidth_mobile: {
		backgroundColor: "#ffffff",
		width: deviceWidth,
		textAlign: "center",
		fontSize: 24,
		height: 84,
	},
	backButton_mobile: {
		position: "absolute",
		left: 10,
		top: 30,
		width: 40,
		height: 40,
	},
	headerTitle_mobile: {
		position: "absolute",
		left: 70,
		top: 47,
		width: 300,
		height: 20,
		fontFamily: "bold",
		fontSize: 18,
		color: "#353C40",
	},
	input_mobile: {
		justifyContent: "center",
		marginLeft: 20,
		marginRight: 20,
		height: 44,
		marginTop: 5,
		marginBottom: 10,
		borderColor: "#8F9EB717",
		borderRadius: 3,
		backgroundColor: "#FBFBFB",
		borderWidth: 1,
		fontFamily: "regular",
		paddingLeft: 15,
		fontSize: 14,
	},
	saveButton_mobile: {
		margin: 8,
		height: 50,
		backgroundColor: "#ED1C24",
		borderRadius: 5,
	},
	saveButtonText_mobile: {
		textAlign: "center",
		marginTop: 15,
		color: "#ffffff",
		fontSize: 15,
		fontFamily: "regular",
	},
	cancelButton_mobile: {
		margin: 8,
		height: 50,
		backgroundColor: "#ffffff",
		borderRadius: 5,
		borderWidth: 1,
		borderColor: "#353C4050",
	},
	cancelButtonText_mobile: {
		textAlign: "center",
		marginTop: 15,
		color: "#353C4050",
		fontSize: 15,
		fontFamily: "regular",
	},
	flatlistContainer_mobile: {
		height: 140,
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
		height: 140,
	},
	rnSelect_mobile: {
		color: "#8F9EB7",
		fontSize: 15,
	},
	rnSelectContainer_mobile: {
		justifyContent: "center",
		height: 44,
		marginTop: 5,
		marginBottom: 10,
		marginLeft: 20,
		marginRight: 20,
		borderColor: "#8F9EB717",
		borderRadius: 3,
		backgroundColor: "#FBFBFB",
		borderWidth: 1,
		fontFamily: "regular",
		fontSize: 14,
	},

	// Styles For Tablet
	viewsWidth_tablet: {
		backgroundColor: "#ffffff",
		width: deviceWidth,
		textAlign: "center",
		fontSize: 28,
		height: 90,
	},
	backButton_tablet: {
		position: "absolute",
		left: 10,
		top: 25,
		width: 90,
		height: 90,
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
	input_tablet: {
		justifyContent: "center",
		marginLeft: 20,
		marginRight: 20,
		height: 54,
		marginTop: 5,
		marginBottom: 10,
		borderColor: "#8F9EB717",
		borderRadius: 3,
		backgroundColor: "#FBFBFB",
		borderWidth: 1,
		fontFamily: "regular",
		paddingLeft: 15,
		fontSize: 20,
	},
	saveButton_tablet: {
		margin: 8,
		height: 60,
		backgroundColor: "#ED1C24",
		borderRadius: 5,
	},
	saveButtonText_tablet: {
		textAlign: "center",
		marginTop: 15,
		color: "#ffffff",
		fontSize: 20,
		fontFamily: "regular",
	},
	cancelButton_tablet: {
		margin: 8,
		height: 60,
		backgroundColor: "#ffffff",
		borderRadius: 5,
		borderWidth: 1,
		borderColor: "#353C4050",
	},
	cancelButtonText_tablet: {
		textAlign: "center",
		marginTop: 15,
		color: "#353C4050",
		fontSize: 20,
		fontFamily: "regular",
	},
	flatlistContainer_tablet: {
		height: 160,
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
		height: 160,
	},
	rnSelect_tablet: {
		color: "#8F9EB7",
		fontSize: 20,
	},
	rnSelectContainer_tablet: {
		justifyContent: "center",
		height: 54,
		marginTop: 5,
		marginBottom: 10,
		marginLeft: 20,
		marginRight: 20,
		borderColor: "#8F9EB717",
		borderRadius: 3,
		backgroundColor: "#FBFBFB",
		borderWidth: 1,
		fontFamily: "regular",
		fontSize: 20,
	},
});
