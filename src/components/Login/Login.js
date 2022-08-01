import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import jwt_decode from "jwt-decode";
import React, { Component } from 'react';
import { Dimensions, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Device from 'react-native-device-detection';
import I18n from 'react-native-i18n';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Loader from '../../commonUtils/loader';
import LoginService from '../services/LoginService';
import ProfileService from '../services/ProfileService';
import { errorLength, errorLengthMax, urmErrorMessages } from '../Errors/errors';
import UrmService from '../services/UrmService';
import Message from '../Errors/Message';
import { RH, RW, RF } from '../../Responsive';

var deviceheight = Dimensions.get('window').height;
var deviceheight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get("window").width;
import { cancelBtn, cancelBtnText, inputField, inputHeading, rnPicker, rnPickerContainer, rnPickerError, submitBtn, submitBtnText } from '../Styles/FormFields';
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rememberMe: false,
      redirect: false,
      isAuth: false,
      userName: '',
      password: '',
      dropValue: '',
      store: 0,
      user: {
        name: ""
      },
      storeNames: [],
      sessionData: '',
      roleName: '',
      errors: {},
      userValid: true,
      passwordValid: true,
      assignedStores: []
    };
  }

  toggleRememberMe = value => {
    this.setState({ rememberMe: value });
    if (value === true) {
      this.rememberUser();
    } else {
      this.forgetUser();
    }
  };

  forgetUser = async () => {
    try {
      await AsyncStorage.removeItem('Longtail-User');
    } catch (error) {
    }
  };

  handleEmail = (text) => {
    this.setState({ userName: text });
  };

  handleEmailValid = () => {
    if (this.state.userName.length >= errorLength.name) {
      this.setState({ userValid: true });
    }
  };

  handlePassword = (text) => {
    this.setState({ password: text });
  };

  handlePasswordValid = () => {
    if (this.state.password.length >= errorLength.password) {
      this.setState({ passwordValid: true });
    }
  };

  handleStore = (value) => {
    this.setState({ store: value });
  };

  registerClient() {
    // console.log('adsadasdd');
    this.props.navigation.navigate('RegisterClient');
  }


  validationForm() {
    let isFormValid = true;
    let errors = {};

    if (this.state.userName.length < 1) {
      isFormValid = false;
      errors["userName"] = urmErrorMessages.loginUserName;
      this.setState({ userValid: false });
    }
    if (this.state.password.length < 1) {
      isFormValid = false;
      errors["password"] = urmErrorMessages.password;
      this.setState({ passwordValid: false });
    }

    this.setState({ errors: errors });
    return isFormValid;
  }

  login() {
    AsyncStorage.removeItem('tokenkey');
    const isFormValid = this.validationForm();
    const { userName, password } = this.state;
    if (isFormValid) {
      const params = {
        email: userName.trim(),
        password: password,
      };
      console.log({ params });
      this.setState({ loading: true });
      LoginService.getAuth(params).then((res) => {
        console.log("login", res);
        if (res && res.data && res.status === 200) {
          global.username = userName;
          if (res.data.authenticationResult) {
            // Token
            const token = res.data.authenticationResult.idToken;
            AsyncStorage.setItem("username", jwt_decode(token)["name"]);
            console.log("Token", jwt_decode(token));
            AsyncStorage.setItem("tokenkey", JSON.stringify(token)).catch(err => { console.error("Token Error =>", err); });
            AsyncStorage.getItem("tokenkey").then((value) => {
              var finalToken = value.replace('"', '');
              console.log({ finalToken });
              axios.defaults.headers.common = { 'Authorization': 'Bearer' + ' ' + finalToken };
            });
            AsyncStorage.setItem("userId", jwt_decode(token)["custom:userId"]).then(() => {

            }).catch(() => {
              this.setState({ loading: false });
              console.log("there is an error saving userId");
            });
            AsyncStorage.setItem("rolename", jwt_decode(token)["custom:roleName"]).then(() => {
            }).catch(() => {
              this.setState({ loading: false });
              console.log('There is error saving domainDataId');
            });
            AsyncStorage.setItem("phone_number", jwt_decode(token)["phone_number"]).then(() => {
            }).catch((err) => {
              this.setState({ loading: false });
              console.log({ err });
            });
            AsyncStorage.setItem("custom:clientId1", jwt_decode(token)["custom:clientId1"]).then(() => {
              // console.log
            }).catch(() => {
              this.setState({ loading: false });
              console.log('There is error saving domainDataId');
              // alert('There is error saving domainDataId');
            });
            AsyncStorage.setItem("user", JSON.stringify(jwt_decode(token))).catch(err => { console.error("Error Getting User =>", err); });
            AsyncStorage.setItem("roleType", jwt_decode(token)["custom:roleName"]);
            let storesAssigned = jwt_decode(token)["custom:assignedStores"];


            AsyncStorage.getItem("roleType").then(value => {
              console.log("Roles", value);
              if (value) {
                if (value === "super_admin") {
                  this.getAdminStores();
                } else if (value === "config_user") {
                  this.props.navigation.navigate('UrmNaviagtion');
                  global.previlage1 = '';
                  global.previlage2 = '';
                  global.previlage3 = '';
                  global.previlage4 = '';
                  global.previlage6 = '';
                  global.previlage5 = '';
                  global.previlage7 = 'URM Portal';
                } else {
                  const table = storesAssigned.split(",").map(pair => pair.split(":"));
                  let store = [];
                  table.forEach((ele, index) => {
                    if (ele[0], ele[1]) {
                      const obj = {
                        name: ele[0],
                        id: ele[1]
                      };
                      store.push(obj);
                    }
                  });
                  console.log({ store });
                  this.setState({ assignedStores: store }, () => {
                    this.getStores();
                  });
                }
              } else {
                this.setState({ loading: false });
              }
            });
          }
          else {
            if (res.data.challengeName === "NEW_PASSWORD_REQUIRED") {
              this.setState({ loading: false });
              const roleData = res.data.result
                ? JSON.parse(res.data.challengeParameters.userAttributes)
                : "";
              this.props.navigation.navigate('ManagePassword', {
                session: res.data.session,
                roleName: roleData["custom:roleName"],
                userName: this.state.userName,
                password: this.state.password,
              });
              console.log(this.state.sessionData);
              console.log(this.state.roleName);
            }
          }
        } else {
          this.setState({ loading: false, userName: "", password: "" });
          alert(res.data.message);
        }
      }).catch(err => {
        console.error(err);
        this.setState({ loading: false });
      });
    }
  }

  getAdminStores() {
    LoginService.getUserStores().then(res => {
      console.log("getting Stores", res);
      if (res.data.length > 1) {
        this.props.navigation.navigate('SelectStore');
      }
      else {
        AsyncStorage.setItem("storeId", String(res.data[0].id)).catch(err => {
        });
        global.storeName = String(res.data[0].name);
        AsyncStorage.setItem("storeName", String(res.data[0].name)).catch(err => {
        });
        this.props.navigation.navigate('TopBarNavigation');
      }
    });
  }

  async getStores() {
    const { assignedStores } = this.state;
    console.log({ assignedStores }, assignedStores.length);
    await AsyncStorage.setItem("storesList", assignedStores).catch(err => {
    });
    if (assignedStores && assignedStores.length > 1) {
      this.props.navigation.navigate('SelectStore', { items: assignedStores });
    }
    else {
      let storeName = String(assignedStores[0].name);
      let storeId = String(assignedStores[0].id);
      console.log({ storeName });
      console.log({ storeId });
      AsyncStorage.setItem("storeId", storeId);
      global.storeName = storeName;
      console.log("IN login",this.props.navigation)
      AsyncStorage.setItem("storeName", storeName).then(() => {
        this.props.navigation.navigate('TopBarNavigation');
      });
    }
  }



  forgotPassword() {
    this.props.navigation.navigate('ForgotPassword', { username: this.state.userName });
  }

  async componentDidMount() {
    AsyncStorage.removeItem('phone_number');
  }


  render() {
    const userValid = this.state.userValid;
    const passValid = this.state.passwordValid;
    return (
      <KeyboardAwareScrollView KeyboardAwareScrollView
        enableOnAndroid={true}>
        <View style={styles.container}>
          {this.state.loading &&
            <Loader
              loading={this.state.loading} />
          }
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
              <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: "center", marginTop: 50 }}>
                <View style={styles.hexagon}>
                  <View style={styles.hexagonInner} />
                  <View style={styles.hexagonBefore} />
                  <View style={styles.hexagonAfter} />
                  <Text style={styles.logoDesign}>R</Text>
                </View>
                <View>
                  <Text style={styles.mainLogo}>EASY RETAIL</Text>
                  <Text style={styles.subLogo}>in-store & Online</Text>
                </View>
              </View>
              <Image source={require('../assets/images/Subtraction.png')} style={Device.isTablet ? styles.bottomImage_tablet : styles.bottomImage_mobile} />
              <View style={{ flex: 1, backgroundColor: '#FFFFFF', marginTop: 40 }}>
                <Text style={Device.isTablet ? styles.headerText_tablet : styles.hederText_mobile}> {I18n.t('Sign-In')} </Text>
              </View>



              <View style={{ flex: Device.isTablet ? 4 : 7 }}>
                <TextInput
                  style={[inputField, { borderColor: userValid ? '#8F9EB717' : '#dd0000' }]}
                  underlineColorAndroid="transparent"
                  placeholder={I18n.t('Username')}
                  placeholderTextColor={userValid ? "#6F6F6F" : "#dd0000"}
                  // textAlignVertical="center"
                  autoCapitalize="none"
                  onChangeText={this.handleEmail}
                  // maxLength={errorLengthMax.name}
                  onBlur={this.handleEmailValid}
                  value={this.state.userName}
                  ref={inputemail => { this.emailValueInput = inputemail; }} />
                {!userValid && <Message imp={true} message={this.state.errors["userName"]} />}


                <TextInput style={[inputField, { borderColor: passValid ? '#8F9EB717' : '#dd0000' }]}
                  underlineColorAndroid="transparent"
                  placeholder={I18n.t('Password')}
                  secureTextEntry={true}
                  placeholderTextColor={passValid ? "#6F6F6F" : "#dd0000"}
                  autoCapitalize="none"
                  maxLength={errorLengthMax.password}
                  onChangeText={this.handlePassword}
                  onBlur={this.handlePasswordValid}
                  value={this.state.password}
                  ref={inputpassword => { this.passwordValueInput = inputpassword; }} />
                {!passValid && <Message imp={true} message={this.state.errors["password"]} />}

                <View>
                  <View style={{ flexDirection: Device.isTablet ? "row" : "column", justifyContent: Device.isTablet ? "space-around" : "center", alignItems: Device.isTablet ? "center" : "center" }}>

                    <View style={{
                      alignItems: 'center', flexDirection: 'row'
                    }}>
                      <Text style={Device.isTablet ? styles.navigationText_tablet : styles.navigationText_mobile}> {I18n.t('Register')}? </Text>
                      <TouchableOpacity
                        onPress={() => this.registerClient()} >
                        <Text style={Device.isTablet ? styles.navigationButtonText_tablet : styles.navigationButtonText_mobile}> {I18n.t('Register')} </Text>
                      </TouchableOpacity>
                    </View>

                    <View style={{
                      alignItems: 'center', flexDirection: 'row'
                    }}>
                      <Text style={Device.isTablet ? styles.navigationText_tablet : styles.navigationText_mobile}> {I18n.t('Forgot password')}? </Text>
                      <TouchableOpacity
                        onPress={() => this.forgotPassword()} >
                        <Text style={Device.isTablet ? styles.navigationButtonText_tablet : styles.navigationButtonText_mobile}> {I18n.t('Reset')} </Text>
                      </TouchableOpacity>
                    </View>

                  </View>
                </View>
                <TouchableOpacity
                  style={submitBtn}
                  onPress={() => this.login()} >
                  <Text style={submitBtnText}> {I18n.t('SIGN IN')} </Text>
                </TouchableOpacity>
              </View>
            </View>

          </SafeAreaView>

        </View>

      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  logoImage: {
    alignSelf: 'center',
    width: RW(500),
    height: RH(300),
  },
  errorRecords: {
    color: '#dd0000',
    fontSize: Device.isTablet ? 17 : 12,
    marginLeft: RW(30),
  },
  containerForActivity: {
    flex: 1,
    backgroundColor: '#623FA0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: RF(20),
    margin: RH(20)
  },
  imagealign: {
    marginTop: RH(40),
    marginRight: RF(10),
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    height: deviceheight + RH(40),
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
  mainLogo: {
    color: '#ED1C24',
    fontSize: Device.isTablet ? RF(40) : RF(30),
    fontFamily: "bold",
  },
  subLogo: {
    fontSize: RF(25),
    fontFamily: 'medium',
  },

  // Mobile Styles
  hederText_mobile: {
    color: "#353C40",
    fontFamily: "bold",
    marginLeft: RW(20),
    marginTop: RH(20),
    flexDirection: 'column',
    justifyContent: 'center',
    fontSize: RF(25),
  },
  headerText2_mobile: {
    color: "#353C40",
    fontSize: RF(20),
    fontFamily: "bold",
    marginLeft: RW(10),
    marginTop: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    height: RH(45),
    fontSize: RF(28),
  },
  bottomImage_mobile: {
    position: 'absolute',
    right: 0,
    bottom: RH(40),
    width: RW(162),
    height: RH(170)
  },
  navigationText_mobile: {
    fontSize: RF(16),
    color: '#858585',
    fontFamily: "regular",
  },
  navigationButtonText_mobile: {
    color: '#353C40',
    fontSize: RF(16),
    fontFamily: "bold",
    textDecorationLine: 'underline'
  },

  // Tablet Styles
  headerText_tablet: {
    color: "#353C40",
    fontSize: RF(40),
    fontFamily: "bold",
    marginLeft: RW(20),
    marginTop: RH(50),
    flexDirection: 'column',
    justifyContent: 'center',
  },
  headerText2_tablet: {
    color: "#353C40",
    fontSize: RF(40),
    fontFamily: "bold",
    marginLeft: RW(10),
    marginTop: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    height: RH(55),
  },
  bottomImage_tablet: {
    position: 'absolute',
    right: 0,
    bottom: RH(40),
    width: RW(202),
    height: RH(230)
  },
  navigationText_tablet: {
    fontSize: 22,
    color: '#858585',
    fontFamily: "regular",
  },
  navigationButtonText_tablet: {
    color: '#353C40',
    fontSize: RF(22),
    fontFamily: "bold",
    textDecorationLine: 'underline'
  },
  hexagon: {
    width: Device.isTablet ? 120 : RW(70),
    height: Device.isTablet ? 55 : RH(25),
    position: 'relative',
  },
  logoDesign: {
    position: 'absolute',
    top: Device.isTablet ? -5 : -RH(10),
    bottom: 0,
    left: Device.isTablet ? 35 : RW(15),
    color: "#FFF",
    fontSize: Device.isTablet ? 50 : RF(30),
    fontFamily: "bold"
  },
  hexagonInner: {
    width: Device.isTablet ? 100 : RW(50),
    height: Device.isTablet ? 55 : RH(25.2),
    backgroundColor: "red",
  },
  hexagonAfter: {
    position: "absolute",
    bottom: Device.isTablet ? -25 : -RH(15),
    left: 0,
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderLeftWidth: Device.isTablet ? 50 : 25,
    borderLeftColor: "transparent",
    borderRightWidth: Device.isTablet ? 50 : 25,
    borderRightColor: "transparent",
    borderTopWidth: Device.isTablet ? 25 : 15,
    borderTopColor: "red",
  },
  hexagonBefore: {
    position: "absolute",
    top: Device.isTablet ? -25 : -RH(15),
    left: 0,
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderLeftWidth: Device.isTablet ? 50 : 25,
    borderLeftColor: "transparent",
    borderRightWidth: Device.isTablet ? 50 : 25,
    borderRightColor: "transparent",
    borderBottomWidth: Device.isTablet ? 25 : 15,
    borderBottomColor: "red",
  },
});
