import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { Component } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Device from 'react-native-device-detection';
import I18n from 'react-native-i18n';
import Modal from 'react-native-modal';
import RNPickerSelect from 'react-native-picker-select';
import { Chevron } from 'react-native-shapes';
import { RF, RH, RW } from '../../Responsive';
import CustomerService from '../services/CustomerService';
import { flatListMainContainer, flatlistSubContainer, textContainer, textStyleLight, textStyleMedium, textStyleMediumColor } from '../Styles/Styles';
import ScanIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { color } from '../Styles/colorStyles';
import { checkPromoDiscountBtn, inputField, textStyle } from '../Styles/FormFields';
import { TextInput } from 'react-native-paper'
import { customerErrorMessages } from '../Errors/errors';
import Message from '../Errors/Message';
import PlusIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import MinusIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import forms from '../../commonUtils/assets/styles/formFields.scss';


var deviceheight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get("window").width;

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
      isItemSelected: true
    };
  }

  async componentDidMount() {
    const userId = await AsyncStorage.getItem("userId");
    this.setState({ userId: userId });
    console.log(userId, "userId");
    AsyncStorage.getItem("storeId").then((value) => {
      storeStringId = value;
      this.setState({ storeId: parseInt(storeStringId) });
      console.log("Store Id", this.state.storeId);
    }).catch(() => {
      this.setState({ loading: false });
      console.log('There is error getting storeId');
      // alert('There is error getting storeId');
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
    const isFormValid = this.validationForm()
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
      domianId: 1
    };
    console.log(this.state.invoiceNumber);
    axios.post(CustomerService.getReturnSlip(), obj).then(res => {
      console.log(res.data.result);
      let items = res.data.result;
      for (let i = 0; i < items.length; i++) {
        returnInvoiceArray.push({ barCode: items[i].barcode, value: items[i].netValue, quantity: items[i].quantity, isSelected: true });
      }
      this.setState({ returnInvoice: returnInvoiceArray }, () => {
        let costprice = 0;
        let quantity = 0;
        this.state.returnInvoice.forEach(element => {
          costprice = costprice + element.netValue;
          quantity = quantity + element.quantity;
        });
        this.setState({ netValue: costprice, quantity: quantity, isChecked: false, itemsReturn: true });
        console.log("Return Items", this.state.returnInvoice, this.state.itemsReturn);
      });
    }).catch((err) => {
      this.setState({ loading: false });
      console.log(err);
      alert('Unable to get the Invoice Details');
    });
  };

  itemSelected(e, index, item) {
    if (item.isSelected === true) {
      item.isSelected = false;
      let index = this.state.netValueList.findIndex(ele => ele.barCode === item.barCode);
      this.state.netValueList.splice(index, 1);
    }
    else {
      item.isSelected = true;
      const obj = {
        amount: item.value,
        barCode: item.barCode,
        qty: item.quantity
      };
      this.state.netValueList.push(obj);
    }
    // alert(itemPrice)
    const netValueList = this.removeDuplicates(this.state.netValueList, "barCode");
    this.setState({ netValueList: netValueList }, () => {
      let returnSlipTotal = 0;
      console.log("netvalueList", this.state.netValueList);
      this.state.netValueList.forEach(ele => {
        returnSlipTotal = returnSlipTotal + ele.amount;
      });
      this.setState({ returnSlipTotal: returnSlipTotal });
    });
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

  generateNewSlip() {
    console.log(this.state.storeId);
    console.log("returnSlipList", this.state.netValueList);
    // const isFormValid = this.validationForReturnSlip()
    const saveObj = {
      barcodes: this.state.netValueList,
      mobileNumber: this.state.mobileNumber ? this.state.mobileNumber : null,
      invoiceNumber: this.state.invoiceNumber,
      reason: this.state.reason,
      customerId: parseInt(this.state.userId),
      storeId: parseInt(this.state.storeId),
      totalAmount: parseInt(this.state.returnSlipTotal),
      createdBy: this.state.createdBy,
      comments: this.state.reasonDesc
    };
    // if (isFormValid) {
    console.log(saveObj, "params");
    axios.post(CustomerService.saveRetunSlip(), saveObj).then((res) => {
      console.log("return slip data,res", JSON.stringify(res.data))
      if (res) {
        alert(res.data.message)
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
          createdBy: null
        });

      }
      this.setState({ returnModel: false, modelVisible: false, loading: false });
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
        createdBy: null
      });
    });
    // }
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
    const qtyarr = [...this.state.itemsList];
    console.log(qtyarr[index].quantity);
    let addItem = '';
    let value = text === '' ? 1 : text;
    if (value !== '' && Qty.test(value) === false) {
      addItem = 1;
      qtyarr[index].quantity = addItem.toString();
    } else {
      if (parseInt(value) < parseInt(qtyarr[index].qty)) {
        addItem = value;
        qtyarr[index].quantity = addItem.toString();
      } else {
        addItem = qtyarr[index].qty;
        qtyarr[index].quantity = addItem.toString();
      }
    }
    let totalcostMrp = item.itemMrp * parseInt(qtyarr[index].quantity);
    item.totalMrp = totalcostMrp;
    this.setState({ itemsList: qtyarr });
    console.error("TEXT", value);
    let grandTotal = 0;
    let totalqty = 0;
    this.state.barList.forEach(bardata => {
      grandTotal = grandTotal + bardata.totalMrp;
      totalqty = totalqty + parseInt(bardata.quantity);
    });
    this.setState({ mrpAmount: grandTotal, totalQuantity: totalqty });
    this.state.totalQuantity = (parseInt(this.state.totalQuantity) + 1);
    // this.setState({ itemsList: qtyarr });
  };

  incrementForTable(item, index) {
    const qtyarr = [...this.state.itemsList];
    console.log(qtyarr[index].quantity);
    if (parseInt(qtyarr[index].quantity) < parseInt(qtyarr[index].qty)) {
      var additem = parseInt(qtyarr[index].quantity) + 1;
      qtyarr[index].quantity = additem.toString();
    } else {
      var additem = parseInt(qtyarr[index].qty);
      qtyarr[index].quantity = additem.toString();
      alert(`only ${additem} items are in this barcode`);
    }
    let totalcostMrp = item.itemMrp * parseInt(qtyarr[index].quantity);
    item.totalMrp = totalcostMrp;
    this.setState({ itemsList: qtyarr });

    let grandTotal = 0;
    let totalqty = 0;
    this.state.barList.forEach(bardata => {
      grandTotal = grandTotal + bardata.totalMrp;
      totalqty = totalqty + parseInt(bardata.quantity);
    });
    this.setState({ mrpAmount: grandTotal, totalQuantity: totalqty });
    this.state.totalQuantity = (parseInt(this.state.totalQuantity) + 1);
  }

  decreamentForTable(item, index) {
    const qtyarr = [...this.state.itemsList];
    if (qtyarr[index].quantity > 1) {
      var additem = parseInt(qtyarr[index].quantity) - 1;
      qtyarr[index].quantity = additem.toString();
      let totalcostMrp = item.itemMrp * parseInt(qtyarr[index].quantity);
      item.totalMrp = totalcostMrp;
      this.state.totalQuantity = (parseInt(this.state.totalQuantity) - 1);
      let grandTotal = 0;
      let totalqty = 0;
      this.state.barList.forEach(bardata => {
        grandTotal = grandTotal + bardata.totalMrp;
        totalqty = totalqty + parseInt(bardata.quantity);
      });
      this.setState({ mrpAmount: grandTotal, totalQuantity: totalqty });
      this.setState({ itemsList: qtyarr });
    } else {
      this.state.itemsList.splice(index, 1);
      this.setState({ barList: this.state.itemsList });
      this.calculateTotal();
    }
  }

  customerTag() {
    const isFormValid = this.validationField()
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
    console.log("this.state.item", !this.state.itemsReturn);
    return (
      <View style={{ backgroundColor: color.white }}>
        <View style={{ flexDirection: 'row', width: Device.isTablet ? deviceWidth - 20 : deviceWidth - 10, justifyContent: 'space-between', marginTop: 20 }}>
          <TextInput style={[Device.isTablet ? styles.input_tablet : inputField, { width: Device.isTablet ? deviceWidth / 1.3 : deviceWidth / 1.25, borderColor: '#8F9EB717', marginRight: RW(0) }]}
            mode="flat"
            activeUnderlineColor='#000'
            underlineColor={'#6f6f6f'}
            label={I18n.t("Scan Invoice Number")}
            value={this.state.invoiceNumber}
            onChangeText={(text) => this.handleInvoiceNumber(text)}
            onEndEditing={() => this.endEditing()}
          />
          <TouchableOpacity style={{ padding: RF(10) }} onPress={() => this.navigateToScanCode()} >
            <ScanIcon name='barcode-scan' size={30} color={color.black} />
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
          <TouchableOpacity style={checkPromoDiscountBtn} onPress={this.handleCutomerTagging} >
            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
              <Image source={require('../../commonUtils/assets/Images/tag_customer_icon.png')} />
              <Text style={Device.isTablet ? styles.cancelButtonText_tablet : styles.cancelButtonText_mobile}>{I18n.t("CUSTOMER TAGGING")}</Text>
            </View>
          </TouchableOpacity>
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
                    style={forms.inputfld}
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
        {this.state.itemsReturn && (
          <>
            <>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <Text style={Device.isTablet ? styles.headerText_tablet : styles.hederText_mobile}>{I18n.t("List Of Items For Return -")} </Text>
                <Text style={[textStyle, { color: color.accent, fontSize: RF(16) }]}>{('0' + this.state.returnInvoice.length).slice(-2)} </Text>
              </View>
              <FlatList
                style={{ marginTop: 20, marginBottom: 20 }}
                data={this.state.returnInvoice}
                scrollEnabled={true}
                renderItem={({ item, index }) => (
                  <>
                    <View style={[flatListMainContainer, { backgroundColor: color.white }]}>
                      <TouchableOpacity onPress={(e) => this.itemSelected(e, index, item)} style={{ width: 20, height: 20 }}>
                        <Image style={{}} source={
                          //require('../assets/images/chargeunselect.png')}
                          item.isSelected ?
                            require('../../commonUtils/assets/Images/checkbox_checked.png') :
                            require('../../commonUtils/assets/Images/checkbox_uncheck.png')} />
                      </TouchableOpacity>
                      <View style={flatlistSubContainer}>
                        <View style={textContainer}>
                          <Text style={textStyleMediumColor}>{I18n.t("Item")}</Text>
                          <Text style={textStyleMediumColor}>{I18n.t("QTY")}</Text>
                          <Text style={textStyleMediumColor}>{I18n.t("MRP")}</Text>
                        </View>
                        <View style={textContainer}>
                          <Text style={textStyleMedium}>{item.barCode}</Text>
                          {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity
                              onPress={() => this.incrementForTable(item, index)}>
                              <PlusIcon name="plus-circle-outline" size={20} color={"red"} />
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
                              placeholder="01"
                              placeholderTextColor="#ED1C24"
                              value={('0' + item.quantity).slice(-2)}
                              onChangeText={(text) => this.updateQty(text, index, item)}
                              
                            />
                            <TouchableOpacity
                              onPress={() => this.decreamentForTable(item, index)}>
                              <MinusIcon name="minus-circle-outline" size={20} color={"red"} />
                            </TouchableOpacity>
                          </View> */}
                          <Text style={textStyleMedium}>{item.quantity}</Text>
                          <Text style={textStyleMedium}>₹ {item.value + '.00'}</Text>
                        </View>
                      </View>
                    </View>
                    {/* <View style={Device.isTablet ? flats.flatlistContainer_tablet : flats.flatlistContainer_mobile} >
                    <View style={Device.isTablet ? flats.flatlistSubContainer_tablet : flats.flatlistSubContainer_mobile}>
                      <View style={flats.text}>
                        <TouchableOpacity onPress={(e) => this.itemSelected(e, index, item)} style={{ position: 'relative', top: 60, left: 10, width: 20, height: 20 }}>
                          <Image style={{ position: 'absolute', top: 0, left: 0, }} source={
                            //require('../assets/images/chargeunselect.png')}
                            item.isSelected ? require('../assets/images/selected.png') : require('../assets/images/langunselect.png')} />
                        </TouchableOpacity>
                        <View style={{ marginLeft: 60 }}>
                          <Image source={require('../assets/images/default.jpeg')}
                            //source={{ uri: item.image }}
                            style={{
                              width: Device.isTablet ? 140 : 90, height: Device.isTablet ? 140 : 90,
                            }} />
                          <Text style={[Device.isTablet ? flats.flatlistTextAccent_tablet : flats.flatlistTextAccent_mobile, { marginLeft: 30, marginTop: 10 }]}>S.NO: {index + 1}</Text>
                        </View>
                      </View>
                      <View style={[flats.text, { marginRight: Device.isTablet ? 20 : 0 }]}>
                        <Text style={Device.isTablet ? flats.flatlistTextCommon_tablet : flats.flatlistTextCommon_mobile}>BARCODE: {item.barCode}</Text>
                        <Text style={Device.isTablet ? flats.flatlistTextCommon_tablet : flats.flatlistTextCommon_mobile}>QTY: {item.quantity}</Text>
                        <Text style={Device.isTablet ? flats.flatlistText_tablet : flats.flatlistText_mobile}>PRICE: {item.value}</Text>
                      </View>
                    </View>
                  </View> */}
                  </>
                )}
              />
            </>
            <View style={{ backgroundColor: "#F8F8F8" }}>
              <Text style={[styles.textAccentStyle, { alignSelf: 'center', marginLeft: RF(0) }]}>{I18n.t("Return summary")}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={[styles.textAccentStyle, { color: color.black, fontSize: RF(14), marginLeft: RF(10) }]}>{I18n.t("Retrun Amount")} </Text>
                <Text style={[styles.textAccentStyle, { color: color.black, fontSize: RF(14), marginRight: RF(10) }]}> ₹ {this.state.returnSlipTotal + '.00'} </Text>
              </View>
              <Text style={styles.headings}>{I18n.t("Return For Reason")} </Text>
              <View style={Device.isTablet ? styles.rnSelectContainer_tablet : styles.rnSelectContainer_mobile}>
                <RNPickerSelect
                  // style={Device.isTablet ? styles.rnSelect_tablet : styles.rnSelect_mobile}
                  placeholder={{ label: 'REASON', value: '' }}
                  Icon={() => {
                    return <Chevron style={styles.imagealign} size={1.5} color="gray" />;
                  }}
                  items={[
                    { label: 'Not Fitting', value: 'Not Fitting' },
                    { label: 'Damaged Piece', value: 'Damaged Piece' },
                    { label: 'Quality is Not Good', value: 'Quality is Not Good' },
                    { label: 'Others', value: 'Others' },
                  ]}
                  onValueChange={this.handleReason}
                  style={Device.isTablet ? pickerSelectStyles_tablet : pickerSelectStyles_mobile}
                  value={this.state.reason}
                  useNativeAndroidPickerStyle={false}
                />
              </View>
              {!this.state.reasonValid && (
                <Message imp={true} message={this.state.errors["reason"]} />
              )}
              <Text style={styles.headings}>{I18n.t("Comments")}</Text>
              <TextInput
                style={styles.textarea}
                label={I18n.t('Write comments')}
                multiline
                numberOfLines={5}
                mode="flat"
                activeUnderlineColor='#000'
                underlineColor={'#6f6f6f'}
                value={this.state.reasonDesc}
                onChangeText={(text) => this.handleReasonDesc(text)}
              />
              <TouchableOpacity
                style={[Device.isTablet ? styles.signInButton_tablet : styles.signInButton_mobile, { width: deviceWidth - 40, height: Device.isTablet ? 60 : 50 }]}
                onPress={() => this.generateNewSlip()}
              >
                <Text
                  style={Device.isTablet ? styles.signInButtonText_tablet : styles.signInButtonText_mobile}
                >
                  {I18n.t("GENERATE RETURN SLIP")}
                </Text>
              </TouchableOpacity>
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
        {this.state.resultModel && (
          <View>
            <Modal style={{ margin: 0 }} isVisible={this.state.modelVisible}
              onBackButtonPress={() => this.modelCancel()}
              onBackdropPress={() => this.modelCancel()} >
              <View style={[Device.isTablet ? styles.filterMainContainer_tablet : styles.filterMainContainer_mobile, { height: Device.isTablet ? 300 : 250, backgroundColor: '#00aa00', marginTop: Device.isTablet ? deviceheight - 300 : deviceheight - 250 }]}>
                <View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, height: Device.isTablet ? 60 : 50 }}>
                    <View>
                      <Text style={{ marginTop: 15, fontSize: Device.isTablet ? 22 : 17, marginLeft: 20, color: '#ffffff' }} > RT Number </Text>
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
                <View style={{ backgroundColor: '#ffffff', height: Device.isTablet ? 250 : 200, }}>
                  <View style={{ height: Device.isTablet ? 70 : 60, alignItems: 'center', marginTop: 20 }}>
                    <Text style={{ fontSize: Device.isTablet ? 24 : 19, fontFamily: 'medium', }} selectable={true}>{this.state.resultData}</Text>
                  </View>
                  <TouchableOpacity
                    style={[Device.isTablet ? styles.filterCancelButton_tablet : styles.filterCancelButton_mobile, { borderColor: '#00aa00', }]} onPress={() => this.modelCancel()}
                  >
                    <Text style={[Device.isTablet ? styles.filterButtonCancelText_tablet : styles.filterButtonCancelText_mobile, { color: '#00aa00' }]}  > {I18n.t("BACK TO DASHBOARD")} </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        )}
      </View>
    );
  }
}

