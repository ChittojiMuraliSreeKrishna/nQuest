import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';
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

class EditPool extends Component {
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
            selectedIndex: 0,
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
            updateRool: false,
            item: [],
            domainId: 1,
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
        this.setState({
            item: this.props.route.params.item
        });
        console.log(this.state.item);
        this.setState({
            selectedPoolType: this.props.route.params.item.poolType,
            arrayData: this.props.route.params.item.ruleVo,
            selectedPoolName: this.props.route.params.item.poolName
        });

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
                "isForEdit": true,
                "domainId": this.state.domainId,
                "poolName": this.state.selectedPoolName,
                "poolType": this.state.selectedPoolType,
                "ruleVo": this.state.arrayData,
                "poolId": this.props.route.params.item.poolId,
            };
            console.log('params are' + JSON.stringify(params));
            this.setState({ loading: true });
            axios.post(PromotionsService.updatePool(), params).then((res) => {
                if (res.data && res.data["isSuccess"] === "true") {
                    this.setState({ loading: false });
                    // this.props.route.params.onGoBack();
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
    }

    onEndReached() {
        this.listRef.scrollToOffset({ offset: 0, animated: true });
    }

    addPoolRool() {
        this.setState({
            updateRool: false,
            selectedColumnName: "",
            selectedOperator: "",
            productmrp: "",
            modalVisible: true,
            flagCustomerOpen: true
        });
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


    handleOperator = (value) => {
        this.setState({ selectedOperator: value });
    };

    handleeditaction = (item, index) => {
        this.setState({
            selectedIndex: index,
            modalVisible: true,
            updateRool: true,
            flagCustomerOpen: true,
            selectedColumnName: item.columnName,
            selectedOperator: item.operatorSymbol,
            productmrp: String(item.givenValue)
        });
    };




    render() {
        return (
            <View style={styles.container}>
                {this.state.loading &&
                    <Loader
                        loading={this.state.loading} />
                }
                <View style={styles.viewswidth}>
                    <TouchableOpacity style={{
                        position: 'absolute',
                        left: 10,
                        top: 30,
                        width: 40,
                        height: 40,
                    }} onPress={() => this.handleBackButtonClick()}>
                        <Image source={require('../assets/images/backButton.png')} />
                    </TouchableOpacity>
                    <Text style={{
                        position: 'absolute',
                        left: 70,
                        top: 47,
                        width: 300,
                        height: 20,
                        fontFamily: 'bold',
                        fontSize: 18,
                        color: '#353C40'
                    }}> Edit Pool </Text>
                </View>

                <View style={{
                    flex: 1, justifyContent: 'center', //Centered horizontally
                    alignItems: 'center', color: '#ffffff'
                }}>
                    <View style={{ flexDirection: 'column', flex: 0, marginLeft: 0, marginTop: 20, marginRight: 0, backgroundColor: "#ffffff", borderRadius: 20, }}>
                        <Text style={{ fontSize: 16, marginLeft: 16, marginTop: 20, fontFamily: 'medium', color: '#ED1C24' }}>
                            Pool Details
                        </Text>
                        <View style={{ marginTop: 10, width: deviceWidth, }}>

                            <TextInput style={styles.input}
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
                                    style={pickerSelectStyles}
                                    value={this.state.selectedPoolType}
                                    useNativeAndroidPickerStyle={false}

                                />
                            </View>



                        </View>

                        <Text style={{ fontSize: 16, marginLeft: 16, marginTop: 20, fontFamily: 'medium', color: '#ED1C24' }}>
                            Pool Rules
                        </Text>
                        <TouchableOpacity
                            style={{ position: 'absolute', right: 20, top: 180, borderRadius: 5, borderColor: "#ED1C24", backgroundColor: '#ffffff', width: 90, height: 28, borderWidth: 1, }}
                            onPress={() => this.addPoolRool()} >
                            <Text style={{ fontSize: 12, fontFamily: 'regular', color: '#ED1C24', marginTop: 4, textAlign: 'center', alignSelf: 'center', borderRadius: 5, borderColor: "#ED1C24", }}> {('Add Pool Rule')} </Text>
                        </TouchableOpacity>


                        <ScrollView>
                            <FlatList
                                data={this.state.item.ruleVo}
                                style={{ marginTop: 40, }}
                                onEndReached={this.onEndReached.bind(this)}

                                ref={(ref) => { this.listRef = ref; }}
                                keyExtractor={item => item}
                                renderItem={({ item, index }) => (
                                    <View style={{
                                        height: 80,
                                        backgroundColor: '#FFFFFF',
                                        borderBottomWidth: 5,
                                        borderBottomColor: '#FFFFFF',
                                        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
                                    }}>
                                        <View style={{ flexDirection: 'column', width: '100%', height: 80, borderTopWidth: 10, borderColor: '#F6F6F6' }}>

                                            <Text style={{ fontSize: 12, marginLeft: 16, marginTop: 20, fontFamily: 'regular', color: '#808080' }}>
                                                COLUMN NAME
                                            </Text>
                                            <Text style={{ fontSize: 14, marginLeft: 16, marginTop: 0, fontFamily: 'medium', color: '#353C40' }}>
                                                {item.columnName}
                                            </Text>

                                            <Text style={{
                                                fontSize: 12, marginTop: -30, marginLeft: deviceWidth / 2 - 40, fontFamily: 'regular', color: '#808080', justifyContent: 'center', //Centered horizontally
                                                alignItems: 'center', //Centered vertically
                                                flex: 1
                                            }}>
                                                OPERATOR
                                            </Text>
                                            <Text style={{
                                                fontSize: 14, marginTop: -20, marginLeft: deviceWidth / 2 - 40, fontFamily: 'medium', color: '#353C40', justifyContent: 'center', //Centered horizontally
                                                alignItems: 'center', //Centered vertically
                                                flex: 1
                                            }}>
                                                {item.operatorSymbol}
                                            </Text>

                                            <Text style={{ fontSize: 12, position: 'absolute', right: 70, top: 23, fontFamily: 'regular', color: '#808080' }}>
                                                VALUES
                                            </Text>
                                            <Text style={{ fontSize: 12, position: 'absolute', right: 70, top: 37, fontFamily: 'medium', color: '#353C40', }}>
                                                {item.givenValue}
                                            </Text>
                                        </View>

                                        <TouchableOpacity style={{
                                            position: 'absolute',
                                            right: 35,
                                            top: 30,
                                            width: 30,
                                            height: 30,
                                            borderColor: "lightgray",
                                        }} onPress={() => this.handleeditaction(item, index)}>
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



                                        <TouchableOpacity style={{
                                            position: 'absolute',
                                            right: 10,
                                            top: 30,
                                            width: 30,
                                            height: 30,


                                            borderColor: "lightgray",
                                        }} onPress={() => this.handledeleteaction(item, index)}>
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
                                    fontSize: 14, marginTop: 50, height: 100, fontFamily: 'regular', color: '#808080', textAlign: 'center', //Centered horizontally
                                    alignItems: 'center', //Centered vertically
                                    flex: 1
                                }}>
                                    add more rules buy clicking on add pool rule button

                                </Text>

                            </View>

                            <TouchableOpacity
                                style={{
                                    margin: 10,
                                    height: 50, backgroundColor: "#ED1C24", borderRadius: 5,
                                }} onPress={() => this.savePool()}
                            >
                                <Text style={{
                                    textAlign: 'center', marginTop: 20, color: "#ffffff", fontSize: 15,
                                    fontFamily: "regular"
                                }}  > SAVE </Text>

                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{
                                    margin: 10,
                                    height: 50, backgroundColor: "#ffffff", borderRadius: 5, borderWidth: 1, borderColor: "#353C4050",
                                }} onPress={() => this.cancel()}
                            >
                                <Text style={{
                                    textAlign: 'center', marginTop: 20, color: "#353C4050", fontSize: 15,
                                    fontFamily: "regular"
                                }}  > CANCEL </Text>

                            </TouchableOpacity>

                            {this.state.flagCustomerOpen && (
                                <View>
                                    <Modal isVisible={this.state.modalVisible}
                                      onBackButtonPress={() => this.modelCancel()}
                                      onBackdropPress={() => this.modelCancel()} >

                                        <View style={{
                                            width: deviceWidth,
                                            alignItems: 'center',
                                            marginLeft: -20,
                                            backgroundColor: "#ffffff",
                                            height: 400,
                                            position: 'absolute',
                                            bottom: -20,
                                        }}>
                                            <KeyboardAwareScrollView KeyboardAwareScrollView
                                                enableOnAndroid={true}>
                                                <Text style={{
                                                    position: 'absolute',
                                                    left: 20,
                                                    top: 15,
                                                    width: 300,
                                                    height: 20,
                                                    fontFamily: 'medium',
                                                    fontSize: 16,
                                                    color: '#353C40'
                                                }}> {this.state.updateRool == true ? 'Update pool rule' : 'Add pool rule'} </Text>

                                                <TouchableOpacity style={{
                                                    position: 'absolute',
                                                    right: 20,
                                                    top: 8,
                                                    width: 50, height: 50,
                                                }} onPress={() => this.modelCancel()}>
                                                    <Image style={{ color: '#ED1C24', fontFamily: 'regular', fontSize: 12, position: 'absolute', top: 10, right: 0, }} source={require('../assets/images/modelcancel.png')} />
                                                </TouchableOpacity>

                                                <Text style={{ height: Device.isTablet ? 2 : 1, width: deviceWidth, backgroundColor: 'lightgray', marginTop: 50, }}>
                                                </Text>
                                                <View style={{ marginTop: 10, width: deviceWidth, }}>
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
                                                            style={pickerSelectStyles}
                                                            value={this.state.selectedColumnName}
                                                            useNativeAndroidPickerStyle={false}

                                                        />
                                                    </View>


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
                                                            style={pickerSelectStyles}
                                                            value={this.state.selectedOperator}
                                                            useNativeAndroidPickerStyle={false}

                                                        />
                                                    </View>

                                                    <TextInput style={styles.input}
                                                        underlineColorAndroid="transparent"
                                                        placeholder="ENTER VALUES"
                                                        keyboardType='name-phone-pad'
                                                        placeholderTextColor="#6F6F6F"
                                                        textAlignVertical="center"
                                                        autoCapitalize="none"
                                                        value={this.state.productmrp}
                                                        onChangeText={this.handleValue}
                                                    />
                                                </View>

                                                <TouchableOpacity
                                                    style={{
                                                        width: deviceWidth - 40,
                                                        marginLeft: 20,
                                                        marginRight: 20,
                                                        marginTop: 20,
                                                        height: 50, backgroundColor: "#ED1C24", borderRadius: 5,
                                                    }} onPress={() => this.addruleName()}
                                                >
                                                    <Text style={{
                                                        textAlign: 'center', marginTop: 20, color: "#ffffff", fontSize: 15,
                                                        fontFamily: "regular"
                                                    }}  > {this.state.updateRool == true ? 'UPDATE' : 'ADD'} </Text>

                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    style={{
                                                        width: deviceWidth - 40,
                                                        marginLeft: 20,
                                                        marginRight: 20,
                                                        marginTop: 20,
                                                        height: 50, backgroundColor: "#ffffff", borderRadius: 5, borderWidth: 1, borderColor: "#353C4050",
                                                    }} onPress={() => this.modelCancel()}
                                                >
                                                    <Text style={{
                                                        textAlign: 'center', marginTop: 20, color: "#353C4050", fontSize: 15,
                                                        fontFamily: "regular"
                                                    }}  > CANCEL </Text>

                                                </TouchableOpacity>
                                            </KeyboardAwareScrollView>
                                        </View>

                                    </Modal>
                                </View>)}

                        </ScrollView>


                    </View>

                </View>
                {/* </View> */}
                {/* </KeyboardAwareScrollView> */}
            </View>

        );
    }
}
export default EditPool;


const pickerSelectStyles = StyleSheet.create({
    placeholder: {
        color: "#6F6F6F",
        fontFamily: "regular",
        fontSize: 15,
    },
    inputIOS: {
        justifyContent: 'center',
        height: Device.isTablet ? 52 : 42,
        borderRadius: 3,
        borderWidth: Device.isTablet ? 2 : 1,
        fontFamily: 'regular',
        //paddingLeft: -20,
        fontSize: Device.isTablet ? 20 : 15,
        borderColor: '#FBFBFB',
        backgroundColor: '#FBFBFB',
        color: '#001B4A',
    },
    inputAndroid: {
        justifyContent: 'center',
        height: Device.isTablet ? 52 : 42,
        borderRadius: 3,
        borderWidth: Device.isTablet ? 2 : 1,
        fontFamily: 'regular',
        //paddingLeft: -20,
        fontSize: Device.isTablet ? 20 : 15,
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

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#FAFAFF'
    },
    viewswidth: {
        backgroundColor: '#ffffff',
        width: deviceWidth,
        textAlign: 'center',
        fontSize: 24,
        height: 84,
    },
    loading: {
        flex: 1,
        justifyContent: 'center'
        // alignItems: 'center',
    },
    input: {
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
    barcodeinput: {
        justifyContent: 'center',
        margin: 20,
        height: 50,
        marginTop: 28,
        marginBottom: 10,
        borderColor: '#DCE3F2',
        borderRadius: 5,
        color: '#353C40',
        backgroundColor: '#DCE3F2',
        borderWidth: 1,
        fontFamily: 'regular',
        fontSize: 14,
        paddingLeft: 15
    },

    signInButton: {
        backgroundColor: '#ED1C24',
        justifyContent: 'center',
        width: '48%',
        marginLeft: 0,
        marginTop: 10,
        height: 40,
        borderRadius: 30,
        fontWeight: 'bold',
        margin: 10,
        // alignSelf:'center',
        // marginBottom:100,
    },
    qty: {
        backgroundColor: '#ED1C24',
        justifyContent: 'center',
        width: '18%',
        marginTop: 10,
        height: 40,
        margin: 5,
        borderRadius: 5,
        fontWeight: 'bold',
    },
    imagealign: {
        marginTop: Device.isTablet ? 25 : 20,
        marginRight: Device.isTablet ? 30 : 20,
    },
    itemscount: {
        backgroundColor: '#ED1C24',
        justifyContent: 'center',
        width: '18%',
        marginLeft: 0,
        marginTop: 10,
        height: 40,
        borderRadius: 5,
        fontWeight: 'bold',
        margin: 5,
        // alignSelf:'center',
        // marginBottom:100,
    },
    itemDetail: {
        backgroundColor: '#ffffff',

        width: '60%',
        marginLeft: 0,
        marginTop: 10,
        height: 40,
        borderRadius: 5,
        fontWeight: 'bold',
        margin: 5,
        // alignSelf:'center',
        // marginBottom:100,
    },
    signInButtonRight: {
        backgroundColor: '#ED1C24',
        justifyContent: 'center',
        width: '48%',
        marginTop: 10,
        height: 40,
        margin: 10,
        borderRadius: 30,
        fontWeight: 'bold',
    },
    signInButtonText: {
        color: 'white',
        alignSelf: 'center',
        fontSize: 14,
        fontFamily: "regular",
    },
    signInFieldStyle: {
        color: 'black',
        marginLeft: 20,
        marginTop: 5,
        fontSize: 18,
        fontFamily: "regular",
        textAlign: 'left',
    },
    findIteminput: {
        marginLeft: 30,
        marginRight: 30,
        marginTop: 20,
        marginBottom: 1000,
        height: 50,
        backgroundColor: "#DEF1FF",
        borderRadius: 10,
        color: '#001B4A',
        fontFamily: "regular",
        fontSize: 12,
    },
    qtyInput: {
        width: 50,
        height: 25,
        // marginTop: 20,
        // marginBottom: 1000,
        // height: 50,
        // backgroundColor: "#DEF1FF",
        // borderRadius: 10,
        // color: '#001B4A',
        // fontFamily: "regular",
        // fontSize: 12,
    },
    signUptext: {
        marginTop: 40,
        fontFamily: "regular",
        alignSelf: 'center',
        color: '#FFFFFF',
        fontSize: 28,
    },
    saleBillsText: {
        marginLeft: 0,
        marginTop: -20,
        marginBottom: 10,
        fontFamily: "bold",
        color: '#0F2851',
        fontSize: 14,
    },
    tablecontainer: {
        flex: 1,
        // width:deviceWidth,
        marginLeft: 20,
        marginRight: 20,
        padding: 20,
        paddingTop: 30,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#FFFFFF'
    },
    head: {
        height: 45,
        borderColor: '#FAFAFF',
        borderWidth: 1,
        borderRadius: 10,
    },
    text: {
        margin: 6,
        color: "#ED1C24",
        fontFamily: "semibold",
        fontSize: 11,
    },
    textData: {
        margin: 6,
        color: "#48596B",
        fontFamily: "regular",
        fontSize: 10,
    },

    Topcontainer: {
        flexDirection: 'row',
        marginLeft: 0,
        marginRight: 0,
        width: '100%',
        backgroundColor: 'grey',
        height: 50
    },

    TopcontainerforModel: {
        flexDirection: 'row',
        margin: 18,

        backgroundColor: 'grey',
        borderRadius: 20,
        height: 44,
    },
    TopcontainerforPay: {
        flexDirection: 'row',
        marginLeft: 0,
        marginRight: 0,
        marginTop: 10,
        width: '100%',
        backgroundColor: '#ffffff',
        borderColor: 'lightgray',
        borderRadius: 0,
        height: 50,
    },
    TopcontainerforItems: {
        flexDirection: 'row',
        marginLeft: 0,
        marginRight: 0,
        marginTop: 10,
        width: '100%',
        backgroundColor: '#ffffff',
        borderColor: 'lightgray',
        borderRadius: 0,
        height: 50,
    },
    redbox: {
        backgroundColor: "#1CA2FF",
        alignSelf: "flex-start",

        //marginHorizontal: "1%",
        marginBottom: 6,
        width: "25%",
        height: 45,
        textAlign: "center",
    },
    bluebox: {
        backgroundColor: "#ED1C24",
        alignSelf: "flex-start",
        //marginHorizontal: "1%",
        marginBottom: 6,
        width: "25%",
        height: 45,
        textAlign: "center",
    },
    blackbox: {
        backgroundColor: "#ED1C24",
        alignSelf: "flex-start",
        //marginHorizontal: "1%",
        marginBottom: 6,
        width: "25%",
        height: 45,
        textAlign: "center",
    },
    greenbox: {
        backgroundColor: "#ED1C24",
        alignSelf: "flex-start",
        //marginHorizontal: "1%",
        marginBottom: 6,
        width: "25%",
        height: 45,
        textAlign: "center",
    },





    tabBar: {
        flexDirection: 'row',
        paddingTop: Constants.statusBarHeight,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
    },
    box: {
        width: 50,
        height: 50,
    },
    row: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    button: {
        paddingHorizontal: 8,
        paddingVertical: 6,
        //borderRadius: 4,
        backgroundColor: "#ED1C24",
        alignSelf: "flex-start",
        //marginHorizontal: "1%",
        marginBottom: 6,
        width: "25%",
        height: 45,
        textAlign: "center",
    },
    selected: {
        backgroundColor: "#BBE3FF",
        borderWidth: 0,
        backgroundColor: "#ED1C24",
    },
    buttonLabel: {
        textAlign: "center",
        color: "#BBE3FF",
        fontFamily: "regular",
        fontSize: 14,
    },
    selectedLabel: {
        color: "white",
        textAlign: "center",
        alignSelf: "center",
        marginTop: 10,
        fontFamily: "regular",
        fontSize: 14,
    },
    label: {
        textAlign: "center",
        marginBottom: 10,
        fontSize: 24,
    },

    //model
    modelcontainer: {
        alignItems: 'center',
        backgroundColor: '#ede3f2',
        padding: 100
    },
    modal: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#f7021a',
        padding: 100
    },
    modeltext: {
        color: '#3f2949',
        marginTop: 10
    },
    btn: {
        width: 40, height: 18, borderWidth: 0.2, borderColor: '#48596B', fontFamily: "regular",
        fontSize: 10,
    },
    btnText: { textAlign: 'center', color: '#fff' }
    ,
    preview: {
        margin: 20,
        height: 300,
        marginTop: 5,
        marginBottom: 10,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    overlay: {
        position: 'absolute',
        padding: 16,
        right: 0,
        left: 0,
        alignItems: 'center'
    },
    topOverlay: {
        top: 0,
        flex: 1,
        marginLeft: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    bottomOverlay: {
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    enterBarcodeManualButton: {
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 40
    },
    scanScreenMessage: {
        fontSize: 14,
        color: 'white',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    }
});
