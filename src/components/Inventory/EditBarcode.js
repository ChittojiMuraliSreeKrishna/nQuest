import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component } from "react";
import {
  Dimensions,
  Image, StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Device from "react-native-device-detection";
import I18n from "react-native-i18n";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Appbar } from "react-native-paper";
import RNPickerSelect from "react-native-picker-select";
import { Chevron } from "react-native-shapes";
import forms from "../../commonUtils/assets/styles/formFields.scss";
import DateSelector from "../../commonUtils/DateSelector";
import Loader from "../../commonUtils/loader";
import { RF, RH, RW } from "../../Responsive";
import { inventoryErrorMessages } from "../Errors/errors";
import Message from "../Errors/Message";
import InventoryService from "../services/InventoryService";
import {
  dateSelector,
  dateText,
  inputHeading,
  rnPicker,
  rnPickerContainer,
  rnPickerDisabled,
  rnPickerError
} from "../Styles/FormFields";

var deviceWidth = Dimensions.get("window").width;
var deviceHeight = Dimensions.get("window").height;

// For Domains
const data1 = [
  { value: "Textile", label: "Textile" },
  { value: "Retail", label: "Retail" },
  { value: "Electronics", label: "Electronics" },
  { value: "FruitsAndVegetables", label: "FruitsAndVegetables" },
  { value: "Sanitary", label: "Sanitary" }
];

// For Retail Status
const status1 = [
  { value: "YES", label: "YES" },
  { value: "NO", label: "NO" },
];

