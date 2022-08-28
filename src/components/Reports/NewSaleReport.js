import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import Device from 'react-native-device-detection';
import I18n from 'react-native-i18n';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import { Appbar } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import { Chevron } from 'react-native-shapes';
import IconFA from 'react-native-vector-icons/FontAwesome';
import ReportsService from '../services/ReportsService';
var deviceWidth = Dimensions.get("window").width;
var deviceheight = Dimensions.get("window").height;

export default class NewSaleReport extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: true,
      flagDeleteNewSale: false,
      flagFilterNewSale: false,
      date: new Date(),
      enddate: new Date(),
      startDate: "",
      endDate: "",
      fromDate: "",
      toDate: "",

      positions: [],
      billPosition: null,
      invoiceNumber: null,
      mobile: null,
      empId: null,
      sbList: [1, 2],
      sbDetailsList: [1, 2],
      isView: false,
      domainId: 0,
      storeId: 0,
      flagViewDetail: false,
      memono: "",
      barcode: "",
      section: "",
      empId: "",
      hsncode: "",
      qty: "",
      mrp: "",
      disc: "",
      taxableaount: "",
      cgst: "",
      sgst: "",
      igst: "",
      gst: "",
      netamount: "",
      customername: "",
      mobile: "",
      createdate: "",
      newSale: []
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
      //  alert('There is error getting storeId');
    });
  }

  filterAction() {
    this.setState({ flagFilterNewSale: true, modalVisible: true })
  }


  getSaleBills() {
    if (this.state.startDate === "") {
      this.state.startDate = null;
    }
    if (this.state.endDate === "") {
      this.state.endDate = null;
    }
    if (this.state.invoiceNumber === "") {
      this.state.invoiceNumber = null;
    }
    if (this.state.mobile === "") {
      this.state.mobile = null;
    }
    if (this.state.billPosition === "") {
      this.state.billPosition = null;
    }

    if (this.state.mobile !== null && this.state.mobile < 10) {
      alert("please enter a valid 10 digit mobile number");
    } else {
      const obj = {
        "dateFrom": this.state.startDate,
        "dateTo": this.state.endDate,
        invoiceNumber: this.state.invoiceNumber,
        custMobileNumber: this.state.mobile,
        billStatus: this.state.billPosition,
        storeId: this.state.storeId,
        domainId: this.state.domainId
      };
      console.log('params are' + JSON.stringify(obj));
      let pageNumber = 0
      ReportsService.newSaleReports(obj, pageNumber).then((res) => {
        console.log(res.data.result);
        if (res.data && res.data["isSuccess"] === "true") {
          if (res.data.result.length !== 0) {
            this.setState({ newSale: res.data.result.newSale.content })
            this.modelCancel()
            console.log(this.state.newSale)
          } else {
            alert("records not found");
          }
        }
        else {
          alert(res.data.message);
          this.props.filterActiveCallback();
          this.props.modelCancelCallback();
        }
      }
      ).catch(() => {
        this.setState({ loading: false });
        // alert('No Results Found');
        this.props.filterActiveCallback();
        this.props.modelCancelCallback();
      });
    }


  }


  handledeleteNewSale() {
    this.setState({ flagDeleteNewSale: true, modalVisible: true, flagViewDetail: false });
  }

  handleviewNewSale(item, index) {
    console.log(item);
    this.setState({ memono: item.invoiceNumber, barcode: item.lineItemsReVo[0].barCode, hsncode: item.lineItemsReVo[0].hsnCode, empId: item.lineItemsReVo[0].empId, qty: item.totalqQty, mrp: item.netPayableAmount, taxableaount: item.totaltaxableAmount, cgst: item.totalCgst, sgst: item.totalSgst, igst: item.totalIgst, customername: item.customerName, mobile: item.mobileNumber, createdate: item.createdDate });
    this.setState({ flagViewDetail: true, modalVisible: true, flagDeleteNewSale: false });
  }

  estimationModelCancel() {
    this.setState({ modalVisible: false });
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

  handleBillPositions = (value) => {
    this.setState({ billPosition: value });
  };

  handleInvoiceNumber = (value) => {
    this.setState({ invoiceNumber: value });
  };

  handleMobile = (value) => {
    this.setState({ mobile: value });
  };

  handleEmpId = (value) => {
    this.setState({ empId: value });
  };

  modelCancel() {
    this.setState({ modalVisible: false, flagFilterNewSale: false })
  }



  render() {
    return (
      <View>
        <Appbar>
          <Appbar.Content title="New Sale Report" />
          <IconFA
            name="sliders"
            size={25}
            onPress={() => this.filterAction()}
          ></IconFA>
        </Appbar>
        <FlatList
          data={this.state.newSale}
          style={{ marginTop: 20 }}
          scrollEnabled={true}
          keyExtractor={(item, i) => i.toString()}
          ListEmptyComponent={<Text style={{ fontSize: Device.isTablet ? 21 : 17, fontFamily: 'bold', color: '#000000', textAlign: 'center', marginTop: deviceheight / 3 }}>&#9888; {I18n.t("Results not loaded")}</Text>}
          renderItem={({ item, index }) => (
            <View style={Device.isTablet ? flats.flatlistContainer_tablet : flats.flatlistContainer_mobile} >
              <View style={Device.isTablet ? flats.flatlistSubContainer_tablet : flats.flatlistSubContainer_mobile}>
                <View style={flats.text}>
                  <Text style={Device.isTablet ? flats.flatlistTextAccent_tablet : flats.flatlistTextAccent_mobile} >S.NO: {index + 1} </Text>
                  <Text style={Device.isTablet ? flats.flatlistText_tablet : flats.flatlistText_mobile}>INVOICE NUMBER: {"\n"} {item.invoiceNumber}</Text>
                  <Text style={Device.isTablet ? flats.flatlistTextCommon_tablet : flats.flatlistTextCommon_mobile}>{I18n.t("EMP ID")}: {item.empId} </Text>
                </View>
                <View style={flats.text}>
                  <Text style={Device.isTablet ? flats.flatlistTextCommon_tablet : flats.flatlistTextCommon_mobile} >{I18n.t("INVOICE DATE")}: {"\n"} {item.createdDate} </Text>
                  <Text style={Device.isTablet ? flats.flatlistTextCommon_tablet : flats.flatlistTextCommon_mobile}>{I18n.t("BILL POSITION")}: {item.status}</Text>
                </View>

                <View style={flats.text}>
                  <Text style={Device.isTablet ? flats.flatlistTextCommon_tablet : flats.flatlistTextCommon_mobile} >{I18n.t("NET AMOUNT")}:{"\n"} ₹ {item.netPayableAmount} </Text>
                  <View style={flats.buttons}>

                    <TouchableOpacity style={Device.isTablet ? flats.editButton_tablet : flats.editButton_mobile} onPress={() => this.handledeleteNewSale(item, index)}>
                      <Image style={{ alignSelf: 'center', top: 5, height: Device.isTablet ? 30 : 20, width: Device.isTablet ? 30 : 20 }} source={require('../assets/images/delete.png')} />

                    </TouchableOpacity>

                    <TouchableOpacity style={Device.isTablet ? flats.deleteButton_tablet : flats.deleteButton_mobile} onPress={() => this.handleviewNewSale(item, index)}>
                      <Image style={{ alignSelf: 'center', top: 5 }} source={require('../assets/images/eye.png')} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}
        />
        {this.state.flagDeleteNewSale && (
          <View>
            <Modal style={{ margin: 0 }} isVisible={this.state.modalVisible}>

              <View style={[styles.deleteMainContainer, { backgroundColor: '#ED1C24' }]}>
                <View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, height: Device.isTablet ? 60 : 50 }}>
                    <View>
                      <Text style={{ marginTop: 15, fontSize: Device.isTablet ? 22 : 17, marginLeft: 20, color: '#ffffff' }} > {I18n.t("Delete New Sale")} </Text>
                    </View>
                    <View>
                      <TouchableOpacity style={{ width: Device.isTablet ? 60 : 50, height: Device.isTablet ? 60 : 50, marginTop: Device.isTablet ? 20 : 15, }} onPress={() => this.estimationModelCancel()}>
                        <Image style={{ margin: 5, height: Device.isTablet ? 20 : 15, width: Device.isTablet ? 20 : 15, }} source={require('../assets/images/modalCloseWhite.png')} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={{
                    height: Device.isTablet ? 2 : 1,
                    width: deviceWidth,
                    backgroundColor: 'lightgray',
                  }}></Text>
                </View>

                <View style={{ backgroundColor: '#ffffff', height: Device.isTablet ? 300 : 250, }}>
                  <Text style={{
                    textAlign: 'center',
                    fontFamily: 'regular',
                    fontSize: Device.isTablet ? 23 : 18,
                    color: '#353C40',
                    marginTop: 10
                  }}> {I18n.t("Are you sure want to delete New Sale Report")} ?  </Text>
                  <TouchableOpacity
                    style={[Device.isTablet ? styles.filterApplyButton_tablet : styles.filterApplyButton_mobile, { marginTop: Device.isTablet ? 55 : 25 }]} onPress={() => this.deleteEstimationSlip(item, index)}
                  >
                    <Text style={Device.isTablet ? styles.filterButtonText_tablet : styles.filterButtonText_mobile}  > {I18n.t("DELETE")} </Text>

                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[Device.isTablet ? styles.filterCancelButton_tablet : styles.filterCancelButton_mobile, { borderColor: '#ED1C24' }]} onPress={() => this.estimationModelCancel()}
                  >
                    <Text style={[Device.isTablet ? styles.filterButtonCancelText_tablet : styles.filterButtonCancelText_mobile, { color: '#ED1C24' }]}  > {I18n.t("CANCEL")} </Text>

                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        )}
        {this.state.flagFilterNewSale && (
          <View>
            <Modal style={{ margin: 0 }} isVisible={this.state.modalVisible}>
              <View style={styles.filterMainContainer} >
                <View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, height: Device.isTablet ? 60 : 50 }}>
                    <View>
                      <Text style={{ marginTop: 15, fontSize: Device.isTablet ? 22 : 17, marginLeft: 15 }} > {I18n.t("Filter By")} </Text>
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
                <KeyboardAwareScrollView enableOnAndroid={true} >
                  <TouchableOpacity
                    style={Device.isTablet ? styles.filterDateButton_tablet : styles.filterDateButton_mobile}
                    testID="openModal"
                    onPress={() => this.datepickerClicked()}
                  >
                    <Text
                      style={Device.isTablet ? styles.filterDateButtonText_tablet : styles.filterDateButtonText_mobile}
                    >{this.state.startDate == "" ? 'START DATE' : this.state.startDate}</Text>
                    <Image style={{ position: 'absolute', top: 10, right: 0, }} source={require('../assets/images/calender.png')} />
                  </TouchableOpacity>
                  {this.state.datepickerOpen && (
                    <View style={{ height: 280, width: deviceWidth, backgroundColor: '#ffffff' }}>
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
                      <DatePicker style={{ width: deviceWidth, height: 200, marginTop: 50, }}
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
                    <Image style={{ position: 'absolute', top: 10, right: 0, }} source={require('../assets/images/calender.png')} />
                  </TouchableOpacity>
                  {this.state.datepickerendOpen && (
                    <View style={{ height: 280, width: deviceWidth, backgroundColor: '#ffffff' }}>
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
                      <DatePicker style={{ width: deviceWidth, height: 200, marginTop: 50, }}
                        date={this.state.enddate}
                        mode={'date'}
                        onDateChange={(enddate) => this.setState({ enddate })}
                      />
                    </View>
                  )}
                  <View style={[Device.isTablet ? styles.rnSelectContainer_tablet : styles.rnSelectContainer_mobile, { width: deviceWidth - 40 }]}>
                    <RNPickerSelect
                      placeholder={{
                        label: 'BILL POSITION'
                      }}
                      Icon={() => {
                        return <Chevron style={styles.imagealign} size={1.5} color="gray" />;
                      }}
                      items={[
                        { label: 'New', value: 'New' },
                        { label: 'Pending', value: 'Pending' },
                        { label: 'Cancelled', value: 'Cancelled' },
                        { label: 'success', value: 'success' },
                      ]}
                      onValueChange={this.handleBillPositions}
                      style={Device.isTablet ? pickerSelectStyles_tablet : pickerSelectStyles_mobile}
                      value={this.state.billPosition}
                      useNativeAndroidPickerStyle={false}
                    />
                  </View>
                  <TextInput
                    style={[Device.isTablet ? styles.input_tablet : styles.input_mobile, { width: deviceWidth - 40 }]}
                    underlineColorAndroid="transparent"
                    placeholder={I18n.t("INVOICE NUMBER")}
                    placeholderTextColor="#6F6F6F"
                    textAlignVertical="center"
                    autoCapitalize="none"
                    value={this.state.invoiceNumber}
                    onChangeText={this.handleInvoiceNumber}
                  />
                  <TextInput
                    style={[Device.isTablet ? styles.input_tablet : styles.input_mobile, { width: deviceWidth - 40 }]}
                    underlineColorAndroid="transparent"
                    placeholder={I18n.t("MOBILE NUMBER")}
                    placeholderTextColor="#6F6F6F"
                    textAlignVertical="center"
                    autoCapitalize="none"
                    keyboardType='numeric'
                    maxLength={10}
                    value={this.state.mobile}
                    onChangeText={this.handleMobile}
                  />
                  <TextInput
                    style={[Device.isTablet ? styles.input_tablet : styles.input_mobile, { width: deviceWidth - 40 }]}
                    underlineColorAndroid="transparent"
                    placeholder={I18n.t("EMP ID")}
                    placeholderTextColor="#6F6F6F"
                    textAlignVertical="center"
                    autoCapitalize="none"
                    value={this.state.empId}
                    onChangeText={this.handleEmpId}
                  />
                  <TouchableOpacity style={Device.isTablet ? styles.filterApplyButton_tablet : styles.filterApplyButton_mobile}
                    onPress={() => this.getSaleBills()}>
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

              <View style={[styles.filterMainContainer, { height: Device.isTablet ? 740 : 620, marginTop: Device.isTablet ? deviceheight - 740 : deviceheight - 620, backgroundColor: '#00a9a9' }]}>
                <View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, height: Device.isTablet ? 60 : 50 }}>
                    <View>
                      <Text style={{ marginTop: 15, fontSize: Device.isTablet ? 22 : 17, marginLeft: 20, color: '#ffffff' }} > {I18n.t("New Sale Report Details")} </Text>
                    </View>
                    <View>
                      <TouchableOpacity style={{ width: Device.isTablet ? 60 : 50, height: Device.isTablet ? 60 : 50, marginTop: Device.isTablet ? 20 : 15, }} onPress={() => this.estimationModelCancel()}>
                        <Image style={{ margin: 5, height: Device.isTablet ? 20 : 15, width: Device.isTablet ? 20 : 15, }} source={require('../assets/images/modalCloseWhite.png')} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={{
                    height: Device.isTablet ? 2 : 1,
                    width: deviceWidth,
                    backgroundColor: 'lightgray',
                  }}></Text>
                </View>
                <View style={{ backgroundColor: '#ffffff', height: Device.isTablet ? 670 : 570 }}>
                  <View style={{ flexDirection: 'column', justifyContent: 'space-around', paddingRight: Device.isTablet ? 20 : 20, paddingLeft: Device.isTablet ? 20 : 20, height: Device.isTablet ? 650 : 550 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: Device.isTablet ? 0 : 10, paddingLeft: Device.isTablet ? 0 : 10 }}>
                      <Text style={styles.viewText} >
                        {I18n.t("Memo No")}:  </Text>
                      <Text style={[styles.viewSubText, { color: '#00a9a9', fontFamily: 'medium' }]} selectable={true}>
                        {this.state.memono} </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: Device.isTablet ? 0 : 10, paddingLeft: Device.isTablet ? 0 : 10 }}>
                      <Text style={styles.viewText} >
                        {I18n.t("BARCODE")}:  </Text>
                      <Text style={styles.viewSubText} selectable={true}>
                        {this.state.barcode} </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: Device.isTablet ? 0 : 10, paddingLeft: Device.isTablet ? 0 : 10 }}>
                      <Text style={styles.viewText} >
                        {I18n.t("Section")}:  </Text>
                      <Text style={styles.viewSubText} >
                        - </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: Device.isTablet ? 0 : 10, paddingLeft: Device.isTablet ? 0 : 10 }}>
                      <Text style={styles.viewText} >
                        {I18n.t("EMP ID")}:  </Text>
                      <Text style={styles.viewSubText} >
                        {this.state.empId} </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: Device.isTablet ? 0 : 10, paddingLeft: Device.isTablet ? 0 : 10 }}>
                      <Text style={styles.viewText} >
                        {I18n.t("HSN Code")}:  </Text>
                      <Text style={styles.viewSubText} >
                        {'HSN12345'} </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: Device.isTablet ? 0 : 10, paddingLeft: Device.isTablet ? 0 : 10 }}>
                      <Text style={styles.viewText} >
                        QTY:  </Text>
                      <Text style={styles.viewSubText} >
                        {this.state.qty} </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: Device.isTablet ? 0 : 10, paddingLeft: Device.isTablet ? 0 : 10 }}>
                      <Text style={styles.viewText} >
                        MRP:  </Text>
                      <Text style={styles.viewSubText} >
                        ₹ {this.state.mrp} </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: Device.isTablet ? 0 : 10, paddingLeft: Device.isTablet ? 0 : 10 }}>
                      <Text style={styles.viewText} >
                        DISC:  </Text>
                      <Text style={styles.viewSubText} >
                        - </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: Device.isTablet ? 0 : 10, paddingLeft: Device.isTablet ? 0 : 10 }}>
                      <Text style={styles.viewText} >
                        {I18n.t("Taxable Amount")}:  </Text>
                      <Text style={styles.viewSubText} >
                        ₹ {this.state.taxableaount} </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: Device.isTablet ? 0 : 10, paddingLeft: Device.isTablet ? 0 : 10 }}>
                      <Text style={styles.viewText} >
                        CGST:  </Text>
                      <Text style={styles.viewSubText} >
                        ₹ {this.state.cgst} </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: Device.isTablet ? 0 : 10, paddingLeft: Device.isTablet ? 0 : 10 }}>
                      <Text style={styles.viewText} >
                        SGST:  </Text>
                      <Text style={styles.viewSubText} >
                        ₹ {this.state.sgst} </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: Device.isTablet ? 0 : 10, paddingLeft: Device.isTablet ? 0 : 10 }}>
                      <Text style={styles.viewText} >
                        IGST:  </Text>
                      <Text style={styles.viewSubText} >
                        ₹ {this.state.igst} </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: Device.isTablet ? 0 : 10, paddingLeft: Device.isTablet ? 0 : 10 }}>
                      <Text style={styles.viewText} >
                        {I18n.t("NET AMOUNT")}:  </Text>
                      <Text style={styles.viewSubText} >
                        ₹ {this.state.mrp} </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: Device.isTablet ? 0 : 10, paddingLeft: Device.isTablet ? 0 : 10 }}>
                      <Text style={styles.viewText} >
                        GST%:  </Text>
                      <Text style={styles.viewSubText} >
                        {'gst10%'} </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: Device.isTablet ? 0 : 10, paddingLeft: Device.isTablet ? 0 : 10 }}>
                      <Text style={styles.viewText} >
                        {I18n.t("Customer")}:  </Text>
                      <Text style={styles.viewSubText} >
                        {this.state.customername} </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: Device.isTablet ? 0 : 10, paddingLeft: Device.isTablet ? 0 : 10 }}>
                      <Text style={styles.viewText} >
                        {I18n.t("Mobile")}:  </Text>
                      <Text style={styles.viewSubText} >
                        {this.state.mobile} </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: Device.isTablet ? 0 : 10, paddingLeft: Device.isTablet ? 0 : 10 }}>
                      <Text style={styles.viewText} >
                        {I18n.t("DATE")}:  </Text>
                      <Text style={styles.viewSubText} >
                        {this.state.createdate} </Text>
                    </View>
                    <View style={{}}>
                      <TouchableOpacity
                        style={[Device.isTablet ? styles.filterCancel_tablet : styles.filterCancel_mobile, { marginTop: Device.isTablet ? 20 : 10, borderColor: '#00a9a9' }]} onPress={() => this.estimationModelCancel()}
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
  modelCloseImage: {
    fontFamily: 'regular',
    fontSize: 12,
    position: 'absolute',
    top: 10,
    right: Device.isTablet ? 15 : 30,
  },
  filterMainContainer: {
    // marginLeft: -40,
    // marginRight: -40,
    // paddingLeft: Device.isTablet ? 0 : 20,
    backgroundColor: '#ffffff',
    marginTop: Device.isTablet ? deviceheight - 680 : deviceheight - 580,
    height: Device.isTablet ? 680 : 580,
  },
  deleteMainContainer: {
    // marginLeft: -40,
    // marginRight: -40,
    // paddingLeft: Device.isTablet ? 0 : 20,
    backgroundColor: '#ffffff',
    marginTop: Device.isTablet ? deviceheight - 350 : deviceheight - 240,
    height: Device.isTablet ? 350 : 300,
  },
  viewText: {
    fontSize: Device.isTablet ? 22 : 17,
    fontFamily: 'bold',
    color: "#353C40"
  },
  viewSubText: {
    fontSize: Device.isTablet ? 22 : 17,
    fontFamily: 'regular',
    color: "#353C40"
  },
  //////////////
  filterCancel_mobile: {
    width: deviceWidth - 40,
    height: 50,
    backgroundColor: "#ffffff",
    borderRadius: 5,
    borderWidth: Device.isTablet ? 2 : 1,
    borderColor: "#353C4050",
  },
  viewtext_tablet: {
    color: "#353C40",
    fontFamily: "regular",
    alignItems: 'center',
    left: 10,
    fontSize: 22,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute', top: 80,
  },
  viewtext_mobile: {
    color: "#353C40",
    fontFamily: "regular",
    alignItems: 'center',
    left: 10,
    fontSize: 14,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute', top: 60,
  },
  viewsubtext_tablet: {
    color: "#353C40",
    fontFamily: "bold",
    alignItems: 'center',
    marginLeft: 16,
    fontSize: 22,
    position: 'absolute',
    right: 10,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute',
    top: 80,
  },
  viewsubtext_mobile: {
    color: "#353C40",
    fontFamily: "bold",
    alignItems: 'center',
    marginLeft: 16,
    fontSize: 14,
    position: 'absolute',
    right: 10,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute',
    top: 60,
  },

  viewtext1_tablet: {
    color: "#353C40",
    fontFamily: "regular",
    alignItems: 'center',
    left: 10,
    fontSize: 22,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute', top: 110,

  },
  viewsubtext1_tablet: {
    color: "#353C40",
    fontFamily: "bold",
    alignItems: 'center',
    marginLeft: 16,
    fontSize: 22,
    position: 'absolute',
    right: 10,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute',
    top: 110,
  },

  viewtext1_mobile: {
    color: "#353C40",
    fontFamily: "regular",
    alignItems: 'center',
    left: 10,
    fontSize: 14,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute', top: 90,
  },

  viewsubtext1_mobile: {
    color: "#353C40",
    fontFamily: "bold",
    alignItems: 'center',
    marginLeft: 16,
    fontSize: 14,
    position: 'absolute',
    right: 10,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute',
    top: 90,
  },
  viewtext2_tablet: {
    color: "#353C40",
    fontFamily: "regular",
    alignItems: 'center',
    left: 10,
    fontSize: 22,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute', top: 140,

  },
  viewsubtext2_tablet: {
    color: "#353C40",
    fontFamily: "bold",
    alignItems: 'center',
    marginLeft: 16,
    fontSize: 22,
    position: 'absolute',
    right: 10,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute',
    top: 140,
  },

  viewtext2_mobile: {
    color: "#353C40",
    fontFamily: "regular",
    alignItems: 'center',
    left: 10,
    fontSize: 14,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute', top: 120,
  },

  viewsubtext2_mobile: {
    color: "#353C40",
    fontFamily: "bold",
    alignItems: 'center',
    marginLeft: 16,
    fontSize: 14,
    position: 'absolute',
    right: 10,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute',
    top: 120,
  },
  viewtext3_tablet: {
    color: "#353C40",
    fontFamily: "regular",
    alignItems: 'center',
    left: 10,
    fontSize: 22,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute', top: 170,

  },
  viewsubtext3_tablet: {
    color: "#353C40",
    fontFamily: "bold",
    alignItems: 'center',
    marginLeft: 16,
    fontSize: 22,
    position: 'absolute',
    right: 10,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute',
    top: 170,
  },

  viewtext3_mobile: {
    color: "#353C40",
    fontFamily: "regular",
    alignItems: 'center',
    left: 10,
    fontSize: 14,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute', top: 150,
  },

  viewsubtext3_mobile: {
    color: "#353C40",
    fontFamily: "bold",
    alignItems: 'center',
    marginLeft: 16,
    fontSize: 14,
    position: 'absolute',
    right: 10,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute',
    top: 150,
  },
  viewtext4_tablet: {
    color: "#353C40",
    fontFamily: "regular",
    alignItems: 'center',
    left: 10,
    fontSize: 22,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute', top: 200,

  },
  viewsubtext4_tablet: {
    color: "#353C40",
    fontFamily: "bold",
    alignItems: 'center',
    marginLeft: 16,
    fontSize: 22,
    position: 'absolute',
    right: 10,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute',
    top: 200,
  },

  viewtext4_mobile: {
    color: "#353C40",
    fontFamily: "regular",
    alignItems: 'center',
    left: 10,
    fontSize: 14,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute', top: 180,
  },

  viewsubtext4_mobile: {
    color: "#353C40",
    fontFamily: "bold",
    alignItems: 'center',
    marginLeft: 16,
    fontSize: 14,
    position: 'absolute',
    right: 10,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute',
    top: 180,
  },
  viewtext5_tablet: {
    color: "#353C40",
    fontFamily: "regular",
    alignItems: 'center',
    left: 10,
    fontSize: 22,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute', top: 230,

  },
  viewsubtext5_tablet: {
    color: "#353C40",
    fontFamily: "bold",
    alignItems: 'center',
    marginLeft: 16,
    fontSize: 22,
    position: 'absolute',
    right: 10,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute',
    top: 230,
  },

  viewtext5_mobile: {
    color: "#353C40",
    fontFamily: "regular",
    alignItems: 'center',
    left: 10,
    fontSize: 14,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute', top: 210,
  },

  viewsubtext5_mobile: {
    color: "#353C40",
    fontFamily: "bold",
    alignItems: 'center',
    marginLeft: 16,
    fontSize: 14,
    position: 'absolute',
    right: 10,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute',
    top: 210,
  },
  viewtext6_tablet: {
    color: "#353C40",
    fontFamily: "regular",
    alignItems: 'center',
    left: 10,
    fontSize: 22,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute', top: 260,

  },
  viewsubtext6_tablet: {
    color: "#353C40",
    fontFamily: "bold",
    alignItems: 'center',
    marginLeft: 16,
    fontSize: 22,
    position: 'absolute',
    right: 10,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute',
    top: 260,
  },

  viewtext6_mobile: {
    color: "#353C40",
    fontFamily: "regular",
    alignItems: 'center',
    left: 10,
    fontSize: 14,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute', top: 240,
  },

  viewsubtext6_mobile: {
    color: "#353C40",
    fontFamily: "bold",
    alignItems: 'center',
    marginLeft: 16,
    fontSize: 14,
    position: 'absolute',
    right: 10,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute',
    top: 240,
  },
  viewtext7_tablet: {
    color: "#353C40",
    fontFamily: "regular",
    alignItems: 'center',
    left: 10,
    fontSize: 22,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute', top: 290,

  },
  viewsubtext7_tablet: {
    color: "#353C40",
    fontFamily: "bold",
    alignItems: 'center',
    marginLeft: 16,
    fontSize: 22,
    position: 'absolute',
    right: 10,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute',
    top: 290,
  },

  viewtext7_mobile: {
    color: "#353C40",
    fontFamily: "regular",
    alignItems: 'center',
    left: 10,
    fontSize: 14,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute', top: 270,
  },

  viewsubtext7_mobile: {
    color: "#353C40",
    fontFamily: "bold",
    alignItems: 'center',
    marginLeft: 16,
    fontSize: 14,
    position: 'absolute',
    right: 10,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute',
    top: 270,
  },

  viewtext9_tablet: {
    color: "#353C40",
    fontFamily: "regular",
    alignItems: 'center',
    left: 10,
    fontSize: 22,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute', top: 320,

  },
  viewsubtext9_tablet: {
    color: "#353C40",
    fontFamily: "bold",
    alignItems: 'center',
    marginLeft: 16,
    fontSize: 22,
    position: 'absolute',
    right: 10,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute',
    top: 320,
  },

  viewtext9_mobile: {
    color: "#353C40",
    fontFamily: "regular",
    alignItems: 'center',
    left: 10,
    fontSize: 14,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute', top: 300,
  },

  viewsubtext9_mobile: {
    color: "#353C40",
    fontFamily: "bold",
    alignItems: 'center',
    marginLeft: 16,
    fontSize: 14,
    position: 'absolute',
    right: 10,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute',
    top: 300,
  },
  viewtext10_tablet: {
    color: "#353C40",
    fontFamily: "regular",
    alignItems: 'center',
    left: 10,
    fontSize: 22,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute', top: 350,

  },
  viewsubtext10_tablet: {
    color: "#353C40",
    fontFamily: "bold",
    alignItems: 'center',
    marginLeft: 16,
    fontSize: 22,
    position: 'absolute',
    right: 10,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute',
    top: 350,
  },

  viewtext10_mobile: {
    color: "#353C40",
    fontFamily: "regular",
    alignItems: 'center',
    left: 10,
    fontSize: 14,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute', top: 330,
  },

  viewsubtext10_mobile: {
    color: "#353C40",
    fontFamily: "bold",
    alignItems: 'center',
    marginLeft: 16,
    fontSize: 14,
    position: 'absolute',
    right: 10,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute',
    top: 330,
  },
  viewtext11_tablet: {
    color: "#353C40",
    fontFamily: "regular",
    alignItems: 'center',
    left: 10,
    fontSize: 22,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute', top: 380,

  },
  viewsubtext11_tablet: {
    color: "#353C40",
    fontFamily: "bold",
    alignItems: 'center',
    marginLeft: 16,
    fontSize: 22,
    position: 'absolute',
    right: 10,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute',
    top: 380,
  },

  viewtext11_mobile: {
    color: "#353C40",
    fontFamily: "regular",
    alignItems: 'center',
    left: 10,
    fontSize: 14,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute', top: 360,
  },

  viewsubtext11_mobile: {
    color: "#353C40",
    fontFamily: "bold",
    alignItems: 'center',
    marginLeft: 16,
    fontSize: 14,
    position: 'absolute',
    right: 10,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute',
    top: 360,
  },
  viewtext12_tablet: {
    color: "#353C40",
    fontFamily: "regular",
    alignItems: 'center',
    left: 10,
    fontSize: 22,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute', top: 410,

  },
  viewsubtext12_tablet: {
    color: "#353C40",
    fontFamily: "bold",
    alignItems: 'center',
    marginLeft: 16,
    fontSize: 22,
    position: 'absolute',
    right: 10,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute',
    top: 410,
  },

  viewtext12_mobile: {
    color: "#353C40",
    fontFamily: "regular",
    alignItems: 'center',
    left: 10,
    fontSize: 14,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute', top: 390,
  },

  viewsubtext12_mobile: {
    color: "#353C40",
    fontFamily: "bold",
    alignItems: 'center',
    marginLeft: 16,
    fontSize: 14,
    position: 'absolute',
    right: 10,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute',
    top: 390,
  },
  viewtext13_tablet: {
    color: "#353C40",
    fontFamily: "regular",
    alignItems: 'center',
    left: 10,
    fontSize: 22,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute', top: 440,

  },
  viewsubtext13_tablet: {
    color: "#353C40",
    fontFamily: "bold",
    alignItems: 'center',
    marginLeft: 16,
    fontSize: 22,
    position: 'absolute',
    right: 10,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute',
    top: 440,
  },

  viewtext13_mobile: {
    color: "#353C40",
    fontFamily: "regular",
    alignItems: 'center',
    left: 10,
    fontSize: 14,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute', top: 420,
  },

  viewsubtext13_mobile: {
    color: "#353C40",
    fontFamily: "bold",
    alignItems: 'center',
    marginLeft: 16,
    fontSize: 14,
    position: 'absolute',
    right: 10,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute',
    top: 420,
  },
  viewsubtext8_tablet: {
    color: "#353C40",
    fontFamily: "bold",
    alignItems: 'center',
    marginLeft: 16,
    fontSize: 22,
    position: 'absolute',
    right: 10,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute',
    top: 470,
  },
  viewtext8_tablet: {
    color: "#353C40",
    fontFamily: "regular",
    alignItems: 'center',
    left: 10,
    fontSize: 22,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute', top: 470,

  },


  viewtext8_mobile: {
    color: "#353C40",
    fontFamily: "regular",
    alignItems: 'center',
    left: 10,
    fontSize: 14,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute', top: 450,
  },

  viewsubtext8_mobile: {
    color: "#353C40",
    fontFamily: "bold",
    alignItems: 'center',
    marginLeft: 16,
    fontSize: 14,
    position: 'absolute',
    right: 10,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute',
    top: 450,
  },
  viewsubtext14_tablet: {
    color: "#353C40",
    fontFamily: "bold",
    alignItems: 'center',
    marginLeft: 16,
    fontSize: 22,
    position: 'absolute',
    right: 10,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute',
    top: 500,
  },
  viewtext14_tablet: {
    color: "#353C40",
    fontFamily: "regular",
    alignItems: 'center',
    left: 10,
    fontSize: 22,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute', top: 500,

  },


  viewtext14_mobile: {
    color: "#353C40",
    fontFamily: "regular",
    alignItems: 'center',
    left: 10,
    fontSize: 14,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute', top: 480,
  },

  viewsubtext14_mobile: {
    color: "#353C40",
    fontFamily: "bold",
    alignItems: 'center',
    marginLeft: 16,
    fontSize: 14,
    position: 'absolute',
    right: 10,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute',
    top: 480,
  },
  viewsubtext15_tablet: {
    color: "#353C40",
    fontFamily: "bold",
    alignItems: 'center',
    marginLeft: 16,
    fontSize: 22,
    position: 'absolute',
    right: 10,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute',
    top: 530,
  },
  viewtext15_tablet: {
    color: "#353C40",
    fontFamily: "regular",
    alignItems: 'center',
    left: 10,
    fontSize: 22,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute', top: 530,

  },


  viewtext15_mobile: {
    color: "#353C40",
    fontFamily: "regular",
    alignItems: 'center',
    left: 10,
    fontSize: 14,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute', top: 510,
  },

  viewsubtext15_mobile: {
    color: "#353C40",
    fontFamily: "bold",
    alignItems: 'center',
    marginLeft: 16,
    fontSize: 14,
    position: 'absolute',
    right: 10,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute',
    top: 510,
  },
  viewsubtext16_tablet: {
    color: "#353C40",
    fontFamily: "bold",
    alignItems: 'center',
    marginLeft: 16,
    fontSize: 22,
    position: 'absolute',
    right: 10,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute',
    top: 560,
  },
  viewtext16_tablet: {
    color: "#353C40",
    fontFamily: "regular",
    alignItems: 'center',
    left: 10,
    fontSize: 22,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute', top: 560,

  },


  viewtext16_mobile: {
    color: "#353C40",
    fontFamily: "regular",
    alignItems: 'center',
    left: 10,
    fontSize: 14,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute', top: 540,
  },

  viewsubtext16_mobile: {
    color: "#353C40",
    fontFamily: "bold",
    alignItems: 'center',
    marginLeft: 16,
    fontSize: 14,
    position: 'absolute',
    right: 10,
    justifyContent: 'center',
    textAlign: 'center',
    position: 'absolute',
    top: 540,
  },



  filterCancel_tablet: {
    width: deviceWidth - 40,
    height: 60,
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
    marginLeft: -20,
    backgroundColor: "#ffffff",
    height: 580,
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
  filterDateButton_mobile: {
    width: deviceWidth - 40,
    marginTop: 5,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    paddingLeft: 15,
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
  input_mobile: {
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 20,
    height: 44,
    marginTop: 5,
    marginBottom: 10,
    borderColor: '#8F9EB717',
    borderRadius: 3,
    backgroundColor: '#FBFBFB',
    borderWidth: Device.isTablet ? 2 : 1,
    fontFamily: 'regular',
    paddingLeft: 15,
    fontSize: 14,
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
    borderWidth: Device.isTablet ? 2 : 1,
    fontFamily: 'regular',
    paddingLeft: 15,
    fontSize: 14,
  },

  // Styles For Tablet
  filterMainContainer_tablet: {
    width: deviceWidth,
    alignItems: 'center',
    marginLeft: -40,
    backgroundColor: "#ffffff",
    height: 670,
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
    borderWidth: Device.isTablet ? 2 : 1,
    fontFamily: 'regular',
    paddingLeft: 15,
    fontSize: 20,
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
  filterDateButton_tablet: {
    width: deviceWidth - 40,
    marginTop: 5,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    paddingLeft: 15,
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
    borderWidth: Device.isTablet ? 2 : 1,
    fontFamily: 'regular',
    paddingLeft: 15,
    fontSize: 20,
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

  // Styles For Tablet
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





});