const flats = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  text: {
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },

  // flats for Mobile
  flatlistContainer_mobile: {
    height: 150,
    backgroundColor: '#fbfbfb',
    borderBottomWidth: 5,
    borderBottomColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flatlistSubContainer_mobile: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center',
    height: 140
  },
  flatlistTextAccent_mobile: {
    fontFamily: 'medium',
    fontSize: 16,
    color: '#ED1C24'
  },
  flatlistText_mobile: {
    fontFamily: 'regular',
    fontSize: 12,
    color: '#353c40'
  },
  flatlistTextCommon_mobile: {
    fontFamily: 'regular',
    fontSize: 12,
    color: '#808080'
  },
  editButton_mobile: {
    width: 30,
    height: 30,
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
    borderWidth: Device.isTablet ? 2 : 1,
    borderColor: "lightgray",
    // borderRadius:5,
  },
  deleteButton_mobile: {
    width: 30,
    height: 30,
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5,
    borderWidth: Device.isTablet ? 2 : 1,
    borderColor: "lightgray",
  },
  flatlistSubContainerTotal_mobile: {
    backgroundColor: '#e4d7d7',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center',
    height: 140
  },


  // flats for Tablet
  flatlistContainer_tablet: {
    height: 200,
    backgroundColor: '#fbfbfb',
    borderBottomWidth: 5,
    borderBottomColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flatlistSubContainer_tablet: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center',
    height: 160
  },
  flatlistTextAccent_tablet: {
    fontFamily: 'medium',
    fontSize: 21,
    color: '#ED1C24'
  },

  flatlistText_tablet: {
    fontFamily: 'regular',
    fontSize: 21,
    color: '#353c40'
  },
  flatlistTextCommon_tablet: {
    fontFamily: 'regular',
    fontSize: 17,
    color: '#808080'
  },
  flatlstTextCommon_tablet: {
    fontFamily: 'regular',
    fontSize: 17,
    color: '#808080'
  },
  editButton_tablet: {
    width: 50,
    height: 50,
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
    borderWidth: Device.isTablet ? 2 : 1,
    borderColor: "lightgray",
    // borderRadius:5,
  },
  deleteButton_tablet: {
    width: 50,
    height: 50,
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5,
    borderWidth: Device.isTablet ? 2 : 1,
    borderColor: "lightgray",
  },
  flatlistSubContainerTotal_tablet: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#e4d7d7',
    alignItems: 'center',
    height: 160
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
  item: {
    padding: 15,
    fontSize: 18,
    height: 44,
    backgroundColor: '#ffffff',
    fontSize: 18,
    fontFamily: 'medium',
    color: '#353C40',
  },
  logoImage: {
    alignSelf: 'center',
    width: 300,
    height: 230,

  },
  containerForActivity: {
    flex: 1,
    backgroundColor: '#623FA0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: 20,
    margin: 20
  },
  navButtonText_tablet: {
    fontSize: 22,
    fontFamily: 'regular',
    color: '#ffffff',
    marginLeft: 10,
    marginTop: 8,
    alignSelf: 'center'
  },
  navButtonText_mobile: {
    fontSize: 17,
    fontFamily: 'regular',
    color: '#ffffff',
    marginLeft: 10,
    marginTop: 8,
    alignSelf: 'center'
  },
  imagealign: {
    marginTop: Device.isTablet ? 25 : 20,
    marginRight: Device.isTablet ? 30 : 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    height: deviceheight + 40,
    backgroundColor: '#FFFFFF'
  },
  ytdImageValue: {
    alignSelf: 'center',
  },
  loading: {
    flex: 1,
    justifyContent: 'center'
    // alignItems: 'center',
  },

  // Mobile Styles
  filterMainContainer_mobile: {
    width: deviceWidth,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: "#ffffff",
    height: 400,
    marginTop: deviceheight - 400,
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
  filterApplyButton_mobile: {
    width: deviceWidth - 40,
    marginLeft: 20,
    marginRight: 20,
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
    borderWidth: Device.isTablet ? 2 : 1,
    borderColor: "#353C4050",
  },
  filterButtonCancelText_mobile: {
    textAlign: 'center',
    marginTop: 20,
    color: "#000000",
    fontSize: 15,
    fontFamily: "regular"
  },
  hederText_mobile: {
    color: "#353C40",
    fontSize: RF(16),
    fontFamily: "bold",
    marginLeft: RF(10),
    marginTop: RF(10),
    flexDirection: 'column',
    justifyContent: 'center',
  },
  headerText2_mobile: {
    color: "#353C40",
    fontSize: 20,
    fontFamily: "bold",
    marginLeft: 10,
    marginTop: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    height: 45,
    fontSize: 28,
  },
  bottomImage_mobile: {
    position: 'absolute',
    right: 0,
    bottom: 40,
    width: 162,
    height: 170
  },
  input_mobile: {
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 5,
    height: 44,
    marginTop: 5,
    width: deviceWidth - 40,
    borderColor: '#8F9EB717',
    borderRadius: 3,
    backgroundColor: '#FBFBFB',
    borderWidth: Device.isTablet ? 2 : 1,
    fontFamily: 'regular',
    paddingLeft: 15,
    fontSize: 14,
  },
  signInButton_mobile: {
    backgroundColor: '#ED1C24',
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    marginBottom: 10,
    width: deviceWidth / 2.6,
    height: 30,
    borderRadius: 10,
    fontWeight: 'bold',
    // marginBottom:100,
  },
  signInButtonText_mobile: {
    color: 'white',
    alignSelf: 'center',
    fontSize: 15,
    fontFamily: "regular",
  },
  cancelButton_mobile: {
    backgroundColor: '#FFFFFF',
    borderColor: '#8F9EB717',
    borderWidth: Device.isTablet ? 2 : 1,
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    marginBottom: 10,
    width: deviceWidth / 2.3,
    height: 30,
    borderRadius: Device.isTablet ? 10 : 5,
    fontWeight: 'bold',
    // marginBottom:100,
  },
  cancelButtonText_mobile: {
    color: 'black',
    alignSelf: 'center',
    fontSize: RF(14)
    // fontFamily: "regular",
  },
  navigationText_mobile: {
    fontSize: 16,
    color: '#858585',
    fontFamily: "regular",
  },
  navigationButtonText_mobile: {
    color: '#353C40',
    fontSize: 16,
    fontFamily: "bold",
    textDecorationLine: 'underline'
  },
  rnSelect_mobile: {
    color: '#8F9EB7',
    fontSize: 15
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
    marginLeft: 16,
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

  // Tablet Styles
  filterMainContainer_tablet: {
    width: deviceWidth,
    alignItems: 'center',
    backgroundColor: "#ffffff",
    height: 600,
    marginTop: deviceheight - 500,
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
    right: 14,
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
    right: 14,
  },
  filterApplyButton_tablet: {
    width: deviceWidth - 40,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
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
    borderWidth: Device.isTablet ? 2 : 1,
    borderColor: "#353C4050",
  },
  filterButtonCancelText_tablet: {
    textAlign: 'center',
    marginTop: 20,
    color: "#000000",
    fontSize: 20,
    fontFamily: "regular"
  },
  headerText_tablet: {
    color: "#353C40",
    fontSize: 40,
    fontFamily: "bold",
    marginLeft: 10,
    marginTop: 10,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  headerText2_tablet: {
    color: "#353C40",
    fontSize: 40,
    fontFamily: "bold",
    marginLeft: 10,
    marginTop: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    height: 55,
  },
  bottomImage_tablet: {
    position: 'absolute',
    right: 0,
    bottom: 40,
    width: 202,
    height: 230
  },
  input_tablet: {
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 10,
    marginBottom: 20,
    marginTop: 10,
    height: 60,
    width: deviceWidth - 40,
    marginTop: 5,
    marginBottom: 10,
    borderColor: '#8F9EB717',
    borderRadius: 3,
    backgroundColor: '#FBFBFB',
    borderWidth: Device.isTablet ? 2 : 1,
    paddingLeft: 15,
    // fontFamily: 'regular',
    fontSize: RF(14)
  },
  signInButton_tablet: {
    backgroundColor: '#ED1C24',
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    marginBottom: 10,
    width: deviceWidth / 2.3,
    height: 40,
    borderRadius: 10,
    fontWeight: 'bold',
    // marginBottom:100,
  },
  cancelButton_tablet: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    marginBottom: 10,
    width: deviceWidth / 2.3,
    height: 40,
    borderRadius: 10,
    fontWeight: 'bold',
    // marginBottom:100,
  },
  signInButtonText_tablet: {
    color: 'white',
    alignSelf: 'center',
    fontSize: 20,
    fontFamily: "regular",
  },
  cancelButtonText_tablet: {
    color: 'black',
    alignSelf: 'center',
    fontSize: RF(14)
    // fontFamily: "regular",
  },
  navigationText_tablet: {
    fontSize: 22,
    color: '#858585',
    fontFamily: "regular",
  },
  navigationButtonText_tablet: {
    color: '#353C40',
    fontSize: 22,
    fontFamily: "bold",
    textDecorationLine: 'underline'
  },
  rnSelect_tablet: {
    color: '#8F9EB7',
    fontSize: 20
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
  },
  filterDateButton_tablet: {
    width: deviceWidth / 2.2,
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
    marginLeft: 16,
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
  textAccentStyle: {
    fontFamily: 'medium',
    fontSize: Device.isTablet ? RF(22) : RF(18),
    color: '#ED1C24',
    marginLeft: RF(20),
    marginTop: RF(10),
  },
  headings: {
    fontSize: Device.isTablet ? 20 : 15,
    marginLeft: 20,
    color: '#B4B7B8',
    marginTop: Device.isTablet ? 10 : 5,
    marginBottom: Device.isTablet ? 10 : 5,
  },
  textarea: {
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 5,
    marginTop: 5,
    borderColor: '#8F9EB717',
    borderRadius: 3,
    backgroundColor: '#FBFBFB',
    borderWidth: Device.isTablet ? 2 : 1,
    fontFamily: 'regular',
    paddingLeft: 15,
    fontSize: Device.isTablet ? 20 : 14,
  }
});
