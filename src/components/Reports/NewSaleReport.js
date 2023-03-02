import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { Dimensions, FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Device from 'react-native-device-detection';
import I18n from 'react-native-i18n';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import { Appbar, Text as Txt, TextInput } from 'react-native-paper';
import IconFA from 'react-native-vector-icons/FontAwesome';
import IconMA from 'react-native-vector-icons/MaterialCommunityIcons';
import forms from '../../commonUtils/assets/styles/formFields.scss';
import scss from '../../commonUtils/assets/styles/style.scss';
import Clipbrd from '../../commonUtils/Clipboard';
import { dateFormat, formatDate, formatMonth } from '../../commonUtils/DateFormate';
import DateSelector from '../../commonUtils/DateSelector';
import RnPicker from '../../commonUtils/RnPicker';
import { RH } from '../../Responsive';
import ReportsService from '../services/ReportsService';

var deviceWidth = Dimensions.get("window").width;
var deviceheight = Dimensions.get("window").height;

const pickerData = [
  { label: 'Completed', value: 'Completed' },
  { label: 'Cancelled', value: 'Cancelled' },
]
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
    const storeId = await AsyncStorage.getItem("storeId");
    this.setState({ storeId: storeId });
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
      // console.log('params are' + JSON.stringify(obj));
      let pageNumber = 0;
      ReportsService.newSaleReports(obj, this.state.pageNo).then((res) => {
        if (res.data && res.data["isSuccess"] === "true") {
          if (res.data.result.length !== 0) {
            this.setState({ newSale: res.data.result.newSale.content, totalPages: res.data.result.newSale.totalPages, filterActive: true });
            this.continuePagination();
            this.modelCancel();
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
        this.getSaleBills();
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

  datepickerCancelClicked = () => {
    this.setState({
      datepickerOpen: false,
    });
  };

  datepickerEndCancelClicked = () => {
    this.setState({
      datepickerendOpen: false,
    });
  };
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

  handleDate = (value) => {
    this.setState({ startDate: value })
  }

  handleEndDate = (value) => {
    this.setState({ endDate: value })
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
                  size={20}
                  color="#ed1c24"
                  onPress={() => this.clearFilterAction()}
                ></IconFA> :
                <IconFA
                  name="sliders"
                  color="#000"
                  style={[{ marginRight: 10 }, scss.action_icons]}
                  size={20}
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
                    <Text style={scss.textStyleMedium}>INVOICE NUMBER:{"\n"} {item.invoiceNumber} <Clipbrd data={item.invoiceNumber} /> </Text>
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
                        size={20}
                        style={[{ marginRight: 10 }, scss.action_icons]}
                        onPress={() => this.handleviewNewSale(item, index)}
                      >
                      </IconFA>
                      <IconMA
                        style={scss.action_icons}
                        name='trash-can-outline'
                        size={20}
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
                        size={20}
                      />
                      <IconMA
                        style={[scss.pag_nav_btn]}
                        color={this.state.loadPrevActive === true ? "#353c40" : "#b9b9b9"}
                        onPress={() => this.loadMoreList(this.state.pageNo - 1)}
                        name="chevron-left"
                        size={20}
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
                        size={20}
                      />
                      <IconMA
                        style={[scss.pag_nav_btn]}
                        onPress={() => this.loadMoreList(this.state.totalPages - 1)}
                        name="chevron-double-right"
                        size={20}
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

              <View style={forms.filterModelContainer} >
                <Text style={forms.popUp_decorator}>-</Text>
                <View style={forms.filterModelSub}>
                  <Text style={[scss.textStyleMedium, { fontSize: 16 }]}> {I18n.t("Are you sure want to delete New Sale Report")} ?  </Text>
                  <View style={forms.action_buttons_container}>
                    <TouchableOpacity style={[forms.action_buttons, forms.submit_btn]}
                      onPress={() => this.deleteEstimationSlip(item, index)}>
                      <Text style={forms.submit_btn_text} >{I18n.t("DELETE")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[forms.action_buttons, forms.cancel_btn]}
                      onPress={() => this.estimationModelCancel()}>
                      <Text style={forms.cancel_btn_text}>{I18n.t("CANCEL")}</Text>
                    </TouchableOpacity>
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
                        <IconFA
                          name="calendar"
                          size={18}
                          style={forms.calender_image}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={forms.filter_dates}
                        testID="openModal"
                        onPress={() => this.enddatepickerClicked()}
                      >
                        <Text
                          style={forms.filter_dates_text}
                        >{this.state.endDate == "" ? 'END DATE' : this.state.endDate}</Text>
                        <IconFA
                          name="calendar"
                          size={18}
                          style={forms.calender_image}
                        />
                      </TouchableOpacity>
                    </View>
                    {this.state.datepickerOpen && (
                      <View style={{ height: RH(280), width: deviceWidth, backgroundColor: '#ffffff' }}>
                        <DateSelector
                          dateCancel={this.datepickerCancelClicked}
                          setDate={this.handleDate}
                        />
                      </View>)}

                    {this.state.datepickerendOpen && (
                      <View style={{ height: RH(280), width: deviceWidth, backgroundColor: '#ffffff' }}>
                        <DateSelector
                          dateCancel={this.datepickerEndCancelClicked}
                          setDate={this.handleEndDate}
                        />
                      </View>
                    )}
                    <RnPicker
                      items={pickerData}
                      setValue={this.handleBillPositions}
                    />
                    <TextInput
                      underlineColor='#efefef'
                      mode='flat'
                      activeUnderlineColor='#efefef'
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
                      underlineColor='#efefef'
                      mode='flat'
                      activeUnderlineColor='#efefef'
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
                      underlineColor='#efefef'
                      mode='flat'
                      activeUnderlineColor='#efefef'
                      style={forms.input_fld}
                      underlineColorAndroid="transparent"
                      placeholder={I18n.t("EMP ID")}
                      keyboardType='number-pad'
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
                          <Txt style={{ textAlign: 'left' }} variant='titleMedium' key={Math.random()}>Memo.no:{"\n"}{item.invoiceNumber} <Clipbrd data={item.invoiceNumber} /> </Txt>
                          <Txt style={{ textAlign: 'right' }} variant='bodyLarge'>Customer:{"\n"}{item.customerName}</Txt>
                        </View>
                        <View style={scss.model_text_container}>
                          <Txt style={{ textAlign: 'left' }} variant='bodyLarge'>Mobile:{"\n"}{item.mobileNumber}</Txt>
                          <Txt style={{ textAlign: 'right' }} variant='bodyLarge'>Date:{"\n"}{formatDate(item.createdDate)}</Txt>
                        </View>
                        <View style={scss.model_subContainer}>
                          <ScrollView>
                            {item.lineItemsReVo.map((data, index) => {
                              return (
                                <View id={index} style={scss.model_subbody}>
                                  <View style={scss.model_text_container}>
                                    <Txt style={{ textAlign: 'left' }} variant='bodyMedium'>Barcode:{"\n"}{data.barCode}</Txt>
                                    <Txt style={{ textAlign: 'right' }} variant='bodyMedium'>Section:{"\n"}{data.section}</Txt>
                                  </View>
                                  <View style={scss.model_text_container}>
                                    <Txt style={{ textAlign: 'left' }} variant='bodyMedium'>HsnCode:{"\n"}{data.hsnCode}</Txt>
                                    <Txt style={{ textAlign: 'right' }} variant='bodyMedium'>EmpId:{"\n"}{item.empId}</Txt>
                                  </View>
                                  <View style={scss.model_text_container}>
                                    <Txt style={{ textAlign: 'left' }} variant='bodyMedium'>QTY:{"\n"}{data.quantity}</Txt>
                                    <Txt style={{ textAlign: 'right' }} variant='bodyMedium'>MRP:{"\n"}{parseFloat(data.itemPrice).toFixed(2)}</Txt>
                                  </View>
                                  <View style={scss.model_text_container}>
                                    <Txt style={{ textAlign: 'left' }} variant='bodyMedium'>DISC:{"\n"}{data.discount ? parseFloat(data.discount).toFixed(2) : ""}</Txt>
                                    <Txt style={{ textAlign: 'right' }} variant='bodyMedium'>Approved By:{"\n"}{data.approvedBy}</Txt>
                                  </View>
                                  <View style={scss.model_text_container}>
                                    <Txt style={{ textAlign: 'left' }} variant='bodyMedium'>Reason:{"\n"}{data.reason}</Txt>
                                    <Txt style={{ textAlign: 'right' }} variant='bodyMedium'>Tax Amount:{"\n"}{parseFloat(data.taxValue).toFixed(2)}</Txt>
                                  </View>
                                  <View style={scss.model_text_container}>
                                    <Txt style={{ textAlign: 'left' }} variant='bodyMedium'>CGST:{"\n"}{parseFloat(data.cgst).toFixed(2)}</Txt>
                                    <Txt style={{ textAlign: 'right' }} variant='bodyMedium'>SGST:{"\n"}{parseFloat(data.sgst).toFixed(2)}</Txt>
                                  </View>
                                  <View style={scss.model_text_container}>
                                    <Txt style={{ textAlign: 'left' }} variant='bodyMedium'>IGST:{"\n"}{parseFloat(data.igst).toFixed(2)}</Txt>
                                    <Txt style={{ textAlign: 'right' }} variant='bodyMedium'>NET:{"\n"}{parseFloat(data.netValue).toFixed(2)}</Txt>
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
                            <Text style={[scss.highText, { textAlign: 'right' }]}>RT CLAIM AMOUNT:{"\n"}{parseFloat(item.returnSlipAmount).toFixed(2)}</Text>
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