class EditBarcode extends Component {
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
      subsectionId: null,
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
      reBar: false,
      navText: "",
      barcodeId: null,
      isTaxIncluded: '',
      barcode: "",
      designCode: "",
      vendorTax: "",
      dynamicAttributes: [],
      dynamicAttributesName: "",
      size: ""
    };
  }

  async componentDidMount() {
    const clientId = await AsyncStorage.getItem("custom:clientId1");
    this.setState({ clientId: clientId });
    const isTaxIncluded = await AsyncStorage.getItem('custom:isTaxIncluded');
    this.setState({ isTaxIncluded: isTaxIncluded });
    const storeId = AsyncStorage.getItem("storeId");
    console.log({ storeId: storeId });
    const editBcode = this.props.route.params;
    if (editBcode.reBar === true) {
      this.setState({ navText: "RE-Barcode" });
    } else {
      this.setState({ navText: "Edit Barcode" });
    }
    this.setState({
      isEdit: editBcode.isEdit,
      reBar: editBcode.reBar,
      loading: true,
    });
    console.log({ editBcode });
    // alert(editBcode.item.vendorTax)
    this.setState(
      {
        selectedDomain: editBcode.item.domainType,
        divisionId: editBcode.item.division,
        selectedDivision: editBcode.item.divisionName,
        sectionId: editBcode.item.section,
        section: editBcode.item.sectionName,
        subsectionId: editBcode.item.subSection,
        subSection: editBcode.item.subSectionName,
        catogirieId: editBcode.item.category,
        category: editBcode.item.categoryName,
        colour: editBcode.item.colour,
        batchNo: editBcode.item.batchNo,
        costPrice: String(editBcode.item.costPrice),
        listPrice: String(editBcode.item.itemMrp),
        uomName: editBcode.item.uom,
        uomId: editBcode.item.uom,
        hsnCode: editBcode.item.hsnCode,
        hsnId: editBcode.item.hsnCode,
        empId: editBcode.item.empId,
        storeId: editBcode.item.storeId,
        store: editBcode.item.storeId,
        quantity: String(editBcode.item.qty),
        productTextileId: editBcode.item.productTextileId,
        barcodeTextileId: editBcode.item.barcodeTextileId,
        name: editBcode.item.name,
        reBar: editBcode.reBar,
        empId: String(editBcode.item.empId),
        barcodeId: parseInt(editBcode.item.id),
        selectedStatus: editBcode.item.status,
        barcode: editBcode.item.barcode,
        designCode: editBcode.item.designcode,
        vendorTax: String(editBcode.item.vendorTax)
      },
      () => {
        const { selectedDomain } = this.state;
        if (selectedDomain === "Textile") {
        }
        this.getAllCatogiries(selectedDomain);
        this.getAllstores(selectedDomain);
        this.getAllHSNCodes();
        this.setState({ loading: false });
      },
    );
    // alert(this.state.storeId);
  }

  // Go Back Actions
  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    this.props.route.params.onGoBack(null);
    return true;
  }
  // Domain Actions
  handleDomain = (value) => {
    this.setState({ selectedDomain: value }, () => {
      console.log({ value });
      const { selectedDomain } = this.state;
      this.getAllHSNCodes(selectedDomain);
      this.getAllUOM();
    });
  };

  // Status Actions
  handleStatus = (value) => {
    console.log({ value });
    this.setState({ selectedStatus: value });
  };


  // Category Actions
  getAllCatogiries(data) {
    this.setState({ categoriesList: [] });
    let categories = [];
    InventoryService.getAllCategories(data).then((res) => {
      if (res?.data) {
        for (let i = 0; i < res.data.length; i++) {
          categories.push({
            value: res.data[i].id,
            label: res.data[i].name,
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


  handleSize = (value, data) => {
    console.log({ value, data });
    this.setState({ size: value });
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
            value: res.data.result[i].hsnCode,
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
    console.log({ clientId });
    InventoryService.getAllStores(clientId).then((res) => {
      console.log("Stores", res);
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

  handleVendorTax = (value) => {
    this.setState({ vendorTax: value })
  }


  // List Price Actions
  handleListPrice = (value) => {
    this.setState({ listPrice: value });
  };
  handleListPriceValid = () => {
    if (this.state.listPrice.length > 0) {
      this.setState({ listPriceValid: true });
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

  datepickerCancelClicked = () => {
    this.setState({
      datepickerOpen: false,
    });
  };

  datepickerEndCancelClicked = () => {
    this.setState({
      datepickerendOpen: false,
    });
  };

  handleDate = (value) => {
    this.setState({ productValidity: value });
  };

  // Validations For Barcode Fields
  validationForm() {
    let isFormValid = true;
    let errors = {};
    if (this.state.reBar === true) {
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
    }
    if (this.state.isTaxIncluded === "true" && this.state.isTaxIncluded !== "null" && this.state.hsnId === null) {
      isFormValid = false;
      errors["hsn"] = inventoryErrorMessages.hsnCode;
      this.setState({ hsnValid: false });
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
    console.log(this.state.store);
    this.setState({ loading: true });
    const { selectedDomain, isEdit, reBar } = this.state;
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
        subSection: parseInt(this.state.subsectionId),
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
        id: this.state.barcodeId,

      };
      this.setState({ loading: true });
      console.log({ params });
      let value = "";
      if (this.state.reBar) {
        value = "REBAR";
      } else {
        value = "Edit";
      }
      InventoryService.saveBarCode(params, selectedDomain, isEdit, value)
        .then((res) => {
          console.log({ res });
          if (res?.data && res.request.status === 200) {
            let response = res.data;
            console.log({ response });
            this.props.route.params.onGoBack();
            this.props.navigation.goBack();
            alert("barcode updated successfully");
          } else {
            alert(res.data.message);
          }
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
        <Appbar mode="center-aligned" style={styles.mainContainer}>
          <Appbar.BackAction
            onPress={() => this.handleBackButtonClick()}
          />
          <Appbar.Content title={this.state.reBar ? "Rebarcode" : "Edit Barcode"} />
        </Appbar>
        <KeyboardAwareScrollView>
          <Text style={inputHeading}>
            {I18n.t("Domian")} <Text style={{ color: "#aa0000" }}>*</Text>{" "}
          </Text>
          <TextInput
            style={[
              forms.inactive_fld,
              forms.input_fld
            ]}
            editable={false}
            placeholder="Domain"
            value={this.state.selectedDomain}
          />
          {this.state.selectedDomain !== "" && (
            <View>
              <Text style={inputHeading}>
                {I18n.t("Division")} <Text style={{ color: "#aa0000" }}>*</Text>{" "}
              </Text>
              <TextInput
                editable={false}
                style={[
                  forms.inactive_fld,
                  forms.input_fld
                ]}
                placeholder="Division"
                value={this.state.selectedDivision}
              />
              {!divisionValid && (
                <Message imp={true} message={this.state.errors["divison"]} />
              )}
              <Text style={inputHeading}>
                {I18n.t("Section")} <Text style={{ color: "#aa0000" }}>*</Text>{" "}
              </Text>
              <TextInput
                editable={false}
                style={[
                  forms.inactive_fld,
                  forms.input_fld
                ]}
                placeholder="Section"
                value={this.state.section}
              />
              {!sectionValid && (
                <Message imp={true} message={this.state.errors["section"]} />
              )}
              <Text style={inputHeading}>
                {I18n.t("Sub Section")}{" "}
                <Text style={{ color: "#aa0000" }}>*</Text>{" "}
              </Text>
              <TextInput
                editable={false}
                style={[
                  forms.inactive_fld,
                  forms.input_fld
                ]}
                placeholder="SubSection"
                value={this.state.subSection}
              />
              {!subSectionValid && (
                <Message imp={true} message={this.state.errors["subSection"]} />
              )}
              <Text style={inputHeading}>
                {I18n.t("Category")} <Text style={{ color: "#aa0000" }}>*</Text>{" "}
              </Text>
              <TextInput
                editable={false}
                style={[
                  forms.inactive_fld,
                  forms.input_fld
                ]}
                placeholder="Category"
                value={this.state.category}
              />
              {!categoryValid && (
                <Message imp={true} message={this.state.errors["category"]} />
              )}
            </View>
          )}
          {this.state.selectedDomain === "Retail" && ( // For Retail Domain only
            <View>
              <Text style={inputHeading}>
                {I18n.t("Status Type")} <Text style={{ color: "#aa0000" }}>*</Text>{" "}
              </Text>
              <View
                style={[
                  rnPickerContainer,
                  { borderColor: divisionValid ? "#8F9EB718" : "#dd0000" },
                ]}
              >
                <RNPickerSelect
                  placeholder={{
                    label: "Select",
                  }}
                  disabled={true}
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
                Stock Validity <Text style={{ color: "#aa0000" }}>*</Text>{" "}
              </Text>
              <TouchableOpacity
                style={dateSelector}
                testID="openModal"
                onPress={() => this.datepickerClicked()}
                disabled={true}
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
                  <DateSelector
                    dateCancel={this.datepickerCancelClicked}
                    setDate={this.handleDate}
                  />
                </View>
              )}
            </View>
          )}
          <Text style={inputHeading}>
            {" "}
            {I18n.t("Colour")} <Text style={{ color: "#aa0000" }}>*</Text>{" "}
          </Text>
          <TextInput
            style={[
              forms.input_fld,
              forms.inactive_fld,
              { borderColor: colorValid ? "#8F9EB718" : "#dd0000" },
            ]}
            underlineColorAndroid="transparent"
            placeholder={I18n.t("Colour")}
            placeholderTextColor={colorValid ? "#6F6F6F17" : "#dd0000"}
            textAlignVertical="center"
            editable={false}
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
            {" "}
            {I18n.t("Name")} <Text style={{ color: "#aa0000" }}>*</Text>{" "}
          </Text>
          <TextInput
            style={[
              forms.input_fld,
              forms.inactive_fld,
              { borderColor: nameValid ? "#8F9EB718" : "#dd0000" },
            ]}
            underlineColorAndroid="transparent"
            placeholder={I18n.t("Name")}
            placeholderTextColor={nameValid ? "#6F6F6F17" : "#dd0000"}
            maxLength={25}
            editable={false}
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
              forms.inactive_fld,
              { borderColor: batchNoValid ? "#8F9EB718" : "#dd0000" },
            ]}
            underlineColorAndroid="transparent"
            placeholder={I18n.t("Batch No")}
            placeholderTextColor={batchNoValid ? "#6F6F6F17" : "#dd0000"}
            textAlignVertical="center"
            editable={false}
            maxLength={12}
            autoCapitalize="none"
            value={this.state.batchNo}
            onBlur={this.handleBatchNoValid}
            onChangeText={this.handleBatchNo}
          />
          {!batchNoValid && (
            <Message imp={true} message={this.state.errors["batchNo"]} />
          )}
          {this.state.dynamicAttributes.length > 0 && (
            <View>
              <Text style={inputHeading}>{this.state.dynamicAttributesName}</Text>
              <View
                style={[
                  rnPickerContainer,
                  { borderColor: "#d6d6d6" },
                ]}
              >
                <RNPickerSelect
                  placeholder={{
                    label: "Select",
                  }}
                  Icon={() => {
                    return (
                      <Chevron
                        style={styles.imagealign}
                        size={1.5}
                        color={"gray"}
                      />
                    );
                  }}
                  items={this.state.dynamicAttributes}
                  onValueChange={(value, data) => this.handleSize(value, data)}
                  style={rnPicker}
                  value={this.state.size}
                  useNativeAndroidPickerStyle={false}
                />
              </View>
            </View>
          )}
          <Text style={inputHeading}>
            {I18n.t("Cost Price")} <Text style={{ color: "#aa0000" }}>*</Text>{" "}
          </Text>
          <TextInput
            style={[
              forms.input_fld,
              forms.inactive_fld,
              { borderColor: costPriceValid ? "#8F9EB718" : "#dd0000" },
            ]}
            underlineColorAndroid="transparent"
            placeholder={I18n.t("Cost Price")}
            keyboardType={"numeric"}
            editable={false}
            textContentType="telephoneNumber"
            placeholderTextColor={costPriceValid ? "#6F6F6F17" : "#dd0000"}
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
            {I18n.t("MRP")} <Text style={{ color: "#aa0000" }}>*</Text>{" "}
          </Text>
          <TextInput
            style={[
              forms.input_fld,
              this.state.reBar ? forms.active_fld : forms.inactive_fld,
              { borderColor: listPriceValid ? "#8F9EB7" : "#dd0000" },
            ]}
            underlineColorAndroid="transparent"
            placeholder={I18n.t("MRP")}
            keyboardType={"numeric"}
            editable={this.state.reBar ? true : false}
            textContentType="telephoneNumber"
            placeholderTextColor={listPriceValid ? "#6F6F6F17" : "#dd0000"}
            textAlignVertical="center"
            autoCapitalize="none"
            maxLength={10}
            value={this.state.listPrice}
            onChangeText={this.handleListPrice}
            onBlur={this.handleListPriceValid}
          />
          <Text style={inputHeading}>
            {I18n.t("Vendor Tax")} <Text style={{ color: "#aa0000" }}>*</Text>{" "}
          </Text>
          <TextInput
            activeOutlineColor="#d6d6d6"
            mode="outlined"
            outlineColor={"#d6d6d6"}
            style={[
              forms.input_fld,
              forms.inactive_fld,
            ]}
            underlineColorAndroid="transparent"
            placeholder={I18n.t("Vendor Tax")}
            keyboardType={"numeric"}
            textContentType="telephoneNumber"
            placeholderTextColor={"#676767"}
            textAlignVertical="center"
            autoCapitalize="none"
            editable={false}
            maxLength={10}
            value={this.state.vendorTax}
            onChangeText={this.handleVendorTax}
          // onBlur={this.handleVendorTaxValid}
          />
          {!listPriceValid && (
            <Message imp={true} message={this.state.errors["listPrice"]} />
          )}
          <Text style={inputHeading}>
            {I18n.t("UOM")} <Text style={{ color: "#aa0000" }}>*</Text>{" "}
          </Text>
          <TextInput
            editable={false}
            style={[forms.inactive_fld, forms.input_fld]}
            placeholder="Uom"
            value={this.state.uomName}
          />
          {!uomValid && (
            <Message imp={true} message={this.state.errors["uom"]} />
          )}
          {this.state.isTaxIncluded === "true" && this.state.isTaxIncluded !== "nll" && (<View>
            <Text style={inputHeading}>
              {I18n.t("HSN Code")} <Text style={{ color: "#aa0000" }}>*</Text>{" "}
            </Text>
            <TextInput
              editable={false}
              style={[
                forms.inactive_fld,
                forms.input_fld
              ]}
              placeholder="Division"
              value={this.state.hsnCode}
            />
            {!hsnValid && (
              <Message imp={true} message={this.state.errors["hsn"]} />
            )}
          </View>)}
          <Text style={inputHeading}>
            {I18n.t("EMP ID")} <Text style={{ color: "#aa0000" }}>*</Text>{" "}
          </Text>
          <TextInput
            style={[
              forms.input_fld,
              forms.inactive_fld,
              { borderColor: empValid ? "#8F9EB718" : "#dd0000" },
            ]}
            underlineColorAndroid="transparent"
            placeholder="EMP ID"
            placeholderTextColor={empValid ? "#6F6F6F17" : "#dd0000"}
            textAlignVertical="center"
            maxLength={4}
            editable={false}
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
              rnPickerContainer,
              { borderColor: "#8F9EB718", backgroundColor: '#b9b9b9' },
            ]}
          >
            <RNPickerSelect
              editable={false}
              placeholder={{
                label: "Store",
              }}
              disabled={true}
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
              onValueChange={(value) => this.handleStore(value)}
              style={rnPickerDisabled}
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
              { borderColor: storeValid ? "#8F9EB7" : "#dd0000" },
            ]}
            underlineColorAndroid="transparent"
            placeholder="QTY"
            placeholderTextColor={storeValid ? "#6F6F6F17" : "#dd0000"}
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
          <Text style={inputHeading}>
            Design Code <Text style={{ color: "#aa0000" }}>*</Text>{" "}
          </Text>
          <TextInput
            activeOutlineColor="#000"
            mode="outlined"
            outlineColor={"#d6d6d6"}
            style={[
              forms.input_fld,
              forms.inactive_fld,
            ]}
            underlineColorAndroid="transparent"
            placeholder="Design Code"
            placeholderTextColor={"#676767"}
            textAlignVertical="center"
            editable={false}
            autoCapitalize="none"
            value={this.state.designCode}
            onBlur={() => this.handleDesignCodeValid()}
            onChangeText={() => this.handleDesignCode()}
          />
          <Text style={inputHeading}>
            Barcode
          </Text>
          <TextInput
            activeOutlineColor="#000"
            mode="outlined"
            outlineColor={"#d6d6d6"}
            style={[
              forms.input_fld,
              forms.inactive_fld,
            ]}
            editable={false}
            underlineColorAndroid="transparent"
            placeholder="BarCode"
            placeholderTextColor={"#676767"}
            textAlignVertical="center"
            autoCapitalize="none"
            value={this.state.barcode}
            onBlur={() => this.handleBarcodeValid()}
            onChangeText={() => this.handleBarcode()}
          />
          <View style={forms.action_buttons_container}>
            <TouchableOpacity style={[forms.action_buttons, forms.submit_btn]}
              onPress={() => this.saveBarcode()}>
              <Text style={forms.submit_btn_text} >{I18n.t("SAVE")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[forms.action_buttons, forms.cancel_btn]}
              onPress={() => this.cancel()}>
              <Text style={forms.cancel_btn_text}>{I18n.t("CANCEL")}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomContainer}></View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

export default EditBarcode;

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
