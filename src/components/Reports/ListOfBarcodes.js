import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import Device from 'react-native-device-detection';
import I18n from 'react-native-i18n';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import { RF, RH, RW } from '../../Responsive';
import ReportsService from '../services/ReportsService';

var deviceWidth = Dimensions.get("window").width;
var deviceheight = Dimensions.get("window").height;

export class ListOfBarcodes extends Component {

  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      enddate: new Date(),
      startDate: "",
      endDate: "",
      fromDate: "",
      toDate: "",

      barCode: "",
      sotres: [],
      selectedStore: "",
      empId: "",
      fromPrice: "",
      toPrice: "",
      storeId: 0,
      storeName: "",
      flagViewDetail: false,
      flagdelete: false,
      modalVisible: true,
      barcode: "",
      mrp: "",
      qty: "",
      listBarcodes: []
    };
  }

  componentDidMount() {
    AsyncStorage.getItem("storeId").then((value) => {
      storeStringId = value;
      this.setState({ storeId: parseInt(storeStringId) });
      console.log(this.state.storeId);


    }).catch(() => {
      this.setState({ loading: false });
      console.log('There is error getting storeId');
      // alert('There is error getting storeId');
    });

    AsyncStorage.getItem("storeName").then((value) => {
      this.setState({ storeName: value });
      console.log(this.state.storeName);
    }).catch(() => {
      this.setState({ loading: false });
      console.log('There is error getting storeId');
      // alert('There is error getting storeId');
    });
  }


  datepickerClicked() {
    this.setState({ datepickerOpen: true });
  }

  enddatepickerClicked() {
    this.setState({ datepickerendOpen: true });
  }

  datepickerDoneClicked() {
    if (parseInt(this.state.date.getDate()) < 10 && (parseInt(this.state.date.getMonth()) < 10)) {
      this.setState({ startDate: this.state.date.getFullYear() + "-0" + (this.state.date.getMonth() + 1) + "-" + "0" + this.state.date.getDate() });
    }
    else if (parseInt(this.state.date.getDate()) < 10) {
      this.setState({ startDate: this.state.date.getFullYear() + "-" + (this.state.date.getMonth() + 1) + "-" + "0" + this.state.date.getDate() });
    }
    else if (parseInt(this.state.date.getMonth()) < 10) {
      this.setState({ startDate: this.state.date.getFullYear() + "-0" + (this.state.date.getMonth() + 1) + "-" + this.state.date.getDate() });
    }
    else {
      this.setState({ startDate: this.state.date.getFullYear() + "-" + (this.state.date.getMonth() + 1) + "-" + this.state.date.getDate() });
    }


    this.setState({ doneButtonClicked: true, datepickerOpen: false, datepickerendOpen: false });
  }

  datepickerendDoneClicked() {
    if (parseInt(this.state.enddate.getDate()) < 10 && (parseInt(this.state.enddate.getMonth()) < 10)) {
      this.setState({ endDate: this.state.enddate.getFullYear() + "-0" + (this.state.enddate.getMonth() + 1) + "-" + "0" + this.state.enddate.getDate() });
    }
    else if (parseInt(this.state.enddate.getDate()) < 10) {
      this.setState({ endDate: this.state.enddate.getFullYear() + "-" + (this.state.enddate.getMonth() + 1) + "-" + "0" + this.state.enddate.getDate() });
    }
    else if (parseInt(this.state.enddate.getMonth()) < 10) {
      this.setState({ endDate: this.state.enddate.getFullYear() + "-0" + (this.state.enddate.getMonth() + 1) + "-" + this.state.enddate.getDate() });
    }
    else {
      this.setState({ endDate: this.state.enddate.getFullYear() + "-" + (this.state.enddate.getMonth() + 1) + "-" + this.state.enddate.getDate() });
    }
    this.setState({ enddoneButtonClicked: true, datepickerOpen: false, datepickerendOpen: false });
  }

  datepickerCancelClicked() {
    this.setState({ date: new Date(), enddate: new Date(), datepickerOpen: false, datepickerendOpen: false });
  }

  handleSelectStores = (value) => {
    this.setState({ selectedStore: value });
  };

  handleBarCode = (value) => {
    this.setState({ barCode: value });
  };

  handleEmpId = (value) => {
    this.setState({ empId: value });
  };

  handleFromPrice = (value) => {
    this.setState({ fromPrice: value });
  };

  handleToPrice = (value) => {
    this.setState({ toPrice: value });
  };

  applyListBarcodes() {
    if (this.state.startDate === "") {
      this.state.startDate = null;
    }
    if (this.state.endDate === "") {
      this.state.endDate = null;
    }
    if (this.state.barCode === "") {
      this.state.barCode = null;
    }
    if (this.state.empId === "") {
      this.state.empId = null;
    }
    if (this.state.fromPrice === "") {
      this.state.fromPrice = null;
    }
    if (this.state.toPrice === "") {
      this.state.toPrice = null;
    }

    const obj = {
      "fromDate": this.state.startDate,
      "toDate": this.state.endDate,
      barcodeTextileId: null,
      barcode: this.state.barCode,
      storeId: this.state.storeId,
      empId: this.state.empId,
      itemMrpLessThan: this.state.fromPrice,
      itemMrpGreaterThan: this.state.toPrice,
    };
    console.log('params are' + JSON.stringify(obj));
    let pageNumber = 0
    ReportsService.getListOfBarcodes(obj, pageNumber).then((res) => {
      console.log(res.data);
      if (res.data && res.data["isSuccess"] === "true") {
        if (res.data.result.length !== 0) {
          this.props.childParamlistBarcodes(res.data.result);
          this.props.filterActiveCallback();
          this.props.modelCancelCallback();
        } else {
          alert("records not found");
        }
      }
      else {
        alert(res.data.message);
        this.props.modelCancelCallback();
      }
    }
    ).catch(() => {
      this.setState({ loading: false });
      alert('No Results Found');
      this.props.modelCancelCallback();
    });
  }

  modelCancel() {
    this.props.modelCancelCallback();
  }

  estimationModelCancel() {
    this.setState({ modalVisible: false });
  }

  handledeleteBarcode() {
    this.setState({ flagdelete: true, modalVisible: true, flagViewDetail: false });
  }

  handleviewBarcode(item, index) {
    this.setState({ barcode: item.barcode, mrp: item.itemMrp, qty: item.qty });
    this.setState({ flagViewDetail: true, modalVisible: true, flagdelete: false });
  }

  render() {
    return (
      <View>
        <FlatList
          data={this.props.listBarcodes}
          style={{ marginTop: RH(20) }}
          scrollEnabled={true}
          keyExtractor={(item, i) => i.toString()}
          ListEmptyComponent={<Text style={{ fontSize: Device.isTablet ? RF(21) : RF(17), fontFamily: 'bold', color: '#000000', textAlign: 'center', marginTop: deviceheight / 3 }}>&#9888; {I18n.t("Results not loaded")}</Text>}
          renderItem={({ item, index }) => (
            <View style={Device.isTablet ? flats.flatlistContainer_tablet : flats.flatlistContainer_mobile} >
              <View style={Device.isTablet ? flats.flatlistSubContainer_tablet : flats.flatlistSubContainer_mobile}>
                <View style={flats.text}>
                  <Text style={Device.isTablet ? flats.flatlistTextAccent_tablet : flats.flatlistTextAccent_mobile} >SNO: {index + 1} </Text>
                  <Text style={Device.isTablet ? flats.flatlistText_tablet : flats.flatlistText_mobile}>{I18n.t("BARCODE")}: {"\n"} {item.barcode}</Text>
                  <Text style={Device.isTablet ? flats.flatlistTextCommon_tablet : flats.flatlistTextCommon_mobile}>{I18n.t("BARCODE STORE")}: {"\n"}{this.state.storeName} </Text>
                </View>
                <View style={flats.text}>
                  <Text style={Device.isTablet ? flats.flatlistTextCommon_tablet : flats.flatlistTextCommon_mobile} >{I18n.t("EMP ID")}: {"\n"}{item.empId} </Text>
                  <Text style={Device.isTablet ? flats.flatlistTextCommon_tablet : flats.flatlistTextCommon_mobile}>QTY: {"\n"} {item.qty}</Text>
                  <Text style={Device.isTablet ? flats.flatlistTextCommon_tablet : flats.flatlistTextCommon_mobile}>{I18n.t("BARCODE MRP")}: {"\n"} {item.itemMrp}</Text>
                  <View style={flats.buttons}>

                    {/* <TouchableOpacity style={Device.isTablet ? flats.editButton_tablet : flats.editButton_mobile} onPress={() => this.handledeleteBarcode(item, index)}>
                                            <Image style={{ alignSelf: 'center', top: 5, height: Device.isTablet ? 30 : 20, width: Device.isTablet ? 30 : 20 }} source={require('../assets/images/delete.png')} />
                                        </TouchableOpacity> */}

                  </View>
                </View>
                <View style={{ marginRight: Device.isTablet ? RW(30) : RW(20) }}>
                  <TouchableOpacity style={Device.isTablet ? flats.deleteButton_tablet : flats.deleteButton_mobile} onPress={() => this.handleviewBarcode(item, index)}>
                    <Image style={{ alignSelf: 'center', top: 5 }} source={require('../assets/images/eye.png')} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />

        {this.props.flagFilterListBarcodes && (
          <View>
            <Modal style={{ margin: 0 }} isVisible={this.props.modalVisible}>
              <View style={styles.filterMainContainer} >
                <View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: RH(5), height: Device.isTablet ? RW(60) : RW(50) }}>
                    <View>
                      <Text style={{ marginTop: RH(15), fontSize: Device.isTablet ? RF(22) : RF(17), marginLeft: RW(20) }} > {I18n.t("Filter By")} </Text>
                    </View>
                    <View>
                      <TouchableOpacity style={{ width: Device.isTablet ? RW(60) : RW(50), height: Device.isTablet ? RH(60) : RH(50), marginTop: Device.isTablet ? RH(20) : RH(15), }} onPress={() => this.modelCancel()}>
                        <Image style={{ margin: RH(5) }} source={require('../assets/images/modelcancel.png')} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={{
                    height: Device.isTablet ? 2 : 1,
                    width: deviceWidth,
                    backgroundColor: 'lightgray',
                  }}></Text>
                </View>
                <KeyboardAwareScrollView enableOnAndroid={true} >
                  <TouchableOpacity
                    style={Device.isTablet ? styles.filterDateButton_tablet : styles.filterDateButton_mobile}
                    testID="openModal"
                    onPress={() => this.datepickerClicked()}
                  >
                    <Text
                      style={Device.isTablet ? styles.filterDateButtonText_tablet : styles.filterDateButtonText_mobile}
                    >{this.state.startDate == "" ? 'START DATE' : this.state.startDate}</Text>
                    <Image style={{ position: 'absolute', top: RH(10), right: 0, }} source={require('../assets/images/calender.png')} />
                  </TouchableOpacity>
                  {this.state.datepickerOpen && (
                    <View style={{ height: RH(280), width: deviceWidth, backgroundColor: '#ffffff' }}>
                      <TouchableOpacity
                        style={Device.isTablet ? styles.datePickerButton_tablet : styles.datePickerButton_mobile} onPress={() => this.datepickerCancelClicked()}
                      >
                        <Text style={Device.isTablet ? styles.datePickerButtonText_tablet : styles.datePickerButtonText_mobile}  > Cancel </Text>

                      </TouchableOpacity>
                      <TouchableOpacity
                        style={Device.isTablet ? styles.datePickerEndButton_tablet : styles.datePickerEndButton_mobile} onPress={() => this.datepickerDoneClicked()}
                      >
                        <Text style={Device.isTablet ? styles.datePickerButtonText_tablet : styles.datePickerButtonText_mobile}  > Done </Text>

                      </TouchableOpacity>
                      <DatePicker style={{ width: deviceWidth, height: RH(200), marginTop: RH(50), }}
                        date={this.state.date}
                        mode={'date'}
                        onDateChange={(date) => this.setState({ date })}
                      />
                    </View>
                  )}
                  <TouchableOpacity
                    style={Device.isTablet ? styles.filterDateButton_tablet : styles.filterDateButton_mobile}
                    testID="openModal"
                    onPress={() => this.enddatepickerClicked()}
                  >
                    <Text
                      style={Device.isTablet ? styles.filterDateButtonText_tablet : styles.filterDateButtonText_mobile}
                    >{this.state.endDate == "" ? 'END DATE' : this.state.endDate}</Text>
                    <Image style={{ position: 'absolute', top: RH(10), right: 0, }} source={require('../assets/images/calender.png')} />
                  </TouchableOpacity>
                  {this.state.datepickerendOpen && (
                    <View style={{ height: RH(280), width: deviceWidth, backgroundColor: '#ffffff' }}>
                      <TouchableOpacity
                        style={Device.isTablet ? styles.datePickerButton_tablet : styles.datePickerButton_mobile} onPress={() => this.datepickerCancelClicked()}
                      >
                        <Text style={Device.isTablet ? styles.datePickerButtonText_tablet : styles.datePickerButtonText_mobile}  > Cancel </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={Device.isTablet ? styles.datePickerEndButton_tablet : styles.datePickerEndButton_mobile} onPress={() => this.datepickerendDoneClicked()}
                      >
                        <Text style={Device.isTablet ? styles.datePickerButtonText_tablet : styles.datePickerButtonText_mobile}  > Done </Text>

                      </TouchableOpacity>
                      <DatePicker style={{ width: deviceWidth, height: RH(200), marginTop: RH(50), }}
                        date={this.state.enddate}
                        mode={'date'}
                        onDateChange={(enddate) => this.setState({ enddate })}
                      />
                    </View>
                  )}
                  <TextInput
                    style={[Device.isTablet ? styles.input_tablet : styles.input_mobile, { width: deviceWidth - RW(40) }]}
                    underlineColorAndroid="transparent"
                    placeholder={I18n.t("BARCODE")}
                    placeholderTextColor="#6F6F6F"
                    textAlignVertical="center"
                    autoCapitalize="none"
                    value={this.state.barCode}
                    onChangeText={this.handleBarCode}
                  />
                  {/* <View style={Device.isTablet ? styles.rnSelectContainer_tablet : styles.rnSelectContainer_mobile}>
                                        <RNPickerSelect
                                            style={Device.isTablet ? styles.rnSelect_tablet : styles.rnSelect_mobile}
                                            placeholder={{
                                                label: 'SELECT STORE'
                                            }}
                                            Icon={() => {
                                                return <Chevron style={styles.imagealign} size={1.5} color="gray" />;
                                            }}
                                            items={this.state.sotres}
                                            onValueChange={this.handleSelectStores}
                                            style={Device.isTablet ? pickerSelectStyles_tablet : pickerSelectStyles_mobile}
                                            value={this.state.selectedStore}
                                            useNativeAndroidPickerStyle={false}
                                        />
                                    </View> */}
                  <TextInput
                    style={[Device.isTablet ? styles.input_tablet : styles.input_mobile, { width: deviceWidth - RW(40) }]}
                    underlineColorAndroid="transparent"
                    placeholder={I18n.t("EMP ID")}
                    placeholderTextColor="#6F6F6F"
                    textAlignVertical="center"
                    autoCapitalize="none"
                    value={this.state.empId}
                    onChangeText={this.handleEmpId}
                  />
                  <TextInput
                    style={[Device.isTablet ? styles.input_tablet : styles.input_mobile, { width: deviceWidth - RW(40) }]}
                    underlineColorAndroid="transparent"
                    placeholder={I18n.t("PRICE <")}
                    placeholderTextColor="#6F6F6F"
                    textAlignVertical="center"
                    autoCapitalize="none"
                    value={this.state.fromPrice}
                    onChangeText={this.handleFromPrice}
                  />
                  <TextInput
                    style={[Device.isTablet ? styles.input_tablet : styles.input_mobile, { width: deviceWidth - RW(40) }]}
                    underlineColorAndroid="transparent"
                    placeholder={I18n.t("PRICE >")}
                    placeholderTextColor="#6F6F6F"
                    textAlignVertical="center"
                    autoCapitalize="none"
                    value={this.state.toPrice}
                    onChangeText={this.handleToPrice}
                  />
                  <TouchableOpacity style={Device.isTablet ? styles.filterApplyButton_tablet : styles.filterApplyButton_mobile}
                    onPress={() => this.applyListBarcodes()}>
                    <Text style={Device.isTablet ? styles.filterButtonText_tablet : styles.filterButtonText_mobile} >{I18n.t("APPLY")}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={Device.isTablet ? styles.filterCancelButton_tablet : styles.filterCancelButton_mobile}
                    onPress={() => this.modelCancel()}>
                    <Text style={Device.isTablet ? styles.filterButtonCancelText_tablet : styles.filterButtonCancelText_mobile}>{I18n.t("CANCEL")}</Text>
                  </TouchableOpacity>
                </KeyboardAwareScrollView>
              </View>
            </Modal>
          </View>
        )}

        {this.state.flagViewDetail && (
          <View>
            <Modal style={{ margin: 0 }} isVisible={this.state.modalVisible}>
              <View style={[styles.filterMainContainer, { height: Device.isTablet ? RH(400) : RH(300), marginTop: Device.isTablet ? deviceheight - RH(400) : deviceheight - RH(350), backgroundColor: '#00a9a9' }]}>
                <View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: RH(5), height: Device.isTablet ? RH(60) : RH(50) }}>
                    <View>
                      <Text style={{ marginTop: RH(15), fontSize: Device.isTablet ? RF(22) : RF(17), marginLeft: Device.isTablet ? 10 : 5, color: '#ffffff' }} > {I18n.t("Barcode Details")} </Text>
                    </View>
                    <View>
                      <TouchableOpacity style={{ width: Device.isTablet ? RW(60) : RW(50), height: Device.isTablet ? (60) : 50, marginTop: Device.isTablet ? RH(20) : RH(15), }} onPress={() => this.estimationModelCancel()}>
                        <Image style={{ margin: 5, height: Device.isTablet ? RH(20) : RH(15), width: Device.isTablet ? RW(20) : RW(15), }} source={require('../assets/images/modalCloseWhite.png')} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={{
                    height: Device.isTablet ? 2 : 1,
                    width: deviceWidth,
                    backgroundColor: 'lightgray',
                  }}></Text>
                </View>
                <View style={{ backgroundColor: '#ffffff', height: Device.isTablet ? RH(350) : RH(300) }}>
                  <View style={{ flexDirection: 'column', justifyContent: 'space-around', paddingRight: Device.isTablet ? RW(20) : RW(20), paddingLeft: Device.isTablet ? RW(20) : 0, height: Device.isTablet ? RH(310) : RH(250) }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: Device.isTablet ? 0 : RW(10), paddingLeft: Device.isTablet ? 0 : RW(10) }}>
                      <Text style={styles.viewText} >
                        {I18n.t("BARCODE")}:  </Text>
                      <Text style={[styles.viewSubText, { color: '#00a9a9', fontFamily: 'medium' }]} selectable={true}>
                        {this.state.barcode} </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: Device.isTablet ? 0 : RW(10), paddingLeft: Device.isTablet ? 0 : RW(10) }}>
                      <Text style={styles.viewText} >
                        MRP:  </Text>
                      <Text style={styles.viewSubText} >
                        {this.state.mrp} </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: Device.isTablet ? 0 : RW(10), paddingLeft: Device.isTablet ? 0 : RW(10) }}>
                      <Text style={styles.viewText} >
                        {I18n.t("STORE")}:  </Text>
                      <Text style={styles.viewSubText} >
                        {this.state.storeName} </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: Device.isTablet ? 0 : RW(10), paddingLeft: Device.isTablet ? 0 : RW(10) }}>
                      <Text style={styles.viewText} >
                        QTY:  </Text>
                      <Text style={styles.viewSubText} >
                        ₹ {this.state.qty} </Text>
                    </View>
                    <View>
                      <TouchableOpacity
                        style={[Device.isTablet ? styles.filterCancel_tablet : styles.filterCancel_mobile, { borderColor: '#00a9a9' }]} onPress={() => this.estimationModelCancel()}
                      >
                        <Text style={[Device.isTablet ? styles.filterButtonCancelText_tablet : styles.filterButtonCancelText_mobile, { color: '#00a9a9' }]}  > {I18n.t("CANCEL")} </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        )}

      </View>
    );
  }
}



