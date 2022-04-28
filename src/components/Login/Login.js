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
import { urmErrorMessages } from '../../errors';
import UrmService from '../services/UrmService';
var deviceheight = Dimensions.get('window').height;
var deviceheight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get("window").width;

const data = [
    {
        value: 1,
        label: "KALAMANDIR RAJAMUNDRY11111"
    },
    {
        value: 2,
        label: "KALAMANDIR AMALAPURAM"
    },
    {
        value: 3,
        label: "KALAMANDIR HYDERABAD"
    }
];

global.previlage1 = '';
global.previlage2 = '';
global.previlage3 = '';
global.previlage4 = '';
global.previlage5 = '';
global.previlage6 = '';
global.previlage7 = '';
global.previlage8 = '';
global.username = '';
global.userrole = '';
global.domainName = '';
global.userrole = '';



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
                name: "prasannaaa"
            },
            storeNames: [],
            sessionData: '',
            roleName: '',
            errors: {},
            userValid: true,
            passwordValid: true,


        };
        console.log(process.env.REACT_APP_BASE_URL);
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
        if (this.state.userName.length >= 6) {
            this.setState({ userValid: true})
        }
    }

    handlePassword = (text) => {
        this.setState({ password: text });
    };

    handlePasswordValid = () => {
        if (this.state.password.length >= 8) {
            this.setState({passwordValid: true})
        }
    } 

    handleStore = (value) => {
        this.setState({ store: value });
    };

    registerClient() {
        // console.log('adsadasdd');
        this.props.navigation.navigate('RegisterClient');
    }

    validationForm() {
        let isFormValid = true
        let errors = {}

        if (this.state.userName.length < 6) {
            isFormValid = false
            errors["userName"] = urmErrorMessages.userNanme
            this.setState({userValid: false})
        }
        if (this.state.password.length < 8) {
            isFormValid = false
            errors["password"] = urmErrorMessages.password
            this.setState({ passwordValid: false})
        }

        this.setState({ errors: errors })
        return isFormValid
    }

    login() {
        AsyncStorage.removeItem('tokenkey');
        const isFormValid = this.validationForm()
        if(isFormValid) {
            const params = {
                "email": this.state.userName, //"+919493926067",
                "password": this.state.password, //"Mani@1123",
                //"storeName": this.state.store,//"kphb",
            };
            AsyncStorage.setItem("username", this.state.userName);
            AsyncStorage.removeItem('tokenkey');
            AsyncStorage.removeItem('custom:clientId1');
            AsyncStorage.removeItem('phone_number');
            AsyncStorage.removeItem('domainDataId');
            AsyncStorage.removeItem('storeId');
            AsyncStorage.removeItem('custom:isSuperAdmin');
            AsyncStorage.removeItem('custom:isConfigUser');
            AsyncStorage.removeItem('domainName');

            console.log(LoginService.getAuth() + JSON.stringify(params));
            this.setState({ loading: true });
            axios.post(LoginService.getAuth(), params).then((res) => {
                if (res.data && res.data["isSuccess"] === "true") {

                    if (res.data.result.authenticationResult) {
                        const token = res.data.result.authenticationResult.idToken;
                        //==============================Token Key & phone number save ===================//
                        AsyncStorage.setItem("tokenkey", JSON.stringify(token)).then(() => {
                        }).catch(() => {
                            this.setState({ loading: false });
                            console.log('There is error saving token');
                           // alert('There is error saving token');
                        });

                        AsyncStorage.getItem("tokenkey").then((value) => {
                            var finalToken = value.replace('"', '');
                            console.log(finalToken);
                            axios.defaults.headers.common = { 'Authorization': 'Bearer' + ' ' + finalToken };
                            //console.log("Request to server:::::::::::::::::::" + 'Bearer' + ' ' + finalToken);
                        });

                        AsyncStorage.setItem("phone_number", jwt_decode(token)["phone_number"]).then(() => {
                            // console.log
                        }).catch(() => {
                            this.setState({ loading: false });
                            console.log('There is error saving domainDataId');
                           // alert('There is error saving domainDataId');
                        });

                        AsyncStorage.setItem("rolename", jwt_decode(token)["custom:roleName"]).then(() => {

                            // console.log
                        }).catch(() => {
                            this.setState({ loading: false });
                            console.log('There is error saving domainDataId');
                           // alert('There is error saving domainDataId');
                        });

                        AsyncStorage.setItem("custom:clientId1", jwt_decode(token)["custom:clientId1"]).then(() => {
                            // console.log
                        }).catch(() => {
                            this.setState({ loading: false });
                            console.log('There is error saving domainDataId');
                           // alert('There is error saving domainDataId');
                        });

                        //==============================Navigation===================//
                        if (jwt_decode(token)["custom:isSuperAdmin"] === "true") {
                            AsyncStorage.setItem("custom:isSuperAdmin", "true").then(() => {
                                // console.log
                            }).catch((err) => {
                                this.setState({ loading: false });
                                alert(err);
                            });
                            AsyncStorage.setItem("custom:isConfigUser", "false").then(() => {
                                // console.log
                            }).catch((err) => {
                                this.setState({ loading: false });
                                alert(err);
                            });


                            this.getDomainsList();
                        }
                        else if (jwt_decode(token)["custom:isConfigUser"] === "true") {

                            AsyncStorage.setItem("custom:isConfigUser", "true").then(() => {
                                // console.log
                            }).catch((err) => {
                                this.setState({ loading: false });
                                alert(err);
                            });

                            axios.get(ProfileService.getUser() + this.state.userName).then((res) => {
                                if (res.data && res.data["isSuccess"] === "true") {
                                    global.username = res.data["result"].userName;
                                    global.domainName = '';
                                }
                            }).catch(() => {
                                this.setState({ loading: false });
                                this.setState({ loading: false });
                                alert('No user details get');
                            });

                            global.previlage1 = '';
                            global.previlage2 = '';
                            global.previlage3 = '';
                            global.previlage4 = '';
                            global.previlage6 = '';
                            global.previlage7 = 'URM Portal';
                            global.previlage5 = 'Accounting Portal';
                            AsyncStorage.getItem("rolename").then((value) => {
                                global.userrole = value;
                            }).catch(() => {
                                this.setState({ loading: false });
                                console.log('There is error getting storeId');
                               // alert('There is error getting storeId');
                            });



                            this.props.navigation.navigate('HomeNavigation');
                        }
                        else {
                            this.getDomainsForNormalUser();


                            AsyncStorage.setItem("domainDataId", jwt_decode(token)["custom:domianId1"]).then(() => {
                                this.getDomainsForNormalUser();
                                // console.log
                            }).catch(() => {
                                this.setState({ loading: false });
                                console.log('There is error saving domainDataId');
                                //alert('There is error saving domainDataId');
                            });

                            this.getstoresForNormalUser();
                        }

                        // const clientDomainId = user["custom:clientDomians"].split(",")[0];
                        // AsyncStorage.setItem("clientDomainId", JSON.stringify(clientDomainId)).then(() => {
                        // }).catch(() => {
                        this.setState({ loading: false });
                        //     console.log('There is error saving token')
                        // })


                        this.setState({ loading: false });
                    }
                    else {
                        if (res.data.result.challengeName === "NEW_PASSWORD_REQUIRED") {
                            this.setState({ loading: false });
                            const roleData = res.data.result
                                ? JSON.parse(res.data.result.challengeParameters.userAttributes)
                                : "";
                            this.props.navigation.navigate('ManagePassword', {
                                session: res.data.result.session,
                                roleName: roleData["custom:roleName"],
                                userName: this.state.userName,
                                password: this.state.password,
                            });
                            console.log(this.state.sessionData);
                            console.log(this.state.roleName);
                        }
                    }

                }
                else {
                    alert('Invalid Credentials');
                    this.emailValueInput.clear();
                    this.passwordValueInput.clear();
                    this.setState({ userName: '', password: '', selectedOption: null, loading: false });
                }


            }


            );
        }
    }


    async getDomainsList() {
        const clientId = await AsyncStorage.getItem("custom:clientId1");

        axios.get(LoginService.getDomainsList() + clientId).then((res) => {
            if (res.data["result"][0]) {
                console.log('sdasdasdsadasdsasfsfssaf' + res.data["result"]);
                if (res.data["result"].length > 1) {
                    this.props.navigation.navigate('SelectDomain');
                }
                else {
                    console.log('vinoddddgfgfgdgg');
                    AsyncStorage.setItem("domainDataId", String(res.data.result[0].clientDomainaId)).then(() => {
                        // console.log

                    }).catch(() => {
                        this.setState({ loading: false });
                        console.log('There is error saving token');
                      //  alert('There is error saving token');
                    });
                    AsyncStorage.setItem("domainName", res.data.result[0].domaiName).then(() => {
                        // console.log

                    }).catch(() => {
                        this.setState({ loading: false });
                        console.log('There is error saving token');
                      //  alert('There is error saving token');
                    });
                    this.getstoresForSuperAdmin();
                }
            }
        });
    }

    async getDomainsForNormalUser() {
        AsyncStorage.getItem("domainDataId").then((value) => {
            console.log('sdasfsafsafsfaasf' + value);
            var domainNames = [];
            axios.get(UrmService.getDomainName() + value).then((res) => {
                if (res.data && res.data["isSuccess"] === "true") {
                    console.log(res.data.result);
                    AsyncStorage.setItem("domainName", res.data.result.domaiName).then(() => {
                        // console.log

                    }).catch(() => {
                        this.setState({ loading: false });
                        console.log('There is error saving token');
                      //  alert('There is error saving token');
                    });
                }

            });

        }).catch(() => {
            this.setState({ loading: false });
            console.log('There is error saving token');
           // alert('There is error saving token');
        });
    }


    async getstoresForSuperAdmin() {
        const username = await AsyncStorage.getItem("domainDataId");
        const params = {
            "clientDomianId": username
        };
        console.log('sfsdfsdff' + params);
        axios.get(LoginService.getUserStoresForSuperAdmin(), { params }).then((res) => {
            let len = res.data["result"].length;
            if (len > 0) {
                for (let i = 0; i < len; i++) {
                    if (res.data["result"].length > 1) {

                        this.props.navigation.navigate('SelectStore', { isFromDomain: false });

                    }
                    else {
                        AsyncStorage.setItem("storeId", String(res.data.result[0].id)).then(() => {
                        }).catch(() => {
                            this.setState({ loading: false });
                            console.log('There is error saving storeName');
                           // alert('There is error saving storeName');
                        });
                        this.props.navigation.navigate('HomeNavigation');
                    }
                }
            }
        });
    }


    async getstoresForNormalUser() {
        const username = await AsyncStorage.getItem("username");

        axios.get(LoginService.getUserStores() + username).then((res) => {
            if (res.data["result"]) {
                for (var i = 0; i < res.data["result"].length; i++) {
                    let number = res.data.result[i];
                    const myArray = [];
                    myArray = number.split(":");
                    this.state.storeNames.push({ name: myArray[0], id: myArray[1] });
                }
                this.setState({ storeNames: this.state.storeNames });
                AsyncStorage.setItem("storeId", (this.state.storeNames[0].id).toString()).then(() => {
                }).catch(() => {
                    this.setState({ loading: false });
                    console.log('There is error saving token');
                   // alert('There is error saving token');
                });

                AsyncStorage.setItem("storeName", (this.state.storeNames[0].name)).then(() => {

                }).catch(() => {
                    this.setState({ loading: false });
                    console.log('There is error saving token');
                   // alert('There is error saving token');
                });


                if (this.state.storeNames.length === 1) {
                    this.props.navigation.navigate('HomeNavigation');
                }
                else {
                    this.props.navigation.navigate('SelectStore', { isFromDomain: false });
                }
            }
        });
    }



    forgotPassword() {

        this.props.navigation.navigate('ForgotPassword', { username: this.state.userName });

    }

    async componentDidMount() {
        AsyncStorage.removeItem('phone_number');
        

    }


    render() {
        const userValid = this.state.userValid
        const passValid = this.state.passwordValid
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
                            <View style={{ display: 'flex', flexDirection: 'row' ,justifyContent: 'center', alignItems: "center", marginTop: 50 }}>
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
                                    style={userValid ? Device.isTablet ? styles.input_tablet : styles.input_mobile : Device.isTablet ? styles.inputError_tablet : styles.inputError_mobile}
                                    underlineColorAndroid="transparent"
                                    placeholder={I18n.t('Username')}
                                    placeholderTextColor={userValid ? "#6F6F6F" : "#dd0000"}
                                    // textAlignVertical="center"
                                autoCapitalize="none"
                                    onChangeText={this.handleEmail}
                                    maxLength={25}
                                    onBlur={this.handleEmailValid}
                                    value={this.state.userName}
                                    ref={inputemail => { this.emailValueInput = inputemail; }} />
                                {!userValid && <Text style={styles.errorRecords}>{this.state.errors["userName"]}</Text>}

                                <TextInput style={passValid ? Device.isTablet ? styles.input_tablet : styles.input_mobile : Device.isTablet ? styles.inputError_tablet : styles.inputError_mobile}
                                    underlineColorAndroid="transparent"
                                    placeholder={I18n.t('Password')}
                                    secureTextEntry={true}
                                    placeholderTextColor={passValid ? "#6F6F6F" : "#dd0000"}
                                    autoCapitalize="none"
                                    maxLength={25}
                                    onChangeText={this.handlePassword}
                                    onBlur={this.handlePasswordValid}
                                    value={this.state.password}
                                    ref={inputpassword => { this.passwordValueInput = inputpassword; }} />
                                {!passValid && <Text style={styles.errorRecords}>{this.state.errors["password"]}</Text>}

                                <View>
                                    <View style={{ flexDirection: Device.isTablet ? "row" : "column", justifyContent: Device.isTablet ? "space-around" : "center", alignItems: Device.isTablet ? "center" : "center" }}>

                                         <View style={{
                                            top: 35, alignItems: 'center', flexDirection: 'row'
                                        }}>
                                            <Text style={Device.isTablet ? styles.navigationText_tablet : styles.navigationText_mobile}> {I18n.t('Register')}? </Text>
                                            <TouchableOpacity
                                                onPress={() => this.registerClient()} >
                                                <Text style={Device.isTablet ? styles.navigationButtonText_tablet : styles.navigationButtonText_mobile}> {I18n.t('Register')} </Text>
                                            </TouchableOpacity>
                                        </View>

                                        <View style={{
                                            top: 35, alignItems: 'center', flexDirection: 'row'
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
                                    style={Device.isTablet ? styles.signInButton_tablet : styles.signInButton_mobile}
                                    onPress={() => this.login()} >
                                    <Text style={Device.isTablet ? styles.signInButtonText_tablet : styles.signInButtonText_mobile}> {I18n.t('SIGN IN')} </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </SafeAreaView>

                </View>

            </KeyboardAwareScrollView>
        );
    }
}


