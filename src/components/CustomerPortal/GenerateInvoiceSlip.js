import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import moment from 'moment';
import React, { Component } from 'react';
import { Dimensions, FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import RNBeep from 'react-native-a-beep';
import { RNCamera } from 'react-native-camera';
import I18n from 'react-native-i18n';
import Modal from "react-native-modal";
import { TextInput } from 'react-native-paper';
import { default as MinusIcon, default as PlusIcon, default as ScanIcon } from 'react-native-vector-icons/MaterialCommunityIcons';
import forms from '../../commonUtils/assets/styles/formFields.scss';
import scss from '../../commonUtils/assets/styles/style.scss';
import PrintService from '../../commonUtils/Printer/printService';
import { RF } from '../../Responsive';
import { customerErrorMessages } from '../Errors/errors';
import Message from '../Errors/Message';
import CustomerService from '../services/CustomerService';
import { color } from '../Styles/colorStyles';
import { sucessBtn, sucessBtnText } from '../Styles/PopupStyles';
import { listEmptyMessage } from '../Styles/Styles';

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

class GenerateInvoiceSlip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileNumber: "",
      loading: false,
      totalQty: 0,
      totalAmount: 0,
      totalDiscount: 0,
      gender: "Male",
      gstNumber: "",
      dob: "2021-06-21T18:30:00.000Z",
      address: "",
      modalVisible: true,
      customerTagging: false,
      billmodelPop: false,
      customerPhoneNumber: '',
      customerEmail: '',
      customerGender: '',
      customerAddress: '',
      customerGSTNumber: '',
      domainId: 1,
      lineItemDelete: false,
      dsNumber: "",
      manualDisc: 0,
      cashAmount: 0.0,
      taxAmount: 0,
      cardAmount: 0.0,
      cardDigits: "",
      rBarCodeList: [],
      userId: null,
      dlslips: [],
      barCodeList: [],
      mobilenumber: "",
      customerName: "",
      customerEmail: "",
      customerGST: "",
      address: "",
      dropValue: "",
      grandNetAmount: 0.0,
      errors: {},
      dsNumberList: [],
      mobileData: {
        address: "",
        altMobileNo: "",
        dob: "",
        gender: "",
        gstNumber: "",
        mobileNumber: "",
        name: "",
        email: "",
        newSaleId: "",
      },
      grossAmount: 0,
      totalPromoDisc: 0,
      promoDiscount: 0,
      customerFullName: "-",
      customerMobilenumber: "",
      idClient: "",
      stateGST: 0,
      centralGST: 0,
      storeId: 0,
      errors: {},
      dsNumberValid: true,
      isEstimationEnable: false,
      dayCloseDates: [],
      compareList: [],
      dsCompareList: [],
      dsNumberList2: [],
      totalQuantity: 0,
      creditAmount: 0,
      isTaxIncluded: '',
      handleCheckPromo: false,
      mrpAmount: 0,
      isCredit: false,
      toDay: moment(new Date()).format("YYYY-MM-DD").toString(),
      isTagCustomer: false,
      showPrinter: false,
      printerIp: ""
    };
  }

  async componentDidMount() {
    this.getDiscountReasons();
    this.getHsnDetails();
    // let data = "cbnaiucs234";
    // let data1 = [];
    // let data2 = [];
    // PrintService('Invoice', data, data1, data2)
  }

  async componentWillMount() {
    const isTaxIncluded = await AsyncStorage.getItem('custom:isTaxIncluded');
    this.setState({ isTaxIncluded: isTaxIncluded })
    const storeId = await AsyncStorage.getItem("storeId");
    this.setState({ storeId: storeId });
    this.getallDates();
  }

  handleMenuButtonClick() {
    this.props.navigation.openDrawer();
  }

  cancel() {
    this.props.navigation.goBack(null);
    return true;
  }

  modelCancel() {
    this.setState({
      modalVisible: false, mobileNumber: "", billmodelPop: false, lineItemDelete: false, flagCustomerOpen: false, customerTagging: false
    });
  }

  handlenewsaledeleteaction() {
    this.setState({ modalVisible: true, lineItemDelete: true });
  }

  deleteLineItem() {
    alert("you have deleted");
  }

  onEndReached() {
    this.listRef.scrollToOffset({ offset: 0, animated: true });
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

  async getDeliverySlipDetails() {
    let costPrice = 0;
    let total = 0;
    let netTotal = 0;
    let promoDiscValue = 0;
    let scgtTotal = 0;
    let cgstTotal = 0;
    this.setState({ discountAmount: 0, netPayableAmount: 0, totalAmount: 0, promoDiscount: 0 });
    this.state.barCodeList = [];
    this.state.rBarCodeList = [];
    this.state.dsNumberList = [];
    let esNumber = this.state.dsNumber;
    let isEstimationEnable = '';
    let discount;
    const { storeId, dayCloseDates } = this.state;
    const obj = {
      "dsNumber": this.state.dsNumber.trim(),
    };
    this.state.dsNumberList.push(obj);
    console.log(this.state.dsNumberList)
    const isEsSlipEnabled = await AsyncStorage.getItem('custom:isEsSlipEnabled');
    const isTaxIncluded = await AsyncStorage.getItem('custom:isTaxIncluded');
    if (dayCloseDates.length !== 0) {
      if (this.state.dayCloseDates.length === 1 && this.state.dayCloseDates[0].dayClose.split("T")[0] === this.state.toDay) {
        if (isEsSlipEnabled === "true") {
          isEstimationEnable = true;
          this.setState({ isEstimationEnable: true });
          // if (this.state.dsCompareList.length === 0) {
          //   this.state.dsNumberList2.push(obj);
          //   this.setState({
          //     dsCompareList: [...this.state.dsNumberList2],
          //     dsNumber: this.state.dsNumberList2
          //   });
          // } else {
          //   const isFound = this.state.dsCompareList.find(element => {
          //     if (element.dsNumber === obj.dsNumber) {
          //       alert("DS Number Already Exist");
          //       this.setState({
          //         dsNumber: '',
          //       });
          //       return true;
          //     }
          //     return false;
          //   });
          //   if (!isFound) {
          //     this.state.dsNumberList2.push(obj);
          //     this.state.dsCompareList.push(this.state.dsNumberList2);
          //     const flattened = this.state.dsCompareList.flatMap(dsNumber => dsNumber);
          //     this.setState({
          //       dsCompareList: flattened,
          //       dsNumber: this.state.dsNumberList2
          //     });
          //   }
          // }
        } else {
          isEstimationEnable = false;
          this.setState({ isEstimationEnable: false });
        }
        CustomerService.getDsSlip(esNumber.trim(), isEstimationEnable, storeId).then((res) => {
          console.log("data in getDeliverySlipDetails", esNumber, isEstimationEnable, storeId);
          if (res.data) {
            if (this.state.dsCompareList.length === 0) {
              if (this.state.dsNumber.trim() === res.data.dsNumber) {
                this.state.dsNumberList2.push(obj);
                this.setState({
                  dsCompareList: [...this.state.dsNumberList2],
                  dsNumberList: this.state.dsNumberList2
                })
                console.log("dsNumberList1", this.state.dsNumberList)
              }

            } else {

              const isFound = this.state.dsCompareList.find(element => {
                if (element.dsNumber === res.data.dsNumber) {
                  alert("DS Number Alredy Exist");
                  this.setState({
                    dsNumber: '',
                  });
                  return true;
                }
                return false;


              });
              if (!isFound) {
                if (res.data.dsNumber === obj.dsNumber) {
                  this.state.dsNumberList2.push(obj);
                  this.state.dsCompareList.push(this.state.dsNumberList2);
                  const flattened = this.state.dsCompareList.flatMap(dsNumber => dsNumber);
                  this.setState({
                    dsCompareList: flattened,
                    dsNumberList: flattened
                  })
                }
                console.log("dsNumberList22", this.state.dsNumberList)
              }
            }

            RNBeep.beep();
            // console.log("getInvoiceSlip", JSON.stringify(res.data));
            if (isEstimationEnable) {
              this.state.dlslips.push(res.data.lineItems);
              const flattened = this.state.dlslips.flatMap(barCode => barCode);
              if (this.state.dlslips.length > 1) {
                const barList = flattened.filter(
                  (test, index, array) =>
                    index ===
                    array.findIndex((findTest) => findTest.lineItemId === test.lineItemId)
                );

                var combineList = {};

                barList.forEach((itm) => {
                  console.log({ itm })
                  var barCode = itm.barCode;
                  itm.quantity = parseInt(itm.quantity);
                  itm.netValue = parseInt(itm.netValue);
                  itm.grossValue = parseInt(itm.grossValue);
                  if (!combineList[barCode]) {
                    return combineList[barCode] = itm;
                  }
                  return combineList[barCode].quantity = combineList[barCode].quantity + itm.quantity,
                    combineList[barCode].netValue = combineList[barCode].netValue + itm.netValue,
                    combineList[barCode].grossValue = combineList[barCode].grossValue + itm.grossValue,
                    combineList[barCode].sgst = combineList[barCode].sgst + itm.sgst,
                    combineList[barCode].cgst = combineList[barCode].cgst + itm.cgst
                });
                var combineList2 = [];
                Object.keys(combineList).forEach((key) => {
                  combineList2.push(combineList[key]);
                });
                const clearList = [...combineList2];
                if (barList.length > 1) {
                  this.setState({ barCodeList: clearList, dsNumber: '', dsNumberList2: [] });
                } else {
                  this.setState({ barCodeList: clearList, dsNumber: '', dsNumberList2: [] });
                }
              } else {
                if (isEstimationEnable) {
                  this.setState({ barCodeList: res.data.lineItems, dsNumber: '', dsNumberList2: [] });
                }
              }
              this.state.barCodeList.forEach((barCode, index) => {
                costPrice = costPrice + barCode.itemPrice;
                promoDiscValue = promoDiscValue + barCode.promoDiscount;
                total = total + barCode.grossValue;
                netTotal = netTotal + barCode.grossValue;
                scgtTotal = ((barCode.sgst).toFixed(2));
                cgstTotal = ((barCode.cgst).toFixed(2));
              });
              this.state.barCodeList.forEach((element, ind) => {
                if (element.sgst && element.sgst !== 0 && element.sgst !== 'null' && element.cgst && element.cgst !== 0 && element.cgst !== 'null') {
                  element.sgsttotal = ((element.sgst))
                  element.cgsttotal = ((element.cgst))
                } else {
                  // element.returnedAmout = parseInt(element.returnQty) * element.netValue
                }
                element.returnedAmout = ((element.returnQty) * element.netValue) / element.quantity
              });
              let stateGST = this.state.barCodeList.reduce((accumulator, curValue) => {
                if (curValue.sgst && curValue.sgst !== 0 && curValue.sgst !== 'null') {
                  accumulator = accumulator + curValue.sgsttotal;
                }
                return accumulator;

              }, 0);
              let centralGST = this.state.barCodeList.reduce((accumulator, curValue) => {
                if (curValue.cgst && curValue.cgst !== 0 && curValue.cgst !== 'null') {
                  accumulator = accumulator + curValue.cgsttotal;
                }
                return accumulator;

              }, 0);
              discount = discount + this.state.manualDisc;
              if (isTaxIncluded === "true" && isTaxIncluded !== "null") {
                this.setState({
                  netPayableAmount: (total.toFixed(2)),
                  grandNetAmount: (((total) - promoDiscValue).toFixed(2)),
                  totalPromoDisc: (promoDiscValue.toFixed(2)),
                  grossAmount: costPrice,
                  totalAmount: (total.toFixed(2)),
                  stateGST: ((stateGST).toFixed(2)),
                  centralGST: ((centralGST).toFixed(2)),
                  returnCash: parseFloat(this.state.returnCash),
                  cashAmount: parseFloat(this.state.cashAmount)
                });

              } else {
                this.setState({
                  netPayableAmount: (total.toFixed(2)),
                  grandNetAmount: ((total + stateGST + centralGST - promoDiscValue).toFixed(2)),
                  totalPromoDisc: (promoDiscValue.toFixed(2)),
                  grossAmount: ((total + stateGST + centralGST).toFixed(2)),
                  totalAmount: ((total + stateGST + centralGST).toFixed(2)),
                  stateGST: ((stateGST).toFixed(2)),
                  centralGST: ((centralGST).toFixed(2)),
                  returnCash: parseFloat(this.state.returnCash),
                  cashAmount: parseFloat(this.state.cashAmount)

                });
              }
              if (this.state.barCodeList.length > 0) {
                this.setState({ enablePayment: true });
              }
            } else {
              let count = false;
              if (this.state.dlslips.length === 0) {
                this.state.dlslips.push(res.data.lineItems);
                const flattened = this.state.dlslips.flatMap(barCode => barCode);
                this.setState({ barCodeList: flattened })
              }
              else {
                for (let i = 0; i < this.state.barCodeList.length; i++) {
                  if (
                    this.state.barCodeList[i].barCode ===
                    res.data.lineItems[0].barCode
                  ) {
                    count = true;
                    var items = [...this.state.barCodeList];
                    if (parseInt(items[i].qty) + 1 <= parseInt(items[i].quantity)) {
                      let addItem = parseInt(items[i].qty) + 1;
                      items[i].qty = addItem.toString();
                      let totalcostMrp = items[i].itemPrice * parseInt(items[i].qty);
                      items[i].totalMrp = totalcostMrp;
                      break;
                    } else {
                      alert("Insufficient Quantity");
                    }
                  }
                }
                if (!count) {
                  this.state.dlslips.push(res.data.lineItems);
                  const flattened = this.state.dlslips.flatMap(barCode => barCode);
                  this.setState({ barCodeList: flattened });
                  const barList = this.state.barCodeList.filter(
                    (test, index, array) =>
                      index ===
                      array.findIndex((findTest) => findTest.barCode === test.barCode)
                  );
                  this.setState({ barCodeList: barList });
                }
              }
              // this.setState({ dsNumber: '' });
              this.setState({ barCodeList: this.state.barCodeList, dsNumber: '' });
              this.state.barCodeList.forEach((barCode, index) => {
                if (barCode.qty > 1) {
                  //  barCode.grossValue = barCode.itemPrice * barCode.qty;

                } else {
                  // barCode.grossValue = barCode.itemPrice;
                  barCode.qty = parseInt("1");
                  // total = total + barCode.grossValue;
                }
                costPrice = costPrice + barCode.itemPrice;
                promoDiscValue = promoDiscValue + barCode.promoDiscount;
                total = total + barCode.itemPrice * barCode.qty;
                netTotal = netTotal + barCode.itemPrice * barCode.qty;
                // scgtTotal = total + barCode.sgst + barCode.cgst;
                scgtTotal = ((barCode.sgst).toFixed(2));
                cgstTotal = ((barCode.cgst).toFixed(2));
              });

              this.state.barCodeList.forEach((element, ind) => {
                if (element.sgst && element.sgst !== 0 && element.sgst !== 'null' && element.cgst && element.cgst !== 0 && element.cgst !== 'null') {
                  element.sgsttotal = element.sgst//* element.qty.toFixed(2)
                  element.cgsttotal = element.cgst
                } else {
                  // element.returnedAmout = parseInt(element.returnQty) * element.netValue
                }
                element.returnedAmout = (((element.returnQty) * element.netValue / element.quantity).toFixed(2))
              });
              let stateGST = this.state.barCodeList.reduce((accumulator, curValue) => {
                if (curValue.sgst && curValue.sgst !== 0 && curValue.sgst !== 'null') {
                  accumulator = accumulator + curValue.sgsttotal;
                }
                return accumulator;

              }, 0);
              let centralGST = this.state.barCodeList.reduce((accumulator, curValue) => {
                if (curValue.cgst && curValue.cgst !== 0 && curValue.cgst !== 'null') {
                  accumulator = accumulator + curValue.cgsttotal;
                }
                return accumulator;

              }, 0);
              discount = discount + this.state.manualDisc;
              if (isTaxIncluded === "true" && isTaxIncluded !== "null") {
                this.setState({
                  netPayableAmount: (total.toFixed(2)),
                  grandNetAmount: (netTotal.toFixed(2)),
                  totalPromoDisc: (promoDiscValue.toFixed(2)),
                  grossAmount: (costPrice.toFixed(2)),
                  totalAmount: (total.toFixed(2)),
                  enableCoupon: true,
                  returnCash: parseFloat(this.state.returnCash),
                  cashAmount: parseFloat(this.state.cashAmount),
                  stateGST: ((stateGST).toFixed(2)),
                  centralGST: ((centralGST).toFixed(2))

                });
              } else {
                this.setState({
                  netPayableAmount: (total.toFixed(2)),
                  grandNetAmount: ((total + (stateGST) + (centralGST)).toFixed(2)),
                  totalPromoDisc: (promoDiscValue.toFixed(2)),
                  stateGST: ((stateGST).toFixed(2)),
                  centralGST: ((centralGST).toFixed(2)),
                  grossAmount: costPrice,
                  totalAmount: ((total + (stateGST) + (centralGST)).toFixed(2)),
                  enableCoupon: true,
                  returnCash: parseFloat(this.state.returnCash),
                  cashAmount: parseFloat(this.state.cashAmount)
                });
              }
              // this.calculateTotal();
              if (this.state.barCodeList.length > 0) {
                this.setState({ enablePayment: true });
              }
            }
            // this.getTaxAmount();
          }
        });
      } else {
        alert("Please Close Previous Days");
      }
    } else {
      this.setState({ loading: false, dsNumber: "" });
      alert("Unable To Sale Today Daycloser Is Done");
    }
  }

  getallDates() {
    const { storeId } = this.state;
    CustomerService.getDates(storeId).then(res => {
      if (res) {
        console.log({ res }, res.data)
        if (res.data.length > 0) {
          this.setState({ dayCloseDates: res.data });
        }
      }
    });

  }

  getHsnDetails() {
    axios.get(CustomerService.getHsnDetails()).then((response) => {
      if (response) {
        const details = response.data.result;
        let slabVos = [];
        details.forEach(detail => {
          if (detail.slabVos)
            slabVos.push(detail.slabVos);
        });
        AsyncStorage.setItem("HsnDetails", JSON.stringify(slabVos)).then(() => {
          // console.log('data saved');

        }).catch(() => {
          this.setState({ loading: false });
          // alert('There is error saving token');
        });


      }
    });
  }

  getTaxAmount() {
    let slabCheck = false;
    const taxDetails = axios.get(CustomerService.getHsnDetails()).then((response) => {
      if (response) {
        const details = response.data.result;
        let slabVos = [];
        let slabCheck = false;
        let totalTax = 0;
        let sgst = 0;
        let cgst = 0;
        details.forEach(detail => {
          if (detail.slabVos)
            slabVos.push(detail.slabVos);
        });
      }
    })

    // slabVos.forEach(taxData => {
    this.state.barCodeList.forEach(taxData => {
      // if (this.state.netPayableAmount >= taxData[0].priceFrom && this.state.netPayableAmount <= taxData[0].priceTo) {
      //   const taxPer = taxData[0].taxVo.taxLabel.split(' ')[1].split('%')[0];
      //   const tax = parseInt(taxPer) / 100;

      //   const totalTax = this.state.netPayableAmount * tax;

      //   const central = totalTax / 2;
      //   this.setState({ centralGST: Math.ceil(central) });
      //   slabCheck = true;
      //   slabCheck = true;
      //   this.setState({ stateGST: taxData[0].taxVo.cgst, centralGST: taxData[0].taxVo.cgst });
      // }
      sgst = sgst + taxData.sgst;
      cgst = cgst + taxData.cgst;
      totalTax = sgst + cgst;

    });

    this.setState({ centralGST: ((cgst).toFixed(2)) });
    this.setState({ stateGST: ((sgst).toFixed(2)) });
    const grandTotal = this.state.netPayableAmount;
    this.setState({ grandNetAmount: grandTotal });
    if (this.state.isTaxIncluded === "true" && his.state.isTaxIncluded !== "null") {
      const grandTotal = this.state.netPayableAmount;
      this.setState({ grandNetAmount: grandTotal, totalAmount: grandTotal });
    } else {
      const grandTotal = this.state.netPayableAmount;
      const grandscgst = this.state.netPayableAmount + this.state.centralGST + this.state.stateGST;
      this.setState({
        grandNetAmount: grandTotal,
        totalAmount: grandscgst
      });
    }
  }


  pay() {
    let obj = {
      grandNetAmount: this.state.grandNetAmount,
      totalAmount: this.state.totalAmount,
      netPayableAmount: this.state.netPayableAmount,
      grossAmount: this.state.grossAmount,
      totalDiscount: this.state.totalDiscount,
      CGST: this.state.centralGST, totalPromoDisc: this.state.totalPromoDisc,
      SGST: this.state.stateGST,
      manualDisc: this.state.manualDisc,
      taxAmount: this.state.taxAmount,
      approvedBy: this.state.approvedBy,
      manualDisc: this.state.discountAmount,
      userId: this.state.userId,
      dsNumberList: this.state.dsNumberList,
      customerName: this.state.mobileData.userName,
      customerFullName: this.state.customerFullName,
      customerPhoneNumber: this.state.customerMobilenumber,
      customerGSTNumber: this.state.customerGSTNumber, customerAddress: this.state.customerAddress,
      customerGender: this.state.customerGender,
      creditAmount: this.state.creditAmount,
      isTaxIncluded: this.state.isTaxIncluded,
      barCodeList: this.state.barCodeList,
      isCredit: this.state.isCredit,
      enablePayment: this.state.enablePayment,
      totalQty: this.state.totalQty.toString(),
      onGoBack: () => this.invoiceUpdate(),
    };
    // alert(String(this.state.mrpAmount))
    this.props.navigation.navigate('TextilePayment', obj);
    this.invoiceUpdate();
    console.log({ obj });
  }

  invoiceUpdate() {
    this.setState({ barCodeList: [], dsNumber: '', dsNumberList: [], dlslips: [], isTagCustomer: false, mobileNumber: '', customerTagging: false });
  }

  endEditing() {
    const isFormValid = this.validationForm();
    if (isFormValid) {
      this.setState({ disableButton: false });
      this.getDeliverySlipDetails();
    }
  }

  handleDsNumber = (text) => {
    this.setState({ dsNumber: text });
  };

  addCustomer() {

  }

  tagCustomer() {
    if (this.state.mobileNumber.length === 0 || this.state.mobileNumber.length < 10) {
      alert("please enter a valid 10 digit mobile number");
    } else {
      const obj = {
        "id": "",
        "phoneNo": "+91" + this.state.mobileNumber,
        "name": "",
        "active": false,
        "inActive": false,
        "roleId": "",
        "storeId": ""
      };
      axios.get(CustomerService.getCustomerMobile() + "/" + obj.phoneNo).then((res) => {
        if (res) {
          const mobileData = res.data.result;
          console.log({ mobileData }, res.data.result, this.state.barCodeList, obj)
          this.setState({
            userId: res.data.result.userId, customerFullName: res.data.result.userName, customerTagAllow: true, customerTagging: false
          });
          this.state.mobileData = {
            address: this.state.address,
            altMobileNo: "",
            dob: this.state.dob,
            gender: mobileData.gender,
            gstNumber: this.state.gstNumber,
            mobileNumber: mobileData.phoneNumber,
            name: mobileData.userName,
            email: this.state.customerEmail,
          };

          this.setState({
            isBillingDetails: true,
            customerMobilenumber: mobileData.phoneNumber,
            mobileNumber: "",
            isTagCustomer: true,
            customerTagging: false,
          });

          CustomerService.getCreditNotes(this.state.mobileNumber, res.data.result.userId).then(response => {
            if (response) {
              if (response.data.result && response.data.result.length > 0) {
                this.setState({ creditAmount: response.data.result[0].amount, isCredit: true, customerTagging: false, isTagCustomer: true });
              }
            }
          });

        }
      }).catch(() => {
        this.setState({ loading: false, mobileNumber: "", customerTagging: false });
        alert('Unable to get customer details');
      });
    }
  }

  handleMobileNumber(text) {
    this.setState({ mobileNumber: text });
  }

  getMobileDetails() {
    axios.get(CustomerService.getMobileData() + "/" + "+918466043606").then((res) => {
      if (res.data.result) {
        this.state.mobileData = res.data.result;
        this.setState({
          customerName: res.data.result.name,
          gender: res.data.result.gender,
          dob: res.data.result.dob,
          customerEmail: res.data.result.email,
          customerGST: res.data.result.gstNumber,
          address: res.data.result.address,
        });
      } else {
        alert("No Data Found");
      }
    }).catch(() => {
      this.setState({ loading: false });
      alert('Unable to get customer details');
    });
  }

  validationForm() {
    let isFormValid = true;
    let errors = {};

    if (this.state.dsNumber === '') {
      isFormValid = false;
      errors["dsNumber"] = customerErrorMessages.dsNumber;
      this.setState({ dsNumberValid: false });
    }

    this.setState({ errors: errors });
    return isFormValid;
  }

  navigateToScan() {
    global.barcodeId = 'something';
    this.props.navigation.navigate('ScanBarCode', {
      isFromNewSale: true, isFromAddProduct: false,
      onGoBack: () => this.refreshTextile(),
    });
  }

  refreshTextile() {
    if (global.barcodeId != 'something') {
      this.setState({ dsNumber: global.barcodeId },
        () => {
          this.getDeliverySlipDetails();
        });
      this.setState({ barcodeId: '' });
      global.barcodeId = 'something';
    }
  }

  navigateToScanCode() {
    global.barcodeId = 'something';
    this.props.navigation.navigate('ScanBarCode', {
      isFromNewSale: false, isFromAddProduct: false, invoiceScan: true,
      onGoBack: () => this.refresh(),
    });
  }

  refresh() {
    if (global.barcodeId != 'something') {
      this.setState({ barcodeId: global.barcodeId },
        () => {
          this.getRetailBarcodeList();
        });
      this.setState({ dsNumber: "" });
      global.barcodeId = 'something';
    }
  }

  removeBarcode(item, index) {
    this.state.barCodeList.splice(index, 1);
    this.setState({ barCodeList: this.state.barCodeList, netPayableAmount: this.state.netPayableAmount - item.grossValue, promoDiscount: 0 });
  }

  updateQuanty = (text, index, item) => {
    const qtyarr = [...this.state.barCodeList];
    qtyarr[index].qty = text;
    this.setState({ barCodeList: qtyarr }, () => {
      this.updateQty(text, index, item);
    });
  };

  updateQty = (text, index, item) => {
    const Qty = /^[0-9\b]+$/;
    const qtyarr = [...this.state.barCodeList];
    let addItem = '';
    let value = text;
    if (value === '') {
      addItem = '';
      qtyarr[index].qty = addItem.toString();
    }
    else if (value !== '' && Qty.test(value) === false) {
      addItem = 1;
      qtyarr[index].qty = addItem.toString();
    } else {
      if (parseInt(value) < parseInt(qtyarr[index].qty)) {
        addItem = value;
        qtyarr[index].quantity = addItem.toString();
      } else {
        addItem = qtyarr[index].qty;
        qtyarr[index].quantity = addItem.toString();
      }
    }
    let totalcostMrp = item.itemPrice * parseInt(qtyarr[index].qty);
    item.grossValue = totalcostMrp;
    this.setState({ barCodeList: qtyarr });
    let grandTotal = 0;
    let totalqty = 0;
    let promoDiscValue = 0;
    let discount = 0;
    let costPrice = 0;
    let total = 0;
    let netTotal = 0;
    let sgst = 0;
    let cgst = 0;
    let scgtTotal = 0;
    this.state.barCodeList.forEach((barCode, index) => {

      costPrice = costPrice + barCode.itemPrice;
      promoDiscValue = promoDiscValue + barCode.promoDiscount;
      total = total + barCode.itemPrice * barCode.qty;
      netTotal = netTotal + barCode.itemPrice * barCode.qty;
      if (barCode.qty > 1) {

      } else {
        // barCode.grossValue = barCode.itemPrice;
        barCode.qty = parseInt("1");
      }
    });

    this.state.barCodeList.forEach((element, ind) => {
      if (element.sgst && element.sgst !== 0 && element.sgst !== 'null' && element.cgst && element.cgst !== 0 && element.cgst !== 'null') {
        element.sgsttotal = (((element.sgst) * element.qty))
        element.cgsttotal = (((element.cgst) * element.qty))
      } else {
        // element.returnedAmout = parseInt(element.returnQty) * element.netValue
      }
      element.returnedAmout = (((element.returnQty) * element.netValue / element.quantity).toFixed(2))
    });
    let stateGST = this.state.barCodeList.reduce((accumulator, curValue) => {
      if (curValue.sgst && curValue.sgst !== 0 && curValue.sgst !== 'null') {
        accumulator = accumulator + curValue.sgsttotal;
      }
      return accumulator;

    }, 0);
    let centralGST = this.state.barCodeList.reduce((accumulator, curValue) => {
      if (curValue.cgst && curValue.cgst !== 0 && curValue.cgst !== 'null') {
        accumulator = accumulator + curValue.cgsttotal;
      }
      return accumulator;

    }, 0);
    discount = discount + this.state.manualDisc;
    if (this.state.isTaxIncluded === "true" && this.state.isTaxIncluded !== "null") {
      this.setState({
        netPayableAmount: (total).toFixed(2),
        grandNetAmount: (netTotal).toFixed(2),
        totalPromoDisc: (promoDiscValue).toFixed(2),
        grossAmount: (costPrice).toFixed(2),
        totalAmount: (total).toFixed(2),
        stateGST: ((stateGST).toFixed(2)),
        centralGST: ((centralGST).toFixed(2)),
      });
    } else {
      this.setState({
        netPayableAmount: (total.toFixed(2)),
        grandNetAmount: ((total + (stateGST) + (centralGST)).toFixed(2)),
        totalPromoDisc: (promoDiscValue.toFixed(2)),
        stateGST: ((stateGST).toFixed(2)),
        centralGST: ((centralGST).toFixed(2)),
        grossAmount: ((costPrice).toFixed(2)),
        totalAmount: ((total + (stateGST) + (centralGST)).toFixed(2)),
        enableCoupon: true,
        returnCash: parseFloat(this.state.returnCash),
        cashAmount: parseFloat(this.state.cashAmount)
      });
    }
    this.setState({ totalQuantity: totalqty });
    this.state.totalQuantity = (parseInt(this.state.totalQuantity) + 1);
  };

  incrementForTable(item, index) {
    const qtyarr = [...this.state.barCodeList];
    if (parseInt(qtyarr[index].qty) < parseInt(qtyarr[index].quantity)) {
      var additem = parseInt(qtyarr[index].qty) + 1;
      qtyarr[index].qty = additem.toString();
    } else {
      var additem = parseInt(qtyarr[index].quantity);
      qtyarr[index].qty = additem.toString();
      alert(`only ${additem} items are in this barcode`);
    }
    let totalcostMrp = item.itemPrice * parseInt(qtyarr[index].qty);
    item.grossValue = totalcostMrp;
    this.setState({ barCodeList: qtyarr });

    let grandTotal = 0;
    let totalqty = 0;
    let promoDiscValue = 0;
    let discount = 0;
    let costPrice = 0;
    let total = 0;
    let netTotal = 0;
    let sgst = 0;
    let cgst = 0;
    let scgtTotal = 0;
    let cgstTotal = 0
    this.state.barCodeList.forEach((barCode, index) => {
      costPrice = costPrice + barCode.itemPrice;
      promoDiscValue = promoDiscValue + barCode.promoDiscount
      total = total + barCode.itemPrice * barCode.qty;
      netTotal = netTotal + barCode.itemPrice * barCode.qty;
      if (barCode.qty > 1) {

      } else {
        // barCode.grossValue = barCode.itemPrice;
        barCode.qty = parseInt("1");
      }
    });

    this.state.barCodeList.forEach((element, ind) => {
      if (element.sgst && element.sgst !== 0 && element.sgst !== 'null' && element.cgst && element.cgst !== 0 && element.cgst !== 'null') {
        element.sgsttotal = (((element.sgst) * element.qty))
        element.cgsttotal = (((element.cgst) * element.qty))
      } else {
        // element.returnedAmout = parseInt(element.returnQty) * element.netValue
      }
      element.returnedAmout = (((element.returnQty) * element.netValue / element.quantity).toFixed(2))
    });
    let stateGST = this.state.barCodeList.reduce((accumulator, curValue) => {
      if (curValue.sgst && curValue.sgst !== 0 && curValue.sgst !== 'null') {
        accumulator = accumulator + curValue.sgsttotal;
      }
      return accumulator;

    }, 0);
    let centralGST = this.state.barCodeList.reduce((accumulator, curValue) => {
      if (curValue.cgst && curValue.cgst !== 0 && curValue.cgst !== 'null') {
        accumulator = accumulator + curValue.cgsttotal;
      }
      return accumulator;

    }, 0);
    discount = discount + this.state.manualDisc;
    if (this.state.isTaxIncluded === "true" && this.state.isTaxIncluded !== "null") {
      this.setState({
        netPayableAmount: (total).toFixed(2),
        grandNetAmount: (netTotal).toFixed(2),
        totalPromoDisc: (promoDiscValue).toFixed(2),
        grossAmount: (costPrice).toFixed(2),
        totalAmount: (total).toFixed(2),
        stateGST: ((stateGST).toFixed(2)),
        centralGST: ((centralGST).toFixed(2)),

      });

    } else {
      this.setState({
        netPayableAmount: (total.toFixed(2)),
        grandNetAmount: ((total + (stateGST) + (centralGST)).toFixed(2)),
        totalPromoDisc: (promoDiscValue.toFixed(2)),
        stateGST: ((stateGST).toFixed(2)),
        centralGST: ((centralGST).toFixed(2)),
        grossAmount: ((costPrice).toFixed(2)),
        totalAmount: ((total + (stateGST) + (centralGST)).toFixed(2)),
        enableCoupon: true,
        returnCash: parseFloat(this.state.returnCash),
        cashAmount: parseFloat(this.state.cashAmount)
      });
    }
    this.setState({ totalQuantity: totalqty }, () => {
      this.calculateTotal()
    });
    this.state.totalQuantity = (parseInt(this.state.totalQuantity) + 1);
  }

  decreamentForTable(item, index) {
    const qtyarr = [...this.state.barCodeList];
    if (qtyarr[index].qty > 1) {
      var additem = parseInt(qtyarr[index].qty) - 1;
      qtyarr[index].qty = additem.toString();
      let totalcostMrp = item.itemPrice * parseInt(qtyarr[index].qty);
      item.grossValue = totalcostMrp;
      this.state.totalQuantity = (parseInt(this.state.totalQuantity) - 1);
      let grandTotal = 0;
      let totalqty = 0;
      let promoDiscValue = 0;
      let discount = 0;
      let costPrice = 0;
      let total = 0;
      let netTotal = 0;
      let sgst = 0;
      let cgst = 0;
      let scgtTotal = 0;
      this.state.barCodeList.forEach((barCode, index) => {
        costPrice = costPrice + barCode.itemPrice;
        promoDiscValue = promoDiscValue + barCode.promoDiscount;
        total = total + barCode.itemPrice * barCode.qty;
        netTotal = netTotal + barCode.itemPrice * barCode.qty;
        if (barCode.qty > 1) {

        } else {
          // barCode.grossValue = barCode.itemPrice;
          barCode.qty = parseInt("1");
        }

      });


      this.state.barCodeList.forEach((element, ind) => {
        if (element.sgst && element.sgst !== 0 && element.sgst !== 'null' && element.cgst && element.cgst !== 0 && element.cgst !== 'null') {
          element.sgsttotal = (((element.sgst) * element.qty))
          element.cgsttotal = (((element.cgst) * element.qty))
        } else {
          // element.returnedAmout = parseInt(element.returnQty) * element.netValue
        }
        element.returnedAmout = (((element.returnQty) * element.netValue / element.quantity).toFixed(2))
      });
      let stateGST = this.state.barCodeList.reduce((accumulator, curValue) => {
        if (curValue.sgst && curValue.sgst !== 0 && curValue.sgst !== 'null') {
          accumulator = accumulator + curValue.sgsttotal;
        }
        return accumulator;

      }, 0);
      let centralGST = this.state.barCodeList.reduce((accumulator, curValue) => {
        if (curValue.cgst && curValue.cgst !== 0 && curValue.cgst !== 'null') {
          accumulator = accumulator + curValue.cgsttotal;
        }
        return accumulator;

      }, 0);
      discount = discount + this.state.manualDisc;
      if (this.state.isTaxIncluded === "true" && this.state.isTaxIncluded !== "null") {
        this.setState({
          netPayableAmount: (total).toFixed(2),
          grandNetAmount: (netTotal).toFixed(2),
          totalPromoDisc: (promoDiscValue).toFixed(2),
          grossAmount: (costPrice).toFixed(2),
          totalAmount: (total).toFixed(2),
          stateGST: ((stateGST).toFixed(2)),
          centralGST: ((centralGST).toFixed(2)),

        });

      } else {
        this.setState({
          netPayableAmount: (total.toFixed(2)),
          grandNetAmount: ((total + (stateGST) + (centralGST)).toFixed(2)),
          totalPromoDisc: (promoDiscValue.toFixed(2)),
          stateGST: ((stateGST).toFixed(2)),
          centralGST: ((centralGST).toFixed(2)),
          grossAmount: ((costPrice).toFixed(2)),
          totalAmount: ((total + (stateGST) + (centralGST)).toFixed(2)),
          enableCoupon: true,
          returnCash: parseFloat(this.state.returnCash),
          cashAmount: parseFloat(this.state.cashAmount)
        });
      }
      this.setState({ totalQuantity: totalqty });
      this.state.totalQuantity = (parseInt(this.state.totalQuantity) + 1);
      this.setState({ barCodeList: qtyarr });
    } else {
      // this.state.barCodeList.splice(index, 1);
      this.setState({ barCodeList: this.state.barCodeList }, () => {
        this.calculateTotal();
      });
    }
  }

  calculateTotal() {
    let totalAmount = 0;
    let totalqty = 0;
    const qtyarr = [...this.state.barCodeList]
    console.log({ qtyarr })
    this.state.barCodeList.forEach(barCode => {
      totalAmount = parseInt(barCode.itemMrp) * parseInt(barCode.qty);
      totalqty = parseInt(totalqty) + parseInt(barCode.qty);
    });
    console.log({ totalAmount, totalqty })
    this.setState({ mrpAmount: totalAmount, totalQuantity: totalqty }
    );
  }

  // Printer Functions
  handleViewPrinter() {
    this.setState({ showPrinter: true });
  }

  handlePrinterIp = (text) => {
    this.setState({ printerIp: text });
  };

  connectPrinter() {
    AsyncStorage.setItem("printerIp", String(this.state.printerIp)).then(() => {
      this.setState({ showPrinter: false, loading: true });
      PrintService('start', 'print').then(() => {
        this.setState({ loading: false, printEnabled: true });
      }).catch((err) => {
        this.setState({ loading: false, printEnabled: false });
        alert(err);
      });
    });
  }

  render() {
    return (
      <View style={scss.container}>
        <ScrollView>
          <View
            style={{
              flex: 1,
              paddingHorizontal: 0,
              paddingVertical: 0,
              backgroundColor: color.white
            }}>
            <View>
              <View style={{ flexDirection: 'row' }}>
                <TextInput
                  style={[forms.input_fld, { width: "75%", minWidth: "75%", maxWidth: "75%" }]}
                  mode="flat"
                  activeUnderlineColor='#000'
                  underlineColor={'#6f6f6f'}
                  label={I18n.t("Enter ES Number")}
                  value={this.state.dsNumber}
                  onChangeText={(text) => this.handleDsNumber(text)}
                  onEndEditing={() => this.endEditing()}
                />
                <TouchableOpacity style={{ padding: RF(10) }} onPress={() => this.navigateToScanCode()} >
                  <ScanIcon name='barcode-scan' size={30} color={color.black} />
                </TouchableOpacity>
              </View>
              {!this.state.dsNumberValid && (
                <Message imp={true} message={this.state.errors["dsNumber"]} />
              )}
            </View>
            <TouchableOpacity style={[forms.button_active, { backgroundColor: color.white, borderColor: color.greyYellow, width: '90%' }]} onPress={() => this.handleViewPrinter()}>
              <Text style={[forms.button_text, { color: color.black }]}>Connect Printer</Text>
            </TouchableOpacity>

            {this.state.showPrinter && (
              <View>
                <Modal style={{ margin: 0 }} isVisible={this.state.modalVisible}
                  onBackButtonPress={() => this.modelCancel()}
                  onBackdropPress={() => this.modelCancel()} >
                  <View style={forms.filterModelContainer}>
                    <Text style={forms.popUp_decorator}>-</Text>
                    <View style={forms.filterModelSub}>
                      <View style={{ alignItems: 'center', marginTop: 20 }}>
                        <Text>Printer IP:</Text>
                        <Text></Text>
                        <TextInput style={{ width: '90%', marginLeft: '5%', marginRight: '5%' }}
                          mode="flat"
                          activeUnderlineColor='#000'
                          underlineColor='#6f6f6f'
                          placeholder="Printer ip"
                          keyboardType={'number-pad'}
                          value={this.state.printerIp}
                          onChangeText={(text) => this.handlePrinterIp(text)} />
                      </View>
                      <TouchableOpacity
                        style={sucessBtn} onPress={() => this.connectPrinter()}
                      >
                        <Text style={sucessBtnText}  > {I18n.t("Connect")} </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              </View>
            )}

            {this.state.barCodeList.length !== 0 && (
              <View>
                <TouchableOpacity style={[forms.button_active, { backgroundColor: this.state.isTagCustomer ? color.disableBackGround : color.accent, width: '90%' }]}
                  disabled={this.state.isTagCustomer}
                  onPress={() => {
                    this.setState({ customerTagging: true, modalVisible: true })
                  }}>
                  <Text style={forms.button_text}> {"Tag Customer"}</Text>
                </TouchableOpacity>
              </View>
            )}

            {(this.state.barCodeList.length !== 0 &&
              <FlatList style={scss.flatList}
                //  ListHeaderComponent={this.renderHeader}
                data={this.state.barCodeList}
                keyExtractor={item => item}
                // contentContainerStyle={{ paddingBottom: 230 }}
                onEndReached={this.onEndReached.bind(this)}
                scrollEnabled={false}
                ListEmptyComponent={
                  <Text style={listEmptyMessage}>&#9888; Records Not Found</Text>
                }
                ref={(ref) => { this.listRef = ref; }}
                renderItem={({ item, index }) => (
                  <ScrollView>
                    <View style={[scss.flatListContainer]}>
                      <View style={scss.flatListSubContainer}>
                        <View style={scss.textContainer}>
                          <View>
                            <Text style={[scss.textStyleLight, { textAlign: 'left' }]}>{I18n.t("Item")}
                              {"\n"}
                              <Text style={scss.textStyleMedium}>{item.barCode}</Text>
                            </Text>
                          </View>
                          <View>
                            {this.state.isEstimationEnable &&
                              <Text style={[scss.textStyleLight, { textAlign: 'right' }]}>{I18n.t("QTY")}
                                {"\n"}
                                <Text style={scss.textStyleMedium}>{('0' + item.quantity).slice(-2)}</Text>
                              </Text>}
                            {!this.state.isEstimationEnable &&
                              // (this.state.handleBillDiscount || this.state.handleCheckPromo) ?
                              //   <Text style={[scss.textStyleLight, { textAlign: 'right' }]}>{I18n.t("QTY")}
                              //     {"\n"}
                              //     <Text style={scss.textStyleMedium}>{String(item.qty)}</Text>
                              //   </Text> :
                              <Text style={[scss.textStyleLight, { textAlign: 'right' }]}>{I18n.t("QTY")}
                                {"\n"}
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                  <TouchableOpacity
                                    onPress={() => this.incrementForTable(item, index)}>
                                    <PlusIcon name="plus-circle-outline" size={20} color={"red"} />
                                  </TouchableOpacity>
                                  <TextInput
                                    style={{
                                      fontFamily: 'regular',
                                      fontSize: RF(10),
                                    }}
                                    keyboardType={'numeric'}
                                    activeUnderlineColor='#000'
                                    value={String(item.qty)}
                                    maxLength={parseInt(item.quantity)}
                                    textAlign={'center'}
                                    onChangeText={(text) => this.updateQuanty(text, index, item)}
                                  />
                                  <TouchableOpacity
                                    onPress={() => this.decreamentForTable(item, index)}>
                                    <MinusIcon name="minus-circle-outline" size={20} color={"red"} />
                                  </TouchableOpacity>
                                </View>
                              </Text>}
                          </View>
                        </View>
                        {this.state.isTaxIncluded !== 'null' &&
                          <View style={scss.textContainer}>
                            <View>
                              <Text style={scss.textStyleLight}>{I18n.t("CGST")}
                                {"\n"}
                                <Text style={scss.textStyleMedium}>{(parseFloat(item.cgst).toFixed(2))}</Text>
                              </Text>
                            </View>
                            <Text style={[scss.textStyleLight, { textAlign: 'right' }]}>{I18n.t("SGST")}
                              {"\n"}
                              <Text style={scss.textStyleMedium}>{(parseFloat(item.sgst).toFixed(2))}</Text>
                            </Text>
                          </View>
                        }

                        <View style={scss.textContainer}>
                          <Text style={[scss.textStyleLight, { textAlign: 'left' }]}>{I18n.t("MRP")}
                            {"\n"}
                            <Text style={scss.textStyleMedium}>₹ {parseFloat(item.itemPrice).toFixed(2)}</Text>
                          </Text>
                          <Text style={[scss.textStyleLight, { textAlign: 'right' }]}>{I18n.t("Pro Disc")}{"\n"}<Text style={[scss.textStyleMedium, { color: '#2ADC09', }]}>₹{(item.totalPromoDiscount) ? parseFloat(item.totalPromoDiscount).toFixed(2) : 0.0}</Text></Text>
                          <Text style={[scss.textStyleLight, { textAlign: 'right' }]}>{I18n.t("Dist Discount")}{"\n"}<Text style={[scss.textStyleMedium, { color: '#2ADC09', }]}>₹{(item.distributedPromoDiscount) ? parseFloat(item.distributedPromoDiscount).toFixed(2) : 0.0}</Text></Text>
                        </View>
                        <View style={scss.flatListFooter}>
                          <Text style={scss.footerText}>{I18n.t("GROSS")} :
                            {this.state.isEstimationEnable && <Text>₹{parseFloat(item.grossValue.toFixed(2))}</Text>}
                            {!this.state.isEstimationEnable && <Text>₹ {parseFloat(item.itemPrice * item.qty).toFixed(2)}</Text>}
                            {/* ₹{item.itemPrice} */}
                          </Text>
                        </View>

                      </View>
                    </View>
                  </ScrollView>

                )}
              />
            )}

            {this.state.barCodeList.length != 0 && (
              <>
                <ScrollView>
                  <View style={[scss.radio_group, { marginLeft: 16, marginTop: 10 }]}>
                    <Text style={scss.textStyleMedium}>{I18n.t("ITEMS")} </Text>
                    <Text style={scss.textStyleMedium}>{this.state.barCodeList.length} </Text>
                  </View>
                  <View style={[scss.radio_group, { marginLeft: 16, marginTop: 10 }]}>
                    <Text style={scss.textStyleMedium}>{I18n.t("DISCOUNT")} </Text>
                    <Text style={[scss.textStyleMedium, { color: "#2ADC09" }]}> ₹ {this.state.totalPromoDisc} </Text>
                  </View>
                  <View style={[scss.radio_group, { marginLeft: 16, marginTop: 10 }]}>
                    <Text style={scss.textStyleMedium}>{I18n.t("TOTAL")} </Text>
                    <Text style={scss.textStyleMedium}>₹ {this.state.netPayableAmount} </Text>
                  </View>
                  <View style={[scss.radio_group, { marginLeft: 16, marginTop: 10 }]}>
                    <Text style={scss.textStyleMedium}> {I18n.t("CUSTOMER NAME")} </Text>
                    <Text style={scss.textStyleMedium}>{this.state.customerFullName} </Text>
                  </View>
                  <View style={[scss.radio_group, { marginLeft: 16, marginTop: 10 }]}>
                    <Text style={scss.textStyleMedium}>{I18n.t("CUSTOMER MOBILE NUMBER")} </Text>
                    <Text style={scss.textStyleMedium} >{this.state.customerMobilenumber} </Text>
                  </View>
                  <View style={[scss.radio_group, { marginLeft: 16, marginTop: 10 }]}>
                    <Text style={scss.textStyleMedium}>{I18n.t("LOYALTY POINTS")} </Text>
                    <Text style={scss.textStyleMedium}> - </Text>
                  </View>
                  <View style={[scss.radio_group, { marginLeft: 16, marginTop: 10 }]}>
                    <Text style={scss.textStyleMedium}>{I18n.t("EXPIRY DATE")} </Text>
                    <Text style={scss.textStyleMedium}> - </Text>
                  </View>
                </ScrollView>
                <View style={forms.action_buttons_container}>
                  <TouchableOpacity
                    style={[forms.action_buttons, forms.submit_btn, { width: "90%" }]}
                    onPress={() => this.pay()} >
                    <Text style={forms.submit_btn_text}>
                      {I18n.t("Checkout")} </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </ScrollView >


        {this.state.customerTagging && (
          <View style={{ backgroundColor: color.white }}>
            <Modal style={{ margin: 0 }} isVisible={this.state.customerTagging}
              onBackButtonPress={() => this.modelCancel()}
              onBackdropPress={() => this.modelCancel()}
            >
              <View style={forms.filterModelContainer}>
                <Text style={forms.popUp_decorator}>-</Text>
                <View style={forms.filterModelSub}>
                  <View>
                    <Text style={scss.textStyleMedium}> {I18n.t("Please provide customer phone number")}  </Text>
                    <TextInput
                      style={forms.input_fld}
                      mode="flat"
                      activeUnderlineColor='#000'
                      underlineColor={'#6f6f6f'}
                      label={I18n.t("MOBILE NUMBER")}
                      keyboardType='phone-pad'
                      maxLength={10}
                      value={this.state.mobileNumber}
                      onChangeText={(text) => this.handleMobileNumber(text)}

                    />
                    <View style={forms.action_buttons_container}>
                      <TouchableOpacity style={[forms.action_buttons, forms.submit_btn]}
                        onPress={() => this.tagCustomer()}>
                        <Text style={forms.submit_btn_text} >{I18n.t("CONFIRM")}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[forms.action_buttons, forms.cancel_btn]}
                        onPress={() => this.modelCancel()}>
                        <Text style={forms.cancel_btn_text}>{I18n.t("CANCEL")}</Text>
                      </TouchableOpacity>
                    </View>


                  </View>
                </View>
              </View>
            </Modal>
          </View>
        )}
      </View >
    );
  }
}
export default GenerateInvoiceSlip;
