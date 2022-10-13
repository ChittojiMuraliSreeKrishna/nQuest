import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component } from "react";
import {
  Dimensions,
  Image, StyleSheet,
  Text, ToastAndroid, TouchableOpacity,
  View
} from "react-native";
import Device from "react-native-device-detection";
import I18n from "react-native-i18n";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Appbar, TextInput } from "react-native-paper";
import RNPickerSelect from "react-native-picker-select";
import { Chevron } from "react-native-shapes";
import forms from "../../commonUtils/assets/styles/formFields.scss";
import DateSelector from "../../commonUtils/DateSelector";
import Loader from "../../commonUtils/loader";
import { RF, RH, RW } from "../../Responsive";
import {
  errorLength
} from "../Errors/errors";
import InventoryService from "../services/InventoryService";
import { color } from "../Styles/colorStyles";
import {
  dateSelector,
  dateText,
  inputHeading,
  rnPicker,
  rnPickerContainer
} from "../Styles/FormFields";

var deviceWidth = Dimensions.get("window").width;
var deviceHeight = Dimensions.get("window").height;

// For Domains
const data1 = [
  { value: "Textile", label: "Textile" },
  { value: "Retail", label: "Retail" },
  { value: "FruitsAndVegetables", label: "FruitsAndVegetables" },
  { value: "Sanitary", label: "Sanitary" }
];

