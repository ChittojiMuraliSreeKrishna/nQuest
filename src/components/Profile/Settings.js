import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { Component } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DatePicker from "react-native-date-picker";
import Device from "react-native-device-detection";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, TextInput } from 'react-native-paper';
import RNPickerSelect from "react-native-picker-select";
import { Chevron } from "react-native-shapes";
import scss from '../../commonUtils/assets/styles/Settings.scss';
import Message from '../Errors/Message';
import ProfileService from '../services/ProfileService';

var deviceWidth = Dimensions.get("window").width;


export const logOut = async (props) => {
  AsyncStorage.removeItem("phone_number");
  AsyncStorage.multiRemove([])
  global.username = ''
  AsyncStorage.clear().then(() => console.log('Cleared'))
  props.navigation.push("Login")
  return true;
}
export default class Settings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userName: "",
      roleName: "",
      emailId: "",
      mobileNumber: "",
      dateOfBirth: "",
      address: "",
      userId: null,
      date: new Date(),
      datepickerOpen: false,
      mobileNumberValid: false,
      emailValid: false,
      errors: {}
    }
  }
  clearAllData() {
    AsyncStorage.getAllKeys()
      .then(keys => AsyncStorage.multiRemove(keys));
  }

  // Logout
  // logOut = async () => {
  //   try {
  //     await AsyncStorage.clear()
  //     await this.clearAllData()
  //     await this.props.navigation.navigate("Login")
  //     return true
  //   } catch (error) {
  //     console.log({ error })
  //     return true
  //   }
  // }

  // Input Actions
  handleGender = (value) => {
    this.setState({ selectedGender: value });
  };

  handleUserName = (value) => {
    this.setState({ userName: value });
  };

  handleRole = (value) => {
    this.setState({ roleName: value });
  };

  handleMobileNumber = (value) => {
    this.setState({ mobileNumber: value });
  };

  handleEmail = (value) => {
    this.setState({ emailId: value });
  };

  handleAddress = (value) => {
    this.setState({ address: value });
  };

  // Date Picker Actions
  datepickerCancelClicked() {
    this.setState({ date: new Date() });
    this.setState({ datepickerOpen: false });
  }

  datepickerDoneClicked() {
    if (parseInt(this.state.date.getDate()) < 10) {
      this.setState({
        dateOfBirth:
          this.state.date.getFullYear() +
          "-" +
          (this.state.date.getMonth() + 1) +
          "-0" +
          this.state.date.getDate(),
      });
    } else {
      this.setState({
        dateOfBirth:
          this.state.date.getFullYear() +
          "-" +
          (this.state.date.getMonth() + 1) +
          "-" +
          this.state.date.getDate(),
      });
    }
    this.setState({ datepickerOpen: false });
  }

  datepickerClicked() {
    this.setState({ datepickerOpen: true });
  }

  // Component Did Mount
  async componentDidMount() {
    const username = await AsyncStorage.getItem("username")
    const phonenumber = await AsyncStorage.getItem("phone_number")
    this.setState({ loading: true })
    axios.get(ProfileService.getUser() + username).then(res => {
      if (res?.data) {
        let details = res.data.result
        this.setState({ loading: false, userId: details.userId, userName: details.userName, roleName: details.roleName, emailId: details.email, selectedGender: details.gender, address: details.address, mobileNumber: phonenumber })
        console.log("nameee", details)
        if (details.dob === null) {
          this.setState({ dateOfBirth: "Date of Birth" })
        } else {
          this.setState({ dateOfBirth: details.dob })
        }
      }
      this.setState({ loading: false })
    }).catch(err => {
      console.log({ err })
      this.setState({ loading: false })
    })
  }

  validationForm() {
    let isFormValid = true
    let errors = {}
    const emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (this.state.mobileNumber.length !== 13) {
      isFormValid = false
      errors["mobile"] = "Please Enter a valid 10 digit mobile number With state code";
      this.setState({ mobileNumberValid: true })
    }
    if (emailReg.test(this.state.emailId) === false) {
      isFormValid = false
      errors["email"] = "Please Enter a valid email id"
      this.setState({ emailValid: true })
    }
    this.setState({ errors: errors })
    return isFormValid
  }

  profileUpdate() {
    const isFormValid = this.validationForm()
    if (isFormValid) {
    }
  }

  changePassword() {
    this.props.navigation.navigate("ForgotPassword", {
      username: this.state.userName,
    });
  }

  render() {
    const { mobileNumberValid, emailValid, errors } = this.state
    return (
      <View style={scss.container}>
        <View style={scss.header}>
          <Text style={scss.header_text}>Profile</Text>
          <Button icon="logout" mode='text' onPress={() => logOut(this.props)}>
            Logout
          </Button>
        </View>
        <View style={scss.subContainer}>
          <KeyboardAwareScrollView>
            <TextInput
              mode='flat'
              style={scss.inputField}
              label="Name"
              disabled
              value={this.state.userName}
              onChange={(value) => this.handleUserName(value)}
            />
            <TextInput
              mode='flat'
              style={scss.inputField}
              label="Designation"
              disabled
              value={this.state.roleName}
              onChange={(value) => this.handleRole(value)}
            />
            <TextInput
              mode='flat'
              underlineColor='#6f6f6f'
              activeUnderlineColor='#000'
              keyboardType="email-address"
              style={scss.inputField}
              label="Email"
              value={this.state.emailId}
              onChangeText={(value) => this.handleEmail(value)}
            />
            {emailValid && <Message imp={true} message={this.state.errors["email"]} />}
            <TextInput
              mode='flat'
              activeUnderlineColor='#000'
              underlineColor='#6f6f6f'
              keyboardType="phone-pad"
              style={scss.inputField}
              maxLength={13}
              label="Mobile"
              value={this.state.mobileNumber}
              onChangeText={(value) => this.handleMobileNumber(value)}
            />
            {mobileNumberValid && <Message imp={true} message={this.state.errors["mobile"]} />}
            <View
              style={
                Device.isTablet
                  ? styles.rnSelectContainer_tablet
                  : styles.rnSelectContainer_mobile
              }
            >
              <RNPickerSelect
                placeholder={{
                  label: "SELECT GENDER",
                  value: " ",
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
                items={[
                  { label: "MALE", value: "MALE" },
                  { label: "FEMALE", value: "FEMALE" },
                  {
                    label: "PREFER NOT TO SAY",
                    value: "PREFER NOT TO SAY",
                  },
                ]}
                onValueChange={this.handleGender}
                style={
                  Device.isTablet
                    ? pickerSelectStyles_tablet
                    : pickerSelectStyles_mobile
                }
                value={this.state.selectedGender}
                useNativeAndroidPickerStyle={false}
              />
            </View>
            <View>
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  margin: 20,
                  height: Device.isTablet ? 54 : 44,
                  marginTop: Device.isTable ? 25 : 15,
                  marginBottom: Device.isTablet ? 25 : 15,
                  borderColor: "#8F9EB717",
                  borderRadius: 3,
                  backgroundColor: "#Ffffff",
                  borderWidth: 1,
                  fontFamily: "regular",
                  paddingLeft: 15,
                  fontSize: Device.isTablet ? 20 : 14,
                }}
                testID="openModal"
                onPress={() => this.datepickerClicked()}
              >
                <Text
                  style={{
                    marginLeft: 0,
                    marginTop: 0,
                    color: "#6F6F6F",
                    fontSize: Device.isTablet ? 20 : 14,
                    fontFamily: "regular",
                  }}
                >
                  {" "}
                  {this.state.dateOfBirth}{" "}
                </Text>
                <Image
                  style={{ position: "absolute", top: 5, right: 0 }}
                  source={require("../assets/images/calender.png")}
                />
              </TouchableOpacity>
              {this.state.datepickerOpen && (
                <View
                  style={{
                    height: 280,
                    width: deviceWidth,
                    backgroundColor: "ffffff",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      position: "absolute",
                      left: 20,
                      top: 10,
                      height: 30,
                      backgroundColor: "#ED1C24",
                      borderRadius: 5,
                    }}
                    onPress={() => this.datepickerCancelClicked()}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        marginTop: 5,
                        color: "#ffffff",
                        fontSize: 15,
                        fontFamily: "regular",
                      }}
                    >
                      {" "}
                      Cancel{" "}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      position: "absolute",
                      right: 20,
                      top: 10,
                      height: 30,
                      backgroundColor: "#ED1C24",
                      borderRadius: 5,
                    }}
                    onPress={() => this.datepickerDoneClicked()}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        marginTop: 5,
                        color: "#ffffff",
                        fontSize: 15,
                        fontFamily: "regular",
                      }}
                    >
                      {" "}
                      Done{" "}
                    </Text>
                  </TouchableOpacity>
                  <DatePicker
                    style={{ width: deviceWidth, height: 200, marginTop: 50 }}
                    date={this.state.date}
                    mode={"date"}
                    onDateChange={(date) => this.setState({ date })}
                  />
                </View>
              )}
            </View>
            <TextInput
              mode='flat'
              style={scss.inputField}
              activeUnderlineColor='#000'
              underlineColor='#6f6f6f'
              label="Address"
              value={this.state.address}
              onChange={(value) => this.handleAddress(value)}
            />
            <Button style={scss.submitBtn} textColor="#fff" onPress={() => this.profileUpdate()} mode='elevated'>SAVE</Button>
            <Button style={scss.changeBtn} textColor="#000" onPress={() => this.changePassword()} mode='outlined'>Change Password</Button>
            <View style={{ margin: 25 }}></View>
          </KeyboardAwareScrollView>
        </View>
      </View>
    )
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
    justifyContent: "center",
    height: 52,
    borderRadius: 3,
    borderWidth: 1,
    fontFamily: "regular",
    //paddingLeft: -20,
    fontSize: 20,
    borderColor: "#FBFBFB",
    backgroundColor: "#FFF",
  },
  inputAndroid: {
    justifyContent: "center",
    height: 52,
    borderRadius: 3,
    borderWidth: 1,
    fontFamily: "regular",
    //paddingLeft: -20,
    fontSize: 20,
    borderColor: "#FFF",
    backgroundColor: "#FBFBFB",
    color: "#001B4A",

  },
});

const styles = StyleSheet.create({

  imagealign: {
    marginTop: Device.isTablet ? 25 : 20,
    marginRight: Device.isTablet ? 30 : 20,
  },

  rnSelectContainer_mobile: {
    justifyContent: "center",
    margin: 20,
    height: 44,
    marginTop: 15,
    marginBottom: 15,
    borderColor: "#8F9EB717",
    borderRadius: 3,
    backgroundColor: "#FFF",
    borderWidth: 1,
    fontFamily: "regular",
    paddingLeft: 15,
    fontSize: 14,
  },

  rnSelectContainer_tablet: {
    justifyContent: "center",
    margin: 20,
    height: 54,
    marginTop: 25,
    marginBottom: 25,
    borderColor: "#8F9EB717",
    borderRadius: 3,
    backgroundColor: "#FFF",
    borderWidth: 1,
    fontFamily: "regular",
    paddingLeft: 15,
    fontSize: 20,
  },
});
