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
import Icon from 'react-native-vector-icons/FontAwesome';
import IconMA from 'react-native-vector-icons/MaterialCommunityIcons';
import forms from '../../commonUtils/assets/styles/formFields.scss';
import scss from '../../commonUtils/assets/styles/style.scss';
import { RF, RH, RW } from '../../Responsive';
import ReportsService from '../services/ReportsService';
var deviceWidth = Dimensions.get("window").width;
var deviceheight = Dimensions.get("window").height;

export class ListOfEstimationSlip extends Component {

  constructor(props) {
    super(props);
    this.state = {
      deleteEstimationSlip: false,
      viewEstimationsSlipList: [],
      viewEstimationsSlipSubList: [],
      modalVisible: true,
      date: new Date(),
      enddate: new Date(),
      fromDate: "",
      toDate: "",
      startDate: "",
      endDate: "",
      datepickerOpen: false,
      datepickerendOpen: false,
      dsnumber: "",
      qty: "",
      mrp: '',
      promodisc: '',
      statuses: [],
      dsStatus: "",
      dsNumber: "",
      barcode: "",
      flagViewDetail: false,
      storeId: 0,
      filterActive: false,
      estimationSlips: [],
      flagFilterOpen: false
    };
  }

  componentDidMount () {
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

  filterAction () {
    this.setState({ flagFilterOpen: true, modalVisible: true });
  }


  handledeleteEstimationSlip (item, index) {
    this.setState({ deleteEstimationSlip: true, modalVisible: true, flagViewDetail: false });
  }

  handleviewEstimationSlip (item, index) {
    console.log({ item });
    this.state.viewEstimationsSlipList.push(item);
    this.setState({ viewEstimationsSlipList: this.state.viewEstimationsSlipList, flagViewDetail: true });
  }



  deleteEstimationSlip = (item, index) => {
    alert("you have deleted", index);
  };

  estimationModelCancel () {
    this.setState({ modalVisible: false });
  }

  datepickerClicked () {
    this.setState({ datepickerOpen: true });
  }

  enddatepickerClicked () {
    this.setState({ datepickerendOpen: true });
  }

  datepickerDoneClicked () {
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

  datepickerendDoneClicked () {
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

  handleDsStatus = (value) => {
    this.setState({ dsStatus: value });
  };

  handleDsNumber = (value) => {
    this.setState({ dsNumber: value });
  };

  handleBarCode = (value) => {
    this.setState({ barcode: value });
  };

  datepickerCancelClicked () {
    this.setState({ date: new Date(), enddate: new Date(), datepickerOpen: false, datepickerendOpen: false });
  }

  applyEstimationSlipFilter () {
    if (this.state.startDate === "") {
      this.state.startDate = null;
    }
    if (this.state.endDate === "") {
      this.state.endDate = null;
    }
    if (this.state.dsStatus === "") {
      this.state.dsStatus = null;
    }
    if (this.state.barcode === "") {
      this.state.barcode = null;
    }
    if (this.state.dsNumber === "") {
      this.state.dsNumber = null;
    }

    const obj = {
      "dateFrom": this.state.startDate,
      "dateTo": this.state.endDate,
      status: this.state.dsStatus,
      barcode: this.state.barcode,
      dsNumber: this.state.dsNumber,
      storeId: this.state.storeId,
    };


    console.log('params are' + JSON.stringify(obj));
    this.setState({ loading: true });
    let pageNumber = 0;
    console.log(ReportsService.estimationSlips());
    ReportsService.estimationSlips(obj, pageNumber).then((res) => {
      console.log(res.data.result.deliverySlip);
      if (res.data && res.data[ "isSuccess" ] === "true") {
        if (res.data.result.length !== 0) {
          this.setState({ filterActive: true });
          this.setState({ estimationSlips: res.data.result.deliverySlip.content });
          this.setState({ modalVisible: false, flagFilterOpen: false });
        } else {
          alert("records not found");
        }
        this.setState({ startDate: "", endDate: "", dsStatus: "", barcode: "", dsNumber: "" });
        console.log(this.props.estimationSlip);
      }
      else {
        alert(res.data.message);
        this.props.modelCancelCallback();
        this.setState({ startDate: "", endDate: "", dsStatus: "", barcode: "", dsNumber: "" });
      }
    }
    ).catch(() => {
      this.setState({ loading: false });
      alert('No Results Found');
      this.props.modelCancelCallback();
      this.setState({ startDate: "", endDate: "", dsStatus: "", barcode: "", dsNumber: "" });
    });

  }

  modelCancel () {
    this.setState({ modalVisible: false, flagFilterOpen: false, deleteEstimationSlip: false, flagViewDetail: false });
  }

  clearFilterAction () {
    this.setState({ filterActive: false, estimationSlips: [], fromDate: "", toDate: "", dsStatus: "", dsNumber: "", barcode: "", flagViewDetail: false, flagFilterOpen: false });
  }

  closeViewAction () {
    this.setState({ flagViewDetail: false, viewEstimationsSlipList: [], viewEstimationsSlipSubList: [] });
  }

  render () {
    return (
      <View>
        <FlatList
          data={this.state.estimationSlips}
          ListHeaderComponent={
            <Appbar>
              <Appbar.Content title="List Of Estimation Slips" />
              {this.state.filterActive ?
                <Icon
                  name="sliders"
                  size={25}
                  style={{ marginRight: 10 }}
                  color="#ed1c24"
                  onPress={() => this.clearFilterAction()}
                ></Icon> :
                <Icon
                  name="sliders"
                  size={25}
                  style={[ { marginRight: 10 }, scss.action_icons ]}
                  onPress={() => this.filterAction()}
                ></Icon>
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
                    <Text style={scss.textStyleLight} >{I18n.t("DS STATUS")}: {"\n"}{item.status} </Text>
                  </View>
                  <View style={scss.textContainer}>
                    <Text style={scss.textStyleMedium}> {I18n.t("DS NUMBER")}: {"\n"} {item.dsNumber}</Text>
                    <Text style={scss.textStyleLight}>{I18n.t("DS DATE")}: {"\n"} {item.lastModified} </Text>
                  </View>
                  <View style={scss.textContainer}>
                    <Text style={scss.textStyleLight}>{I18n.t("GROSS AMOUNT")}: {"\n"} ₹{item.netAmount}</Text>
                    <Text style={scss.textStyleLight}>{I18n.t("PROMO DISC")}: {"\n"} {item.promoDisc} </Text>
                  </View>
                  <View style={scss.textContainer}>
                    <Text style={scss.textStyleLight} >{I18n.t("NET AMOUNT")}:{"\n"} ₹{item.netAmount} </Text>
                  </View>
                  <View style={scss.flatListFooter}>
                    <Text style={scss.footerText}>
                      {I18n.t("DATE")}:
                      {item.lastModifiedDate ? item.lastModifiedDate.toString().split(/T/)[ 0 ]
                        : item.lastModifiedDate}
                    </Text>
                    <View style={scss.buttonContainer}>
                      <Icon
                        name="eye"
                        size={25}
                        style={[ { paddingRight: 10 }, scss.action_icons ]}
                        onPress={() => this.handleviewEstimationSlip(item, index)}
                      ></Icon>
                      <IconMA
                        style={scss.action_icons}
                        name="trash-can-outline"
                        size={25}
                        onPress={() => this.handledeleteEstimationSlip(item, index)}
                      ></IconMA>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          )}
        />
        {this.state.deleteEstimationSlip && (
          <View>
            <Modal isVisible={this.state.modalVisible} style={{ margin: 0 }}
              onBackButtonPress={() => this.estimationModelCancel()}
              onBackdropPress={() => this.estimationModelCancel()} >
              <View style={[ styles.deleteMainContainer, { backgroundColor: "#ED1C24" } ]}>
                <View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: RH(5), height: Device.isTablet ? RH(60) : RH(50) }}>
                    <View>
                      <Text style={{ marginTop: RH(15), fontSize: Device.isTablet ? RF(22) : RF(17), marginLeft: Device.isTablet ? RW(10) : 5, color: '#ffffff' }} > {I18n.t("Delete Estimation Slip")} </Text>
                    </View>
                    <View>
                      <TouchableOpacity style={{ width: Device.isTablet ? RW(60) : RW(50), height: Device.isTablet ? RH(60) : RH(50), marginTop: Device.isTablet ? RH(20) : RH(15), }} onPress={() => this.estimationModelCancel()}>
                        <Image style={{ margin: RH(5), height: Device.isTablet ? RH(20) : RH(15), width: Device.isTablet ? RW(20) : RW(15), }} source={require('../assets/images/modalCloseWhite.png')} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={{
                    height: Device.isTablet ? 2 : 1,
                    width: deviceWidth,
                    backgroundColor: 'lightgray',
                  }}></Text>
                </View>
                <View style={{ backgroundColor: "#ffffff", height: Device.isTablet ? RH(300) : RH(250) }}>
                  <Text style={{
                    // height: Device.isTablet ? 40 : 20,
                    textAlign: 'center',
                    fontFamily: 'regular',
                    marginTop: 15,
                    fontSize: Device.isTablet ? RF(23) : RF(18),
                    color: '#353C40'
                  }}> {I18n.t("Are you sure want to delete Estimation Slip")} ?  </Text>
                  <TouchableOpacity
                    style={[ Device.isTablet ? styles.filterApplyButton_tablet : styles.filterApplyButton_mobile, { marginTop: Device.isTablet ? RH(40) : RH(30) } ]} onPress={() => this.deleteEstimationSlip(item, index)}
                  >
                    <Text style={Device.isTablet ? styles.filterButtonText_tablet : styles.filterButtonText_mobile}  > {I18n.t("DELETE")} </Text>

                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[ Device.isTablet ? styles.filterCancelButton_tablet : styles.filterCancelButton_mobile, { borderColor: '#ED1C24', } ]} onPress={() => this.estimationModelCancel()}
                  >
                    <Text style={[ Device.isTablet ? styles.filterButtonCancelText_tablet : styles.filterButtonCancelText_mobile, { color: '#ED1C24' } ]}  > {I18n.t("CANCEL")} </Text>

                  </TouchableOpacity>
                </View>

              </View>
            </Modal>
          </View>
        )}

        {this.state.flagFilterOpen && (
          <View>
            <Modal isVisible={this.state.modalVisible} style={{ margin: 0 }}
              onBackButtonPress={() => this.modelCancel()}
              onBackdropPress={() => this.modelCancel()} >
              <View style={styles.filterMainContainer} >
                <View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: RH(5), height: Device.isTablet ? RH(60) : RH(50) }}>
                    <View>
                      <Text style={{ marginTop: RH(15), fontSize: Device.isTablet ? RF(22) : RF(17), marginLeft: RW(20) }} > {I18n.t("Filter By")} </Text>
                    </View>
                    <View>
                      <TouchableOpacity style={{ width: Device.isTablet ? RW(60) : RW(50), height: Device.isTablet ? RH(60) : RH(50), marginTop: Device.isTablet ? RH(20) : RH(15), }} onPress={() => this.modelCancel()}>
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
                  <View style={[ styles.rnSelectContainer_mobile, { width: deviceWidth - 30 } ]}>
                    <RNPickerSelect
                      // style={Device.isTablet ? styles.rnSelect_tablet : styles.rnSelect_mobile}
                      placeholder={{
                        label: 'DS STATUS'
                      }}
                      Icon={() => {
                        return <Chevron style={styles.imagealign} size={1.5} color="gray" />;
                      }}
                      items={[
                        { label: 'Completed', value: 'Completed' },
                        { label: 'Pending', value: 'Pending' },
                        { label: 'Cancelled', value: 'Cancelled' },
                      ]}
                      onValueChange={this.handleDsStatus}
                      style={pickerSelectStyles_mobile}
                      value={this.state.dsStatus}
                      useNativeAndroidPickerStyle={false}
                    />


                  </View>
                  <TextInput
                    outlineColor='#d8d8d8'
                    mode='outlined'
                    activeOutlineColor='#d8d8d8'
                    style={forms.input_fld}
                    underlineColorAndroid="transparent"
                    placeholder={I18n.t("DS NUMBER")}
                    placeholderTextColor="#6F6F6F"
                    textAlignVertical="center"
                    autoCapitalize="none"
                    value={this.state.dsNumber}
                    onChangeText={this.handleDsNumber}
                  />
                  <TextInput
                    outlineColor='#d8d8d8'
                    mode='outlined'
                    activeOutlineColor='#d8d8d8'
                    style={forms.input_fld}
                    underlineColorAndroid="transparent"
                    placeholder={I18n.t("BARCODE")}
                    placeholderTextColor="#6F6F6F"
                    textAlignVertical="center"
                    autoCapitalize="none"
                    value={this.state.barcode}
                    onChangeText={this.handleBarCode}
                  />
                  <View style={forms.action_buttons_container}>
                    <TouchableOpacity style={[ forms.action_buttons, forms.submit_btn ]}
                      onPress={() => this.applyEstimationSlipFilter()}>
                      <Text style={forms.submit_btn_text} >{I18n.t("APPLY")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[ forms.action_buttons, forms.cancel_btn ]}
                      onPress={() => this.modelCancel()}>
                      <Text style={forms.cancel_btn_text}>{I18n.t("CANCEL")}</Text>
                    </TouchableOpacity>
                  </View>
                </KeyboardAwareScrollView>
              </View>
            </Modal>
          </View>
        )}

