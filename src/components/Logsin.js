import React, { Component } from 'react'
import {View, Image, ImageBackground, Text, ActivityIndicator,TouchableOpacity, TextInput, StyleSheet, Dimensions, scrollview } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
var deviceheight = Dimensions.get('window').height;
import RNPickerSelect from 'react-native-picker-select';
import { Chevron } from 'react-native-shapes';
import NewSale from './NewSale';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack'
import LoginService from './services/LoginService';
import axios from 'axios';
import jwt_decode from "jwt-decode";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import Loader from './loader';
// import Routes from "./routes";
// import LeftSideBar from "./leftsidebar";

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


class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            redirect: false,
            isAuth: false,
            userName:'',
            password:'',
            dropValue:'',
            store:0,
            user:{
                name:"prasannaaa"
            },
            storeNames:[]

          }
        console.log(process.env.REACT_APP_BASE_URL);
    }

    handleEmail = (text) => {
        this.setState({ userName: text })
    }
    handlePassword = (text) => {
        this.setState({ password: text })
    }
    handleStore = (value) => {
        this.setState({ store: value });
    }
    
    
    login(){
        // if (this.state.userName.length === 0) {
        //     alert('You must enter a Usename');
        // } else if (this.state.password.length === 0) {
        //     alert('You must enter a Password');
        // }
        // else if (this.state.storeNames.length === 13) {
        //     alert('Please select one store');
        // }
        // else {
        const params =  {
            "email": "+919493926067",// + this.state.userName,
            "password": "Mani@123",//this.state.password,
            "storeName":"kphb"
          }
          console.log('obj' + params)
          this.setState({ loading: true })
        axios.post(LoginService.getAuth(),params).then((res) => {
           if(res.data && res.data.statusCode === 200) {
                const token = res.data.authResponce.idToken;
                AsyncStorage.setItem('user',JSON.stringify(jwt_decode(token)));
                AsyncStorage.setItem('@token_key', JSON.stringify(token));
                console.log(AsyncStorage.getItem('@token_key'))
                this.props.navigation.navigate('NewSale')
            }
             else{
                this.setState({ loading: false })
                 alert('Invalid Credentials');
                 this.emailValueInput.clear()
                 this.passwordValueInput.clear()
                // this.state.store.clear()
                this.setState({ userName: '',password:'',selectedOption:null })
            }
        }
    
        );
   // }
    }

    
    signUpButtonClicked() {
        alert("Alert Title")
    }

    componentDidMount() {
        console.log(LoginService.getAuth())
        var storeNames = [];
        axios.get(LoginService.getStores()).then((res) => { 
            if (res.data) {
                for (var i = 0; i < res.data.length; i++) {
                    storeNames.push({
                       value: res.data[i]['value'],
                        label: res.data[i]['storeName']
                    });
                    console.log('store Name' + this.state.label)
                }
            }
            this.setState({
                storeNames: storeNames,  
            })
        }); 
    }
   
    
    render() {
        return (
            <KeyboardAwareScrollView KeyboardAwareScrollView
                enableOnAndroid={true}>
                               
               
                    <View style={styles.container}>
                    {this.state.loading &&
                    <Loader
                    loading={this.state.loading} />
                } 
                        {/* <View style={styles.container}> */}
                        <View style={{ flex: 1.5, marginTop: '5%' }}>
                            <Image source={require('./assets/images/logo.png')} style={styles.logoImage} />
                        </View>
                        <View style={{ flex: 2, justifyContent: 'center', alignSelf: 'center' }}>
                            {/* <Text></Text> */}
                            <Text style={styles.signInText}> Sign In </Text>
                        </View>

                        <View style={{ flex: 0.2 }}>
                            <Text style={styles.getStartedText}> MEMBER LOGIN</Text>
                        </View>

                        <View style={{ flex: 1 }}>
                            <TextInput style={styles.input}
                                underlineColorAndroid="transparent"
                                placeholder="Username"
                                placeholderTextColor="#AAAAAA"
                                textAlignVertical="center"
                                autoCapitalize="none"
                                onChangeText={this.handleEmail}
                                ref={inputemail => { this.emailValueInput = inputemail }} />

                            <TextInput style={styles.input}
                                underlineColorAndroid="transparent"
                                placeholder="Password"
                                secureTextEntry={true}
                                placeholderTextColor="#AAAAAA"
                                autoCapitalize="none"
                                onChangeText={this.handlePassword}
                                ref={inputpassword => { this.passwordValueInput = inputpassword }} />
                                 <View style={{
                            justifyContent: 'center',
                            textAlign: 'center',
                            margin: 13,
                            height: 40,
                            borderColor: '#AAAAAA',
                            borderRadius: 5,
                            backgroundColor: 'white',
                            borderWidth: 1

                        }} >
                                 <RNPickerSelect style={styles.spinnerTextalign}
                                placeholder={{
                                    label: 'Select Store',
                                    value: " ",
                                }}
                                Icon={() => {
                                    return <Chevron style={styles.imagealign} size={1.5} color="gray" />;
                                }}
                                    items={this.state.storeNames}

                                    
                                    onValueChange={this.handleStore}
                                    style={pickerSelectStyles}
                                    value={this.state.store}
                                    useNativeAndroidPickerStyle={true}

                                />
                                </View>
                           
                            <TouchableOpacity
                                style={styles.signInButton}
                                onPress={() => this.login()} >
                                <Text style={styles.signInButtonText}> Sign in </Text>
                            </TouchableOpacity>

                        </View>

                        {/* <View style={{ flex: 0.2, marginTop: 120 }}> */}
                        <View style={{ flex: 0.2, marginTop: 170, justifyContent: 'center', alignSelf: 'center', flexDirection: 'row' }}>
                
                                <Text style={{ color: 'black', fontSize: 14 }}>Forgot Password? </Text>
                           
                        </View>
                      

                        <View style={{ flex: 1, marginTop: 10, justifyContent: 'center', alignSelf: 'center', flexDirection: 'row' }}>

                            <Text style={{ fontSize: 14 }}>Don't have an account?</Text>
                            
                                <Text style={{ color: '#1D7791', fontSize: 14 }}> Sign Up! </Text>
                           
                        </View>
                    </View>
               

            </KeyboardAwareScrollView>

        )
    }
}




