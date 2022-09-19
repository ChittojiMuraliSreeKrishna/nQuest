import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { Component } from 'react';
import { Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Device from 'react-native-device-detection';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal from "react-native-modal";
import RNPickerSelect from 'react-native-picker-select';
import { Chevron } from 'react-native-shapes';
import { openDatabase } from 'react-native-sqlite-storage';
import Loader from '../../commonUtils/loader';
import PromotionsService from '../services/PromotionsService';
var deviceWidth = Dimensions.get('window').width;
// Connction to access the pre-populated db
const db = openDatabase({ name: 'tbl_items.db', createFromLocation: 1 });


class AddPool extends Component {
    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.camera = null;
        this.barcodeCodes = [];
        this.state = {
            image: null,
            images: null,
            barcodeId: "",
            productname: "",
            mobileNumber: "",
            altMobileNo: "",
            name: "",
            loading: false,
            arrayData: [],
            temp: [],
            error: null,
            search: null,
            totalQty: 0,
            qty: [false],
            quantity: '',
            totalAmount: 0,
            gender: "Male",
            gstNumber: "",
            dob: "2021-06-21T18:30:00.000Z",
            address: "",
            modalVisible: true,
            flagone: true,
            domainId: 1,
            storeId: 1,
            uom: [],
            productItemId: 0,
            flagCustomerOpen: false,
            barcodeId: 0,
            productname: "",
            produtctQty: 0,
            productuom: "",
            productmrp: "",
            productofferprice: "",
            selectedPoolType: '',
            selectedPoolName: '',
            selectedColumnName: '',
            selectedOperator: '',
            selectedIndex: 0,
            domainId: 1,
            updateRool: false,
            tableHead: ['S.No', 'Barcode', 'Product', 'Price Per Qty', 'Qty', 'Sales Rate'],
            tableData: [
            ],
            camera: {
                type: RNCamera.Constants.Type.back,
                flashMode: RNCamera.Constants.FlashMode.auto,
            }
        };
    }

    async componentDidMount() {
        var domainStringId = "";
        AsyncStorage.getItem("domainDataId").then((value) => {
            domainStringId = value;
            this.setState({ domainId: parseInt(domainStringId) });
            console.log("domain data id" + this.state.domainId);

        }).catch(() => {
            this.setState({ loading: false });
            console.log('There is error getting domainDataId');
           // alert('There is error getting domainDataId');
        });
    }


    handleBackButtonClick() {
        this.props.navigation.goBack(null);
        return true;
    }
    cancel() {
        this.props.navigation.goBack(null);
    }

    modelCancel() {
        this.setState({ modalVisible: false });
    }

    async savePool() {
        if (String(this.state.selectedPoolName).length === 0) {
            alert('Please Enter PoolName');
        } else if (this.state.selectedPoolType.length === 0) {
            alert('Please Select Pool Type');
        }
        else if (this.state.arrayData.length < 2) {
            alert('You need atleast two rules for create pool');
        }
        else {
            this.setState({ loading: true });
            const username = await AsyncStorage.getItem("username");
            const params = {
                //required 
                "createdBy": username,
                "isActive": true,
                "isForEdit": false,
                "domainId": this.state.domainId,
                "poolName": this.state.selectedPoolName,
                "poolType": this.state.selectedPoolType,
                "ruleVo": this.state.arrayData,
            };
            console.log('params are' + JSON.stringify(params));
            this.setState({ loading: true });
            axios.post(PromotionsService.createPool(), params).then((res) => {
                if (res.data && res.data["isSuccess"] === "true") {
                    this.setState({ loading: false });
                    this.props.route.params.onGoBack();
                    this.props.navigation.goBack();
                }
                else {
                    this.setState({ loading: false });
                    alert("duplicate record already exists");
                }
            }
            );
        }
    }




    refresh() {
        this.setState({ productname: global.productname });
        console.log('search' + this.state.productname);
    }



    imageAction() {
        // console.log('tapped')
        // this.setState({ flagqtyModelOpen: true })
        // this.setState({ modalVisible: true });
    }

    onEndReached() {
        this.listRef.scrollToOffset({ offset: 0, animated: true });
    }

    addPoolRool() {
        this.setState({ updateRool: false, selectedColumnName: "", selectedOperator: "", productmrp: "", modalVisible: true, flagCustomerOpen: true });
    }

    handlePoolType = (value) => {
        this.setState({ selectedPoolType: value });
    };

    handleColumnName = (value) => {
        this.setState({ selectedColumnName: value });
    };

    handleValue = (value) => {
        this.setState({ productmrp: value });
    };



    handledeleteaction = (item, index) => {
        if (this.state.arrayData.length == 2) {
            alert('You need atleast two rules for create pool');
            return;
        }
        const list = this.state.arrayData;
        list.splice(index, 1);
        this.setState({ arrayData: list });
    };


    addruleName() {
        if (this.state.updateRool === true) {
            const editArray = [...this.state.arrayData];
            editArray[this.state.selectedIndex].columnName = this.state.selectedColumnName;
            editArray[this.state.selectedIndex].operatorSymbol = this.state.selectedOperator;
            editArray[this.state.selectedIndex].givenValue = this.state.productmrp;
            this.setState({ arrayData: editArray, modalVisible: false });

        }
        else {
            this.state.arrayData.push({ columnName: this.state.selectedColumnName, operatorSymbol: this.state.selectedOperator, givenValue: this.state.productmrp });
            this.setState({ modalVisible: false });
        }
    }

    handlePoolName = (value) => {
        this.setState({ selectedPoolName: value });
    };



    handleeditaction = (item, index) => {
        this.setState({ selectedIndex: index, modalVisible: true, updateRool: true, flagCustomerOpen: true, selectedColumnName: item.columnName, selectedOperator: item.operatorSymbol, productmrp: String(item.givenValue) });
    };



    handleOperator = (value) => {
        this.setState({ selectedOperator: value });
    };



    render() {
        return (
            <View style={styles.mainContainer}>
                {this.state.loading &&
                    <Loader
                        loading={this.state.loading} />
                }

                <View style={Device.isTablet ? styles.viewsWidth_tablet : styles.viewsWidth_mobile}>
                    <TouchableOpacity style={Device.isTablet ? styles.backButton_tablet : styles.backButton_mobile} onPress={() => this.handleBackButtonClick()}>
                        <Image source={require('../assets/images/backButton.png')} />
                    </TouchableOpacity>
                    <Text style={Device.isTablet ? styles.headerTitle_tablet : styles.headerTitle_mobile}> Add Pool </Text>
                </View>




                {/* <KeyboardAwareScrollView KeyboardAwareScrollView
                    enableOnAndroid={true}> */}

                <View style={{
                    flex: 1, justifyContent: 'center', //Centered horizontally
                    alignItems: 'center', color: '#ffffff'
                }}>
                    <View style={{ flexDirection: 'column', flex: 0, marginLeft: 0, marginTop: 20, marginRight: 0, backgroundColor: "#ffffff", borderRadius: 20, }}>
                        <Text style={[Device.isTablet ? styles.subheading_tablet : styles.subheading_mobile, { marginTop: 10 }]}>
                            Pool Details
                        </Text>
                        <View style={{ marginTop: 10, width: deviceWidth, }}>

                            <TextInput style={Device.isTablet ? styles.input_tablet : styles.input_mobile}
                                underlineColorAndroid="transparent"
                                placeholder="POOL NAME"
                                placeholderTextColor="#353C4050"
                                textAlignVertical="center"
                                autoCapitalize="none"
                                value={this.state.selectedPoolName}
                                onChangeText={this.handlePoolName}
                                ref={inputemail => { this.emailValueInput = inputemail; }} />


                            <View style={{
                                justifyContent: 'center',
                                margin: 20,
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
                            }} >
                                <RNPickerSelect
                                    placeholder={{
                                        label: 'POOL TYPE',

                                    }}
                                    Icon={() => {
                                        return <Chevron style={styles.imagealign} size={1.5} color="gray" />;
                                    }}
                                    items={[
                                        { label: 'Buy', value: 'Buy' },
                                        { label: 'Get', value: 'Get' },
                                        { label: 'Both', value: 'Both' },
                                    ]}
                                    onValueChange={this.handlePoolType}
                                    style={Device.isTablet ? pickerSelectStyles_tablet : pickerSelectStyles_mobile}
                                    value={this.state.selectedPoolType}
                                    useNativeAndroidPickerStyle={false}

                                />
                            </View>



                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 50 }}>
                            <Text style={[Device.isTablet ? styles.subheading_tablet : styles.subheading_mobile, { marginTop: 7 }]}>
                                Pool Rules
                            </Text>
                            <TouchableOpacity
                                style={{ borderRadius: 5, borderColor: "#ED1C24", backgroundColor: '#ffffff', width: Device.isTablet ? 120 : 90, height: Device.isTablet ? 38 : 28, borderWidth: 1, marginTop: 7, marginRight: 20 }}
                                onPress={() => this.addPoolRool()} >
                                <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#ED1C24', marginTop: 7, textAlign: 'center', alignSelf: 'center', borderRadius: 5, borderColor: "#ED1C24", }}> {('Add Pool Rule')} </Text>
                            </TouchableOpacity>
                        </View>


                        <ScrollView>
                            <FlatList
                                data={this.state.arrayData}
                                style={{ marginTop: 20, }}
                                onEndReached={this.onEndReached.bind(this)}

                                ref={(ref) => { this.listRef = ref; }}
                                keyExtractor={item => item}
                                renderItem={({ item, index }) => (
                                    <View style={{
                                        height: Device.isTablet ? 80 : 130,
                                        backgroundColor: '#FFFFFF',
                                        borderBottomWidth: 5,
                                        borderBottomColor: '#FFFFFF',
                                        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
                                    }}>
                                        <View style={{ flexDirection: 'column', width: '100%', height: 80, borderTopWidth: 10, borderColor: '#F6F6F6' }}>

                                            <Text style={{ fontSize: Device.isTablet ? 17 : 12, marginLeft: 16, marginTop: 20, fontFamily: 'regular', color: '#808080' }}>
                                                COLUMN NAME
                                            </Text>
                                            <Text style={{ fontSize: Device.isTablet ? 19 : 14, marginLeft: 16, marginTop: 0, fontFamily: 'medium', color: '#353C40' }}>
                                                {item.columnName}
                                            </Text>

                                            <Text style={Device.isTablet ? poolflats.operatorHeader_tablet : poolflats.operatorHeader_mobile}>
                                                OPERATOR
                                            </Text>
                                            <Text style={Device.isTablet ? poolflats.operatorValue_tablet : poolflats.operatorValue_mobile}>
                                                {item.operatorSymbol}
                                            </Text>

                                            <Text style={Device.isTablet ? poolflats.valueHeader_tablet : poolflats.valueHeader_mobile}>
                                                VALUES
                                            </Text>
                                            <Text style={Device.isTablet ? poolflats.valueBody_tablet : poolflats.valueBody_mobile}>
                                                {item.givenValue}
                                            </Text>
                                        </View>



                                        <TouchableOpacity style={Device.isTablet ? poolflats.editButton_tablet : poolflats.editButton_mobile} onPress={() => this.handleeditaction(item, index)}>
                                            <Image style={{ alignSelf: 'center', top: 5, height: Device.isTablet ? 30 : 20, width: Device.isTablet ? 30 : 20 }} source={require('../assets/images/edit.png')} />
                                        </TouchableOpacity>
                                        <View style={{
                                            backgroundColor: 'grey',
                                            flexDirection: 'row',
                                            justifyContent: 'space-around',
                                            alignItems: 'center',
                                            height: 30,
                                            width: 90
                                        }}>
                                        </View>


                                        <TouchableOpacity style={Device.isTablet ? poolflats.deleteButton_tablet : poolflats.deleteButton_mobile} onPress={() => this.handledeleteaction(item, index)}>
                                            <Image style={{ alignSelf: 'center', top: 5, height: Device.isTablet ? 30 : 20, width: Device.isTablet ? 30 : 20 }} source={require('../assets/images/delete.png')} />

                                        </TouchableOpacity>
                                        <View style={{
                                            backgroundColor: 'grey',
                                            flexDirection: 'row',
                                            justifyContent: 'space-around',
                                            alignItems: 'center',
                                            height: 30,
                                            width: 90
                                        }}>

                                        </View>

                                    </View>


                                )}


                            />
                            <View style={{ flexDirection: 'column', width: deviceWidth, backgroundColor: "#F6F6F6", marginTop: 20, }}>
                                <Text style={{
                                    fontSize: Device.isTablet ? 19 : 14, marginTop: 50, height: 100, fontFamily: 'regular', color: '#808080', textAlign: 'center', //Centered horizontally
                                    alignItems: 'center', //Centered vertically
                                    flex: 1
                                }}>
                                    add more rules buy clicking on add pool rule button

                                </Text>

                            </View>

                            <TouchableOpacity
                                style={Device.isTablet ? styles.saveButton_tablet : styles.saveButton_mobile} onPress={() => this.savePool()}
                            >
                                <Text style={Device.isTablet ? styles.saveButtonText_tablet : styles.saveButtonText_mobile}  > SAVE </Text>

                            </TouchableOpacity>

                            <TouchableOpacity
                                style={Device.isTablet ? styles.cancelButton_tablet : styles.cancelButton_mobile} onPress={() => this.cancel()}
                            >
                                <Text style={Device.isTablet ? styles.cancelButtonText_tablet : styles.cancelButtonText_mobile}  > CANCEL </Text>

                            </TouchableOpacity>

                        </ScrollView>
                        {this.state.flagCustomerOpen && (
                            <View>
                                <Modal isVisible={this.state.modalVisible}
                                 onBackButtonPress={() => this.modelCancel()}
                                 onBackdropPress={() => this.modelCancel()} >                   

                                    <View style={[Device.isTablet ? styles.filterMainContainer_tablet : styles.filterMainContainer_mobile, { height: Device.isTablet ? 500 : 400 }]}>
                                        <KeyboardAwareScrollView KeyboardAwareScrollView
                                            enableOnAndroid={true}>
                                            <Text style={Device.isTablet ? styles.filterByTitle_tablet : styles.filterByTitle_mobile}> {this.state.updateRool == true ? 'Update pool rule' : 'Add pool rule'} </Text>

                                            <TouchableOpacity style={Device.isTablet ? styles.filterCloseButton_tablet : styles.filterCloseButton_mobile} onPress={() => this.modelCancel()}>
                                                <Image style={Device.isTablet ? styles.filterCloseImage_tablet : styles.filterCloseImage_mobile} source={require('../assets/images/modelcancel.png')} />
                                            </TouchableOpacity>

                                            <Text style={Device.isTablet ? styles.filterByTitleDecoration_tablet : styles.filterByTitleDecoration_mobile}>
                                            </Text>
                                            <View style={{ marginTop: 10, width: deviceWidth, }}>
                                                <View style={Device.isTablet ? styles.rnSelectContainer_tablet : styles.rnSelectContainer_mobile} >

                                                    <RNPickerSelect

                                                        placeholder={{
                                                            label: 'SELECT COLUMN NAME',

                                                        }}
                                                        Icon={() => {
                                                            return <Chevron style={styles.imagealign} size={1.5} color="gray" />;
                                                        }}
                                                        items={[
                                                            { label: 'Mrp', value: 'Mrp' },
                                                            { label: 'BarcodeCreatedDate', value: 'BarcodeCreatedDate' },
                                                            { label: 'BatchNo', value: 'BatchNo' },
                                                        ]}
                                                        onValueChange={this.handleColumnName}
                                                        style={Device.isTablet ? pickerSelectStyles_tablet : pickerSelectStyles_mobile}
                                                        value={this.state.selectedColumnName}
                                                        useNativeAndroidPickerStyle={false}

                                                    />
                                                </View>


                                                <View style={Device.isTablet ? styles.rnSelectContainer_tablet : styles.rnSelectContainer_mobile} >
                                                    <RNPickerSelect
                                                        placeholder={{
                                                            label: 'SELECT OPERATOR',

                                                        }}
                                                        Icon={() => {
                                                            return <Chevron style={styles.imagealign} size={1.5} color="gray" />;
                                                        }}
                                                        items={[
                                                            { label: 'Equals', value: 'Equals' },
                                                            { label: 'NotEquals', value: 'NotEquals' },
                                                            { label: 'GreaterThan', value: 'GreaterThan' },
                                                            { label: 'GreaterThanAndEquals', value: 'GreaterThanAndEquals' },
                                                            { label: 'LessThanAndEquals', value: 'LessThanAndEquals' },
                                                            { label: 'In', value: 'In' },

                                                            // { label: 'Cost Price', value: 'Cost Price' },
                                                            // { label: 'SECTION', value: 'SECTION' },
                                                            // { label: 'SUBSECTION', value: 'SUBSECTION' },
                                                            // { label: 'DCODE', value: 'DCODE' },
                                                            // { label: 'MRP', value: 'MRP' },
                                                            // { label: 'Barcode Created On', value: 'Barcode Created On' },
                                                            // { label: 'STYLE CODE', value: 'STYLE CODE' },
                                                            // { label: 'Original Barcode Created On', value: 'Original Barcode Created On' },
                                                            // { label: 'SUBSECTION_ID', value: 'SUBSECTION_ID' },
                                                            // { label: 'UOM', value: 'UOM' },
                                                            // { label: 'BatchNo', value: 'BatchNo' },
                                                            // { label: 'Discount Type', value: 'Discount Type' },
                                                            // { label: 'DIVISION', value: 'DIVISION' },
                                                        ]}
                                                        onValueChange={this.handleOperator}
                                                        style={Device.isTablet ? pickerSelectStyles_tablet : pickerSelectStyles_mobile}
                                                        value={this.state.selectedOperator}
                                                        useNativeAndroidPickerStyle={false}

                                                    />
                                                </View>

                                                <TextInput style={Device.isTablet ? styles.input_tablet : styles.input_mobile}
                                                    underlineColorAndroid="transparent"
                                                    placeholder="ENTER VALUES"
                                                    keyboardType='name-phone-pad'
                                                    placeholderTextColor="#6F6F6F"
                                                    textAlignVertical="center"
                                                    autoCapitalize="none"
                                                    value={this.state.productmrp}
                                                    onChangeText={this.handleValue}
                                                    ref={inputemail => { this.emailValueInput = inputemail; }} />
                                            </View>

                                            <TouchableOpacity
                                                style={Device.isTablet ? styles.saveButton_tablet : styles.saveButton_mobile} onPress={() => this.addruleName()}
                                            >
                                                <Text style={Device.isTablet ? styles.saveButtonText_tablet : styles.saveButtonText_mobile}  > {this.state.updateRool == true ? 'UPDATE' : 'ADD'} </Text>

                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={Device.isTablet ? styles.cancelButton_tablet : styles.cancelButton_mobile} onPress={() => this.modelCancel()}
                                            >
                                                <Text style={Device.isTablet ? styles.cancelButtonText_tablet : styles.cancelButtonText_mobile}  > CANCEL </Text>

                                            </TouchableOpacity>
                                        </KeyboardAwareScrollView>
                                    </View>

                                </Modal>
                            </View>)}

                    </View>

                </View>
                {/* </View> */}
                {/* </KeyboardAwareScrollView> */}
            </View>

        );
    }
}
export default AddPool;


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