const pickerSelectStyles_mobile = StyleSheet.create({
  placeholder: {
    color: "#6F6F6F",
    fontFamily: "regular",
    fontSize: RF(15),
  },
  inputIOS: {
    justifyContent: 'center',
    height: 42,
    borderRadius: 3,
    borderWidth: Device.isTablet ? 2 : 1,
    fontFamily: 'regular',
    //paddingLeft: -20,
    fontSize: RF(15),
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
    fontSize: RF(15),
    borderColor: '#FBFBFB',
    backgroundColor: '#FBFBFB',
    color: '#001B4A',

    // marginLeft: RW(20),
    // marginRight: RW(20),
    // margintop: RH(10),
    // height: RH(40),
    // backgroundColor: '#ffffff',
    // borderBottomColor: '#456CAF55',
    // color: '#001B4A',
    // fontFamily: "bold",
    // fontSize: RF(16),
    // borderRadius: 3,
  },
});

const pickerSelectStyles_tablet = StyleSheet.create({
  placeholder: {
    color: "#6F6F6F",
    fontFamily: "regular",
    fontSize: RF(20),
  },
  inputIOS: {
    justifyContent: 'center',
    height: 52,
    borderRadius: 3,
    borderWidth: Device.isTablet ? 2 : 1,
    fontFamily: 'regular',
    //paddingLeft: -20,
    fontSize: RF(20),
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
    fontSize: RF(20),
    borderColor: '#FBFBFB',
    backgroundColor: '#FBFBFB',
    color: '#001B4A',

    // marginLeft: RW(20),
    // marginRight: RW(20),
    // margintop: RH(10),
    // height: RH(40),
    // backgroundColor: '#ffffff',
    // borderBottomColor: '#456CAF55',
    // color: '#001B4A',
    // fontFamily: "bold",
    // fontSize: RF(16),
    // borderRadius: 3,
  },
});


