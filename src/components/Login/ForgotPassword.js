import axios from 'axios';
import React, { Component } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Device from 'react-native-device-detection';
import I18n from 'react-native-i18n';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Appbar, TextInput } from 'react-native-paper';
import Loader from '../../commonUtils/loader';
import { RF, RH, RW } from '../../Responsive';
import { errorLength, urmErrorMessages } from '../Errors/errors';
import Message from '../Errors/Message';
import LoginService from '../services/LoginService';
var deviceheight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get('window').width;

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      userName: '',
      code: '',
      newPassword: '',
      confirmPassword: '',
      errors: {},
      userValid: true,
    };
  }

  componentDidMount() {
    this.setState({
      userName: this.props.route.params.username,
    });
  }

  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }

  handleEmail = (text) => {
    this.setState({ userName: text });
  };

  handleCode = (text) => {
    this.setState({ code: text });
  };

  handleNewPassword = (text) => {
    this.setState({ newPassword: text });
  };

  handleConfirmPassword = (text) => {
    this.setState({ confirmPassword: text });
  };

  handleEmailValid = () => {
    if (this.state.userName.length >= 6) {
      this.setState({ userValid: true })
    }
  }

  async create() {
    let errors = {}
    if (this.state.userName.length < errorLength.name) {
      errors["username"] = urmErrorMessages.name
      this.setState({ errors: errors, userValid: false })
    }
    else {
      this.setState({ loading: true });
      const param = '?userName=' + this.state.userName;
      axios.get(LoginService.sendVerificationCode() + param).then((res) => {
        if (res) {
          this.setState({ loading: false });
          alert("Confirmation Code Sent to mail");
          this.props.navigation.navigate('UpdateNewpassword', { userName: this.state.userName });
        }
      });
    }
  }


  render() {
    const userValid = this.state.userValid
    return (
      <KeyboardAwareScrollView KeyboardAwareScrollView
        enableOnAndroid={true}>

        {this.state.loading &&
          <Loader
            loading={this.state.loading} />
        }
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>

          <View style={styles.container}>

            <Appbar mode='center-aligned'>
              <Appbar.BackAction onPress={() => this.handleBackButtonClick()} />
              <Appbar.Content title="Verification Code" />
            </Appbar>


            <View style={{ flex: 6 }}>
              {/* <Text style={styles.signInFieldStyle}> User Name </Text> */}
              <TextInput
                style={userValid ? Device.isTablet ? styles.input_tablet : styles.input_mobile : Device.isTablet ? styles.inputError_tablet : styles.inputError_mobile}
                underlineColorAndroid="transparent"
                placeholder={I18n.t("USER NAME")}
                mode="flat"
                placeholderTextColor={userValid ? "#6F6F6F" : "#dd0000"}
                underlineColor={userValid ? "#6F6F6F" : "#dd0000"}
                activeOutlineColor="#d7d7d7"
                autoCapitalize="none"
                maxLength={25}
                onChangeText={(value) => this.handleEmail(value)}
                onBlur={this.handleEmailValid}
                value={this.state.userName}
              />
              {!userValid && <Message imp={true} message={this.state.errors["username"]} />}


              <TouchableOpacity
                style={Device.isTablet ? styles.createButton_tablet : styles.createButton_mobile}
                onPress={() => this.create()} >
                <Text style={Device.isTablet ? styles.createButtonText_tablet : styles.createButtonText_mobile}> {I18n.t("SEND")}  </Text>
              </TouchableOpacity>


            </View>
          </View>
        </SafeAreaView>

      </KeyboardAwareScrollView>
    );
  }
}

export default ForgotPassword;


// const pickerSelectStyles = StyleSheet.create({
//     placeholder: {
//         color: '#456CAF55',
//         fontWeight: "800",
//         fontSize: RF(16),
//     },
//     inputIOS: {
//         marginLeft: 0,
//         marginRight: 0,
//         height: 40,
//         borderBottomWidth: 1,
//         borderBottomColor: '#456CAF55',
//         color: '#001B4A',
//         fontWeight: 'bold',
//         fontSize: RF(16),
//     },
//     inputAndroid: {
//         marginLeft: 0,
//         marginRight: 0,
//         height: 40,
//         borderBottomWidth: 1,
//         borderBottomColor: '#456CAF55',
//         color: '#001B4A',
//         fontWeight: 'bold',
//         fontSize: RF(16),
//     },
// });

