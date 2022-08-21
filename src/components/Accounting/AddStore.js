import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { Component } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Device from "react-native-device-detection";
import I18n from "react-native-i18n";
import RNPickerSelect from "react-native-picker-select";
import { Chevron } from "react-native-shapes";
import Loader from "../../commonUtils/loader";
import { RF } from "../../Responsive";
import {
  accountingErrorMessages,
  errorLength,
  urmErrorMessages
} from "../Errors/errors";
import Message from "../Errors/Message";
import LoginService from "../services/LoginService";
import UrmService from "../services/UrmService";
import {
  cancelBtn,
  cancelBtnText,
  inputField,
  inputHeading,
  rnPicker,
  rnPickerContainer,
  rnPickerError,
  submitBtn,
  submitBtnText
} from "../Styles/FormFields";
import {
  backButton,
  backButtonImage,
  headerTitle,
  headerTitleContainer,
  headerTitleSubContainer
} from "../Styles/Styles";

var deviceHeight = Dimensions.get("window").height;
var deviceWidth = Dimensions.get("window").width;

export default class AddStore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      storeState: "",
      storeDistrict: "",
      storeName: "",
      gstNumber: "",
      mobile: "",
      city: "",
      area: "",
      address: "",
      domain: "",
      clientId: 0,
      userId: 0,
      statesArray: [],
      states: [],
      stateId: 0,
      statecode: "",
      dictrictArray: [],
      dictricts: [],
      districtId: 0,
      domainsArray: [],
      domains: [],
      domainId: 0,
      storeId: 0,
      navtext: "",
      isEdit: false,
      errors: {},
      storeValid: true,
      stateValid: true,
      districtValid: true,
      domianValid: true,
      mobileValid: true,
      gstValid: true,
      statusValid: true,
      storeStatus: "",
      gstEdit: true,
    };
  }

  async componentDidMount() {
    const clientId = await AsyncStorage.getItem("custom:clientId1");
    const userId = await AsyncStorage.getItem("userId");
    console.log(userId);
    this.setState({ clientId: clientId, userId: userId });
    this.setState({ isEdit: this.props.route.params.isEdit });
    if (this.state.isEdit === true) {
      const storeItem = this.props.route.params.item;
      console.log({ storeItem });
      this.setState({
        stateId: this.props.route.params.item.stateId,
        statecode: this.props.route.params.item.stateCode,
        districtId: this.props.route.params.item.districtId,
        city: this.props.route.params.item.cityId,
        area: this.props.route.params.item.area,
        mobile: this.props.route.params.item.phoneNumber,
        address: this.props.route.params.item.address,
        domainId: this.props.route.params.item.id.domaiName,
        storeName: this.props.route.params.item.name,
        storeId: this.props.route.params.item.id,
        gstNumber: this.props.route.params.item.gstNumber,
        storeStatus: this.props.route.params.item.isActive,
      });
      console.log(this.props.route.params.item);
      this.setState({ navtext: "Edit Store" });
    } else {
      this.setState({ navtext: "Add Store" });
    }
    this.getDomainsList();
    this.getMasterStatesList();
  }

  getDomainsList() {
    this.setState({ domains: [] });
    var domains = [];
    axios
      .get(LoginService.getDomainsList() + this.state.clientId)
      .then((res) => {
        if (res.data["result"]) {
          console.log("domain", res.data.result);
          let len = res.data["result"].length;
          if (len > 0) {
            for (let i = 0; i < len; i++) {
              let number = res.data.result[i];
              this.state.domainsArray.push({
                name: number.domaiName,
                id: number.id,
              });
              domains.push({
                value: this.state.domainsArray[i].name,
                label: this.state.domainsArray[i].name,
              });

              if (number.clientDomainaId === this.state.domainId) {
                this.setState({ domain: this.state.domainsArray[i].name });
              }
            }
            this.setState({
              domains: domains,
            });

            this.setState({ domainsArray: this.state.domainsArray });
            console.log(this.state.domains);
          }
        }
      })
      .catch(() => {
        this.setState({ loading: false });
        this.setState({ loading: false });
        alert("There Is An Error Getting Domains List");
      });
  }

  handleDomain = (value) => {
    console.log(value);
    for (let i = 0; i < this.state.domainsArray.length; i++) {
      if (this.state.domainsArray[i].name === value) {
        this.setState({ domainId: this.state.domainsArray[i].id });
        console.log(this.state.domainsArray[i].id);
      }
    }
    this.setState({ domain: value });

    if (this.state.domain !== "" && this.state.domain !== undefined) {
      this.setState({ domianValid: true });
    }
  };

  getGSTNumber() {
    const { clientId, statecode } = this.state
    console.log("hey.............")
    UrmService.getGSTNumber(clientId, statecode).then((res) => {
      if (res) {
        let gstResult = res.data
        console.log({ gstResult })
        if (res.data.result !== null) {
          this.setState({ gstNumber: res.data.result.gstNumber, gstEdit: false });
        } else {
          this.setState({ gstNumber: "", gstEdit: true });
        }
      }
    });
  }

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
      this.getGSTNumber()
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

  handleDistrict = (value) => {
    for (let i = 0; i < this.state.dictrictArray.length; i++) {
      if (this.state.dictrictArray[i].name === value) {
        console.log("district name  is" + this.state.dictrictArray[i].id);
        this.setState({ districtId: this.state.dictrictArray[i].id });
      }
    }
    this.setState({ storeDistrict: value });

    if (
      this.state.storeDistrict !== "" &&
      this.state.storeDistrict !== undefined
    ) {
      this.setState({ districtValid: true });
    }
  };

  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }

  cancel() {
    this.props.navigation.goBack(null);
    return true;
  }

  handleAddress = (value) => {
    this.setState({ address: value });
  };

  handleArea = (value) => {
    this.setState({ area: value });
  };

  handleCity = (value) => {
    this.setState({ city: value });
  };

  handleGstNumber = (value) => {
    this.setState({ gstNumber: value });
  };

  handleMobile = (value) => {
    this.setState({ mobile: value });
  };

  handleStatus = (value) => {
    this.setState({ storeStatus: value });
  };

  handleStoreName = (value) => {
    this.setState({ storeName: value });
  };


  validationForm() {
    let errors = {};
    let formIsValid = true;
    console.log(this.state.domain);
    const mobReg = /^[0-9\b]+$/;

    if (this.state.storeState === "" || this.state.storeState === undefined) {
      errors["state"] = accountingErrorMessages.state;
      formIsValid = false;
      this.setState({ stateValid: false });
    }
    if (this.state.storeDistrict === "") {
      errors["district"] = accountingErrorMessages.district;
      formIsValid = false;
      this.setState({ districtValid: false });
    }

    if (
      this.state.storeName.length < errorLength.name ||
      this.state.storeName === undefined
    ) {
      errors["store"] = accountingErrorMessages.storeName;
      formIsValid = false;
      this.setState({ storeValid: false });
    }
    if (
      mobReg.test(this.state.mobile) === false ||
      this.state.mobile.length < errorLength.mobile
    ) {
      errors["mobile"] = urmErrorMessages.mobile;
      formIsValid = false;
      this.setState({ mobileValid: false });
    }
    if (this.state.gstNumber.length < errorLength.gstNumber) {
      errors["gst"] = accountingErrorMessages.gst;
      formIsValid = false;
      this.setState({ gstValid: false });
    }

    if (this.state.storeStatus === "") {
      erros["status"] = urmErrorMessages.status;
    }

    this.setState({ errors: errors });
    return formIsValid;
  }

  handleGstNumberValid = () => {
    if (this.state.gstNumber.length !== 0) {
      this.setState({ gstValid: true });
    }
  };

  handleStoreNameValid = () => {
    if (this.state.storeName.length >= errorLength.name) {
      this.setState({ storeValid: true });
    }
  };

  handleMobileValid = () => {
    const mobReg = /^[0-9\b]+$/;
    if (
      this.state.mobile.length >= errorLength.mobile &&
      mobReg.test(this.state.mobile) === true
    ) {
      this.setState({ mobileValid: true });
    }
  };

  saveStore() {
    const formIsValid = this.validationForm();
    if (formIsValid) {
      if (this.state.isEdit === false) {
        const saveObj = {
          name: this.state.storeName,
          stateId: this.state.stateId,
          districtId: this.state.districtId,
          cityId: this.state.city,
          area: this.state.area,
          address: this.state.address,
          phoneNumber: this.state.mobile,
          createdBy: parseInt(this.state.userId),
          stateCode: this.state.statecode,
          gstNumber: this.state.gstNumber,
          clientId: this.state.clientId,
        };
        console.log("params are" + JSON.stringify(saveObj));
        this.setState({ loading: true });
        axios
          .post(UrmService.saveStore(), saveObj)
          .then((res) => {
            console.log(res.data);
            if (res?.data) {
              this.props.route.params.onGoBack();
              this.props.navigation.goBack();
            } else {
              this.setState({ loading: false });
              alert(res.data.message);
            }
          })
          .catch(() => {
            this.setState({ loading: false });
            this.setState({ loading: false });
            alert("There is an Error while Saving The Store");
          });
      } else {
        const saveObj = {
          id: this.state.storeId,
          name: this.state.storeName,
          stateId: this.state.stateId,
          districtId: this.state.districtId,
          cityId: this.state.city,
          area: this.state.area,
          address: this.state.address,
          phoneNumber: this.state.mobile,
          domainId: this.state.domainId,
          createdBy: parseInt(this.state.userId),
          stateCode: this.state.statecode,
          gstNumber: this.state.gstNumber,
          clientId: this.state.clientId,
          isActive: this.state.storeStatus,
        };
        console.log("save", saveObj);
        this.setState({ loading: true });
        axios
          .put(UrmService.editStore(), saveObj)
          .then((res) => {
            if (res.data) {
              this.setState({ loading: false });
              this.props.route.params.onGoBack();
              this.props.navigation.goBack();
            }
          })
          .catch(() => {
            this.setState({ loading: false });
            this.setState({ loading: false });
            alert("There is an Error while Saving the Store");
          });
      }
    }
  }

  render() {
    const {
      stateValid,
      storeValid,
      districtValid,
      mobileValid,
      gstValid,
      statusValid,
    } = this.state;
    return (
      <View style={styles.mainContainer}>
        {this.state.loading && <Loader loading={this.state.loading} />}
        <View style={headerTitleContainer}>
          <View style={headerTitleSubContainer}>
            <TouchableOpacity
              style={backButton}
              onPress={() => this.handleBackButtonClick()}
            >
              <Image
                style={backButtonImage}
                source={require("../assets/images/backButton.png")}
              />
            </TouchableOpacity>
            <Text style={headerTitle}>{this.state.navtext}</Text>
          </View>
        </View>
        <ScrollView>
          <Text
            style={{
              color: "#ED1C24",
              fontSize: Device.isTablet ? 19 : 14,
              fontFamily: "medium",
              margin: 15,
            }}
          >
            {I18n.t("Store Details")}
          </Text>
          <Text style={inputHeading}>
            {I18n.t("State")} <Text style={{ color: "#aa0000" }}>*</Text>
          </Text>
          <View
            style={[
              rnPickerContainer,
              { borderColor: stateValid ? "#8F9EB717" : "#dd0000" },
            ]}
          >
            <RNPickerSelect
              placeholder={{
                label: "STATE",
              }}
              Icon={() => {
                return (
                  <Chevron
                    style={styles.imagealign}
                    size={1.5}
                    color={stateValid ? "gray" : "#dd0000"}
                  />
                );
              }}
              items={this.state.states}
              disabled={this.state.isEdit ? true : false}
              onValueChange={(value) => this.handleStoreState(value)}
              style={stateValid ? rnPicker : rnPickerError}
              value={this.state.storeState}
              useNativeAndroidPickerStyle={false}
            />
          </View>
          {!stateValid && (
            <Message imp={true} message={this.state.errors["state"]} />
          )}
          <Text style={inputHeading}>
            {I18n.t("District")} <Text style={{ color: "#aa0000" }}>*</Text>
          </Text>
          <View
            style={[
              rnPickerContainer,
              { borderColor: districtValid ? "#8F9EB717" : "#dd0000" },
            ]}
          >
            <RNPickerSelect
              // style={Device.isTablet ? styles.rnSelect_tablet : styles.rnSelect_mobile}
              placeholder={{
                label: "DISTRICT",
              }}
              Icon={() => {
                return (
                  <Chevron
                    style={styles.imagealign}
                    size={1.5}
                    color={districtValid ? "gray" : "#dd0000"}
                  />
                );
              }}
              items={this.state.dictricts}
              onValueChange={(value) => this.handleDistrict(value)}
              disabled={this.state.isEdit ? true : false}
              style={districtValid ? rnPicker : rnPickerError}
              value={this.state.storeDistrict}
              useNativeAndroidPickerStyle={false}
            />
          </View>
          {!districtValid && (
            <Message imp={true} message={this.state.errors["district"]} />
          )}
          <Text style={inputHeading}>{I18n.t("City")}</Text>
          <TextInput
            style={inputField}
            underlineColorAndroid="transparent"
            placeholder={I18n.t("CITY")}
            placeholderTextColor="#6F6F6F"
            textAlignVertical="center"
            autoCapitalize="none"
            value={this.state.city}
            onChangeText={(value) => this.handleCity(value)}
          />

          <Text style={inputHeading}>{I18n.t("Area")}</Text>
          <TextInput
            style={inputField}
            underlineColorAndroid="transparent"
            placeholder={I18n.t("AREA")}
            placeholderTextColor="#6F6F6F"
            textAlignVertical="center"
            autoCapitalize="none"
            value={this.state.area}
            onChangeText={(value) => this.handleArea(value)}
          />
          <Text style={inputHeading}>
            {I18n.t("Store Phone Number")}{" "}
            <Text style={{ color: "#aa0000" }}>*</Text>
          </Text>
          <TextInput
            style={[
              inputField,
              { borderColor: mobileValid ? "#8F9EB717" : "#dd0000" },
            ]}
            underlineColorAndroid="transparent"
            placeholder={I18n.t("Phone Number")}
            maxLength={10}
            keyboardType={"numeric"}
            textContentType="telephoneNumber"
            placeholderTextColor={mobileValid ? "#6F6F6F" : "#dd0000"}
            textAlignVertical="center"
            autoCapitalize="none"
            onBlur={(value) => this.handleMobileValid(value)}
            value={this.state.mobile}
            onChangeText={(value) => this.handleMobile(value)}
          />
          {!mobileValid && (
            <Message imp={true} message={this.state.errors["mobile"]} />
          )}
          <Text style={inputHeading}>{"Address"}</Text>
          <TextInput
            style={inputField}
            underlineColorAndroid="transparent"
            placeholder={I18n.t("ADDRESS")}
            placeholderTextColor="#6F6F6F"
            textAlignVertical="center"
            autoCapitalize="none"
            value={this.state.address}
            onChangeText={(value) => this.handleAddress(value)}
          />
          <Text
            style={{
              color: "#ED1C24",
              fontSize: RF(14),
              fontFamily: "medium",
              margin: 15,
            }}
          >
            {I18n.t("Store Info")}
          </Text>
          <Text style={inputHeading}>
            Status <Text style={{ color: "#aa0000" }}>*</Text>
          </Text>
          <View
            style={[
              rnPickerContainer,
              { borderColor: statusValid ? "#8f9eb718" : "#dd0000" },
            ]}
          >
            <RNPickerSelect
              placeholder={{
                label: "Status",
                value: "",
              }}
              Icon={() => {
                return (
                  <Chevron
                    style={styles.imagealign}
                    size={1.5}
                    color={statusValid ? "gray" : "#dd0000"}
                  />
                );
              }}
              items={[
                { label: "Active", value: true },
                { label: "InActive", value: false },
              ]}
              onValueChange={(value) => this.handleStatus(value)}
              style={statusValid ? rnPicker : rnPickerError}
              value={this.state.storeStatus}
              useNativeAndroidPickerStyle={false}
            />
          </View>
          {!statusValid && (
            <Message imp={true} message={this.state.errors["status"]} />
          )}
          <Text style={inputHeading}>
            {I18n.t("Store Name")} <Text style={{ color: "#aa0000" }}>*</Text>
          </Text>
          <TextInput
            style={[
              inputField,
              { borderColor: storeValid ? "#8F9EB717" : "#dd0000" },
            ]}
            underlineColorAndroid="transparent"
            placeholder={I18n.t("STORE NAME")}
            placeholderTextColor={storeValid ? "#6F6F6F" : "#dd0000"}
            textAlignVertical="center"
            autoCapitalize="none"
            onBlur={(value) => this.handleStoreNameValid(value)}
            value={this.state.storeName}
            onChangeText={(value) => this.handleStoreName(value)}
          />
          {!storeValid && (
            <Message imp={true} message={this.state.errors["store"]} />
          )}
          {this.state.isEdit === true && (
            <View>
              <Text style={inputHeading}>
                {I18n.t("GST Number")}{" "}
                <Text style={{ color: "#aa0000" }}>*</Text>
              </Text>
              <TextInput
                style={inputField}
                underlineColorAndroid="transparent"
                placeholder={I18n.t("GST NUMBER")}
                placeholderTextColor="#6F6F6F"
                textAlignVertical="center"
                maxLength={15}
                autoCapitalize="none"
                value={this.state.gstNumber}
                editable={false}
                selectTextOnFocus={false}
                onChangeText={(value) => this.handleGstNumber(value)}
              />
            </View>
          )}
          {this.state.isEdit === false && (
            <View>
              <Text style={inputHeading}>
                {I18n.t("GST Number")}{" "}
                <Text style={{ color: "#aa0000" }}>*</Text>
              </Text>
              <TextInput
                style={[
                  inputField,
                  { borderColor: gstValid ? "#8F9EB717" : "#dd0000" },
                ]}
                underlineColorAndroid="transparent"
                placeholder={I18n.t("GST NUMBER")}
                placeholderTextColor={gstValid ? "#6F6F6F" : "#dd0000"}
                textAlignVertical="center"
                autoCapitalize="none"
                editable={this.state.gstEdit}
                maxLength={15}
                value={this.state.gstNumber}
                onBlur={(value) => this.handleGstNumberValid(value)}
                onChangeText={(value) => this.handleGstNumber(value)}
              />
              {!gstValid && (
                <Message imp={true} message={this.state.errors["gst"]} />
              )}
            </View>
          )}

          <TouchableOpacity style={submitBtn} onPress={() => this.saveStore()}>
            <Text style={submitBtnText}>{I18n.t("SAVE")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={cancelBtn} onPress={() => this.cancel()}>
            <Text style={cancelBtnText}>{I18n.t("CANCEL")}</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}

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
});
