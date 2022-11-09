import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';
import React, { Component } from 'react';
import { Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Device from 'react-native-device-detection';
import I18n from 'react-native-i18n';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal from "react-native-modal";
import { Appbar, RadioButton, TextInput } from 'react-native-paper';
import RazorpayCheckout from 'react-native-razorpay';
import forms from '../../commonUtils/assets/styles/formFields.scss';
import scss from '../../commonUtils/assets/styles/style.scss';
import Loader from '../../commonUtils/loader';
import LoginService from '../services/LoginService';
import NewSaleService from '../services/NewSaleService';
import PromotionsService from '../services/PromotionsService';
import { color } from '../Styles/colorStyles';

var deviceWidth = Dimensions.get('window').width;
var deviceWidth = Dimensions.get('window').width;
var deviceheight = Dimensions.get('window').height;
const data = [{ key: 1 }, { key: 2 }, { key: 3 }, { key: 4 }, { key: 5 }, { key: 6 }];

class TextilePayment extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      isCash: false,
      isCard: false,
      isCardOrCash: false,
      isUpi: false,
      isGv: false,
      isKhata: false,
      promocode: "",
      mobileNumber: "",
      loyaltyPoints: "",
      value: "",
      giftvoucher: "",
      totalAmount: 0,
      totalDiscount: 0,
      recievedAmount: 0,
      verifiedCash: 0,
      ccCardCash: 0,
      domainId: 0,
      storeId: 0,
      customerName: '',
      customerPhoneNumber: '',
      customerFullName: '',
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
      redeemedPints: 0,
      enterredeempoint: '',
      couponDiscount: 0,
      grossAmount: 0,
      totalPromoDisc: 0,
      CGST: 0,
      SGST: 0,
      manualDisc: 0,
      taxAmount: 0,
      approvedBy: '',
      reasonDiscount: '',
      userId: null,
      dsNumberList: [],
      returnAmount: 0,
      retailBarCodeList: [],
      modelVisible: true,
      gvToCustomerModel: false,
      gvNumber: "",
      promoDiscount: 0,
      discountAmount: 0,
      loading: false,
      clientId: 0,
      isTagCustomer: false,
      khataToCustomerModel: false,
      kathaModelVisible: false,
      upiToCustomerModel: false,
      upiModelVisible: false,
      upiMobileNumber: '',
      paymentType: [],
      rtNumber: '',
      rtAmount: 0,
      rtValue: 0,
      netCardPayment: 0,
      createdBy: null,
      giftCouponsList: [],
      couponAmount: 0,
      numRtList: [],
      isRTApplied: false,
      payButtonEnable: false,
      compareRTList: [],
      rtListList: [],
      listOfRtnum: [],
      creditModel: false,
      creditModelVisible: false,
      creditAmount: 0,
      payCreditAmount: 0,
      isCredit: false,
      isCreditAmount: false,
      balanceCreditAmount: "",
      isreturnCreditCash: false,
      isTaxIncluded: '',
      barCodeList: [],
      cardAutoModel: false,
      cardModelVisible: false,
      cardPaymentType: 'Manual',
      cardManual: false,
      khataAmount: 0
    };
  }

  async componentDidMount() {
    var domainStringId = "";
    var storeStringId = "";
    const userId = await AsyncStorage.getItem("userId");
    const clientId = await AsyncStorage.getItem("custom:clientId1");
    this.setState({ createdBy: userId, clientId: clientId });
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
    console.log('total amount is,', this.props.route.params);
    this.setState({
      totalAmount: this.props.route.params.totalAmount,
      netPayableAmount: this.props.route.params.netPayableAmount,
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
      SGST: this.props.route.params.SGST,
      discountAmount: this.props.route.params.discountAmount,
      creditAmount: this.props.route.params.creditAmount,
      isTaxIncluded: this.props.route.params.isTaxIncluded,
      barCodeList: this.props.route.params.barCodeList,
      isCreditFlag:this.props.route.params.isCredit
    });
    this.setState({ isTagCustomer: this.props.route.params.customerPhoneNumber.length >= 10 ? true : false });
    // var qtyarr = [...this.state.barCodeList]
    // let cgst = 0
    // let sgst = 0
    // let totalAmount = 0
    // qtyarr.forEach(barCode => {
    //   console.log({ barCode })
    //   cgst = cgst + barCode.cgst * barCode.qty
    //   sgst = sgst + barCode.sgst * barCode.qty
    //   totalAmount = totalAmount + barCode.itemPrice * barCode.qty
    // })
    // const { isTaxIncluded } = this.state
    // if (this.state.isTaxIncluded === 'false') {
    //   this.setState({ CGST: cgst, SGST: sgst, totalAmount: totalAmount , netPayableAmount: this.state.netPayableAmount + cgst + sgst })
    // }
    // if (isTaxIncluded === 'null') {
    //   this.setState({ CGST: 0, SGST: 0, totalAmount: totalAmount, netPayableAmount: totalAmount })
    // }
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

  removeDuplicates(array, key) {
    const lookup = new Set();
    return array.filter(obj => !lookup.has(obj[key]) && lookup.add(obj[key]));
  }

  confirmKathaModel() {
    const obj = {
      "paymentType": "PKTPENDING",
      "paymentAmount": this.state.khataAmount
    };
    this.state.paymentType.push(obj);
    if (this.state.isRTApplied) {
      this.setState({ totalAmount: (parseFloat(this.state.totalAmount) - parseFloat(this.state.totalDiscount) - parseFloat(this.state.promoDiscount) - parseFloat(this.state.redeemedPints / 10)).toString() + this.state.rtAmount });
    }
    if (this.state.totalAmount > 0) {
      this.setState({
        totalAmount: parseFloat(this.state.totalAmount) - parseFloat(this.state.khataAmount)
      }, () => {
        this.cancelKathaModel();
      });
    }
  }

  cancelKathaModel() {
    this.setState({ kathaModelVisible: false });
  }

  getUPILink() {
    this.savePayment();
  }

  cancelUpiModel() {
    this.setState({ upiModelVisible: false });
  }

  confirmCreditModel() {
    // alert(this.state.creditAmount > -1 ? "true" : "false")

    if (parseInt(this.state.creditAmount) > 0) {
      var grandNetAmount = (parseFloat(this.state.totalAmount) - parseFloat(this.state.totalDiscount) - parseFloat(this.state.promoDiscount) - parseFloat(this.state.redeemedPints / 10)).toString()
      if (this.state.payCreditAmount > grandNetAmount) {
        alert("please check the value")
      } else if (this.state.creditAmount < grandNetAmount) {
        const amount = grandNetAmount - this.state.creditAmount;
        this.setState({ isPayment: true, isreturnCreditCash: true, balanceCreditAmount: amount, grandNetAmount: amount }, () => {
          const obj = {
            "paymentType": "PKTADVANCE",
            "paymentAmount": grandAmount
          }
          this.state.paymentType.push(obj);
          if (this.state.isRTApplied) {
            this.setState({ payingAmount: this.state.creditAmount + this.state.rtAmount })
          }
        })
      } else {
        this.setState({ isPayment: false })
        const obj = {
          "paymentType": "PKTADVANCE",
          "paymentAmount": this.state.payCreditAmount
        }
        this.state.paymentType.push(obj);
      }
      this.setState({ recievedAmount: grandNetAmount, payingAmount: grandNetAmount, totalAmount: this.state.totalAmount - this.state.payCreditAmount })
      const grandAmount = grandNetAmount >= this.state.payCreditAmount ? grandNetAmount - this.state.payCreditAmount : 0
      this.setState({ isCreditAmount: true, grandNetAmount: grandAmount });
      if (this.state.isRTApplied) {
        this.setState({ payingAmount: grandNetAmount + this.state.rtAmount, totalAmount: this.state.totalAmount - payCreditAmount })
      }
    } else {
      alert("you dont have any credit balance")
    }
    this.cancelCreditModel();
    // this.pay()
  }

  cancelCreditModel() {
    this.setState({ creditModelVisible: false });
  }

  saveCard() {
    var grandNetAmount = (parseFloat(this.state.totalAmount) - parseFloat(this.state.totalDiscount) - parseFloat(this.state.promoDiscount) - parseFloat(this.state.redeemedPints / 10)).toString()
    if (this.state.cardPaymentType === "Automatic") {
      this.getCardModel()
      this.cancelCardModel()
    } else {
      this.setState({ cashAmount: grandNetAmount })
      this.manualCardPayment()
    }
  }

  getCardModel = () => {
    var grandNetAmount = (parseFloat(this.state.totalAmount) - parseFloat(this.state.totalDiscount) - parseFloat(this.state.promoDiscount) - parseFloat(this.state.redeemedPints / 10) - parseFloat(this.state.verifiedCash)).toString()
    this.setState({ totalAmount: grandNetAmount })
    this.setState({
      isCard: true,
    },
      () => {
        if (this.state.isreturnCreditCash) {
          this.setState({ totalAmount: this.state.balanceCreditAmount })
        }
      });
    if (this.state.isRTApplied) {
      this.setState({ payingAmount: grandNetAmount + this.state.rtAmount });
    }
    this.pay();
    // this.setState({
    //   isCardSelected: true,
    // });
  };

  manualCardPayment = () => {
    this.setState({ isCard: false, cardManual: true })
    const obj = {
      "paymentType": "Card",
      "paymentAmount": (parseFloat(this.state.totalAmount) - parseFloat(this.state.totalDiscount) - parseFloat(this.state.promoDiscount) - parseFloat(this.state.redeemedPints / 10) - parseFloat(this.state.verifiedCash)).toString()
    }
    this.state.paymentType.push(obj);
    this.cancelCardModel();
  }

  cancelCardModel() {
    this.setState({ cardModelVisible: false, cardAutoModel: false });
  }

  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }


  cashAction() {
    this.setState({
      isCash: true,
      isCard: false,
      isCardOrCash: false,
      isUpi: false,
      isGv: false,
      isKhata: false,
      payButtonEnable: true,
      isCredit: false,
      recievedAmount: 0,
      returnAmount: 0
    });
  }

  cardAction() {
    this.setState({
      isCash: false,
      isCard: true,
      isCardOrCash: false,
      isUpi: false,
      isGv: false,
      isKhata: false,
      payButtonEnable: true,
      isCredit: false,
      recievedAmount: 0,
      returnAmount: 0,
      cardAutoModel: true,
      cardModelVisible: true
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
      isCash: true,
      isCard: false,
      isCardOrCash: true,
      isUpi: false,
      isGv: false,
      isKhata: false,
      payButtonEnable: true,
      isCredit: false,
      recievedAmount: 0,
      returnAmount: 0
    });
  }

  upiAction() {
    this.setState({
      upiToCustomerModel: true,
      upiModelVisible: true,
      isCash: false,
      isCard: false,
      isCardOrCash: false,
      isUpi: true,
      isGv: false,
      isKhata: false,
      payButtonEnable: true,
      isCredit: false,
      recievedAmount: 0,
      returnAmount: 0
    });
  }

  gvAction() {
    this.setState({
      gvToCustomerModel: true,
      modelVisible: true,
      isCash: false,
      isCard: false,
      isCardOrCash: false,
      isUpi: false,
      isGv: true,
      isKhata: false,
      payButtonEnable: true,
      isCredit: false
    });
  }

  khataAction() {
    this.setState({
      khataToCustomerModel: true,
      kathaModelVisible: true,
      isCash: false,
      isCard: false,
      isCardOrCash: false,
      isUpi: false,
      isGv: false,
      isKhata: true,
      payButtonEnable: this.state.totalAmount === 0 ? true : false,
      isCredit: false,
      recievedAmount: 0,
      returnAmount: 0
    });
  }

  creditAction() {
    this.setState({
      creditModel: true,
      payCreditAmount: (parseFloat(this.state.totalAmount) - parseFloat(this.state.totalDiscount) - parseFloat(this.state.promoDiscount) - parseFloat(this.state.redeemedPints / 10)).toString(),
      creditModelVisible: true,
      isCash: false,
      isCard: false,
      isCardOrCash: false,
      isUpi: false,
      isGv: false,
      isKhata: false,
      isCredit: true,
      payButtonEnable: true,
      recievedAmount: 0,
      returnAmount: 0
    });
  }

  handleUpiMobileNumber = (text) => {
    this.setState({ upiMobileNumber: text });
  };

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
    this.setState({ gvNumber: text, giftvoucher: text });
  };

  verifycash() {
    if (this.state.isCash === true && this.state.isCardOrCash === false) {
      if ((parseFloat(this.state.recievedAmount) < (parseFloat(this.state.totalAmount) - parseFloat(this.state.totalDiscount) - parseFloat(this.state.promoDiscount) - parseFloat(this.state.redeemedPints / 10)))) {
        alert('Please collect sufficient amount');
      }
      else {
        this.setState({ returnAmount: parseFloat(this.state.recievedAmount) - parseFloat(this.state.totalAmount) });
        this.setState({ verifiedCash: parseFloat(this.state.totalAmount) });
      }
    }
    else if (this.state.isCardOrCash === true)
      if ((parseFloat(this.state.recievedAmount) < (parseFloat(this.state.totalAmount) - parseFloat(this.state.totalDiscount) - parseFloat(this.state.promoDiscount) - parseFloat(this.state.redeemedPints / 10)))) {
        let ccReturn = (parseFloat(this.state.totalAmount) - parseFloat(this.state.totalDiscount) - parseFloat(this.state.promoDiscount) - parseFloat(this.state.redeemedPints / 10)) - parseFloat(this.state.recievedAmount);
        this.setState({ cardModelVisible: true, cardAutoModel: true, verifiedCash: this.state.recievedAmount });
      }
  }

  async applyPromocode() {
    const gvNumbers = [];
    const obj = {
      gvNumber: this.state.promocode
    };
    gvNumbers.push(obj);
    console.log("promo params", this.state.clientId, gvNumbers);
    if (this.state.promocode !== "") {
      NewSaleService.getCoupons(this.state.clientId, gvNumbers).then(res => {
        if (Array.isArray(res.data.result)) {
          let grandAmount = this.state.totalAmount;
          const couponsListList = res.data.result.map((item) => {
            if (grandAmount > item.value) {
              grandAmount = grandAmount - item.value;
            } else if (grandAmount <= item.value) {
              alert("Please purchase greater than coupon amount");
              // this.setState({ promocode: "" });
            }
            this.setState({ totalAmount: grandAmount, couponAmount: this.state.couponAmount + item.value });
            let obj = {};
            obj.gvNumber = item.gvNumber;
            obj.value = item.value;
            return obj;
          })
          this.setState({
            giftCouponsList: [...this.state.giftCouponsList, couponsListList[0]],
            promocode: ''
          }, () => {
            this.setState({
              giftCouponsList: [...new Map(this.state.giftCouponsList.map((m) => [m.gvNumber, m])).values()]
            })
          })
        }
        else {
          alert(res.data.message);
          this.setState({
            promocode: ''
          })
        }
        // }
      });
    } else {
      alert("Please Enter GV Number");
      this.setState({ promocode: '' })
    }
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


  clearStateFields = () => {
    this.setState({
      customerName: " ",
      gender: " ",
      dob: " ",
      customerGST: " ",
      address: " ",
      manualDisc: 0,
      customerEmail: "",
      netPayableAmount: 0.0,
      barCodeList: [],
      grossAmount: 0.0,
      promoDiscount: 0.0,
      cashAmount: 0,
      taxAmount: 0.0,
      grandNetAmount: 0,
      payingAmount: 0,
      returnCash: 0,
      stateGST: 0,
      centralGST: 0,
      isPayment: true,
      isCreditAmount: false,
      creditAmount: 0,
      payCreditAmount: 0,
      totalAmount: 0,
      couponAmount: 0,
      isTagCustomer: false,
      rtAmount: 0,
      enablePayment: false,
      totalPromoDisc: 0,
      showTable: false,
      numRtList: [],
      objInvoice: [],
      dsNumber: ''
    });
  }
  pay = () => {
    var grandNetAmount = (parseFloat(this.state.totalAmount) - parseFloat(this.state.totalDiscount) - parseFloat(this.state.promoDiscount) - parseFloat(this.state.redeemedPints / 10)).toString();
    var obj;
    if (this.state.isRTApplied) {
      this.setState({ payingAmount: grandNetAmount + this.state.rtAmount });
      const obj = {
        "paymentType": "RTSlip",
        "paymentAmount": this.state.rtAmount
      };
      this.state.paymentType.push(obj);

      if (this.state.rtAmount < grandNetAmount) {
        if (this.state.isCash) {
          const obj = {
            "paymentAmountType": [
              {
                "paymentType": "RTSlip",
                "paymentAmount": this.state.rtAmount
              },
              {
                "paymentType": "Cash",
                "paymentAmount": this.state.cashAmount
              }
            ]
          };
          this.state.paymentType.push(obj);
        }
        if (this.state.isKhata) {
          const obj = {
            "paymentAmountType": [
              {
                "paymentType": "RTSlip",
                "paymentAmount": this.state.rtAmount
              },
              {
                "paymentType": "PKTPENDING",
                "paymentAmount": grandNetAmount
              }
            ]
          };
          this.state.paymentType.push(obj);
        }
        if (this.state.isCredit) {
          const obj = {
            "paymentAmountType": [
              {
                "paymentType": "RTSlip",
                "paymentAmount": this.state.rtAmount
              },
              {
                "paymentType": "PKTADVANCE",
                "paymentAmount": grandNetAmount
              }
            ]
          };
          this.state.paymentType.push(obj);
        }
      }
    }
    if (this.state.isCash === true && this.state.isCardOrCash === false && this.state.recievedAmount === "") {
      alert('Please collect sufficient amount and then only pay');
    }
    else if (this.state.isCash === true && this.state.isCardOrCash === false && parseFloat(this.state.recievedAmount) < (parseFloat(this.state.totalAmount) - parseFloat(this.state.totalDiscount) - parseFloat(this.state.promoDiscount) - parseFloat(this.state.redeemedPints / 10))) {
      alert('Please collect sufficient amount and then only pay');
    }
    else if (this.state.isCardOrCash === true && this.state.verifiedCash === "") {
      alert('Please collect some cash amount for ccpay');
    }
    else if (this.state.isUpi === true) {
      // this.getPaymentResposne()
      const obj = {
        "amount": (parseFloat(this.state.totalAmount) - parseFloat(this.state.totalDiscount) - parseFloat(this.state.promoDiscount) - parseFloat(this.state.redeemedPints / 10)).toString(),
        "description": "payment description",
        "customerDetails": {
          "name": "kadali",
          "contact": this.state.upiMobileNumber,
          "email": "kadali7799@gmail.com"
        }
      };
      const token = AsyncStorage.getItem("tokenkey");
      const uninterceptedAxiosInstance = axios.create();
      uninterceptedAxiosInstance.post('http://14.98.164.17:9097/paymentgateway/razorpay/create-payment-link', obj, {
        headers: {
          'Authorization': 'Bearer' + ' ' + token,
        }
      }).then(response => {
        console.log("UPI response", response);
        if (response.data) {
          this.setState({ upiToCustomerModel: false });
        }
      });
      // axios.post(NewSaleService.upiPayment(), obj).then((res) => {
      //     console.log("responseresponse", JSON.stringify(res.data));
      //     alert("Order created " + res.data["message"]);
      //     if (res.data) {
      //         this.setState({ upiToCustomerModel: false });
      //     }
      // })
    }
    // else if (global.domainName === "Textile") {
    // if (this.state.isCard === true) {
    //     const obj = {
    //         "paymentType": "Card",
    //         "paymentAmount": grandNetAmount
    //     }
    //     this.state.paymentType.push(obj);
    // }
    else if (this.state.isCash === true) {
      const obj = {
        "paymentType": "Cash",
        "paymentAmount": parseFloat(this.state.verifiedCash)
      };
      this.state.paymentType.push(obj);
    }
    else if (this.state.isCardOrCash === true) {
      const obj = {
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
      this.state.paymentType.push(obj);
    }
    // else if (this.state.isKhata === true) {
    //   const obj = {
    //     "paymentType": "PKTPENDING",
    //     "paymentAmount": grandNetAmount
    //   };
    //   this.state.paymentType.push(obj);
    // }
    // else if(this.state.isCredit === true){
    //   const obj = {
    //     "paymentType": "PKTADVANCE",
    //     "paymentAmount": this.state.creditAmount
    //   }
    //   this.state.paymentType.push(obj);
    // }
    if (this.state.giftCouponsList.length >= 1) {
      const obj = {
        "paymentType": "GIFTVOUCHER",
        "paymentAmount": this.state.couponAmount
      }
      this.state.paymentType.push(obj);
    }
    let couponCode = this.state.giftCouponsList.map((item) => {
      return item.gvNumber
    })
    obj = {
      "natureOfSale": "InStore",
      "domainId": 1,
      "storeId": this.state.storeId,
      "grossAmount": this.state.grossAmount,
      "createdBy": parseInt(this.state.createdBy),
      "totalPromoDisc": this.state.totalPromoDisc,
      "taxAmount": this.state.taxAmount,
      "totalManualDisc": parseInt(this.state.manualDisc),
      "discApprovedBy": this.state.approvedBy,
      "discType": this.state.reasonDiscount,
      "approvedBy": null,
      "netPayableAmount": (parseFloat(this.state.totalAmount) - parseFloat(this.state.totalDiscount) - parseFloat(this.state.promoDiscount) - parseFloat(this.state.redeemedPints / 10)).toString(),
      "offlineNumber": null,
      "mobileNumber": this.state.customerPhoneNumber,
      "customerFullName": this.state.customerFullName,
      "userId": this.state.userId,
      "sgst": this.state.SGST,
      "cgst": this.state.CGST,
      "dlSlip": this.state.dsNumberList,
      "lineItemsReVo": this.state.barCodeList,
      "createdBy": this.state.createdBy,
      "recievedAmount": this.state.recievedAmount,
      "returnAmount": this.state.returnAmount,
      "paymentAmountType": this.state.paymentType,
      "returnSlipNumbers": this.state.numRtList,
      "returnSlipAmount": (this.state.rtAmount === null ? 0 : this.state.rtAmount),
      "gvAppliedAmount": (this.state.couponAmount === null ? 0 : this.state.couponAmount),
      "gvNumber": couponCode,
      "totalAmount": (parseFloat(this.state.totalAmount) - parseFloat(this.state.totalDiscount) - parseFloat(this.state.promoDiscount) - parseFloat(this.state.redeemedPints / 10)).toString()
    };
    console.log(" payment cash method data", obj);
    if (this.state.isCard === true) {
      delete obj.paymentAmountType
    }
    axios.post(NewSaleService.createOrder(), obj).then((res) => {
      console.log("Invoice data", JSON.stringify(res.data));
      if (res.data && res.data["isSuccess"] === "true") {
        // const cardAmount = this.state.isCard || this.state.isCardOrCash ? JSON.stringify(Math.round(this.state.ccCardCash)) : JSON.stringify((parseFloat(this.state.totalAmount) - parseFloat(this.state.totalDiscount) - parseFloat(this.state.promoDiscount) - parseFloat(this.state.redeemedPints / 10)).toString());
        alert("Order created " + res.data["result"]);
        if (this.state.isKhata === true || this.state.cardManual === true) {
          this.props.route.params.onGoBack();
          this.props.navigation.goBack();
        }
        if (this.state.isCredit === true) {
          this.props.route.params.onGoBack();
          this.props.navigation.goBack();
        }
        if (this.state.isCash === true && this.state.isCardOrCash === false) {
          this.props.route.params.onGoBack();
          this.props.navigation.goBack();
        }
        let obj;
        if (this.state.isCard === true) {
          obj = {
            "amount": (parseFloat(this.state.totalAmount) - parseFloat(this.state.totalDiscount) - parseFloat(this.state.promoDiscount) - parseFloat(this.state.redeemedPints / 10)),
            "info": "order creations",
            "newsaleId": res.data["result"],
          };
        } else if (this.state.isCardOrCash === true) {
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
      }
      else {
        // this.setState({ loading: false });
        alert("duplicate record already exists");
      }
    });
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
        console.log(res.data);
        alert(res.data.message);
      }
      this.setState({ modelVisible: false, gvNumber: "" });
    });
  }

  async applyRt() {
    const obj = this.state.rtNumber
    if (this.state.compareRTList.length === 0) {
      console.log("in if", this.state.compareRTList, this.state.listOfRtnum);
      this.setState({
        compareRTList: [...this.state.listOfRtnum, obj],
      })
    } else {
      console.log("in else", this.state.rtListList);
      const isFound = this.state.rtListList.find(element => {
        if (element.returnReference === obj) {
          alert("RT Number Alredy Exist ");
          return true;
        }
        return false;
      });
      if (!isFound) {
        this.setState({
          compareRTList: [...this.state.compareRTList, obj]
        })
      }

    }
    var grandNetAmount = (parseFloat(this.state.totalAmount) - parseFloat(this.state.totalDiscount) - parseFloat(this.state.promoDiscount) - parseFloat(this.state.redeemedPints / 10)).toString();
    if (this.state.rtNumber.length > 0) {
      const storeId = await AsyncStorage.getItem("storeId");
      NewSaleService.getRTDetails([this.state.rtNumber], storeId).then(res => {
        console.log("___________res______________" + JSON.stringify(res.data));
        if (res.data.result.length > 0) {
          console.log("---------ress", res.data.result[0]);
          this.setState({
            rtListList: [...this.state.rtListList, res.data.result[0]]
          }, () => {
            const flattened1 = this.state.rtListList.flatMap(returnReference => returnReference);
            const unique = [...new Map(flattened1.map((m) => [m.taggedItemId, m])).values()];
            let listofRTNum = unique.map((itm) => itm.returnReference);
            this.setState({
              rtSlipList: unique,
              rtListList: unique,
              rtNumber: '',
              listOfRtnum: [],
              numRtList: listofRTNum
            });
          })
          let sumreturnedAmout = res.data.result[0].barcodes.reduce((accumulator, curValue) => {
            if (curValue.returnQty) {
              accumulator = accumulator + curValue.returnAmount;
            }
            return accumulator;
          }, 0);
          if (grandNetAmount >= sumreturnedAmout) {
            this.setState({
              isRTnumAplied: false,
              rtAmount: sumreturnedAmout,
              payingAmount: this.state.rtAmount - grandNetAmount,
              totalAmount: grandNetAmount - sumreturnedAmout,
              payButtonEnable: grandNetAmount - sumreturnedAmout === 0 ? true : false,
              isRTApplied: true
            })
          } else {
            alert("Please purchase greater than return amount")
          }
          this.setState({ rtNumber: '' })
        } else {
          alert("Invalid RT Slip Number ");
          this.setState({ rtNumber: '' })
        }
      }
      );
    } else {
      alert("Please Enter RT Slip Number");
      this.setState({ rtNumber: '' })
    }
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        {this.state.loading && <Loader loading={this.state.loading} />}
        <Appbar style={styles.subContainer}>
          <Appbar.BackAction
            onPress={() => this.handleBackButtonClick()}
          />
          <Appbar.Content title="Payment method" />
        </Appbar>

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
                      <Image source={this.state.isCash && this.state.isCardOrCash === false ? require('../assets/images/cashselect.png') : require('../assets/images/cashunselect.png')} style={{
                        marginLeft: Device.isTablet ? 15 : 0, marginTop: Device.isTablet ? 10 : 0,
                      }} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 15, alignItems: 'center', alignSelf: 'center', marginTop: 0, fontSize: Device.isTablet ? 19 : 14, color: this.state.isCash && this.state.isCardOrCash === false ? "#ED1C24" : "#22222240", fontFamily: 'regular' }}>
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
                      <Image source={this.state.isCard ? require('../assets/images/cardselect.png') : require('../assets/images/cardunselect.png')} style={{
                        marginLeft: Device.isTablet ? 15 : 0, marginTop: Device.isTablet ? 10 : 0,
                      }} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 15, alignItems: 'center', alignSelf: 'center', marginTop: 0, fontSize: Device.isTablet ? 19 : 14, color: this.state.isCard ? "#ED1C24" : "#22222240", fontFamily: 'regular' }}>
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
                      <Image source={this.state.isCardOrCash ? require('../assets/images/qrselect.png') : require('../assets/images/qrunselect.png')} style={{
                        marginLeft: Device.isTablet ? 15 : 0, marginTop: Device.isTablet ? 10 : 0,
                      }} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 15, alignItems: 'center', alignSelf: 'center', marginTop: 0, width: Device.isTablet ? 70 : 50, fontSize: Device.isTablet ? 19 : 14, color: this.state.isCardOrCash ? "#ED1C24" : "#22222240", fontFamily: 'regular' }}>
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
                      <Image source={this.state.isUpi ? require('../assets/images/upiselect.png') : require('../assets/images/upiunselect.png')} style={{
                        marginLeft: Device.isTablet ? 15 : 0, marginTop: Device.isTablet ? 10 : 0,
                      }} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 15, alignItems: 'center', alignSelf: 'center', marginTop: 0, fontSize: Device.isTablet ? 19 : 14, color: this.state.isUpi ? "#ED1C24" : "#22222240", fontFamily: 'regular' }}>
                      UPI
                    </Text>

                  </View>;
                }
                if (item.key === 5 && this.state.isTagCustomer) {
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
                    }} onPress={() => this.khataAction()}>
                      <Image source={this.state.isKhata ? require('../assets/images/kathaselect.png') : require('../assets/images/kathaunselect.png')} style={{
                        marginLeft: Device.isTablet ? 15 : 0, marginTop: Device.isTablet ? 10 : 0,
                      }} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 15, alignItems: 'center', alignSelf: 'center', marginTop: 0, fontSize: Device.isTablet ? 19 : 14, color: this.state.isKhata ? "#ED1C24" : "#22222240", fontFamily: 'regular' }}>
                      KHATA
                    </Text>

                  </View>;
                }
                if (item.key === 6 && this.state.isCreditFlag) {
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
                    }} onPress={() => this.creditAction()}>
                      <Image source={this.state.isCredit ? require('../assets/images/kathaselect.png') : require('../assets/images/kathaunselect.png')} style={{
                        marginLeft: Device.isTablet ? 15 : 0, marginTop: Device.isTablet ? 10 : 0,
                      }} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 15, alignItems: 'center', alignSelf: 'center', marginTop: 0, fontSize: Device.isTablet ? 19 : 14, color: this.state.isCredit ? "#ED1C24" : "#22222240", fontFamily: 'regular' }}>
                      CREDIT
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
              underlineColor="transparent"
              label="ENTER RT NUMBER"
              activeUnderlineColor='#000'
              value={this.state.rtNumber}
              onChangeText={(text) => this.setState({ rtNumber: text })}
            // onEndEditing={() => this.endEditing()}
            />
            {this.state.loyaltyPoints === "" && this.state.notfound !== "not found" && (
              <TouchableOpacity
                style={{ backgroundColor: '#FFffff', borderRadius: 5, width: Device.isTablet ? 100 : 90, height: Device.isTablet ? 42 : 32, borderColor: "#ED1C24", borderWidth: 1, alignSelf: 'flex-end', right: 10, marginTop: Device.isTablet ? -47 : -37 }}
                onPress={() => this.applyRt()}
              >
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

            {this.state.redeemedPints !== 0 && (
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
            <TextInput style={styles.input}
              underlineColor="transparent"
              label="Enter coupon code"
              activeUnderlineColor='#000'
              value={this.state.promocode}
              onChangeText={(text) => this.handlePromocode(text)}
            // onEndEditing={() => this.applyPromocode()}
            />
            {this.state.giftvoucher === "" && (
              <TouchableOpacity
                style={{ backgroundColor: '#FFffff', borderRadius: 5, width: Device.isTablet ? 100 : 90, height: Device.isTablet ? 42 : 32, borderColor: "#ED1C24", borderWidth: 1, right: 10, alignSelf: 'flex-end', marginTop: Device.isTablet ? -47 : -37 }}
                onPress={() => this.applyPromocode()} >
                <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#ED1C24', marginLeft: 10, marginTop: 8, alignSelf: 'center' }}> {('APPLY')} </Text>
              </TouchableOpacity>
            )}

            {this.state.giftvoucher !== "" && (
              <View style={{ backgroundColor: '#ffffff', marginTop: 0 }}>
                <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'medium', color: '#ED1C24', marginLeft: 10, marginTop: 10 }}> {this.state.giftvoucher} </Text>

              </View>
            )}

            {this.state.giftvoucher !== "" && (
              <View style={{ backgroundColor: '#ffffff', marginTop: 0 }}>
                <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'medium', color: '#ED1C24', marginLeft: 10, marginTop: 10 }}> {"Enter GV Number"} </Text>

              </View>
            )}


            {this.state.isCash === true && (
              <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'medium', color: '#828282', marginLeft: 10, marginTop: 10 }}> {('CASH SUMMARY')} </Text>

            )}
            {/* {alert(this.state.verifiedCash)} */}
            {this.state.isCash === true && this.state.verifiedCash > 1 && (

              <TouchableOpacity
                style={{ borderRadius: 5, width: 90, height: 20, alignSelf: 'flex-end', marginTop: -20 }}
                onPress={() => this.clearCashSammary()} >
                <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#ED1C24', marginLeft: 10, marginTop: 8, alignSelf: 'center' }}> {('CLEAR')} </Text>
              </TouchableOpacity>
            )}

            {this.state.isCash === true && (
              <TextInput style={styles.input}
                underlineColor="transparent"
                activeUnderlineColor='#000'
                label="Recieved Amount"
                value={this.state.recievedAmount}
                //  onEndEditing
                onChangeText={(text) => this.handlerecievedAmount(text)} />
              // onEndEditing={() => this.endEditing()}
            )}


            {this.state.isCash === true && this.state.giftvoucher === "" && this.state.loyaltyPoints === "" && this.state.verifiedCash === 0 && (
              <TouchableOpacity
                style={{ backgroundColor: '#FFffff', borderRadius: 5, width: Device.isTablet ? 100 : 90, height: Device.isTablet ? 42 : 32, borderColor: "#ED1C24", borderWidth: 1, right: 10, alignSelf: 'flex-end', marginTop: Device.isTablet ? -47 : -37 }}
                onPress={() => this.verifycash()} >
                <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#ED1C24', marginLeft: 10, marginTop: 8, alignSelf: 'center' }}> {('VERIFY')} </Text>
              </TouchableOpacity>
            )}

            {this.state.isCash === true && this.state.giftvoucher !== "" && this.state.loyaltyPoints !== "" && this.state.verifiedCash === 0 && (
              <TouchableOpacity
                style={{ backgroundColor: '#FFffff', borderRadius: 5, width: Device.isTablet ? 100 : 90, height: Device.isTablet ? 42 : 32, borderColor: "#ED1C24", borderWidth: 1, right: 10, alignSelf: 'flex-end', marginTop: Device.isTablet ? -47 : -37 }}
                onPress={() => this.verifycash()} >
                <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#ED1C24', marginLeft: 10, marginTop: 8, alignSelf: 'center' }}> {('VERIFY')} </Text>
              </TouchableOpacity>
            )}

            {this.state.isCash === true && this.state.giftvoucher !== "" && this.state.loyaltyPoints === "" && this.state.verifiedCash === 0 && (
              <TouchableOpacity
                style={{ backgroundColor: '#FFffff', borderRadius: 5, width: Device.isTablet ? 100 : 90, height: Device.isTablet ? 42 : 32, borderColor: "#ED1C24", borderWidth: 1, right: 10, alignSelf: 'flex-end', marginTop: Device.isTablet ? -47 : -37 }}
                onPress={() => this.verifycash()} >
                <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#ED1C24', marginLeft: 10, marginTop: 8, alignSelf: 'center' }}> {('VERIFY')} </Text>
              </TouchableOpacity>
            )}

            {this.state.isCash === true && this.state.giftvoucher === "" && this.state.loyaltyPoints !== "" && this.state.verifiedCash === 0 && (
              <TouchableOpacity
                style={{ backgroundColor: '#FFffff', borderRadius: 5, width: Device.isTablet ? 100 : 90, height: Device.isTablet ? 42 : 32, borderColor: "#ED1C24", borderWidth: 1, right: 10, alignSelf: 'flex-end', marginTop: Device.isTablet ? -47 : -37 }}
                onPress={() => this.verifycash()} >
                <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#ED1C24', marginLeft: 10, marginTop: 8, alignSelf: 'center' }}> {('VERIFY')} </Text>
              </TouchableOpacity>
            )}


            {this.state.isCash === true && this.state.giftvoucher === "" && this.state.loyaltyPoints === "" && this.state.verifiedCash !== 0 && (
              <TouchableOpacity
                style={{ backgroundColor: '#FFffff', borderRadius: 5, width: Device.isTablet ? 100 : 90, height: Device.isTablet ? 42 : 32, right: 10, alignSelf: 'flex-end', marginTop: Device.isTablet ? -47 : -37 }}
              >
                <Image style={{ position: 'absolute', right: Device.isTablet ? 83 : 68, top: Device.isTablet ? 11 : 9 }} source={require('../assets/images/applied.png')} />

                <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#28D266', marginLeft: 10, marginTop: 10, alignSelf: 'center' }}> {('VERIFIED')} </Text>

              </TouchableOpacity>
            )}

            {this.state.isCash === true && this.state.giftvoucher !== "" && this.state.loyaltyPoints !== "" && this.state.verifiedCash !== 0 && (
              <TouchableOpacity
                style={{ backgroundColor: '#FFffff', borderRadius: 5, width: Device.isTablet ? 100 : 90, height: Device.isTablet ? 42 : 32, right: 10, alignSelf: 'flex-end', marginTop: Device.isTablet ? -47 : -37 }}
              >
                <Image style={{ position: 'absolute', right: Device.isTablet ? 83 : 68, top: Device.isTablet ? 11 : 9 }} source={require('../assets/images/applied.png')} />

                <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#28D266', marginLeft: 10, marginTop: 10, alignSelf: 'center' }}> {('VERIFIED')} </Text>

              </TouchableOpacity>
            )}

            {this.state.isCash === true && this.state.giftvoucher !== "" && this.state.loyaltyPoints === "" && this.state.verifiedCash !== 0 && (
              <TouchableOpacity
                style={{ backgroundColor: '#FFffff', borderRadius: 5, width: Device.isTablet ? 100 : 90, height: Device.isTablet ? 42 : 32, right: 10, alignSelf: 'flex-end', marginTop: Device.isTablet ? -47 : -37 }}
              >
                <Image style={{ position: 'absolute', right: Device.isTablet ? 83 : 68, top: Device.isTablet ? 11 : 9 }} source={require('../assets/images/applied.png')} />

                <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#28D266', marginLeft: 10, marginTop: 10, alignSelf: 'center' }}> {('VERIFIED')} </Text>

              </TouchableOpacity>
            )}

            {this.state.isCash === true && this.state.giftvoucher === "" && this.state.loyaltyPoints !== "" && this.state.verifiedCash !== 0 && (
              <TouchableOpacity
                style={{ backgroundColor: '#FFffff', borderRadius: 5, width: Device.isTablet ? 100 : 90, height: Device.isTablet ? 42 : 32, right: 10, alignSelf: 'flex-end', marginTop: Device.isTablet ? -47 : -37 }}
              >
                <Image style={{ position: 'absolute', right: Device.isTablet ? 83 : 68, top: Device.isTablet ? 11 : 9 }} source={require('../assets/images/applied.png')} />

                <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#28D266', marginLeft: 10, marginTop: 10, alignSelf: 'center' }}> {('VERIFIED')} </Text>

              </TouchableOpacity>
            )}



            {this.state.isCash === true && this.state.verifiedCash !== 0 && (
              <View style={{ backgroundColor: '#ffffff', marginTop: 0 }}>
                <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'medium', color: '#ED1C24', marginLeft: 10, marginTop: 10 }}> RETURN AMOUNT  ₹{this.state.returnAmount} </Text>

              </View>
            )}

            {this.state.flagredeem && (
              <View>
                <Modal style={{ margin: 0 }} isVisible={this.state.modalVisible}
                  onBackButtonPress={() => this.modelCancel()}
                  onBackdropPress={() => this.modelCancel()} >

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
                        underlineColor="transparent"
                        activeUnderlineColor='#000'
                        label="ENTER POINTS"
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


            {this.state.upiToCustomerModel && (
              <View>
                <Modal isVisible={this.state.upiModelVisible} style={{ margin: 0 }}
                  onBackButtonPress={() => this.cancelUpiModel()}
                  onBackdropPress={() => this.cancelUpiModel()} >
                  <View style={forms.filterModelContainer} >
                    <Text style={forms.popUp_decorator}>-</Text>
                    <View style={forms.filterModelSub}>
                      <KeyboardAwareScrollView >
                        <Text style={scss.textStyleLight}>Net Payable Amount:</Text>
                        <TextInput
                          style={forms.input_fld}
                          underlineColor="transparent"
                          activeUnderlineColor='#000'
                          disabled
                          value={(parseFloat(this.state.totalAmount) - parseFloat(this.state.totalDiscount) - parseFloat(this.state.promoDiscount) - parseFloat(this.state.redeemedPints / 10)).toString()}
                        />
                        <Text style={scss.textStyleLight}>Mobile Number:</Text>
                        <TextInput
                          style={forms.input_fld}
                          underlineColor="transparent"
                          label={"MOBILE NUMBER"}
                          activeUnderlineColor='#000'
                          keyboardType='decimal-pad'
                          maxLength={10}
                          value={this.state.upiMobileNumber}
                          onChangeText={(text) => this.handleUpiMobileNumber(text)}
                        />
                        <View style={forms.action_buttons_container}>
                          <TouchableOpacity style={[forms.action_buttons, forms.submit_btn]}
                            onPress={() => this.getUPILink()}>
                            <Text style={forms.submit_btn_text} >{I18n.t("CONFIRM")}</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={[forms.action_buttons, forms.cancel_btn]}
                            onPress={() => this.cancelUpiModel()}>
                            <Text style={forms.cancel_btn_text}>{I18n.t("CANCEL")}</Text>
                          </TouchableOpacity>
                        </View>
                      </KeyboardAwareScrollView>
                    </View>
                  </View>
                </Modal>
              </View>
            )}


            {this.state.khataToCustomerModel && (
              <View>
                <Modal isVisible={this.state.kathaModelVisible} style={{ margin: 0 }}
                  onBackButtonPress={() => this.cancelKathaModel()}
                  onBackdropPress={() => this.cancelKathaModel()} >
                  <View style={forms.filterModelContainer} >
                    <Text style={forms.popUp_decorator}>-</Text>
                    <View style={forms.filterModelSub}>
                      <KeyboardAwareScrollView >
                        <Text style={scss.textStyleLight}>Adding Payment Details on Katha</Text>
                        <TextInput
                          style={forms.input_fld}
                          underlineColor="transparent"
                          activeUnderlineColor='#000'
                          // editable={false} selectTextOnFocus={false}
                          // value={(parseFloat(this.state.totalAmount) - parseFloat(this.state.totalDiscount) - parseFloat(this.state.promoDiscount) - parseFloat(this.state.redeemedPints / 10)).toString()}
                          value={this.state.khataAmount}
                          onChangeText={(value) =>
                            this.setState({ khataAmount: value }, () => {
                              if (this.state.khataAmount < (parseFloat(this.state.totalAmount) - parseFloat(this.state.totalDiscount) - parseFloat(this.state.promoDiscount) - parseFloat(this.state.redeemedPints / 10)).toString()) {
                                this.setState({ khataAmount: value })
                              }
                            })
                          }
                        />
                        <View style={forms.action_buttons_container}>
                          <TouchableOpacity style={[forms.action_buttons, forms.submit_btn]}
                            onPress={() => this.confirmKathaModel()}>
                            <Text style={forms.submit_btn_text} >{I18n.t("CONFIRM")}</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={[forms.action_buttons, forms.cancel_btn]}
                            onPress={() => this.cancelKathaModel()}>
                            <Text style={forms.cancel_btn_text}>{I18n.t("CANCEL")}</Text>
                          </TouchableOpacity>
                        </View>
                      </KeyboardAwareScrollView>
                    </View>
                  </View>
                </Modal>
              </View>)}

            {this.state.creditModel && (
              <View>
                <Modal isVisible={this.state.creditModelVisible} style={{ margin: 0 }}
                  onBackButtonPress={() => this.cancelCreditModel()}
                  onBackdropPress={() => this.cancelCreditModel()} >
                  <View style={forms.filterModelContainer} >
                    <Text style={forms.popUp_decorator}>-</Text>
                    <View style={forms.filterModelSub}>
                      <KeyboardAwareScrollView >
                        <Text style={scss.textStyleMedium}>Credit Amount:</Text>
                        <TextInput
                          style={forms.input_fld}
                          underlineColor="transparent"
                          activeUnderlineColor='#000'
                          editable={false} selectTextOnFocus={false}
                          value={(parseFloat(this.state.creditAmount)).toString()}
                        />
                        <Text style={scss.textStyleMedium}>Cash :</Text>
                        <TextInput
                          style={forms.input_fld}
                          underlineColor="transparent"
                          activeUnderlineColor='#000'
                          selectTextOnFocus={false}
                          value={this.state.payCreditAmount}
                          onChangeText={(value) =>
                            this.setState({ payCreditAmount: value })
                          }
                        // value={}
                        />
                        <View style={forms.action_buttons_container}>
                          <TouchableOpacity style={[forms.action_buttons, forms.submit_btn]}
                            onPress={() => this.confirmCreditModel()}>
                            <Text style={forms.submit_btn_text} >{I18n.t("CONFIRM")}</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={[forms.action_buttons, forms.cancel_btn]}
                            onPress={() => this.cancelCreditModel()}>
                            <Text style={forms.cancel_btn_text}>{I18n.t("CANCEL")}</Text>
                          </TouchableOpacity>
                        </View>
                      </KeyboardAwareScrollView>
                    </View>
                  </View>
                </Modal>
              </View>)}


            {this.state.gvToCustomerModel && (
              <View>
                <Modal isVisible={this.state.modelVisible} style={{ margin: 0 }}
                  onBackButtonPress={() => this.modelCancel()}
                  onBackdropPress={() => this.modelCancel()} >
                  <View style={styles.filterMainContainer}>
                    <KeyboardAwareScrollView >
                      <Text style={Device.isTablet ? styles.filterByTitle_tablet : styles.filterByTitle_mobile} > Issue GV Number </Text>
                      <TouchableOpacity style={Device.isTablet ? styles.filterCloseButton_tablet : styles.filterCloseButton_mobile} onPress={() => this.modelCancel()}>
                        <Image style={styles.modelCloseImage} source={require('../assets/images/modelcancel.png')} />
                      </TouchableOpacity>
                      <Text style={Device.isTablet ? styles.filterByTitleDecoration_tablet : styles.filterByTitleDecoration_mobile}>
                      </Text>
                      <Text style={{ alignItems: 'center', fontSize: Device.isTablet ? 20 : 15, marginLeft: 40 }}>GV Number:</Text>
                      <TextInput
                        style={Device.isTablet ? styles.input_tablet : styles.input_mobile}
                        underlineColor="transparent"
                        label="GV Number"
                        activeUnderlineColor='#000'
                        value={this.state.gvNumber}
                        onChangeText={this.handleGVNumber}
                      />
                      <View style={forms.action_buttons_container}>
                        <TouchableOpacity style={[forms.action_buttons, forms.submit_btn]}
                          onPress={() => this.applyGVNumber()}>
                          <Text style={forms.submit_btn_text} >{I18n.t("APPLY")}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[forms.action_buttons, forms.cancel_btn]}
                          onPress={() => this.modelCancel()}>
                          <Text style={forms.cancel_btn_text}>{I18n.t("CANCEL")}</Text>
                        </TouchableOpacity>
                      </View>
                    </KeyboardAwareScrollView>
                  </View>
                </Modal>
              </View>
            )}

            {this.state.cardAutoModel && (
              <View>
                <Modal isVisible={this.state.cardModelVisible} style={{ margin: 0 }}
                  onBackButtonPress={() => this.cancelCardModel()}
                  onBackdropPress={() => this.cancelCardModel()} >
                  <View style={forms.filterModelContainer} >
                    <Text style={forms.popUp_decorator}>-</Text>
                    <View style={forms.filterModelSub}>
                      <KeyboardAwareScrollView >
                        <View>
                          <Text style={scss.textStyleMedium}>Card Payment:</Text>
                          <TextInput
                            style={forms.input_fld}
                            underlineColor="transparent"
                            activeUnderlineColor='#000'
                            editable={this.state.isCardOrCash ? true : false} selectTextOnFocus={false}
                            value={(parseFloat(this.state.totalAmount) - parseFloat(this.state.totalDiscount) - parseFloat(this.state.promoDiscount) - parseFloat(this.state.redeemedPints / 10) - parseInt(this.state.verifiedCash)).toString()}
                          />
                          <View style={scss.radio_group}>
                            <View style={scss.radio_item}>
                              <RadioButton
                                value="Automatic"
                                status={this.state.cardPaymentType === 'Automatic' ? 'checked' : 'unchecked'}
                                onPress={() => this.setState({ cardPaymentType: 'Automatic' })}
                              />
                              <Text >Automatic</Text>
                            </View>
                            <View style={scss.radio_item}>
                              <RadioButton
                                value="Manual"
                                status={this.state.cardPaymentType === 'Manual' ? 'checked' : 'unchecked'}
                                onPress={() => this.setState({ cardPaymentType: 'Manual' })}
                              />
                              <Text>Manual</Text>
                            </View>
                          </View>
                        </View>
                        <View style={forms.action_buttons_container}>
                          <TouchableOpacity style={[forms.action_buttons, forms.submit_btn]}
                            onPress={() => { this.saveCard() }}>
                            <Text style={forms.submit_btn_text} >{I18n.t("CONFIRM")}</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={[forms.action_buttons, forms.cancel_btn]}
                            onPress={() => this.cancelCardModel()}>
                            <Text style={forms.cancel_btn_text}>{I18n.t("CANCEL")}</Text>
                          </TouchableOpacity>
                        </View>
                      </KeyboardAwareScrollView>
                    </View>
                  </View>
                </Modal>
              </View>)}

            <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'medium', color: '#828282', marginLeft: 10, marginTop: 10 }}> {('PRICE SUMMARY')} </Text>


            <View style={{ width: deviceWidth, height: Device.isTablet ? 500 : 350, backgroundColor: '#FFFFFF', marginTop: 10, flexDirection: 'column', justifyContent: 'space-around' }}>
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
                  ₹ {this.state.netPayableAmount} </Text>
              </View>
              {this.state.isTaxIncluded !== 'null' &&
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
                </View>}
              {this.state.isTaxIncluded !== 'null' &&
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
                    ₹  {this.state.SGST} </Text>
                </View>}
              {this.props.route.params.discountAmount !== 0 &&
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
                </View>}
              <View style={{ flexDirection: "row", justifyContent: 'space-between', marginLeft: Device.isTablet ? 20 : 10, marginRight: Device.isTablet ? 20 : 10 }}>
                <Text style={{
                  color: "#2ADC09", fontFamily: "medium", alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                  fontSize: Device.isTablet ? 19 : 14,
                }}>
                  Promo Discount </Text>
                <Text style={{
                  color: "#2ADC09", fontFamily: "medium", alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                  fontSize: Device.isTablet ? 19 : 14,
                }}>
                  ₹  {this.state.couponDiscount} </Text>
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
              {
                this.state.isCreditAmount && (
                  <>
                    <View style={{ flexDirection: "row", justifyContent: 'space-between', marginLeft: Device.isTablet ? 20 : 10, marginRight: Device.isTablet ? 20 : 10 }}>
                      <Text style={{
                        color: "#353C40", fontFamily: "bold", alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                        fontSize: 16,
                      }}>
                        Credit Amount </Text>
                      <Text style={{
                        color: "#353C40", fontFamily: "bold", alignItems: 'center', fontSize: 20, justifyContent: 'center', textAlign: 'center',
                        fontSize: 16,
                      }}>
                        ₹ {this.state.creditAmount}</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: 'space-between', marginLeft: Device.isTablet ? 20 : 10, marginRight: Device.isTablet ? 20 : 10 }}>
                      <Text style={{
                        color: "#353C40", fontFamily: "bold", alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                        fontSize: 16,
                      }}>
                        Payed Amount </Text>
                      <Text style={{
                        color: "#353C40", fontFamily: "bold", alignItems: 'center', fontSize: 20, justifyContent: 'center', textAlign: 'center',
                        fontSize: 16,
                      }}>
                        ₹ {this.state.payCreditAmount} </Text>
                    </View>
                  </>
                )
              }

              {
                this.state.isreturnCreditCash && (
                  <View style={{ flexDirection: "row", justifyContent: 'space-between', marginLeft: Device.isTablet ? 20 : 10, marginRight: Device.isTablet ? 20 : 10 }}>
                    <Text style={{
                      color: "#353C40", fontFamily: "bold", alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                      fontSize: 16,
                    }}>Balance Amount </Text>
                    <Text style={{
                      color: "#353C40", fontFamily: "bold", alignItems: 'center', fontSize: 20, justifyContent: 'center', textAlign: 'center',
                      fontSize: 16,
                    }}>
                      ₹ {parseFloat(this.state.balanceCreditAmount).toString()} </Text>
                  </View>
                )
              }
              {this.state.returnAmount >= 0 && (
                <>
                  <View style={{ flexDirection: "row", justifyContent: 'space-between', marginLeft: Device.isTablet ? 20 : 10, marginRight: Device.isTablet ? 20 : 10 }}>
                    <Text style={{
                      color: "#353C40", fontFamily: "bold", alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                      fontSize: 16,
                    }}>Collected Amount </Text>
                    <Text style={{
                      color: "#353C40", fontFamily: "bold", alignItems: 'center', fontSize: 20, justifyContent: 'center', textAlign: 'center',
                      fontSize: 16,
                    }}>
                      ₹ {parseFloat(this.state.recievedAmount).toString()} </Text>
                  </View>

                  <View style={{ flexDirection: "row", justifyContent: 'space-between', marginLeft: Device.isTablet ? 20 : 10, marginRight: Device.isTablet ? 20 : 10 }}>
                    <Text style={{
                      color: "#FFAF4C", fontFamily: "bold", alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                      fontSize: 16,
                    }}>
                      Return Amount </Text>
                    <Text style={{
                      color: "#FFAF4C", fontFamily: "bold", alignItems: 'center', fontSize: 20, justifyContent: 'center', textAlign: 'center',
                      fontSize: 16,
                    }}>
                      ₹ {parseFloat(this.state.returnAmount).toString()} </Text>
                  </View>
                </>)}
              {
                this.state.couponAmount > 0 && (
                  <View style={{ flexDirection: "row", justifyContent: 'space-between', marginLeft: Device.isTablet ? 20 : 10, marginRight: Device.isTablet ? 20 : 10 }}>
                    <Text style={{
                      color: "#2ADC09", fontFamily: "medium", alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                      fontSize: Device.isTablet ? 19 : 14,
                    }}>
                      Coupon Applied </Text>
                    <Text style={{
                      color: "#2ADC09", fontFamily: "medium", alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                      fontSize: Device.isTablet ? 19 : 14,
                    }}>
                      ₹  {this.state.couponAmount} </Text>
                  </View>
                )
              }

              {this.state.isRTApplied === true && (
                <View style={{ flexDirection: "row", justifyContent: 'space-between', marginLeft: Device.isTablet ? 20 : 10, marginRight: Device.isTablet ? 20 : 10 }}>
                  <Text style={{
                    color: "#2ADC09", fontFamily: "medium", alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                    fontSize: Device.isTablet ? 19 : 14,
                  }}>
                    RT Amount </Text>
                  <Text style={{
                    color: "#2ADC09", fontFamily: "medium", alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                    fontSize: Device.isTablet ? 19 : 14,
                  }}>
                    ₹  {this.state.rtAmount} </Text>
                </View>
              )}

              <View></View>
              <View style={styles.TopcontainerforPay}>
                <TouchableOpacity
                  style={[styles.signInButton, {
                    backgroundColor: !this.state.payButtonEnable ? color.disableBackGround : color.accent
                  }]}
                  disabled={!this.state.payButtonEnable}
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



const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    // backgroundColor: '#FAFAFF'
  },
  subContainer: {
    backgroundColor: '#FFFFFF'
  },
  filterMainContainer: {
    marginLeft: -40,
    marginRight: -40,
    backgroundColor: '#ffffff',
    paddingLeft: Device.isTablet ? 0 : 20,
    marginTop: Device.isTablet ? deviceheight - 400 : deviceheight - 300,
    height: Device.isTablet ? 500 : 440,
  },
  modelCloseImage: {
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
    // height: 50,
    // position: 'absolute',
    // bottom: 0,
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
    color: '#353C40',
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
    backgroundColor: '#e9ecef',
    borderWidth: 1,
    fontFamily: 'regular',
    paddingLeft: 15,
    fontSize: Device.isTablet ? 19 : 14,
    color: "#212529"
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
