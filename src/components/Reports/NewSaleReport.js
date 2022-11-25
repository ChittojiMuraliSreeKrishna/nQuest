import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import Device from 'react-native-device-detection';
import I18n from 'react-native-i18n';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import { Appbar, Text as Txt, TextInput } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import { Chevron } from 'react-native-shapes';
import IconFA from 'react-native-vector-icons/FontAwesome';
import IconMA from 'react-native-vector-icons/MaterialCommunityIcons';
import forms from '../../commonUtils/assets/styles/formFields.scss';
import scss from '../../commonUtils/assets/styles/style.scss';
import { dateFormat, formatDate, formatMonth } from '../../commonUtils/DateFormate';
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
      newSale: [],
      viewNewsSaleList: [],
      viewNewSaleSubList: [],
      loadMoreActive: false,
      totalPages: 0,
      pageNo: 0,
      filterActive: false,
      loadPrevActive: false,
      loadNextActive: true
    };
  }

  async componentDidMount() {
    await AsyncStorage.getItem("storeId").then((value) => {
      storeStringId = value;
      this.setState({ storeId: value });
      console.log({ storeStringId });

    }).catch(() => {
      this.setState({ loading: false });
      console.log('There is error getting storeId');
      //  alert('There is error getting storeId');
    });
  }

  filterAction() {
    this.setState({ flagFilterNewSale: true, modalVisible: true });
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
        custMobileNumber: this.state.mobile ? "+91" + this.state.mobile : this.state.mobile,
        billStatus: this.state.billPosition,
        storeId: this.state.storeId,
        domainId: this.state.domainId
      };
      console.log('params are' + JSON.stringify(obj));
      let pageNumber = 0;
      ReportsService.newSaleReports(obj, this.state.pageNo).then((res) => {
        console.log(res.data.result);
        if (res.data && res.data["isSuccess"] === "true") {
          if (res.data.result.length !== 0) {
            this.setState({ newSale: res.data.result.newSale.content, filterActive: true });
            this.modelCancel();
            console.log(this.state.newSale);
            this.continuePagination();
          } else {
            alert("records not found");
          }
        }
        else {
          alert(res.data.message);
          this.props.filterActiveCallback();
          this.modelCancel();
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

  loadMoreList = (value) => {
    if (value >= 0 && value < this.state.totalPages) {
      this.setState({ pageNo: value }, () => {
        this.applyListPromotions();
        if (this.state.pageNo === (this.state.totalPages - 1)) {
          this.setState({ loadNextActive: false });
        } else {
          this.setState({ loadNextActive: true });
        }
        if (this.state.pageNo === 0) {
          this.setState({ loadPrevActive: false });
        } else {
          this.setState({ loadPrevActive: true });
        }
      });
    }
  };

  continuePagination() {
    if (this.state.totalPages > 1) {
      this.setState({ loadMoreActive: true });
    }
    else {
      this.setState({ loadMoreActive: false, loadNextActive: false });
    }
  }


  handledeleteNewSale() {
    this.setState({ flagDeleteNewSale: true, modalVisible: true, flagViewDetail: false });
  }

  handleviewNewSale(item, index) {
    console.log({ item });
    console.log(item.lineItemsReVo);
    this.state.viewNewsSaleList.push(item);
    this.setState({ flagViewDetail: true, modalVisible: true, flagDeleteNewSale: false, viewNewsSaleList: this.state.viewNewsSaleList });
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
    this.setState({ startDate: this.state.date.getFullYear() + formatMonth(this.state.date.getMonth() + 1) + dateFormat(this.state.date.getDate()) });
    this.setState({ doneButtonClicked: true, datepickerOpen: false, datepickerendOpen: false });
  }

  datepickerendDoneClicked() {
    this.setState({ endDate: this.state.enddate.getFullYear() + formatMonth(this.state.enddate.getMonth() + 1) + dateFormat(this.state.enddate.getDate()) });
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
    this.setState({ modalVisible: false, flagFilterNewSale: false });
  }

  clearFilterAction() {
    this.setState({
      loadMoreActive: false, loadNextActive: false,
      filterActive: false, newSale: [], fromDate: "", toDate: "", billPosition: "", invoiceNumber: "", mobileNumber: "", empId: "", startDate: "", endDate: "", mobile: ""
    });
  }

  closeViewAction() {
    this.setState({ flagViewDetail: !this.state.flagViewDetail, viewNewSaleSubList: [], viewNewsSaleList: [] });
  }


  render() {
    return (
      <View>
        <FlatList
          data={this.state.newSale}
          ListHeaderComponent={
            <Appbar>
              <Appbar.Content title="New Sale Report" />
              {this.state.filterActive ?
                <IconFA
                  name="sliders"
                  style={{ marginRight: 10 }}
                  size={25}
                  color="#ed1c24"
                  onPress={() => this.clearFilterAction()}
                ></IconFA> :
                <IconFA
                  name="sliders"
                  color="#000"
                  style={[{ marginRight: 10 }, scss.action_icons]}
                  size={25}
                  onPress={() => this.filterAction()}
                ></IconFA>
              }
            </Appbar>
          }
          scrollEnabled={true}
          keyExtractor={(item, i) => i.toString()}
          ListEmptyComponent={<Text style={{ fontSize: Device.isTablet ? 21 : 17, fontFamily: 'bold', color: '#000000', textAlign: 'center', marginTop: deviceheight / 3 }}>&#9888; {I18n.t("Results not loaded")}</Text>}
          renderItem={({ item, index }) => (
            <ScrollView>
              <View style={scss.flatListContainer} >
                <View style={scss.flatListSubContainer}>
                  <View style={scss.textContainer}>
                    <Text style={scss.highText} >S.NO: {index + 1} </Text>
                    <Text style={scss.textStyleMedium}>INVOICE NUMBER: {"\n"} {item.invoiceNumber}</Text>
                  </View>
                  <View style={scss.textContainer}>
                    <Text style={scss.textStyleLight}>{I18n.t("EMP ID")}: {item.empId} </Text>
                    <Text style={scss.textStyleLight}> {item.status}</Text>
                  </View>

                  <View style={scss.textContainer}>
                    <Text style={scss.textStyleLight} >{I18n.t("NET AMOUNT")}: ₹ {parseFloat(item.netPayableAmount).toFixed(2)} </Text>
                  </View>
                  <View style={scss.flatListFooter}>
                    <Text style={scss.footerText}>
                      {I18n.t("DATE")}:
                      {formatDate(item.createdDate)}
                    </Text>
                    <View style={scss.buttonContainer}>
                      <IconFA
                        name='eye'
                        size={25}
                        style={[{ marginRight: 10 }, scss.action_icons]}
                        onPress={() => this.handleviewNewSale(item, index)}
                      >
                      </IconFA>
                      <IconMA
                        style={scss.action_icons}
                        name='trash-can-outline'
                        size={25}
                        onPress={() => this.handledeleteNewSale(item, index)}
                      >
                      </IconMA>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          )}
          ListFooterComponent={
            this.state.loadMoreActive && (
              <View style={scss.page_navigation_container}>
                <View style={scss.page_navigation_subcontainer}>
                  <Text style={scss.page_nav_text}>{`Page: ${this.state.pageNo + 1} - ${this.state.totalPages}`}</Text>
                </View>
                <View style={scss.page_navigation_subcontainer}>
                  {this.state.loadPrevActive && (
                    <View style={scss.page_navigation_subcontainer}>
                      <IconMA
                        style={[scss.pag_nav_btn]}
                        color={this.state.loadPrevActive === true ? "#353c40" : "#b9b9b9"}
                        onPress={() => this.loadMoreList(0)}
                        name="chevron-double-left"
                        size={25}
                      />
                      <IconMA
                        style={[scss.pag_nav_btn]}
                        color={this.state.loadPrevActive === true ? "#353c40" : "#b9b9b9"}
                        onPress={() => this.loadMoreList(this.state.pageNo - 1)}
                        name="chevron-left"
                        size={25}
                      />
                    </View>
                  )}
                  <Text style={scss.page_nav_pageno}>{this.state.pageNo + 1}</Text>
                  {this.state.loadNextActive && (
                    <View style={scss.page_navigation_subcontainer}>
                      <IconMA
                        style={[scss.pag_nav_btn]}
                        onPress={() => this.loadMoreList(this.state.pageNo + 1)}
                        name="chevron-right"
                        size={25}
                      />
                      <IconMA
                        style={[scss.pag_nav_btn]}
                        onPress={() => this.loadMoreList(this.state.totalPages - 1)}
                        name="chevron-double-right"
                        size={25}
                      />
                    </View>
                  )}
                </View>
              </View>
            )
          }
        />
        {this.state.flagDeleteNewSale && (
          <View>
            <Modal style={{ margin: 0 }} isVisible={this.state.modalVisible}
              onBackButtonPress={() => this.estimationModelCancel()}
              onBackdropPress={() => this.estimationModelCancel()} >

              <View style={[styles.deleteMainContainer, { backgroundColor: '#ED1C24' }]}>
                <View style={forms.filterModelContainer} >
                  <Text style={forms.popUp_decorator}>-</Text>
                  <View style={forms.filterModelSub}>
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
                </View>
              </View>
            </Modal>
          </View>
        )}

        {this.state.flagFilterNewSale && (
          <View>
            <Modal style={{ margin: 0 }} isVisible={this.state.modalVisible}
              onBackButtonPress={() => this.modelCancel()}
              onBackdropPress={() => this.modelCancel()} >
              <View style={forms.filterModelContainer} >
                <Text style={forms.popUp_decorator}>-</Text>
                <View style={forms.filterModelSub}>
                  <KeyboardAwareScrollView >
                    <View style={forms.filter_dates_container}>
                      <TouchableOpacity
                        style={forms.filter_dates}
                        testID="openModal"
                        onPress={() => this.datepickerClicked()}
                      >
                        <Text
                          style={forms.filter_dates_text}
                        >{this.state.startDate == "" ? 'START DATE' : this.state.startDate}</Text>
                        <Image style={forms.calender_image} source={require('../assets/images/calender.png')} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={forms.filter_dates}
                        testID="openModal"
                        onPress={() => this.enddatepickerClicked()}
                      >
                        <Text
                          style={forms.filter_dates_text}
                        >{this.state.endDate == "" ? 'END DATE' : this.state.endDate}</Text>
                        <Image style={forms.calender_image} source={require('../assets/images/calender.png')} />
                      </TouchableOpacity>
                    </View>
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
                    <View style={[styles.rnSelectContainer_mobile, { width: '92%' }]}>
                      <RNPickerSelect
                        placeholder={{
                          label: 'BILL POSITION'
                        }}
                        Icon={() => {
                          return <Chevron style={styles.imagealign} size={1.5} color="gray" />;
                        }}
                        items={[
                          { label: 'Completed', value: 'Completed' },
                          { label: 'Cancelled', value: 'Cancelled' },
                        ]}
                        onValueChange={this.handleBillPositions}
                        style={Device.isTablet ? pickerSelectStyles_tablet : pickerSelectStyles_mobile}
                        value={this.state.billPosition}
                        useNativeAndroidPickerStyle={false}
                      />
                    </View>
                    <TextInput
                      outlineColor='#d8d8d8'
                      mode='outlined'
                      activeOutlineColor='#d8d8d8'
                      style={forms.input_fld}
                      underlineColorAndroid="transparent"
                      placeholder={I18n.t("INVOICE NUMBER")}
                      placeholderTextColor="#6F6F6F"
                      textAlignVertical="center"
                      autoCapitalize="none"
                      value={this.state.invoiceNumber}
                      onChangeText={this.handleInvoiceNumber}
                    />
                    <TextInput
                      outlineColor='#d8d8d8'
                      mode='outlined'
                      activeOutlineColor='#d8d8d8'
                      style={forms.input_fld}
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
                      outlineColor='#d8d8d8'
                      mode='outlined'
                      activeOutlineColor='#d8d8d8'
                      style={forms.input_fld}
                      underlineColorAndroid="transparent"
                      placeholder={I18n.t("EMP ID")}
                      placeholderTextColor="#6F6F6F"
                      textAlignVertical="center"
                      autoCapitalize="none"
                      value={this.state.empId}
                      onChangeText={this.handleEmpId}
                    />
                    <View style={forms.action_buttons_container}>
                      <TouchableOpacity style={[forms.action_buttons, forms.submit_btn]}
                        onPress={() => this.getSaleBills()}>
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

        {this.state.flagViewDetail && (
          <View>
            <Modal style={{ margin: 0 }} isVisible={this.state.flagViewDetail} onBackdropPress={() => this.closeViewAction()}>
              <View style={forms.filterModelContainer} >
                <Text style={forms.popUp_decorator}>-</Text>
                <View style={scss.filterModelSub}>
                  <FlatList
                    scrollEnabled={false}
                    data={this.state.viewNewsSaleList}
                    keyExtractor={(item, i) => i.toString()}
                    removeClippedSubviews={false}
                    renderItem={({ item, index }) => (
                      <View style={{ backgroundColor: '#FFF' }}>
                        <View style={scss.model_text_container}>
                          <Txt style={{ textAlign: 'left' }} variant='titleMedium' selectable={true} key={Math.random()}>Memo.no: {"\n"}{item.invoiceNumber}</Txt>
                          <Txt style={{ textAlign: 'right' }} variant='bodyLarge'>Customer: {"\n"}{item.customerName}</Txt>
                        </View>
                        <View style={scss.model_text_container}>
                          <Txt style={{ textAlign: 'left' }} variant='bodyLarge'>Mobile: {"\n"}{item.mobileNumber}</Txt>
                          <Txt style={{ textAlign: 'right' }} variant='bodyLarge'>Date: {"\n"}{formatDate(item.createdDate)}</Txt>
                        </View>
                        <View style={scss.model_subContainer}>
                          <ScrollView>
                            {item.lineItemsReVo.map((data, index) => {
                              return (
                                <View id={index} style={scss.model_subbody}>
                                  <View style={scss.model_text_container}>
                                    <Txt style={{ textAlign: 'left' }} variant='bodyMedium'>Barcode: {"\n"}{data.barCode}</Txt>
                                    <Txt style={{ textAlign: 'right' }} variant='bodyMedium'>Section: {data.section}</Txt>
                                  </View>
                                  <View style={scss.model_text_container}>
                                    <Txt style={{ textAlign: 'left' }} variant='bodyMedium'>HsnCode: {data.hsnCode}</Txt>
                                    <Txt style={{ textAlign: 'right' }} variant='bodyMedium'>EmpId: {item.empId}</Txt>
                                  </View>
                                  <View style={scss.model_text_container}>
                                    <Txt style={{ textAlign: 'left' }} variant='bodyMedium'>QTY: {data.quantity}</Txt>
                                    <Txt style={{ textAlign: 'right' }} variant='bodyMedium'>MRP: {parseFloat(data.itemPrice).toFixed(2)}</Txt>
                                  </View>
                                  <View style={scss.model_text_container}>
                                    <Txt style={{ textAlign: 'left' }} variant='bodyMedium'>DISC: {data.discount ? parseFloat(data.discount).toFixed(2) : ""}</Txt>
                                    <Txt style={{ textAlign: 'right' }} variant='bodyMedium'>Approved By: {data.approvedBy}</Txt>
                                  </View>
                                  <View style={scss.model_text_container}>
                                    <Txt style={{ textAlign: 'left' }} variant='bodyMedium'>Reason: {data.reason}</Txt>
                                    <Txt style={{ textAlign: 'right' }} variant='bodyMedium'>Tax Amount: {parseFloat(data.taxValue).toFixed(2)}</Txt>
                                  </View>
                                  <View style={scss.model_text_container}>
                                    <Txt style={{ textAlign: 'left' }} variant='bodyMedium'>CGST: {parseFloat(data.cgst).toFixed(2)}</Txt>
                                    <Txt style={{ textAlign: 'right' }} variant='bodyMedium'>SGST: {parseFloat(data.sgst).toFixed(2)}</Txt>
                                  </View>
                                  <View style={scss.model_text_container}>
                                    <Txt style={{ textAlign: 'left' }} variant='bodyMedium'>IGST: {parseFloat(data.igst).toFixed(2)}</Txt>
                                    <Txt style={{ textAlign: 'right' }} variant='bodyMedium'>NET: {parseFloat(data.netValue).toFixed(2)}</Txt>
                                  </View>
                                </View>
                              );
                            })}
                          </ScrollView>
                        </View>
                        <View style={{ backgroundColor: '#d9d9d980' }}>
                          <View style={scss.model_text_container}>
                            <Text style={{ textAlign: 'left', fontWeight: 'bold' }}>MANUAL DISCOUNT:{"\n"}{parseFloat(item.totalManualDisc).toFixed(2)}</Text>
                            <Text style={{ textAlign: 'right', fontWeight: 'bold' }}>INVOICE PROMO DISCOUNT:{"\n"}{parseFloat(item.totalPromoDisc).toFixed(2)}</Text>
                          </View>
                          <View style={scss.model_text_container}>
                            <Text style={[scss.highText, { textAlign: 'left' }]}>
                              GV APPLIED AMOUNT:{"\n"}{parseFloat(item.gvAppliedAmount).toFixed(2)}</Text>
                            <Text style={[scss.highText, { textAlign: 'right' }]}>RT CLAIM AMOUNT:
                              {"\n"}{parseFloat(item.returnSlipAmount).toFixed(2)}</Text>
                          </View>
                          <View style={scss.model_text_container}>
                            <Text></Text>
                            <Text style={[scss.highText, { textAlign: 'center' }]}>TOTAL AMOUNT
                              :{parseFloat(item.netPayableAmount).toFixed(2)}</Text>
                            <Text></Text>
                          </View>
                        </View>
                        <View>
                        </View>
                        <View>
                          <TouchableOpacity onPress={() => this.closeViewAction()} style={[forms.close_full_btn]}>
                            <Text style={forms.cancel_btn_text}>Close</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  />
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
    height: 45,
    marginTop: 5,
    marginBottom: 10,
    borderColor: '#d8d8d8',
    borderRadius: 3,
    backgroundColor: '#FFF',
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
