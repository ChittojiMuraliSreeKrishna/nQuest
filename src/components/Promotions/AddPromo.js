import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { Component } from 'react';
import { Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Device from 'react-native-device-detection';
import Modal from "react-native-modal";
import RNPickerSelect from 'react-native-picker-select';
import { Chevron } from 'react-native-shapes';
import { openDatabase } from 'react-native-sqlite-storage';
import Loader from '../../commonUtils/loader';
import PromotionsService from '../services/PromotionsService';
var deviceWidth = Dimensions.get('window').width;
// Connction to access the pre-populated db
const db = openDatabase({ name: 'tbl_items.db', createFromLocation: 1 });

class AddPromo extends Component {
    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.camera = null;
        this.barcodeCodes = [];
        this.state = {
            uom: [],
            open: false,
            chargeExtra: false,
            addPools: false,
            addBenifits: false,
            flagAddPool: false,
            modalVisible: true,
            promotionName: '',
            selectedPromoApplyName: '',
            description: '',
            printonbill: '',
            selectedApplicability: '',
            selectedTax: "",
            buyany: "",
            domainId: 1,
            selctedPoolnames: [],
            selectedPoolName: '',
            selectedPoolId: 0,
            createdByArray: [],
            isEdit: false,
            createdByTempArray: [],
            selectedItem: -1,
            loading: false,
            item: [],
        };
    }

    async componentDidMount() {
        var domainStringId = "";
        AsyncStorage.getItem("domainDataId").then((value) => {
            domainStringId = value;
            this.setState({ domainId: parseInt(domainStringId) });
            console.log("domain data id" + this.state.domainId);
            this.getAllpools();

        }).catch(() => {
            this.setState({ loading: false });
            console.log('There is error getting domainDataId');
            // alert('There is error getting domainDataId');
        });
        this.setState({
            promotionName: this.props.route.params.item.promotionName,
            selectedPromoApplyName: this.props.route.params.item.promoApplyType,
            description: this.props.route.params.item.description,
            printonbill: this.props.route.params.item.printNameOnBill,
            selectedApplicability: this.props.route.params.item.applicability,
            buyany: String(this.props.route.params.item.buyItemsFromPool),
            isEdit: this.props.route.params.isEdit,
            selctedPoolnames: this.props.route.params.item.poolVo
        });
        // this.setState({ arrayData: this.props.route.params.item.ruleVo })
        // this.setState({ arrayData: this.props.route.params.item.ruleVo })

    }


    getAllpools = () => {
        this.setState({ createdByArray: [], loading: true });
        const params = {
            "domainId": this.state.domainId,
            "isActive": true
        };
        axios.get(PromotionsService.getAllPools(),
            { params }).then((res) => {
                if (res.data && res.data["isSuccess"] === "true") {
                    this.setState({ loading: false });

                    let len = res.data["result"]["poolvo"].length;
                    if (len > 0) {
                        for (let i = 0; i < len; i++) {
                            let number = res.data["result"]["poolvo"][i];
                            if (number.poolName != null) {
                                this.state.createdByArray.push({ poolName: number.poolName, poolId: number.poolId });
                            }


                            console.log('pool names' + number.poolName);
                        }
                        this.setState({ createdByArray: this.state.createdByArray });
                    }
                    // this.state.createdByTempArray.forEach(obj => {
                    //     if (!this.state.createdByArray.some(o => o.poolName === obj.poolName)) {
                    //         this.state.createdByArray.push({ ...obj })
                    //     }
                    //     this.setState({ createdByArray: this.state.createdByArray })
                    // });

                    return;
                }
            }).catch(() => {
                this.setState({ loading: false });
                this.setState({ loading: false });
                alert('No Records Found');
            });

    };

    selectPools = (item, index) => {
        console.log('-------ITEM TAPPED' + item.poolName);
        this.setState({ selectedItem: index, selectedPoolName: item.poolName, selectedPoolId: item.poolId });
    };



    handleBackButtonClick() {
        this.props.navigation.goBack(null);
        return true;
    }
    cancel() {
        this.props.navigation.goBack(null);
    }

    modelCancel() {
        this.setState({ modalVisible: false, flagAddPool: false });
    }

    handlePromotionName = (value) => {
        this.setState({ promotionName: value });
    };

    handleDescription = (value) => {
        this.setState({ description: value });
    };

    handlePrintOnSallBill = (value) => {
        this.setState({ printonbill: value });
    };

    handleApplicability = (value) => {
        this.setState({ selectedApplicability: value });
    };

    handleTax = (value) => {
        this.setState({ selectedTax: value });
    };

    chargeExtra() {
        if (this.state.chargeExtra === true) {
            this.setState({ chargeExtra: false });
        }
        else {
            this.setState({ chargeExtra: true });
        }

    }
    handlePromoApplyname = (value) => {
        this.setState({ selectedPromoApplyName: value });
    };

    async savePromo() {
        if (String(this.state.promotionName).length === 0) {
            alert('Please Enter promotion name');
        } else if (this.state.description.length === 0) {
            alert('Please Enter Description');
        }
        else if (this.state.printonbill.length === 0) {
            alert('Please Enter printname on the salebill');
        } else if (this.state.selectedApplicability.length === 0) {
            alert('Please Select Applicability');
        }
        else if (this.state.buyany.length === 0) {
            alert('Please Enter BuyAny Value');
        }
        else if (this.state.createdByArray.length < 1) {
            alert('You need to select atleast one pool for create promo');
        }
        else {
            this.setState({ loading: true });
            const username = await AsyncStorage.getItem("username");
            this.setState({ loading: true });
            if (this.state.isEdit === true) {
                const params = {
                    "applicability": this.state.selectedApplicability,
                    "buyItemsFromPool": this.state.buyany,
                    "description": this.state.description,
                    "createdBy": username,
                    "isActive": true,
                    "isForEdit": true,
                    "isTaxExtra": false,
                    "poolVo":
                        this.state.selctedPoolnames
                    ,
                    "promoId": this.props.route.params.item.promoId,
                    "printNameOnBill": this.state.printonbill,
                    "domainId": this.state.domainId,
                    "promoApplyType": this.state.selectedPromoApplyName,
                    "promotionName": this.state.promotionName,
                    "promoType": null,
                };
                console.log('--start updating');
                axios.post(PromotionsService.editPromo(), params).then((res) => {
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
            else {
                const params = {
                    "applicability": this.state.selectedApplicability,
                    "buyItemsFromPool": this.state.buyany,
                    "description": this.state.description,
                    "createdBy": username,
                    "isActive": true,
                    "isForEdit": false,
                    "isTaxExtra": false,
                    "poolVo":
                        this.state.selctedPoolnames
                    ,
                    "printNameOnBill": this.state.printonbill,
                    "domainId": this.state.domainId,
                    "promoApplyType": this.state.selectedPromoApplyName,
                    "promotionName": this.state.promotionName,
                    "promoType": null,
                };
                axios.post(PromotionsService.addPromotion(), params).then((res) => {
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
    }

    refresh() {
        this.setState({ productname: global.productname });
        console.log('search' + this.state.productname);
    }

    onEndReached() {
        this.listRef.scrollToOffset({ offset: 0, animated: true });
    }

    addBenfits() {

    }

    addPools() {
        this.setState({ flagAddPool: true, modalVisible: true });
    }

    addPoolName() {
        this.state.selctedPoolnames.push({ poolName: this.state.selectedPoolName, poolId: this.state.selectedPoolId });
        this.setState({ modalVisible: false, flagAddPool: false });
    }

    handleValue = (value) => {
        this.setState({ buyany: value });
    };

    render() {
        return (
            <View style={styles.mainContainer} >
                {this.state.loading &&
                    <Loader
                        loading={this.state.loading} />
                }

                <View style={Device.isTablet ? styles.viewsWidth_tablet : styles.viewsWidth_mobile}>
                    <TouchableOpacity style={Device.isTablet ? styles.backButton_tablet : styles.backButton_mobile} onPress={() => this.handleBackButtonClick()}>
                        <Image source={require('../assets/images/backButton.png')} />
                    </TouchableOpacity>
                    <Text style={Device.isTablet ? styles.headerTitle_tablet : styles.headerTitle_mobile}> {this.state.isEdit == true ? 'Edit Promo' : 'Add Promo'} </Text>
                </View>
                <ScrollView>
                    <View style={{ marginTop: 30, width: deviceWidth, }}>
                        <Text style={Device.isTablet ? styles.subheading_tablet : styles.subheading_mobile}>Promo code details</Text>
                        <TextInput style={Device.isTablet ? styles.input_tablet : styles.input_mobile}
                            underlineColorAndroid="transparent"
                            placeholder="PROMOTION NAME"
                            placeholderTextColor="#6F6F6F"
                            textAlignVertical="center"
                            autoCapitalize="none"
                            value={this.state.promotionName}
                            onChangeText={this.handlePromotionName}
                        />

                        <View style={Device.isTablet ? styles.rnSelectContainer_tablet : styles.rnSelectContainer_mobile} >
                            <RNPickerSelect
                                placeholder={{
                                    label: 'PROMOTION APPLY TYPE',

                                }}
                                Icon={() => {
                                    return <Chevron style={styles.imagealign} size={1.5} color="gray" />;
                                }}
                                items={[
                                    { label: 'FixedQuantity', value: 'FixedQuantity' },
                                    { label: 'AnyQuantity', value: 'AnyQuantity' },
                                    { label: 'QuantitySlab', value: 'QuantitySlab' },
                                    { label: 'ValueSlab', value: 'ValueSlab' },
                                    { label: 'PoolQuantityRatio', value: 'PoolQuantityRatio' },
                                    { label: 'PoolValueRatio', value: 'PoolValueRatio' },
                                ]}
                                onValueChange={this.handlePromoApplyname}
                                style={Device.isTablet ? pickerSelectStyles_tablet : pickerSelectStyles_mobile}
                                value={this.state.selectedPromoApplyName}
                                useNativeAndroidPickerStyle={false}

                            />
                        </View>


                        <TextInput style={Device.isTablet ? styles.input_tablet : styles.input_mobile}
                            underlineColorAndroid="transparent"
                            placeholder="DESCRIPTION"
                            placeholderTextColor="#6F6F6F"
                            textAlignVertical="center"
                            autoCapitalize="none"
                            value={this.state.description}
                            onChangeText={this.handleDescription}
                        />

                        <TextInput style={Device.isTablet ? styles.input_tablet : styles.input_mobile}
                            underlineColorAndroid="transparent"
                            placeholder="PRINT NAME ON SALE BILL"
                            placeholderTextColor="#6F6F6F"
                            textAlignVertical="center"
                            autoCapitalize="none"
                            value={this.state.printonbill}
                            onChangeText={this.handlePrintOnSallBill}
                        />



                        <View style={Device.isTablet ? styles.rnSelectContainer_tablet : styles.rnSelectContainer_mobile} >
                            <RNPickerSelect
                                placeholder={{
                                    label: 'APPLICABILITY',

                                }}
                                Icon={() => {
                                    return <Chevron style={styles.imagealign} size={1.5} color="gray" />;
                                }}
                                items={[
                                    { label: 'promotionForEachBarcode', value: 'promotionForEachBarcode' },
                                    { label: 'promotionForWholeBill', value: 'promotionForWholeBill' },
                                ]}
                                onValueChange={this.handleApplicability}
                                style={Device.isTablet ? pickerSelectStyles_tablet : pickerSelectStyles_mobile}
                                value={this.state.selectedApplicability}
                                useNativeAndroidPickerStyle={false}

                            />
                        </View>

                        <TouchableOpacity
                            style={{
                                width: 200, marginTop: 20,
                            }}

                            onPress={() => this.chargeExtra()}
                        >
                            <Text style={{
                                marginLeft: 40, marginTop: 11, color: "#6F6F6F", fontSize: Device.isTablet ? 20 : 15,
                                fontFamily: "regular", width: 200,
                            }}  > {'Charge Tax Entra'} </Text>

                            <Image style={{ position: 'absolute', top: 10, left: 20, }} source={
                                //require('../assets/images/chargeunselect.png')}
                                this.state.chargeExtra ? require('../assets/images/chargeselect.png') : require('../assets/images/chargeunselect.png')} />
                        </TouchableOpacity>

                        {this.state.chargeExtra && (
                            <View style={Device.isTablet ? styles.rnSelectContainer_tablet : styles.rnSelectContainer_mobile} >
                                <RNPickerSelect
                                    placeholder={{
                                        label: 'SELECT TAX %',

                                    }}
                                    Icon={() => {
                                        return <Chevron style={styles.imagealign} size={1.5} color="gray" />;
                                    }}
                                    items={this.state.uom}
                                    onValueChange={this.handleUOM}
                                    style={Device.isTablet ? pickerSelectStyles_tablet : pickerSelectStyles_mobile}
                                    value={this.state.productuom}
                                    useNativeAndroidPickerStyle={false}

                                />
                            </View>
                        )}

                        <Text style={[Device.isTablet ? styles.subheading_tablet : styles.subheading_mobile, { marginTop: 10 }]}>Buy Pool Defination</Text>
                        <TextInput style={Device.isTablet ? styles.input_tablet : styles.input_mobile}
                            underlineColorAndroid="transparent"
                            placeholder="BUY ANY"
                            keyboardType='name-phone-pad'
                            placeholderTextColor="#6F6F6F"
                            textAlignVertical="center"
                            autoCapitalize="none"
                            value={this.state.buyany}
                            onChangeText={this.handleValue}
                            ref={inputemail => { this.emailValueInput = inputemail; }}
                        />


                        <FlatList
                            data={this.state.selctedPoolnames}
                            style={{ marginTop: 40, }}
                            onEndReached={this.onEndReached.bind(this)}
                            ref={(ref) => { this.listRef = ref; }}
                            keyExtractor={item => item}
                            renderItem={({ item, index }) => (
                                // if (index === 0) {
                                //     <View style={{
                                //         height: 80,
                                //         backgroundColor: '#FFFFFF',
                                //         borderBottomWidth: 5,
                                //         borderBottomColor: '#FFFFFF',
                                //         flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
                                //     }}>
                                //         <View style={{ flexDirection: 'column', width: '100%', height: 80, borderTopWidth: 10, borderColor: '#F6F6F6' }}>
                                //             <Text style={{ fontSize: 12, marginLeft: 16, marginTop: 20, fontFamily: 'regular', color: '#808080' }}>
                                //                 COLUMN NAME
                                //             </Text>
                                //             <Text style={{
                                //                 fontSize: 12, marginTop: -30, marginLeft: deviceWidth / 2 - 40, fontFamily: 'regular', color: '#808080', justifyContent: 'center', //Centered horizontally
                                //                 alignItems: 'center', //Centered vertically
                                //                 flex: 1
                                //             }}>
                                //                 OPERATOR
                                //             </Text>
                                //             <Text style={{ fontSize: 12, position: 'absolute', right: 70, top: 23, fontFamily: 'regular', color: '#808080' }}>
                                //                 VALUES
                                //             </Text>
                                //         </View>
                                //     </View>
                                // }
                                // else {
                                <View style={{
                                    height: 80,
                                    backgroundColor: '#FFFFFF',
                                    borderBottomWidth: 5,
                                    borderBottomColor: '#FFFFFF',
                                    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
                                }}>

                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%', height: 80, borderTopWidth: 10, borderColor: '#F6F6F6', paddingTop: Device.isTablet ? 0 : 10 }}>

                                        <View>
                                            <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#808080' }}>
                                                POOL NAME
                                            </Text>
                                            <Text style={{ fontSize: Device.isTablet ? 19 : 14, fontFamily: 'medium', color: '#353C40' }}>
                                                {item.poolName}
                                            </Text>
                                        </View>

                                        <View>
                                            <Text style={{
                                                fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#808080', //Centered horizontally

                                            }}>
                                                Pool Ration
                                            </Text>
                                            <Text style={{
                                                fontSize: Device.isTablet ? 19 : 14, fontFamily: 'medium', color: '#353C40', //Centered horizontally

                                            }}>
                                                {'0'}
                                            </Text>
                                        </View>

                                        <View>
                                            <Text style={{
                                                fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#808080', //Centered horizontally

                                            }}>
                                                Benefit Type
                                            </Text>
                                            <Text style={{
                                                fontSize: Device.isTablet ? 19 : 14, fontFamily: 'medium', color: '#353C40', //Centered horizontally

                                            }}>
                                                {"-"}
                                            </Text>
                                        </View>
                                        <View>
                                            <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#808080' }}>
                                                Discount Type
                                            </Text>
                                            <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'medium', color: '#353C40', alignItems: 'center' }}>
                                                {'-'}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                // }
                            )}
                        />

                        <TouchableOpacity onPress={() => this.addPools()}>

                            <Text style={Device.isTablet ? styles.navigationbuttonstext_tablet : styles.navigationbuttonstext_mobile}>+ Add Pools</Text>

                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.addBenfits()}>
                            <Text style={Device.isTablet ? styles.navigationbuttonstext_tablet : styles.navigationbuttonstext_mobile}>+ Add Benifits</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={Device.isTablet ? styles.saveButton_tablet : styles.saveButton_mobile} onPress={() => this.savePromo()}
                        >
                            <Text style={Device.isTablet ? styles.saveButtonText_tablet : styles.saveButtonText_mobile}  > SAVE </Text>

                        </TouchableOpacity>

                        <TouchableOpacity
                            style={Device.isTablet ? styles.cancelButton_tablet : styles.cancelButton_mobile} onPress={() => this.cancel()}
                        >
                            <Text style={Device.isTablet ? styles.cancelButtonText_tablet : styles.cancelButtonText_mobile}  > CANCEL </Text>

                        </TouchableOpacity>

                    </View>
                </ScrollView>
                {this.state.flagAddPool && (
                    <View>
                        <Modal isVisible={this.state.modalVisible}
                            onBackButtonPress={() => this.modelCancel()}
                            onBackdropPress={() => this.modelCancel()} >
                            <View
                                style={[Device.isTablet ? styles.filterMainContainer_tablet : styles.filterMainContainer_mobile, { height: Device.isTablet ? 350 : 250 }]}
                            >

                                <Text style={Device.isTablet ? styles.filterByTitle_tablet : styles.filterByTitle_mobile}> {'Add Buy Pools'} </Text>



                                <TouchableOpacity style={Device.isTablet ? styles.filterCloseButton_tablet : styles.filterCloseButton_mobile} onPress={() => this.modelCancel()}>
                                    <Image style={Device.isTablet ? styles.filterCloseImage_tablet : styles.modalCancelImage_mobile} source={require('../assets/images/modelcancel.png')} />
                                </TouchableOpacity>

                                <ScrollView style={{ marginTop: 50 }}>
                                    <FlatList
                                        style={{ width: deviceWidth, marginTop: 0, }}
                                        ListHeaderComponent={this.renderHeader}
                                        data={this.state.createdByArray}
                                        keyExtractor={item => item}
                                        renderItem={({ item, index }) => (

                                            <TouchableOpacity onPress={() => this.selectPools(item, index)}>
                                                <View style={{
                                                    borderBottomColor: 'lightgray', borderBottomWidth: 0, marginLeft: this.state.selectedItem === index ? 0 : 0, marginRight: this.state.selectedItem === index ? 0 : 0
                                                }}>


                                                    <View style={{ flexDirection: 'column', width: '100%', height: 40 }}>
                                                        <Text style={{
                                                            fontSize: Device.isTablet ? 19 : 14, marginTop: 5, marginLeft: 50, fontFamily: 'regular', color: '#353C40'
                                                        }}>
                                                            {item.poolName}
                                                        </Text>
                                                        <Image source={this.state.selectedItem === index ? require('../assets/images/poolselect.png') : require('../assets/images/poolsunselect.png')} style={{ position: 'absolute', left: 20, top: 0 }} />
                                                    </View>

                                                </View>
                                            </TouchableOpacity>


                                        )}
                                    />

                                    <TouchableOpacity
                                        style={Device.isTablet ? styles.saveButton_tablet : styles.saveButton_mobile}
                                        onPress={() => this.addPoolName()}
                                    >
                                        <Text style={Device.isTablet ? styles.saveButtonText_tablet : styles.saveButtonText_mobile}  > {this.state.updateRool == true ? 'UPDATE' : 'ADD'} </Text>

                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={Device.isTablet ? styles.cancelButton_tablet : styles.cancelButton_mobile} onPress={() => this.modelCancel()}
                                    >
                                        <Text style={Device.isTablet ? styles.cancelButtonText_tablet : styles.cancelButtonText_mobile}  > CANCEL </Text>

                                    </TouchableOpacity>
                                </ScrollView>
                            </View>
                        </Modal>
                    </View>

                )}
            </View>

        );

    }
}
export default AddPromo;

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

const promoFlats = StyleSheet.create({
    // Styles For Mobile
    nameHeader_mobile: {
        fontSize: 12,
        marginLeft: 16, marginTop: 20,
        fontFamily: 'regular',
        color: '#808080'
    },
    nameBody_mobile: {
        fontSize: 14,
        marginLeft: 16,
        marginTop: 0,
        fontFamily: 'medium',
        color: '#353C40'
    },

    // Styles For Tablet
    nameHeader_tablet: {
        fontSize: 17,
        marginLeft: 16,
        marginTop: 20,
        fontFamily: 'regular',
        color: '#808080'
    },
    nameBody_tablet: {
        fontSize: Device.isTablet ? 19 : 14,
        marginLeft: 16,
        marginTop: 0,
        fontFamily: 'medium',
        color: '#353C40'
    },
});

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
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
        fontFamily: "regular",
    },
    navigationbuttonstext_mobile: {
        color: 'red',
        fontSize: 16,
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center',
        fontFamily: 'regular',
        textDecorationLine: 'underline',
        textDecorationColor: 'red',
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
        right: 0,
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
    navigationbuttonstext_tablet: {
        color: 'red',
        fontSize: 21,
        marginTop: 10,
        marginBottom: 15,
        textAlign: 'center',
        fontFamily: 'regular',
        textDecorationLine: 'underline',
        textDecorationColor: 'red',
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