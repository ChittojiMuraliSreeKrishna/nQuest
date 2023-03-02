import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { Component } from "react";
import {
  Dimensions, ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Device from "react-native-device-detection";
import I18n from "react-native-i18n";
import { Appbar, TextInput } from "react-native-paper";
import RNPickerSelect from "react-native-picker-select";
import { Chevron } from "react-native-shapes";
import forms from '../../commonUtils/assets/styles/formFields.scss';
import Loader from "../../commonUtils/loader";
import RnPicker from "../../commonUtils/RnPicker";
import { RF } from "../../Responsive";
import {
  accountingErrorMessages,
  errorLength,
  urmErrorMessages
} from "../Errors/errors";
import Message from "../Errors/Message";
import UrmService from "../services/UrmService";
import {
  cancelBtn,
  cancelBtnText, inputHeading,
  rnPicker,
  rnPickerContainer,
  rnPickerDisabled,
  rnPickerError,
  submitBtn,
  submitBtnText
} from "../Styles/FormFields";

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
      states: [],
      stateId: 0,
      statecode: "",
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
      cityValid: true
    };
  }

  async componentDidMount() {
    const clientId = await AsyncStorage.getItem("custom:clientId1");
    const userId = await AsyncStorage.getItem("userId");
    console.log(userId);
    this.setState({ clientId: clientId, userId: userId, loading: true });
    this.setState({ isEdit: this.props.route.params.isEdit });
    if (this.state.isEdit === true) {
      const storeItem = this.props.route.params.item;
      console.log({ storeItem });
      console.log(storeItem.stateCode, "codeState");
      this.setState({
        loading: true,
        stateId: storeItem.stateId,
        statecode: storeItem.stateCode,
        storeState: storeItem.stateCode,
        districtId: storeItem.districtId,
        storeDistrict: storeItem.districtId,
        city: storeItem.cityId,
        area: storeItem.area,
        mobile: storeItem.phoneNumber,
        address: storeItem.address,
        domainId: storeItem.id.domaiName,
        storeName: storeItem.name,
        storeId: storeItem.id,
        gstNumber: storeItem.gstNumber,
        storeStatus: storeItem.isActive,
      }, () => {
        this.getMasterStatesList();
        this.getMasterDistrictsList(this.state.storeState);
      });
      this.setState({ navtext: "Edit Store" });
    } else {
      this.setState({ navtext: "Add Store" });
      this.getMasterStatesList();
    }
    console.log("storeStaet", this.state.storeState, this.state.districtId);
    setTimeout(() => {
      this.setState({loading: false})
    }, 5000);

    // this.getDomainsList();
  }


  getGSTNumber() {
    const { clientId, statecode } = this.state;
    console.log({ clientId, statecode });
    UrmService.getGSTNumber(clientId, statecode).then((res) => {
      if (res) {
        let gstResult = res.data;
        console.log({ gstResult });
        if (res.data.result !== null) {
          this.setState({ gstNumber: res.data.result.gstNumber, gstEdit: false });
        } else {
          this.setState({ gstNumber: "", gstEdit: true });
        }
      }
    });
  }

  getMasterStatesList() {
    this.setState({ states: [], loading: true });
    var states = [];
    UrmService.getStates().then((res) => {
      console.log(res.data);
      if (res.data["result"]) {
        for (var i = 0; i < res.data["result"].length; i++) {
          states.push({
            value: res.data.result[i].stateCode,
            label: res.data.result[i].stateName,
          });
          this.setState({
            states: states,
            loading: false
          });
        }
      }
      if(this.state.isEdit) {
        this.state.states.push({"selectedValue": this.state.stateId})
        this.setState({states: this.state.states})
      }
      console.log(this.state.states, "states");
    });
  }
  handleStoreState = (value) => {
    if(value){
      this.setState({ storeState: value, statecode: value }, () => {
        console.log({ value });
        console.log(this.state.statecode, "yktld", this.state.storeState);
        this.getGSTNumber();
        this.getMasterDistrictsList(this.state.statecode);
      });
    }
  };

  // Store Districts
  getMasterDistrictsList(id) {
    this.setState({dictricts: [], loading: true });
    UrmService.getDistricts(id).then((res) => {
      if (res.data["result"]) {
        let dictricts = [];
        for (var i = 0; i < res.data["result"].length; i++) {
          dictricts.push({
            value: res.data.result[i].districtId,
            label: res.data.result[i].districtName,
          });
          console.log({ dictricts });
          this.setState({
            dictricts: dictricts,
            loading: false
          });
          if(this.state.isEdit){
            this.state.dictricts.push({"selectedValue": this.state.districtId})
            this.setState({dictricts: this.state.dictricts})
          }
        }
      }
    });
  }
  handleDistrict = (value) => {
    if (!this.state.isEdit) {
      this.setState({ storeDistrict: value, districtId: value });
    }
  };

  handleBackButtonClick() {
    this.setState({loading: true})
    this.props.navigation.goBack(null);
    this.props.route.params.onGoBack(null);
    return true;
  }

  cancel() {
    this.props.navigation.goBack(null);
    this.props.route.params.onGoBack(null);
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

    if (this.state.city.length === 0) {
      errors["city"] = accountingErrorMessages.city;
      formIsValid = false;
      this.setState({ cityValid: false });
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
      errors["status"] = urmErrorMessages.status;
    }

    if (this.state.city === "") {
      errors['city'] = urmErrorMessages.city;
      formIsValid = false;
      this.setState({ cityValid: false });
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

  handleCityValid = () => {

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
          isActive: true,
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
              alert("store added successfully");
              this.setState({ loading: true })
            } else {
              this.setState({ loading: false });
              // alert(res.data.message);
            }
          })
          .catch(() => {
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
              this.setState({ loading: true });
              this.props.route.params.onGoBack();
              this.props.navigation.goBack();
            }
          })
          .catch(() => {
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
      cityValid,
      isEdit,
    } = this.state;
    return (
      <View style={styles.mainContainer}>
        {this.state.loading && <Loader loading={this.state.loading} />}
        <Appbar mode="center-aligned">
          <Appbar.BackAction onPress={() => this.handleBackButtonClick()} />
          <Appbar.Content title={this.state.navtext} />
        </Appbar>
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
          <RnPicker
            items={this.state.states}
            setValue={this.handleStoreState}
            editValue={this.state.storeState}
            isEdit={this.state.isEdit}
            disabled={this.state.isEdit ? true : false}
          />
          {!stateValid && (
            <Message imp={true} message={this.state.errors["state"]} />
          )}
          <Text style={inputHeading}>
            {I18n.t("District")} <Text style={{ color: "#aa0000" }}>*</Text>
          </Text>
          <RnPicker
            items={this.state.dictricts}
            setValue={this.handleDistrict}
            editValue={this.state.storeDistrict}
            isEdit={this.state.isEdit}
            disabled={this.state.isEdit ? true : false}
          />
          {!districtValid && (
            <Message imp={true} message={this.state.errors["district"]} />
          )}

          <Text style={inputHeading}>{I18n.t("City")} <Text style={{ color: "#aa0000" }}>*</Text> </Text>

          <TextInput
            activeUnderlineColor="#000"
            mode="flat"
            underlineColor={cityValid ? "#8F9EB717" : "#dd0000"}
            style={[forms.input_fld, forms.active_fld]}
            placeholder={I18n.t("CITY")}
            placeholderTextColor={cityValid ? "#6F6F6F" : "#dd0000"}
            textAlignVertical="center"
            autoCapitalize="none"
            value={this.state.city}
            onChangeText={(value) => this.handleCity(value)}
          />
          {!cityValid && (
            <Message imp={true} message={this.state.errors["city"]} />
          )}

          <Text style={inputHeading}>{I18n.t("Area")}</Text>
          <TextInput
            activeUnderlineColor="#000"
            mode="flat"
            style={[forms.input_fld, forms.active_fld]} underlineColor="#8F9EB717"
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
            activeUnderlineColor="#000"
            mode="flat"
            underlineColor={mobileValid ? "#8F9EB717" : "#dd0000"}
            style={[forms.input_fld, forms.active_fld]}
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
            activeUnderlineColor="#000"
            mode="flat"
            style={[forms.input_fld, forms.active_fld]} underlineColor="#8F9EB717"
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
          {this.state.isEdit ?
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
                disabled={false}
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
            :
            <View
              style={[
                rnPickerContainer,
                { borderColor: statusValid ? "#8f9eb718" : "#dd0000" },
              ]}
            >
              <RNPickerSelect
                placeholder={{
                  label: "Active",
                  value: "true",
                }}
                disabled={true}
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
                  { label: "InActive", value: false },
                ]}
                onValueChange={(value) => this.handleStatus(value)}
                style={statusValid ? rnPicker : rnPickerError}
                value={this.state.storeStatus}
                useNativeAndroidPickerStyle={false}
              />
            </View>
          }
          {this.state.isEdit && !statusValid && (
            <Message imp={true} message={this.state.errors["status"]} />
          )}
          <Text style={inputHeading}>
            {I18n.t("Store Name")} <Text style={{ color: "#aa0000" }}>*</Text>
          </Text>
          <TextInput
            activeUnderlineColor="#000"
            mode="flat"
            underlineColor={storeValid ? "#8F9EB717" : "#dd0000"}
            style={[forms.input_fld, forms.active_fld]}
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
                activeUnderlineColor="#000"
                mode="flat"
                style={[forms.input_fld, forms.inactive_fld]}
                underlineColor={gstValid ? "#8F9EB717" : "#dd0000"}
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
              <Text style={[forms.input_fld, forms.active_fld]}>
                {I18n.t("GST Number")}{" "}
                <Text style={{ color: "#aa0000" }}>*</Text>
              </Text>
              <TextInput
                activeUnderlineColor="#000"
                mode="flat"
                underlineColor={gstValid ? "#8F9EB717" : "#dd0000"}
                style={[forms.input_fld, forms.active_fld]}
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