const styles = StyleSheet.create({

  imagealign: {
    marginTop: Device.isTablet ? RH(25) : RH(20),
    marginRight: Device.isTablet ? RW(30) : RW(20),
  },
  filterByClsoeButton: {
    position: 'absolute',
    top: RH(10),
    right: Device.isTablet ? RW(24) : RW(14),
    width: Device.isTablet ? RW(60) : RW(50),
    height: Device.isTablet ? RH(60) : RH(50),
  },
  modelCloseImage: {
    fontFamily: 'regular',
    fontSize: RF(12),
    position: 'absolute',
    top: RH(10),
    right: Device.isTablet ? RW(15) : RW(10),
  },
  deleteMainContainer: {
    marginLeft: -RW(40),
    marginRight: -RW(40),
    backgroundColor: '#ffffff',
    paddingLeft: Device.isTablet ? 0 : RW(20),
    marginTop: Device.isTablet ? deviceheight - RH(350) : deviceheight - RH(240),
    height: Device.isTablet ? RH(350) : RH(240),
  },
  filterMainContainer: {
    // marginLeft: -RW(40),
    // marginRight: -40,
    // paddingLeft: Device.isTablet ? 0 : 20,
    backgroundColor: '#ffffff',
    marginTop: Device.isTablet ? deviceheight - RH(670) : deviceheight - RH(570),
    height: Device.isTablet ? RH(670) : RH(570),
  },
  viewText: {
    fontSize: Device.isTablet ? RF(22) : RF(17),
    fontFamily: 'bold',
    color: "#353C40"
  },
  viewSubText: {
    fontSize: Device.isTablet ? RF(22) : RF(17),
    fontFamily: 'regular',
    color: "#353C40"
  },

  //////////////
  filterCancel_mobile: {
    width: deviceWidth - RW(40),
    marginLeft: RW(20),
    height: RH(50),
    backgroundColor: "#ffffff",
    borderRadius: 5,
    borderWidth: Device.isTablet ? 2 : 1,
    borderColor: "#353C4050",
  },
  viewtext_tablet: {
    color: "#353C40",
    fontFamily: "regular",
    alignItems: 'center',
    left: RW(10),
    fontSize: RF(22),
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute', top: RH(80),
  },
  viewtext_mobile: {
    color: "#353C40",
    fontFamily: "regular",
    alignItems: 'center',
    left: RW(10),
    fontSize: RF(14),
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute', top: RH(60),
  },
  viewsubtext_tablet: {
    color: "#353C40",
    fontFamily: "bold",
    alignItems: 'center',
    marginLeft: RW(16),
    fontSize: RF(22),
    position: 'absolute',
    right: RW(10),
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute',
    top: RH(80),
  },
  viewsubtext_mobile: {
    color: "#353C40",
    fontFamily: "bold",
    alignItems: 'center',
    marginLeft: RW(16),
    fontSize: RF(14),
    position: 'absolute',
    right: RW(10),
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute',
    top: RH(60),
  },

  viewtext1_tablet: {
    color: "#353C40",
    fontFamily: "regular",
    alignItems: 'center',
    left: RW(10),
    fontSize: RF(22),
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute', top: RH(110),

  },
  viewsubtext1_tablet: {
    color: "#353C40",
    fontFamily: "bold",
    alignItems: 'center',
    marginLeft: RW(16),
    fontSize: RF(22),
    position: 'absolute',
    right: RW(10),
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute',
    top: RH(110),
  },

  viewtext1_mobile: {
    color: "#353C40",
    fontFamily: "regular",
    alignItems: 'center',
    left: RW(10),
    fontSize: RF(14),
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute', top: RH(90),
  },

  viewsubtext1_mobile: {
    color: "#353C40",
    fontFamily: "bold",
    alignItems: 'center',
    marginLeft: RW(16),
    fontSize: RF(14),
    position: 'absolute',
    right: RW(10),
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute',
    top: RH(90),
  },
  viewtext2_tablet: {
    color: "#353C40",
    fontFamily: "regular",
    alignItems: 'center',
    left: RW(10),
    fontSize: RF(22),
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute', top: RH(140),

  },
  viewsubtext2_tablet: {
    color: "#353C40",
    fontFamily: "bold",
    alignItems: 'center',
    marginLeft: RW(16),
    fontSize: RF(22),
    position: 'absolute',
    right: RW(10),
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute',
    top: RH(140),
  },

  viewtext2_mobile: {
    color: "#353C40",
    fontFamily: "regular",
    alignItems: 'center',
    left: RW(10),
    fontSize: RF(14),
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute', top: RH(120),
  },

  viewsubtext2_mobile: {
    color: "#353C40",
    fontFamily: "bold",
    alignItems: 'center',
    marginLeft: RW(16),
    fontSize: RF(14),
    position: 'absolute',
    right: RW(10),
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute',
    top: RH(120),
  },
  viewtext3_tablet: {
    color: "#353C40",
    fontFamily: "regular",
    alignItems: 'center',
    left: RW(10),
    fontSize: RF(22),
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute', top: RH(170),

  },
  viewsubtext3_tablet: {
    color: "#353C40",
    fontFamily: "bold",
    alignItems: 'center',
    marginLeft: RW(16),
    fontSize: RF(22),
    position: 'absolute',
    right: RW(10),
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute',
    top: RH(170),
  },

  viewtext3_mobile: {
    color: "#353C40",
    fontFamily: "regular",
    alignItems: 'center',
    left: RW(10),
    fontSize: RF(14),
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute', top: RH(150),
  },

  viewsubtext3_mobile: {
    color: "#353C40",
    fontFamily: "bold",
    alignItems: 'center',
    marginLeft: RW(16),
    fontSize: RF(14),
    position: 'absolute',
    right: RW(10),
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute',
    top: RH(150),
  },
  viewtext4_tablet: {
    color: "#353C40",
    fontFamily: "regular",
    alignItems: 'center',
    left: RW(10),
    fontSize: RF(22),
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute', top: RH(200),

  },
  viewsubtext4_tablet: {
    color: "#353C40",
    fontFamily: "bold",
    alignItems: 'center',
    marginLeft: RW(16),
    fontSize: RF(22),
    position: 'absolute',
    right: RW(10),
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute',
    top: RH(200),
  },

  viewtext4_mobile: {
    color: "#353C40",
    fontFamily: "regular",
    alignItems: 'center',
    left: RW(10),
    fontSize: RF(14),
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute', top: RH(180),
  },

  viewsubtext4_mobile: {
    color: "#353C40",
    fontFamily: "bold",
    alignItems: 'center',
    marginLeft: RW(16),
    fontSize: RF(14),
    position: 'absolute',
    right: RW(10),
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute',
    top: RH(180),
  },
  viewtext5_tablet: {
    color: "#353C40",
    fontFamily: "regular",
    alignItems: 'center',
    left: RW(10),
    fontSize: RF(22),
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute', top: RH(230),

  },
  viewsubtext5_tablet: {
    color: "#353C40",
    fontFamily: "bold",
    alignItems: 'center',
    marginLeft: RW(16),
    fontSize: RF(22),
    position: 'absolute',
    right: RW(10),
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute',
    top: RH(230),
  },

  viewtext5_mobile: {
    color: "#353C40",
    fontFamily: "regular",
    alignItems: 'center',
    left: RW(10),
    fontSize: RF(14),
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute', top: RH(210),
  },

  viewsubtext5_mobile: {
    color: "#353C40",
    fontFamily: "bold",
    alignItems: 'center',
    marginLeft: RW(16),
    fontSize: RF(14),
    position: 'absolute',
    right: RW(10),
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute',
    top: RH(210),
  },
  filterCancel_tablet: {
    width: deviceWidth - RW(40),
    height: RH(60),
    backgroundColor: "#ffffff",
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#353C4050",
  },
  ////////

  // Styles For Mobile

  filterMainContainer_mobile: {
    width: deviceWidth,
    alignItems: 'center',
    marginLeft: -RW(20),
    backgroundColor: "#ffffff",
    height: RH(600),
    position: 'absolute',
    bottom: -RH(20),
  },
  filterByTitle_mobile: {
    position: 'absolute',
    left: RW(20),
    top: RH(15),
    width: RW(300),
    height: RH(20),
    fontFamily: 'medium',
    fontSize: RF(16),
    color: '#353C40'
  },
  filterByTitleDecoration_mobile: {
    height: Device.isTablet ? 2 : 1,
    width: deviceWidth,
    backgroundColor: 'lightgray',
    marginTop: RH(50),
  },
  filterCloseButton_mobile: {
    position: 'absolute',
    right: RW(8),
    top: RH(15),
    width: RW(50), height: RH(50),
  },
  filterDateButton_mobile: {
    width: deviceWidth - RW(40),
    marginTop: RH(5),
    marginBottom: RH(10),
    marginLeft: RW(20),
    marginRight: RW(20),
    paddingLeft: RW(15),
    borderColor: '#8F9EB717',
    borderRadius: 3,
    height: RH(50),
    backgroundColor: "#F6F6F6",
    borderRadius: 5,
  },
  filterDateButtonText_mobile: {
    marginLeft: RW(16),
    marginTop: RH(20),
    color: "#6F6F6F",
    fontSize: RF(15),
    fontFamily: "regular"
  },
  datePickerContainer_mobile: {
    height: RH(280),
    width: deviceWidth,
    backgroundColor: '#ffffff'
  },
  datePickerButton_mobile: {
    position: 'absolute',
    left: RW(20),
    top: RH(10),
    height: RH(30),
    backgroundColor: "#ED1C24",
    borderRadius: 5,
  },
  datePickerEndButton_mobile: {
    position: 'absolute',
    right: RW(20),
    top: RH(10),
    height: RH(30),
    backgroundColor: "#ED1C24",
    borderRadius: 5,
  },
  datePickerButtonText_mobile: {
    textAlign: 'center',
    marginTop: RH(5),
    color: "#ffffff",
    fontSize: RF(15),
    fontFamily: "regular"
  },
  input_mobile: {
    justifyContent: 'center',
    marginLeft: RW(20),
    marginRight: RW(20),
    height: RH(44),
    marginTop: RH(5),
    marginBottom: RH(10),
    borderColor: '#8F9EB717',
    borderRadius: 3,
    backgroundColor: '#FBFBFB',
    borderWidth: Device.isTablet ? 2 : 1,
    fontFamily: 'regular',
    paddingLeft: RW(15),
    fontSize: RF(14),
  },
  filterCloseImage_mobile: {
    color: '#ED1C24',
    fontFamily: 'regular',
    fontSize: RF(12),
    position: 'absolute',
    top: RH(10),
    right: 0,
  },
  filterApplyButton_mobile: {
    width: deviceWidth - RW(40),
    marginLeft: RW(20),
    marginRight: RW(20),
    marginTop: RH(20),
    height: RH(50),
    backgroundColor: "#ED1C24",
    borderRadius: 5,
  },
  filterButtonText_mobile: {
    textAlign: 'center',
    marginTop: RH(20),
    color: "#ffffff",
    fontSize: RF(15),
    fontFamily: "regular"
  },
  filterCancelButton_mobile: {
    width: deviceWidth - RW(40),
    marginLeft: RW(20),
    marginRight: RW(20),
    marginTop: RH(20),
    height: RH(50),
    backgroundColor: "#ffffff",
    borderRadius: 5,
    borderWidth: Device.isTablet ? 2 : 1,
    borderColor: "#353C4050",
  },
  filterButtonCancelText_mobile: {
    textAlign: 'center',
    marginTop: RH(20),
    color: "#000000",
    fontSize: RF(15),
    fontFamily: "regular"
  },
  rnSelect_mobile: {
    color: '#8F9EB7',
    fontSize: RF(15)
  },
  rnSelectContainer_mobile: {
    justifyContent: 'center',
    margin: RH(20),
    height: RH(44),
    marginTop: RH(5),
    marginBottom: RH(10),
    borderColor: '#8F9EB717',
    borderRadius: 3,
    backgroundColor: '#FBFBFB',
    borderWidth: Device.isTablet ? 2 : 1,
    fontFamily: 'regular',
    paddingLeft: RW(15),
    fontSize: RF(14),
  },

  // Styles For Tablet
  filterMainContainer_tablet: {
    width: deviceWidth,
    alignItems: 'center',
    marginLeft: -RW(40),
    backgroundColor: "#ffffff",
    height: RH(670),
    position: 'absolute',
    bottom: -RH(40),
  },
  filterByTitle_tablet: {
    position: 'absolute',
    left: RW(20),
    top: RH(15),
    width: RW(300),
    height: RH(30),
    fontFamily: 'medium',
    fontSize: RF(21),
    color: '#353C40'
  },
  filterByTitleDecoration_tablet: {
    height: Device.isTablet ? 2 : 1,
    width: deviceWidth,
    backgroundColor: 'lightgray',
    marginTop: RH(60),
  },
  input_tablet: {
    justifyContent: 'center',
    marginLeft: RW(20),
    marginRight: RW(20),
    height: RH(54),
    marginTop: RH(5),
    marginBottom: RH(10),
    borderColor: '#8F9EB717',
    borderRadius: 3,
    backgroundColor: '#FBFBFB',
    borderWidth: Device.isTablet ? 2 : 1,
    fontFamily: 'regular',
    paddingLeft: RW(15),
    fontSize: RF(20),
  },
  filterCloseButton_tablet: {
    position: 'absolute',
    right: RW(24),
    top: RH(10),
    width: RW(60), height: RH(60),
  },
  filterCloseImage_tablet: {
    color: '#ED1C24',
    fontFamily: 'regular',
    fontSize: RF(17),
    position: 'absolute',
    top: RH(10),
    right: RW(24),
  },
  filterApplyButton_tablet: {
    width: deviceWidth - RW(40),
    marginLeft: RW(20),
    marginRight: RW(20),
    marginTop: RH(20),
    height: RH(60),
    backgroundColor: "#ED1C24",
    borderRadius: 5,
  },
  filterButtonText_tablet: {
    textAlign: 'center',
    marginTop: RH(20),
    color: "#ffffff",
    fontSize: RF(20),
    fontFamily: "regular"
  },
  filterCancelButton_tablet: {
    width: deviceWidth - RW(40),
    marginLeft: RW(20),
    marginRight: RW(20),
    marginTop: RH(20),
    height: RH(60),
    backgroundColor: "#ffffff",
    borderRadius: 5,
    borderWidth: Device.isTablet ? 2 : 1,
    borderColor: "#353C4050",
  },
  filterButtonCancelText_tablet: {
    textAlign: 'center',
    marginTop: RH(20),
    color: "#000000",
    fontSize: RF(20),
    fontFamily: "regular"
  },
  filterDateButton_tablet: {
    width: deviceWidth - RW(40),
    marginTop: RH(5),
    marginBottom: RH(10),
    marginLeft: RW(20),
    marginRight: RW(20),
    paddingLeft: RW(15),
    borderColor: '#8F9EB717',
    borderRadius: 3,
    height: RH(60),
    backgroundColor: "#F6F6F6",
    borderRadius: 5,
  },
  filterDateButtonText_tablet: {
    marginLeft: RW(16),
    marginTop: RH(20),
    color: "#6F6F6F",
    fontSize: RF(20),
    fontFamily: "regular"
  },
  datePickerButton_tablet: {
    position: 'absolute',
    left: RW(20),
    top: RH(10),
    height: RH(40),
    backgroundColor: "#ED1C24",
    borderRadius: 5,
  },
  datePickerButtonText_tablet: {
    textAlign: 'center',
    marginTop: RH(5),
    color: "#ffffff",
    fontSize: RF(20),
    fontFamily: "regular"
  },
  datePickerEndButton_tablet: {
    position: 'absolute',
    right: RW(20),
    top: RH(10),
    height: RH(40),
    backgroundColor: "#ED1C24",
    borderRadius: 5,
  },
  rnSelect_tablet: {
    color: '#8F9EB7',
    fontSize: RF(20)
  },
  rnSelectContainer_tablet: {
    justifyContent: 'center',
    margin: RH(20),
    height: RH(54),
    marginTop: RH(5),
    marginBottom: RH(10),
    borderColor: '#8F9EB717',
    borderRadius: 3,
    backgroundColor: '#FBFBFB',
    borderWidth: Device.isTablet ? 2 : 1,
    fontFamily: 'regular',
    paddingLeft: RW(15),
    fontSize: RF(20),
  },


});



