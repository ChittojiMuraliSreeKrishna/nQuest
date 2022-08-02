import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { Component } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Device from 'react-native-device-detection';
import I18n from 'react-native-i18n';
import Modal from 'react-native-modal';
import RNPickerSelect from 'react-native-picker-select';
import { Chevron } from 'react-native-shapes';
import CustomerService from '../services/CustomerService';
import { flatListMainContainer, flatlistSubContainer, textContainer, textStyleLight, textStyleMedium } from '../Styles/Styles';

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
        returnInvoiceArray.push({ barCode: items[i].barcode, value: items[i].netValue, quantity: items[i].quantity, isSelected: false });
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

  generateNewSlip() {
    console.log(this.state.storeId);
    const saveObj = {
      barcodes: this.state.netValueList,
      mobileNumber: this.state.mobileNumber ? this.state.mobileNumber : null,
      invoiceNumber: this.state.invoiceNumber,
      reason: this.state.reason,
      customerId: parseInt(this.state.userId),
      storeId: parseInt(this.state.storeId),
      totalAmount: parseInt(this.state.returnSlipTotal),
      createdBy: 0,
      comments: null
    };
    console.log(saveObj, "params");
    // this.setState({ loading: true });
    axios.post(CustomerService.saveRetunSlip(), saveObj).then(res => {
      if (res) {
        console(res.data.result,"resultss");
        this.setState({ resultData: res.data.result, }, () => {
          this.setState({ resultModel: true, modelVisible: true });
        });
        this.setState({
          modelVisible: false,
          netValueList: [],
          returnSlipTotal: 0,
          returnInvoice: [],
          mobileNumber: '',
          invoiceNumber: "",
          netValue: 0,
          quantity: 0,
          reason: "",
          customerNumber: "",
        });
      }
      this.setState({ returnModel: false, modelVisible: false, loading: false });
    }).catch((err) => {
      this.setState({ loading: false });
      console.log(err);
      alert("Unable to Save the Return Slip");
      this.setState({ returnModel: false, modelVisible: false, loading: false });
    });

  }



  generateInvoice = () => {
    this.setState({ returnModel: true, modelVisible: true });
    console.log("hello");
    console.log("generateInvoice",this.state.netValueList);
  };

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

  customerTag() {
    if (this.state.customerNumber.length === 0 || this.state.customerNumber.length < 10) {
      alert("please enter a valid 10 digit mobile number");
    } else {
      alert("tagged successfully");
      this.modelCancel();
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
      <View>
        <View style={{ flexDirection: 'row', width: Device.isTablet ? deviceWidth - 20 : deviceWidth - 10, justifyContent: 'space-between', marginTop: 20 }}>
          <TextInput style={[Device.isTablet ? styles.input_tablet : styles.input_mobile, { width: deviceWidth / 1.5 }]}
            underlineColorAndroid="transparent"
            placeholder={I18n.t("INVOICE NUMBER")}
            placeholderTextColor="#6F6F6F"
            textAlignVertical="center"
            keyboardType={'default'}
            autoCapitalize="none"
            value={this.state.invoiceNumber}
            onChangeText={(text) => this.handleInvoiceNumber(text)}
          />
          <TouchableOpacity
            style={{ backgroundColor: "#ED1C24", width: Device.isTablet ? 120 : 80, height: Device.isTablet ? 55 : 45, borderRadius: 10, marginTop: 5 }}
            onPress={() => this.navigateToScanCode()} >
            <Text style={[Device.isTablet ? styles.navButtonText_tablet : styles.navButtonText_mobile, { paddingTop: Device.isTablet ? 5 : 5 }]}> {I18n.t('SCAN')} </Text>
          </TouchableOpacity>
        </View>

        <TextInput
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
        // onEndEditing={() => this.endEditing()}
        />
        <View
          style={{
            flexDirection: 'row',
          }}
        >
          <TouchableOpacity
            style={[Device.isTablet ? styles.signInButton_tablet : styles.signInButton_mobile, { borderRadius: Device.isTablet ? 10 : 5, height: Device.isTablet ? 46 : 36, borderWidth: Device.isTablet ? 2 : 1, borderColor: '#858585' }]}
            onPress={this.searchInvoice}
          >
            <Text
              style={[Device.isTablet ? styles.signInButtonText_tablet : styles.signInButtonText_mobile]}
            >
              {I18n.t("SEARCH")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[Device.isTablet ? styles.cancelButton_tablet : styles.cancelButton_mobile, { borderRadius: Device.isTablet ? 10 : 5, height: Device.isTablet ? 46 : 36, borderWidth: Device.isTablet ? 2 : 1, borderColor: '#858585' }]}
            onPress={this.handleCutomerTagging}
          >
            <Text
              style={Device.isTablet ? styles.cancelButtonText_tablet : styles.cancelButtonText_mobile}
            >
              {I18n.t("CUSTOMER TAGGING")}
            </Text>
          </TouchableOpacity>
        </View>
        {this.state.customerTagging && (
          <View>
            <Modal style={{ margin: 0 }} isVisible={this.state.modelVisible}>
              <View style={[Device.isTablet ? styles.filterMainContainer_tablet : styles.filterMainContainer_mobile, { height: Device.isTablet ? 400 : 320, marginTop: Device.isTablet ? deviceheight - 400 : deviceheight - 320, paddingBottom: Device.isTablet ? 0 : 20 }]}>
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
                    // keyboardType={'default'}
                    maxLength={10}
                    keyboardType={'numeric'}
                    autoCapitalize="none"
                    value={this.state.customerNumber}
                    onChangeText={(text) => this.handleCustomerNumber(text)}
                  />
                  <TouchableOpacity
                    style={[Device.isTablet ? styles.filterApplyButton_tablet : styles.filterApplyButton_mobile]}
                    onPress={() => this.customerTag()}
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
        {this.state.itemsReturn && (
          <View>
            <Text style={Device.isTablet ? styles.headerText_tablet : styles.hederText_mobile}>{I18n.t("List Of Items For Return")}</Text>
            <FlatList
              style={{ marginTop: 20, marginBottom: 20 }}
              data={this.state.returnInvoice}
              scrollEnabled={true}
              renderItem={({ item, index }) => (
                <View>
                  <View style={Device.isTablet ? flats.flatlistContainer_tablet : flats.flatlistContainer_mobile} >
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
                  </View>
                  {/* <View style={Device.isTablet ? flats.flatlistSubContainerTotal_tablet : flats.flatlistSubContainerTotal_mobile} >
                                <View style={Device.isTablet ? flats.flatlistSubContainerTotal_tablet : flats.flatlistSubContainerTotal_mobile}>
                                    <View style={flats.text}>
                                        <Text style={Device.isTablet ? flats.flatlistTextCommon_tablet : flats.flatlistTextCommon_mobile}>ITEMS: {this.state.returnInvoice.length}</Text>
                                        <Text style={Device.isTablet ? flats.flatlistTextCommon_tablet : flats.flatlistTextCommon_mobile}>QTY: {this.state.quantity}</Text>
                                        <Text style={Device.isTablet ? flats.flatlistTextCommon_tablet : flats.flatlistTextCommon_mobile}>N/RATE: {this.state.netValue}</Text>
                                    </View>
                                    <View style={flats.text}>
                                        <Text style={Device.isTablet ? flats.flatlistTextCommon_tablet : flats.flatlistTextCommon_mobile}>DISCOUNT: {"0"}</Text>
                                        <Text style={Device.isTablet ? flats.flatlistTextAccent_tablet : flats.flatlistTextAccent_mobile}>VALUE: {this.state.netValue}</Text>
                                    </View>
                                </View>
                            </View> */}
                </View>
              )}
            />
            <Text style={Device.isTablet ? styles.headerText_tablet : styles.hederText_mobile}>{I18n.t("Return summary")}</Text>
            <Text style={[Device.isTablet ? flats.flatlistTextAccent_tablet : flats.flatlistTextAccent_mobile, { marginLeft: 20 }]}>{I18n.t("RETURN AMOUNT")}: {this.state.returnSlipTotal}</Text>
            <Text style={Device.isTablet ? styles.headerText_tablet : styles.hederText_mobile}>{I18n.t("Return For Reason")} <Text style={{ color: "#ed1c24" }}>*</Text></Text>
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
            <TextInput
              style={[Device.isTablet ? styles.input_tablet : styles.input_mobile, { height: Device.isTablet ? 175 : 155, width: deviceWidth - 40 }]}
              placeholder={I18n.t('COMMENTS')}
              placeholderTextColor="#6f6f6f60"
              textAlignVertical="center"
              keyboardType={'default'}
              autoCapitalize='none'
              value={this.state.reasonDesc}
              onChangeText={(text) => this.handleReasonDesc(text)}
            />
            <TouchableOpacity
              style={[Device.isTablet ? styles.signInButton_tablet : styles.signInButton_mobile, { width: deviceWidth - 40, height: Device.isTablet ? 60 : 50 }]}
              onPress={this.generateInvoice}
            >
              <Text
                style={Device.isTablet ? styles.signInButtonText_tablet : styles.signInButtonText_mobile}
              >
                {I18n.t("GENERATE RETURN SLIP")}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {this.state.returnModel && (
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
        )}
        {this.state.resultModel && (
          <View>
            <Modal style={{ margin: 0 }} isVisible={this.state.modelVisible}>
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
    fontSize: 20,
    fontFamily: "bold",
    marginLeft: 10,
    marginTop: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    fontSize: 28,
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
    borderRadius: 10,
    fontWeight: 'bold',
    // marginBottom:100,
  },
  cancelButtonText_mobile: {
    color: 'black',
    alignSelf: 'center',
    fontSize: 15,
    fontFamily: "regular",
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
    fontFamily: 'regular',
    fontSize: 22,
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
    fontSize: 20,
    fontFamily: "regular",
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
});;
