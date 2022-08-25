import axios from 'axios';
import React, { Component } from 'react';
import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Device from 'react-native-device-detection';
import I18n from 'react-native-i18n';
import RNPickerSelect from 'react-native-picker-select';
import { Chevron } from 'react-native-shapes';
import { urmErrorMessages, errorLength } from '../Errors/errors';
import CreateCustomerService from '../services/CreateCustomerService';
import Message from '../Errors/Message';
import CreateDeliverySlip from '../services/CreateDeliverySlip';
import { RF } from '../../Responsive';

var deviceheight = Dimensions.get('window').height;
var deviceheight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get("window").width;


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


    if (this.state.name.length < 6) {
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
        }
      });
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
      <View style={{ backgroundColor: '#FFFFFF' }}>
        <Text style={Device.isTablet ? styles.headerText_tablet : styles.hederText_mobile}>{I18n.t("Personal Details")}</Text>
        <Text style={styles.headings}>{I18n.t("Customer Name")} <Text style={{ color: 'red' }}>*</Text></Text>
        <TextInput
          style={nameValid ? Device.isTablet ? styles.input_tablet : styles.input_mobile : Device.isTablet ? styles.inputError_tablet : styles.inputError_mobile}
          mode="flat"
          activeUnderlineColor='#000'
          underlineColor={nameValid ? '#6f6f6f' : "#dd0000"}
          label={I18n.t('CUSTOMER NAME')}
          maxLength={25}
          onBlur={this.handleNameValid}
          value={this.state.name}
          onChangeText={(text) => this.handleCustomerName(text)}
        />
        {!nameValid && <Message imp={true} message={this.state.errors["name"]} />}
        <Text style={styles.headings}>{I18n.t("Mobile Number")} <Text style={{ color: 'red' }}>*</Text></Text>
        <TextInput
          style={mobileValid ? Device.isTablet ? styles.input_tablet : styles.input_mobile : Device.isTablet ? styles.inputError_tablet : styles.inputError_mobile}
          mode="flat"
          activeUnderlineColor='#000'
          underlineColor={mobileValid ? '#6f6f6f' : "#dd0000"}
          label={I18n.t('MOBILE NUMBER')}
          maxLength={10}
          keyboardType='phone-pad'
          onBlur={this.handleMobileValid}
          textContentType='telephoneNumber'
          value={this.state.phoneNumber}
          onChangeText={(text) => this.handleMobileNumber(text)}
        />
        {!mobileValid && <Message imp={true} message={this.state.errors["mobile"]} />}
        <Text style={styles.headings}>{I18n.t("Email")}</Text>
        <TextInput style={Device.isTablet ? styles.input_tablet : styles.input_mobile}
          mode="flat"
          activeUnderlineColor='#000'
          underlineColor={emailValid ? '#6f6f6f' : "#dd0000"}
          label={I18n.t('EMAIL')}
          keyboardType='email-address'
          autoCapitalize='none'
          value={this.state.email}
          onChangeText={(text) => this.handleEmail(text)}
        />
        {!emailValid && <Message imp={false} message={this.state.errors["email"]} />}
        <Text style={styles.headings}>{I18n.t("Address")}</Text>
        <TextInput style={Device.isTablet ? styles.input_tablet : styles.input_mobile}
          mode="flat"
          activeUnderlineColor='#000'
          underlineColor={'#6f6f6f'}
          label={I18n.t('ADDRESS')}
          value={this.state.address}
          onChangeText={(text) => this.handleAddress(text)}
        />
        <Text style={styles.headings}>{I18n.t("GST Number")}</Text>
        <TextInput style={Device.isTablet ? styles.input_tablet : styles.input_mobile}
          mode="flat"
          activeUnderlineColor='#000'
          underlineColor={gstValid?'#6f6f6f':'#dd0000'}
          label={I18n.t('GST Number')}
          value={this.state.gstNumber}
          onBlur={(text) => this.handleGstNumberValid(text)}
          onChangeText={(text) => this.handleGstNumber(text)}
        />
        {!gstValid && <Message imp={false} message={this.state.errors["gst"]} />}
        <Text style={styles.headings}>{I18n.t("Gender")}</Text>
        <View style={Device.isTablet ? styles.rnSelectContainer_tablet : styles.rnSelectContainer_mobile}>
          <RNPickerSelect
            // style={Device.isTablet ? styles.rnSelect_tablet : styles.rnSelect_mobile}
            placeholder={{ label: 'GENDER', value: '' }}
            Icon={() => {
              return <Chevron style={styles.imagealign} size={1.5} color="gray" />;
            }}
            items={[
              { label: 'Male', value: 'male' },
              { label: 'Female', value: 'female' },
            ]}
            onValueChange={this.handlegender}
            style={Device.isTablet ? pickerSelectStyles_tablet : pickerSelectStyles_mobile}
            value={this.state.gender}
            useNativeAndroidPickerStyle={false}
          />
        </View>
        {/*
                <Text style={Device.isTablet ? styles.headerText_tablet : styles.hederText_mobile}>{I18n.t("Business Information")}</Text>
                <Text style={styles.headings}>{I18n.t("GST Number")}</Text>
                <TextInput style={Device.isTablet ? styles.input_tablet : styles.input_mobile}
                    placeholder={I18n.t('GST NUMBER')}
                    placeholderTextColor="#6f6f6f60"
                    textAlignVertical="center"
                    keyboardType={'default'}
                    autoCapitalize='none'
                    value={this.state.gstNumber}
                    onChangeText={(text) => this.handleGstNumber(text)}
                />
                <Text style={styles.headings}>{I18n.t("Company Name")}</Text>
                <TextInput style={Device.isTablet ? styles.input_tablet : styles.input_mobile}
                    placeholder={I18n.t('COMPANY NAME')}
                    placeholderTextColor="#6f6f6f60"
                    textAlignVertical="center"
                    keyboardType={'default'}
                    autoCapitalize='none'
                    value={this.state.companyName}
                    onChangeText={(text) => this.handleCompanyName(text)}
                />
                <Text style={styles.headings}>{I18n.t("Email")}</Text>
                <TextInput style={Device.isTablet ? styles.input_tablet : styles.input_mobile}
                    placeholder={I18n.t('EMAIL')}
                    placeholderTextColor="#6f6f6f60"
                    textAlignVertical="center"
                    keyboardType={'default'}
                    autoCapitalize='none'
                    value={this.state.gstemail}
                    onChangeText={(text) => this.handleBusinessEmail(text)}
                />
                <Text style={styles.headings}>{I18n.t("Phone Number")}</Text>
                <TextInput style={Device.isTablet ? styles.input_tablet : styles.input_mobile}
                    placeholder={I18n.t('PHONE NUMBER')}
                    placeholderTextColor="#6f6f6f60"
                    textAlignVertical="center"
                    keyboardType={'default'}
                    autoCapitalize='none'
                    value={this.state.gstmobile}
                    onChangeText={(text) => this.handleBusinessPhone(text)}
                />
                <Text style={styles.headings}>{I18n.t("Address")}</Text>
                <TextInput style={Device.isTablet ? styles.input_tablet : styles.input_mobile}
                    placeholder={I18n.t('ADDRESS')}
                    placeholderTextColor="#6f6f6f60"
                    textAlignVertical="center"
                    keyboardType={'default'}
                    autoCapitalize='none'
                    value={this.state.gstaddress}
                    onChangeText={(text) => this.handleBusinessAddress(text)}
                /> */}

        <TouchableOpacity
          style={Device.isTablet ? styles.signInButton_tablet : styles.signInButton_mobile}
          onPress={() => this.addCustomer()}
        >
          <Text style={Device.isTablet ? styles.signInButtonText_tablet : styles.signInButtonText_mobile}>{I18n.t("Add Customer")}</Text>
        </TouchableOpacity>
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
    justifyContent: 'center',
    height: 42,
    borderRadius: 3,
    borderWidth: 1,
    fontFamily: 'regular',
    //paddingLeft: -20,
    fontSize: 15,
    borderColor: '#FBFBFB',
    backgroundColor: '#FBFBFB',
  },

  inputAndroid: {
    justifyContent: 'center',
    height: 42,
    borderRadius: 3,
    borderWidth: 1,
    fontFamily: 'regular',
    //paddingLeft: -20,
    fontSize: 15,
    borderColor: '#FBFBFB',
    backgroundColor: '#FBFBFB',
    color: '#001B4A',

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

const pickerSelectStyles_tablet = StyleSheet.create({
  placeholder: {
    color: "#6F6F6F",
    fontFamily: "regular",
    fontSize: 20,
  },
  inputIOS: {
    justifyContent: 'center',
    height: 52,
    borderRadius: 3,
    borderWidth: 1,
    fontFamily: 'regular',
    //paddingLeft: -20,
    fontSize: 20,
    borderColor: '#FBFBFB',
    backgroundColor: '#FBFBFB',
  },
  inputAndroid: {
    justifyContent: 'center',
    height: 52,
    borderRadius: 3,
    borderWidth: 1,
    fontFamily: 'regular',
    //paddingLeft: -20,
    fontSize: 20,
    borderColor: '#FBFBFB',
    backgroundColor: '#FBFBFB',
    color: '#001B4A',

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
  logoImage: {
    alignSelf: 'center',
    width: 300,
    height: 230,
  },
  errorsRecords: {
    color: '#dd0000',
    fontSize: Device.isTablet ? 17 : 12,
    // fontFamily: 'medium',
    marginLeft: 30,
  },
  headings: {
    fontSize: Device.isTablet ? 20 : 15,
    marginLeft: 20,
    color: '#B4B7B8',
    marginTop: Device.isTablet ? 10 : 5,
    marginBottom: Device.isTablet ? 10 : 5,
  },
  containerForActivity: {
    flex: 1,
    backgroundColor: '#623FA0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: 20,
    margin: 20
  },
  imagealign: {
    marginTop: Device.isTablet ? 25 : 20,
    marginRight: Device.isTablet ? 30 : 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    height: deviceheight + 40,
    backgroundColor: '#FFFFFF'
  },
  ytdImageValue: {
    alignSelf: 'center',
  },
  loading: {
    flex: 1,
    justifyContent: 'center'
    // alignItems: 'center',
  },

  // Mobile Styles
  hederText_mobile: {
    color: "#ED1C24",
    fontSize: RF(20),
    fontFamily: "bold",
    margin: RF(10),
    flexDirection: 'column',
    justifyContent: 'center'
  },
  headerText2_mobile: {
    color: "#353C40",
    fontSize: 20,
    fontFamily: "bold",
    marginLeft: 10,
    marginTop: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    height: 45,
    fontSize: 28,
  },
  bottomImage_mobile: {
    position: 'absolute',
    right: 0,
    bottom: 40,
    width: 162,
    height: 170
  },
  input_mobile: {
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 20,
    height: 44,
    marginTop: 5,
    marginBottom: 10,
    borderColor: '#8F9EB717',
    borderRadius: 3,
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    fontFamily: 'regular',
    paddingLeft: 15,
    fontSize: 14,
  },
  inputError_mobile: {
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 20,
    height: 44,
    marginTop: 5,
    marginBottom: 10,
    borderColor: '#dd0000',
    borderRadius: 3,
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    fontFamily: 'regular',
    paddingLeft: 15,
    fontSize: 14,
  },
  signInButton_mobile: {
    backgroundColor: '#ED1C24',
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 30,
    marginBottom: 30,
    width: deviceWidth - 40,
    height: 50,
    borderRadius: 10,
    fontWeight: 'bold',
    // marginBottom:100,
  },
  signInButtonText_mobile: {
    color: 'white',
    alignSelf: 'center',
    fontSize: 15,
    fontFamily: "regular",
  },
  navigationText_mobile: {
    fontSize: 16,
    color: '#858585',
    fontFamily: "regular",
  },
  navigationButtonText_mobile: {
    color: '#353C40',
    fontSize: 16,
    fontFamily: "bold",
    textDecorationLine: 'underline'
  },
  rnSelect_mobile: {
    color: '#8F9EB7',
    fontSize: 15
  },
  rnSelectContainer_mobile: {
    justifyContent: 'center',
    height: 44,
    marginTop: 5,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    paddingLeft: 15,
    borderColor: '#8F9EB717',
    borderRadius: 3,
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    fontFamily: 'regular',
    fontSize: 14,
  },

  // Tablet Styles
  headerText_tablet: {
    color: "#353C40",
    fontSize: 40,
    fontFamily: "bold",
    marginLeft: 10,
    marginTop: 10,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  headerText2_tablet: {
    color: "#353C40",
    fontSize: 40,
    fontFamily: "bold",
    marginLeft: 10,
    marginTop: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    height: 55,
  },
  bottomImage_tablet: {
    position: 'absolute',
    right: 0,
    bottom: 40,
    width: 202,
    height: 230
  },
  input_tablet: {
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 20,
    height: 60,
    marginTop: 5,
    marginBottom: 10,
    borderColor: '#8F9EB717',
    borderRadius: 3,
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    fontFamily: 'regular',
    paddingLeft: 15,
    fontSize: 22,
  },
  inputError_tablet: {
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 20,
    height: 60,
    marginTop: 5,
    marginBottom: 10,
    borderColor: '#dd0000',
    borderRadius: 3,
    backgroundColor: '#FBFBFB',
    borderWidth: 2,
    fontFamily: 'regular',
    paddingLeft: 15,
    fontSize: 22,
  },
  signInButton_tablet: {
    backgroundColor: '#ED1C24',
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 50,
    marginBottom: 20,
    width: deviceWidth - 40,
    height: 60,
    borderRadius: 10,
    fontWeight: 'bold',
    // marginBottom:100,
  },
  signInButtonText_tablet: {
    color: 'white',
    alignSelf: 'center',
    fontSize: 20,
    fontFamily: "regular",
  },
  navigationText_tablet: {
    fontSize: 22,
    color: '#858585',
    fontFamily: "regular",
  },
  navigationButtonText_tablet: {
    color: '#353C40',
    fontSize: 22,
    fontFamily: "bold",
    textDecorationLine: 'underline'
  },
  rnSelect_tablet: {
    color: '#8F9EB7',
    fontSize: 20
  },
  rnSelectContainer_tablet: {
    justifyContent: 'center',
    height: 54,
    marginTop: 5,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    paddingLeft: 15,
    borderColor: '#8F9EB717',
    borderRadius: 3,
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    fontFamily: 'regular',
    fontSize: 20,
  },
});;