// Styles For Flat-Lists


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
    height: RH(150),
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
    paddingLeft: RW(10),
    paddingRight: 10,
    alignItems: 'center',
    height: RH(140)
  },
  flatlistTextAccent_mobile: {
    fontFamily: 'medium',
    fontSize: RF(16),
    color: '#ED1C24'
  },
  flatlistText_mobile: {
    fontFamily: 'regular',
    fontSize: RF(12),
    color: '#353c40'
  },
  flatlistTextCommon_mobile: {
    fontFamily: 'regular',
    fontSize: RF(12),
    color: '#808080'
  },
  editButton_mobile: {
    width: 30,
    height: RH(30),
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
    borderWidth: Device.isTablet ? 2 : 1,
    borderColor: "lightgray",
    // borderRadius:5,
  },
  deleteButton_mobile: {
    width: RW(30),
    height: RH(30),
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5,
    borderWidth: Device.isTablet ? 2 : 1,
    borderColor: "lightgray",
  },


  // flats for Tablet
  flatlistContainer_tablet: {
    height: RH(200),
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
    paddingLeft: RW(20),
    paddingRight: RW(20),
    alignItems: 'center',
    height: RH(160)
  },
  flatlistTextAccent_tablet: {
    fontFamily: 'medium',
    fontSize: RF(21),
    color: '#ED1C24'
  },
  flatlistText_tablet: {
    fontFamily: 'regular',
    fontSize: RF(21),
    color: '#353c40'
  },
  flatlistTextCommon_tablet: {
    fontFamily: 'regular',
    fontSize: RF(17),
    color: '#808080'
  },
  flatlstTextCommon_tablet: {
    fontFamily: 'regular',
    fontSize: RF(17),
    color: '#808080'
  },
  editButton_tablet: {
    width: RW(50),
    height: RH(50),
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
    borderWidth: Device.isTablet ? 2 : 1,
    borderColor: "lightgray",
    // borderRadius:5,
  },
  deleteButton_tablet: {
    width: RW(50),
    height: RH(50),
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5,
    borderWidth: Device.isTablet ? 2 : 1,
    borderColor: "lightgray",
  },




});
