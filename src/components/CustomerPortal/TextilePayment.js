import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerActions } from '@react-navigation/native';
import axios from 'axios';
import Constants from 'expo-constants';
import React, { Component } from 'react';
import { Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Device from 'react-native-device-detection';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal from "react-native-modal";
import RNPickerSelect from 'react-native-picker-select';
import RazorpayCheckout from 'react-native-razorpay';
import { Chevron } from 'react-native-shapes';
import Loader from '../../commonUtils/loader';
import LoginService from '../services/LoginService';
import NewSaleService from '../services/NewSaleService';
import PromotionsService from '../services/PromotionsService';
var deviceWidth = Dimensions.get('window').width;
var deviceWidth = Dimensions.get('window').width;
var deviceheight = Dimensions.get('window').height;
const data = [{ key: 1 }, { key: 2 }, { key: 3 }, { key: 4 }, { key: 5 }];

class TextilePayment extends Component {
    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state = {
            flagOne: true,
            flagTwo: false,
            flagThree: false,
            flagFour: false,
            flagFive: false,
            promocode: "",
            mobileNumber: "",
            loyaltyPoints: "",
            value: "",
            giftvoucher: "",
            totalAmount: "",
            totalDiscount: "",
            recievedAmount: "",
            verifiedCash: "",
            ccCardCash: 0,
            domainId: 1,
            storeId: 1,
            customerName: '',
            customerPhoneNumber: '',
            customerGSTNumber: '',
            customerAddress: '',
            customerGender: '',
            lineItemIdAdd: '',
            modalVisible: true,
            totalQty: 0,
            notfound: '',
            customerEmail: '',
            flagCustomerOpen: false,
            flagredeem: false,
            redeemedPints: "0",
            enterredeempoint: '',
            promoDiscount: "0",
            grossAmount: 0,
            totalPromoDisc: 0,
            CGST: 0,
            manualDisc: 0,
            taxAmount: 0,
            approvedBy: '',
            reasonDiscount: '',
            userId: "",
            dsNumberList: [],
            returnAmount: 0,
            retailBarCodeList: [],
            modelVisible: true,
            gvToCustomerModel: false,
            gvNumber: "",
            couponDiscount: 0,
            discountAmount: 0,
            loading: false
        };
    }

    async componentDidMount() {
        var domainStringId = "";
        var storeStringId = "";
        AsyncStorage.getItem("domainDataId").then((value) => {
            domainStringId = value;
            this.setState({ domainId: parseInt(domainStringId) });
            console.log("domain data id" + this.state.domainId);

        }).catch(() => {
            this.setState({ loading: false });
            console.log('There is error getting domainDataId');
            // alert('There is error getting domainDataId');
        });

        AsyncStorage.getItem("domainName").then((value) => {
            global.domainName = value;
        }).catch(() => {
            this.setState({ loading: false });
            console.log('There is error getting domainName');
            //alert('There is error getting domainName');
        });

        AsyncStorage.getItem("storeId").then((value) => {
            storeStringId = value;
            this.setState({ storeId: parseInt(storeStringId) });
            console.log(this.state.storeId);
        }).catch(() => {
            this.setState({ loading: false });
            console.log('There is error getting storeId');
            // alert('There is error getting storeId');
        });
        console.log('total amount is,', this.props.route.params.discountAmount);
        this.setState({
            totalAmount: this.props.route.params.totalAmount,
            grossAmount: this.props.route.params.grossAmount,
            totalPromoDisc: this.props.route.params.totalPromoDisc,
            manualDisc: this.props.route.params.manualDisc,
            taxAmount: this.props.route.params.taxAmount,
            approvedBy: this.props.route.params.approvedBy,
            reasonDiscount: this.props.route.params.reasonDiscount,
            totalDiscount: this.props.route.params.totalDiscount,
            userId: this.props.route.params.userId,
            retailBarCodeList: this.props.route.params.retailBarCodeList,
            dsNumberList: this.props.route.params.dsNumberList,
            customerName: this.props.route.params.customerName,
            customerPhoneNumber: this.props.route.params.customerPhoneNumber,
            customerGSTNumber: this.props.route.params.customerGSTNumber,
            customerAddress: String(this.props.route.params.customerAddress),
            customerGender: this.props.route.params.customerGender,
            lineItemIdAdd: this.props.route.params.lineItemIdAdd,
            totalQty: this.props.route.params.totalQty,
            CGST: this.props.route.params.CGST,
            discountAmount: this.props.route.params.discountAmount,
        });



    }


    addCustomer() {
        if (this.state.customerPhoneNumber.length != 10) {
            alert('Please Enter a valid 10 digit mobile number');
            return;
        }
        else if (this.state.customerName.length === 0) {
            alert('Please Enter customer name');
            return;
        }
        // else if (this.state.customerGender.length === 0) {
        //   alert('Please Enter customer gender');
        //   return
        // }
        // else if (this.state.customerAddress.length === 0) {
        //   alert('Please Enter customer address');
        //   return
        // }
        // else if (this.state.customerGSTNumber.length === 0) {
        //   alert('Please Enter customer GST Number');
        //   return
        // }
        // {
        //   "email":"manideep6067@gmail.com",
        //   "phoneNumber":"8466043603",
        //   "birthDate":"07-03-1995",
        //   "gender":"male",
        //   "name":"vinod",
        //   "username":"Mani_123451",
        //   "parentId":"1",
        //   "domianId":"0",
        //   "address":"Katrenikona",
        //   "isCustomer":true,
        //   "isSuperAdmin":false,
        //   "stores":[

        //   ],
        //   "role":{
        //   },
        //   "clientId":"",
        //   "isConfigUser":false,
        //   "clientDomain":[]
        //   }
        const params = {
            "email": this.state.customerEmail,
            "phoneNumber": this.state.customerPhoneNumber,
            "birthDate": "",
            "gender": this.state.customerGender,
            "name": this.state.customerName,
            "username": this.state.customerName,
            "parentId": "1",
            "domianId": this.state.domainId,
            "address": this.state.customerAddress,
            "isCustomer": true,
            "isSuperAdmin": false,
            "role": {
            },
            "stores": [],
            "clientId": "",
            "isConfigUser": false,
            "clientDomain": []
        };
        this.setState({ loading: true });
        axios.post(LoginService.createUser(), params).then((res) => {
            if (res.data && res.data["isSuccess"] === "true") {
                this.setState({
                    flagCustomerOpen: false,
                    modalVisible: false,
                    loading: false,
                    mobileNumber: "",
                    loyaltyPoints: "",
                    notfound: ""
                });
                //alert("create customer" + JSON.stringify(res.data["result"].body));
            }
            else {
                this.setState({
                    loading: false,
                    flagCustomerOpen: false,
                    modalVisible: false,
                    mobileNumber: "",
                    loyaltyPoints: "",
                    notfound: ""
                });
                // alert("create customer" + JSON.stringify(res.data["result"].body));
            }
        }
        ).catch(() => {
            this.setState({ loading: false });
            this.setState({
                loading: false,
                flagCustomerOpen: false,
                modalVisible: false,
                mobileNumber: "",
                loyaltyPoints: "",
                notfound: ""
            });
            alert("create customer adding not successfully");
        });
    }

    getUserDetails = () => {
        const params = {
            "phoneNo": this.state.customerPhoneNumber,
        };
        axios.post(LoginService.getUser(), params).then((res) => {
            if (res.data && res.data["isSuccess"] === "true") {
                this.setState({ customerName: res.data["result"][0].userName, customerGender: res.data["result"][0].gender });
                //this.setState({ customerEmail: res.data["result"][0].userName });
                // this.setState({ customerAddress: res.data["result"][0].gender });
                // alert("get customer" + JSON.stringify(res.data["result"]));
            }
            else {
                this.setState({ loading: false });
            }
        }
        ).catch(() => {
            this.setState({ loading: false });
            this.setState({ flagCustomerOpen: false, modalVisible: false });
            alert("There is an Error getting User Details");
        });
    };

    modelCancel() {
        this.setState({ flagCustomerOpen: false, modalVisible: false });
    }



    handleBackButtonClick() {
        this.props.navigation.goBack(null);
        return true;
    }

    statatics() {
        this.props.navigation.navigate('Statitics');
    }


    menuAction() {
        this.props.navigation.dispatch(DrawerActions.openDrawer());
    }

    cashAction() {
        this.setState({
            flagOne: true,
            flagTwo: false,
            flagThree: false,
            flagFour: false,
            flagFive: false
        });
    }

    cardAction() {
        this.setState({
            flagOne: false,
            flagTwo: true,
            flagThree: false,
            flagFour: false,
            flagFive: false
        });
    }
    handleredeemPoints = (text) => {
        this.setState({ enterredeempoint: text });
    };

    clearRedemption() {
        console.log('dasdsdasdafsf');
        this.setState({ redeemedPints: "" });
    }
    handleCustomerPhoneNumber = (text) => {
        this.setState({ customerPhoneNumber: text });
    };

    handleCustomerName = (text) => {
        this.setState({ customerName: text });
    };

    handleCustomerEmail = (text) => {
        this.setState({ customerEmail: text });
    };

    handleCustomerAddress = (text) => {
        this.setState({ customerAddress: text });
    };

    handleCustomerGSTNumber = (text) => {
        this.setState({ customerGSTNumber: text });
    };

    handlecustomerGender = (text) => {
        this.setState({ customerGender: text });
    };

    cancel() {
        console.log('clicked');
        this.setState({ flagCustomerOpen: false, flagqtyModelOpen: false, modalVisible: false });
        //this.setState({ modalVisible: true });
    }

    endEditing() {
        console.log("end edited");
        if (this.state.customerPhoneNumber.length > 0) {
            this.getUserDetails();
        }
    }

    qrAction() {
        this.setState({
            flagOne: true,
            flagTwo: false,
            flagThree: true,
            flagFour: false,
            flagFive: false
        });
    }

    upiAction() {
        this.setState({
            flagOne: false,
            flagTwo: false,
            flagThree: false,
            flagFour: true,
            flagFive: false
        });
    }

    khathaAction() {
        this.setState({
            gvToCustomerModel: true,
            modelVisible: true,
            flagOne: false,
            flagTwo: false,
            flagThree: false,
            flagFour: false,
            flagFive: true
        });
    }

    modelCancel() {
        this.setState({ modelVisible: false });
    }

    handlePromocode = (text) => {
        this.setState({ promocode: text });
    };

    handleMobileNumber = (text) => {
        this.setState({ mobileNumber: text });
    };

    handlerecievedAmount = (text) => {

        this.setState({ recievedAmount: text });

    };

    handleGVNumber = (text) => {
        this.setState({ gvNumber: text });
    };

    verifycash() {
        if (this.state.flagOne === true && this.state.flagThree === false) {
            if ((parseFloat(this.state.recievedAmount) < (parseFloat(this.state.totalAmount) - parseFloat(this.state.totalDiscount) - parseFloat(this.state.promoDiscount) - parseFloat(this.state.redeemedPints / 10)))) {
                alert('Please collect sufficient amount');
            }
            else {
                this.setState({ returnAmount: parseFloat(this.state.recievedAmount) - parseFloat(this.state.totalAmount) });
                this.setState({ verifiedCash: this.state.totalAmount });
            }
        }
        else if (this.state.flagThree === true)
            if ((parseFloat(this.state.recievedAmount) < (parseFloat(this.state.totalAmount) - parseFloat(this.state.totalDiscount) - parseFloat(this.state.promoDiscount) - parseFloat(this.state.redeemedPints / 10)))) {
                let ccReturn = (parseFloat(this.state.totalAmount) - parseFloat(this.state.totalDiscount) - parseFloat(this.state.promoDiscount) - parseFloat(this.state.redeemedPints / 10)) - parseFloat(this.state.recievedAmount);
                this.setState({ ccCardCash: ccReturn, verifiedCash: this.state.recievedAmount });
            }
    }

    async applyPromocode() {
        // alert('promo code applied')
        // this.setState({ giftvoucher: this.state.promocode });
        // this.setState({ promoDiscount: "100" });
        const clientId = await AsyncStorage.getItem("custom:clientId1");
        axios.get(NewSaleService.getCoupons() + '/' + clientId + '?gvNumber=' + this.state.promocode).then(res => {
            console.log(res);
            if (res.data.result !== "Record not found") {
                let grandAmount = this.state.totalAmount;
                if (grandAmount > res.data.result.value) {
                    grandAmount = grandAmount - res.data.result.value;
                }
                this.setState({ totalAmount: grandAmount, couponDiscount: res.data.result.value });
            } else {
                alert(res.data.result);
            }
        });


    }

    applyRedem() {
        this.setState({ redeemedPints: this.state.enterredeempoint });
        if (parseInt(this.state.loyaltyPoints) < parseInt(this.state.redeemedPints)) {
            alert('please enter greater than the available points');
        }
        else {
            this.setState({ flagredeem: false });
            this.setState({ modalVisible: false });
        }
    }


    tagCustomer() {
        this.setState({ customerEmail: "", customerPhoneNumber: "", customerName: "", customerGender: "", customerAddress: "", flagCustomerOpen: true, modalVisible: true });
    }

    clearTaggedCustomer() {
        this.setState({ mobileNumber: "", loyaltyPoints: "", notfound: "" });
    }

    clearPromocode() {
        this.setState({ promoDiscount: "0", giftvoucher: "", promocode: "" });
    }

    clearCashSammary() {
        this.setState({ verifiedCash: "", recievedAmount: "", returnAmount: 0 });
    }

    pay = () => {
        if (this.state.flagOne === true && this.state.flagThree === false && this.state.recievedAmount === "") {
            alert('Please collect sufficient amount and then only pay');
        }
        else if (this.state.flagOne === true && this.state.flagThree === false && parseFloat(this.state.recievedAmount) < (parseFloat(this.state.totalAmount) - parseFloat(this.state.totalDiscount) - parseFloat(this.state.promoDiscount) - parseFloat(this.state.redeemedPints / 10))) {
            alert('Please collect sufficient amount and then only pay');
        }
        else if (this.state.flagThree === true && this.state.verifiedCash === "") {
            alert('Please collect some cash amount for ccpay');
        }
        // else if (global.domainName === "Textile") {
        let obj;
        if (this.state.flagTwo === true) {
            obj = {
                "natureOfSale": "InStore",
                "domainId": 1,
                "storeId": this.state.storeId,
                "grossAmount": this.state.grossAmount,
                "totalPromoDisc": this.state.totalPromoDisc,
                "taxAmount": this.state.taxAmount,
                "totalManualDisc": parseInt(this.state.manualDisc),
                "discApprovedBy": this.state.approvedBy,
                "discType": this.state.reasonDiscount,
                "approvedBy": null,
                "netPayableAmount": (parseFloat(this.state.totalAmount) - parseFloat(this.state.totalDiscount) - parseFloat(this.state.promoDiscount) - parseFloat(this.state.redeemedPints / 10)),
                "offlineNumber": null,
                "userId": this.state.userId,
                "sgst": this.state.CGST,
                "cgst": this.state.CGST,
                "dlSlip": this.state.dsNumberList,
                "lineItemsReVo": null,
                "paymentAmountType": [
                    {
                        "paymentType": "Card",
                        "paymentAmount": this.state.ccCardCash
                    }
                ]
            };
        }
        else if (this.state.flagOne === true) {
            obj = {
                "natureOfSale": "InStore",
                "domainId": 1,
                "storeId": this.state.storeId,
                "grossAmount": this.state.grossAmount,
                "totalPromoDisc": this.state.totalPromoDisc,
                "taxAmount": this.state.taxAmount,
                "totalManualDisc": parseInt(this.state.manualDisc),
                "discApprovedBy": this.state.approvedBy,
                "discType": this.state.reasonDiscount,
                "approvedBy": null,
                "netPayableAmount": (parseFloat(this.state.totalAmount) - parseFloat(this.state.totalDiscount) - parseFloat(this.state.promoDiscount) - parseFloat(this.state.redeemedPints / 10)).toString(),
                "offlineNumber": null,
                "userId": this.state.userId,
                "sgst": this.state.CGST,
                "cgst": this.state.CGST,
                "dlSlip": this.state.dsNumberList,
                "lineItemsReVo": null,
                "recievedAmount": this.state.recievedAmount,
                "returnAmount": this.state.returnAmount,
                "paymentAmountType": [
                    {
                        "paymentType": "Cash",
                        "paymentAmount": parseFloat(this.state.verifiedCash)
                    }]
            }
        }
        else if (this.state.flagThree === true) {
            obj = {
                "natureOfSale": "InStore",
                "domainId": 1,
                "storeId": this.state.storeId,
                "grossAmount": this.state.grossAmount,
                "totalPromoDisc": this.state.totalPromoDisc,
                "taxAmount": this.state.taxAmount,
                "totalManualDisc": parseInt(this.state.manualDisc),
                "discApprovedBy": this.state.approvedBy,
                "discType": this.state.reasonDiscount,
                "approvedBy": null,
                "netPayableAmount": (parseFloat(this.state.totalAmount) - parseFloat(this.state.totalDiscount) - parseFloat(this.state.promoDiscount) - parseFloat(this.state.redeemedPints / 10)).toString(),
                "offlineNumber": null,
                "userId": this.state.userId,
                "sgst": this.state.CGST,
                "cgst": this.state.CGST,
                "dlSlip": this.state.dsNumberList,
                "lineItemsReVo": null,
                "paymentAmountType": [
                    {
                        "paymentType": "Cash",
                        "paymentAmount": parseFloat(this.state.verifiedCash)
                    },
                    {
                        "paymentType": "Card",
                        "paymentAmount": this.state.ccCardCash
                    }]
            };
        }
        console.log(" payment cash method data", obj);
        axios.post(NewSaleService.createOrder(), obj).then((res) => {
            console.log(res);
            if (res.data && res.data["isSuccess"] === "true") {
                // const cardAmount = this.state.flagTwo || this.state.flagThree ? JSON.stringify(Math.round(this.state.ccCardCash)) : JSON.stringify((parseFloat(this.state.totalAmount) - parseFloat(this.state.totalDiscount) - parseFloat(this.state.promoDiscount) - parseFloat(this.state.redeemedPints / 10)).toString());
                alert("Order created " + res.data["result"]);
                if (this.state.flagOne === true && this.state.flagThree === false) {
                    this.props.route.params.onGoBack();
                    this.props.navigation.goBack();
                }
                let obj;
                if (this.state.flagTwo === true) {
                    obj = {
                        "amount": (parseFloat(this.state.totalAmount) - parseFloat(this.state.totalDiscount) - parseFloat(this.state.promoDiscount) - parseFloat(this.state.redeemedPints / 10)),
                        "info": "order creations",
                        "newsaleId": res.data["result"],
                    };
                } else if (this.state.flagThree === true) {
                    obj = {
                        "amount": this.state.ccCardCash,
                        "info": "order creations",
                        "newsaleId": res.data["result"],
                    };

                }
                console.log('params aresdasd', obj);
                axios.post(NewSaleService.payment(), obj).then((res) => {
                    // this.setState({isPayment: false});
                    const data = JSON.parse(res.data["result"]);
                    //console.log()
                    var options = {
                        description: 'Transaction',
                        image: 'https://i.imgur.com/3g7nmJC.png',
                        currency: data.currency,
                        order_id: data.id,
                        key: 'rzp_test_z8jVsg0bBgLQer', // Your api key
                        amount: data.amount,
                        name: 'OTSI',
                        prefill: {
                            name: "Kadali",
                            email: "kadali@gmail.com",
                            contact: "9999999999",
                        },
                        theme: { color: '#F37254' }
                    };
                    console.log("options data", options);
                    RazorpayCheckout.open(options).then((data) => {
                        // handle success
                        this.setState({ tableData: [] });
                        alert(`Success: ${data.razorpay_payment_id}`);
                        this.props.route.params.onGoBack();
                        this.props.navigation.goBack();
                        //this.props.navigation.navigate('Orders', { total: this.state.totalAmount, payment: 'RazorPay' })
                    }).catch((error) => {
                        this.setState({ loading: false });
                        console.log(error);
                        // handle failure
                        alert(`Error: ${JSON.stringify(error.code)} || ${JSON.stringify(error.description)}`);
                    });
                });
                // this.setState({ loading: false });
            }
            else {
                // this.setState({ loading: false });
                alert("duplicate record already exists");
            }
        }
        );
        // }
        // else if (global.domainName === "Retail") {
        //     let lineItems = [];
        //     this.state.retailBarCodeList.forEach((barCode, index) => {
        //         const obj = {
        //             "barCode": barCode.barcodeId,
        //             "domainId": 2,
        //             "itemPrice": barCode.listPrice,
        //             "netValue": barCode.listPrice,
        //             "quantity": 1
        //         };
        //         lineItems.push(obj);
        //     });

        //     axios.post(NewSaleService.saveLineItems(), lineItems).then((res) => {
        //         if (res.data && res.data["isSuccess"] === "true") {
        //             let lineItemsList = [];
        //             let dataResult = JSON.parse(res.data.result);
        //             dataResult.forEach(element => {
        //                 const obj = {
        //                     "lineItemId": element
        //                 };
        //                 lineItemsList.push(obj);
        //             });

        //             this.setState({ lineItemsList: lineItemsList }, () => {
        //                 const params = {
        //                     "natureOfSale": "InStore",
        //                     "domainId": 2,
        //                     "storeId": this.state.storeId,
        //                     "grossAmount": this.state.grossAmount,
        //                     "totalPromoDisc": this.state.totalPromoDisc,
        //                     "taxAmount": this.state.taxAmount,
        //                     "totalManualDisc": parseInt(this.state.manualDisc),
        //                     "discApprovedBy": this.state.approvedBy,
        //                     "discType": this.state.reasonDiscount,
        //                     "approvedBy": null,
        //                     "netPayableAmount": (parseFloat(this.state.totalAmount ) - parseFloat(this.state.totalDiscount) - parseFloat(this.state.promoDiscount) - parseFloat(this.state.redeemedPints / 10)).toString(),
        //                     "offlineNumber": null,
        //                     "userId": this.state.userId,
        //                     "sgst": this.state.CGST,
        //                     "cgst": this.state.CGST,
        //                     "dlSlip": this.state.dsNumberList,
        //                     "lineItemsReVo": this.state.lineItemsList,
        //                     "paymentAmountType": [{
        //                         "paymentType": "Cash",
        //                         "paymentAmount": parseFloat(this.state.verifiedCash)
        //                     }]

        //                 };

        //                 console.log(params);

        //                 axios.post(NewSaleService.createOrder(), params).then((res) => {
        //                     if (res.data && res.data["isSuccess"] === "true") {
        //                         //  alert("Order created " + res.data["result"]);
        //                         this.setState({ loading: false });
        //                         this.props.route.params.onGoBack();
        //                         this.props.navigation.goBack();
        //                     }
        //                     else {
        //                         this.setState({ loading: false });
        //                         alert("duplicate record already exists");
        //                     }
        //                 }
        //                 );
        //                 console.log(params);
        //                 axios.post(NewSaleService.createOrder(), params).then((res) => {
        //                     if (res.data && res.data["isSuccess"] === "true") {
        //                         alert("Order created " + res.data["result"]);
        //                         const params = {
        //                             "amount": JSON.stringify((parseFloat(this.state.totalAmount) - parseFloat(this.state.totalDiscount) - parseFloat(this.state.promoDiscount) - parseFloat(this.state.redeemedPints / 10)).toString()),
        //                             "info": "order creations",
        //                             "newsaleId": res.data["result"],
        //                         };

        //                         axios.post(NewSaleService.payment(), params).then((res) => {
        //                             // this.setState({isPayment: false});
        //                             const data = JSON.parse(res.data["result"]);
        //                             //console.log()
        //                             var options = {
        //                                 description: 'Transaction',
        //                                 image: 'https://i.imgur.com/3g7nmJC.png',
        //                                 currency: data.currency,
        //                                 order_id: data.id,
        //                                 key: 'rzp_test_z8jVsg0bBgLQer', // Your api key
        //                                 amount: data.amount,
        //                                 name: 'OTSI',
        //                                 prefill: {
        //                                     name: "Kadali",
        //                                     email: "kadali@gmail.com",
        //                                     contact: "9999999999",
        //                                 },
        //                                 theme: { color: '#F37254' }
        //                             };
        //                             console.log(options);
        //                             RazorpayCheckout.open(options).then((data) => {
        //                                 // handle success
        //                                 this.setState({ tableData: [] });
        //                                 alert(`Success: ${data.razorpay_payment_id}`);
        //                                 this.props.route.params.onGoBack();
        //                                 this.props.navigation.goBack();
        //                                 //this.props.navigation.navigate('Orders', { total: this.state.totalAmount, payment: 'RazorPay' })
        //                             }).catch((error) => {
        //                                 this.setState({ loading: false });
        //                                 console.log(error);
        //                                 // handle failure
        //                                 alert(`Error: ${JSON.stringify(error.code)} | ${JSON.stringify(error.description)}`);
        //                             });
        //                         });
        //                         this.setState({ loading: false });
        //                     }
        //                     else {
        //                         this.setState({ loading: false });
        //                         alert("duplicate record already exists");
        //                     }
        //                 }
        //                 );
        //             });
        //         }
        //     });
        // }
    };


    redeemPoints() {
        this.setState({ flagredeem: true, modalVisible: true });
    }


    verifyCustomer() {
        this.setState({ loyaltyPoints: '' });
        if (this.state.mobileNumber.length !== 10) {
            alert('please Enter a customer valid mobile number');
        }
        else {
            const params = {
                "invoiceNumber": null,
                "mobileNumber": this.state.mobileNumber,
            };
            console.log(params);
            this.setState({ loading: true });
            axios.post(PromotionsService.searchLoyaltyPoints(),
                params).then((res) => {
                    if (res.data && res.data["isSuccess"] === "true") {
                        this.setState({ loading: false });
                        let len = res.data["result"].length;
                        console.log(res.data["result"]);
                        if (len > 0) {
                            for (let i = 0; i < len; i++) {
                                let number = res.data["result"][i];
                                this.setState({ loyaltyPoints: number.loyaltyPoints });

                                console.log(this.state.loyaltyPoints);
                            }
                        }
                    }
                }).catch(() => {
                    this.setState({ loading: false });
                    this.setState({ loading: false, notfound: "Not Found" });
                    alert('No Records Found');
                });
        }
    }

    applyGVNumber() {
        const gvObj = [this.state.gvNumber];
        const param = '?flag=' + false;
        axios.put(NewSaleService.saveCoupons() + param, gvObj).then(res => {
            if (res) {
                alert(res.data.message);
            }
            this.setState({ modelVisible: false, gvNumber: "" });
        });
    }

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
                    }}> Payment method </Text>
                </View>

                <ScrollView>
                    <View style={styles.container}>

                        <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'medium', color: '#828282', marginLeft: 10, marginTop: 15 }}> SELECT A MODE TO PAY ₹ {(parseFloat(this.state.totalAmount) - parseFloat(this.state.totalDiscount) - parseFloat(this.state.promoDiscount) - parseFloat(this.state.redeemedPints / 10)).toString()} </Text>
                        <FlatList
                            style={styles.flatListContainer}
                            horizontal
                            data={data}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item, index }) => {
                                if (item.key === 1) {
                                    return <View style={{
                                        height: Device.isTablet ? 80 : 50,
                                        width: Device.isTablet ? 80 : 50,
                                        backgroundColor: "#ffffff",
                                        borderRadius: 25,
                                        marginLeft: 10,
                                        marginTop: 10,

                                    }}>
                                        <TouchableOpacity style={{
                                            marginLeft: 0, marginTop: 0,
                                        }} onPress={() => this.cashAction()}>
                                            <Image source={this.state.flagOne && this.state.flagThree === false ? require('../assets/images/cashselect.png') : require('../assets/images/cashunselect.png')} style={{
                                                marginLeft: Device.isTablet ? 15 : 0, marginTop: Device.isTablet ? 10 : 0,
                                            }} />
                                        </TouchableOpacity>
                                        <Text style={{ fontSize: 15, alignItems: 'center', alignSelf: 'center', marginTop: 0, fontSize: Device.isTablet ? 19 : 14, color: this.state.flagOne && this.state.flagThree === false ? "#ED1C24" : "#22222240", fontFamily: 'regular' }}>
                                            CASH
                                        </Text>

                                    </View>;
                                }
                                if (item.key === 2) {
                                    return <View style={{
                                        height: Device.isTablet ? 80 : 50,
                                        width: Device.isTablet ? 80 : 50,
                                        backgroundColor: "#ffffff",
                                        borderRadius: 25,
                                        marginLeft: 20,
                                        marginTop: 10,

                                    }}>
                                        <TouchableOpacity style={{
                                            marginLeft: 0, marginTop: 0,
                                        }} onPress={() => this.cardAction()}>
                                            <Image source={this.state.flagTwo ? require('../assets/images/cardselect.png') : require('../assets/images/cashunselect.png')} style={{
                                                marginLeft: Device.isTablet ? 15 : 0, marginTop: Device.isTablet ? 10 : 0,
                                            }} />
                                        </TouchableOpacity>
                                        <Text style={{ fontSize: 15, alignItems: 'center', alignSelf: 'center', marginTop: 0, fontSize: Device.isTablet ? 19 : 14, color: this.state.flagTwo ? "#ED1C24" : "#22222240", fontFamily: 'regular' }}>
                                            CARD
                                        </Text>

                                    </View>;
                                }
                                if (item.key === 3) {
                                    return <View style={{
                                        height: Device.isTablet ? 80 : 50,
                                        width: Device.isTablet ? 80 : 50,
                                        backgroundColor: "#ffffff",
                                        borderRadius: 25,
                                        marginLeft: 20,
                                        marginTop: 10,

                                    }}>
                                        <TouchableOpacity style={{
                                            marginLeft: 0, marginTop: 0,
                                        }} onPress={() => this.qrAction()}>
                                            <Image source={this.state.flagThree ? require('../assets/images/qrselect.png') : require('../assets/images/qrunselect.png')} style={{
                                                marginLeft: Device.isTablet ? 15 : 0, marginTop: Device.isTablet ? 10 : 0,
                                            }} />
                                        </TouchableOpacity>
                                        <Text style={{ fontSize: 15, alignItems: 'center', alignSelf: 'center', marginTop: 0, width: Device.isTablet ? 70 : 50, fontSize: Device.isTablet ? 19 : 14, color: this.state.flagThree ? "#ED1C24" : "#22222240", fontFamily: 'regular' }}>
                                            CASH&CARD
                                        </Text>

                                    </View>;

                                }
                                if (item.key === 4) {
                                    return <View style={{
                                        height: Device.isTablet ? 80 : 50,
                                        width: Device.isTablet ? 80 : 50,
                                        backgroundColor: "#ffffff",
                                        borderRadius: 25,
                                        marginLeft: 20,
                                        marginTop: 10,

                                    }}>
                                        <TouchableOpacity style={{
                                            marginLeft: 0, marginTop: 0,
                                        }} onPress={() => this.upiAction()}>
                                            <Image source={this.state.flagFour ? require('../assets/images/upiselect.png') : require('../assets/images/upiunselect.png')} style={{
                                                marginLeft: Device.isTablet ? 15 : 0, marginTop: Device.isTablet ? 10 : 0,
                                            }} />
                                        </TouchableOpacity>
                                        <Text style={{ fontSize: 15, alignItems: 'center', alignSelf: 'center', marginTop: 0, fontSize: Device.isTablet ? 19 : 14, color: this.state.flagFour ? "#ED1C24" : "#22222240", fontFamily: 'regular' }}>
                                            KHATA
                                        </Text>

                                    </View>;
                                }
                                if (item.key === 5) {
                                    return <View style={{
                                        height: Device.isTablet ? 80 : 50,
                                        width: Device.isTablet ? 80 : 50,

                                        backgroundColor: "#ffffff",

                                        borderRadius: 25,
                                        marginLeft: 20,
                                        marginTop: 10,

                                    }}>
                                        <TouchableOpacity style={{
                                            marginLeft: 0, marginTop: 0,
                                        }} onPress={() => this.khathaAction()}>
                                            <Image source={this.state.flagFive ? require('../assets/images/kathaselect.png') : require('../assets/images/kathaunselect.png')} style={{
                                                marginLeft: Device.isTablet ? 15 : 0, marginTop: Device.isTablet ? 10 : 0,
                                            }} />
                                        </TouchableOpacity>
                                        <Text style={{ fontSize: 15, alignItems: 'center', alignSelf: 'center', marginTop: 0, fontSize: Device.isTablet ? 19 : 14, color: this.state.flagFive ? "#ED1C24" : "#22222240", fontFamily: 'regular' }}>
                                            GV
                                        </Text>

                                    </View>;
                                }
                            }}
                            ListFooterComponent={<View style={{ width: 15 }}></View>}
                        />



                        <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'medium', color: '#828282', marginLeft: 10, marginTop: 10 }}> {('HAVE A RT NUMBER?')} </Text>
                        {this.state.loyaltyPoints !== "" && (
                            <TouchableOpacity
                                style={{ borderRadius: 5, width: 90, height: 20, alignSelf: 'flex-end', marginTop: -20 }}
                                onPress={() => this.clearTaggedCustomer()} >
                                <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#ED1C24', marginLeft: 10, marginTop: 8, alignSelf: 'center' }}> {('CLEAR')} </Text>
                            </TouchableOpacity>
                        )}

                        {this.state.notfound === "not found" && (
                            <TouchableOpacity
                                style={{ borderRadius: 5, width: 90, height: 20, alignSelf: 'flex-end', marginTop: -20 }}
                                onPress={() => this.clearTaggedCustomer()} >
                                <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#ED1C24', marginLeft: 10, marginTop: 8, alignSelf: 'center' }}> {('CLEAR')} </Text>
                            </TouchableOpacity>
                        )}


                        {/* loyalty points */}
                        <TextInput style={styles.input}
                            underlineColorAndroid="transparent"
                            placeholder="ENTER RT NUMBER"
                            placeholderTextColor="#6F6F6F60"
                            textAlignVertical="center"
                            keyboardType={'default'}
                            autoCapitalize="none"
                            value={this.state.mobileNumber}
                            //  onEndEditing
                            onChangeText={(text) => this.handleMobileNumber(text)}
                        // onEndEditing={() => this.endEditing()}
                        />
                        {this.state.loyaltyPoints === "" && this.state.notfound !== "not found" && (
                            <TouchableOpacity
                                style={{ backgroundColor: '#FFffff', borderRadius: 5, width: Device.isTablet ? 100 : 90, height: Device.isTablet ? 42 : 32, borderColor: "#ED1C24", borderWidth: 1, alignSelf: 'flex-end', right: 10, marginTop: Device.isTablet ? -47 : -37 }}
                                onPress={() => this.verifyCustomer()} >
                                <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#ED1C24', marginLeft: 10, marginTop: 8, alignSelf: 'center' }}> {('VERIFY')} </Text>
                            </TouchableOpacity>
                        )}

                        {this.state.notfound === "not found" && this.state.loyaltyPoints == "" && (
                            <TouchableOpacity
                                style={{ backgroundColor: '#FFffff', borderRadius: 5, width: Device.isTablet ? 100 : 90, height: Device.isTablet ? 42 : 32, alignSelf: 'flex-end', right: 10, marginTop: Device.isTablet ? -47 : -37 }}
                            >
                                <Image style={{ position: 'absolute', right: Device.isTablet ? 83 : 68, top: Device.isTablet ? 11 : 9 }} source={require('../assets/images/notapplied.png')} />

                                <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#ED1C24', marginLeft: 10, marginTop: 10, alignSelf: 'center' }}> {('NO RECORDS')} </Text>
                            </TouchableOpacity>
                        )}
                        {this.state.notfound === "not found" && this.state.loyaltyPoints == "" && (
                            <View style={{ height: 50, backgroundColor: "#ffffff", }}>
                                <View style={{ height: Device.isTablet ? 2 : 1, backgroundColor: "" }}>
                                </View>
                                <TouchableOpacity
                                    style={{ backgroundColor: '#ED1C24', borderRadius: 5, width: 150, height: 32, alignSelf: 'center', marginTop: 5 }}
                                    onPress={() => this.tagCustomer()} >
                                    <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#ffffff', marginLeft: 10, marginTop: 8, alignSelf: 'center' }}> {('ADD TO TAG CUSTOMER')} </Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {this.state.loyaltyPoints !== "" && this.state.giftvoucher === "" && (
                            <TouchableOpacity
                                style={{ backgroundColor: '#FFffff', borderRadius: 5, width: Device.isTablet ? 100 : 90, height: Device.isTablet ? 42 : 32, alignSelf: 'flex-end', right: 10, marginTop: Device.isTablet ? -47 : -37 }}
                            >
                                <Image style={{ position: 'absolute', right: Device.isTablet ? 83 : 68, top: Device.isTablet ? 11 : 9 }} source={require('../assets/images/applied.png')} />

                                <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#28D266', marginLeft: 10, marginTop: 10, alignSelf: 'center' }}> {('VERIFIED')} </Text>

                            </TouchableOpacity>
                        )}

                        {/* {this.state.notfound === "not found" && this.state.giftvoucher !== "" && (
                            <TouchableOpacity
                                style={{ backgroundColor: '#FFffff', borderRadius: 5, width: Device.isTablet ? 100 : 90, height: Device.isTablet ? 42 : 32, position: 'absolute', right: 10,alignSelf: 'flex-end',marginTop:-37 }}
                            >
                                <Image style={{ position: 'absolute', right: Device.isTablet ? 83 : 68, top: Device.isTablet ? 11 : 9 }} source={require('../assets/images/notapplied.png')} />

                                <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#ED1C24', marginLeft: 10, marginTop: 10, alignSelf: 'center' }}> {('NO RECORDS')} </Text>

                            </TouchableOpacity>
                        )} */}

                        {this.state.loyaltyPoints !== "" && this.state.giftvoucher !== "" && (
                            <TouchableOpacity
                                style={{ backgroundColor: '#FFffff', borderRadius: 5, width: Device.isTablet ? 100 : 90, height: Device.isTablet ? 42 : 32, position: 'absolute', right: 10, alignSelf: 'flex-end', marginTop: Device.isTablet ? -47 : -37 }}
                            >
                                <Image style={{ position: 'absolute', right: Device.isTablet ? 83 : 68, top: Device.isTablet ? 11 : 9 }} source={require('../assets/images/applied.png')} />

                                <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#28D266', marginLeft: 10, marginTop: 10, alignSelf: 'center' }}> {('VERIFIED')} </Text>

                            </TouchableOpacity>
                        )}

                        {this.state.loyaltyPoints !== "" && this.state.redeemedPints === "0" && (
                            <View style={{ backgroundColor: '#ffffff', marginTop: 0 }}>
                                <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'medium', color: '#ED1C24', marginLeft: 10, marginTop: 10 }}> LOYALTY POINTS  {this.state.loyaltyPoints} </Text>
                                <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'medium', color: '#ED1C24', marginLeft: 10, marginTop: 10, marginBottom: 10 }}> VALUE  {(parseInt(this.state.loyaltyPoints) / 10).toString()} </Text>
                            </View>
                        )}

                        {this.state.redeemedPints !== "0" && (
                            <View style={{ backgroundColor: '#ffffff', marginTop: 0 }}>
                                <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'medium', color: '#ED1C24', marginLeft: 10, marginTop: 10 }}> REDEEMED POINTS   {this.state.redeemedPints} </Text>
                                <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'medium', color: '#ED1C24', marginLeft: 10, marginTop: 10, marginBottom: 10 }}> REMAINING POINTS  {(parseInt(this.state.loyaltyPoints - this.state.redeemedPints)).toString()} </Text>
                            </View>
                        )}

                        {this.state.loyaltyPoints !== "" && this.state.redeemedPints !== "0" && (
                            <View style={{ backgroundColor: '#ffffff', marginTop: 0 }}>
                                <TouchableOpacity
                                    style={{ borderRadius: 5, width: 90, height: 20, alignSelf: 'flex-end', marginTop: -40 }}
                                    onPress={() => this.clearRedemption()} >
                                    <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#ED1C24', marginLeft: 10, marginTop: 8, alignSelf: 'center' }}> {('CLEAR')} </Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {this.state.loyaltyPoints !== "" && this.state.redeemedPints === "0" && (
                            <View style={{ height: 0, backgroundColor: "#ffffff", }}>
                                {/* <View style={{ height: Device.isTablet ? 2 : 1, backgroundColor: "#22222240",marginTop:-20, }}> */}

                                <TouchableOpacity
                                    style={{ backgroundColor: '#ED1C24', borderRadius: 5, width: 150, height: 32, alignSelf: 'flex-end', marginTop: -45, right: 10 }}
                                    onPress={() => this.redeemPoints()} >
                                    <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#ffffff', marginLeft: 10, marginTop: 8, alignSelf: 'center' }}> {('REDEEM POINTS')} </Text>
                                </TouchableOpacity>
                                {/* </View> */}
                            </View>
                        )}



                        <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'medium', color: '#828282', marginLeft: 10, marginTop: 10 }}> {('HAVE A COUPON CODE ?')} </Text>
                        {this.state.giftvoucher !== "" && (
                            <TouchableOpacity
                                style={{ borderRadius: 5, width: 90, height: 20, alignSelf: 'flex-end', marginTop: -20 }}
                                onPress={() => this.clearPromocode()} >
                                <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#ED1C24', marginLeft: 10, marginTop: 8, alignSelf: 'center' }}> {('CLEAR')} </Text>
                            </TouchableOpacity>
                        )}
                        {/* {this.state.loyaltyPoints !== "" && (
                              <TouchableOpacity
                              onPress={() => this.applyPromocode()} >
                              <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#ED1C24', marginLeft: 10, marginTop: 8, alignSelf: 'center' }}> {('CLEAR')} </Text>
                          </TouchableOpacity>
                    )} */}

                        <TextInput style={styles.input}
                            underlineColorAndroid="transparent"
                            placeholder="Enter coupon code"
                            placeholderTextColor="#6F6F6F60"
                            textAlignVertical="center"
                            keyboardType={'default'}
                            autoCapitalize="none"
                            value={this.state.promocode}
                            //  onEndEditing
                            onChangeText={(text) => this.handlePromocode(text)}
                        // onEndEditing={() => this.endEditing()}
                        />
                        {this.state.giftvoucher === "" && (
                            <TouchableOpacity
                                style={{ backgroundColor: '#FFffff', borderRadius: 5, width: Device.isTablet ? 100 : 90, height: Device.isTablet ? 42 : 32, borderColor: "#ED1C24", borderWidth: 1, right: 10, alignSelf: 'flex-end', marginTop: Device.isTablet ? -47 : -37 }}
                                onPress={() => this.applyPromocode()} >
                                <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#ED1C24', marginLeft: 10, marginTop: 8, alignSelf: 'center' }}> {('APPLY')} </Text>
                            </TouchableOpacity>
                        )}

                        {this.state.giftvoucher !== "" && (
                            <TouchableOpacity
                                style={{ backgroundColor: '#FFffff', borderRadius: 5, width: Device.isTablet ? 100 : 90, height: Device.isTablet ? 42 : 32, right: 10, alignSelf: 'flex-end', marginTop: Device.isTablet ? -47 : -37 }}
                            >
                                <Image style={{ position: 'absolute', right: Device.isTablet ? 83 : 68, top: Device.isTablet ? 11 : 9 }} source={require('../assets/images/applied.png')} />

                                <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#28D266', marginLeft: 10, marginTop: 10, alignSelf: 'center' }}> {('VERIFIED')} </Text>

                            </TouchableOpacity>
                        )}

                        {this.state.giftvoucher !== "" && (
                            <View style={{ backgroundColor: '#ffffff', marginTop: 0 }}>
                                <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'medium', color: '#ED1C24', marginLeft: 10, marginTop: 10 }}> YOU GOT 100 RUPPES CASHBACK </Text>

                            </View>
                        )}

                        {this.state.flagOne === true && (
                            <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'medium', color: '#828282', marginLeft: 10, marginTop: 10 }}> {('CASH SUMMARY')} </Text>

                        )}
                        {this.state.flagOne === true && this.state.verifiedCash !== "" && (
                            <TouchableOpacity
                                style={{ borderRadius: 5, width: 90, height: 20, alignSelf: 'flex-end', marginTop: -20 }}
                                onPress={() => this.clearCashSammary()} >
                                <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#ED1C24', marginLeft: 10, marginTop: 8, alignSelf: 'center' }}> {('CLEAR')} </Text>
                            </TouchableOpacity>
                        )}

                        {this.state.flagOne === true && (
                            <TextInput style={styles.input}
                                underlineColorAndroid="transparent"
                                placeholder="Recieved Amount"
                                placeholderTextColor="#6F6F6F60"
                                textAlignVertical="center"
                                keyboardType={'default'}
                                autoCapitalize="none"
                                value={this.state.recievedAmount}
                                //  onEndEditing
                                onChangeText={(text) => this.handlerecievedAmount(text)} />
                            // onEndEditing={() => this.endEditing()}
                        )}


                        {this.state.flagOne === true && this.state.giftvoucher === "" && this.state.loyaltyPoints === "" && this.state.verifiedCash === "" && (
                            <TouchableOpacity
                                style={{ backgroundColor: '#FFffff', borderRadius: 5, width: Device.isTablet ? 100 : 90, height: Device.isTablet ? 42 : 32, borderColor: "#ED1C24", borderWidth: 1, right: 10, alignSelf: 'flex-end', marginTop: Device.isTablet ? -47 : -37 }}
                                onPress={() => this.verifycash()} >
                                <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#ED1C24', marginLeft: 10, marginTop: 8, alignSelf: 'center' }}> {('VERIFY')} </Text>
                            </TouchableOpacity>
                        )}

                        {this.state.flagOne === true && this.state.giftvoucher !== "" && this.state.loyaltyPoints !== "" && this.state.verifiedCash === "" && (
                            <TouchableOpacity
                                style={{ backgroundColor: '#FFffff', borderRadius: 5, width: Device.isTablet ? 100 : 90, height: Device.isTablet ? 42 : 32, borderColor: "#ED1C24", borderWidth: 1, right: 10, alignSelf: 'flex-end', marginTop: Device.isTablet ? -47 : -37 }}
                                onPress={() => this.verifycash()} >
                                <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#ED1C24', marginLeft: 10, marginTop: 8, alignSelf: 'center' }}> {('VERIFY')} </Text>
                            </TouchableOpacity>
                        )}

                        {this.state.flagOne === true && this.state.giftvoucher !== "" && this.state.loyaltyPoints === "" && this.state.verifiedCash === "" && (
                            <TouchableOpacity
                                style={{ backgroundColor: '#FFffff', borderRadius: 5, width: Device.isTablet ? 100 : 90, height: Device.isTablet ? 42 : 32, borderColor: "#ED1C24", borderWidth: 1, right: 10, alignSelf: 'flex-end', marginTop: Device.isTablet ? -47 : -37 }}
                                onPress={() => this.verifycash()} >
                                <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#ED1C24', marginLeft: 10, marginTop: 8, alignSelf: 'center' }}> {('VERIFY')} </Text>
                            </TouchableOpacity>
                        )}

                        {this.state.flagOne === true && this.state.giftvoucher === "" && this.state.loyaltyPoints !== "" && this.state.verifiedCash === "" && (
                            <TouchableOpacity
                                style={{ backgroundColor: '#FFffff', borderRadius: 5, width: Device.isTablet ? 100 : 90, height: Device.isTablet ? 42 : 32, borderColor: "#ED1C24", borderWidth: 1, right: 10, alignSelf: 'flex-end', marginTop: Device.isTablet ? -47 : -37 }}
                                onPress={() => this.verifycash()} >
                                <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#ED1C24', marginLeft: 10, marginTop: 8, alignSelf: 'center' }}> {('VERIFY')} </Text>
                            </TouchableOpacity>
                        )}


                        {this.state.flagOne === true && this.state.giftvoucher === "" && this.state.loyaltyPoints === "" && this.state.verifiedCash !== "" && (
                            <TouchableOpacity
                                style={{ backgroundColor: '#FFffff', borderRadius: 5, width: Device.isTablet ? 100 : 90, height: Device.isTablet ? 42 : 32, right: 10, alignSelf: 'flex-end', marginTop: Device.isTablet ? -47 : -37 }}
                            >
                                <Image style={{ position: 'absolute', right: Device.isTablet ? 83 : 68, top: Device.isTablet ? 11 : 9 }} source={require('../assets/images/applied.png')} />

                                <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#28D266', marginLeft: 10, marginTop: 10, alignSelf: 'center' }}> {('VERIFIED')} </Text>

                            </TouchableOpacity>
                        )}

                        {this.state.flagOne === true && this.state.giftvoucher !== "" && this.state.loyaltyPoints !== "" && this.state.verifiedCash !== "" && (
                            <TouchableOpacity
                                style={{ backgroundColor: '#FFffff', borderRadius: 5, width: Device.isTablet ? 100 : 90, height: Device.isTablet ? 42 : 32, right: 10, alignSelf: 'flex-end', marginTop: Device.isTablet ? -47 : -37 }}
                            >
                                <Image style={{ position: 'absolute', right: Device.isTablet ? 83 : 68, top: Device.isTablet ? 11 : 9 }} source={require('../assets/images/applied.png')} />

                                <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#28D266', marginLeft: 10, marginTop: 10, alignSelf: 'center' }}> {('VERIFIED')} </Text>

                            </TouchableOpacity>
                        )}

                        {this.state.flagOne === true && this.state.giftvoucher !== "" && this.state.loyaltyPoints === "" && this.state.verifiedCash !== "" && (
                            <TouchableOpacity
                                style={{ backgroundColor: '#FFffff', borderRadius: 5, width: Device.isTablet ? 100 : 90, height: Device.isTablet ? 42 : 32, right: 10, alignSelf: 'flex-end', marginTop: Device.isTablet ? -47 : -37 }}
                            >
                                <Image style={{ position: 'absolute', right: Device.isTablet ? 83 : 68, top: Device.isTablet ? 11 : 9 }} source={require('../assets/images/applied.png')} />

                                <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#28D266', marginLeft: 10, marginTop: 10, alignSelf: 'center' }}> {('VERIFIED')} </Text>

                            </TouchableOpacity>
                        )}

                        {this.state.flagOne === true && this.state.giftvoucher === "" && this.state.loyaltyPoints !== "" && this.state.verifiedCash !== "" && (
                            <TouchableOpacity
                                style={{ backgroundColor: '#FFffff', borderRadius: 5, width: Device.isTablet ? 100 : 90, height: Device.isTablet ? 42 : 32, right: 10, alignSelf: 'flex-end', marginTop: Device.isTablet ? -47 : -37 }}
                            >
                                <Image style={{ position: 'absolute', right: Device.isTablet ? 83 : 68, top: Device.isTablet ? 11 : 9 }} source={require('../assets/images/applied.png')} />

                                <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#28D266', marginLeft: 10, marginTop: 10, alignSelf: 'center' }}> {('VERIFIED')} </Text>

                            </TouchableOpacity>
                        )}



                        {this.state.flagOne === true && this.state.verifiedCash !== "" && (
                            <View style={{ backgroundColor: '#ffffff', marginTop: 0 }}>
                                <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'medium', color: '#ED1C24', marginLeft: 10, marginTop: 10 }}> RETURN AMOUNT  ₹{this.state.returnAmount} </Text>

                            </View>
                        )}

                        {this.state.flagredeem && (
                            <View>
                                <Modal isVisible={this.state.modalVisible}>

                                    <View style={{
                                        width: deviceWidth,
                                        alignItems: 'center',
                                        marginLeft: -20,
                                        backgroundColor: "#ffffff",
                                        height: 300,
                                        position: 'absolute',
                                        bottom: -20,
                                    }}>

                                        <Text style={{
                                            position: 'absolute',
                                            left: 20,
                                            top: 15,
                                            width: 300,
                                            height: 20,
                                            fontFamily: 'medium',
                                            fontSize: 16,
                                            color: '#353C40'
                                        }}> Redeem your points </Text>

                                        <TouchableOpacity style={{
                                            position: 'absolute',
                                            right: 20,
                                            top: 7,
                                            width: 50, height: 50,
                                        }} onPress={() => this.modelCancel()}>
                                            <Image style={{ color: '#ED1C24', fontFamily: 'regular', fontSize: Device.isTablet ? 17 : 12, position: 'absolute', top: 10, right: 0, }} source={require('../assets/images/modelcancel.png')} />
                                        </TouchableOpacity>

                                        <Text style={{ height: Device.isTablet ? 2 : 1, width: deviceWidth, backgroundColor: 'lightgray', marginTop: 50, }}>
                                        </Text>
                                        <Text style={{
                                            position: 'absolute',
                                            left: 20,
                                            top: 60,
                                            width: 300,
                                            height: 20,
                                            fontFamily: 'regular',
                                            fontSize: Device.isTablet ? 19 : 14,
                                            color: '#353C40'
                                        }}> Please enter how many points you want to redeem? </Text>

                                        <View style={{ marginTop: 30, width: deviceWidth, }}>
                                            <TextInput style={styles.modelinput}
                                                underlineColorAndroid="transparent"
                                                placeholder="ENTER POINTS"
                                                placeholderTextColor="#6F6F6F"
                                                textAlignVertical="center"
                                                autoCapitalize="none"
                                                value={this.state.enterredeempoint}
                                                onChangeText={this.handleredeemPoints}
                                            />
                                        </View>

                                        <TouchableOpacity
                                            style={{
                                                width: deviceWidth - 40,
                                                marginLeft: 20,
                                                marginRight: 20,
                                                marginTop: 20,
                                                height: 50, backgroundColor: "#ED1C24", borderRadius: 5,
                                            }} onPress={() => this.applyRedem()}
                                        >
                                            <Text style={{
                                                textAlign: 'center', marginTop: 20, color: "#ffffff", fontSize: 15,
                                                fontFamily: "regular"
                                            }}  > APPLY </Text>

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
                                    </View>
                                </Modal>
                            </View>)}

                        {this.state.flagCustomerOpen && (
                            <View>
                                <Modal isVisible={this.state.modalVisible}>
                                    <KeyboardAwareScrollView KeyboardAwareScrollView
                                        enableOnAndroid={true}>


                                        <View style={{
                                            flex: 1, justifyContent: 'center', //Centered horizontally
                                            alignItems: 'center', color: '#ffffff',
                                            borderRadius: 20, borderwidth: 10
                                        }}>
                                            <View style={{ flex: 1, marginLeft: 20, marginRight: 20, backgroundColor: "#ffffff", marginTop: deviceWidth / 2 - 80 }}>
                                                <Text style={{
                                                    color: "#353C40", fontSize: 18, fontFamily: "semibold", marginLeft: 20, marginTop: 20, height: 20,
                                                    justifyContent: 'center',
                                                }}> {'Personal Information'} </Text>

                                                <View style={{ marginTop: 0, width: deviceWidth }}>
                                                    <TextInput style={styles.createUserinput}
                                                        underlineColorAndroid="transparent"
                                                        placeholder="MOBILE NUMBER *"
                                                        placeholderTextColor="#353C4050"
                                                        keyboardType="name-phone-pad"
                                                        textAlignVertical="center"
                                                        autoCapitalize="none"
                                                        value={this.state.customerPhoneNumber}
                                                        onChangeText={(text) => this.handleCustomerPhoneNumber(text)}
                                                        onEndEditing={() => this.endEditing()}
                                                    />
                                                </View>


                                                <TextInput style={styles.createUserinput}
                                                    underlineColorAndroid="transparent"
                                                    placeholder="CUSTOMER NAME *"
                                                    placeholderTextColor="#353C4050"
                                                    textAlignVertical="center"
                                                    autoCapitalize="none"
                                                    value={this.state.customerName}
                                                    onChangeText={this.handleCustomerName}
                                                />

                                                <View>
                                                    <TextInput style={styles.createUserinput}
                                                        underlineColorAndroid="transparent"
                                                        placeholder="EMAIL"
                                                        placeholderTextColor="#353C4050"
                                                        textAlignVertical="center"
                                                        autoCapitalize="none"
                                                        value={this.state.customerEmail}
                                                        onChangeText={this.handleCustomerEmail}
                                                    />
                                                </View>

                                                <View style={{
                                                    justifyContent: 'center',
                                                    margin: 40,
                                                    height: 44,
                                                    marginTop: 5,
                                                    marginBottom: 10,
                                                    borderColor: '#8F9EB717',
                                                    borderRadius: 3,
                                                    backgroundColor: '#FBFBFB',
                                                    borderWidth: 1,
                                                    fontFamily: 'regular',
                                                    paddingLeft: 15,
                                                    fontSize: Device.isTablet ? 19 : 14,
                                                }} >
                                                    <RNPickerSelect
                                                        placeholder={{
                                                            label: 'GENDER',
                                                            value: '',
                                                        }}
                                                        Icon={() => {
                                                            return <Chevron style={styles.imagealign} size={1.5} color="gray" />;
                                                        }}
                                                        items={[
                                                            { label: 'Male', value: 'male' },
                                                            { label: 'Female', value: 'female' },
                                                        ]}
                                                        onValueChange={this.handlecustomerGender}
                                                        style={[pickerSelectStyles, {
                                                            color: '#8F9EB717',
                                                            fontWeight: 'regular',
                                                            fontSize: Device.isTablet ? 20 : 15
                                                        }]}
                                                        value={this.state.customerGender}
                                                        useNativeAndroidPickerStyle={false}

                                                    />
                                                </View>


                                                <TextInput style={styles.createUserinput}
                                                    underlineColorAndroid="transparent"
                                                    placeholder="ADDRESS"
                                                    placeholderTextColor="#353C4050"
                                                    textAlignVertical="center"
                                                    autoCapitalize="none"
                                                    value={this.state.customerAddress}
                                                    onChangeText={this.handleCustomerAddress}
                                                />

                                                <Text style={{
                                                    color: "#353C40", fontSize: 18, fontFamily: "semibold", marginLeft: 20, marginTop: 20, height: 20,
                                                    justifyContent: 'center',
                                                }}> {'Business Information(optional)'} </Text>

                                                <View>
                                                    <TextInput style={styles.createUserinput}
                                                        underlineColorAndroid="transparent"
                                                        placeholder="GST NUMBER"
                                                        placeholderTextColor="#353C4050"
                                                        textAlignVertical="center"
                                                        autoCapitalize="none"
                                                        value={this.state.customerGSTNumber}
                                                        onChangeText={this.handleCustomerGSTNumber}
                                                    />
                                                </View>



                                                <TouchableOpacity
                                                    style={{
                                                        margin: 20,
                                                        height: 50, backgroundColor: "#ED1C24", borderRadius: 5, marginLeft: 40, marginRight: 40,
                                                    }} onPress={() => this.addCustomer()}
                                                >
                                                    <Text style={{
                                                        textAlign: 'center', margin: 20, color: "#ffffff", fontSize: 15,
                                                        fontFamily: "regular", height: 50,
                                                    }}  > TAG/ADD CUSTOMER </Text>

                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    style={{
                                                        margin: 20,
                                                        height: 50, backgroundColor: "#ED1C24", borderRadius: 5, marginLeft: 40, marginRight: 40,
                                                    }}
                                                    onPress={() => this.cancel()} >
                                                    <Text style={{
                                                        textAlign: 'center', margin: 20, color: "#ffffff", fontSize: 15,
                                                        fontFamily: "regular", height: 50,
                                                    }}> {('Cancel')} </Text>
                                                </TouchableOpacity>

                                            </View>

                                        </View>

                                    </KeyboardAwareScrollView>
                                </Modal>
                            </View>)}

                        {this.state.gvToCustomerModel && (
                            <View>
                                <Modal isVisible={this.state.modelVisible}>
                                    <View style={styles.filterMainContainer}>
                                        <KeyboardAwareScrollView enableOnAndroid={true} >
                                            <Text style={Device.isTablet ? styles.filterByTitle_tablet : styles.filterByTitle_mobile} > Issue GV Number </Text>
                                            <TouchableOpacity style={Device.isTablet ? styles.filterCloseButton_tablet : styles.filterCloseButton_mobile} onPress={() => this.modelCancel()}>
                                                <Image style={styles.modelCloseImage} source={require('../assets/images/modelcancel.png')} />
                                            </TouchableOpacity>
                                            <Text style={Device.isTablet ? styles.filterByTitleDecoration_tablet : styles.filterByTitleDecoration_mobile}>
                                            </Text>
                                            <Text style={{ alignItems: 'center', fontSize: Device.isTablet ? 20 : 15, marginLeft: 40 }}>GV Number:</Text>
                                            <TextInput
                                                style={Device.isTablet ? styles.input_tablet : styles.input_mobile}
                                                underlineColorAndroid="transparent"
                                                placeholder="GV Number"
                                                placeholderTextColor="#6F6F6F"
                                                textAlignVertical="center"
                                                autoCapitalize="none"
                                                value={this.state.gvNumber}
                                                onChangeText={this.handleGVNumber}
                                            />
                                            <TouchableOpacity style={Device.isTablet ? styles.filterApplyButton_tablet : styles.filterApplyButton_mobile}
                                                onPress={() => this.applyGVNumber()}>
                                                <Text style={Device.isTablet ? styles.filterButtonText_tablet : styles.filterButtonText_mobile} >APPLY</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={Device.isTablet ? styles.filterCancelButton_tablet : styles.filterCancelButton_mobile}
                                                onPress={() => this.modelCancel()}>
                                                <Text style={Device.isTablet ? styles.filterButtonCancelText_tablet : styles.filterButtonCancelText_mobile}>CANCEL</Text>
                                            </TouchableOpacity>
                                        </KeyboardAwareScrollView>
                                    </View>
                                </Modal>
                            </View>
                        )}


                        <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'medium', color: '#828282', marginLeft: 10, marginTop: 10 }}> {('PRICE SUMMARY')} </Text>


                        <View style={{ width: deviceWidth, height: Device.isTablet ? 350 : 300, backgroundColor: '#FFFFFF', marginTop: 10, flexDirection: 'column', justifyContent: 'space-around' }}>
                            <View style={{ flexDirection: "row", justifyContent: 'space-between', marginLeft: Device.isTablet ? 20 : 10, marginRight: Device.isTablet ? 20 : 10 }}>
                                <Text style={{
                                    color: "#353C40", fontFamily: "medium", alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                                    fontSize: Device.isTablet ? 19 : 14,
                                }}>
                                    Total Amount </Text>
                                <Text style={{
                                    color: "#353C40", fontFamily: "medium", alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                                    fontSize: Device.isTablet ? 19 : 14,
                                }}>
                                    ₹ {parseInt(this.state.totalAmount) + parseInt(this.state.discountAmount) - parseInt(this.state.CGST) - parseInt(this.state.CGST)} </Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: 'space-between', marginLeft: Device.isTablet ? 20 : 10, marginRight: Device.isTablet ? 20 : 10 }}>
                                <Text style={{
                                    color: "#353C40", fontFamily: "medium", alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                                    fontSize: Device.isTablet ? 19 : 14,
                                }}>
                                    CGST </Text>
                                <Text style={{
                                    color: "#353C40", fontFamily: "medium", alignItems: 'center', justifyContent: 'center', textAlign: 'center',

                                    fontSize: Device.isTablet ? 19 : 14,
                                }}>
                                    ₹ {this.state.CGST} </Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: 'space-between', marginLeft: Device.isTablet ? 20 : 10, marginRight: Device.isTablet ? 20 : 10 }}>
                                <Text style={{
                                    color: "#353C40", fontFamily: "medium", alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                                    fontSize: Device.isTablet ? 19 : 14,
                                }}>
                                    SGST </Text>
                                <Text style={{
                                    color: "#353C40", fontFamily: "medium", alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                                    fontSize: Device.isTablet ? 19 : 14,
                                }}>
                                    ₹  {this.state.CGST} </Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: 'space-between', marginLeft: Device.isTablet ? 20 : 10, marginRight: Device.isTablet ? 20 : 10 }}>
                                <Text style={{
                                    color: "#353C40", fontFamily: "medium", alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                                    fontSize: Device.isTablet ? 19 : 14,
                                }}>
                                    Bill Level Discount </Text>
                                <Text style={{
                                    color: "#353C40", fontFamily: "medium", alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                                    fontSize: Device.isTablet ? 19 : 14,
                                }}>
                                    ₹  {this.props.route.params.discountAmount} </Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: 'space-between', marginLeft: Device.isTablet ? 20 : 10, marginRight: Device.isTablet ? 20 : 10 }}>
                                <Text style={{
                                    color: "#353C40", fontFamily: "medium", alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                                    fontSize: Device.isTablet ? 19 : 14,
                                }}>
                                    coupon Discount </Text>
                                <Text style={{
                                    color: "#353C40", fontFamily: "medium", alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                                    fontSize: Device.isTablet ? 19 : 14,
                                }}>
                                    ₹  {this.state.couponDiscount} </Text>
                            </View>


                            <View style={{ flexDirection: "row", justifyContent: 'space-between', marginLeft: Device.isTablet ? 20 : 10, marginRight: Device.isTablet ? 20 : 10 }}>
                                <Text style={{
                                    color: "#353C40", fontFamily: "medium", alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                                    fontSize: Device.isTablet ? 19 : 14,
                                }}>
                                    Points Redemption({this.state.redeemedPints}) </Text>
                                <Text style={{
                                    color: "#353C40", fontFamily: "medium", alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                                    fontSize: Device.isTablet ? 19 : 14,
                                }}>
                                    ₹  {(parseInt(this.state.redeemedPints) / 10).toString()} </Text>
                            </View>

                            <View style={{ flexDirection: "row", justifyContent: 'space-between', marginLeft: Device.isTablet ? 20 : 10, marginRight: Device.isTablet ? 20 : 10 }}>
                                <Text style={{
                                    color: "#353C40", fontFamily: "bold", alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                                    fontSize: 20,
                                }}>
                                    Payable Amount </Text>
                                <Text style={{
                                    color: "#353C40", fontFamily: "bold", alignItems: 'center', fontSize: 20, justifyContent: 'center', textAlign: 'center',
                                    fontSize: 20,
                                }}>
                                    ₹ {(parseFloat(this.state.totalAmount) - parseFloat(this.state.totalDiscount) - parseFloat(this.state.promoDiscount) - parseFloat(this.state.redeemedPints / 10)).toString()} </Text>
                            </View>


                            <View style={{ flexDirection: "row", justifyContent: 'space-between', marginLeft: Device.isTablet ? 20 : 10, marginRight: Device.isTablet ? 20 : 10 }}>
                                <Text style={{
                                    color: "#353C40", fontFamily: "medium", alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                                    fontSize: Device.isTablet ? 19 : 14,
                                }}>
                                    Points Redemption({this.state.redeemedPints}) </Text>
                                <Text style={{
                                    color: "#353C40", fontFamily: "medium", alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                                    fontSize: Device.isTablet ? 19 : 14,
                                }}>
                                    ₹  {(parseInt(this.state.redeemedPints) / 10).toString()} </Text>
                            </View>
                            <View></View>
                            <View style={styles.TopcontainerforPay}>
                                <TouchableOpacity
                                    style={styles.signInButton}
                                    onPress={() => this.pay()} >

                                    <Text style={styles.signInButtonText}> Pay </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView >
            </View>
        );
    }
}
export default TextilePayment;