const AppNavigator = createStackNavigator(
    {
        Login: Login,
        NewSale: NewSale,
        // Routes: Routes,
        // LeftSideBar: LeftSideBar,
    },
    {
        headerMode: 'none',
        // navigationOptions: {
        //     header: null,
        // },
    }
);

const AppContainer = createAppContainer(AppNavigator);
export default class Logsin extends React.Component {
    constructor(props) {
        super(props);
    }
    TestFunction() {
        alert('move to next page')
    }

    render() {
        return <AppContainer />;
    }
}




const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        flexDirection: 'row',
        marginLeft: 0,
        marginRight: 0,
        marginTop: 2,
        height: 34,
        borderColor: '#AAAAAA',
        backgroundColor: 'white',
        color: 'black',
        textAlign: 'center',
    },
    inputAndroid: {
        flexDirection: 'row',
        marginLeft: 84,
        marginRight: 24,
        marginTop: 2,
        height: 34,
        width: 400,
        justifyContent: 'center',
        borderColor: '#AAAAAA',
        borderRadius: 8,
        backgroundColor: 'white',
        color: 'black',
        borderWidth: 1,
        padding: 10,
        textAlign: 'center',
    },
})

const styles = StyleSheet.create({
    logoImage: {
        top: 100,
        alignSelf: 'center',
        width: 300,
        height: 130,

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
    container: {
        flex: 1,
        justifyContent: 'center',
        height: deviceheight,
    },
    ytdImageValue: {
        alignSelf: 'center',
    },
    loading: {
        flex: 1,
        justifyContent: 'center'
        // alignItems: 'center',
    },
    input: {
        justifyContent: 'center',
        textAlign: 'center',
        margin: 13,
        height: 40,
        borderColor: '#AAAAAA',
        borderRadius: 5,
        backgroundColor: 'white',
        borderWidth: 1
    },
    signInButton: {
        backgroundColor: '#1D7791',
        padding: 10,
        margin: 15,
        height: 40,
        borderRadius: 10,
        fontWeight: 'bold',
        // marginBottom:100,
    },
    signInText: {
        color: 'black',
        alignSelf: 'center',
        fontSize: 30,
        fontWeight: '600',
    },
    getStartedText: {
        color: 'black',
        alignSelf: 'center',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 14
    },
    signInButtonText: {
        color: 'white',
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },
})