const styles = StyleSheet.create({
  logoImage: {
    alignSelf: 'center',
    width: RW(300),
    height: RH(230),
  },
  errorRecords: {
    color: '#dd0000',
    fontSize: Device.isTablet ? RF(17) : RF(12),
    marginLeft: RW(30),
  },
  containerForActivity: {
    flex: 1,
    backgroundColor: '#623FA0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewswidth: {
    backgroundColor: '#ffffff',
    width: deviceWidth,
    textAlign: 'center',
    fontSize: RF(24),
    height: RH(84),
  },
  signUptext: {
    marginTop: RH(40),
    fontFamily: "bold",
    alignSelf: 'center',
    color: '#FFFFFF',
    fontSize: RF(20),
  },
  title: {
    color: 'white',
    fontSize: RF(20),
    margin: RH(20)
  },
  imagealign: {
    marginTop: RH(18),
    marginLeft: 0,
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
  // Styles For Mobile
  viewsWidth_mobile: {
    backgroundColor: '#ffffff',
    width: deviceWidth,
    textAlign: 'center',
    fontSize: RF(24),
    height: RH(84),
  },
  backButton_mobile: {
    position: 'absolute',
    left: RW(10),
    top: RH(30),
    width: RW(40),
    height: RH(40),
  },
  headerTitle_mobile: {
    position: 'absolute',
    left: RW(70),
    top: RH(47),
    width: RW(300),
    height: RH(25),
    fontFamily: 'bold',
    fontSize: RF(18),
    color: '#353C40'
  },
  input_mobile: {
    justifyContent: 'center',
    marginLeft: RW(20),
    marginRight: RW(20),
    height: RH(44),
    marginTop: 5,
    marginBottom: 10,
    borderColor: '#8F9EB717',
    borderRadius: 3,
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    fontFamily: 'regular',
    paddingLeft: RW(15),
    fontSize: RF(14),
  },
  inputError_mobile: {
    justifyContent: 'center',
    marginLeft: RW(20),
    marginRight: RW(20),
    height: RH(44),
    marginTop: RH(5),
    marginBottom: RH(10),
    borderColor: '#dd0000',
    borderRadius: 3,
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    fontFamily: 'regular',
    paddingLeft: RW(15),
    fontSize: RF(14),
  },

  createButton_mobile: {
    backgroundColor: '#ED1C24',
    justifyContent: 'center',
    marginLeft: RW(20),
    marginRight: RW(20),
    marginTop: RH(20),
    width: deviceWidth - RW(40),
    height: RH(50),
    borderRadius: 10,
    fontWeight: 'bold',
    // marginBottom:100,
  },
  createButtonText_mobile: {
    color: 'white',
    alignSelf: 'center',
    fontSize: RF(15),
    fontFamily: "regular",
  },
  // signInFieldStyle: {
  //     color: '#456CAF55',
  //     marginLeft: 30,
  //     marginTop: 15,
  //     fontSize: 12,
  //     fontFamily: "regular",
  // },

  // Styles For Tablet
  viewsWidth_tablet: {
    backgroundColor: '#ffffff',
    width: deviceWidth,
    textAlign: 'center',
    fontSize: RF(28),
    height: RH(90),
  },
  backButton_tablet: {
    position: 'absolute',
    left: RW(10),
    top: RH(25),
    width: RW(90),
    height: RW(90),
  },
  headerTitle_tablet: {
    position: 'absolute',
    left: RW(70),
    top: RH(40),
    width: RW(300),
    height: RH(40),
    fontFamily: 'bold',
    fontSize: RF(24),
    color: '#353C40'
  },
  input_tablet: {
    justifyContent: 'center',
    marginLeft: RW(20),
    marginRight: RW(20),
    height: RH(54),
    marginTop: RH(5),
    marginBottom: RH(10),
    borderColor: '#8F9EB717',
    borderRadius: 3,
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    fontFamily: 'regular',
    paddingLeft: RW(15),
    fontSize: RF(20),
  },
  inputError_tablet: {
    justifyContent: 'center',
    marginLeft: RW(20),
    marginRight: RW(20),
    height: RH(54),
    marginTop: RH(5),
    marginBottom: RH(10),
    borderColor: '#dd0000',
    borderRadius: 3,
    backgroundColor: '#FBFBFB',
    borderWidth: 2,
    fontFamily: 'regular',
    paddingLeft: RW(15),
    fontSize: RF(20),
  },
  createButton_tablet: {
    backgroundColor: '#ED1C24',
    justifyContent: 'center',
    marginLeft: RW(20),
    marginRight: RW(20),
    marginTop: RH(20),
    width: deviceWidth - RW(40),
    height: RH(60),
    borderRadius: 10,
    fontWeight: 'bold',
    // marginBottom:100,
  },
  createButtonText_tablet: {
    color: 'white',
    alignSelf: 'center',
    fontSize: RF(20),
    fontFamily: "regular",
  },
});