const poolflats = StyleSheet.create({
    // Styles For Mobile
    valueHeader_mobile: {
        fontSize: 12,
        position: 'absolute',
        right: 110,
        top: 43,
        fontFamily: 'regular',
        color: '#808080'
    },
    valueBody_mobile: {
        fontSize: 12,
        position: 'absolute',
        right: 110,
        top: 60,
        fontFamily: 'medium',
        color: '#353C40',
    },
    operatorHeader_mobile: {
        fontSize: 12,
        position: 'absolute',
        top: 60,
        left: 15,
        fontFamily: 'regular', color: '#808080',
        justifyContent: 'center', //Centered horizontally
        alignItems: 'center', //Centered vertically
        flex: 1
    },
    operatorValue_mobile: {
        fontSize: 14,
        position: 'absolute',
        top: 75,
        left: 15,
        fontFamily: 'medium', color: '#353C40',
        justifyContent: 'center', //Centered horizontally
        alignItems: 'center', //Centered vertically
        flex: 1
    },
    editButton_mobile: {
        position: 'absolute',
        right: 35,
        top: 70,
        width: 30,
        height: 30,
        borderColor: "lightgray",
    },
    deleteButton_mobile: {
        position: 'absolute',
        right: 10,
        top: 70,
        width: 30,
        height: 30,
        borderColor: "lightgray",
    },

    // Styles For Tablet
    operatorValue_tablet: {
        fontSize: 19,
        marginTop: -10,
        marginLeft: deviceWidth / 2 - 40,
        fontFamily: 'medium', color: '#353C40',
        justifyContent: 'center', //Centered horizontally
        alignItems: 'center', //Centered vertically
        flex: 1
    },
    operatorHeader_tablet: {
        fontSize: 17,
        marginTop: -45,
        marginLeft: deviceWidth / 2 - 40,
        fontFamily: 'regular', color: '#808080',
        justifyContent: 'center', //Centered horizontally
        alignItems: 'center', //Centered vertically
        flex: 1
    },
    valueHeader_tablet: {
        fontSize: 17,
        position: 'absolute',
        right: 90,
        top: 23,
        fontFamily: 'regular',
        color: '#808080'
    },
    valueBody_tablet: {
        fontSize: 17,
        position: 'absolute',
        right: 90,
        top: 40,
        fontFamily: 'medium',
        color: '#353C40',
    },
    editButton_tablet: {
        position: 'absolute',
        right: 40,
        top: 30,
        width: 40,
        height: 40,
        borderColor: "lightgray",
    },
    deleteButton_tablet: {
        position: 'absolute',
        right: 10,
        top: 30,
        width: 40,
        height: 40,
        borderColor: "lightgray",
    },
});



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
    },

    // Styles For Mobile
    viewsWidth_mobile: {
        backgroundColor: '#ffffff',
        width: deviceWidth,
        textAlign: 'center',
        fontSize: 24,
        height: 84,
    },
    backButton_mobile: {
        position: 'absolute',
        left: 10,
        top: 30,
        width: 40,
        height: 40,
    },
    headerTitle_mobile: {
        position: 'absolute',
        left: 70,
        top: 47,
        width: 300,
        height: 20,
        fontFamily: 'bold',
        fontSize: 18,
        color: '#353C40'
    },
    subheading_mobile: {
        fontFamily: 'medium',
        fontSize: 16,
        color: "red",
        marginLeft: 20,
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
    rnSelect_mobile: {
        color: '#8F9EB7',
        fontSize: 15
    },
    rnSelectContainer_mobile: {
        justifyContent: 'center',
        margin: 20,
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
    saveButton_mobile: {
        margin: 8,
        height: 50,
        backgroundColor: "#ED1C24",
        borderRadius: 5,
    },
    saveButtonText_mobile: {
        textAlign: 'center',
        marginTop: 15,
        color: "#ffffff",
        fontSize: 15,
        fontFamily: "regular"
    },
    cancelButton_mobile: {
        margin: 8,
        height: 50,
        backgroundColor: "#ffffff",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#353C4050",
    },
    cancelButtonText_mobile: {
        textAlign: 'center',
        marginTop: 15,
        color: "#353C4050",
        fontSize: 15,
        fontFamily: "regular"
    },
    filterMainContainer_mobile: {
        width: deviceWidth,
        alignItems: 'center',
        marginLeft: -20,
        backgroundColor: "#ffffff",
        position: 'absolute',
        bottom: -20,
    },
    filterByTitle_mobile: {
        position: 'absolute',
        left: 20,
        top: 15,
        width: 300,
        height: 20,
        fontFamily: 'medium',
        fontSize: 16,
        color: '#353C40'
    },
    filterByTitleDecoration_mobile: {
        height: Device.isTablet ? 2 : 1,
        width: deviceWidth,
        backgroundColor: 'lightgray',
        marginTop: 50,
    },
    filterCloseButton_mobile: {
        position: 'absolute',
        right: 8,
        top: 15,
        width: 50, height: 50,
    },
    filterCloseImage_mobile: {
        color: '#ED1C24',
        fontFamily: 'regular',
        fontSize: 12,
        position: 'absolute',
        top: 10,
        right: 8,
    },

    // Styles For Tablet
    viewsWidth_tablet: {
        backgroundColor: '#ffffff',
        width: deviceWidth,
        textAlign: 'center',
        fontSize: 28,
        height: 90,
    },
    backButton_tablet: {
        position: 'absolute',
        left: 10,
        top: 25,
        width: 90,
        height: 90,
    },
    headerTitle_tablet: {
        position: 'absolute',
        left: 70,
        top: 40,
        width: 300,
        height: 40,
        fontFamily: 'bold',
        fontSize: 24,
        color: '#353C40'
    },
    subheading_tablet: {
        fontFamily: 'medium',
        fontSize: 21,
        color: "red",
        marginLeft: 20,
    },
    input_tablet: {
        justifyContent: 'center',
        marginLeft: 20,
        marginRight: 20,
        height: 54,
        marginTop: 5,
        marginBottom: 10,
        borderColor: '#8F9EB717',
        borderRadius: 3,
        backgroundColor: '#FBFBFB',
        borderWidth: 1,
        fontFamily: 'regular',
        paddingLeft: 15,
        fontSize: 20,
    },
    rnSelect_tablet: {
        color: '#8F9EB7',
        fontSize: 20
    },
    rnSelectContainer_tablet: {
        justifyContent: 'center',
        margin: 20,
        height: 54,
        marginTop: 5,
        marginBottom: 10,
        borderColor: '#8F9EB717',
        borderRadius: 3,
        backgroundColor: '#FBFBFB',
        borderWidth: 1,
        fontFamily: 'regular',
        paddingLeft: 15,
        fontSize: 20,
    },
    saveButton_tablet: {
        margin: 8,
        height: 60,
        backgroundColor: "#ED1C24",
        borderRadius: 5,
    },
    saveButtonText_tablet: {
        textAlign: 'center',
        marginTop: 15,
        color: "#ffffff",
        fontSize: 20,
        fontFamily: "regular"
    },
    cancelButton_tablet: {
        margin: 8,
        height: 60,
        backgroundColor: "#ffffff",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#353C4050",
    },
    cancelButtonText_tablet: {
        textAlign: 'center',
        marginTop: 15,
        color: "#353C4050",
        fontSize: 20,
        fontFamily: "regular"
    },
    filterMainContainer_tablet: {
        width: deviceWidth,
        alignItems: 'center',
        marginLeft: -40,
        backgroundColor: "#ffffff",
        height: 600,
        position: 'absolute',
        bottom: -40,
    },
    filterByTitle_tablet: {
        position: 'absolute',
        left: 20,
        top: 15,
        width: 300,
        height: 30,
        fontFamily: 'medium',
        fontSize: 21,
        color: '#353C40'
    },
    filterByTitleDecoration_tablet: {
        height: Device.isTablet ? 2 : 1,
        width: deviceWidth,
        backgroundColor: 'lightgray',
        marginTop: 60,
    },
    filterCloseButton_tablet: {
        position: 'absolute',
        right: 24,
        top: 10,
        width: 60, height: 60,
    },
    filterCloseImage_tablet: {
        color: '#ED1C24',
        fontFamily: 'regular',
        fontSize: 17,
        position: 'absolute',
        top: 10,
        right: 24,
    },

});