import React, { Component } from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Appbar, TextInput } from 'react-native-paper'
import RnPicker from '../../commonUtils/RnPicker'
import { inputHeading } from '../Styles/FormFields'
import forms from '../../commonUtils/assets/styles/formFields.scss'
import I18n from "react-native-i18n";
import { TouchableOpacity } from 'react-native'
import { color } from '../Styles/colorStyles'
import Device from 'react-native-device-detection'
import { RF, RH, RW } from '../../Responsive'
import InventoryService from '../services/InventoryService'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AccountingService from '../services/AccountingService'

var deviceWidth = Dimensions.get("window").width;
var deviceHeight = Dimensions.get("window").height;


export class AddItemList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            laoding: false,
            itemName: "",
            description: "",
            itemPrice: 0,
            itemCuisine: "",
            itemSection: "",
            cuisinesList: [],
            sectionList: [],
            domainId: null,
            sectionId: null,
            storeId: null,
            taxList: [],
            taxId: null,
            taxLabel: null
        }
    }

    async componentDidMount() {
        this.getAllCuisines()
        const storeId = await AsyncStorage.getItem("storeId")
        this.setState({ storeId: storeId })
        console.log({ storeId })
        this.getAllTaxes()
    }

    getAllCuisines() {
        let domain = "Restaurants"
        InventoryService.getAllDivisions(domain).then(res => {
            let response = res?.data
            let cuisines = []
            for (let i = 0; i < response.length; i++) {
                cuisines.push({
                    value: response[i].id,
                    label: response[i].name
                })
            }
            console.log({ cuisines })
            this.setState({ cuisinesList: cuisines })
        })
    }

    getAllSections(id) {
        this.setState({ sectionList: [] })
        let section = [];
        let data = "Restaurants"
        InventoryService.getAllSections(id, data).then((res) => {
            let sectionRes = res?.data
            console.log({ sectionRes })
            for (let i = 0; i < sectionRes.length; i++) {
                section.push({
                    value: sectionRes[i].id,
                    label: sectionRes[i].category
                })
            }
            this.setState({ sectionList: section })
        })
    }

    handleBackButtonClick() {
        this.props.navigation.goBack(null);
    }

    handleCuisine = (value) => {
        this.setState({ divisionId: value })
        this.getAllSections(value)
    }

    handleSection = (value) => {
        this.setState({ sectionId: value })
    }

    handleItemName = (value) => {
        this.setState({ itemName: value })
    }

    handleDesc = (value) => {
        this.setState({ description: value })
    }

    handlePrice = (value) => {
        this.setState({ itemPrice: value })
    }

    validationForm() {
        let isFormValid = true;
        let errors = {};
        if (this.state.itemName === "") {
            isFormValid = false
        }
        if (this.state.divisionId === null) {
            isFormValid = false
        }
        if (this.state.sectionId === null) {
            isFormValid = false
        }
        if (this.state.itemPrice.length < 1) {
            isFormValid = false
        }
        if (this.state.description === "") {
            isFormValid = false
        }
        if (this.state.taxId === null) {
            isFormValid = false
        }
        return isFormValid;
    }

    saveItemList() {
        const { divisionId, sectionId, storeId, itemName, taxId, itemPrice, description } = this.state
        const isFormValid = this.validationForm()
        const domain = "Restaurants"
        if (isFormValid) {
            const params = {
                division: parseInt(divisionId),
                section: parseInt(sectionId),
                name: itemName,
                itemMrp: parseFloat(itemPrice),
                description: description,
                storeId: parseInt(storeId),
                domainType: domain,
                taxLabel: parseInt(taxId)
            }
            console.log({ params })
            const isEdit = false
            this.setState({ loading: true })
            InventoryService.saveListItem(isEdit, params).then((res) => {
                if (res && res.status === 200) {
                    let response = res.data;
                    console.log({ response })
                    this.props.route.params.onGoBack()
                    this.props.navigation.goBack()
                }
                console.log({ res })
            }).catch(err => {
                console.error({ err })
                this.setState({ loading: false })
            })
        } else {
            alert("Please Enter All The Fields")
        }
    }

    cancel() {
        this.props.navigation.goBack(null)
    }

    getAllTaxes() {
        let taxList = [];
        AccountingService.getAllMasterTax().then((res) => {
            if (res) {
                console.log("Taxes", res.data);
                let len = res.data.result.length;
                if (len > 0) {
                    for (let i = 0; i < len; i++) {
                        let number = res.data.result[i];
                        taxList.push({
                            value: number.id,
                            label: number.taxLabel,
                        });
                    }
                    this.setState({
                        taxList: taxList,
                    });
                }
            }
        });
    }

    handleTaxLabel = (value) => {
        this.setState({ taxlabel: value, taxId: value })
    }


    render() {
        return (
            <View>
                <Appbar mode='center-aligned'>
                    <Appbar.BackAction
                        onPress={() => this.handleBackButtonClick()}
                    />
                    <Appbar.Content title="Add Item List" />
                </Appbar>
                <KeyboardAwareScrollView>
                    <Text style={inputHeading}>{I18n.t("Cuisine")}</Text>
                    <RnPicker
                        items={this.state.cuisinesList}
                        setValue={this.handleCuisine}
                    />
                    <Text style={inputHeading}>{I18n.t("Tax Label")}</Text>
                    <RnPicker
                        items={this.state.taxList}
                        setValue={this.handleTaxLabel}
                    />
                    <Text style={inputHeading}>{I18n.t("Section")}</Text>
                    <RnPicker
                        items={this.state.sectionList}
                        setValue={this.handleSection}
                    />
                    <Text style={inputHeading}>{I18n.t("Item Name")}</Text>
                    <TextInput
                        activeUnderlineColor='#d6d6d6'
                        mode='flat'
                        style={[
                            forms.input_fld,
                            forms.active_fld
                        ]}
                        underlineColorAndroid="transparent"
                        placeholder={I18n.t("Item Name")}
                        placeholderTextColor={"#6f6f6f"}
                        underlineColor={"#d6d6d6"}
                        autoCapitalize="none"
                        value={this.state.itemName}
                        onChangeText={this.handleItemName}
                    />
                    <Text style={inputHeading}>{I18n.t("Price")}</Text>
                    <TextInput
                        activeUnderlineColor='#d6d6d6'
                        mode='flat'
                        style={[
                            forms.input_fld,
                            forms.active_fld
                        ]}
                        underlineColorAndroid="transparent"
                        placeholder={I18n.t("Price")}
                        placeholderTextColor={"#6f6f6f"}
                        underlineColor={"#d6d6d6"}
                        autoCapitalize="none"
                        value={this.state.itemPrice}
                        onChangeText={this.handlePrice}

                    />
                    <Text style={inputHeading}>{I18n.t("Description")}</Text>
                    <TextInput
                        activeUnderlineColor='#d6d6d6'
                        mode='flat'
                        style={[
                            forms.input_fld,
                            forms.active_fld
                        ]}
                        underlineColorAndroid="transparent"
                        placeholder={I18n.t("Description")}
                        placeholderTextColor={"#6f6f6f"}
                        underlineColor={"#d6d6d6"}
                        autoCapitalize="none"
                        value={this.state.description}
                        onChangeText={this.handleDesc}

                    />
                    <View style={forms.action_buttons_container}>
                        <TouchableOpacity style={[forms.action_buttons, { backgroundColor: color.accent }]}
                            // disabled={!this.state.saveButtonDisabled}
                            onPress={() => this.saveItemList()}>
                            <Text style={forms.submit_btn_text} >{I18n.t("SAVE")}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[forms.action_buttons, forms.cancel_btn]}
                            onPress={() => this.cancel()}>
                            <Text style={forms.cancel_btn_text}>{I18n.t("CANCEL")}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.bottomContainer}></View>
                </KeyboardAwareScrollView>
            </View>
        )
    }
}

