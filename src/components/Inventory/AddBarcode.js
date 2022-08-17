import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component } from "react";
import {
	Dimensions,
	Image,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import DatePicker from "react-native-date-picker";
import Device from "react-native-device-detection";
import I18n from "react-native-i18n";
import RNPickerSelect from "react-native-picker-select";
import { Chevron } from "react-native-shapes";
import forms from "../../commonUtils/assets/styles/formFields.scss";
import Loader from "../../commonUtils/loader";
import { RF, RH, RW } from "../../Responsive";
import {
	accountingErrorMessages,
	errorLength,
	inventoryErrorMessages,
} from "../Errors/errors";
import Message from "../Errors/Message";
import InventoryService from "../services/InventoryService";
import {
	cancelBtnText,
	datePicker,
	datePickerBtnText,
	datePickerButton1,
	datePickerButton2,
	dateSelector,
	dateText,
	inputHeading,
	rnPicker,
	rnPickerError,
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
var deviceHeight = Dimensions.get("window").height;

// For Domains
const data1 = [
	{ value: "Textile", label: "Textile" },
	{ value: "Retail", label: "Retail" },
	{ value: "Electronics", label: "Electronics" },
];

// For Retail Status
const status1 = [
	{ value: "YES", label: "YES" },
	{ value: "NO", label: "NO" },
];

class AddBarcode extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedDivision: "",
			section: "",
			subSection: "",
			category: "",
			colour: "",
			batchNo: "",
			costPrice: null,
			listPrice: null,
			uomName: "",
			hsnCode: "",
			store: "",
			empId: "",
			quantity: "",
			divisionArray: [],
			divisionsList: [],
			secionArray: [],
			sectionsList: [],
			divisionId: null,
			sectionId: null,
			subSectionId: null,
			catogirieId: null,
			subsecionArray: [],
			subSectionsList: [],
			catogiriesArray: [],
			categoriesList: [],
			uomList: [],
			uomArray: [],
			hsnCodesList: [],
			hsncodesArray: [],
			uomId: null,
			hsnId: null,
			storeNamesArray: [],
			storesList: [],
			name: "",
			storeId: "",
			domainId: 1,
			isEdit: false,
			errors: {},
			divisionValid: true,
			sectionValid: true,
			subSectionValid: true,
			categoryValid: true,
			colorValid: true,
			nameValid: true,
			batchNoValid: true,
			costPriceValid: true,
			listPriceValid: true,
			uomValid: true,
			hsnValid: true,
			empValid: true,
			storeValid: true,
			qtyValid: true,
			selectedDomain: "",
			clientId: "",
			selectedStatus: "",
			productValidity: "",
			date: new Date(),
			datepickerOpen: false,
			doneButtonClicked: false,
		};
	}

	async componentDidMount() {
		var domainStringId = "";
		var storeStringId = "";
		this.setState({ isEdit: this.props.route.params.isEdit });
		const clientId = await AsyncStorage.getItem("custom:clientId1");
		this.setState({ clientId: clientId });
		const storeId = AsyncStorage.getItem("storeId");
		console.log({ storeId: storeId });
		this.getAllstores();
		this.getAllHSNCodes();
	}

	// Go Back Actions
	handleBackButtonClick() {
		this.props.navigation.goBack(null);
		return true;
	}

	// Domain Actions
	handleDomain = (value) => {
		this.setState({ selectedDomain: value }, () => {
			console.log({ value });
			const { selectedDomain } = this.state;
			if (this.state.selectedDomain === "Textile") {
				this.getAllDivisions(selectedDomain);
				this.getAllCatogiries(selectedDomain);
			}
			this.getAllHSNCodes(selectedDomain);
			this.getAllUOM();
		});
	};

	// Status Actions
	handleStatus = (value) => {
		console.log({ value });
		this.setState({ selectedStatus: value });
	};

	// Division Actions
	getAllDivisions(data) {
		let divisions = [];
		InventoryService.getAllDivisions(data).then((res) => {
			if (res?.data) {
				for (let i = 0; i < res.data.length; i++) {
					divisions.push({
						value: res.data[i].id,
						label: res.data[i].name,
					});
				}
				console.log({ divisions });
				this.setState({ divisionsList: divisions });
			}
		});
	}
	handleDivision = (value) => {
		console.log({ value });
		this.setState({ divisionId: value, selectedDivision: value }, () => {
			this.getAllSections(this.state.divisionId, this.state.selectedDomain);
		});
		if (this.state.divisionId !== null) {
			this.setState({ divisionValid: true });
		}
	};

	// Section Actions
	getAllSections(id, data) {
		this.setState({ sectionsList: [] });
		let section = [];
		InventoryService.getAllSections(id, data).then((res) => {
			if (res?.data) {
				for (let i = 0; i < res.data.length; i++) {
					section.push({
						value: res.data[i].id,
						label: res.data[i].name,
					});
				}
				console.log({ section });
				this.setState({ sectionsList: section });
			}
		});
	}
	handleSection = (value) => {
		this.setState({ sectionId: value, section: value }, () => {
			this.getAllSubsections(this.state.sectionId, this.state.selectedDomain);
		});
		if (this.state.sectionId !== null) {
			this.setState({ sectionValid: true });
		}
	};

	// SubSection Actions
	getAllSubsections(id, data) {
		this.setState({ subSectionsList: [] });
		let subSection = [];
		InventoryService.getAllSections(id, data).then((res) => {
			if (res?.data) {
				for (let i = 0; i < res.data.length; i++) {
					subSection.push({
						value: res.data[i].name,
						label: res.data[i].name,
						id: res.data[i].id,
					});
				}
				console.log({ subSection });
				this.setState({ subSectionsList: subSection });
			}
		});
	}
	handleSubSection = (value) => {
		this.setState({ subSectionId: value, subSection: value });
		if (this.state.subSectionId !== null) {
			this.setState({ subSectionValid: true });
		}
	};

	// Category Actions
	getAllCatogiries(data) {
		this.setState({ categoriesList: [] });
		let categories = [];
		InventoryService.getAllCategories(data).then((res) => {
			if (res?.data) {
				for (let i = 0; i < res.data.length; i++) {
					categories.push({
						value: res.data[i].name,
						label: res.data[i].name,
						id: res.data[i].id,
					});
				}
				console.log({ categories });
				this.setState({ categoriesList: categories });
			}
		});
	}
	handleCateory = (value) => {
		this.setState({ category: value, catogirieId: value });
		if (this.state.catogirieId !== null) {
			this.setState({ categoryValid: true });
		}
	};

	// UOM Actions
	getAllUOM() {
		this.setState({ uomList: [] });
		let uomList = [];
		InventoryService.getUOM().then((res) => {
			if (res?.data) {
				console.log("UOMS", res.data);
				for (let i = 0; i < res.data.length; i++) {
					uomList.push({
						value: res.data[i].id,
						label: res.data[i].uomName,
					});
				}
				console.log({ uomList });
				this.setState({ uomList: uomList });
			}
		});
	}
	handleUOM = (value) => {
		this.setState({ uomId: value, uomName: value });
		if (this.state.uomId !== null) {
			this.setState({ uomValid: true });
		}
	};

	// HSNCodes Actions
	getAllHSNCodes() {
		this.setState({ hsnCodesList: [] });
		let hsnList = [];
		InventoryService.getAllHsnList().then((res) => {
			if (res?.data) {
				console.log("HSNS", res.data);
				for (let i = 0; i < res.data.result.length; i++) {
					hsnList.push({
						value: res.data.result[i].id,
						label: res.data.result[i].hsnCode,
					});
				}
				console.log({ hsnList });
				this.setState({ hsnCodesList: hsnList });
			}
		});
	}
	handleHSNCode = (value) => {
		this.setState({ hsnId: value, hsnCode: value });
		if (this.state.hsnId !== null) {
			this.setState({ hsnValid: true });
		}
	};

	// Store Actions
	async getAllstores() {
		this.setState({ storesList: [] });
		let storesList = [];
		const { clientId } = this.state;
		InventoryService.getAllStores(clientId).then((res) => {
			console.log("Stores", res.data);
			if (res?.data) {
				for (let i = 0; i < res.data.length; i++) {
					storesList.push({
						value: res.data[i].id,
						label: res.data[i].name,
					});
				}
				console.log({ storesList });
				this.setState({ storesList: storesList });
			}
		});
	}
	handleStore = (value) => {
		console.warn({ value });
		this.setState({ storeId: value, store: value });
	};

	// Color Actions
	handleColour = (value) => {
		this.setState({ colour: value });
	};
	handleColourValid = () => {
		if (this.state.colour.length >= errorLength.colour) {
			this.setState({ colorValid: true });
		}
	};

	// Name Actions
	handleName = (value) => {
		this.setState({ name: value });
	};
	handleNameValid = () => {
		if (this.state.name.length >= errorLength.name) {
			this.setState({ nameValid: true });
		}
	};

	// BatchNo Actions
	handleBatchNo = (value) => {
		this.setState({ batchNo: value });
	};
	handleBatchNoValid = () => {
		if (this.state.batchNo.length > 0) {
			this.setState({ batchNoValid: true });
		}
	};

	// Cost Price Actions
	handleCostPrice = (value) => {
		this.setState({ costPrice: value });
	};
	handleCostPriceValid = () => {
		if (this.state.costPrice.length > 0) {
			this.setState({ costPriceValid: true });
		}
	};

	// List Price Actions
	handleListPrice = (value) => {
		this.setState({ listPrice: value });
	};
	handleListPriceValid = () => {
		if (this.state.listPrice.length > 0) {
			this.setState({ listPriceValid: true });
		}
	};

	// Emp Actions
	handleEMPId = (value) => {
		this.setState({ empId: value });
	};
	handleEMPIdValid = () => {
		if (this.state.empId >= 3) {
			this.setState({ empValid: true });
		}
	};

	// Qty Actions
	handleQuantity = (value) => {
		this.setState({ quantity: value });
	};
	handleQuantityValid = () => {
		if (this.state.quantity.length > 0) {
			this.setState({ qtyValid: true });
		}
	};

	// Date Actions
	datepickerClicked() {
		this.setState({ datepickerOpen: true });
	}
	datepickerDoneClicked() {
		if (
			parseInt(this.state.date.getDate()) < 10 &&
			parseInt(this.state.date.getMonth()) < 10
		) {
			this.setState({
				productValidity:
					this.state.date.getFullYear() +
					"-0" +
					(this.state.date.getMonth() + 1) +
					"-" +
					"0" +
					this.state.date.getDate(),
			});
		} else if (parseInt(this.state.date.getDate()) < 10) {
			this.setState({
				productValidity:
					this.state.date.getFullYear() +
					"-" +
					(this.state.date.getMonth() + 1) +
					"-" +
					"0" +
					this.state.date.getDate(),
			});
		} else if (parseInt(this.state.date.getMonth()) < 10) {
			this.setState({
				productValidity:
					this.state.date.getFullYear() +
					"-0" +
					(this.state.date.getMonth() + 1) +
					"-" +
					this.state.date.getDate(),
			});
		} else {
			this.setState({
				productValidity:
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
	datepickerCancelClicked() {
		this.setState({
			date: new Date(),
			datepickerOpen: false,
			datepickerendOpen: false,
		});
	}

	// Validations For Barcode Fields
	validationForm() {
		let isFormValid = true;
		let errors = {};
		if (this.state.name.length < errorLength.name) {
			isFormValid = false;
			errors["name"] = inventoryErrorMessages.name;
			this.setState({ nameValid: false });
		}
		if (this.state.divisionId === null) {
			isFormValid = false;
			errors["divison"] = inventoryErrorMessages.divisionId;
			this.setState({ divisionValid: false });
		}
		if (this.state.sectionId === null) {
			isFormValid = false;
			errors["section"] = inventoryErrorMessages.sectionId;
			this.setState({ sectionValid: false });
		}
		if (this.state.subSectionId === null) {
			isFormValid = false;
			errors["subSection"] = inventoryErrorMessages.subSectionId;
			this.setState({ subSectionValid: false });
		}
		if (this.state.catogirieId === null) {
			isFormValid = false;
			errors["category"] = inventoryErrorMessages.category;
			this.setState({ categoryValid: false });
		}
		if (String(this.state.colour).length < errorLength.colour) {
			isFormValid = false;
			errors["color"] = inventoryErrorMessages.colour;
			this.setState({ colorValid: false });
		}
		if (String(this.state.batchNo).length === 0) {
			isFormValid = false;
			errors["batchNo"] = inventoryErrorMessages.batchNo;
			this.setState({ batchNoValid: false });
		}
		if (this.state.costPrice === null) {
			isFormValid = false;
			errors["costPrice"] = inventoryErrorMessages.costPrice;
			this.setState({ costPriceValid: false });
		}
		if (this.state.listPrice === null) {
			isFormValid = false;
			errors["listPrice"] = inventoryErrorMessages.listPrice;
			this.setState({ listPriceValid: false });
		}
		if (this.state.uomId === null) {
			isFormValid = false;
			errors["uom"] = inventoryErrorMessages.uom;
			this.setState({ uomValid: false });
		}
		if (this.state.hsnId === null) {
			isFormValid = false;
			errors["hsn"] = inventoryErrorMessages.hsnCode;
			this.setState({ hsnValid: false });
		}
		if (String(this.state.empId).length < errorLength.empId) {
			isFormValid = false;
			errors["emp"] = inventoryErrorMessages.empId;
			this.setState({ empValid: false });
		}
		if (this.state.store === undefined) {
			isFormValid = false;
			errors["store"] = accountingErrorMessages.store;
			this.setState({ storeValid: false });
		}
		if (String(this.state.quantity).length === 0) {
			isFormValid = false;
			errors["qty"] = inventoryErrorMessages.qty;
			this.setState({ qtyValid: false });
		}
		this.setState({ errors: errors });
		return isFormValid;
	}

	// Saving Barcode
	saveBarcode() {
		// console.log(this.state.store);
		// this.setState({ loading: true });
		const { selectedDomain, isEdit } = this.state;
		const isFormValid = this.validationForm();
		if (isFormValid) {
			// Checking for validations
			const params = {
				status: selectedDomain === "Retail" ? this.state.status : null,
				productValidity:
					selectedDomain === "Retail" ? this.state.productValidity : null,
				isBarcode: selectedDomain === "Retail" ? false : null,
				division: parseInt(this.state.divisionId),
				section: parseInt(this.state.sectionId),
				subSection: parseInt(this.state.subSectionId),
				category: parseInt(this.state.catogirieId),
				batchNo: this.state.batchNo,
				name: this.state.name,
				colour: this.state.colour,
				costPrice: this.state.costPrice,
				empId: this.state.empId,
				hsnCode: parseInt(this.state.hsnId),
				itemMrp: this.state.listPrice,
				domainId: 1,
				qty: this.state.quantity,
				storeId: this.state.storeId,
				uom: this.state.uomName,
				domainType: this.state.selectedDomain,
			};
			console.log({ params });
			this.setState({ loading: true });
			InventoryService.saveBarCode(params, selectedDomain, isEdit)
				.then((res) => {
					if (res && res.status === 200) {
						let response = res.data;
						console.log({ response });
						this.props.route.params.onGoBack();
						this.props.navigation.goBack();
						alert("Barcode Created Successfully");
					} else {
						alert(response.message);
					}
					console.log({ res });
					this.setState({ loading: false });
				})
				.catch((err) => {
					this.setState({ loading: false });
					alert(err);
				});
		}
	}

	// Cancel Add Barcode
	cancel() {
		this.props.navigation.goBack(null);
	}

	render() {
		const {
			divisionValid,
			sectionValid,
			subSectionValid,
			categoryValid,
			colorValid,
			nameValid,
			batchNoValid,
			costPriceValid,
			listPriceValid,
			uomValid,
			hsnValid,
			empValid,
			storeValid,
			qtyValid,
		} = this.state;
		return (
			<View style={styles.mainContainer}>
				{this.state.loading && <Loader loading={this.state.loading} />}
				<View style={headerTitleContainer}>
					<View style={headerTitleSubContainer}>
						<TouchableOpacity
							style={[backButton]}
							onPress={() => this.handleBackButtonClick()}
						>
							<Image
								style={backButtonImage}
								source={require("../assets/images/backButton.png")}
							/>
						</TouchableOpacity>
						<Text style={headerTitle}> {I18n.t("Add Barcode")} </Text>
					</View>
				</View>
				<ScrollView>
					<Text style={inputHeading}>
						{I18n.t("Domian")} <Text style={{ color: "#aa0000" }}>*</Text>{" "}
					</Text>
					<View
						style={[
							forms.rnp_container,
							{ borderColor: divisionValid ? "#8F9EB718" : "#dd0000" },
						]}
					>
						<RNPickerSelect
							placeholder={{
								label: "Domain",
							}}
							Icon={() => {
								return (
									<Chevron
										style={styles.imagealign}
										size={1.5}
										color={divisionValid ? "gray" : "#dd0000ff"}
									/>
								);
							}}
							items={data1}
							onValueChange={(value) => {
								this.handleDomain(value);
							}}
							on
							style={divisionValid ? rnPicker : rnPickerError}
							value={this.state.selectedDomain}
							useNativeAndroidPickerStyle={false}
						/>
					</View>
					{this.state.selectedDomain === "Textile" && ( // For Textile Domain only
						<View>
							<Text style={inputHeading}>
								{I18n.t("Division")} <Text style={{ color: "#aa0000" }}>*</Text>{" "}
							</Text>
							<View
								style={[
									forms.rnp_container,
									{ borderColor: divisionValid ? "#8F9EB718" : "#dd0000" },
								]}
							>
								<RNPickerSelect
									placeholder={{
										label: "Division",
									}}
									Icon={() => {
										return (
											<Chevron
												style={styles.imagealign}
												size={1.5}
												color={divisionValid ? "gray" : "#dd0000"}
											/>
										);
									}}
									items={this.state.divisionsList}
									onValueChange={(value) => this.handleDivision(value)}
									style={divisionValid ? rnPicker : rnPickerError}
									value={this.state.selectedDivision}
									useNativeAndroidPickerStyle={false}
								/>
							</View>
							{!divisionValid && (
								<Message imp={true} message={this.state.errors["divison"]} />
							)}
							<Text style={inputHeading}>
								{I18n.t("Section")} <Text style={{ color: "#aa0000" }}>*</Text>{" "}
							</Text>
							<View
								style={[
									forms.rnp_container,
									{ borderColor: sectionValid ? "#8F9EB718" : "#dd0000" },
								]}
							>
								<RNPickerSelect
									placeholder={{
										label: "Section",
									}}
									Icon={() => {
										return (
											<Chevron
												style={styles.imagealign}
												size={1.5}
												color={sectionValid ? "gray" : "#dd0000"}
											/>
										);
									}}
									items={this.state.sectionsList}
									onValueChange={this.handleSection}
									style={sectionValid ? rnPicker : rnPickerError}
									value={this.state.section}
									useNativeAndroidPickerStyle={false}
								/>
							</View>
							{!sectionValid && (
								<Message imp={true} message={this.state.errors["section"]} />
							)}
							<Text style={inputHeading}>
								{I18n.t("Sub Section")}{" "}
								<Text style={{ color: "#aa0000" }}>*</Text>{" "}
							</Text>
							<View
								style={[
									forms.rnp_container,
									{ borderColor: subSectionValid ? "#8F9EB718" : "#dd0000" },
								]}
							>
								<RNPickerSelect
									placeholder={{
										label: "Sub Section",
									}}
									Icon={() => {
										return (
											<Chevron
												style={styles.imagealign}
												size={1.5}
												color={subSectionValid ? "gray" : "#dd0000"}
											/>
										);
									}}
									items={this.state.subSectionsList}
									onValueChange={this.handleSubSection}
									style={subSectionValid ? rnPicker : rnPickerError}
									value={this.state.subSection}
									useNativeAndroidPickerStyle={false}
								/>
							</View>
							{!subSectionValid && (
								<Message imp={true} message={this.state.errors["subSection"]} />
							)}
							<Text style={inputHeading}>
								{I18n.t("Category")} <Text style={{ color: "#aa0000" }}>*</Text>{" "}
							</Text>
							<View
								style={[
									forms.rnp_container,
									{ borderColor: categoryValid ? "#8F9EB718" : "#dd0000" },
								]}
							>
								<RNPickerSelect
									placeholder={{
										label: "Category",
									}}
									Icon={() => {
										return (
											<Chevron
												style={styles.imagealign}
												size={1.5}
												color={categoryValid ? "gray" : "#dd0000"}
											/>
										);
									}}
									items={this.state.categoriesList}
									onValueChange={this.handleCateory}
									style={categoryValid ? rnPicker : rnPickerError}
									value={this.state.category}
									useNativeAndroidPickerStyle={false}
								/>
							</View>
							{!categoryValid && (
								<Message imp={true} message={this.state.errors["category"]} />
							)}
						</View>
					)}
					{this.state.selectedDomain === "Retail" && ( // For Retail Domain only
						<View>
							<Text style={inputHeading}>
								{I18n.t("status")} <Text style={{ color: "#aa0000" }}>*</Text>{" "}
							</Text>
							<View
								style={[
									forms.rnp_container,
									{ borderColor: divisionValid ? "#8F9EB718" : "#dd0000" },
								]}
							>
								<RNPickerSelect
									placeholder={{
										label: "Division",
									}}
									Icon={() => {
										return (
											<Chevron
												style={styles.imagealign}
												size={1.5}
												color={divisionValid ? "gray" : "#dd0000"}
											/>
										);
									}}
									items={status1}
									onValueChange={this.handleStatus}
									style={divisionValid ? rnPicker : rnPickerError}
									value={this.state.selectedStatus}
									useNativeAndroidPickerStyle={false}
								/>
							</View>
							<Text style={inputHeading}>
								Product Validaty <Text style={{ color: "#aa0000" }}>*</Text>{" "}
							</Text>
							<TouchableOpacity
								style={dateSelector}
								testID="openModal"
								onPress={() => this.datepickerClicked()}
							>
								<Text style={dateText}>
									{this.state.productValidity === ""
										? "Validity Date"
										: this.state.productValidity}
								</Text>
								<Image
									style={filter.calenderpng}
									source={require("../assets/images/calender.png")}
								/>
							</TouchableOpacity>
							{this.state.datepickerOpen && (
								<View style={filter.dateTopView}>
									<View style={filter.dateTop2}>
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
						</View>
					)}
					<Text style={inputHeading}>
						{I18n.t("Colour")} <Text style={{ color: "#aa0000" }}>*</Text>{" "}
					</Text>
					<TextInput
						style={[
							forms.input_fld,
							forms.active_fld,
							{ borderColor: colorValid ? "#8F9EB718" : "#dd0000" },
						]}
						underlineColorAndroid="transparent"
						placeholder={I18n.t("Colour")}
						placeholderTextColor={colorValid ? "#6F6F6F67" : "#dd0000"}
						textAlignVertical="center"
						maxLength={12}
						autoCapitalize="none"
						onBlur={this.handleColourValid}
						value={this.state.colour}
						onChangeText={this.handleColour}
					/>
					{!colorValid && (
						<Message imp={true} message={this.state.errors["color"]} />
					)}
					<Text style={inputHeading}>
						{I18n.t("Name")} <Text style={{ color: "#aa0000" }}>*</Text>{" "}
					</Text>
					<TextInput
						style={[
							forms.input_fld,
							forms.active_fld,
							{ borderColor: nameValid ? "#8F9EB718" : "#dd0000" },
						]}
						underlineColorAndroid="transparent"
						placeholder={I18n.t("Name")}
						placeholderTextColor={nameValid ? "#6F6F6F67" : "#dd0000"}
						maxLength={25}
						textAlignVertical="center"
						autoCapitalize="none"
						value={this.state.name}
						onBlur={this.handleNameValid}
						onChangeText={this.handleName}
					/>
					{!nameValid && (
						<Message imp={true} message={this.state.errors["name"]} />
					)}
					<Text style={inputHeading}>
						{I18n.t("Batch No")} <Text style={{ color: "#aa0000" }}>*</Text>{" "}
					</Text>
					<TextInput
						style={[
							forms.input_fld,
							forms.active_fld,
							{ borderColor: batchNoValid ? "#8F9EB718" : "#dd0000" },
						]}
						underlineColorAndroid="transparent"
						placeholder={I18n.t("Batch No")}
						placeholderTextColor={batchNoValid ? "#6F6F6F67" : "#dd0000"}
						textAlignVertical="center"
						maxLength={12}
						autoCapitalize="none"
						value={this.state.batchNo}
						onBlur={this.handleBatchNoValid}
						onChangeText={this.handleBatchNo}
					/>
					{!batchNoValid && (
						<Message imp={true} message={this.state.errors["batchNo"]} />
					)}
					<Text style={inputHeading}>
						{I18n.t("Cost Price")} <Text style={{ color: "#aa0000" }}>*</Text>{" "}
					</Text>
					<TextInput
						style={[
							forms.input_fld,
							forms.active_fld,
							{ borderColor: costPriceValid ? "#8F9EB718" : "#dd0000" },
						]}
						underlineColorAndroid="transparent"
						placeholder={I18n.t("Cost Price")}
						keyboardType={"numeric"}
						textContentType="telephoneNumber"
						placeholderTextColor={costPriceValid ? "#6F6F6F67" : "#dd0000"}
						textAlignVertical="center"
						autoCapitalize="none"
						maxLength={10}
						value={this.state.costPrice}
						onBlur={this.handleCostPriceValid}
						onChangeText={this.handleCostPrice}
					/>
					{!costPriceValid && (
						<Message imp={true} message={this.state.errors["costPrice"]} />
					)}
					<Text style={inputHeading}>
						{I18n.t("List Price")} <Text style={{ color: "#aa0000" }}>*</Text>{" "}
					</Text>
					<TextInput
						style={[
							forms.input_fld,
							forms.active_fld,
							{ borderColor: listPriceValid ? "#8F9EB718" : "#dd0000" },
						]}
						underlineColorAndroid="transparent"
						placeholder={I18n.t("List Price")}
						keyboardType={"numeric"}
						textContentType="telephoneNumber"
						placeholderTextColor={listPriceValid ? "#6F6F6F67" : "#dd0000"}
						textAlignVertical="center"
						autoCapitalize="none"
						maxLength={10}
						value={this.state.listPrice}
						onChangeText={this.handleListPrice}
						onBlur={this.handleListPriceValid}
					/>
					{!listPriceValid && (
						<Message imp={true} message={this.state.errors["listPrice"]} />
					)}
					<Text style={inputHeading}>
						{I18n.t("UOM")} <Text style={{ color: "#aa0000" }}>*</Text>{" "}
					</Text>
					<View
						style={[
							forms.rnp_container,
							{ borderColor: uomValid ? "#8F9EB718" : "#dd0000" },
						]}
					>
						<RNPickerSelect
							placeholder={{
								label: "UOM",
							}}
							Icon={() => {
								return (
									<Chevron
										style={styles.imagealign}
										size={1.5}
										color={uomValid ? "gray" : "#dd0000"}
									/>
								);
							}}
							items={this.state.uomList}
							onValueChange={this.handleUOM}
							style={uomValid ? rnPicker : rnPickerError}
							value={this.state.uomName}
							useNativeAndroidPickerStyle={false}
						/>
					</View>
					{!uomValid && (
						<Message imp={true} message={this.state.errors["uom"]} />
					)}
					<Text style={inputHeading}>
						{I18n.t("HSN Code")} <Text style={{ color: "#aa0000" }}>*</Text>{" "}
					</Text>
					<View
						style={[
							forms.rnp_container,
							{ borderColor: hsnValid ? "#8F9EB718" : "#dd0000" },
						]}
					>
						<RNPickerSelect
							placeholder={{
								label: "HSN Code",
							}}
							Icon={() => {
								return (
									<Chevron
										style={styles.imagealign}
										size={1.5}
										color={hsnValid ? "gray" : "#dd0000"}
									/>
								);
							}}
							items={this.state.hsnCodesList}
							onValueChange={this.handleHSNCode}
							style={hsnValid ? rnPicker : rnPickerError}
							value={this.state.hsnCode}
							useNativeAndroidPickerStyle={false}
						/>
					</View>
					{!hsnValid && (
						<Message imp={true} message={this.state.errors["hsn"]} />
					)}
					<Text style={inputHeading}>
						{I18n.t("EMP ID")} <Text style={{ color: "#aa0000" }}>*</Text>{" "}
					</Text>
					<TextInput
						style={[
							forms.input_fld,
							forms.active_fld,
							{ borderColor: empValid ? "#8F9EB718" : "#dd0000" },
						]}
						underlineColorAndroid="transparent"
						placeholder="EMP ID"
						placeholderTextColor={empValid ? "#6F6F6F67" : "#dd0000"}
						textAlignVertical="center"
						maxLength={10}
						autoCapitalize="none"
						value={this.state.empId}
						onBlur={this.handleEMPIdValid}
						onChangeText={this.handleEMPId}
					/>
					{!empValid && (
						<Message imp={true} message={this.state.errors["emp"]} />
					)}
					<Text style={inputHeading}>
						{I18n.t("Store")} <Text style={{ color: "#aa0000" }}>*</Text>{" "}
					</Text>
					<View
						style={[
							forms.rnp_container,
							{ borderColor: storeValid ? "#8F9EB718" : "#dd0000" },
						]}
					>
						<RNPickerSelect
							placeholder={{
								label: "Store",
							}}
							Icon={() => {
								return (
									<Chevron
										style={styles.imagealign}
										size={1.5}
										color={storeValid ? "gray" : "#dd0000"}
									/>
								);
							}}
							items={this.state.storesList}
							onValueChange={this.handleStore}
							style={storeValid ? rnPicker : rnPickerError}
							value={this.state.store}
							useNativeAndroidPickerStyle={false}
						/>
					</View>
					{!storeValid && (
						<Message imp={true} message={this.state.errors["store"]} />
					)}
					<Text style={inputHeading}>
						QTY <Text style={{ color: "#aa0000" }}>*</Text>{" "}
					</Text>
					<TextInput
						style={[
							forms.input_fld,
							forms.active_fld,
							{ borderColor: storeValid ? "#8F9EB718" : "#dd0000" },
						]}
						underlineColorAndroid="transparent"
						placeholder="QTY"
						placeholderTextColor={storeValid ? "#6F6F6F67" : "#dd0000"}
						textAlignVertical="center"
						maxLength={12}
						autoCapitalize="none"
						value={this.state.quantity}
						onBlur={this.handleQuantityValid}
						onChangeText={this.handleQuantity}
					/>
					{!qtyValid && (
						<Message imp={true} message={this.state.errors["qty"]} />
					)}
					<View style={forms.form_btn_container}>
						<TouchableOpacity
							style={forms.cancel_btn}
							onPress={() => this.cancel()}
						>
							<Text style={cancelBtnText}>{I18n.t("CANCEL")}</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={forms.submit_btn}
							onPress={() => this.saveBarcode()}
						>
							<Text style={submitBtnText}>{I18n.t("SAVE")}</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.bottomContainer}></View>
				</ScrollView>
			</View>
		);
	}
}

export default AddBarcode;

const styles = StyleSheet.create({
	mainContainer: {
		backgroundColor: "#ffffff",
	},
	imagealign: {
		marginTop: Device.isTablet ? 25 : RW(20),
		marginRight: Device.isTablet ? 30 : RW(20),
	},
	bottomContainer: {
		margin: 50,
	},
	errorRecords: {
		color: "#dd0000",
		fontSize: Device.isTablet ? 17 : RW(12),
		marginLeft: RW(30),
	},

	// Styles For Mobiles
	viewsWidth_mobile: {
		backgroundColor: "#ffffff",
		width: deviceWidth,
		textAlign: "center",
		fontSize: RF(24),
		height: RH(70),
	},
	backButton_mobile: {
		position: "absolute",
		left: 10,
		top: 10,
		width: RW(40),
		height: RH(40),
	},
	headerTitle_mobile: {
		position: "absolute",
		left: RW(70),
		top: RW(27),
		width: RW(300),
		height: RH(20),
		fontFamily: "bold",
		fontSize: RF(18),
		color: "#353C40",
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
	inputError_mobile: {
		justifyContent: "center",
		marginLeft: RW(20),
		marginRight: RW(20),
		height: RH(44),
		marginTop: RH(5),
		marginBottom: RH(10),
		borderColor: "#dd0000",
		borderRadius: 3,
		backgroundColor: "#FBFBFB",
		borderWidth: 1,
		fontFamily: "regular",
		paddingLeft: RW(15),
		fontSize: RF(14),
	},
	rnSelect_mobile: {
		color: "#8F9EB718",
		fontSize: RF(15),
	},
	rnSelectContainer_mobile: {
		justifyContent: "center",
		margin: RW(20),
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
	rnSelectContainerError_mobile: {
		justifyContent: "center",
		margin: RW(20),
		height: RH(44),
		marginTop: RH(5),
		marginBottom: RH(10),
		borderColor: "#dd0000",
		borderRadius: 3,
		backgroundColor: "#FBFBFB",
		borderWidth: 1,
		fontFamily: "regular",
		paddingLeft: RW(15),
		fontSize: RF(14),
	},
	saveButton_mobile: {
		margin: RH(8),
		height: RH(50),
		backgroundColor: "#ED1C24",
		borderRadius: 5,
	},
	saveButtonText_mobile: {
		textAlign: "center",
		marginTop: RH(15),
		color: "#ffffff",
		fontSize: RF(15),
		fontFamily: "regular",
	},
	cancelButton_mobile: {
		margin: RH(8),
		height: RW(50),
		backgroundColor: "#ffffff",
		borderRadius: 5,
		borderWidth: 1,
		borderColor: "#353C4050",
	},
	cancelButtonText_mobile: {
		textAlign: "center",
		marginTop: RH(15),
		color: "#353C4050",
		fontSize: RF(15),
		fontFamily: "regular",
	},

	// Styles For Tablet
	viewsWidth_tablet: {
		backgroundColor: "#ffffff",
		width: deviceWidth,
		textAlign: "center",
		fontSize: RF(28),
		height: RH(90),
	},
	backButton_tablet: {
		position: "absolute",
		left: RW(10),
		top: RW(20),
		width: RW(90),
		height: RH(90),
	},
	headerTitle_tablet: {
		position: "absolute",
		left: RW(70),
		top: RH(32),
		width: RW(300),
		height: RH(40),
		fontFamily: "bold",
		fontSize: RF(24),
		color: "#353C40",
	},
	input_tablet: {
		justifyContent: "center",
		marginLeft: RW(20),
		marginRight: RW(20),
		height: RH(54),
		marginTop: 5,
		marginBottom: RH(10),
		borderColor: "#8F9EB717",
		borderRadius: 3,
		backgroundColor: "#FBFBFB",
		borderWidth: 1,
		fontFamily: "regular",
		paddingLeft: RW(15),
		fontSize: RF(20),
	},
	inputError_tablet: {
		justifyContent: "center",
		marginLeft: RW(20),
		marginRight: RW(20),
		height: RH(54),
		marginTop: 5,
		marginBottom: RH(10),
		borderColor: "#dd0000",
		borderRadius: 3,
		backgroundColor: "#FBFBFB",
		borderWidth: 2,
		fontFamily: "regular",
		paddingLeft: RW(15),
		fontSize: RF(20),
	},
	rnSelect_tablet: {
		color: "#8F9EB718",
		fontSize: 20,
	},
	rnSelectContainer_tablet: {
		justifyContent: "center",
		margin: RH(20),
		height: RH(54),
		marginTop: 5,
		marginBottom: RH(10),
		borderColor: "#8F9EB717",
		borderRadius: 3,
		backgroundColor: "#FBFBFB",
		borderWidth: 1,
		fontFamily: "regular",
		paddingLeft: RH(15),
		fontSize: RF(20),
	},
	rnSelectContainerError_tablet: {
		justifyContent: "center",
		margin: RW(20),
		height: RH(54),
		marginTop: 5,
		marginBottom: RH(10),
		borderColor: "#dd0000",
		borderRadius: 3,
		backgroundColor: "#FBFBFB",
		borderWidth: 2,
		fontFamily: "regular",
		paddingLeft: 15,
		fontSize: RF(20),
	},
	saveButton_tablet: {
		margin: RH(8),
		height: RH(60),
		backgroundColor: "#ED1C24",
		borderRadius: 5,
	},
	saveButtonText_tablet: {
		textAlign: "center",
		marginTop: 15,
		color: "#ffffff",
		fontSize: RF(20),
		fontFamily: "regular",
	},
	cancelButton_tablet: {
		margin: RW(8),
		height: RH(60),
		backgroundColor: "#ffffff",
		borderRadius: 5,
		borderWidth: 1,
		borderColor: "#353C4050",
	},
	cancelButtonText_tablet: {
		textAlign: "center",
		marginTop: RH(15),
		color: "#353C4050",
		fontSize: RF(20),
		fontFamily: "regular",
	},
});

const filter = StyleSheet.create({
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
