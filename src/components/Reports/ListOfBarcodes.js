import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import Device from 'react-native-device-detection';
import I18n from 'react-native-i18n';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import { Appbar, Text as Txt, TextInput } from 'react-native-paper';
import IconFA from 'react-native-vector-icons/FontAwesome';
import IconMA from 'react-native-vector-icons/MaterialCommunityIcons';
import forms from '../../commonUtils/assets/styles/formFields.scss';
import scss from '../../commonUtils/assets/styles/style.scss';
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
      flagFilterOpen: false,
      barcode: "",
      mrp: "",
      qty: "",
      listBarcodes: [],
      filterActive: false,
      viewBarcodeList: [],
      loadMoreActive: false,
      totalPages: 0,
      pageNo: 0,
      loadPrevActive: false,
      loadNextActive: true
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

  filterAction() {
    this.setState({ flagFilterOpen: true, modalVisible: true });
  }

  clearFilterAction() {
    this.setState({
      loadMoreActive: false, loadNextActive: false,
      filterActive: false, listBarcodes: [], startDate: "", endDate: "", empId: "", fromPrice: "", toPrice: "", barCode: "", flagFilterOpen: false, flagViewDetail: false
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
    let pageNumber = 0;
    ReportsService.getListOfBarcodes(obj, this.state.pageNo).then((res) => {
      console.log(res.data.result.totalPages);
      if (res.data && res.data["isSuccess"] === "true") {
        if (res.data.result.length !== 0) {
          this.setState({
            listBarcodes: res.data.result.content,
            totalPages:res.data.result.totalPages,
            filterActive: true, modalVisible: false, flagFilterOpen: false
          });
        } else {
          alert("records not found");
        }
        this.continuePagination()
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

  loadMoreList = (value) => {
    if (value >= 0 && value < this.state.totalPages) {
      this.setState({ pageNo: value }, () => {
        this.applyListBarcodes();
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


  modelCancel() {
    this.setState({ flagFilterOpen: false, modalVisible: false });
  }

  estimationModelCancel() {
    this.setState({ modalVisible: false });
  }

  handledeleteBarcode() {
    this.setState({ flagdelete: true, modalVisible: true, flagViewDetail: false });
  }

  handleviewBarcode(item, index) {
    console.log({ item });
    this.state.viewBarcodeList.push(item);
    this.setState({ viewBarcodeList: this.state.viewBarcodeList });
    this.setState({ flagViewDetail: true, modalVisible: true, flagdelete: false });
  }

  closeViewAction() {
    this.setState({ flagViewDetail: false, viewBarcodeList: [] });
  }

  render() {
    return (
      <View>
        <FlatList
          ListHeaderComponent={
            <Appbar>
              <Appbar.Content title={`List Of Barcodes - ${this.state.listBarcodes.length}`} />
              {this.state.filterActive ?
                <IconFA
                  name="sliders"
                  size={25}
                  style={{ marginRight: 10 }}
                  color="#ed1c24"
                  onPress={() => this.clearFilterAction()}
                ></IconFA> :
                <IconFA
                  style={[scss.action_icons, { marginRight: 10 }]}
                  name="sliders"
                  color="#000"
                  size={25}
                  onPress={() => this.filterAction()}
                ></IconFA>
              }
            </Appbar>
          }
          data={this.state.listBarcodes}
          scrollEnabled={true}
          keyExtractor={(item, i) => i.toString()}
          ListEmptyComponent={<Text style={{ fontSize: Device.isTablet ? RF(21) : RF(17), fontFamily: 'bold', color: '#000000', textAlign: 'center', marginTop: deviceheight / 3 }}>&#9888; {I18n.t("Results not loaded")}</Text>}
          renderItem={({ item, index }) => (
            <ScrollView>
              <View style={scss.flatListContainer} >
                <View style={scss.flatListSubContainer}>
                  <View style={scss.textContainer}>
                    <Text style={scss.highText} >SNO: {index + 1} </Text>
                    <Text style={scss.textStyleMedium}>{item.barcode}</Text>
                  </View>
                  <View style={scss.textContainer}>
                    <Text style={scss.textStyleLight}>{I18n.t("BARCODE STORE")}: {"\n"}{this.state.storeName} </Text>
                    <Text style={scss.textStyleLight} >{I18n.t("EMP ID")}: {"\n"}{item.empId} </Text>
                  </View>
                  <View style={scss.textContainer}>
                    <Text style={scss.textStyleLight}>QTY: {"\n"} {item.qty}</Text>
                    <Text style={scss.textStyleLight}>{I18n.t("MRP")}:{"\n"} {item.itemMrp}</Text>
                  </View>
                  <View style={scss.flatListFooter}>
                    <Text style={scss.footerText}>
                      {I18n.t("DATE")}:
                      {item.lastModifiedDate ? item.lastModifiedDate.toString().split(/T/)[0]
                        : item.lastModifiedDate}
                    </Text>
                    <View style={{ marginRight: Device.isTablet ? RW(30) : RW(20) }}>
                      <IconFA
                        style={scss.action_icons}
                        name='eye'
                        size={25}
                        onPress={() => this.handleviewBarcode(item, index)}
                      ></IconFA>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          )
          }
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

        {
          this.state.flagFilterOpen && (
            <View>
              <Modal style={{ margin: 0 }} isVisible={this.state.modalVisible}
                onBackButtonPress={() => this.modelCancel()}
                onBackdropPress={() => this.modelCancel()} >
                <View style={forms.filterModelContainer}>
                  <Text style={forms.popUp_decorator}>-</Text>
                  <View style={forms.filterModelSub}>
                    <KeyboardAwareScrollView>
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
                        value={this.state.barCode}
                        onChangeText={this.handleBarCode}
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
                      <TextInput
                        outlineColor='#d8d8d8'
                        mode='outlined'
                        activeOutlineColor='#d8d8d8'
                        style={forms.input_fld}
                        underlineColorAndroid="transparent"
                        placeholder={I18n.t("PRICE <")}
                        placeholderTextColor="#6F6F6F"
                        textAlignVertical="center"
                        autoCapitalize="none"
                        value={this.state.fromPrice}
                        onChangeText={this.handleFromPrice}
                      />
                      <TextInput
                        outlineColor='#d8d8d8'
                        mode='outlined'
                        activeOutlineColor='#d8d8d8'

                        style={forms.input_fld}
                        underlineColorAndroid="transparent"
                        placeholder={I18n.t("PRICE >")}
                        placeholderTextColor="#6F6F6F"
                        textAlignVertical="center"
                        autoCapitalize="none"
                        value={this.state.toPrice}
                        onChangeText={this.handleToPrice}
                      />
                      <View style={forms.action_buttons_container}>

                        <TouchableOpacity style={[forms.action_buttons, forms.submit_btn]}
                          onPress={() => this.applyListBarcodes()}>
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
          )
        }

        {
          this.state.flagViewDetail && (
            <View>
              <Modal style={{ margin: 0 }}
                isVisible={this.state.flagViewDetail}
                onBackButtonPress={() => this.closeViewAction()}
                onBackdropPress={() => this.closeViewAction()} >
                <View style={scss.model_container}>
                  <FlatList
                    data={this.state.viewBarcodeList}
                    removeClippedSubviews={false}
                    keyExtractor={(item, i) => i.toString()}
                    scrollEnabled={false}
                    ListHeaderComponent={
                      <View style={scss.model_header}>
                        <View>
                          <Txt variant='titleLarge'>View Barcode</Txt>
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
                      <View key={index}>
                        <ScrollView>
                          <View style={scss.model_subbody}>
                            <View style={scss.model_text_container}>
                              <Txt variant='titleMedium' selectable={true} style={{ textAlign: 'left' }}>Barcode:{"\n"}{item.barcode}</Txt>
                              <Txt variant='bodyMedium' style={{ textAlign: 'right' }}>HsnCode:{"\n"}{item.hsnCode}</Txt>
                            </View>
                            <View style={scss.model_text_container}>
                              <Txt variant='bodyMedium' style={{ textAlign: 'left' }}>BatchNo:{"\n"}{item.batchNo}</Txt>
                              <Txt variant='bodyMedium' style={{ textAlign: 'right' }}>Category:{"\n"}{item.categoryName}</Txt>
                            </View>
                            <View style={scss.model_text_container}>
                              <Txt variant='bodyMedium' style={{ textAlign: 'left' }}>Division:{"\n"}{item.divisionName}</Txt>
                              <Txt variant='bodyMedium' style={{ textAlign: 'right' }}>Domain:{"\n"}{item.domainType}</Txt>
                            </View>
                            <View style={scss.model_text_container}>
                              <Txt variant='bodyMedium' style={{ textAlign: 'left' }}>Name:{"\n"}{item.name}</Txt>
                              <Txt variant='bodyMedium' style={{ textAlign: 'right' }}>EmpId:{"\n"}{item.empId}</Txt>
                            </View>
                            <View style={scss.model_text_container}>
                              <Txt variant='bodyMedium' style={{ textAlign: 'left' }}>CostPrice:{"\n"}{item.costPrice}</Txt>
                              <Txt variant='bodyMedium' style={{ textAlign: 'left' }}>MRP:{"\n"}{item.itemMrp}</Txt>
                            </View>
                            <View style={scss.model_text_container}>
                              <Txt variant='bodyMedium' style={{ textAlign: 'left' }}>CreatedDate:{"\n"}{item.originalBarcodeCreatedAt}</Txt>
                            </View>
                          </View>
                        </ScrollView>
                      </View>
                    )}
                  />
                </View>
              </Modal>
            </View>
          )
        }

      </View >
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