const pickerSelectStyles = StyleSheet.create({
    placeholder: {
        color: "#6F6F6F",
        fontFamily: "regular",
        fontSize: 14,
    },

    inputIOS: {
        marginLeft: 0,
        marginRight: 0,
        height: 50,
        marginTop: 20,
        backgroundColor: '#F6F6F6',
        borderColor: '#F6F6F6',
        color: '#6F6F6F',
        fontFamily: "regular",
        borderWidth: 5,
        fontSize: 14,
    },
    inputAndroid: {
        marginLeft: 0,
        marginRight: 0,
        height: 50,
        marginTop: 20,
        backgroundColor: '#F6F6F6',
        borderColor: '#F6F6F6',
        color: '#6F6F6F',
        fontFamily: "regular",
        borderWidth: 5,
        fontSize: 14,
    },
});

const styles = StyleSheet.create({
    logoImage: {
        alignSelf: 'center',
        width: 500,
        height: 300,
    },
    errorRecords: {
        color: '#dd0000',
        fontSize: Device.isTablet ? 17 : 12,
        marginLeft: 30,
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
        marginTop: 40,
        marginRight: 10,
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
    mainLogo: {
        color: '#ED1C24',
        fontSize: Device.isTablet ? 40 : 30,
        fontFamily: "bold",
    },
    subLogo: {
        fontSize: 25,
        fontFamily: 'medium',
    },

    // Mobile Styles
    hederText_mobile: {
        color: "#353C40",
        fontFamily: "bold",
        marginLeft: 20,
        marginTop: 20,
        flexDirection: 'column',
        justifyContent: 'center',
        fontSize: 25,
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
        marginTop: 100,
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

    // Tablet Styles
    headerText_tablet: {
        color: "#353C40",
        fontSize: 40,
        fontFamily: "bold",
        marginLeft: 20,
        marginTop: 100,
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
        borderRadius: 6,
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
        marginTop: 100,
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
    hexagon: {
        width: Device.isTablet ? 120 : 70,
        height: Device.isTablet ? 55 : 25,
        position: 'relative',
    },
    logoDesign: {
        position: 'absolute',
        top: Device.isTablet ? -5 : -10,
        bottom: 0,
        left: Device.isTablet ? 35 : 15,
        color: "#FFF",
        fontSize: Device.isTablet ? 50 : 30,
        fontFamily: "bold"
     },
  hexagonInner: {
    width: Device.isTablet ? 100 : 50,
    height: Device.isTablet ? 55 : 25.2,
    backgroundColor: "red",
  },
  hexagonAfter: {
    position: "absolute",
    bottom: Device.isTablet ? -25 : -15,
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
    top: Device.isTablet ? -25 : -15,
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
});;

// Unused Styles
// {
//     signInFieldStyle: {
//         color: '#456CAF55',
//         marginLeft: 30,
//         marginTop: 15,
//         fontSize: 12,
//         fontFamily: "regular",
//     },
//     signinContinueText: {
//         color: '#456CAF55',
//         alignSelf: 'center',
//         fontSize: 13,
//         marginTop: 5,
//         fontFamily: "regular",
//     },
// getStartedText: {
//     color: 'black',
//     alignSelf: 'center',
//     fontStyle: 'normal',
//     fontWeight: 'bold',
//     fontSize: 14
// },
// signInText: {
//     color: '#002C46',
//     alignSelf: 'center',
//     fontSize: 28,
//     fontFamily: "bold",
//     marginTop: 25,
// },
// spinnerTextalign: {
//     flex: 9.4,
//     color: '#A2A2A2',
//     justifyContent: 'center',
//     textAlign: "center",
//     color: 'black',
// },
// }