// For Retail Status
const retailStatus = [
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
      saveButtonDisabled: false,
      selectedDomain: "",
      date: new Date(),
      sizeList: [],
      size: "",
      brand: "",
      expiryDate: new Date(),
      expiryDateFruitsDomain: ""
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
    InventoryService.getDomainAttributes(value).then((res) => {
      if (res.data) {
        let size = [];
        // for (let i = 0; i < res.data.length; i++) {
        res.data.length > 0 ? res.data[0].values.map((item) =>
          size.push({
            value: item,
            label: item,
          })
        ) : nulll;
        // }
        this.setState({ sizeList: size });
      }
    });

    this.setState({ selectedDomain: value }, () => {
      console.log({ value });
      this.setState({ saveButtonDisabled: true });
      const { selectedDomain } = this.state;
      this.getAllDivisions(selectedDomain);
      this.getAllCatogiries(selectedDomain);
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
            value: res.data[i].id,
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
            value: res.data[i].id,
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
            value: res.data[i].uomName,
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

  handleSize = (value) => {
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

  handleBrand = (value) => {
    this.setState({ brand: value });
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
    if (String(this.state.costPrice).length > 0) {
      this.setState({ costPriceValid: true });
    }
  };

  // List Price Actions
  handleListPrice = (value) => {
    this.setState({ listPrice: value });
  };
  handleListPriceValid = () => {
    if (String(this.state.listPrice).length > 0) {
      this.setState({ listPriceValid: true });
    }
  };

  // Vendor Tax Actions
  handleVendorTax = (value) => {
    this.setState({ vendorTax: value });
  };
  handleVendorTaxValid = () => {
    if (String(this.state.vendorTax).length > 0) {
      this.setState({ vendorTaxValid: true });
    }
  };

  // Emp Actions
  handleEMPId = (value) => {
    this.setState({ empId: value });
  };
  handleEMPIdValid = () => {
    if (String(this.state.empId).length >= 3) {
      this.setState({ empValid: true });
    }
  };

  // Qty Actions
  handleQuantity = (value) => {
    this.setState({ quantity: value });
  };
  handleQuantityValid = () => {
    if (String(this.state.quantity).length > 0) {
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

  handleExpiryFruitsDomainDate = (value) => {
    this.setState({ expiryDateFruitsDomain: value });
  };

  // Validations For Barcode Fields
  validationForm() {
    let isFormValid = true;
    let errors = {};
    if (this.state.name.length < errorLength.name) {
      isFormValid = false;
    }
    if (this.selectedDomain === "Textile") {
      if (this.state.divisionId === null) {
        isFormValid = false;
      }
      if (this.state.sectionId === null) {
        isFormValid = false;
      }
      if (this.state.subSectionId === null) {
        isFormValid = false;
      }
      if (this.state.catogirieId === null) {
        isFormValid = false;
      }
    }
    if (String(this.state.colour).length < errorLength.colour) {
      isFormValid = false;
    }
    if (String(this.state.batchNo).length === 0) {
      isFormValid = false;
    }
    if (this.state.costPrice === null) {
      isFormValid = false;
    }
    if (this.state.listPrice === null) {
      isFormValid = false;
    }
    if (this.state.uomId === null) {
      isFormValid = false;
    }
    if (this.state.hsnId === null) {
      isFormValid = false;
    }
    if (String(this.state.empId).length < errorLength.empId) {
      isFormValid = false;
    }
    if (this.state.store === undefined) {
      isFormValid = false;
    }
    if (String(this.state.quantity).length === 0) {
      isFormValid = false;
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
        // status: selectedDomain === "Retail" ? this.state.status : null,
        // productValidity:
        //   selectedDomain === "Retail" ? this.state.productValidity : null,
        // isBarcode: selectedDomain === "Retail" ? false : null,
        division: parseInt(this.state.divisionId),
        section: parseInt(this.state.sectionId),
        subSection: parseInt(this.state.subSectionId),
        category: parseInt(this.state.catogirieId),
        batchNo: this.state.batchNo,
        name: this.state.name,
        colour: this.state.colour,
        costPrice: this.state.costPrice,
        empId: this.state.empId,
        hsnCode: this.state.hsnCode,
        itemMrp: this.state.listPrice,
        qty: this.state.quantity,
        storeId: this.state.storeId,
        uom: this.state.uomName,
        domainType: this.state.selectedDomain,
        vendorTax: this.state.vendorTax
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
            ToastAndroid.show(`Barcode Created Successfully`, ToastAndroid.LONG);
          } else {
            ToastAndroid.show(response.message, ToastAndroid.LONG);
          }
          console.log({ res });
          this.setState({ loading: false });
        })
        .catch((err) => {
          this.setState({ loading: false });
          ToastAndroid.show(err, ToastAndroid.SHORT);
        });
    } else {
      alert("Fill All Mandatory Fields");
    }
  }

  // Cancel Add Barcode
  cancel() {
    this.props.navigation.goBack(null);
  }

  render() {
    return (
      <View>
        {this.state.loading && <Loader loading={this.state.loading} />}
        < Appbar mode="center-aligned" style={styles.mainContainer} >
          <Appbar.BackAction
            onPress={() => this.handleBackButtonClick()}
          />
          <Appbar.Content title="Add Barcode" />
        </Appbar >
        <KeyboardAwareScrollView>
          <Text style={inputHeading}>
            {I18n.t("Domian")} <Text style={{ color: "#aa0000" }}>*</Text>{" "}
          </Text>
          <View
            style={[
              rnPickerContainer,
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
                    color="grey"
                  />
                );
              }}
              items={data1}
              onValueChange={(value) => {
                this.handleDomain(value);
              }}
              on
              style={rnPicker}
              value={this.state.selectedDomain}
              useNativeAndroidPickerStyle={false}
            />
          </View>
          <View>
            <Text style={inputHeading}>
              {I18n.t("Division")} <Text style={{ color: "#aa0000" }}>*</Text>{" "}
            </Text>
            <View
              style={[
                rnPickerContainer,
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
                      color="grey"
                    />
                  );
                }}
                items={this.state.divisionsList}
                onValueChange={(value) => this.handleDivision(value)}
                style={rnPicker}
                value={this.state.selectedDivision}
                useNativeAndroidPickerStyle={false}
              />
            </View>
            <Text style={inputHeading}>
              {I18n.t("Section")} <Text style={{ color: "#aa0000" }}>*</Text>{" "}
            </Text>
            <View
              style={[
                rnPickerContainer,
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
                      color="grey"
                    />
                  );
                }}
                items={this.state.sectionsList}
                onValueChange={this.handleSection}
                style={rnPicker}
                value={this.state.section}
                useNativeAndroidPickerStyle={false}
              />
            </View>
            <Text style={inputHeading}>
              {I18n.t("Sub Section")}{" "}
              <Text style={{ color: "#aa0000" }}>*</Text>{" "}
            </Text>
            <View
              style={[
                rnPickerContainer,
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
                      color="grey"
                    />
                  );
                }}
                items={this.state.subSectionsList}
                onValueChange={this.handleSubSection}
                style={rnPicker}
                value={this.state.subSection}
                useNativeAndroidPickerStyle={false}
              />
            </View>
            <Text style={inputHeading}>
              {I18n.t("Category")} <Text style={{ color: "#aa0000" }}>*</Text>{" "}
            </Text>
            <View
              style={[
                rnPickerContainer,
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
                      color="grey"
                    />
                  );
                }}
                items={this.state.categoriesList}
                onValueChange={this.handleCateory}
                style={rnPicker}
                value={this.state.category}
                useNativeAndroidPickerStyle={false}
              />
            </View>
          </View>
          {this.state.selectedDomain === "Retail" && ( // For Retail Domain only
            <View>
              <Text style={inputHeading}>
                {I18n.t("status")} <Text style={{ color: "#aa0000" }}>*</Text>{" "}
              </Text>
              <View
                style={[
                  rnPickerContainer,
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
                        color="grey"
                      />
                    );
                  }}
                  items={retailStatus}
                  onValueChange={this.handleStatus}
                  style={rnPicker}
                  value={this.state.selectedStatus}
                  useNativeAndroidPickerStyle={false}
                />
              </View>
              <Text style={inputHeading}>
                Stock Date <Text style={{ color: "#aa0000" }}>*</Text>{" "}
              </Text>
              <TouchableOpacity
                style={dateSelector}
                testID="openModal"
                onPress={() => this.datepickerClicked()}
              >
                <Text style={dateText}>
                  {this.state.productValidity === ""
                    ? "YYYY-MM-DD"
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
          {this.state.selectedDomain === "FruitsAndVegetables" && (
            <View>
              <Text style={inputHeading}>{I18n.t("Size")}</Text>
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
                  items={this.state.sizeList}
                  onValueChange={this.handleSize}
                  style={rnPicker}
                  value={this.state.size}
                  useNativeAndroidPickerStyle={false}
                />
              </View>
              <Text style={inputHeading}> {I18n.t("Brand Name")} </Text>
              <TextInput
                activeOutlineColor="#d6d6d6"
                mode="outlined"
                style={[
                  forms.input_fld,
                  forms.active_fld,
                  {},
                ]}
                underlineColorAndroid="transparent"
                placeholder={I18n.t("Brand Name")}
                placeholderTextColor={"#6f6f6f"}
                textAlignVertical="center"
                maxLength={12}
                outlineColor={"#d6d6d6"}
                autoCapitalize="none"
                value={this.state.brand}
                onChangeText={this.handleBrand}
              />
              <Text style={inputHeading}> {I18n.t("Expiry Date")} </Text>
              <TouchableOpacity
                style={dateSelector}
                testID="openModal"
                onPress={() => this.datepickerClicked()}
              >
                <Text style={dateText}>
                  {this.state.expiryDateFruitsDomain === ""
                    ? "YYYY-MM-DD"
                    : this.state.expiryDateFruitsDomain}
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
                    setDate={this.handleExpiryFruitsDomainDate}
                  />
                </View>
              )}
            </View>)}
          <Text style={inputHeading}>
            {I18n.t("Colour")} <Text style={{ color: "#aa0000" }}>*</Text>{" "}
          </Text>
          <TextInput
            activeOutlineColor="#d6d6d6"
            mode="outlined"
            style={[
              forms.input_fld,
              forms.active_fld,
              {},
            ]}
            underlineColorAndroid="transparent"
            placeholder={I18n.t("Colour")}
            placeholderTextColor={"#6f6f6f"}
            textAlignVertical="center"
            maxLength={12}
            outlineColor={"#d6d6d6"}
            autoCapitalize="none"
            onBlur={this.handleColourValid}
            value={this.state.colour}
            onChangeText={this.handleColour}
          />
          <Text style={inputHeading}>
            {I18n.t("Name")} <Text style={{ color: "#aa0000" }}>*</Text>{" "}
          </Text>
          <TextInput
            activeOutlineColor="#d6d6d6"
            mode="outlined"
            outlineColor={"#d6d6d6"}
            style={[
              forms.input_fld,
              forms.active_fld,
            ]}
            underlineColorAndroid="transparent"
            placeholder={I18n.t("Name")}
            placeholderTextColor={"#676767"}
            maxLength={25}
            textAlignVertical="center"
            autoCapitalize="none"
            value={this.state.name}
            onBlur={this.handleNameValid}
            onChangeText={this.handleName}
          />
          <Text style={inputHeading}>
            {I18n.t("Batch No")} <Text style={{ color: "#aa0000" }}>*</Text>{" "}
          </Text>
          <TextInput
            activeOutlineColor="#d6d6d6"
            mode="outlined"
            outlineColor={"#d6d6d6"}
            style={[
              forms.input_fld,
              forms.active_fld,
            ]}
            underlineColorAndroid="transparent"
            placeholder={I18n.t("Batch No")}
            placeholderTextColor={"#676767"}
            textAlignVertical="center"
            maxLength={12}
            autoCapitalize="none"
            value={this.state.batchNo}
            onBlur={this.handleBatchNoValid}
            onChangeText={this.handleBatchNo}
          />
          <Text style={inputHeading}>
            {I18n.t("Cost Price")} <Text style={{ color: "#aa0000" }}>*</Text>{" "}
          </Text>
          <TextInput
            activeOutlineColor="#d6d6d6"
            mode="outlined"
            outlineColor={"#d6d6d6"}
            style={[
              forms.input_fld,
              forms.active_fld,
            ]}
            underlineColorAndroid="transparent"
            placeholder={I18n.t("Cost Price")}
            keyboardType={"numeric"}
            textContentType="telephoneNumber"
            placeholderTextColor={"#676767"}
            textAlignVertical="center"
            autoCapitalize="none"
            maxLength={10}
            value={this.state.costPrice}
            onBlur={this.handleCostPriceValid}
            onChangeText={this.handleCostPrice}
          />
          <Text style={inputHeading}>
            {I18n.t("MRP")} <Text style={{ color: "#aa0000" }}>*</Text>{" "}
          </Text>
          <TextInput
            activeOutlineColor="#d6d6d6"
            mode="outlined"
            outlineColor={"#d6d6d6"}
            style={[
              forms.input_fld,
              forms.active_fld,
            ]}
            underlineColorAndroid="transparent"
            placeholder={I18n.t("MRP")}
            keyboardType={"numeric"}
            textContentType="telephoneNumber"
            placeholderTextColor={"#676767"}
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
              forms.active_fld,
            ]}
            underlineColorAndroid="transparent"
            placeholder={I18n.t("Vendor Tax")}
            keyboardType={"numeric"}
            textContentType="telephoneNumber"
            placeholderTextColor={"#676767"}
            textAlignVertical="center"
            autoCapitalize="none"
            maxLength={10}
            value={this.state.vendorTax}
            onChangeText={this.handleVendorTax}
            onBlur={this.handleVendorTaxValid}
          />
          <Text style={inputHeading}>
            {I18n.t("UOM")} <Text style={{ color: "#aa0000" }}>*</Text>{" "}
          </Text>
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
              items={this.state.uomList}
              onValueChange={this.handleUOM}
              style={rnPicker}
              value={this.state.uomName}
              useNativeAndroidPickerStyle={false}
            />
          </View>
          <Text style={inputHeading}>
            {I18n.t("HSN Code")} <Text style={{ color: "#aa0000" }}>*</Text>{" "}
          </Text>
          <View
            style={[
              rnPickerContainer,
              { borderColor: "#d6d6d6" },
            ]}
          >
            <RNPickerSelect
              placeholder={{
                label: "Enter HSN Code",
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
              items={this.state.hsnCodesList}
              onValueChange={this.handleHSNCode}
              style={rnPicker}
              value={this.state.hsnCode}
              useNativeAndroidPickerStyle={false}
            />
          </View>
          <Text style={inputHeading}>
            {I18n.t("EMP ID")} <Text style={{ color: "#aa0000" }}>*</Text>{" "}
          </Text>
          <TextInput
            activeOutlineColor="#000"
            mode="outlined"
            outlineColor={"#d6d6d6"}
            keyboardType="numeric"
            style={[
              forms.input_fld,
              forms.active_fld,
            ]}
            underlineColorAndroid="transparent"
            placeholder="EMP ID"
            placeholderTextColor={"#676767"}
            textAlignVertical="center"
            maxLength={10}
            autoCapitalize="none"
            value={this.state.empId}
            onBlur={this.handleEMPIdValid}
            onChangeText={this.handleEMPId}
          />
          <Text style={inputHeading}>
            {I18n.t("Store")} <Text style={{ color: "#aa0000" }}>*</Text>{" "}
          </Text>
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
              items={this.state.storesList}
              onValueChange={this.handleStore}
              style={rnPicker}
              value={this.state.store}
              useNativeAndroidPickerStyle={false}
            />
          </View>
          <Text style={inputHeading}>
            QTY <Text style={{ color: "#aa0000" }}>*</Text>{" "}
          </Text>
          <TextInput
            activeOutlineColor="#000"
            mode="outlined"
            outlineColor={"#d6d6d6"}
            style={[
              forms.input_fld,
              forms.active_fld,
            ]}
            underlineColorAndroid="transparent"
            placeholder="QTY"
            placeholderTextColor={"#676767"}
            textAlignVertical="center"
            maxLength={12}
            autoCapitalize="none"
            value={this.state.quantity}
            onBlur={this.handleQuantityValid}
            onChangeText={this.handleQuantity}
          />
          <View style={forms.action_buttons_container}>
            <TouchableOpacity style={[forms.action_buttons, { backgroundColor: this.state.saveButtonDisabled ? color.accent : color.disableBackGround }]}
              disabled={!this.state.saveButtonDisabled}
              onPress={() => this.saveBarcode()}>
              <Text style={forms.submit_btn_text} >{I18n.t("SAVE")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[forms.action_buttons, forms.cancel_btn]}
              onPress={() => this.cancel()}>
              <Text style={forms.cancel_btn_text}>{I18n.t("CANCEL")}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bottomContainer}></View>
        </KeyboardAwareScrollView >
      </View >
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
    borderColor: "#d6d6d617",
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
    color: "#d6d6d6",
    fontSize: RF(15),
  },
  rnSelectContainer_mobile: {
    justifyContent: "center",
    margin: RW(20),
    height: RH(44),
    marginTop: RH(5),
    marginBottom: RH(10),
    borderColor: "#d6d6d617",
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
    borderColor: "#d6d6d617",
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
    color: "#d6d6d6",
    fontSize: 20,
  },
  rnSelectContainer_tablet: {
    justifyContent: "center",
    margin: RH(20),
    height: RH(54),
    marginTop: 5,
    marginBottom: RH(10),
    borderColor: "#d6d6d617",
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
    height: 280,
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