        {this.state.flagViewDetail && (
          <View>
            <Modal isVisible={this.state.flagViewDetail} onBackdropPress={() => this.closeViewAction()} style={{ margin: 0 }}>
              <View style={scss.model_container}>
                <FlatList
                  scrollEnabled={false}
                  data={this.state.viewEstimationsSlipList}
                  removeClippedSubviews={false}
                  ListHeaderComponent={
                    <View style={scss.model_header}>
                      <View>
                        <Txt variant='titleLarge'>View EstimationSlip</Txt>
                      </View>
                      <IconMA
                        style={scss.action_icons}
                        name='close'
                        size={20}
                        onPress={() => this.closeViewAction()}
                      />
                    </View>
                  }
                  renderItem={({ item, index }) => (
                    <View>
                      <View style={{ margin: 10 }}>
                        <Txt style={{ textAlign: 'center' }} selectable={true} variant="titleMedium">{item.dsNumber}</Txt>
                      </View>
                      <View style={scss.model_subContainer}>
                        <ScrollView>
                          {item.lineItems.map((item, index) => {
                            return (
                              <View id={index} style={scss.model_subbody}>
                                <View style={scss.model_text_container}>
                                  <Txt variant='bodyMedium' style={{ textAlign: 'left' }}>Barcode:{"\n"}{item.barCode}</Txt>
                                  <Txt variant='bodyMedium' style={{ textAlign: 'right' }}>SM:{"\n"}{item.userId}</Txt>
                                </View>
                                <View style={scss.model_text_container}>
                                  <Txt variant='bodyMedium' style={{ textAlign: 'left' }}>QTY:{"\n"}{item.quantity}</Txt>
                                  <Txt variant='bodyMedium' style={{ textAlign: 'right' }}>Item MRP:{"\n"}{item.netValue}</Txt>
                                </View>
                                <View style={scss.model_text_container}>
                                  <Txt variant='bodyMedium' style={{ textAlign: 'left' }}>Gross Amount:{"\n"}{item.grossValue}</Txt>
                                  <Txt variant='bodyMedium' style={{ textAlign: 'right' }}>Promo Discount:{"\n"}{item.discount}</Txt>
                                </View>
                                <View style={scss.model_text_container}>
                                  <Txt variant='bodyMedium' style={{ textAlign: 'left' }}>Net Amount:{"\n"}{item.netValue}</Txt>
                                </View>
                              </View>
                            );
                          })}
                        </ScrollView>
                      </View>
                      <View>
                        <TouchableOpacity onPress={() => this.closeViewAction()} style={[ forms.action_button, forms.cancel_btn ]}>
                          <Text style={forms.cancel_btn_text}>Close</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                />
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
    fontSize: RF(14),
  },
  inputIOS: {
    justifyContent: 'center',
    height: RH(42),
    borderRadius: 3,
    borderWidth: Device.isTablet ? 2 : 1,
    fontFamily: 'regular',
    //paddingLeft: -20,
    fontSize: RF(14),
    borderColor: '#FBFBFB',
    backgroundColor: '#FBFBFB',
  },
  inputAndroid: {
    justifyContent: 'center',
    height: RF(44),
    width: '100%',
    borderRadius: 3,
    borderWidth: Device.isTablet ? 2 : 1,
    fontFamily: 'regular',
    fontSize: RF(14),
    borderColor: '#FBFBFB',
    backgroundColor: '#FBFBFB',
    color: '#001B4A',
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
    height: RH(52),
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
    height: RH(52),
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
    marginTop: Device.isTablet ? RH(25) : RH(20),
    marginRight: Device.isTablet ? RW(30) : RW(20),
  },
  modelCloseImage: {
    fontFamily: 'regular',
    fontSize: RF(12),
    position: 'absolute',
    top: RH(10),
    right: Device.isTablet ? RW(20) : RW(30),
  },
  deleteMainContainer: {
    // marginLeft: -40,
    // marginRight: -40,
    // paddingLeft: Device.isTablet ? 0 : 20,
    backgroundColor: '#ffffff',
    marginTop: Device.isTablet ? deviceheight - RW(350) : deviceheight - RW(240),
    height: Device.isTablet ? RH(350) : RH(300),
  },
  filterMainContainer: {
    // marginLeft: -40,
    // marginRight: -40,
    // paddingLeft: Device.isTablet ? 0 : 20,
    backgroundColor: '#ffffff',
    marginTop: Device.isTablet ? deviceheight - RH(630) : deviceheight - RH(530),
    height: Device.isTablet ? RH(630) : RH(530),
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

  // Styles For Mobile

  filterMainContainer_mobile: {
    width: deviceWidth,
    alignItems: 'center',
    marginLeft: -RW(20),
    backgroundColor: "#ffffff",
    height: RH(530),
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
    marginTop: RH(5),
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
    height: RH(45),
    marginTop: RH(5),
    marginBottom: RH(10),
    borderColor: '#d8d8d8',
    borderRadius: 3,
    backgroundColor: '#FFF',
    borderWidth: 1,
    fontFamily: 'regular',
    paddingLeft: RW(15),
    fontSize: 14,
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
    width: RW(300),
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
  //////////////
  filterCancel_mobile: {
    width: deviceWidth - 20,
    height: 50,
    backgroundColor: "#ffffff",
    borderRadius: 5,
    borderWidth: Device.isTablet ? 2 : 1,
    borderColor: "#353C4050",
  },
  viewtext_tablet: {
    color: "#353C40",
    fontFamily: "regular",
    fontSize: 22,
    justifyContent: 'center',
  },
  viewtext_mobile: {
    color: "#353C40",
    fontFamily: "regular",
    fontSize: 14,
  },
  viewsubtext_tablet: {
    color: "#353C40",
    fontFamily: "bold",
    alignItems: 'center',
    marginLeft: 16,
    fontSize: 22,
  },
  viewsubtext_mobile: {
    color: "#353C40",
    fontFamily: "bold",
    alignItems: 'center',
    marginLeft: 16,
    fontSize: 14,
  },

  viewtext1_tablet: {
    color: "#353C40",
    fontFamily: "regular",
    fontSize: 22,

  },
  viewsubtext1_tablet: {
    color: "#353C40",
    fontFamily: "bold",
    fontSize: 22,
  },

  viewtext1_mobile: {
    color: "#353C40",
    fontSize: 14,
  },

  viewsubtext1_mobile: {
    color: "#353C40",
    fontFamily: "bold",
    fontSize: 14,
  },
  viewtext2_tablet: {
    color: "#353C40",
    fontFamily: "regular",
    fontSize: 22,
  },
  viewsubtext2_tablet: {
    color: "#353C40",
    fontFamily: "bold",
    fontSize: 22,
  },

  viewtext2_mobile: {
    color: "#353C40",
    fontFamily: "regular",
    fontSize: 14,
  },

  viewsubtext2_mobile: {
    color: "#353C40",
    fontFamily: "bold",
    fontSize: 14,
  },
  viewtext3_tablet: {
    color: "#353C40",
    fontFamily: "regular",
    fontSize: 22,
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
  filterCancel_tablet: {
    width: deviceWidth - 40,
    height: 60,
    backgroundColor: "#ffffff",
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#353C4050",
  },
  ////////
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
    width: RW(60), height: RW(60),
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
    width: deviceWidth - 40,
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
    paddingRight: RW(10),
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
    width: RW(30),
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
    width: RF(50),
    height: RF(50),
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
    borderWidth: Device.isTablet ? 2 : 1,
    borderColor: "lightgray",
    // borderRadius:5,
  },
  deleteButton_tablet: {
    width: RF(50),
    height: RF(50),
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5,
    borderWidth: Device.isTablet ? 2 : 1,
    borderColor: "lightgray",
  },




});
