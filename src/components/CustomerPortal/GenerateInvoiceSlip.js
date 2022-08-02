import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';
import React, { Component } from 'react';
import { Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Device from 'react-native-device-detection';
import I18n from 'react-native-i18n';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal from "react-native-modal";
import RNPickerSelect from 'react-native-picker-select';
import { Chevron } from 'react-native-shapes';
import { openDatabase } from 'react-native-sqlite-storage';
import CustomerService from '../services/CustomerService';
import { inputField } from '../Styles/FormFields';

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

// Connction to access the pre-populated db
const db = openDatabase({ name: 'tbl_items.db', createFromLocation: 1 });
const createdb = openDatabase({ name: 'create_items.db', createFromLocation: 1 });

class GenerateInvoiceSlip extends Component {
  constructor(props) {
    super(props);
    this.camera = null;
    this.barcodeCodes = [];
    this.state = {
      barcodeId: "",
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
      totalDiscount: 0,
      gender: "Male",
      gstNumber: "",
      dob: "2021-06-21T18:30:00.000Z",
      address: "",
      modalVisible: true,
      customerTagging: false,
      handleBillDiscount: false,
      flagone: true,
      flagqtyModelOpen: false,
      flagCustomerOpen: false,
      flagtwo: false,
      productItemId: 0,
      productuom: "",
      flagthree: false,
      flagfour: false,
      inventoryBarcodeId: '',
      inventoryProductName: '',
      inventoryQuantity: '',
      inventoryMRP: '',
      inventoryDiscount: '',
      inventoryNetAmount: '',
      customerPhoneNumber: '',
      customerEmail: '',
      customerGender: '',
      customerAddress: '',
      customerGSTNumber: '',
      reasonDiscount: '',
      discountAmount: '0',
      approvedBy: '',
      domainId: 1,
      tableHead: ['S.No', 'Barcode', 'Product', 'Price Per Qty', 'Qty', 'Sales Rate'],
      tableData: [],
      privilages: [{ bool: true, name: "Tag Customer" }, { bool: false, name: "Bill Level Discount" }],
      inventoryDelete: false,
      lineItemDelete: false,
      uom: [],
      store: '',
      camera: {
        type: RNCamera.Constants.Type.back,
        flashMode: RNCamera.Constants.FlashMode.auto,
      },
      openn: false,
      isSubOpen: false,
      dsNumber: "",
      manualDisc: 0,
      isCash: false,
      isCard: false,
      btnDisabled: true,
      isCardSelected: false,
      isCashSelected: false,
      isCalculator: false,
      isPayment: true,
      cashAmount: 0.0,
      taxAmount: 0,
      cardAmount: 0.0,
      cardDigits: "",
      rBarCodeList: [],
      discReasons: [],
      selectedDisc: {},
      userId: "",
      deliverySlipData: {
        barcode: [],
        mrp: "",
        netAmount: 0.0,
        promoDisc: "",
        taxAmount: null,
      },
      dlslips: [],
      finalList: [],
      barCodeList: [],
      mobilenumber: "",
      customerName: "",
      gender: "",
      customerEmail: "",
      couponCode: "",
      ccCollectedCash: "",
      dob: "",
      customerGST: "",
      address: "",
      dropValue: "",
      grandNetAmount: 0.0,
      grandReceivedAmount: 0.0,
      grandBalance: 0,
      returnCash: 0,
      input: {},
      isBillingDetails: false,
      errors: {},
      isBillingDisc: false,
      showDiscReason: false,
      discApprovedBy: "",
      showTable: false,
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
      totalManualDisc: 0,
      netPayableAmount: 0,
      netCardPayment: 0,
      promoDiscount: 0,
      genderList: [
        {
          value: "female",
          label: "Female",
        },
        {
          value: "male",
          label: "Male",
        },
      ],
      customerFullName: "-",
      customerMobilenumber: "-",
      isTextile: false,
      lineItemsList: [],
      paymentOrderId: "",
      idClient: "",
      stateGST: 0,
      centralGST: 0,
      isCouponApplied: true,
      enablePayment: false,
      isCCModel: false,
      isCCPay: false,
      storeId: 0,
      returnModel: false,
      returnData: "",
      disableButton: false
    };
  }

  async componentDidMount() {
    const storeId = await AsyncStorage.getItem("storeId");
    this.setState({ storeId: storeId });
    this.getDiscountReasons();
    this.getHsnDetails();
  }

  handleMenuButtonClick() {
    this.props.navigation.openDrawer();
  }

  cancel() {
    this.props.navigation.goBack(null);
    return true;
  }

  modelCancel() {
    this.setState({ modalVisible: false });
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

  incrementForTable() {

  }

  updateQty() {

  }

  decreamentForTable() {

  }



  getDiscountReasons() {
    axios.get(CustomerService.getDiscountReasons()).then((res) => {
      if (res.status === 200) {
        //this.setState({discReasons: res.data});
        const discount = res.data.result;
        console.log('reason ia' + res.data.result);
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
      alert('Error with getting discount reasons');
    });
  }

  topbarAction1 = (item, index) => {
    if (this.state.privilages[index].bool === true) {
      this.state.privilages[index].bool = false;
    }
    else {
      this.state.privilages[index].bool = true;
    }
    for (let i = 0; i < this.state.privilages.length; i++) {

      if (item.name === "Tag Customer") {
        this.setState({ customerTagging: true, modalVisible: true, handleBillDiscount: false });
        this.state.privilages[1].bool = false;
        return;
      } else {
        this.setState({ customerTagging: false, modalVisible: false });
      }
      if (item.name === "Bill Level Discount" && this.state.disableButton === false) {
        // this.setState({ customerTagging: true, modalVisible: true });
        this.setState({ handleBillDiscount: true, modalVisible: true });
      } else {
        this.setState({ handleBillDiscount: false, modalVisible: false });
      }
      if (index != i) {
        this.state.privilages[i].bool = false;
      }
      this.setState({ privilages: this.state.privilages });
    }
  };


  getDeliverySlipDetails() {
    this.setState({ barCodeList: [], finalList: [], rBarCodeList: [], dlslips: [] });
    let costPrice = 0;
    let discount = 0;
    let total = 0;
    this.setState({ discountAmount: 0, netPayableAmount: 0, totalAmount: 0, promoDiscount: 0 });
    this.state.barCodeList = [];
    this.state.finalList = [];
    this.state.rBarCodeList = [];
    this.state.dsNumberList = [];
    let esNumber = this.state.dsNumber;
    let flag = true;
    const { storeId } = this.state;
    console.log("data in getDeliverySlipDetails", esNumber, flag, storeId);
    CustomerService.getDsSlip(esNumber, flag, storeId).then((res) => {
      var response = JSON.stringify(res)
      console.log("getInvoiceSlip", JSON.stringify(res.data));
      if (res.data) {
        console.log(res.data);
        this.state.dlslips.push(res.data);
        if (this.state.dlslips.length > 1) {
          const barList = this.state.dlslips.filter(
            (test, index, array) =>
              index ===
              array.findIndex((findTest) => findTest.dsNumber === test.dsNumber)
          );

          if (barList.length > 1) {
            let lineStorage = [];
            barList.forEach((element, index) => {
              let lineItems = element.lineItems;
              lineStorage = [...lineStorage, ...lineItems];
            });

            this.setState({ barCodeList: lineStorage });

          } else {
            this.setState({ barCodeList: barList[0].lineItems });
          }

        } else {
          this.setState({ barCodeList: this.state.dlslips[0].lineItems });
        }

        this.state.barCodeList.forEach((barCode, index) => {
          costPrice = costPrice + barCode.itemPrice;
          discount = discount + barCode.discount;
          total = total + barCode.netValue;
        });

        discount = discount + this.state.discountAmount;

        this.setState({
          netPayableAmount: total,
          totalPromoDisc: discount,
          grossAmount: costPrice,
        });

        if (this.state.barCodeList.length > 0) {
          this.setState({ enablePayment: true, disableButton: false });
        }

        this.getTaxAmount();
      }
      else {
        alert(res.data.body);
      }
    }).catch(() => {
      this.setState({ loading: false });
      // alert('Getting issue with the estimation slip lineitems');
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
          console.log('data saved');

        }).catch(() => {
          this.setState({ loading: false });
          console.log('There is error saving token');
          // alert('There is error saving token');
        });


      }
    });
  }

  getReturnAmount = () => {
    console.log(this.state.grandNetAmount);
    if (this.state.barCodeList.length > 0 || this.state.barCodeRetailList.length > 0) {
      this.setState({ isPayment: false });
    }
    // this.state.grandNetAmount =
    //   this.state.netPayableAmount + this.state.taxAmount;
    this.state.grandReceivedAmount =
      this.state.netPayableAmount + this.state.taxAmount;
    const collectedCash = parseInt(this.state.cashAmount);

    if (collectedCash > this.state.grandNetAmount) {
      this.state.returnCash = collectedCash - this.state.grandNetAmount;
      this.state.returnCash = Math.round(this.state.returnCash);
      //  this.hideCashModal();
    } else if (collectedCash == Math.round(this.state.grandNetAmount)) {
      // this.state.grandNetAmount = 0;
      this.setState({ isPayment: false });

    } else if (collectedCash < this.state.grandNetAmount) {
      // this.state.grandNetAmount = this.state.grandNetAmount - collectedCash;
      //   toast.info("Please enter sufficient amount");
    } else {
      this.state.cashAmount = 0;
      this.state.returnCash = 0;
      this.state.grandNetAmount = 0;
      this.state.grandReceivedAmount = 0;
      this.setState({ isPayment: true });
      // toast.info("Please enter sufficient amount");
    }

    if (this.state.returnCash >= 1) {
      this.hideCashModal();
    } else {
      toast.error("Please collect sufficient amount");
    }


    //  this.hideCashModal();
  };


  getTaxAmount() {
    let slabCheck = false;
    // const taxDetails =
    axios.get(CustomerService.getHsnDetails()).then((response) => {
      if (response) {
        const details = response.data.result;
        console.log(details);
        let slabVos = [];
        details.forEach(detail => {
          if (detail.slabVos)
            slabVos.push(detail.slabVos);
        });

        slabVos.forEach(taxData => {
          console.log(taxData);
          if (this.state.netPayableAmount >= taxData[0].priceFrom && this.state.netPayableAmount <= taxData[0].priceTo) {
            const taxPer = taxData[0].taxVo.taxLabel.split(' ')[1].split('%')[0];
            const tax = parseInt(taxPer) / 100;

            const totalTax = this.state.netPayableAmount * tax;

            const central = totalTax / 2;
            this.setState({ centralGST: Math.ceil(central) });
            slabCheck = true;
            slabCheck = true;
            this.setState({ stateGST: taxData[0].taxVo.cgst, centralGST: taxData[0].taxVo.cgst });
          }
        });

        if (!slabCheck) {
          // this.setState({ stateGST: 70, centralGST: 70 });
          console.log("Checking the slab");
        }
        const grandTotal = this.state.netPayableAmount + this.state.centralGST * 2;
        this.setState({ grandNetAmount: grandTotal, netPayableAmount: grandTotal });
      }
    });


  }


  pay() {
    let obj = {
      totalAmount: this.state.netPayableAmount,
      grossAmount: this.state.grossAmount,
      totalDiscount: this.state.totalDiscount,
      CGST: this.state.centralGST, totalPromoDisc: this.state.totalPromoDisc,
      manualDisc: this.state.manualDisc,
      taxAmount: this.state.taxAmount,
      approvedBy: this.state.approvedBy,
      reasonDiscount: this.state.reasonDiscount,
      discountAmount: this.state.discountAmount,
      userId: this.state.userId,
      dsNumberList: this.state.dsNumberList,
      customerName: this.state.customerName, customerPhoneNumber: this.state.customerPhoneNumber,
      customerGSTNumber: this.state.customerGSTNumber, customerAddress: this.state.customerAddress,
      customerGender: this.state.customerGender,
      totalQty: this.state.totalQty.toString(),
      onGoBack: () => this.invoiceUpdate(),
    };
    this.props.navigation.navigate('TextilePayment', obj);
    console.log("data in invoice slip", obj);
  }

  invoiceUpdate() {
    this.setState({ barCodeList: [] });
    this.setState({ dsNumber: [] });
  }

  endEditing() {
    if (this.state.dsNumber === "") {
      alert("Please enter ES Number");
    }
    else {
      this.setState({ disableButton: false });
      this.getDeliverySlipDetails();
    }
  }

  handleDsNumber = (text) => {
    this.setState({ dsNumber: text });
  };

  handleBarcode = (text) => {
    this.setState({ barcodeId: text });
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
        console.log(res);
        if (res) {
          console.log(res.data);
          const mobileData = res.data.result;
          this.setState({
            userId: res.data.result.userId, customerFullName: res.data.result.userName
          });
          this.setState({ modalVisible: false });
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
          });

        }
      }).catch(() => {
        this.setState({ loading: false });
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
        console.log(this.state.mobileData);
        this.setState({
          customerName: res.data.result.name,
          gender: res.data.result.gender,
          dob: res.data.result.dob,
          customerEmail: res.data.result.email,
          customerGST: res.data.result.gstNumber,
          address: res.data.result.address,
        });
      } else {
        toast.error("No Data Found");
      }
    }).catch(() => {
      this.setState({ loading: false });
      alert('Unable to get customer details');
    });
  }



  handleDiscountAmount(text) {
    this.setState({ discountAmount: text.trim() });
  }

  handleApprovedBy(text) {
    this.setState({ approvedBy: text });
  }

  handleDiscountReason = (value) => {
    this.setState({ reasonDiscount: value });
  };

  billDiscount() {
    if (this.state.discountAmount === "0") {
      alert("discount amount cannot be empty");
    } else if (this.state.approvedBy === "") {
      alert("approved By cannot be empty");
    } else if (this.state.reasonDiscount === "") {
      alert("reason cannot be empty");
    }
    else {
      // this.state.netPayableAmount = 0;
      const totalDisc =
        parseInt(this.state.totalPromoDisc) + parseInt(this.state.discountAmount);
      if (totalDisc < this.state.grandNetAmount) {
        const netPayableAmount = this.state.grandNetAmount - totalDisc;
        this.state.netPayableAmount = netPayableAmount;
        this.setState({ netPayableAmount: netPayableAmount });
        // this.getTaxAmount();
      }
      const promDisc = parseInt(this.state.discountAmount) + parseInt(this.state.totalPromoDisc);
      console.log('vinodfdsfdsffs' + promDisc);
      this.setState({ showDiscReason: true, promoDiscount: promDisc });

      this.setState({ modalVisible: false },
        () => {
          this.setState({ disableButton: true, reasonDiscount: "" });
          this.state.privilages[1].bool = false;

        });

    }


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
    console.log('bar-code is' + this.state.barcodeId);
  }


  render() {
    console.log(global.barcodeId);
    AsyncStorage.getItem("tokenkey").then((value) => {
      console.log(value);
    }).catch(() => {
      this.setState({ loading: false });
      console.log('There is error getting token');
    });
    return (
      <View style={{ flex: 1 }}>
        {this.state.flagone && (
          <ScrollView>
            <View
              style={{
                flex: 1,
                paddingHorizontal: 0,
                paddingVertical: 0,
                marginTop: 10,
              }}>
              <View>
                <View style={{ flexDirection: 'row', width: Device.isTablet ? deviceWidth - 20 : deviceWidth - 10, justifyContent: 'space-between' }}>
                  <TextInput style={[inputField, { width: Device.isTablet ? deviceWidth / 1.45 : deviceWidth / 1.6 }]}
                    underlineColorAndroid="transparent"
                    placeholder={I18n.t("Enter ES Number")}
                    placeholderTextColor="#6F6F6F60"
                    textAlignVertical="center"
                    keyboardType={'default'}
                    autoCapitalize="none"
                    value={this.state.dsNumber}
                    // onEndEditing
                    onChangeText={(text) => this.handleDsNumber(text)}
                    onEndEditing={() => this.endEditing()}
                  />
                  <TouchableOpacity
                    style={{ backgroundColor: "#ED1C24", width: Device.isTablet ? 120 : 80, height: Device.isTablet ? 55 : 45, borderRadius: 10, marginTop: Device.isTablet ? 5 : 10 }}
                    onPress={() => this.navigateToScan()} >
                    <Text style={[Device.isTablet ? styles.navButtonText_tablet : styles.navButtonText_mobile, { paddingTop: Device.isTablet ? 5 : 5 }]}> {I18n.t('SCAN')} </Text>
                  </TouchableOpacity>
                </View>
                {/* <TextInput style={inputField}
                  underlineColorAndroid="transparent"
                  placeholder={I18n.t("Enter Barcode")}
                  placeholderTextColor="#6F6F6F60"
                  textAlignVertical="center"
                  keyboardType={'default'}
                  value={this.state.barcodeId}
                  autoCapitalize="none"
                  // onEndEditing
                  onChangeText={(text) => this.handleBarcode(text)}
                  onEndEditing={() => this.endEditing()}
                /> */}
              </View>
              {this.state.barCodeList.length !== 0 && (
                <FlatList
                  style={styles.flatList}
                  horizontal
                  data={this.state.privilages}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity style={{
                      height: 36,
                      width: 200,
                      borderWidth: 1,
                      backgroundColor: item.bool ? '#ED1C24' : '#FFFFFF',
                      borderColor: item.bool ? '#ED1C24' : '#858585',
                      borderRadius: 5,
                      marginLeft: 10,
                    }} onPress={() => this.topbarAction1(item, index)} >

                      <Text style={{ fontSize: 16, alignItems: 'center', alignSelf: 'center', marginTop: 5, color: item.bool ? "#FFFFFF" : '#858585', fontFamily: 'regular' }}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  )}
                  ListFooterComponent={<View style={{ width: 15 }}></View>}
                />
              )}
              {this.state.lineItemDelete && (
                <View>
                  <Modal isVisible={this.state.modalVisible} style={{ margin: 0 }}>
                    <View style={[styles.filterMainContainer, { height: Device.isTablet ? 350 : 300, marginTop: Device.isTablet ? deviceHeight - 350 : deviceHeight - 300, backgroundColor: '#ED1C24' }]}>
                      <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, height: Device.isTablet ? 60 : 50 }}>
                          <View>
                            <Text style={{ marginTop: 15, fontSize: Device.isTablet ? 22 : 17, marginLeft: 20, color: '#ffffff' }} > {I18n.t("Delete Item")} </Text>
                          </View>
                          <View>
                            <TouchableOpacity style={{ width: Device.isTablet ? 60 : 50, height: Device.isTablet ? 60 : 50, marginTop: Device.isTablet ? 20 : 15, }} onPress={() => this.modelCancel()}>
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

                      <View style={{ backgroundColor: '#ffffff' }}>
                        <Text style={{
                          textAlign: 'center',
                          fontFamily: 'regular',
                          fontSize: Device.isTablet ? 17 : 22,
                          marginTop: 15,
                          color: '#353C40'
                        }}> {I18n.t("Are you sure want to delete NewSale Item")} ?  </Text>
                        <TouchableOpacity
                          style={{
                            width: deviceWidth - 40,
                            marginLeft: 20,
                            marginRight: 20,
                            marginTop: 60,
                            height: 50, backgroundColor: "#ED1C24", borderRadius: 5,
                          }} onPress={() => this.deleteLineItem(item, index)}
                        >
                          <Text style={{
                            textAlign: 'center', marginTop: 20, color: "#ffffff", fontSize: 15,
                            fontFamily: "regular"
                          }}  > {I18n.t("DELETE")} </Text>

                        </TouchableOpacity>

                        <TouchableOpacity
                          style={{
                            width: deviceWidth - 40,
                            marginLeft: 20,
                            marginRight: 20,
                            marginTop: 20,
                            height: 50, backgroundColor: "#ffffff", borderRadius: 5, borderWidth: 1, borderColor: "#ED1C24",
                          }} onPress={() => this.modelCancel()}
                        >
                          <Text style={{
                            textAlign: 'center', marginTop: 20, color: "#ED1c24", fontSize: 15,
                            fontFamily: "regular"
                          }}  > {I18n.t("CANCEL")} </Text>

                        </TouchableOpacity>
                      </View>
                    </View>
                  </Modal>
                </View>
              )}

              {(this.state.barCodeList.length !== 0 &&
                <FlatList style={{ marginTop: 20, marginBottom: 20 }}
                  //  ListHeaderComponent={this.renderHeader}
                  data={this.state.barCodeList}
                  keyExtractor={item => item.email}
                  contentContainerStyle={{ paddingBottom: 230 }}
                  onEndReached={this.onEndReached.bind(this)}
                  scrollEnabled={
                    false
                  }
                  ref={(ref) => { this.listRef = ref; }}
                  renderItem={({ item, index }) => (
                    <View style={{
                      height: Device.isTablet ? 230 : 200,
                      backgroundColor: '#FFFFFF',
                      borderBottomWidth: 5,
                      borderBottomColor: '#FBFBFB',
                      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'

                    }}>

                      <View style={{ flexDirection: 'row', height: Device.isTablet ? 200 : 190, justifyContent: 'flex-start', width: Device.isTablet ? deviceWidth - 40 : deviceWidth - 20 }}>
                        <View style={{ marginTop: Device.isTablet ? 40 : 20, marginLeft: Device.isTablet ? 40 : 20 }}>
                          <Image source={require('../assets/images/default.jpeg')}
                            //source={{ uri: item.image }}
                            style={{
                              width: Device.isTablet ? 140 : 90, height: Device.isTablet ? 140 : 90,
                            }} />
                        </View>
                        <Text style={{ fontSize: Device.isTablet ? 21 : 16, fontFamily: 'medium', color: '#353C40' }}>
                          {item.itemdesc}
                        </Text>
                        <View style={{ flexDirection: "column", marginLeft: Device.isTablet ? 40 : 20 }}>
                          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: Device.isTablet ? 40 : 30 }}>
                            <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#808080' }}>
                              {I18n.t("ITEM")}: #{item.barCode}
                            </Text>
                          </View>
                          <View style={{ flexDirection: 'row', }}>
                            <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#808080' }}>
                              {I18n.t("QUANTITY")}: {item.quantity}
                            </Text>
                            <View style={{ flexDirection: 'row', paddingLeft: Device.isTablet ? 25 : 15 }}>
                              <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#808080' }}>
                                MRP:
                              </Text>
                              <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'medium', color: '#ED1C24', paddingLeft: 3 }}>
                                {/* ₹ {(parseInt(item.netamount)).toString()} */}
                                ₹ {item.itemPrice}
                              </Text>
                            </View>
                          </View>

                          <View style={{ flexDirection: 'column', }}>
                            <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#808080' }}>
                              {I18n.t("DISCOUNT")}: ₹ 0
                            </Text>
                            <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#808080' }}>
                              {I18n.t("GROSS AMOUNT")}: ₹ {item.netValue}
                            </Text>
                          </View>
                          <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#808080' }}>CGST: {this.state.centralGST}</Text>
                            <Text style={{ fontSize: Device.isTablet ? 45 : 35 }}> </Text>
                            <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#808080', paddingLeft: Device.isTablet ? 25 : 15 }}>SGST: {this.state.centralGST}</Text>
                          </View>
                        </View>
                      </View>

                    </View>
                  )}
                />
              )}


              {this.state.barCodeList.length != 0 && (
                <View style={{ width: deviceWidth, height: 320, position: 'absolute', bottom: 0, backgroundColor: '#FFFFFF' }}>
                  <Text style={{
                    color: "#353C40", fontFamily: "medium", alignItems: 'center', marginLeft: 16, top: 30, justifyContent: 'center', textAlign: 'center', marginTop: 10,
                    fontSize: Device.isTablet ? 19 : 14, position: 'absolute',
                  }}>
                    {I18n.t("ITEMS")} </Text>
                  <Text style={{
                    color: "#353C40", fontFamily: "medium", alignItems: 'center', marginLeft: 16, top: 30, position: 'absolute', right: 10, justifyContent: 'center', textAlign: 'center', marginTop: 10,
                    fontSize: Device.isTablet ? 19 : 14, position: 'absolute',
                  }}>
                    {this.state.barCodeList.length} </Text>
                  <Text style={{
                    color: "#353C40", fontFamily: "medium", alignItems: 'center', marginLeft: 16, top: 60, justifyContent: 'center', textAlign: 'center', marginTop: 10,
                    fontSize: Device.isTablet ? 19 : 14, position: 'absolute',
                  }}>
                    {I18n.t("DISCOUNT")} </Text>
                  <Text style={{
                    color: "#353C40", fontFamily: "medium", alignItems: 'center', marginLeft: 16, top: 60, position: 'absolute', right: 10, justifyContent: 'center', textAlign: 'center', marginTop: 10,
                    fontSize: Device.isTablet ? 19 : 14, position: 'absolute',
                  }}>
                    ₹ {this.state.promoDiscount} </Text>

                  <Text style={{
                    color: "#353C40", fontFamily: "bold", alignItems: 'center', marginLeft: 16, top: 90, fontSize: 20, justifyContent: 'center', textAlign: 'center', marginTop: 10,
                    fontSize: Device.isTablet ? 19 : 14, position: 'absolute',
                  }}>
                    {I18n.t("TOTAL")} </Text>
                  <Text style={{
                    color: "#353C40", fontFamily: "bold", alignItems: 'center', marginLeft: 16, top: 90, fontSize: 20, position: 'absolute', right: 10, justifyContent: 'center', textAlign: 'center', marginTop: 10,
                    fontSize: Device.isTablet ? 19 : 14, position: 'absolute',
                  }}>
                    ₹ {this.state.netPayableAmount} </Text>

                  <Text style={{
                    color: "#353C40", fontFamily: "bold", alignItems: 'center', marginLeft: 16, top: 120, fontSize: 20, justifyContent: 'center', textAlign: 'center', marginTop: 10,
                    fontSize: Device.isTablet ? 19 : 14, position: 'absolute',
                  }}>
                    {I18n.t("CUSTOMER NAME")} </Text>
                  <Text style={{
                    color: "#353C40", fontFamily: "bold", alignItems: 'center', marginLeft: 16, top: 120, fontSize: 20, position: 'absolute', right: 10, justifyContent: 'center', textAlign: 'center', marginTop: 10,
                    fontSize: Device.isTablet ? 19 : 14, position: 'absolute',
                  }}>
                    {this.state.customerFullName} </Text>
                  <Text style={{
                    color: "#353C40", fontFamily: "bold", alignItems: 'center', marginLeft: 16, top: 150, fontSize: 20, justifyContent: 'center', textAlign: 'center', marginTop: 10,
                    fontSize: Device.isTablet ? 19 : 14, position: 'absolute',
                  }}>
                    Customer {I18n.t("MOBILE NUMBER")} </Text>
                  <Text style={{
                    color: "#353C40", fontFamily: "bold", alignItems: 'center', marginLeft: 16, top: 150, fontSize: 20, position: 'absolute', right: 10, justifyContent: 'center', textAlign: 'center', marginTop: 10,
                    fontSize: Device.isTablet ? 19 : 14, position: 'absolute',
                  }}>
                    {this.state.customerMobilenumber} </Text>
                  <Text style={{
                    color: "#353C40", fontFamily: "bold", alignItems: 'center', marginLeft: 16, top: 180, fontSize: 20, justifyContent: 'center', textAlign: 'center', marginTop: 10,
                    fontSize: Device.isTablet ? 19 : 14, position: 'absolute',
                  }}>
                    {I18n.t("LOYALTY POINTS")} </Text>
                  <Text style={{
                    color: "#353C40", fontFamily: "bold", alignItems: 'center', marginLeft: 16, top: 180, fontSize: 20, position: 'absolute', right: 10, justifyContent: 'center', textAlign: 'center', marginTop: 10,
                    fontSize: Device.isTablet ? 19 : 14, position: 'absolute',
                  }}>
                    - </Text>
                  <Text style={{
                    color: "#353C40", fontFamily: "bold", alignItems: 'center', marginLeft: 16, top: 210, fontSize: 20, justifyContent: 'center', textAlign: 'center', marginTop: 10,
                    fontSize: Device.isTablet ? 19 : 14, position: 'absolute',
                  }}>
                    {I18n.t("EXPIRY DATE")} </Text>
                  <Text style={{
                    color: "#353C40", fontFamily: "bold", alignItems: 'center', marginLeft: 16, top: 210, fontSize: 20, position: 'absolute', right: 10, justifyContent: 'center', textAlign: 'center', marginTop: 10,
                    fontSize: Device.isTablet ? 19 : 14, position: 'absolute',
                  }}>
                    - </Text>
                  <View style={styles.TopcontainerforPay}>
                    <TouchableOpacity
                      style={Device.isTablet ? styles.signInButton_tablet : styles.signInButton_mobile}
                      onPress={() => this.pay()} >
                      <Text style={Device.isTablet ? styles.signInButtonText_tablet : styles.signInButtonText_mobile}> {I18n.t("Checkout")} </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        )}


        {this.state.customerTagging && (
          <View>
            <Modal isVisible={this.state.modalVisible}>
              <View style={[Device.isTablet ? styles.filterMainContainer_tablet : styles.filterMainContainer_mobile, { height: Device.isTablet ? 400 : 300 }]}>

                <View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, height: Device.isTablet ? 60 : 50 }}>
                    <View>
                      <Text style={{ marginTop: 15, fontSize: Device.isTablet ? 22 : 17, marginLeft: 20 }} > {I18n.t("Tag Customer")} </Text>
                    </View>
                    <View>
                      <TouchableOpacity style={{ width: Device.isTablet ? 60 : 50, height: Device.isTablet ? 60 : 50, marginTop: Device.isTablet ? 20 : 15, }} onPress={() => this.modelCancel()}>
                        <Image style={{ margin: 5 }} source={require('../assets/images/modelcancel.png')} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={{
                    height: Device.isTablet ? 2 : 1,
                    width: deviceWidth,
                    backgroundColor: 'lightgray',
                  }}></Text>
                </View>


                <View>
                  <Text style={{
                    height: Device.isTablet ? 40 : 20,
                    textAlign: 'center',
                    fontFamily: 'regular',
                    fontSize: Device.isTablet ? 23 : 18,
                    marginBottom: Device.isTablet ? 25 : 15,
                    color: '#353C40'
                  }}> {I18n.t("Please provide customer phone number")}  </Text>
                  <TextInput
                    style={Device.isTablet ? styles.input_tablet : styles.input_mobile}
                    underlineColorAndroid="transparent"
                    placeholder={I18n.t("MOBILE NUMBER")}
                    placeholderTextColor="#6F6F6F"
                    textAlignVertical="center"
                    keyboardType={'default'}
                    autoCapitalize="none"
                    maxLength={10}
                    value={this.state.mobileNumber}
                    onChangeText={(text) => this.handleMobileNumber(text)}

                  />
                  <TouchableOpacity
                    style={[Device.isTablet ? styles.filterApplyButton_tablet : styles.filterApplyButton_mobile]}
                    onPress={() => this.tagCustomer()}
                  >
                    <Text style={Device.isTablet ? styles.filterButtonText_tablet : styles.filterButtonText_mobile}  > {I18n.t("CONFIRM")} </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={Device.isTablet ? styles.filterCancelButton_tablet : styles.filterCancelButton_mobile}
                    onPress={() => this.modelCancel()}
                  >
                    <Text style={Device.isTablet ? styles.filterButtonCancelText_tablet : styles.filterButtonCancelText_mobile}  > {I18n.t("CANCEL")} </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        )}
        {this.state.handleBillDiscount && (
          <View>
            <Modal isVisible={this.state.modalVisible}>
              <View style={[Device.isTablet ? styles.filterMainContainer_tablet : styles.filterMainContainer_mobile, { height: Device.isTablet ? 500 : 400 }]}>
                <View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, height: Device.isTablet ? 60 : 50 }}>
                    <View>
                      <Text style={{ marginTop: 15, fontSize: Device.isTablet ? 22 : 17, marginLeft: 20 }} > {I18n.t("Bill level Discount")} </Text>
                    </View>
                    <View>
                      <TouchableOpacity style={{ width: Device.isTablet ? 60 : 50, height: Device.isTablet ? 60 : 50, marginTop: Device.isTablet ? 20 : 15, }} onPress={() => this.modelCancel()}>
                        <Image style={{ margin: 5 }} source={require('../assets/images/modelcancel.png')} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={{
                    height: Device.isTablet ? 2 : 1,
                    width: deviceWidth,
                    backgroundColor: 'lightgray',
                  }}></Text>
                </View>

                <View>
                  <TextInput
                    style={Device.isTablet ? styles.input_tablet : styles.input_mobile}
                    underlineColorAndroid="transparent"
                    placeholder={I18n.t("AMOUNT *")}
                    placeholderTextColor="#6F6F6F"
                    textAlignVertical="center"
                    keyboardType={'numeric'}
                    autoCapitalize="none"
                    onChangeText={(text) => this.handleDiscountAmount(text)}
                  />
                  <TextInput
                    style={Device.isTablet ? styles.input_tablet : styles.input_mobile}
                    underlineColorAndroid="transparent"
                    placeholder={I18n.t("APPROVED BY *")}
                    placeholderTextColor="#6F6F6F"
                    textAlignVertical="center"
                    keyboardType={'default'}
                    autoCapitalize="none"
                    onChangeText={(text) => this.handleApprovedBy(text)}
                  />
                  <View style={Device.isTablet ? styles.rnSelectContainer_tablet : styles.rnSelectContainer_mobile}>
                    <RNPickerSelect
                      // style={Device.isTablet ? styles.rnSelect_tablet : styles.rnSelect_mobile}
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
                  <TouchableOpacity
                    style={[Device.isTablet ? styles.filterApplyButton_tablet : styles.filterApplyButton_mobile]}
                    onPress={() => this.billDiscount()}
                  >
                    <Text style={Device.isTablet ? styles.filterButtonText_tablet : styles.filterButtonText_mobile}  > {I18n.t("CONFIRM")} </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={Device.isTablet ? styles.filterCancelButton_tablet : styles.filterCancelButton_mobile}
                    onPress={() => this.modelCancel()}
                  >
                    <Text style={Device.isTablet ? styles.filterButtonCancelText_tablet : styles.filterButtonCancelText_mobile}  > {I18n.t("CANCEL")} </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        )}
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
                      fontSize: 14,
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
                        style={Device.isTablet ? pickerSelectStyles_tablet : pickerSelectStyles_mobile}
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
          </View>
        )}

      </View>
    );
  }
}
export default GenerateInvoiceSlip;


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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FAFAFF'
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
    marginLeft: 20,
    marginRight: 100,
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
  phoneinput: {
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
  navButton_mobile: {
    position: 'absolute',
    right: 20, top: 37,
    backgroundColor: '#ED1C24',
    borderRadius: 5,
    width: 105,
    height: 32,
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
    fontSize: 14,
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
    width: '46%',
    marginRight: 10,
    marginTop: 10,
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
    backgroundColor: '#FAFAFF'
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
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 5,
    marginTop: 20,
    borderColor: '#ED1C24',
    width: '90%',
    //backgroundColor: '#ffffff',
    height: 50,
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
    bottom: 10,
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
  },


  // Styles For Mobile
  viewsWidth_mobile: {
    backgroundColor: '#ffffff',
    width: deviceWidth,
    textAlign: 'center',
    fontSize: 24,
    height: Device.isAndroid ? 70 : 84,
  },
  menuButton_mobile: {
    position: 'absolute',
    left: 10,
    bottom: 0,
    width: 40,
    height: 40,
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
  input_mobile: {
    justifyContent: 'center',
    marginLeft: deviceWidth / 2 + 30,
    width: deviceWidth / 2 - 40,
    height: 44,
    marginTop: -55,
    marginBottom: 10,
    borderColor: '#8F9EB717',
    borderRadius: 3,
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    fontFamily: 'regular',
    paddingLeft: 15,
    fontSize: 14,
  },
  input_mobile_normal: {
    justifyContent: 'center',
    marginLeft: deviceWidth / 2 + 30,
    width: deviceWidth / 2 - 40,
    height: 44,
    marginTop: -55,
    marginBottom: 10,
    borderColor: '#8F9EB717',
    borderRadius: 3,
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    fontFamily: 'regular',
    paddingLeft: 15,
    fontSize: 14,
  },
  input_mobile_normal_start: {
    justifyContent: 'center',
    marginLeft: 20,
    width: deviceWidth / 2,
    height: 44,
    marginTop: 0,
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
  rnSelectContainer_mobile_newsale: {
    justifyContent: 'center',
    marginLeft: 20,
    height: 44,
    marginTop: 5,
    marginBottom: 10,
    width: deviceWidth / 2,
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
  scanButton_mobile: {
    position: 'absolute',
    right: 28,
    top: 20,
    width: 50, height: 50,
  },
  scanButtonImage_mobile: {
    color: '#ED1C24',
    fontFamily: 'regular',
    fontSize: 12,
    position: 'absolute',
    right: 30,
  },
  scanButtonText_mobile: {
    color: '#ED1C24',
    fontFamily: 'regular',
    fontSize: 12,
    position: 'absolute',
    right: 0,
  },
  tagCustomerButton_mobile: {
    position: 'absolute',
    right: 5, top: 10,
    backgroundColor: '#ED1C24',
    borderRadius: 5,
    width: 90,
    height: 32,
  },
  tagCustomerButtonText_mobile: {
    fontSize: 12,
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
  signInButton_mobile: {
    backgroundColor: '#ED1C24',
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 20,
    width: deviceWidth - 40,
    height: 50,
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

  // Styles For Tablet
  viewsWidth_tablet: {
    backgroundColor: '#ffffff',
    width: deviceWidth,
    textAlign: 'center',
    fontSize: 28,
    height: 90,
  },
  menuButton_tablet: {
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
  input_tablet: {
    justifyContent: 'center',
    marginLeft: deviceWidth / 2 + 30,
    width: deviceWidth / 2 - 50,
    height: 55,
    marginTop: -65,
    marginBottom: 10,
    borderColor: '#8F9EB717',
    borderRadius: 3,
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    fontFamily: 'regular',
    paddingLeft: 15,
    fontSize: 22,
  },
  input_tablet_normal: {
    justifyContent: 'center',
    marginLeft: deviceWidth / 2 + 30,
    width: deviceWidth / 2 - 50,
    height: 55,
    marginTop: -65,
    marginBottom: 10,
    borderColor: '#8F9EB717',
    borderRadius: 3,
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    fontFamily: 'regular',
    paddingLeft: 15,
    fontSize: 22,
  },
  input_tablet_normal_start: {
    justifyContent: 'center',
    marginLeft: 20,
    width: deviceWidth / 2,
    height: 55,
    marginTop: 0,
    marginBottom: 10,
    borderColor: '#8F9EB717',
    borderRadius: 3,
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    fontFamily: 'regular',
    paddingLeft: 15,
    fontSize: 22,
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
  rnSelectContainer_tablet_newsale: {
    justifyContent: 'center',
    marginLeft: 20,
    height: 54,
    marginTop: 5,
    width: deviceWidth / 2,
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
  scanButton_tablet: {
    position: 'absolute',
    right: 28,
    top: 20,
    width: 70,
    height: 70,
  },
  scanButtonImage_tablet: {
    color: '#ED1C24',
    fontFamily: 'regular',
    fontSize: 18,
    position: 'absolute',
    right: 43,
    top: 5,
  },
  scanButtonText_tablet: {
    color: '#ED1C24',
    fontFamily: 'regular',
    fontSize: 18,
    position: 'absolute',
    right: 0,
  },
  tagCustomerButton_tablet: {
    position: 'absolute',
    right: 30, top: 15,
    backgroundColor: '#ED1C24',
    borderRadius: 5,
    width: 120,
    height: 42,
  },
  tagCustomerButtonText_tablet: {
    fontSize: 16,
    fontFamily: 'regular',
    color: '#ffffff',
    marginLeft: 10,
    marginTop: 8,
    alignSelf: 'center'
  },

  navButtonText_tablet: {
    fontSize: 22,
    fontFamily: 'regular',
    color: '#ffffff',
    marginLeft: 10,
    marginTop: 8,
    alignSelf: 'center'
  },


  // Styles For Mobile
  viewsWidth_mobile: {
    backgroundColor: '#ffffff',
    width: deviceWidth,
    textAlign: 'center',
    fontSize: 24,
    height: Device.isAndroid ? 70 : 84,
  },
  menuButton_mobile: {
    position: 'absolute',
    left: 10,
    bottom: 0,
    width: 40,
    height: 40,
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
  input_mobile: {
    justifyContent: 'center',
    marginLeft: 10,
    width: deviceWidth - 20,
    height: 44,
    marginTop: 10,
    marginBottom: 10,
    borderColor: '#8F9EB717',
    borderRadius: 3,
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    fontFamily: 'regular',
    paddingLeft: 15,
    fontSize: 14,
  },
  input_mobile_normal: {
    justifyContent: 'center',
    marginLeft: deviceWidth / 2 + 30,
    width: deviceWidth / 2 - 40,
    height: 44,
    marginTop: -55,
    marginBottom: 10,
    borderColor: '#8F9EB717',
    borderRadius: 3,
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    fontFamily: 'regular',
    paddingLeft: 15,
    fontSize: 14,
  },
  input_mobile_normal_start: {
    justifyContent: 'center',
    marginLeft: 20,
    width: deviceWidth / 2,
    height: 44,
    marginTop: 0,
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
  rnSelectContainer_mobile_newsale: {
    justifyContent: 'center',
    marginLeft: 20,
    height: 44,
    marginTop: 5,
    marginBottom: 10,
    width: deviceWidth / 2,
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
  scanButton_mobile: {
    position: 'absolute',
    right: 28,
    top: 20,
    width: 50, height: 50,
  },
  scanButtonImage_mobile: {
    color: '#ED1C24',
    fontFamily: 'regular',
    fontSize: 12,
    position: 'absolute',
    right: 30,
  },
  scanButtonText_mobile: {
    color: '#ED1C24',
    fontFamily: 'regular',
    fontSize: 12,
    position: 'absolute',
    right: 0,
  },
  tagCustomerButton_mobile: {
    position: 'absolute',
    right: 5, top: 10,
    backgroundColor: '#ED1C24',
    borderRadius: 5,
    width: 90,
    height: 32,
  },
  tagCustomerButtonText_mobile: {
    fontSize: 12,
    fontFamily: 'regular',
    color: '#ffffff',
    marginLeft: 10,
    marginTop: 8,
    alignSelf: 'center'
  },

  // Styles For Tablet
  viewsWidth_tablet: {
    backgroundColor: '#ffffff',
    width: deviceWidth,
    textAlign: 'center',
    fontSize: 28,
    height: 90,
  },
  menuButton_tablet: {
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
  input_tablet: {
    justifyContent: 'center',
    marginLeft: 10,
    width: deviceWidth - 20,
    height: 55,
    marginTop: 10,
    marginBottom: 10,
    borderColor: '#8F9EB717',
    borderRadius: 3,
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    fontFamily: 'regular',
    paddingLeft: 15,
    fontSize: 22,
  },
  input_tablet_normal: {
    justifyContent: 'center',
    marginLeft: deviceWidth / 2 + 30,
    width: deviceWidth / 2 - 50,
    height: 55,
    marginTop: -65,
    marginBottom: 10,
    borderColor: '#8F9EB717',
    borderRadius: 3,
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    fontFamily: 'regular',
    paddingLeft: 15,
    fontSize: 22,
  },
  input_tablet_normal_start: {
    justifyContent: 'center',
    marginLeft: 20,
    width: deviceWidth / 2,
    height: 55,
    marginTop: 0,
    marginBottom: 10,
    borderColor: '#8F9EB717',
    borderRadius: 3,
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    fontFamily: 'regular',
    paddingLeft: 15,
    fontSize: 22,
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
  rnSelectContainer_tablet_newsale: {
    justifyContent: 'center',
    marginLeft: 20,
    height: 54,
    marginTop: 5,
    width: deviceWidth / 2,
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
  scanButton_tablet: {
    position: 'absolute',
    right: 28,
    top: 20,
    width: 70,
    height: 70,
  },
  scanButtonImage_tablet: {
    color: '#ED1C24',
    fontFamily: 'regular',
    fontSize: 18,
    position: 'absolute',
    right: 43,
    top: 5,
  },
  scanButtonText_tablet: {
    color: '#ED1C24',
    fontFamily: 'regular',
    fontSize: 18,
    position: 'absolute',
    right: 0,
  },
  tagCustomerButton_tablet: {
    position: 'absolute',
    right: 30, top: 15,
    backgroundColor: '#ED1C24',
    borderRadius: 5,
    width: 120,
    height: 42,
  },
  tagCustomerButtonText_tablet: {
    fontSize: 16,
    fontFamily: 'regular',
    color: '#ffffff',
    marginLeft: 10,
    marginTop: 8,
    alignSelf: 'center'
  },
  navButton_tablet: {
    position: 'absolute',
    right: 20, top: 27,
    backgroundColor: '#ED1C24',
    borderRadius: 5,
    width: 155,
    height: 42,
  },

  // Styles for mobile
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


  // Styles for Tablet
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
  signInButton_tablet: {
    backgroundColor: '#ED1C24',
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 20,
    width: deviceWidth - 40,
    height: 60,
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

});
