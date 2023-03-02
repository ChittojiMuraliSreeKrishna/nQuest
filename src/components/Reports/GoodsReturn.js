import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Device from 'react-native-device-detection';
import I18n from 'react-native-i18n';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import { Appbar, Text as TEXT, TextInput } from 'react-native-paper';
import IconFA, { default as FilterIcon, default as Icon } from 'react-native-vector-icons/FontAwesome';
import IconMA from 'react-native-vector-icons/MaterialCommunityIcons';
import forms from '../../commonUtils/assets/styles/formFields.scss';
import scss from "../../commonUtils/assets/styles/style.scss";
import Clipbrd from "../../commonUtils/Clipboard";
import { formatDate } from '../../commonUtils/DateFormate';
import DateSelector from '../../commonUtils/DateSelector';
import Loader from '../../commonUtils/loader';
import RnPicker from '../../commonUtils/RnPicker';
import { RH } from '../../Responsive';
import ReportsService from '../services/ReportsService';
import { emptyTextStyle } from '../Styles/FormFields';
import { flatListMainContainer, flatlistSubContainer, highText, textContainer, textStyleSmall } from '../Styles/Styles';



var deviceWidth = Dimensions.get("window").width;
var deviceheight = Dimensions.get("window").height;


const pickerData = [
  { value: 'PENDING', label: 'Pending', },
  { value: 'COMPLETED', label: 'Completed', },
]
export class GoodsReturn extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: true,
      flagDeleteGoodsReturn: false,
      date: new Date(),
      enddate: new Date(),
      startDate: "",
      endDate: "",
      fromDate: "",
      toDate: "",
      returnSlipNumber: null,
      barCode: null,
      empId: "",
      storeId: null,
      domainId: 0,
      goodsReturn: [],
      flagFilterGoodsReturn: false,
      rtStatus: null,
      createdBy: null,
      loadMoreActive: false,
      totalPages: 0,
      pageNo: 0,
      loading: false,
      filterActive: false,
      loadPrevActive: false,
      loadNextActive: true,
      viewGoods: [],
      flagViewGoods: false,
      viewItems: [],
      pageNo: 0
    };
  }

 async componentDidMount() {
    if (global.domainName === "Textile") {
      this.setState({ domainId: 1 });
    }
    else if (global.domainName === "Retail") {
      this.setState({ domainId: 2 });
    }
    else if (global.domainName === "Electrical & Electronics") {
      this.setState({ domainId: 3 });
    }

    const storeId = await AsyncStorage.getItem("storeId");
    this.setState({ storeId: storeId });

  }


  datepickerClicked() {
    this.setState({ datepickerOpen: true });
  }

  enddatepickerClicked() {
    this.setState({ datepickerendOpen: true });
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

  handleDate = (value) => {
    this.setState({ startDate: value });
  };

  handleEndDate = (value) => {
    this.setState({ endDate: value });
  };

  applyGoodsReturn(pageNumber) {
    this.setState({ loading: true, loadMoreActive: false });
    const obj = {
      dateFrom: this.state.startDate ? this.state.startDate : undefined,
      dateTo: this.state.endDate ? this.state.endDate : undefined,
      rtStatus: this.state.rtStatus ? this.state.rtStatus : null,
      // createdBy: this.state.createdBy ? this.state.createdBy : undefined,
      rtNumber: this.state.returnSlipNumber ? (this.state.returnSlipNumber).trim() : null,
      barcode: this.state.barCode ? (this.state.barCode).trim() : null,
      // domainId: this.state.domainId ? parseInt(this.state.domainId) : undefined,
      storeId: this.state.storeId ? parseInt(this.state.storeId) : null,
    };
    // console.log('params are' + JSON.stringify(obj), this.state.pageNo);
    ReportsService.returnSlips(obj, this.state.pageNo).then((res) => {
      if (res.data) {
        if (res.data.result.length !== 0) {
          res.data.result.content.map((prop, i) => {
            let barcodeData = "";
            if (prop.barcodes.length > 0) {
              barcodeData = Array.prototype.map
                .call(prop.barcodes, function (item) {
                  return item.barCode;
                })
                .join(",");
            }
            prop.barcodeVal = barcodeData;
            prop.review = false;
          });
          this.setState({ filterActive: true ,modalVisible:false});
          this.setState({
            loading: false,
            goodsReturn: res.data.result.content,
            // rsDetailsList: res.data.result.content,
            totalPages: res.data.result.totalPages
          });
          this.continuePagination();
          // this.modelCancel();
        } else {
          alert("Results Not Found");
          this.modelCancel();
        }
      }
      else {
        alert(res.data.message);
        this.setState({ loading: false });
        this.modelCancel();
      }
    })
  }

  loadMoreList = (value) => {
    if (value >= 0 && value < this.state.totalPages) {
      this.setState({ pageNo: value }, () => {
        this.applyGoodsReturn();
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

  continuePagination(value) {
    if (this.state.totalPages > 1) {
      this.setState({ loadMoreActive: true });
    } else {
      this.setState({ loadMoreActive: false, loadNextActive: false });
    }
  }


  handleReturnSlipNumber = (value) => {
    this.setState({ returnSlipNumber: value });
  };

  handleBarCode = (value) => {
    this.setState({ barCode: value });
  };

  handleEmpId = (value) => {
    this.setState({ empId: value });
  };

  handledeleteNewSale() {
    this.setState({ flagDeleteGoodsReturn: true, modalVisible: true });
  }


  filterAction() {
    this.setState({ flagFilterGoodsReturn: true, modalVisible: true });
  }

  modelCancel() {
    this.setState({
      flagFilterGoodsReturn: false, modalVisible: false,
      startDate: '', endDate: '',
      returnSlip: '', barCode: '',
      rtStatus: ''
    });
  }

  handleRTStatus = (value) => {
    this.setState({ rtStatus: value });
  };

  clearFilterAction() {
    this.setState({
      loadMoreActive: false, loadNextActive: false,
      filterActive: false, flagFilterGoodsReturn: false, modalVisible: false,
      startDate: "", endDate: "",
      returnSlip: "", barCode: "",
      rtStatus: "", goodsReturn: [], returnSlipNumber: ""
    });
  }

  handleViewGoods(item, index) {
    const rtNumber = item.rtNumber;
    let items = [];
    items.push(item);
    // console.log({ item }, rtNumber);
    ReportsService.getReturnSlipDetails(rtNumber).then((res) => {
      if (res?.data?.result) {
        let data = res?.data?.result;
        // console.log({ data });
        let obj = {
          rtNo: "",
          createdDate: "",
          createdBy: "",
          amount: "",
          returnAmount: "",
          barCode: "",
          customerName: "",
          mobileNumber: ""
        };
        let detailsArr = [];
        data?.taggedItems?.map((d) => {
          obj = {
            rtNo: data.rtNo,
            createdDate: data.createdDate,
            createdBy: data.createdBy,
            amount: d.returnAmount,
            barCode: d.barCode,
            customerName: data.customerName,
            mobileNumber: data.mobileNumber
          };
          detailsArr.push(obj);
        });
        // console.log({ detailsArr });
        this.setState({ viewGoods: detailsArr, flagViewGoods: true, viewItems: items });
      }
    });
  }

  closeView() {
    this.setState({ viewGoods: [], flagViewGoods: false });
  }


  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <Appbar>
          <Appbar.Content title="Goods Return" />
          {this.state.filterActive ?
            <FilterIcon
              name="sliders"
              size={20}
              style={{ marginRight: 10 }}
              color="#ed1c24"
              onPress={() => this.clearFilterAction()}
            /> :
            <FilterIcon
              name="sliders"
              size={20}
              color="#000"
              style={{ marginRight: 10 }}
              onPress={() => this.filterAction()}
            />
          }
        </Appbar>
        {this.state.loading && <Loader loading={this.state.loading} />}
        <FlatList
          data={this.state.goodsReturn}
          scrollEnabled={true}
          removeClippedSubviews={false}
          keyExtractor={(item, i) => i.toString()}
          ListEmptyComponent={<Text style={emptyTextStyle}>&#9888; {I18n.t("Results not loaded")}</Text>}
          renderItem={({ item, index }) => (
            <View style={[flatListMainContainer, { backgroundColor: "#FFF" }]} >
              <View style={flatlistSubContainer}>
                <View style={textContainer}>
                  <Text style={highText} >S NO: {index + 1} </Text>
                  <Text style={textStyleSmall}>{I18n.t("RTS NUMBER")}:{"  "}<Clipbrd data={item.rtNumber} /> {"\n"}{item.rtNumber}</Text>
                  <Text style={textStyleSmall}>{I18n.t("BARCODE")}: {"\n"}{item && item.barcodes.length !== 0 ? item.barcodes[0].barCode : '-'}</Text>
                </View>
                <View style={textContainer}>
                  <Text style={textStyleSmall} >{I18n.t("EMP ID")}:{"\n"}{item.createdBy} </Text>
                  <Text style={textStyleSmall}>{I18n.t("RTS DATE & TIME")}: {"\n"} {formatDate(item.createdInfo)}</Text>
                  <Text style={textStyleSmall}>{I18n.t("AMOUNT")}: {"\n"} ₹{parseFloat(item.amount).toFixed(2)}</Text>
                </View>
                <View style={textContainer}>
                  <View style={styles.buttons}>
                    <TouchableOpacity onPress={() => this.handledeleteNewSale(item, index)}>
                      <IconMA
                        style={{ marginLeft: 5 }}
                        name='trash-can-outline'
                        size={20}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.handleViewGoods(item, index)}>
                      <Icon
                        name='eye'
                        style={{ marginLeft: 5 }}
                        size={20}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
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
        {this.state.flagViewGoods && (
          <View>
            <Modal isVisible={this.state.flagViewGoods} style={{ margin: 0 }} onBackdropPress={() => this.closeView()}>
              <View style={forms.filterModelContainer}>
                <Text style={forms.popUp_decorator}>-</Text>
                <View style={forms.filterModelSub}>
                  <View>
                    {this.state.viewItems.map((data) => {
                      return (
                        <View style={scss.model_text_container}>
                          <TEXT variant='titleMedium' style={{ color: '#bbb' }}>Return Memo No:{"\n"}<TEXT style={{ color: '#ed1c24' }}>{data.rtNumber}{"  "} <Clipbrd data={data.rtNumber} /> </TEXT></TEXT>
                          <TEXT variant='titleMedium' style={{ color: '#bbb' }}>DATE:{"\n"}<TEXT style={{ color: '#000' }}>{formatDate(data.createdInfo)}</TEXT></TEXT>
                        </View>
                      );
                    })}
                  </View>
                  <FlatList
                    data={this.state.viewGoods}
                    removeClippedSubviews={false}
                    renderItem={({ item, index }) => (
                      <View style={{ borderBottomWidth: 1, borderBottomColor: '#bbb', backgroundColor: '#ddd' }}>
                        <View style={scss.model_text_container}>
                          <TEXT>RTNO: {item.rtNo}</TEXT>
                        </View>
                        <View style={scss.model_text_container}>
                          <TEXT variant='titleLight'>Date:{"\n"}{formatDate(item.createdDate)}</TEXT>
                          <TEXT variant='titleLight' style={{ textAlign: 'right' }}>CustomerName:{"\n"}{item.customerName}</TEXT>
                        </View>
                        <View style={scss.model_text_container}>
                          <TEXT variant='titleLight'>Barcode:{"\n"}{item.barCode}</TEXT>
                          <TEXT variant='titleLight' style={{ textAlign: 'right' }}>Amount:{"\n"}{parseFloat(item.amount).toFixed(2)}</TEXT>
                        </View>
                        <View style={scss.model_text_container}>
                          <TEXT variant='titleLight'>EMPID:{"\n"}{item.createdBy}</TEXT>
                          <TEXT variant='titleLight' style={{ textAlign: 'right' }}>Mobile:{"\n"}{item.mobileNumber}</TEXT>
                        </View>
                      </View>
                    )}
                  />
                </View>
              </View>
            </Modal>
          </View>
        )}

        {this.state.flagFilterGoodsReturn && (
          <View>
            <Modal style={{ margin: 0 }} isVisible={this.state.modalVisible}
              onBackButtonPress={() => this.modelCancel()}
              onBackdropPress={() => this.modelCancel()} >
              <View style={forms.filterModelContainer} >
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
                      <View style={{ height: 280, width: deviceWidth, backgroundColor: '#ffffff' }}>
                        <DateSelector
                          dateCancel={this.datepickerCancelClicked}
                          setDate={this.handleDate}
                        />
                      </View>
                    )}
                    {this.state.datepickerendOpen && (
                      <View style={{ height: 280, width: deviceWidth, backgroundColor: '#ffffff' }}>
                        <DateSelector
                          dateCancel={this.datepickerEndCancelClicked}
                          setDate={this.handleEndDate}
                        />
                      </View>
                    )}
                    <Text style={styles.headings}>{I18n.t("RT Status")}</Text>
                    <RnPicker
                      items={pickerData}
                      setValue={this.handleRTStatus}
                    />
                    <Text style={styles.headings}>{I18n.t("RT Number")}</Text>
                    <TextInput
                      mode='flat'
                      underlineColor='#efefef'
                      activeUnderlineColor='#efefef'
                      style={forms.input_fld}
                      underlineColorAndroid="transparent"
                      placeholder={I18n.t("RT Number")}
                      placeholderTextColor="#6F6F6F"
                      clearButtonMode='while-editing'
                      textAlignVertical="center"
                      autoCapitalize="none"
                      value={this.state.returnSlipNumber}
                      onChangeText={this.handleReturnSlipNumber}
                    />
                    <Text style={styles.headings}>{I18n.t("Barcode")}</Text>
                    <TextInput
                      underlineColor='#efefef'
                      activeUnderlineColor='#efefef'
                      style={forms.input_fld}
                      underlineColorAndroid="transparent"
                      placeholder={I18n.t("Barcode")}
                      placeholderTextColor="#6F6F6F"
                      textAlignVertical="center"
                      autoCapitalize="none"
                      value={this.state.barCode}
                      onChangeText={this.handleBarCode}
                    />
                    <View style={forms.action_buttons_container}>
                      <TouchableOpacity style={[forms.action_buttons, forms.submit_btn]}
                        onPress={() => this.applyGoodsReturn(this.state.pageNo)}>
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
    marginTop: Device.isTablet ? deviceheight - RH(550) : deviceheight - RH(500),
    height: Device.isTablet ? RH(550) : RH(480)
  },
  input: {
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 20,
    height: Device.isTablet ? 54 : 44,
    marginTop: 5,
    marginBottom: 10,
    borderColor: '#8F9EB717',
    borderRadius: 3,
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    fontFamily: 'regular',
    paddingLeft: 15,
    fontSize: Device.isTablet ? 20 : 14,
  },
  rnSelect_mobile: {
    color: '#8F9EB7',
    fontSize: 15
  },
  datePickerButton: {
    position: 'absolute',
    left: 20,
    top: 10,
    height: Device.isTablet ? 40 : 30,
    backgroundColor: "#ED1C24",
    borderRadius: 5,
  },
  datePickerButtonText: {
    textAlign: 'center',
    marginTop: 5,
    color: "#ffffff",
    fontSize: Device.isTablet ? 20 : 15,
    fontFamily: "regular"
  },
  datePickerEndButton: {
    position: 'absolute',
    right: 20,
    top: 10,
    height: Device.isTablet ? 40 : 30,
    backgroundColor: "#ED1C24",
    borderRadius: 5,
  },
  rnSelect_tablet: {
    color: '#8F9EB7',
    fontSize: 20
  },
  rnSelectContainer: {
    justifyContent: 'center',
    margin: 20,
    height: Device.isTablet ? 54 : 44,
    marginTop: 5,
    marginBottom: 10,
    borderColor: '#8F9EB717',
    borderRadius: 3,
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    fontFamily: 'regular',
    paddingLeft: 15,
    fontSize: Device.isTablet ? 20 : 15,
  },
  headings: {
    fontSize: Device.isTablet ? 20 : 15,
    marginLeft: 20,
    color: '#B4B7B8',
    marginTop: Device.isTablet ? 10 : 5,
    marginBottom: Device.isTablet ? 10 : 5,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  deleteButton: {
    width: Device.isTablet ? 50 : 30,
    height: Device.isTablet ? 50 : 30,
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5,
    borderWidth: 1,
    borderColor: "lightgray",
  }
});
