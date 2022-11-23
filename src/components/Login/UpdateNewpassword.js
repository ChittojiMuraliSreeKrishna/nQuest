import axios from 'axios';
import React, { Component } from 'react';
import { Dimensions, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import I18n from 'react-native-i18n';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Loader from '../../commonUtils/loader';
import { errorLength, urmErrorMessages } from '../Errors/errors';
import Message from '../Errors/Message';
import LoginService from '../services/LoginService';
import { inputField, inputHeading, submitBtn, submitBtnText } from '../Styles/FormFields';
import { backButton, backButtonImage, headerTitle, headerTitleContainer } from '../Styles/Styles';

var deviceheight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get('window').width;

class UpdateNewpassword extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      userName: '',
      code: '',
      newPassword: '',
      confirmPassword: '',
      errors: {},
      codeValid: true,
      passwordValid: true,
    };
  }

  componentDidMount() {
    this.setState({
      userName: this.props.route.params.userName,
    });

  }
  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }

  handleEmail = (text) => {
    this.setState({ code: text });
  };

  handlecodeValid = () => {
    if (this.state.code.length >= 8) {
      this.setState({ codeValid: true })
    }
  }

  handleNewPassword = (text) => {
    this.setState({ newPassword: text });
  };

  handlepasswordValid = () => {
    if (this.state.code === this.state.newPassword) {
      this.setState({ passwordValid: true })
    }
  }

  validationPasswords() {
    let isFormValid = true
    let errors = {}
    let passReg = /([^a-zA-Z0-9\s])\w+/g;
    if (this.state.code.length < 1) {
      isFormValid = false
      errors["code"] = urmErrorMessages.verificationCode
      this.setState({ codeValid: false })
    }


    if (this.state.newPassword.length < errorLength.password || passReg.test(this.state.newPassword) === false) {
      isFormValid = false
      errors["password"] = urmErrorMessages.createPassword
      this.setState({ passwordValid: false })
    }

    this.setState({ errors: errors })
    return isFormValid
  }


  create() {
    const isFormValid = this.validationPasswords()
    if (isFormValid) {
      // const params = {
      //     "username": this.state.userName, //"+919493926067",
      //     "confirmarionCode": this.state.code, //"Mani@1123",
      //     "newPassword": this.state.newPassword,
      //     //"storeName": this.state.store,//"kphb",
      // };
      const params = '?username=' + this.state.userName + '&confirmarionCode=' + this.state.code + '&newPassword=' + this.state.newPassword;
      console.log(params);
      this.setState({ loading: true });
      console.log({ params })
      axios.post(LoginService.forgotPassword() + params
      ).then((res) => {
        if (res) {
          // alert("Password Changed Successfully");
          console.log(res.data);
          if (res.data.isSuccess === "true") {
            alert("Password Changed Successfully");
          } else {
            alert(res.data.message);
          }
          // window.location.reload();
          this.setState({ loading: false });
          this.props.navigation.navigate('Login');
        }
        else {
          this.setState({ loading: false });
        }
      }
      ).catch((err) => {
        this.setState({ loading: false });
        alert(err);
      });

    }
  }

  render() {
    let codeValid = this.state.codeValid
    let passwordValid = this.state.passwordValid
    return (
      <KeyboardAwareScrollView KeyboardAwareScrollView
        enableOnAndroid={true}>

        {this.state.loading &&
          <Loader
            loading={this.state.loading} />
        }
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>

          <View style={styles.container}>
            <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
              <View style={headerTitleContainer} >
                <TouchableOpacity style={backButton} onPress={() => this.handleBackButtonClick()}>
                  <Image style={backButtonImage} source={require('../assets/images/backButton.png')} />
                </TouchableOpacity>
                <Text style={headerTitle}>
                  {I18n.t("Update New Password")}
                </Text>
              </View>
            </View>

            <View style={{ flex: 6 }}>
              <Text style={inputHeading}> Verification Code </Text>
              <TextInput
                style={[inputField, { borderColor: codeValid ? "#8F9EB717" : "#dd0000" }]}
                underlineColorAndroid="transparent"
                placeholder={I18n.t("Confirmation Code")}
                placeholderTextColor={codeValid ? "#6F6F6F" : "#dd0000"}
                // textAlignVertical="center"
                autoCapitalize="none"
                maxLength={25}
                onChangeText={this.handleEmail}
                value={this.state.code}
                onBlur={this.handlecodeValid}
                ref={inputemail => { this.emailValueInput = inputemail; }} />
              {!codeValid && <Message imp={true} message={this.state.errors["code"]} />}

              <Text style={inputHeading}> Password </Text>
              <TextInput
                style={[inputField, { borderColor: passwordValid ? "#8F9EB717" : "#dd0000" }]}
                underlineColorAndroid="transparent"
                placeholder={I18n.t("New Password")}
                maxLength={25}
                secureTextEntry={true}
                placeholderTextColor={passwordValid ? "#6F6F6F" : "#dd0000"}
                autoCapitalize="none"
                onChangeText={this.handleNewPassword}
                onBlur={this.handlepasswordValid}
                value={this.state.newPassword}
                ref={inputpassword => { this.passwordValueInput = inputpassword; }} />
              {!passwordValid && <Message imp={true} message={this.state.errors["password"]} />}

              <TouchableOpacity
                style={submitBtn}
                onPress={() => this.create()} >
                <Text style={submitBtnText}> {I18n.t("SEND")}  </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAwareScrollView>
    );
  }
}

export default UpdateNewpassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    height: deviceheight + 40,
    backgroundColor: '#FFFFFF'
  },
});