export default AddItemList

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: "#ffffff",
    },
    imagealign: {
        marginTop: Device.isTablet ? 25 : RW(20),
        marginRight: Device.isTablet ? 30 : RW(20),
    },
    bottomContainer: {
        margin: 50,
    },
    errorRecords: {
        color: "#dd0000",
        fontSize: Device.isTablet ? 17 : RW(12),
        marginLeft: RW(30),
    },

    // Styles For Mobiles
    viewsWidth_mobile: {
        backgroundColor: "#ffffff",
        width: deviceWidth,
        textAlign: "center",
        fontSize: RF(24),
        height: RH(70),
    },
    backButton_mobile: {
        position: "absolute",
        left: 10,
        top: 10,
        width: RW(40),
        height: RH(40),
    },
    headerTitle_mobile: {
        position: "absolute",
        left: RW(70),
        top: RW(27),
        width: RW(300),
        height: RH(20),
        fontFamily: "bold",
        fontSize: RF(18),
        color: "#353C40",
    },
    input_mobile: {
        justifyContent: "center",
        marginLeft: RW(20),
        marginRight: RW(20),
        height: RH(44),
        marginTop: RH(5),
        marginBottom: RH(10),
        borderColor: "#d6d6d617",
        borderRadius: 3,
        backgroundColor: "#FBFBFB",
        borderWidth: 1,
        fontFamily: "regular",
        paddingLeft: RW(15),
        fontSize: RF(14),
    },
    inputError_mobile: {
        justifyContent: "center",
        marginLeft: RW(20),
        marginRight: RW(20),
        height: RH(44),
        marginTop: RH(5),
        marginBottom: RH(10),
        borderColor: "#dd0000",
        borderRadius: 3,
        backgroundColor: "#FBFBFB",
        borderWidth: 1,
        fontFamily: "regular",
        paddingLeft: RW(15),
        fontSize: RF(14),
    },
    rnSelect_mobile: {
        color: "#d6d6d6",
        fontSize: RF(15),
    },
    rnSelectContainer_mobile: {
        justifyContent: "center",
        margin: RW(20),
        height: RH(44),
        marginTop: RH(5),
        marginBottom: RH(10),
        borderColor: "#d6d6d617",
        borderRadius: 3,
        backgroundColor: "#FBFBFB",
        borderWidth: 1,
        fontFamily: "regular",
        paddingLeft: RW(15),
        fontSize: RF(14),
    },
    rnSelectContainerError_mobile: {
        justifyContent: "center",
        margin: RW(20),
        height: RH(44),
        marginTop: RH(5),
        marginBottom: RH(10),
        borderColor: "#dd0000",
        borderRadius: 3,
        backgroundColor: "#FBFBFB",
        borderWidth: 1,
        fontFamily: "regular",
        paddingLeft: RW(15),
        fontSize: RF(14),
    },
    saveButton_mobile: {
        margin: RH(8),
        height: RH(50),
        backgroundColor: "#ED1C24",
        borderRadius: 5,
    },
    saveButtonText_mobile: {
        textAlign: "center",
        marginTop: RH(15),
        color: "#ffffff",
        fontSize: RF(15),
        fontFamily: "regular",
    },
    cancelButton_mobile: {
        margin: RH(8),
        height: RW(50),
        backgroundColor: "#ffffff",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#353C4050",
    },
    cancelButtonText_mobile: {
        textAlign: "center",
        marginTop: RH(15),
        color: "#353C4050",
        fontSize: RF(15),
        fontFamily: "regular",
    },

    // Styles For Tablet
    viewsWidth_tablet: {
        backgroundColor: "#ffffff",
        width: deviceWidth,
        textAlign: "center",
        fontSize: RF(28),
        height: RH(90),
    },
    backButton_tablet: {
        position: "absolute",
        left: RW(10),
        top: RW(20),
        width: RW(90),
        height: RH(90),
    },
    headerTitle_tablet: {
        position: "absolute",
        left: RW(70),
        top: RH(32),
        width: RW(300),
        height: RH(40),
        fontFamily: "bold",
        fontSize: RF(24),
        color: "#353C40",
    },
    input_tablet: {
        justifyContent: "center",
        marginLeft: RW(20),
        marginRight: RW(20),
        height: RH(54),
        marginTop: 5,
        marginBottom: RH(10),
        borderColor: "#d6d6d617",
        borderRadius: 3,
        backgroundColor: "#FBFBFB",
        borderWidth: 1,
        fontFamily: "regular",
        paddingLeft: RW(15),
        fontSize: RF(20),
    },
    inputError_tablet: {
        justifyContent: "center",
        marginLeft: RW(20),
        marginRight: RW(20),
        height: RH(54),
        marginTop: 5,
        marginBottom: RH(10),
        borderColor: "#dd0000",
        borderRadius: 3,
        backgroundColor: "#FBFBFB",
        borderWidth: 2,
        fontFamily: "regular",
        paddingLeft: RW(15),
        fontSize: RF(20),
    },
    rnSelect_tablet: {
        color: "#d6d6d6",
        fontSize: 20,
    },
    rnSelectContainer_tablet: {
        justifyContent: "center",
        margin: RH(20),
        height: RH(54),
        marginTop: 5,
        marginBottom: RH(10),
        borderColor: "#d6d6d617",
        borderRadius: 3,
        backgroundColor: "#FBFBFB",
        borderWidth: 1,
        fontFamily: "regular",
        paddingLeft: RH(15),
        fontSize: RF(20),
    },
    rnSelectContainerError_tablet: {
        justifyContent: "center",
        margin: RW(20),
        height: RH(54),
        marginTop: 5,
        marginBottom: RH(10),
        borderColor: "#dd0000",
        borderRadius: 3,
        backgroundColor: "#FBFBFB",
        borderWidth: 2,
        fontFamily: "regular",
        paddingLeft: 15,
        fontSize: RF(20),
    },
    saveButton_tablet: {
        margin: RH(8),
        height: RH(60),
        backgroundColor: "#ED1C24",
        borderRadius: 5,
    },
    saveButtonText_tablet: {
        textAlign: "center",
        marginTop: 15,
        color: "#ffffff",
        fontSize: RF(20),
        fontFamily: "regular",
    },
    cancelButton_tablet: {
        margin: RW(8),
        height: RH(60),
        backgroundColor: "#ffffff",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#353C4050",
    },
    cancelButtonText_tablet: {
        textAlign: "center",
        marginTop: RH(15),
        color: "#353C4050",
        fontSize: RF(20),
        fontFamily: "regular",
    },
});