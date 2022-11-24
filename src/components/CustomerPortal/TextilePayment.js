import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { Component } from 'react';
import { Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Device from 'react-native-device-detection';
import I18n from 'react-native-i18n';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal from "react-native-modal";
import { Appbar, RadioButton, TextInput } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import RazorpayCheckout from 'react-native-razorpay';
import { Chevron } from 'react-native-shapes';
import forms from '../../commonUtils/assets/styles/formFields.scss';
import scss from '../../commonUtils/assets/styles/style.scss';
import Loader from '../../commonUtils/loader';
import PrintService from '../../commonUtils/Printer/printService';
import { customerErrorMessages } from '../Errors/errors';
import Message from '../Errors/Message';
import CustomerService from '../services/CustomerService';
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
      manualDisc: 0,
      loading: false,
      clientId: 0,
      isTagCustomer: false,
      khataToCustomerModel: false,
      kathaModelVisible: false,
      upiToCustomerModel: false,
      kathaColleted: 0,
      upiModelVisible: false,
      upiMobileNumber: '',
      paymentType: [],
      rtNumber: 'RT1669288067773',
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
      payCreditAmount: 200,
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
      khataAmount: 0,
      payingAmount: 0,
      grandNetAmount: 0,
      showVerified: false,
      billLevelDisc: 0,
      isBillLevelDisc: false,
      isCheckPromo: false,
      totalManualDisc: 0,
      discReasons: [],
      discountAmountValid: true,
      errors: {},
      netPayableAmount: 0,
      isBillLevel: false,
      isCreditConfirm: false
    };
  }

  async componentDidMount() {
    var domainStringId = "";
    var storeStringId = "";
    const userId = await AsyncStorage.getItem("userId");
    const clientId = await AsyncStorage.getItem("custom:clientId1");
    const isEsSlipEnabled = await AsyncStorage.getItem('custom:isEsSlipEnabled');
    this.setState({ createdBy: userId, clientId: clientId, isEstimationEnable: isEsSlipEnabled });
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
      taxAmount: this.props.route.params.taxAmount,
      userId: this.props.route.params.userId,
      retailBarCodeList: this.props.route.params.retailBarCodeList,
      dsNumberList: this.props.route.params.dsNumberList,
      customerFullName: this.props.route.params.customerFullName,
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
      isCreditFlag: this.props.route.params.isCredit,
      grandNetAmount: this.props.route.params.grandNetAmount,
      billLevelDisc: this.props.route.params.discountAmount
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
    this.getDiscountReasons();
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
      this.setState({
        payingAmount: this.state.grandNetAmount + this.state.rtAmount,
        // totalAmount: (parseFloat(this.state.totalAmount) - parseFloat(this.state.redeemedPints / 10)).toString() + this.state.rtAmount
      });
    }
    // if (this.state.totalAmount > 0) {
    //   this.setState({
    //     grandNetAmount: this.state.grandNetAmount - this.state.khataAmount,
    //     payingAmount: parseFloat(this.state.totalAmount) - parseFloat(this.state.khataAmount)
    //   }, () => {
    //     this.cancelKathaModel();
    //   });
    // }
    if (parseFloat(this.state.khataAmount) <= parseFloat(this.state.netPayableAmount)) {
      if (parseFloat(this.state.khataAmount) === parseFloat(this.state.grandNetAmount)) {
        this.setState({
          payButtonEnable: true,
          enableCoupon: false,
          enablePayment: false, isCheckPromo: true, isBillLevel: true, grandNetAmount: 0.0,
          kathaColleted: parseFloat(this.state.khataAmount)
        }, () => {
          this.cancelKathaModel();
        })
      } else {
        console.log(this.state.grandNetAmount);
        console.log(this.state.khataAmount);
        let netPayableAmt = parseFloat(this.state.grandNetAmount) - parseFloat(this.state.khataAmount);
        let grandNetAmount = parseFloat(netPayableAmt)
        this.setState({
          grandNetAmount: (grandNetAmount.toFixed(2)),
          payingAmount: parseFloat(this.state.netPayableAmount) - parseFloat(this.state.khataAmount),
          kathaColleted: parseFloat(this.state.khataAmount)
        }, () => {
          this.cancelKathaModel();
          if (this.state.netPayableAmount === 0) {
            this.setState({ enablePayment: true })
          }
        })
      }
    } else {
      alert("cannot proceed")
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
    const obj = {
      "paymentType": "PKTADVANCE",
      "paymentAmount": this.state.payCreditAmount
    }
    this.state.paymentType.push(obj);
    var grandNetAmount = parseFloat(this.state.grandNetAmount)
    // if (this.state.payCreditAmount > grandNetAmount) {
    //   alert("please check the value")
    if (parseFloat(this.state.payCreditAmount) < grandNetAmount) {
      const amount = grandNetAmount - this.state.payCreditAmount;
      this.state.grandNetAmount = parseFloat(amount);
      this.setState({ isPayment: true, isreturnCreditCash: true, balanceCreditAmount: amount, grandNetAmount: parseFloat(amount).toFixed(2) }, () => {
        // if (this.state.isRTApplied) {
        //   this.setState({ payingAmount: this.state.payCreditAmount + this.state.rtAmount, payButtonEnable: true })
        // }
      })
    } else if (parseFloat(this.state.payCreditAmount) === grandNetAmount) {
      this.setState({ isPayment: true, payButtonEnable: true, isCheckPromo: true, isBillLevel: true, isTagCustomer: true })
      // const obj = {
      //   "paymentType": "PKTADVANCE",
      //   "paymentAmount": this.state.payCreditAmount
      // }
      // this.state.paymentType.push(obj);
    }
    // this.setState({ recievedAmount: this.state.payCreditAmount, payingAmount: this.state.payCreditAmount })
    // const grandAmount = grandNetAmount >= this.state.payCreditAmount ? grandNetAmount - this.state.payCreditAmount : 0
    // this.setState({ isCreditAmount: true });
    // if (this.state.isRTApplied) {
    //   this.setState({ payingAmount: grandNetAmount + this.state.rtAmount, payButtonEnable: true })
    // }
    this.setState({ payingAmount: this.state.payCreditAmount })
    this.setState({ isCreditAmount: true, creditAmount: this.state.creditAmount });
    const grandAmount = this.state.grandNetAmount > this.state.payCreditAmount ? this.state.grandNetAmount - this.state.payCreditAmount : 0
    if (this.state.totalAmount === 0) {
      this.setState({
        enableCoupon: false, payButtonEnable: true,
        isProccedtoCheck: true, enablePayment: false, isCheckPromo: true, isBillLevel: true, isTagCustomer: true
      })
    }
    this.cancelCreditModel();
    // this.pay()
  }

  cancelCreditModel() {
    this.setState({ creditModelVisible: false });
  }

  saveCard() {
    this.setState({})
    var grandNetAmount = (parseFloat(this.state.totalAmount) - parseFloat(this.state.redeemedPints / 10)).toString()
    if (this.state.cardPaymentType === "Automatic") {
      this.getCardModel()
      this.cancelCardModel()
    } else {
      this.setState({ cashAmount: parseFloat(grandNetAmount) })
      this.manualCardPayment()
    }
  }

  getCardModel = () => {
    var grandNetAmount = (parseFloat(this.state.totalAmount) - parseFloat(this.state.redeemedPints / 10) - parseFloat(this.state.verifiedCash)).toString()
    this.setState({ payingAmount: grandNetAmount })
    this.setState({
      isCard: true,
    },
      () => {
        if (this.state.isreturnCreditCash) {
          this.setState({ grandNetAmount: this.state.balanceCreditAmount })
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
      "paymentAmount": parseFloat(this.state.grandNetAmount)
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
      returnAmount: 0,
      verifiedCash: 0
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
    this.setState({ flagCustomerOpen: false, flagqtyModelOpen: false, modalVisible: false });
    //this.setState({ modalVisible: true });
  }

  endEditing() {
    if (this.state.customerPhoneNumber.length > 0) {
      this.getUserDetails();
    }
  }

  qrAction() {
    this.setState({
      isCash: false,
      isCard: false,
      isCardOrCash: true,
      isUpi: false,
      isGv: false,
      isKhata: false,
      payButtonEnable: true,
      isCredit: false,
      recievedAmount: 0,
      returnAmount: 0,
      verifiedCash: 0
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
      // payButtonEnable: this.state.grandNetAmount == 0 ? true : false,
      isCredit: false,
      recievedAmount: 0,
      returnAmount: 0
    });
  }

  creditAction() {
    this.setState({
      creditModel: true,
      // payCreditAmount: (parseFloat(this.state.totalAmount) - parseFloat(this.state.redeemedPints / 10)).toString(),
      creditModelVisible: true,
      isCash: false,
      isCard: false,
      isCardOrCash: false,
      isUpi: false,
      isGv: false,
      isKhata: false,
      isCredit: true,
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
    if (this.state.isCardOrCash === true) {
      let grandNetAmount = (parseFloat(this.state.grandNetAmount))
      this.setState({ ccCardCash: grandNetAmount - text })
    }
  };

  handleGVNumber = (text) => {
    this.setState({ gvNumber: text, giftvoucher: text });
  };

  verifycash() {
    const cash = parseInt(this.state.payCreditAmount) + parseInt(this.state.balanceCreditAmount)
    this.setState({
      balanceCreditAmount: 0,
      // cashAmount:  parseInt(this.state.payCreditAmount) + parseInt(this.state.balanceCreditAmount),
      recievedAmount: cash ? cash : this.state.recievedAmount,
      payCreditAmount: parseInt(this.state.payCreditAmount) + parseInt(this.state.balanceCreditAmount)
    })
    const grandNetAmount = this.state.grandNetAmount
    if (this.state.isCash === true && this.state.isCardOrCash === false) {
      if (parseFloat(this.state.recievedAmount) > parseFloat(this.state.grandNetAmount)) {
        this.setState({ returnAmount: parseFloat(this.state.recievedAmount) - parseFloat(this.state.grandNetAmount) });
        this.state.returnAmount = ((this.state.returnAmount).toFixed(2))
        this.setState({ verifiedCash: parseFloat(this.state.totalAmount), payingAmount: grandNetAmount, grandNetAmount: 0, showVerified: true });
      } else if (parseFloat(this.state.recievedAmount) === parseFloat(this.state.grandNetAmount)) {
        this.setState({
          isPayment: false, returnAmount: parseFloat(this.state.recievedAmount) - parseFloat(this.state.grandNetAmount), showVerified: true,
          payingAmount: this.state.grandNetAmount, grandNetAmount: 0,
        });
      } else if (parseFloat(this.state.recievedAmount) < grandNetAmount || parseFloat(this.state.recievedAmount) !== "") {
        alert('Please collect sufficient amount');
        this.setState({ showVerified: false })
      } else {
        this.state.verifiedCash = 0;
        this.state.returnAmount = 0;
        this.state.grandNetAmount = 0;
        this.state.receivedAmount = 0;
        this.setState({ isCash: false });
      }
      if (this.state.isreturnCreditCash) {
        this.setState({ grandNetAmount: this.state.balanceCreditAmount })
      }
      const obj = {
        "paymentType": "Cash",
        "paymentAmount": parseFloat(this.state.grandNetAmount)
      };
      this.state.paymentType.push(obj);
      if (this.state.grandNetAmount !== 0 || this.state.totalAmount === 0) {
        this.setState({ isProccedtoCheck: true, enablePayment: false, isCheckPromo: true, isBillLevel: true })
      }
    }
    else if (this.state.isCardOrCash === true) {
      if ((parseFloat(this.state.recievedAmount) < (parseFloat(this.state.grandNetAmount)))) {
        this.setState({
          // cardModelVisible: true,
          payingAmount: grandNetAmount,
          // cardAutoModel: true, 
          verifiedCash: this.state.recievedAmount,
          grandNetAmount: 0, showVerified: true
        });
        this.pay()
      } else {
        alert(" Collected Cash Should be less than payable amount when it comes to Cash & Card Payment")
      }

    }
    if (this.state.isreturnCreditCash) {
      this.setState({ grandNetAmount: this.state.balanceCreditAmount })
    }
  }

  async applyPromocode() {
    const gvNumbers = [];
    const obj = {
      gvNumber: this.state.promocode
    };
    gvNumbers.push(obj);
    let count = 0
    this.state.giftCouponsList.length > 0 && this.state.giftCouponsList.map((item) => {
      if (item.gvNumber === this.state.promocode) {
        return count = 1
      }
    })
    if (this.state.promocode !== "") {
      if (count != 1) {
        NewSaleService.getCoupons(this.state.clientId, gvNumbers).then(res => {
          if (Array.isArray(res.data.result)) {
            let grandAmount = this.state.totalAmount;
            const couponsListList = res.data.result.map((item) => {
              if (grandAmount > item.value) {
                grandAmount = grandAmount - item.value;
              } else if (grandAmount === item.value) {
                this.setState({
                  isCouponApplied: false,
                }, () => {
                  this.setState({
                    enablePayment: false,
                    isCheckPromo: true, isBillLevel: true, isTagCustomer: true
                  })
                });
              } else {
                alert("Please purchase greater than coupon amount");
                // this.setState({ promocode: "" });
              }
              this.setState({
                totalAmount: grandAmount,
                grandNetAmount: this.state.grandNetAmount - item.value,
                couponAmount: this.state.couponAmount + item.value
              });
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
                isCheckPromo: true,
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
        this.setState({ promocode: '' })
      }
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
    this.setState({ verifiedCash: 0, recievedAmount: 0, returnAmount: 0 });
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
    var grandNetAmount = (parseFloat(this.state.totalAmount) - parseFloat(this.state.redeemedPints / 10)).toString();
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
    else if (this.state.isCash === true && this.state.isCardOrCash === false && parseFloat(this.state.recievedAmount) < (parseFloat(this.state.totalAmount) - parseFloat(this.state.redeemedPints / 10))) {
      alert('Please collect sufficient amount and then only pay');
    }
    else if (this.state.isCardOrCash === true && this.state.verifiedCash === "") {
      alert('Please collect some cash amount for ccpay');
    }
    else if (this.state.isUpi === true) {
      // this.getPaymentResposne()
      const obj = {
        "amount": (parseFloat(this.state.totalAmount) - parseFloat(this.state.redeemedPints / 10)).toString(),
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
        // console.log("UPI response", response);
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
    // else if (this.state.isCash === true) {
    //   const obj = {
    //     "paymentType": "Cash",
    //     "paymentAmount": parseFloat(this.state.grandNetAmount)
    //   };
    //   this.state.paymentType.push(obj);
    // }
    // else if (this.state.isCardOrCash === true) {
    //   const obj = {

    //   };
    //   this.state.paymentType.push(obj);
    // }
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
    let cCData
    if (this.state.isCardOrCash === true) {
      let paymentType = [{
        "paymentType": "Cash",
        "paymentAmount": parseFloat(this.state.recievedAmount)
      },
      {
        "paymentType": "Card",
        "paymentAmount": this.state.ccCardCash
      }]
      cCData = this.state.paymentType.concat(paymentType)
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
      "netPayableAmount": this.state.payingAmount,
      "offlineNumber": null,
      "mobileNumber": this.state.customerPhoneNumber,
      "customerFullName": this.state.customerFullName,
      "customerName": this.state.customerName,
      "userId": this.state.userId,
      "sgst": this.state.SGST,
      "cgst": this.state.CGST,
      "dlSlip": this.state.dsNumberList,
      "lineItemsReVo": this.state.barCodeList,
      "createdBy": this.state.createdBy,
      "recievedAmount": this.state.recievedAmount,
      "returnAmount": this.state.returnAmount,
      "paymentAmountType":
        this.state.isCardOrCash === true ?
          cCData :
          this.state.paymentType,
      "returnSlipNumbers": this.state.numRtList,
      "returnSlipAmount": (this.state.rtAmount === null ? 0 : this.state.rtAmount),
      "gvAppliedAmount": (this.state.couponAmount === null ? 0 : this.state.couponAmount),
      "gvNumber": couponCode,
      "totalAmount": (parseFloat(this.state.totalAmount) - parseFloat(this.state.redeemedPints / 10)).toString(),
      "withoutTaxTotal": this.state.netPayableAmount,
      "TotalAmTax": this.state.totalAmount,
      "TaxIncExc": this.state.isTaxIncluded
    };
    console.log(" payment cash method data", obj);
    let invoiceTax = []
    invoiceTax.push(obj)
    if (this.state.isCard === true) {
      delete obj.paymentAmountType
    }
    axios.post(NewSaleService.createOrder(), obj).then((res) => {
      console.log("Invoice data", JSON.stringify(res.data));
      if (res.data && res.data["isSuccess"] === "true") {

        // PrintService('INVOICE', res.data.result, this.state.barCodeList, invoiceTax)

        // const cardAmount = this.state.isCard || this.state.isCardOrCash ? JSON.stringify(Math.round(this.state.ccCardCash)) : JSON.stringify((parseFloat(this.state.totalAmount) - parseFloat(this.state.redeemedPints / 10)).toString());
        alert("Order created " + res.data["result"]);
        if (this.state.isKhata === true) {
          this.props.route.params.onGoBack();
          this.props.navigation.goBack();
        }
        if (this.state.cardManual === true) {
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
            "amount": (parseFloat(this.state.totalAmount) - parseFloat(this.state.redeemedPints / 10)),
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
        // console.log('params aresdasd', obj);
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
          // console.log("options data", options);
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
    //                     "netPayableAmount": (parseFloat(this.state.totalAmount ) -  parseFloat(this.state.redeemedPints / 10)).toString(),
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
      this.setState({ loading: true });
      axios.post(PromotionsService.searchLoyaltyPoints(),
        params).then((res) => {
          if (res.data && res.data["isSuccess"] === "true") {
            this.setState({ loading: false });
            let len = res.data["result"].length;
            // console.log(res.data["result"]);
            if (len > 0) {
              for (let i = 0; i < len; i++) {
                let number = res.data["result"][i];
                this.setState({ loyaltyPoints: number.loyaltyPoints });

                // console.log(this.state.loyaltyPoints);
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
        // console.log(res.data);
        alert(res.data.message);
      }
      this.setState({ modelVisible: false, gvNumber: "" });
    });
  }

  async applyRt() {
    const obj = this.state.rtNumber
    if (this.state.compareRTList.length === 0) {
      // console.log("in if", this.state.compareRTList, this.state.listOfRtnum);
      this.setState({
        compareRTList: [...this.state.listOfRtnum, obj],
      })
    } else {
      // console.log("in else", this.state.rtListList);
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
    var grandNetAmount = parseFloat(this.state.grandNetAmount);
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
          if (grandNetAmount > sumreturnedAmout) {
            this.setState({
              isRTnumAplied: false,
              rtAmount: sumreturnedAmout,
              payingAmount: parseFloat(this.state.rtAmount - grandNetAmount).toFixed(2),
              // totalAmount: grandNetAmount - sumreturnedAmout,
              payButtonEnable: grandNetAmount - sumreturnedAmout === 0 ? true : false,
              isRTApplied: true,
              isCheckPromo : true,
              grandNetAmount: parseFloat(this.state.grandNetAmount - sumreturnedAmout).toFixed(2)
            })
          } else if (grandNetAmount === sumreturnedAmout) {
            this.setState({
              isRTnumAplied: false,
              rtAmount: sumreturnedAmout,
              payingAmount: parseFloat(this.state.rtAmount - grandNetAmount).toFixed(2),
              // totalAmount: grandNetAmount - sumreturnedAmout,
              payButtonEnable: grandNetAmount - sumreturnedAmout === 0 ? true : false,
              isRTApplied: true,
              grandNetAmount: parseFloat(this.state.grandNetAmount - sumreturnedAmout).toFixed(2),
              isCheckPromo: true, isBillLevel: true, isTagCustomer: true
            })
          }
          else {
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

  checkPromo() {
    let costPrice = 0;
    let discount = 0;
    let total = 0;
    let discAppliedTotal = 0;
    const { storeId, domainId, barCodeList } = this.state;
    const requestObj = barCodeList.map((item) => {
      let obj = {};
      obj.actualValue = item.actualValue;
      obj.barCode = item.barCode;
      obj.cgst = item.cgst;
      obj.discount = item.promoDiscount;
      obj.division = item.division;
      obj.domainId = item.domainId;
      obj.grossValue = item.grossValue;
      obj.hsnCode = item.hsnCode;
      obj.itemPrice = item.itemPrice;
      obj.lineItemId = item.lineItemId;
      obj.netValue = item.netValue;
      obj.quantity = item.quantity;
      obj.section = item.section;
      obj.sgst = item.sgst;
      obj.storeId = item.storeId;
      obj.subSection = item.subSection;
      obj.taxValue = item.taxValue;
      obj.userId = item.userId;
      obj.costPrice = item.costPrice;
      obj.uom = item.uom;
      obj.originalBarcodeCreatedAt = item.createdDate;
      obj.batchNo = item.batchNo;
      obj.promoDiscount = 0;
      return obj;
    });
    if (this.state.isEstimationEnable === "true") {
      CustomerService.getinvoiceLevelCheckPro(1, storeId, requestObj,).then((res) => {
        if (res.status === 200) {
          this.setState({
            barCodeList: res.data.result,
            isCheckPromo: true,
          });

          this.state.barCodeList.forEach((barCode, index) => {
            costPrice = costPrice + barCode.itemPrice;
            discount = discount + barCode.totalPromoDiscount;
            total = total + barCode.netValue;
          });

          discount = discount + this.state.manualDisc;
          discAppliedTotal = this.state.grandNetAmount - discount;
          this.setState({
            netPayableAmount: (total.toFixed(2)),
            totalPromoDisc: (discount.toFixed(2)),
            grossAmount: costPrice,
            grandNetAmount: (discAppliedTotal.toFixed(2))
          });
          if (this.state.barCodeList.length > 0) {
            this.setState({ enablePayment: true });
          }

          // this.getTaxAmount();
        } else {
          alert("no Promo Available");
          this.setState({ isCheckPromo: true });
        }
      });
    } else {
      CustomerService.getCheckPromoAmount(storeId, 1, barCodeList).then(res => {
        let calculatedDisc = res.data.result.calculatedDiscountVo;
        if (res.status === 200) {
          this.setState({
            isCheckPromo: true
          });
        }
        if (res?.data && res?.data?.result[0].calculatedDiscountVo) {
          this.setState({ promoDisc: res?.data?.result });
          this.state.barCodeList.forEach(barcodeData => {
            this.state.promoDisc.forEach(promo => {
              if (barcodeData.barcode === promo.barcode) {
                if (promo.calculatedDiscountVo) {
                  if (promo.calculatedDiscountVo.discountAvailable) {
                    if (promo.calculatedDiscountsVo.thisFixedAmountDiscount) {
                      barcodeData.itemDiscount = parseInt(promo.calculatedDiscountVo.calculatedDiscount);
                      barcodeData.totalMrp = barcodeData.totalMrp - barcodeData.itemDiscount;
                    }
                    else {
                      barcodeData.itemDiscount = parseInt(promo.calculatedDiscountsVo.calculatedDiscount);
                      barcodeData.totalMrp = barcodeData.totalMrp - barcodeData.itemDiscount;
                    }
                  }
                } else {
                  barCodeData.itemDiscount = "No discount";
                }
              }
            });
          });
          // this.setState({ barList: this.state.barList }, () => {
          // this.calculateTotal();
          // });
        } else {
          alert("No Promo Available");
        }
      });
    }
    this.setState({ handleBillDiscount: false })
  }

  getDiscountReasons() {
    axios.get(CustomerService.getDiscountReasons()).then((res) => {
      if (res.status === 200) {
        //this.setState({discReasons: res.data});
        const discount = res.data.result;
        discount.forEach((dis, index) => {
          const obj = {
            value: dis,
            label: dis,
          };
          this.state.discReasons.push(obj);
        });
      } else {
        alert(res.data);
      }
    }).catch(() => {
      this.setState({ loading: false });
      // alert('Error with getting discount reasons');
    });
  }

  billDiscountModelCancel() {
    this.setState({
      reasonDiscount: '', discApprovedBy: '', manualDisc: '',
      discountAmountValid: true, modalVisible: false, billmodelPop: false
    });
  }

  handleDiscountAmount(value) {
    this.setState({ manualDisc: value });
  }

  handleApprovedBy(text) {
    this.setState({ approvedBy: text });
  }

  handleDiscountReason = (value) => {
    this.setState({ reasonDiscount: value });
  };

  billValidation() {
    let isFormValid = true;
    let errors = {};
    if (parseFloat(this.state.manualDisc) > parseFloat(this.state.netPayableAmount)) {
      isFormValid = false;
      errors["discountAmount"] = customerErrorMessages.discountAmount;
      this.setState({ discountAmountValid: false });
    }
    this.setState({ errors: errors });
    return isFormValid;
  }

  billDiscount() {
    const isFormValid = this.billValidation();
    console.log("manualDiscmanualDisc", this.state.manualDisc, this.state.totalAmount);
    if (isFormValid) {
      if (this.state.manualDisc === 0 || this.state.approvedBy === "" || this.state.reasonDiscount === "") {
        alert("Please enter all fields");
        this.setState({ isBillLevel: false })
      } else {
        // this.state.netPayableAmount = 0;
        const totalDisc = parseFloat(this.state.manualDisc);
        if (totalDisc < this.state.grandNetAmount) {
          const netPayableAmount = this.state.grandNetAmount - totalDisc;
          this.setState({ grandNetAmount: netPayableAmount });
          this.state.grandNetAmount = (netPayableAmount.toFixed(2));
          // this.getTaxAmount();
        }
        const promDisc = parseInt(this.state.manualDisc) + this.state.totalPromoDisc;
        this.setState({
          showDiscReason: true, promoDiscount: promDisc, isCheckPromo: false,
          billmodelPop: false, modalVisible: false, isBillLevel: true
        });
      }
    }
    console.log("manualDiscmanualDisc after", this.state.manualDisc, this.state.totalAmount);
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

            <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'medium', color: '#828282', marginLeft: 10, marginTop: 15 }}> SELECT A MODE TO PAY ₹ {(parseFloat(this.state.totalAmount) - parseFloat(this.state.redeemedPints / 10)).toString()} </Text>
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
                      <Image source={this.state.isCash ? require('../assets/images/cashselect.png') : require('../assets/images/cashunselect.png')} style={{
                        marginLeft: Device.isTablet ? 15 : 0, marginTop: Device.isTablet ? 10 : 0,
                      }} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 15, alignItems: 'center', alignSelf: 'center', marginTop: 0, fontSize: Device.isTablet ? 19 : 14, color: this.state.isCash ? "#ED1C24" : "#22222240", fontFamily: 'regular' }}>
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

            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity style={[forms.button_active, { backgroundColor: this.state.isBillLevel ? color.disableBackGround : color.accent }]}
                onPress={() =>
                  this.setState({ billmodelPop: true, modalVisible: true })
                }
                disabled={this.state.isBillLevel}>
                <Text style={forms.button_text}>
                  {"Bill Level Discount"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={[forms.button_active, { backgroundColor: this.state.isBillLevel || this.state.isCheckPromo ? color.disableBackGround : color.accent }]}
                onPress={() => {
                  this.checkPromo();
                }}
                disabled={this.state.isBillLevel || this.state.isCheckPromo}>
                <Text style={forms.button_text}>
                  {"Check Promo Disc"}
                </Text>
              </TouchableOpacity>
            </View>
            {
              this.state.billmodelPop && (
                <View>
                  <Modal style={{ margin: 0 }} isVisible={this.state.billmodelPop}
                    onBackButtonPress={() => this.billDiscountModelCancel()}
                    onBackdropPress={() => this.billDiscountModelCancel()}
                  >
                    <View style={[forms.filterModelContainer, { width: '100%' }]}>
                      <Text style={forms.popUp_decorator}>-</Text>
                      <View style={forms.filterModelSub}>
                        <TextInput
                          style={forms.input_fld}
                          mode="flat"
                          activeUnderlineColor='#000'
                          underlineColor={'#6f6f6f'}
                          label={I18n.t("AMOUNT *")}
                          keyboardType={'numeric'}
                          value={this.state.manualDisc}
                          onChangeText={(text) =>
                            this.handleDiscountAmount(text)
                          }
                        />
                        {!this.state.discountAmountValid && (
                          <Message imp={true} message={this.state.errors["discountAmount"]} />
                        )}

                        <TextInput
                          style={forms.input_fld}
                          mode="flat"
                          activeUnderlineColor='#000'
                          underlineColor={'#6f6f6f'}
                          label={I18n.t("APPROVED BY *")}
                          value={this.state.approvedBy}
                          onChangeText={(text) => this.handleApprovedBy(text)}
                        />
                        <View style={[Device.isTablet ? styles.rnSelectContainer_tablet : styles.rnSelectContainer_mobile, { width: "92%" }]}>
                          <RNPickerSelect
                            placeholder={{ label: 'REASON *', value: '' }}
                            Icon={() => {
                              return <Chevron style={styles.imagealign} size={1.5} color="gray" />;
                            }}
                            items={
                              this.state.discReasons
                            }
                            onValueChange={this.handleDiscountReason}
                            style={Device.isTablet ? pickerSelectStyles_tablet : pickerSelectStyles_mobile}
                            value={this.state.reasonDiscount}
                            useNativeAndroidPickerStyle={false}
                          />
                        </View>
                        <View style={forms.action_buttons_container}>
                          <TouchableOpacity style={[forms.action_buttons, forms.submit_btn]}
                            onPress={() => this.billDiscount()}>
                            <Text style={forms.submit_btn_text} >{I18n.t("CONFIRM")}</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={[forms.action_buttons, forms.cancel_btn]}
                            onPress={() => this.billDiscountModelCancel()}>
                            <Text style={forms.cancel_btn_text}>{I18n.t("CANCEL")}</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </Modal>
                </View >
              )
            }

            {this.state.isBillLevel === false &&
              <>
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

              </>}

            {this.state.isBillLevel === false && <View>
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
                maxLength={8}

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
            </View>
            }
            {(this.state.isCash === true || this.state.isCardOrCash === true) && (
              <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'medium', color: '#828282', marginLeft: 10, marginTop: 10 }}> {('CASH SUMMARY')} </Text>
            )}

            {(this.state.isCash === true || this.state.isCardOrCash === true) && (
              <TextInput style={styles.input}
                underlineColor="transparent"
                activeUnderlineColor='#000'
                label="Recieved Amount"
                keyboardType='numeric'
                value={this.state.recievedAmount}
                //  onEndEditing
                onChangeText={(text) => this.handlerecievedAmount(text)} />
              // onEndEditing={() => this.endEditing()}
            )}

            {(this.state.isCash === true || this.state.isCardOrCash === true) && (
              <TouchableOpacity
                style={{ backgroundColor: '#FFffff', borderRadius: 5, width: Device.isTablet ? 100 : 90, height: Device.isTablet ? 42 : 32, borderColor: this.state.showVerified === true ? '#28D266' : "#ED1C24", borderWidth: 1, right: 10, alignSelf: 'flex-end', marginTop: Device.isTablet ? -47 : -37 }}
                onPress={() => this.verifycash()} >
                {this.state.showVerified ?
                  <>
                    <Image style={{ position: 'absolute', right: Device.isTablet ? 83 : 68, top: Device.isTablet ? 11 : 9 }} source={require('../assets/images/applied.png')} />
                    <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#28D266', marginLeft: 10, marginTop: 8, alignSelf: 'center' }}> {('VERIFIED')} </Text>
                  </> :
                  <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#ED1C24', marginLeft: 10, marginTop: 8, alignSelf: 'center' }}> {('VERIFY')} </Text>}
              </TouchableOpacity>
            )}

            {/* {(this.state.isCash === true || this.state.isCardOrCash === true) && this.state.giftvoucher !== "" && this.state.loyaltyPoints !== "" && this.state.verifiedCash === 0 && (
              <TouchableOpacity
                style={{ backgroundColor: '#FFffff', borderRadius: 5, width: Device.isTablet ? 100 : 90, height: Device.isTablet ? 42 : 32, borderColor: this.state.showVerified === true ? '#28D266' : "#ED1C24", borderWidth: 1, right: 10, alignSelf: 'flex-end', marginTop: Device.isTablet ? -47 : -37 }}
                onPress={() => this.verifycash()} >
                {this.state.showVerified === true ?
                  <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#28D266', marginLeft: 10, marginTop: 8, alignSelf: 'center' }}> {('VERIFIED')} </Text> :
                  <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#ED1C24', marginLeft: 10, marginTop: 8, alignSelf: 'center' }}> {('VERIFY')} </Text>}
              </TouchableOpacity>
            )}

            {(this.state.isCash === true || this.state.isCardOrCash === true) && this.state.giftvoucher !== "" && this.state.loyaltyPoints === "" && this.state.verifiedCash === 0 && (
              <TouchableOpacity
                style={{ backgroundColor: '#FFffff', borderRadius: 5, width: Device.isTablet ? 100 : 90, height: Device.isTablet ? 42 : 32, borderColor: this.state.showVerified === true ? '#28D266' : "#ED1C24", borderWidth: 1, right: 10, alignSelf: 'flex-end', marginTop: Device.isTablet ? -47 : -37 }}
                onPress={() => this.verifycash()} >
                {this.state.showVerified === true ?
                  <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#28D266', marginLeft: 10, marginTop: 8, alignSelf: 'center' }}> {('VERIFIED')} </Text> :
                  <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#ED1C24', marginLeft: 10, marginTop: 8, alignSelf: 'center' }}> {('VERIFY')} </Text>}
              </TouchableOpacity>
            )}

            {(this.state.isCash === true || this.state.isCardOrCash === true) && this.state.giftvoucher === "" && this.state.loyaltyPoints !== "" && this.state.verifiedCash === 0 && (
              <TouchableOpacity
                style={{ backgroundColor: '#FFffff', borderRadius: 5, width: Device.isTablet ? 100 : 90, height: Device.isTablet ? 42 : 32, borderColor: this.state.showVerified === true ? '#28D266' : "#ED1C24", borderWidth: 1, right: 10, alignSelf: 'flex-end', marginTop: Device.isTablet ? -47 : -37 }}
                onPress={() => this.verifycash()} >
                {this.state.showVerified === true ?
                  <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#28D266', marginLeft: 10, marginTop: 8, alignSelf: 'center' }}> {('VERIFIED')} </Text> :
                  <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#ED1C24', marginLeft: 10, marginTop: 8, alignSelf: 'center' }}> {('VERIFY')} </Text>}
              </TouchableOpacity>
            )} */}

            {/* {(this.state.isCash === true || this.state.isCardOrCash === true) && this.state.showVerified === true && (
              <TouchableOpacity
                style={{ backgroundColor: '#FFffff', borderRadius: 5, width: Device.isTablet ? 100 : 90, height: Device.isTablet ? 42 : 32, right: 10, alignSelf: 'flex-end', marginTop: Device.isTablet ? -47 : -37 }}
              >
                <Image style={{ position: 'absolute', right: Device.isTablet ? 83 : 68, top: Device.isTablet ? 11 : 9 }} source={require('../assets/images/applied.png')} />

                <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#28D266', marginLeft: 10, marginTop: 10, alignSelf: 'center' }}> {('VERIFIED')} </Text>

              </TouchableOpacity>
            )} */}

            {/* {(this.state.isCash === true || this.state.isCardOrCash === true) && this.state.verifiedCash !== 0 && (
              <View style={{ backgroundColor: '#ffffff', marginTop: 0 }}>
                <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'medium', color: '#ED1C24', marginLeft: 10, marginTop: 10 }}> RETURN AMOUNT  ₹{this.state.returnAmount} </Text>

              </View>
            )} */}

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
                          value={(parseFloat(this.state.totalAmount) - parseFloat(this.state.redeemedPints / 10)).toString()}
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
                            this.setState({ khataAmount: value }
                              // , () => {
                              // if (this.state.khataAmount < (parseFloat(this.state.totalAmount) - parseFloat(this.state.totalDiscount) - parseFloat(this.state.promoDiscount) - parseFloat(this.state.redeemedPints / 10)).toString()) {
                              //   this.setState({ khataAmount: value })
                              // }
                            )
                          }
                        />
                        <View style={forms.action_buttons_container}>
                          <TouchableOpacity style={
                            [forms.action_buttons, forms.submit_btn, { backgroundColor: (parseFloat(this.state.khataAmount) > this.state.grandNetAmount) && parseFloat(this.state.khataAmount) > 0 ? color.disableBackGround : color.accent }]}
                            disabled={(!parseFloat(this.state.khataAmount) > this.state.netPayableAmount) && !parseFloat(this.state.khataAmount) > 0}
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
                            this.setState({ payCreditAmount: value }, () => {
                              // if (this.state.creditAmount < this.state.payCreditAmount || this.state.creditAmount === this.state.grandNetAmount) {
                              //   this.setState({
                              //     isCreditConfirm: true
                              //   })
                              // } else {
                              //   this.setState({
                              //     isCreditConfirm: false
                              //   })
                              // }
                            })
                          }
                        // value={}
                        />
                        <View style={forms.action_buttons_container}>
                          <TouchableOpacity style={[forms.action_buttons, forms.submit_btn, { backgroundColor: (parseFloat(this.state.payCreditAmount) > (this.state.creditAmount)) || (parseFloat(this.state.payCreditAmount) > (this.state.grandNetAmount)) ? color.disableBackGround : color.accent }]}
                            disabled={(parseFloat(this.state.payCreditAmount) > (this.state.creditAmount)) || (parseFloat(this.state.payCreditAmount) > (this.state.grandNetAmount))}
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
                  <View style={forms.filterModelContainer} >
                    <Text style={forms.popUp_decorator}>-</Text>
                    <View style={forms.filterModelSub}>
                      <KeyboardAwareScrollView >
                        <Text style={scss.textStyleMedium}>GV Number:</Text>
                        <TextInput
                          style={forms.input_fld}
                          underlineColor="transparent"
                          label="GV Number"
                          activeUnderlineColor='#000'
                          value={this.state.promocode}
                          onChangeText={this.handlePromocode}
                        />
                        <View style={forms.action_buttons_container}>
                          <TouchableOpacity style={[forms.action_buttons, forms.submit_btn]}
                            onPress={() => this.applyPromocode()}>
                            <Text style={forms.submit_btn_text} >{I18n.t("APPLY")}</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={[forms.action_buttons, forms.cancel_btn]}
                            onPress={() => this.modelCancel()}>
                            <Text style={forms.cancel_btn_text}>{I18n.t("CANCEL")}</Text>
                          </TouchableOpacity>
                        </View>
                      </KeyboardAwareScrollView>
                    </View>
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
                          <Text>Amount:</Text>
                          <TextInput
                            style={forms.input_fld}
                            underlineColor="transparent"
                            activeUnderlineColor='#000'
                            editable={this.state.isCardOrCash}
                            selectTextOnFocus={false}
                            value={parseFloat(this.state.grandNetAmount)}
                          />

                          <View style={scss.radio_group}>
                            {/* <View style={scss.radio_item}>
                          <Text>Transc No:</Text>
                          <TextInput
                            style={forms.input_fld}
                            underlineColor="transparent"
                            activeUnderlineColor='#000'
                            value={this.state.transcNum}
                            onChange={() => this.handleTranscNum()}
                          />
                          {/* <View style={scss.radio_group}>
                            <View style={scss.radio_item}>
                              <RadioButton
                                value="Automatic"
                                status={this.state.cardPaymentType === 'Automatic' ? 'checked' : 'unchecked'}
                                onPress={() => this.setState({ cardPaymentType: 'Automatic' })}
                              />
                              <Text >Automatic</Text>
                            </View> */}
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
                  ₹  {this.state.totalAmount} </Text>
              </View>

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
                  ₹  {this.state.totalPromoDisc} </Text>
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
                  ₹ {this.state.grandNetAmount}
                </Text>
              </View>
              {this.state.isBillLevel &&
                <View style={{ flexDirection: "row", justifyContent: 'space-between', marginLeft: Device.isTablet ? 20 : 10, marginRight: Device.isTablet ? 20 : 10 }}>
                  <Text style={{
                    color: "#353C40", fontFamily: "medium", alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                    fontSize: Device.isTablet ? 19 : 14,
                  }}>
                    Billing Discount </Text>
                  <Text style={{
                    color: "#353C40", fontFamily: "medium", alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                    fontSize: Device.isTablet ? 19 : 14,
                  }}>
                    ₹  {this.state.manualDisc} </Text>
                </View>}

              {this.state.khataAmount > 0 &&
                <View style={{ flexDirection: "row", justifyContent: 'space-between', marginLeft: Device.isTablet ? 20 : 10, marginRight: Device.isTablet ? 20 : 10 }}>
                  <Text style={{
                    color: "#353C40", fontFamily: "medium", alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                    fontSize: Device.isTablet ? 19 : 14,
                  }}>
                    Katha Amount </Text>
                  <Text style={{
                    color: "#353C40", fontFamily: "medium", alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                    fontSize: Device.isTablet ? 19 : 14,
                  }}>
                    ₹  {this.state.khataAmount} </Text>
                </View>}

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

              {/* {
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
              } */}
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
                      ₹ {this.state.returnAmount} </Text>
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
      </View >
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
  flatListContainer: {
    marginTop: 20,
    backgroundColor: '#ffffff',
    height: Device.isTablet ? 130 : 100,
    width: deviceWidth,
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
  imagealign: {
    marginTop: Device.isTablet ? 25 : 20,
    marginRight: Device.isTablet ? 30 : 20,
  },
});

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
  },
});
