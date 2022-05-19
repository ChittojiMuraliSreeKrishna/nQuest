import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { Component } from 'react';
import { Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Device from 'react-native-device-detection';
import I18n from 'react-native-i18n';
import RNPickerSelect from 'react-native-picker-select';
import { Chevron } from 'react-native-shapes';
import Loader from '../../commonUtils/loader';
import { accountingErrorMessages, errorLength, urmErrorMessages } from '../Errors/errors';
import LoginService from '../services/LoginService';
import UrmService from '../services/UrmService';
import Message from '../Errors/Message';
import { cancelBtn, cancelBtnText, inputField, inputHeading, rnPicker, rnPickerContainer, rnPickerError, submitBtn, submitBtnText } from '../Styles/FormFields';
import { backButton, backButtonImage, headerTitle, headerTitleContainer, headerTitleSubContainer, headerTitleSubContainer2, menuButton } from '../Styles/Styles';
import { RH, RF, RW } from '../../Responsive';

var deviceWidth = Dimensions.get('window').width;

export default class CreateRole extends Component {

    constructor(props) {
        super(props);
        this.state = {
            role: "",
            description: "",
            domain: "",
            previlage: [],
            domains: [],
            domainsArray: [],
            clientId: 0,
            userId: 0,
            arrayData: [],
            domainId: 0,
            roles: [],
            parentlist: [],
            childlist: [],
            isEdit: false,
            roleId: 0,
            errors: {},
            roleValid: true,
            domainValid: true,
            descriptionValid: true,
        };
    }

    async componentDidMount() {
        const clientId = await AsyncStorage.getItem("custom:clientId1");
        const userId = await AsyncStorage.getItem("custom:userId")
        this.setState({ isEdit: this.props.route.params.isEdit, userId: userId });
        if (this.state.isEdit === true) {
            this.setState({
                description: this.props.route.params.item.discription,
                role: this.props.route.params.item.roleName,
                domain: this.props.route.params.item.clientDomainVo.domaiName,
                roles: this.props.route.params.item.subPrivilageVo,
                parentlist: this.props.route.params.item.parentPrivilageVo,
                roleId: this.props.route.params.item.roleId
            });
            console.log("sadadsdsad" + this.props.route.params.item.clientDomainVo.domaiName);
            this.setState({ navtext: 'Edit Role' });
        }
        else {
            this.setState({ navtext: 'Add Role' });
        }
        this.setState({ clientId: clientId });
        this.getDomainsList();
    }


    async getDomainsList() {
        this.setState({ domains: [] });
        var domains = [];
        axios.get(LoginService.getDomainsList() + this.state.clientId).then((res) => {
            if (res.data["result"]) {
                let len = res.data["result"].length;
                if (len > 0) {
                    for (let i = 0; i < len; i++) {
                        let number = res.data.result[i];
                        this.state.domainsArray.push({ name: number.domaiName, id: number.id });
                        domains.push({
                            value: this.state.domainsArray[i].name,
                            label: this.state.domainsArray[i].name
                        });
                        this.setState({
                            domains: domains,
                        });

                        this.setState({ domainsArray: this.state.domainsArray });
                        if (this.state.isEdit === false) {
                            this.setState({ domain: this.state.domainsArray[0].name });
                            this.setState({ domainId: this.state.domainsArray[0].id });
                        }
                        else {
                            if (number.domaiName === this.props.route.params.item.clientDomainVo.domaiName) {
                                this.setState({ domain: this.state.domainsArray[i].name });
                                this.setState({ domainId: this.state.domainsArray[i].id });
                            }
                        }

                    }
                    console.log(this.state.domains);
                }
            }
        }).catch(() => {
            this.setState({ loading: false });
            this.setState({ loading: false });
            alert("There is an Error Getting Domain Id");
        });
    }

    handleBackButtonClick() {
        global.privilages = [];
        this.props.navigation.goBack(null);
        return true;
    }

    onEndReached() {
        this.listRef.scrollToOffset({ offset: 0, animated: true });
    }

    cancel() {
        global.privilages = [];
        this.props.navigation.goBack(null);
    }

    handleRoleValid = () => {
        if (this.state.role.length >= errorLength.name) {
            this.setState({roleValid: true})
        }
    }

    handleDescriptionValid = () => {
        if (this.state.description.length > 0) {
            this.setState({descriptionValid: true})
        }
    }

    validationForm() {
        let errors = {}
        let isFormValid = true

        if (this.state.role.length < errorLength.name) {
            isFormValid = false
            errors["role"] = urmErrorMessages.roleName
            this.setState({roleValid: false})
        }

        if (this.state.description === "") {
            isFormValid = false
            errors["description"] = urmErrorMessages.description
            this.setState({descriptionValid: false})
        }

        if (this.state.domain === "") {
            isFormValid = false
            errors["domain"] = accountingErrorMessages.domain
            this.setState({domainValid: false})
        }

        this.setState({errors: errors})
        return isFormValid

    }

    saveRole() {
        console.log(this.state.parentlist);
        console.log(this.state.childlist);
        const isFormValid = this.validationForm()
        if(isFormValid) {
            if (this.state.isEdit === false) {
                    const saveObj = {
                        "roleName": this.state.role,
                        "description": this.state.description,
                        "clientDomianId": this.state.domainId,
                        "createdBy": this.state.userId,
                        "parentPrivilages": this.state.parentlist,
                        "subPrivillages": this.state.childlist,
                    };

                    console.log('params are' + JSON.stringify(saveObj));
                    this.setState({ loading: true });
                    axios.post(UrmService.saveRole(), saveObj).then((res) => {
                        console.error(res.data);
                        if (res.data && res.data["isSuccess"] === "true") {
                            global.privilages = [];
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
            else {
                
                    const saveObj = {
                        "roleName": this.state.role,
                        "description": this.state.description,
                        "clientDomianId": this.state.domainId,
                        "createdBy": this.state.userId,
                        "parentPrivilages": this.state.parentlist,
                        "subPrivillages": this.state.roles,
                        "roleId": this.state.roleId,
                    };

                    console.log('params are' + JSON.stringify(saveObj));
                    this.setState({ loading: true });
                    axios.put(UrmService.editRole(), saveObj).then((res) => {
                        console.log(res.data);
                        if (res.data && res.data["isSuccess"] === "true") {
                            global.privilages = [];
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
    }

    handleRole = (value) => {
        this.setState({ role: value });
    };

    privilageMapping() {
        global.privilages = [];
        this.props.navigation.navigate('Privilages', {
            domain: this.state.domain, child: this.state.roles, parentlist: this.state.parentlist,
            onGoBack: () => this.refresh(),
        });
    }

    refresh() {
        this.setState({ parentlist: [] });
        this.setState({ childlist: [] });
        this.state.roles = [];
        for (let i = 0; i < global.privilages.length; i++) {
            this.state.parentlist.push({ name: global.privilages[i].parent, id: global.privilages[i].id });
            this.state.childlist.push(global.privilages[i].subPrivillages);
            this.state.roles.push(global.privilages[i].subPrivillages);
        }
        const newArrayList = [];
        this.state.parentlist.forEach(obj => {
            if (!newArrayList.some(o => o.name === obj.name)) {
                newArrayList.push({ ...obj });
            }
        });

        const newArraychildList = [];
        this.state.childlist.forEach(obj => {
            if (!newArraychildList.some(o => o.name === obj.name)) {
                newArraychildList.push({ ...obj });
            }
        });
        const newArrayrolesList = [];
        this.state.roles.forEach(obj => {
            if (!newArrayrolesList.some(o => o.name === obj.name)) {
                newArrayrolesList.push({ ...obj });
            }
        });
        this.setState({ parentlist: newArrayList, childlist: newArraychildList, roles: newArrayrolesList });
    }


    handleDomain = (value) => {
        for (let i = 0; i < this.state.domainsArray.length; i++) {
            if (this.state.domainsArray[i].name === value) {
                this.setState({ domainId: this.state.domainsArray[i].id });
            }
        }
        this.setState({ domain: value });
        if (this.state.domain !== "") {
            this.setState({domainValid: true})
        }
    };

    handleDescription = (value) => {
        this.setState({ description: value });
    };

    render() {
        const roleValid = this.state.roleValid
        const descriptionValid = this.state.descriptionValid
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
                        {this.state.navtext}
                    </Text>
                    </View>
                </View>
                <ScrollView>
                    <Text style={inputHeading}>{I18n.t("Role")} <Text style={{ color: '#aa0000' }}>*</Text> </Text>
                    <TextInput
                        style={[inputField,{borderColor: roleValid ? "#8F9EB717" : '#dd0000'} ]}
                        underlineColorAndroid="transparent"
                        placeholder={I18n.t("Role")}
                        placeholderTextColor={roleValid ? "#6F6F6F" : "#dd0000"}
                        maxLength={25}
                        textAlignVertical="center"
                        autoCapitalize="none"
                        onBlur={this.handleRoleValid}
                        value={this.state.role}
                        onChangeText={this.handleRole}
                    />
                    {!roleValid && <Message imp={true} message={this.state.errors["role"]} />}
                    <Text style={inputHeading}>{I18n.t("Description")} <Text style={{ color: '#aa0000' }}>*</Text> </Text>
                    <TextInput
                        style={[inputField, {borderColor: descriptionValid ? '#8F9EB717' : '#dd0000'}]}
                        underlineColorAndroid="transparent"
                        placeholder={I18n.t("Description")}
                        placeholderTextColor={descriptionValid ? "#6F6F6F" : "#dd0000"}
                        textAlignVertical="center"
                        autoCapitalize="none"
                        value={this.state.description}
                        onBlur={this.handleDescriptionValid}
                        onChangeText={this.handleDescription}
                    />
                    {!descriptionValid && <Message imp={true} message={this.state.errors["description"]} />}
                    <Text style={inputHeading}>{I18n.t("Domain")} <Text style={{ color: '#aa0000' }}>*</Text> </Text>
                    <View style={[rnPickerContainer, {borderColor: domainValid ? '#8F9EB717' : '#dd0000'}]}>
                        <RNPickerSelect
                            placeholder={{
                                label: 'Domain',
                                value: '',
                            }}
                            Icon={() => {
                                return <Chevron style={styles.imagealign} size={1.5} color={domainValid ? "gray" : "#dd0000"} />;
                            }}
                            items={this.state.domains}
                            onValueChange={this.handleDomain}
                            style={domainValid ? rnPicker : rnPickerError}
                            value={this.state.domain}
                            useNativeAndroidPickerStyle={false}
                        />
                    </View>
                    {!domainValid && <Message imp={true} message={this.state.errors["domain"]} />}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 50 }}>
                        <Text style={inputHeading}>
                            {I18n.t("Privileges")}
                        </Text>
                        <TouchableOpacity
                            style={styles.privilageBtn}
                            onPress={() => this.privilageMapping()} >
                            <Text style={styles.privilageBtnText}> {I18n.t('Privilege Mapping')} </Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView>
                        <FlatList
                            data={this.state.roles}
                            style={{ marginTop: 20, }}
                            onEndReached={this.onEndReached.bind(this)}

                            ref={(ref) => { this.listRef = ref; }}
                            keyExtractor={item => item}
                            renderItem={({ item, index }) => (
                                <View style={poolflats.container}>
                                    <View style={poolflats.subContainer}>

                                        <Text style={poolflats.valueHeader}>
                                            PRIVILEGE
                                        </Text>
                                        <Text style={poolflats.operatorValue}>
                                            {item.name}
                                        </Text>

                                        <Text style={poolflats.valueHeader}>
                                            DESCRIPTION
                                        </Text>
                                        <Text style={poolflats.operatorValue}>
                                            {item.description}
                                        </Text>
                                    </View>
                                </View>
                            )}
                        />
                        <View style={styles.messageContainer}>
                            <Text style={styles.message}>
                                {I18n.t("add more privileges by clicking on Privilege Mapping button")}
                            </Text>
                        </View>
                    </ScrollView>

                    <TouchableOpacity style={submitBtn}
                        onPress={() => this.saveRole()}>
                        <Text style={submitBtnText}>{I18n.t("SAVE")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={cancelBtn}
                        onPress={() => this.cancel()}>
                        <Text style={cancelBtnText}>{I18n.t("CANCEL")}</Text>
                    </TouchableOpacity>
                    <View style={styles.bottomContainer} ></View>
                </ScrollView>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    imagealign: {
        marginTop: Device.isTablet ? RH(25) : RH(20),
        marginRight: Device.isTablet ? RW(30) : RW(20),
    },
    bottomContainer: {
        margin: RH(50),
    },
    messageContainer: {
        flexDirection: 'column',
        width: deviceWidth,
        backgroundColor: "#F6F6F6",
        marginTop: RH(20),
    },
    message: {
        fontSize: RF(14),
        marginTop: RH(50),
        height: RH(100),
        fontFamily: 'regular',
        paddingLeft: RW(15),
        fontSize: RF(14),
    },
    privilageBtn: {
        borderRadius: Device.isTablet ? 10 : 5,
        borderColor: "#ED1C24",
        backgroundColor: '#ffffff',
        width: Device.isTablet ? RW(190) : RW(140),
        height: Device.isTablet ? RH(38) : RH(28),
        borderWidth: 1,
        marginTop: RH(7),
        marginRight: RW(20),
    },

    privilageBtnText: {
        fontSize: RF(12),
        fontFamily: 'regular',
        color: '#ED1C24',
        textAlign: 'center',
        marginTop: RH(5)
    }

});

const poolflats = StyleSheet.create({

    valueHeader: {
        fontSize: RF(12),
        fontFamily: 'medium',
        color: '#353C40',
    },
    operatorValue: {
        fontSize: RF(12),
        fontFamily: 'regular',
        color: '#808080'
    },
    subContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: deviceWidth,
        height: Device.isTablet ? RH(100) : RH(90),
        marginLeft: RW(10),
        paddingTop: RH(10),
    },
    container: {
        height: Device.isTablet ? RH(130) : RH(100),
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 5,
        borderBottomColor: '#FFFFFF',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: Device.isTablet ? 2 : 1,
        borderBottomColor: '#808080',
    }

});
