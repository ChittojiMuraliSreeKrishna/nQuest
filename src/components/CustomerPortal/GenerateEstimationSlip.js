import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import React, { Component } from 'react';
import { Dimensions, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RNBeep from 'react-native-a-beep';
import { RNCamera } from 'react-native-camera';
import Device from 'react-native-device-detection';
import I18n from 'react-native-i18n';
import Modal from "react-native-modal";
import { Checkbox, TextInput } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import { Chevron } from 'react-native-shapes';
import { openDatabase } from 'react-native-sqlite-storage';
import { default as MinusIcon, default as PlusIcon, default as ScanIcon } from 'react-native-vector-icons/MaterialCommunityIcons';
import forms from '../../commonUtils/assets/styles/formFields.scss';
import scss from '../../commonUtils/assets/styles/style.scss';
import Clipbrd from "../../commonUtils/Clipboard";
import Loader from '../../commonUtils/loader';
import PrintService from '../../commonUtils/Printer/printService';
import { RF } from '../../Responsive';
import { customerErrorMessages } from '../Errors/errors';
import Message from '../Errors/Message';
import CustomerService from '../services/CustomerService';
import { color } from '../Styles/colorStyles';
import { textStyle } from '../Styles/FormFields';
import { sucessBtn, sucessBtnText, sucessText } from '../Styles/PopupStyles';
import { flatListMainContainer, flatlistSubContainer, flatListTextStyle, textContainer, textStyleMedium, textStyleMediumColor } from '../Styles/Styles';



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
      smnumber: "",
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
      modalVisible: true,
      productItemId: 0,
      productuom: "",
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
      camera: {
        type: RNCamera.Constants.Type.back,
        flashMode: RNCamera.Constants.FlashMode.auto,
      },
      resultModel: false,
      resultData: "",
      resultDsNumber: "",
      checked: 'checked',
      smnumberValid: true,
      barcodeIdValid: true,
      errors: {},
      printerIp: "",
      showPrinter: false,
      printBtn: false,
      printEnabled: false,
      dayCloseDates: [],
      toDay: moment(new Date()).format("YYYY-MM-DD").toString(),
      isCheckPromo: false
    };
  }


  async componentWillMount() {
    const storeId = await AsyncStorage.getItem("storeId");
    this.setState({ storeId: storeId, printBtn: false });
    const prinStat = await AsyncStorage.getItem("prinStat");
    if (prinStat === "ok") {
      this.setState({ printBtn: true, loading: false });
    } else if (prinStat === "no") {
      alert("failed to connect");
      this.setState({ loading: false });
    } else {
      this.setState({ loading: false });
    }
    this.getallDates()
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
    // this.listRef.scrollToOffset({ offset: 0, animated: true });
  }

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
                barcodeData.itamDiscount = "No discount";
              }
            }
          });
        });
        this.setState({ barList: this.state.barList });
        this.calculateTotal();
      } else {
        console.log("in error");
        alert("No Promo Available");
      }
      this.setState({ isCheckPromo: true })
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
        "manualDiscount": 0,
        "promoDiscount": (isNaN(element.itemDiscount) ? 0 : (parseInt(element.itemDiscount))),
        "storeId": parseInt(this.state.storeId),
        "section": element.section,
        "subSection": element.subSection,
        "division": element.division,
        "userId": parseInt(element.salesMan),
        "hsnCode": element.hsnCode,
        "actualValue": element.itemMrp,
        "taxValue": element.taxValue * parseInt(element.quantity),
        "igst": parseInt(element.igst) * parseInt(element.quantity),
        "cgst": parseInt(element.cgst) * parseInt(element.quantity),
        "sgst": parseInt(element.sgst) * parseInt(element.quantity),
        "costPrice": element.costPrice,
        "batchNo": element.batchNo,
        "uom": element.uom,
        "originalBarcodeCreatedAt": element.createdDate,
        "discount": (isNaN(element.itemDiscount) ? 0 : (parseInt(element.itemDiscount)))
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
        // barcode: this.state.barList
      };
      CustomerService.createDeliverySlip(createObj).then((res) => {
        if (res) {
          console.log(res.data);
          this.setState({ resultModel: true, resultData: res.data, modalVisible: true, resultDsNumber: res.data, isCheckPromo: false });
          {
            this.state.printEnabled && PrintService('DSNUM', res.data, this.state.barList).then(() => {
              this.setState({ loading: false, });
            }).catch((err) => {
              this.setState({ loading: false, });
              alert(err);
            });
          }
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

  validationForm() {
    let isFormValid = true;
    let errors = {};

    if (this.state.smnumber === '') {
      isFormValid = false;
      errors["smNumber"] = customerErrorMessages.smNumber;
      this.setState({ smnumberValid: false });
    }

    if (this.state.barcodeId === '') {
      isFormValid = false;
      errors["barcodeId"] = customerErrorMessages.barcodeId;
      this.setState({ barcodeIdValid: false });
    }

    this.setState({ errors: errors });
    return isFormValid;
  }

  endEditing() {
    const isFormValid = this.validationForm();
    if (isFormValid) {
      this.getLineItems();
    }
  }

  getLineItems() {
    const { barcodeId, storeId, smnumber } = this.state;
    console.log("datataa", barcodeId, storeId, smnumber);
    let lineItem = [];
    if (this.state.barcodeId && this.state.smnumber) {
      if (this.state.dayCloseDates.length !== 0) {
        if (this.state.dayCloseDates.length === 1 && this.state.dayCloseDates[0].dayClose.split("T")[0] === this.state.toDay) {
          CustomerService.getDeliverySlip(barcodeId.trim(), storeId, smnumber).then(res => {
            console.log({ res });
            if (res.data) {
              let totalAmount = 0;
              let totalQty = 0;
              let count = false;
              RNBeep.beep();
              if (res.data.qty === 0) {
                alert(`this Barcode have ${parseInt(res.data.qty)} Items left`);
              } else {
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
                        items[i].totalMrp = parseFloat(totalcostMrp).toFixed(2);
                        break;
                      } else {
                        alert("Barcode reached max");
                        break;
                      }
                    }
                  }
                  if (!count) {
                    this.state.itemsList.push(res.data);
                  }
                }
              }
              this.setState({ barList: this.state.itemsList }, () => {
                this.state.barList.forEach(element => {
                  element.itemDiscount = 0;
                  if (element.taxValues) {
                    element.cgst = element.taxValues.cgstValue;
                    element.sgst = element.taxValues.sgstValue;
                    element.igst = element.taxValues.igstValue;
                    element.taxValue = element.taxValues.cgstValue + element.taxValues.sgstValue;
                  }
                  if (element.quantity > 1) {
                  } else {
                    element.totalMrp = element.itemMrp.toFixed(2);
                    element.quantity = parseInt(1);
                  }
                });
                this.calculateTotal();
              });
              this.setState({ barcodeId: "" });
            } else {
              alert(res.data.body);
            }
          })
          this.setState({ isCheckPromo: false });
        } else {
          alert("Please Close Previous Days")
        }
      } else {
        alert("Unable To Generate Estimate Slip Today Daycloser Is Done");
      }
    } else {
      alert("Please enter Barcode / SM number");
    }
  }

  calculateTotal() {
    let totalAmount = 0;
    let totalqty = 0;
    let promoDiscount = 0;
    this.state.barList.forEach(barCode => {
      totalAmount = totalAmount + parseFloat(barCode.totalMrp);
      promoDiscount = promoDiscount + (isNaN(barCode.itemDiscount) ? 0 : (parseInt(barCode.itemDiscount)));
      totalqty = totalqty + parseInt(barCode.quantity);
    });
    this.setState({ mrpAmount: totalAmount.toFixed(2), totalQuantity: totalqty, promoDisc: promoDiscount });
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

  updateQuanty = (text, index, item) => {
    const qtyarr = [...this.state.itemsList];
    qtyarr[index].quantity = text;
    this.setState({ itemsList: qtyarr }, () => {
      this.updateQty(text, index, item);
    });
  };

  updateQty = (text, index, item) => {
    const Qty = /^[0-9\b]+$/;
    const qtyarr = [...this.state.itemsList];
    console.log(qtyarr[index].quantity);
    let addItem = '';
    let value = text;
    if (value === '') {
      addItem = '';
      qtyarr[index].quantity = addItem.toString();
    }
    else if (value !== '' && Qty.test(value) === false) {
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
    let promoDiscount = 0
    this.state.barList.forEach(bardata => {
      grandTotal = grandTotal + parseFloat(bardata.totalMrp);
      promoDiscount = promoDiscount + bardata?.itemDiscount;
      totalqty = totalqty + parseInt(bardata.quantity);
    });
    this.setState({ mrpAmount: (grandTotal.toFixed(2)), totalQuantity: totalqty, promoDisc: promoDiscount });
    this.state.totalQuantity = (parseInt(this.state.totalQuantity) + 1);
    // this.setState({ itemsList: qtyarr });
  };

  incrementForTable(item, index) {
    const qtyarr = [...this.state.itemsList];
    console.log("qtyarr value", qtyarr[index]);
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
    let promoDiscount = 0
    this.state.barList.forEach(bardata => {
      grandTotal = grandTotal + parseFloat(bardata.totalMrp);
      promoDiscount = promoDiscount + bardata?.itemDiscount;
      totalqty = totalqty + parseInt(bardata.quantity);
    });
    this.setState({ mrpAmount: (grandTotal.toFixed(2)), totalQuantity: totalqty, promoDisc: promoDiscount });
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
      let promoDiscount = 0
      this.state.barList.forEach(bardata => {
        grandTotal = grandTotal + parseFloat(bardata.totalMrp);
        promoDiscount = promoDiscount + bardata?.itemDiscount;
        totalqty = totalqty + parseInt(bardata.quantity);
      });
      this.setState({ mrpAmount: (grandTotal.toFixed(2)), totalQuantity: totalqty, promoDisc: promoDiscount });
      this.setState({ itemsList: qtyarr });
    } else {
      this.state.itemsList.splice(index, 1);
      this.setState({ barList: this.state.itemsList });
      // this.calculateTotal();
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
    console.log(global.barcodeId);
    AsyncStorage.getItem("tokenkey").then((value) => {
      console.log(value);
    }).catch(() => {
      this.setState({ loading: false });
      console.log('There is error getting token');
    });
    console.log("ES Number", this.state.resultDsNumber);
    return (
      <View style={scss.container}>
        {this.state.loading && <Loader loading={this.state.loading} />}
        <ScrollView>
          <View
            style={{ flex: 1, marginTop: 10 }}>
            <View>
              <View style={{ flexDirection: 'row' }}>
                <View style={Device.isTablet ? styles.rnSelectContainer_tablet_newsale : styles.rnSelectContainer_mobile_newsale}>
                  <RNPickerSelect
                    placeholder={{
                      label: 'SELECT TYPE',
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
                <>
                  <TextInput
                    style={[forms.input_fld, { width: "35%", minWidth: "35%", maxWidth: "35%" }]}
                    mode="flat"
                    activeUnderlineColor='#000'
                    underlineColor='#6f6f6f'
                    placeholder={I18n.t("SM Number")}
                    maxLength={4}
                    keyboardType={'number-pad'}
                    value={this.state.smnumber}
                    onChangeText={(text) => this.handleSmCode(text)}
                  />
                  <View style={{ marginLeft: deviceWidth / 2.8 + 30 }}>
                    {!this.state.smnumberValid && (
                      <Message imp={true} message={this.state.errors["smNumber"]} />
                    )}
                  </View>
                </>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <TextInput
                  style={[forms.input_fld, { width: "30%", minWidth: "30%", maxWidth: "55%" }]}
                  mode="flat"
                  activeUnderlineColor='#000'
                  underlineColor='#6f6f6f'
                  placeholder={I18n.t("BARCODE")}
                  value={this.state.barcodeId}
                  onChangeText={this.handleBarCode}
                  onEndEditing={() => this.endEditing()}
                />
                <TouchableOpacity style={{ paddingTop: RF(10) }} onPress={() => this.navigateToScanCode()} >
                  <ScanIcon name='barcode-scan' size={25} color={color.black} />
                </TouchableOpacity>
                <View style={scss.radio_item}>
                  <Checkbox
                    status={this.state.checked ? 'checked' : 'unchecked'}
                    onPress={() => {
                      this.setState({ checked: !this.state.checked, smnumber: '' });
                    }}
                  /><Text>Remember Sales Man</Text>
                </View>
              </View>
              {!this.state.barcodeIdValid && (
                <Message imp={true} message={this.state.errors["barcodeId"]} />
              )}
              <TouchableOpacity style={[forms.button_active, { backgroundColor: color.white, borderColor: color.greyYellow, width: '90%' }]} onPress={() => this.handleViewPrinter()}>
                <Text style={[forms.button_text, { color: color.black }]}>Connect Printer</Text>
              </TouchableOpacity>

              {this.state.uom === "Pieces" && (
                <TextInput
                  style={[forms.input_fld, { width: "30%", minWidth: "30%", maxWidth: "55%" }]}
                  mode="flat"
                  activeUnderlineColor='#000'
                  underlineColor='#6f6f6f'
                  label={"QTY"}
                  editable={false} selectTextOnFocus={false}
                />
              )}

              {this.state.uom === "Meters" && (
                <TextInput
                  style={[forms.input_fld, { width: "30%", minWidth: "30%", maxWidth: "55%" }]}
                  mode="flat"
                  activeUnderlineColor='#000'
                  underlineColor='#6f6f6f'
                  label={"QTY"}
                  value={this.state.saleQuantity}
                  onChangeText={this.handleQty}
                />
              )}
            </View>


            {this.state.itemsList.length !== 0 && (
              <TouchableOpacity style={[forms.button_active, { backgroundColor: this.state.isCheckPromo ? color.disableBackGround : color.accent, width: '90%' }]}
                onPress={() => {
                  this.checkPromo();
                }}
                disabled={this.state.isCheckPromo}>
                <Text style={forms.button_text}>
                  {"Check Promo Disc"}
                </Text>
              </TouchableOpacity>
            )}

            {this.state.itemsList.length !== 0 && (
              <View style={{ flex: 1, flexDirection: 'row', marginLeft: RF(10) }}>
                <Text style={textStyle}>Total Scanned Items - </Text>
                <Text style={[textStyle, { color: color.accent }]}>{('0' + this.state.totalQuantity).slice(-2)} </Text>
              </View>
            )}
            {this.state.barList.length !== 0 &&
              <FlatList style={{ marginTop: 20, marginBottom: 20 }}
                data={this.state.barList}
                keyExtractor={item => item}
                onEndReached={this.onEndReached.bind(this)}
                renderItem={({ item, index }) => (
                  <>
                    <View style={[flatListMainContainer, { backgroundColor: color.white }]}>
                      <View style={flatlistSubContainer}>
                        <View style={textContainer}>
                          <Text style={textStyleMediumColor}>{I18n.t("Item")}</Text>
                          <Text style={textStyleMediumColor}>{I18n.t("MRP")}</Text>
                          <Text style={textStyleMediumColor}>{I18n.t("QTY")}</Text>
                        </View>
                        <View style={textContainer}>
                          <Text style={textStyleMedium}>{item.barcode}</Text>
                          <Text style={textStyleMedium}>₹ {parseFloat((item.itemMrp)).toFixed(2)}</Text>
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
                              keyboardType={'number-pad'}
                              underlineColor='#6f6f6f'
                              activeUnderlineColor='#000'
                              value={String(item.quantity)}
                              textAlign={'center'}
                              onChangeText={(text) => this.updateQuanty(text, index, item)}
                            />
                            <TouchableOpacity
                              onPress={() => this.decreamentForTable(item, index)}>
                              <MinusIcon name="minus-circle-outline" size={20} color={"red"} />
                            </TouchableOpacity>
                          </View>
                        </View>

                        <View style={textContainer}>
                          <Text style={textStyleMediumColor}>{I18n.t("SM Number")}</Text>
                          <Text style={textStyleMediumColor}>{I18n.t("Discount Type")} </Text>
                          <Text style={textStyleMediumColor}>{I18n.t("Discount")} </Text>
                        </View>

                        <View style={textContainer}>
                          <Text style={textStyleMedium}>{this.state.smnumber}</Text>
                          <Text style={textStyleMedium}>{ }</Text>
                          <Text style={[textStyleMedium, { color: '#2ADC09' }]}>₹{item.itemDiscount}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={flatListTextStyle}>
                      <Text style={{ fontFamily: 'bold' }}>{I18n.t("TOTAL")} :  ₹{item.totalMrp}</Text>
                    </View>
                  </>
                )}
              />
            }

            {this.state.itemsList.length != 0 && (
              <View style={{ margin: 5 }}>
                <View style={[scss.radio_group, { marginLeft: 16, marginTop: 10 }]}>
                  <Text style={scss.textStyleMedium}> Total Qty </Text>
                  <Text style={scss.textStyleMedium}>{this.state.totalQuantity} </Text>
                </View>
                <View style={[scss.radio_group, { marginLeft: 16, marginTop: 10 }]}>
                  <Text style={scss.textStyleMedium}> Promo Discount </Text>
                  <Text style={scss.textStyleMedium}>₹ {this.state.promoDisc} </Text>
                </View>
                <View style={[scss.radio_group, { marginLeft: 16, marginTop: 10 }]}>
                  <Text style={scss.textStyleMedium}>Grand Total </Text>
                  <Text style={scss.textStyleMedium}>₹ {parseFloat(this.state.mrpAmount).toFixed(2)} </Text>
                </View>
                <View style={forms.action_buttons_container}>
                  <TouchableOpacity
                    style={[forms.action_buttons, forms.submit_btn, { width: "95%" }]}
                    onPress={() => this.generateEstimationSlip()} >
                    <Text style={forms.submit_btn_text}> Generate Estimation Slip </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        {this.state.resultModel && (
          <View>
            <Modal style={{ margin: 0 }} isVisible={this.state.modalVisible}
              onBackButtonPress={() => this.modelCancel()}
              onBackdropPress={() => this.modelCancel()} >
              <View style={forms.filterModelContainer}>
                <Text style={forms.popUp_decorator}>-</Text>
                <View style={forms.filterModelSub}>
                  <View style={{ alignItems: 'center', marginTop: 20 }}>
                    <Text>Es Number:</Text>
                    <Text></Text>
                    <Text style={sucessText}>{this.state.resultDsNumber} <Clipbrd data={this.state.resultDsNumber} /> </Text>
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
        )}

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

      </View>
    );
  }
}
export default GenerateEstimationSlip;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF'
  },
  imagealign: {
    marginTop: Device.isTablet ? 25 : 20,
    marginRight: Device.isTablet ? 30 : 20,
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
  }
});