const pickerSelectStyles = StyleSheet.create({
    placeholder: {
        color: "#353C4050",
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

        // marginLeft: 20,
        // marginRight: 20,
        // marginTop: 10,
        // height: 40,
        // backgroundColor: '#ffffff',
        // borderBottomColor: '#456CAF55',
        color: '#001B4A',
        // fontFamily: "bold",
        // fontSize: 16,
        // borderRadius: 3,
    },
});


const styles = StyleSheet.create({
    filterMainContainer: {
        marginLeft: -40,
        marginRight: -40,
        backgroundColor: '#ffffff',
        paddingLeft: Device.isTablet ? 0 : 20,
        marginTop: Device.isTablet ? deviceheight - 400 : deviceheight - 300,
        height: Device.isTablet ? 400 : 300,
    },
    modelCloseImage: {
        fontFamily: 'regular',
        fontSize: Device.isTablet ? 17 : 12,
        position: 'absolute',
        top: 10,
        right: Device.isTablet ? 15 : 30,
    },
    safeArea: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#FAFAFF'
    },
    TopcontainerforPay: {
        flexDirection: 'row',
        marginLeft: 0,
        marginRight: 0,
        // marginTop: 10,
        width: '100%',
        backgroundColor: '#ffffff',
        borderColor: 'lightgray',
        borderRadius: 0,
        height: 50,
        position: 'absolute',
        bottom: 0,
    },
    image: {
        marginTop: 40,
        marginLeft: 10,
        width: 80,
        height: 80,
        borderWidth: 0,
        borderRadius: 40,
    },
    viewswidth: {
        backgroundColor: '#FFFFFF',
        width: deviceWidth,
        textAlign: 'center',
        fontSize: 24,
        height: 84,
    },
    input: {
        justifyContent: 'center',
        marginLeft: 0,
        marginRight: 0,
        height: Device.isTablet ? 54 : 44,
        marginTop: 5,
        borderColor: '#8F9EB717',
        borderRadius: 3,
        backgroundColor: '#ffffff',
        fontFamily: 'regular',
        paddingLeft: 15,
        fontSize: Device.isTablet ? 19 : 14,
    },
    signInButton: {
        backgroundColor: '#ED1C24',
        justifyContent: 'center',
        width: '95%',
        marginLeft: 10,
        height: 40,
        borderRadius: 10,
        fontWeight: 'bold',
        margin: 5,
        // alignSelf:'center',
        // marginBottom:100,
    },
    signInButtonText: {
        color: 'white',
        alignSelf: 'center',
        fontSize: Device.isTablet ? 19 : 14,
        fontFamily: "regular",
    },
    signInFieldStyle: {
        color: '#456CAF55',
        marginLeft: 20,
        marginTop: 5,
        fontSize: Device.isTablet ? 17 : 12,
        fontFamily: "regular",
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
        fontSize: Device.isTablet ? 17 : 12,
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
        fontSize: Device.isTablet ? 19 : 14,
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
        // backgroundColor: '#FAFAFF'
    },
    flatListContainer: {
        marginTop: 20,
        backgroundColor: '#ffffff',
        height: Device.isTablet ? 130 : 100,
        width: deviceWidth,
    },
    flatlistbox: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 150,
        width: 220,
        borderWidth: 1,
        backgroundColor: "#00C656",
        borderColor: '#ffffff',
        borderRadius: 10,
        marginLeft: 10,
        //  paddingHorizontal: 15,
        // padding:15,
        // marginRight: 15,
    },

    head: {
        height: 45,
        borderColor: '#FAFAFF',
        borderWidth: 1,
        borderRadius: 10,
    },
    text: {
        margin: 6,
        color: "#0196FD",
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
        marginLeft: 0,
        marginRight: 0,
        marginTop: 10,
        width: '100%',
        backgroundColor: 'grey',
        borderRadius: 20,
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
        backgroundColor: "#0196FD",
        alignSelf: "flex-start",
        //marginHorizontal: "1%",
        marginBottom: 6,
        width: "25%",
        height: 45,
        textAlign: "center",
    },
    blackbox: {
        backgroundColor: "#0196FD",
        alignSelf: "flex-start",
        //marginHorizontal: "1%",
        marginBottom: 6,
        width: "25%",
        height: 45,
        textAlign: "center",
    },
    greenbox: {
        backgroundColor: "#0196FD",
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
        backgroundColor: "#0196FD",
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
        backgroundColor: "#0196FD",
    },
    buttonLabel: {
        textAlign: "center",
        color: "#BBE3FF",
        fontFamily: "regular",
        fontSize: Device.isTablet ? 19 : 14,
    },
    imagealign: {
        marginTop: Device.isTablet ? 25 : 20,
        marginRight: Device.isTablet ? 30 : 20,
    },
    selectedLabel: {
        color: "white",
        textAlign: "center",
        alignSelf: "center",
        marginTop: 10,
        fontFamily: "regular",
        fontSize: Device.isTablet ? 19 : 14,
    },
    modelinput: {
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
        fontSize: Device.isTablet ? 19 : 14,
    },
    label: {
        textAlign: "center",
        marginBottom: 10,
        fontSize: 24,
    },
    createUserinput: {
        justifyContent: 'center',
        margin: 40,
        height: 44,
        marginTop: 5,
        marginBottom: 10,
        borderColor: '#8F9EB717',
        borderRadius: 3,
        backgroundColor: '#FBFBFB',
        borderWidth: 1,
        fontFamily: 'regular',
        paddingLeft: 15,
        fontSize: Device.isTablet ? 19 : 14,
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


    // Styles For Mobile
    viewsWidth_mobile: {
        backgroundColor: '#ffffff',
        width: deviceWidth,
        textAlign: 'center',
        fontSize: 24,
        height: Device.isAndroid ? 70 : 84,
    },
    backButton_mobile: {
        position: 'absolute',
        left: 10,
        bottom: 0,
        width: 40,
        height: 40,
    },
    flatList: {
        marginTop: 20,
        marginBottom: 20
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        // backgroundColor: '#FAFAFF'
    },
    headerTitle_mobile: {
        position: 'absolute',
        left: 70,
        bottom: 10,
        width: 300,
        height: 25,
        fontFamily: 'bold',
        fontSize: 18,
        color: '#353C40'
    },
    filterButton_mobile: {
        position: 'absolute',
        right: 20,
        bottom: 5,
        backgroundColor: '#ffffff',
        borderRadius: 5,
        width: 30,
        height: 32,
    },
    modalContainer_mobile: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        alignSelf: 'center',
        marginRight: 20,
        borderRadius: 5,
        marginTop: 20,
        borderColor: '#ED1C24',
        width: '100%',
        height: 50,
    },
    modalButton_mobile: {
        borderColor: '#353C40',
        height: 32,
        width: "33.3%",
        borderWidth: 1,
        alignSelf: "flex-start",
    },
    modalButtonText_mobile: {
        height: 32,
        width: 100,
        marginTop: 5,
        fontFamily: "medium",
        fontSize: Device.isTablet ? 17 : 12,
        textAlign: 'center',
        alignItems: 'center',
    },
    addBarcodeButton_mobile: {
        position: 'absolute',
        right: 70,
        bottom: 5,
        backgroundColor: '#ED1C24',
        borderRadius: 5,
        width: 110,
        height: 32,
        textAlign: 'center',
        alignItems: 'center',
    },
    addBarcodeButtonText_mobile: {
        fontSize: Device.isTablet ? 17 : 12,
        fontFamily: 'regular',
        color: '#ffffff',
        marginTop: 8,
        textAlign: 'center',
        alignSelf: 'center'
    },
    filterBarcodeContainer_mobile: {
        width: deviceWidth,
        alignItems: 'center',
        marginLeft: -20,
        backgroundColor: "#ffffff",
        height: 400,
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
        width: 50,
        height: 50,
    },
    filterCloseImage_mobile: {
        fontFamily: 'regular',
        fontSize: Device.isTablet ? 17 : 12,
        position: 'absolute',
        top: 15,
        right: 0,
    },
    filterDateButton_mobile: {
        width: deviceWidth - 40,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
        borderColor: '#8F9EB717',
        borderRadius: 3,
        height: 50,
        backgroundColor: "#F6F6F6",
        borderRadius: 5,
    },
    filterDateButtonText_mobile: {

        marginTop: 20,
        color: "#6F6F6F",
        fontSize: 15,
        fontFamily: "regular"
    },
    datePickerContainer_mobile: {
        height: 280,
        width: deviceWidth,
        backgroundColor: '#ffffff'
    },
    datePickerButton_mobile: {
        position: 'absolute',
        left: 20,
        top: 10,
        height: 30,
        backgroundColor: "#ED1C24",
        borderRadius: 5,
    },
    datePickerEndButton_mobile: {
        position: 'absolute',
        right: 20,
        top: 10,
        height: 30,
        backgroundColor: "#ED1C24",
        borderRadius: 5,
    },
    datePickerButtonText_mobile: {
        textAlign: 'center',
        marginTop: 5,
        color: "#ffffff",
        fontSize: 15,
        fontFamily: "regular"
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
        fontSize: Device.isTablet ? 19 : 14,
    },
    filterApplyButton_mobile: {
        width: deviceWidth - 40,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
        height: 50,
        backgroundColor: "#ED1C24",
        borderRadius: 5,
    },
    filterButtonText_mobile: {
        textAlign: 'center',
        marginTop: 20,
        color: "#ffffff",
        fontSize: 15,
        fontFamily: "regular"
    },
    filterCancelButton_mobile: {
        width: deviceWidth - 40,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
        height: 50,
        backgroundColor: "#ffffff",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#353C4050",
    },
    filterButtonCancelText_mobile: {
        textAlign: 'center',
        marginTop: 20,
        color: "#000000",
        fontSize: 15,
        fontFamily: "regular"
    },
    barcodesFlatlistContainer_mobile: {
        height: 140,
        backgroundColor: '#FBFBFB',
        borderBottomWidth: 5,
        borderBottomColor: '#FFFFFF',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    barcodesFlatlistSubContainer_mobile: {
        flexDirection: 'column',
        width: '100%',
        height: 140,
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
        top: 38,
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
    filterButton_tablet: {
        position: 'absolute',
        right: 20,
        top: 40,
        backgroundColor: '#ffffff',
        borderRadius: 5,
        width: 35,
        height: 37,
    },
    modalContainer_tablet: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        alignSelf: 'center',
        marginRight: 20,
        borderRadius: 5,
        marginTop: 20,
        borderColor: '#ED1C24',
        width: '100%',
        height: 50,
    },
    modalButton_tablet: {
        borderColor: '#353C40',
        height: 42,
        width: "33.3%",
        borderWidth: 1,
        alignSelf: "flex-start",
    },
    modalButtonText_tablet: {
        height: 42,
        width: 210,
        marginTop: 5,
        fontFamily: "medium",
        fontSize: 17,
        textAlign: 'center',
        alignItems: 'center',
    },
    addBarcodeButton_tablet: {
        position: 'absolute',
        right: 70,
        top: 40,
        backgroundColor: '#ED1C24',
        borderRadius: 5,
        width: 110,
        height: 32,
        textAlign: 'center',
        alignItems: 'center',
    },
    addBarcodeButtonText_tablet: {
        fontSize: 17,
        fontFamily: 'regular',
        color: '#ffffff',
        marginTop: 6,
        textAlign: 'center',
        alignSelf: 'center'
    },

    filterBarcodeContainer_tablet: {
        width: deviceWidth,
        alignItems: 'center',
        marginLeft: -40,
        backgroundColor: "#ffffff",
        height: 500,
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
        right: 0,
    },
    filterDateButton_tablet: {
        width: deviceWidth - 30,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
        borderColor: '#8F9EB717',
        borderRadius: 3,
        height: 60,
        backgroundColor: "#F6F6F6",
        borderRadius: 5,
    },
    filterDateButtonText_tablet: {

        marginTop: 20,
        color: "#6F6F6F",
        fontSize: 20,
        fontFamily: "regular"
    },
    datePickerButton_tablet: {
        position: 'absolute',
        left: 20,
        top: 10,
        height: 40,
        backgroundColor: "#ED1C24",
        borderRadius: 5,
    },
    datePickerButtonText_tablet: {
        textAlign: 'center',
        marginTop: 5,
        color: "#ffffff",
        fontSize: 20,
        fontFamily: "regular"
    },
    datePickerEndButton_tablet: {
        position: 'absolute',
        right: 20,
        top: 10,
        height: 40,
        backgroundColor: "#ED1C24",
        borderRadius: 5,
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
    filterApplyButton_tablet: {
        width: deviceWidth - 40,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
        height: 60,
        backgroundColor: "#ED1C24",
        borderRadius: 5,
    },
    filterButtonText_tablet: {
        textAlign: 'center',
        marginTop: 20,
        color: "#ffffff",
        fontSize: 20,
        fontFamily: "regular"
    },
    filterCancelButton_tablet: {
        width: deviceWidth - 40,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
        height: 60,
        backgroundColor: "#ffffff",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#353C4050",
    },
    filterButtonCancelText_tablet: {
        textAlign: 'center',
        marginTop: 20,
        color: "#000000",
        fontSize: 20,
        fontFamily: "regular"
    },
    barcodesFlatlistContainer_tablet: {
        height: 160,
        backgroundColor: '#FBFBFB',
        borderBottomWidth: 5,
        borderBottomColor: '#FFFFFF',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    barcodesFlatlistSubContainer_tablet: {
        flexDirection: 'column',
        width: '100%',
        height: 160,
    },

});

// Styles For Flat-Lists

const flats = StyleSheet.create({
    mainText_mobile: {
        fontSize: 16,

        marginTop: 10,
        marginBottom: 10,
        fontFamily: 'medium',
        color: '#ED1C24',
    },
    subText_mobile: {
        fontSize: Device.isTablet ? 17 : 12,

        marginTop: 10,
        marginBottom: 10,
        fontFamily: 'medium',
        color: '#353C40'
    },
    commonText_mobile: {
        fontSize: Device.isTablet ? 17 : 12,
        marginBottom: 10,
        marginTop: -95,
        alignSelf: 'center',
        textAlign: 'center',
        fontFamily: 'regular',
        color: '#808080'
    },
    commonTextRebar_mobile: {
        fontSize: Device.isTablet ? 17 : 12,
        marginBottom: 10,
        marginTop: -95,
        marginLeft: 110,
        alignSelf: 'center',
        textAlign: 'center',
        fontFamily: 'regular',
        color: '#808080'
    },
    commonTextRebar2_mobile: {
        fontSize: Device.isTablet ? 17 : 12,
        marginBottom: 10,
        marginTop: 10,
        marginLeft: 110,
        alignSelf: 'center',
        textAlign: 'center',
        fontFamily: 'regular',
        color: '#808080'
    },
    commonTextsubrebar_mobile: {
        fontSize: Device.isTablet ? 17 : 12,
        marginBottom: 10,
        marginTop: 10,
        position: 'absolute',
        right: 20,
        alignSelf: 'center',
        textAlign: 'center',
        fontFamily: 'regular',
        color: '#808080'
    },
    commonTextsubreba2_mobile: {
        fontSize: Device.isTablet ? 17 : 12,
        marginBottom: 10,
        marginTop: 100,
        alignSelf: 'center',
        textAlign: 'center',
        fontFamily: 'regular',
        color: '#808080'
    },
    commonTextsub_mobile: {
        fontSize: Device.isTablet ? 17 : 12,
        marginBottom: 10,
        marginTop: 10,
        alignSelf: 'center',
        textAlign: 'center',
        fontFamily: 'regular',
        color: '#808080'
    },
    editButton_mobile: {
        position: 'absolute',
        right: 50,
        top: 90,
        width: 30,
        height: 30,
        borderBottomLeftRadius: 5,
        borderTopLeftRadius: 5,
        borderWidth: 1,
        borderColor: "lightgray",
        // borderRadius:5,
    },
    deleteButton_mobile: {
        position: 'absolute',
        right: 20,
        top: 90,
        width: 30,
        height: 30,
        borderBottomRightRadius: 5,
        borderTopRightRadius: 5,
        borderWidth: 1,
        borderColor: "lightgray",
    },
    deleteBarcodeContainer_mobile: {
        width: deviceWidth,
        alignItems: 'center',
        marginLeft: -20,
        backgroundColor: "#ffffff",
        height: 260,
        position: 'absolute',
        bottom: -20,
    },
    deleteBarcodeHeading_mobile: {
        position: 'absolute',
        left: 20,
        top: 15,
        width: 300,
        height: 20,
        fontFamily: 'medium',
        fontSize: 16,
        color: '#353C40'
    },

    // Tablet styles

    mainText_tablet: {
        fontSize: 21,

        marginTop: 10,
        marginBottom: 10,
        fontFamily: 'medium',
        color: '#ED1C24',
    },
    subText_tablet: {
        fontSize: 17,

        marginTop: 10,
        marginBottom: 10,
        fontFamily: 'medium',
        color: '#353C40'
    },
    commonText_tablet: {
        fontSize: 17,
        marginBottom: 10,
        marginTop: -120,
        alignSelf: 'center',
        textAlign: 'center',
        fontFamily: 'regular',
        color: '#808080'
    },
    commonTextRebar_tablet: {
        fontSize: 17,
        marginBottom: 10,
        marginTop: -120,
        marginLeft: 100,
        alignSelf: 'center',
        textAlign: 'center',
        fontFamily: 'regular',
        color: '#808080'
    },
    commonTextRebar2_tablet: {
        fontSize: 17,
        marginBottom: 10,
        marginTop: 10,
        marginLeft: 100,
        alignSelf: 'center',
        textAlign: 'center',
        fontFamily: 'regular',
        color: '#808080'
    },
    commonTextsub_tablet: {
        fontSize: 17,
        marginBottom: 10,
        marginTop: 10,
        alignSelf: 'center',
        textAlign: 'center',
        fontFamily: 'regular',
        color: '#808080'
    },
    editButton_tablet: {
        position: 'absolute',
        right: 70,
        top: 90,
        width: 50,
        height: 50,
        borderBottomLeftRadius: 5,
        borderTopLeftRadius: 5,
        borderWidth: 1,
        borderColor: "lightgray",
        // borderRadius:5,
    },
    deleteButton_tablet: {
        position: 'absolute',
        right: 20,
        top: 90,
        width: 50,
        height: 50,
        borderBottomRightRadius: 5,
        borderTopRightRadius: 5,
        borderWidth: 1,
        borderColor: "lightgray",
    },
    deleteBarcodeContainer_tablet: {
        width: deviceWidth,
        alignItems: 'center',
        marginLeft: -20,
        backgroundColor: "#ffffff",
        height: 280,
        position: 'absolute',
        bottom: -20,
    },
    deleteBarcodeHeading_tablet: {
        position: 'absolute',
        left: 20,
        top: 15,
        width: 300,
        height: 30,
        fontFamily: 'medium',
        fontSize: 21,
        color: '#353C40'
    },
});
