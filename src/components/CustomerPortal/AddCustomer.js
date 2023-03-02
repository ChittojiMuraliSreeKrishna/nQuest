import React, { Component } from 'react';RNPickerSelect
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Device from 'react-native-device-detection';
import I18n from 'react-native-i18n';
import { TextInput } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import { Chevron } from 'react-native-shapes';
import { RF } from '../../Responsive';
import { errorLength, urmErrorMessages } from '../Errors/errors';
import Message from '../Errors/Message';
import CreateDeliverySlip from '../services/CreateDeliverySlip';
import { rnPicker, rnPickerContainer } from '../Styles/FormFields';
import scss from '../../commonUtils/assets/styles/style.scss';
import forms from '../../commonUtils/assets/styles/formFields.scss';
import RnPicker from '../../commonUtils/RnPicker';

var deviceheight = Dimensions.get('window').height;
var deviceheight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get("window").width;

var mobileNumber = '';
const picketData = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
]

export default class AddCustomer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      name: "",
      phoneNumber: "",
      birthDate: "",
      email: "",
      gender: "",
      tempPassword: "Otsi@123",
      parentId: "1",
      domianId: "802",
      address: "",
      role: {
        roleName: ""
      },
      stores: [],
      clientId: "",
      isConfigUser: "",
      clientDomain: [],
      gstNumber: "",
      companyName: "",
      gstemail: "",
      gstmobile: "",
      gstaddress: "",
      isCustomer: "true",
      isConfigUser: "false",
      errors: {},
      nameValid: true,
      mobileValid: true,
      emailValid: true,
      gstValid: true,
    };
  }

  async componentDidMount() {
    this.addCustomer = this.addCustomer.bind(this);
  }

  validationCheck() {
    let errors = {};
    let isFormValid = true;
    const mobReg = /^[0-9\b]+$/;
    const emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;


    if (this.state.name.length < 3) {
      isFormValid = false;
      errors["name"] = urmErrorMessages.customerName;
      this.setState({ nameValid: false });
    }

    if (mobReg.test(this.state.phoneNumber) === false || this.state.phoneNumber.length < errorLength.mobile) {
      isFormValid = false;
      errors["mobile"] = urmErrorMessages.mobile;
      this.setState({ mobileValid: false });
    }

    if (this.state.email.length > 0 && emailReg.test(this.state.email) === false) {
      isFormValid = false;
      errors["email"] = urmErrorMessages.email;
      this.setState({ emailValid: false });
    }


    if (this.state.gstNumber.length > 0 && this.state.gstNumber.length < errorLength.gstNumber) {
      isFormValid = false;
      errors["gst"] = urmErrorMessages.gstNumber;
      this.setState({ gstValid: false });
    }



    this.setState({ errors: errors });
    return isFormValid;
  }

  addCustomer() {
    const isFormValid = this.validationCheck();
    if (isFormValid) {
      this.state.phoneNumber = "+91" + this.state.phoneNumber;
      CreateDeliverySlip.addCustomer(this.state).then(res => {
        console.log({ res });
        if (res) {
          console.log(res.data);
          if (res.data.status === 400) {
            alert(res.data.message);
          } else {
            alert("Customer Added Successfully");
            mobileNumber = '';
          }
        }
        this.setState({
          username: "",
          name: "",
          phoneNumber: "",
          birthDate: "",
          email: "",
          gender: "",
          tempPassword: "Otsi@123",
          parentId: "1",
          domianId: "802",
          address: "",
          role: {
            roleName: ""
          },
          stores: [],
          clientId: "",
          isConfigUser: "",
          clientDomain: [],
          gstNumber: "",
          companyName: "",
          gstemail: "",
          gstmobile: "",
          gstaddress: "",
          isCustomer: "true",
          isConfigUser: "false"
        });
      }).catch(err => {
        this.setState({
          username: "",
          name: "",
          phoneNumber: "",
          birthDate: "",
          email: "",
          gender: "",
          tempPassword: "Otsi@123",
          parentId: "1",
          domianId: "802",
          address: "",
          role: {
            roleName: ""
          },
          stores: [],
          clientId: "",
          isConfigUser: "",
          clientDomain: [],
          gstNumber: "",
          companyName: "",
          gstemail: "",
          gstmobile: "",
          gstaddress: "",
          isCustomer: "true",
          isConfigUser: "false"
        });

      })
    }
  }

  handleCustomerName(text) {
    this.setState({ username: text, name: text });
  }

  handleNameValid = () => {
    if (this.state.name.length >= errorLength.name) {
      this.setState({ nameValid: true });
    }
  };

  handleMobileNumber(text) {
    this.setState({ phoneNumber: text });
    mobileNumber = text;
  }

  handleMobileValid = () => {
    if (this.state.phoneNumber.length === errorLength.mobile) {
      this.setState({ mobileValid: true });
    }
  };

  handleEmail(text) {
    this.setState({ email: text });
  }

  handlegender = (value) => {
    this.setState({ gender: value });
  };

  handleAddress(text) {
    this.setState({ address: text });
  }

  handleCompanyName(text) {
    this.setState({ companyName: text });
  }

  handleGstNumber(text) {
    this.setState({ gstNumber: text });
  }

  handleGstNumberValid(text) {
    if (this.state.gstNumber.length >= errorLength.gstNumber) {
      this.setState({ gstValid: true });
    }
  }

  handleBusinessAddress(text) {
    this.setState({ gstaddress: text });
  }

  handleBusinessEmail(text) {
    this.setState({ gstemail: text });
  }

  handleBusinessPhone(text) {
    this.setState({ gstmobile: text });
  }


  render() {
    const { nameValid, mobileValid, emailValid, gstValid } = this.state;

    return (
      <View style={[scss.container, { padding: 10 }]}>
        <ScrollView>
          <Text style={[scss.highText, { fontSize: 16, padding: 10 }]}>{I18n.t("Personal Details")}</Text>
          <Text style={scss.textStyleLight}>{I18n.t("Customer Name")} <Text style={{ color: 'red' }}>*</Text></Text>
          <TextInput
            style={forms.input_fld}
            mode="flat"
            activeUnderlineColor='#d6d6d6'
            underlineColor={nameValid ? '#d6d6d6' : "#dd0000"}
            label={I18n.t('CUSTOMER NAME')}
            maxLength={25}
            // onBlur={this.handleNameValid}
            value={this.state.name}
            onChangeText={(text) => this.handleCustomerName(text)}
          />
          {!nameValid && <Message imp={true} message={this.state.errors["name"]} />}
          <Text style={scss.textStyleLight}>{I18n.t("Mobile Number")} <Text style={{ color: 'red' }}>*</Text></Text>
          <TextInput
            style={forms.input_fld}
            mode="flat"
            activeUnderlineColor='#d6d6d6'
            underlineColor={mobileValid ? '#d6d6d6' : "#dd0000"}
            label={I18n.t('MOBILE NUMBER')}
            maxLength={10}
            keyboardType='phone-pad'
            // onBlur={this.handleMobileValid}
            textContentType='telephoneNumber'
            value={mobileNumber}
            onChangeText={(text) => this.handleMobileNumber(text)}
          />
          {!mobileValid && <Message imp={true} message={this.state.errors["mobile"]} />}
          <Text style={scss.textStyleLight}>{I18n.t("Email")}</Text>
          <TextInput
            style={forms.input_fld}
            // style={Device.isTablet ? styles.input_tablet : styles.input_mobile}
            mode="flat"
            activeUnderlineColor='#d6d6d6'
            underlineColor={emailValid ? '#d6d6d6' : "#dd0000"}
            label={I18n.t('EMAIL')}
            keyboardType='email-address'
            autoCapitalize='none'
            value={this.state.email}
            onChangeText={(text) => this.handleEmail(text)}
          />
          {!emailValid && <Message imp={false} message={this.state.errors["email"]} />}
          <Text style={scss.textStyleLight}>{I18n.t("Address")}</Text>
          <TextInput
            style={forms.input_fld}
            // style={Device.isTablet ? styles.input_tablet : styles.input_mobile}
            mode="flat"
            activeUnderlineColor='#d6d6d6'
            outlineColor='#d6d6d6'
            label={I18n.t('ADDRESS')}
            value={this.state.address}
            onChangeText={(text) => this.handleAddress(text)}
          />
          <Text style={scss.textStyleLight}>{I18n.t("GST Number")}</Text>
          <TextInput
            style={forms.input_fld}
            mode="flat"
            activeUnderlineColor='#d6d6d6'
            outlineColor='#d6d6d6'
            label={I18n.t('GST Number')}
            value={this.state.gstNumber}
            onBlur={(text) => this.handleGstNumberValid(text)}
            onChangeText={(text) => this.handleGstNumber(text)}
          />
          {!gstValid && <Message imp={false} message={this.state.errors["gst"]} />}
          <Text style={scss.textStyleLight}>{I18n.t("Gender")}</Text>
          <RnPicker
            items={picketData}
            setValue={this.handlegender}
          />
          <View style={forms.action_buttons_container}>
            <TouchableOpacity
              style={[forms.action_buttons, forms.submit_btn, { width: "90%" }]}
              onPress={() => this.addCustomer()} >
              <Text style={forms.submit_btn_text}>
                {I18n.t("Add Customer")} </Text>
            </TouchableOpacity>
          </View>
        </ScrollView >
      </View >
    );
  }
}