import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import moment from 'moment/moment';
import React, { Component } from 'react';
import { Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Device from 'react-native-device-detection';
import I18n from 'react-native-i18n';
import Modal from 'react-native-modal';
import { TextInput } from 'react-native-paper';
import IconMA from 'react-native-vector-icons/MaterialCommunityIcons';
import forms from '../../commonUtils/assets/styles/formFields.scss';
import scss from '../../commonUtils/assets/styles/style.scss';
import RnPicker from '../../commonUtils/RnPicker';
import { RF } from '../../Responsive';
import { customerErrorMessages } from '../Errors/errors';
import Message from '../Errors/Message';
import CustomerService from '../services/CustomerService';
import { color } from '../Styles/colorStyles';
import { textStyle } from '../Styles/FormFields';
import { flatListMainContainer, flatlistSubContainer, highText, highText_black, textContainer, textStyleMedium, textStyleMediumColor } from '../Styles/Styles';


var deviceheight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get("window").width;

const pickerData = [
  { label: 'Not Fitting', value: 'Not Fitting' },
  { label: 'Damaged Piece', value: 'Damaged Piece' },
  { label: 'Quality is Not Good', value: 'Quality is Not Good' },
  { label: 'Others', value: 'Others' },
]
export default class GenerateReturnSlip extends Component {

  constructor(props) {
    super(props);
    this.state = {
      invoiceNumber: "",
      mobileNumber: "",
      customerTagging: false,
      modelVisible: true,
      promotions: false,
      returnInvoice: [],
      returnedItems: [],
      reason: "",
      invoiceNo: "",
      reasonDesc: "",
      returnModel: false,
      netValue: 0,
      quantity: 0,
      isChecked: false,
      itemClicked: false,
      qty: 0,
      values: 0,
      netValueList: [],
      returnSlipTotal: 0,
      storeId: 0,
      customerNumber: "",
      resultModel: false,
      resultData: "",
      userId: 0,
      itemsReturn: false,
      createdBy: 0,
      invoiceNumberValid: true,
      customerNumberValid: true,
      reasonValid: true,
      errors: {},
      isItemSelected: true,
      itemsList: [],
      dayCloseDates: [],
      toDay: moment(new Date()).format("YYYY-MM-DD").toString(),
    };
  }

  // async componentDidMount() {
  //   const userId = await AsyncStorage.getItem("userId");
  //   this.setState({ userId: userId });
  //   AsyncStorage.getItem("storeId").then((value) => {
  //     storeStringId = value;
  //     this.setState({ storeId: parseInt(storeStringId) });
  //     console.log("Store Id", this.state.storeId);
  //   }).catch(() => {
  //     this.setState({ loading: false });
  //     console.log('There is error getting storeId');
  //     // alert('There is error getting storeId');
  //   });
  // }

  async componentWillMount() {
    const userId = await AsyncStorage.getItem("userId");
    const storeId = await AsyncStorage.getItem("storeId");
    this.setState({ userId: userId, storeId: storeId });
    this.getallDates();
  }

  getallDates() {
    CustomerService.getDates(this.state.storeId).then(res => {
      if (res) {
        if (res.data.length > 0) {
          this.setState({ dayCloseDates: res.data });
        }
      }
    });
  }

  handleReasonDesc(text) {
    this.setState({ reasonDesc: text });
  }

  handleReason = (value) => {
    this.setState({ reason: value });
  };

  handleInvoiceNumber(text) {
    this.setState({ invoiceNumber: text });
  }

  handleMobileNumber(text) {
    this.setState({ mobileNumber: text.trim() });
  }

  validationForm() {
    let isFormValid = true;
    let errors = {};
    if (this.state.invoiceNumber === '') {
      isFormValid = false;
      errors["invoiceNumber"] = customerErrorMessages.invoiceNumber;
      this.setState({ invoiceNumberValid: false });
    }
    this.setState({ errors: errors });
    return isFormValid;
  }

  endEditing() {
    const isFormValid = this.validationForm();
    if (isFormValid) {
      this.searchInvoice();
    }
  }

  searchInvoice = () => {
    let returnInvoiceArray = [];
    let resultData = [];
    const obj = {
      invoiceNo: this.state.invoiceNumber.trim(),
      mobileNo: this.state.mobileNumber,
      storeId: this.state.storeId ? this.state.storeId : null,
      domianId: 1
    };
    // axios.post(CustomerService.getReturnSlip(), obj).then(res => {
    //   console.log(res.data.result);
    //   let items = res.data.result;
    //   for (let i = 0; i < items.length; i++) {
    //     returnInvoiceArray.push({ barCode: items[i].barcode, value: items[i].netValue, quantity: items[i].quantity, isSelected: false, mrp: items[i].mrp, returnQty: 0, promoValue: items[i].promoDiscount, manualValue: items[i].manualDiscount, gvValue: items[i].gvAppiled });
    //   }
    //   this.setState({ returnInvoice: returnInvoiceArray }, () => {
    //     let costprice = 0;
    //     let quantity = 0;
    //     this.state.returnInvoice.forEach(element => {
    //       costprice = costprice + element.netValue;
    //       quantity = quantity + element.quantity;
    //     });
    //     this.setState({ netValue: costprice, quantity: quantity, isChecked: false, itemsReturn: true });
    //   });
    // }).catch((err) => {
    //   this.setState({ loading: false });
    //   console.log(err);
    //   alert('Unable to get the Invoice Details');
    // });
    if (this.state.dayCloseDates.length !== 0) {
      if (this.state.dayCloseDates.length === 1 && this.state.dayCloseDates[0].dayClose.split("T")[0] === this.state.toDay) {
        CustomerService.getReturnSlipDetails(obj).then((res) => {
          if (res) {
            const allreturnslipsList = res.data.result
            this.setState(
              {
                // returnslipsList: res.data.result,
              },
              () => {
                let costprice = 0;
                let quantity = 0;
                let netValue = 0;
                var combineList = {};
                allreturnslipsList.forEach((itm) => {
                  var barcode = itm.barcode;
                  itm.quantity = itm.quantity
                  itm.netValue = itm.netValue
                  itm.manualDiscount = itm.manualDiscount
                  itm.promoDiscount = itm.promoDiscount
                  itm.gvAppiled = itm.gvAppiled

                  if (!combineList[barcode]) {
                    return combineList[barcode] = itm
                  }
                  return combineList[barcode].quantity = combineList[barcode].quantity + itm.quantity,
                    combineList[barcode].netValue = combineList[barcode].netValue + itm.netValue,
                    combineList[barcode].grossValue = combineList[barcode].grossValue + itm.grossValue,
                    combineList[barcode].manualDiscount = combineList[barcode].manualDiscount + itm.manualDiscount,
                    combineList[barcode].promoDiscount = combineList[barcode].manualDiscount + itm.promoDiscount,
                    combineList[barcode].gvAppiled = combineList[barcode].gvAppiled + itm.gvAppiled


                })
                console.log("combineList", combineList)
                var combineList2 = []
                Object.keys(combineList).forEach((key) => {
                  combineList2.push(combineList[key])
                })
                const clearList = [...combineList2]
                console.log("clearList", clearList)
                this.state.returnInvoice = clearList
                console.log("returnslipsList", this.state.returnInvoice)
                this.state.returnInvoice.forEach((element) => {
                  netValue = netValue + element.netValue;
                  costprice = costprice + element.mrp;
                  quantity = quantity + element.quantity;
                  if (element.quantity >= 1) {
                    element.returnQty = parseInt("0");
                    element.returnedAmout = parseInt("0")
                  }
                  element.isChecked = false;
                });
                if (this.state.returnInvoice.length === 1 && quantity === 1) {
                  this.setState({ returnSlipTotal: netValue });
                }

                this.setState({
                  netValue: netValue,
                  quantity: quantity,
                  amount: netValue,
                });
              }

            );


          }
        });
        this.setState({ returnedAmout: "" });
      } else {
        alert("Please Close Previous Days");
      }
    } else {
      alert("Unable To Return Today Daycloser Is Done");
    }
  };

  itemSelected(index, selectedElement) {
    if (selectedElement.isChecked === true) {
      if (selectedElement.quantity === 1) {
        selectedElement.returnQty = selectedElement.quantity;
        selectedElement.returnedAmout = (selectedElement.netValue) / selectedElement.returnQty
      }
      const obj = {
        netValue: selectedElement.netValue,
        barCode: selectedElement.barcode,
        quantity: selectedElement.quantity,
        mrp: selectedElement.mrp,
        returnQty: selectedElement.returnQty,
      };
      this.state.netValueList.push(obj);
      selectedElement.isChecked = false;
      // let index = this.state.netValueList.findIndex(ele => ele.barCode === item.barCode);
      // this.state.netValueList.splice(index, 1);
    }
    else {
      selectedElement.isChecked = true;
      // const obj = {
      //   amount: item.value,
      //   barCode: item.barCode,
      //   qty: item.quantity
      // };
      // this.state.netValueList.push(obj);
      selectedElement.returnQty = 0;
      selectedElement.returnedAmout = 0
    }
    // alert(itemPrice)
    // const netValueList = this.removeDuplicates(this.state.netValueList, "barCode");
    // this.setState({ netValueList: netValueList }, () => {
    //   let returnSlipTotal = 0;
    //   console.log("netvalueList", this.state.netValueList);
    // });
    this.state.returnInvoice.forEach((element, ind) => {
      if (element.returnQty && element.returnQty !== 0 && ind == index) {
        element.returnedAmout = (parseFloat(element.returnQty) * element.netValue) / element.quantity
      } else {
        element.returnedAmout = parseFloat(element.returnQty) * element.netValue
      }
      element.returnedAmout = (parseFloat(element.returnQty) * element.netValue) / element.quantity
    });
    let sumreturnedAmout = this.state.returnInvoice.reduce((accumulator, curValue) => {
      if (curValue.returnQty && curValue.returnQty !== '0') {
        accumulator = accumulator + curValue.returnedAmout;
      }
      return accumulator;

    }, 0);
    this.setState({ returnSlipTotal: (sumreturnedAmout) });

  }

  removeDuplicates(array, key) {
    const lookup = new Set();
    return array.filter(obj => !lookup.has(obj[key]) && lookup.add(obj[key]));
  }

  validationForReturnSlip() {
    let isFormValid = true;
    let errors = {};
    if (this.state.reason === "") {
      isFormValid = false;
      errors["reason"] = customerErrorMessages.reason;
      this.setState({ reasonValid: false });
    }
    this.setState({ errors: errors });
    return isFormValid;
  }

  generateNewSlip(item, index) {
    console.log(this.state.storeId);
    let barList = [];
    if (this.state.returnInvoice.length >= 1 && this.state.quantity > 1) {
      this.state.returnInvoice.forEach((element) => {
        const obj = {
          amount: element.netValue,
          barCode: element.barcode,
          qty: element.quantity,
          returnQty: element.returnQty ? parseInt(element.returnQty) : 0,
          returnAmount: element.returnedAmout ? (element.returnedAmout) : 0
        };
        barList.push(obj);
      });
    }
    else if (this.state.returnInvoice.length === 1 && this.state.quantity === 1) {
      this.state.returnInvoice.forEach((element) => {
        const obj = {
          amount: element.netValue,
          barCode: element.barcode,
          qty: element.quantity,
          returnQty: element.quantity ? parseInt(element.quantity) : 0,
          returnAmount: element.netValue ? (element.netValue) : 0
        };
        barList.push(obj);
        this.setState({ retBarList: barList })
      });
    }
    const saveObj = {
      barcodes: barList.filter((it) => it.returnQty && it.returnQty !== '0'),
      mobileNumber: this.state.mobileNumber ? this.state.mobileNumber : null,
      invoiceNumber: this.state.invoiceNumber,
      reason: this.state.reason,
      customerId: parseInt(this.state.userId),
      storeId: parseInt(this.state.storeId),
      totalAmount: parseInt(this.state.returnSlipTotal),
      createdBy: parseInt(this.state.userId),
      comments: this.state.reasonDesc,
      returnQty: this.state.returnQty,
    };
    console.log(saveObj, "params");
    axios.post(CustomerService.saveRetunSlip(), saveObj).then((res) => {
      console.log("return slip data,res", JSON.stringify(res.data));
      if (res) {
        alert(res.data.message);
        this.setState({
          resultData: res.data.message,
          // resultModel: true,
          modelVisible: true,
          netValueList: [],
          returnSlipTotal: 0,
          returnInvoice: [],
          mobileNumber: '',
          invoiceNumber: "",
          netValue: 0,
          quantity: 0,
          reason: "",
          customerNumber: "",
          createdBy: null,
          itemsReturn: false
        });

      }
      this.setState({ returnModel: false, modelVisible: false, loading: false, itemsReturn: false });
    }).catch((err) => {
      this.setState({
        returnModel: false, modelVisible: false, loading: false,
        netValueList: [],
        returnSlipTotal: 0,
        returnInvoice: [],
        mobileNumber: '',
        invoiceNumber: "",
        netValue: 0,
        quantity: 0,
        reason: "",
        customerNumber: "",
        createdBy: null,
        itemsReturn: false
      });
    });
  }

  handleCutomerTagging = () => {
    // alert("some data");
    this.setState({ customerTagging: true, modelVisible: true });
  };

  modelCancel() {
    this.setState({ modelVisible: false, returnModel: false, customerTagging: false, resultModel: false });
  }

  navigateToScanCode() {
    global.barcodeId = 'something';
    this.props.navigation.navigate('ScanBarCode', {
      isFromNewSale: false, isFromAddProduct: true,
      onGoBack: () => this.refresh(),
    });
  }

  validationField() {
    let isFormValid = true;
    let errors = {};
    if (this.state.customerNumber.length === 0 || this.state.customerNumber.length < 10) {
      isFormValid = false;
      errors["customerNumber"] = customerErrorMessages.customerNumber;
      this.setState({ customerNumberValid: false });
    }
    this.setState({ errors: errors });
    return isFormValid;
  }

  updateQty = (text, index, item) => {
    const Qty = /^[0-9\b]+$/;
    const qtyarr = [...this.state.returnInvoice];
    console.log(qtyarr[index].returnQty);
    let addItem = '';
    let value = text === '' ? 1 : text;
    if (value !== '' && Qty.test(value) === false) {
      addItem = 1;
      qtyarr[index].returnQty = addItem.toString();
    } else {
      if (parseInt(value) < parseInt(qtyarr[index].quantity)) {
        addItem = value;
        qtyarr[index].returnQty = addItem.toString();
      } else {
        addItem = qtyarr[index].quantity;
        qtyarr[index].returnQty = addItem.toString();
      }
    }
    let totalcostMrp = item.itemMrp * parseInt(qtyarr[index].returnQty);
    item.totalMrp = totalcostMrp;
    // this.setState({ returnInvoice: qtyarr });
    this.state.returnInvoice.forEach((element, ind) => {
      if (element.returnQty && element.returnQty !== 0 && ind == index) {
        const perQty = (element.netValue / element.quantity)
        element.returnedAmout = (parseInt(element.returnQty)) * perQty
      } else if (element.returnQty === '' && element.returnQty === 0 && ind == index) {
        element.returnedAmout = 0
        element.isChecked = false;
      }
      element.returnedAmout = parseInt(element.returnQty) * element.netValue / element.quantity
    });
    let sumreturnedAmout = this.state.returnInvoice.reduce((accumulator, curValue) => {
      if (curValue.returnQty && curValue.returnQty !== '0') {
        accumulator = accumulator + curValue.returnedAmout;
      }
      return accumulator;

    }, 0);
    this.setState({ returnSlipTotal: (sumreturnedAmout) });
    // let grandTotal = 0;
    // let totalqty = 0;
    // this.state.returnInvoice.forEach(bardata => {
    //   grandTotal = grandTotal + bardata.value / bardata.quantity * String(bardata.returnQty);
    //   totalqty = totalqty + parseInt(bardata.returnQty);
    // });
    // this.setState({ totalQuantity: totalqty,  });
    // this.state.totalQuantity = (parseInt(this.state.totalQuantity) + 1);
    // this.setState({ itemsList: qtyarr });
  };

  incrementForTable = (item, index) => {
    const qtyarr = [...this.state.returnInvoice];
    console.log(qtyarr[index].quantity);
    console.log({ qtyarr });
    if (parseInt(qtyarr[index].returnQty) < parseInt(qtyarr[index].quantity)) {
      var additem = parseInt(qtyarr[index].returnQty) + 1;
      qtyarr[index].returnQty = additem.toString();
    } else {
      var additem = parseInt(qtyarr[index].returnQty);
      qtyarr[index].returnQty = additem.toString();
      alert(`only ${additem} items are in this barcode`);
    }
    this.setState({ returnInvoice: qtyarr });

    // let grandTotal = 0;
    // let totalqty = 0;
    // this.state.returnInvoice.forEach(bardata => {
    //   grandTotal = grandTotal + bardata.value / bardata.quantity * bardata.returnQty;
    //   totalqty = totalqty + parseInt(bardata.returnQty);
    // });
    this.state.returnInvoice.forEach((element, ind) => {
      if (element.returnQty && element.returnQty !== 0 && ind == index) {
        const perQty = (element.netValue / element.quantity)
        element.returnedAmout = (parseInt(element.returnQty)) * perQty
      } else if (element.returnQty === '' && element.returnQty === 0 && ind == index) {
        element.returnedAmout = 0
        element.isChecked = false;
      }
      element.returnedAmout = parseInt(element.returnQty) * element.netValue / element.quantity
    });
    let sumreturnedAmout = this.state.returnInvoice.reduce((accumulator, curValue) => {
      if (curValue.returnQty && curValue.returnQty !== '0') {
        accumulator = accumulator + curValue.returnedAmout;
      }
      return accumulator;

    }, 0);
    this.setState({ returnSlipTotal: (sumreturnedAmout) });
    // this.setState({ totalQuantity: totalqty });
    // this.state.totalQuantity = (parseInt(this.state.totalQuantity) + 1);
  };

  decreamentForTable(item, index) {
    const qtyarr = [...this.state.returnInvoice];
    if (qtyarr[index].returnQty > 0) {
      var additem = parseInt(qtyarr[index].returnQty) - 1;
      qtyarr[index].returnQty = additem.toString();
      let totalcostMrp = item.itemMrp * parseInt(qtyarr[index].returnQty);
      item.totalMrp = totalcostMrp;
      // this.state.totalQuantity = (parseInt(this.state.totalQuantity) - 1);
      let grandTotal = 0;
      let totalqty = 0;
      this.state.returnInvoice.forEach((element, ind) => {
        if (element.returnQty && element.returnQty !== 0 && ind == index) {
          const perQty = (element.netValue / element.quantity)
          element.returnedAmout = (parseInt(element.returnQty)) * perQty
        } else if (element.returnQty === '' && element.returnQty === 0 && ind == index) {
          element.returnedAmout = 0
          element.isChecked = false;
        }
        element.returnedAmout = parseInt(element.returnQty) * element.netValue / element.quantity
      });
      let sumreturnedAmout = this.state.returnInvoice.reduce((accumulator, curValue) => {
        if (curValue.returnQty && curValue.returnQty !== '0') {
          accumulator = accumulator + curValue.returnedAmout;
        }
        return accumulator;

      }, 0);
      this.setState({ returnSlipTotal: (sumreturnedAmout) });
      // this.setState({  totalQuantity: totalqty });
      this.setState({ returnInvoice: qtyarr });
    } else {
      this.state.returnInvoice.splice(index, 1);
      this.setState({ returnInvoice: this.state.returnInvoice });
    }
  }

  customerTag() {
    const isFormValid = this.validationField();
    if (isFormValid) {
      const obj = {
        "id": "",
        "phoneNo": "+91" + this.state.customerNumber,
        "name": "",
        "active": false,
        "inActive": false,
        "roleId": "",
        "storeId": ""
      };
      axios.get(CustomerService.getCustomerMobile() + "/" + obj.phoneNo).then((res) => {
        console.log(res);
        if (res) {
          console.log(res.data);
          const mobileData = res.data.result;
          this.setState({
            userId: res.data.result.userId, customerFullName: res.data.result.userName
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
          alert("tagged successfully");
          this.modelCancel();

          this.setState({
            customerNumber: '',
          });

        }
      }).catch(() => {
        this.modelCancel();
        alert('Unable to get customer details');
      });
    }
  }

  handleCustomerNumber(text) {
    this.setState({ customerNumber: text.trim() });
  }

  refresh() {
    if (global.barcodeId != 'something') {
      this.setState({ invoiceNumber: global.barcodeId },
        () => {
          this.searchInvoice();
        });
      global.barcodeId = 'something';
    }
    console.log('bar code is sadsadsdsadsds' + this.state.invoiceNumber);
  }


  render() {
    return (
      <View style={{ backgroundColor: color.white }}>
        <ScrollView>
          <View style={[scss.page_navigation_subcontainer, { marginTop: 20 }]}>
            <TextInput
              style={[forms.input_fld, { width: "75%", minWidth: "75%", maxWidth: "75%" }]}
              mode="flat"
              activeUnderlineColor='#000'
              underlineColor={'#6f6f6f'}
              label={I18n.t("Scan Invoice Number")}
              value={this.state.invoiceNumber}
              onChangeText={(text) => this.handleInvoiceNumber(text)}
              onEndEditing={() => this.endEditing()}
            />
            <TouchableOpacity style={{ padding: RF(10) }} onPress={() => this.navigateToScanCode()} >
              <IconMA name='barcode-scan' size={30} color={color.black} />
            </TouchableOpacity>
          </View>
          {!this.state.invoiceNumberValid && (
            <Message imp={true} message={this.state.errors["invoiceNumber"]} />
          )}
          {/* <TextInput
          style={Device.isTablet ? styles.input_tablet : styles.input_mobile}
          underlineColorAndroid="transparent"
          placeholder={I18n.t("MOBILE NUMBER")}
          placeholderTextColor="#6F6F6F"
          textAlignVertical="center"
          // keyboardType={'default'}
          autoCapitalize="none"
          maxLength={10}
          keyboardType={'numeric'}
          value={this.state.mobileNumber}
          onChangeText={(text) => this.handleMobileNumber(text)}
          onEndEditing={() => this.endEditing()}
        /> */}
          <View
            style={{
              flexDirection: 'row',
            }}
          >
            {/* <TouchableOpacity
            style={[Device.isTablet ? styles.signInButton_tablet : styles.signInButton_mobile, { borderRadius: Device.isTablet ? 10 : 5, height: Device.isTablet ? 46 : 36, borderWidth: Device.isTablet ? 2 : 1, borderColor: '#858585' }]}
            onPress={this.searchInvoice}
          >
            <Text
              style={[Device.isTablet ? styles.signInButtonText_tablet : styles.signInButtonText_mobile]}
            >
              {I18n.t("SEARCH")}
            </Text>
          </TouchableOpacity> */}
            {/* <TouchableOpacity style={checkPromoDiscountBtn} onPress={this.handleCutomerTagging} >
              <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                <Image source={require('../../commonUtils/assets/Images/tag_customer_icon.png')} />
                <Text style={Device.isTablet ? styles.cancelButtonText_tablet : styles.cancelButtonText_mobile}>{I18n.t("CUSTOMER TAGGING")}</Text>
              </View>
            </TouchableOpacity> */}
          </View>
          {this.state.customerTagging && (
            <View>
              <Modal style={{ margin: 0 }} isVisible={this.state.modelVisible}
                onBackButtonPress={() => this.modelCancel()}
                onBackdropPress={() => this.modelCancel()} >
                <View style={forms.filterModelContainer} >
                  <Text style={forms.popUp_decorator}>-</Text>
                  <View style={forms.filterModelSub}>
                    <Text style={{
                      height: Device.isTablet ? 40 : 20,
                      textAlign: 'center',
                      fontFamily: 'regular',
                      fontSize: Device.isTablet ? 23 : 18,
                      marginBottom: Device.isTablet ? 25 : 15,
                      color: '#353C40'
                    }}> {I18n.t("Please provide customer phone number")}  </Text>
                    <TextInput
                      style={forms.input_fld}
                      mode="flat"
                      activeUnderlineColor='#000'
                      underlineColor={'#6f6f6f'}
                      label={I18n.t("MOBILE NUMBER")}
                      maxLength={10}
                      keyboardType='phone-pad'
                      value={this.state.customerNumber}
                      onChangeText={(text) => this.handleCustomerNumber(text)}
                    />
                    {!this.state.customerNumberValid && (
                      <Message imp={true} message={this.state.errors["customerNumber"]} />
                    )}
                    <View style={forms.action_buttons_container}>
                      <TouchableOpacity style={[forms.action_buttons, forms.submit_btn]}
                        onPress={() => this.customerTag()}>
                        <Text style={forms.submit_btn_text} >{I18n.t("CONFIRM")}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[forms.action_buttons, forms.cancel_btn]}
                        onPress={() => this.modelCancel()}>
                        <Text style={forms.cancel_btn_text}>{I18n.t("CANCEL")}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            </View>
          )}
          {this.state.returnInvoice && this.state.returnInvoice.length > 0 && (
            <>
              <>
                <Text style={[highText_black, { marginLeft: RF(10) }]}>{I18n.t("List Of Items For Return -")}<Text style={[textStyle, { color: color.accent, fontSize: RF(16) }]}>{('0' + this.state.returnInvoice.length).slice(-2)} </Text></Text>
                <FlatList
                  style={{ marginTop: 20, marginBottom: 20 }}
                  data={this.state.returnInvoice}
                  scrollEnabled={true}
                  renderItem={({ item, index }) => (
                    <>
                      <View style={[flatListMainContainer, { backgroundColor: color.white }]}>
                        {this.state.returnInvoice.length > 1 && item.quantity >= 1 &&
                          <TouchableOpacity onPress={(e) => this.itemSelected(index, item)} style={{ width: 20, height: 20 }}>
                            <Image style={{}} source={
                              //require('../assets/images/chargeunselect.png')}
                              item.isChecked ?
                                require('../../commonUtils/assets/Images/checkbox_checked.png') :
                                require('../../commonUtils/assets/Images/checkbox_uncheck.png')} />
                          </TouchableOpacity>}
                        <View style={flatlistSubContainer}>
                          <View style={textContainer}>
                            <Text style={textStyleMediumColor}>{I18n.t("Item")}</Text>
                            <Text style={textStyleMediumColor}>{I18n.t("Barcode")} :
                              <Text style={textStyleMedium}>{" " + item.barcode}</Text></Text>
                          </View>
                          <View style={textContainer}>
                            <Text style={textStyleMediumColor}> {I18n.t("QTY")}</Text>
                            {this.state.returnInvoice.length >= 1 && this.state.quantity >= 1 &&
                              <Text style={textStyleMediumColor}> {I18n.t("RETURN QTY")}</Text>
                            }
                          </View>
                          <View style={textContainer}>
                            <Text style={textStyleMedium}>{item.quantity}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              {this.state.returnInvoice.length > 1 && item.quantity >= 1 &&
                                <Text style={textStyleMedium}>{item.returnQty}</Text>
                              }
                              {this.state.returnInvoice.length > 0 && item.quantity > 1 &&
                                <>
                                  <TouchableOpacity
                                    onPress={() => this.incrementForTable(item, index)}>
                                    <IconMA name="plus-circle-outline" size={20} color={"red"} />
                                  </TouchableOpacity>
                                  <TextInput
                                    style={{
                                      justifyContent: 'center',
                                      // height: Device.isTablet ? 50 : 30,
                                      // width: Device.isTablet ? 50 : 30,
                                      color: '#ED1C24',
                                      fontFamily: 'regular',
                                      fontSize: Device.isTablet ? 22 : 12,
                                    }}
                                    underlineColorAndroid="transparent"
                                    placeholderTextColor="#ED1C24"
                                    value={('0' + item.returnQty).slice(-2)}
                                    onChangeText={(text) => this.updateQty(text, index, item)}
                                  />
                                  <TouchableOpacity
                                    onPress={() => this.decreamentForTable(item, index)}>
                                    <IconMA name="minus-circle-outline" size={20} color={"red"} />
                                  </TouchableOpacity>
                                </>
                              }
                              {this.state.returnInvoice.length === 1 && (item.quantity === 1) && this.state.quantity === 1 &&
                                <Text style={textStyleMedium}>{item.quantity}</Text>}
                            </View>
                          </View>
                          <View style={textContainer}>
                            <Text style={textStyleMediumColor}>{I18n.t("MRP")}</Text>
                            <Text style={textStyleMediumColor}>{I18n.t("PROMO")}</Text>
                            <Text style={textStyleMediumColor}>{I18n.t("MANUAL")}</Text>
                            <Text style={textStyleMediumColor}>{I18n.t("GV APPLIED")}</Text>
                          </View>
                          <View style={textContainer}>
                            <Text style={textStyleMedium}>₹{item.mrp}</Text>
                            <Text style={textStyleMedium}>₹{parseFloat(item.promoDiscount).toFixed(2)}</Text>
                            <Text style={textStyleMedium}>₹{parseFloat(item.manualDiscount).toFixed(2)}</Text>
                            <Text style={textStyleMedium}>₹{parseFloat(item.gvAppiled).toFixed(2)}</Text>
                          </View>
                          <View style={textContainer}>
                            <Text style={textStyleMediumColor}> {I18n.t("VALUE")}</Text>
                            <Text style={textStyleMediumColor}> {I18n.t("PER/QUANTITY")}</Text>
                          </View>
                          <View style={textContainer}>
                            <Text style={textStyleMedium}>₹{parseFloat(item.netValue).toFixed(2)}</Text>
                            <Text style={textStyleMedium}>₹{parseFloat(item.netValue / item.quantity).toFixed(2)}</Text>
                          </View>
                        </View>
                      </View>
                    </>
                  )}
                />
              </>
              <View style={{ backgroundColor: "#F8F8F8", margin: RF(10) }}>
                <Text style={[highText_black, { alignSelf: 'center' }]}>{I18n.t("Return summary")}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={[highText]}>{I18n.t("Retrun Amount")} </Text>
                  <Text style={[highText]}> ₹ {this.state.returnSlipTotal} </Text>
                </View>
                <Text style={[textStyleMediumColor]}>{I18n.t("Return For Reason")} </Text>
                <RnPicker
                  items={pickerData}
                  setValue={this.handleReason}
                />
                {!this.state.reasonValid && (
                  <Message imp={true} message={this.state.errors["reason"]} />
                )}
                <Text style={textStyleMediumColor}>{I18n.t("Comments")}</Text>
                <TextInput
                  style={forms.text_area}
                  label={I18n.t('Write comments')}
                  multiline
                  numberOfLines={5}
                  mode="flat"
                  activeUnderlineColor='#000'
                  underlineColor={'#6f6f6f'}
                  value={this.state.reasonDesc}
                  onChangeText={(text) => this.handleReasonDesc(text)}
                />
                <View style={forms.action_buttons_container}>
                  <TouchableOpacity
                    style={[forms.action_buttons, forms.submit_btn, { width: "90%" }]}
                    onPress={(item, index) => this.generateNewSlip(item, index)}
                  >
                    <Text style={forms.submit_btn_text}>
                      {I18n.t("GENERATE RETURN SLIP")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}

          {/* {this.state.returnModel && (
          <View>
            <Modal style={{ margin: 0 }} isVisible={this.state.modelVisible}>
              <View style={[Device.isTablet ? styles.filterMainContainer_tablet : styles.filterMainContainer_mobile, { height: Device.isTablet ? 500 : 400, backgroundColor: '#00aa00' }]}>
                <View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, height: Device.isTablet ? 60 : 50 }}>
                    <View>
                      <Text style={{ marginTop: 15, fontSize: Device.isTablet ? 22 : 17, marginLeft: 20, color: '#ffffff' }} > {I18n.t("List of Return Items")} </Text>
                    </View>
                    <View>
                      <TouchableOpacity style={{ width: Device.isTablet ? 60 : 50, height: Device.isTablet ? 60 : 50, marginTop: Device.isTablet ? 20 : 15, marginRight: Device.isTablet ? 0 : -5 }} onPress={() => this.modelCancel()}>
                        <Image style={{ width: Device.isTablet ? 20 : 15, height: Device.isTablet ? 20 : 15, margin: 5 }} source={require('../assets/images/modalCloseWhite.png')} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={{
                    height: Device.isTablet ? 2 : 1,
                    width: deviceWidth,
                    backgroundColor: 'lightgray',
                  }}></Text>
                </View>

                <View style={{ backgroundColor: '#ffffff', height: Device.isTablet ? 450 : 350 }}>
                  <View style={{ height: Device.isTablet ? 250 : 200 }}>
                    <FlatList
                      data={this.state.netValueList}
                      scrollEnabled={true}
                      renderItem={({ item, index }) => (
                        <View style={flatListMainContainer} >
                          <View style={flatlistSubContainer}>
                            <View style={textContainer}>
                              <Text style={textStyleMedium}>SLIP NO: {item.barCode}</Text>
                              <Text style={textStyleLight}>ITEMS: {item.qty}</Text>
                              <Text style={textStyleLight}>VALUE: {item.amount}</Text>
                            </View>
                          </View>
                        </View>
                      )}
                    />
                  </View>

                  <TouchableOpacity
                    style={[Device.isTablet ? styles.filterApplyButton_tablet : styles.filterApplyButton_mobile, { backgroundColor: '#00aa00' }]}
                    onPress={() => this.generateNewSlip()}
                  >
                    <Text style={Device.isTablet ? styles.filterButtonText_tablet : styles.filterButtonText_mobile}  > {I18n.t("GENERATE NEW")} </Text>

                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[Device.isTablet ? styles.filterCancelButton_tablet : styles.filterCancelButton_mobile, { borderColor: '#00aa00' }]} onPress={() => this.modelCancel()}
                  >
                    <Text style={[Device.isTablet ? styles.filterButtonCancelText_tablet : styles.filterButtonCancelText_mobile, { color: '#00aa00' }]}  > {I18n.t("BACK TO DASHBOARD")} </Text>

                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        )} */}
        </ScrollView>
      </View>
    );
  }
}


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
    borderWidth: Device.isTablet ? 2 : 1,
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
    borderWidth: Device.isTablet ? 2 : 1,
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
    borderWidth: Device.isTablet ? 2 : 1,
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
    borderWidth: Device.isTablet ? 2 : 1,
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

const styles = StyleSheet.create({
  imagealign: {
    marginTop: Device.isTablet ? 25 : 20,
    marginRight: Device.isTablet ? 30 : 20,
  },
  rnSelectContainer_mobile: {
    justifyContent: 'center',
    height: 44,
    marginTop: 5,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    paddingLeft: 15,
    borderColor: '#8F9EB717',
    borderRadius: 3,
    backgroundColor: '#FBFBFB',
    borderWidth: Device.isTablet ? 2 : 1,
    fontFamily: 'regular',
    fontSize: 14,
  },
  rnSelectContainer_tablet: {
    justifyContent: 'center',
    height: 54,
    marginTop: 5,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    paddingLeft: 15,
    borderColor: '#8F9EB717',
    borderRadius: 3,
    backgroundColor: '#FBFBFB',
    borderWidth: Device.isTablet ? 2 : 1,
    fontFamily: 'regular',
    fontSize: 20,
  }
});
