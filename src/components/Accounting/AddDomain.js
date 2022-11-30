import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { Component } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Device from 'react-native-device-detection';
import I18n from 'react-native-i18n';
import RNPickerSelect from 'react-native-picker-select';
import { Chevron } from 'react-native-shapes';
import Loader from '../../commonUtils/loader';
import UrmService from '../services/UrmService';
import { accountingErrorMessages } from '../Errors/errors';
import Message from "../Errors/Message"
import { cancelBtn, cancelBtnText, inputField, inputHeading, rnPicker, rnPickerContainer, rnPickerError, submitBtn, submitBtnText } from '../Styles/FormFields';
import { backButton, backButtonImage, headerTitle, headerTitleContainer, headerTitleSubContainer, headerTitleSubContainer2, menuButton } from '../Styles/Styles';
import RnPicker from '../../commonUtils/RnPicker';

var deviceWidth = Dimensions.get('window').width;
export default class AddDomain extends Component {

    constructor(props) {
        super(props);
        this.state = {
            domainName: "",
            clientId: 0,
            userId: 0,
            description: "",
            domainsArray: [],
            domains: [],
            domainId: 0,
            errors: {},
            domainValid: true,
        };
    }

    handleBackButtonClick() {
        this.props.navigation.goBack(null);
        return true;
    }

    async componentDidMount() {
        const clientId = await AsyncStorage.getItem("custom:clientId1");
        const userId = await AsyncStorage.getItem("custom:userId")
        this.setState({ clientId: clientId, userId: userId });

        this.getMasterDomainsList();
    }



    getMasterDomainsList() {
        this.setState({ domains: [] });
        this.setState({ loading: false });
        var domains = [];
        axios.get(UrmService.getMasterDomains()).then((res) => {
            if (res.data["result"]) {
                for (var i = 0; i < res.data["result"].length; i++) {
                    this.state.domainsArray.push({ name: res.data["result"][i].channelName, id: res.data["result"][i].id });
                    domains.push({
                        value: this.state.domainsArray[i].name,
                        label: this.state.domainsArray[i].name
                    });
                }
                this.setState({
                    domains: domains,
                });
                this.setState({ domainsArray: this.state.domainsArray });
            }

        });
    }

    handleDomain = (value) => {
        for (let i = 0; i < this.state.domainsArray.length; i++) {
            if (this.state.domainsArray[i].name === value) {
                this.setState({ domainId: this.state.domainsArray[i].id, domainName: value });
                // this.setState({  });
            }
        }

        if (this.state.domainName !== "") {
            this.setState({ domainValid: true })
        }
    };


    cancel() {
        this.props.navigation.goBack(null);
        return true;
    }



    handleDescription = (value) => {
        this.setState({ description: value });
    };

    validationForm() {
        let errors = {}
        let formIsValid = true

        if (this.state.domainName === "") {
            errors["domain"] = accountingErrorMessages.domain
            formIsValid = false
            this.setState({ domainValid: false })
        }

        this.setState({ errors: errors })
        return formIsValid
    }

    saveDomain() {
        const formIsValid = this.validationForm()
        if (formIsValid) {
            const obj = {
                "name": this.state.domainName,
                "discription": this.state.description,
                "masterDomianId": this.state.domainId,
                "clientId": parseInt(this.state.clientId),
                "createdBy": parseInt(this.state.userId)
            };
            console.log('params are' + JSON.stringify(obj));
            this.setState({ loading: true });
            axios.post(UrmService.saveDomain(), obj).then((res) => {
                console.log(res.data);
                if (res.data && res.data["isSuccess"] === "true") {
                    this.props.route.params.onGoBack();
                    this.props.navigation.goBack();
                }
                else {
                    this.setState({ loading: false });
                    alert(res.data.message);
                }
            }
            ).catch((err) => {
                this.setState({ loading: false });
                this.setState({ loading: false });
                alert(err);
            });

        }
    }


    render() {
        const domainValid = this.state.domainValid
        return (
            <View style={styles.mainContainer}>
                {this.state.loading &&
                    <Loader
                        loading={this.state.loading} />
                }
                <View style={headerTitleContainer} >
                    <View style={headerTitleSubContainer}>
                        <TouchableOpacity style={backButton} onPress={() => this.handleBackButtonClick()}>
                            <Image style={backButtonImage} source={require('../assets/images/backButton.png')} />
                        </TouchableOpacity>
                        <Text style={headerTitle}>
                            {I18n.t("Add Domain")}
                        </Text>
                    </View>
                </View>
                <ScrollView>
                    <Text style={inputHeading}>{I18n.t("Domain")} <Text style={{ color: 'red', fontFamily: 'bold' }}>*</Text></Text>
                    <RnPicker
                        items={this.state.domains}
                        setValue={this.handleDomain}
                    />
                    {!domainValid && <Message imp={true} message={this.state.errors["domain"]} />}
                    <TextInput
                        style={Device.isTablet ? styles.input_tablet : styles.input_mobile}
                        underlineColorAndroid="transparent"
                        placeholder={I18n.t("ENTER DESCRIPTION HERE")}
                        placeholderTextColor="#6F6F6F"
                        textAlignVertical="center"
                        autoCapitalize="none"
                        value={this.state.description}
                        onChangeText={this.handleDescription}
                    />
                    <TouchableOpacity style={submitBtn}
                        onPress={() => this.saveDomain()}>
                        <Text style={submitBtnText}>{I18n.t("SAVE")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={cancelBtn}
                        onPress={() => this.cancel()}>
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
        backgroundColor: '#fff'
    },
    imagealign: {
        marginTop: Device.isTablet ? 25 : 20,
        marginRight: Device.isTablet ? 30 : 20,
    },
    bottomContainer: {
        margin: 50,
    }

});
