import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';
import React, { Component } from 'react';
import { Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import RNBeep from 'react-native-a-beep';
import { RNCamera } from 'react-native-camera';
import Device from 'react-native-device-detection';
import I18n from 'react-native-i18n';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal from "react-native-modal";
import RNPickerSelect from 'react-native-picker-select';
import { Chevron } from 'react-native-shapes';
import { openDatabase } from 'react-native-sqlite-storage';
import CustomerService from '../services/CustomerService';
import { deleteCloseBtn, sucessBtn, sucessBtnText, sucessContainer, sucessHeader, sucessHeading, sucessMainText, sucessText } from '../Styles/PopupStyles';
import { pageNavigationBtn, pageNavigationBtnText } from '../Styles/Styles';

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
var deviceheight = Dimensions.get('window').height;

// Connction to access the pre-populated db
const db = openDatabase({ name: 'tbl_items.db', createFromLocation: 1 });
const createdb = openDatabase({ name: 'create_items.db', createFromLocation: 1 });

class GenerateEstimationSlip extends Component {
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
      saleQuantity: 0,
      gender: "Male",
      gstNumber: "",
      dob: "2021-06-21T18:30:00.000Z",
      address: "",
      modalVisible: true,
      flagone: true,
      flagqtyModelOpen: false,
      flagCustomerOpen: false,
      alertPopup: true,
      alertVisible: true,
      flagtwo: false,
      productItemId: 0,
      productuom: "",
      flagthree: false,
      flagfour: false,
      inventoryBarcodeId: '',
      inventoryProductName: '',
      estimationSlip: false,
      inventoryQuantity: '',
      inventoryMRP: '',
      inventoryDiscount: '',
      inventoryNetAmount: '',
      customerPhoneNumber: '',
      customerName: '',
      customerEmail: '',
      customerGender: '',
      customerAddress: '',
      customerGSTNumber: '',
      domainId: 1,
      tableHead: ['S.No', 'Barcode', 'Product', 'Price Per Qty', 'Qty', 'Sales Rate'],
      // tableData: [],
      privilages: [{ bool: true, name: "Check Promo Discount" }],
      inventoryDelete: false,
      lineItemDelete: false,
      uom: '',
      store: '',
      storeId: 0,
      itemsList: [],
      barList: [],
      mrpAmount: 0,
      promoDisc: 0,
      totalAmount: 0,
      totalQuantity: 0,
      lineItemsList: [],
      smnumber: "",
      camera: {
        type: RNCamera.Constants.Type.back,
        flashMode: RNCamera.Constants.FlashMode.auto,
      },
      resultModel: false,
      resultData: "",
      resultDsNumber: "",
    };
  }


  async componentDidMount() {
    const storeId = await AsyncStorage.getItem("storeId");
    this.setState({ storeId: storeId });
  }


  handleMenuButtonClick() {
    this.props.navigation.openDrawer();
  }

  cancel() {
    this.props.navigation.goBack(null);
    return true;
  }


  handlenewsaledeleteaction = (item, index) => {
    this.state.itemsList.splice(index, 1);
    this.setState({ barList: this.state.itemsList });
    this.calculateTotal();
  };


  modelCancel() {
    this.setState({ modalVisible: false });
  }

  onEndReached() {
    this.listRef.scrollToOffset({ offset: 0, animated: true });
  }

  topbarAction1 = (item, index) => {
    if (item.name === 'Check Promo Discount') {
      this.checkPromo();
    }
  };

  checkPromo() {
    const { storeId, domainId, barList } = this.state;
    CustomerService.getCheckPromoAmount(storeId, domainId, barList).then(res => {
      let calculatedDisc = res.data.result.calculatedDiscountVo;
      console.log({ calculatedDisc });
      if (res?.data && res?.data?.result[0].calculatedDiscountVo) {
        this.setState({ promoDisc: res?.data?.result });
        this.state.barList.forEach(barcodeData => {
          this.state.promoDisc.forEach(promo => {
            if (barcodeData.barcode === promo.barcode) {
              if (promo.calculatedDiscountVo) {
                if (promo.calculatedDiscountVo.discountAvailable) {
                  barcodeData.itemDiscount = parseInt(promo.calculatedDiscountVo.calculatedDiscount);
                  barcodeData.totalMrp = barcodeData.totalMrp - barcodeData.itemDiscount;
                }
              } else {
                barcodeData.itamDiscount = "No discount";
              }
            }
          });
        });
        this.setState({ barList: this.state.barList });
        this.calculateTotal();
      } else {
        alert("No Promo Available");
      }
    });
  }

  generateEstimationSlip() {
    let lineItem = [];
    this.state.barList.forEach((element, index) => {
      const obj = {
        "itemPrice": element.itemMrp,
        "quantity": parseInt(element.quantity),
        "discount": element?.discount,
        "netValue": element.totalMrp,
        "barCode": element.barcode,
        "domainId": 1,
        "manualDiscount":0,
        "promoDiscount":(isNaN(element.itemDiscount) ? 0 : (parseInt(element.itemDiscount))),
        "storeId": parseInt(this.state.storeId),
        "section": element.section,
        "subSection": element.subSection,
        "division": element.division,
        "userId": parseInt(element.salesMan),
        "hsnCode": element.hsnCode,
        "actualValue": element.itemMrp,
        "taxValue": element.taxValue,
        "cgst": element.cgst,
        "sgst": element.sgst,
        "discount": (isNaN(element.itamDiscount) ? 0 : (parseInt(element.itamDiscount)))
      };
      lineItem.push(obj);
    });
    console.log({ lineItem });
    CustomerService.saveLineItems(lineItem, 1).then((res) => {
      console.log({ res });
      if (res) {
        let lineItemsList = [];
        let dataResult = JSON.parse(res.data.result);
        dataResult.forEach(element => {
          const obj = {
            "lineItemId": element
          };
          lineItemsList.push(obj);
        });
        this.setState({ lineItemsList: lineItemsList });
      }
      const createObj = {
        salesMan: parseInt(this.state.smnumber),
        lineItems: this.state.lineItemsList,
        storeId: this.state.storeId,
        barcode: this.state.barList
      };
      CustomerService.createDeliverySlip(createObj).then((res) => {
        if (res) {
          console.log(res.data);
          this.setState({ resultModel: true, resultData: res.data, modalVisible: true, resultDsNumber: res.data });
          // alert(res.data.message);
          this.setState({
            barList: [],
            itemsList: [],
            barCode: "",
            smnumber: "",
          });
        } else {
          this.setState({ resultModel: false, modalVisible: false });
        }
      });
    }).catch(() => {
      this.setState({ loading: false });
      this.setState({ resultModel: false, modalVisible: false });
      alert('Error to create Delivery slip');
    });
  }

  endEditing() {
    this.getLineItems();
  }

  getLineItems() {
    const { barcodeId, storeId, smnumber } = this.state;
    console.log({ barcodeId, storeId, smnumber });
    let lineItem = [];
    CustomerService.getDeliverySlip(barcodeId.trim(), storeId, smnumber).then(res => {
      console.log({ res });
      if (res.data) {
        let totalAmount = 0;
        let totalQty = 0;
        let count = false;
        RNBeep.beep();
        if (this.state.itemsList.length === 0) {
          this.state.itemsList.push(res.data);
        } else {
          for (let i = 0; i < this.state.itemsList.length; i++) {
            if (this.state.itemsList[i].barcode === res.data.barcode) {
              count = true;
              var items = [...this.state.itemsList];
              if (parseInt(items[i].quantity) + 1 <= parseInt(items[i].qty)) {
                let addItem = parseInt(items[i].quantity) + 1;
                items[i].quantity = addItem.toString();
                let totalcostMrp = items[i].itemMrp * parseInt(items[i].quantity);
                items[i].totalMrp = totalcostMrp;
                break;
              } else {
                alert("Barcode reached max");
                break;
              }
            }
          }
          if (count === false) {
            this.state.itemsList.push(res.data);
          }
        }
        this.setState({ barList: this.state.itemsList }, () => {
          this.state.barList.forEach(element => {
            element.itemDiscount = 0;
            if (element.taxValues) {
              element.cgst = element.taxValues.cgstValue;
              element.sgst = element.taxValues.sgstValue;
              element.taxValue = element.taxValues.cgstValue + element.taxValues.sgstValue;
            }
            if (element.quantity > 1) {
            } else {
              element.totalMrp = element.itemMrp;
              element.quantity = parseInt(1);
            }
          });
          this.calculateTotal();
        });
        this.setState({ barcodeId: "" });
      } else {
        alert(res.data.body);
      }
    }).catch((err) => {
      console.log({ err });
      this.setState({ loading: false });
      alert("please enter a valid Barcode / smNumber");
    });
    console.log("BarListst", this.state.barList);
  }

  calculateTotal() {
    let totalAmount = 0;
    let totalqty = 0;
    this.state.barList.forEach(barCode => {
      totalAmount = totalAmount + barCode.totalMrp;
      totalqty = totalqty + parseInt(barCode.quantity);
    });
    this.setState({ mrpAmount: totalAmount, totalQuantity: totalqty }
    );
  }

  refresh() {
    if (global.barcodeId === 'something') {
      this.setState({ barcodeId: global.barcodeId });
      this.getLineItems();
    }
  }


  handleUOM = (value) => {
    // this.getAllSections()
    this.setState({ uom: value });
  };

  handleBarCode = (value) => {
    this.setState({ barcodeId: value });
  };

  handleQty = (value) => {
    this.setState({ saleQuantity: value });
  };

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


  handleSmCode = (text) => {
    this.setState({ smnumber: text.trim() });
  };

  navigateToScanCode() {
    global.barcodeId = 'something';
    this.props.navigation.navigate('ScanBarCode', {
      isFromNewSale: false, isFromAddProduct: true,
      onGoBack: () => this.refresh(),
    });
  }

  refresh() {
    if (global.barcodeId != 'something') {
      this.setState({ barcodeId: global.barcodeId });
      this.setState({ dsNumber: "" });
      global.barcodeId = 'something';
    }
    console.log('bar code is' + this.state.barcodeId);
  }

  render() {
    console.log(global.barcodeId);
    AsyncStorage.getItem("tokenkey").then((value) => {
      console.log(value);
    }).catch(() => {
      this.setState({ loading: false });
      console.log('There is error getting token');
      //alert('There is error getting token');
    });

    return (
      <View style={{ flex: 1 }}>
        {this.state.flagone && (
          <ScrollView>
            < View
              style={{
                flex: 1,
                paddingHorizontal: 0,
                paddingVertical: 0,
                marginTop: 10,
              }}>
              <View>
                <View style={Device.isTablet ? styles.rnSelectContainer_tablet_newsale : styles.rnSelectContainer_mobile_newsale}>
                  <RNPickerSelect
                    // style={Device.isTablet ? styles.rnSelectContainer_tablet_newsale : styles.rnSelectContainer_mobile_newsale}
                    placeholder={{
                      label: 'SELECT UOM',
                      value: "",
                    }}
                    Icon={() => {
                      return <Chevron style={styles.imagealign} size={1.5} color="gray" />;
                    }}
                    items={[
                      { label: 'Pieces', value: 'Pieces' },
                      { label: 'Meters', value: 'Meters' },
                    ]}
                    onValueChange={this.handleUOM}
                    disabled={true}
                    // style={pickerSelectStyles}
                    value={this.state.uom}
                    useNativeAndroidPickerStyle={false}

                  />
                </View>

                <TextInput style={Device.isTablet ? styles.input_tablet_normal : styles.input_mobile_normal}
                  underlineColorAndroid="transparent"
                  placeholder={I18n.t("ENTER BARCODE")}
                  placeholderTextColor="#6F6F6F60"
                  textAlignVertical="center"
                  autoCapitalize="none"
                  value={this.state.barcodeId}
                  onChangeText={this.handleBarCode}
                  // onEndEditing
                  onEndEditing={() => this.endEditing()}
                />

                <TextInput style={[Device.isTablet ? styles.input_tablet_normal_start : styles.input_mobile_normal_start, { width: Device.isTablet ? 150 : 100 }]}
                  underlineColorAndroid="transparent"
                  placeholder={I18n.t("SM Number")}
                  placeholderTextColor="#6F6F6F60"
                  textAlignVertical="center"
                  keyboardType={'default'}
                  maxLength={4}
                  autoCapitalize="none"
                  value={this.state.smnumber}
                  onChangeText={(text) => this.handleSmCode(text)}
                />

                {this.state.uom === "Pieces" && (
                  <TextInput style={[Device.isTablet ? styles.input_tablet_notedit : styles.input_mobile_notedit, { marginLeft: Device.isTablet ? deviceWidth / 2.4 : deviceWidth / 2.15, width: Device.isTablet ? 160 : 80 }]}
                    underlineColorAndroid="transparent"
                    placeholder="QTY"
                    placeholderTextColor="#6F6F6F60"
                    textAlignVertical="center"
                    keyboardType={'default'}
                    autoCapitalize="none"
                    editable={false} selectTextOnFocus={false}
                  />
                )}

                {this.state.uom === "Meters" && (
                  <TextInput style={[Device.isTablet ? styles.input_tablet_normal : styles.input_mobile_normal, { marginLeft: Device.isTablet ? deviceWidth / 1.8 : deviceWidth / 2.15, width: Device.isTablet ? 200 : 80 }]}
                    underlineColorAndroid="transparent"
                    placeholder="QTY"
                    keyboardType={'default'}
                    placeholderTextColor="#6F6F6F60"
                    textAlignVertical="center"
                    autoCapitalize="none"
                    value={this.state.saleQuantity}
                    onChangeText={this.handleQty}
                  />
                )}


                <TouchableOpacity
                  style={
                    Device.isTablet ? styles.input_tabletbutton_normal : styles.input_mobilebutton_normal
                  }
                  onPress={() => this.navigateToScanCode()} >
                  <Text style={[Device.isTablet ? styles.navButtonText_tablet : styles.navButtonText_mobile, { marginTop: Device.isTablet ? 0 : 0, marginLeft: Device.isTablet ? -20 : -10 }]}> {I18n.t('SCAN')} </Text>
                </TouchableOpacity>

              </View>
              {this.state.itemsList.length !== 0 && (
                <FlatList
                  style={styles.flatList}
                  horizontal
                  data={this.state.privilages}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity style={[pageNavigationBtn, {
                      backgroundColor: item.bool ? '#ED1C24' : '#FFFFFF',
                      borderColor: item.bool ? '#ED1C24' : '#858585',
                    }]} onPress={() => this.topbarAction1(item, index)} >

                      <Text style={[pageNavigationBtnText, { color: item.bool ? "#FFFFFF" : '#858585', fontFamily: 'regular' }]}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  )}
                  ListFooterComponent={<View style={{ width: 15 }}></View>}
                />
              )}

              <FlatList style={{ marginTop: 20, marginBottom: 20 }}
                data={this.state.barList}
                keyExtractor={item => item}
                contentContainerStyle={{ paddingBottom: 200 }}
                onEndReached={this.onEndReached.bind(this)}
                scrollEnabled={
                  false
                }
                ref={(ref) => { this.listRef = ref; }}
                renderItem={({ item, index }) => (
                  <View style={{
                    height: Device.isTablet ? 240 : 190,
                    backgroundColor: '#FFFFFF',
                    borderBottomWidth: 5,
                    borderBottomColor: '#FBFBFB',
                    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
                  }}>
                    <View style={{ flexDirection: 'row', width: deviceWidth, justifyContent: 'space-around', alignItems: 'center', height: Device.isTablet ? 220 : 170, }}>
                      <View>
                        <Image source={require('../assets/images/default.jpeg')}
                          //source={{ uri: item.image }}
                          style={{
                            width: Device.isTablet ? 140 : 90, height: Device.isTablet ? 140 : 90,
                          }} />
                      </View>
                      <View style={{ flexDirection: 'column', justifyContent: 'space-around' }}>
                        <Text style={{ fontSize: Device.isTablet ? 21 : 16, marginTop: 10, fontFamily: 'medium', color: '#353C40' }}>
                          {item.itemdesc}
                        </Text>
                        <Text style={{ fontSize: Device.isTablet ? 17 : 12, marginTop: -20, fontFamily: 'regular', color: '#808080' }}>
                          {I18n.t("BARCODE")}: <Text style={{ color: '#000000' }}>{item.barcode}</Text>
                        </Text>
                        <Text style={{ fontSize: Device.isTablet ? 17 : 12, marginTop: 6, fontFamily: 'regular', color: '#808080' }}>
                          {I18n.t("QUANTITY")}: <Text style={{ color: '#000000' }}>{item.quantity}</Text>
                        </Text>
                        <Text style={{ fontSize: Device.isTablet ? 17 : 12, marginTop: 6, fontFamily: 'regular', color: '#808080' }}>
                          {I18n.t("SM")}: <Text style={{ color: '#000000' }}>{this.state.smnumber}</Text>
                        </Text>
                        <Text style={{ fontSize: Device.isTablet ? 17 : 12, marginTop: 6, fontFamily: 'regular', color: '#808080' }}>
                          {I18n.t("DISCOUNT TYPE")}:
                        </Text>
                        <Text style={{ fontSize: Device.isTablet ? 17 : 12, marginTop: 6, fontFamily: 'regular', color: '#808080' }}>
                          {I18n.t("MRP")}: <Text style={{ color: '#ED1C24' }}>₹ {item.itemMrp}</Text>
                        </Text>
                        <Text style={{ fontSize: Device.isTablet ? 17 : 12, fontFamily: 'regular', color: '#808080' }}>
                          {I18n.t("DISCOUNT")}: ₹ 0
                        </Text>
                        <Text style={{ fontSize: Device.isTablet ? 17 : 12, marginTop: 6, fontFamily: 'regular', color: '#808080' }}>
                          {I18n.t("TOTAL")}: <Text style={{ color: '#ED1C24' }}>₹ {item.totalMrp}</Text>
                        </Text>
                      </View>
                      <View>
                        <View style={{
                          flexDirection: 'row',
                          justifyContent: 'space-around',
                          alignItems: 'center',
                          height: Device.isTablet ? 60 : 30,
                          marginLeft: -40,
                          marginRight: Device.isTablet ? 40 : 20,
                          width: Device.isTablet ? 150 : 90,
                        }}>
                          <TouchableOpacity style={{
                            borderColor: '#ED1C24',
                            height: Device.isTablet ? 50 : 30,
                            width: Device.isTablet ? 50 : 30, borderBottomLeftRadius: 3,
                            borderTopLeftRadius: 3,
                            borderBottomWidth: 1,
                            borderTopWidth: 1,
                            borderLeftWidth: 1, paddingLeft: 10, marginLeft: 20,
                          }}
                            onPress={() => this.decreamentForTable(item, index)}>
                            <Text style={{
                              alignSelf: 'center',
                              marginTop: 2,
                              marginLeft: -10,
                              fontSize: Device.isTablet ? 22 : 12,
                              color: '#ED1C24'
                            }}
                            >-</Text>
                          </TouchableOpacity>
                          {/* <Text> {item.qty}</Text> */}
                          <TextInput
                            style={{
                              justifyContent: 'center',
                              margin: 20,
                              height: Device.isTablet ? 50 : 30,
                              width: Device.isTablet ? 50 : 30,
                              marginTop: 10,
                              marginBottom: 10,
                              borderColor: '#ED1C24',
                              backgroundColor: 'white',
                              color: '#353C40',
                              borderWidth: 1,
                              fontFamily: 'regular',
                              fontSize: Device.isTablet ? 22 : 12,
                              paddingLeft: Device.isTablet ? 15 : 9,
                            }}
                            underlineColorAndroid="transparent"
                            placeholder="1"
                            placeholderTextColor="#8F9EB7"
                            value={item.quantity}
                            onChangeText={(text) => this.updateQty(text, index, item)}
                          />
                          <TouchableOpacity style={{
                            borderColor: '#ED1C24',
                            height: Device.isTablet ? 50 : 30,
                            width: Device.isTablet ? 50 : 30, borderBottomRightRadius: 3,
                            borderTopRightRadius: 3,
                            borderBottomWidth: 1,
                            borderTopWidth: 1,
                            borderRightWidth: 1
                          }}
                            onPress={() => this.incrementForTable(item, index)}>
                            <Text style={{
                              alignSelf: 'center',
                              marginTop: 2,
                              fontSize: Device.isTablet ? 22 : 12,
                              color: '#ED1C24'
                            }}
                            >+</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={{
                            position: 'absolute',
                            right: Device.isTablet ? 40 : 20,
                            top: Device.isTablet ? -55 : -35,
                            width: Device.isTablet ? 50 : 30,
                            height: Device.isTablet ? 50 : 30,
                            borderRadius: 5,
                            // borderTopRightRadius: 5,
                            borderWidth: 1,
                            borderColor: "lightgray",
                          }} onPress={() => this.handlenewsaledeleteaction(item, index)}>
                            <Image style={{ alignSelf: 'center', top: 5, height: Device.isTablet ? 30 : 20, width: Device.isTablet ? 30 : 20 }} source={require('../assets/images/delete.png')} />
                          </TouchableOpacity>
                        </View>

                      </View>
                    </View>

                  </View>
                )}
              />

              {this.state.itemsList.length != 0 && (
                <View style={{ width: deviceWidth, height: 240, position: 'absolute', bottom: 0, backgroundColor: '#FFFFFF' }}>
                  <Text style={{
                    color: "#353C40", fontFamily: "medium", alignItems: 'center', marginLeft: 16, top: 30, justifyContent: 'center', textAlign: 'center', marginTop: 10,
                    fontSize: Device.isTablet ? 19 : 14, position: 'absolute',
                  }}>
                    Total Qty </Text>
                  <Text style={{
                    color: "#353C40", fontFamily: "medium", alignItems: 'center', marginLeft: 16, top: 30, position: 'absolute', right: 10, justifyContent: 'center', textAlign: 'center', marginTop: 10,
                    fontSize: Device.isTablet ? 19 : 14, position: 'absolute',
                  }}>
                    {this.state.totalQuantity} </Text>
                  <Text style={{
                    color: "#353C40", fontFamily: "medium", alignItems: 'center', marginLeft: 16, top: 60, justifyContent: 'center', textAlign: 'center', marginTop: 10,
                    fontSize: Device.isTablet ? 19 : 14, position: 'absolute',
                  }}>
                    Promo Discount </Text>
                  <Text style={{
                    color: "#353C40", fontFamily: "medium", alignItems: 'center', marginLeft: 16, top: 60, position: 'absolute', right: 10, justifyContent: 'center', textAlign: 'center', marginTop: 10,
                    fontSize: Device.isTablet ? 19 : 14, position: 'absolute',
                  }}>
                    ₹ {this.state.promoDisc} </Text>
                  <Text style={{
                    color: "#353C40", fontFamily: "bold", alignItems: 'center', marginLeft: 16, top: 90, fontSize: 20, justifyContent: 'center', textAlign: 'center', marginTop: 10,
                    fontSize: Device.isTablet ? 19 : 14, position: 'absolute',
                  }}>
                    Grand Total </Text>
                  <Text style={{
                    color: "#353C40", fontFamily: "bold", alignItems: 'center', marginLeft: 16, top: 90, fontSize: 20, position: 'absolute', right: 10, justifyContent: 'center', textAlign: 'center', marginTop: 10,
                    fontSize: Device.isTablet ? 19 : 14, position: 'absolute',
                  }}>
                    ₹ {(this.state.mrpAmount)} </Text>
                  <View style={styles.TopcontainerforPay}>
                    <TouchableOpacity
                      style={Device.isTablet ? styles.signInButton_tablet : styles.signInButton_mobile}
                      onPress={() => this.generateEstimationSlip()} >
                      <Text style={Device.isTablet ? styles.signInButtonText_tablet : styles.signInButtonText_mobile}> Generate Estimation Slip </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        )
        }

        {this.state.resultModel && (
          <View>
            <Modal style={{ margin: 0 }} isVisible={this.state.modalVisible}>
              <View style={sucessContainer}>
                <View>
                  <View style={sucessHeader}>
                    <View>
                      <Text style={sucessHeading} > ES Number </Text>
                    </View>
                    <View>
                      <TouchableOpacity style={deleteCloseBtn} onPress={() => this.modelCancel()}>
                        <Image style={{ width: Device.isTablet ? 20 : 15, height: Device.isTablet ? 20 : 15 }} source={require('../assets/images/modalCloseWhite.png')} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View>
                  <View style={{ alignItems: 'center', marginTop: 20 }}>
                    <Text>Es Number:</Text>
                    <Text></Text>
                    <Text selectable={true} style={sucessText}>{this.state.resultDsNumber}</Text>
                  </View>
                  <TouchableOpacity
                    style={sucessBtn} onPress={() => this.modelCancel()}
                  >
                    <Text style={sucessBtnText}  > {I18n.t("BACK TO DASHBOARD")} </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        )
        }



      </View >
    );
  }
}
export default GenerateEstimationSlip;



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
  createUserinput: {
    justifyContent: 'center',
    margin: Device.isTablet ? 40 : 20,
    height: Device.isTablet ? 54 : 44,
    marginTop: Device.isTablet ? 10 : 5,
    marginBottom: Device.isTablet ? 10 : 5,
    borderColor: '#8F9EB717',
    borderRadius: 3,
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    fontFamily: 'regular',
    paddingLeft: 15,
    fontSize: Device.isTablet ? 20 : 14,
  },
  navButton_mobile: {
    position: 'absolute',
    right: 20, top: 37,
    backgroundColor: '#ED1C24',
    borderRadius: 5,
    width: 105,
    height: 32,
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
    bottom: 30,
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
  input_mobile_notedit: {
    justifyContent: 'center',
    marginLeft: deviceWidth / 3 + 30,
    width: deviceWidth / 3 - 40,
    height: 44,
    marginTop: -55,
    marginBottom: 10,
    borderColor: '#DCE3F2',
    borderRadius: 3,
    backgroundColor: '#DCE3F2',
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
    paddingRight: 15,
    fontSize: 14,
  },
  input_mobilebutton_normal: {
    justifyContent: 'center',
    marginLeft: deviceWidth - 120,
    width: deviceWidth / 4 - 10,
    height: 44,
    marginTop: -55,
    marginBottom: 10,
    borderColor: '#8F9EB717',
    borderRadius: 10,
    backgroundColor: '#ED1C24',
    borderWidth: 1,
    fontFamily: 'regular',
    paddingLeft: 15,
    fontSize: 14,
  },

  input_mobile_normal_start: {
    justifyContent: 'center',
    marginLeft: 20,
    width: deviceWidth / 3,
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
  input_tablet_notedit: {
    justifyContent: 'center',
    marginLeft: deviceWidth / 3 + 30,
    width: deviceWidth / 3 - 50,
    height: 55,
    marginTop: -65,
    marginBottom: 10,
    borderColor: '#DCE3F2',
    borderRadius: 3,
    backgroundColor: '#DCE3F2',
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
  input_tabletbutton_normal: {
    justifyContent: 'center',
    marginLeft: deviceWidth - 145,
    width: deviceWidth / 3 - 100,
    height: 55,
    borderRadius: 10,
    marginTop: -65,
    marginBottom: 10,
    borderColor: '#8F9EB717',
    backgroundColor: '#ED1C24',
    borderWidth: 1,
    fontFamily: 'regular',
    paddingLeft: 15,
    fontSize: 22,
  },
  navButton_tablet: {
    position: 'absolute',
    right: 20, top: 27,
    backgroundColor: '#ED1C24',
    borderRadius: 5,
    width: 155,
    height: 42,
  },
  input_tablet_normal_start: {
    justifyContent: 'center',
    marginLeft: 20,
    width: deviceWidth / 4,
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
  // input_mobile_normal_start: {
  //     justifyContent: 'center',
  //     marginLeft: 20,
  //     width: deviceWidth / 2,
  //     height: 44,
  //     marginTop: 0,
  //     marginBottom: 10,
  //     borderColor: '#8F9EB717',
  //     borderRadius: 3,
  //     backgroundColor: '#FBFBFB',
  //     borderWidth: 1,
  //     fontFamily: 'regular',
  //     paddingLeft: 15,
  //     fontSize: 14,
  // },
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
    marginTop: 0,
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
  navButton_tablet: {
    position: 'absolute',
    right: 20, top: 27,
    backgroundColor: '#ED1C24',
    borderRadius: 5,
    width: 155,
    height: 42,
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
    backgroundColor: "#ffffff",
    marginTop: deviceHeight - 300,
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
    backgroundColor: "#ffffff",
    height: 400,
    marginTop: deviceHeight - 400,
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
